type LiveIndicatorProps = {
  label?: string
  className?: string
}

export function LiveIndicator({ label = 'Live', className = '' }: LiveIndicatorProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-200',
        className,
      ].join(' ')}
    >
      <span
        className="relative flex h-2 w-2"
        aria-hidden
      >
        <span className="absolute inline-flex h-full w-full animate-savvy-pulse rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
      </span>
      {label}
    </span>
  )
}
