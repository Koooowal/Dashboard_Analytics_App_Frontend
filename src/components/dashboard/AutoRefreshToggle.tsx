import { useState } from 'react'
import { Play, Pause, Settings, ChevronDown } from 'lucide-react'

interface AutoRefreshToggleProps {
  isEnabled: boolean
  interval: number
  onToggle: (enabled: boolean) => void
  onIntervalChange: (seconds: number) => void
}

const INTERVAL_OPTIONS = [
  { value: 10, label: '10 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 300, label: '5 minutes' },
]

export function AutoRefreshToggle({
  isEnabled,
  interval,
  onToggle,
  onIntervalChange,
}: AutoRefreshToggleProps) {
  const [showSettings, setShowSettings] = useState(false)

  const currentIntervalLabel = INTERVAL_OPTIONS.find(opt => opt.value === interval)?.label || `${interval}s`

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
          isEnabled
            ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]'
            : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
        }`}
      >
        {isEnabled ? (
          <>
            <Pause size={14} />
            <span className="hidden sm:inline">Auto-refresh On</span>
          </>
        ) : (
          <>
            <Play size={14} />
            <span className="hidden sm:inline">Auto-refresh Off</span>
          </>
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]"
        >
          <Settings size={14} />
          <span className="hidden sm:inline">{currentIntervalLabel}</span>
          <ChevronDown size={14} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {showSettings && (
          <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg">
            <div className="p-1">
              {INTERVAL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onIntervalChange(option.value)
                    setShowSettings(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    interval === option.value
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <span>{option.label}</span>
                  {interval === option.value && (
                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





