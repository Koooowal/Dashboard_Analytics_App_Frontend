import type { TimeFrame } from '@/types'
import { getGroupKey, getDateLabel } from './dateHelpers'

export interface GroupedData<T> {
  key: string
  label: string
  items: T[]
  totals: Record<string, number>
}

export function groupDataByTimeFrame<T extends { date: string }>(
  data: T[],
  timeFrame: TimeFrame,
  sumFields: (keyof T)[]
): GroupedData<T>[] {
  const groups = new Map<string, GroupedData<T>>()

  data.forEach((item) => {
    const date = new Date(item.date)
    const key = getGroupKey(date, timeFrame)
    const label = getDateLabel(date, timeFrame)

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label,
        items: [],
        totals: {},
      })
    }

    const group = groups.get(key)!
    group.items.push(item)

    sumFields.forEach((field) => {
      const value = item[field]
      if (typeof value === 'number') {
        group.totals[field as string] =
          (group.totals[field as string] || 0) + value
      }
    })
  })

  return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key))
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

export function calculatePercentile(
  values: number[],
  percentile: number
): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower)
}

export function getTopN<T>(
  items: T[],
  n: number,
  getValue: (item: T) => number
): T[] {
  return [...items].sort((a, b) => getValue(b) - getValue(a)).slice(0, n)
}

export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable'

  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))

  const firstAvg = calculateAverage(firstHalf)
  const secondAvg = calculateAverage(secondHalf)

  const change = calculateGrowth(secondAvg, firstAvg)

  if (change > 5) return 'up'
  if (change < -5) return 'down'
  return 'stable'
}

export function generateSparklineData(
  baseValue: number,
  points: number,
  volatility: number = 0.1
): number[] {
  const data: number[] = []
  let current = baseValue

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * baseValue
    current = Math.max(0, current + change)
    data.push(Number(current.toFixed(2)))
  }

  return data
}

export function interpolateColor(
  value: number,
  min: number,
  max: number,
  colors: [string, string, string] = ['#ef4444', '#f59e0b', '#22c55e']
): string {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))

  if (normalized <= 0.5) {
    return colors[0]
  } else if (normalized <= 0.75) {
    return colors[1]
  }
  return colors[2]
}

