import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { submitPasswordReset } from '../../lib/auth/api'
import { parseApiError } from '../../lib/auth/apiErrorParsing'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (password !== confirmPassword) {
      setErr('Passwords do not match.')
      return
    }
    if (!token) {
      setErr('Reset link is invalid or expired.')
      return
    }
    setBusy(true)
    try {
      await submitPasswordReset({ token, password, confirmPassword })
      setDone(true)
      window.setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (error) {
      setErr(parseApiError(error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your Savvy Universe account.">
      {done ? (
        <div className="rounded-lg border border-emerald-500/35 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100" role="status">
          Password updated. Redirecting to login…
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
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              placeholder="New password"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              required
              minLength={10}
              autoComplete="new-password"
              placeholder="Confirm password"
              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-sky-500/50"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Update password'}
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
