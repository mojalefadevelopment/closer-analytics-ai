import { useMemo } from 'react'
import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import { Textarea } from '../ui/Textarea'
import { MIN_TRANSCRIPT_CHARS } from '../../lib/constants'
import { useLanguage } from '../../lib/i18n'
import type { ContextOptions } from './ContextSelector'

interface TranscriptStepProps {
  transcript: string
  onTranscriptChange: (value: string) => void
  context: ContextOptions
  onAnalyze: () => void
  loading: boolean
  error: string | null
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
  const { t } = useLanguage()
  const charCount = transcript.trim().length
  const isValid = charCount >= MIN_TRANSCRIPT_CHARS

  // Memoize context labels to avoid recreation on every render
  const contextLabels = useMemo(() => ({
    experience: {
      starter: t('context.experience.starter'),
      intermediate: t('context.experience.intermediate'),
      expert: t('context.experience.expert'),
    },
    focus: {
      bezwaren: t('context.focus.bezwaren'),
      afsluiting: t('context.focus.afsluiting'),
      rapport: t('context.focus.rapport'),
      algemeen: t('context.focus.algemeen'),
    },
    goal: {
      closes: t('context.goal.closes'),
      tickets: t('context.goal.tickets'),
      gesprekken: t('context.goal.gesprekken'),
    },
  }), [t])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid && !loading) {
      onAnalyze()
    }
  }

  return (
    <article className="grid gap-8 max-w-4xl mx-auto py-8">
      {/* Header */}
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('transcript.title')}
        </h2>
        <p className="text-gray-500">
          {t('transcript.subtitle')}
        </p>
      </header>

      {/* Context pills */}
      <div className="flex flex-wrap justify-center gap-2" role="list" aria-label="Selected context">
        {context.experience && (
          <Pill variant="primary">
            {contextLabels.experience[context.experience]}
          </Pill>
        )}
        {context.focus && (
          <Pill variant="primary">
            {contextLabels.focus[context.focus]}
          </Pill>
        )}
        {context.goal && (
          <Pill variant="primary">
            {contextLabels.goal[context.goal]}
          </Pill>
        )}
      </div>

      {/* Transcript input */}
      <form onSubmit={handleSubmit}>
        <LiquidCard variant="large">
          <div className="grid gap-4">
            {/* Character count */}
            <div className="flex justify-between items-center">
              <label htmlFor="transcript-input" className="text-sm text-gray-500">
                {t('transcript.label')}
              </label>
              <span
                className={`text-sm tabular-nums ${isValid ? 'text-success' : 'text-gray-400'}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {charCount.toLocaleString()} / {MIN_TRANSCRIPT_CHARS.toLocaleString()} {t('transcript.min')}
              </span>
            </div>

            {/* Textarea */}
            <Textarea
              id="transcript-input"
              name="transcript"
              value={transcript}
              onChange={(e) => onTranscriptChange(e.target.value)}
              placeholder={t('transcript.placeholder')}
              rows={12}
              disabled={loading}
              className="min-h-[280px]"
              aria-describedby={error ? 'transcript-error' : undefined}
              aria-invalid={error ? 'true' : undefined}
              required
              spellCheck="false"
            />

            {/* Error */}
            {error && (
              <div
                id="transcript-error"
                className="error-box"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
          </div>
        </LiquidCard>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button type="button" variant="ghost" onClick={prevStep} disabled={loading}>
            {t('nav.back')}
          </Button>
          <Button type="submit" disabled={!isValid} loading={loading}>
            {t('transcript.analyze')}
          </Button>
        </div>
      </form>
    </article>
  )
}
