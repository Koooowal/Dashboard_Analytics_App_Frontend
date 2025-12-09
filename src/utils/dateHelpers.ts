import type { DateRange, TimeFrame } from '@/types'

export const formatDate = (date: Date): string =>
  date.toISOString().split('T')[0]

export const parseDate = (dateStr: string): Date => new Date(dateStr)

export const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(startDate)
  current.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

export const getWeeksInRange = (startDate: Date, endDate: Date): Date[] => {
  const weeks: Date[] = []
  const current = new Date(startDate)
  current.setDate(current.getDate() - current.getDay())

  while (current <= endDate) {
    weeks.push(new Date(current))
    current.setDate(current.getDate() + 7)
  }
  return weeks
}

export const getMonthsInRange = (startDate: Date, endDate: Date): Date[] => {
  const months: Date[] = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

  while (current <= endDate) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }
  return months
}

export const getDateRangePresets = (): Record<string, DateRange> => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return {
    today: {
      startDate: today,
      endDate: today,
    },
    yesterday: {
      startDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
    },
    last7Days: {
      startDate: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    last30Days: {
      startDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    last90Days: {
      startDate: new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000),
      endDate: today,
    },
    thisMonth: {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: today,
    },
    lastMonth: {
      startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      endDate: new Date(now.getFullYear(), now.getMonth(), 0),
    },
    thisYear: {
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: today,
    },
  }
}

export const getDateLabel = (date: Date, timeFrame: TimeFrame): string => {
  switch (timeFrame) {
    case 'daily':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    case 'weekly':
      return `Week ${getWeekNumber(date)}`
    case 'monthly':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      })
    case 'yearly':
      return date.getFullYear().toString()
  }
}

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const getGroupKey = (date: Date, timeFrame: TimeFrame): string => {
  switch (timeFrame) {
    case 'daily':
      return formatDate(date)
    case 'weekly': {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return formatDate(weekStart)
    }
    case 'monthly':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    case 'yearly':
      return date.getFullYear().toString()
  }
}

export const getPreviousPeriod = (dateRange: DateRange): DateRange => {
  const duration = dateRange.endDate.getTime() - dateRange.startDate.getTime()
  return {
    startDate: new Date(
      dateRange.startDate.getTime() - duration - 24 * 60 * 60 * 1000
    ),
    endDate: new Date(dateRange.startDate.getTime() - 24 * 60 * 60 * 1000),
  }
}

export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

