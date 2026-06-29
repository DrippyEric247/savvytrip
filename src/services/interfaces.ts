import type {
  AIRecommendation,
  CopilotMessage,
  CreateAlertInput,
  FeedItem,
  LiveDeal,
  PlannerDay,
  RouteOption,
  SavedTrip,
  ScoutMissionProgress,
  ScoutReport,
  SearchParams,
  SearchResult,
  TravelAlert,
  TrendingSpot,
  TripPlanner,
} from '../domain/travel'

export interface TravelSearchService {
  search(params: SearchParams): Promise<SearchResult>
  getLastSearch(): Promise<SearchResult | null>
  getRoute(routeId: string): Promise<RouteOption | null>
  listRoutes(): Promise<RouteOption[]>
}

export interface SavedTripsService {
  list(): Promise<SavedTrip[]>
  create(input: Omit<SavedTrip, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedTrip>
  update(id: string, patch: Partial<SavedTrip>): Promise<SavedTrip>
  remove(id: string): Promise<void>
  saveFromRoute(route: RouteOption, params: SearchParams): Promise<SavedTrip>
}

export interface DealsService {
  listLive(): Promise<LiveDeal[]>
}

export interface TrendsService {
  list(): Promise<TrendingSpot[]>
}

export interface ActivityService {
  listFeed(): Promise<FeedItem[]>
}

export interface CopilotService {
  getRecommendations(): Promise<AIRecommendation[]>
  getThread(): Promise<CopilotMessage[]>
  sendMessage(text: string): Promise<CopilotMessage[]>
  clearThread(): Promise<void>
}

export interface AlertsService {
  list(): Promise<TravelAlert[]>
  create(input: CreateAlertInput): Promise<TravelAlert>
  toggle(id: string, active: boolean): Promise<TravelAlert>
  remove(id: string): Promise<void>
}

export interface ScoutService {
  getProgress(): Promise<ScoutMissionProgress[]>
  recordAction(action: string): Promise<ScoutMissionProgress[]>
  markClaimed(missionId: string): Promise<ScoutMissionProgress[]>
  buildReport(): Promise<ScoutReport>
}

export interface PlannerService {
  get(): Promise<TripPlanner>
  updateTitle(title: string): Promise<TripPlanner>
  updateDay(dayId: string, patch: Partial<PlannerDay>): Promise<TripPlanner>
  addDay(): Promise<TripPlanner>
  removeDay(dayId: string): Promise<TripPlanner>
}

export interface SavvyTripServices {
  travelSearch: TravelSearchService
  savedTrips: SavedTripsService
  deals: DealsService
  trends: TrendsService
  activity: ActivityService
  copilot: CopilotService
  alerts: AlertsService
  scout: ScoutService
  planner: PlannerService
}
