/**
 * Fathom Meetings List Endpoint
 * Proxies requests to Fathom API with user's access token
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

    // Forward query params
    const url = new URL(req.url)
    const params = new URLSearchParams()

    const createdAfter = url.searchParams.get('created_after')
    const createdBefore = url.searchParams.get('created_before')

    if (createdAfter) params.set('created_after', createdAfter)
    if (createdBefore) params.set('created_before', createdBefore)

    // Fetch meetings from Fathom
    // Note: OAuth apps cannot use include_transcript, must use separate endpoint
    const fathomResponse = await fetch(
      `${FATHOM_API_URL}/meetings?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!fathomResponse.ok) {
      const errorText = await fathomResponse.text()
      console.error('[Fathom] Meetings fetch failed:', fathomResponse.status, errorText)

      if (fathomResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Fathom session expired, please reconnect' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch meetings from Fathom' }),
        { status: fathomResponse.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await fathomResponse.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[Fathom] Meetings error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
