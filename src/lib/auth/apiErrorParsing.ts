/** Normalize fetch/API failures into a small, UI-safe shape (SavvyTrip-local until @savvy/core). */

type ApiFailure = {
  response?: { status?: number; data?: Record<string, unknown> }
  message?: string
}

export function parseApiError(e: unknown) {
  const err = e as ApiFailure
  const status = typeof err?.response?.status === 'number' ? err.response.status : 0
  const data = err?.response?.data && typeof err.response.data === 'object' ? err.response.data : {}
  const nestedMsg =
    data.message && typeof data.message === 'object' && typeof (data.message as { message?: string }).message === 'string'
      ? (data.message as { message: string }).message
      : null
  const code =
    (typeof data.code === 'string' && data.code) ||
    (status === 429 ? 'RATE_LIMITED' : 'REQUEST_FAILED')
  const message =
    nestedMsg ||
    (typeof data.error === 'string' && data.error) ||
    (typeof data.message === 'string' && data.message) ||
    (typeof err?.message === 'string' && err.message) ||
    'Something went wrong. Please try again.'
  return { status, code, message }
}

export function userSafeErrorMessage(e: unknown, fallback = 'Something went wrong. Please try again.') {
  const { status, message } = parseApiError(e)
  if (status === 401 || status === 403) return 'Your session expired. Please sign in again.'
  if (status === 429) return 'Too many requests right now. Please wait a moment and retry.'
  if (status >= 500) return 'Service is temporarily unavailable. Please try again shortly.'
  if (!status) return 'Network error. Check your connection and try again.'
  if (typeof message === 'string' && message.trim()) return message
  return fallback
}
