# Savvy Core Extraction Plan

**Status:** Planning only — no implementation yet  
**Source of truth:** `C:\Users\ericv\final10`  
**Consumer (later):** SavvyTrip (`SavvyTrip/`)  
**Principle:** Extract from Final10. Do not duplicate into SavvyTrip. Do not break Final10. Do not rename `client/src` folders until late-phase re-exports are proven.

---

## Target package layout (end state)

New package at **`final10/packages/savvy-core/`** (sibling to `server/packages/savvy-shield-sdk/`).

```
final10/packages/savvy-core/
├── package.json              # name: @savvy/core
├── README.md
├── src/
│   ├── index.js              # public API barrel (phased)
│   ├── auth/
│   ├── rewards/
│   ├── wallet/
│   ├── scout/
│   ├── perk/
│   ├── eggs/
│   ├── battle-pass/
│   ├── inventory/
│   ├── events/
│   ├── notifications/
│   ├── ui/
│   ├── audio/
│   ├── tokens/
│   └── config/
└── scripts/
    └── verify-parity.js      # drift check vs client/src originals
```

Final10 `client/` keeps **thin re-export shims** (same paths) for backward compatibility:

```js
// client/src/lib/pointsEngine.js (late phase)
export * from '@savvy/core/rewards/pointsEngine';
```

SavvyTrip consumes `@savvy/core` directly — never copies source.

---

## Extraction phases (overview)

| Phase | Scope | Final10 visible change |
|-------|--------|----------------------|
| **1** | Package scaffold + leaf constants/tokens/events only | **None** |
| **2** | Rewards + event bus + config parity | None (verify script only) |
| **3** | Auth API slice + AuthContext (parameterized) | None until opt-in re-export |
| **4** | Wallet store + HUD + audio | Re-export shims; same UI |
| **5** | Scout + notifications shell | Re-export shims |
| **6** | Inventory + cosmetics catalog core | Re-export shims |
| **7** | Perk + eggs + battle pass engines | Re-export shims |
| **8** | UI primitives + theme | Re-export shims |
| **9** | SavvyTrip wires `@savvy/core`; remove SavvyTrip duplicates | SavvyTrip only |

---

## 1. Auth Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/context/AuthContext.js` | Session provider, hydrate user |
| `client/src/lib/api.js` | `loginUser`, `registerUser`, `getMe`, `setAuthToken`, `STORAGE_KEY` (`f10_token`) |
| `client/src/lib/apiRequestGate.js` | Rate-limit / cooling-down errors |
| `client/src/lib/apiErrorParsing.js` | User-safe error messages |
| `client/src/lib/membershipSync.js` | `hydrateMembershipFromApi` |
| `client/src/lib/devOverride.js` | Dev savvy offset (Final10 dev only) |
| `client/src/components/auth/SocialAuthButtons.js` | OAuth buttons |
| `client/src/components/auth/AuthDebugFooter.js` | Dev footer |
| `client/src/pages/Login.js` | Login + post-login reward chain |
| `client/src/pages/Register.js` | Signup |
| `client/src/pages/ForgotPassword.js` | Password reset request |
| `client/src/pages/ResetPassword.js` | Password reset submit |
| `client/src/pages/SocialAuthCallback.js` | OAuth JWT landing |
| `client/src/components/InternalRoute.js` | Role-gated routes |
| `client/src/App.js` | `ProtectedRoute` inline pattern |

### What should become shared (`@savvy/core/auth`)

- `STORAGE_KEY` contract (configurable per app: `f10_token` / `savvytrip_token` → same universe token ideally)
- Auth API slice: `setAuthToken`, `loginUser`, `registerUser`, `getMe`, `getAuthProviders`, password reset
- `AuthProvider` + `useAuth` with **injectable config**:
  - `storageKey`, `onHydrateUser`, `onLoginSuccess`, `apiBaseUrl`
- `ProtectedRoute` / `requireAuth` HOC
- `parseApiError` / `userSafeErrorMessage`
- `apiRequestGate` (cooling-down)

### What should stay Final10-specific

- `Login.js` post-login chain (daily claim → BP XP → founding tester → onboarding redirects)
- `devOverride.js` / `FINAL10_DEV_OVERRIDE_EVENT`
- `InternalRoute` admin role matrix tied to Final10 admin pages
- `membershipSync` if tied to Final10 premium SKUs only (extract interface; F10 fills implementation)
- Social OAuth redirect URLs branded Final10
- `AuthDebugFooter`

