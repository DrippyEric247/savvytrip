import type { CopilotMessage } from '../../../domain/travel'
import { aiRecommendations as seedRecs } from '../../../data/mockData'
import { delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'

const starterThread: CopilotMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'Ask for tradeoffs, surge windows, or “cheapest before noon.” I stay grounded in your constraints.',
    timestamp: Date.now() - 120_000,
  },
  {
    id: 'm2',
    role: 'user',
    text: 'If I must be in Chicago by 6pm, what’s the savviest train-first option from NYC?',
    timestamp: Date.now() - 90_000,
  },
  {
    id: 'm3',
    role: 'assistant',
    text: 'Previewing: Acela to PHL → short hop → ORD lands you earlier with lower rideshare stress than a single LGA rush. I can stress-test that against price when APIs connect.',
    timestamp: Date.now() - 60_000,
  },
]

function getThread(): CopilotMessage[] {
  return readJson(STORAGE_KEYS.copilotThread, starterThread)
}

function mockReply(userText: string): string {
  const lower = userText.toLowerCase()
  if (lower.includes('cheap') || lower.includes('save')) {
    return 'Cheapest corridor right now favors train-first with a PHL connection — about 11h 20m and −$94 vs direct flight in mock data. Want me to open the route comparison?'
  }
  if (lower.includes('fast') || lower.includes('quick')) {
    return 'Fastest mock path is door-to-door rideshare + priority flight — 6h 05m total. Tradeoff: +$226 vs cheapest overall.'
  }
  if (lower.includes('hotel') || lower.includes('stay')) {
    return 'EZStay picks route-aware hotels: airport-close Runway Suites ORD saves 8m to T3 in the demo set. Full EZStay sync lands with the ecosystem BFF.'
  }
  return `Noted: “${userText.slice(0, 80)}”. When travel APIs connect I’ll rank live legs; for now check Routes or set a Pilot Scout alert on /alerts/new.`
}

export const mockCopilotService = {
  async getRecommendations() {
    await delay(140)
    return seedRecs
  },

  async getThread() {
    await delay(80)
    return getThread()
  },

  async sendMessage(text: string) {
    await delay(650)
    const trimmed = text.trim()
    if (!trimmed) return getThread()

    const now = Date.now()
    const next: CopilotMessage[] = [
      ...getThread(),
      { id: `u_${now}`, role: 'user', text: trimmed, timestamp: now },
      {
        id: `a_${now + 1}`,
        role: 'assistant',
        text: mockReply(trimmed),
        timestamp: now + 1,
      },
    ]
    writeJson(STORAGE_KEYS.copilotThread, next)
    return next
  },

  async clearThread() {
    await delay(100)
    writeJson(STORAGE_KEYS.copilotThread, starterThread)
  },
}
