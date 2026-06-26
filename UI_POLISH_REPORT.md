# UI Polish Report — Final10 Core Surfaces

**Agent:** Final10 UI Polish Agent  
**Date:** 2026-06-26  
**Status:** Inspection only — no code changes  
**Source audited:** `C:\Users\ericv\final10\client\`  
**SavvyTrip note:** These screens are **not implemented** in SavvyTrip yet; they are planned for extraction via `SAVVY_CORE_EXTRACTION_PLAN.md`. All findings below reference Final10 as the live UI.

---

## Executive summary

Final10 has a strong visual identity (purple/gold neon, glass panels, motion) but several surfaces suffer from **stacked chrome**, **inconsistent design tokens**, and **mobile Safari edge cases** (safe areas, z-index collisions, touch-only gaps). The highest-impact polish work is:

1. **Auth funnel simplification** — full app nav + auth header on login/signup creates noise and pushes forms below the fold on phones.
2. **Fixed HUD / overlay stacking** — wallet pill, side assistant, hatch modal, and perk toasts compete for the same screen corners and z-index bands.
3. **Navigation density** — 20+ items with no desktop overflow strategy and icon-only mobile labels hurt discoverability for Perk Machine, Battle Pass, and Profile.
4. **Theme token drift** — auth forms use ad-hoc Tailwind grays instead of shared `.input` / `.btn-*` from `theme.css`.

---

## Methodology

Static code review of layout CSS, component markup, z-index values, breakpoints, and safe-area usage. No runtime device testing was performed; Mobile Safari items are inferred from known iOS behaviors and existing partial safe-area hooks in the codebase.

---

## Global — Navigation, HUD, Mobile Safari

### Navigation (`Navigation.js`, `ProductFeed.css`)

| ID | Severity | Issue |
|----|----------|-------|
| NAV-01 | **High** | **20+ nav items** render in a single horizontal flex row on desktop with no `overflow-x` — items likely overflow or compress on viewports &lt; ~1400px. |
| NAV-02 | **High** | On mobile (`≤768px`), **labels are hidden** (`.nav-label { display: none }`) — navigation is emoji/icon-only. Perk Machine, Battle Pass, and Profile are indistinguishable without tooltips. |
| NAV-03 | **Medium** | Core progression destinations (Perk Machine, Battle Pass, Daily Streak, Profile) are **buried mid-scroll** in the horizontal nav strip — no visual grouping or “Play” cluster. |
| NAV-04 | **Medium** | Active state uses `::after` dot at `bottom: -15px` — can **clip or misalign** inside the horizontally scrolling mobile nav container. |
| NAV-05 | **Low** | Duplicate semantics: 🏆 used for both “Savvy Wins” and “Leaderboard”. |
| NAV-06 | **Low** | Inline `style={{ display: 'flex', … }}` on brand row instead of CSS class — minor consistency drift. |

### Universal Power HUD (`UniversalBoostProgressBar.css`)

| ID | Severity | Issue |
|----|----------|-------|
| HUD-01 | **High** | Bar is `position: sticky; top: 0; z-index: 950` while main nav is also `sticky; top: 0; z-index: 1000`. Both compete for the **same viewport top** — on scroll the power bar tucks under the nav rather than sticking below it. Content `scroll-padding-top: 5rem` may be insufficient when both bars are visible. |
| HUD-02 | **Medium** | `.f10-ubp-oneline` uses `white-space: nowrap` — long power labels **truncate or overflow** on narrow phones with no ellipsis fallback. |

### Savvy Wallet bubble (`SavvyWalletBubble.css`)

| ID | Severity | Issue |
|----|----------|-------|
| HUD-03 | **Medium** | Mobile pill positioned `bottom: calc(safe-area + 58px)` — the `+58px` offset is a magic number that may **not clear** Side Assistant FAB, Party dock, or Tab Journey panel on all routes. |
| HUD-04 | **Medium** | Expanded sheet `max-height: 45vh` — on short Safari viewports (address bar shown), sheet content can feel **cramped**; no `dvh`/`svh` usage. |
| HUD-05 | **Low** | Desktop hover lift on bubble has no touch equivalent — acceptable but creates **capability gap** vs mouse users. |

### Side Assistant & overlay z-index stack

| Layer | z-index | Notes |
|-------|---------|-------|
| Battle Pass celebrate | `2147483600` | OK |
| Savvy balance modal | `2147483588` | OK |
| Wallet mobile bubble | `2147482100` | Can cover modals below |
| Side Assistant | `2147482000` | Competes with wallet |
| Perk confirm toast | `1500` | Below wallet/assistant |
| Perk activate modal | `1600` | Below wallet/assistant |
| **Hatch modal** | **`1000`** | **Same band as main nav** — risk of appearing behind wallet/assistant |
| Main navigation | `1000` | Sticky header |

| ID | Severity | Issue |
|----|----------|-------|
| Z-01 | **High** | **Hatch modal (`z-index: 1000`)** and perk overlays can render **behind** the floating wallet pill and side assistant on mobile — blocks dismiss/CTA taps. |
| Z-02 | **Medium** | Perk confirm toast at `top: 84px` — fixed offset may sit **under** stacked nav + power bar on scroll, especially on notched devices without `env(safe-area-inset-top)`. |

### Mobile Safari — cross-cutting

| ID | Severity | Issue |
|----|----------|-------|
| IOS-01 | **High** | Auth and Perk Machine pages lack **`env(safe-area-inset-*)`** padding (Profile and nav partially have it; Daily Streak and main container do). Bottom CTAs on Perk Machine and Egg Hatchery can sit on the **home indicator**. |
| IOS-02 | **Medium** | No global **`font-size: 16px` minimum** on inputs — Login/Register use `p-3` Tailwind (~12–14px computed) which can trigger **Safari auto-zoom** on focus. |
| IOS-03 | **Medium** | Perk Machine uses `min-height: 100vh` — Safari **dynamic toolbar** can cause subtle jump vs `100dvh` used elsewhere (`index.css` tab journey). |
| IOS-04 | **Low** | `-webkit-tap-highlight-color` only on SavvyScoutButton — auth and perk buttons lack consistent tap highlight suppression. |
| IOS-05 | **Low** | `prefers-reduced-motion` respected on Perk/Egg/Hatchery — good. Battle Pass bar animation and profile shimmer **do not** uniformly respect reduced motion. |

---

## Login / Signup (`Login.js`, `Register.js`, `SocialAuthButtons.js`)

| ID | Severity | Issue |
|----|----------|-------|
| AUTH-01 | **High** | **Triple chrome on auth routes:** full `Navigation` + `app-auth-header` (logo + Login/Sign Up again) + page form. On mobile this pushes the form **well below the fold**. |
| AUTH-02 | **High** | Forms use raw `bg-gray-900` inputs instead of theme **`.input`** tokens (`theme.css`) — inconsistent border radius (default `rounded` vs 12px), focus ring, and placeholder color. |
| AUTH-03 | **Medium** | **Login:** only Email has a `<label>`; Password is placeholder-only. **Register:** no labels on any field — accessibility and autofill UX suffer. |
| AUTH-04 | **Medium** | **Duplicate loading feedback:** submit button shows “Signing in…” / “Creating account…” *and* a separate `LoadingState` appears below the form. |
| AUTH-05 | **Medium** | **Visual inconsistency:** Login primary CTA is `bg-purple-500`; Register is `bg-yellow-400 text-black`; header uses `btn-primary` gradient elsewhere. |
| AUTH-06 | **Medium** | Login logo block `mb-12 mt-4` vs Register `mb-8` — **uneven vertical rhythm** between sibling auth pages. |
| AUTH-07 | **Low** | Register first/last name `grid-cols-2` at all widths — cramped on **320px** devices; labels would help when placeholders clip. |
| AUTH-08 | **Low** | `AuthDebugFooter` visible in dev on auth pages — fine for dev; ensure it never ships to production reviewers (already gated by env in App). |
| AUTH-09 | **Low** | Social auth divider “or continue with email” is good; OAuth error banner styling matches form errors — consistent. |

**Positive:** Social buttons have focus rings, provider-aware copy, and sensible error mapping.

---

## Perk Machine (`PerkMachine.js`, `PerkMachine.css`, `PerkMachineEnvironment.css`)

| ID | Severity | Issue |
|----|----------|-------|
| PERK-01 | **Medium** | **Sidebar → main column collapse at 900px** places Eggs Owned, Active Boosts, Inventory, and Recent Spins **above** the hatchery section but **below** the machine — long scroll before Egg Hatchery; inventory is **duplicated** (sidebar panel + hatchery grid). |
| PERK-02 | **Medium** | Spin buttons use **2×2 grid below 640px** — acceptable, but button text at `0.72rem` uppercase is **hard to read** on small screens (“20 SAVVY · 1 SLOT”). |
| PERK-03 | **Medium** | Machine `min-height: 420px` + art `object-fit: cover` — on iPhone SE class devices the stage dominates viewport; scout floater bubble (`max-width: 55vw`, `0.76rem` text) can **overlap reels**. |
| PERK-04 | **Medium** | `machineHover` effects tied to `onMouseEnter/Leave` only — **no touch feedback** on mobile for machine glow/hover state. |
| PERK-05 | **Medium** | Header balance pill + tier pill wrap in `perk-header__actions` — on narrow screens title block and pills **stack awkwardly**; balance pill should remain visually tied to HUD. |
| PERK-06 | **Low** | Coin fly animation uses `40vw / -42vh` — on mobile the coins may not visually reach the balance pill (top-right). |
| PERK-07 | **Low** | `perk-page` padding `1.25rem 1rem 3rem` — no safe-area bottom inset (contrast `App.js` main padding). |
| PERK-08 | **Low** | Activation modal is well-structured (`role="dialog"`, backdrop click) — good pattern to reuse. |

**Positive:** Reduced-motion guards, responsive scout floater tweaks, clear error CTA links, spin button disabled states.

---

## Egg Hatchery (`EggHatchery.js`, `EggHatchery.css`, `EggCard`, `EggHatchModal`)

| ID | Severity | Issue |
|----|----------|-------|
| EGG-01 | **High** | Hatch modal `z-index: 1000` — see **Z-01**; cinematic fullscreen experience can be **obstructed** by wallet/assistant FABs. |
| EGG-02 | **Medium** | Close button `top: 1rem; right: 1rem` — no `env(safe-area-inset-top/right)` — can sit under **notch/Dynamic Island** on iPhone. |
| EGG-03 | **Medium** | `.egg-hatchery__title` sets both `background-clip: text` and `text-shadow` — shadow **does not render** on clipped gradient text (dead CSS). |
| EGG-04 | **Medium** | Grid `minmax(160px, 1fr)` → `130px` at 640px — five tier cards can feel **tight**; hatch button full-width inside card is good but touch targets near 44px minimum at smallest padding. |
| EGG-05 | **Low** | Empty state CTA “Spin Perk Machine” scrolls to machine — good UX; empty scout image lacks explicit safe-area spacing at bottom. |
| EGG-06 | **Low** | Footer dialogue stacks vertically on mobile (`flex-direction: column`) — readable; scout image centering is good. |

**Positive:** Strong motion design with `prefers-reduced-motion` fallback; modal footer scout + dialogue pattern is on-brand.

---

## Battle Pass (`BattlePassPage.tsx`, `BattlePassPage.css`, `battlePassTasks.css`, `BattlePassRewardTracks.tsx`)

| ID | Severity | Issue |
|----|----------|-------|
| BP-01 | **Medium** | Hero block stacks **5+ text lines** (season name, slogan, two explanatory subs, live Savvy, progress meta, upgrade row) before reward tracks — **heavy scroll** on mobile before core loop. |
| BP-02 | **Medium** | Upgrade row mixes premium CTA, ghost “Refresh subscription”, and `text-xs` microcopy in one flex wrap — **cluttered** on 375px width. |
| BP-03 | **Medium** | Sync/error banners use **inline styles** instead of shared alert components — visual inconsistency with rest of app. |
| BP-04 | **Medium** | `f10-bp2-row` fixed `88px` rail + single-column cells below 640px — tier rows become **very tall**; milestone rows with two cells stack but rail repeats vertically. |
| BP-05 | **Medium** | Tier-up celebrate card `max-width: 420px` with **no `max-height` / overflow** — dual reward preview + upsell CTAs may **overflow** small Safari viewports. |
| BP-06 | **Low** | Horizontal legacy track (`.f10-bp-track-scroll`) still in CSS — confirm not rendered; if dead, remove in future cleanup. |
| BP-07 | **Low** | Page padding `16px` only — no safe-area horizontal/bottom beyond defaults. |
| BP-08 | **Low** | Mythic tier `hue-rotate` animation on cells — may be **distracting** without reduced-motion guard on `.f10-bp2-rarity--mythic`. |

**Positive:** Touch scrolling on legacy track CSS (`-webkit-overflow-scrolling: touch`), claim button states, premium lock overlay pattern, `scroll-snap` on horizontal track.

---

## Profile (`Profile.js`, `ProfilePageLayout.js`, `ProfilePageLayout.css`, `SavvyBalanceCard.tsx`)

| ID | Severity | Issue |
|----|----------|-------|
| PROF-01 | **Medium** | Content max-width **`28rem` (448px)** until `640px` — intentionally mobile-first but feels **narrow on tablets**; large empty gutters on iPad. |
| PROF-02 | **Medium** | Header **Calling Card** `min(360px, 100%)` beside emblem — on ~320px screens card **overflows** or squeezes refresh button row. |
| PROF-03 | **Medium** | Long **vertical card stack** (entitlement, Savvy balance, advantage, summary, activity, rivalry, tasks, eBay, redeem, social…) — no tabs or collapse; **scan fatigue** on mobile. |
| PROF-04 | **Medium** | Mixed styling: CSS classes + **inline `style={{}}` grids** on profile rows — harder to maintain consistent spacing. |
| PROF-05 | **Low** | `scroll-margin-top: 5.5rem` on `#savvy-balance` anchor — may be insufficient with **nav + power bar** (see HUD-01). |
| PROF-06 | **Low** | Savvy balance modal backdrop `z-index: 2147483588` — works, but close is backdrop-click only; **no explicit close button** for keyboard users. |
| PROF-07 | **Low** | `f10-profile-refresh` reused for daily login CTA — same visual weight as secondary refresh; primary claim action should **stand out** more. |

