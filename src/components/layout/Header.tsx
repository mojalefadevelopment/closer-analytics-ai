import { useState, useCallback, ReactNode } from 'react'
import { ProfilePanel } from './ProfilePanel'
import { HistoryPanel } from '../history/HistoryPanel'
import { useLanguage } from '../../lib/i18n'

interface HeaderProps {
  stepIndicator?: ReactNode
}

export function Header({ stepIndicator }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const handleOpenProfile = useCallback(() => {
    setShowProfile(true)
  }, [])

  const handleCloseProfile = useCallback(() => {
    setShowProfile(false)
  }, [])

  const handleOpenHistory = useCallback(() => {
    setShowHistory(true)
  }, [])

  const handleCloseHistory = useCallback(() => {
    setShowHistory(false)
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

      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
        role="banner"
      >
        <div className="mx-auto w-[min(96%,1100px)] flex justify-between items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('header.home')}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
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
            <span className="font-semibold text-gray-800">Closer AI</span>
          </a>

          {/* Step indicator (center) */}
          {stepIndicator && (
            <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:block" aria-label="Wizard progress">
              {stepIndicator}
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-1">
            {/* History button */}
            <button
              onClick={handleOpenHistory}
              aria-label={t('history.viewHistory')}
              aria-expanded={showHistory}
              aria-haspopup="dialog"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm hidden sm:block">{t('profile.history')}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              aria-label={`Switch to ${language === 'nl' ? 'English' : 'Nederlands'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg
                className="w-4 h-4"
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
              <span className="text-sm font-medium uppercase">
                {language}
              </span>
            </button>

            {/* Profile button */}
            <button
              onClick={handleOpenProfile}
              aria-label={t('header.openProfile')}
              aria-expanded={showProfile}
              aria-haspopup="dialog"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">{t('header.profile')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Panel */}
      <ProfilePanel isOpen={showProfile} onClose={handleCloseProfile} />

      {/* History Panel */}
      <HistoryPanel isOpen={showHistory} onClose={handleCloseHistory} />
    </>
  )
}
