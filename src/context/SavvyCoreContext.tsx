import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  isSavvyCoreUnavailableError,
  type SavvyTripCoreAccount,
} from '../lib/savvyCore/client'
import {
  mapCoreAccountToSnapshot,
  syncSavvyTripCoreAccount,
  type SavvyTripCoreSnapshot,
} from '../lib/savvyCore/savvyTripCoreAdapter'

type SavvyCoreContextValue = {
  snapshot: SavvyTripCoreSnapshot | null
  loading: boolean
  error: string
  unavailable: boolean
  lastLedgerHint: string | null
  refresh: () => Promise<SavvyTripCoreSnapshot | null>
  setLastLedgerHint: (hint: string | null) => void
}

const SavvyCoreContext = createContext<SavvyCoreContextValue | null>(null)

export function SavvyCoreProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth()
  const [snapshot, setSnapshot] = useState<SavvyTripCoreSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unavailable, setUnavailable] = useState(false)
  const [lastLedgerHint, setLastLedgerHint] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!token) {
      setSnapshot(null)
      setError('')
      setUnavailable(false)
      return null
    }
    setLoading(true)
    setError('')
    try {
      const next = await syncSavvyTripCoreAccount()
      setSnapshot(next)
      setUnavailable(false)
      return next
    } catch (err) {
      setSnapshot(null)
      if (isSavvyCoreUnavailableError(err)) {
        setUnavailable(true)
        setError('SAVVY CORE TEMPORARILY UNAVAILABLE')
      } else {
        setUnavailable(false)
        setError(err instanceof Error ? err.message : 'Could not sync Savvy Core.')
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!user || !token) {
      setSnapshot(null)
      return
    }
    void refresh()
  }, [user?._id, user?.id, token, refresh])

  const value = useMemo(
    () => ({
      snapshot,
      loading,
      error,
      unavailable,
      lastLedgerHint,
      refresh,
      setLastLedgerHint,
    }),
    [snapshot, loading, error, unavailable, lastLedgerHint, refresh],
  )

  return <SavvyCoreContext.Provider value={value}>{children}</SavvyCoreContext.Provider>
}

export function useSavvyCore() {
  const ctx = useContext(SavvyCoreContext)
  if (!ctx) throw new Error('useSavvyCore must be used within SavvyCoreProvider')
  return ctx
}

/** @internal test helper */
export function mapAccountForTest(account: SavvyTripCoreAccount) {
  return mapCoreAccountToSnapshot(account)
}
