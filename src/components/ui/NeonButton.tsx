import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

type NeonButtonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:pointer-events-none disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-sky-500 to-violet-500 text-slate-950 shadow-glow-sm hover:brightness-110 active:scale-[0.98]',
  ghost: 'bg-white/5 text-slate-100 hover:bg-white/10 border border-white/10',
  outline:
    'border border-sky-400/40 bg-transparent text-sky-100 hover:border-sky-300 hover:bg-sky-500/10',
}

export function NeonButton({ children, variant = 'primary', className = '', type = 'button', ...rest }: NeonButtonProps) {
  return (
    <button type={type} className={[base, variants[variant], className].join(' ')} {...rest}>
      {children}
    </button>
  )
}
