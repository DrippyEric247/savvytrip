import type { ReactNode } from 'react'
import { useState } from 'react'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'

const nav = [
  { href: '#dashboard', label: 'Home' },
  { href: '#wallet', label: 'Wallet' },
  { href: '#connected-apps', label: 'Apps' },
  { href: '#ecosystem-activity', label: 'Feed' },
  { href: '#smart-combos', label: 'Combos' },
  { href: '#search', label: 'Search' },
  { href: '#routes', label: 'Routes' },
  { href: '#ezstay', label: 'EZStay' },
  { href: '#final10', label: 'Final10' },
  { href: '#aigo', label: 'AI-Go' },
  { href: '#unified-rewards', label: 'Rewards' },
  { href: '#deals', label: 'Deals' },
  { href: '#assistant', label: 'AI' },
  { href: '#saved', label: 'Saved' },
  { href: '#trending', label: 'Trending' },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <a href="#dashboard" className="group flex shrink-0 items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 font-outfit text-lg font-bold text-slate-950 shadow-glow-sm"
              aria-hidden
            >
              S
            </span>
            <span className="font-outfit text-lg font-semibold tracking-tight text-white">
              Savvy<span className="text-sky-300">Trip</span>
            </span>
          </a>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <nav
              className="flex max-w-full gap-0.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Primary"
            >
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 sm:px-2.5 sm:text-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex sm:gap-3 md:gap-3">
            <LiveIndicator label="Engines warm" />
            <NeonButton className="hidden md:inline-flex">Launch planner</NeonButton>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-slate-100 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-nav"
          className={[
            'border-t border-white/5 bg-slate-950/95 px-4 py-3 lg:hidden',
            open ? 'block' : 'hidden',
          ].join(' ')}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <NeonButton className="mt-2 w-full">Launch planner</NeonButton>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">{children}</main>

      <footer className="relative z-10 border-t border-white/5 bg-slate-950/80 py-8 text-center text-xs text-slate-500 backdrop-blur-sm">
        SavvyTrip · Savvy Universe shell · frontend-only · APIs later.
      </footer>
    </div>
  )
}
