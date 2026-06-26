import { unifiedRewards } from '../../data/ecosystemMockData'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function UnifiedRewardsSection() {
  const u = unifiedRewards

  return (
    <section id="unified-rewards" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="unified-rewards-heading"
        eyebrow="Unified rewards tracker"
        title="One ledger for ecosystem points and real dollars saved."
        description="Travel wins from SavvyTrip + EZStay + AI-Go, shopping wins from Final10, and combo bonuses — aggregated for the month (mock)."
        action={<LiveIndicator label="Rewards sync" />}
      />
      <GlassPanel className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" glow>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Total ecosystem points</p>
            <p className="mt-1 font-outfit text-4xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-violet-200">
              {u.ecosystemPointsTotal.toLocaleString('en-US')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:border-sky-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Monthly savings</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-white">{u.monthlySavingsUsd}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:border-violet-400/25">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Combo bonuses</p>
              <p className="mt-1 font-outfit text-xl font-semibold text-violet-200 tabular-nums">
                +{u.comboBonusesSavvy.toLocaleString('en-US')} Savvy
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-300/80">Travel savings</p>
            <p className="mt-1 font-outfit text-2xl font-semibold text-sky-100">{u.travelSavingsUsd}</p>
            <p className="mt-1 text-[11px] text-slate-500">SavvyTrip · EZStay · AI-Go</p>
          </div>
          <div className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/5 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fuchsia-300/80">Shopping savings</p>
            <p className="mt-1 font-outfit text-2xl font-semibold text-fuchsia-100">{u.shoppingSavingsUsd}</p>
            <p className="mt-1 text-[11px] text-slate-500">Final10 quick snipes</p>
          </div>
        </div>
      </GlassPanel>
    </section>
  )
}
