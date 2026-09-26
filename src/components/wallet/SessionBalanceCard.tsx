import { useAuth } from '../../context/AuthContext'
import { useSavvyCore } from '../../context/SavvyCoreContext'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'

function formatSavvy(n: number) {
  return n.toLocaleString('en-US')
}

/**
 * Session balance only — sourced from auth GET /me.
 * Full wallet HUD, tier bands, and activity ledger deferred to @savvy/core.
 */
export function SessionBalanceCard() {
  const { user } = useAuth()
  const { snapshot, unavailable, loading: coreLoading } = useSavvyCore()
  const coreBalance = snapshot?.balance
  const sessionPoints = Number(user?.savvyPoints)
  const points: number | null = Number.isFinite(coreBalance)
    ? (coreBalance as number)
    : Number.isFinite(sessionPoints)
      ? sessionPoints
      : null
  const hasBalance = points != null
  const sourceLabel = Number.isFinite(coreBalance)
    ? 'Savvy Core · authoritative'
    : unavailable
      ? 'Session fallback · Core unavailable'
      : 'Universe account · session'

  return (
    <div className="relative">
      <div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-sky-500/70 via-violet-500/60 to-cyan-400/50 opacity-90 blur-[1px] animate-savvy-border-glow"
        aria-hidden
      />
      <GlassPanel className="relative overflow-hidden p-5 sm:p-6" glow>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-savvy-shimmer" />
        </div>

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Savvy balance</p>
              {hasBalance ? (
                <p className="mt-1 font-outfit text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
                  {formatSavvy(points)}
                  <span className="ml-2 text-lg font-semibold text-sky-300 sm:text-xl">Savvy</span>
                </p>
              ) : (
                <p className="mt-1 font-outfit text-2xl font-semibold text-slate-400">Balance unavailable</p>
              )}
              <p className="mt-1 text-sm text-slate-400">{sourceLabel}</p>
            </div>
            <LiveIndicator
              label={
                coreLoading ? 'Core syncing…' : hasBalance ? (Number.isFinite(coreBalance) ? 'Core synced' : 'Session synced') : 'Awaiting sync'
              }
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-400">
            <p className="font-medium text-slate-300">Core-linked balance active</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed">
              <li>Tier, prestige, and XP shown in the Core status panel</li>
              <li>Rewards must flow through Savvy Core (no local ledger)</li>
              <li>Floating HUD and earn toasts — next Core UI phase</li>
            </ul>
          </div>

          {/* {CORE_INTEGRATION.WALLET_HUD} */}
          {/* {CORE_INTEGRATION.REWARDS_STORE} */}
        </div>
      </GlassPanel>
    </div>
  )
}
