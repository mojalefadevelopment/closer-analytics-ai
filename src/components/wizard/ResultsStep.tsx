import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import type { CoachingAnalysis } from '../../types/coaching'

interface ResultsStepProps {
  analysis: CoachingAnalysis
  onReset: () => void
}

export function ResultsStep({ analysis, onReset }: ResultsStepProps) {
  const { goToStep } = useWizard()

  function handleNewAnalysis() {
    onReset()
    goToStep(0)
  }

  return (
    <div className="grid gap-8 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Analyse Resultaat
          </h2>
          <p className="text-slate-600">
            Jouw persoonlijke coaching feedback
          </p>
        </div>
        <Pill variant="accent">AI Coaching</Pill>
      </div>

      {/* Bento Grid Layout */}
      <div className="bento-grid stagger-children is-visible">
        {/* Priority Card - Large */}
        <LiquidCard variant="large" className="bento-item-large">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">#1</span>
              </div>
              <Pill variant="subtle">Prioriteit</Pill>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              {analysis.priority.title}
            </h3>
            <p className="text-slate-600 leading-relaxed flex-1">
              {analysis.priority.explanation}
            </p>
          </div>
        </LiquidCard>

        {/* Action Points */}
        {analysis.actionPoints.slice(0, 3).map((action, i) => (
          <LiquidCard key={i} className={i === 0 ? 'bento-item-tall' : ''}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{i + 1}</span>
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                  Actie
                </span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">
                {action.action}
              </h4>
              <p className="text-sm text-slate-600 flex-1">
                {action.why}
              </p>
            </div>
          </LiquidCard>
        ))}

        {/* Observations */}
        {analysis.observations.slice(0, 3).map((obs, i) => (
          <LiquidCard key={`obs-${i}`} className={i === 0 ? 'bento-item-wide' : ''}>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    Observatie
                  </span>
                </div>
                <p className="text-slate-700 mb-2">{obs.insight}</p>
                {obs.quote && (
                  <div className="quote-card">
                    <p className="text-sm text-slate-600 italic">
                      "{obs.quote}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </LiquidCard>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-6">
        <Button onClick={handleNewAnalysis}>
          ← Nieuwe analyse
        </Button>
      </div>
    </div>
  )
}
