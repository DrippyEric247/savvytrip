import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type GuestRouteProps = {
  children: React.ReactNode
}

/** Redirect signed-in users away from login/register screens. */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-300">
        <p className="text-sm">Loading…</p>
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  return children
}
