import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
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
      <Route element={<AppShell />}>
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
    </Routes>
  )
}
