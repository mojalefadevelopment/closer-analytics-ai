import { useState } from 'react'
import type { CoachingAnalysis } from '../types/coaching'
import { MIN_TRANSCRIPT_CHARS } from '../lib/constants'

export interface AnalysisContext {
  experience: 'starter' | 'intermediate' | 'expert' | null
  focus: 'bezwaren' | 'afsluiting' | 'rapport' | 'algemeen' | null
  goal: 'closes' | 'tickets' | 'gesprekken' | null
}

export function useCoachingAnalysis() {
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState<CoachingAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze(context?: AnalysisContext): Promise<CoachingAnalysis | null> {
    const trimmedTranscript = transcript.trim()

    if (trimmedTranscript.length < MIN_TRANSCRIPT_CHARS) {
      setError(`Plak een langer transcript (min ${MIN_TRANSCRIPT_CHARS} karakters).`)
      return null
    }

    setLoading(true)
    setError(null)

    try {
      console.log('[API] Sending analysis request...', { transcriptLength: trimmedTranscript.length, context })

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: trimmedTranscript, context }),
      })

      console.log('[API] Response status:', response.status, response.statusText)

      const text = await response.text()
      console.log('[API] Response text length:', text.length)

      if (!text) {
        throw new Error('Empty response from API')
      }

      let data: CoachingAnalysis
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error('[API] JSON parse error. Raw response:', text.slice(0, 500))
        throw new Error('Invalid JSON response from API')
      }

      if (!response.ok) {
        console.error('[API] Error response:', data)
        // Use the user-friendly error from API if available
        const errorMsg = (data as unknown as { error?: string }).error || 'Analyse mislukt'
        throw new Error(errorMsg)
      }

      console.log('[API] Analysis complete:', data)
      setAnalysis(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analyse mislukt. Probeer opnieuw.'
      setError(message)
      console.error('[API] Analysis error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setAnalysis(null)
    setError(null)
  }

  return {
    transcript,
    setTranscript,
    analysis,
    loading,
    error,
    analyze,
    reset,
  }
}
