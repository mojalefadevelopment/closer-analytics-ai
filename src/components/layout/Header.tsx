import { useState, useCallback, ReactNode } from 'react'
import { ProfilePanel } from './ProfilePanel'
import { useLanguage } from '../../lib/i18n'

interface HeaderProps {
  stepIndicator?: ReactNode
}

export function Header({ stepIndicator }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const handleOpenProfile = useCallback(() => {
    setShowProfile(true)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false)
  }, [])

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none"
      >
        {t('header.skipToContent')}
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4" role="banner">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-card px-6 py-3">
            <div className="flex justify-between items-center">
              {/* Logo - matching Closer Analytics style */}
              <a
                href="/"
                className="flex items-center gap-2 flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t('header.home')}
              >
                <span className="text-primary font-bold text-lg">CA</span>
                <span className="text-gray-300 font-light">|</span>
                <span className="font-medium text-gray-800">Closer AI</span>
              </a>

              {/* Step indicator (center) */}
              {stepIndicator && (
                <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:block" aria-label="Wizard progress">
                  {stepIndicator}
                </nav>
              )}

              {/* Right side controls */}
              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <button
                  onClick={toggleLanguage}
                  aria-label={`Switch to ${language === 'nl' ? 'English' : 'Nederlands'}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600 uppercase">
                    {language}
                  </span>
                </button>

                {/* Profile button */}
                <button
                  onClick={handleOpenProfile}
                  aria-label={t('header.openProfile')}
                  aria-expanded={showProfile}
                  aria-haspopup="dialog"
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0"
                >
                  <span className="text-sm font-medium text-gray-600">JD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Panel */}
      <ProfilePanel isOpen={showProfile} onClose={handleCloseProfile} />
    </>
  )
}
