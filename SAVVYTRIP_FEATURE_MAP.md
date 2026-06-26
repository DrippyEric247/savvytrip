# SavvyTrip Feature Map

**Status:** Planning only — no implementation yet  
**Depends on:** `@savvy/core` (see `SAVVY_CORE_EXTRACTION_PLAN.md`)  
**Source prototype:** `SavvyTrip/src/` (single-page shell; sections become routes)  
**Principle:** Consume Savvy Core. Do not duplicate wallet, auth, scout engine, or reward store.

---

## Product north star

SavvyTrip is the **travel OS** inside the Savvy Universe — composing flights, trains, rideshare, and hotels while Final10, EZStay, and AI-Go plug in when they save time or money. One Savvy balance, one scout persona (Pilot Scout), one notification stream.

---

## Pages

### Tier 0 — Shell & auth (required for any real session)

| Route | Page | Purpose | Savvy Core dependency |
|-------|------|---------|----------------------|
| `/` | **Home / Dashboard** | Trip snapshot, quick search, live activity, ecosystem status | Auth, Rewards HUD, Notifications badge, UI states |
| `/login` | Login | Universe SSO entry | Auth Core |
| `/register` | Register | Account creation | Auth Core |
| `/forgot-password` | Forgot password | Reset request | Auth Core |
| `/reset-password` | Reset password | Token submit | Auth Core |
| `/auth/callback` | OAuth callback | Social auth landing | Auth Core |

### Tier 1 — Core travel loop (MVP)

| Route | Page | Purpose | Prototype section |
|-------|------|---------|-------------------|
| `/search` | **Smart route search** | Origin/destination, dates, mode filters, compose request | `SmartRouteSearch` |
| `/routes` | **Route comparison** | Cheapest / fastest / best overall cards, leg breakdown | `RouteComparisonSection` + `RouteCard` |
| `/routes/:id` | **Route detail** | Full itinerary, savings math, book/save CTAs | (new — extends `RouteCard`) |
| `/saved` | **Saved trips** | Draft / booked / watching trip list | `SavedTripsSection` |
| `/deals` | **Live travel deals** | Fare drops, mode-tagged deals, expiry timers | `LiveDealsSection` |
| `/trending` | **Trending destinations** | Demand deltas, inspiration grid | `TrendingDestinationsSection` |

### Tier 2 — Ecosystem orchestration (differentiator)

| Route | Page | Purpose | Prototype section |
|-------|------|---------|-------------------|
| `/ecosystem` | **Connected apps** | Final10 · EZStay · AI-Go link status, deep links | `ConnectedAppsPanel` |
| `/feed` | **Ecosystem activity** | Cross-app redemptions, combos, route fixes | `EcosystemActivitySection` |
| `/combos` | **Smart combos** | Detected multi-app bundles + projected Savvy bonus | `SmartComboSection` |
| `/ezstay` | **EZStay picks** | Route-aware hotel variants (luxury, cheapest, rated, airport) | `EZStaySection` |
| `/final10` | **Final10 travel snipes** | Trip-adjacent gear deals surfaced for active itinerary | `Final10Section` |
| `/aigo` | **AI-Go ground layer** | Traffic, pickup, train timing, gas cards | `AIGoSection` |
| `/rewards` | **Unified rewards** | Ecosystem points + travel vs shopping savings rollup | `UnifiedRewardsSection` |

### Tier 3 — Savvy progression (shared universe)

| Route | Page | Purpose | Savvy Core dependency |
|-------|------|---------|----------------------|
| `/profile` | **Profile** | Identity, Savvy balance card, equipped calling card, settings | Auth, Wallet HUD, Inventory |
| `/profile#savvy-balance` | Balance deep link | Wallet drawer target from HUD | Wallet HUD |
| `/scout-goals` | **Pilot Scout missions** | Travel mission log, progress, claim | Scout Core + travel mission registry |
| `/scout-report` | **Scout report** | Opportunity header + ranked travel results | Scout `ScoutReportHeader` |
| `/battle-pass` | **Travel Battle Pass** | Launch season tracks, tasks, tier claims | Battle Pass Core + `travelSeason` config |
| `/daily-streak` | Daily streak | Login / engagement claim | Rewards Core (shared page chrome) |
| `/customization` | Loadout | Calling cards, emblems | Inventory Core |
| `/alerts` | **Travel alerts command center** | Price-drop / route-change alerts list | Notifications + alert wizard shell |
| `/alerts/new` | Create travel alert | Route/date/price wizard | Alert wizard framework |