### Safe migration steps

1. Extract **auth API functions** into `@savvy/core/auth/api.js` — copy, no client import change.
2. Extract **error parsing + token helpers** (zero UI deps).
3. Refactor `AuthContext` to accept `createAuthConfig({ appId: 'final10' })`; move file to package; leave **re-export** at `client/src/context/AuthContext.js`.
4. Add `ProtectedRoute` to package; `App.js` imports from re-export path.
5. Parameterize storage key via env (`REACT_APP_SAVVY_TOKEN_KEY`, default `f10_token` for backward compat).
6. SavvyTrip later: `createAuthConfig({ appId: 'savvytrip', storageKey: 'savvy_universe_token' })` when SSO lands.

### Risk level

**Medium** — touches every protected route; token key change could log users out if mishandled.

### How SavvyTrip will consume later

```tsx
// SavvyTrip main.tsx (future)
<AuthProvider config={savvyTripAuthConfig}>
  <SavvyPointsProvider>
    <App />
  </SavvyPointsProvider>
</AuthProvider>
```

Same `GET /auth/me` → `user.savvyPoints`. No second auth system.

---

## 2. Rewards Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/store/savvyStore.js` | Canonical balance context |
| `client/src/store/savvyStore.d.ts` | TS types |
| `client/src/lib/pointsEngine.js` | Client wallet UX ledger, `WALLET_AWARD_EVENT` |
| `client/src/lib/rewardEngine.js` | Toast presets, `REWARD_EVENT` |
| `client/src/context/PointsRewardContext.tsx` | Bridges rewards → wallet + scout |
| `client/src/config/savvyRewards.js` | Display constants (mirror server) |
| `server/config/savvyRewards.js` | **Server source** — not moved; documented contract |
| `client/src/lib/tierMultiplier.js` | Subscription tier multipliers |
| `client/src/lib/pointsEventMultipliers.js` | Event-specific multipliers |
| `client/src/lib/savvyValue.js` | Dollar formatting |
| `client/src/lib/universalBoostProgress.js` | Cross-feature boost bar |
| `client/src/components/rewards/SavvyPointsIcon.tsx` | Icon |
| `client/src/components/rewards/PointsEarnedToast.tsx` | Toast UI |
| `client/src/components/rewards/PointsEarnedEffect.tsx` | Effect wrapper |
| `client/src/components/rewards/FloatingPointBurst.tsx` | Burst animation |
| `client/src/components/rewards/SavvyRewardBadge.jsx` | Badge |
| `client/src/components/rewards/DualEarnChip.jsx` | Dual earn chip |
| `client/src/components/rewards/SavvyDealRewardsIntegration.jsx` | **Final10 deals** integration |
| `client/src/components/Final10RewardHost.js` | Global toast host |
| `client/src/pages/PointsPage.js` | Redirects to profile balance |
| `client/src/pages/DailyStreak.js` | Streak claims |

### What should become shared

- `savvyStore.js` + `useSavvyPoints` (entire provider)
- `pointsEngine.js` (wallet snapshot, award dispatch, `POINT_ACTION_DEFAULTS`)
- `rewardEngine.js` core: `REWARD_EVENT`, `emitReward`, preset **base** shapes
- `config/savvyRewards.js` (shared constants)
- `savvyValue.js` formatters
- Reward **visual kit** (icon, toast, burst, badge) — not deal integration
- `Final10RewardHost` → rename to `SavvyRewardHost` in package
- Event constants: `SAVVY_AUTH_REFRESH_REQUEST`, `SAVVY_STORE_UPDATED` from `savvyStore.js`

### What should stay Final10-specific

- `SavvyDealRewardsIntegration.jsx` (eBay/deal triggers)
- `universalBoostProgress.js` if only used for auction power bar (extract later behind feature flag)
- `tierMultiplier.js` Final10 subscription SKUs
- `PointsPage.js` route wiring
- Daily streak **page** layout (engine can be shared)
- `REWARD_PRESETS` entries only used by auction flows (`save_item`, `promote`, etc.) — move to `@savvy/core/config/final10RewardPresets.js` or app overlay

