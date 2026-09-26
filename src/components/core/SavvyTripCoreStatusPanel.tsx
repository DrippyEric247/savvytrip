import { useSavvyCore } from '../../context/SavvyCoreContext'
import { SAVVYTRIP_SOURCE_APP } from '../../lib/savvyCore/client'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'

function fmt(n: number | undefined) {
  if (!Number.isFinite(n)) return '—'
  return n!.toLocaleString('en-US')
}

type SavvyTripCoreStatusPanelProps = {
  showProofLink?: boolean
}

/** Dev / proof panel — authoritative Savvy Core read for the signed-in user. */
export function SavvyTripCoreStatusPanel({ showProofLink = true }: SavvyTripCoreStatusPanelProps) {
  const { snapshot, loading, error, unavailable, refresh, lastLedgerHint } = useSavvyCore()

  const connected = Boolean(snapshot) && !unavailable

  return (
    <GlassPanel className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-400/90">
            SavvyTrip × Savvy Core
          </p>
          <h2 className="mt-1 font-outfit text-xl font-bold text-white">Core status</h2>
        </div>
        <NeonButton type="button" variant="ghost" className="text-xs" onClick={() => void refresh()} disabled={loading}>
          {loading ? 'Syncing…' : 'Refresh'}
        </NeonButton>
      </div>

      <p
        className={`mt-4 text-sm font-semibold ${connected ? 'text-emerald-400' : unavailable ? 'text-amber-300' : 'text-slate-400'}`}
      >
        {connected ? 'SAVVY CORE CONNECTED ✓' : unavailable ? error : loading ? 'Connecting…' : error || 'Not synced'}
      </p>

      {snapshot ? (
        <dl className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Canonical user ID</dt>
            <dd className="font-mono text-xs break-all">{snapshot.canonicalUserId}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Source app</dt>
            <dd>{SAVVYTRIP_SOURCE_APP}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Balance</dt>
            <dd className="tabular-nums text-lg font-semibold text-white">{fmt(snapshot.balance)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Account level</dt>
            <dd className="tabular-nums">{fmt(snapshot.accountLevel)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Prestige</dt>
            <dd className="tabular-nums">{fmt(snapshot.prestige)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Account XP</dt>
            <dd className="tabular-nums">{fmt(snapshot.accountXp)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Last sync</dt>
            <dd className="text-xs text-slate-400">{snapshot.syncedAt}</dd>
          </div>
        </dl>
      ) : null}

      {lastLedgerHint ? (
        <p className="mt-4 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
          Latest SavvyTrip ledger: {lastLedgerHint}
        </p>
      ) : null}

      {showProofLink ? (
        <p className="mt-4 text-xs text-slate-500">
          Admin proof harness:{' '}
          <a href="/dev/savvy-core-proof" className="text-sky-400 underline-offset-2 hover:underline">
            RUN SAVVYTRIP CORE PROOF
          </a>
        </p>
      ) : null}
    </GlassPanel>
  )
}
