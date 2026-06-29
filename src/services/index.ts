import type { SavvyTripServices } from './interfaces'
import { mockActivityService } from './adapters/mock/activity'
import { mockAlertsService } from './adapters/mock/alerts'
import { mockCopilotService } from './adapters/mock/copilot'
import { mockDealsService } from './adapters/mock/deals'
import { mockPlannerService } from './adapters/mock/planner'
import { mockSavedTripsService } from './adapters/mock/savedTrips'
import { mockScoutService } from './adapters/mock/scout'
import { mockTravelSearchService } from './adapters/mock/travelSearch'
import { mockTrendsService } from './adapters/mock/trends'

export type ServiceAdapterKind = 'mock' | 'api'

function resolveAdapterKind(): ServiceAdapterKind {
  const env = import.meta.env.VITE_SAVVYTRIP_ADAPTER
  return env === 'api' ? 'api' : 'mock'
}

/** Singleton service registry — swap adapter via VITE_SAVVYTRIP_ADAPTER=api when backends land. */
export function createSavvyTripServices(): SavvyTripServices {
  const kind = resolveAdapterKind()
  if (kind === 'api') {
    throw new Error(
      'API adapter not wired yet. Set VITE_SAVVYTRIP_ADAPTER=mock or omit until Core Phase 2+ backends ship.',
    )
  }

  return {
    travelSearch: mockTravelSearchService,
    savedTrips: mockSavedTripsService,
    deals: mockDealsService,
    trends: mockTrendsService,
    activity: mockActivityService,
    copilot: mockCopilotService,
    alerts: mockAlertsService,
    scout: mockScoutService,
    planner: mockPlannerService,
  }
}

let cached: SavvyTripServices | null = null

export function getSavvyTripServices(): SavvyTripServices {
  if (!cached) cached = createSavvyTripServices()
  return cached
}

export { mockEcosystemService, type EcosystemService } from './adapters/mock/ecosystem'
