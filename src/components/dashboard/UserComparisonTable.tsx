import { useState } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import type { PerformanceComparison } from '@/services/userService'
import type { UserData } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface UserComparisonTableProps {
  comparisons: PerformanceComparison[]
  allUsers: UserData[]
  selectedUserIds: string[]
  onSelectionChange: (userIds: string[]) => void
  isLoading?: boolean
}

export function UserComparisonTable({
  comparisons,
  allUsers,
  selectedUserIds,
  onSelectionChange,
  isLoading = false,
}: UserComparisonTableProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleUserToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter(id => id !== userId))
    } else if (selectedUserIds.length < 5) {
      onSelectionChange([...selectedUserIds, userId])
    }
  }

  const formatMetricValue = (name: string, value: number) => {
    if (name === 'Revenue' || name === 'Avg Order Value') {
      return formatCurrency(value)
    }
    if (name === 'Conversion Rate') {
      return `${value.toFixed(2)}%`
    }
    return value.toLocaleString()
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-[var(--color-success)] bg-[var(--color-success)]/10'
    if (percentile >= 50) return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10'
    return 'text-[var(--color-danger)] bg-[var(--color-danger)]/10'
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-color)] px-6 py-5">
          <div className="h-5 w-48 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="p-6">
          <div className="h-64 animate-pulse rounded-lg bg-[var(--bg-tertiary)]" />
        </div>
      </div>
    )
  }

  const metrics = comparisons[0]?.metrics || []

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            User Comparison
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Compare performance metrics across team members
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-tertiary)]"
          >
            <span>{selectedUserIds.length} users selected</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 max-h-64 w-64 overflow-y-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg">
              {allUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id)
                const isDisabled = !isSelected && selectedUserIds.length >= 5

                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    disabled={isDisabled}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isDisabled 
                        ? 'cursor-not-allowed opacity-50' 
                        : 'hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                      isSelected 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                        : 'border-[var(--border-color)]'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {user.department}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {comparisons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <X size={48} className="text-[var(--text-muted)]" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Select users above to compare their performance
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Metric
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Team Avg
                </th>
                {comparisons.map((comp) => (
                  <th
                    key={comp.userId}
                    className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {comp.userName.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {metrics.map((metric, metricIndex) => (
                <tr key={metric.name} className="hover:bg-[var(--bg-secondary)]">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                    {metric.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-[var(--text-muted)]">
                    {formatMetricValue(metric.name, metric.teamAvg)}
                  </td>
                  {comparisons.map((comp) => {
                    const userMetric = comp.metrics[metricIndex]
                    const isAboveAvg = userMetric.value > userMetric.teamAvg

                    return (
                      <td key={comp.userId} className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-semibold ${
                            isAboveAvg ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'
                          }`}>
                            {formatMetricValue(metric.name, userMetric.value)}
                          </span>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getPercentileColor(userMetric.percentile)}`}>
                            Top {userMetric.percentile}%
                          </span>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}







