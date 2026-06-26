import { smartCombos } from '../../data/ecosystemMockData'
import { SmartComboCard } from '../ecosystem/SmartComboCard'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function SmartComboSection() {
  return (
    <section id="smart-combos" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="smart-combos-heading"
        eyebrow="Smart combo suggestions"
        title="SavvyTrip detects the trip — the universe assembles the stack."
        description="Bundles are contextual, not spammy: hotels, ground routing, and gear surface only when they reduce friction or cost for the same itinerary window."
        action={<LiveIndicator label="Composer on" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {smartCombos.map((c) => (
          <SmartComboCard key={c.id} combo={c} />
        ))}
      </div>
    </section>
  )
}
