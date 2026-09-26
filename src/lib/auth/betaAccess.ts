import type { AuthUser } from './api'

function isAdminUser(user: AuthUser | null | undefined) {
  const role = String(user?.role || '').toLowerCase()
  return role === 'admin' || role === 'superadmin'
}

/** Shared Savvy Universe beta gate — uses API `betaTester` / founding flags only. */
export function hasSavvyTripBetaAccess(user: AuthUser | null | undefined) {
  if (!user) return false
  if (isAdminUser(user)) return true
  if (user.betaTester === true) return true
  if (user.foundingAccess === true) return true
  if (user.isBetaTester === true) return true
  if (user.foundingTesterActive === true) return true
  if (user.foundingTesterAccess === true) return true
  return false
}

export function isCoreProofHarnessEnabled() {
  if (import.meta.env.DEV) return true
  return String(import.meta.env.VITE_ENABLE_CORE_PROOF || '').toLowerCase() === 'true'
}
