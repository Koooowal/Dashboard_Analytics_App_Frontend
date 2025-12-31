import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter } from 'lucide-react'
import type { SalesData } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface SalesTableProps {
  data: SalesData[]
  isLoading?: boolean
}

type SortField = 'date' | 'revenue' | 'orders' | 'category' | 'avgOrderValue'
type SortDirection = 'asc' | 'desc'

export function SalesTable({ data, isLoading = false }: SalesTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = useMemo(() => {
    const cats = new Set(data.map(item => item.category))
    return ['all', ...Array.from(cats)]
  }, [data])

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.category.toLowerCase().includes(query) ||
        item.date.includes(query)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'revenue':
          comparison = a.revenue - b.revenue
          break
        case 'orders':
          comparison = a.orders - b.orders
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'avgOrderValue':
          comparison = a.avgOrderValue - b.avgOrderValue
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered.slice(0, 50) 
  }, [data, sortField, sortDirection, searchQuery, categoryFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-[var(--text-muted)]" />
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-[var(--color-primary)]" />
      : <ArrowDown size={14} className="text-[var(--color-primary)]" />
  }

  const totals = useMemo(() => ({
    revenue: filteredAndSortedData.reduce((sum, item) => sum + item.revenue, 0),
    orders: filteredAndSortedData.reduce((sum, item) => sum + item.orders, 0),
  }), [filteredAndSortedData])

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--border-color)] px-6 py-5">
          <div className="h-5 w-40 animate-pulse rounded bg-[var(--bg-tertiary)]" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-4 w-28 animate-pulse rounded bg-[var(--bg-tertiary)]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--bg-tertiary)]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--border-color)] px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Sales Transactions
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Detailed view of all sales data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-9 pr-8 text-sm text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Date <SortIcon field="date" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Category <SortIcon field="category" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('orders')}
                  className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Orders <SortIcon field="orders" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('revenue')}
                  className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Revenue <SortIcon field="revenue" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('avgOrderValue')}
                  className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Avg Value <SortIcon field="avgOrderValue" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {filteredAndSortedData.map((item) => (
              <tr 
                key={item.id}
                className="transition-colors hover:bg-[var(--bg-secondary)]"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-primary)]">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-[var(--bg-tertiary)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                    {item.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-[var(--text-primary)]">
                  {item.orders}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-[var(--color-success)]">
                  {formatCurrency(item.revenue)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-[var(--text-secondary)]">
                  {formatCurrency(item.avgOrderValue)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                Total ({filteredAndSortedData.length} transactions)
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-[var(--text-primary)]">
                {totals.orders}
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-[var(--color-success)]">
                {formatCurrency(totals.revenue)}
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-secondary)]">
                {formatCurrency(totals.orders > 0 ? totals.revenue / totals.orders : 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}







