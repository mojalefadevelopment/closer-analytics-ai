import { useState, useCallback } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Wizard, useWizard } from '../components/ui/Wizard'
import { WizardStep } from '../components/ui/WizardStep'
import { StepIndicator } from '../components/ui/StepIndicator'
import {
  WelcomeStep,
  ContextSelector,
  TranscriptStep,
  ResultsStep,
  type ContextOptions,
} from '../components/analysis'
import { useCoachingAnalysis } from '../hooks/useCoachingAnalysis'
import { useTranscriptHistory } from '../hooks/useTranscriptHistory'

const INITIAL_CONTEXT: ContextOptions = {
  experience: null,
  focus: null,
  goal: null,
}

function WizardContent() {
  const {
    transcript,
    setTranscript,
    analysis,
    loading,
    error,
    analyze,
    reset,
  } = useCoachingAnalysis()

  const { addEntry } = useTranscriptHistory()

  const { nextStep } = useWizard()

  const [context, setContext] = useState<ContextOptions>(INITIAL_CONTEXT)

  const handleAnalyze = useCallback(async () => {
    const result = await analyze(context)
    if (result) {
      // Save to history
      addEntry(transcript, context, result)
      nextStep()
    }
  }, [analyze, context, nextStep, addEntry, transcript])

  const handleReset = useCallback(() => {
    reset()
    setTranscript('')
    setContext(INITIAL_CONTEXT)
  }, [reset, setTranscript])

  const handleContextChange = useCallback((newContext: ContextOptions) => {
    setContext(newContext)
  }, [])

  const handleTranscriptChange = useCallback((value: string) => {
    setTranscript(value)
  }, [setTranscript])

  return (
    <>
      {/* Step 0: Welcome */}
      <WizardStep step={0}>
        <WelcomeStep />
      </WizardStep>

      {/* Step 1: Context Selection */}
      <WizardStep step={1}>
        <ContextSelector context={context} onContextChange={handleContextChange} />
      </WizardStep>

      {/* Step 2: Transcript Input */}
      <WizardStep step={2}>
        <TranscriptStep
          transcript={transcript}
          onTranscriptChange={handleTranscriptChange}
          context={context}
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />
      </WizardStep>

      {/* Step 3: Results */}
      <WizardStep step={3}>
        {analysis && <ResultsStep analysis={analysis} onReset={handleReset} />}
      </WizardStep>
    </>
  )
}

function WizardWithShell() {
  return (
    <Wizard totalSteps={4}>
      <WizardShellWrapper />
    </Wizard>
  )
}

function WizardShellWrapper() {
  return (
    <PageShell stepIndicator={<StepIndicator />}>
      <WizardContent />
    </PageShell>
  )
}

export default function CoachingAnalyze() {
  return <WizardWithShell />
}
