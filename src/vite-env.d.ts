/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API server origin without `/api` (required for production builds). */
  readonly VITE_API_URL?: string
  /** Vite dev-only proxy target (see vite.config.ts). */
  readonly VITE_DEV_API_PROXY?: string
  /** Optional override for production fallback origin in runtimeApi. */
  readonly VITE_DEFAULT_API_ORIGIN?: string
  /** Documentation / future OAuth setup — public app URL. */
  readonly VITE_PUBLIC_APP_ORIGIN?: string
  /** Set to `true` to expose /dev/savvy-core-proof in production (admin still required). */
  readonly VITE_ENABLE_CORE_PROOF?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
