function normalizeApiOrigin(raw: unknown): string | null {
  const trimmed = String(raw ?? '')
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '')
  return trimmed || null
}

/** SavvyTrip auth settings — swap to @savvy/core/auth when Core Phase 3 lands. */
export const savvytripAuthConfig = {
  appId: 'savvytrip',
  storageKey: 'savvy_universe_token',
  /** Set via VITE_API_URL; otherwise runtimeApi picks dev proxy or production host. */
  apiOrigin: normalizeApiOrigin(import.meta.env.VITE_API_URL),
  /** Public site URL (Vercel/production) — for branding and OAuth registration docs. */
  publicAppOrigin: normalizeApiOrigin(import.meta.env.VITE_PUBLIC_APP_ORIGIN),
} as const

export type SavvyTripAuthConfig = typeof savvytripAuthConfig
