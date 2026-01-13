import type { CoachingAnalysis } from '../../types/coaching'
import { Pill } from '../ui/Pill'
import { PriorityCard } from './PriorityCard'
import { ActionPointsList } from './ActionPointsList'
import { ObservationsList } from './ObservationsList'

interface AnalysisOutputProps {
  analysis: CoachingAnalysis
}

export function AnalysisOutput({ analysis }: AnalysisOutputProps) {
  return (
    <div className="grid gap-4 animate-rise">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="font-semibold text-lg">Analyse resultaat</div>
        <Pill variant="subtle">Demo output</Pill>
      </div>

      {/* Priority */}
      <PriorityCard
        title={analysis.priority.title}
        explanation={analysis.priority.explanation}
      />

      {/* Action Points */}
      <ActionPointsList actionPoints={analysis.actionPoints} />

      {/* Observations */}
      <ObservationsList observations={analysis.observations} />
    </div>
  )
}
