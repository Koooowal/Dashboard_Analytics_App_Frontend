import { useState, useMemo } from 'react'
import {
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react'
import {
  DashboardHeader,
  Leaderboard,
  UserComparisonTable,
  TeamPerformanceCard,
  KPICard,
} from '@/components/dashboard'
import {
  ChartCard,
  InteractiveBarChart,
  InteractivePieChart,
} from '@/components/charts'
import {
  useAllUsers,
  useUserStats,
  useUserRankings,
  useTeamPerformance,
  useCompareUsers,
} from '@/hooks'
import { formatCurrency, formatCompact } from '@/utils/formatters'

export function Performance() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const { data: users, isLoading: usersLoading } = useAllUsers()
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: rankings, isLoading: rankingsLoading } = useUserRankings()
  const { data: teamPerformance, isLoading: teamLoading } = useTeamPerformance()
  const { data: comparisons, isLoading: comparisonsLoading } = useCompareUsers(selectedUserIds)

  useMemo(() => {
    if (users && users.length > 0 && selectedUserIds.length === 0) {
      setSelectedUserIds(users.slice(0, 3).map((u) => u.id))
    }
  }, [users])
  const comparisonChartData = useMemo(() => {
    if (!comparisons || comparisons.length === 0) return []

    return comparisons.map((comp) => ({
      name: comp.userName.split(' ')[0],
      revenue: comp.metrics.find((m) => m.name === 'Revenue')?.value ?? 0,
      sales: comp.metrics.find((m) => m.name === 'Sales')?.value ?? 0,
      conversion: comp.metrics.find((m) => m.name === 'Conversion Rate')?.value ?? 0,
    }))
  }, [comparisons])

  const teamDistribution = useMemo(() => {
    if (!teamPerformance) return []
    return teamPerformance.map((team, index) => ({
      name: team.department,
      value: team.totalRevenue,
      color: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'][index % 5],
    }))
  }, [teamPerformance])

  const kpis = [
    {
      title: 'Team Avg Performance',
      value: stats?.avgPerformance ?? 0,
      change: 5.2,
      format: 'percentage' as const,
      icon: Target,
      color: 'var(--color-primary)',
    },
    {
      title: 'Top Performer Revenue',
      value: stats?.topPerformerRevenue ?? 0,
      change: 12.8,
      format: 'currency' as const,
      icon: Award,
      color: '#f59e0b',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers ?? 0,
      change: 8.5,
      format: 'number' as const,
      icon: Users,
      color: 'var(--color-success)',
    },
    {
      title: 'Conversion Avg',
      value: 4.2,
      change: 3.1,
      format: 'percentage' as const,
      icon: Zap,
      color: 'var(--chart-5)',
    },
  ]

  const performanceMetrics = useMemo(() => {
    if (!users) return []
    return users.slice(0, 8).map((user) => ({
      name: user.name.split(' ')[0],
      target: user.performance.target,
      achieved: user.performance.achieved,
      revenue: user.performance.revenue,
    }))
  }, [users])

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Performance"
        subtitle="Monitor team performance, compare metrics, and track progress."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            format={kpi.format}
            icon={kpi.icon}
            color={kpi.color}
            isLoading={statsLoading}
          />
        ))}
      </div>

      <UserComparisonTable
        comparisons={comparisons ?? []}
        allUsers={users ?? []}
        selectedUserIds={selectedUserIds}
        onSelectionChange={setSelectedUserIds}
        isLoading={usersLoading || comparisonsLoading}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="User Performance Comparison"
          subtitle="Revenue and sales comparison for selected users"
          isLoading={comparisonsLoading}
        >
          <InteractiveBarChart
            data={comparisonChartData}
            bars={[
              { dataKey: 'revenue', name: 'Revenue', color: '#3b82f6' },
              { dataKey: 'sales', name: 'Sales', color: '#22c55e' },
            ]}
            xAxisKey="name"
            height={320}
            highlightOnHover
          />
        </ChartCard>

        <ChartCard
          title="Team Revenue Distribution"
          subtitle="Revenue breakdown by department"
          isLoading={teamLoading}
        >
          <InteractivePieChart
            data={teamDistribution}
            height={360}
            donut
            currencyFormat
            totalLabel="Total Revenue"
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Target vs Achievement"
        subtitle="Individual performance against targets"
        isLoading={usersLoading}
      >
        <InteractiveBarChart
          data={performanceMetrics}
          bars={[
            { dataKey: 'target', name: 'Target', color: '#94a3b8' },
            { dataKey: 'achieved', name: 'Achieved', color: '#22c55e' },
          ]}
          xAxisKey="name"
          height={320}
          highlightOnHover
        />
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <Leaderboard
          rankings={rankings ?? []}
          isLoading={rankingsLoading}
          maxItems={10}
          showSparkline
        />

        <TeamPerformanceCard teams={teamPerformance ?? []} isLoading={teamLoading} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Total Team Members
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {formatCompact(stats?.totalUsers ?? 0)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20">
              <Users size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">+{stats?.newUsersThisMonth ?? 0}</span>
            <span className="text-[var(--text-muted)]">new this month</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-green-500/10 to-green-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Avg Achievement Rate
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {stats?.avgPerformance?.toFixed(1) ?? 0}%
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20">
              <Target size={24} className="text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">+3.2%</span>
            <span className="text-[var(--text-muted)]">vs last quarter</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Top Departments
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {teamPerformance?.[0]?.department ?? 'Sales'}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20">
              <Award size={24} className="text-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-sm text-[var(--text-muted)]">
            {formatCurrency(teamPerformance?.[0]?.totalRevenue ?? 0)} total revenue
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Above Target
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {users
                  ? users.filter((u) => u.performance.achieved >= u.performance.target).length
                  : 0}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20">
              <BarChart3 size={24} className="text-purple-500" />
            </div>
          </div>
          <div className="mt-3 text-sm text-[var(--text-muted)]">
            of {stats?.totalUsers ?? 0} team members
          </div>
        </div>
      </div>
    </div>
  )
}
