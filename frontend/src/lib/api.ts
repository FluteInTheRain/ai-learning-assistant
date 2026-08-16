import type { TrackPreference } from '../content/types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      typeof body?.detail === 'string' ? body.detail : `Request failed (${response.status})`
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}

export interface AuthUser {
  id: string
  full_name: string
  email: string
  track_preference: TrackPreference
  created_at: string
}

export interface AuthResponse {
  user: AuthUser
  access_token: string
  token_type: string
}

export interface SignupPayload {
  full_name: string
  email: string
  password: string
  track_preference: TrackPreference
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface LoginPayload {
  email: string
  password: string
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
