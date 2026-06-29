import { useMemo, useState } from 'react'
import type { PlannerDay } from '../../domain/travel'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'
import { LiveIndicator } from '../ui/LiveIndicator'

function DayEditor({
  day,
  onChange,
  onRemove,
}: {
  day: PlannerDay
  onChange: (patch: Partial<PlannerDay>) => void
  onRemove: () => void
}) {
  return (
    <GlassPanel className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 font-outfit text-sm font-semibold text-white outline-none focus:border-sky-400/40"
          value={day.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
        <NeonButton variant="ghost" onClick={onRemove}>
          Remove
        </NeonButton>
      </div>
      <input
        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/40"
        placeholder="Location"
        value={day.location}
        onChange={(e) => onChange({ location: e.target.value })}
      />
      <textarea
        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/40"
        rows={2}
        placeholder="Notes"
        value={day.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </GlassPanel>
  )
}

export function PlannerSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.planner.get(), [services])
  const { state, reload } = useAsyncData(loader, [services])
  const [titleDraft, setTitleDraft] = useState<string | null>(null)

  const loading = state.status === 'loading' || state.status === 'idle'
  const error = state.status === 'error' ? state.error : null
  const planner = state.status === 'success' ? state.data : null
  const title = titleDraft ?? planner?.title ?? ''

  const saveTitle = async () => {
    if (!title.trim()) return
    await services.planner.updateTitle(title)
    setTitleDraft(null)
    reload()
  }

  const updateDay = async (dayId: string, patch: Partial<PlannerDay>) => {
    await services.planner.updateDay(dayId, patch)
    reload()
  }

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="planner-heading"
        eyebrow="Trip planner"
        title="Multi-day itinerary builder — local draft until sync API lands."
        description="Compose days, locations, and notes. Ecosystem panels can attach per-day later."
        action={<LiveIndicator label="Planner draft" />}
      />

      <RequestState loading={loading} error={error} onRetry={reload}>
        {planner ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-3">
              <label className="block min-w-[12rem] flex-1 space-y-1 text-sm">
                <span className="text-slate-400">Trip title</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/40"
                  value={title}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => void saveTitle()}
                />
              </label>
              <NeonButton variant="outline" onClick={() => void services.planner.addDay().then(reload)}>
                Add day
              </NeonButton>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {planner.days.map((day) => (
                <DayEditor
                  key={day.id}
                  day={day}
                  onChange={(patch) => void updateDay(day.id, patch)}
                  onRemove={() => void services.planner.removeDay(day.id).then(reload)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </RequestState>
    </section>
  )
}
