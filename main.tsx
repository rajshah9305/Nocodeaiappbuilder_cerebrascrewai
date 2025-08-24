import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { EncryptionKeyProvider } from './src/contexts/EncryptionKeyContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <EncryptionKeyProvider>
        <App />
      </EncryptionKeyProvider>
    </ErrorBoundary>
  </StrictMode>,
)
