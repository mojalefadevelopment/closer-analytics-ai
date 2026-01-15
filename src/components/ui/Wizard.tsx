import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardContextType {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
}

const WizardContext = createContext<WizardContextType | null>(null)

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a Wizard')
  }
  return context
}

interface WizardProps {
  children: ReactNode
  totalSteps: number
}

export function Wizard({ children, totalSteps }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  function nextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  function goToStep(step: number) {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
  }

  return (
    <WizardContext.Provider
      value={{ currentStep, totalSteps, nextStep, prevStep, goToStep }}
    >
      {children}
    </WizardContext.Provider>
  )
}
