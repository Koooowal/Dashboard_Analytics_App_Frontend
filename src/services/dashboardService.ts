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
  async getStats(): Promise<DashboardStats> {
    await delay(300)
    return generateDashboardStats()
  },

  async getRevenueData(
    dateRange: DateRange,
    timeFrame: TimeFrame
  ): Promise<RevenueDataPoint[]> {
    await delay(400)
    return generateRevenueData(dateRange, timeFrame)
  },

  async getCategorySales(): Promise<CategorySales[]> {
    await delay(350)
    return generateCategorySales()
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

  async getTopProducts(limit = 5): Promise<TopProduct[]> {
    await delay(300)
    return generateTopProducts(limit)
  },
}

