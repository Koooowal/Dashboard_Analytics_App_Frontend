import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Target,
  ShoppingCart,
  BarChart3,
  Award,
} from 'lucide-react'
import {
  DashboardHeader,
  FilterBar,
  KPICard,
  SalesTable,
  TopProductsTable,
  GrowthIndicator,
} from '@/components/dashboard'
import {
  ChartCard,
  InteractiveAreaChart,
  InteractivePieChart,
  InteractiveBarChart,
} from '@/components/charts'
import { ExportButton } from '@/components/ui'
import type { ExportFormat } from '@/components/ui'
import {
  useSalesData,
  useSalesSummary,
  useSalesComparison,
  useRevenueByTimeFrame,
  useCategorySalesData,
  useTopProductsData,
  useGrowthMetrics,
  useSparklineData,
  useFilterSync,
} from '@/hooks'
import { formatCurrency, formatCompact, exportToCSV } from '@/utils'

export function Sales() {
  useFilterSync()

  const handleExport = (format: ExportFormat) => {
    if (format === 'csv' && salesData) {
      exportToCSV(
        salesData as unknown as Record<string, unknown>[],
        [
          { key: 'date', header: 'Date' },
          { key: 'category', header: 'Category' },
          { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
          { key: 'orders', header: 'Orders' },
          { key: 'avgOrderValue', header: 'Avg Order Value', format: (v) => formatCurrency(v as number) },
        ],
        'sales-data'
      )
    }
  }

  const { data: salesData, isLoading: salesLoading } = useSalesData()
  const { data: summary, isLoading: summaryLoading } = useSalesSummary()
  const { data: comparison } = useSalesComparison()
  const { data: revenueData, isLoading: revenueLoading } = useRevenueByTimeFrame()
  const { data: categoryData, isLoading: categoryLoading } = useCategorySalesData()
  const { data: topProducts, isLoading: productsLoading } = useTopProductsData(10)
  const { data: growthMetrics, isLoading: growthLoading } = useGrowthMetrics()

  const { data: revenueSparkline } = useSparklineData('revenue', 14)
  const { data: ordersSparkline } = useSparklineData('orders', 14)
  const { data: aovSparkline } = useSparklineData('aov', 14)
  const { data: conversionSparkline } = useSparklineData('conversion', 14)

  const kpis = [
    {
      title: 'Total Revenue',
      value: summary?.totalRevenue ?? 0,
      change: comparison?.changes.revenue ?? 0,
      format: 'currency' as const,
      icon: DollarSign,
      color: 'var(--color-primary)',
      sparklineData: revenueSparkline ?? [],
      comparison: {
        label: 'Previous Period',
        value: comparison?.previous.totalRevenue ?? 0,
        change: comparison?.changes.revenue ?? 0,
      },
    },
    {
      title: 'Total Orders',
      value: summary?.totalOrders ?? 0,
      change: comparison?.changes.orders ?? 0,
      format: 'number' as const,
      icon: ShoppingCart,
      color: 'var(--color-success)',
      sparklineData: ordersSparkline ?? [],
      comparison: {
        label: 'Previous Period',
        value: comparison?.previous.totalOrders ?? 0,
        change: comparison?.changes.orders ?? 0,
      },
    },
    {
      title: 'Avg Order Value',
      value: summary?.avgOrderValue ?? 0,
      change: comparison?.changes.avgOrderValue ?? 0,
      format: 'currency' as const,
      icon: Target,
      color: 'var(--color-warning)',
      sparklineData: aovSparkline ?? [],
      comparison: {
        label: 'Previous Period',
        value: comparison?.previous.avgOrderValue ?? 0,
        change: comparison?.changes.avgOrderValue ?? 0,
      },
    },
    {
      title: 'Conversion Rate',
      value: summary?.conversionRate ?? 0,
      change: 2.8,
      format: 'percentage' as const,
      icon: Users,
      color: 'var(--chart-5)',
      sparklineData: conversionSparkline ?? [],
    },
  ]

  const pieData =
    categoryData?.map((cat) => ({
      name: cat.category,
      value: cat.revenue,
      color: cat.color,
    })) ?? []

  const categoryBarData =
    categoryData?.map((c) => ({
      category: c.category,
      revenue: c.revenue,
      orders: c.orders,
    })) ?? []

  const totalTransactions = salesData?.length ?? 0
  const avgRevenue = totalTransactions > 0 
    ? (salesData?.reduce((sum, s) => sum + s.revenue, 0) ?? 0) / totalTransactions 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardHeader
          title="Sales"
          subtitle="Track and manage your sales performance with detailed insights."
        />
        <ExportButton onExport={handleExport} formats={['csv']} />
      </div>

      <FilterBar showSearch={false} showCategories />

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
            comparison={kpi.comparison}
            isLoading={summaryLoading}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Over Time"
          subtitle="Track revenue trends with period comparison"
          isLoading={revenueLoading}
        >
          <InteractiveAreaChart
            data={(revenueData ?? []) as unknown as { [key: string]: string | number }[]}
            areas={[
              { dataKey: 'revenue', name: 'Current', color: '#3b82f6' },
              { dataKey: 'previousRevenue', name: 'Previous', color: '#94a3b8' },
            ]}
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
        >
          <InteractivePieChart
            data={pieData}
            height={360}
            donut
            currencyFormat
            totalLabel="Total Sales"
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Category Performance Breakdown"
        subtitle="Compare revenue and orders by category"
        isLoading={categoryLoading}
      >
        <InteractiveBarChart
          data={categoryBarData}
          bars={[
            { dataKey: 'revenue', name: 'Revenue', color: '#3b82f6' },
            { dataKey: 'orders', name: 'Orders', color: '#22c55e' },
          ]}
          xAxisKey="category"
          height={280}
          highlightOnHover
        />
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesTable data={salesData ?? []} isLoading={salesLoading} />
        </div>

        <div className="space-y-6">
          <TopProductsTable 
            products={topProducts?.slice(0, 5) ?? []} 
            isLoading={productsLoading} 
          />
          
          <GrowthIndicator
            title="Performance Indicators"
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
                      ? Package
                      : Target,
              })) ?? []
            }
            isLoading={growthLoading}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Total Transactions
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {formatCompact(totalTransactions)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20">
              <BarChart3 size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">+12.5%</span>
            <span className="text-[var(--text-muted)]">vs last period</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-green-500/10 to-green-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Avg Transaction
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(avgRevenue)}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20">
              <DollarSign size={24} className="text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm">
            <TrendingUp size={14} className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">+8.3%</span>
            <span className="text-[var(--text-muted)]">vs last period</span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Top Category
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {summary?.topCategory ?? 'Electronics'}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20">
              <Award size={24} className="text-amber-500" />
            </div>
          </div>
          <div className="mt-3 text-sm text-[var(--text-muted)]">
            {categoryData?.[0]?.percentage.toFixed(1) ?? '25'}% of total revenue
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Revenue Growth
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {summary?.revenueGrowth?.toFixed(1) ?? '15.2'}%
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20">
              {(summary?.revenueGrowth ?? 0) >= 0 ? (
                <TrendingUp size={24} className="text-purple-500" />
              ) : (
                <TrendingDown size={24} className="text-purple-500" />
              )}
            </div>
          </div>
          <div className="mt-3 text-sm text-[var(--text-muted)]">
            Month over month growth
          </div>
        </div>
      </div>
    </div>
  )
}
