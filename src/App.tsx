import { UniverseBackdrop } from './components/ecosystem/UniverseBackdrop'
import { AppShell } from './components/layout/AppShell'
import { AIGoSection } from './components/sections/AIGoSection'
import { AIAssistantSection } from './components/sections/AIAssistantSection'
import { EcosystemActivitySection } from './components/sections/EcosystemActivitySection'
import { EZStaySection } from './components/sections/EZStaySection'
import { Final10Section } from './components/sections/Final10Section'
import { HeroDashboard } from './components/sections/HeroDashboard'
import { LiveDealsSection } from './components/sections/LiveDealsSection'
import { RouteComparisonSection } from './components/sections/RouteComparisonSection'
import { SavvyWalletSection } from './components/sections/SavvyWalletSection'
import { SavedTripsSection } from './components/sections/SavedTripsSection'
import { SmartComboSection } from './components/sections/SmartComboSection'
import { SmartRouteSearch } from './components/sections/SmartRouteSearch'
import { TrendingDestinationsSection } from './components/sections/TrendingDestinationsSection'
import { UnifiedRewardsSection } from './components/sections/UnifiedRewardsSection'

export function App() {
  return (
    <>
      <UniverseBackdrop />
      <AppShell>
        <HeroDashboard />
        <SavvyWalletSection />
        <EcosystemActivitySection />
        <SmartComboSection />
        <SmartRouteSearch />
        <RouteComparisonSection />
        <EZStaySection />
        <Final10Section />
        <AIGoSection />
        <UnifiedRewardsSection />
        <LiveDealsSection />
        <AIAssistantSection />
        <SavedTripsSection />
        <TrendingDestinationsSection />
      </AppShell>
    </>
  )
}
