import type { LiveDeal } from '../../../domain/travel'
import { liveDeals as seedDeals } from '../../../data/mockData'
import { delay } from '../../types'

/** Parse legacy mm:ss seed strings into future timestamps. */
function toLiveDeals(): LiveDeal[] {
  const now = Date.now()
  const offsets = [42 * 60 + 18, 19 * 60 + 2, 3 * 60 + 55]

  return seedDeals.map((deal, i) => ({
    id: deal.id,
    destination: deal.destination,
    discount: deal.discount,
    modes: deal.modes,
    expiresAt: now + (offsets[i] ?? 3600) * 1000,
  }))
}

export const mockDealsService = {
  async listLive(): Promise<LiveDeal[]> {
    await delay(220)
    return toLiveDeals()
  },
}
