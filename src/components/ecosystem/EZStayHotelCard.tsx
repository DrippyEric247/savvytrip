import type { EZStayHotelPick } from '../../data/ecosystemMockData'
import { GlassPanel } from '../ui/GlassPanel'
import { NeonButton } from '../ui/NeonButton'

const variantLabel: Record<EZStayHotelPick['variant'], string> = {
  luxury: 'Luxury stay',
  cheapest: 'Cheapest stay',
  best_rated: 'Best rated',
  airport_close: 'Closest to airport',
}

export function EZStayHotelCard({ hotel }: { hotel: EZStayHotelPick }) {
  return (
    <GlassPanel className="flex h-full flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300/90">{variantLabel[hotel.variant]}</p>
      <h3 className="mt-2 font-outfit text-lg font-semibold text-white">{hotel.name}</h3>
      <p className="text-sm text-slate-500">{hotel.area}</p>
      <p className="mt-2 text-xs text-slate-400">{hotel.distanceNote}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-2">
          <p className="text-[10px] uppercase text-slate-500">Nightly</p>
          <p className="font-semibold text-slate-100">${hotel.nightlyUsd}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-2">
          <p className="text-[10px] uppercase text-slate-500">Savings</p>
          <p className="font-semibold text-emerald-300">−${hotel.savingsVsMedianUsd}</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-2">
          <p className="text-[10px] uppercase text-slate-500">Rewards</p>
          <p className="font-semibold text-violet-200">+{hotel.rewardsSavvy} Savvy</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 px-2 py-2">
          <p className="text-[10px] uppercase text-slate-500">Rating</p>
          <p className="font-semibold text-slate-100">{hotel.rating.toFixed(2)}</p>
        </div>
      </div>
      <NeonButton className="mt-5 w-full">Book with EZStay</NeonButton>
    </GlassPanel>
  )
}
