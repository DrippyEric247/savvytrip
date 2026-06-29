import { trending as seedTrending } from '../../../data/mockData'
import { delay } from '../../types'

export const mockTrendsService = {
  async list() {
    await delay(180)
    return seedTrending
  },
}
