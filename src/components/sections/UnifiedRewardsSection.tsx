import { CORE_INTEGRATION } from '../../lib/coreIntegrationPoints'
import { CoreBlockedPanel } from '../ui/CoreBlockedPanel'
import { CoreDependencyBanner } from '../ui/CoreDependencyBanner'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

const previewRows = [
  { label: 'Total ecosystem points', value: '—' },
  { label: 'Monthly savings', value: '—' },
  { label: 'Travel savings', value: '—' },
  { label: 'Shopping savings', value: '—' },
  { label: 'Combo bonuses', value: '—' },
]

export function UnifiedRewardsSection() {
  return (
    <section id="unified-rewards" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <CoreDependencyBanner feature="Unified rewards ledger" waitingOn="@savvy/core rewards store + /ecosystem/rewards/summary" />
      <SectionHeading
        id="unified-rewards-heading"
        eyebrow="Unified rewards tracker"
        title="One ledger for ecosystem points and real dollars saved."
        description="Aggregates travel wins from SavvyTrip, EZStay, and AI-Go with shopping wins from the Savvy Universe — activates when Core rewards and the ecosystem BFF connect."
        action={<LiveIndicator label="Pending sync" />}
      />
      <CoreBlockedPanel
        title="Rewards summary not yet connected"
        description="This panel will show your combined Savvy balance activity, monthly savings, and cross-app combo bonuses once the shared rewards store and ecosystem summary API are wired."
        integrationTodo={CORE_INTEGRATION.REWARDS_SUMMARY}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previewRows.map((row) => (
            <div key={row.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{row.label}</p>
              <p className="mt-1 font-outfit text-2xl font-semibold tabular-nums text-slate-600">{row.value}</p>
            </div>
          ))}
        </div>
      </CoreBlockedPanel>
    </section>
  )
}
