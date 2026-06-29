# SavvyTrip Phase 3.5 Handoff

**Date:** 2026-06-29  
**Branch:** `phase-3.5/services-deep-links` → `main`  
**Status:** Ready for review — **Phase 4 not started**

---

## Completed work

### On `main` (merged / ready to merge)

| Phase | Deliverable |
|-------|-------------|
| **Phase 3** | Auth config, API client, AuthProvider, ProtectedRoute, auth pages, session UI in AppShell |
| **Audit fixes** | GuestRoute, login a11y, query-string redirect, wallet balance sync |
| **QA / readiness** | `SAVVYTRIP_READINESS_AUDIT.md`, `QA_BUG_REPORT.md`, Playwright audit + stability scripts, verification screenshots |

### Phase 3.5 PR (this branch)

| Area | Deliverable |
|------|-------------|
| **Services** | Typed mock adapter layer (`src/services/`) — travel search, deals, saved trips, alerts, scout, planner, ecosystem, copilot |
| **Context** | `TripSearchContext` for cross-page route selection |
| **Deep links** | Routes + pages: `/routes/:id`, `/alerts`, `/alerts/new`, `/scout-goals`, `/scout-report`, `/planner` |
| **UI states** | `RequestState` (loading / error / empty + a11y roles), `CoreDependencyBanner` for Phase 4 deps |
| **Section wiring** | Home, search, routes, saved, deals, trending, ecosystem pages use mock services via `useAsyncData` |
| **Navigation** | AppShell Assist group: Alerts, Scout goals, Scout report, Planner |

### Verification (Phase 3.5 PR)

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Pass (~351 KB JS, ~103 KB gzip) |
| `npm run verify` | ✅ Pass |
| `node scripts/runtime-stability-check.mjs dev` | ✅ 7/7 pass, 0 console/page errors |
| `node scripts/readiness-audit.mjs` | ✅ 20 screens, 0 console errors; 1 known OAuth finding (see blockers) |
| Final10 repo modified | ✅ No changes |
| `@savvy/core` package modified | ✅ No changes (read-only `file:` dependency) |

---

## Remaining blockers (before internal alpha expansion)

| ID | Blocker | Owner / fix |
|----|---------|-------------|
| B-001 | Google OAuth callback not registered for SavvyTrip origin | Register `localhost:5173` + staging URL with auth service |
| B-002 | Local dev requires `:5000` backend or `VITE_API_URL=https://api.final10.app` | Document in README / `.env.example` |
| B-003 | No global React error boundary | SavvyTrip-local `AppErrorBoundary` |
| B-004 | Travel data is mock-only | Expected until live travel APIs or Final10 travel endpoints are scoped |
| B-005 | Wallet tier / streak / ledger still demo UI | Blocked on Phase 4 `@savvy/core` rewards + wallet HUD |

---

## Required shared dependencies (@savvy/core)

Phase 4 must consume these from `@savvy/core` (or approved SavvyTrip-local shims that mirror the same contracts):

| Core slice | SavvyTrip consumer |
|------------|-------------------|
| **Auth** (Phase 3 partial) | Replace local token client when Core auth slice stabilizes |
| **Rewards store** | `UnifiedRewardsSection`, point actions, session toasts |
| **Wallet HUD** | `SavvyWalletSection`, floating dock, balance source of truth |
| **`useSavvyPoints()`** | Header, wallet hero, reward animations |
| **Scout engine** | `/scout-goals`, `/scout-report` — replace mock scout adapter |
| **Notifications** | `/alerts` command center, badge counts |
| **SavvyRewardHost** | Global reward burst / toast host |
| **Battle pass / inventory** | Post-alpha retention surfaces (Tier 3+) |

**Do not duplicate** wallet ledger, scout scoring, or reward store logic in SavvyTrip.

---

## Estimated effort after @savvy/core is ready

Assumes Core packages publish stable React hooks + types (auth, rewards, wallet HUD, scout, notifications).

| Phase | Scope | Estimate |
|-------|-------|----------|
| **Phase 4a — Wallet + rewards HUD** | Wire `useSavvyPoints`, SavvyRewardHost, retire mock ledger rows, sync header/wallet/activity | **3–5 days** |
| **Phase 4b — Scout integration** | Replace mock scout adapter with Core missions + report API | **2–3 days** |
| **Phase 4c — Notifications / alerts** | Wire alert list + wizard to Core notifications | **2–4 days** |
| **Phase 4d — Auth hardening** | OAuth callbacks, session refresh, error boundary, env docs | **1–2 days** |
| **Phase 5 — Live travel APIs** | Swap mock travel adapter for real endpoints (separate from Core) | **5–10 days** (API-dependent) |

**Total Phase 4 (Core-dependent): ~8–14 dev days** before live travel APIs.

---

## Next step

1. Review and merge Phase 3.5 PR.  
2. **Stop** — await explicit approval before Phase 4.  
3. When `@savvy/core` rewards + wallet slices land, start Phase 4a (HUD + balance unification).

---

## Artifacts

| File | Purpose |
|------|---------|
| `SAVVYTRIP_READINESS_AUDIT.md` | Full pre–Phase 4 audit + GO recommendation |
| `QA_BUG_REPORT.md` | Final10 + SavvyTrip bug log |
| `scripts/readiness-audit.mjs` | Repeatable screen + break tests |
| `scripts/runtime-stability-check.mjs` | Auth + nav smoke tests |
