import type { CreateAlertInput, TravelAlert } from '../../../domain/travel'
import { ServiceError, delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'

function list(): TravelAlert[] {
  return readJson<TravelAlert[]>(STORAGE_KEYS.alerts, [])
}

function persist(alerts: TravelAlert[]): TravelAlert[] {
  writeJson(STORAGE_KEYS.alerts, alerts)
  return alerts
}

export const mockAlertsService = {
  async list() {
    await delay(160)
    return list()
  },

  async create(input: CreateAlertInput) {
    await delay(240)
    if (!input.from.trim() || !input.to.trim()) {
      throw new ServiceError('Origin and destination are required', 'VALIDATION')
    }
    const alert: TravelAlert = {
      id: `alert_${Date.now()}`,
      ...input,
      active: true,
      createdAt: Date.now(),
    }
    persist([alert, ...list()])
    return alert
  },

  async toggle(id: string, active: boolean) {
    await delay(120)
    const alerts = list()
    const index = alerts.findIndex((a) => a.id === id)
    if (index < 0) throw new ServiceError('Alert not found', 'NOT_FOUND')
    alerts[index] = { ...alerts[index], active }
    persist(alerts)
    return alerts[index]
  },

  async remove(id: string) {
    await delay(100)
    persist(list().filter((a) => a.id !== id))
  },
}
