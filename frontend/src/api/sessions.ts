import { request } from './client'
import type { SessionCreate, SessionResponse } from './types'

export function listSessions(): Promise<SessionResponse[]> {
  return request<SessionResponse[]>('/sessions')
}

export function getSession(sessionId: number): Promise<SessionResponse> {
  return request<SessionResponse>(`/sessions/${sessionId}`)
}

export function createSession(input: SessionCreate): Promise<SessionResponse> {
  return request<SessionResponse>('/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
