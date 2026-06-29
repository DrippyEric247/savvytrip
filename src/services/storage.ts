export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const STORAGE_KEYS = {
  lastSearch: 'savvytrip_last_search_v1',
  savedTrips: 'savvytrip_saved_trips_v1',
  alerts: 'savvytrip_travel_alerts_v1',
  scoutProgress: 'savvytrip_scout_missions_v1',
  copilotThread: 'savvytrip_copilot_thread_v1',
  planner: 'savvytrip_planner_v1',
} as const
