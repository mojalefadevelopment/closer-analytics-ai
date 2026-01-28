import { useCallback, useMemo } from 'react'
import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { useLanguage } from '../../lib/i18n'

export interface ContextOptions {
  experience: 'starter' | 'intermediate' | 'expert' | null
  focus: 'bezwaren' | 'afsluiting' | 'rapport' | 'algemeen' | null
  goal: 'closes' | 'tickets' | 'gesprekken' | null
}

interface ContextSelectorProps {
  context: ContextOptions
  onContextChange: (context: ContextOptions) => void
}

export function ContextSelector({ context, onContextChange }: ContextSelectorProps) {
  const { nextStep, prevStep } = useWizard()
  const { t } = useLanguage()

  const isComplete = context.experience && context.focus && context.goal

  // Memoize options arrays to avoid recreation on every render
  const experienceOptions = useMemo(() => [
    { id: 'starter' as const, label: t('context.experience.starter'), description: t('context.experience.starter.desc') },
    { id: 'intermediate' as const, label: t('context.experience.intermediate'), description: t('context.experience.intermediate.desc') },
    { id: 'expert' as const, label: t('context.experience.expert'), description: t('context.experience.expert.desc') },
  ], [t])

  const focusOptions = useMemo(() => [
    { id: 'bezwaren' as const, label: t('context.focus.bezwaren'), description: t('context.focus.bezwaren.desc') },
    { id: 'afsluiting' as const, label: t('context.focus.afsluiting'), description: t('context.focus.afsluiting.desc') },
    { id: 'rapport' as const, label: t('context.focus.rapport'), description: t('context.focus.rapport.desc') },
    { id: 'algemeen' as const, label: t('context.focus.algemeen'), description: t('context.focus.algemeen.desc') },
  ], [t])

  const goalOptions = useMemo(() => [
    { id: 'closes' as const, label: t('context.goal.closes'), description: t('context.goal.closes.desc') },
    { id: 'tickets' as const, label: t('context.goal.tickets'), description: t('context.goal.tickets.desc') },
    { id: 'gesprekken' as const, label: t('context.goal.gesprekken'), description: t('context.goal.gesprekken.desc') },
  ], [t])

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
    <article className="grid gap-10 max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <header className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('context.title')}
        </h2>
        <p className="text-gray-500">
          {t('context.subtitle')}
        </p>
      </header>

      {/* Experience Level */}
      <fieldset className="grid gap-3 border-none p-0 m-0">
        <legend className="text-sm font-medium text-gray-500 mb-2">{t('context.experience')}</legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          role="radiogroup"
          aria-label={t('context.experience')}
        >
          {experienceOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleExperienceChange(option.id)}
              selected={context.experience === option.id}
              className="text-center py-4"
            >
              <div className="font-medium text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-400 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </fieldset>

      {/* Focus Area */}
      <fieldset className="grid gap-3 border-none p-0 m-0">
        <legend className="text-sm font-medium text-gray-500 mb-2">{t('context.focus')}</legend>
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          role="radiogroup"
          aria-label={t('context.focus')}
        >
          {focusOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleFocusChange(option.id)}
              selected={context.focus === option.id}
              className="text-center py-4"
            >
              <div className="font-medium text-gray-800 text-sm">{option.label}</div>
              <div className="text-xs text-gray-400 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </fieldset>

      {/* Goal */}
      <fieldset className="grid gap-3 border-none p-0 m-0">
        <legend className="text-sm font-medium text-gray-500 mb-2">{t('context.goal')}</legend>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          role="radiogroup"
          aria-label={t('context.goal')}
        >
          {goalOptions.map((option) => (
            <LiquidCard
              key={option.id}
              onClick={() => handleGoalChange(option.id)}
              selected={context.goal === option.id}
              className="text-center py-4"
            >
              <div className="font-medium text-gray-800">{option.label}</div>
              <div className="text-xs text-gray-400 mt-1">{option.description}</div>
            </LiquidCard>
          ))}
        </div>
      </fieldset>

      {/* Navigation */}
      <nav className="flex justify-between items-center pt-4" aria-label="Wizard navigation">
        <Button variant="ghost" onClick={prevStep}>
          {t('nav.back')}
        </Button>
        <Button onClick={nextStep} disabled={!isComplete}>
          {t('nav.next')}
        </Button>
      </nav>
    </article>
  )
}
