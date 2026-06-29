# SavvyTrip Workstream Handoff

**Date:** 2026-06-29  
**Status:** Architecture + beta readiness **merged on `main`** — workstream **closed**  
**Next phase:** **Blocked** until explicit approval for Phase 4 (Core wallet/rewards wiring)

---

## Commit hash

| Item | Value |
|------|-------|
| **Final commit (beta readiness merge)** | See `git log -1 --oneline` after push — recorded at handoff time below |
| **Architecture base** | `39c6357` — feat(phase-3.5): mock services layer and deep-link routes |
| **Phase 3.5 merge** | `8395ac0` — docs: Phase 3.5 handoff report |
| **Branch** | `main` (includes fast-forward merge from `phase-3.5/services-deep-links`) |

> **Note:** Run `git rev-parse HEAD` locally for the exact final hash if this doc was committed in the same batch.

---

## Build status

| Check | Result |
|-------|--------|
| `npm run build` (`tsc && vite build`) | **Pass** |
| `node scripts/readiness-audit.mjs` | **Pass** — 22 routes, 0 console errors per screen |
| Mobile layout (390px) | **Pass** — no horizontal overflow |
| Adapter mode | `mock` (default); `VITE_SAVVYTRIP_ADAPTER=api` when backends land |

---

## Beta readiness summary

SavvyTrip is **conditionally GO** for **closed beta** with Savvy Universe accounts.

**Completed without `@savvy/core`:**
- Service interfaces + mock adapters + localStorage persistence (6 keys)
- Full travel loop: search → routes → detail → save, deals, trending, planner
- Pilot Scout missions + report, travel alerts, Savvy Copilot (local/rule-based)
- Ecosystem panels via local catalog (`mockEcosystemService`) — no Final10 API coupling
- Production UI: grouped nav, page transitions, loading/error/empty states, shared form inputs
- Auth session balance only (`SessionBalanceCard`) — no duplicate wallet/rewards ledger
- Core-blocked panels for unified rewards and wallet HUD details
- Integration registry: `src/lib/coreIntegrationPoints.ts` + inline `TODO(core):` / `TODO(api):`

**Intentionally deferred (awaiting `@savvy/core` + SavvyTrip APIs):**
- Live Savvy earn, reward toasts, wallet HUD bubble, unified rewards rollup
- Scout Core engine + cross-device claim API
- Alert notification delivery
- Live travel/ecosystem API adapters
- Battle Pass travel season

**Verdict:** Suitable for invited/internal beta. **Not** suitable for public launch or rewards marketing until Core Phases 2–5 and SavvyTrip backends land.

---

## Files changed (this workstream)

### Architecture (Phase 3.5 — service layer + routes)

| Path | Role |
|------|------|
| `src/domain/travel.ts` | Canonical travel domain types |
| `src/services/interfaces.ts` | Service contracts |
| `src/services/index.ts` | Registry; adapter mode switch |
| `src/services/storage.ts` | localStorage key constants |
| `src/services/adapters/mock/*.ts` | Mock implementations (travel, trips, deals, trends, activity, copilot, alerts, scout, planner, ecosystem) |
| `src/hooks/useAsyncData.ts` | Async data + request states |
| `src/hooks/useDealCountdown.ts` | Live deal timer hook |
| `src/context/TripSearchContext.tsx` | Shared search state |
| `src/components/ui/RequestState.tsx` | Loading / error / empty UI |
| `src/components/ui/CoreDependencyBanner.tsx` | Core dependency notice |
| `src/lib/savvyEvents.ts` | Travel event helpers |
| `src/lib/travel/pilotScoutBranding.ts` | Pilot Scout branding |
| `src/lib/travel/travelPointActions.ts` | Point action registry (Core swap-in) |
| `src/lib/travel/travelScoutMissions.ts` | Scout mission seed config |
| `src/routes.tsx` | Deep-link routes (`/routes/:id`, `/alerts/*`, `/planner`, `/scout-*`) |
| `src/pages/*.tsx` | Route detail, alerts, planner, scout pages |

### Beta readiness polish

| Path | Role |
|------|------|
| `src/lib/coreIntegrationPoints.ts` | Central Core integration TODO registry |
| `src/components/wallet/SessionBalanceCard.tsx` | Auth session balance (replaces mock ledger) |
| `src/components/ui/CoreBlockedPanel.tsx` | Production blocked state for Core features |
| `src/components/layout/PageTransition.tsx` | Route transition wrapper |
| `src/components/ui/TravelInput.tsx` | Shared travel form styling |
| `src/components/auth/ProtectedRoute.tsx` | Session hydrate loading bar |
| `src/components/layout/AppShell.tsx` | Grouped nav, page transitions |
| `src/components/sections/*.tsx` | Placeholder removal, Core-blocked rewards/wallet |
| `src/components/ecosystem/SmartComboCard.tsx` | Removed fake Savvy bonus amounts |
| `src/components/ecosystem/ConnectedAppsPanel.tsx` | Copy cleanup |
| `src/index.css` | Page transition styles |
| `src/services/adapters/mock/ecosystem.ts` | Catalog copy cleanup |
| `scripts/readiness-audit.mjs` | Audit script update |
| **Deleted** `src/components/ecosystem/SavvyWallet.tsx` | Mock ledger removed |

