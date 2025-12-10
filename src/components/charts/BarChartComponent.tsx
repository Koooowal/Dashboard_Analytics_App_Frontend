import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { ChartLegend } from './ChartLegend'
import { CHART_COLORS_RGB, chartTheme, defaultMargins } from './chartTheme'

interface DataPoint {
  [key: string]: string | number
}

interface BarConfig {
  dataKey: string
  name: string
  color?: string
  stackId?: string
  radius?: number
}

interface BarChartProps {
  data: DataPoint[]
  bars: BarConfig[]
  xAxisKey: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  animate?: boolean
  layout?: 'horizontal' | 'vertical'
  barSize?: number
  valuePrefix?: string
  valueSuffix?: string
  yAxisFormatter?: (value: number) => string
  colorByValue?: boolean
}

export function BarChartComponent({
  data,
  bars,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  layout = 'horizontal',
  barSize,
  valuePrefix = '',
  valueSuffix = '',
  yAxisFormatter,
  colorByValue = false,
}: BarChartProps) {
  const isVertical = layout === 'vertical'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={defaultMargins}
        layout={layout}
        barSize={barSize}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray={chartTheme.grid.strokeDasharray}
            stroke={chartTheme.grid.stroke}
            horizontal={!isVertical}
            vertical={isVertical}
          />
        )}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              tickFormatter={yAxisFormatter}
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
              tickFormatter={yAxisFormatter}
              dx={-10}
            />
          </>
        )}
        {showTooltip && (
          <Tooltip
            content={
              <ChartTooltip
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            }
            cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.5 }}
          />
        )}
        {showLegend && <Legend content={<ChartLegend />} />}
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color || CHART_COLORS_RGB[index]}
            stackId={bar.stackId}
            radius={bar.radius ?? [4, 4, 0, 0]}
            isAnimationActive={animate}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {colorByValue &&
              data.map((_, cellIndex) => (
                <Cell
                  key={cellIndex}
                  fill={CHART_COLORS_RGB[cellIndex % CHART_COLORS_RGB.length]}
                />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