### Tier 4 — Delight & retention (post-MVP)

| Route | Page | Purpose | Savvy Core dependency |
|-------|------|---------|----------------------|
| `/assistant` | **Savvy Copilot** | Conversational trip help, itinerary Q&A | Travel-only UI; optional Final10 AI patterns |
| `/planner` | **Trip planner** | Multi-day itinerary builder (from “Launch planner” CTA) | New |
| `/perk-machine` | Perk machine (travel skin) | Spin for travel perks / tokens | Perk + Egg Core (low priority) |
| `/notifications` | Notification inbox | Mark-read, filter by kind | Notifications Core |

### Global chrome (not routes)

| Surface | Purpose | Savvy Core dependency |
|---------|---------|----------------------|
| **SavvyAssistantDock** | Floating wallet + Pilot Scout orb | Wallet HUD + Scout shell |
| **SavvyRewardHost** | Global points toast / burst | Rewards Core |
| **App nav** | Grouped: Plan · Ecosystem · Play · Profile | Notifications badge |

---

## Shared Savvy Core systems needed

Mapped to extraction phases in `SAVVY_CORE_EXTRACTION_PLAN.md`. SavvyTrip should **not** ship duplicate implementations of these.

### Phase 1 (available after Core Phase 1 exit)

| System | Package path | SavvyTrip use |
|--------|--------------|---------------|
| **Universe events** | `@savvy/core/events` | Wire travel actions to `WALLET_AWARD_EVENT`, `BATTLE_PASS_ACTION_EVENT`, `SCOUT_MISSION_*` without string drift |
| **Savvy rewards constants** | `@savvy/core/config/savvyRewards` | Display amounts, action labels, server contract parity |
| **Scout branding pattern** | `@savvy/core/scout/branding` | Base for `pilotScoutBranding` overlay |
| **Theme tokens** | `@savvy/core/tokens/theme.css` | Replace duplicated `@theme` values in `index.css` |

### Phase 2–8 (required before production launch)

| System | When SavvyTrip needs it | Travel-specific extension |
|--------|-------------------------|---------------------------|
| **Auth Core** | First real login | `createAuthConfig({ appId: 'savvytrip', storageKey: 'savvy_universe_token' })` |
| **Rewards Core** | Any points display or earn | `registerPointActions({ book_flight, save_route, create_travel_alert, ... })` |
| **Wallet HUD** | Dashboard + all pages | `SavvyAssistantDock` with `scoutSlot={<PilotScoutButton />}` |
| **Scout Core** | Missions + scout report | `registerMissions('savvytrip', travelScoutMissions)` |
| **Notifications Core** | Nav badge + alerts pages | Extended `kind: 'travel_price_drop' \| 'route_change'` |
| **Battle Pass Core** | Launch season | `createBattlePassSeason(travelLaunchSeason)` |
| **Inventory Core** | Profile + BP cosmetic rewards | `registerInventoryItems('savvytrip', travelCallingCards)` |
| **UI states** | All async pages | `LoadingState`, `ErrorState`, `EmptyState`, `PageRequestState` |
| **Audio Core** | HUD + unlock ceremonies | Auto via wallet / inventory |
| **Perk + Egg Core** | Optional `/perk-machine` | Travel skin only; same API |
| **Event bus** | Cross-feature orchestration | `dispatchSavvyEvent` / `onSavvyEvent` |

### Explicitly **not** duplicated in SavvyTrip

| Retire / never build locally | Replace with |
|------------------------------|--------------|
| `SavvyWallet.tsx` mock ledger | `useSavvyPoints()` + `SavvyWalletBubble` |
| `ecosystemMockData` wallet slice | Auth `GET /auth/me` + rewards store |
| Custom points toast | `SavvyRewardHost` |
| Second scout mission engine | `@savvy/core/scout` + travel registry |
| Local battle pass XP math | `@savvy/core/battle-pass` engines |

