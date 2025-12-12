import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { SparklineChart } from '@/components/charts/SparklineChart'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface TrendData {
  label: string
  current: number
  previous: number
  change: number
  sparkline: number[]
}

interface TrendAnalysisCardProps {
  title: string
  subtitle?: string
  data: TrendData[]
  format?: 'currency' | 'number' | 'percentage'
  isLoading?: boolean
}

export function TrendAnalysisCard({
  title,
  subtitle,
  data,
  format = 'number',
  isLoading = false,
}: TrendAnalysisCardProps) {
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

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-color)] px-6 py-5">
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-10 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--bg-tertiary)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--border-color)] px-6 py-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {data.map((item, index) => {
          const trend = item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'neutral'
          const TrendIcon = trend === 'neutral' ? Minus : trend === 'up' ? TrendingUp : TrendingDown
          const trendColor = trend === 'neutral'
            ? 'text-[var(--text-muted)]'
            : trend === 'up'
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-danger)]'

          return (
            <div
              key={index}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-secondary)]"
            >
              <div className="min-w-[100px]">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {item.label}
                </p>
              </div>

              <div className="w-24 flex-shrink-0">
                <SparklineChart 
                  data={item.sparkline} 
                  trend={trend}
                  height={32}
                />
              </div>

              <div className="flex flex-1 items-center justify-end gap-4">
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">Previous</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {formatValue(item.previous)}
                  </p>
                </div>

                <ArrowRight size={14} className="text-[var(--text-muted)]" />

                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">Current</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {formatValue(item.current)}
                  </p>
                </div>

                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon size={14} />
                  <span className="text-sm font-medium">
                    {trend === 'up' ? '+' : ''}{item.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

