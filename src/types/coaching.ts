export interface CategoryScore {
  category: 'rapport' | 'discovery' | 'objections' | 'closing'
  score: number // 1-10
  label: string
  feedback: string
}

export interface Strength {
  title: string
  example: string // Quote of voorbeeld uit transcript
}

export interface CriticalMoment {
  moment: string // Beschrijving van het moment
  quote: string // Exacte quote
  impact: 'positive' | 'negative' | 'neutral'
  suggestion?: string // Wat had beter gekund (bij negative)
}

export interface CoachingAnalysis {
  // Samenvatting
  summary: {
    oneLiner: string // Eén zin samenvatting van het gesprek
    callType: 'discovery' | 'follow-up' | 'closing' | 'objection-heavy' | 'other'
    overallImpression: string // 2-3 zinnen overall indruk
  }

  // Scores per categorie
  scores: CategoryScore[]

  // Sterke punten (niet alleen focussen op verbeterpunten)
  strengths: Strength[]

  // Kritieke momenten in het gesprek
  criticalMoments: CriticalMoment[]

  // Prioriteit #1
  priority: {
    title: string
    explanation: string
    immediateAction: string // Concrete actie voor het VOLGENDE gesprek
  }

  // Actiepunten
  actionPoints: Array<{
    action: string
    why: string
    example?: string // Voorbeeldzin die ze kunnen gebruiken
  }>

  // Observaties met quotes
  observations: Array<{
    quote: string
    insight: string
    category: 'rapport' | 'discovery' | 'objections' | 'closing' | 'general'
  }>

  // AI reasoning (voor debugging/transparantie)
  _meta?: {
    reasoning: string // Korte uitleg van de AI's denkproces
    confidence: 'high' | 'medium' | 'low'
    transcriptQuality: 'excellent' | 'good' | 'fair' | 'poor'
  }
}
