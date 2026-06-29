import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LoadingBar } from '../ui/LoadingBar'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-950 px-6">
        <LoadingBar label="Loading your session…" />
        <p className="text-sm text-slate-500">Restoring Savvy Universe session</p>
      </div>
    )
  }

  if (!user) {
    const redirectTo = location.pathname + location.search
    return <Navigate to="/login" replace state={{ from: redirectTo }} />
  }

  return children
}
