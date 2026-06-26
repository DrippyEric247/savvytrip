import { ecosystemActivityFeed } from '../../data/ecosystemMockData'
import { EcosystemActivityList } from '../ecosystem/EcosystemActivityList'
import { GlassPanel } from '../ui/GlassPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function EcosystemActivitySection() {
  return (
    <section id="ecosystem-activity" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="ecosystem-activity-heading"
        eyebrow="Ecosystem activity feed"
        title="Points, savings, and optimizations — across every Savvy surface."
        description="See how Final10, EZStay, and AI-Go reinforce the same trip: redemptions, snipes, route fixes, and combo bonuses in one stream."
        action={<LiveIndicator label="Ingest live" />}
      />
      <GlassPanel glow>
        <EcosystemActivityList items={ecosystemActivityFeed} />
      </GlassPanel>
    </section>
  )
}
