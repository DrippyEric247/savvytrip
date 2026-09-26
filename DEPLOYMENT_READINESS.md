# SavvyTrip deployment readiness

**Baseline:** SavvyTrip App #2 Savvy Core proof PASS — Core integration via Final10 API is frozen in this repo.

## Stack

| Item | Value |
|------|--------|
| Framework | React 19 + Vite 8 + TypeScript |
| Root directory | Repository root (where `package.json` lives) |
| Install | `npm ci` |
| Production build | `npm run build` → `dist/` |
| Production start | `npm start` → `serve dist -s` (SPA fallback) |
| Node | `>=20.11.0` |
| API | **Final10 / Savvy Universe** — `https://api.final10.app` (or your deployed API host) |

## SavvyTrip on Railway — environment variables

Set **before** the build step (Vite inlines `VITE_*` at build time).

### SAVVYTRIP FRONTEND (Railway service variables)

| Variable | Required | Where to get / use |
|----------|----------|-------------------|
| `VITE_API_URL` | **Yes** | Final10 API origin **without** `/api` (production: `https://api.final10.app`) |
| `VITE_PUBLIC_APP_ORIGIN` | Recommended | Your public SavvyTrip URL (Railway URL first, later `https://savvytrip.app`) — for your records / OAuth docs |
| `VITE_DEFAULT_API_ORIGIN` | Optional | Only if you need a non-default API fallback when `VITE_API_URL` is missing |
| `VITE_ENABLE_CORE_PROOF` | Optional | `true` only for internal Core proof on production; leave unset for public beta |
| `PORT` | Auto | Railway sets this; `npm start` binds `0.0.0.0:$PORT` |

### SERVER / RUNTIME (SavvyTrip static host)

| Variable | Required | Notes |
|----------|----------|--------|
| `PORT` | Auto | Required by Railway; used by `serve` |

No MongoDB, JWT, or Core secrets on the SavvyTrip frontend service.

### CORE / API (Final10 backend — change on API host, not SavvyTrip)

| Variable | Action for SavvyTrip beta |
|----------|---------------------------|
| `ALLOWED_ORIGINS` | Add comma-separated **exact** SavvyTrip origins: Railway URL (`https://<service>.up.railway.app`), later `https://savvytrip.app`, `https://www.savvytrip.app` |
| `CORS_ORIGINS` | Optional alias — same parser as `ALLOWED_ORIGINS` |
| `GOOGLE_CALLBACK_URL` | Unchanged — stays API callback (`https://api.final10.app/api/auth/google/callback`) |
| Google Cloud Console | Authorized redirect URIs: same API callback only (browser return uses `client_origin` query) |
| `SAVVY_CORE_V1_ENABLED` | Keep enabled as in proof |
| `SAVVY_CORE_PROOF_*` | Unchanged unless you run server-side proof from API |
| Deploy Final10 | Ship CORS + OAuth `client_origin` redirect support (SavvyTrip beta branch) |

**Authentication model:** JWT in `localStorage` key `savvy_universe_token` — same accounts as Final10. Email/password works once CORS allows your origin. Google OAuth: SavvyTrip passes `?client_origin=<your-app>` on `/api/auth/google`; API redirects to `<origin>/auth/callback?token=…`.

## `@savvy/core`

Vendored at `packages/savvy-core` (theme CSS + universe event constants). Railway clone of **SavvyTrip only** is supported via `file:./packages/savvy-core`.

Runtime wallet / XP / proof calls use Final10 API only — not this package.

## Routes (SPA — direct navigation must work)

| Route | Notes |
|-------|--------|
| `/beta` | Beta entry, sign-in, `betaTester` / founding flags |
| `/login`, `/wallet`, `/planner`, … | Protected app shell |
| `/auth/callback`, `/auth/social` | OAuth token landing |
| `/dev/savvy-core-proof` | Dev or `VITE_ENABLE_CORE_PROOF=true`; admin-only mutations |

## Local verification

```bash
npm ci
npm run build
npm run test:core-smoke
```

## Manual beta checklist (after Railway deploy)

1. Load `/beta` on the Railway URL (mobile + desktop).
2. Sign in (email or Google) — same account as Final10.
3. Beta status for `betaTester` account; friendly block message otherwise.
4. Open SavvyTrip → wallet shows shared Savvy balance / Core status.
5. Planner loads; refresh on `/wallet` and `/login` does not 404.
6. Logout / login again.
7. Final10 still shows the same balance after a controlled Core write (admin proof only if enabled).
8. Normal users cannot use `/dev/savvy-core-proof` (disabled unless env flag; admin gate if enabled).
