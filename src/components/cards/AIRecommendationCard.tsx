import type { AIRecommendation } from '../../data/mockData'
import { NeonButton } from '../ui/NeonButton'

type AIRecommendationCardProps = {
  rec: AIRecommendation
  index: number
}

export function AIRecommendationCard({ rec, index }: AIRecommendationCardProps) {
  const pct = Math.round(rec.confidence * 100)

  return (
    <div
      className="group relative animate-savvy-float rounded-2xl p-[1px] shadow-glow-sm"
      style={{
        background:
          'linear-gradient(135deg, rgba(56,189,248,0.65), rgba(167,139,250,0.55), rgba(34,211,238,0.45))',
        animationDelay: `${index * 0.35}s`,
      }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 p-5 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200">
              AI insight
            </span>
            <span className="text-[11px] text-slate-500">{pct}% match</span>
          </div>
          <h3 className="font-outfit text-lg font-semibold leading-snug text-white">{rec.headline}</h3>
          <p className="text-sm leading-relaxed text-slate-400">{rec.body}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <NeonButton variant="ghost" className="w-full justify-center text-sky-100">
            {rec.cta}
          </NeonButton>
        </div>
      </div>
    </div>
  )
}
