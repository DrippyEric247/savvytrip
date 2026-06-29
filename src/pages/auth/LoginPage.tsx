import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons'
import { useAuth } from '../../context/AuthContext'
import { parseApiError } from '../../lib/auth/apiErrorParsing'

export function LoginPage() {
  const { login, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (authError) setErr(authError)
  }, [authError])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await login({ email: email.trim(), password })
      navigate(from, { replace: true })
    } catch (error) {
      setErr(parseApiError(error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Savvy Universe account.">
      <SocialAuthButtons mode="login" />

      {err ? (
        <div className="mb-4 rounded-lg border border-red-500/35 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
          {err}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor="login-email" className="block text-sm text-slate-300">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="login-password" className="block text-sm text-slate-300">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500/50"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-right text-sm">
          <Link className="text-sky-300 underline underline-offset-2 hover:text-sky-200" to="/forgot-password">
            Forgot password?
          </Link>
        </p>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        No account?{' '}
        <Link className="text-sky-300 underline" to="/register">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
