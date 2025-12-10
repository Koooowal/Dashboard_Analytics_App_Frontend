import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { ChartLegend } from './ChartLegend'
import { CHART_COLORS_RGB, chartTheme, defaultMargins } from './chartTheme'

interface DataPoint {
  [key: string]: string | number
}

interface AreaConfig {
  dataKey: string
  name: string
  color?: string
  fillOpacity?: number
  stackId?: string
  type?: 'monotone' | 'linear' | 'step'
}

interface AreaChartProps {
  data: DataPoint[]
  areas: AreaConfig[]
  xAxisKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  animate?: boolean
  gradient?: boolean
  valuePrefix?: string
  valueSuffix?: string
  yAxisFormatter?: (value: number) => string
}

export function AreaChartComponent({
  data,
  areas,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  gradient = true,
  valuePrefix = '',
  valueSuffix = '',
  yAxisFormatter,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={defaultMargins}>
        <defs>
          {areas.map((area, index) => {
            const color = area.color || CHART_COLORS_RGB[index]
            return (
              <linearGradient
                key={`gradient-${area.dataKey}`}
                id={`gradient-${area.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            )
          })}
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray={chartTheme.grid.strokeDasharray}
            stroke={chartTheme.grid.stroke}
            vertical={false}
          />
        )}
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
          tickFormatter={yAxisFormatter}
          dx={-10}
        />
        {showTooltip && (
          <Tooltip
            content={
              <ChartTooltip
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            }
          />
        )}
        {showLegend && <Legend content={<ChartLegend />} />}
        {areas.map((area, index) => {
          const color = area.color || CHART_COLORS_RGB[index]
          return (
            <Area
              key={area.dataKey}
              type={area.type || 'monotone'}
              dataKey={area.dataKey}
              name={area.name}
              stroke={color}
              strokeWidth={2}
              fill={gradient ? `url(#gradient-${area.dataKey})` : color}
              fillOpacity={area.fillOpacity ?? (gradient ? 1 : 0.2)}
              stackId={area.stackId}
              isAnimationActive={animate}
              animationDuration={800}
              animationEasing="ease-out"
            />
          )
        })}
      </AreaChart>
    </ResponsiveContainer>
  )
}

