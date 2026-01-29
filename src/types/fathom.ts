/**
 * Fathom API Types
 * Based on Fathom API documentation: https://developers.fathom.ai/
 */

export interface FathomMeeting {
  id: string
  title: string
  created_at: string
  duration_seconds: number
  recording_url?: string
  participants?: string[]
}

export interface FathomTranscript {
  id: string
  meeting_id: string
  text: string
  segments?: FathomTranscriptSegment[]
}

export interface FathomTranscriptSegment {
  speaker: string
  text: string
  start_time: number
  end_time: number
}

export interface FathomConnection {
  connected: boolean
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  userEmail?: string
}

export interface FathomOAuthConfig {
  clientId: string
  redirectUri: string
  scopes: string[]
}
