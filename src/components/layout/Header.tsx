import { useState, useCallback, ReactNode } from 'react'
import { ProfilePanel } from './ProfilePanel'

interface HeaderProps {
  stepIndicator?: ReactNode
}

export function Header({ stepIndicator }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)

  const handleOpenProfile = useCallback(() => {
    setShowProfile(true)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 nav-glass">
        <div className="mx-auto w-[min(96%,1100px)] flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl icon-gradient-closer flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-semibold text-text-primary">Closer AI</span>
          </div>

          {/* Step indicator (center) */}
          {stepIndicator && (
            <div className="absolute left-1/2 -translate-x-1/2">
              {stepIndicator}
            </div>
          )}

          {/* Profile button */}
          <button
            onClick={handleOpenProfile}
            className="flex items-center gap-2 px-3 py-2 rounded-full liquid-glass hover:bg-white/10 transition-all flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm text-text-secondary hidden sm:block">Profiel</span>
          </button>
        </div>
      </header>

      {/* Profile Panel */}
      <ProfilePanel isOpen={showProfile} onClose={handleCloseProfile} />
    </>
  )
}
