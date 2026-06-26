import { ezstayHotels } from '../../data/ecosystemMockData'
import { EZStayHotelCard } from '../ecosystem/EZStayHotelCard'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function EZStaySection() {
  return (
    <section id="ezstay" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="ezstay-heading"
        eyebrow="EZStay"
        title="Stays that respect your route, not random hotel SEO."
        description="Luxury, value, ratings, and airport proximity — each card shows nightly price, savings vs median, rewards, and a direct EZStay path."
        action={<LiveIndicator label="Rates live" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ezstayHotels.map((h) => (
          <EZStayHotelCard key={h.id} hotel={h} />
        ))}
      </div>
    </section>
  )
}
