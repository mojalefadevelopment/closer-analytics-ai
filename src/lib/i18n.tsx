import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'

export type Language = 'nl' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  nl: {
    // Header
    'header.skipToContent': 'Skip naar inhoud',
    'header.home': 'Closer AI - Home',
    'header.profile': 'Profiel',
    'header.openProfile': 'Open profiel menu',

    // Welcome Step
    'welcome.title': 'AI Coaching Analyse',
    'welcome.subtitle': 'Transformeer je sales gesprekken met AI-gedreven coaching. Ontvang directe feedback en concrete actiepunten.',
    'welcome.feature1.title': '#1 Focus',
    'welcome.feature1.desc': 'Ontdek je belangrijkste verbeterpunt',
    'welcome.feature2.title': 'Actiepunten',
    'welcome.feature2.desc': 'Concrete stappen om te verbeteren',
    'welcome.feature3.title': 'Inzichten',
    'welcome.feature3.desc': 'Analyseer sterke & zwakke punten',
    'welcome.cta': 'Start Analyse',
    'welcome.socialProof': 'Closers verbeteren gemiddeld 23% na hun eerste analyse',

    // Context Selector
    'context.title': 'Personaliseer je analyse',
    'context.subtitle': 'Selecteer je context voor een gerichtere analyse',
    'context.experience': 'Ervaring',
    'context.experience.starter': 'Starter',
    'context.experience.starter.desc': '0–1 jaar ervaring',
    'context.experience.intermediate': 'Intermediate',
    'context.experience.intermediate.desc': '1–3 jaar ervaring',
    'context.experience.expert': 'Expert',
    'context.experience.expert.desc': '3+ jaar ervaring',
    'context.focus': 'Focus',
    'context.focus.bezwaren': 'Bezwaren',
    'context.focus.bezwaren.desc': 'Bezwaren ombuigen',
    'context.focus.afsluiting': 'Afsluiting',
    'context.focus.afsluiting.desc': 'Deal closen',
    'context.focus.rapport': 'Rapport',
    'context.focus.rapport.desc': 'Connectie bouwen',
    'context.focus.algemeen': 'Algemeen',
    'context.focus.algemeen.desc': 'Volledige review',
    'context.goal': 'Doel',
    'context.goal.closes': 'Meer closes',
    'context.goal.closes.desc': 'Hogere close rate',
    'context.goal.tickets': 'Hogere tickets',
    'context.goal.tickets.desc': 'Meer omzet per deal',
    'context.goal.gesprekken': 'Betere gesprekken',
    'context.goal.gesprekken.desc': 'Kwaliteit verhogen',

    // Transcript Step
    'transcript.title': 'Plak je transcript',
    'transcript.subtitle': 'Kopieer en plak het transcript van je sales gesprek',
    'transcript.label': 'Transcript invoer',
    'transcript.placeholder': `Plak hier je coaching call transcript…

Voorbeeld:
Closer: Goedemiddag, hoe gaat het vandaag?
Prospect: Goed, dankjewel. Ik heb de informatie gelezen…`,
    'transcript.min': 'min',
    'transcript.analyze': 'Analyseer',

    // Results Step
    'results.title': 'Analyse Resultaat',
    'results.subtitle': 'Jouw persoonlijke coaching feedback',
    'results.score': 'Score',
    'results.priority': '#1 Prioriteit',
    'results.actionPoints': 'Actiepunten',
    'results.action': 'Actie',
    'results.observations': 'Observaties',
    'results.observation': 'Observatie',
    'results.newAnalysis': 'Nieuwe analyse',
    'results.share': 'Deel resultaat',

    // Navigation
    'nav.back': 'Terug',
    'nav.next': 'Volgende',

    // Profile
    'profile.title': 'Profiel',
    'profile.close': 'Sluit profiel',
    'profile.analyses': 'Analyses',
    'profile.improvement': 'Groei',
    'profile.averageScore': 'Gem. score',
    'profile.bestScore': 'Beste score',
    'profile.streak': 'Streak',
    'profile.streakDays': 'dagen',
    'profile.noData': 'Nog geen data',
    'profile.startAnalyzing': 'Start je eerste analyse',
    'profile.settings': 'Instellingen',
    'profile.history': 'Analyse geschiedenis',
    'profile.subscription': 'Abonnement',
    'profile.help': 'Help & Support',
    'profile.logout': 'Uitloggen',
    'profile.language': 'Taal',
  },
  en: {
    // Header
    'header.skipToContent': 'Skip to content',
    'header.home': 'Closer AI - Home',
    'header.profile': 'Profile',
    'header.openProfile': 'Open profile menu',

    // Welcome Step
    'welcome.title': 'AI Coaching Analysis',
    'welcome.subtitle': 'Transform your sales conversations with AI-driven coaching. Receive instant feedback and concrete action points.',
    'welcome.feature1.title': '#1 Focus',
    'welcome.feature1.desc': 'Discover your key improvement area',
    'welcome.feature2.title': 'Action Points',
    'welcome.feature2.desc': 'Concrete steps to improve',
    'welcome.feature3.title': 'Insights',
    'welcome.feature3.desc': 'Analyze strengths & weaknesses',
    'welcome.cta': 'Start Analysis',
    'welcome.socialProof': 'Closers improve by 23% on average after their first analysis',

    // Context Selector
    'context.title': 'Personalize your analysis',
    'context.subtitle': 'Select your context for a more targeted analysis',
    'context.experience': 'Experience',
    'context.experience.starter': 'Starter',
    'context.experience.starter.desc': '0–1 years experience',
    'context.experience.intermediate': 'Intermediate',
    'context.experience.intermediate.desc': '1–3 years experience',
    'context.experience.expert': 'Expert',
    'context.experience.expert.desc': '3+ years experience',
    'context.focus': 'Focus',
    'context.focus.bezwaren': 'Objections',
    'context.focus.bezwaren.desc': 'Handle objections',
    'context.focus.afsluiting': 'Closing',
    'context.focus.afsluiting.desc': 'Close the deal',
    'context.focus.rapport': 'Rapport',
    'context.focus.rapport.desc': 'Build connection',
    'context.focus.algemeen': 'General',
    'context.focus.algemeen.desc': 'Full review',
    'context.goal': 'Goal',
    'context.goal.closes': 'More closes',
    'context.goal.closes.desc': 'Higher close rate',
    'context.goal.tickets': 'Higher tickets',
    'context.goal.tickets.desc': 'More revenue per deal',
    'context.goal.gesprekken': 'Better conversations',
    'context.goal.gesprekken.desc': 'Improve quality',

    // Transcript Step
    'transcript.title': 'Paste your transcript',
    'transcript.subtitle': 'Copy and paste the transcript of your sales conversation',
    'transcript.label': 'Transcript input',
    'transcript.placeholder': `Paste your coaching call transcript here…

Example:
Closer: Good afternoon, how are you today?
Prospect: Good, thank you. I've read the information…`,
    'transcript.min': 'min',
    'transcript.analyze': 'Analyze',

    // Results Step
    'results.title': 'Analysis Results',
    'results.subtitle': 'Your personal coaching feedback',
    'results.score': 'Score',
    'results.priority': '#1 Priority',
    'results.actionPoints': 'Action Points',
    'results.action': 'Action',
    'results.observations': 'Observations',
    'results.observation': 'Observation',
    'results.newAnalysis': 'New analysis',
    'results.share': 'Share result',

    // Navigation
    'nav.back': 'Back',
    'nav.next': 'Next',

    // Profile
    'profile.title': 'Profile',
    'profile.close': 'Close profile',
    'profile.analyses': 'Analyses',
    'profile.improvement': 'Growth',
    'profile.averageScore': 'Avg. score',
    'profile.bestScore': 'Best score',
    'profile.streak': 'Streak',
    'profile.streakDays': 'days',
    'profile.noData': 'No data yet',
    'profile.startAnalyzing': 'Start your first analysis',
    'profile.settings': 'Settings',
    'profile.history': 'Analysis history',
    'profile.subscription': 'Subscription',
    'profile.help': 'Help & Support',
    'profile.logout': 'Log out',
    'profile.language': 'Language',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      if (saved === 'nl' || saved === 'en') return saved
    }
    return 'nl'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  // Stable toggle function using functional setState - no language dependency
  const toggleLanguage = useCallback(() => {
    setLanguageState(curr => curr === 'nl' ? 'en' : 'nl')
  }, [])

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations['nl']] || key
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language, setLanguage, toggleLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
