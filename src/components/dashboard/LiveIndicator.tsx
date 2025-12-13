import { RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react'

interface LiveIndicatorProps {
  lastUpdated: Date | null
  isAutoRefreshEnabled: boolean
  refreshInterval: number
  onRefresh: () => void
  isRefreshing?: boolean
}

const formatLastUpdated = (date: Date | null) => {
  if (!date) return 'Never'
  
  const now = new Date()
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffSeconds < 5) return 'Just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function LiveIndicator({
  lastUpdated,
  isAutoRefreshEnabled,
  refreshInterval,
  onRefresh,
  isRefreshing = false,
}: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5">
        {isAutoRefreshEnabled ? (
          <>
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
              <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
            </div>
            <span className="text-xs font-medium text-[var(--color-success)]">LIVE</span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-[var(--text-muted)]" />
            <span className="text-xs font-medium text-[var(--text-muted)]">PAUSED</span>
          </>
        )}
      </div>

      <div className="hidden items-center gap-1.5 text-xs text-[var(--text-muted)] sm:flex">
        <Clock size={12} />
        <span>Updated {formatLastUpdated(lastUpdated)}</span>
      </div>

      {isAutoRefreshEnabled && (
        <div className="hidden items-center gap-1.5 text-xs text-[var(--text-muted)] md:flex">
          <Wifi size={12} />
          <span>Every {refreshInterval}s</span>
        </div>
      )}

      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        title="Refresh now"
      >
        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  )
}

