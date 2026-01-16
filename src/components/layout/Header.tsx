import { useState, ReactNode } from 'react'
import { ProfilePanel } from './ProfilePanel'

interface HeaderProps {
  stepIndicator?: ReactNode
}

export function Header({ stepIndicator }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm">
        <div className="mx-auto w-[min(96%,1100px)] flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
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
            <span className="font-semibold text-slate-700">Closer AI</span>
          </div>

          {/* Step indicator (center) */}
          {stepIndicator && (
            <div className="absolute left-1/2 -translate-x-1/2">
              {stepIndicator}
            </div>
          )}

          {/* Profile button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-sm hover:bg-white/80 transition-all flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-slate-600"
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
            <span className="text-sm text-slate-600 hidden sm:block">Profiel</span>
          </button>
        </div>
      </header>

      {/* Profile Panel */}
      <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  )
}
