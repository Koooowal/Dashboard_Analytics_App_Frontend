import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services'
import { useFilterStore } from '@/store'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getStats(),
  })
}

export function useRevenueData() {
  const { dateRange, timeFrame } = useFilterStore()

  return useQuery({
    queryKey: ['revenueData', dateRange, timeFrame],
    queryFn: () => dashboardService.getRevenueData(dateRange, timeFrame),
  })
}

export function useCategorySales() {
  return useQuery({
    queryKey: ['categorySales'],
    queryFn: () => dashboardService.getCategorySales(),
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => dashboardService.getUsers(),
  })
}

export function useTopUsers(limit = 5) {
  return useQuery({
    queryKey: ['topUsers', limit],
    queryFn: () => dashboardService.getTopUsers(limit),
  })
}

export function useActivity(limit = 10) {
  return useQuery({
    queryKey: ['activity', limit],
    queryFn: () => dashboardService.getActivity(limit),
  })
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['topProducts', limit],
    queryFn: () => dashboardService.getTopProducts(limit),
  })
}
