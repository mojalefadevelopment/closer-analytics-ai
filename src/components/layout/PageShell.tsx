import { ReactNode } from 'react'
import { Header } from './Header'

interface PageShellProps {
  children: ReactNode
  stepIndicator?: ReactNode
}

export function PageShell({ children, stepIndicator }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header stepIndicator={stepIndicator} />

      {/* Main container - centered in viewport below header */}
      <main
        id="main-content"
        className="relative z-10 flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-screen"
        role="main"
      >
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
