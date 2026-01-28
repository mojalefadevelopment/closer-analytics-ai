import { useEffect, useRef } from 'react'
import { LiquidCard } from '../ui/LiquidCard'
import { useLanguage } from '../../lib/i18n'
import { useMetrics } from '../../lib/metrics'

interface ProfilePanelProps {
  isOpen: boolean
  onClose: () => void
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

function MetricCard({
  value,
  label,
  isLoading,
  isEmpty,
  color = 'default',
  icon,
}: {
  value: string
  label: string
  isLoading: boolean
  isEmpty: boolean
  color?: 'default' | 'success' | 'warning'
  icon?: React.ReactNode
}) {
  const colorClasses = {
    default: 'text-gray-800',
    success: 'text-success',
    warning: 'text-warning',
  }

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      {isLoading ? (
        <>
          <Skeleton className="h-7 w-14 mb-1" />
          <Skeleton className="h-4 w-16" />
        </>
      ) : isEmpty ? (
        <>
          <div className="text-xl font-bold text-gray-300 tabular-nums">—</div>
          <div className="text-xs text-gray-400">{label}</div>
        </>
      ) : (
        <>
          <div className={`text-xl font-bold tabular-nums flex items-center gap-2 ${colorClasses[color]}`}>
            {icon}
            {value}
          </div>
          <div className="text-xs text-gray-500">{label}</div>
        </>
      )}
    </div>
  )
}

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const { t, language, setLanguage } = useLanguage()
  const {
    isLoading,
    totalAnalyses,
    improvement,
    averageScore,
    bestScore,
    currentStreak,
  } = useMetrics()

  // Store onClose in ref to avoid effect re-subscription when callback changes
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Handle Escape key to close - stable subscription
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const hasData = totalAnalyses > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 p-4 animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        style={{ overscrollBehavior: 'contain' }}
      >
        <LiquidCard variant="large" className="h-full overflow-auto overscroll-contain">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 id="profile-title" className="text-lg font-bold text-gray-800">{t('profile.title')}</h2>
            <button
              onClick={onClose}
              aria-label={t('profile.close')}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Profile Info */}
          <div className="grid gap-5">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-white">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">John Doe</div>
                    <div className="text-sm text-gray-500">john@example.com</div>
                  </div>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                value={totalAnalyses.toString()}
                label={t('profile.analyses')}
                isLoading={isLoading}
                isEmpty={!hasData}
              />
              <MetricCard
                value={improvement !== null ? `${improvement >= 0 ? '+' : ''}${improvement}%` : '—'}
                label={t('profile.improvement')}
                isLoading={isLoading}
                isEmpty={improvement === null}
                color={improvement !== null && improvement >= 0 ? 'success' : 'warning'}
              />
              <MetricCard
                value={averageScore !== null ? `${averageScore}%` : '—'}
                label={t('profile.averageScore')}
                isLoading={isLoading}
                isEmpty={averageScore === null}
              />
              <MetricCard
                value={bestScore !== null ? `${bestScore}%` : '—'}
                label={t('profile.bestScore')}
                isLoading={isLoading}
                isEmpty={bestScore === null}
                color="success"
              />
            </div>

            {/* Streak Card */}
            <div className="p-4 rounded-xl bg-warning-light border border-warning/20">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div>
                    <Skeleton className="h-6 w-12 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ) : currentStreak > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
                    <span className="text-lg" role="img" aria-label="fire">🔥</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-warning tabular-nums">
                      {currentStreak}
                    </div>
                    <div className="text-sm text-warning/80">
                      {t('profile.streak')} ({t('profile.streakDays')})
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <span className="text-lg opacity-40" role="img" aria-label="fire">🔥</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{t('profile.streak')}</div>
                    <div className="text-xs text-gray-400">{t('profile.startAnalyzing')}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-3">{t('profile.language')}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('nl')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    language === 'nl'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Nederlands
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    language === 'en'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="grid gap-1 pt-4 border-t border-gray-100" aria-label="Profile menu">
              <MenuItem label={t('profile.settings')} />
              <MenuItem label={t('profile.history')} />
              <MenuItem label={t('profile.subscription')} badge="Pro" />
              <MenuItem label={t('profile.help')} />
            </nav>

            {/* Logout */}
            <button className="mt-2 w-full py-2.5 text-sm text-gray-500 hover:text-danger hover:bg-danger-light rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger">
              {t('profile.logout')}
            </button>
          </div>
        </LiquidCard>
      </div>
    </>
  )
}

function MenuItem({ label, badge }: { label: string; badge?: string }) {
  return (
    <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <span className="text-sm text-gray-700">{label}</span>
      {badge ? (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-light text-primary">
          {badge}
        </span>
      ) : (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  )
}
