import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'

export function WelcomeStep() {
  const { nextStep } = useWizard()

  return (
    <div className="grid gap-8 max-w-2xl mx-auto text-center">
      {/* Main welcome card */}
      <LiquidCard variant="large" className="grid gap-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-strong flex items-center justify-center liquid-blob">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            AI Coaching Analyse
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Transformeer je sales gesprekken met AI-gedreven coaching.
            Ontvang directe feedback en concrete actiepunten.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-3 text-left">
          {[
            { icon: '🎯', text: 'Identificeer je #1 verbeterpunt' },
            { icon: '💡', text: 'Krijg concrete actiepunten' },
            { icon: '📊', text: 'Analyseer sterke & zwakke punten' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/60"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-slate-700">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button onClick={nextStep} className="mx-auto">
          Start Analyse →
        </Button>
      </LiquidCard>

      {/* Subtle hint */}
      <p className="text-sm text-slate-400">
        Gemiddelde analysetijd: ~10 seconden
      </p>
    </div>
  )
}
