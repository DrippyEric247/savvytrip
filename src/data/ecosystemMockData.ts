/** Savvy Universe — mock data for Final10, EZStay, AI-Go cross-app orchestration (replace with API). */

export type SavvyAppId = 'savvytrip' | 'final10' | 'ezstay' | 'aigo'

export interface SavvyWalletState {
  balanceSavvy: number
  multiplier: number
  streakDays: number
  tierName: string
  tierProgressPct: number
  sessionRewardsSavvy: number
  projectedSavingsUsd: string
  crossAppBonusActive: boolean
  connectedApps: SavvyAppId[]
  ecosystemMultiplier: number
}

export interface WalletActivity {
  id: string
  time: string
  label: string
  amountSavvy: number
  app: SavvyAppId
}

export interface EcosystemFeedItem {
  id: string
  time: string
  title: string
  detail: string
  savvyDelta?: number
  apps: SavvyAppId[]
}

export interface ConnectedApp {
  id: SavvyAppId
  name: string
  status: 'online' | 'syncing' | 'idle'
  tagline: string
}

export interface SmartCombo {
  id: string
  headline: string
  detail: string
  apps: SavvyAppId[]
  savvyBonusEstimate: string
}

export interface UnifiedRewardsSnapshot {
  ecosystemPointsTotal: number
  monthlySavingsUsd: string
  travelSavingsUsd: string
  shoppingSavingsUsd: string
  comboBonusesSavvy: number
}

export interface EZStayHotelPick {
  id: string
  variant: 'luxury' | 'cheapest' | 'best_rated' | 'airport_close'
  name: string
  area: string
  nightlyUsd: number
  savingsVsMedianUsd: number
  rewardsSavvy: number
  rating: number
  distanceNote: string
}

export interface Final10Snipe {
  id: string
  category: string
  title: string
  estimatedSavingsUsd: number
  trustScore: number
  watcherCount: number
  endingSoon: boolean
  endsIn: string
}

export interface AIGoNavCard {
  id: string
  title: string
  subtitle: string
  eta: string
  trafficLevel: 'low' | 'med' | 'high'
  confidencePct: number
  detail: string
}

export interface EcosystemAIInsight {
  id: string
  source: SavvyAppId
  message: string
  context: string
}

export const savvyWallet: SavvyWalletState = {
  balanceSavvy: 4055,
  multiplier: 1.1,
  streakDays: 2,
  tierName: 'Nebula II',
  tierProgressPct: 68,
  sessionRewardsSavvy: 240,
  projectedSavingsUsd: '$186/mo',
  crossAppBonusActive: true,
  connectedApps: ['final10', 'ezstay', 'aigo'],
  ecosystemMultiplier: 2.5,
}

export const walletRecentActivity: WalletActivity[] = [
  { id: 'w1', time: '2m ago', label: 'Combo bonus · ORD trip stack', amountSavvy: 420, app: 'savvytrip' },
  { id: 'w2', time: '18m ago', label: 'EZStay · redeemed hotel savings', amountSavvy: 310, app: 'ezstay' },
  { id: 'w3', time: '1h ago', label: 'Final10 · travel essentials snipe', amountSavvy: 95, app: 'final10' },
  { id: 'w4', time: '3h ago', label: 'AI-Go · airport traffic reroute', amountSavvy: 55, app: 'aigo' },
]

export const ecosystemActivityFeed: EcosystemFeedItem[] = [
  {
    id: 'e1',
    time: 'Just now',
    title: 'Ecosystem combo bonus',
    detail: 'Final10 + EZStay + AI-Go stack detected on your Chicago itinerary — multiplier lane engaged.',
    savvyDelta: 180,
    apps: ['final10', 'ezstay', 'aigo'],
  },
  {
    id: 'e2',
    time: '4m ago',
    title: 'Points earned · cross-app',
    detail: '+640 Savvy mirrored from EZStay check-in + SavvyTrip route lock.',
    savvyDelta: 640,
    apps: ['ezstay', 'savvytrip'],
  },
  {
    id: 'e3',
    time: '22m ago',
    title: 'Redeemed hotel savings',
    detail: 'EZStay applied member rate −$54 vs OTA baseline for night 2.',
    apps: ['ezstay'],
  },
  {
    id: 'e4',
    time: '1h ago',
    title: 'Final10 · trip purchase',
    detail: 'Noise-canceling set tagged to ORD leg — watchers released, trust held at 96.',
    apps: ['final10'],
  },
  {
    id: 'e5',
    time: '2h ago',
    title: 'AI-Go route optimization',
    detail: 'Pickup point shifted north loop — −7m ETA, surge skirt probability down.',
    apps: ['aigo'],
  },
]

