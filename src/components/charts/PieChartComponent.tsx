import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { CHART_COLORS_RGB } from './chartTheme'

interface PieDataPoint {
  name: string
  value: number
  color?: string
  [key: string]: string | number | undefined
}

interface PieChartProps {
  data: PieDataPoint[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  showTooltip?: boolean
  showLabels?: boolean
  animate?: boolean
  valuePrefix?: string
  valueSuffix?: string
  donut?: boolean
}

const RADIAN = Math.PI / 180

interface LabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

const renderCustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function PieChartComponent({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  animate = true,
  valuePrefix = '',
  valueSuffix = '',
  donut = false,
}: PieChartProps) {
  const actualInnerRadius = donut ? outerRadius * 0.6 : innerRadius

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={actualInnerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          isAnimationActive={animate}
          animationDuration={800}
          animationEasing="ease-out"
          label={showLabels ? (renderCustomLabel as unknown as undefined) : false}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.color || CHART_COLORS_RGB[index % CHART_COLORS_RGB.length]
              }
              stroke="var(--bg-primary)"
              strokeWidth={2}
            />
          ))}
        </Pie>
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
        {showLegend && (
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                {value}
              </span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}