---

## Travel-specific components

Components that **stay in SavvyTrip** (not extracted to Core). Core provides shells; SavvyTrip provides data and travel chrome.

### Search & routing

| Component | Responsibility |
|-----------|----------------|
| `SmartRouteSearch` | Mode toggles (flight / train / rideshare / hotel), date/location inputs, search CTA |
| `RouteCard` | Multi-leg itinerary card, score, savings vs baseline |
| `RouteLegRow` | Single leg with `ModeIcon`, duration, cost |
| `RouteComparisonGrid` | Cheapest / fastest / best layout |
| `RouteDetailTimeline` | Expanded leg timeline + connection buffers |
| `ModeIcon` / `TravelIcons` | Mode glyphs (existing) |
| `SavingsBadge` | “Save $X vs direct flight” chip |

### Deals & destinations

| Component | Responsibility |
|-----------|----------------|
| `LiveDealCard` | Destination cluster, discount %, expiry, mode tags |
| `TrendingDestinationCard` | City, demand delta, gradient hero |
| `FareDropTimer` | Countdown for live deals |

### Trips & planner

| Component | Responsibility |
|-----------|----------------|
| `SavedTripCard` | Draft / booked / watching status |
| `TripStatusChip` | Watching vs locked vs booked |
| `ItinerarySummaryStrip` | Compact trip header for dashboard |

### Ecosystem panels (SavvyTrip-owned UI, cross-app data)

| Component | Responsibility |
|-----------|----------------|
| `ConnectedAppsPanel` | App badges, online/syncing status |
| `SmartComboCard` | Multi-app bundle headline + projected Savvy |
| `EcosystemActivityList` | Cross-app feed with `appBadgeClass` |
| `EZStayHotelCard` | Variant tabs: luxury / cheapest / best rated / airport |
| `Final10SnipeCard` | Travel-gear snipe with trust score |
| `AIGoNavCard` | Traffic / pickup / train timing card |
| `EcosystemAIInsightCard` | Copilot-style insight from connected app |
| `UnifiedRewardsPanel` | Travel vs shopping savings split |
| `TravelActivityFeed` | SavvyTrip-native activity tone colors |

### Scout & AI (travel skin)

| Component | Responsibility |
|-----------|----------------|
| `PilotScoutButton` | Injected into `SavvyAssistantDock` scout slot |
| `TravelScoutReport` | `ScoutReportHeader` + route/deal result list |
| `SavvyCopilotPanel` | Chat / quick prompts for trip questions |
| `CopilotSuggestionChip` | “Recompose for train-first Friday” etc. |

### Alerts (travel fields on shared wizard)

| Component | Responsibility |
|-----------|----------------|
| `TravelAlertWizardFields` | Route, dates, target price, mode filters — injected into Core wizard |
| `TravelAlertCard` | Alert row in command center |
| `PriceDropPill` | Severity / % drop indicator |

### SavvyTrip shell (keep, thin-wrap Core tokens)

| Component | Responsibility |
|-----------|----------------|
| `AppShell` | Nav, header, mobile menu → evolve to router layout |
| `UniverseBackdrop` | Savvy Universe visual identity |
| `GlassPanel` | Thin wrapper over `@savvy/core` `.card` tokens |
| `NeonButton` | CTA styling aligned to theme tokens |
| `SectionHeading` | Section chrome |
| `LiveIndicator` | “Engines warm” status (keep unless merged later) |

---

## API needs

Server contracts extend the existing Final10 API surface — **one backend, universe user**. Grouped by domain.

### Auth & user (shared)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Session token |
| `/auth/register` | POST | Create account |
| `/auth/me` | GET | User + `savvyPoints` balance |
| `/auth/providers` | GET | OAuth providers |
| `/auth/forgot-password` | POST | Reset email |
| `/auth/reset-password` | POST | Reset submit |
| `/auth/social/callback` | GET | OAuth JWT landing |

