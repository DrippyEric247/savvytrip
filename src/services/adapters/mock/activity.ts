import { activityFeed as seedFeed } from '../../../data/mockData'
import { delay } from '../../types'

export const mockActivityService = {
  async listFeed() {
    await delay(160)
    return seedFeed
  },
}
