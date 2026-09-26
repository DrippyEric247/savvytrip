import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SavvyTripCoreStatusPanel } from '../../components/core/SavvyTripCoreStatusPanel'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { useAuth } from '../../context/AuthContext'
import { useSavvyCore } from '../../context/SavvyCoreContext'
import {
  fetchSavvyTripProofBootstrap,
  runSavvyTripCoreProofFull,
  runSavvyTripProofParity,
  savvyTripProofAwardSavvy,
  savvyTripProofAwardXp,
  savvyTripProofProgressContract,
  savvyTripProofSecurityTests,
  savvyTripProofUnlockCosmetic,
  savvyTripProofVerifyLedger,
  type SavvyTripCoreProofSummary,
} from '../../lib/savvyCore/client'

function isAdminUser(user: Record<string, unknown> | null | undefined) {
  const role = String(user?.role || '').toLowerCase()
  return role === 'admin' || role === 'superadmin'
}

function Badge({ ok, label }: { ok: boolean | null; label: string }) {
  if (ok == null) return <span className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400">{label}: —</span>
  return (
    <span
      className={`rounded-lg border px-2 py-1 text-xs ${ok ? 'border-emerald-500/40 text-emerald-300' : 'border-red-500/40 text-red-300'}`}
    >
      {label}: {ok ? 'PASS' : 'FAIL'}
    </span>
  )
}

