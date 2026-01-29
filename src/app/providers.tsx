/**
 * App Providers
 *
 * Consolidates all context providers for the application.
 * Wrap your app with this component to enable all features.
 */

import { ReactNode } from 'react'
import { LanguageProvider } from '../lib/i18n'
import { MetricsProvider } from '../lib/metrics'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <MetricsProvider>
        {children}
      </MetricsProvider>
    </LanguageProvider>
  )
}
