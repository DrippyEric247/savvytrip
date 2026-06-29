import type { ReactNode } from 'react'
import { GlassPanel } from './GlassPanel'

type CoreBlockedPanelProps = {
  title: string
  description: string
  integrationTodo: string
  children?: ReactNode
}

/** Production-ready blocked state for features waiting on @savvy/core or backend APIs. */
export function CoreBlockedPanel({ title, description, integrationTodo, children }: CoreBlockedPanelProps) {
  return (
    <GlassPanel className="space-y-4" glow>
      <div>
        <p className="font-outfit text-lg font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      {children}
      <p className="rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2 font-mono text-[10px] leading-relaxed text-slate-500">
        {integrationTodo}
      </p>
    </GlassPanel>
  )
}
