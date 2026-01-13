import { PageShell } from '../components/layout/PageShell'
import { Hero } from '../components/layout/Hero'
import { TranscriptInput } from '../components/coaching/TranscriptInput'
import { AnalysisOutput } from '../components/coaching/AnalysisOutput'
import { useCoachingAnalysis } from '../hooks/useCoachingAnalysis'

export default function CoachingAnalyze() {
  const {
    transcript,
    setTranscript,
    analysis,
    loading,
    error,
    analyze,
  } = useCoachingAnalysis()

  return (
    <PageShell>
      <Hero />

      <TranscriptInput
        transcript={transcript}
        onTranscriptChange={setTranscript}
        onAnalyze={analyze}
        loading={loading}
        error={error}
      />

      {analysis && <AnalysisOutput analysis={analysis} />}
    </PageShell>
  )
}
