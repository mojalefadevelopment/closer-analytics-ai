import { useState, useCallback } from 'react'
import { useTranscriptHistory } from '../../hooks/useTranscriptHistory'
import { useLanguage } from '../../lib/i18n'
import { LiquidCard } from '../ui/LiquidCard'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'
import type { HistoryEntry } from '../../types/coaching'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelectEntry?: (entry: HistoryEntry) => void
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Vandaag ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays === 1) {
    return `Gisteren ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffDays < 7) {
    return `${diffDays} dagen geleden`
  } else {
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
  }
}

function getAverageScore(entry: HistoryEntry): number {
  if (!entry.analysis.scores || entry.analysis.scores.length === 0) return 0
  const sum = entry.analysis.scores.reduce((acc, s) => acc + s.score, 0)
  return Math.round(sum / entry.analysis.scores.length)
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-green-600'
  if (score >= 6) return 'text-yellow-600'
  return 'text-red-600'
}

export function HistoryPanel({ isOpen, onClose, onSelectEntry }: HistoryPanelProps) {
  const { history, deleteEntry, clearHistory, isLoaded } = useTranscriptHistory()
  const { t } = useLanguage()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteEntry(id)
  }, [deleteEntry])

  const handleClearAll = useCallback(() => {
    if (confirmClear) {
      clearHistory()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }, [confirmClear, clearHistory])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('history.title')}
          </h2>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className={`text-sm ${confirmClear ? 'text-red-600' : ''}`}
              >
                {confirmClear ? t('history.confirmClear') : t('history.clearAll')}
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Sluiten"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {!isLoaded ? (
            <div className="text-center py-8 text-gray-500">
              {t('history.loading')}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">{t('history.empty')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('history.emptyHint')}</p>
            </div>
          ) : (
            history.map((entry) => {
              const avgScore = getAverageScore(entry)
              return (
                <LiquidCard
                  key={entry.id}
                  className="cursor-pointer hover:scale-[1.01] transition-transform"
                  onClick={() => onSelectEntry?.(entry)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Summary */}
                      <p className="font-medium text-gray-900 truncate">
                        {entry.analysis.summary?.oneLiner || t('history.noSummary')}
                      </p>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                        {entry.context.experience && (
                          <Pill variant="primary" className="text-xs">
                            {entry.context.experience}
                          </Pill>
                        )}
                        {entry.analysis.summary?.callType && (
                          <Pill variant="primary" className="text-xs">
                            {entry.analysis.summary.callType}
                          </Pill>
                        )}
                      </div>

                      {/* Transcript preview */}
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {entry.transcript.slice(0, 150)}...
                      </p>
                    </div>

                    {/* Score and delete */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                        {avgScore}/10
                      </span>
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Verwijderen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </LiquidCard>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