### Safe migration steps

1. Phase 1–2: extract `savvyRewards.js` + event names only.
2. Move `pointsEngine.js` to package; **identical** `STORAGE_KEY` (`f10_savvy_wallet_v1`) until universe wallet unification spec exists.
3. Move `savvyStore.js`; client re-export.
4. Move reward components + `SavvyRewardHost`; `App.js` imports from re-export.
5. Split `rewardEngine` presets: `corePresets` + `final10Presets` merged at app bootstrap.
6. Add parity test: award event → store sync → bubble animation (smoke).

### Risk level

**High** — balance display is user-visible; any desync between auth and store breaks trust.

### How SavvyTrip will consume later

- Delete SavvyTrip `SavvyWallet.tsx` mock ledger; use `useSavvyPoints()` + shared HUD.
- Travel-specific award types added to `POINT_ACTION_DEFAULTS` via `registerPointActions({ book_flight: {...} })` — **extend**, don't fork store.

---

## 3. Savvy Balance HUD

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/components/wallet/SavvyWalletBubble.jsx` | Floating HUD |
| `client/src/styles/SavvyWalletBubble.css` | HUD styles |
| `client/src/components/profile/SavvyBalanceCard.tsx` | Profile deep card |
| `client/src/styles/ProfilePageLayout.css` | `.savvy-balance-*` styles |
| `client/src/components/Final10SideAssistant.js` | Dock: wallet + scout orb |
| `client/src/hooks/useMediaQuery.js` | Mobile collapse |
| `client/src/lib/savvyWalletSound.js` | Wallet sounds (see Audio Core) |
| `client/src/config/savvyScoutBranding.js` | `SCOUT_COPY.wallet` strings |

### What should become shared

- `SavvyWalletBubble` + CSS (tier bands, flying coins, mobile sheet)
- `SavvyBalanceCard` + related CSS variables
- `SavvyAssistantDock` (rename from `Final10SideAssistant` shell — slots for scout button)
- `useMediaQuery`
- Tier band config (extract `TIER_BANDS` to `@savvy/core/config/tiers.js`)

### What should stay Final10-specific

- Scout orb wiring to deal coach / Quick Snipes (`SavvyScoutButton` deal actions)
- Final10-only quick links in wallet drawer
- Profile layout sections beyond balance slot

### Safe migration steps

1. Extract CSS tokens used by wallet into `@savvy/core/tokens/wallet.css`.
2. Move `SavvyWalletBubble` + `SavvyBalanceCard` with peer deps (`savvyStore`, `pointsEngine`, `scoutBranding`).
3. Move `useMediaQuery`.
4. Refactor `Final10SideAssistant` → thin F10 wrapper composing `@savvy/core/wallet/SavvyAssistantDock` + F10 scout.
5. Do **not** change mount position in `App.js` until re-export verified.

### Risk level

**Medium** — mobile collapse timing/regression risk; visual parity must be pixel-checked.

### How SavvyTrip will consume later

```tsx
<SavvyAssistantDock
  scoutSlot={<PilotScoutButton />}
  walletProps={{ deepLink: '/profile#savvy-balance' }}
/>
```

Remove inline `SavvyWalletSection` duplicate; keep wallet on profile + floating HUD only.

---

## 4. Savvy Scout Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/config/savvyScoutBranding.js` | Persona copy (`SAVVY_SCOUT`, `SCOUT_COPY`, `SCOUT_LABELS`) |
| `client/src/lib/savvyScoutMissions.js` | Mission catalog, progress, claim |
| `client/src/lib/savvyScoutState.js` | `SCOUT_STATE_EVENT`, deal-found events |
| `client/src/context/SavvyScoutMissionsContext.jsx` | React context |
| `client/src/components/scout/SavvyScoutMissionsPanel.jsx` | Mission list UI |
| `client/src/components/scout/SavvyScoutMissionPopup.jsx` | Popup UI |
| `client/src/components/SavvyScoutButton.jsx` | Floating scout orb |
| `client/src/components/SavvyScoutDealToast.jsx` | Deal toast |
| `client/src/pages/MissionLog.js` | Mission log page |
| `client/src/lib/api.js` | `claimScoutMissionReward` |
| `client/src/components/deals/QuickSnipesSavvyResults.jsx` | **“Savvy Scout Report”** header pattern |
| `client/src/components/perk/PerkMachineScoutFloater.js` | Perk scout dialogue |

