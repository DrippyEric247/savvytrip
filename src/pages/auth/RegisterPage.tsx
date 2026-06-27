import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons'
import { useAuth } from '../../context/AuthContext'
import { parseApiError } from '../../lib/auth/apiErrorParsing'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await register({
        ...form,
        email: form.email.trim(),
        username: form.username.trim(),
      })
      navigate('/', { replace: true })
    } catch (error) {
      setErr(parseApiError(error).message)
    } finally {
      setBusy(false)
    }
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthLayout title="Create account" subtitle="Join the Savvy Universe and start earning on every trip.">
      <SocialAuthButtons mode="signup" />

      {err ? (
        <div className="mb-4 rounded-lg border border-red-500/35 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
          {err}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="First name"
            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
          />
          <input
            required
            placeholder="Last name"
            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </div>
        <input
          required
          placeholder="Username"
          autoComplete="username"
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50"
          value={form.username}
          onChange={(e) => update('username', e.target.value)}
        />
        <input
          required
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="Password (10+ characters)"
          autoComplete="new-password"
          minLength={10}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500/50"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link className="text-sky-300 underline" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
