export interface CoachingAnalysis {
  priority: {
    title: string
    explanation: string
  }
  actionPoints: Array<{
    action: string
    why: string
  }>
  observations: Array<{
    quote: string
    insight: string
  }>
}
