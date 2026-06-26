import { liveDeals, type RouteMode } from '../../data/mockData'

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
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { SectionHeading } from '../ui/SectionHeading'
import { ModeIcon } from '../icons/TravelIcons'

export function LiveDealsSection() {
  return (
    <section id="deals" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="deals-heading"
        eyebrow="Live travel deals"
        title="Deals tuned to how SavvyTrip routes, not generic blasts."
        description="Countdowns, cluster-level discounts, and modality tags — built to pair with the optimizer once APIs are wired."
        action={<LiveIndicator label="Deal radar" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {liveDeals.map((deal) => (
          <GlassPanel key={deal.id} className="flex flex-col justify-between">
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
              <span className="font-mono text-sm text-sky-200 tabular-nums">{deal.expires}</span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  )
}
