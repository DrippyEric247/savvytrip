type LoadingBarProps = {
  /** 0–100 for determinate mode; omit for indeterminate shimmer */
  progress?: number
  className?: string
  label?: string
}

export function LoadingBar({ progress, className = '', label }: LoadingBarProps) {
  const indeterminate = progress === undefined

  return (
    <div className={['w-full', className].join(' ')}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
          <span>{label}</span>
          {!indeterminate ? <span className="tabular-nums text-sky-300/90">{Math.round(progress)}%</span> : null}
        </div>
      ) : null}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-inset ring-sky-500/20"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : progress}
        aria-label={label ?? 'Loading'}
      >
        {indeterminate ? (
          <div
            className="absolute top-0 h-full w-[38%] rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 shadow-glow-sm animate-savvy-indeterminate"
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-violet-500 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen"
          aria-hidden
        >
          <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] animate-savvy-shimmer" />
        </div>
      </div>
    </div>
  )
}
