import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'

export function WelcomeStep() {
  const { nextStep } = useWizard()

  return (
    <div className="grid gap-8 text-center max-w-xl mx-auto">
      {/* Main welcome card */}
      <LiquidCard variant="large" className="grid gap-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl icon-gradient-closer flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            AI Coaching Analyse
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Transformeer je sales gesprekken met AI-gedreven coaching.
            Ontvang directe feedback en concrete actiepunten.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-3">
          {[
            'Identificeer je #1 verbeterpunt',
            'Krijg concrete actiepunten',
            'Analyseer sterke & zwakke punten',
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              <span className="text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <Button onClick={nextStep} className="mx-auto">
            Start Analyse
          </Button>
        </div>
      </LiquidCard>

      {/* Social proof */}
      <p className="text-sm text-text-muted">
        Closers verbeteren gemiddeld 23% na hun eerste analyse
      </p>
    </div>
  )
}
