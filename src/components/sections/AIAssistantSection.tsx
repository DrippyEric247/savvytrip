import { useMemo, useState } from 'react'
import { getSavvyTripServices, mockEcosystemService } from '../../services'
import { useAsyncData } from '../../hooks/useAsyncData'
import { AIRecommendationCard } from '../cards/AIRecommendationCard'
import { EcosystemAIInsightCard } from '../ecosystem/EcosystemAIInsightCard'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'
import { RequestState } from '../ui/RequestState'
import { SectionHeading } from '../ui/SectionHeading'

export function AIAssistantSection() {
  const services = useMemo(() => getSavvyTripServices(), [])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const recLoader = useMemo(() => () => services.copilot.getRecommendations(), [services])
  const threadLoader = useMemo(() => () => services.copilot.getThread(), [services])
  const insightLoader = useMemo(() => () => mockEcosystemService.getAIInsights(), [services])

  const recs = useAsyncData(recLoader, [services])
  const thread = useAsyncData(threadLoader, [services])
  const insights = useAsyncData(insightLoader, [services])

  const messages = thread.state.status === 'success' ? thread.state.data : []
  const recommendations = recs.state.status === 'success' ? recs.state.data : []
  const ecosystemInsights = insights.state.status === 'success' ? insights.state.data : []

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setSending(true)
    try {
      await services.copilot.sendMessage(text)
      setDraft('')
      thread.reload()
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="assistant" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="assistant-heading"
        eyebrow="AI travel assistant"
        title="Savvy Copilot — mock adapter with contextual replies."
        description="Swap copilotService for streaming /travel/copilot/chat when the backend is ready."
        action={<LiveIndicator label="Model ready" />}
      />

      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Savvy ecosystem intelligence</p>
        <RequestState loading={insights.state.status === 'loading'} error={insights.state.status === 'error' ? insights.state.error : null} onRetry={insights.reload}>
          <div className="grid gap-3 sm:grid-cols-2">
            {ecosystemInsights.map((insight) => (
              <EcosystemAIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </RequestState>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <RequestState loading={recs.state.status === 'loading'} error={recs.state.status === 'error' ? recs.state.error : null} onRetry={recs.reload}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {recommendations.map((rec, i) => (
              <AIRecommendationCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        </RequestState>

        <GlassPanel className="flex flex-col" glow>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-outfit text-sm font-semibold text-white">Savvy Copilot</p>
            <button
              type="button"
              className="text-[11px] text-slate-500 hover:text-slate-300"
              onClick={() => void services.copilot.clearThread().then(() => thread.reload())}
            >
              Reset thread
            </button>
          </div>
          <div className="max-h-80 flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/5 bg-slate-950/50 p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  'max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'ml-auto bg-gradient-to-br from-sky-500/25 to-violet-500/20 text-slate-50'
                    : 'mr-auto border border-white/5 bg-slate-900/80 text-slate-200',
                ].join(' ')}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form className="mt-4 flex gap-2" onSubmit={(e) => void send(e)}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-sky-400/30 placeholder:text-slate-600 focus:ring-2"
              placeholder="Ask SavvyTrip anything…"
              disabled={sending}
            />
            <NeonButton type="submit" className="shrink-0 px-4" disabled={sending}>
              {sending ? '…' : 'Send'}
            </NeonButton>
          </form>
        </GlassPanel>
      </div>
    </section>
  )
}
