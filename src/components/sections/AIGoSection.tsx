import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { AIGoNavCard } from '../ecosystem/AIGoNavCard'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function AIGoSection() {
  const loader = useMemo(() => () => mockEcosystemService.getAIGoCards(), [])
  const { state, reload } = useAsyncData(loader, [])
  const loading = state.status === 'loading' || state.status === 'idle'
  const cards = state.status === 'success' ? state.data : []

  return (
    <section id="aigo" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="aigo-heading"
        eyebrow="AI-Go"
        title="Ground truth for traffic, pickups, and last-mile timing."
        description="Mock /integrations/aigo/nav — swap mockEcosystemService for BFF when partner API lands."
        action={<LiveIndicator label="Traffic mesh" />}
      />
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => (
            <AIGoNavCard key={c.id} card={c} />
          ))}
        </div>
      </RequestState>
    </section>
  )
}
