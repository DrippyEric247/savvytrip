import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { requestPasswordReset } from '../../lib/auth/api'
import { parseApiError } from '../../lib/auth/apiErrorParsing'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (error) {
      setErr(parseApiError(error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Forgot password" subtitle="Pilot Scout will email reset instructions if the account exists.">
      {sent ? (
        <div
          className="rounded-lg border border-emerald-500/35 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"
          role="status"
        >
          If an account exists, we sent reset instructions.
        </div>
      ) : (
        <>
          {err ? (
            <div className="mb-4 rounded-lg border border-red-500/35 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
              {err}
            </div>
          ) : null}
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link className="text-sky-300 underline" to="/login">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  )
}
