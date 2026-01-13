import { useState } from 'react'
import type { CoachingAnalysis } from '../types/coaching'
import { mockAnalysis } from '../mocks/analysisResponse'
import { MIN_TRANSCRIPT_CHARS } from '../lib/constants'

export function useCoachingAnalysis() {
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState<CoachingAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyze() {
    const trimmedTranscript = transcript.trim()

    if (trimmedTranscript.length < MIN_TRANSCRIPT_CHARS) {
      setError(`Plak een langer transcript (min ${MIN_TRANSCRIPT_CHARS} karakters).`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Phase 1: Mock response with simulated delay
      // Phase 2: Replace with Supabase function call
      await new Promise((resolve) => setTimeout(resolve, 900))
      setAnalysis(mockAnalysis)
    } catch (err) {
      setError('Analyse mislukt. Probeer opnieuw.')
      console.error(err)
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
