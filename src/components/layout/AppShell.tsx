import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'

const navGroups = [
  {
    label: 'Plan',
    items: [
      { to: '/', label: 'Home', end: true },
      { to: '/search', label: 'Search' },
      { to: '/routes', label: 'Routes' },
      { to: '/saved', label: 'Saved' },
      { to: '/deals', label: 'Deals' },
      { to: '/trending', label: 'Trending' },
    ],
  },
  {
    label: 'Ecosystem',
    items: [
      { to: '/wallet', label: 'Wallet' },
      { to: '/apps', label: 'Apps' },
      { to: '/feed', label: 'Feed' },
      { to: '/combos', label: 'Combos' },
      { to: '/ezstay', label: 'EZStay' },
      { to: '/final10', label: 'Final10' },
      { to: '/aigo', label: 'AI-Go' },
      { to: '/rewards', label: 'Rewards' },
    ],
  },
  {
    label: 'Assist',
    items: [{ to: '/assistant', label: 'AI' }],
  },
] as const

function navLinkClass(isActive: boolean) {
  return [
    'shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-xs transition-colors sm:px-2.5 sm:text-sm',
    isActive
      ? 'bg-white/10 text-sky-200'
      : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
  ].join(' ')
}

export function AppShell() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const displayName = user?.username || user?.email || 'Operator'
  const savvyPoints = Number(user?.savvyPoints)
  const savvyLabel = Number.isFinite(savvyPoints) ? `${Math.round(savvyPoints).toLocaleString()} Savvy` : null

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <NavLink to="/" className="group flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 font-outfit text-lg font-bold text-slate-950 shadow-glow-sm"
              aria-hidden
            >
              S
            </span>
            <span className="font-outfit text-lg font-semibold tracking-tight text-white">
              Savvy<span className="text-sky-300">Trip</span>
            </span>
          </NavLink>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <nav
              className="flex max-w-full items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Primary"
            >
              {navGroups.map((group, groupIndex) => (
                <div key={group.label} className="flex items-center gap-0.5">
                  {groupIndex > 0 ? (
                    <span className="mx-1 hidden h-4 w-px shrink-0 bg-white/10 xl:block" aria-hidden />
                  ) : null}
                  <span className="hidden px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600 xl:inline">
                    {group.label}
                  </span>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={'end' in item ? item.end : false}
                      className={({ isActive }) => navLinkClass(isActive)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex sm:gap-3 md:gap-3">
            {savvyLabel ? (
              <Link
                to="/wallet"
                className="hidden rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-xs font-medium text-sky-200 md:inline-flex"
              >
                {savvyLabel}
              </Link>
            ) : null}
            <span className="hidden max-w-[8rem] truncate text-xs text-slate-400 lg:inline" title={displayName}>
              {displayName}
            </span>
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 md:inline-flex"
            >
              Sign out
            </button>
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
          <nav className="flex flex-col gap-3" aria-label="Mobile primary">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={'end' in item ? item.end : false}
                      className={({ isActive }) =>
                        ['rounded-lg px-3 py-2 text-sm', isActive ? 'bg-white/10 text-sky-200' : 'text-slate-200 hover:bg-white/5'].join(' ')
                      }
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-3">
              {savvyLabel ? (
                <Link to="/wallet" className="rounded-lg bg-sky-500/10 px-3 py-2 text-sm text-sky-200" onClick={() => setOpen(false)}>
                  {savvyLabel}
                </Link>
              ) : null}
              <p className="px-3 text-xs text-slate-500">Signed in as {displayName}</p>
              <button
                type="button"
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
              >
                Sign out
              </button>
              <NeonButton className="w-full">Launch planner</NeonButton>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-slate-950/80 py-8 text-center text-xs text-slate-500 backdrop-blur-sm">
        SavvyTrip · Savvy Universe shell · Phase 3 auth · APIs later.
      </footer>
    </div>
  )
}
