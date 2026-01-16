import { ReactNode } from 'react'
import { Header } from './Header'

interface PageShellProps {
  children: ReactNode
  stepIndicator?: ReactNode
}

export function PageShell({ children, stepIndicator }: PageShellProps) {
  return (
    <>
      {/* Header */}
      <Header stepIndicator={stepIndicator} />

      {/* Background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Main container - centered in viewport below header */}
      <main
        className="relative flex items-center justify-center px-6"
        style={{ minHeight: 'calc(100vh - 7rem)', marginTop: '7rem' }}
      >
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </main>
    </>
  )
}
