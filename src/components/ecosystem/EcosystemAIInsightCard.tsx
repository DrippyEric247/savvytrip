import type { EcosystemAIInsight } from '../../data/ecosystemMockData'
import { appBadgeClass, appShortName } from '../ecosystem/appTokens'

export function EcosystemAIInsightCard({ insight }: { insight: EcosystemAIInsight }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-sky-400/30 hover:shadow-glow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(120deg, rgba(56,189,248,0.08), transparent 55%, rgba(167,139,250,0.1))',
        }}
        aria-hidden
      />
      <div className="relative space-y-2">
        <span
          className={['inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', appBadgeClass(insight.source)].join(
            ' ',
          )}
        >
          {appShortName(insight.source)}
        </span>
        <p className="font-medium leading-snug text-slate-50">{insight.message}</p>
        <p className="text-xs leading-relaxed text-slate-500">{insight.context}</p>
      </div>
    </div>
  )
}
