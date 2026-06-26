import type { Final10Snipe } from '../../data/ecosystemMockData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'

export function Final10SnipeCard({ snipe }: { snipe: Final10Snipe }) {
  return (
    <GlassPanel
      className={[
        'relative flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm',
        snipe.endingSoon ? 'ring-1 ring-fuchsia-400/35' : '',
      ].join(' ')}
    >
      {snipe.endingSoon ? (
        <span className="absolute right-3 top-3 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-200">
          Ending soon
        </span>
      ) : null}
      <p className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300/90">{snipe.category}</p>
      <h3 className="mt-2 pr-16 font-outfit text-base font-semibold leading-snug text-white">{snipe.title}</h3>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 font-medium text-emerald-200">
          Est. save ${snipe.estimatedSavingsUsd}
        </span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-300">Trust {snipe.trustScore}</span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-400">
          {snipe.watcherCount.toLocaleString('en-US')} watching
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[11px] text-slate-500">
          Ends in <span className="font-mono text-slate-300">{snipe.endsIn}</span>
        </span>
        <NeonButton variant="ghost" className="px-3 py-2 text-xs">
          Snipe
        </NeonButton>
      </div>
    </GlassPanel>
  )
}
