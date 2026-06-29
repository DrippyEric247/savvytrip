import type { PlannerDay, TripPlanner } from '../../../domain/travel'
import { ServiceError, delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'

const defaultPlanner = (): TripPlanner => ({
  id: 'planner_default',
  title: 'Chicago long weekend',
  updatedAt: Date.now(),
  days: [
    { id: 'd1', label: 'Day 1 · Arrive', location: 'ORD → River North', notes: 'Check in · EZStay luxury pick' },
    { id: 'd2', label: 'Day 2 · Explore', location: 'Downtown loop', notes: 'AI-Go train timing to Metra' },
    { id: 'd3', label: 'Day 3 · Depart', location: 'ORD outbound', notes: 'Lock train-first if fares hold' },
  ],
})

function get(): TripPlanner {
  return readJson(STORAGE_KEYS.planner, defaultPlanner())
}

function persist(planner: TripPlanner): TripPlanner {
  const next = { ...planner, updatedAt: Date.now() }
  writeJson(STORAGE_KEYS.planner, next)
  return next
}

export const mockPlannerService = {
  async get() {
    await delay(120)
    return get()
  },

  async updateTitle(title: string) {
    await delay(100)
    return persist({ ...get(), title })
  },

  async updateDay(dayId: string, patch: Partial<PlannerDay>) {
    await delay(120)
    const planner = get()
    const days = planner.days.map((d) => (d.id === dayId ? { ...d, ...patch } : d))
    if (!days.some((d) => d.id === dayId)) {
      throw new ServiceError('Day not found', 'NOT_FOUND')
    }
    return persist({ ...planner, days })
  },

  async addDay() {
    await delay(120)
    const planner = get()
    const n = planner.days.length + 1
    const day: PlannerDay = {
      id: `d_${Date.now()}`,
      label: `Day ${n}`,
      location: '',
      notes: '',
    }
    return persist({ ...planner, days: [...planner.days, day] })
  },

  async removeDay(dayId: string) {
    await delay(100)
    const planner = get()
    if (planner.days.length <= 1) {
      throw new ServiceError('Keep at least one day', 'VALIDATION')
    }
    return persist({ ...planner, days: planner.days.filter((d) => d.id !== dayId) })
  },
}
