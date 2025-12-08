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

const CATEGORIES = [
  { name: 'Electronics', color: 'var(--chart-1)' },
  { name: 'Clothing', color: 'var(--chart-2)' },
  { name: 'Home & Garden', color: 'var(--chart-3)' },
  { name: 'Sports', color: 'var(--chart-4)' },
  { name: 'Books', color: 'var(--chart-5)' },
  { name: 'Food & Beverages', color: 'var(--chart-6)' },
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
]

const PRODUCTS = [
  'Wireless Headphones',
  'Smart Watch',
  'Laptop Stand',
  'Mechanical Keyboard',
  'USB-C Hub',
  'Monitor Light Bar',
  'Ergonomic Mouse',
  'Webcam HD',
  'Portable SSD',
  'Phone Charger',
]

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomFloat = (min: number, max: number, decimals = 2): number =>
  Number((Math.random() * (max - min) + min).toFixed(decimals))

const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

const generateId = (): string => Math.random().toString(36).substring(2, 11)

const formatDate = (date: Date): string => date.toISOString().split('T')[0]

const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(startDate)
  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export const generateSalesData = (dateRange: DateRange): SalesData[] => {
  const days = getDaysInRange(dateRange.startDate, dateRange.endDate)

  return days.flatMap((date) => {
    const salesPerDay = random(3, 8)
    return Array.from({ length: salesPerDay }, () => ({
      id: generateId(),
      date: formatDate(date),
      revenue: randomFloat(50, 500),
      orders: random(1, 5),
      customers: random(1, 3),
      avgOrderValue: randomFloat(30, 150),
      category: randomFromArray(CATEGORIES).name,
    }))
  })
}

export const generateRevenueData = (
  dateRange: DateRange,
  timeFrame: TimeFrame
): RevenueDataPoint[] => {
  const days = getDaysInRange(dateRange.startDate, dateRange.endDate)
  const dataMap = new Map<string, RevenueDataPoint>()

  days.forEach((date) => {
    let key: string
    let label: string

    switch (timeFrame) {
      case 'daily':
        key = formatDate(date)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        break
      case 'weekly': {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = formatDate(weekStart)
        label = `Week ${Math.ceil(date.getDate() / 7)}`
        break
      }
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        })
        break
      case 'yearly':
        key = String(date.getFullYear())
        label = String(date.getFullYear())
        break
    }

    if (!dataMap.has(key)) {
      dataMap.set(key, {
        date: key,
        label,
        revenue: 0,
        previousRevenue: 0,
        orders: 0,
      })
    }

    const existing = dataMap.get(key)!
    existing.revenue += randomFloat(500, 2000)
    existing.previousRevenue = existing.revenue * randomFloat(0.7, 1.1)
    existing.orders += random(5, 20)
  })

  return Array.from(dataMap.values())
}

export const generateCategorySales = (): CategorySales[] => {
  const sales = CATEGORIES.map((cat) => ({
    category: cat.name,
    revenue: randomFloat(5000, 30000),
    orders: random(50, 300),
    percentage: 0,
    color: cat.color,
  }))

  const total = sales.reduce((sum, s) => sum + s.revenue, 0)
  sales.forEach((s) => {
    s.percentage = Number(((s.revenue / total) * 100).toFixed(1))
  })

  return sales.sort((a, b) => b.revenue - a.revenue)
}

export const generateUsers = (count = 15): UserData[] => {
  const roles: UserData['role'][] = ['admin', 'manager', 'sales', 'support']
  const departments = ['Sales', 'Marketing', 'Support', 'Operations']

  return Array.from({ length: count }, (_, i) => {
    const firstName = randomFromArray(FIRST_NAMES)
    const lastName = randomFromArray(LAST_NAMES)
    const target = random(50000, 100000)
    const achieved = randomFloat(target * 0.6, target * 1.2)

    return {
      id: generateId(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
      role: randomFromArray(roles),
      department: randomFromArray(departments),
      joinDate: new Date(
        Date.now() - random(30, 730) * 24 * 60 * 60 * 1000
      ).toISOString(),
      performance: {
        sales: random(20, 150),
        revenue: randomFloat(10000, 80000),
        conversionRate: randomFloat(2, 8),
        avgOrderValue: randomFloat(50, 200),
        target,
        achieved,
      },
    }
  })
}

export const generateDashboardStats = (): DashboardStats => {
  const totalRevenue = randomFloat(100000, 500000)
  const totalOrders = random(1000, 5000)
  const totalCustomers = random(500, 2000)

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    avgOrderValue: Number((totalRevenue / totalOrders).toFixed(2)),
    revenueGrowth: randomFloat(-5, 25),
    ordersGrowth: randomFloat(-5, 20),
    customersGrowth: randomFloat(0, 15),
    conversionRate: randomFloat(2, 6),
  }
}

export const generateActivity = (count = 10): ActivityItem[] => {
  const types: ActivityItem['type'][] = ['sale', 'user', 'order', 'alert']
  const messages = {
    sale: [
      'New sale completed',
      'Large order received',
      'Subscription renewed',
    ],
    user: ['New user registered', 'User upgraded plan', 'User profile updated'],
    order: [
      'Order shipped',
      'Order delivered',
      'Order returned',
      'Order cancelled',
    ],
    alert: [
      'Low stock warning',
      'Payment failed',
      'Server high load',
      'New review received',
    ],
  }

  return Array.from({ length: count }, () => {
    const type = randomFromArray(types)
    const minutesAgo = random(1, 180)

    return {
      id: generateId(),
      type,
      message: randomFromArray(messages[type]),
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      value: type === 'sale' ? randomFloat(50, 500) : undefined,
      user:
        type !== 'alert'
          ? `${randomFromArray(FIRST_NAMES)} ${randomFromArray(LAST_NAMES)}`
          : undefined,
    }
  }).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export const generateTopProducts = (count = 5): TopProduct[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    name: randomFromArray(PRODUCTS),
    category: randomFromArray(CATEGORIES).name,
    revenue: randomFloat(5000, 50000),
    unitsSold: random(50, 500),
    growth: randomFloat(-10, 30),
  })).sort((a, b) => b.revenue - a.revenue)
}

export const CATEGORY_LIST = CATEGORIES.map((c) => c.name)