### What should become shared

- **Branding config pattern** — `createScoutBranding({ id: 'savvy-scout' | 'pilot-scout', ... })`
- `savvyScoutMissions.js` **engine** (localStorage progress, `recordScoutMissionAction`, claim API)
- Mission UI components (panel, popup, mission card)
- Scout event constants (`SCOUT_MISSION_*`)
- `SavvyScoutButton` **shell** (orb UI, expand panel — actions injected)
- Scout Report **layout component** (title, opportunity count, confidence pills) — data-agnostic

### What should stay Final10-specific

- Mission catalog **definitions** (save_item, create_alert, ebay watch, etc.)
- `QuickSnipesSavvyResults.jsx` data plumbing
- `savvyScoutState.js` deal-found events tied to eBay
- `PerkMachineScoutFloater` copy (can use shared dialogue runner)
- `MissionLog.js` page chrome if auction-themed

### Safe migration steps

1. Extract `savvyScoutBranding.js` → `@savvy/core/scout/branding/savvyScout.js` (default export).
2. Add `@savvy/core/scout/branding/pilotScout.js` (new, no F10 behavior change).
3. Move mission **engine** with mission registry as injectable `registerMissions(appId, missions[])`.
4. Move UI components; F10 registers `final10Missions` at bootstrap.
5. Extract `ScoutReportHeader` presentational component from Quick Snipes.
6. Keep `SavvyScoutButton` in F10 until dock refactor; then shared shell.

### Risk level

**Medium** — mission progress localStorage keys must stay stable (`f10_scout_missions_v1`).

### How SavvyTrip will consume later

- `pilotScoutBranding` for all copy.
- `travelScoutMissions.ts` registers triggers: `book_flight`, `save_route`, `create_travel_alert`.
- `/scout-report` uses `ScoutReportHeader` + travel results.
- `/scout-goals` uses shared `MissionLog` layout + travel mission registry.

---

## 5. Perk Machine Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/pages/PerkMachine.js` | Main page (~700+ lines) |
| `client/src/components/perk/PerkMachineEnvironment.js` | Visual machine |
| `client/src/components/perk/PerkMachineScoutFloater.js` | Scout dialogue |
| `client/src/components/perk/PerkMachineAdminPanel.js` | Admin |
| `client/src/styles/PerkMachine.css` | |
| `client/src/styles/PerkMachineEnvironment.css` | |
| `client/src/lib/perkScoutDialogue.js` | Dialogue lines |
| `client/src/lib/api.js` | `getPerkMachineStatus`, `spinPerkMachine`, `activatePerkItem` |

### What should become shared

- API client functions (perk endpoints)
- Spin **state machine** (reel phases, reveal sequence) — extract from page
- `ACTIVATABLE_DEFS` **schema** (token activation pattern)
- Shared spin cost constants
- Optional: `PerkMachineEnvironment` if travel reskin only swaps CSS

### What should stay Final10-specific

- `PerkMachine.js` page composition and Final10 art direction
- Admin panel
- `perkScoutDialogue.js` market-themed lines
- CSS theming assets

### Safe migration steps

1. Extract API slice to `@savvy/core/perk/api.js`.
2. Extract `usePerkMachine` hook (status load, spin, patch balance).
3. Extract reveal animation util (`runRevealSequence`).
4. Leave page in F10 importing hook from package.
5. SavvyTrip: optional `/perk-machine` with travel skin — **later phase**.

### Risk level

**Medium–High** — spin ties to server economy; animation regression annoys users.

### How SavvyTrip will consume later

- Same API, travel-themed page wrapper.
- Low priority vs dashboard/flights/alerts.

---

## 6. Egg Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/lib/eggHatchery.js` | `EGG_TIERS`, `buildOwnedEggs` |
| `client/src/components/perk/EggHatchery.js` | Grid UI |
| `client/src/components/perk/EggCard.js` | Card UI |
| `client/src/components/perk/EggHatchModal.js` | Hatch cinematic |
| `client/src/styles/EggHatchery.css` | |
| `client/src/lib/api.js` | `hatchPerkEgg` |
| `client/src/pages/PerkMachine.js` | `EggInventoryPanel` inline |

