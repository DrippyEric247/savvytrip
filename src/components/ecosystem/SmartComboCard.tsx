import type { SmartCombo } from '../../data/ecosystemMockData'
import { GlassPanel } from '../ui/GlassPanel'
import { appBadgeClass, appShortName } from './appTokens'

export function SmartComboCard({ combo }: { combo: SmartCombo }) {
  return (
    <GlassPanel className="h-full transition-shadow duration-200 hover:shadow-glow-sm">
      <p className="font-outfit text-lg font-semibold leading-snug text-white">{combo.headline}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{combo.detail}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {combo.apps.map((id) => (
          <span
            key={id}
            className={['rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', appBadgeClass(id)].join(' ')}
          >
            {appShortName(id)}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-white/5 pt-3 text-xs font-medium text-sky-300/90">{combo.savvyBonusEstimate}</p>
    </GlassPanel>
  )
}