**Positive:** Profile wrap uses `env(safe-area-inset-top)` — best-in-class safe-area handling in this audit. Savvy balance card animation and hot-glow state are polished.

---

## Visual consistency matrix

| Token / pattern | Auth | Perk | Egg | Battle Pass | Profile |
|-----------------|------|------|-----|-------------|---------|
| `theme.css` `.input` | ❌ | — | — | — | partial |
| `theme.css` `.btn-*` | ❌ | custom `.perk-btn` | custom | `.f10-bp-btn` | `.f10-profile-refresh` |
| Safe-area insets | ❌ | ❌ | partial | ❌ | ✅ top |
| Reduced motion | — | ✅ | ✅ | partial | partial |
| Gradient title text | — | ✅ | ✅ (shadow bug) | ✅ | — |
| Modal z-index band | — | 1600 | **1000** | 1000 / 2147483600 | 2147483588 |

---

## Recommended fix order (polish only)

### P0 — Ship blockers for mobile Safari
1. **Z-01 / EGG-01** — Raise hatch/perk modal layer above wallet + assistant; add backdrop safe-area padding.
2. **IOS-01 / IOS-02** — Safe-area bottom on Perk/Egg CTAs; 16px input font on auth forms.
3. **AUTH-01** — Minimal auth layout (hide or collapse full nav on `/login`, `/register`).

