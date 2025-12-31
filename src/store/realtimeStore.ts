import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export interface RealtimeEvent {
  id: string
  type: 'sale' | 'order' | 'user' | 'alert' | 'milestone'
  title: string
  description: string
  value?: number
  timestamp: Date
  icon?: string
}

interface RealtimeState {
  isAutoRefreshEnabled: boolean
  refreshInterval: number 
  lastUpdated: Date | null
  
  notifications: Notification[]
  unreadCount: number
  
  events: RealtimeEvent[]
  
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (seconds: number) => void
  updateLastUpdated: () => void
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  
  addEvent: (event: Omit<RealtimeEvent, 'id' | 'timestamp'>) => void
  clearEvents: () => void
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  isAutoRefreshEnabled: true,
  refreshInterval: 30,
  lastUpdated: null,
  notifications: [],
  unreadCount: 0,
  events: [],

  setAutoRefresh: (enabled) => set({ isAutoRefreshEnabled: enabled }),
  
  setRefreshInterval: (seconds) => set({ refreshInterval: seconds }),
  
  updateLastUpdated: () => set({ lastUpdated: new Date() }),

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  addEvent: (event) => {
    const newEvent: RealtimeEvent = {
      ...event,
      id: generateId(),
      timestamp: new Date(),
    }
    set((state) => ({
      events: [newEvent, ...state.events].slice(0, 100),
    }))
  },

  clearEvents: () => set({ events: [] }),
}))





