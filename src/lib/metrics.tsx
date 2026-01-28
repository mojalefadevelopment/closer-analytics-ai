import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'

interface AnalysisRecord {
  id: string
  date: string
  score: number
  actionPointsCount: number
}

interface MetricsData {
  totalAnalyses: number
  improvement: number | null
  averageScore: number | null
  bestScore: number | null
  currentStreak: number
  lastAnalysisDate: string | null
}

interface MetricsContextType extends MetricsData {
  isLoading: boolean
  recordAnalysis: (score: number, actionPointsCount: number) => void
  clearHistory: () => void
}

const STORAGE_KEY = 'closer-ai-metrics'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function calculateImprovement(records: AnalysisRecord[]): number | null {
  if (records.length < 2) return null

  // Sort by date (oldest first) - spread creates copy to avoid mutation
  const sorted = [...records].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Compare first half average with second half average
  const midpoint = Math.floor(sorted.length / 2)
  const firstHalf = sorted.slice(0, midpoint)
  const secondHalf = sorted.slice(midpoint)

  const firstAvg = firstHalf.reduce((sum, r) => sum + r.score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, r) => sum + r.score, 0) / secondHalf.length

  // Calculate percentage improvement
  if (firstAvg === 0) return null
  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100

  return Math.round(improvement)
}

function calculateStreak(records: AnalysisRecord[]): number {
  if (records.length === 0) return 0

  // Sort by date (newest first) - spread creates copy to avoid mutation
  const sorted = [...records].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let currentDate = today

  // Get unique days with analyses
  const uniqueDays = new Set(
    sorted.map(r => {
      const d = new Date(r.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  // Check consecutive days starting from today or yesterday
  const todayTime = today.getTime()
  const yesterdayTime = todayTime - 86400000

  // Start from today if there's an analysis today, otherwise from yesterday
  if (!uniqueDays.has(todayTime) && !uniqueDays.has(yesterdayTime)) {
    return 0
  }

  currentDate = uniqueDays.has(todayTime) ? today : new Date(yesterdayTime)

  while (uniqueDays.has(currentDate.getTime())) {
    streak++
    currentDate = new Date(currentDate.getTime() - 86400000)
  }

  return streak
}

function loadRecords(): AnalysisRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveRecords(records: AnalysisRecord[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // Ignore storage errors
  }
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined)

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AnalysisRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load records on mount
  useEffect(() => {
    const loaded = loadRecords()
    setRecords(loaded)
    setIsLoading(false)
  }, [])

  const recordAnalysis = useCallback((score: number, actionPointsCount: number) => {
    const newRecord: AnalysisRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      score,
      actionPointsCount,
    }

    setRecords(prev => {
      const updated = [...prev, newRecord]
      // Keep only last 50 records
      const trimmed = updated.slice(-50)
      saveRecords(trimmed)
      return trimmed
    })
  }, [])

  const clearHistory = useCallback(() => {
    setRecords([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Calculate all metrics - memoized to avoid recalculation on every render
  const metrics = useMemo(() => {
    const totalAnalyses = records.length
    const improvement = calculateImprovement(records)
    const averageScore = records.length > 0
      ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
      : null

    // Use loop for max instead of sort for O(n) vs O(n log n)
    let bestScore: number | null = null
    let latestDate: string | null = null
    let latestTime = 0

    for (const record of records) {
      if (bestScore === null || record.score > bestScore) {
        bestScore = record.score
      }
      const recordTime = new Date(record.date).getTime()
      if (recordTime > latestTime) {
        latestTime = recordTime
        latestDate = record.date
      }
    }

    const currentStreak = calculateStreak(records)

    return {
      totalAnalyses,
      improvement,
      averageScore,
      bestScore,
      currentStreak,
      lastAnalysisDate: latestDate,
    }
  }, [records])

  const value = useMemo(() => ({
    isLoading,
    ...metrics,
    recordAnalysis,
    clearHistory,
  }), [isLoading, metrics, recordAnalysis, clearHistory])

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  )
}

export function useMetrics() {
  const context = useContext(MetricsContext)
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider')
  }
  return context
}
