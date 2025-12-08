import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from 'lucide-react'

const metrics = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'var(--color-primary)',
  },
  {
    title: 'Active Users',
    value: '2,350',
    change: '+15.2%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'var(--color-success)',
  },
  {
    title: 'Total Orders',
    value: '1,247',
    change: '-4.5%',
    changeType: 'decrease' as const,
    icon: ShoppingCart,
    color: 'var(--color-warning)',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '+8.3%',
    changeType: 'increase' as const,
    icon: Activity,
    color: 'var(--chart-5)',
  },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Welcome back! Here&apos;s an overview of your analytics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {metric.title}
              </p>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <metric.icon size={20} style={{ color: metric.color }} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
              {metric.value}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {metric.changeType === 'increase' ? (
                <TrendingUp size={16} className="text-[var(--color-success)]" />
              ) : (
                <TrendingDown
                  size={16}
                  className="text-[var(--color-danger)]"
                />
              )}
              <span
                className={`text-sm font-medium ${
                  metric.changeType === 'increase'
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-danger)]'
                }`}
              >
                {metric.change}
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Revenue Overview
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Monthly revenue trends
          </p>
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-muted)]">📊 Chart coming soon...</p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Sales by Category
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Distribution of sales across categories
          </p>
          <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-muted)]">🥧 Chart coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

