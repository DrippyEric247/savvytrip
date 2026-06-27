import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/AuthContext'

export function AuthCallbackPage() {
  const { completeSocialLogin } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [err, setErr] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = searchParams.get('token')
    if (!token) {
      navigate('/login?error=social_auth_failed', { replace: true })
      return
    }

    void completeSocialLogin(token)
      .then(() => navigate('/', { replace: true }))
      .catch(() => setErr('Social sign-in failed. Please try again or use email.'))
  }, [completeSocialLogin, navigate, searchParams])

  if (err) {
    return (
      <AuthLayout title="Sign-in failed" subtitle={err}>
        <button
          type="button"
          className="w-full rounded-lg bg-white/10 py-3 text-sm text-white hover:bg-white/15"
          onClick={() => navigate('/login', { replace: true })}
        >
          Back to login
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Signing you in…" subtitle="Completing Savvy Universe authentication.">
      <p className="text-center text-sm text-slate-400">One moment…</p>
    </AuthLayout>
  )
}
