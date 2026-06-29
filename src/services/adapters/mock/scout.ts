import type { ScoutMissionProgress, ScoutReport, ScoutReportOpportunity } from '../../../domain/travel'
import { TRAVEL_SCOUT_MISSIONS } from '../../../config/travelScoutMissions'
import { ServiceError, delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'
import { mockTravelSearchService } from './travelSearch'

function getProgress(): ScoutMissionProgress[] {
  const stored = readJson<ScoutMissionProgress[]>(STORAGE_KEYS.scoutProgress, [])
  return TRAVEL_SCOUT_MISSIONS.map((mission) => {
    const hit = stored.find((p) => p.missionId === mission.id)
    return (
      hit ?? {
        missionId: mission.id,
        completed: false,
        claimed: false,
      }
    )
  })
}

function persist(progress: ScoutMissionProgress[]) {
  writeJson(STORAGE_KEYS.scoutProgress, progress)
}

export const mockScoutService = {
  async getProgress() {
    await delay(140)
    return getProgress()
  },

  async recordAction(action: string) {
    await delay(180)
    const missions = TRAVEL_SCOUT_MISSIONS.filter((m) => m.action === action)
    if (missions.length === 0) return getProgress()

    const now = Date.now()
    const progress = getProgress().map((p) => {
      const mission = missions.find((m) => m.id === p.missionId)
      if (!mission || p.completed) return p
      return { ...p, completed: true, completedAt: now }
    })
    persist(progress)
    return progress
  },

  async markClaimed(missionId: string) {
    await delay(150)
    const progress = getProgress()
    const index = progress.findIndex((p) => p.missionId === missionId)
    if (index < 0) throw new ServiceError('Mission not found', 'NOT_FOUND')
    if (!progress[index].completed) {
      throw new ServiceError('Complete the mission before claiming', 'VALIDATION')
    }
    progress[index] = { ...progress[index], claimed: true }
    persist(progress)
    return progress
  },

  async buildReport(): Promise<ScoutReport> {
    await delay(280)
    const last = await mockTravelSearchService.getLastSearch()
    const routes = last?.routes ?? []

    const opportunities: ScoutReportOpportunity[] = routes.map((route) => ({
      id: `opp_${route.id}`,
      title: route.title,
      detail: route.savingsVsBaseline ?? route.tagline,
      confidence: route.score >= 95 ? 'high' : route.score >= 88 ? 'medium' : 'watch',
      routeId: route.id,
      savingsLabel: route.savingsVsBaseline,
    }))

    return {
      generatedAt: Date.now(),
      opportunityCount: opportunities.length,
      opportunities,
      searchParams: last?.params,
    }
  },
}