### Savvy rewards & wallet (shared)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/rewards/claim-daily` | POST | Daily streak |
| `/rewards/award` | POST | Server-authoritative earn (booking confirm, etc.) |
| `/scout/missions/claim` | POST | Mission completion claim |

### Travel search & routes (SavvyTrip-new)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/travel/search` | POST | Compose multi-modal routes from OD + dates + modes |
| `/travel/routes/:id` | GET | Route detail + legs + pricing snapshot |
| `/travel/routes/:id/lock` | POST | Hold fare / save watching state |
| `/travel/saved` | GET, POST, PATCH, DELETE | Saved trips CRUD |
| `/travel/deals/live` | GET | Active fare drops (SSE or poll) |
| `/travel/trending` | GET | Destination demand signals |
| `/travel/estimate-points` | POST | Projected Savvy for itinerary (pre-book) |

### Travel alerts (extends alert system)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/alerts` | GET, POST | List / create (payload `kind: travel_*`) |
| `/alerts/:id` | PATCH, DELETE | Update threshold / cancel |
| `/alerts/wizard/schema` | GET | Travel field definitions for shared wizard |

### Ecosystem orchestration (cross-app)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/ecosystem/connected` | GET | Linked apps + sync status |
| `/ecosystem/feed` | GET | Unified activity stream |
| `/ecosystem/combos` | GET | Detected bundles for active trip |
| `/ecosystem/insights` | GET | AI insight cards (EZStay, Final10, AI-Go) |
| `/ecosystem/rewards/summary` | GET | Unified rewards rollup |

### Partner surfaces (proxy or BFF)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/integrations/ezstay/hotels` | GET | Route-context hotel picks |
| `/integrations/final10/snipes` | GET | Travel-tagged snipes for itinerary |
| `/integrations/aigo/nav` | GET | Ground / traffic cards for trip legs |

### Battle pass & inventory (shared)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/battle-pass/status` | GET | Season progress |
| `/battle-pass/claim-tier` | POST | Tier reward claim |
| `/cosmetics/equip` | POST | Calling card equip |
| `/notifications/summary` | GET | Nav badge counts |
| `/notifications/read` | POST | Mark read |

### Copilot (optional v2)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/travel/copilot/chat` | POST | Streaming trip Q&A |
| `/travel/copilot/suggest` | POST | Proactive recompose suggestions |

### Real-time (recommended)

| Channel | Purpose |
|---------|---------|
| SSE `/travel/deals/stream` | Live fare drops |
| SSE `/ecosystem/feed/stream` | Cross-app activity |
| WebSocket (optional) | Alert triggers, combo detection |

---

## Launch season rewards

**Season id:** `travel-s1-launch`  
**Theme:** *Runway Rising* — first travel Battle Pass season, synced to SavvyTrip public launch.  
**Engine:** `@savvy/core/battle-pass` with SavvyTrip-local `travelLaunchSeason.ts` config only (no fork of XP math).

### Season structure

| Track | Access | Notes |
|-------|--------|-------|
| **Free** | All users | Savvy points, travel calling cards, scout flair |
| **Savvy+** (if universe tier exists) | Subscribers | Multipliers, exclusive emblems, early deal lanes |

**Duration:** 8 weeks · **Max tier:** 50 · **XP curve:** shared `battlePassProgressEngine`

### Free track highlights (tiers)

| Tier | Reward | Type |
|------|--------|------|
| 1 | +250 Savvy | Points |
| 3 | *Boarding Pass* calling card (common) | Cosmetic |
| 5 | +500 Savvy | Points |
| 8 | Pilot Scout voice line unlock | Scout flair |
| 10 | *Jet Stream* emblem | Cosmetic |
| 12 | Travel alert slot +1 (30 days) | Utility perk |
| 15 | +1,000 Savvy | Points |
| 18 | *Runway Rising* calling card (rare) | Cosmetic |
| 22 | 5% Savvy earn boost on bookings (14 days) | Booster |
| 25 | Mid-season egg (travel tier reskin) | Egg inventory |
| 30 | *Layover Legend* calling card (epic) | Cosmetic |
| 35 | +2,500 Savvy | Points |
| 40 | Ecosystem combo multiplier +0.25× (7 days) | Booster |
| 45 | Pilot Scout alternate orb skin | Scout flair |
| 50 | *Runway Rising* animated calling card (legendary) | Cosmetic |

