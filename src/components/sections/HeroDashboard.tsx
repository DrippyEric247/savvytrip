import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getSavvyTripServices } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { TravelActivityFeed } from '../feed/TravelActivityFeed'
import { GlassPanel } from '../ui/GlassPanel'
import { LoadingBar } from '../ui/LoadingBar'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'

export function HeroDashboard() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const loader = useMemo(() => () => services.activity.listFeed(), [services])
  const { state, reload } = useAsyncData(loader, [services])

  const feed = state.status === 'success' ? state.data : []
  const feedLoading = state.status === 'loading' || state.status === 'idle'

  return (
    <section id="dashboard" className="scroll-mt-28 lg:scroll-mt-24" aria-labelledby="hero-heading">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/5 px-3 py-1 text-xs text-violet-100">
              <span className="font-semibold uppercase tracking-wider text-violet-300/90">Savvy Universe</span>
              <span className="hidden text-slate-500 sm:inline">·</span>
              <span className="text-slate-400">Final10 · EZStay · AI-Go orchestrated here</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/5 px-3 py-1 text-xs text-sky-100">
              <LiveIndicator label="Neural routing online" />
              <span className="text-slate-400">Flights · trains · rides · stays</span>
            </div>
          </div>

          <h1
            id="hero-heading"
            className="font-outfit text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            The future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300">
              travel planning
            </span>
            <span className="text-slate-400">.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            SavvyTrip is the travel OS inside the Savvy Universe — composing flights, trains, rideshare, and hotels while
            Final10, EZStay, and AI-Go plug in automatically when they save you time or money.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/search">
              <NeonButton>Start smart search</NeonButton>
            </Link>
            <Link to="/routes">
              <NeonButton variant="outline">View sample routes</NeonButton>
            </Link>
          </div>

          <GlassPanel className="grid gap-5 sm:grid-cols-3" glow>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Optimizer</p>
              <p className="mt-1 font-outfit text-2xl font-semibold text-white">Multi-leg</p>
              <p className="mt-1 text-xs text-slate-400">12.4M combos evaluated (demo)</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Median savings</p>
              <p className="mt-1 font-outfit text-2xl font-semibold text-emerald-300">−18%</p>
              <p className="mt-1 text-xs text-slate-400">vs. single-mode booking</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Rebook latency</p>
              <p className="mt-1 font-outfit text-2xl font-semibold text-white">340ms</p>
              <p className="mt-1 text-xs text-slate-400">simulated edge response</p>
            </div>
          </GlassPanel>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Fare graph sync</span>
              <span>78%</span>
            </div>
            <LoadingBar progress={78} />
          </div>
        </div>

        <RequestState loading={feedLoading} error={state.status === 'error' ? state.error : null} onRetry={reload}>
          <TravelActivityFeed items={feed} />
        </RequestState>
      </div>
    </section>
  )
}
