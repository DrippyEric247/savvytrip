/** Travel point action defaults — register with @savvy/core rewards when Phase 2 store lands. */

export interface TravelPointAction {
  label: string
  defaultSavvy: number
  battlePassAction?: string
}

export const TRAVEL_POINT_ACTIONS = Object.freeze({
  search_routes: {
    label: 'Route search',
    defaultSavvy: 10,
    battlePassAction: 'search_routes',
  },
  save_route: {
    label: 'Save route',
    defaultSavvy: 25,
    battlePassAction: 'save_route',
  },
  create_travel_alert: {
    label: 'Create travel alert',
    defaultSavvy: 50,
    battlePassAction: 'create_travel_alert',
  },
  lock_itinerary: {
    label: 'Lock itinerary',
    defaultSavvy: 75,
    battlePassAction: 'lock_itinerary',
  },
  book_flight: {
    label: 'Book flight',
    defaultSavvy: 200,
    battlePassAction: 'book_travel_leg',
  },
  book_train: {
    label: 'Book train',
    defaultSavvy: 80,
    battlePassAction: 'book_travel_leg',
  },
  book_rideshare: {
    label: 'Book rideshare',
    defaultSavvy: 40,
    battlePassAction: 'book_travel_leg',
  },
  book_hotel: {
    label: 'Book hotel',
    defaultSavvy: 120,
    battlePassAction: 'book_travel_leg',
  },
  ecosystem_combo_bonus: {
    label: 'Ecosystem combo bonus',
    defaultSavvy: 180,
    battlePassAction: 'ecosystem_combo_bonus',
  },
  scout_mission_complete: {
    label: 'Pilot Scout mission',
    defaultSavvy: 100,
    battlePassAction: 'scout_mission_claim',
  },
} satisfies Record<string, TravelPointAction>)

export type TravelPointActionKey = keyof typeof TRAVEL_POINT_ACTIONS

/** Combo tier table (Savvy bonus ranges from feature map). */
export const ECOSYSTEM_COMBO_BONUS_TIERS = Object.freeze([
  { apps: 2, minSavvy: 180, maxSavvy: 360 },
  { apps: 3, minSavvy: 360, maxSavvy: 640 },
  { apps: 4, minSavvy: 640, maxSavvy: 820 },
] as const)