export const connectedApps: ConnectedApp[] = [
  { id: 'final10', name: 'Final10', status: 'online', tagline: 'Deals that finish trips' },
  { id: 'ezstay', name: 'EZStay', status: 'online', tagline: 'Stays that sync to routes' },
  { id: 'aigo', name: 'AI-Go', status: 'online', tagline: 'Traffic-aware ground truth' },
]

export const smartCombos: SmartCombo[] = [
  {
    id: 'c1',
    headline: 'Trip detected → bundle hotel + airport route + travel gear',
    detail: 'SavvyTrip locked ORD dates. EZStay found a closer hub hotel, AI-Go pre-scored terminal pickup, Final10 surfaced carry-on essentials under market.',
    apps: ['savvytrip', 'ezstay', 'aigo', 'final10'],
    savvyBonusEstimate: '+820 Savvy (projected)',
  },
  {
    id: 'c2',
    headline: 'Late arrival window',
    detail: 'Shift hotel to EZStay Express tier + AI-Go night routing avoids construction zone on I-90.',
    apps: ['ezstay', 'aigo'],
    savvyBonusEstimate: '+210 Savvy (projected)',
  },
  {
    id: 'c3',
    headline: 'Long-haul comfort stack',
    detail: 'Final10 neck tech + SavvyTrip seat-aware alerts + AI-Go rideshare rejoin after customs.',
    apps: ['final10', 'savvytrip', 'aigo'],
    savvyBonusEstimate: '+360 Savvy (projected)',
  },
]

export const unifiedRewards: UnifiedRewardsSnapshot = {
  ecosystemPointsTotal: 128_400,
  monthlySavingsUsd: '$612',
  travelSavingsUsd: '$428',
  shoppingSavingsUsd: '$184',
  comboBonusesSavvy: 9020,
}

export const ezstayHotels: EZStayHotelPick[] = [
  {
    id: 'h1',
    variant: 'luxury',
    name: 'Aurora Skyline',
    area: 'River North',
    nightlyUsd: 289,
    savingsVsMedianUsd: 62,
    rewardsSavvy: 520,
    rating: 4.9,
    distanceNote: '0.6 mi to Riverwalk',
  },
  {
    id: 'h2',
    variant: 'cheapest',
    name: 'Circuit Inn Express',
    area: 'West Loop',
    nightlyUsd: 112,
    savingsVsMedianUsd: 41,
    rewardsSavvy: 180,
    rating: 4.2,
    distanceNote: '12m rideshare to core',
  },
  {
    id: 'h3',
    variant: 'best_rated',
    name: 'Harbor House 188',
    area: 'Lakeshore East',
    nightlyUsd: 198,
    savingsVsMedianUsd: 33,
    rewardsSavvy: 340,
    rating: 4.95,
    distanceNote: 'Walk score 94',
  },
  {
    id: 'h4',
    variant: 'airport_close',
    name: 'Runway Suites ORD',
    area: 'Rosemont',
    nightlyUsd: 154,
    savingsVsMedianUsd: 28,
    rewardsSavvy: 260,
    rating: 4.5,
    distanceNote: '8m to ORD T3',
  },
]

