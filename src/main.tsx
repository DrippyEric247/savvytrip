import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { AuthProvider } from './context/AuthContext'
import { TripSearchProvider } from './context/TripSearchContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TripSearchProvider>
          <App />
        </TripSearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
