import { useState } from 'react'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { LoadingBar } from '../ui/LoadingBar'
import { NeonButton } from '../ui/NeonButton'
import { SectionHeading } from '../ui/SectionHeading'
import { ModeIcon } from '../icons/TravelIcons'
import type { RouteMode } from '../../data/mockData'

const modes: { id: RouteMode; label: string }[] = [
  { id: 'flight', label: 'Flights' },
  { id: 'train', label: 'Trains' },
  { id: 'rideshare', label: 'Rides' },
  { id: 'hotel', label: 'Hotels' },
]

export function SmartRouteSearch() {
  const [activeModes, setActiveModes] = useState<Set<RouteMode>>(
    () => new Set(['flight', 'train', 'rideshare', 'hotel']),
  )
  const [searching, setSearching] = useState(false)

  const toggle = (id: RouteMode) => {
    setActiveModes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handlePreviewSearch = () => {
    setSearching(true)
    window.setTimeout(() => setSearching(false), 2200)
  }

  return (
    <section id="search" className="mt-20 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="search-heading"
        eyebrow="Smart route search"
        title="Describe the trip. SavvyTrip handles the math."
        description="Mix modes, set priorities, and preview how each constraint reshapes price, duration, and comfort — all client-side for this foundation build."
        action={<LiveIndicator label="Search mesh ready" />}
      />

      <GlassPanel className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" glow>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">From</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-sky-400/40 placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2"
                placeholder="City or station"
                defaultValue="New York, NY"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">To</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-sky-400/40 placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2"
                placeholder="City or airport"
                defaultValue="Chicago, IL"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">Depart</span>
              <input
                type="date"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-sky-400/40 focus:border-sky-400/50 focus:ring-2"
                defaultValue="2026-06-12"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">Return (optional)</span>
              <input
                type="date"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-sky-400/40 focus:border-sky-400/50 focus:ring-2"
                defaultValue="2026-06-15"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Modes in play</p>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => {
                const on = activeModes.has(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors',
                      on
                        ? 'border-sky-400/50 bg-sky-500/15 text-sky-50 shadow-glow-sm'
                        : 'border-white/10 bg-slate-950/40 text-slate-500 hover:border-white/20 hover:text-slate-300',
                    ].join(' ')}
                  >
                    <ModeIcon mode={m.id} />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <NeonButton className="w-full sm:w-auto" onClick={handlePreviewSearch}>
            {searching ? 'Composing routes…' : 'Preview Savvy routes'}
          </NeonButton>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/50 p-4">
          <p className="text-sm font-medium text-slate-200">Search intelligence (demo)</p>
          <p className="text-xs leading-relaxed text-slate-500">
            When the backend lands, this panel streams live graph updates, hub stress, and policy-aware swaps. For
            now, it mirrors the feel of a fast optimizer at work.
          </p>
          {searching ? (
            <div className="space-y-3 pt-1">
              <LoadingBar progress={44} label="Scoring multimodal paths" />
              <LoadingBar label="Hydrating hotel clusters" />
            </div>
          ) : (
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-sky-400">↗</span>
                Prefer trains under 3h before short flights when prices converge.
              </li>
              <li className="flex gap-2">
                <span className="text-violet-400">◇</span>
                Rideshare legs adapt to airport surge windows automatically.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                Hotel nights anchor around lowest combined commute energy.
              </li>
            </ul>
          )}
        </div>
      </GlassPanel>
    </section>
  )
}
