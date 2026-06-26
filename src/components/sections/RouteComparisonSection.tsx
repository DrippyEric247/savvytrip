import { routeOptions } from '../../data/mockData'
import { RouteCard } from '../cards/RouteCard'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function RouteComparisonSection() {
  const cheapest = routeOptions.find((r) => r.id === 'cheapest')!
  const fastest = routeOptions.find((r) => r.id === 'fastest')!
  const best = routeOptions.find((r) => r.id === 'best')!

  return (
    <section id="routes" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="routes-heading"
        eyebrow="Route intelligence"
        title="Cheapest, fastest, and best overall — side by side."
        description="Every card is a composed itinerary, not a single ticket. Compare how SavvyTrip trades time, money, and comfort before you commit."
        action={<LiveIndicator label="Ranking live" />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <RouteCard route={cheapest} />
        <RouteCard route={fastest} />
        <RouteCard route={best} />
      </div>
    </section>
  )
}
