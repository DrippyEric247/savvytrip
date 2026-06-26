import { savedTrips } from '../../data/mockData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { SectionHeading } from '../ui/SectionHeading'

const statusLabel: Record<(typeof savedTrips)[number]['status'], string> = {
  draft: 'Draft',
  booked: 'Booked',
  watching: 'Watching prices',
}

const statusStyle: Record<(typeof savedTrips)[number]['status'], string> = {
  draft: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
  booked: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  watching: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
}

export function SavedTripsSection() {
  return (
    <section id="saved" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="saved-heading"
        eyebrow="Saved trips"
        title="Itineraries you are shaping, watching, or ready to book."
        description="Each card tracks status, dates, and future sync slots for collaborators and corporate policy — placeholders for now."
        action={<NeonButton variant="ghost">New trip</NeonButton>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {savedTrips.map((trip) => (
          <GlassPanel key={trip.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-outfit text-lg font-semibold text-white">{trip.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{trip.dates}</p>
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
              <NeonButton variant="outline" className="flex-1">
                Open
              </NeonButton>
              <NeonButton variant="ghost" className="flex-1">
                Share
              </NeonButton>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>
  )
}
