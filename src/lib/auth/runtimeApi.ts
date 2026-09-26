import { savvytripAuthConfig } from '../../config/savvytripAuthConfig'

const LOCAL_API = 'http://localhost:5000'

function isLocalDevHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

/** API server origin without `/api`. */
export function getApiOrigin() {
  const configured = savvytripAuthConfig.apiOrigin
  if (configured) return configured
  // Same-origin + Vite proxy only during `vite dev` — not `vite preview` or production.
  if (import.meta.env.DEV && isLocalDevHost()) {
    if (typeof window !== 'undefined') return window.location.origin
    return LOCAL_API
  }
  const envFallback = normalizeApiOrigin(import.meta.env.VITE_DEFAULT_API_ORIGIN)
  return envFallback || 'https://api.final10.app'
}

function normalizeApiOrigin(raw: unknown): string | null {
  const trimmed = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '')
  return trimmed || null
}

export function getApiBaseUrl() {
  const origin = getApiOrigin()
  return origin ? `${origin}/api` : null
}

export function buildAuthUrl(action: string) {
  const base = getApiBaseUrl()
  const segment = String(action || '').replace(/^\/+/, '')
  return base ? `${base}/auth/${segment}` : null
}

const OAUTH_RETURN_STORAGE_KEY = 'savvy_oauth_return_to'

export function stashOAuthReturnTo(path: string) {
  if (typeof window === 'undefined') return
  const trimmed = String(path || '').trim()
  if (!trimmed.startsWith('/')) return
  sessionStorage.setItem(OAUTH_RETURN_STORAGE_KEY, trimmed)
}

export function consumeOAuthReturnTo(fallback = '/') {
  if (typeof window === 'undefined') return fallback
  const stored = sessionStorage.getItem(OAUTH_RETURN_STORAGE_KEY)
  sessionStorage.removeItem(OAUTH_RETURN_STORAGE_KEY)
  if (stored && stored.startsWith('/')) return stored
  return fallback
}

/** OAuth start URL — passes browser origin so API redirects back to this app (not Final10). */
export function buildOAuthStartUrl(provider: string, options?: { returnTo?: string }) {
  const base = buildAuthUrl(provider)
  if (!base) return null
  if (typeof window === 'undefined') return base
  if (options?.returnTo) stashOAuthReturnTo(options.returnTo)
  const params = new URLSearchParams({ client_origin: window.location.origin })
  return `${base}?${params.toString()}`
}
