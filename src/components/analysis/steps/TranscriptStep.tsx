import { useMemo, useState, useCallback } from 'react'
import { useWizard } from '../../ui/Wizard'
import { LiquidCard } from '../../ui/LiquidCard'
import { Button } from '../../ui/Button'
import { Pill } from '../../ui/Pill'
import { Textarea } from '../../ui/Textarea'
import { FathomConnect } from '../../fathom'
import { MIN_TRANSCRIPT_CHARS, MAX_TRANSCRIPT_CHARS } from '../../../lib/constants'
import { useLanguage } from '../../../lib/i18n'
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
  const [showFathomImport, setShowFathomImport] = useState(false)

  const charCount = transcript.trim().length
  const isValid = charCount >= MIN_TRANSCRIPT_CHARS
  const isTooLong = charCount > MAX_TRANSCRIPT_CHARS

  const handleFathomTranscript = useCallback((fathomTranscript: string) => {
    onTranscriptChange(fathomTranscript)
    setShowFathomImport(false)
  }, [onTranscriptChange])

  const toggleFathomImport = useCallback(() => {
    setShowFathomImport(prev => !prev)
  }, [])

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
    if (isValid && !isTooLong && !loading) {
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

      {/* Fathom import option */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={toggleFathomImport}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          aria-expanded={showFathomImport}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('fathom.connectTitle')}</p>
              <p className="text-sm text-gray-500">{t('fathom.connectDesc')}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${showFathomImport ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showFathomImport && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <FathomConnect onSelectTranscript={handleFathomTranscript} />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">{t('transcript.orPaste')}</span>
        <div className="flex-1 h-px bg-gray-200" />
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
                className={`text-sm tabular-nums flex items-center gap-1.5 ${
                  isTooLong ? 'text-red-500' : isValid ? 'text-success' : 'text-gray-400'
                }`}
                aria-live="polite"
                aria-atomic="true"
              >
                {isTooLong ? (
                  <>
                    {charCount.toLocaleString()} / {MAX_TRANSCRIPT_CHARS.toLocaleString()} {t('transcript.chars')}
                    <span className="text-red-500 text-xs ml-1">(te lang)</span>
                  </>
                ) : isValid ? (
                  <>
                    {charCount.toLocaleString()} {t('transcript.chars')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    {charCount.toLocaleString()} / {MIN_TRANSCRIPT_CHARS.toLocaleString()} {t('transcript.chars')}
                  </>
                )}
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
          <Button type="submit" disabled={!isValid || isTooLong} loading={loading}>
            {t('transcript.analyze')}
          </Button>
        </div>
      </form>
    </article>
  )
}
