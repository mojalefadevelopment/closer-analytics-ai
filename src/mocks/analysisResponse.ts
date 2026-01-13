import type { CoachingAnalysis } from '../types/coaching'

export const mockAnalysis: CoachingAnalysis = {
  priority: {
    title: 'Stop met prijsverdediging en vraag eerst naar de echte blokkade.',
    explanation:
      'Je gaat direct in verdediging bij het woord "te duur". Daardoor mis je de reden waarom de prospect twijfelt.',
  },
  actionPoints: [
    {
      action: 'Open met "Wat moet er veranderen om dit wel te doen?"',
      why: 'Verplaatst de focus van prijs naar waarde.',
    },
    {
      action: 'Stel de "10/10" vraag voordat je over prijs praat.',
      why: 'Geeft context om bezwaren te pareren.',
    },
    {
      action: 'Gebruik drie seconden stilte na elk bezwaar.',
      why: 'Je vult nu te snel in en mist signalen.',
    },
  ],
  observations: [
    {
      quote: 'Hij zei dat het te duur was.',
      insight: 'Je ging direct in verdediging.',
    },
    {
      quote: 'Ik zei dat hij erover kon nadenken.',
      insight: 'Geen concrete next step afgesproken.',
    },
    {
      quote: 'Nee, niet echt...',
      insight: 'Je stelde geen verdiepende vraag op het bezwaar.',
    },
  ],
}