export const final10Snipes: Final10Snipe[] = [
  {
    id: 'f1',
    category: 'Luggage',
    title: 'Carbon shell carry-on · graphite',
    estimatedSavingsUsd: 74,
    trustScore: 96,
    watcherCount: 1820,
    endingSoon: true,
    endsIn: '09:14',
  },
  {
    id: 'f2',
    category: 'Headphones',
    title: 'ANC studio buds · flight mode tuned',
    estimatedSavingsUsd: 52,
    trustScore: 94,
    watcherCount: 2640,
    endingSoon: false,
    endsIn: '41:02',
  },
  {
    id: 'f3',
    category: 'Travel backpack',
    title: '35L modular pack · TSA lay-flat',
    estimatedSavingsUsd: 38,
    trustScore: 91,
    watcherCount: 940,
    endingSoon: true,
    endsIn: '03:22',
  },
  {
    id: 'f4',
    category: 'Snacks',
    title: 'Protein + electrolyte flight kit',
    estimatedSavingsUsd: 19,
    trustScore: 88,
    watcherCount: 512,
    endingSoon: false,
    endsIn: '2d',
  },
  {
    id: 'f5',
    category: 'Charging',
    title: 'GaN 100W travel hub · dual USB-C',
    estimatedSavingsUsd: 27,
    trustScore: 93,
    watcherCount: 1402,
    endingSoon: false,
    endsIn: '18:50',
  },
  {
    id: 'f6',
    category: 'Camera',
    title: 'Compact mirrorless · creator bundle',
    estimatedSavingsUsd: 210,
    trustScore: 97,
    watcherCount: 3201,
    endingSoon: true,
    endsIn: '22:08',
  },
  {
    id: 'f7',
    category: 'Gaming',
    title: 'Handheld OLED · travel case included',
    estimatedSavingsUsd: 64,
    trustScore: 92,
    watcherCount: 4102,
    endingSoon: false,
    endsIn: '55:00',
  },
]

export const aiGoNavCards: AIGoNavCard[] = [
  {
    id: 'g1',
    title: 'Airport traffic · ORD inbound',
    subtitle: 'I-90 / I-190 merge',
    eta: '34m',
    trafficLevel: 'high',
    confidencePct: 91,
    detail: 'AI-Go suggests north loop pickup after baggage — avoids terminal curb surge.',
  },
  {
    id: 'g2',
    title: 'Rideshare optimization',
    subtitle: 'Comfort vs Pool',
    eta: 'Door in 6m',
    trafficLevel: 'med',
    confidencePct: 87,
    detail: 'Pool ETA +4m but −$18; comfort wins on tight connection.',
  },
  {
    id: 'g3',
    title: 'Cheapest gas nearby',
    subtitle: 'Within 2mi of route',
    eta: '2m detour',
    trafficLevel: 'low',
    confidencePct: 82,
    detail: 'Price cluster down 3¢/gal vs metro average — quick stop before return leg.',
  },
  {
    id: 'g4',
    title: 'Fastest pickup point',
    subtitle: 'ORD T3 departures',
    eta: 'Walk 3m',
    trafficLevel: 'low',
    confidencePct: 94,
    detail: 'Level 2 rideshare island slot opens in 90s — neural lane locked.',
  },
  {
    id: 'g5',
    title: 'Train timing optimization',
    subtitle: 'Metra → downtown',
    eta: 'Catch in 11m',
    trafficLevel: 'med',
    confidencePct: 89,
    detail: 'Hold ORD ride 2m to align with NCS departure — fewer platform waits.',
  },
]

export const ecosystemAIInsights: EcosystemAIInsight[] = [
  {
    id: 'i1',
    source: 'ezstay',
    message: '🛏 EZStay found a cheaper hotel 0.8 miles away',
    context: 'Same check-in window, higher walk score — SavvyTrip kept your ORD timing intact.',
  },
  {
    id: 'i2',
    source: 'final10',
    message: '🛒 Final10 found travel essentials under market',
    context: 'ANC kit + GaN hub bundle trending for your carry-on profile.',
  },
  {
    id: 'i3',
    source: 'aigo',
    message: '🧭 AI-Go optimized airport traffic route',
    context: 'Terminal approach recalculated after ORD ground delay spike.',
  },
  {
    id: 'i4',
    source: 'savvytrip',
    message: '💰 Using all 3 apps unlocked Ecosystem Bonus',
    context: 'Cross-app bonus lane active — Savvy multiplier elevated for this session.',
  },
]
