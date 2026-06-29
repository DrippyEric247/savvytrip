import type { RouteOption, SearchParams, SearchResult } from '../../../domain/travel'
import { routeOptions as seedRoutes } from '../../../data/mockData'
import { delay } from '../../types'
import { readJson, STORAGE_KEYS, writeJson } from '../../storage'

function personalizeRoutes(params: SearchParams): RouteOption[] {
  const fromShort = params.from.split(',')[0]?.trim() || params.from
  const toShort = params.to.split(',')[0]?.trim() || params.to

  return seedRoutes.map((route) => ({
    ...route,
    tagline: route.tagline.replace(/NYC|Chicago|ORD|PHL/gi, (m) => {
      if (/nyc|phl/i.test(m)) return fromShort
      if (/chicago|ord/i.test(m)) return toShort
      return m
    }),
    legs: route.legs.map((leg) => ({
      ...leg,
      label: leg.label
        .replace(/NYC|PHL|LGA|EWR|Newark|Penn/gi, fromShort)
        .replace(/ORD|Chicago|River/gi, toShort),
    })),
  }))
}

export const mockTravelSearchService = {
  async search(params: SearchParams): Promise<SearchResult> {
    await delay(900)
    const result: SearchResult = {
      searchId: `search_${Date.now()}`,
      params,
      routes: personalizeRoutes(params),
      searchedAt: Date.now(),
    }
    writeJson(STORAGE_KEYS.lastSearch, result)
    return result
  },

  async getLastSearch(): Promise<SearchResult | null> {
    await delay(120)
    return readJson<SearchResult | null>(STORAGE_KEYS.lastSearch, null)
  },

  async getRoute(routeId: string): Promise<RouteOption | null> {
    await delay(100)
    const last = readJson<SearchResult | null>(STORAGE_KEYS.lastSearch, null)
    const routes = last?.routes ?? seedRoutes
    return routes.find((r) => r.id === routeId) ?? null
  },

  async listRoutes(): Promise<RouteOption[]> {
    await delay(150)
    const last = readJson<SearchResult | null>(STORAGE_KEYS.lastSearch, null)
    return last?.routes ?? seedRoutes
  },
}
