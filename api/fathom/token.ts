/**
 * Fathom OAuth Token Exchange Endpoint
 * Exchanges authorization code for access token
 */

export const config = {
  runtime: 'edge',
}

interface TokenRequest {
  code: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
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
    const clientId = process.env.FATHOM_CLIENT_ID
    const clientSecret = process.env.FATHOM_CLIENT_SECRET
    const redirectUri = process.env.FATHOM_REDIRECT_URI

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'Fathom OAuth not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body: TokenRequest = await req.json()
    const { code } = body

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Authorization code required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://fathom.video/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || '',
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[Fathom] Token exchange failed:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to exchange authorization code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const tokens: TokenResponse = await tokenResponse.json()

    return new Response(JSON.stringify(tokens), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[Fathom] Token error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
