import type {
  DateRange,
  TimeFrame,
  DashboardStats,
  RevenueDataPoint,
  CategorySales,
  UserData,
  ActivityItem,
  TopProduct,
} from '@/types'
import {
  generateDashboardStats,
  generateRevenueData,
  generateCategorySales,
  generateUsers,
  generateActivity,
  generateTopProducts,
} from './mockData'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const dashboardService = {
  async getStats(
    _dateRange?: DateRange,
    categories?: string[]
  ): Promise<DashboardStats> {
    await delay(300)
    const stats = generateDashboardStats()

    if (categories && categories.length > 0) {
      const categoryMultiplier = categories.length / 6
      return {
        ...stats,
        totalRevenue: Math.round(stats.totalRevenue * categoryMultiplier),
        totalOrders: Math.round(stats.totalOrders * categoryMultiplier),
      }
    }

    return stats
  },

  async getRevenueData(
    dateRange: DateRange,
    timeFrame: TimeFrame,
    categories?: string[]
  ): Promise<RevenueDataPoint[]> {
    await delay(400)
    const data = generateRevenueData(dateRange, timeFrame)

    if (categories && categories.length > 0 && categories.length < 6) {
      const multiplier = categories.length / 6
      return data.map((d) => ({
        ...d,
        revenue: Math.round(d.revenue * multiplier),
        orders: Math.round(d.orders * multiplier),
      }))
    }

    return data
  },

  async getCategorySales(
    _dateRange?: DateRange,
    categories?: string[]
  ): Promise<CategorySales[]> {
    await delay(350)
    const allCategories = generateCategorySales()

    if (categories && categories.length > 0) {
      return allCategories.filter((cat) => categories.includes(cat.category))
    }

    return allCategories
  },

  async getUsers(): Promise<UserData[]> {
    await delay(300)
    return generateUsers(15)
  },

  async getTopUsers(limit = 5): Promise<UserData[]> {
    await delay(250)
    const users = generateUsers(15)
    return users
      .sort((a, b) => b.performance.revenue - a.performance.revenue)
      .slice(0, limit)
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    await delay(200)
    return generateActivity(limit)
  },

  async getTopProducts(
    limit = 5,
    _dateRange?: DateRange,
    categories?: string[]
  ): Promise<TopProduct[]> {
    await delay(300)
    let products = generateTopProducts(20)

    if (categories && categories.length > 0) {
      products = products.filter((p) => categories.includes(p.category))
    }

    return products.slice(0, limit)
  },
}
