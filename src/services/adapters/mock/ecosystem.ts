import type { SavvyAppId } from '../../../data/ecosystemMockData'
import {
  aiGoNavCards,
  connectedApps,
  ecosystemActivityFeed,
  ecosystemAIInsights,
  ezstayHotels,
  final10Snipes,
  smartCombos,
} from '../../../data/ecosystemMockData'
import { delay } from '../../types'

/** Ecosystem panel data — mock only until BFF endpoints land. */
export const mockEcosystemService = {
  async getConnectedApps() {
    await delay(140)
    return connectedApps
  },

  async getActivityFeed() {
    await delay(180)
    return ecosystemActivityFeed
  },

  async getCombos() {
    await delay(160)
    return smartCombos
  },

  async getEZStayHotels() {
    await delay(200)
    return ezstayHotels
  },

  async getFinal10Snipes() {
    await delay(200)
    return final10Snipes
  },

  async getAIGoCards() {
    await delay(180)
    return aiGoNavCards
  },

  async getAIInsights() {
    await delay(120)
    return ecosystemAIInsights
  },

  async getAppStatus(appId: SavvyAppId): Promise<'online' | 'syncing' | 'idle'> {
    await delay(80)
    const app = connectedApps.find((a) => a.id === appId)
    return app?.status ?? 'idle'
  },
}

export type EcosystemService = typeof mockEcosystemService
