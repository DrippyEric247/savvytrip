import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { Final10SnipeCard } from '../ecosystem/Final10SnipeCard'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function Final10Section() {
  const loader = useMemo(() => () => mockEcosystemService.getFinal10Snipes(), [])
  const { state, reload } = useAsyncData(loader, [])
  const loading = state.status === 'loading' || state.status === 'idle'
  const snipes = state.status === 'success' ? state.data : []

  return (
    <section id="final10" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="final10-heading"
        eyebrow="Final10"
        title="Travel essentials snipes — mock catalog, no live Final10 API."
        description="Illustrative snipe cards from mock adapter. Live Final10 integration deferred intentionally."
        action={<LiveIndicator label="Snipes hot" />}
      />
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {snipes.map((s) => (
            <Final10SnipeCard key={s.id} snipe={s} />
          ))}
        </div>
      </RequestState>
    </section>
  )
}
