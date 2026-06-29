import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { EZStayHotelCard } from '../ecosystem/EZStayHotelCard'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function EZStaySection() {
  const loader = useMemo(() => () => mockEcosystemService.getEZStayHotels(), [])
  const { state, reload } = useAsyncData(loader, [])
  const loading = state.status === 'loading' || state.status === 'idle'
  const hotels = state.status === 'success' ? state.data : []

  return (
    <section id="ezstay" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="ezstay-heading"
        eyebrow="EZStay"
        title="Stays that respect your route, not random hotel SEO."
        description="Mock /integrations/ezstay/hotels BFF — rewardsSavvy display only until Core rewards connects."
        action={<LiveIndicator label="Rates live" />}
      />
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {hotels.map((h) => (
            <EZStayHotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </RequestState>
    </section>
  )
}
