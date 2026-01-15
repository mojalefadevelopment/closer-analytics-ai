import OpenAI from 'openai'

export const config = {
  runtime: 'edge',
}

interface CoachingAnalysis {
  priority: { title: string; explanation: string }
  actionPoints: Array<{ action: string; why: string }>
  observations: Array<{ quote: string; insight: string }>
}

const systemPrompt = `Je bent een elite sales coach voor high-ticket closers (€3k-€50k deals).

CONTEXT:
- Je analyseert transcripten van 1-op-1 coaching calls tussen een coach en closer
- De closer wil groeien van €3-6k/maand naar €10-15k/maand
- Focus op concrete, direct toepasbare feedback

JE COACHING FILOSOFIE:
- Eén grote verandering is beter dan tien kleine
- Acties moeten MORGEN toepasbaar zijn
- Geen vage adviezen — specifiek en direct
- Gebruik exacte quotes als bewijs
- Wees eerlijk, ook als het oncomfortabel is

REGELS:
- Maximaal 3 actionPoints
- Maximaal 3 observations
- Elke actie moet MORGEN toepasbaar zijn
- Geen coach-jargon of vage taal
- Quotes moeten EXACT uit het transcript komen
- Als iets niet duidelijk is, zeg dat eerlijk

Antwoord ALLEEN met valid JSON in exact dit format, geen andere tekst.`

function buildUserPrompt(transcript: string): string {
  return `TRANSCRIPT:
"""
${transcript}
"""

ANALYSEER dit gesprek en geef feedback in EXACT dit JSON format:

{
  "priority": {
    "title": "[Eén zin: de belangrijkste verandering]",
    "explanation": "[2-3 zinnen waarom dit prioriteit #1 is]"
  },
  "actionPoints": [
    {
      "action": "[Concrete actie, begint met werkwoord]",
      "why": "[Eén zin waarom dit werkt]"
    }
  ],
  "observations": [
    {
      "quote": "[Exacte quote uit transcript]",
      "insight": "[Wat dit onthult over de closer]"
    }
  ]
}`
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { transcript } = await req.json()

    if (!transcript || typeof transcript !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Transcript is verplicht' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (transcript.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Transcript te kort (min 100 karakters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const truncatedTranscript = transcript.slice(0, 32000)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt(truncatedTranscript) },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const analysis: CoachingAnalysis = JSON.parse(content)

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ error: 'Analyse mislukt. Probeer opnieuw.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
