import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-10 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 font-outfit text-xl font-bold text-slate-950">
          S
        </span>
        <span className="font-outfit text-xl font-semibold text-white">
          Savvy<span className="text-sky-300">Trip</span>
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-glow-sm backdrop-blur-xl sm:p-8">
        <h1 className="font-outfit text-2xl font-bold text-white">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        Savvy Universe · One account across Final10, EZStay, and AI-Go
      </p>
    </div>
  )
}
