# Final10 QA Bug Report

**Generated:** 2026-06-26T08:31:55.689Z
**Targets:** https://www.final10.app, http://localhost:3000
**API:** https://api.final10.app

## Test scope (priority order)

1. Protected routes & admin-only controls (unauthenticated access)
2. API auth boundary (`/api/auth/me`, admin endpoints)
3. Google OAuth configuration & redirect
4. Email login error handling
5. Forgot password flow
6. Perk Machine / Battle Pass / Daily Streak / Alerts reachability
7. Mobile horizontal overflow
8. Console & network errors on dashboard
9. Savvy balance (requires authenticated session — manual follow-up)
10. Login streak claim flow (requires authenticated session — manual follow-up)

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 0 |

**Total bugs found:** 3

## Bugs

### BUG-003: [LOCAL] API network failures on load

**Area:** API  
**Severity:** High

#### Steps to reproduce
1. Open http://localhost:3000
2. Check network tab

#### Expected result
API calls succeed or fail gracefully

#### Actual result
GET http://localhost:5000/api/auth/providers — net::ERR_CONNECTION_REFUSED | OPTIONS http://localhost:5000/api/analytics/event — net::ERR_CONNECTION_REFUSED | OPTIONS http://localhost:5000/api/analytics/event — net::ERR_CONNECTION_REFUSED | GET http://localhost:5000/api/auth/providers — net::ERR_CONNECTION_REFUSED

#### Screenshot / log notes
qa-screenshots/qa-screenshot-03-local-network-fail.png

#### Recommended fix
Check CORS, API URL config, and backend health.

---

### BUG-001: [LIVE] Invalid login shows no user-visible error

**Area:** Email login  
**Severity:** Medium

#### Steps to reproduce
1. Enter qa-invalid@final10.test / WrongPassword!123
2. Submit

#### Expected result
Clear error message (role="alert")

#### Actual result
Page text: Final10 🏠 Home (Community) 🏆 Savvy Wins 🔨 Auctions 🏪 Quick Snipes Alerts 📱 Trending Feed 🤖 Scanner 📈 Sell signals 💡 Promote 📊 Seller Dashboard 🎁 Savvy Offers 🏢 Life Optimizer 🛡️ Savvy Programs 🧪 Founding Tester 👤 Profile / Settings 🏆 L

#### Screenshot / log notes
qa-screenshots/qa-screenshot-01-live-login-no-error.png

#### Recommended fix
Surface parseApiError message in Login.js err state.

---

### BUG-002: [LOCAL] Multiple console errors on dashboard load

**Area:** General  
**Severity:** Medium

#### Steps to reproduce
1. Open http://localhost:3000/
2. Inspect browser console

#### Expected result
No critical JS errors

#### Actual result
Failed to load resource: net::ERR_CONNECTION_REFUSED | Failed to load resource: net::ERR_CONNECTION_REFUSED | Failed to load resource: net::ERR_CONNECTION_REFUSED | Failed to load resource: net::ERR_CONNECTION_REFUSED | Failed to load resource: net::ERR_CONNECTION_REFUSED

#### Screenshot / log notes
qa-screenshots/qa-screenshot-02-local-console-errors.png

#### Recommended fix
Fix failing imports, API calls, or undefined references.

---


## Manual test gaps

- **Savvy balance:** Requires signed-in user; verify profile `#savvy-balance` matches API `/api/auth/me` savvyPoints.
- **Perk Machine / Eggs:** Requires auth + Savvy balance; test spin, egg hatch modal, insufficient-funds state.
- **Battle Pass:** Verify XP bar, tier rewards, premium track lock.
- **Login streak:** Sign in twice same day vs consecutive days; verify shield and redirect to `/daily-streak`.
- **Alerts:** Create/edit/delete alert rules; verify push/email toggles persist.
- **Admin panels:** Sign in as non-admin; confirm `/admin`, `/shield-dashboard` redirect to `/` in production.