export function SavvyTripCoreProofPage() {
  const { user, loading: authLoading } = useAuth()
  const { refresh, setLastLedgerHint } = useSavvyCore()
  const [proofRunId, setProofRunId] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [fullSummary, setFullSummary] = useState<SavvyTripCoreProofSummary | null>(null)
  const [fullPass, setFullPass] = useState<boolean | null>(null)
  const [parityPass, setParityPass] = useState<boolean | null>(null)
  const [lastIdempotency, setLastIdempotency] = useState<string | null>(null)

  const admin = useMemo(() => isAdminUser(user as Record<string, unknown>), [user])

  useEffect(() => {
    if (!admin || authLoading) return
    fetchSavvyTripProofBootstrap()
      .then((data) => {
        const id = typeof data.proofRunId === 'string' ? data.proofRunId : ''
        if (id) setProofRunId(id)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Bootstrap failed'))
  }, [admin, authLoading])

  const runAction = useCallback(
    async (label: string, fn: () => Promise<Record<string, unknown>>) => {
      if (!proofRunId) {
        setError('proofRunId missing — reload bootstrap.')
        return null
      }
      setBusy(label)
      setError('')
      try {
        const result = await fn()
        await refresh()
        const tx = result.transaction as { sourceApp?: string; idempotencyKey?: string } | undefined
        if (tx?.idempotencyKey) {
          setLastLedgerHint(`${tx.sourceApp || 'savvytrip'} · ${tx.idempotencyKey}`)
        }
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed')
        return null
      } finally {
        setBusy('')
      }
    },
    [proofRunId, refresh, setLastLedgerHint],
  )

  if (authLoading) {
    return <p className="p-8 text-slate-400">Loading session…</p>
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <p className="text-slate-300">Sign in to run SavvyTrip Core proof.</p>
        <Link to="/login" className="mt-4 inline-block text-sky-400 underline">
          Login
        </Link>
      </div>
    )
  }

  if (!admin) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="font-outfit text-2xl font-bold text-white">Savvy Core proof</h1>
        <p className="mt-2 text-slate-400">Admin access required for mutation proof. Your live Core reads are on the wallet page.</p>
        <Link to="/wallet" className="mt-4 inline-block text-sky-400 underline">
          Wallet & Core status
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 pb-24">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-400/80">App #2 integration</p>
        <h1 className="font-outfit text-3xl font-bold text-white">SavvyTrip × Savvy Core proof</h1>
        <p className="mt-2 text-sm text-slate-400">
          Uses canonical app <code className="text-sky-200">savvytrip</code> and the configured proof test subject (same as Final10 production proof).
        </p>
        <p className="mt-1 font-mono text-xs text-slate-500">proofRunId: {proofRunId || '—'}</p>
      </div>

      <SavvyTripCoreStatusPanel showProofLink={false} />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {lastIdempotency ? <p className="text-sm text-emerald-300">{lastIdempotency}</p> : null}

      <GlassPanel className="space-y-3 p-5">
        <h2 className="font-semibold text-white">Controlled actions</h2>
        <div className="flex flex-wrap gap-2">
          <NeonButton
            disabled={!!busy}
            onClick={() =>
              void runAction('parity', async () => {
                const r = await runSavvyTripProofParity()
                setParityPass(Boolean(r.pass))
                return r
              })
            }
          >
            Read parity
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            onClick={() =>
              void runAction('+10 Savvy', async () => savvyTripProofAwardSavvy(proofRunId))
            }
          >
            AWARD +10 SAVVY FROM SAVVYTRIP
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            variant="outline"
            onClick={() =>
              void runAction('idempotency', async () => {
                const r = await savvyTripProofAwardSavvy(proofRunId, { retry: true })
                const pass = Boolean(r.pass)
                setLastIdempotency(pass ? 'IDEMPOTENCY: PASS' : 'IDEMPOTENCY: FAIL')
                return r
              })
            }
          >
            RETRY LAST IDEMPOTENCY KEY
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            onClick={() => void runAction('+25 XP', async () => savvyTripProofAwardXp(proofRunId))}
          >
            AWARD +25 XP FROM SAVVYTRIP
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            onClick={() => void runAction('contract', async () => savvyTripProofProgressContract(proofRunId))}
          >
            PROGRESS TEST CONTRACT
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            onClick={() => void runAction('cosmetic', async () => savvyTripProofUnlockCosmetic(proofRunId))}
          >
            Unlock proof cosmetic
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            variant="ghost"
            onClick={() => void runAction('ledger', async () => savvyTripProofVerifyLedger(proofRunId))}
          >
            Verify ledger
          </NeonButton>
          <NeonButton
            disabled={!!busy}
            variant="ghost"
            onClick={() => void runAction('security', async () => savvyTripProofSecurityTests())}
          >
            Security negatives
          </NeonButton>
        </div>
        {busy ? <p className="text-xs text-slate-500">Running: {busy}…</p> : null}
      </GlassPanel>

      <GlassPanel className="space-y-3 p-5">
        <NeonButton
          className="w-full sm:w-auto"
          disabled={!!busy}
          onClick={() => {
            setBusy('full')
            setError('')
            runSavvyTripCoreProofFull(proofRunId)
              .then(async (r) => {
                setFullSummary(r.summary)
                setFullPass(r.pass)
                setParityPass(r.summary.readParity)
                if (r.pass) setLastIdempotency('SAVVYTRIP APP #2 PROOF: PASS')
                await refresh()
              })
              .catch((err) => setError(err instanceof Error ? err.message : 'Full proof failed'))
              .finally(() => setBusy(''))
          }}
        >
          RUN SAVVYTRIP CORE PROOF
        </NeonButton>
        {fullPass != null ? (
          <p className={`text-lg font-semibold ${fullPass ? 'text-emerald-400' : 'text-red-400'}`}>
            {fullPass ? 'SAVVYTRIP APP #2 PROOF: PASS' : 'SAVVYTRIP APP #2 PROOF: FAIL'}
          </p>
        ) : null}
        {fullSummary ? (
          <div className="flex flex-wrap gap-2">
            {(Object.entries(fullSummary) as [string, boolean][]).map(([key, val]) => (
              <Badge key={key} ok={val} label={key} />
            ))}
          </div>
        ) : null}
        {parityPass != null ? <p className="text-sm text-slate-400">APP #2 READ PARITY: {parityPass ? 'PASS' : 'FAIL'}</p> : null}
      </GlassPanel>

      <Link to="/wallet" className="text-sm text-sky-400 underline">
        ← Back to wallet
      </Link>
    </div>
  )
}
