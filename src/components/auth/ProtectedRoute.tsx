import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-300">
        <p className="text-sm">Loading your session…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
