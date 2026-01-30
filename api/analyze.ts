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
// TYPES
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
    provider?: 'groq' | 'openai'
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
  console.log(`[LOG] ${title}`)
  console.log('='.repeat(60))
  if (typeof content === 'string') {
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

// ============================================
// AI PROVIDERS
// ============================================

interface AIResponse {
  content: string
  provider: 'groq' | 'openai'
  model: string
  usage?: { prompt_tokens?: number; completion_tokens?: number }
}

// Check if error is a rate limit error
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return msg.includes('rate_limit') ||
           msg.includes('tokens per minute') ||
           msg.includes('request too large') ||
           msg.includes('413')
  }
  return false
}

// Call Groq API
async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<AIResponse> {
  const groq = new Groq({ apiKey })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 2048,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from Groq')
  }

  return {
    content,
    provider: 'groq',
    model: completion.model,
    usage: completion.usage,
  }
}

// Call OpenAI API (fallback)
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return {
    content,
    provider: 'openai',
    model: data.model,
    usage: data.usage,
  }
}

// ============================================
// MAIN HANDLER
// ============================================

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
    const groqApiKey = process.env.GROQ_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!groqApiKey && !openaiApiKey) {
      console.error('[ERROR] No API keys configured')
      return new Response(
        JSON.stringify({ error: 'API configuratie fout. Check API keys.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body: RequestBody = await req.json()
    const { transcript, context } = body

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

    // OpenAI has higher limits, so we can allow longer transcripts when falling back
    const MAX_TRANSCRIPT_CHARS_GROQ = 12000
    const MAX_TRANSCRIPT_CHARS_OPENAI = 30000

    const analysisContext: AnalysisContext = {
      experience: context?.experience || null,
      focus: context?.focus || null,
      goal: context?.goal || null,
    }

    logSection('ANALYSIS CONTEXT', analysisContext)

    const systemPrompt = buildSystemPrompt(analysisContext)

    let aiResponse: AIResponse
    let usedProvider: 'groq' | 'openai' = 'groq'

    // Try Groq first (faster & cheaper)
    if (groqApiKey) {
      const truncatedForGroq = transcript.slice(0, MAX_TRANSCRIPT_CHARS_GROQ)
      const userPrompt = buildUserPrompt(truncatedForGroq)

      if (transcript.length > MAX_TRANSCRIPT_CHARS_GROQ) {
        console.log(`[WARN] Transcript truncated for Groq: ${transcript.length} -> ${MAX_TRANSCRIPT_CHARS_GROQ} chars`)
      }

      logSection('SYSTEM PROMPT', systemPrompt)
      logSection('USER PROMPT', userPrompt)

      console.log('\n[API] Trying Groq API first...')
      const startTime = Date.now()

      try {
        aiResponse = await callGroq(systemPrompt, userPrompt, groqApiKey)
        usedProvider = 'groq'
        console.log(`[API] Groq responded in ${Date.now() - startTime}ms`)
      } catch (groqError) {
        console.error('[API] Groq failed:', groqError instanceof Error ? groqError.message : groqError)

        // Fallback to OpenAI if available and it's a rate limit error
        if (openaiApiKey && isRateLimitError(groqError)) {
          console.log('[API] Falling back to OpenAI...')

          // Use longer transcript for OpenAI
          const truncatedForOpenAI = transcript.slice(0, MAX_TRANSCRIPT_CHARS_OPENAI)
          const userPromptOpenAI = buildUserPrompt(truncatedForOpenAI)

          const openaiStartTime = Date.now()
          aiResponse = await callOpenAI(systemPrompt, userPromptOpenAI, openaiApiKey)
          usedProvider = 'openai'
          console.log(`[API] OpenAI responded in ${Date.now() - openaiStartTime}ms`)
        } else {
          throw groqError
        }
      }
    } else if (openaiApiKey) {
      // Only OpenAI configured
      const truncatedForOpenAI = transcript.slice(0, MAX_TRANSCRIPT_CHARS_OPENAI)
      const userPrompt = buildUserPrompt(truncatedForOpenAI)

      logSection('SYSTEM PROMPT', systemPrompt)
      logSection('USER PROMPT', userPrompt)

      console.log('\n[API] Using OpenAI (no Groq key)...')
      const startTime = Date.now()
      aiResponse = await callOpenAI(systemPrompt, userPrompt, openaiApiKey)
      usedProvider = 'openai'
      console.log(`[API] OpenAI responded in ${Date.now() - startTime}ms`)
    } else {
      throw new Error('No API keys available')
    }

    logSection('AI RESPONSE', {
      provider: aiResponse.provider,
      model: aiResponse.model,
      usage: aiResponse.usage,
    })

    logSection('RAW JSON CONTENT', aiResponse.content)

    // Parse and validate
    const analysis: CoachingAnalysis = JSON.parse(aiResponse.content)

    // Add provider info to meta
    if (analysis._meta) {
      analysis._meta.provider = usedProvider
    } else {
      analysis._meta = {
        reasoning: '',
        confidence: 'medium',
        transcriptQuality: 'good',
        provider: usedProvider,
      }
    }

    logSection('PARSED ANALYSIS', analysis)

    console.log('\n[SUMMARY] ANALYSIS SUMMARY:')
    console.log(`   - Provider: ${usedProvider}`)
    console.log(`   - Scores: ${analysis.scores?.map(s => `${s.category}=${s.score}`).join(', ')}`)
    console.log(`   - Strengths: ${analysis.strengths?.length || 0}`)
    console.log(`   - Critical Moments: ${analysis.criticalMoments?.length || 0}`)
    console.log(`   - Action Points: ${analysis.actionPoints?.length || 0}`)
    console.log(`   - Observations: ${analysis.observations?.length || 0}`)

    return new Response(JSON.stringify(analysis), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('\n[ERROR] API ERROR:', errorMessage)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack)
    }

    let userError = 'Analyse mislukt. Probeer opnieuw.'
    let statusCode = 500

    if (isRateLimitError(error)) {
      userError = 'API limiet bereikt. Probeer het later opnieuw.'
      statusCode = 429
    }

    return new Response(
      JSON.stringify({
        error: userError,
        debug: errorMessage
      }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
