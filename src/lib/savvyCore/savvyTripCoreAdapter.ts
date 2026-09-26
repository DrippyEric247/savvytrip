/**
 * SavvyTrip ↔ Savvy Core adapter (browser).
 * All mutations go through Final10 API routes — never local balance writes.
 */
import { SAVVYTRIP_APP_ID } from '../../config/travelScoutMissions'
import {
  fetchSavvyTripCoreAccount,
  SAVVYTRIP_SOURCE_APP,
  type SavvyTripCoreAccount,
} from './client'

export { SAVVYTRIP_SOURCE_APP, SAVVYTRIP_APP_ID }

export type SavvyTripCoreSnapshot = {
  canonicalUserId: string
  balance: number
  accountLevel: number
  prestige: number
  accountXp: number
  syncedAt: string
  sourceApp: typeof SAVVYTRIP_SOURCE_APP
  raw: SavvyTripCoreAccount
}

export function mapCoreAccountToSnapshot(account: SavvyTripCoreAccount): SavvyTripCoreSnapshot {
  return {
    canonicalUserId: account.canonicalUserId,
    balance: Number(account.wallet?.balance ?? 0),
    accountLevel: Number(account.progression?.accountLevel ?? 0),
    prestige: Number(account.progression?.prestige ?? 0),
    accountXp: Number(account.progression?.currentXP ?? 0),
    syncedAt: account.syncedAt,
    sourceApp: SAVVYTRIP_SOURCE_APP,
    raw: account,
  }
}

/** Authoritative read — Savvy Core wallet + progression for the signed-in user. */
export async function syncSavvyTripCoreAccount(): Promise<SavvyTripCoreSnapshot> {
  const account = await fetchSavvyTripCoreAccount()
  return mapCoreAccountToSnapshot(account)
}
