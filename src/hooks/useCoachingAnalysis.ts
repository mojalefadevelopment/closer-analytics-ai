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

  async function analyze(context?: AnalysisContext): Promise<boolean> {
    const trimmedTranscript = transcript.trim()

    if (trimmedTranscript.length < MIN_TRANSCRIPT_CHARS) {
      setError(`Plak een langer transcript (min ${MIN_TRANSCRIPT_CHARS} karakters).`)
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: trimmedTranscript, context }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analyse mislukt')
      }

      setAnalysis(data)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analyse mislukt. Probeer opnieuw.'
      setError(message)
      console.error('Analysis error:', err)
      return false
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
