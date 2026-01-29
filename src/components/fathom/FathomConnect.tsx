import { useState, useCallback } from 'react'
import { useFathom } from '../../hooks/useFathom'
import { useUserTier } from '../../hooks/useUserTier'
import { useLanguage } from '../../lib/i18n'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import type { FathomMeeting } from '../../types/fathom'

interface FathomConnectProps {
  onSelectTranscript?: (transcript: string) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const hrs = Math.floor(mins / 60)
  if (hrs > 0) {
    return `${hrs}u ${mins % 60}m`
  }
  return `${mins}m`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function FathomConnect({ onSelectTranscript }: FathomConnectProps) {
  const {
    connection,
    meetings,
    loading,
    error,
    connect,
    disconnect,
    fetchMeetings,
    fetchTranscript,
  } = useFathom()

  const { isPro, upgradeToPro } = useUserTier()
  const { t } = useLanguage()
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null)
  const [loadingTranscript, setLoadingTranscript] = useState(false)

  // Show upgrade prompt for free users
  if (!isPro) {
    return (
      <LiquidCard className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
          PRO
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('fathom.proTitle')}
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          {t('fathom.proDesc')}
        </p>
        <Button onClick={upgradeToPro}>
          {t('fathom.upgrade')}
        </Button>
      </LiquidCard>
    )
  }

  const handleConnect = useCallback(() => {
    connect()
  }, [connect])

  const handleDisconnect = useCallback(() => {
    disconnect()
    setSelectedMeeting(null)
  }, [disconnect])

  const handleLoadMeetings = useCallback(async () => {
    await fetchMeetings(30) // Last 30 days
  }, [fetchMeetings])

  const handleSelectMeeting = useCallback(async (meeting: FathomMeeting) => {
    setSelectedMeeting(meeting.id)
    setLoadingTranscript(true)

    try {
      const transcript = await fetchTranscript(meeting.id)
      if (transcript?.text && onSelectTranscript) {
        onSelectTranscript(transcript.text)
      }
    } finally {
      setLoadingTranscript(false)
    }
  }, [fetchTranscript, onSelectTranscript])

  // Not connected state
  if (!connection.connected) {
    return (
      <LiquidCard className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('fathom.connectTitle')}
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          {t('fathom.connectDesc')}
        </p>
        <Button onClick={handleConnect} disabled={loading}>
          {loading ? t('fathom.connecting') : t('fathom.connect')}
        </Button>
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </LiquidCard>
    )
  }

  // Connected state
  return (
    <LiquidCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('fathom.connected')}</p>
            {connection.userEmail && (
              <p className="text-sm text-gray-500">{connection.userEmail}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" onClick={handleDisconnect} className="text-sm">
          {t('fathom.disconnect')}
        </Button>
      </div>

      {/* Load meetings button */}
      {meetings.length === 0 && (
        <Button
          onClick={handleLoadMeetings}
          disabled={loading}
          variant="outline"
          className="w-full mb-4"
        >
          {loading ? t('fathom.loadingMeetings') : t('fathom.loadMeetings')}
        </Button>
      )}

      {/* Meetings list */}
      {meetings.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-2">
            {t('fathom.selectMeeting')}
          </p>
          {meetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => handleSelectMeeting(meeting)}
              disabled={loadingTranscript}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                selectedMeeting === meeting.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900 truncate">
                {meeting.title || t('fathom.untitledMeeting')}
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span>{formatDate(meeting.created_at)}</span>
                {meeting.duration_seconds > 0 && (
                  <>
                    <span aria-hidden="true">-</span>
                    <span>{formatDuration(meeting.duration_seconds)}</span>
                  </>
                )}
              </div>
              {selectedMeeting === meeting.id && loadingTranscript && (
                <p className="text-sm text-primary mt-2">
                  {t('fathom.loadingTranscript')}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}
    </LiquidCard>
  )
}