### Documentation

| Path | Role |
|------|------|
| `SAVVYTRIP_FEATURE_MAP.md` | Feature architecture map |
| `SAVVYTRIP_BETA_READINESS_REPORT.md` | Beta go/no-go report |
| `SAVVYTRIP_READINESS_AUDIT.md` | Pre-Phase 4 automated audit |
| `PHASE_3.5_HANDOFF.md` | Phase 3.5 services handoff |
| `PHASE_3_READINESS_REPORT.md` | Phase 3 readiness |
| `SAVVYTRIP_WORKSTREAM_HANDOFF.md` | This document |

---

## Remaining known issues

| ID | Severity | Issue | Target phase |
|----|----------|-------|--------------|
| **OAUTH-001** | **High (deferred)** | OAuth callback without token lands on `/` instead of `/login` with error | **Phase 4d — Auth hardening** |
| **OAUTH-002** | Medium | Google OAuth callback URLs not registered for SavvyTrip origin (`localhost:5173`, staging) | Phase 4d |
| **DATA-001** | Expected | Travel/ecosystem data is local mock catalog, not live market data | Phase 4 + API adapters |
| **CORE-001** | Expected | Wallet HUD, unified rewards, Savvy earn show blocked UI | Phase 4 (Core wiring) |
| **SCOUT-001** | Expected | Scout claim marks local only; no Savvy credit until Core engine | Phase 4–5 |

### OAuth callback — deferred for Phase 4

**OAUTH-001** is documented in `SAVVYTRIP_READINESS_AUDIT.md` (HIGH-002 related) and `SAVVYTRIP_BETA_READINESS_REPORT.md` §3.

**Behavior today:** Visiting `/auth/callback` without a valid `token` query param silently redirects to `/` rather than `/login` with an actionable error.

**Fix scope (Phase 4d, SavvyTrip-only):**
1. Detect missing/invalid token in `AuthCallbackPage`
2. Redirect to `/login?error=oauth_failed` (or equivalent) with user-visible message
3. Register SavvyTrip callback URLs with auth service for localhost + staging + production

**Do not implement until Phase 4 is explicitly approved.**

---

## Report locations

| Document | Path | Purpose |
|----------|------|---------|
| **Beta Readiness Report** | [`SAVVYTRIP_BETA_READINESS_REPORT.md`](./SAVVYTRIP_BETA_READINESS_REPORT.md) | Go/no-go, completed features, Core deps, effort estimates |
| **Feature Map** | [`SAVVYTRIP_FEATURE_MAP.md`](./SAVVYTRIP_FEATURE_MAP.md) | Pages, Core systems, build order |
| **Readiness Audit** | [`SAVVYTRIP_READINESS_AUDIT.md`](./SAVVYTRIP_READINESS_AUDIT.md) | Automated route audit + break tests |
| **Phase 3.5 Handoff** | [`PHASE_3.5_HANDOFF.md`](./PHASE_3.5_HANDOFF.md) | Services layer + deep links |
| **Phase 3 Readiness** | [`PHASE_3_READINESS_REPORT.md`](./PHASE_3_READINESS_REPORT.md) | Auth + shell readiness |
| **Core Extraction Plan** | [`SAVVY_CORE_EXTRACTION_PLAN.md`](./SAVVY_CORE_EXTRACTION_PLAN.md) | Shared `@savvy/core` timeline (reference) |
| **Workstream Handoff** | [`SAVVYTRIP_WORKSTREAM_HANDOFF.md`](./SAVVYTRIP_WORKSTREAM_HANDOFF.md) | This closure document |

**Code integration index:** `src/lib/coreIntegrationPoints.ts`

---

## Repository boundaries (maintained)

| Repo / package | Modified? |
|----------------|-----------|
| **SavvyTrip** | Yes — all work in this repo |
| **Final10** | **No** |
| **`@savvy/core`** | **No** — not wired; blocked panels only |

---

## Stop line

**Phase 4 is not started.** Do not begin wallet/rewards wiring, `@savvy/core` integration, or API adapter swap until explicitly approved.

**Awaiting:** User approval to begin Phase 4.
