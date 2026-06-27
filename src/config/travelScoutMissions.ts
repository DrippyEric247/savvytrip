import type { TravelScoutMission } from './pilotScoutBranding'

/** Pilot Scout mission catalog — consumed by Core scout engine when wired (Phase 5). */
export const TRAVEL_SCOUT_MISSIONS: readonly TravelScoutMission[] = Object.freeze([
  {
    id: 'first_search',
    title: 'Clear the runway',
    description: 'Complete your first route search.',
    action: 'search_routes',
    rewardSavvy: 100,
  },
  {
    id: 'save_route',
    title: 'Chart a course',
    description: 'Save any route to your trip board.',
    action: 'save_route',
    rewardSavvy: 75,
  },
  {
    id: 'multi_mode',
    title: 'Multi-modal mind',
    description: 'Search with three or more travel modes enabled.',
    action: 'multi_mode_search',
    rewardSavvy: 125,
  },
  {
    id: 'create_alert',
    title: 'Set a watch',
    description: 'Create a travel price alert.',
    action: 'create_travel_alert',
    rewardSavvy: 150,
  },
  {
    id: 'ezstay_sync',
    title: 'Ground control',
    description: 'Attach an EZStay hotel pick to your trip.',
    action: 'ezstay_sync',
    rewardSavvy: 200,
  },
  {
    id: 'aigo_sync',
    title: 'Surface vector',
    description: 'Accept an AI-Go routing suggestion.',
    action: 'aigo_sync',
    rewardSavvy: 150,
  },
  {
    id: 'final10_essentials',
    title: 'Pack smart',
    description: 'Save a Final10 travel essential to your trip.',
    action: 'final10_essentials',
    rewardSavvy: 100,
  },
  {
    id: 'combo_unlock',
    title: 'Ecosystem lift',
    description: 'Trigger a three-app ecosystem combo bonus.',
    action: 'combo_unlock',
    rewardSavvy: 300,
  },
  {
    id: 'lock_itinerary',
    title: 'Lock the leg',
    description: 'Hold a fare on a saved trip.',
    action: 'lock_itinerary',
    rewardSavvy: 175,
  },
  {
    id: 'weekly_explorer',
    title: 'Weekender',
    description: 'Run three route searches within seven days.',
    action: 'weekly_explorer',
    rewardSavvy: 250,
  },
])

export const SAVVYTRIP_APP_ID = 'savvytrip' as const
