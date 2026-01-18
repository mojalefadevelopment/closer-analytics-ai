import { useCallback } from 'react'
import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'

export interface ContextOptions {
  experience: 'starter' | 'intermediate' | 'expert' | null
  focus: 'bezwaren' | 'afsluiting' | 'rapport' | 'algemeen' | null
  goal: 'closes' | 'tickets' | 'gesprekken' | null
}

interface ContextSelectorProps {
  context: ContextOptions
  onContextChange: (context: ContextOptions) => void
}

const experienceOptions = [
  { id: 'starter', label: 'Starter', description: '0-1 jaar ervaring' },
  { id: 'intermediate', label: 'Intermediate', description: '1-3 jaar ervaring' },
  { id: 'expert', label: 'Expert', description: '3+ jaar ervaring' },
] as const

const focusOptions = [
  { id: 'bezwaren', label: 'Bezwaren', description: 'Bezwaren ombuigen' },
  { id: 'afsluiting', label: 'Afsluiting', description: 'Deal closen' },
  { id: 'rapport', label: 'Rapport', description: 'Connectie bouwen' },
  { id: 'algemeen', label: 'Algemeen', description: 'Volledige review' },
] as const

const goalOptions = [
  { id: 'closes', label: 'Meer closes', description: 'Hogere close rate' },
  { id: 'tickets', label: 'Hogere tickets', description: 'Meer omzet per deal' },
  { id: 'gesprekken', label: 'Betere gesprekken', description: 'Kwaliteit verhogen' },
] as const

export function ContextSelector({ context, onContextChange }: ContextSelectorProps) {
  const { nextStep, prevStep } = useWizard()

  const isComplete = context.experience && context.focus && context.goal

  const handleExperienceChange = useCallback(
    (id: ContextOptions['experience']) => {
      onContextChange({ ...context, experience: id })
    },
    [context, onContextChange]
  )

  const handleFocusChange = useCallback(
    (id: ContextOptions['focus']) => {
      onContextChange({ ...context, focus: id })
    },
    [context, onContextChange]
  )

  const handleGoalChange = useCallback(
    (id: ContextOptions['goal']) => {
      onContextChange({ ...context, goal: id })
    },
    [context, onContextChange]
  )

  return (
    <div className="grid gap-10 max-w-3xl mx-auto py-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Personaliseer je analyse
        </h2>
        <p className="text-text-secondary">
          Selecteer je context voor een gerichtere analyse
        </p>
      </div>

      {/* Experience Level */}
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Ervaring</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {experienceOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleExperienceChange(option.id)}
              selected={context.experience === option.id}
              className="text-center"
            >
              <div className="font-semibold text-text-primary">{option.label}</div>
              <div className="text-xs text-text-muted mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Focus Area */}
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Focus</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {focusOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleFocusChange(option.id)}
              selected={context.focus === option.id}
              className="text-center"
            >
              <div className="font-semibold text-text-primary text-sm">{option.label}</div>
              <div className="text-xs text-text-muted mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Doel</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {goalOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleGoalChange(option.id)}
              selected={context.goal === option.id}
              className="text-center"
            >
              <div className="font-semibold text-text-primary">{option.label}</div>
              <div className="text-xs text-text-muted mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="ghost" onClick={prevStep}>
          Terug
        </Button>
        <Button onClick={nextStep} disabled={!isComplete}>
          Volgende
        </Button>
      </div>
    </div>
  )
}
