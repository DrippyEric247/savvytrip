# SavvyTrip Readiness Audit (Pre–Phase 4)

**Date:** 2026-06-29  
**Scope:** SavvyTrip repository only (`C:\Users\ericv\OneDrive\Documents\New folder\SavvyTrip`)  
**Final10 / @savvy/core:** Not modified  
**Target:** Internal alpha readiness before Wallet HUD / Rewards Core (Phase 4)

---

## Audit method

| Layer | Coverage |
|-------|----------|
| Automated | `scripts/readiness-audit.mjs` — Playwright, desktop + mobile, auth break tests |
| Manual code review | Routes, auth, services adapter, RequestState usage |
| Build | `npm run build` (TypeScript + Vite) |
| Intentional break tests | Invalid login, 503 login, bad token, empty forms, logout, OAuth callback without token, zero search modes, deep links |

**Dev URL tested:** http://localhost:5173  
**Production API (when configured):** https://api.final10.app

---

## Executive summary

| Category | Result |
|----------|--------|
| Authentication flow | **Pass** (email login, register, forgot password, session hydrate, logout) |
| Protected routes | **Pass** (all main paths redirect to `/login` when logged out) |
| Navigation | **Pass with gaps** (core nav works; deep links fixed in working tree) |
| Mobile responsiveness | **Pass** (no horizontal overflow detected on 390px in audit pass) |
| Loading / error / empty states | **Partial** (RequestState on search/saved/deals/home feed; ecosystem pages mostly static mock) |
| API failures | **Partial** (auth surfaces errors; travel services use mock adapter) |
| Console errors | **Pass** (0 critical console errors on routed screens with mocked session) |
| Performance | **Pass** (sub-second route loads; ~350KB JS gzip ~103KB) |
| Accessibility basics | **Improved** (password label, alert roles; gaps remain on some forms) |

### Go / No-Go — Internal alpha

**Recommendation: CONDITIONAL GO**

SavvyTrip is suitable for a **small internal alpha** with Savvy Universe accounts when testers understand:

- Travel data is **mock/local** (not live APIs)
- Wallet **multiplier/streak UI** is still demo data (session balance now shown in header + wallet hero)
- **Google OAuth** will not complete end-to-end on `localhost:5173` until OAuth callback URLs are registered for SavvyTrip
- **Phase 4** (shared rewards store / HUD) is not yet wired

**No-Go blockers removed in this audit:** production build failure, broken deep links to `/routes/:id` and `/alerts`, missing guest redirect from login when already signed in.

---

## 1. Critical issues

### CRIT-001 — Production build failed (TypeScript) ✅ FIXED

| | |
|---|---|
| **Symptom** | `npm run build` failed: unused/missing `LiveIndicator` in `AlertsSection.tsx` |
| **Impact** | Cannot ship preview or deploy |
| **Fix applied** | Restored `LiveIndicator` import and usage in alerts section heading |
| **Verify** | `npm run build` exits 0 |

### CRIT-002 — Deep links routed to 404 / home redirect ✅ FIXED (working tree)

| | |
|---|---|
| **Symptom** | Components linked to `/routes/:id`, `/alerts`, `/alerts/new`, `/scout-report`, `/scout-goals` but routes were missing from router |
| **Impact** | “Open itinerary”, “New alert”, and scout CTAs bounced to login/home loop |
| **Fix applied** | Registered routes + page shells in `src/routes.tsx` |
| **Verify** | Navigate to `/routes/cheapest`, `/alerts`, `/alerts/new` while authenticated |

---

## 2. High priority issues

### HIGH-001 — Wallet page balance disagreed with header session balance ✅ FIXED

| | |
|---|---|
| **Symptom** | Header showed `user.savvyPoints` from API; `/wallet` showed hard-coded mock balance |
| **Impact** | Trust-breaking for alpha testers comparing balances |
| **Fix applied** | `SavvyWallet` uses auth session balance when available; mock tier/streak UI unchanged until Phase 4 |
| **Remaining** | Multiplier, streak, activity ledger still mock — document as preview-only |

### HIGH-002 — Google OAuth cannot complete on SavvyTrip origin ⚠️ OPEN

| | |
|---|---|
| **Steps** | Login → “Continue with Google” |
| **Expected** | Return to `/auth/callback?token=…` on SavvyTrip |
| **Actual** | OAuth starts against universe API; callback URLs registered for Final10 production domains |
| **Severity** | High for OAuth-first testers; email login works |
| **Recommended fix** | Register SavvyTrip callback URL with auth service; add env-specific redirect (Phase 3 follow-up, SavvyTrip-only) |

### HIGH-003 — Local dev API proxy depends on backend :5000 ⚠️ OPEN

| | |
|---|---|
| **Symptom** | Vite proxies `/api` → `http://localhost:5000`; without Final10 server, auth calls fail with connection refused |
| **Workaround** | Set `VITE_API_URL=https://api.final10.app` in `.env.local` for UI-only dev |
| **Impact** | High for developers expecting zero-config local auth |

### HIGH-004 — No global React error boundary ⚠️ OPEN

| | |
|---|---|
| **Break test** | Throw in any section component |
| **Actual** | White screen / uncaught runtime error |
| **Recommended fix** | Add `AppErrorBoundary` wrapper in SavvyTrip `App.tsx` (pattern exists in Final10; implement locally, do not import from Final10) |

### HIGH-005 — Ecosystem pages lack loading/error states ⚠️ OPEN

