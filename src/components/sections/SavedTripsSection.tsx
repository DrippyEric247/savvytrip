import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { SavedTrip } from '../../domain/travel'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'

const statusLabel: Record<SavedTrip['status'], string> = {
  draft: 'Draft',
  booked: 'Booked',
  watching: 'Watching prices',
}

const statusStyle: Record<SavedTrip['status'], string> = {
  draft: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  booked: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  watching: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
}

export function SavedTripsSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.savedTrips.list(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const trips = state.status === 'success' ? state.data : []

  const handleNew = async () => {
    await services.savedTrips.create({
      name: 'New trip draft',
      dates: 'Dates TBD',
      status: 'draft',
    })
    reload()
  }

  const handleRemove = async (id: string) => {
    await services.savedTrips.remove(id)
    reload()
  }

  return (
    <section id="saved" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="saved-heading"
        eyebrow="Saved trips"
        title="Itineraries you are shaping, watching, or ready to book."
        description="Persisted locally via mock adapter — swaps to /travel/saved API without UI changes."
        action={
          <NeonButton variant="ghost" onClick={() => void handleNew()}>
            New trip
          </NeonButton>
        }
      />

      <RequestState loading={loading} error={error} onRetry={reload} empty={!loading && trips.length === 0} emptyMessage="No saved trips yet. Save a route from Routes.">
        <div className="grid gap-4 md:grid-cols-3">
          {trips.map((trip) => (
            <GlassPanel key={trip.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-outfit text-lg font-semibold text-white">{trip.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{trip.dates}</p>
                  {trip.from && trip.to ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {trip.from} → {trip.to}
                    </p>
                  ) : null}
                </div>
                <span
                  className={[
                    'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                    statusStyle[trip.status],
                  ].join(' ')}
                >
                  {statusLabel[trip.status]}
                </span>
              </div>
              <div className="mt-auto flex gap-2">
                {trip.routeId ? (
                  <Link to={`/routes/${trip.routeId}`} className="flex-1">
                    <NeonButton variant="outline" className="w-full">
                      Open
                    </NeonButton>
                  </Link>
                ) : (
                  <NeonButton variant="outline" className="flex-1" disabled>
                    Open
                  </NeonButton>
                )}
                <NeonButton variant="ghost" className="flex-1" onClick={() => void handleRemove(trip.id)}>
                  Remove
                </NeonButton>
              </div>
            </GlassPanel>
          ))}
        </div>
      </RequestState>
    </section>
  )
}