### What should become shared

- `eggHatchery.js` tier definitions + builders
- `EggCard`, `EggHatchModal`, `EggHatchery` components
- `EggHatchery.css`
- Hatch API wrapper

### What should stay Final10-specific

- Egg art assets / tier names if market-themed
- Inline `EggInventoryPanel` in PerkMachine (move to shared `EggInventoryPanel` when ready)

### Safe migration steps

1. Move `eggHatchery.js` (pure data).
2. Move components + CSS together (avoid broken imports).
3. F10 re-exports; PerkMachine imports from re-export paths.
4. Add travel tier overrides via `mergeEggTiers(base, travelOverrides)` — optional, later.

### Risk level

**Low–Medium** — mostly isolated to perk machine route.

### How SavvyTrip will consume later

- Import egg components for travel perk machine or BP egg rewards.
- No separate egg system in SavvyTrip.

---

## 7. Battle Pass Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/pages/BattlePassPage.tsx` | Season page |
| `client/src/components/battlePass/BattlePassRewardTracks.tsx` | Tier tracks |
| `client/src/components/battlePass/BattlePassAdminPanel.tsx` | Admin |
| `client/src/styles/BattlePassPage.css` | |
| `client/src/lib/battlePassConfig.js` | Season + tiers + `BP_*_EVENT` |
| `client/src/lib/battlePassEngine.js` | Local XP state |
| `client/src/lib/battlePassRewards.ts` | Rarity, claim messages |
| `client/src/lib/battlePassRewardEngine.ts` | Grant resolution |
| `client/src/lib/battlePassProgressEngine.ts` | Progress math |
| `client/src/lib/battlePassActionBus.js` | `BATTLE_PASS_ACTION_EVENT` |
| `client/src/lib/battlePassActionEventFactory.ts` | Event factory |
| `client/src/lib/battlePassTaskEngine.js` | Task matching |
| `client/src/lib/battlePassTaskMatchers.ts` | |
| `client/src/lib/battlePassTaskResolvers.js` | |
| `client/src/hooks/useBattlePassProgress.ts` | |
| `client/src/hooks/useProgression.ts` | |
| `client/src/components/battlePassTasks/*` | Task UI (15 files) |
| `client/src/types/battlePass*.ts` | TS types |
| `client/src/lib/api.js` | `claimBattlePassTier` |

### What should become shared

- Entire BP **engine** stack (config schema, XP, claim, events)
- `BattlePassRewardTracks` UI
- Task components + hooks
- `createBattlePassSeason({ id, tiers, tasks })` factory
- Types

### What should stay Final10-specific

- `battlePassConfig.js` **season content** (tier rewards referencing auction items)
- `BattlePassPage.tsx` marketing copy / season art
- Admin panels
- Task definitions that reference eBay actions

### Safe migration steps

1. Extract types + event constants.
2. Move engines (no UI).
3. Move `BattlePassRewardTracks` + CSS.
4. F10 season config stays in `client/src/config/battlePass.final10.js` importing shared schema.
5. Add `battlePass.travel.ts` in SavvyTrip later — separate season id.

### Risk level

**Medium** — localStorage XP keys (`f10_battle_pass_*`) must not reset on migration.

### How SavvyTrip will consume later

- `Travel Battle Pass season preview` = shared page + `travelSeasonPreview` config.
- `recordBattlePassXp` from travel actions via shared `battlePassActionBus`.

---

## 8. Inventory Core

