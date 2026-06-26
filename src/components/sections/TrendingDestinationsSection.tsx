import { trending } from '../../data/mockData'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function TrendingDestinationsSection() {
  return (
    <section id="trending" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="trending-heading"
        eyebrow="Trending destinations"
        title="Where travelers are pushing the SavvyTrip graph this month."
        description="Gradient tiles echo live demand signals — ready for charts, sparklines, or heatmaps when data pipes in."
        action={<LiveIndicator label="Demand index" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trending.map((spot) => (
          <article
            key={spot.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-[1px] shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow-md"
          >
            <div
              className={[
                'relative h-28 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100',
                spot.imageGradient,
              ].join(' ')}
            />
            <div className="relative space-y-1 px-4 pb-4 pt-3">
              <h3 className="font-outfit text-lg font-semibold text-white">
                {spot.city}
                <span className="text-slate-500"> · {spot.country}</span>
              </h3>
              <p className="text-xs font-medium uppercase tracking-wide text-sky-300/90">{spot.delta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
