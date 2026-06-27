import { ConnectedAppsPanel } from '../components/ecosystem/ConnectedAppsPanel'
import { SectionHeading } from '../components/ui/SectionHeading'
import { LiveIndicator } from '../components/ui/LiveIndicator'

export function AppsPage() {
  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="apps-heading"
        eyebrow="Savvy Universe"
        title="Connected apps — your travel mesh."
        description="Final10, EZStay, and AI-Go sync status for the active trip window."
        action={<LiveIndicator label="Mesh online" />}
      />
      <ConnectedAppsPanel />
    </section>
  )
}
