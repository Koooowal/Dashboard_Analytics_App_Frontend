import { useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtimeStore } from '@/store/realtimeStore'

const SALE_MESSAGES = [
  'New sale completed',
  'Large order received',
  'Premium subscription purchased',
  'Bulk order placed',
  'VIP customer purchase',
]

const ORDER_MESSAGES = [
  'Order shipped to customer',
  'Express delivery dispatched',
  'Order fulfilled successfully',
  'Return processed',
  'Order confirmed',
]

const USER_MESSAGES = [
  'New user registered',
  'User upgraded to premium',
  'Customer profile updated',
  'New team member joined',
  'Account verified',
]

const ALERT_MESSAGES = [
  'Low stock warning',
  'High traffic detected',
  'New 5-star review received',
  'Payment processed',
  'Goal milestone reached',
]

const randomFromArray = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

const randomValue = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export function useRealTimeData() {
  const queryClient = useQueryClient()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const {
    isAutoRefreshEnabled,
    refreshInterval,
    updateLastUpdated,
    addNotification,
    addEvent,
  } = useRealtimeStore()

  const generateRandomEvent = useCallback(() => {
    const eventTypes = ['sale', 'order', 'user', 'alert'] as const
    const type = randomFromArray(eventTypes)
    
    let title: string
    let description: string
    let value: number | undefined
    let notificationType: 'success' | 'warning' | 'info' = 'info'

    switch (type) {
      case 'sale':
        title = 'New Sale'
        description = randomFromArray(SALE_MESSAGES)
        value = randomValue(50, 500)
        notificationType = 'success'
        break
      case 'order':
        title = 'Order Update'
        description = randomFromArray(ORDER_MESSAGES)
        notificationType = 'info'
        break
      case 'user':
        title = 'User Activity'
        description = randomFromArray(USER_MESSAGES)
        notificationType = 'info'
        break
      case 'alert':
        title = 'System Alert'
        description = randomFromArray(ALERT_MESSAGES)
        notificationType = 'warning'
        break
    }

    addEvent({
      type,
      title,
      description,
      value,
    })

    if (Math.random() < 0.3) {
      addNotification({
        type: notificationType,
        title,
        message: description + (value ? ` - $${value}` : ''),
      })
    }
  }, [addEvent, addNotification])

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
    queryClient.invalidateQueries({ queryKey: ['revenueData'] })
    queryClient.invalidateQueries({ queryKey: ['activity'] })
    
    updateLastUpdated()
    
    generateRandomEvent()
  }, [queryClient, updateLastUpdated, generateRandomEvent])

  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      refreshData()
    }, refreshInterval * 1000)
  }, [refreshInterval, refreshData])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isAutoRefreshEnabled) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }

    return () => stopAutoRefresh()
  }, [isAutoRefreshEnabled, startAutoRefresh, stopAutoRefresh])

  useEffect(() => {
    if (isAutoRefreshEnabled) {
      startAutoRefresh()
    }
  }, [refreshInterval, isAutoRefreshEnabled, startAutoRefresh])

  useEffect(() => {
    updateLastUpdated()
  }, [updateLastUpdated])

  return {
    refreshData,
    isAutoRefreshEnabled,
  }
}





