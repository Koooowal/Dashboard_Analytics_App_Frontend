import { Users } from 'lucide-react'
import type { TeamPerformance } from '@/services/userService'
import { formatCurrency } from '@/utils/formatters'

interface TeamPerformanceCardProps {
  teams: TeamPerformance[]
  isLoading?: boolean
}

export function TeamPerformanceCard({ teams, isLoading = false }: TeamPerformanceCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-color)] px-6 py-5">
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="h-12 w-12 animate-pulse rounded-lg bg-[var(--bg-tertiary)]" />
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              </div>
              <div className="h-8 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getTeamColor = (index: number) => {
    const colors = [
      'var(--color-primary)',
      'var(--color-success)',
      'var(--color-warning)',
      'var(--chart-5)',
      '#06b6d4',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/15">
            <Users size={20} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Team Performance
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Department breakdown
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {teams.map((team, index) => {
          const color = getTeamColor(index)
          const achievementColor = 
            team.targetAchievement >= 100 ? 'text-[var(--color-success)]' :
            team.targetAchievement >= 75 ? 'text-[var(--color-warning)]' :
            'text-[var(--color-danger)]'

          return (
            <div
              key={team.department}
              className="px-6 py-5 transition-colors hover:bg-[var(--bg-secondary)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-lg"
                    style={{ backgroundColor: color }}
                  >
                    {team.department.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {team.department}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {team.memberCount} members • Top: {team.topPerformer.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {formatCurrency(team.totalRevenue)}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Avg: {formatCurrency(team.avgRevenue)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Target Achievement</span>
                  <span className={`font-semibold ${achievementColor}`}>
                    {team.targetAchievement}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className="h-full transition-all rounded-full"
                    style={{
                      width: `${Math.min(100, team.targetAchievement)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}







