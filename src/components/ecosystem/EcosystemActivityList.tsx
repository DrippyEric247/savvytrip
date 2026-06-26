import type { EcosystemFeedItem } from '../../data/ecosystemMockData'
import { appBadgeClass, appShortName } from './appTokens'
import { LiveIndicator } from '../ui/LiveIndicator'

export function EcosystemActivityList({ items }: { items: EcosystemFeedItem[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-outfit text-sm font-semibold uppercase tracking-widest text-slate-400">Ecosystem activity</h3>
        <LiveIndicator label="Cross-app feed" />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/45 px-3 py-3 backdrop-blur-sm transition-colors hover:border-violet-400/25 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] tabular-nums text-slate-500">{item.time}</span>
                <div className="flex flex-wrap gap-1">
                  {item.apps.map((id) => (
                    <span
                      key={id}
                      className={['rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', appBadgeClass(id)].join(
                        ' ',
                      )}
                    >
                      {appShortName(id)}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-1.5 font-medium text-slate-100">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.detail}</p>
            </div>
            {item.savvyDelta !== undefined ? (
              <span className="shrink-0 self-start rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-emerald-200">
                +{item.savvyDelta.toLocaleString('en-US')}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
