import type { RouteOption } from '../../data/mockData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { ModeIcon } from '../icons/TravelIcons'

type RouteCardProps = {
  route: RouteOption
}

export function RouteCard({ route }: RouteCardProps) {
  return (
    <GlassPanel
      glow={route.highlight}
      className={[
        'flex h-full flex-col',
        route.highlight ? 'ring-1 ring-violet-400/40' : '',
      ].join(' ')}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-300/80">{route.title}</p>
          <h3 className="mt-1 font-outfit text-xl font-semibold text-white">{route.tagline}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Savvy score</p>
          <p className="font-outfit text-2xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-violet-300">
            {route.score}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Total time</p>
          <p className="mt-0.5 font-medium text-slate-100">{route.totalTime}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Est. cost</p>
          <p className="mt-0.5 font-medium text-slate-100">{route.totalCost}</p>
        </div>
      </div>

      {route.savingsVsBaseline ? (
        <p className="mb-4 text-xs text-emerald-300/90">{route.savingsVsBaseline}</p>
      ) : (
        <p className="mb-4 text-xs text-slate-500">Optimized for speed over spend.</p>
      )}

      <ol className="mb-5 flex-1 space-y-2.5">
        {route.legs.map((leg, i) => (
          <li
            key={`${route.id}-${i}`}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-3 py-2.5"
          >
            <span className="mt-0.5 text-sky-300">
              <ModeIcon mode={leg.mode} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">{leg.label}</p>
              <p className="text-xs text-slate-500">
                {leg.duration} · {leg.cost}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <NeonButton variant={route.highlight ? 'primary' : 'outline'} className="w-full">
        Open itinerary
      </NeonButton>
    </GlassPanel>
  )
}
