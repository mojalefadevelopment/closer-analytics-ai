import { useMemo, useEffect, useRef } from 'react'
import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import { useLanguage } from '../../lib/i18n'
import { useMetrics } from '../../lib/metrics'
import type { CoachingAnalysis } from '../../types/coaching'

interface ResultsStepProps {
  analysis: CoachingAnalysis
  onReset: () => void
}

const actionColors = [
  { bg: 'bg-primary-light', text: 'text-primary', iconBg: 'bg-primary' },
  { bg: 'bg-success-light', text: 'text-success', iconBg: 'bg-success' },
  { bg: 'bg-warning-light', text: 'text-warning', iconBg: 'bg-warning' },
]

export function ResultsStep({ analysis, onReset }: ResultsStepProps) {
  const { goToStep } = useWizard()
  const { t } = useLanguage()
  const { recordAnalysis } = useMetrics()
  const hasRecorded = useRef(false)

  // Memoize sliced arrays to prevent recreation on each render
  const actionPoints = useMemo(
    () => analysis.actionPoints.slice(0, 3),
    [analysis.actionPoints]
  )

  const observations = useMemo(
    () => analysis.observations.slice(0, 3),
    [analysis.observations]
  )

  // Calculate score based on action points (fewer = better performance)
  const score = useMemo(() => {
    const base = 65
    const bonus = Math.max(0, 3 - analysis.actionPoints.length) * 10
    return Math.min(95, base + bonus)
  }, [analysis.actionPoints.length])

  // Record analysis metrics once when component mounts
  useEffect(() => {
    if (!hasRecorded.current) {
      recordAnalysis(score, analysis.actionPoints.length)
      hasRecorded.current = true
    }
  }, [score, analysis.actionPoints.length, recordAnalysis])

  function handleNewAnalysis() {
    onReset()
    goToStep(0)
  }

  return (
    <article className="grid gap-8 max-w-5xl mx-auto py-8 px-4">
      {/* Header with Score */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t('results.title')}
          </h2>
          <p className="text-gray-500">
            {t('results.subtitle')}
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center">
            <span className="text-xl font-bold text-success">{score}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{t('results.score')}</div>
            <div className="text-xs text-gray-400">Performance</div>
          </div>
        </div>
      </header>

      {/* Priority Card */}
      <section aria-labelledby="priority-title">
        <LiquidCard className="border-l-4 border-l-primary">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Pill variant="primary">{t('results.priority')}</Pill>
            </div>

            <h3 id="priority-title" className="text-xl font-bold text-gray-800">
              {analysis.priority.title}
            </h3>

            <p className="text-gray-500 leading-relaxed">
              {analysis.priority.explanation}
            </p>
          </div>
        </LiquidCard>
      </section>

      {/* Action Points */}
      <section aria-label={t('results.actionPoints')}>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t('results.actionPoints')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionPoints.map((action, i) => {
            const color = actionColors[i % actionColors.length]
            return (
              <LiquidCard
                key={`action-${action.action.slice(0, 20)}`}
                className="h-full"
              >
                <div className="flex flex-col h-full gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${color.iconBg} flex items-center justify-center`}>
                      <span className="text-white font-semibold text-sm">{i + 1}</span>
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wide ${color.text}`}>
                      {t('results.action')} {i + 1}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-800">
                    {action.action}
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {action.why}
                  </p>
                </div>
              </LiquidCard>
            )
          })}
        </div>
      </section>

      {/* Observations */}
      <section aria-label={t('results.observations')}>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t('results.observations')}
        </h3>
        <div className="grid gap-4">
          {observations.map((obs, i) => (
            <LiquidCard key={`obs-${obs.insight.slice(0, 20)}`}>
              <div className="flex gap-4">
                {/* Number indicator */}
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">{i + 1}</span>
                </div>

                <div className="flex-1 grid gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {t('results.observation')} {i + 1}
                  </span>

                  <p className="text-gray-800 leading-relaxed">
                    {obs.insight}
                  </p>

                  {obs.quote && (
                    <blockquote className="pl-4 py-2 border-l-2 border-gray-200 bg-gray-50 rounded-r-lg">
                      <p className="text-sm text-gray-500 italic">
                        "{obs.quote}"
                      </p>
                    </blockquote>
                  )}
                </div>
              </div>
            </LiquidCard>
          ))}
        </div>
      </section>

      {/* Actions */}
      <nav className="flex justify-center gap-3 pt-6" aria-label="Analysis actions">
        <Button variant="outline" onClick={handleNewAnalysis}>
          {t('results.newAnalysis')}
        </Button>
        <Button onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          {t('results.share')}
        </Button>
      </nav>
    </article>
  )
}
