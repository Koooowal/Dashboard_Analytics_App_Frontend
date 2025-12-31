import { useState, useCallback } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts'
import { CHART_COLORS_RGB } from './chartTheme'
import { formatCurrency, formatCompact } from '@/utils/formatters'

interface PieDataPoint {
  name: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

interface InteractivePieChartProps {
  data: PieDataPoint[]
  height?: number
  onSliceClick?: (data: PieDataPoint, index: number) => void
  donut?: boolean
  showTotal?: boolean
  currencyFormat?: boolean
  totalLabel?: string
}

interface ActiveShapeProps {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: PieDataPoint
  value: number
  percent: number
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--bg-primary)"
        strokeWidth={3}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.3}
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize={14}
        fontWeight={600}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  )
}

export function InteractivePieChart({
  data,
  height = 300,
  onSliceClick,
  donut = true,
  showTotal = true,
  currencyFormat = false,
  totalLabel = 'Total',
}: InteractivePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const total = data.reduce((sum, d) => sum + d.value, 0)

  const formatValue = useCallback(
    (value: number) => {
      if (currencyFormat) return formatCurrency(value)
      return formatCompact(value)
    },
    [currencyFormat]
  )

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  const onPieLeave = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const outerRadius = Math.min(height * 0.35, 120)
  const innerRadius = donut ? outerRadius * 0.6 : 0

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            activeShape={activeIndex !== null ? (renderActiveShape as never) : undefined}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={(_, index) => {
              if (onSliceClick) {
                onSliceClick(data[index], index)
              }
            }}
            isAnimationActive={true}
            animationDuration={800}
            cursor={onSliceClick ? 'pointer' : 'default'}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.color ||
                  CHART_COLORS_RGB[index % CHART_COLORS_RGB.length]
                }
                stroke="var(--bg-primary)"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const entry = payload[0]

              return (
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 shadow-[var(--shadow-lg)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: entry.payload.color || entry.color,
                      }}
                    />
                    <span className="font-medium text-[var(--text-primary)]">
                      {entry.name}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-[var(--text-muted)]">
                      Value:{' '}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {formatValue(entry.value as number)}
                      </span>
                    </p>
                    <p className="text-[var(--text-muted)]">
                      Share:{' '}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {(((entry.value as number) / total) * 100).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                  {onSliceClick && (
                    <p className="mt-2 text-xs text-[var(--color-primary)]">
                      Click for details →
                    </p>
                  )}
                </div>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {donut && showTotal && activeIndex === null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)]">{totalLabel}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {formatValue(total)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((entry, index) => {
          const color =
            entry.color || CHART_COLORS_RGB[index % CHART_COLORS_RGB.length]
          const isActive = activeIndex === index

          return (
            <button
              key={entry.name}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => onSliceClick?.(entry, index)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all ${
                isActive
                  ? 'bg-[var(--bg-tertiary)] shadow-sm'
                  : 'hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[var(--text-secondary)]">{entry.name}</span>
              <span className="font-medium text-[var(--text-primary)]">
                {((entry.value / total) * 100).toFixed(0)}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
