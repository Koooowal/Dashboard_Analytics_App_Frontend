import { Users, UserPlus, Activity, Award, TrendingUp } from 'lucide-react'
import type { UserStats } from '@/services/userService'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface UserStatsCardProps {
  stats: UserStats | undefined
  isLoading?: boolean
}

export function UserStatsCard({ stats, isLoading = false }: UserStatsCardProps) {
  const statItems = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'var(--color-primary)',
      format: 'number' as const,
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers ?? 0,
      icon: Activity,
      color: 'var(--color-success)',
      format: 'number' as const,
      subtitle: stats ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}% active` : undefined,
    },
    {
      label: 'New This Month',
      value: stats?.newUsersThisMonth ?? 0,
      icon: UserPlus,
      color: 'var(--color-warning)',
      format: 'number' as const,
    },
    {
      label: 'Avg Performance',
      value: stats?.avgPerformance ?? 0,
      icon: TrendingUp,
      color: 'var(--chart-5)',
      format: 'percentage' as const,
    },
    {
      label: 'Top Revenue',
      value: stats?.topPerformerRevenue ?? 0,
      icon: Award,
      color: '#f59e0b',
      format: 'currency' as const,
    },
  ]

  const formatValue = (value: number, format: 'number' | 'currency' | 'percentage') => {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      default:
        return formatCompact(value)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-[var(--bg-tertiary)]" />
              <div className="flex-1">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--bg-tertiary)]" />
                <div className="mt-2 h-6 w-16 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                }}
              >
                <Icon size={20} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">
                  {formatValue(item.value, item.format)}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-[var(--color-success)]">{item.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}







