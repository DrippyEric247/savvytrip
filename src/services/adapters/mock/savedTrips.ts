import type { RouteOption, SavedTrip, SearchParams } from '../../../domain/travel'
import { savedTrips as seedTrips } from '../../../data/mockData'
import { ServiceError, delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'

function seedIfEmpty(): SavedTrip[] {
  const existing = readJson<SavedTrip[] | null>(STORAGE_KEYS.savedTrips, null)
  if (existing) return existing

  const now = Date.now()
  const seeded = seedTrips.map((trip, i) => ({
    ...trip,
    createdAt: now - i * 86_400_000,
    updatedAt: now - i * 86_400_000,
  }))
  writeJson(STORAGE_KEYS.savedTrips, seeded)
  return seeded
}

function persist(trips: SavedTrip[]): SavedTrip[] {
  writeJson(STORAGE_KEYS.savedTrips, trips)
  return trips
}

export const mockSavedTripsService = {
  async list(): Promise<SavedTrip[]> {
    await delay(180)
    return seedIfEmpty()
  },

  async create(input: Omit<SavedTrip, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedTrip> {
    await delay(200)
    const now = Date.now()
    const trip: SavedTrip = {
      ...input,
      id: `trip_${now}`,
      createdAt: now,
      updatedAt: now,
    }
    persist([trip, ...seedIfEmpty()])
    return trip
  },

  async update(id: string, patch: Partial<SavedTrip>): Promise<SavedTrip> {
    await delay(150)
    const trips = seedIfEmpty()
    const index = trips.findIndex((t) => t.id === id)
    if (index < 0) throw new ServiceError('Trip not found', 'NOT_FOUND')
    const updated = { ...trips[index], ...patch, updatedAt: Date.now() }
    trips[index] = updated
    persist(trips)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay(120)
    persist(seedIfEmpty().filter((t) => t.id !== id))
  },

  async saveFromRoute(route: RouteOption, params: SearchParams): Promise<SavedTrip> {
    return this.create({
      name: `${params.from.split(',')[0]} → ${params.to.split(',')[0]} · ${route.title}`,
      dates: params.depart,
      status: 'watching',
      routeId: route.id,
      from: params.from,
      to: params.to,
    })
  },
}