### Savvy+ track extras (selected tiers)

| Tier | Reward |
|------|--------|
| 1 | Instant +500 Savvy |
| 10 | 2× Savvy on first booking of season |
| 25 | Exclusive *Cockpit Gold* emblem |
| 50 | Animated profile frame + title *Launch Captain* |

### Season tasks (travel `BATTLE_PASS_ACTION_EVENT` sources)

| Task | XP | Trigger action |
|------|-----|----------------|
| First flight search | 100 | `search_routes` |
| Save a route | 150 | `save_route` |
| Create travel alert | 200 | `create_travel_alert` |
| Lock an itinerary | 250 | `lock_itinerary` |
| Complete EZStay pick on trip | 300 | `ecosystem_ezstay_attach` |
| Final10 snipe on active trip | 200 | `ecosystem_final10_snipe` |
| AI-Go route accept | 150 | `ecosystem_aigo_accept` |
| 3-app combo detected | 500 | `ecosystem_combo_bonus` |
| Book any leg (mock or real) | 400 | `book_travel_leg` |
| 7-day login streak during season | 350 | `daily_streak` |
| Claim 3 Pilot Scout missions | 300 | `scout_mission_claim` |
| Refer a friend | 500 | `referral_complete` |

### Point action defaults (rewards registry extension)

Register alongside Core defaults — do not fork `pointsEngine`:

| Action key | Default Savvy | When |
|------------|---------------|------|
| `search_routes` | 10 | First search per day |
| `save_route` | 25 | Per saved route |
| `create_travel_alert` | 50 | Per alert created |
| `lock_itinerary` | 75 | Fare hold / watch lock |
| `book_flight` | 200+ | Scales with fare tier |
| `book_train` | 80 | Per leg |
| `book_rideshare` | 40 | Per leg |
| `book_hotel` | 120 | Per stay |
| `ecosystem_combo_bonus` | 180–820 | Combo tier table |
| `scout_mission_complete` | Per mission | Mission catalog |

### Launch-week bonuses (time-boxed)

| Bonus | Window | Effect |
|-------|--------|--------|
| **Founding Traveler** | First 72h | +2× Savvy on all travel actions |
| **Ecosystem Sync** | Week 1 | Link EZStay or AI-Go → +500 Savvy one-time |
| **Runway Rush** | Days 3–5 | Double BP task XP |

---

## Pilot Scout identity ideas

Pilot Scout is SavvyTrip’s instance of the shared scout shell (`createScoutBranding({ id: 'pilot-scout' })`). Same engine as Savvy Scout; different voice, missions, and visuals.

### Persona

| Attribute | Direction |
|-----------|-----------|
| **Role** | Your co-pilot for routes, fares, and ecosystem timing — not a generic chatbot |
| **Tone** | Calm, precise, slightly witty; speaks in ETA and savings, not hype |
| **Relationship to Savvy Scout** | Sibling persona in the universe — Savvy Scout hunts deals; Pilot Scout charts journeys |
| **Orb visual** | Sky-to-violet gradient, subtle compass tick animation, soft runway glare on hover |
| **Iconography** | Compass rose, waypoint pin, contrail arc (not auction gavel / snipe crosshair) |

### Naming & copy (`SCOUT_COPY` overrides)

| Key | Pilot Scout line (example) |
|-----|----------------------------|
| `greeting` | “Flight deck open. Where are we routing?” |
| `wallet` | “Your Savvy fuel gauge — spend on boosts, earn on every leg.” |
| `missionComplete` | “Waypoint cleared. Savvy credited.” |
| `dealFound` | “Fare corridor opening — confidence high on this cluster.” |
| `emptyState` | “No active vectors. Run a search and I’ll scout lanes.” |
| `reportTitle` | “Pilot Scout Report” |
| `reportSubtitle` | “Ranked opportunities for your trip window” |

