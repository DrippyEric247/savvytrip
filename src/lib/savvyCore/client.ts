import { getApiBaseUrl } from '../auth/runtimeApi'
import { STORAGE_KEY } from '../auth/api'

export const SAVVYTRIP_SOURCE_APP = 'savvytrip' as const

export type SavvyCoreWallet = {
  balance: number
  [key: string]: unknown
}

export type SavvyCoreProgression = {
  accountLevel: number
  prestige: number
  currentXP: number
  [key: string]: unknown
}

export type SavvyTripCoreAccount = {
  sourceApp: typeof SAVVYTRIP_SOURCE_APP
  canonicalUserId: string
  me: Record<string, unknown>
  wallet: SavvyCoreWallet
  progression: SavvyCoreProgression
  syncedAt: string
}

export type SavvyTripCoreProofSummary = {
  coreConnection: boolean
  sameUser: boolean
  readParity: boolean
  savvyAward: boolean
  idempotency: boolean
  xp: boolean
  contract: boolean
  cosmetic: boolean
  ledger: boolean
  security: boolean
  final10Parity: boolean
  savvyTripParity: boolean
}

class SavvyCoreHttpError extends Error {
  status: number
  code?: string

  constructor(status: number, body: { message?: string; code?: string }) {
    super(body.message || 'Savvy Core request failed')
    this.status = status
    this.code = body.code
  }
}

async function coreRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl()
  if (!base) {
    throw new SavvyCoreHttpError(0, { message: 'API URL is not configured.', code: 'API_NOT_CONFIGURED' })
  }

  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${base}${path}`, { ...init, headers })
  let data: Record<string, unknown> = {}
  try {
    data = (await res.json()) as Record<string, unknown>
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new SavvyCoreHttpError(res.status, {
      message: typeof data.message === 'string' ? data.message : undefined,
      code: typeof data.code === 'string' ? data.code : undefined,
    })
  }
  return data as T
}

export async function fetchSavvyTripCoreHealth() {
  return coreRequest<{ ok: boolean; savvyCoreEnabled: boolean; sourceApp: string }>(
    '/savvytrip-core/health',
  )
}

export async function fetchSavvyTripCoreAccount() {
  return coreRequest<SavvyTripCoreAccount>('/savvytrip-core/account')
}

export async function fetchSavvyCoreWalletDirect() {
  return coreRequest<SavvyCoreWallet>('/savvy-core/wallet')
}

export async function fetchSavvyCoreProgressionDirect() {
  return coreRequest<SavvyCoreProgression>('/savvy-core/progression')
}

const PROOF_BASE = '/savvytrip-core-proof'

export async function fetchSavvyTripProofBootstrap(proofRunId?: string) {
  const qs = proofRunId ? `?proofRunId=${encodeURIComponent(proofRunId)}` : ''
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/bootstrap${qs}`)
}

export async function runSavvyTripProofParity() {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/parity`, { method: 'POST' })
}

export async function savvyTripProofAwardSavvy(proofRunId: string, { retry = false } = {}) {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/actions/award-savvy`, {
    method: 'POST',
    body: JSON.stringify({ proofRunId, retry }),
  })
}

export async function savvyTripProofAwardXp(proofRunId: string) {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/actions/award-xp`, {
    method: 'POST',
    body: JSON.stringify({ proofRunId }),
  })
}

export async function savvyTripProofProgressContract(proofRunId: string) {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/actions/progress-contract`, {
    method: 'POST',
    body: JSON.stringify({ proofRunId }),
  })
}

export async function savvyTripProofUnlockCosmetic(proofRunId: string) {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/actions/unlock-cosmetic`, {
    method: 'POST',
    body: JSON.stringify({ proofRunId }),
  })
}

export async function savvyTripProofVerifyLedger(proofRunId: string) {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/ledger/${encodeURIComponent(proofRunId)}`)
}

export async function savvyTripProofSecurityTests() {
  return coreRequest<Record<string, unknown>>(`${PROOF_BASE}/security-tests`, { method: 'POST' })
}

export async function runSavvyTripCoreProofFull(proofRunId?: string) {
  return coreRequest<{ pass: boolean; label: string; summary: SavvyTripCoreProofSummary }>(
    `${PROOF_BASE}/run-full`,
    {
      method: 'POST',
      body: JSON.stringify(proofRunId ? { proofRunId } : {}),
    },
  )
}

export function isSavvyCoreUnavailableError(err: unknown) {
  return (
    err instanceof SavvyCoreHttpError &&
    (err.status === 503 || err.code === 'SAVVY_CORE_UNAVAILABLE' || err.code === 'SAVVY_CORE_DISABLED')
  )
}

export { SavvyCoreHttpError }
