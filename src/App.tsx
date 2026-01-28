import CoachingAnalyze from './pages/CoachingAnalyze'
import { LanguageProvider } from './lib/i18n'
import { MetricsProvider } from './lib/metrics'

function App() {
  return (
    <LanguageProvider>
      <MetricsProvider>
        <CoachingAnalyze />
      </MetricsProvider>
    </LanguageProvider>
  )
}

export default App
