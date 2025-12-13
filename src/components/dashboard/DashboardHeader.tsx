import { RefreshCw } from 'lucide-react'
import { DateRangePicker } from '@/components/ui'
import { useFilterStore } from '@/store'
import { useQueryClient } from '@tanstack/react-query'
import type { TimeFrame } from '@/types'

const TIME_FRAMES: { value: TimeFrame; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { dateRange, setDateRange, timeFrame, setTimeFrame } = useFilterStore()
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    queryClient.invalidateQueries()
  }

  return (
    <header
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      role="banner"
    >
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>

      <nav className="flex flex-wrap items-center gap-3" aria-label="Dashboard controls">
        <div
          className="inline-flex gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-1"
          role="tablist"
          aria-label="Time frame selection"
        >
          {TIME_FRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeFrame(tf.value)}
              role="tab"
              aria-selected={timeFrame === tf.value}
              aria-controls="dashboard-content"
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1 ${
                timeFrame === tf.value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <button
          onClick={handleRefresh}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5 text-[var(--text-muted)] transition-colors hover:border-[var(--border-color-hover)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-1"
          aria-label="Refresh data"
        >
          <RefreshCw size={16} aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
