import { final10Snipes } from '../../data/ecosystemMockData'
import { Final10SnipeCard } from '../ecosystem/Final10SnipeCard'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function Final10Section() {
  return (
    <section id="final10" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="final10-heading"
        eyebrow="Final10"
        title="Quick Snipes for the carry-on, the cabin, and the layover."
        description="Same neon glass energy as Final10: estimated savings, trust score, watcher heat, and ending-soon pressure — tuned for trip context."
        action={<LiveIndicator label="Snipes hot" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {final10Snipes.map((s) => (
          <Final10SnipeCard key={s.id} snipe={s} />
        ))}
      </div>
    </section>
  )
}
