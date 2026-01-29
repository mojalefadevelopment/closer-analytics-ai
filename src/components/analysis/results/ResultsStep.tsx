import { useMemo, useEffect, useRef, useState, useCallback } from 'react'
import { useWizard } from '../../ui/Wizard'
import { LiquidCard } from '../../ui/LiquidCard'
import { Button } from '../../ui/Button'
import { Pill } from '../../ui/Pill'
import { useLanguage } from '../../../lib/i18n'
import { useMetrics } from '../../../lib/metrics'
import type { CoachingAnalysis, CategoryScore } from '../../../types/coaching'

interface ResultsStepProps {
  analysis: CoachingAnalysis
  onReset: () => void
}

const actionColors = [
  { bg: 'bg-primary-light', text: 'text-primary', iconBg: 'bg-primary', border: 'border-primary' },
  { bg: 'bg-success-light', text: 'text-success', iconBg: 'bg-success', border: 'border-success' },
  { bg: 'bg-warning-light', text: 'text-warning', iconBg: 'bg-warning', border: 'border-warning' },
]

const categoryIcons: Record<CategoryScore['category'], string> = {
  rapport: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  discovery: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  objections: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  closing: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
}

function getScoreColor(score: number): { bg: string; text: string; ring: string } {
  if (score >= 8) return { bg: 'bg-success-light', text: 'text-success', ring: 'ring-success' }
  if (score >= 6) return { bg: 'bg-primary-light', text: 'text-primary', ring: 'ring-primary' }
  if (score >= 4) return { bg: 'bg-warning-light', text: 'text-warning', ring: 'ring-warning' }
  return { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-400' }
}

export function ResultsStep({ analysis, onReset }: ResultsStepProps) {
  const { goToStep } = useWizard()
  const { t } = useLanguage()
  const { recordAnalysis } = useMetrics()
  const hasRecorded = useRef(false)

  // Animation states
  const [showHeader, setShowHeader] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const [showPriority, setShowPriority] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [showObservations, setShowObservations] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [displayCategoryScores, setDisplayCategoryScores] = useState<number[]>([])

  // Interactive states
  const [expandedAction, setExpandedAction] = useState<number | null>(null)
  const [expandedObservation, setExpandedObservation] = useState<number | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)

  // Memoize sliced arrays to prevent recreation on each render
  const actionPoints = useMemo(
    () => analysis.actionPoints.slice(0, 3),
    [analysis.actionPoints]
  )

  const observations = useMemo(
    () => analysis.observations.slice(0, 3),
    [analysis.observations]
  )

  // Calculate overall score from category scores
  const score = useMemo(() => {
    if (!analysis.scores || analysis.scores.length === 0) {
      // Fallback calculation
      const base = 65
      const bonus = Math.max(0, 3 - analysis.actionPoints.length) * 10
      return Math.min(95, base + bonus)
    }
    const avg = analysis.scores.reduce((sum, s) => sum + s.score, 0) / analysis.scores.length
    return Math.round(avg * 10) // Convert 1-10 to 10-100
  }, [analysis.scores, analysis.actionPoints.length])

  // Staggered reveal animation
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setShowHeader(true), 100))
    timers.push(setTimeout(() => setShowScores(true), 400))
    timers.push(setTimeout(() => setShowPriority(true), 900))
    timers.push(setTimeout(() => setShowActions(true), 1300))
    timers.push(setTimeout(() => setShowObservations(true), 1700))

    return () => timers.forEach(clearTimeout)
  }, [])

  // Score count-up animation
  useEffect(() => {
    if (!showHeader) return

    const duration = 1500
    const steps = 30
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
  }, [showHeader, score])

  // Category scores count-up animation
  useEffect(() => {
    if (!showScores || !analysis.scores) return

    const duration = 1200
    const steps = 20
    const targetScores = analysis.scores.map(s => s.score)
    const increments = targetScores.map(s => s / steps)
    const currentScores = new Array(targetScores.length).fill(0)

    const timer = setInterval(() => {
      let allDone = true
      const newScores = currentScores.map((current, i) => {
        const next = current + increments[i]
        if (next >= targetScores[i]) {
          return targetScores[i]
        }
        allDone = false
        currentScores[i] = next
        return Math.floor(next)
      })
      setDisplayCategoryScores(newScores)
      if (allDone) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [showScores, analysis.scores])

  // Record analysis metrics once when component mounts
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
    <article className="grid gap-8 max-w-5xl mx-auto py-8 px-4">
      {/* Header with Score - Animated */}
      <header
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-500 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t('results.title')}
          </h2>
          <p className="text-gray-500">
            {t('results.subtitle')}
          </p>
        </div>

        {/* Animated Score Badge */}
        <div className={`flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200 transition-all duration-300 ${
          showHeader ? 'animate-pulse-glow' : ''
        }`}>
          <div className="w-14 h-14 rounded-xl bg-success-light flex items-center justify-center overflow-hidden">
            <span className="text-2xl font-bold text-success tabular-nums">
              {displayScore}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{t('results.score')}</div>
            <div className="text-xs text-gray-400">{t('results.performance')}</div>
          </div>
        </div>
      </header>

      {/* Category Scores - Animated */}
      {analysis.scores && analysis.scores.length > 0 && (
        <section
          aria-label={t('results.scores')}
          className={`transition-all duration-500 ${
            showScores ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {t('results.scores')}
            </h3>
            <span className="text-xs text-gray-400">{t('results.scoresSubtitle')}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analysis.scores.map((categoryScore, i) => {
              const colors = getScoreColor(categoryScore.score)
              const isExpanded = expandedCategory === i
              const displayValue = displayCategoryScores[i] ?? 0
              const delay = i * 100

              return (
                <div
                  key={categoryScore.category}
                  className={`transition-all duration-300 ${showScores ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <LiquidCard
                    className={`cursor-pointer transition-all duration-300 ${
                      isExpanded ? `ring-2 ${colors.ring}` : ''
                    }`}
                    onClick={() => toggleCategory(i)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Score circle and label */}
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <span className={`text-xl font-bold ${colors.text} tabular-nums`}>
                            {displayValue}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${colors.text} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={categoryIcons[categoryScore.category]} />
                            </svg>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {t(`results.category.${categoryScore.category}`)}
                            </span>
                          </div>
                        </div>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Expandable feedback */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-sm text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                          {categoryScore.feedback}
                        </p>
                      </div>
                    </div>
                  </LiquidCard>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Priority Card - Animated */}
      <section
        aria-labelledby="priority-title"
        className={`transition-all duration-500 ${
          showPriority ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <LiquidCard className="border-l-4 border-l-primary relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <Pill variant="primary">{t('results.priority')}</Pill>
                  <p className="text-xs text-gray-400 mt-1">{t('results.prioritySubtitle')}</p>
                </div>
              </div>
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

      {/* Action Points - Animated & Interactive */}
      <section
        aria-label={t('results.actionPoints')}
        className={`transition-all duration-500 ${
          showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {t('results.actionPoints')}
          </h3>
          <span className="text-xs text-gray-400">{t('results.actionExpand')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionPoints.map((action, i) => {
            const color = actionColors[i % actionColors.length]
            const isExpanded = expandedAction === i
            const delay = i * 100

            return (
              <div
                key={`action-${action.action.slice(0, 20)}`}
                className={`transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <LiquidCard
                  className={`h-full cursor-pointer transition-all duration-300 ${
                    isExpanded ? `border-2 ${color.border}` : ''
                  }`}
                  onClick={() => toggleAction(i)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${color.iconBg} flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">{i + 1}</span>
                        </div>
                        <span className={`text-xs font-medium uppercase tracking-wide ${color.text}`}>
                          {t('results.action')} {i + 1}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    <h4 className="font-semibold text-gray-800">
                      {action.action}
                    </h4>

                    {/* Expandable why section */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className={`pt-3 border-t ${color.border} border-opacity-30`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${color.text} mb-2`}>
                          {t('results.actionWhy')}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {action.why}
                        </p>
                      </div>
                    </div>

                    {/* Preview of why when collapsed */}
                    {!isExpanded && (
                      <p className="text-sm text-gray-400 line-clamp-2 flex-1">
                        {action.why}
                      </p>
                    )}
                  </div>
                </LiquidCard>
              </div>
            )
          })}
        </div>
      </section>

      {/* Observations - Animated & Interactive */}
      <section
        aria-label={t('results.observations')}
        className={`transition-all duration-500 ${
          showObservations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          {t('results.observations')}
        </h3>
        <div className="grid gap-4">
          {observations.map((obs, i) => {
            const isExpanded = expandedObservation === i
            const delay = i * 100

            return (
              <div
                key={`obs-${obs.insight.slice(0, 20)}`}
                className={`transition-all duration-300 ${showObservations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <LiquidCard
                  className={`cursor-pointer transition-all duration-300 ${
                    isExpanded ? 'border-2 border-gray-300' : ''
                  }`}
                  onClick={() => toggleObservation(i)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex gap-4">
                    {/* Number indicator */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      isExpanded ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-sm font-medium">{i + 1}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            {t('results.observation')} {i + 1}
                          </span>

                          <p className="text-gray-800 leading-relaxed mt-2">
                            {obs.insight}
                          </p>
                        </div>

                        {obs.quote && (
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>

                      {/* Expandable quote section */}
                      {obs.quote && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isExpanded ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                            {t('results.observationQuote')}
                          </p>
                          <blockquote className="pl-4 py-3 border-l-2 border-primary bg-primary-light/30 rounded-r-lg">
                            <p className="text-sm text-gray-600 italic">
                              "{obs.quote}"
                            </p>
                          </blockquote>
                        </div>
                      )}
                    </div>
                  </div>
                </LiquidCard>
              </div>
            )
          })}
        </div>
      </section>

      {/* Actions - Animated */}
      <nav
        className={`flex justify-center gap-3 pt-6 transition-all duration-500 ${
          showObservations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '300ms' }}
        aria-label="Analysis actions"
      >
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
