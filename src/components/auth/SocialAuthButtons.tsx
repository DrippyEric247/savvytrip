import { useEffect, useState } from 'react'
import { buildAuthUrl } from '../../lib/auth/runtimeApi'
import { getAuthProviders } from '../../lib/auth/api'

export function SocialAuthButtons({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const [providers, setProviders] = useState({ google: false, apple: false, loaded: false })

  useEffect(() => {
    let active = true
    const onLocalWithoutApi =
      !import.meta.env.VITE_API_URL &&
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    // Skip provider probe when no API is configured locally (dev or preview).
    if (onLocalWithoutApi) {
      setProviders({ google: false, apple: false, loaded: true })
      return undefined
    }
    getAuthProviders()
      .then((p) => {
        if (active) setProviders({ ...p, loaded: true })
      })
      .catch(() => {
        if (active) setProviders({ google: false, apple: false, loaded: true })
      })
    return () => {
      active = false
    }
  }, [])

  const googleUrl = buildAuthUrl('google')
  const verb = mode === 'signup' ? 'Sign up' : 'Continue'

  if (!googleUrl) return null

  return (
    <div className="mb-5 space-y-3">
      <a
        href={googleUrl}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
      >
        {verb} with Google
      </a>
      {providers.loaded && !providers.google && !providers.apple ? (
        <p className="text-center text-xs text-amber-200/80">
          Social sign-in may require server OAuth configuration. Email works below.
        </p>
      ) : null}
      <div className="my-5 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-wide text-slate-500">or continue with email</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  )
}
