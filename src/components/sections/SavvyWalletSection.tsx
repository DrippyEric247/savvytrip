import { SavvyTripCoreStatusPanel } from '../core/SavvyTripCoreStatusPanel'
import { ConnectedAppsPanel } from '../ecosystem/ConnectedAppsPanel'
import { SessionBalanceCard } from '../wallet/SessionBalanceCard'
import { CoreDependencyBanner } from '../ui/CoreDependencyBanner'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function SavvyWalletSection() {
  return (
    <section id="wallet" className="mt-16 scroll-mt-28 lg:scroll-mt-24">
      <CoreDependencyBanner feature="Universal wallet HUD bubble" waitingOn="@savvy/core SavvyWalletBubble (reads now sync from Core)" />
      <SectionHeading
        id="wallet-heading"
        eyebrow="Savvy Universe"
        title="Your Savvy balance — universe-wide."
        description="Session balance from your account. Tier progress, multipliers, and the floating HUD arrive with Savvy Core wallet integration."
        action={<LiveIndicator label="Session linked" />}
      />
      <div className="grid gap-6 lg:grid-cols-5 lg:items-stretch">
        <div className="lg:col-span-3">
          <SessionBalanceCard />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SavvyTripCoreStatusPanel />
          <div id="connected-apps" className="scroll-mt-28 lg:scroll-mt-24">
            <ConnectedAppsPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
