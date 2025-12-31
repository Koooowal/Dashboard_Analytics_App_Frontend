import { useState } from 'react'
import { DollarSign, ShoppingCart, Users, Activity } from 'lucide-react'
import {
  ChartCard,
  InteractiveAreaChart,
  InteractivePieChart,
  InteractiveBarChart,
} from '@/components/charts'
import {
  DashboardHeader,
  FilterBar,
  MetricCard,
  TopProductsTable,
  TopPerformers,
  ActivityFeed,
  LiveIndicator,
  AutoRefreshToggle,
} from '@/components/dashboard'
import {
  useDashboardStats,
  useRevenueData,
  useCategorySales,
  useFilterSync,
  useTopProducts,
  useTopPerformers,
  useRealTimeData,
} from '@/hooks'
import { useRealtimeStore } from '@/store'

export function Dashboard() {
  useFilterSync()
  const { refreshData } = useRealTimeData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    isAutoRefreshEnabled,
    refreshInterval,
    lastUpdated,
    events,
    setAutoRefresh,
    setRefreshInterval,
  } = useRealtimeStore()

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const {
    data: revenueData,
    isLoading: revenueLoading,
    refetch: refetchRevenue,
  } = useRevenueData()
  const {
    data: categoryData,
    isLoading: categoryLoading,
    refetch: refetchCategory,
  } = useCategorySales()
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(5)
  const { data: topPerformers, isLoading: performersLoading } =
    useTopPerformers(5)

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    refreshData()
    await Promise.all([refetchRevenue(), refetchCategory()])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ?? 0,
      change: stats?.revenueGrowth ?? 0,
      format: 'currency' as const,
      icon: DollarSign,
      color: 'var(--color-primary)',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      change: stats?.ordersGrowth ?? 0,
      format: 'number' as const,
      icon: ShoppingCart,
      color: 'var(--color-success)',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      change: stats?.customersGrowth ?? 0,
      format: 'number' as const,
      icon: Users,
      color: 'var(--color-warning)',
    },
    {
      title: 'Conversion Rate',
      value: stats?.conversionRate ?? 0,
      change: 2.4,
      format: 'percentage' as const,
      icon: Activity,
      color: 'var(--chart-5)',
    },
  ]

  const pieData =
    categoryData?.map((cat) => ({
      name: cat.category,
      value: cat.revenue,
      color: cat.color,
    })) ?? []

  const ordersData =
    revenueData?.map((d) => ({
      label: d.label,
      orders: d.orders,
      revenue: d.revenue,
    })) ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardHeader
          title="Dashboard"
          subtitle="Welcome back! Here's an overview of your analytics."
        />
        
        <div className="flex flex-col gap-3 sm:items-end">
          <AutoRefreshToggle
            isEnabled={isAutoRefreshEnabled}
            interval={refreshInterval}
            onToggle={setAutoRefresh}
            onIntervalChange={setRefreshInterval}
          />
          <LiveIndicator
            lastUpdated={lastUpdated}
            isAutoRefreshEnabled={isAutoRefreshEnabled}
            refreshInterval={refreshInterval}
            onRefresh={handleManualRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      <FilterBar showSearch={false} showCategories />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            format={metric.format}
            icon={metric.icon}
            color={metric.color}
            isLoading={statsLoading}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Overview"
          subtitle="Daily revenue for the selected period"
          isLoading={revenueLoading}
          onRefresh={() => refetchRevenue()}
        >
          <InteractiveAreaChart
            data={(revenueData ?? []) as unknown as { [key: string]: string | number }[]}
            areas={[{ dataKey: 'revenue', name: 'Revenue', color: '#3b82f6' }]}
            xAxisKey="label"
            height={320}
            currencyFormat
            showAverage
          />
        </ChartCard>

        <ChartCard
          title="Sales by Category"
          subtitle="Revenue distribution across categories"
          isLoading={categoryLoading}
          onRefresh={() => refetchCategory()}
        >
          <InteractivePieChart
            data={pieData}
            height={360}
            donut
            currencyFormat
            totalLabel="Total Revenue"
          />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="Orders Trend"
            subtitle="Orders and revenue over time"
            isLoading={revenueLoading}
          >
            <InteractiveBarChart
              data={ordersData}
              bars={[{ dataKey: 'orders', name: 'Orders', color: '#22c55e' }]}
              xAxisKey="label"
              height={320}
              highlightOnHover
            />
          </ChartCard>
        </div>

        <ActivityFeed
          events={events}
          maxItems={8}
          showAnimation={isAutoRefreshEnabled}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TopProductsTable
          products={topProducts ?? []}
          isLoading={productsLoading}
        />
        <TopPerformers
          performers={topPerformers ?? []}
          isLoading={performersLoading}
        />
      </div>
    </div>
  )
}
