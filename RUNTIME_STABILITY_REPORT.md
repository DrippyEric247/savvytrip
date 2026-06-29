# Runtime Stability Report — SavvyTrip

**Date:** 2026-06-29  
**Workspace:** `C:\Users\ericv\OneDrive\Documents\New folder\SavvyTrip`  
**Scope:** Pre–Phase 3 runtime investigation (no new features, Final10 untouched)

---

## Executive summary

All **React runtime errors** identified in this investigation are resolved or classified. After a **dev-server restart** and **verified application fixes**, the app loads cleanly in dev and production preview with **zero React page errors** and **zero browser console errors** on audited flows.

**Recommendation: Proceed with Phase 3.**

---

## Issues found and classification

| ID | Symptom | Classification | Production impact |
|----|---------|----------------|-------------------|
| RT-01 | `useAuth must be used within AuthProvider` in Vite console during HMR | **Hot-reload / Vite issue** | No — cold start clean |
| RT-02 | CORS / failed fetch to `api.final10.app` from `localhost:5173` | **Application bug** (fixed) | Yes — local dev console noise |
| RT-03 | `502 Bad Gateway` on `/api/auth/providers` during `vite preview` | **Application bug** (fixed) | Yes — preview console noise |
| RT-04 | `http proxy error: /api/auth/login` ECONNREFUSED in Vite terminal | **Environment issue** | No — expected when API not on `:5000` |
| RT-05 | `npm run verify` timeout on `#hero-heading` after auth gating | **False positive** (test drift) | N/A — verify script updated |
| RT-06 | Wrong relative imports in `travelSearch.ts` / `ecosystem.ts` mock adapters | **Application bug** (fixed locally*) | Yes — blocks `tsc` / production build |

\*Mock adapter import fixes exist in working tree; full `src/services/` layer is not yet committed (Phase 3 WIP).

---

## Root cause detail

### RT-01 — AuthProvider HMR error
- **When:** Partial hot reload updated `routes.tsx` / auth components before `main.tsx` re-mounted `AuthProvider`.
- **Evidence:** Vite log at `9:04:51 PM` showed stack through `ProtectedRoute` → `useAuth`.
- **After full restart:** Error does not return; dev terminal stays clean through stability sweep.

### RT-02 — Production API default in local dev
- `savvytripAuthConfig.apiOrigin` always fell back to `https://api.final10.app`, bypassing localhost logic.
- `SocialAuthButtons` called `getAuthProviders()` on every auth page load → cross-origin fetch + console errors.

### RT-03 — Preview misrouting API
- `getApiOrigin()` used `window.location.origin` for **all** localhost hosts, including `vite preview` (`:4173`).
- Preview has no `/api` proxy → requests returned **502**.
- Fixed by limiting same-origin API to `import.meta.env.DEV` only and skipping provider probe on localhost without `VITE_API_URL`.

### RT-04 — Proxy ECONNREFUSED
- Vite proxy forwards `/api` → `http://localhost:5000`.
- When Final10/Savvy API is not running, login/forgot-password attempts log **ECONNREFUSED** in the **Vite terminal** (not React).
- Handled gracefully in UI via `parseApiError`; not a React crash.

---

## Fixes applied (SavvyTrip only)

| File | Fix |
|------|-----|
| `src/config/savvytripAuthConfig.ts` | `apiOrigin` only when `VITE_API_URL` is set |
| `src/lib/auth/runtimeApi.ts` | Same-origin API + proxy **only** in `vite dev`; production fallback `api.final10.app` |
| `vite.config.ts` | Dev proxy `/api` → `localhost:5000` |
| `src/components/auth/SocialAuthButtons.tsx` | Skip provider probe on localhost without configured API |
| `scripts/verify-dev-preview.mjs` | Assert auth-gated flow (login redirect, protected `/routes`) |
| `src/services/adapters/mock/travelSearch.ts` | Correct `../../../` import paths (build blocker) |
| `src/services/adapters/mock/ecosystem.ts` | Correct `../../../` import paths (build blocker) |

**Not modified:** Final10

---

## Verification results (post-restart)

### Dev server — `http://localhost:5173/`
| Check | Result |
|-------|--------|
| ProtectedRoute `/` → `/login` | Pass |
| Login page renders | Pass |
| Register page renders | Pass |
| Protected `/routes` → `/login` | Pass |
| Dashboard (mocked session) | Pass — `#hero-heading` visible |
| Navigation Routes / Wallet | Pass |
| React `pageerror` | **0** |
| Browser `console.error` | **0** |
| `npm run verify` | **Pass** |

### Production build
```
npm run build  →  tsc && vite build  →  PASS (121 modules)
```

### Production preview — `http://localhost:4173/`
| Check | Result |
|-------|--------|
| All stability checks | Pass |
| React page errors | **0** |
| Console errors | **0** |

---

## Remaining warnings (non-blocking)

| Warning | Type | Action |
|---------|------|--------|
| Vite terminal `http proxy error` when API down | Environment | Start API on `:5000` or set `VITE_API_URL` |
| `npm audit` 1 high severity | Dependency | Track separately |
| Real email login requires running backend | Environment | Expected for Phase 3 auth integration |
| HMR may briefly throw RT-01 if auth tree hot-reloads out of order | HMR | Full reload if seen; not a production issue |

---

## Phase 3 recommendation

**Proceed.** Runtime surface is stable for:

- Auth shell (login, register, protected routes)
- Dashboard + navigation (with valid session)
- Clean dev and production preview consoles on audited paths
- Passing production build

**Before shipping auth to production:** set `VITE_API_URL=https://api.final10.app` (or SavvyTrip API) in the deployment environment.

---

## Commands used

```bash
npm run dev          # restart required after vite.config changes
npm run build
npm run verify
node scripts/runtime-stability-check.mjs dev
node scripts/runtime-stability-check.mjs preview
```
