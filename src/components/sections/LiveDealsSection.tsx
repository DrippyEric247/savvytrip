import { useMemo } from 'react'
import type { LiveDeal, RouteMode } from '../../domain/travel'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useDealCountdown } from '../../hooks/useDealCountdown'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { ModeIcon } from '../icons/TravelIcons'

function modeLabel(mode: RouteMode) {
  switch (mode) {
    case 'flight':
      return 'Flight'
    case 'train':
      return 'Train'
    case 'rideshare':
      return 'Rideshare'
    case 'hotel':
      return 'Hotel'
    default:
      return mode
  }
}

function DealCard({ deal }: { deal: LiveDeal }) {
  const countdown = useDealCountdown(deal.expiresAt)

  return (
    <GlassPanel className="flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300/80">{deal.discount}</p>
        <h3 className="mt-2 font-outfit text-lg font-semibold text-white">{deal.destination}</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {deal.modes.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 px-2 py-1 text-[11px] text-slate-300"
            >
              <ModeIcon mode={m} />
              {modeLabel(m)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
        <span>Resets in</span>
        <span className="font-mono text-sm text-sky-200 tabular-nums">{countdown}</span>
      </div>
    </GlassPanel>
  )
}

export function LiveDealsSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.deals.listLive(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const deals = state.status === 'success' ? state.data : []

  return (
    <section id="deals" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="deals-heading"
        eyebrow="Live travel deals"
        title="Deals tuned to how SavvyTrip routes, not generic blasts."
        description="Live countdown timers from mock expiresAt — SSE stream replaces polling later."
        action={<LiveIndicator label="Deal radar" />}
      />

      <RequestState loading={loading} error={error} onRetry={reload} empty={!loading && deals.length === 0}>
        <div className="grid gap-4 md:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </RequestState>
    </section>
  )
}
