/**
 * Fathom Transcript Endpoint
 * Fetches transcript for a specific meeting/recording
 */

export const config = {
  runtime: 'edge',
}

const FATHOM_API_URL = 'https://api.fathom.ai/external/v1'

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const accessToken = authHeader.slice(7)

    // Extract recording ID from URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const recordingId = pathParts[pathParts.length - 1]

    if (!recordingId) {
      return new Response(
        JSON.stringify({ error: 'Recording ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Fetch transcript from Fathom (OAuth apps must use this separate endpoint)
    const fathomResponse = await fetch(
      `${FATHOM_API_URL}/recordings/${recordingId}/transcript`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!fathomResponse.ok) {
      const errorText = await fathomResponse.text()
      console.error('[Fathom] Transcript fetch failed:', fathomResponse.status, errorText)

      if (fathomResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Fathom session expired, please reconnect' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (fathomResponse.status === 404) {
        return new Response(
          JSON.stringify({ error: 'Transcript not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch transcript from Fathom' }),
        { status: fathomResponse.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await fathomResponse.json()

    // Format transcript for easier consumption
    const formattedTranscript = {
      id: recordingId,
      meeting_id: recordingId,
      text: formatTranscriptText(data),
      segments: data.segments || data.transcript || [],
    }

    return new Response(JSON.stringify(formattedTranscript), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[Fathom] Transcript error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Helper to format transcript segments into readable text
function formatTranscriptText(data: { segments?: Array<{ speaker?: string; text: string }> }): string {
  if (!data.segments || !Array.isArray(data.segments)) {
    return ''
  }

  return data.segments
    .map(segment => {
      const speaker = segment.speaker || 'Speaker'
      return `${speaker}: ${segment.text}`
    })
    .join('\n')
}