### Travel mission catalog (`travelScoutMissions`)

| Mission id | Title | Trigger | Reward |
|------------|-------|---------|--------|
| `first_search` | Clear the runway | Complete first route search | +100 Savvy |
| `save_route` | Chart a course | Save any route | +75 Savvy |
| `multi_mode` | Multi-modal mind | Search with 3+ modes enabled | +125 Savvy |
| `create_alert` | Set a watch | Create travel price alert | +150 Savvy |
| `ezstay_sync` | Ground control | Attach EZStay hotel to trip | +200 Savvy |
| `aigo_sync` | Surface vector | Accept AI-Go routing suggestion | +150 Savvy |
| `final10_essentials` | Pack smart | Save Final10 snipe to trip | +100 Savvy |
| `combo_unlock` | Ecosystem lift | Trigger 3-app combo bonus | +300 Savvy |
| `lock_itinerary` | Lock the leg | Hold fare on saved trip | +175 Savvy |
| `weekly_explorer` | Weekender | 3 searches in 7 days | +250 Savvy |

### Scout report layout

Uses shared `ScoutReportHeader` with travel props:

- **Opportunity count** — routes, deals, or alerts found  
- **Confidence pills** — high / medium / watch  
- **Primary CTA** — “Lock best overall” / “Create alert”  
- **Secondary** — “See all routes” / “Ask Copilot”

### Dialogue moments (floater / perk machine reskin)

| Moment | Line |
|--------|------|
| Fare drop detected | “Descent on fares — your ORD cluster is −6%. Recommend lock within the hour.” |
| Combo detected | “Ecosystem stack aligned. EZStay + AI-Go + Final10 — multiplier lane engaged.” |
| Connection risk | “Tight connection on leg 2. Want me to recompose for train-first?” |
| Idle nudge | “Still planning Chicago? Trending demand is up — alerts are cheap insurance.” |

### Audio & accessibility

- Use `@savvy/core/audio` `playUiClick` on orb expand  
- Respect `prefers-reduced-motion` on contrail animation  
- Mission popups use shared scout components — travel copy only

---

## Safe build order after Savvy Core Phase 1 is complete

Phase 1 delivers **events, savvyRewards constants, scout branding base, theme tokens** only. No React, no auth, no wallet. Below is the recommended SavvyTrip sequence **after** Phase 1 exit criteria pass — interleaved with Core Phases 2–9.

### Stage A — Foundation (Core Phases 2–4)

**Goal:** Real session, real balance, no mock wallet.

| Step | Work | Core phase | SavvyTrip deliverable |
|------|------|------------|----------------------|
| A1 | Add `@savvy/core` dependency; import `theme.css` + events | 1 ✓ | Token-aligned `index.css` |
| A2 | Wire rewards store + `registerPointActions(travelActions)` | 2 | Remove mock wallet balance reads |
| A3 | `AuthProvider` + login/register routes | 3 | Protected app shell |
| A4 | `SavvyAssistantDock` + `SavvyRewardHost` | 4 | Floating HUD on all pages |
| A5 | Router: split single-page sections → routes | — | `/`, `/search`, `/routes`, `/profile` |
| A6 | Replace `LoadingBar` with `LoadingState` on async views | 8 (partial) | Consistent page states |

**Exit:** User logs in, sees universe Savvy balance, earns toast on mock award event.

### Stage B — Travel MVP (SavvyTrip-only + Core notifications)

**Goal:** Search → compare → save loop with API stubs then live APIs.

| Step | Work | Core phase | SavvyTrip deliverable |
|------|------|------------|----------------------|
| B1 | `/travel/search` + `/travel/routes` API integration | — | `SmartRouteSearch`, `RouteComparison` live |
| B2 | Route detail page + save trip API | — | `/routes/:id`, `/saved` |
| B3 | Live deals + trending endpoints | — | `/deals`, `/trending` |
| B4 | Notification badge + travel alert kinds | 5 | Nav badge |
| B5 | Travel alert wizard fields on shared shell | 5 | `/alerts`, `/alerts/new` |
| B6 | `estimate-points` on route cards | 2 | Savvy preview on book CTA |

