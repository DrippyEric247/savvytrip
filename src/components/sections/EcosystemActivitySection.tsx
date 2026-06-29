import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { EcosystemActivityList } from '../ecosystem/EcosystemActivityList'
import { GlassPanel } from '../ui/GlassPanel'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function EcosystemActivitySection() {
  const loader = useMemo(() => () => mockEcosystemService.getActivityFeed(), [])
  const { state, reload } = useAsyncData(loader, [])

  const loading = state.status === 'loading' || state.status === 'idle'
  const items = state.status === 'success' ? state.data : []

  return (
    <section id="ecosystem-activity" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="ecosystem-activity-heading"
        eyebrow="Ecosystem activity feed"
        title="Points, savings, and optimizations — across every Savvy surface."
        description="Mock BFF feed — /ecosystem/feed replaces mockEcosystemService when partner APIs land."
        action={<LiveIndicator label="Ingest live" />}
      />
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <GlassPanel glow>
          <EcosystemActivityList items={items} />
        </GlassPanel>
      </RequestState>
    </section>
  )
}
