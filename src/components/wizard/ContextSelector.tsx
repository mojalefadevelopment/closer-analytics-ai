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
  { id: 'starter', label: 'Starter', description: '0-1 jaar ervaring', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', description: '1-3 jaar ervaring', icon: '📈' },
  { id: 'expert', label: 'Expert', description: '3+ jaar ervaring', icon: '🏆' },
] as const

const focusOptions = [
  { id: 'bezwaren', label: 'Bezwaren', description: 'Bezwaren ombuigen', icon: '🛡️' },
  { id: 'afsluiting', label: 'Afsluiting', description: 'Deal closen', icon: '🎯' },
  { id: 'rapport', label: 'Rapport', description: 'Connectie bouwen', icon: '🤝' },
  { id: 'algemeen', label: 'Algemeen', description: 'Volledige review', icon: '📋' },
] as const

const goalOptions = [
  { id: 'closes', label: 'Meer closes', description: 'Hogere close rate', icon: '✅' },
  { id: 'tickets', label: 'Hogere tickets', description: 'Meer omzet per deal', icon: '💰' },
  { id: 'gesprekken', label: 'Betere gesprekken', description: 'Kwaliteit verhogen', icon: '💬' },
] as const

export function ContextSelector({ context, onContextChange }: ContextSelectorProps) {
  const { nextStep, prevStep } = useWizard()

  const isComplete = context.experience && context.focus && context.goal

  return (
    <div className="grid gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Personaliseer je analyse
        </h2>
        <p className="text-slate-600">
          Selecteer je context voor een gerichtere analyse
        </p>
      </div>

      {/* Experience Level */}
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Ervaring</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {experienceOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => onContextChange({ ...context, experience: option.id })}
              selected={context.experience === option.id}
              className="text-center"
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-semibold text-slate-800">{option.label}</div>
              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Focus Area */}
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Focus</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {focusOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => onContextChange({ ...context, focus: option.id })}
              selected={context.focus === option.id}
              className="text-center"
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-semibold text-slate-800 text-sm">{option.label}</div>
              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Pill variant="subtle">Doel</Pill>
        </div>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {goalOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => onContextChange({ ...context, goal: option.id })}
              selected={context.goal === option.id}
              className="text-center"
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-semibold text-slate-800">{option.label}</div>
              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={prevStep}>
          ← Terug
        </Button>
        <Button onClick={nextStep} disabled={!isComplete}>
          Volgende →
        </Button>
      </div>
    </div>
  )
}
