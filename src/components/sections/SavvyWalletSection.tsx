import { SavvyWallet } from '../ecosystem/SavvyWallet'
import { ConnectedAppsPanel } from '../ecosystem/ConnectedAppsPanel'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function SavvyWalletSection() {
  return (
    <section id="wallet" className="mt-16 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="wallet-heading"
        eyebrow="Savvy Universe"
        title="Universal wallet — one balance, every Savvy app."
        description="Same glowing wallet system as Final10: live multiplier, streaks, tier progress, session rewards, and cross-app bonuses when your trip touches the full mesh."
        action={<LiveIndicator label="Ecosystem linked" />}
      />
      <div className="grid gap-6 lg:grid-cols-5 lg:items-stretch">
        <div className="lg:col-span-3">
          <SavvyWallet />
        </div>
        <div id="connected-apps" className="scroll-mt-28 lg:col-span-2 lg:scroll-mt-24">
          <ConnectedAppsPanel />
        </div>
      </div>
    </section>
  )
}
