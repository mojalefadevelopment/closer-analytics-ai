import { useState, useEffect, useCallback } from 'react'
import type { HistoryEntry, CoachingAnalysis, AnalysisContext } from '../types/coaching'

const STORAGE_KEY = 'closer-analytics-history'
const MAX_HISTORY_ITEMS = 50

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    console.error('[History] Failed to load history from localStorage')
    return []
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('[History] Failed to save history to localStorage:', error)
  }
}

export function useTranscriptHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history on mount
  useEffect(() => {
    const loaded = loadHistory()
    setHistory(loaded)
    setIsLoaded(true)
  }, [])

  // Save a new analysis to history
  const addEntry = useCallback((
    transcript: string,
    context: AnalysisContext,
    analysis: CoachingAnalysis
  ): HistoryEntry => {
    const entry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      transcript,
      context,
      analysis,
    }

    setHistory(prev => {
      // Add new entry at the beginning, limit to MAX_HISTORY_ITEMS
      const updated = [entry, ...prev].slice(0, MAX_HISTORY_ITEMS)
      saveHistory(updated)
      return updated
    })

    return entry
  }, [])

  // Delete an entry from history
  const deleteEntry = useCallback((id: string): void => {
    setHistory(prev => {
      const updated = prev.filter(entry => entry.id !== id)
      saveHistory(updated)
      return updated
    })
  }, [])

  // Clear all history
  const clearHistory = useCallback((): void => {
    setHistory([])
    saveHistory([])
  }, [])

  // Get a specific entry by ID
  const getEntry = useCallback((id: string): HistoryEntry | undefined => {
    return history.find(entry => entry.id === id)
  }, [history])

  return {
    history,
    isLoaded,
    addEntry,
    deleteEntry,
    clearHistory,
    getEntry,
  }
}
