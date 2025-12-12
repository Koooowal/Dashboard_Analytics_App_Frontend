import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from 'recharts'

interface SparklineChartProps {
  data: number[]
  color?: string
  height?: number
  showGradient?: boolean
  trend?: 'up' | 'down' | 'neutral'
}

export function SparklineChart({
  data,
  color = '#3b82f6',
  height = 40,
  showGradient = true,
  trend,
}: SparklineChartProps) {
  const chartData = useMemo(() => 
    data.map((value, index) => ({ value, index })),
    [data]
  )

  const actualColor = trend 
    ? trend === 'up' 
      ? 'var(--color-success)' 
      : trend === 'down' 
        ? 'var(--color-danger)' 
        : 'var(--text-muted)'
    : color

  const gradientId = useMemo(() => `sparkline-gradient-${Math.random().toString(36).slice(2)}`, [])

  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={actualColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={actualColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke={actualColor}
          strokeWidth={1.5}
          fill={showGradient ? `url(#${gradientId})` : 'transparent'}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

