import type { FeedItem } from '../../data/mockData'
import { LiveIndicator } from '../ui/LiveIndicator'

const toneStyles: Record<FeedItem['tone'], string> = {
  deal: 'border-emerald-400/20 bg-emerald-500/5 text-emerald-200',
  route: 'border-sky-400/20 bg-sky-500/5 text-sky-100',
  system: 'border-violet-400/20 bg-violet-500/5 text-violet-100',
  social: 'border-fuchsia-400/20 bg-fuchsia-500/5 text-fuchsia-100',
}

type TravelActivityFeedProps = {
  items: FeedItem[]
}

export function TravelActivityFeed({ items }: TravelActivityFeedProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-outfit text-sm font-semibold uppercase tracking-widest text-slate-400">
          Travel activity
        </h3>
        <LiveIndicator label="Live market" />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={[
              'flex gap-3 rounded-xl border px-3 py-3 text-sm backdrop-blur-sm transition-colors hover:border-sky-400/30',
              toneStyles[item.tone],
            ].join(' ')}
          >
            <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-slate-500">{item.time}</span>
            <div className="min-w-0">
              <p className="font-medium text-slate-50">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
