import { useState } from 'react'
import { ecosystemAIInsights } from '../../data/ecosystemMockData'
import { aiRecommendations } from '../../data/mockData'
import { AIRecommendationCard } from '../cards/AIRecommendationCard'
import { EcosystemAIInsightCard } from '../ecosystem/EcosystemAIInsightCard'
import { GlassPanel } from '../ui/GlassPanel'
import { LiveIndicator } from '../ui/LiveIndicator'
import { NeonButton } from '../ui/NeonButton'
import { SectionHeading } from '../ui/SectionHeading'

const starterMessages = [
  { role: 'assistant' as const, text: 'Ask for tradeoffs, surge windows, or “cheapest before noon.” I stay grounded in your constraints.' },
  { role: 'user' as const, text: 'If I must be in Chicago by 6pm, what’s the savviest train-first option from NYC?' },
  {
    role: 'assistant' as const,
    text: 'Previewing: Acela to PHL → short hop → ORD lands you earlier with lower rideshare stress than a single LGA rush. I can stress-test that against price when APIs connect.',
  },
]

export function AIAssistantSection() {
  const [draft, setDraft] = useState('')

  return (
    <section id="assistant" className="mt-24 scroll-mt-28 lg:scroll-mt-24">
      <SectionHeading
        id="assistant-heading"
        eyebrow="AI travel assistant"
        title="An assistant that explains the plan — and knows the rest of your Savvy stack."
        description="Trip-native nudges to EZStay, Final10, and AI-Go read as intelligence, not ads: same glass language, contextual copy, and live confidence."
        action={<LiveIndicator label="Model ready" />}
      />

      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Savvy ecosystem intelligence</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ecosystemAIInsights.map((insight) => (
            <EcosystemAIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {aiRecommendations.map((rec, i) => (
            <AIRecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>

        <GlassPanel className="flex flex-col" glow>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-outfit text-sm font-semibold text-white">Savvy Copilot</p>
            <span className="text-[11px] text-slate-500">Session · local-only</span>
          </div>
          <div className="flex-1 space-y-3 overflow-hidden rounded-xl border border-white/5 bg-slate-950/50 p-3">
            {starterMessages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
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
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setDraft('')
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none ring-sky-400/30 placeholder:text-slate-600 focus:ring-2"
              placeholder="Ask SavvyTrip anything…"
            />
            <NeonButton type="submit" className="shrink-0 px-4">
              Send
            </NeonButton>
          </form>
          <p className="mt-2 text-[11px] text-slate-500">No backend yet — sends clear locally and resets the field.</p>
        </GlassPanel>
      </div>
    </section>
  )
}
