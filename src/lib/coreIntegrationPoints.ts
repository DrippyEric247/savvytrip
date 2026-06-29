/**
 * SavvyTrip ↔ @savvy/core integration registry.
 * Search the codebase for these keys when wiring shared Core systems.
 */
export const CORE_INTEGRATION = {
  /** @savvy/core rewards — useSavvyPoints(), SavvyRewardHost, registerPointActions */
  REWARDS_STORE: 'TODO(core): Wire useSavvyPoints() from @savvy/core/rewards — replace SessionBalanceCard balance read',
  REWARD_TOAST: 'TODO(core): Mount SavvyRewardHost from @savvy/core/rewards for earn animations',
  TRAVEL_POINT_ACTIONS: 'TODO(core): registerPointActions(travelPointActions) at app bootstrap',
  /** @savvy/core wallet HUD */
  WALLET_HUD: 'TODO(core): Replace SessionBalanceCard with SavvyWalletBubble + SavvyAssistantDock',
  WALLET_DEEP_LINK: 'TODO(core): Floating HUD deepLink to /wallet#savvy-balance',
  /** @savvy/core scout */
  SCOUT_ENGINE: 'TODO(core): Replace mockScoutService progress with registerMissions("savvytrip", TRAVEL_SCOUT_MISSIONS)',
  SCOUT_CLAIM_API: 'TODO(core): Mission claim → POST /scout/missions/claim + dispatch WALLET_AWARD_EVENT',
  /** @savvy/core notifications */
  ALERTS_DELIVERY: 'TODO(core): Travel alerts → shared notification summary + SAVVY_ALERT_EVENT',
  ALERTS_WIZARD: 'TODO(core): Inject TravelAlertWizardFields into shared alert wizard shell',
  /** @savvy/core battle pass */
  BATTLE_PASS: 'TODO(core): travelLaunchSeason config + recordBattlePassXp via BATTLE_PASS_ACTION_EVENT',
  /** Travel + ecosystem APIs (SavvyTrip backend — not Final10 direct) */
  TRAVEL_API: 'TODO(api): Implement api/travelSearch adapter — VITE_SAVVYTRIP_ADAPTER=api',
  ECOSYSTEM_BFF: 'TODO(api): Replace mockEcosystemService with /ecosystem/* BFF (no direct Final10 coupling)',
  REWARDS_SUMMARY: 'TODO(api): GET /ecosystem/rewards/summary for UnifiedRewardsSection',
  COPILOT_STREAM: 'TODO(api): POST /travel/copilot/chat streaming adapter',
} as const

export type CoreIntegrationKey = keyof typeof CORE_INTEGRATION
