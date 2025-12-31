import { useState } from 'react'
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard'
import { ExportModal, ExportButton } from '@/components/ui'
import type { ExportFormat } from '@/components/ui'
import {
  useDashboardStats,
  useRevenueData,
  useCategorySales,
  useTopProducts,
  useAllUsers,
} from '@/hooks'
import {
  exportToCSV,
  exportToJSON,
  generateReportHTML,
  generateTableHTML,
  exportToPDF,
  printReport,
} from '@/utils/exportHelpers'
import { formatCurrency, formatCompact } from '@/utils/formatters'

type ReportType = 'sales' | 'products' | 'users' | 'overview'

const REPORT_TYPES = [
  {
    id: 'overview' as ReportType,
    name: 'Overview Report',
    description: 'Complete dashboard summary with all key metrics',
    icon: TrendingUp,
    color: '#3b82f6',
  },
  {
    id: 'sales' as ReportType,
    name: 'Sales Report',
    description: 'Detailed sales data and revenue analysis',
    icon: DollarSign,
    color: '#22c55e',
  },
  {
    id: 'products' as ReportType,
    name: 'Products Report',
    description: 'Top products performance and inventory',
    icon: ShoppingCart,
    color: '#f59e0b',
  },
  {
    id: 'users' as ReportType,
    name: 'Users Report',
    description: 'Team performance and user activity',
    icon: Users,
    color: '#8b5cf6',
  },
]

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const { data: stats } = useDashboardStats()
  const { data: revenueData } = useRevenueData()
  const { data: categoryData } = useCategorySales()
  const { data: topProducts } = useTopProducts(10)
  const { data: users } = useAllUsers()

  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        handleCSVExport()
        break
      case 'json':
        handleJSONExport()
        break
      case 'pdf':
        handlePDFExport()
        break
      case 'print':
        handlePrint()
        break
    }
  }

  const handleCSVExport = () => {
    switch (selectedReport) {
      case 'sales':
        if (revenueData) {
          exportToCSV(
            revenueData as unknown as Record<string, unknown>[],
            [
              { key: 'date', header: 'Date' },
              { key: 'label', header: 'Period' },
              { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
              { key: 'orders', header: 'Orders' },
            ],
            'sales-report'
          )
        }
        break
      case 'products':
        if (topProducts) {
          exportToCSV(
            topProducts as unknown as Record<string, unknown>[],
            [
              { key: 'name', header: 'Product' },
              { key: 'category', header: 'Category' },
              { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
              { key: 'unitsSold', header: 'Units Sold' },
              { key: 'growth', header: 'Growth %', format: (v) => `${(v as number).toFixed(1)}%` },
            ],
            'products-report'
          )
        }
        break
      case 'users':
        if (users) {
          exportToCSV(
            users as unknown as Record<string, unknown>[],
            [
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'department', header: 'Department' },
              { key: 'role', header: 'Role' },
            ],
            'users-report'
          )
        }
        break
      default:
        if (categoryData) {
          exportToCSV(
            categoryData as unknown as Record<string, unknown>[],
            [
              { key: 'category', header: 'Category' },
              { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
              { key: 'orders', header: 'Orders' },
              { key: 'percentage', header: 'Share %', format: (v) => `${v}%` },
            ],
            'overview-report'
          )
        }
    }
  }

  const handleJSONExport = () => {
    const dataMap: Record<ReportType, unknown[]> = {
      overview: [{ stats, categories: categoryData }],
      sales: revenueData ?? [],
      products: topProducts ?? [],
      users: users ?? [],
    }
    exportToJSON(dataMap[selectedReport] ?? dataMap.overview, `${selectedReport}-report`)
  }

  const handlePDFExport = () => {
    const html = generateReportContent()
    exportToPDF(html, `${selectedReport}-report`)
  }

  const handlePrint = () => {
    const html = generateReportContent()
    printReport(html)
  }

  const generateReportContent = () => {
    const reportConfig = REPORT_TYPES.find((r) => r.id === selectedReport)
    
    const statsData = stats
      ? [
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue) },
          { label: 'Total Orders', value: formatCompact(stats.totalOrders) },
          { label: 'Customers', value: formatCompact(stats.totalCustomers) },
          { label: 'Conversion', value: `${stats.conversionRate.toFixed(1)}%` },
        ]
      : undefined

    let tableHTML = ''
    switch (selectedReport) {
      case 'sales':
        if (revenueData) {
          tableHTML = generateTableHTML(revenueData as unknown as Record<string, unknown>[], [
            { key: 'label', header: 'Period' },
            { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
            { key: 'orders', header: 'Orders' },
          ])
        }
        break
      case 'products':
        if (topProducts) {
          tableHTML = generateTableHTML(topProducts as unknown as Record<string, unknown>[], [
            { key: 'name', header: 'Product' },
            { key: 'category', header: 'Category' },
            { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
            { key: 'unitsSold', header: 'Units Sold' },
          ])
        }
        break
      case 'users':
        if (users) {
          tableHTML = generateTableHTML(users as unknown as Record<string, unknown>[], [
            { key: 'name', header: 'Name' },
            { key: 'department', header: 'Department' },
            { key: 'role', header: 'Role' },
          ])
        }
        break
      default:
        if (categoryData) {
          tableHTML = generateTableHTML(categoryData as unknown as Record<string, unknown>[], [
            { key: 'category', header: 'Category' },
            { key: 'revenue', header: 'Revenue', format: (v) => formatCurrency(v as number) },
            { key: 'percentage', header: 'Share', format: (v) => `${v}%` },
          ])
        }
    }

    return generateReportHTML(
      reportConfig?.name || 'Dashboard Report',
      'Analytics Dashboard Export',
      [{ title: 'Data', content: tableHTML }],
      statsData
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardHeader
          title="Reports"
          subtitle="Generate and export detailed reports for your data."
        />
        <ExportButton
          onExport={handleExport}
          formats={['csv', 'json', 'pdf', 'print']}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon
          const isSelected = selectedReport === report.id

          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex flex-col items-start rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--color-primary)]/50'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${report.color}15` }}
              >
                <Icon size={20} style={{ color: report.color }} />
              </div>
              <h3 className="mt-3 font-semibold text-[var(--text-primary)]">
                {report.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {report.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
              <FileText size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {REPORT_TYPES.find((r) => r.id === selectedReport)?.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Ready to export
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Total Revenue</p>
            <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {formatCurrency(stats?.totalRevenue ?? 0)}
            </p>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Total Orders</p>
            <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {formatCompact(stats?.totalOrders ?? 0)}
            </p>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Customers</p>
            <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {formatCompact(stats?.totalCustomers ?? 0)}
            </p>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
            <p className="text-xs text-[var(--text-muted)]">Conversion Rate</p>
            <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
              {stats?.conversionRate?.toFixed(1) ?? 0}%
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Calendar size={14} />
          <span>Report generated on {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title={`Export ${REPORT_TYPES.find((r) => r.id === selectedReport)?.name}`}
      />
    </div>
  )
}
