export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

export const CHART_COLORS_RGB = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
]

export const chartTheme = {
  grid: {
    stroke: 'var(--border-color)',
    strokeDasharray: '3 3',
  },
  axis: {
    stroke: 'var(--text-muted)',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  tooltip: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    boxShadow: 'var(--shadow-md)',
  },
  legend: {
    fontSize: 12,
    iconSize: 10,
  },
}

export const defaultMargins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
}

export const getChartColor = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length]
}

export const getChartColorRGB = (index: number): string => {
  return CHART_COLORS_RGB[index % CHART_COLORS_RGB.length]
}

