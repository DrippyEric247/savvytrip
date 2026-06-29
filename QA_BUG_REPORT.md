# Final10 QA Bug Report

**Generated:** 2026-06-26  
**Tester:** Final10 QA Bug Hunter (automated + targeted live verification)  
**Targets:** https://www.final10.app (LIVE), http://localhost:3000 (LOCAL client)  
**API:** https://api.final10.app (canonical), https://final10-backend-production.up.railway.app (live bundle target)

---

## Executive summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 3 |
| Low | 1 |

**Total bugs:** 6  
**Protected routes (unauthenticated):** PASS — all tested paths redirect to `/login`  
**Google login button:** PASS — visible; OAuth start returns HTTP 302  
**Email login (invalid creds):** PASS — shows `Invalid credentials` when form is filled correctly  
**Forgot password API:** PASS — returns generic success for valid email  
**Admin API without token:** PASS — `/api/auth/me` and perk-machine admin ping return 401  

---

## Priority test matrix (top 10 highest-risk)

| # | Area | Result | Notes |
|---|------|--------|-------|
| 1 | Protected routes | **PASS** | `/profile`, `/alerts`, `/perk-machine`, `/battle-pass`, `/daily-streak`, `/admin` → `/login` when logged out |
| 2 | Admin API boundary | **PASS** | `/api/auth/me`, `/api/perk-machine/admin/ping` reject unauthenticated requests |
| 3 | Google login | **PASS w/ risk** | Button works; OAuth uses legacy Railway host (see BUG-001) |
| 4 | Email login | **PASS** | 401 shows `Invalid credentials` in `[role="alert"]` |
| 5 | Forgot password | **PASS** | API 200 + neutral copy; UI blocks invalid TLDs server-side |
| 6 | Production API host config | **FAIL** | Live bundle not using `api.final10.app` (BUG-001) |
| 7 | Mobile layout | **FAIL** | 24px horizontal page scroll at 390px width (BUG-002) |
| 8 | Local dev stack | **FAIL** | Client up, API down — all requests refused (BUG-003) |
| 9 | Savvy balance / Perk / Eggs / BP / Streak | **NOT TESTED** | Requires authenticated test account (manual gap) |
| 10 | Admin-only UI controls | **PARTIAL** | Server-gated; client panels hidden for non-admins; full admin UX needs signed-in admin session |

---

## Bugs

### BUG-001: Live production bundle targets legacy Railway API host instead of `api.final10.app`

**Area:** Google login / API / Savvy balance  
**Severity:** High

#### Steps to reproduce
1. Open https://www.final10.app/login
2. Inspect the **Continue with Google** link `href`, or open DevTools → Network
3. Reload the page and observe API request origins

#### Expected result
All API traffic and OAuth starts use the canonical host `https://api.final10.app` (matching health checks, DNS, and docs in `runtimeApi.js`).

#### Actual result
- Google OAuth href: `https://final10-backend-production.up.railway.app/api/auth/google`
- Page load API calls (e.g. `/api/auth/providers`) go to `final10-backend-production.up.railway.app`
- `api.final10.app` is healthy (HTTP 200 `/api/health`) but is **not** what the deployed frontend uses

#### Screenshot / log notes
```
google_href: https://final10-backend-production.up.railway.app/api/auth/google
api_hosts: [ 'https://final10-backend-production.up.railway.app' ]
```
Both Railway and `api.final10.app` return 302 for Google OAuth today, but dual-host setup risks cookie/session drift, CORS surprises, and broken OAuth if Railway URL is retired.

#### Recommended fix
- Set `REACT_APP_API_URL=https://api.final10.app` in the Vercel/production build env
- Rebuild and redeploy the client
- Verify Google button `href` and network tab only hit `api.final10.app`
- Update any OAuth callback allowlists to match the canonical domain

---

### BUG-002: Mobile layout allows ~24px horizontal page scroll (390px viewport)

**Area:** Mobile layout  
**Severity:** Medium

#### Steps to reproduce
1. Open https://www.final10.app/ on a mobile device or emulator (390×844)
2. Swipe horizontally on the page body (not just the nav chip row)
3. Repeat on `/login` and `/auctions`

