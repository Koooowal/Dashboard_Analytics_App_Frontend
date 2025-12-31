import type { TooltipProps } from 'recharts'
import { formatCurrency, formatNumber } from '@/utils/formatters'

interface TooltipPayloadEntry {
  value?: number
  name?: string
  color?: string
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  valuePrefix?: string
  valueSuffix?: string
  formatValue?: (value: number) => string
  payload?: TooltipPayloadEntry[]
  label?: string
}

export function ChartTooltip({
  active,
  payload,
  label,
  valuePrefix = '',
  valueSuffix = '',
  formatValue,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 shadow-[var(--shadow-md)]">
      <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: TooltipPayloadEntry, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[var(--text-muted)]">{entry.name}:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {valuePrefix}
              {formatValue
                ? formatValue(entry.value as number)
                : typeof entry.value === 'number'
                  ? entry.value >= 1000
                    ? formatNumber(entry.value)
                    : entry.value.toFixed(2)
                  : entry.value}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CurrencyTooltip(props: TooltipProps<number, string>) {
  return (
    <ChartTooltip {...props} valuePrefix="$" formatValue={formatCurrency} />
  )
}

export function PercentageTooltip(props: TooltipProps<number, string>) {
  return (
    <ChartTooltip
      {...props}
      valueSuffix="%"
      formatValue={(v) => v.toFixed(1)}
    />
  )
}
