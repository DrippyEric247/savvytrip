import { useMemo } from 'react'
import { mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { LiveIndicator } from '../ui/LiveIndicator'
import { RequestState } from '../ui/RequestState'

const statusLabel = {
  online: 'Online',
  syncing: 'Syncing',
  idle: 'Idle',
} as const

const statusStyle = {
  online: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  syncing: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
  idle: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
} as const

export function ConnectedAppsPanel() {
  const loader = useMemo(() => () => mockEcosystemService.getConnectedApps(), [])
  const { state, reload } = useAsyncData(loader, [])

  const loading = state.status === 'loading' || state.status === 'idle'
  const apps = state.status === 'success' ? state.data : []

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
      <RequestState loading={loading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
        <ul className="relative flex flex-1 flex-col gap-3">
          {apps.map((app) => (
            <li
              key={app.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-3 transition-all duration-200 hover:border-sky-400/30 hover:shadow-glow-sm"
            >
              <div className="min-w-0">
                <p className="font-outfit font-semibold text-white">{app.name}</p>
                <p className="truncate text-xs text-slate-500">{app.tagline}</p>
              </div>
              <span
                className={[
                  'flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                  statusStyle[app.status],
                ].join(' ')}
              >
                {statusLabel[app.status]}
              </span>
            </li>
          ))}
        </ul>
      </RequestState>
      <p className="relative mt-4 text-[11px] leading-relaxed text-slate-500">
        Mock ecosystem adapter — no Final10 live API calls from SavvyTrip.
      </p>
    </div>
  )
}
