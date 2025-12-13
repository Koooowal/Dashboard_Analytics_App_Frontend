import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface MetricCardProps {
  title: string
  value: number
  previousValue?: number
  change?: number
  format?: 'currency' | 'number' | 'percentage'
  icon: LucideIcon
  color: string
  isLoading?: boolean
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  change,
  format = 'number',
  icon: Icon,
  color,
  isLoading = false,
  subtitle,
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      default:
        return formatCompact(val)
    }
  }

  const isPositive = (change ?? 0) >= 0
  const isNeutral = change === 0

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown
  const trendColor = isNeutral
    ? 'text-[var(--text-muted)]'
    : isPositive
      ? 'text-[var(--color-success)]'
      : 'text-[var(--color-danger)]'

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-[var(--bg-tertiary)]" />
            <div className="h-10 w-10 rounded-lg bg-[var(--bg-tertiary)]" />
          </div>
          <div className="mt-4 h-8 w-32 rounded bg-[var(--bg-tertiary)]" />
          <div className="mt-3 h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
        {formatValue(value)}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={16} aria-hidden="true" />
            <span className="text-sm font-medium">
              {isPositive && !isNeutral ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
        <span className="text-sm text-[var(--text-muted)]">
          {subtitle || 'vs last period'}
        </span>
      </div>
    </div>
  )
})
