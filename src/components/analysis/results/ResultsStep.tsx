import { useMemo, useEffect, useRef, useState, useCallback } from 'react'
import { useWizard } from '../../ui/Wizard'
import { LiquidCard } from '../../ui/LiquidCard'
import { Button } from '../../ui/Button'
import { useLanguage } from '../../../lib/i18n'
import { useMetrics } from '../../../lib/metrics'
import type { CoachingAnalysis, CategoryScore } from '../../../types/coaching'

interface ResultsStepProps {
  analysis: CoachingAnalysis
  onReset: () => void
}

const categoryIcons: Record<CategoryScore['category'], string> = {
  rapport: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  discovery: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  objections: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  closing: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
}

function getScoreGrade(score: number): { label: string; sublabel: string } {
  if (score >= 9) return { label: 'Excellent', sublabel: 'Top prestatie' }
  if (score >= 8) return { label: 'Sterk', sublabel: 'Boven gemiddeld' }
  if (score >= 6) return { label: 'Goed', sublabel: 'Ruimte voor groei' }
  if (score >= 4) return { label: 'Matig', sublabel: 'Focus nodig' }
  return { label: 'Zwak', sublabel: 'Prioriteit' }
}

export function ResultsStep({ analysis, onReset }: ResultsStepProps) {
  const { goToStep } = useWizard()
  const { t } = useLanguage()
  const { recordAnalysis } = useMetrics()
  const hasRecorded = useRef(false)

  const [showContent, setShowContent] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [displayCategoryScores, setDisplayCategoryScores] = useState<number[]>([])
  const [expandedAction, setExpandedAction] = useState<number | null>(null)
  const [expandedObservation, setExpandedObservation] = useState<number | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)

  const actionPoints = useMemo(() => analysis.actionPoints.slice(0, 5), [analysis.actionPoints])
  const observations = useMemo(() => analysis.observations.slice(0, 4), [analysis.observations])

  const score = useMemo(() => {
    if (!analysis.scores || analysis.scores.length === 0) {
      const base = 65
      const bonus = Math.max(0, 3 - analysis.actionPoints.length) * 10
      return Math.min(95, base + bonus)
    }
    const avg = analysis.scores.reduce((sum, s) => sum + s.score, 0) / analysis.scores.length
    return Math.round(avg * 10)
  }, [analysis.scores, analysis.actionPoints.length])

  const scoreGrade = useMemo(() => getScoreGrade(score / 10), [score])

  // Animation triggers
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showContent) return
    const duration = 1200
    const steps = 25
    const increment = score / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [showContent, score])

  useEffect(() => {
    if (!showContent || !analysis.scores) return
    const duration = 1000
    const steps = 20
    const targetScores = analysis.scores.map(s => s.score)
    const increments = targetScores.map(s => s / steps)
    const currentScores = new Array(targetScores.length).fill(0)
    const timer = setInterval(() => {
      let allDone = true
      const newScores = currentScores.map((current, i) => {
        const next = current + increments[i]
        if (next >= targetScores[i]) return targetScores[i]
        allDone = false
        currentScores[i] = next
        return Math.floor(next)
      })
      setDisplayCategoryScores(newScores)
      if (allDone) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [showContent, analysis.scores])

  useEffect(() => {
    if (!hasRecorded.current) {
      recordAnalysis(score, analysis.actionPoints.length)
      hasRecorded.current = true
    }
  }, [score, analysis.actionPoints.length, recordAnalysis])

  const handleNewAnalysis = useCallback(() => {
    onReset()
    goToStep(0)
  }, [onReset, goToStep])

  const toggleAction = useCallback((index: number) => {
    setExpandedAction(prev => prev === index ? null : index)
  }, [])

  const toggleObservation = useCallback((index: number) => {
    setExpandedObservation(prev => prev === index ? null : index)
  }, [])

  const toggleCategory = useCallback((index: number) => {
    setExpandedCategory(prev => prev === index ? null : index)
  }, [])

  return (
    <article className={`max-w-6xl mx-auto py-12 px-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1fr,360px] gap-12">
        {/* Main Content Column */}
        <div className="space-y-10 order-2 lg:order-1">

          {/* Priority Card - Premium Style */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-900 via-gray-700 to-gray-400 rounded-full" />
            <div className="pl-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
                  Belangrijkste Prioriteit
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                {analysis.priority.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {analysis.priority.explanation}
              </p>
              {analysis.priority.immediateAction && (
                <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium text-gray-900">Direct toepassen: </span>
                      {analysis.priority.immediateAction}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />

          {/* Action Points - Premium Cards */}
          <section aria-label={t('results.actionPoints')}>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
                {t('results.actionPoints')}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              <span className="text-xs text-gray-400">{actionPoints.length} punten</span>
            </div>

            <div className="space-y-4">
              {actionPoints.map((action, i) => {
                const isExpanded = expandedAction === i
                return (
                  <div
                    key={`action-${i}`}
                    className={`group relative bg-white border rounded-2xl transition-all duration-300 cursor-pointer
                      ${isExpanded
                        ? 'border-gray-300 shadow-lg shadow-gray-100'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md hover:shadow-gray-50'
                      }`}
                    onClick={() => toggleAction(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleAction(i)}
                    aria-expanded={isExpanded}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200
                          ${isExpanded ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                          <span className="text-sm font-semibold">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="font-semibold text-gray-900 leading-snug">{action.action}</h4>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {/* Preview when collapsed */}
                          {!isExpanded && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-1">{action.why}</p>
                          )}

                          {/* Expanded content */}
                          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                              <p className="text-sm text-gray-600 leading-relaxed">{action.why}</p>
                              {action.example && (
                                <div className="p-3 bg-gray-50 rounded-xl">
                                  <p className="text-xs font-medium text-gray-500 mb-1.5">Voorbeeld</p>
                                  <p className="text-sm text-gray-700 italic">"{action.example}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />

          {/* Observations - Minimal Style */}
          <section aria-label={t('results.observations')}>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
                {t('results.observations')}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            <div className="space-y-3">
              {observations.map((obs, i) => {
                const isExpanded = expandedObservation === i
                return (
                  <div
                    key={`obs-${i}`}
                    className={`group relative bg-white border rounded-xl transition-all duration-300 cursor-pointer
                      ${isExpanded
                        ? 'border-gray-300 shadow-md'
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                    onClick={() => toggleObservation(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleObservation(i)}
                    aria-expanded={isExpanded}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200
                          ${isExpanded ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <span className="text-xs font-medium">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-gray-800 text-sm leading-relaxed">{obs.insight}</p>
                            {obs.quote && (
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>

                          {obs.quote && (
                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                              <blockquote className="pl-3 py-2 border-l-2 border-gray-300 bg-gray-50 rounded-r-lg text-sm text-gray-600 italic">
                                "{obs.quote}"
                              </blockquote>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Actions */}
          <nav className="flex gap-4 pt-6" aria-label="Analysis actions">
            <Button variant="outline" onClick={handleNewAnalysis}>
              {t('results.newAnalysis')}
            </Button>
            <Button onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              {t('results.share')}
            </Button>
          </nav>
        </div>

        {/* Sidebar Column - Premium Score Display */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start space-y-6">

          {/* Overall Score Card - Premium */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-center shadow-2xl shadow-gray-900/20">
            <div className="relative inline-flex items-center justify-center w-28 h-28 mb-4">
              {/* Circular progress background */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(displayScore / 100) * 264} 264`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-5xl font-bold text-white tabular-nums tracking-tight">{displayScore}</span>
            </div>
            <div className="text-lg font-semibold text-white mb-1">{scoreGrade.label}</div>
            <div className="text-sm text-gray-400">{scoreGrade.sublabel}</div>
          </div>

          {/* Category Scores - Minimal */}
          {analysis.scores && analysis.scores.length > 0 && (
            <LiquidCard className="!p-0 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">
                  {t('results.scores')}
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {analysis.scores.map((categoryScore, i) => {
                  const isExpanded = expandedCategory === i
                  const displayValue = displayCategoryScores[i] ?? 0
                  const percentage = (displayValue / 10) * 100

                  return (
                    <div
                      key={categoryScore.category}
                      className={`p-4 cursor-pointer transition-all duration-200 ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
                      onClick={() => toggleCategory(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && toggleCategory(i)}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryIcons[categoryScore.category]} />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800">
                              {t(`results.category.${categoryScore.category}`)}
                            </span>
                            <span className="text-sm font-bold text-gray-900 tabular-nums">{displayValue}</span>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900 rounded-full transition-all duration-700"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-24 mt-3' : 'max-h-0'}`}>
                        <p className="text-xs text-gray-600 leading-relaxed pl-14">{categoryScore.feedback}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </LiquidCard>
          )}

          {/* Quick tip */}
          <div className="p-4 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-medium text-gray-700">Tip:</span> Klik op een score voor gedetailleerde feedback per categorie.
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}
