import type { SavvyAppId } from '../../data/ecosystemMockData'

export function appShortName(id: SavvyAppId): string {
  switch (id) {
    case 'savvytrip':
      return 'SavvyTrip'
    case 'final10':
      return 'Final10'
    case 'ezstay':
      return 'EZStay'
    case 'aigo':
      return 'AI-Go'
    default:
      return id
  }
}

export function appBadgeClass(id: SavvyAppId): string {
  switch (id) {
    case 'savvytrip':
      return 'border-sky-400/35 bg-sky-500/15 text-sky-100'
    case 'final10':
      return 'border-fuchsia-400/35 bg-fuchsia-500/12 text-fuchsia-100'
    case 'ezstay':
      return 'border-violet-400/35 bg-violet-500/12 text-violet-100'
    case 'aigo':
      return 'border-cyan-400/35 bg-cyan-500/12 text-cyan-100'
    default:
      return 'border-white/20 bg-white/5 text-slate-200'
  }
}
