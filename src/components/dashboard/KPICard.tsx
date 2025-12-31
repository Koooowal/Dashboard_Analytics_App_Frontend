import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { SparklineChart } from '@/components/charts/SparklineChart'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface KPICardProps {
  title: string
  value: number
  change?: number
  format?: 'currency' | 'number' | 'percentage'
  icon?: LucideIcon
  color?: string
  sparklineData?: number[]
  subtitle?: string
  isLoading?: boolean
  comparison?: {
    label: string
    value: number
    change: number
  }
}

export function KPICard({
  title,
  value,
  change,
  format = 'number',
  icon: Icon,
  color = 'var(--color-primary)',
  sparklineData = [],
  subtitle,
  isLoading = false,
  comparison,
}: KPICardProps) {
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

  const trend = change === undefined 
    ? undefined 
    : change > 0 
      ? 'up' 
      : change < 0 
        ? 'down' 
        : 'neutral'

  const TrendIcon = trend === 'neutral' || !trend ? Minus : trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = trend === 'neutral' || !trend
    ? 'text-[var(--text-muted)]'
    : trend === 'up'
      ? 'text-[var(--color-success)]'
      : 'text-[var(--color-danger)]'

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)]">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-[var(--bg-tertiary)]" />
            <div className="h-8 w-8 rounded-lg bg-[var(--bg-tertiary)]" />
          </div>
          <div className="h-8 w-28 rounded bg-[var(--bg-tertiary)]" />
          <div className="h-10 w-full rounded bg-[var(--bg-tertiary)]" />
          <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
        {Icon && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
            style={{
              backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
            }}
          >
            <Icon size={16} style={{ color }} />
          </div>
        )}
      </div>

      <p className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
        {formatValue(value)}
      </p>

      {sparklineData.length > 0 && (
        <div className="mt-3">
          <SparklineChart 
            data={sparklineData} 
            color={color}
            trend={trend}
            height={40}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={14} />
            <span className="text-sm font-medium">
              {trend === 'up' ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        )}
        <span className="text-xs text-[var(--text-muted)]">
          {subtitle || 'vs last period'}
        </span>
      </div>

      {comparison && (
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-color)] pt-3">
          <span className="text-xs text-[var(--text-muted)]">{comparison.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {formatValue(comparison.value)}
            </span>
            <span className={`text-xs ${comparison.change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {comparison.change >= 0 ? '+' : ''}{comparison.change.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}








