import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import { Textarea } from '../ui/Textarea'
import { MIN_TRANSCRIPT_CHARS } from '../../lib/constants'
import type { ContextOptions } from './ContextSelector'

interface TranscriptStepProps {
  transcript: string
  onTranscriptChange: (value: string) => void
  context: ContextOptions
  onAnalyze: () => void
  loading: boolean
  error: string | null
}

const contextLabels = {
  experience: {
    starter: 'Starter',
    intermediate: 'Intermediate',
    expert: 'Expert',
  },
  focus: {
    bezwaren: 'Bezwaren',
    afsluiting: 'Afsluiting',
    rapport: 'Rapport',
    algemeen: 'Algemeen',
  },
  goal: {
    closes: 'Meer closes',
    tickets: 'Hogere tickets',
    gesprekken: 'Betere gesprekken',
  },
}

export function TranscriptStep({
  transcript,
  onTranscriptChange,
  context,
  onAnalyze,
  loading,
  error,
}: TranscriptStepProps) {
  const { prevStep } = useWizard()
  const charCount = transcript.trim().length
  const isValid = charCount >= MIN_TRANSCRIPT_CHARS

  return (
    <div className="grid gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Plak je transcript
        </h2>
        <p className="text-slate-600">
          Kopieer en plak het transcript van je sales gesprek
        </p>
      </div>

      {/* Context pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {context.experience && (
          <Pill variant="accent">
            {contextLabels.experience[context.experience]}
          </Pill>
        )}
        {context.focus && (
          <Pill variant="accent">
            {contextLabels.focus[context.focus]}
          </Pill>
        )}
        {context.goal && (
          <Pill variant="accent">
            {contextLabels.goal[context.goal]}
          </Pill>
        )}
      </div>

      {/* Transcript input */}
      <LiquidCard variant="large">
        <div className="grid gap-4">
          {/* Character count */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Transcript invoer</span>
            <div
              className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                isValid
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white/70 text-slate-500 border border-slate-200'
              }`}
            >
              {charCount} / {MIN_TRANSCRIPT_CHARS}
            </div>
          </div>

          {/* Textarea */}
          <Textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Plak hier je coaching call transcript...

Voorbeeld:
Closer: Goedemiddag, hoe gaat het vandaag?
Prospect: Goed, dankjewel. Ik heb de informatie gelezen...
..."
            rows={12}
            disabled={loading}
            className="min-h-[300px]"
          />

          {/* Error */}
          {error && <div className="error-box">{error}</div>}
        </div>
      </LiquidCard>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={prevStep} disabled={loading}>
          ← Terug
        </Button>
        <Button onClick={onAnalyze} disabled={!isValid} loading={loading}>
          Analyseer →
        </Button>
      </div>
    </div>
  )
}