Inventory in Final10 spans **perk tokens/eggs** and **cosmetics/calling cards**.

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/pages/PerkMachine.js` | `ACTIVATABLE_DEFS`, token list, egg counts |
| `client/src/lib/customizationCatalog.js` | Calling cards, emblems, unlock predicates |
| `client/src/components/CallingCard.js` | Card component |
| `client/src/styles/CallingCard.css` | |
| `client/src/lib/equipCallingCard.js` | Equip helper |
| `client/src/lib/callingCardUnlockBus.js` | Unlock ceremony event |
| `client/src/lib/callingCardUnlockSound.js` | Unlock sound |
| `client/src/components/cosmetics/CallingCardUnlockCeremony.jsx` | Ceremony UI |
| `client/src/hooks/useCosmetics.ts` | Server equip API |
| `client/src/pages/Customization.js` | Loadout page |
| `client/src/lib/adminCosmetics.js` | Admin grants |
| `client/src/pages/SavvyShopPage.js` | Shop (if applicable) |

### What should become shared

- `CallingCard` + CSS
- `customizationCatalog.js` **framework** (registry, equip localStorage, unlock checks)
- `equipCallingCard.js`, `callingCardUnlockBus.js`, ceremony component
- `useCosmetics` hook
- Generic `InventoryList` / `ActivatableTokenRow` patterns from perk machine
- `registerInventoryItems(appId, items)` extension API

### What should stay Final10-specific

- Individual calling card definitions with auction unlock rules
- `SavvyShopPage` SKUs
- `adminCosmetics` grant UI
- Perk machine `ACTIVATABLE_DEFS` content

### Safe migration steps

1. Move `CallingCard` + ceremony + unlock bus (depends on Audio + Events cores).
2. Split `customizationCatalog.js` → `catalogCore.js` + `final10Catalog.js`.
3. Extract activatable token row UI from PerkMachine.
4. F10 catalog file re-exports merged registry at old import path.

### Risk level

**Medium** — unlock predicates reference `savvyStore` balance; register getter must stay wired.

### How SavvyTrip will consume later

- `savvytripCatalog.ts` adds travel calling cards.
- Profile header shows equipped travel card via same `CallingCard` component.

---

## 9. Notification / Event Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/lib/pointsEngine.js` | `WALLET_AWARD_EVENT` |
| `client/src/lib/rewardEngine.js` | `REWARD_EVENT` |
| `client/src/store/savvyStore.js` | `SAVVY_AUTH_REFRESH_REQUEST`, `SAVVY_STORE_UPDATED` |
| `client/src/lib/savvyAlerts.js` | `SAVVY_ALERT_EVENT` |
| `client/src/lib/callingCardUnlockBus.js` | `CALLING_CARD_UNLOCK_EVENT` |
| `client/src/lib/savvyScoutMissions.js` | `SCOUT_MISSION_*` |
| `client/src/lib/savvyScoutState.js` | `SCOUT_*_EVENT` |
| `client/src/lib/battlePassConfig.js` | `BP_UPDATE_EVENT`, `BP_TIER_COMPLETE_EVENT` |
| `client/src/lib/battlePassActionBus.js` | `BATTLE_PASS_ACTION_EVENT` |
| `client/src/lib/api.js` | `getNotificationSummary`, `markNotificationsRead` |
| `client/src/components/Navigation.js` | Badge polling |
| `client/src/pages/AlertsCommandCenter.js` | Alerts page |
| `client/src/components/alerts/SmartAlertCreationWizard.jsx` | Wizard |
| `client/src/lib/smartAlertWizardEngine.js` | Wizard logic |
| `client/src/lib/alertTierPermissions.js` | Tier gating |

### What should become shared

- **`@savvy/core/events/universeEvents.js`** — single registry of all cross-app event strings
- Thin `eventBus.ts`: `dispatchSavvyEvent(name, detail)`, `onSavvyEvent(name, handler)`
- Notification API slice: `getNotificationSummary`, `markNotificationsRead`
- `useNotificationBadge` hook (poll + mark read)
- Alert wizard **shell** (steps UI, validation framework)
- `alertTierPermissions` pattern (config-driven)

### What should stay Final10-specific

- `smartAlertWizardEngine.js` eBay keyword logic
- `savvyAlerts.js` `createSavvyAlert` payload shape for auctions
- `AlertsCommandCenter.js` radar hero / auction copy
- Dev alert simulators (`devAlertSimulator.ts`)

### Safe migration steps

1. **Phase 1:** consolidate event constants only (no consumer changes).
2. Add typed event map (JSDoc or TS) documenting payload shapes.
3. Move notification API + badge hook.
4. Extract wizard **framework**; F10 injects `final10AlertFields`.
5. Never rename existing event strings — cross-tab sync depends on them.

### Risk level

**Low** for constants only; **Medium** for notification polling changes.

### How SavvyTrip will consume later

- Travel alerts use same notification summary endpoint (extended `kind: 'travel_price_drop'`).
- Same badge hook in SavvyTrip nav.
- Travel wizard injects route/date fields into shared wizard framework.

---

