import { useState } from 'react'
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
} from '../components/wizard'
import { useCoachingAnalysis } from '../hooks/useCoachingAnalysis'

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

  const { nextStep } = useWizard()

  const [context, setContext] = useState<ContextOptions>({
    experience: null,
    focus: null,
    goal: null,
  })

  async function handleAnalyze() {
    const success = await analyze()
    if (success) {
      nextStep()
    }
  }

  function handleReset() {
    reset()
    setTranscript('')
    setContext({ experience: null, focus: null, goal: null })
  }

  return (
    <div className="grid gap-8">
      {/* Step Indicator */}
      <StepIndicator />

      {/* Step 0: Welcome */}
      <WizardStep step={0}>
        <WelcomeStep />
      </WizardStep>

      {/* Step 1: Context Selection */}
      <WizardStep step={1}>
        <ContextSelector context={context} onContextChange={setContext} />
      </WizardStep>

      {/* Step 2: Transcript Input */}
      <WizardStep step={2}>
        <TranscriptStep
          transcript={transcript}
          onTranscriptChange={setTranscript}
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
    </div>
  )
}

export default function CoachingAnalyze() {
  return (
    <PageShell>
      {/* Background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <Wizard totalSteps={4}>
        <WizardContent />
      </Wizard>
    </PageShell>
  )
}
