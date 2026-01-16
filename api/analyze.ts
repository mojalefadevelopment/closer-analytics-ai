import Groq from 'groq-sdk'
import {
  buildSystemPrompt,
  buildUserPrompt,
  type AnalysisContext,
} from './config/prompts'

export const config = {
  runtime: 'edge',
}

interface CoachingAnalysis {
  priority: { title: string; explanation: string }
  actionPoints: Array<{ action: string; why: string }>
  observations: Array<{ quote: string; insight: string }>
}

interface RequestBody {
  transcript: string
  context?: AnalysisContext
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
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API configuratie fout. Check GROQ_API_KEY.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()
    const { transcript, context } = body

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

    // Build personalized prompts based on context
    const analysisContext: AnalysisContext = {
      experience: context?.experience || null,
      focus: context?.focus || null,
      goal: context?.goal || null,
    }

    const systemPrompt = buildSystemPrompt(analysisContext)
    const userPrompt = buildUserPrompt(truncatedTranscript)

    const groq = new Groq({ apiKey })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1024,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from Groq')
    }

    const analysis: CoachingAnalysis = JSON.parse(content)

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('API error:', errorMessage)

    return new Response(
      JSON.stringify({
        error: 'Analyse mislukt. Probeer opnieuw.',
        debug: errorMessage
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
