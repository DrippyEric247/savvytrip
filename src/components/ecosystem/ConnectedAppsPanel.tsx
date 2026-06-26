import { connectedApps } from '../../data/ecosystemMockData'
import { LiveIndicator } from '../ui/LiveIndicator'

export function ConnectedAppsPanel() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-sky-400/15 bg-slate-900/40 p-5 shadow-lg backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
        style={{
          background:
            'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, transparent 50%, rgba(167,139,250,0.08) 100%)',
        }}
        aria-hidden
      />
      <div className="relative mb-4 flex items-center justify-between">
        <h3 className="font-outfit text-sm font-semibold uppercase tracking-widest text-slate-400">Connected apps</h3>
        <LiveIndicator label="Mesh sync" />
      </div>
      <ul className="relative flex flex-1 flex-col gap-3">
        {connectedApps.map((app) => (
          <li
            key={app.id}
            className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 transition-all duration-200 hover:border-sky-400/30 hover:shadow-glow-sm"
          >
            <div className="min-w-0">
              <p className="font-outfit font-semibold text-white">{app.name}</p>
              <p className="truncate text-xs text-slate-500">{app.tagline}</p>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-savvy-pulse rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              </span>
              Online
            </span>
          </li>
        ))}
      </ul>
      <p className="relative mt-4 text-[11px] leading-relaxed text-slate-500">
        SavvyTrip orchestrates live handoffs — status reflects mock session until APIs connect.
      </p>
    </div>
  )
}
