import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DarkModeProvider } from './context/DarkModeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </AuthProvider>
  </StrictMode>,
)
