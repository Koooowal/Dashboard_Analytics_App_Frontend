import { useEffect, useRef } from 'react'
import {
  ShoppingCart,
  Package,
  User,
  AlertTriangle,
  Trophy,
  Zap,
} from 'lucide-react'
import type { RealtimeEvent } from '@/store/realtimeStore'
import { formatCurrency } from '@/utils/formatters'

interface ActivityFeedProps {
  events: RealtimeEvent[]
  maxItems?: number
  isLoading?: boolean
  showAnimation?: boolean
}

const getEventIcon = (type: RealtimeEvent['type']) => {
  switch (type) {
    case 'sale':
      return { icon: ShoppingCart, color: 'var(--color-success)', bg: 'bg-green-500/15' }
    case 'order':
      return { icon: Package, color: 'var(--color-primary)', bg: 'bg-blue-500/15' }
    case 'user':
      return { icon: User, color: 'var(--color-warning)', bg: 'bg-amber-500/15' }
    case 'alert':
      return { icon: AlertTriangle, color: 'var(--color-danger)', bg: 'bg-red-500/15' }
    case 'milestone':
      return { icon: Trophy, color: '#f59e0b', bg: 'bg-amber-500/15' }
    default:
      return { icon: Zap, color: 'var(--text-muted)', bg: 'bg-gray-500/15' }
  }
}

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ActivityFeed({
  events,
  maxItems = 10,
  isLoading = false,
  showAnimation = true,
}: ActivityFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null)
  const prevEventsLength = useRef(events.length)

  useEffect(() => {
    if (events.length > prevEventsLength.current && feedRef.current) {
      feedRef.current.scrollTop = 0
    }
    prevEventsLength.current = events.length
  }, [events.length])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--bg-tertiary)]" />
            <div className="h-5 w-32 animate-pulse rounded bg-[var(--bg-tertiary)]" />
          </div>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-6 py-4">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--bg-tertiary)]" />
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
                <div className="mt-1 h-3 w-40 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayEvents = events.slice(0, maxItems)

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-[var(--color-success)]" />
            <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Live Activity
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Real-time updates
            </p>
          </div>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {events.length} events
        </span>
      </div>

      <div
        ref={feedRef}
        className="max-h-[400px] divide-y divide-[var(--border-color)] overflow-y-auto"
      >
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Zap size={32} className="text-[var(--text-muted)]" />
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              No activity yet. Events will appear here in real-time.
            </p>
          </div>
        ) : (
          displayEvents.map((event, index) => {
            const { icon: Icon, color, bg } = getEventIcon(event.type)
            const isNew = showAnimation && index === 0 && 
              new Date().getTime() - event.timestamp.getTime() < 3000

            return (
              <div
                key={event.id}
                className={`flex items-start gap-3 px-6 py-4 transition-all ${
                  isNew ? 'animate-pulse bg-[var(--color-success)]/5' : ''
                } hover:bg-[var(--bg-secondary)]`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon size={16} style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {event.title}
                    </p>
                    {event.value && (
                      <span className="text-sm font-semibold text-[var(--color-success)]">
                        +{formatCurrency(event.value)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                    {event.description}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {formatTimeAgo(event.timestamp)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

