import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'
import type { Notification } from '@/store/realtimeStore'

interface NotificationCenterProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClear: () => void
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-green-500/15' }
    case 'warning':
      return { icon: AlertTriangle, color: 'text-[var(--color-warning)]', bg: 'bg-amber-500/15' }
    case 'error':
      return { icon: AlertCircle, color: 'text-[var(--color-danger)]', bg: 'bg-red-500/15' }
    default:
      return { icon: Info, color: 'text-[var(--color-primary)]', bg: 'bg-blue-500/15' }
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString()
}

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-danger)] text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-lg sm:w-96">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text-primary)]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[var(--color-primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  title="Mark all as read"
                >
                  <CheckCheck size={16} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--color-danger)]"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell size={32} className="text-[var(--text-muted)]" />
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {notifications.map((notification) => {
                  const { icon: Icon, color, bg } = getNotificationIcon(notification.type)

                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-secondary)] ${
                        !notification.read ? 'bg-[var(--color-primary)]/5' : ''
                      }`}
                    >
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}>
                        <Icon size={16} className={color} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-[var(--text-primary)]`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="flex-shrink-0 rounded p-0.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--color-primary)]"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

