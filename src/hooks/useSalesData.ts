import { useQuery } from '@tanstack/react-query'
import { salesService } from '@/services'
import { useFilterStore } from '@/store'

export function useSalesData() {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['salesData', dateRange],
    queryFn: () => salesService.getSalesData(dateRange),
  })
}

export function useRevenueByTimeFrame() {
  const { dateRange, timeFrame } = useFilterStore()

  return useQuery({
    queryKey: ['revenueByTimeFrame', dateRange, timeFrame],
    queryFn: () => salesService.getRevenueByTimeFrame(dateRange, timeFrame),
  })
}

export function useCategorySalesData() {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['categorySalesData', dateRange],
    queryFn: () => salesService.getCategorySales(dateRange),
  })
}

export function useTopProductsData(limit = 10) {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['topProducts', dateRange, limit],
    queryFn: () => salesService.getTopProducts(dateRange, limit),
  })
}

export function useSalesSummary() {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['salesSummary', dateRange],
    queryFn: () => salesService.getSalesSummary(dateRange),
  })
}

export function useSalesComparison() {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['salesComparison', dateRange],
    queryFn: () => salesService.getSalesComparison(dateRange),
  })
}

export function useSalesByHour() {
  return useQuery({
    queryKey: ['salesByHour'],
    queryFn: () => salesService.getSalesByHour(),
  })
}

export function useSalesGrouped() {
  const { dateRange, timeFrame } = useFilterStore()

  return useQuery({
    queryKey: ['salesGrouped', dateRange, timeFrame],
    queryFn: () => salesService.getSalesGrouped(dateRange, timeFrame),
  })
}

export function useTrendAnalysis() {
  const { dateRange } = useFilterStore()

  return useQuery({
    queryKey: ['trendAnalysis', dateRange],
    queryFn: () => salesService.getTrendAnalysis(dateRange),
  })
}

export function useGrowthMetrics() {
  return useQuery({
    queryKey: ['growthMetrics'],
    queryFn: () => salesService.getGrowthMetrics(),
  })
}

export function useSparklineData(metric: string, days = 14) {
  return useQuery({
    queryKey: ['sparkline', metric, days],
    queryFn: () => salesService.getSparklineData(metric, days),
  })
}