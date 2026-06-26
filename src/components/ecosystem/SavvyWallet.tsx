import { savvyWallet, walletRecentActivity } from '../../data/ecosystemMockData'
import { appShortName } from './appTokens'
import { LiveIndicator } from '../ui/LiveIndicator'

function formatSavvy(n: number) {
  return n.toLocaleString('en-US')
}

export function SavvyWallet() {
  const w = savvyWallet

  return (
    <div className="relative">
      <div
        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-sky-500/70 via-violet-500/60 to-cyan-400/50 opacity-90 blur-[1px] animate-savvy-border-glow"
        aria-hidden
      />
      <div
        className="absolute -inset-px rounded-2xl p-[1px] animate-savvy-wallet-gain"
        style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.9), rgba(167,139,250,0.85), rgba(34,211,238,0.75))',
        }}
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-glow-md backdrop-blur-xl sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              'radial-gradient(circle at 20% 0%, rgba(56,189,248,0.5), transparent 45%), radial-gradient(circle at 90% 20%, rgba(167,139,250,0.45), transparent 40%)',
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-savvy-shimmer" />
        </div>

        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Universal Savvy Wallet</p>
              <p className="mt-1 font-outfit text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
                {formatSavvy(w.balanceSavvy)}
                <span className="ml-2 text-lg font-semibold text-sky-300 sm:text-xl">Savvy</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Tier <span className="text-slate-200">{w.tierName}</span>
                <span className="text-slate-600"> · </span>
                synced across Savvy Universe
              </p>
            </div>
            <LiveIndicator label="Wallet live" />
          </div>

          {w.crossAppBonusActive && w.connectedApps.length >= 3 ? (
            <div className="relative overflow-hidden rounded-xl border border-violet-400/35 bg-gradient-to-r from-violet-500/15 via-sky-500/10 to-cyan-500/15 px-4 py-3">
              <div className="pointer-events-none absolute inset-0 animate-savvy-combo-ring rounded-xl ring-1 ring-inset ring-violet-400/30" aria-hidden />
              <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Cross-App Bonus Active</p>
                  <p className="text-[11px] text-slate-400">
                    {w.connectedApps.map((id) => appShortName(id)).join(' + ')} connected
                  </p>
                </div>
                <p className="font-outfit text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-violet-200">
                  +{w.ecosystemMultiplier}x Savvy multiplier
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors hover:border-sky-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Multiplier</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-sky-300 tabular-nums">{w.multiplier}x</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors hover:border-violet-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Streak</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-violet-200 tabular-nums">{w.streakDays} day</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors hover:border-cyan-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Session rewards</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-emerald-300 tabular-nums">+{formatSavvy(w.sessionRewardsSavvy)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors hover:border-fuchsia-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Projected savings</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-white tabular-nums">{w.projectedSavingsUsd}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Next tier progress</span>
              <span className="tabular-nums text-sky-200/90">{w.tierProgressPct}%</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-900 ring-1 ring-inset ring-violet-500/25">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-cyan-300 shadow-glow-sm transition-[width] duration-700"
                style={{ width: `${w.tierProgressPct}%` }}
              />
              <div className="pointer-events-none absolute inset-0 mix-blend-screen">
                <div className="h-full w-full translate-x-[-30%] bg-gradient-to-r from-transparent via-white/35 to-transparent animate-savvy-shimmer" />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Recent activity</p>
            <ul className="space-y-2">
              {walletRecentActivity.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-slate-950/50 px-3 py-2 text-sm transition-colors hover:border-sky-400/20"
                >
                  <div className="min-w-0">
                    <p className="truncate text-slate-200">{row.label}</p>
                    <p className="text-[11px] text-slate-500">
                      {row.time} · {appShortName(row.app)}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium tabular-nums text-emerald-300">+{formatSavvy(row.amountSavvy)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
