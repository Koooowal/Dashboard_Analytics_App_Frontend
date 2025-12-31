import { useState } from 'react'
import { X, FileSpreadsheet, FileText, Printer, Download, FileJson } from 'lucide-react'

export type ExportFormat = 'csv' | 'json' | 'pdf' | 'print'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ExportFormat) => void
  title?: string
  availableFormats?: ExportFormat[]
}

const FORMAT_OPTIONS = [
  {
    id: 'csv' as ExportFormat,
    name: 'CSV Spreadsheet',
    description: 'Export data as comma-separated values',
    icon: FileSpreadsheet,
    color: '#22c55e',
  },
  {
    id: 'json' as ExportFormat,
    name: 'JSON Data',
    description: 'Export raw data in JSON format',
    icon: FileJson,
    color: '#f59e0b',
  },
  {
    id: 'pdf' as ExportFormat,
    name: 'PDF Report',
    description: 'Generate a formatted PDF report',
    icon: FileText,
    color: '#ef4444',
  },
  {
    id: 'print' as ExportFormat,
    name: 'Print',
    description: 'Print the current view',
    icon: Printer,
    color: '#8b5cf6',
  },
]

export function ExportModal({
  isOpen,
  onClose,
  onExport,
  title = 'Export Data',
  availableFormats = ['csv', 'json', 'pdf', 'print'],
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(selectedFormat)
      onClose()
    } finally {
      setIsExporting(false)
    }
  }

  const filteredFormats = FORMAT_OPTIONS.filter((f) =>
    availableFormats.includes(f.id)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Choose an export format for your data
        </p>

        <div className="mt-6 space-y-3">
          {filteredFormats.map((format) => {
            const Icon = format.icon
            const isSelected = selectedFormat === format.id

            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]'
                    : 'border-[var(--border-color)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${format.color}15` }}
                >
                  <Icon size={20} style={{ color: format.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">
                    {format.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {format.description}
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                      : 'border-[var(--border-color)]'
                  }`}
                >
                  {isSelected && (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  )
}





