import { useMemo } from 'react'
import { useWizard } from '../ui/Wizard'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { useLanguage } from '../../lib/i18n'

const featureStyles = [
  {
    id: 'focus',
    bgColor: 'bg-primary-light',
    iconColor: 'text-primary',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 'actions',
    bgColor: 'bg-success-light',
    iconColor: 'text-success',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    id: 'insights',
    bgColor: 'bg-warning-light',
    iconColor: 'text-warning',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

export function WelcomeStep() {
  const { nextStep } = useWizard()
  const { t } = useLanguage()

  // Memoize features to avoid recreation on every render
  const features = useMemo(() => featureStyles.map((style, i) => ({
    ...style,
    title: t(`welcome.feature${i + 1}.title`),
    description: t(`welcome.feature${i + 1}.desc`),
  })), [t])

  return (
    <article className="grid gap-8 text-center max-w-3xl mx-auto py-8 px-4">
      {/* Main welcome card */}
      <LiquidCard variant="large" className="py-12 md:py-16">
        <div className="grid gap-8">
          {/* Icon */}
          <div
            className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Title */}
          <header className="max-w-lg mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {t('welcome.title')}
            </h1>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              {t('welcome.subtitle')}
            </p>
          </header>

          {/* Features Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 list-none p-0 m-0" role="list">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-5 h-5 ${feature.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="pt-4">
            <Button onClick={nextStep}>
              {t('welcome.cta')}
            </Button>
          </div>
        </div>
      </LiquidCard>

      {/* Social proof */}
      <p className="text-sm text-gray-400">
        {t('welcome.socialProof')}
      </p>
    </article>
  )
}
