import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RouteOption } from '../../domain/travel'
import { useTripSearch } from '../../context/TripSearchContext'
import { getSavvyTripServices } from '../../services'
import { RouteCard } from '../cards/RouteCard'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'

export function RouteComparisonSection() {
  const { lastSearch, refreshLastSearch } = useTripSearch()
  const services = useMemo(() => getSavvyTripServices(), [])
  const [fallbackRoutes, setFallbackRoutes] = useState<RouteOption[]>([])
  const [loadingFallback, setLoadingFallback] = useState(false)

  useEffect(() => {
    void refreshLastSearch()
  }, [refreshLastSearch])

  useEffect(() => {
    if (lastSearch) return
    setLoadingFallback(true)
    void services.travelSearch.listRoutes().then((routes) => {
      setFallbackRoutes(routes)
      setLoadingFallback(false)
    })
  }, [lastSearch, services])

  const routes = lastSearch?.routes ?? fallbackRoutes
  const params = lastSearch?.params

  const ordered = useMemo(() => {
    const cheapest = routes.find((r) => r.id === 'cheapest')
    const fastest = routes.find((r) => r.id === 'fastest')
    const best = routes.find((r) => r.id === 'best')
    return [cheapest, fastest, best].filter(Boolean) as RouteOption[]
  }, [routes])

  const loading = loadingFallback && !lastSearch

  return (
    <section id="routes" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="routes-heading"
        eyebrow="Route intelligence"
        title="Cheapest, fastest, and best overall — side by side."
        description={
          params
            ? `${params.from} → ${params.to} · ${params.depart}${params.returnDate ? ` – ${params.returnDate}` : ''}`
            : 'Demo routes below — run Search to personalize legs for your corridor.'
        }
        action={<LiveIndicator label="Ranking live" />}
      />

      <RequestState loading={loading} empty={!loading && ordered.length === 0} emptyMessage="No routes available.">
        <div className="grid gap-6 lg:grid-cols-3">
          {ordered.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </RequestState>

      {!lastSearch && !loading ? (
        <div className="mt-6">
          <Link to="/search">
            <NeonButton>Personalize with search</NeonButton>
          </Link>
        </div>
      ) : null}
    </section>
  )
}
