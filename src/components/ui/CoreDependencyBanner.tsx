type CoreDependencyBannerProps = {
  feature: string
  waitingOn: string
}

/** Shown on pages blocked from real data until Savvy Core / backend lands. */
export function CoreDependencyBanner({ feature, waitingOn }: CoreDependencyBannerProps) {
  return (
    <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
      <span className="font-medium text-amber-200">{feature}</span> is preview-only. Waiting on{' '}
      <span className="text-amber-100">{waitingOn}</span> — UI stays; swap the service adapter when ready.
    </div>
  )
}
