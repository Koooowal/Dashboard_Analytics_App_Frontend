import type { UserData } from '@/types'
import { generateUsers } from './mockData'
import { getTopN, generateSparklineData } from '@/utils/dataHelpers'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  avgPerformance: number
  topPerformerRevenue: number
}

export interface UserRanking {
  user: UserData
  rank: number
  percentile: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: number[]
}

export interface TeamPerformance {
  department: string
  totalRevenue: number
  avgRevenue: number
  memberCount: number
  targetAchievement: number
  topPerformer: string
}

export interface PerformanceComparison {
  userId: string
  userName: string
  metrics: {
    name: string
    value: number
    teamAvg: number
    percentile: number
  }[]
}

export const userService = {
  async getUsers(): Promise<UserData[]> {
    await delay(300)
    return generateUsers(20)
  },

  async getUserById(userId: string): Promise<UserData | null> {
    await delay(200)
    const users = generateUsers(20)
    return users.find((u) => u.id === userId) || null
  },

  async getUserStats(): Promise<UserStats> {
    await delay(250)
    const users = generateUsers(20)
    const performances = users.map(
      (u) => u.performance.achieved / u.performance.target
    )

    return {
      totalUsers: users.length,
      activeUsers: Math.floor(users.length * 0.85),
      newUsersThisMonth: Math.floor(users.length * 0.15),
      avgPerformance: Number(
        (
          (performances.reduce((a, b) => a + b, 0) / performances.length) *
          100
        ).toFixed(1)
      ),
      topPerformerRevenue: Math.max(...users.map((u) => u.performance.revenue)),
    }
  },

  async getTopPerformers(limit = 5): Promise<UserRanking[]> {
    await delay(300)
    const users = generateUsers(20)
    const sorted = [...users].sort(
      (a, b) => b.performance.revenue - a.performance.revenue
    )

    return sorted.slice(0, limit).map((user, index) => ({
      user,
      rank: index + 1,
      percentile: Number(((1 - index / users.length) * 100).toFixed(0)),
      trend:
        Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down',
      sparklineData: generateSparklineData(
        user.performance.revenue / 30,
        14,
        0.15
      ),
    }))
  },

  async getUserRankings(): Promise<UserRanking[]> {
    await delay(350)
    const users = generateUsers(20)
    const sorted = [...users].sort(
      (a, b) => b.performance.revenue - a.performance.revenue
    )

    return sorted.map((user, index) => ({
      user,
      rank: index + 1,
      percentile: Number(((1 - index / users.length) * 100).toFixed(0)),
      trend:
        Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down',
      sparklineData: generateSparklineData(
        user.performance.revenue / 30,
        14,
        0.15
      ),
    }))
  },

  async getTeamPerformance(): Promise<TeamPerformance[]> {
    await delay(350)
    const users = generateUsers(20)
    const departments = new Map<string, UserData[]>()

    users.forEach((user) => {
      const dept = user.department
      if (!departments.has(dept)) {
        departments.set(dept, [])
      }
      departments.get(dept)!.push(user)
    })

    return Array.from(departments.entries())
      .map(([department, members]) => {
        const totalRevenue = members.reduce(
          (sum, m) => sum + m.performance.revenue,
          0
        )
        const totalTarget = members.reduce(
          (sum, m) => sum + m.performance.target,
          0
        )
        const totalAchieved = members.reduce(
          (sum, m) => sum + m.performance.achieved,
          0
        )
        const topPerformer = getTopN(
          members,
          1,
          (m) => m.performance.revenue
        )[0]

        return {
          department,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          avgRevenue: Number((totalRevenue / members.length).toFixed(2)),
          memberCount: members.length,
          targetAchievement: Number(
            ((totalAchieved / totalTarget) * 100).toFixed(1)
          ),
          topPerformer: topPerformer?.name || 'N/A',
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  },

  async compareUsers(userIds: string[]): Promise<PerformanceComparison[]> {
    await delay(400)
    const users = generateUsers(20)
    const selectedUsers = users.filter((u) => userIds.includes(u.id))

    if (selectedUsers.length === 0) {
      const defaultUsers = users.slice(0, Math.min(userIds.length, 5))
      selectedUsers.push(...defaultUsers)
    }

    const allPerformances = users.map((u) => u.performance)
    const avgRevenue =
      allPerformances.reduce((sum, p) => sum + p.revenue, 0) / users.length
    const avgSales =
      allPerformances.reduce((sum, p) => sum + p.sales, 0) / users.length
    const avgConversion =
      allPerformances.reduce((sum, p) => sum + p.conversionRate, 0) /
      users.length
    const avgOrderValue =
      allPerformances.reduce((sum, p) => sum + p.avgOrderValue, 0) /
      users.length

    const getPercentile = (value: number, allValues: number[]): number => {
      const sorted = [...allValues].sort((a, b) => a - b)
      const index = sorted.findIndex((v) => v >= value)
      return Number(((index / sorted.length) * 100).toFixed(0))
    }

    return selectedUsers.map((user) => ({
      userId: user.id,
      userName: user.name,
      metrics: [
        {
          name: 'Revenue',
          value: user.performance.revenue,
          teamAvg: Number(avgRevenue.toFixed(2)),
          percentile: getPercentile(
            user.performance.revenue,
            allPerformances.map((p) => p.revenue)
          ),
        },
        {
          name: 'Sales',
          value: user.performance.sales,
          teamAvg: Number(avgSales.toFixed(0)),
          percentile: getPercentile(
            user.performance.sales,
            allPerformances.map((p) => p.sales)
          ),
        },
        {
          name: 'Conversion Rate',
          value: user.performance.conversionRate,
          teamAvg: Number(avgConversion.toFixed(2)),
          percentile: getPercentile(
            user.performance.conversionRate,
            allPerformances.map((p) => p.conversionRate)
          ),
        },
        {
          name: 'Avg Order Value',
          value: user.performance.avgOrderValue,
          teamAvg: Number(avgOrderValue.toFixed(2)),
          percentile: getPercentile(
            user.performance.avgOrderValue,
            allPerformances.map((p) => p.avgOrderValue)
          ),
        },
      ],
    }))
  },

  async getPerformanceTrends(
    userId: string,
    days = 30
  ): Promise<{ date: string; revenue: number }[]> {
    await delay(300)
    void userId
    const data: { date: string; revenue: number }[] = []
    const baseRevenue = 1000 + Math.random() * 2000

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const trend = 1 + ((days - i) / days) * 0.2
      const variance = (Math.random() - 0.5) * 0.3
      const revenue = baseRevenue * trend * (1 + variance)

      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Number(revenue.toFixed(2)),
      })
    }

    return data
  },
}
