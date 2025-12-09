import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services'

export function useAllUsers() {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: () => userService.getUsers(),
  })
}

export function useUserById(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  })
}

export function useUserStats() {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: () => userService.getUserStats(),
  })
}

export function useTopPerformers(limit = 5) {
  return useQuery({
    queryKey: ['topPerformers', limit],
    queryFn: () => userService.getTopPerformers(limit),
  })
}

export function useUserRankings() {
  return useQuery({
    queryKey: ['userRankings'],
    queryFn: () => userService.getUserRankings(),
  })
}

export function useTeamPerformance() {
  return useQuery({
    queryKey: ['teamPerformance'],
    queryFn: () => userService.getTeamPerformance(),
  })
}

export function useCompareUsers(userIds: string[]) {
  return useQuery({
    queryKey: ['compareUsers', userIds],
    queryFn: () => userService.compareUsers(userIds),
    enabled: userIds.length > 0,
  })
}

export function usePerformanceTrends(userId: string, days = 30) {
  return useQuery({
    queryKey: ['performanceTrends', userId, days],
    queryFn: () => userService.getPerformanceTrends(userId, days),
    enabled: !!userId,
  })
}

