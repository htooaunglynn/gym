import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react-router'
import { BrowserRouter } from 'react-router'

import App from './App.tsx'
import './index.css'

import { ThemeProvider } from './components/shared/ThemeProvider'

import { TooltipProvider } from '@/components/ui/tooltip'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider defaultTheme="system" storageKey="gym-ui-theme">
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
