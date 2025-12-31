import { useState, useCallback } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { CHART_COLORS_RGB, chartTheme, defaultMargins } from './chartTheme'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface DataPoint {
  [key: string]: string | number
}

interface AreaConfig {
  dataKey: string
  name: string
  color?: string
}

interface InteractiveAreaChartProps {
  data: DataPoint[]
  areas: AreaConfig[]
  xAxisKey: string
  height?: number
  onPointClick?: (data: DataPoint, index: number) => void
  showAverage?: boolean
  currencyFormat?: boolean
  compactFormat?: boolean
}

export function InteractiveAreaChart({
  data,
  areas,
  xAxisKey,
  height = 300,
  onPointClick,
  showAverage = false,
  currencyFormat = false,
  compactFormat = true,
}: InteractiveAreaChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleSeries = useCallback((dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(dataKey)) {
        next.delete(dataKey)
      } else {
        next.add(dataKey)
      }
      return next
    })
  }, [])

  const handleClick = useCallback(
    (data: DataPoint, index: number) => {
      onPointClick?.(data, index)
    },
    [onPointClick]
  )

  const formatValue = useCallback(
    (value: number) => {
      if (currencyFormat) return formatCurrency(value)
      if (compactFormat) return formatCompact(value)
      return value.toLocaleString()
    },
    [currencyFormat, compactFormat]
  )

  const averageValue =
    showAverage && areas[0]
      ? data.reduce((sum, d) => sum + (Number(d[areas[0].dataKey]) || 0), 0) /
        data.length
      : 0

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        {areas.map((area, index) => {
          const color = area.color || CHART_COLORS_RGB[index]
          const isHidden = hiddenSeries.has(area.dataKey)

          return (
            <button
              key={area.dataKey}
              onClick={() => toggleSeries(area.dataKey)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isHidden
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] opacity-60'
                  : 'text-white shadow-sm'
              }`}
              style={{ backgroundColor: isHidden ? undefined : color }}
            >
              <span
                className={`h-2 w-2 rounded-full ${isHidden ? 'bg-[var(--text-muted)]' : 'bg-white'}`}
              />
              {area.name}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={defaultMargins}
          onMouseMove={(e) => {
            if (e.activeTooltipIndex !== undefined && typeof e.activeTooltipIndex === 'number') {
              setActiveIndex(e.activeTooltipIndex)
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
          onClick={(e) => {
            const payload = (e as unknown as { activePayload?: { payload: DataPoint }[] }).activePayload
            if (payload?.[0] && e.activeTooltipIndex !== undefined && typeof e.activeTooltipIndex === 'number') {
              handleClick(payload[0].payload, e.activeTooltipIndex)
            }
          }}
        >
          <defs>
            {areas.map((area, index) => {
              const color = area.color || CHART_COLORS_RGB[index]
              return (
                <linearGradient
                  key={`gradient-${area.dataKey}`}
                  id={`interactive-gradient-${area.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              )
            })}
          </defs>

          <CartesianGrid
            strokeDasharray={chartTheme.grid.strokeDasharray}
            stroke={chartTheme.grid.stroke}
            vertical={false}
          />

          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            tickFormatter={formatValue}
            dx={-10}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null

              return (
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 shadow-[var(--shadow-lg)]">
                  <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    {label}
                  </p>
                  {payload
                    .filter((p) => !hiddenSeries.has(p.dataKey as string))
                    .map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-[var(--text-muted)]">
                          {entry.name}:
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {formatValue(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  {onPointClick && (
                    <p className="mt-2 text-xs text-[var(--color-primary)]">
                      Click for details →
                    </p>
                  )}
                </div>
              )
            }}
            cursor={{
              stroke: 'var(--color-primary)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />

          {showAverage && averageValue > 0 && (
            <ReferenceLine
              y={averageValue}
              stroke="var(--text-muted)"
              strokeDasharray="4 4"
              label={{
                value: `Avg: ${formatValue(averageValue)}`,
                position: 'right',
                fill: 'var(--text-muted)',
                fontSize: 11,
              }}
            />
          )}

          {areas.map((area, index) => {
            const color = area.color || CHART_COLORS_RGB[index]
            const isHidden = hiddenSeries.has(area.dataKey)

            return (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                name={area.name}
                stroke={color}
                strokeWidth={isHidden ? 0 : 2.5}
                fill={`url(#interactive-gradient-${area.dataKey})`}
                fillOpacity={isHidden ? 0 : 1}
                activeDot={{
                  r: 6,
                  stroke: 'var(--bg-primary)',
                  strokeWidth: 2,
                  fill: color,
                  cursor: onPointClick ? 'pointer' : 'default',
                }}
                dot={
                  activeIndex !== null
                    ? { r: 0 }
                    : { r: 0, fill: color, stroke: color }
                }
                isAnimationActive={true}
                animationDuration={800}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
