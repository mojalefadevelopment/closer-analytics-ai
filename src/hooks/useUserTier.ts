import { useState, useEffect, useCallback } from 'react'

export type UserTier = 'free' | 'pro'

const STORAGE_KEY = 'closer-analytics-user-tier'

interface UserTierState {
  tier: UserTier
  // In production, this would include subscription details, expiry, etc.
}

function loadTier(): UserTierState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { tier: 'free' }
    return JSON.parse(stored)
  } catch {
    return { tier: 'free' }
  }
}

function saveTier(state: UserTierState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useUserTier() {
  const [state, setState] = useState<UserTierState>({ tier: 'free' })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tier on mount
  useEffect(() => {
    const loaded = loadTier()
    setState(loaded)
    setIsLoaded(true)
  }, [])

  const isPro = state.tier === 'pro'

  // For development/testing - toggle pro status
  const setTier = useCallback((tier: UserTier) => {
    const newState = { tier }
    setState(newState)
    saveTier(newState)
  }, [])

  // In production, this would redirect to Stripe/payment page
  const upgradeToPro = useCallback(() => {
    // For now, just open a placeholder URL
    // In production: window.location.href = '/api/checkout/pro'
    window.open('https://closer.ai/pricing', '_blank')
  }, [])

  return {
    tier: state.tier,
    isPro,
    isLoaded,
    setTier, // For testing/admin
    upgradeToPro,
  }
}
