import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-danger)]/10">
            <AlertTriangle size={32} className="text-[var(--color-danger)]" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
          {this.state.error && (
            <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-[var(--bg-secondary)] p-3 text-left text-xs text-[var(--color-danger)]">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <Home size={16} />
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}






