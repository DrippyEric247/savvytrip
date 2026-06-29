import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from './components/auth/GuestRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { AIGoPage } from './pages/AIGoPage'
import { AppsPage } from './pages/AppsPage'
import { AssistantPage } from './pages/AssistantPage'
import { CombosPage } from './pages/CombosPage'
import { DealsPage } from './pages/DealsPage'
import { EZStayPage } from './pages/EZStayPage'
import { FeedPage } from './pages/FeedPage'
import { Final10Page } from './pages/Final10Page'
import { HomePage } from './pages/HomePage'
import { RewardsPage } from './pages/RewardsPage'
import { RoutesPage } from './pages/RoutesPage'
import { SavedPage } from './pages/SavedPage'
import { SearchPage } from './pages/SearchPage'
import { TrendingPage } from './pages/TrendingPage'
import { WalletPage } from './pages/WalletPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="trending" element={<TrendingPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="combos" element={<CombosPage />} />
        <Route path="ezstay" element={<EZStayPage />} />
        <Route path="final10" element={<Final10Page />} />
        <Route path="aigo" element={<AIGoPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="assistant" element={<AssistantPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
