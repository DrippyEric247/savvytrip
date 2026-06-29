import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SearchParams, SearchResult } from '../domain/travel'
import { getSavvyTripServices } from '../services'

type TripSearchContextValue = {
  lastSearch: SearchResult | null
  searching: boolean
  searchError: string | null
  runSearch: (params: SearchParams) => Promise<SearchResult>
  refreshLastSearch: () => Promise<void>
}

const TripSearchContext = createContext<TripSearchContextValue | null>(null)

export function TripSearchProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => getSavvyTripServices(), [])
  const [lastSearch, setLastSearch] = useState<SearchResult | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const refreshLastSearch = useCallback(async () => {
    const result = await services.travelSearch.getLastSearch()
    setLastSearch(result)
  }, [services])

  const runSearch = useCallback(
    async (params: SearchParams) => {
      setSearching(true)
      setSearchError(null)
      try {
        const result = await services.travelSearch.search(params)
        setLastSearch(result)
        void services.scout.recordAction('search_routes')
        if (params.modes.length >= 3) {
          void services.scout.recordAction('multi_mode_search')
        }
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed'
        setSearchError(message)
        throw err
      } finally {
        setSearching(false)
      }
    },
    [services],
  )

  const value = useMemo(
    () => ({ lastSearch, searching, searchError, runSearch, refreshLastSearch }),
    [lastSearch, searching, searchError, runSearch, refreshLastSearch],
  )

  return <TripSearchContext.Provider value={value}>{children}</TripSearchContext.Provider>
}

export function useTripSearch() {
  const ctx = useContext(TripSearchContext)
  if (!ctx) throw new Error('useTripSearch must be used within TripSearchProvider')
  return ctx
}
