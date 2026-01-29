import Groq from 'groq-sdk'
import {
  buildSystemPrompt,
  buildUserPrompt,
  type AnalysisContext,
} from './lib/prompts'

export const config = {
  runtime: 'edge',
}

// ============================================
// EXPANDED SCHEMA - Matching src/types/coaching.ts
// ============================================

interface CategoryScore {
  category: 'rapport' | 'discovery' | 'objections' | 'closing'
  score: number
  label: string
  feedback: string
}

interface Strength {
  title: string
  example: string
}

interface CriticalMoment {
  moment: string
  quote: string
  impact: 'positive' | 'negative' | 'neutral'
  suggestion?: string
}

interface CoachingAnalysis {
  summary: {
    oneLiner: string
    callType: 'discovery' | 'follow-up' | 'closing' | 'objection-heavy' | 'other'
    overallImpression: string
  }
  scores: CategoryScore[]
  strengths: Strength[]
  criticalMoments: CriticalMoment[]
  priority: {
    title: string
    explanation: string
    immediateAction: string
  }
  actionPoints: Array<{
    action: string
    why: string
    example?: string
  }>
  observations: Array<{
    quote: string
    insight: string
    category: 'rapport' | 'discovery' | 'objections' | 'closing' | 'general'
  }>
  _meta?: {
    reasoning: string
    confidence: 'high' | 'medium' | 'low'
    transcriptQuality: 'excellent' | 'good' | 'fair' | 'poor'
  }
}

interface RequestBody {
  transcript: string
  context?: AnalysisContext
}

// ============================================
// LOGGING HELPERS
// ============================================

function logSection(title: string, content: unknown) {
  console.log('\n' + '='.repeat(60))
  console.log(`📋 ${title}`)
  console.log('='.repeat(60))
  if (typeof content === 'string') {
    // Truncate long strings for readability
    const maxLength = 2000
    if (content.length > maxLength) {
      console.log(content.slice(0, maxLength) + `\n... [truncated, ${content.length} total chars]`)
    } else {
      console.log(content)
    }
  } else {
    console.log(JSON.stringify(content, null, 2))
  }
}

export default async function handler(req: Request) {
  const requestId = Math.random().toString(36).slice(2, 9)
  console.log(`\n${'#'.repeat(60)}`)
  console.log(`# REQUEST ID: ${requestId}`)
  console.log(`# TIMESTAMP: ${new Date().toISOString()}`)
  console.log(`${'#'.repeat(60)}`)

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
      console.error('❌ GROQ_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'API configuratie fout. Check GROQ_API_KEY.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()
    const { transcript, context } = body

    // Log incoming request
    logSection('INCOMING REQUEST', {
      transcriptLength: transcript?.length || 0,
      transcriptPreview: transcript?.slice(0, 500) + '...',
      context: context,
    })

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

    logSection('ANALYSIS CONTEXT', analysisContext)

    const systemPrompt = buildSystemPrompt(analysisContext)
    const userPrompt = buildUserPrompt(truncatedTranscript)

    // Log the full prompts being sent
    logSection('SYSTEM PROMPT (sent to LLM)', systemPrompt)
    logSection('USER PROMPT (sent to LLM)', userPrompt)

    const groq = new Groq({ apiKey })

    console.log('\n⏳ Sending request to Groq API...')
    const startTime = Date.now()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2048, // Increased for expanded schema
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const duration = Date.now() - startTime
    console.log(`✅ Groq API responded in ${duration}ms`)

    // Log raw API response
    logSection('RAW GROQ RESPONSE', {
      id: completion.id,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from Groq')
    }

    logSection('RAW JSON CONTENT FROM LLM', content)

    // Parse and validate
    const analysis: CoachingAnalysis = JSON.parse(content)

    logSection('PARSED ANALYSIS OBJECT', analysis)

    // Log summary stats
    console.log('\n📊 ANALYSIS SUMMARY:')
    console.log(`   - Scores: ${analysis.scores?.map(s => `${s.category}=${s.score}`).join(', ')}`)
    console.log(`   - Strengths: ${analysis.strengths?.length || 0}`)
    console.log(`   - Critical Moments: ${analysis.criticalMoments?.length || 0}`)
    console.log(`   - Action Points: ${analysis.actionPoints?.length || 0}`)
    console.log(`   - Observations: ${analysis.observations?.length || 0}`)
    if (analysis._meta) {
      console.log(`   - AI Confidence: ${analysis._meta.confidence}`)
      console.log(`   - Transcript Quality: ${analysis._meta.transcriptQuality}`)
    }

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('\n❌ API ERROR:', errorMessage)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }

    return new Response(
      JSON.stringify({
        error: 'Analyse mislukt. Probeer opnieuw.',
        debug: errorMessage
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
