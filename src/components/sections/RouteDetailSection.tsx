import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { RouteOption } from '../../domain/travel'
import { useTripSearch } from '../../context/TripSearchContext'
import { getSavvyTripServices } from '../../services'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { ModeIcon } from '../icons/TravelIcons'

export function RouteDetailSection({ routeId: routeIdProp }: { routeId?: string }) {
  const params = useParams()
  const routeId = routeIdProp ?? params.id
  const navigate = useNavigate()
  const { lastSearch } = useTripSearch()
  const services = getSavvyTripServices()
  const [route, setRoute] = useState<RouteOption | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    if (!routeId) return
    setLoading(true)
    setError(null)
    try {
      const hit = await services.travelSearch.getRoute(routeId)
      if (!hit) throw new Error('Route not found')
      setRoute(hit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load route')
    } finally {
      setLoading(false)
    }
  }, [routeId, services])

  useEffect(() => {
    void load()
  }, [load])

  const handleSave = async () => {
    if (!route || !lastSearch?.params) return
    await services.savedTrips.saveFromRoute(route, lastSearch.params)
    void services.scout.recordAction('save_route')
    setSaved(true)
  }

  const handleLock = async () => {
    if (!route || !lastSearch?.params) return
    await services.savedTrips.saveFromRoute(route, lastSearch.params)
    void services.scout.recordAction('lock_itinerary')
    navigate('/saved')
  }

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="route-detail-heading"
        eyebrow="Itinerary detail"
        title={route?.title ?? 'Route detail'}
        description={lastSearch?.params ? `${lastSearch.params.from} → ${lastSearch.params.to}` : 'Full leg breakdown and actions'}
        action={<LiveIndicator label="Detail view" />}
      />

      <RequestState loading={loading} error={error} onRetry={() => void load()} empty={!loading && !error && !route} emptyMessage="Route not found.">
        {route ? (
          <GlassPanel glow={route.highlight} className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-outfit text-2xl font-semibold text-white">{route.tagline}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {route.totalTime} · {route.totalCost} · score {route.score}
                </p>
                {route.savingsVsBaseline ? (
                  <p className="mt-2 text-sm text-emerald-300">{route.savingsVsBaseline}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <NeonButton onClick={() => void handleLock()} disabled={!lastSearch?.params}>
                  Lock itinerary
                </NeonButton>
                <NeonButton variant="outline" onClick={() => void handleSave()} disabled={!lastSearch?.params}>
                  {saved ? 'Saved' : 'Save trip'}
                </NeonButton>
                <Link to="/scout-report">
                  <NeonButton variant="ghost">Pilot Scout report</NeonButton>
                </Link>
              </div>
            </div>

            <ol className="space-y-3">
              {route.legs.map((leg, i) => (
                <li
                  key={`${route.id}-leg-${i}`}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3"
                >
                  <span className="mt-1 text-sky-300">
                    <ModeIcon mode={leg.mode} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-100">{leg.label}</p>
                    <p className="text-sm text-slate-500">
                      {leg.duration} · {leg.cost}
                    </p>
                  </div>
                  <span className="text-xs text-slate-600">Leg {i + 1}</span>
                </li>
              ))}
            </ol>

            <p className="text-xs text-slate-500">
              Booking and Savvy earn previews connect when Core rewards + travel APIs land — actions persist locally today.
            </p>
          </GlassPanel>
        ) : null}
      </RequestState>
    </section>
  )
}
