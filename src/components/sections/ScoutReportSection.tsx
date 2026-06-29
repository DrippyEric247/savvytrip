import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PILOT_SCOUT_LABELS } from '../../config/pilotScoutBranding'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

const confidenceStyle = {
  high: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  medium: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
  watch: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
} as const

export function ScoutReportSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.scout.buildReport(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const report = state.status === 'success' ? state.data : null

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="scout-report-heading"
        eyebrow="Pilot Scout Report"
        title={PILOT_SCOUT_LABELS.reportTitle}
        description={PILOT_SCOUT_LABELS.reportSubtitle}
        action={<LiveIndicator label={`${report?.opportunityCount ?? 0} opportunities`} />}
      />

      <RequestState loading={loading} error={error} onRetry={reload} empty={!loading && report?.opportunityCount === 0} emptyMessage="Run a search first — Pilot Scout ranks your latest routes here.">
        {report ? (
          <div className="space-y-4">
            {report.searchParams ? (
              <p className="text-sm text-slate-400">
                Corridor: {report.searchParams.from} → {report.searchParams.to}
              </p>
            ) : (
              <p className="text-sm text-amber-200/90">Showing demo routes — personalize with Search.</p>
            )}
            {report.opportunities.map((opp) => (
              <GlassPanel key={opp.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-outfit text-lg font-semibold text-white">{opp.title}</h3>
                    <span className={['rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase', confidenceStyle[opp.confidence]].join(' ')}>
                      {opp.confidence}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{opp.detail}</p>
                  {opp.savingsLabel ? <p className="mt-1 text-xs text-emerald-300">{opp.savingsLabel}</p> : null}
                </div>
                {opp.routeId ? (
                  <Link to={`/routes/${opp.routeId}`}>
                    <NeonButton variant="outline">Open route</NeonButton>
                  </Link>
                ) : null}
              </GlassPanel>
            ))}
          </div>
        ) : null}
      </RequestState>
    </section>
  )
}
