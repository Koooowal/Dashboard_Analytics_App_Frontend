import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Users,
  ShoppingCart,
} from 'lucide-react'
import {
  DashboardHeader,
  FilterBar,
  KPICard,
  TrendAnalysisCard,
  GrowthIndicator,
} from '@/components/dashboard'
import {
  ChartCard,
  InteractiveAreaChart,
  InteractiveBarChart,
  InteractivePieChart,
} from '@/components/charts'
import {
  useRevenueData,
  useCategorySales,
  useSalesByHour,
  useSalesSummary,
  useSalesComparison,
  useTrendAnalysis,
  useGrowthMetrics,
  useSparklineData,
  useFilterSync,
} from '@/hooks'

export function Analytics() {
  useFilterSync()

  const { data: revenueData, isLoading: revenueLoading } = useRevenueData()
  const { data: categoryData, isLoading: categoryLoading } = useCategorySales()
  const { data: hourlyData, isLoading: hourlyLoading } = useSalesByHour()
  const { data: summary, isLoading: summaryLoading } = useSalesSummary()
  const { data: comparison } = useSalesComparison()
  const { data: trendData, isLoading: trendLoading } = useTrendAnalysis()
  const { data: growthMetrics, isLoading: growthLoading } = useGrowthMetrics()
  
  // Sparkline data for KPI cards
  const { data: revenueSparkline } = useSparklineData('revenue', 14)
  const { data: ordersSparkline } = useSparklineData('orders', 14)
  const { data: customersSparkline } = useSparklineData('customers', 14)
  const { data: conversionSparkline } = useSparklineData('conversion', 14)

  const kpis = [
    {
      title: 'Total Revenue',
      value: summary?.totalRevenue ?? 0,
      change: comparison?.changes.revenue ?? 0,
      format: 'currency' as const,
      icon: TrendingUp,
      color: 'var(--color-primary)',
      sparklineData: revenueSparkline ?? [],
    },
    {
      title: 'Total Orders',
      value: summary?.totalOrders ?? 0,
      change: comparison?.changes.orders ?? 0,
      format: 'number' as const,
      icon: ShoppingCart,
      color: 'var(--color-success)',
      sparklineData: ordersSparkline ?? [],
    },
    {
      title: 'Avg Order Value',
      value: summary?.avgOrderValue ?? 0,
      change: comparison?.changes.avgOrderValue ?? 0,
      format: 'currency' as const,
      icon: Target,
      color: 'var(--color-warning)',
      sparklineData: customersSparkline ?? [],
    },
    {
      title: 'Conversion Rate',
      value: summary?.conversionRate ?? 0,
      change: 3.2,
      format: 'percentage' as const,
      icon: Activity,
      color: 'var(--chart-5)',
      sparklineData: conversionSparkline ?? [],
    },
  ]

  const hourlyChartData =
    hourlyData?.map((h) => ({
      hour: h.label,
      revenue: h.revenue,
      orders: h.orders,
    })) ?? []

  const categoryBarData =
    categoryData?.map((c) => ({
      category: c.category,
      revenue: c.revenue,
      orders: c.orders,
    })) ?? []

  const pieData =
    categoryData?.map((cat) => ({
      name: cat.category,
      value: cat.revenue,
      color: cat.color,
    })) ?? []

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Analytics"
        subtitle="Detailed analytics, trends, and insights for your business."
      />

      <FilterBar showSearch={false} showCategories />

      {/* KPI Cards with Sparklines */}
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
            sparklineData={kpi.sparklineData}
            isLoading={summaryLoading}
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          subtitle="Revenue over the selected period with comparison"
          isLoading={revenueLoading}
        >
          <InteractiveAreaChart
            data={revenueData ?? []}
            areas={[
              { dataKey: 'revenue', name: 'Current', color: '#3b82f6' },
              { dataKey: 'previousRevenue', name: 'Previous', color: '#94a3b8' },
            ]}
            xAxisKey="label"
            height={300}
            currencyFormat
            showAverage
          />
        </ChartCard>

        <ChartCard
          title="Revenue by Category"
          subtitle="Compare revenue across all categories"
          isLoading={categoryLoading}
        >
          <InteractiveBarChart
            data={categoryBarData}
            bars={[
              { dataKey: 'revenue', name: 'Revenue', color: '#22c55e' },
              { dataKey: 'orders', name: 'Orders', color: '#8b5cf6' },
            ]}
            xAxisKey="category"
            height={300}
            highlightOnHover
          />
        </ChartCard>
      </div>

      {/* Trend Analysis & Growth Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrendAnalysisCard
            title="Weekly Revenue Trends"
            subtitle="Revenue performance comparison by week"
            data={trendData?.revenue ?? []}
            format="currency"
            isLoading={trendLoading}
          />
        </div>

        <GrowthIndicator
          title="Growth Metrics"
          metrics={
            growthMetrics?.map((m) => ({
              label: m.label,
              value: m.value,
              target: m.target,
              icon: m.label.includes('Revenue') 
                ? TrendingUp 
                : m.label.includes('Customer') 
                  ? Users 
                  : m.label.includes('Order') 
                    ? ShoppingCart 
                    : Zap,
            })) ?? []
          }
          isLoading={growthLoading}
        />
      </div>

      {/* Category Trends */}
      <div className="grid gap-6 xl:grid-cols-2">
        <TrendAnalysisCard
          title="Category Performance"
          subtitle="Revenue trends by product category"
          data={trendData?.categories ?? []}
          format="currency"
          isLoading={trendLoading}
        />

        <ChartCard
          title="Category Distribution"
          subtitle="Revenue share by category"
          isLoading={categoryLoading}
        >
          <InteractivePieChart
            data={pieData}
            height={300}
            donut
            currencyFormat
            totalLabel="Total Revenue"
          />
        </ChartCard>
      </div>

      {/* Hourly Analysis */}
      <ChartCard
        title="Hourly Sales Distribution"
        subtitle="Sales patterns throughout the day - identify peak hours"
        isLoading={hourlyLoading}
        className="w-full"
      >
        <InteractiveBarChart
          data={hourlyChartData}
          bars={[
            { dataKey: 'revenue', name: 'Revenue', color: '#8b5cf6' },
            { dataKey: 'orders', name: 'Orders', color: '#06b6d4' },
          ]}
          xAxisKey="hour"
          height={320}
          highlightOnHover
        />
      </ChartCard>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Avg Daily Revenue</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                ${((summary?.totalRevenue ?? 0) / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-green-500/10 to-green-600/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <ShoppingCart size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Avg Daily Orders</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {Math.round((summary?.totalOrders ?? 0) / 30)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <PieChart size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Top Category</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {summary?.topCategory ?? 'Electronics'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <Activity size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Peak Hour</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {hourlyData?.reduce((max, h) => h.revenue > max.revenue ? h : max, hourlyData[0])?.label ?? '14:00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
