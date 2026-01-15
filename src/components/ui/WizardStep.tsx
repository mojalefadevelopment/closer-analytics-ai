import { ReactNode } from 'react'
import { useWizard } from './Wizard'

interface WizardStepProps {
  step: number
  children: ReactNode
}

export function WizardStep({ step, children }: WizardStepProps) {
  const { currentStep } = useWizard()

  if (currentStep !== step) {
    return null
  }

  return (
    <div className="wizard-step animate-step-in">
      {children}
    </div>
  )
}
