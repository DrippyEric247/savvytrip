# SavvyTrip App #2 — Savvy Core Integration Report

**Date:** 2026-09-25  
**Status:** Implementation complete — live **RUN SAVVYTRIP CORE PROOF** requires Final10 API with `SAVVY_CORE_V1_ENABLED` + `SAVVY_CORE_PROOF_ENABLED` and configured proof test user (same as Final10 production proof).

---

## 1. SavvyTrip files modified / added

| Path | Role |
|------|------|
| `src/lib/savvyCore/client.ts` | API client: `/savvytrip-core/*`, `/savvytrip-core-proof/*` |
| `src/lib/savvyCore/savvyTripCoreAdapter.ts` | Reusable read adapter (`syncSavvyTripCoreAccount`) |
| `src/context/SavvyCoreContext.tsx` | Login/load Core sync + unavailable handling |
| `src/components/core/SavvyTripCoreStatusPanel.tsx` | SAVVYTRIP × SAVVY CORE status panel |
| `src/pages/dev/SavvyTripCoreProofPage.tsx` | Admin proof harness UI |
| `src/components/wallet/SessionBalanceCard.tsx` | Prefers Core balance over session `/me` |
| `src/components/sections/SavvyWalletSection.tsx` | Embeds status panel |
| `src/routes.tsx` | `/dev/savvy-core-proof` |
| `src/main.tsx` | `SavvyCoreProvider` |
| `src/lib/auth/api.ts` | `role` on `AuthUser` |
| `src/lib/coreIntegrationPoints.ts` | Rewards read wired note |
| `scripts/savvy-core-parity-smoke.mjs` | Client wiring smoke |
| `package.json` | `test:core-smoke` script |

## 2. Core / Final10 server files modified / added

| Path | Role |
|------|------|
| `server/services/savvyCore/savvyTripCoreAdapter.js` | Server adapter (`sourceApp: savvytrip`, security guards) |
| `server/services/savvyCore/savvyTripAppProofService.js` | App #2 full proof sequence |
| `server/routes/savvyTripCoreRoutes.js` | `GET /account`, `GET /health` |
| `server/routes/savvyTripAppProofRoutes.js` | Proof actions + `run-full` |
| `server/config/savvyTripAppProofConfig.js` | +10 Savvy, +25 XP, contract/cosmetic ids |
| `server/config/contracts.js` | `savvytrip_core_proof_action` contract |
| `server/data/cosmeticIds.js` | `savvytrip_proof_card` |
| `packages/savvy-core/src/config/contracts/savvytrip.js` | Core contract mirror |
| `packages/savvy-core/src/config/contracts/index.js` | Export savvytrip contracts |
| `server/index.js` | Mount `/api/savvytrip-core`, `/api/savvytrip-core-proof` |
| `server/__tests__/savvyTripAppProof.test.js` | Config + permissions tests |

## 3. Canonical user-linking

- Same JWT storage key: `savvy_universe_token` (`savvytripAuthConfig.storageKey`).
- SavvyTrip `GET /api/auth/me` and Core routes use the same authenticated `req.user._id`.
- `readSavvyTripCoreAccount` exposes `canonicalUserId: String(user._id)`.

## 4. Core services reused

- `savvyCoreWalletService` (`getSavvyBalance`, `earnSavvy` via adapter)
- `savvyCoreProgressionService` (`getAccountProgression`, `awardAccountXP`)
- `savvyCoreContractService` (`progressAppContracts`)
- `savvyCoreCosmeticService` (`unlockCosmetic`)
- `savvyCoreProfileService` (`getSavvyCoreMe`)
- Final10 production proof gating (`resolveProofContext`, test subject env)

## 5. `sourceApp` identifier

**`savvytrip`** — all SavvyTrip adapter mutations stamp `sourceApp: "savvytrip"`; proof uses `sourceFeature: "core_proof"`.

## 6–14. Live proof results

Not executed in this environment (MongoDB + proof flags + separate admin/test users required). To run locally:

1. Final10 server: `SAVVY_CORE_V1_ENABLED=true`, `SAVVY_CORE_PROOF_ENABLED=true`, configure `SAVVY_CORE_PROOF_TEST_USER_EMAIL`.
2. SavvyTrip: `npm run dev`, sign in as **admin**, open `/wallet` and `/dev/savvy-core-proof`.
3. **RUN SAVVYTRIP CORE PROOF** — expect `SAVVYTRIP APP #2 PROOF: PASS` when parity holds.
4. Final10: existing `/dev/savvy-core-proof` **FULL PROOF** should still pass (no changes to `savvyCoreProofService` mutation amounts/app id).

**Automated checks run here:**

| Check | Result |
|-------|--------|
| `jest savvyTripAppProof + savvyCoreProof` | **17/17 PASS** |
| SavvyTrip `npm run build` | **PASS** |
| SavvyTrip `npm run test:core-smoke` | **PASS** |

## 15. Remaining blockers before production trip rewards

- Enable Core env flags in deployment; register SavvyTrip origin in CORS/OAuth.
- Map real trip actions to adapter calls (booking, search rewards) with idempotency keys.
- Replace admin-only proof UI with feature-flagged ops tools or remove from public builds.
- Wire `@savvy/core` reward toasts / HUD (Phase 4 UI — reads are live).
