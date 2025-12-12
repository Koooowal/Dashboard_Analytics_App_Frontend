import type {
  DateRange,
  TimeFrame,
  SalesData,
  CategorySales,
  RevenueDataPoint,
  TopProduct,
} from '@/types'
import {
  generateSalesData,
  generateRevenueData,
  generateCategorySales,
  generateTopProducts,
  CATEGORIES,
} from './mockData'
import { groupDataByTimeFrame, calculateGrowth } from '@/utils/dataHelpers'
import { getPreviousPeriod } from '@/utils/dateHelpers'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface SalesSummary {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  topCategory: string
  conversionRate: number
}

export interface SalesComparison {
  current: SalesSummary
  previous: SalesSummary
  changes: {
    revenue: number
    orders: number
    avgOrderValue: number
  }
}

export interface SalesByHour {
  hour: number
  label: string
  revenue: number
  orders: number
}

export const salesService = {
  async getSalesData(dateRange: DateRange): Promise<SalesData[]> {
    await delay(350)
    return generateSalesData(dateRange)
  },

  async getRevenueByTimeFrame(
    dateRange: DateRange,
    timeFrame: TimeFrame
  ): Promise<RevenueDataPoint[]> {
    await delay(400)
    return generateRevenueData(dateRange, timeFrame)
  },

  async getCategorySales(dateRange: DateRange): Promise<CategorySales[]> {
    await delay(300)
    return generateCategorySales(dateRange)
  },

  async getTopProducts(
    dateRange: DateRange,
    limit = 10
  ): Promise<TopProduct[]> {
    await delay(350)
    void dateRange
    return generateTopProducts(limit)
  },

  async getSalesSummary(dateRange: DateRange): Promise<SalesSummary> {
    await delay(300)
    const sales = generateSalesData(dateRange)
    const categorySales = generateCategorySales(dateRange)

    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0)
    const totalOrders = sales.length

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number((totalRevenue / totalOrders).toFixed(2)),
      revenueGrowth: Number((Math.random() * 30 - 5).toFixed(1)),
      ordersGrowth: Number((Math.random() * 25 - 5).toFixed(1)),
      topCategory: categorySales[0]?.category || 'Electronics',
      conversionRate: Number((Math.random() * 4 + 2).toFixed(2)),
    }
  },

  async getSalesComparison(dateRange: DateRange): Promise<SalesComparison> {
    await delay(450)
    const previousRange = getPreviousPeriod(dateRange)

    const currentSales = generateSalesData(dateRange)
    const previousSales = generateSalesData(previousRange)

    const currentRevenue = currentSales.reduce((sum, s) => sum + s.revenue, 0)
    const previousRevenue = previousSales.reduce((sum, s) => sum + s.revenue, 0)
    const currentOrders = currentSales.length
    const previousOrders = previousSales.length

    const current: SalesSummary = {
      totalRevenue: Number(currentRevenue.toFixed(2)),
      totalOrders: currentOrders,
      avgOrderValue: Number((currentRevenue / currentOrders).toFixed(2)),
      revenueGrowth: calculateGrowth(currentRevenue, previousRevenue),
      ordersGrowth: calculateGrowth(currentOrders, previousOrders),
      topCategory: 'Electronics',
      conversionRate: Number((Math.random() * 4 + 2).toFixed(2)),
    }

    const previous: SalesSummary = {
      totalRevenue: Number(previousRevenue.toFixed(2)),
      totalOrders: previousOrders,
      avgOrderValue: Number((previousRevenue / previousOrders).toFixed(2)),
      revenueGrowth: 0,
      ordersGrowth: 0,
      topCategory: 'Electronics',
      conversionRate: Number((Math.random() * 4 + 2).toFixed(2)),
    }

    return {
      current,
      previous,
      changes: {
        revenue: calculateGrowth(currentRevenue, previousRevenue),
        orders: calculateGrowth(currentOrders, previousOrders),
        avgOrderValue: calculateGrowth(
          current.avgOrderValue,
          previous.avgOrderValue
        ),
      },
    }
  },

  async getSalesByHour(): Promise<SalesByHour[]> {
    await delay(300)
    return Array.from({ length: 24 }, (_, hour) => {
      const peakMultiplier =
        hour >= 9 && hour <= 11
          ? 1.5
          : hour >= 14 && hour <= 16
            ? 1.3
            : hour >= 19 && hour <= 21
              ? 1.4
              : hour >= 0 && hour <= 5
                ? 0.3
                : 1.0

      const baseOrders = Math.floor(20 * peakMultiplier + Math.random() * 15)
      const avgOrderValue = 50 + Math.random() * 100

      return {
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
        revenue: Number((baseOrders * avgOrderValue).toFixed(2)),
        orders: baseOrders,
      }
    })
  },

  async getSalesGrouped(
    dateRange: DateRange,
    timeFrame: TimeFrame
  ): Promise<ReturnType<typeof groupDataByTimeFrame<SalesData>>> {
    await delay(400)
    const sales = generateSalesData(dateRange)
    return groupDataByTimeFrame(sales, timeFrame, [
      'revenue',
      'orders',
      'customers',
    ])
  },

  getCategories() {
    return CATEGORIES
  },

  async getTrendAnalysis(dateRange: DateRange): Promise<{
    revenue: { label: string; current: number; previous: number; change: number; sparkline: number[] }[]
    categories: { label: string; current: number; previous: number; change: number; sparkline: number[] }[]
  }> {
    await delay(400)
    
    const revenueTrends = ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(label => {
      const current = 15000 + Math.random() * 25000
      const previous = 12000 + Math.random() * 20000
      return {
        label,
        current: Number(current.toFixed(2)),
        previous: Number(previous.toFixed(2)),
        change: Number(((current - previous) / previous * 100).toFixed(1)),
        sparkline: Array.from({ length: 7 }, () => Math.random() * 5000 + 2000),
      }
    })

    const categoryTrends = CATEGORIES.slice(0, 4).map(cat => {
      const current = 8000 + Math.random() * 15000
      const previous = 6000 + Math.random() * 12000
      return {
        label: cat.name,
        current: Number(current.toFixed(2)),
        previous: Number(previous.toFixed(2)),
        change: Number(((current - previous) / previous * 100).toFixed(1)),
        sparkline: Array.from({ length: 7 }, () => Math.random() * 3000 + 1000),
      }
    })

    void dateRange
    return { revenue: revenueTrends, categories: categoryTrends }
  },

  async getGrowthMetrics(): Promise<{
    label: string
    value: number
    target: number
  }[]> {
    await delay(300)
    return [
      { label: 'Revenue Growth', value: 12.5 + Math.random() * 10, target: 25 },
      { label: 'Customer Acquisition', value: 8.3 + Math.random() * 8, target: 20 },
      { label: 'Order Volume', value: 15.2 + Math.random() * 12, target: 30 },
      { label: 'Avg Order Value', value: -2.5 + Math.random() * 10, target: 15 },
    ]
  },

  async getSparklineData(metric: string, days = 14): Promise<number[]> {
    await delay(200)
    void metric
    const base = 1000 + Math.random() * 5000
    return Array.from({ length: days }, (_, i) => {
      const trend = 1 + (i / days) * 0.2
      return Number((base * trend * (0.8 + Math.random() * 0.4)).toFixed(2))
    })
  },
}
