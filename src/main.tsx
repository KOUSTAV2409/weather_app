import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

const appErrorFallback = (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
    <h1 className="text-lg font-medium">Something went wrong</h1>
    <p className="max-w-md text-center text-sm text-muted-foreground">
      The app hit an unexpected error. Reload the page to try again.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
    >
      Reload
    </button>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={appErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
