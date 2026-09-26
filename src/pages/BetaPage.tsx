import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons'
import { NeonButton } from '../components/ui/NeonButton'
import { useAuth } from '../context/AuthContext'
import { hasSavvyTripBetaAccess } from '../lib/auth/betaAccess'

const RETURN_TO = '/beta'

export function BetaPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const betaEnabled = hasSavvyTripBetaAccess(user)

  if (loading) {
    return (
      <AuthLayout title="SavvyTrip Beta" subtitle="Checking your Savvy Universe session…">
        <p className="text-center text-sm text-slate-400">One moment…</p>
      </AuthLayout>
    )
  }

  if (!user) {
    return (
      <AuthLayout
        title="SavvyTrip Beta"
        subtitle="Sign in with your existing Savvy Universe account. No separate SavvyTrip identity."
      >
        <p className="mb-4 rounded-lg border border-sky-500/25 bg-sky-950/30 px-3 py-2 text-sm text-sky-100">
          Closed beta — access is limited to approved tester accounts.
        </p>
        <SocialAuthButtons mode="login" oauthReturnTo={RETURN_TO} />
        <Link
          to={`/login?returnTo=${encodeURIComponent(RETURN_TO)}`}
          className="mt-4 flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Sign in with email
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="SavvyTrip Beta"
      subtitle={
        betaEnabled
          ? 'Beta access is active for this Savvy Universe account.'
          : 'Thanks for signing in — beta access is not enabled for this account yet.'
      }
    >
      <dl className="mb-5 space-y-2 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Account</dt>
          <dd className="truncate text-right text-white">{user.email || user.username || 'Signed in'}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Beta status</dt>
          <dd className={betaEnabled ? 'text-emerald-300' : 'text-amber-200'}>
            {betaEnabled ? 'Enabled' : 'Not enabled'}
          </dd>
        </div>
      </dl>

      {!betaEnabled ? (
        <p className="mb-5 text-sm text-slate-300">
          SavvyTrip Beta access is not enabled for this account yet. Contact the SavvyTrip team if you were invited
          to test.
        </p>
      ) : (
        <p className="mb-5 text-sm text-slate-400">
          You are on a pre-release build. Wallet, XP, and Savvy balances stay shared with Final10 and the rest of the
          Savvy Universe.
        </p>
      )}

      {betaEnabled ? (
        <NeonButton className="w-full" onClick={() => navigate('/', { replace: true })}>
          Open SavvyTrip
        </NeonButton>
      ) : (
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-lg border border-white/10 py-3 text-sm text-slate-300 hover:bg-white/5"
        >
          Switch account
        </Link>
      )}
    </AuthLayout>
  )
}
