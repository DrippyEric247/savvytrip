import { useMemo } from 'react'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function TrendingDestinationsSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.trends.list(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const spots = state.status === 'success' ? state.data : []

  return (
    <section id="trending" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="trending-heading"
        eyebrow="Trending destinations"
        title="Where demand is spiking — before fares follow."
        description="Mock demand signals today; live graph when /travel/trending connects."
        action={<LiveIndicator label="Demand radar" />}
      />

      <RequestState loading={loading} error={error} onRetry={reload} empty={!loading && spots.length === 0}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spots.map((spot) => (
            <GlassPanel key={spot.id} className="overflow-hidden p-0">
              <div className={`h-24 bg-gradient-to-br ${spot.imageGradient}`} />
              <div className="p-4">
                <p className="font-outfit text-lg font-semibold text-white">
                  {spot.city}
                  <span className="ml-1 text-sm font-normal text-slate-400">{spot.country}</span>
                </p>
                <p className="mt-2 text-xs font-medium text-sky-300">{spot.delta}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </RequestState>
    </section>
  )
}
