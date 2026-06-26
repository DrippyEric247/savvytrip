export type RouteMode = 'flight' | 'train' | 'rideshare' | 'hotel'

export interface RouteLeg {
  mode: RouteMode
  label: string
  duration: string
  cost: string
}

export interface RouteOption {
  id: string
  title: string
  tagline: string
  totalTime: string
  totalCost: string
  score: number
  savingsVsBaseline?: string
  legs: RouteLeg[]
  highlight?: boolean
}

export interface FeedItem {
  id: string
  time: string
  title: string
  detail: string
  tone: 'deal' | 'route' | 'system' | 'social'
}

export interface Deal {
  id: string
  destination: string
  discount: string
  expires: string
  modes: RouteMode[]
}

export interface SavedTrip {
  id: string
  name: string
  dates: string
  status: 'draft' | 'booked' | 'watching'
}

export interface TrendingSpot {
  id: string
  city: string
  country: string
  delta: string
  imageGradient: string
}

export interface AIRecommendation {
  id: string
  headline: string
  body: string
  confidence: number
  cta: string
}

export const routeOptions: RouteOption[] = [
  {
    id: 'cheapest',
    title: 'Cheapest route',
    tagline: 'Max savings · more connections',
    totalTime: '11h 20m',
    totalCost: '$186',
    score: 92,
    savingsVsBaseline: 'Save $94 vs direct flight',
    legs: [
      { mode: 'train', label: 'Acela · NYC → PHL', duration: '1h 45m', cost: '$42' },
      { mode: 'rideshare', label: 'Pool · PHL airport', duration: '22m', cost: '$18' },
      { mode: 'flight', label: 'PHL → ORD · economy', duration: '2h 10m', cost: '$89' },
      { mode: 'hotel', label: 'Boutique stay · 1 night', duration: '—', cost: '$37' },
    ],
  },
  {
    id: 'fastest',
    title: 'Fastest route',
    tagline: 'Arrive sooner · premium mix',
    totalTime: '6h 05m',
    totalCost: '$412',
    score: 88,
    legs: [
      { mode: 'rideshare', label: 'Express · door to LGA', duration: '38m', cost: '$64' },
      { mode: 'flight', label: 'LGA → ORD · priority', duration: '2h 35m', cost: '$298' },
      { mode: 'rideshare', label: 'Black · ORD to hotel', duration: '42m', cost: '$50' },
    ],
  },
  {
    id: 'best',
    title: 'Best overall',
    tagline: 'SavvyTrip pick · balanced',
    totalTime: '7h 40m',
    totalCost: '$264',
    score: 97,
    savingsVsBaseline: 'Best time-to-price ratio',
    highlight: true,
    legs: [
      { mode: 'train', label: 'Regional · Penn → Newark', duration: '24m', cost: '$16' },
      { mode: 'flight', label: 'EWR → ORD · smart fare', duration: '2h 48m', cost: '$198' },
      { mode: 'rideshare', label: 'Comfort · ORD loop', duration: '35m', cost: '$50' },
    ],
  },
]

export const activityFeed: FeedItem[] = [
  {
    id: '1',
    time: 'Just now',
    title: 'Live fare drop',
    detail: 'NYC → Lisbon cluster down 6% in the last hour.',
    tone: 'deal',
  },
  {
    id: '2',
    time: '2m ago',
    title: 'Route recomposed',
    detail: 'Train + rideshare saved 38m vs rideshare-only for SFO → downtown.',
    tone: 'route',
  },
  {
    id: '3',
    time: '6m ago',
    title: 'Savvy Points',
    detail: 'You would earn +420 pts on the Best overall itinerary (mock).',
    tone: 'system',
  },
  {
    id: '4',
    time: '14m ago',
    title: 'Travelers like you',
    detail: '62% picked train-first for BOS → NYC Friday evenings.',
    tone: 'social',
  },
]

export const liveDeals: Deal[] = [
  {
    id: 'd1',
    destination: 'Tokyo · Haneda cluster',
    discount: '−11%',
    expires: '42:18',
    modes: ['flight', 'hotel'],
  },
  {
    id: 'd2',
    destination: 'Barcelona · spring shoulder',
    discount: '−8%',
    expires: '19:02',
    modes: ['flight', 'train', 'hotel'],
  },
  {
    id: 'd3',
    destination: 'Chicago loop · events week',
    discount: '−15%',
    expires: '03:55',
    modes: ['rideshare', 'hotel'],
  },
]

export const savedTrips: SavedTrip[] = [
  { id: 's1', name: 'NYC ↔ Austin · SXSW', dates: 'Mar 7–14', status: 'watching' },
  { id: 's2', name: 'London long weekend', dates: 'Apr 18–22', status: 'draft' },
  { id: 's3', name: 'SEA family trip', dates: 'Jul 2–12', status: 'booked' },
]

export const trending: TrendingSpot[] = [
  { id: 't1', city: 'Lisbon', country: 'Portugal', delta: '+34% searches', imageGradient: 'from-cyan-500/30 to-violet-600/30' },
  { id: 't2', city: 'Seoul', country: 'South Korea', delta: '+21% searches', imageGradient: 'from-fuchsia-500/25 to-sky-500/25' },
  { id: 't3', city: 'Mexico City', country: 'Mexico', delta: '+18% searches', imageGradient: 'from-emerald-400/20 to-indigo-500/30' },
  { id: 't4', city: 'Reykjavik', country: 'Iceland', delta: '+12% searches', imageGradient: 'from-blue-400/25 to-purple-500/25' },
]

export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'a1',
    headline: 'Shift departure by 50 minutes',
    body: 'A slightly later train unlocks a cheaper ORD leg with the same hotel night — net −$31, +25m travel.',
    confidence: 0.91,
    cta: 'Preview remix',
  },
  {
    id: 'a2',
    headline: 'Bundle rideshare at ORD',
    body: 'Airport surge is cooling; locking a comfort ride now beats last-mile surge 73% of the time.',
    confidence: 0.84,
    cta: 'Simulate pickup',
  },
  {
    id: 'a3',
    headline: 'Hotel swap on night 2',
    body: 'Same star class two blocks away drops the stay $44 with negligible added walk time.',
    confidence: 0.88,
    cta: 'See on map',
  },
]
