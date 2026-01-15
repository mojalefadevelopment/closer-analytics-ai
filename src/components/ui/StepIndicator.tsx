import { useWizard } from './Wizard'

const stepLabels = ['Welkom', 'Context', 'Transcript', 'Resultaat']

export function StepIndicator() {
  const { currentStep, totalSteps } = useWizard()

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-500 ease-out
                  ${isActive ? 'step-dot-active' : ''}
                  ${isCompleted ? 'step-dot-completed' : ''}
                  ${!isActive && !isCompleted ? 'step-dot-pending' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {index + 1}
                  </span>
                )}

                {/* Liquid fill animation for active */}
                {isActive && <div className="step-liquid-fill" />}
              </div>

              {/* Label */}
              <span
                className={`
                  text-xs font-medium transition-colors duration-300
                  ${isActive ? 'text-accent' : isCompleted ? 'text-accent-strong' : 'text-slate-400'}
                `}
              >
                {stepLabels[index]}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  w-8 h-0.5 rounded-full transition-all duration-500
                  ${isCompleted ? 'bg-accent' : 'bg-slate-200'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
