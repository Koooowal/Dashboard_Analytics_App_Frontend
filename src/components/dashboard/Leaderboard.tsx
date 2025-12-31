import { Trophy, TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react'
import type { UserRanking } from '@/services/userService'
import { SparklineChart } from '@/components/charts/SparklineChart'
import { formatCurrency } from '@/utils/formatters'

interface LeaderboardProps {
  rankings: UserRanking[]
  isLoading?: boolean
  showSparkline?: boolean
  maxItems?: number
}

const RANK_STYLES = [
  { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', icon: 'text-amber-500' },
  { bg: 'from-slate-400/20 to-slate-500/10', border: 'border-slate-400/30', icon: 'text-slate-400' },
  { bg: 'from-amber-700/20 to-amber-800/10', border: 'border-amber-700/30', icon: 'text-amber-700' },
]

export function Leaderboard({
  rankings,
  isLoading = false,
  showSparkline = true,
  maxItems = 10,
}: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-6 py-5">
          <Trophy size={20} className="text-amber-500" />
          <div className="h-5 w-32 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--bg-tertiary)]" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--bg-tertiary)]" />
              <div className="flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--bg-tertiary)]" />
                <div className="mt-1 h-3 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--bg-tertiary)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayRankings = rankings.slice(0, maxItems)

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/15">
            <Trophy size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Leaderboard
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Top performers by revenue
            </p>
          </div>
        </div>
        <span className="text-sm text-[var(--text-muted)]">
          {displayRankings.length} of {rankings.length}
        </span>
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {displayRankings.map((ranking) => {
          const isTopThree = ranking.rank <= 3
          const rankStyle = isTopThree ? RANK_STYLES[ranking.rank - 1] : null
          
          const TrendIcon = 
            ranking.trend === 'up' ? TrendingUp : 
            ranking.trend === 'down' ? TrendingDown : Minus
          
          const trendColor = 
            ranking.trend === 'up' ? 'text-[var(--color-success)]' : 
            ranking.trend === 'down' ? 'text-[var(--color-danger)]' : 
            'text-[var(--text-muted)]'

          return (
            <div
              key={ranking.user.id}
              className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-secondary)] ${
                isTopThree ? `bg-gradient-to-r ${rankStyle?.bg}` : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                  isTopThree
                    ? `border ${rankStyle?.border} ${rankStyle?.icon}`
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                }`}
              >
                {isTopThree ? (
                  <Medal size={16} />
                ) : (
                  <span className="text-sm">{ranking.rank}</span>
                )}
              </div>

              <div className="relative">
                <img
                  src={ranking.user.avatar}
                  alt={ranking.user.name}
                  className="h-10 w-10 rounded-full bg-[var(--bg-tertiary)]"
                />
                {isTopThree && (
                  <div
                    className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--bg-primary)] text-xs font-bold text-white`}
                    style={{
                      backgroundColor:
                        ranking.rank === 1 ? '#f59e0b' :
                        ranking.rank === 2 ? '#94a3b8' :
                        '#cd7f32',
                    }}
                  >
                    {ranking.rank}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-[var(--text-primary)]">
                  {ranking.user.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {ranking.user.department} • {ranking.user.role}
                </p>
              </div>

              {showSparkline && ranking.sparklineData.length > 0 && (
                <div className="hidden w-20 sm:block">
                  <SparklineChart
                    data={ranking.sparklineData}
                    trend={ranking.trend}
                    height={32}
                  />
                </div>
              )}

              <div className="text-right">
                <p className="font-semibold text-[var(--text-primary)]">
                  {formatCurrency(ranking.user.performance.revenue)}
                </p>
                <div className={`flex items-center justify-end gap-1 ${trendColor}`}>
                  <TrendIcon size={12} />
                  <span className="text-xs">Top {ranking.percentile}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}






