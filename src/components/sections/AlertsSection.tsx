import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import type { TravelAlert } from '../../domain/travel'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'
import { ModeIcon } from '../icons/TravelIcons'

export function AlertsSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.alerts.list(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const alerts = state.status === 'success' ? state.data : []

  const toggle = async (alert: TravelAlert) => {
    await services.alerts.toggle(alert.id, !alert.active)
    reload()
  }

  const remove = async (id: string) => {
    await services.alerts.remove(id)
    reload()
  }

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="alerts-heading"
        eyebrow="Travel alerts"
        title="Price watches and route triggers — your command center."
        description="Local mock storage today. Shared notification summary + travel kinds when Core notifications land."
        action={
          <div className="flex items-center gap-3">
            <LiveIndicator label="Alerts armed" />
            <Link to="/alerts/new">
              <NeonButton variant="ghost">New alert</NeonButton>
            </Link>
          </div>
        }
      />

      <RequestState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={!loading && alerts.length === 0}
        emptyMessage="No alerts yet. Create a watch for a route you are tracking."
      >
        <div className="space-y-3">
          {alerts.map((alert) => (
            <GlassPanel key={alert.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-outfit text-lg font-semibold text-white">{alert.label}</h3>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                      alert.active ? 'bg-sky-500/15 text-sky-200' : 'bg-slate-500/15 text-slate-400',
                    ].join(' ')}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {alert.from} → {alert.to}
                  {alert.targetPrice ? ` · target $${alert.targetPrice}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {alert.modes.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <ModeIcon mode={m} />
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <NeonButton variant="outline" onClick={() => void toggle(alert)}>
                  {alert.active ? 'Pause' : 'Resume'}
                </NeonButton>
                <NeonButton variant="ghost" onClick={() => void remove(alert.id)}>
                  Delete
                </NeonButton>
              </div>
            </GlassPanel>
          ))}
        </div>
      </RequestState>
    </section>
  )
}
