export interface DashboardMetric {
  id: string
  title: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  unit?: string
  prefix?: string
  format: 'number' | 'currency' | 'percentage'
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type Theme = 'light' | 'dark'

export interface FilterState {
  dateRange: DateRange
  timeFrame: TimeFrame
  categories: string[]
  searchQuery: string
}

export interface SalesData {
  id: string
  date: string
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
  category: string
}

export interface CategorySales {
  category: string
  revenue: number
  orders: number
  percentage: number
  color: string
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  previousRevenue?: number
  orders: number
  label: string
}

export interface UserData {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'manager' | 'sales' | 'support'
  department: string
  joinDate: string
  performance: UserPerformance
}

export interface UserPerformance {
  sales: number
  revenue: number
  conversionRate: number
  avgOrderValue: number
  target: number
  achieved: number
}

export interface ActivityItem {
  id: string
  type: 'sale' | 'user' | 'order' | 'alert'
  message: string
  timestamp: string
  value?: number
  user?: string
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  conversionRate: number
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface TopProduct {
  id: string
  name: string
  category: string
  revenue: number
  unitsSold: number
  growth: number
}