## 10. UI Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/styles/theme.css` | CSS variables, `.card`, `.btn`, `.container` |
| `client/src/index.css` | Safe-area FAB lane |
| `client/src/components/ui/states/LoadingState.jsx` | |
| `client/src/components/ui/states/ErrorState.jsx` | |
| `client/src/components/ui/states/EmptyState.jsx` | |
| `client/src/components/ui/states/index.js` | |
| `client/src/components/ui/PageRequestState.jsx` | |
| `client/src/components/SavvyMark.tsx` | Brand mark |
| `client/src/components/Final10Logo.js` | **F10 logo** |
| `client/src/config/final10Branding.js` | **F10 brand** |
| `client/src/components/AppErrorBoundary.js` | Error boundary |

### What should become shared

- `theme.css` tokens → `@savvy/core/tokens/theme.css`
- State components (loading/error/empty)
- `PageRequestState`
- `SavvyMark` (universe mark)
- Utility classes: `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.chip`, `.glow`
- `AppErrorBoundary` (parameterized fallback)

### What should stay Final10-specific

- `Final10Logo`, `Final10Slogan`, `final10Branding.js`
- `ProductFeed.css` (nav styling can split: `savvyNav.css` vs F10 feed)
- Page-specific CSS files (66 feature styles)

### Safe migration steps

1. Phase 1: copy CSS variables to package `tokens/theme.css`.
2. Final10 `theme.css` becomes `@import '@savvy/core/tokens/theme.css';` + F10 overrides (late phase).
3. Move state components; update imports via re-export.
4. Do **not** force Tailwind on Final10; SavvyTrip can map tokens to Tailwind `@theme` separately.

### Risk level

**Low** for states; **Medium** for global CSS import order.

### How SavvyTrip will consume later

- Import `@savvy/core/tokens/theme.css` in `index.css` (replace duplicated `@theme` values).
- Use shared `LoadingState` / `ErrorState` instead of bespoke loaders.
- Keep SavvyTrip `GlassPanel` as thin wrapper over `.card` token compat layer.

---

## 11. Audio Core

### Existing Final10 files involved

| File | Role |
|------|------|
| `client/src/lib/savvyWalletSound.js` | Wallet coin sounds, mute pref |
| `client/src/lib/callingCardUnlockSound.js` | Ceremony sound |
| `client/src/components/wallet/SavvyWalletBubble.jsx` | Consumes wallet sound |
| `client/src/components/cosmetics/CallingCardUnlockCeremony.jsx` | Consumes unlock sound |

### What should become shared

- `savvyWalletSound.js` (mute key, `playSavvyWalletSound`, `playUiClick`)
- `callingCardUnlockSound.js`
- Optional: unified `savvyAudio.js` facade with `prefers-reduced-motion` guard

### What should stay Final10-specific

- Any auction/deal SFX if separate files exist
- Perk machine reel sounds (if in page, extract later)

### Safe migration steps

1. Move audio libs to `@savvy/core/audio/` (zero React deps).
2. Re-export from original paths.
3. Mute key stays `f10_savvy_wallet_sound_mute` for backward compat OR namespace by `appId`.

### Risk level

**Low**

### How SavvyTrip will consume later

- HUD and ceremonies auto-use shared audio.
- Pilot Scout can call `playUiClick` from package.

---

## Cross-core dependency graph

```
events/constants ─────────────────────────────────┐
config/savvyRewards ──────────────────────────────┤
tokens/theme.css ─────────────────────────────────┤
                                                  ▼
audio ◄── wallet/HUD ◄── rewards/savvyStore ◄── auth/api
                  ▲              ▲
                  └── scout ◄────┘
inventory/callingCard ◄── events (unlock)
battle-pass ◄── events + rewards
perk/eggs ◄── rewards + inventory
notifications ◄── events + auth
ui/states ◄── (used by all)
```

**Extract order constraint:** Events → Config → Audio → Rewards → Auth → Wallet HUD → Scout → Notifications → Inventory → Eggs → Perk → Battle Pass → UI states migration.

---

## SavvyTrip duplicate removal map (later — Phase 9)

