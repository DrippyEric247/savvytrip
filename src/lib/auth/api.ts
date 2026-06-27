import { savvytripAuthConfig } from '../../config/savvytripAuthConfig'
import { getApiBaseUrl } from './runtimeApi'

export const STORAGE_KEY = savvytripAuthConfig.storageKey

export type AuthUser = {
  _id?: string
  id?: string
  email?: string
  username?: string
  firstName?: string
  lastName?: string
  savvyPoints?: number
  [key: string]: unknown
}

type ApiErrorBody = { code?: string; message?: string; error?: string }

class HttpError extends Error {
  response: { status: number; data: ApiErrorBody }

  constructor(status: number, data: ApiErrorBody) {
    super(typeof data.message === 'string' ? data.message : 'Request failed')
    this.response = { status, data }
  }
}

let authHeader: string | null = null

function loadStoredToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

if (typeof window !== 'undefined') {
  const saved = loadStoredToken()
  if (saved) authHeader = `Bearer ${saved}`
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem(STORAGE_KEY, token)
    authHeader = `Bearer ${token}`
  } else {
    localStorage.removeItem(STORAGE_KEY)
    authHeader = null
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl()
  if (!base) throw new HttpError(0, { message: 'API URL is not configured.' })

  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (authHeader && !headers.has('Authorization')) {
    headers.set('Authorization', authHeader)
  }

  const res = await fetch(`${base}${path}`, { ...init, headers })
  let data: ApiErrorBody & Record<string, unknown> = {}
  try {
    data = (await res.json()) as typeof data
  } catch {
    data = {}
  }

  if (!res.ok) throw new HttpError(res.status, data)
  return data as T
}

export async function loginUser(credentials: { email: string; password: string }) {
  const data = await request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  setAuthToken(data.token)
  return data.user
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  referralCode?: string
}

export async function registerUser(payload: RegisterPayload) {
  const data = await request<{ token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setAuthToken(data.token)
  return data.user
}

export async function getMe() {
  return request<AuthUser>('/auth/me')
}

export async function getAuthProviders() {
  try {
    const data = await request<{ google?: boolean; apple?: boolean }>('/auth/providers')
    return { google: Boolean(data.google), apple: Boolean(data.apple) }
  } catch {
    return { google: false, apple: false }
  }
}

export async function requestPasswordReset(email: string) {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: String(email || '').trim() }),
  })
}

export async function submitPasswordReset(body: {
  token: string
  password: string
  confirmPassword: string
}) {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
