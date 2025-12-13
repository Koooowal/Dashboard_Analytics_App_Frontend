import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFilterStore } from '@/store'
import type { TimeFrame } from '@/types'

const TIME_FRAMES: TimeFrame[] = ['daily', 'weekly', 'monthly', 'yearly']

export function useFilterSync() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    dateRange,
    timeFrame,
    categories,
    searchQuery,
    setDateRange,
    setTimeFrame,
    setCategories,
    setSearchQuery,
  } = useFilterStore()

  useEffect(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const tf = searchParams.get('timeFrame') as TimeFrame | null
    const cats = searchParams.get('categories')
    const search = searchParams.get('search')

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        setDateRange({ startDate: start, endDate: end })
      }
    }

    if (tf && TIME_FRAMES.includes(tf)) {
      setTimeFrame(tf)
    }

    if (cats) {
      const categoryList = cats.split(',').filter(Boolean)
      if (categoryList.length > 0) {
        setCategories(categoryList)
      }
    }

    if (search) {
      setSearchQuery(search)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()

    params.set('startDate', dateRange.startDate.toISOString().split('T')[0])
    params.set('endDate', dateRange.endDate.toISOString().split('T')[0])
    params.set('timeFrame', timeFrame)

    if (categories.length > 0) {
      params.set('categories', categories.join(','))
    }

    if (searchQuery) {
      params.set('search', searchQuery)
    }

    setSearchParams(params, { replace: true })
  }, [dateRange, timeFrame, categories, searchQuery, setSearchParams])

  return {
    dateRange,
    timeFrame,
    categories,
    searchQuery,
  }
}
