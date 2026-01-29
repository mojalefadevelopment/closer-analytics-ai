import { useState, useEffect, useCallback } from 'react'
import type { FathomConnection, FathomMeeting, FathomTranscript } from '../types/fathom'

const STORAGE_KEY = 'closer-analytics-fathom'
const FATHOM_AUTH_URL = 'https://fathom.video/oauth/authorize'

// These would be environment variables in production
const CLIENT_ID = import.meta.env.VITE_FATHOM_CLIENT_ID || ''
const REDIRECT_URI = import.meta.env.VITE_FATHOM_REDIRECT_URI || `${window.location.origin}/api/fathom/callback`

function loadConnection(): FathomConnection {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { connected: false }
    return JSON.parse(stored)
  } catch {
    return { connected: false }
  }
}

function saveConnection(connection: FathomConnection): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connection))
}

export function useFathom() {
  const [connection, setConnection] = useState<FathomConnection>({ connected: false })
  const [meetings, setMeetings] = useState<FathomMeeting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load connection on mount
  useEffect(() => {
    const loaded = loadConnection()
    setConnection(loaded)
  }, [])

  // Initiate OAuth flow
  const connect = useCallback(() => {
    if (!CLIENT_ID) {
      setError('Fathom OAuth niet geconfigureerd')
      return
    }

    const state = Math.random().toString(36).slice(2)
    sessionStorage.setItem('fathom-oauth-state', state)

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      state,
      scope: 'meetings:read recordings:read',
    })

    window.location.href = `${FATHOM_AUTH_URL}?${params.toString()}`
  }, [])

  // Handle OAuth callback (call this from callback page)
  const handleCallback = useCallback(async (code: string, state: string) => {
    const savedState = sessionStorage.getItem('fathom-oauth-state')
    if (state !== savedState) {
      setError('Invalid OAuth state')
      return false
    }
    sessionStorage.removeItem('fathom-oauth-state')

    setLoading(true)
    setError(null)

    try {
      // Exchange code for tokens via our backend
      const response = await fetch('/api/fathom/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Failed to exchange OAuth code')
      }

      const data = await response.json()

      const newConnection: FathomConnection = {
        connected: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        userEmail: data.email,
      }

      setConnection(newConnection)
      saveConnection(newConnection)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth error')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Disconnect Fathom
  const disconnect = useCallback(() => {
    const emptyConnection: FathomConnection = { connected: false }
    setConnection(emptyConnection)
    saveConnection(emptyConnection)
    setMeetings([])
  }, [])

  // Fetch meetings from Fathom
  const fetchMeetings = useCallback(async (daysBack = 30) => {
    if (!connection.accessToken) {
      setError('Niet verbonden met Fathom')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const createdAfter = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()

      const response = await fetch(`/api/fathom/meetings?created_after=${encodeURIComponent(createdAfter)}`, {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch meetings')
      }

      const data = await response.json()
      setMeetings(data.meetings || [])
      return data.meetings || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meetings')
      return []
    } finally {
      setLoading(false)
    }
  }, [connection.accessToken])

  // Fetch transcript for a specific meeting
  const fetchTranscript = useCallback(async (meetingId: string): Promise<FathomTranscript | null> => {
    if (!connection.accessToken) {
      setError('Niet verbonden met Fathom')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/fathom/transcript/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transcript')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript')
      return null
    } finally {
      setLoading(false)
    }
  }, [connection.accessToken])

  return {
    connection,
    meetings,
    loading,
    error,
    connect,
    disconnect,
    handleCallback,
    fetchMeetings,
    fetchTranscript,
  }
}
