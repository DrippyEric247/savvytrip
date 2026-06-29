import type { ReactNode } from 'react'
import { LoadingBar } from './LoadingBar'

type RequestStateProps = {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: ReactNode
}

export function RequestState({
  loading,
  error,
  empty,
  emptyMessage = 'Nothing here yet.',
  onRetry,
  children,
}: RequestStateProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-8" role="status" aria-live="polite">
        <LoadingBar label="Loading…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6 text-center" role="alert">
        <p className="text-sm text-red-200">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-xs font-medium text-sky-300 hover:text-sky-200"
          >
            Try again
          </button>
        ) : null}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-8 text-center">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return children
}
