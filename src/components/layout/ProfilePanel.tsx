import { LiquidCard } from '../ui/LiquidCard'

interface ProfilePanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 p-4 animate-slide-in">
        <LiquidCard variant="large" className="h-full overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">Profiel</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
          <div className="grid gap-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-strong flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <div>
                <div className="font-semibold text-slate-800">John Doe</div>
                <div className="text-sm text-slate-500">john@example.com</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/50 border border-white/60">
                <div className="text-2xl font-bold text-slate-800">12</div>
                <div className="text-sm text-slate-500">Analyses</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/50 border border-white/60">
                <div className="text-2xl font-bold text-slate-800">+18%</div>
                <div className="text-sm text-slate-500">Verbetering</div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid gap-2 pt-4 border-t border-slate-200/50">
              <MenuItem label="Instellingen" />
              <MenuItem label="Analyse geschiedenis" />
              <MenuItem label="Abonnement" badge="Pro" />
              <MenuItem label="Help & Support" />
            </div>

            {/* Logout */}
            <button className="mt-4 w-full py-3 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Uitloggen
            </button>
          </div>
        </LiquidCard>
      </div>
    </>
  )
}

function MenuItem({ label, badge }: { label: string; badge?: string }) {
  return (
    <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/50 transition-colors text-left">
      <span className="text-slate-700">{label}</span>
      {badge ? (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent-strong">
          {badge}
        </span>
      ) : (
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
