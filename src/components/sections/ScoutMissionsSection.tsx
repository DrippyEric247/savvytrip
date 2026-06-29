import { useMemo } from 'react'
import { TRAVEL_SCOUT_MISSIONS } from '../../config/travelScoutMissions'
import { PILOT_SCOUT, PILOT_SCOUT_COPY } from '../../config/pilotScoutBranding'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

export function ScoutMissionsSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.scout.getProgress(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const progress = state.status === 'success' ? state.data : []

  const claim = async (missionId: string) => {
    await services.scout.markClaimed(missionId)
    reload()
  }

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="scout-goals-heading"
        eyebrow={PILOT_SCOUT.shortTitle}
        title="Mission log — chart waypoints, earn Savvy when Core connects."
        description={PILOT_SCOUT_COPY.greeting}
        action={<LiveIndicator label="Scout active" />}
      />

      <RequestState loading={loading} error={error} onRetry={reload}>
        <div className="grid gap-4 md:grid-cols-2">
          {TRAVEL_SCOUT_MISSIONS.map((mission) => {
            const p = progress.find((x) => x.missionId === mission.id)
            const completed = p?.completed ?? false
            const claimed = p?.claimed ?? false

            return (
              <GlassPanel key={mission.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-outfit text-lg font-semibold text-white">{mission.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{mission.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-violet-300">+{mission.rewardSavvy} Savvy</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span
                    className={[
                      'text-[10px] font-semibold uppercase tracking-wide',
                      completed ? 'text-emerald-300' : 'text-slate-500',
                    ].join(' ')}
                  >
                    {claimed ? 'Claimed' : completed ? 'Complete' : 'In progress'}
                  </span>
                  <NeonButton
                    variant="outline"
                    disabled={!completed || claimed}
                    onClick={() => void claim(mission.id)}
                  >
                    {claimed ? 'Claimed' : 'Claim'}
                  </NeonButton>
                </div>
              </GlassPanel>
            )
          })}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Progress stored locally. Savvy credit dispatches through Core rewards when Phase 2 store lands.
        </p>
      </RequestState>
    </section>
  )
}
