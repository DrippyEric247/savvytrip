import type { AIGoNavCard as AIGoNavCardModel } from '../../data/ecosystemMockData'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'

function trafficStyles(level: AIGoNavCardModel['trafficLevel']) {
  switch (level) {
    case 'low':
      return {
        bar: 'from-emerald-400 to-cyan-400',
        glow: 'shadow-[0_0_16px_rgba(52,211,153,0.45)]',
        label: 'Low congestion',
        pulse: 'bg-emerald-400',
      }
    case 'med':
      return {
        bar: 'from-amber-400 to-orange-400',
        glow: 'shadow-[0_0_16px_rgba(251,191,36,0.35)]',
        label: 'Building load',
        pulse: 'bg-amber-400',
      }
    case 'high':
      return {
        bar: 'from-rose-500 to-orange-500',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.45)]',
        label: 'Hot corridor',
        pulse: 'bg-rose-400',
      }
    default:
      return {
        bar: 'from-slate-400 to-slate-500',
        glow: '',
        label: 'Live',
        pulse: 'bg-slate-400',
      }
  }
}

export function AIGoNavCard({ card }: { card: AIGoNavCardModel }) {
  const t = trafficStyles(card.trafficLevel)

  return (
    <GlassPanel className="flex h-full flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300/90">AI-Go</p>
          <h3 className="mt-1 font-outfit text-lg font-semibold text-white">{card.title}</h3>
          <p className="text-sm text-slate-500">{card.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-500">Live ETA</p>
          <p className="font-outfit text-2xl font-bold tabular-nums text-sky-200">{card.eta}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={['absolute inline-flex h-full w-full animate-savvy-pulse rounded-full opacity-70', t.pulse].join(' ')}
          />
          <span className={['relative inline-flex h-2.5 w-2.5 rounded-full', t.pulse, t.glow].join(' ')} />
        </span>
        <span className="text-xs text-slate-400">{t.label}</span>
        <LiveIndicator label="Neural" className="ml-auto scale-90 border-cyan-400/30 bg-cyan-500/10 text-[9px] text-cyan-100" />
      </div>

      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-inset ring-white/10">
        <div
          className={['relative h-full rounded-full bg-gradient-to-r opacity-95', t.bar].join(' ')}
          style={{ width: `${card.confidencePct}%` }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full mix-blend-screen opacity-40">
          <div className="h-full w-full animate-savvy-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        AI confidence <span className="font-mono text-slate-300">{card.confidencePct}%</span>
      </p>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{card.detail}</p>
    </GlassPanel>
  )
}