**Exit:** End-to-end trip discovery without ecosystem partners.

### Stage C — Pilot Scout (Core Phase 5)

| Step | Work | SavvyTrip deliverable |
|------|------|----------------------|
| C1 | `pilotScoutBranding.ts` from Core pattern | Copy + orb labels |
| C2 | `registerMissions('savvytrip', travelScoutMissions)` | Mission triggers on search/save/alert |
| C3 | `PilotScoutButton` in dock slot | Floating scout |
| C4 | `/scout-goals` + `/scout-report` | Mission log + report page |

**Exit:** Scout missions fire on travel actions; claims hit shared API.

### Stage D — Ecosystem panels (BFF layer)

| Step | Work | SavvyTrip deliverable |
|------|------|----------------------|
| D1 | `/ecosystem/*` APIs | Connected apps, feed, combos |
| D2 | EZStay / Final10 / AI-Go integration routes | `/ezstay`, `/final10`, `/aigo` |
| D3 | Unified rewards summary | `/rewards` |
| D4 | Combo bonus → `ecosystem_combo_bonus` BP + points events | Cross-app earn |

**Exit:** Prototype ecosystem sections backed by APIs; combo bonuses award Savvy.

### Stage E — Launch season (Core Phases 6–7)

| Step | Work | Core phase | SavvyTrip deliverable |
|------|------|------------|----------------------|
| E1 | `travelLaunchSeason.ts` battle pass config | 7 | `/battle-pass` |
| E2 | Travel calling cards in inventory registry | 6 | `/customization` + profile card |
| E3 | Daily streak route (shared page) | 2 | `/daily-streak` |
| E4 | Launch-week founding traveler flags | — | Time-boxed multipliers |

**Exit:** Launch season playable; cosmetics equip on profile.

### Stage F — Polish & optional delight

| Step | Work | Notes |
|------|------|-------|
| F1 | Savvy Copilot panel | `/assistant` — can ship post-launch |
| F2 | Trip planner | `/planner` from header CTA |
| F3 | Perk machine travel skin | Low priority; same Core API |
| F4 | SSE live deals stream | Replace poll on `/deals` |
| F5 | Delete all mock data files | Phase 9 duplicate removal |

### Dependency guardrails

```
Do NOT build                          Wait for
─────────────────────────────────────────────────────────
Pilot Scout missions UI               Core Scout Phase 5
Real Savvy balance                    Core Rewards Phase 2
Login / protected routes              Core Auth Phase 3
Floating wallet HUD                   Core Wallet Phase 4
Battle Pass page                      Core BP Phase 7
Calling cards on profile              Core Inventory Phase 6
Travel alert wizard framework         Core Notifications Phase 5
```

### Parallel workstreams (safe anytime after Phase 1)

- Travel component library (static, mock props)  
- API contract drafts + OpenAPI spec  
- `travelLaunchSeason.ts` + `travelScoutMissions.ts` **config files** (no Core import beyond events/constants)  
- Router layout + `AppShell` nav grouping  
- Partner BFF contract reviews with EZStay / AI-Go / Final10 teams  

---

## Prototype → production checklist

| Current mock file | Production replacement |
|-------------------|------------------------|
| `ecosystemMockData.ts` → wallet | `useSavvyPoints()` |
| `ecosystemMockData.ts` → rewards | `/ecosystem/rewards/summary` |
| `mockData.ts` → routes | `/travel/search`, `/travel/routes` |
| `SavvyWallet.tsx` | `@savvy/core/wallet/SavvyWalletBubble` |
| `SavvyWalletSection` | Remove section; HUD only + profile card |
| Hash nav (`#routes`) | React Router paths |

---

## Document maintenance

When `@savvy/core` phases complete, update the **Shared Savvy Core systems** table with extraction status and shim paths from `SAVVY_CORE_EXTRACTION_PLAN.md`.

**Last updated:** 2026-06-26  
**Author:** SavvyTrip Prep Agent  
**Related:** `SAVVY_CORE_EXTRACTION_PLAN.md`, `UI_POLISH_REPORT.md`
