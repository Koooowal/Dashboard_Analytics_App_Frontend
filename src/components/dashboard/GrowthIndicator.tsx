import { TrendingUp, TrendingDown, Target, Zap, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface GrowthMetric {
  label: string
  value: number
  target?: number
  icon?: LucideIcon
  color?: string
}

interface GrowthIndicatorProps {
  title: string
  metrics: GrowthMetric[]
  isLoading?: boolean
}

export function GrowthIndicator({
  title,
  metrics,
  isLoading = false,
}: GrowthIndicatorProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
        <div className="h-5 w-32 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-6 w-16 animate-pulse rounded bg-[var(--bg-tertiary)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const defaultIcons: LucideIcon[] = [Target, Zap, Award, TrendingUp]

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h3>

      <div className="mt-6 space-y-5">
        {metrics.map((metric, index) => {
          const isPositive = metric.value >= 0
          const Icon = metric.icon || defaultIcons[index % defaultIcons.length]
          const color = metric.color || (isPositive ? 'var(--color-success)' : 'var(--color-danger)')
          const progress = metric.target 
            ? Math.min(100, (Math.abs(metric.value) / metric.target) * 100)
            : null

          return (
            <div key={index}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                    }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {metric.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp size={14} className="text-[var(--color-success)]" />
                  ) : (
                    <TrendingDown size={14} className="text-[var(--color-danger)]" />
                  )}
                  <span 
                    className="text-lg font-bold"
                    style={{ color }}
                  >
                    {isPositive ? '+' : ''}{metric.value.toFixed(1)}%
                  </span>
                </div>
              </div>

              {progress !== null && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>Progress to target</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}








