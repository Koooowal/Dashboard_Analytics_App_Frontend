import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Grid,
  List,
  Mail,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  DashboardHeader,
  Leaderboard,
  UserStatsCard,
  TeamPerformanceCard,
} from '@/components/dashboard'
import { ChartCard, InteractiveBarChart, InteractiveAreaChart } from '@/components/charts'
import {
  useAllUsers,
  useUserStats,
  useUserRankings,
  useTeamPerformance,
  usePerformanceTrends,
} from '@/hooks'
import { formatCurrency } from '@/utils/formatters'

type ViewMode = 'grid' | 'list'
type FilterRole = 'all' | 'admin' | 'manager' | 'sales' | 'support'

export function Users() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { data: users, isLoading: usersLoading } = useAllUsers()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: rankings, isLoading: rankingsLoading } = useUserRankings()
  const { data: teamPerformance, isLoading: teamLoading } = useTeamPerformance()
  const { data: performanceTrends } = usePerformanceTrends(selectedUserId || '', 30)

  const filteredUsers = useMemo(() => {
    if (!users) return []
    let filtered = [...users]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    return filtered
  }, [users, searchQuery, roleFilter])

  const activityByRole = useMemo(() => {
    if (!users) return []
    const roleData = new Map<string, { revenue: number; sales: number }>()

    users.forEach((user) => {
      const existing = roleData.get(user.role) || { revenue: 0, sales: 0 }
      roleData.set(user.role, {
        revenue: existing.revenue + user.performance.revenue,
        sales: existing.sales + user.performance.sales,
      })
    })

    return Array.from(roleData.entries()).map(([role, data]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      revenue: data.revenue,
      sales: data.sales,
    }))
  }, [users])

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Users"
        subtitle="Manage team members, track activity, and analyze performance."
      />

      <UserStatsCard stats={stats} isLoading={statsLoading} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
              className="h-10 appearance-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-8 text-sm text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Grid size={16} />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usersLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-[var(--bg-tertiary)]" />
                        <div className="flex-1">
                          <div className="h-4 w-24 rounded bg-[var(--bg-tertiary)]" />
                          <div className="mt-2 h-3 w-16 rounded bg-[var(--bg-tertiary)]" />
                        </div>
                      </div>
                    </div>
                  ))
                : filteredUsers.map((user) => {
                    const performance =
                      (user.performance.achieved / user.performance.target) * 100
                    const isAboveTarget = performance >= 100

                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`cursor-pointer rounded-xl border bg-[var(--bg-primary)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] ${
                          selectedUserId === user.id
                            ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                            : 'border-[var(--border-color)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-12 w-12 rounded-full bg-[var(--bg-tertiary)]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-[var(--text-primary)]">
                              {user.name}
                            </p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {user.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 text-sm">
                          <span className="text-[var(--text-muted)]">Revenue</span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {formatCurrency(user.performance.revenue)}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--text-muted)]">Target</span>
                            <span
                              className={
                                isAboveTarget
                                  ? 'text-[var(--color-success)]'
                                  : 'text-[var(--color-warning)]'
                              }
                            >
                              {performance.toFixed(0)}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                            <div
                              className="h-full transition-all rounded-full"
                              style={{
                                width: `${Math.min(100, performance)}%`,
                                backgroundColor: isAboveTarget
                                  ? 'var(--color-success)'
                                  : 'var(--color-warning)',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
              <div className="divide-y divide-[var(--border-color)]">
                {usersLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-[var(--bg-tertiary)]" />
                        <div className="flex-1">
                          <div className="h-4 w-32 rounded bg-[var(--bg-tertiary)]" />
                          <div className="mt-1 h-3 w-24 rounded bg-[var(--bg-tertiary)]" />
                        </div>
                      </div>
                    ))
                  : filteredUsers.map((user) => {
                      const isPositive = user.performance.achieved >= user.performance.target

                      return (
                        <div
                          key={user.id}
                          onClick={() => setSelectedUserId(user.id)}
                          className={`flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-secondary)] ${
                            selectedUserId === user.id ? 'bg-[var(--bg-secondary)]' : ''
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full bg-[var(--bg-tertiary)]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-[var(--text-primary)]">
                              {user.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                              <span>{user.department}</span>
                              <span>•</span>
                              <span>{user.role}</span>
                            </div>
                          </div>
                          <div className="items-center hidden gap-6 sm:flex">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                              <Mail size={14} />
                              <span className="max-w-[150px] truncate">{user.email}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[var(--text-primary)]">
                                {formatCurrency(user.performance.revenue)}
                              </p>
                              <div
                                className={`flex items-center justify-end gap-1 text-xs ${
                                  isPositive
                                    ? 'text-[var(--color-success)]'
                                    : 'text-[var(--color-danger)]'
                                }`}
                              >
                                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                <span>
                                  {((user.performance.achieved / user.performance.target) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </div>
            </div>
          )}
        </div>

        <Leaderboard
          rankings={rankings ?? []}
          isLoading={rankingsLoading}
          maxItems={8}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Activity by Role"
          subtitle="Revenue and sales distribution across roles"
          isLoading={usersLoading}
        >
          <InteractiveBarChart
            data={activityByRole}
            bars={[
              { dataKey: 'revenue', name: 'Revenue', color: '#3b82f6' },
              { dataKey: 'sales', name: 'Sales', color: '#22c55e' },
            ]}
            xAxisKey="role"
            height={300}
            highlightOnHover
          />
        </ChartCard>

        {selectedUserId && performanceTrends ? (
          <ChartCard
            title="Selected User Trends"
            subtitle="Daily performance over the last 30 days"
          >
            <InteractiveAreaChart
              data={performanceTrends.map((d) => ({
                ...d,
                label: new Date(d.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
              }))}
              areas={[{ dataKey: 'revenue', name: 'Revenue', color: '#8b5cf6' }]}
              xAxisKey="label"
              height={300}
              currencyFormat
              showAverage
            />
          </ChartCard>
        ) : (
          <TeamPerformanceCard teams={teamPerformance ?? []} isLoading={teamLoading} />
        )}
      </div>
    </div>
  )
}
