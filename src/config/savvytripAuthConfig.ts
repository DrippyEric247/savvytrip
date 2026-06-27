/** SavvyTrip auth settings — swap to @savvy/core/auth when Core Phase 3 lands. */
export const savvytripAuthConfig = {
  appId: 'savvytrip',
  storageKey: 'savvy_universe_token',
  apiOrigin:
    String(import.meta.env.VITE_API_URL || '')
      .trim()
      .replace(/\/+$/, '')
      .replace(/\/api$/i, '') || 'https://api.final10.app',
} as const

export type SavvyTripAuthConfig = typeof savvytripAuthConfig
