import { create } from 'zustand'
import type { DashboardStats, ActivityItem } from '@/types'

interface DashboardState {
  isLoading: boolean
  error: string | null
  stats: DashboardStats | null
  recentActivity: ActivityItem[]
  lastUpdated: Date | null
  autoRefresh: boolean
  refreshInterval: number
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setStats: (stats: DashboardStats) => void
  setRecentActivity: (activity: ActivityItem[]) => void
  addActivity: (activity: ActivityItem) => void
  setLastUpdated: (date: Date) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isLoading: false,
  error: null,
  stats: null,
  recentActivity: [],
  lastUpdated: null,
  autoRefresh: false,
  refreshInterval: 30000,

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setStats: (stats) => set({ stats, lastUpdated: new Date() }),

  setRecentActivity: (recentActivity) => set({ recentActivity }),

  addActivity: (activity) =>
    set((state) => ({
      recentActivity: [activity, ...state.recentActivity].slice(0, 50),
    })),

  setLastUpdated: (lastUpdated) => set({ lastUpdated }),

  setAutoRefresh: (autoRefresh) => set({ autoRefresh }),

  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
}))