### P1 — High-traffic UX
4. **HUD-01** — Power bar `top` offset below nav height (CSS variable from nav).
5. **NAV-01 / NAV-02** — Desktop nav overflow menu; mobile labels or tooltips for core tabs.
6. **PERK-01** — Reduce egg inventory duplication or collapse sidebar on mobile.

### P2 — Consistency pass
7. **AUTH-02 / AUTH-05** — Align auth forms to `theme.css` inputs and primary button.
8. **BP-01 / BP-03** — Compress hero copy; extract alert banner component.
9. **PROF-03** — Section tabs or accordions for profile sub-areas.

### P3 — Polish
10. Motion guards on mythic BP cells, coin flight mobile tuning, nav active indicator, tablet profile max-width.

---

## Files referenced

| Area | Primary paths |
|------|----------------|
| Login / Signup | `final10/client/src/pages/Login.js`, `Register.js`, `components/auth/SocialAuthButtons.js` |
| Navigation | `final10/client/src/components/Navigation.js`, `styles/ProductFeed.css` |
| HUD | `styles/UniversalBoostProgressBar.css`, `styles/SavvyWalletBubble.css`, `styles/Final10SideAssistant.css` |
| Perk Machine | `pages/PerkMachine.js`, `styles/PerkMachine.css`, `styles/PerkMachineEnvironment.css` |
| Egg Hatchery | `components/perk/EggHatchery.js`, `styles/EggHatchery.css` |
| Battle Pass | `pages/BattlePassPage.tsx`, `styles/BattlePassPage.css`, `styles/battlePassTasks.css` |
| Profile | `pages/Profile.js`, `pages/ProfilePageLayout.js`, `styles/ProfilePageLayout.css`, `components/profile/SavvyBalanceCard.tsx` |
| Global theme | `styles/theme.css`, `index.css`, `App.js` |

---

## Out of scope (explicit)

- Business logic, API contracts, reward calculations, battle pass XP engines
- SavvyTrip mock dashboard (`SavvyTrip/src/`) — separate design system (Tailwind v4 glass/neon)
- Automated visual regression / Playwright snapshots (recommended as follow-up)

---

*End of report. Ready for implementation pass when approved.*
