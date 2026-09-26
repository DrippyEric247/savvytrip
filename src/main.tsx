import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { AuthProvider } from './context/AuthContext'
import { SavvyCoreProvider } from './context/SavvyCoreContext'
import { TripSearchProvider } from './context/TripSearchContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavvyCoreProvider>
          <TripSearchProvider>
            <App />
          </TripSearchProvider>
        </SavvyCoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
