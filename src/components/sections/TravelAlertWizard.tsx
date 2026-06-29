import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RouteMode } from '../../domain/travel'
import { getSavvyTripServices } from '../../services'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'
import { SectionHeading } from '../ui/SectionHeading'
import { ModeIcon } from '../icons/TravelIcons'

const modes: RouteMode[] = ['flight', 'train', 'rideshare', 'hotel']

export function TravelAlertWizard() {
  const navigate = useNavigate()
  const services = getSavvyTripServices()
  const [label, setLabel] = useState('ORD fare watch')
  const [from, setFrom] = useState('New York, NY')
  const [to, setTo] = useState('Chicago, IL')
  const [depart, setDepart] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [activeModes, setActiveModes] = useState<Set<RouteMode>>(() => new Set(['flight']))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const toggleMode = (mode: RouteMode) => {
    setActiveModes((prev) => {
      const next = new Set(prev)
      if (next.has(mode)) next.delete(mode)
      else next.add(mode)
      return next
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeModes.size === 0) {
      setError('Select at least one mode')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await services.alerts.create({
        label,
        from,
        to,
        depart: depart || undefined,
        targetPrice: targetPrice ? Number(targetPrice) : undefined,
        modes: [...activeModes],
      })
      void services.scout.recordAction('create_travel_alert')
      navigate('/alerts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="alert-wizard-heading"
        eyebrow="Create alert"
        title="Set a Pilot Scout watch on your corridor."
        description="Wizard fields swap into the shared alert framework when Core notifications ship."
      />

      <GlassPanel glow>
        <form className="space-y-4" onSubmit={(e) => void submit(e)}>
          <label className="block space-y-1.5 text-sm">
            <span className="text-slate-400">Label</span>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">From</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">To</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">Depart (optional)</span>
              <input
                type="date"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="text-slate-400">Target price USD (optional)</span>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </label>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Modes</p>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMode(m)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    activeModes.has(m)
                      ? 'border-sky-400/50 bg-sky-500/15 text-sky-50'
                      : 'border-white/10 text-slate-500',
                  ].join(' ')}
                >
                  <ModeIcon mode={m} />
                  {m}
                </button>
              ))}
            </div>
          </div>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <div className="flex gap-2">
            <NeonButton type="submit" disabled={saving}>
              {saving ? 'Creating…' : 'Create alert'}
            </NeonButton>
            <NeonButton type="button" variant="ghost" onClick={() => navigate('/alerts')}>
              Cancel
            </NeonButton>
          </div>
        </form>
      </GlassPanel>
    </section>
  )
}
