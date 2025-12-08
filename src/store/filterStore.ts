import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DateRange, TimeFrame } from '@/types'

interface FilterState {
  dateRange: DateRange
  timeFrame: TimeFrame
  categories: string[]
  searchQuery: string
  setDateRange: (range: DateRange) => void
  setTimeFrame: (timeFrame: TimeFrame) => void
  setCategories: (categories: string[]) => void
  toggleCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

const getDefaultDateRange = (): DateRange => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  return { startDate, endDate }
}

const initialState = {
  dateRange: getDefaultDateRange(),
  timeFrame: 'daily' as TimeFrame,
  categories: [] as string[],
  searchQuery: '',
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setDateRange: (dateRange) => set({ dateRange }),

      setTimeFrame: (timeFrame) => set({ timeFrame }),

      setCategories: (categories) => set({ categories }),

      toggleCategory: (category) =>
        set((state) => ({
          categories: state.categories.includes(category)
            ? state.categories.filter((c) => c !== category)
            : [...state.categories, category],
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      resetFilters: () => set(initialState),
    }),
    {
      name: 'dashboard-filters',
      partialize: (state) => ({
        timeFrame: state.timeFrame,
        categories: state.categories,
      }),
    }
  )
)
