import type {
  SalesData,
  CategorySales,
  RevenueDataPoint,
  UserData,
  DashboardStats,
  ActivityItem,
  TopProduct,
  DateRange,
  TimeFrame,
} from '@/types'
import {
  getGroupKey,
  getDateLabel,
  getDaysInRange,
  formatDate,
} from '@/utils/dateHelpers'

export const CATEGORIES = [
  { name: 'Electronics', color: '#3b82f6' },
  { name: 'Clothing', color: '#22c55e' },
  { name: 'Home & Garden', color: '#f59e0b' },
  { name: 'Sports', color: '#ef4444' },
  { name: 'Books', color: '#8b5cf6' },
  { name: 'Food & Beverages', color: '#06b6d4' },
]

const FIRST_NAMES = [
  'James',
  'Emma',
  'Michael',
  'Olivia',
  'William',
  'Ava',
  'Alexander',
  'Sophia',
  'Daniel',
  'Isabella',
  'David',
  'Mia',
  'Joseph',
  'Charlotte',
  'Andrew',
  'Emily',
  'Robert',
  'Madison',
  'John',
  'Elizabeth',
]

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Wilson',
  'Anderson',
  'Taylor',
  'Thomas',
  'Moore',
  'Jackson',
  'White',
  'Harris',
  'Clark',
  'Lewis',
]

const PRODUCTS = [
  { name: 'Wireless Headphones Pro', category: 'Electronics', basePrice: 199 },
  { name: 'Smart Watch Series X', category: 'Electronics', basePrice: 349 },
  { name: 'Laptop Stand Ergonomic', category: 'Electronics', basePrice: 79 },
  { name: 'Mechanical Keyboard RGB', category: 'Electronics', basePrice: 149 },
  { name: 'USB-C Hub 7-in-1', category: 'Electronics', basePrice: 59 },
  { name: 'Running Shoes Elite', category: 'Sports', basePrice: 129 },
  { name: 'Yoga Mat Premium', category: 'Sports', basePrice: 45 },
  { name: 'Fitness Tracker Band', category: 'Sports', basePrice: 89 },
  { name: 'Winter Jacket Insulated', category: 'Clothing', basePrice: 189 },
  { name: 'Casual Sneakers', category: 'Clothing', basePrice: 79 },
  { name: 'Smart Home Hub', category: 'Home & Garden', basePrice: 129 },
  { name: 'LED Desk Lamp', category: 'Home & Garden', basePrice: 49 },
  { name: 'Bestseller Novel Collection', category: 'Books', basePrice: 24 },
  { name: 'Cookbook Masterclass', category: 'Books', basePrice: 35 },
  { name: 'Organic Coffee Beans', category: 'Food & Beverages', basePrice: 18 },
]

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomFloat = (min: number, max: number, decimals = 2): number =>
  Number((Math.random() * (max - min) + min).toFixed(decimals))

const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

const generateId = (): string => Math.random().toString(36).substring(2, 11)

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const getDayOfWeekMultiplier = (date: Date): number => {
  const day = date.getDay()
  const multipliers = [0.6, 0.9, 1.0, 1.0, 1.1, 1.3, 0.8]
  return multipliers[day]
}

const getSeasonMultiplier = (date: Date): number => {
  const month = date.getMonth()
  const multipliers = [
    0.8, 0.85, 0.9, 1.0, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1, 1.3, 1.4,
  ]
  return multipliers[month]
}

export const generateSalesData = (dateRange: DateRange): SalesData[] => {
  const days = getDaysInRange(dateRange.startDate, dateRange.endDate)
  const sales: SalesData[] = []

  days.forEach((date, dayIndex) => {
    const dayMultiplier = getDayOfWeekMultiplier(date)
    const seasonMultiplier = getSeasonMultiplier(date)
    const trendMultiplier = 1 + (dayIndex / days.length) * 0.1
    const baseOrders = random(15, 40)
    const ordersToday = Math.floor(
      baseOrders * dayMultiplier * seasonMultiplier * trendMultiplier
    )

    for (let i = 0; i < ordersToday; i++) {
      const category = randomFromArray(CATEGORIES)
      const baseRevenue = randomFloat(30, 300)
      const revenue = baseRevenue * seasonMultiplier

      sales.push({
        id: generateId(),
        date: formatDate(date),
        revenue: Number(revenue.toFixed(2)),
        orders: 1,
        customers: random(1, 1),
        avgOrderValue: Number(revenue.toFixed(2)),
        category: category.name,
      })
    }
  })

  return sales
}