| | |
|---|---|
| **Affected** | EZStay, Final10, AI-Go, Combos, Apps, Rewards (mostly static mock sections) |
| **Contrast** | Home feed, deals, saved trips, alerts use `RequestState` + mock services |
| **Impact** | Acceptable for alpha if labeled demo; confusing if presented as live |

---

## 3. Polish improvements

| ID | Area | Issue | Suggestion |
|----|------|-------|------------|
| POL-001 | Auth | Session expiry message stored in context but easy to miss | ✅ Show `auth.error` on login mount |
| POL-002 | Auth | Signed-in users could open `/login` | ✅ `GuestRoute` redirects to `/` |
| POL-003 | A11y | Password field had no `<label>` | ✅ Added label on login |
| POL-004 | A11y | Loading/error panels lacked live regions | ✅ `role="status"` / `role="alert"` on `RequestState` |
| POL-005 | Nav | Alerts & scout not in nav | ✅ Added under Assist group |
| POL-006 | Search | Zero modes selected → silent no-op | Show inline “Select at least one mode” |
| POL-007 | Planner CTA | “Launch planner” was inert | Link to `/planner` (working tree) |
| POL-008 | Footer | Phase label outdated | Updated to adapter hint |
| POL-009 | Register | Password field placeholder-only | Add visible label (match login) |
| POL-010 | 404 | Unknown paths redirect to `/` → login | Consider dedicated 404 page post-alpha |

---

## 4. Performance recommendations

| Metric | Observed | Recommendation |
|--------|----------|----------------|
| Route load (mock auth) | 680–1200 ms | Acceptable for alpha |
| DOMContentLoaded | ~140 ms | Good |
| JS bundle | 351 KB (103 KB gzip) | Monitor growth when `@savvy/core` Phase 4 lands |
| Fonts | Google Fonts external | Add `font-display: swap`; self-host for production |
| StrictMode double-fetch | `/auth/me` called twice in dev | Expected; dedupe in Phase 4 auth slice |
| Mock service singleton | Cached in `getSavvyTripServices()` | Good — no re-init churn |

**Recommendations:**

1. Lazy-load heavy ecosystem sections (`React.lazy` per page) before public beta  
2. Add `vite build --analyze` step to CI when bundle exceeds 400 KB  
3. Defer non-critical animations on mobile via `prefers-reduced-motion` (partially present)

---

## 5. Test matrix (intentional break tests)

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Visit `/` logged out | Redirect `/login` | Redirect `/login` | ✅ |
| Visit `/routes`, `/wallet`, `/alerts` logged out | Redirect `/login` | Redirect `/login` | ✅ |
| Invalid email/password | Alert with message | `Invalid credentials` (API) | ✅ |
| POST login 503 | User-visible error | Alert shown | ✅ |
| Bad token in localStorage | Clear session → login | Redirect login | ✅ |
| Empty login submit | HTML5 validation | Browser validation fires | ✅ |
| Forgot password valid email | Neutral success copy | Success status | ✅ |
| OAuth `/auth/callback` no token | Redirect login | Redirect login | ✅ |
| Mobile menu open + sign out | Login screen | Login screen | ✅ |
| `/login` with valid session | Redirect home | Redirect home (after GuestRoute fix) | ✅ |
| Search with 0 modes | Error hint | Silent return | ⚠️ POL-006 |
| `/routes/:id` without prior search | Route detail loads | Loads via mock service | ✅ |

---

## 6. Accessibility snapshot

| Check | Status |
|-------|--------|
| `html lang="en"` | ✅ |
| Login email label | ✅ |
| Login password label | ✅ (fixed) |
| Error alerts `role="alert"` | ✅ on auth forms + RequestState |
| Loading `role="status"` | ✅ on RequestState |
| Skip link | ❌ Not present |
| Focus visible on nav | ✅ Browser default + Tailwind rings on inputs |
| Mobile menu `aria-expanded` | ✅ |

---

## 7. Verified fixes from this audit

### Committed (SavvyTrip `main`)

| Commit area | Change |
|-------------|--------|
| Auth | **GuestRoute** — redirect authenticated users away from login/register |
| Auth | **Login** — password label + surface session expiry message |
| Auth | **ProtectedRoute** — preserve query string in post-login redirect |
| Wallet | **SavvyWallet** — prefer session `savvyPoints` over mock balance |

### Working tree only (not committed — depends on uncommitted services layer)

- **RequestState** — accessibility roles for loading/error  
- **AlertsSection** — build fix (LiveIndicator)  
- **Router** — deep link routes (`/routes/:id`, `/alerts`, scout, planner)  
- **AppShell** — nav entries for alerts, scout, planner

---

## 8. Phase 4 prerequisites (out of scope)

Do **not** start Phase 4 until:

- [ ] `@savvy/core` rewards slice available OR SavvyTrip-local store extracted without Final10 coupling  
- [ ] Mock wallet ledger retired from `SavvyWallet.tsx` activity rows  
- [ ] Single Savvy balance source via `useSavvyPoints()` (not just auth hydrate)  
- [ ] Floating HUD / reward toasts (`SavvyRewardHost`)

---

## Artifacts

| File | Purpose |
|------|---------|
| `scripts/readiness-audit.mjs` | Repeatable Playwright audit |
| `scripts/readiness-audit-result.json` | Latest machine-readable results |
| `qa-screenshots/readiness-audit/` | Overflow / leak screenshots when flagged |

**Re-run audit:**

```bash
npm run dev
node scripts/readiness-audit.mjs
```
