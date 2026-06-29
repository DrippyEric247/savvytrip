import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { SmartComboCard } from '../ecosystem/SmartComboCard'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function SmartComboSection() {
  const loader = useMemo(() => () => mockEcosystemService.getCombos(), [])
  const { state, reload } = useAsyncData(loader, [])

  const loading = state.status === 'loading' || state.status === 'idle'
  const combos = state.status === 'success' ? state.data : []

  return (
    <section id="smart-combos" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="smart-combos-heading"
        eyebrow="Smart combo suggestions"
        title="SavvyTrip detects the trip — the universe assembles the stack."
        description="Projected Savvy bonuses are illustrative until Core rewards + combo detection API connect."
        action={<LiveIndicator label="Composer on" />}
      />
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <div className="grid gap-4 md:grid-cols-3">
          {combos.map((c) => (
            <SmartComboCard key={c.id} combo={c} />
          ))}
        </div>
      </RequestState>
    </section>
  )
}
