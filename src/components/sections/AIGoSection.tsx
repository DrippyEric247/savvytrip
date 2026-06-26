import { aiGoNavCards } from '../../data/ecosystemMockData'
import { AIGoNavCard } from '../ecosystem/AIGoNavCard'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function AIGoSection() {
  return (
    <section id="aigo" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="aigo-heading"
        eyebrow="AI-Go"
        title="Ground truth for traffic, pickups, and last-mile timing."
        description="Live ETAs, traffic glow, and confidence scores — the same intelligent feel as AI-Go navigation cards, orchestrated beside your SavvyTrip legs."
        action={<LiveIndicator label="Traffic mesh" />}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aiGoNavCards.map((c) => (
          <AIGoNavCard key={c.id} card={c} />
        ))}
      </div>
    </section>
  )
}
