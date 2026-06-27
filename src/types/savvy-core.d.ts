/** Ambient types for @savvy/core Phase 1 (JS package, read-only from Final10). */
declare module '@savvy/core' {
  export const WALLET_AWARD_EVENT: string
  export const REWARD_EVENT: string
  export const SAVVY_AUTH_REFRESH_REQUEST: string
  export const SAVVY_STORE_UPDATED: string
  export const CALLING_CARD_UNLOCK_EVENT: string
  export const SAVVY_ALERT_EVENT: string
  export const SCOUT_MISSION_SYNC_EVENT: string
  export const SCOUT_MISSION_POPUP_EVENT: string
  export const SCOUT_MISSION_ACTION_EVENT: string
  export const BP_UPDATE_EVENT: string
  export const BP_TIER_COMPLETE_EVENT: string
  export const BATTLE_PASS_ACTION_EVENT: string
  export const UNIVERSE_EVENTS: Readonly<Record<string, string>>

  export const SAVVY_REWARDS: Readonly<{
    daily_login: Readonly<{ baseSavvy: number; legacyPoints: number }>
    onboarding_first_move: Readonly<{ baseSavvy: number }>
    streak_milestones: ReadonlyArray<Readonly<{ minDays: number; bonusSavvy: number }>>
  }>
  export const DAILY_LOGIN_BASE_SAVVY: number
  export const ONBOARDING_FIRST_MOVE_SAVVY: number

  export const SAVVY_SCOUT: Readonly<Record<string, string>>
  export const SCOUT_LABELS: Readonly<Record<string, string>>
  export const SCOUT_COPY: Readonly<Record<string, unknown>>
}

declare module '@savvy/core/tokens/theme.css'
