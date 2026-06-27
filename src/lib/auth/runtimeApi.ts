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
  if (isLocalDevHost()) return LOCAL_API
  return 'https://api.final10.app'
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
