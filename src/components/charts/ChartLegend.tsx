import type { LegendProps } from 'recharts'

interface CustomLegendProps extends LegendProps {
  onItemClick?: (dataKey: string) => void
  hiddenItems?: string[]
}

export function ChartLegend({
  payload,
  onItemClick,
  hiddenItems = [],
}: CustomLegendProps) {
  if (!payload?.length) return null

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      {payload.map((entry, index) => {
        const isHidden = hiddenItems.includes(entry.value)

        return (
          <button
            key={index}
            onClick={() => onItemClick?.(entry.value)}
            className={`flex items-center gap-2 text-sm transition-opacity ${
              isHidden ? 'opacity-40' : 'opacity-100'
            } ${onItemClick ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}`}
          >
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[var(--text-secondary)]">{entry.value}</span>
          </button>
        )
      })}
    </div>
  )
}

