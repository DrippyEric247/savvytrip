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

export interface SearchParams {
  from: string
  to: string
  depart: string
  returnDate?: string
  modes: RouteMode[]
}

export interface SearchResult {
  searchId: string
  params: SearchParams
  routes: RouteOption[]
  searchedAt: number
}

export interface FeedItem {
  id: string
  time: string
  title: string
  detail: string
  tone: 'deal' | 'route' | 'system' | 'social'
}

export interface LiveDeal {
  id: string
  destination: string
  discount: string
  expiresAt: number
  modes: RouteMode[]
}

export interface SavedTrip {
  id: string
  name: string
  dates: string
  status: 'draft' | 'booked' | 'watching'
  routeId?: string
  from?: string
  to?: string
  createdAt: number
  updatedAt: number
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

export interface TravelAlert {
  id: string
  label: string
  from: string
  to: string
  depart?: string
  targetPrice?: number
  modes: RouteMode[]
  active: boolean
  createdAt: number
}

export interface CreateAlertInput {
  label: string
  from: string
  to: string
  depart?: string
  targetPrice?: number
  modes: RouteMode[]
}

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

export interface ScoutMissionProgress {
  missionId: string
  completed: boolean
  completedAt?: number
  claimed: boolean
}

export interface ScoutReportOpportunity {
  id: string
  title: string
  detail: string
  confidence: 'high' | 'medium' | 'watch'
  routeId?: string
  savingsLabel?: string
}

export interface ScoutReport {
  generatedAt: number
  opportunityCount: number
  opportunities: ScoutReportOpportunity[]
  searchParams?: SearchParams
}

export interface PlannerDay {
  id: string
  label: string
  location: string
  notes: string
}

export interface TripPlanner {
  id: string
  title: string
  days: PlannerDay[]
  updatedAt: number
}