| SavvyTrip file (current) | Replace with |
|--------------------------|--------------|
| `src/components/ecosystem/SavvyWallet.tsx` | `@savvy/core/wallet/SavvyWalletBubble` + profile card |
| `src/data/ecosystemMockData.ts` (wallet slice) | `useSavvyPoints()` + API |
| `src/components/ui/LoadingBar.tsx` | Keep OR align API; use `LoadingState` for page loads |
| `src/components/ui/GlassPanel.tsx` | Wrapper over `@savvy/core` `.card` tokens |
| `src/components/ui/LiveIndicator.tsx` | Keep if API matches; optional merge later |
| `src/index.css` `@theme` colors | Import `@savvy/core/tokens` |

**Do not delete SavvyTrip files until `@savvy/core` is wired and builds.**

---

## Verification strategy (all phases)

1. **`verify-parity.js`** — checksum or AST compare package copies vs `client/src` originals.
2. **Final10 CI** — `npm test` + `npm run build` unchanged after each phase.
3. **Import smoke** — no file in `client/src` imports `@savvy/core` until re-export shim exists.
4. **Cross-app smoke (Phase 9)** — login F10 → open SavvyTrip → same `savvyPoints`.

---

# Phase 1 implementation (only)

**Goal:** Create Savvy Core with **zero visible changes** to Final10.

### What Phase 1 does

1. **Create** `final10/packages/savvy-core/` package skeleton.
2. **Copy** (not move) leaf modules with **no Final10 internal imports**:
   - `src/events/universeEvents.js` — consolidated constants from:
     - `pointsEngine.js` → `WALLET_AWARD_EVENT`
     - `rewardEngine.js` → `REWARD_EVENT`
     - `savvyStore.js` → `SAVVY_AUTH_REFRESH_REQUEST`, `SAVVY_STORE_UPDATED`
     - `callingCardUnlockBus.js` → `CALLING_CARD_UNLOCK_EVENT`
     - `savvyAlerts.js` → `SAVVY_ALERT_EVENT`
     - `savvyScoutMissions.js` → `SCOUT_MISSION_*`
     - `battlePassConfig.js` → `BP_*_EVENT`
     - `battlePassActionBus.js` → `BATTLE_PASS_ACTION_EVENT`
   - `src/config/savvyRewards.js` — verbatim from `client/src/config/savvyRewards.js`
   - `src/config/scoutBranding.js` — verbatim from `client/src/config/savvyScoutBranding.js`
   - `src/tokens/theme.css` — CSS variables + `.card`/`.btn` base from `client/src/styles/theme.css` (variables section only)
3. **Add** `package.json`:
   ```json
   { "name": "@savvy/core", "version": "0.1.0", "private": true, "main": "src/index.js" }
   ```
4. **Add** `src/index.js` barrel exporting only the above.
5. **Add** `scripts/verify-parity.js` — fails if client originals drift from package copies without updating both.
6. **Add** root script in `final10/package.json`:
   ```json
   "verify:savvy-core": "node packages/savvy-core/scripts/verify-parity.js"
   ```
7. **Do NOT:**
   - Change any `client/src/**` import
   - Add `@savvy/core` to `client/package.json` dependencies yet
   - Touch SavvyTrip repo
   - Rename any Final10 folder
   - Move or delete originals

### What Phase 1 does not do

- No React components
- No auth, wallet, or HUD extraction
- No SavvyTrip consumption
- No monorepo workspace wiring required (optional `file:` link documented but unused)

### Phase 1 exit criteria

- [ ] `final10/packages/savvy-core/` exists with README explaining extraction roadmap
- [ ] `npm run verify:savvy-core` passes
- [ ] Final10 `npm run build` identical behavior (no import changes)
- [ ] Event strings documented in one place for SavvyTrip architects
- [ ] Zero user-visible diff in running Final10 app

### Phase 1 follow-up (Phase 2 preview — not started)

Wire `client/src/config/savvyRewards.js` to re-export from `@savvy/core` (one-line shim) after adding `client` dependency on `file:../packages/savvy-core`. Still visually identical; enables drift detection in CI.

---

## Document maintenance

When extracting a module, update this file:

1. Mark core section **Status: extracted**
2. Record shim path in Final10
3. Record SavvyTrip consumption PR target

**Last updated:** 2026-06-26  
**Final10 path:** `C:\Users\ericv\final10`  
**SavvyTrip path:** `C:\Users\ericv\OneDrive\Documents\New folder\SavvyTrip`
