import {
  LineChart,
  Line,
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

interface LineConfig {
  dataKey: string
  name: string
  color?: string
  strokeWidth?: number
  dot?: boolean
  dashed?: boolean
}

interface LineChartProps {
  data: DataPoint[]
  lines: LineConfig[]
  xAxisKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  animate?: boolean
  valuePrefix?: string
  valueSuffix?: string
  yAxisFormatter?: (value: number) => string
}

export function LineChartComponent({
  data,
  lines,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  valuePrefix = '',
  valueSuffix = '',
  yAxisFormatter,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={defaultMargins}>
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
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || CHART_COLORS_RGB[index]}
            strokeWidth={line.strokeWidth || 2}
            dot={line.dot ?? false}
            strokeDasharray={line.dashed ? '5 5' : undefined}
            isAnimationActive={animate}
            animationDuration={800}
            animationEasing="ease-out"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

