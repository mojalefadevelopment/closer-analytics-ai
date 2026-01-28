import { useMemo } from 'react'
import { useWizard } from './Wizard'

export function StepIndicator() {
  const { currentStep, totalSteps } = useWizard()

  // Memoize step indices to avoid array recreation
  const stepIndices = useMemo(() => Array.from({ length: totalSteps }, (_, i) => i), [totalSteps])

  return (
    <div className="flex items-center justify-center gap-2">
      {stepIndices.map((index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Step dot */}
            <div
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${isActive ? 'bg-primary w-6' : ''}
                ${isCompleted ? 'bg-primary' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-300' : ''}
              `}
            />

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  w-4 h-0.5 rounded-full transition-all duration-200
                  ${isCompleted ? 'bg-primary' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
