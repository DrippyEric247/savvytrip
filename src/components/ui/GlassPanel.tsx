import type { ReactNode } from 'react'

type GlassPanelProps = {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function GlassPanel({ children, className = '', glow = false }: GlassPanelProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl border border-sky-400/15 bg-slate-900/40 p-5 shadow-lg backdrop-blur-xl transition-[box-shadow,border-color] duration-200 hover:border-sky-400/25 hover:shadow-glow-sm',
        glow ? 'shadow-glow-sm' : '',
        className,
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, transparent 45%, rgba(167,139,250,0.1) 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