#### Expected result
No horizontal scroll on the document; navigation chips scroll inside their own container only.

#### Actual result
- `document.documentElement.scrollWidth`: **414**
- `document.documentElement.clientWidth`: **390**
- `scrollLeftMax`: **24** (page can scroll sideways)
- Offenders include:
  - `.f10-app-bg` fixed background ~394px wide (`right: 392` on 390px viewport)
  - `.nav-item` links extending to `right: 663` (horizontal nav row bleeds into document scroll width)
- Source `index.css` sets `overflow-x: clip` on `html`, `body`, `#root`, but **computed style on LIVE is `overflow-x: visible`** — clip rules are not effective in the deployed build.

#### Screenshot / log notes
Automated overflow scan (`scripts/qa-overflow.mjs`):
```
/ scrollWidth:414 innerWidth:390 offenders: f10-app-bg (width 394), nav-item links to x=663
```

#### Recommended fix
- Add `overflow-x: hidden` (or fix why `clip` isn't applied) on `html`/`body` in the deployed CSS bundle
- Constrain `.main-navigation` / `.nav-items` so off-screen links don't expand `documentElement.scrollWidth` (e.g. `overflow-x: auto` on nav + `max-width: 100%` + `contain: layout` on nav parent)
- Audit `.f10-app-bg` fixed layer width (`inset: 0` vs implicit 394px overflow)

---

### BUG-003: Local client runs without backend — all API calls fail

**Area:** Local dev / Email login / Savvy balance / Alerts  
**Severity:** High (local environment only)

#### Steps to reproduce
1. Start only the React client: `http://localhost:3000` (confirmed running)
2. Do **not** start the API on `http://localhost:5000`
3. Open `/login` or `/` and watch Network / Console

#### Expected result
Either the API server is running on `:5000`, or the client surfaces a clear “backend unavailable” state.

#### Actual result
```
GET http://localhost:5000/api/auth/providers — net::ERR_CONNECTION_REFUSED
OPTIONS http://localhost:5000/api/analytics/event — net::ERR_CONNECTION_REFUSED
```
Login, Savvy balance, alerts, perk machine, and all authenticated flows are non-functional locally.

#### Screenshot / log notes
`qa-screenshots/qa-screenshot-03-local-network-fail.png` (from automated pass)  
Console: repeated `Failed to load resource: net::ERR_CONNECTION_REFUSED`

#### Recommended fix
- Document/run `server` + `client` together (`npm run dev` in server on :5000, client on :3000)
- Optionally add a dev banner when `getApiOrigin()` is unreachable
- Consider pointing local client at staging API via `.env.local` when only UI work is needed

---

### BUG-004: Login form missing HTML5 `required` validation on email/password

**Area:** Email login  
**Severity:** Low

#### Steps to reproduce
1. Open https://www.final10.app/login
2. Leave email and password empty
3. Click **Sign in**

#### Expected result
Browser-native validation (“Please fill out this field”) or an inline error before any API call.

#### Actual result
- `input[type="email"].required`: **false**
- `validationMessage`: empty
- Form submits without client-side required checks (API may still reject)

#### Screenshot / log notes
Automated check: `{ required: false, validationMessage: "" }`

#### Recommended fix
Add `required` to email and password inputs in `Login.js` (ForgotPassword already uses `required` on email).

---

### BUG-005: Deployed global `overflow-x: clip` CSS not applied — horizontal bleed reaches document

**Area:** Mobile layout / CSS deployment  
**Severity:** Medium

#### Steps to reproduce
1. Open LIVE site on mobile width
2. In DevTools, inspect computed styles on `html` and `body`

#### Expected result
`overflow-x: clip` per `client/src/index.css` lines 8–19.

#### Actual result
```
bodyOverflow: "visible"
htmlOverflow: "visible"
canScrollRight: true
```
Mismatch between source and production enables BUG-002 user-visible horizontal scroll.

#### Screenshot / log notes
`scripts/qa-scroll-check.mjs` output above.

#### Recommended fix
- Verify Tailwind / build pipeline isn't stripping or overriding `index.css` overflow rules
- Use `overflow-x: hidden` as a fallback for broader browser support
- Add a visual regression check at 390px width in CI

---

### BUG-006: Navigation shows protected destinations to logged-out users without locked/disabled state

**Area:** Mobile layout / UX / Protected routes  
**Severity:** Medium

#### Steps to reproduce
1. Open https://www.final10.app/ while logged out (mobile or desktop)
2. Scroll the top nav chip row
3. Tap **Alerts**, **Perk Machine**, **Battle Pass**, **Daily Streak**, **Profile**

#### Expected result
Either hide auth-gated links when logged out, or show a lock affordance before navigation.

#### Actual result
Nav lists 20+ items including protected routes. Each tap redirects to `/login` (correct), but logged-out users get no upfront signal that auth is required — extra friction on mobile where nav is already overcrowded (contributing to BUG-002 overflow).

#### Screenshot / log notes
Nav offenders extend to `x=663` on 390px viewport (`qa-overflow.mjs`).

#### Recommended fix
- Filter `navItems` in `Navigation.js` to omit or dim auth-only links when `!user`
- Group secondary links behind a “More” drawer on mobile

---

## Areas tested — no bug filed

| Area | Result |
|------|--------|
| **Google login** | Button visible; `GET /api/auth/google` → 302 on both API hosts |
| **Email login** | Invalid `qatest@gmail.com` + wrong password → alert `Invalid credentials` |
| **Forgot password** | `POST /api/auth/forgot-password` with `qatest@gmail.com` → 200 + generic message |
| **Protected routes** | Unauthenticated access redirects to `/login` for all tested paths |
| **Admin API** | No token → 401 `NO_TOKEN` / `INVALID_TOKEN` |
| **Build Wars** | Public route by design (`BuildWarsPage.tsx` loads config/leaderboard without auth; entry/vote needs user) |
| **Battle Pass / Perk / Streak admin panels** | Client checks admin API before render; server routes use `requireAdminAccess()` |

---

## Manual test gaps (require credentials)

These were **not** automated because they need a real test account:

### Savvy balance
- Sign in → Profile `#savvy-balance` vs `GET /api/auth/me` `savvyPoints`
- Verify Savvy HUD matches profile after Perk Machine spin

### Perk Machine & Eggs
- Spin with sufficient/insufficient Savvy
- Hatch each egg tier; confirm inventory + balance updates
- Free spin cooldown countdown

### Battle Pass
- XP gain on daily login
- Tier claim (free vs premium track)
- Premium track lock for non-subscribers

### Login streak
- First login of day → claim modal / redirect to `/daily-streak`
- Same-day re-login → no double claim
- Streak shield on missed day

### Alerts
- Create keyword alert, toggle active, delete
- Unread badge in nav vs `/alerts` read state
- Email delivery (Resend configured per `/api/health`)

### Admin-only controls (signed-in non-admin)
- Confirm `/admin`, `/shield-dashboard`, `/owner-control` redirect to `/` on LIVE (production `InternalRoute`)
- Confirm Perk/Battle Pass/Streak admin panels do not render

### Google login (full OAuth)
- Complete Google sign-in end-to-end in a real browser (automated test stopped at 302 redirect)
- Verify callback lands on `/auth/social?token=...` and session hydrates

---

## Test artifacts

| Script | Purpose |
|--------|---------|
| `scripts/qa-bug-hunter.mjs` | Full smoke pass (live + local) |
| `scripts/qa-targeted.mjs` | Focused live checks |
| `scripts/qa-login-debug.mjs` | Login error + API response capture |
| `scripts/qa-overflow.mjs` | Mobile overflow element detection |
| `scripts/qa-scroll-check.mjs` | Document horizontal scroll measurement |

---

## Recommended next QA pass

1. Provision a dedicated QA account (non-admin + admin) for authenticated flows  
2. Re-run after BUG-001 fix to confirm single API host end-to-end  
3. Re-test mobile at 390px after BUG-002/BUG-005 CSS fix  
4. Run full Google OAuth on Safari iOS (third-party cookie warning observed in headless Chrome during login tests)
