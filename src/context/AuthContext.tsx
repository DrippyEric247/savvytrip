import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getMe,
  loginUser,
  registerUser,
  setAuthToken,
  STORAGE_KEY,
  type AuthUser,
  type RegisterPayload,
} from '../lib/auth/api'
import { userSafeErrorMessage } from '../lib/auth/apiErrorParsing'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  completeSocialLogin: (token: string) => Promise<AuthUser>
  logout: () => void
  refreshProfile: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setLoading(false)
      return
    }

    setToken(stored)
    setAuthToken(stored)
    getMe()
      .then((profile) => setUser(profile))
      .catch(() => {
        setAuthToken(null)
        setToken(null)
        setUser(null)
        setError('Session expired. Please sign in again.')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setError('')
    try {
      const profile = await loginUser(credentials)
      setToken(localStorage.getItem(STORAGE_KEY))
      setUser(profile)
      return profile
    } catch (err) {
      const message = userSafeErrorMessage(err, 'Login failed. Please try again.')
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    setError('')
    try {
      const profile = await registerUser(payload)
      setToken(localStorage.getItem(STORAGE_KEY))
      setUser(profile)
      return profile
    } catch (err) {
      const message = userSafeErrorMessage(err, 'Registration failed. Please try again.')
      setError(message)
      throw err
    }
  }, [])

  const completeSocialLogin = useCallback(async (jwt: string) => {
    setError('')
    setAuthToken(jwt)
    setToken(jwt)
    try {
      const profile = await getMe()
      setUser(profile)
      return profile
    } catch (err) {
      setAuthToken(null)
      setToken(null)
      setUser(null)
      const message = userSafeErrorMessage(err, 'Social sign-in failed. Please try again.')
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
    setError('')
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMe()
      setUser(profile)
      return profile
    } catch {
      return null
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      completeSocialLogin,
      logout,
      refreshProfile,
    }),
    [user, token, loading, error, login, register, completeSocialLogin, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
