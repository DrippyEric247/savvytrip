import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isCoreProofHarnessEnabled } from '../../lib/auth/betaAccess'

type CoreProofRouteProps = {
  children: React.ReactNode
}

/** Keeps /dev/savvy-core-proof available in dev or when explicitly enabled for production. */
export function CoreProofRoute({ children }: CoreProofRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="p-8 text-slate-400">Loading session…</p>
  }

  if (!isCoreProofHarnessEnabled()) {
    return <Navigate to="/wallet" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/dev/savvy-core-proof' }} />
  }

  return children
}
