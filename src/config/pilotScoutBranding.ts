/** Pilot Scout — SavvyTrip travel co-pilot persona (extends Core scout branding pattern). */

export const PILOT_SCOUT = Object.freeze({
  id: 'pilot-scout',
  name: 'Pilot Scout',
  emoji: '✈️',
  title: '✈️ Pilot Scout',
  shortTitle: 'Pilot Scout',
  ask: '✈️ Ask Pilot Scout',
  askPlaceholder: 'Ask Pilot Scout…',
  notificationTitle: '✈️ Pilot Scout',
  detectedBy: 'Detected by Pilot Scout',
  routeLane: '✈️ Pilot Scout · Route Lane',
  scoutActive: 'Scout Active',
  routingActive: 'Routing Active',
  vectorLocked: 'Vector Locked',
  monitoringMission: 'Watch Mission',
  opportunityMission: 'Route Mission',
})

export const PILOT_SCOUT_LABELS = Object.freeze({
  alert: '✈️ Pilot Scout Alert',
  foundThis: '✈️ Pilot Scout Found This',
  opportunity: '✈️ Pilot Scout Opportunity',
  recommendation: '✈️ Pilot Scout Recommendation',
  monitoring: '✈️ Pilot Scout Monitoring',
  search: '✈️ Pilot Scout Search',
  analysis: '✈️ Pilot Scout Analysis',
  confidence: 'Pilot Scout confidence',
  confidenceTitle: 'Pilot Scout Confidence',
  whyPicked: 'Why Pilot Scout picked this:',
  whyPickedToggle: '✈️ Why Pilot Scout Picked This',
  summary: '⚡ Pilot Scout Summary',
  opportunities: '✈️ Pilot Scout Opportunities',
  recommendations: '✈️ Pilot Scout Recommendations',
  reportTitle: 'Pilot Scout Report',
  reportSubtitle: 'Ranked opportunities for your trip window',
})

export const PILOT_SCOUT_COPY = Object.freeze({
  greeting: 'Flight deck open. Where are we routing?',
  wallet: 'Your Savvy fuel gauge — spend on boosts, earn on every leg.',
  missionComplete: 'Waypoint cleared. Savvy credited.',
  dealFound: 'Fare corridor opening — confidence high on this cluster.',
  emptyState: 'No active vectors. Run a search and I’ll scout lanes.',
  fareDrop: 'Descent on fares — recommend lock within the hour.',
  comboDetected: 'Ecosystem stack aligned — multiplier lane engaged.',
  connectionRisk: 'Tight connection on leg 2. Want me to recompose for train-first?',
  idleNudge: 'Still planning? Trending demand is up — alerts are cheap insurance.',
})

export type PilotScoutMissionAction =
  | 'search_routes'
  | 'save_route'
  | 'multi_mode_search'
  | 'create_travel_alert'
  | 'ezstay_sync'
  | 'aigo_sync'
  | 'final10_essentials'
  | 'combo_unlock'
  | 'lock_itinerary'
  | 'weekly_explorer'

export interface TravelScoutMission {
  id: string
  title: string
  description: string
  action: PilotScoutMissionAction
  rewardSavvy: number
}