export const generateRevenueData = (
  dateRange: DateRange,
  timeFrame: TimeFrame
): RevenueDataPoint[] => {
  const sales = generateSalesData(dateRange)
  const grouped = new Map<string, RevenueDataPoint>()

  sales.forEach((sale) => {
    const date = new Date(sale.date)
    const key = getGroupKey(date, timeFrame)
    const label = getDateLabel(date, timeFrame)

    if (!grouped.has(key)) {
      grouped.set(key, {
        date: key,
        label,
        revenue: 0,
        orders: 0,
        previousRevenue: 0,
      })
    }

    const point = grouped.get(key)!
    point.revenue += sale.revenue
    point.orders += sale.orders
  })

  const result = Array.from(grouped.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point, index, arr) => {
      const prevIndex = Math.max(0, index - 1)
      const basePrev = arr[prevIndex]?.revenue || point.revenue
      point.previousRevenue = Number(
        (basePrev * randomFloat(0.85, 1.0)).toFixed(2)
      )
      point.revenue = Number(point.revenue.toFixed(2))
      return point
    })

  return result
}

export const generateCategorySales = (
  dateRange?: DateRange
): CategorySales[] => {
  const range = dateRange || {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }

  const sales = generateSalesData(range)
  const categoryTotals = new Map<string, { revenue: number; orders: number }>()

  CATEGORIES.forEach((cat) => {
    categoryTotals.set(cat.name, { revenue: 0, orders: 0 })
  })

  sales.forEach((sale) => {
    const cat = categoryTotals.get(sale.category)
    if (cat) {
      cat.revenue += sale.revenue
      cat.orders += sale.orders
    }
  })

  const totalRevenue = Array.from(categoryTotals.values()).reduce(
    (sum, cat) => sum + cat.revenue,
    0
  )

  return CATEGORIES.map((cat) => {
    const data = categoryTotals.get(cat.name)!
    return {
      category: cat.name,
      revenue: Number(data.revenue.toFixed(2)),
      orders: data.orders,
      percentage: Number(((data.revenue / totalRevenue) * 100).toFixed(1)),
      color: cat.color,
    }
  }).sort((a, b) => b.revenue - a.revenue)
}

export const generateUsers = (count = 20): UserData[] => {
  const roles: UserData['role'][] = ['admin', 'manager', 'sales', 'support']
  const departments = ['Sales', 'Marketing', 'Support', 'Operations', 'Finance']

  return Array.from({ length: count }, (_, i) => {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    const seed = i + 1
    const performanceMultiplier = 0.5 + seededRandom(seed) * 1.0
    const target = random(50000, 120000)
    const achieved = Math.floor(target * performanceMultiplier)

    return {
      id: generateId(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      role: roles[i % roles.length],
      department: randomFromArray(departments),
      joinDate: new Date(
        Date.now() - random(30, 1095) * 24 * 60 * 60 * 1000
      ).toISOString(),
      performance: {
        sales: random(15, 200),
        revenue: randomFloat(8000, 95000),
        conversionRate: randomFloat(1.5, 9.5),
        avgOrderValue: randomFloat(45, 250),
        target,
        achieved,
      },
    }
  })
}

export const generateDashboardStats = (
  dateRange?: DateRange
): DashboardStats => {
  const range = dateRange || {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }

  const sales = generateSalesData(range)
  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0)
  const totalOrders = sales.length
  const uniqueCustomers = new Set(sales.map(() => generateId())).size

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    totalCustomers: Math.floor(uniqueCustomers * 0.7),
    avgOrderValue: Number((totalRevenue / totalOrders).toFixed(2)),
    revenueGrowth: randomFloat(5, 28),
    ordersGrowth: randomFloat(2, 22),
    customersGrowth: randomFloat(3, 18),
    conversionRate: randomFloat(2.5, 5.5),
  }
}

export const generateActivity = (count = 15): ActivityItem[] => {
  const types: ActivityItem['type'][] = ['sale', 'user', 'order', 'alert']
  const messages = {
    sale: [
      'New sale completed',
      'Large order received',
      'Subscription renewed',
      'Premium plan purchased',
      'Bulk order placed',
    ],
    user: [
      'New user registered',
      'User upgraded plan',
      'Profile updated',
      'Password changed',
      'Two-factor enabled',
    ],
    order: [
      'Order shipped',
      'Order delivered',
      'Refund processed',
      'Order cancelled',
      'Return requested',
    ],
    alert: [
      'Low stock warning',
      'Payment failed',
      'High traffic detected',
      'New review: 5 stars',
      'Goal achieved',
    ],
  }

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length]
    const minutesAgo = random(1, 300)
    const firstName = randomFromArray(FIRST_NAMES)
    const lastName = randomFromArray(LAST_NAMES)

    return {
      id: generateId(),
      type,
      message: randomFromArray(messages[type]),
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      value: type === 'sale' ? randomFloat(50, 800) : undefined,
      user: type !== 'alert' ? `${firstName} ${lastName}` : undefined,
    }
  }).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export const generateTopProducts = (count = 10): TopProduct[] => {
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5)

  return shuffled
    .slice(0, count)
    .map((product) => {
      const unitsSold = random(50, 800)
      const revenue = unitsSold * product.basePrice * randomFloat(0.8, 1.2)

      return {
        id: generateId(),
        name: product.name,
        category: product.category,
        revenue: Number(revenue.toFixed(2)),
        unitsSold,
        growth: randomFloat(-15, 45),
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
}

export const CATEGORY_LIST = CATEGORIES.map((c) => c.name)
