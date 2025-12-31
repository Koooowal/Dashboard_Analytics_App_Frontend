import { useState, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { CHART_COLORS_RGB, chartTheme, defaultMargins } from './chartTheme'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface DataPoint {
  [key: string]: string | number
}

interface BarConfig {
  dataKey: string
  name: string
  color?: string
  stackId?: string
}

interface InteractiveBarChartProps {
  data: DataPoint[]
  bars: BarConfig[]
  xAxisKey: string
  height?: number
  onBarClick?: (data: DataPoint, index: number) => void
  layout?: 'horizontal' | 'vertical'
  currencyFormat?: boolean
  compactFormat?: boolean
  highlightOnHover?: boolean
}

export function InteractiveBarChart({
  data,
  bars,
  xAxisKey,
  height = 300,
  onBarClick,
  layout = 'horizontal',
  currencyFormat = false,
  compactFormat = true,
  highlightOnHover = true,
}: InteractiveBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hiddenBars, setHiddenBars] = useState<Set<string>>(new Set())

  const isVertical = layout === 'vertical'

  const toggleBar = useCallback((dataKey: string) => {
    setHiddenBars((prev) => {
      const next = new Set(prev)
      if (next.has(dataKey)) {
        next.delete(dataKey)
      } else {
        next.add(dataKey)
      }
      return next
    })
  }, [])

  const formatValue = useCallback(
    (value: number) => {
      if (currencyFormat) return formatCurrency(value)
      if (compactFormat) return formatCompact(value)
      return value.toLocaleString()
    },
    [currencyFormat, compactFormat]
  )

  return (
    <div>
      {bars.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {bars.map((bar, index) => {
            const color = bar.color || CHART_COLORS_RGB[index]
            const isHidden = hiddenBars.has(bar.dataKey)

            return (
              <button
                key={bar.dataKey}
                onClick={() => toggleBar(bar.dataKey)}
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
                {bar.name}
              </button>
            )
          })}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={defaultMargins}
          onMouseMove={(e) => {
            if (e.activeTooltipIndex !== undefined && typeof e.activeTooltipIndex === 'number') {
              setActiveIndex(e.activeTooltipIndex)
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid
            strokeDasharray={chartTheme.grid.strokeDasharray}
            stroke={chartTheme.grid.stroke}
            horizontal={!isVertical}
            vertical={isVertical}
          />

          {isVertical ? (
            <>
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickFormatter={formatValue}
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                width={100}
              />
            </>
          ) : (
            <>
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
            </>
          )}

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null

              return (
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 shadow-[var(--shadow-lg)]">
                  <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    {label}
                  </p>
                  {payload
                    .filter((p) => !hiddenBars.has(p.dataKey as string))
                    .map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2.5 w-2.5 rounded"
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
                  {onBarClick && (
                    <p className="mt-2 text-xs text-[var(--color-primary)]">
                      Click for details →
                    </p>
                  )}
                </div>
              )
            }}
            cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.3 }}
          />

          {bars.map((bar, barIndex) => {
            const color = bar.color || CHART_COLORS_RGB[barIndex]
            const isHidden = hiddenBars.has(bar.dataKey)

            return (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={color}
                stackId={bar.stackId}
                radius={[4, 4, 0, 0]}
                hide={isHidden}
                isAnimationActive={true}
                animationDuration={800}
                onClick={(data, index) =>
                  onBarClick?.(data as unknown as DataPoint, index)
                }
                cursor={onBarClick ? 'pointer' : 'default'}
              >
                {highlightOnHover &&
                  data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={color}
                      opacity={
                        activeIndex === null || activeIndex === index ? 1 : 0.4
                      }
                    />
                  ))}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
