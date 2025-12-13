import { useState } from 'react'
import { Download, ChevronDown, FileSpreadsheet, FileText, Printer, FileJson } from 'lucide-react'
import type { ExportFormat } from './ExportModal'

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void
  formats?: ExportFormat[]
  size?: 'sm' | 'md'
  variant?: 'primary' | 'secondary'
}

const FORMAT_ICONS = {
  csv: FileSpreadsheet,
  json: FileJson,
  pdf: FileText,
  print: Printer,
}

const FORMAT_LABELS = {
  csv: 'Export CSV',
  json: 'Export JSON',
  pdf: 'Export PDF',
  print: 'Print',
}

export function ExportButton({
  onExport,
  formats = ['csv', 'pdf', 'print'],
  size = 'md',
  variant = 'secondary',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm'
  const variantClasses =
    variant === 'primary'
      ? 'bg-[var(--color-primary)] text-white hover:opacity-90'
      : 'border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'

  if (formats.length === 1) {
    const format = formats[0]
    const Icon = FORMAT_ICONS[format]
    return (
      <button
        onClick={() => onExport(format)}
        className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeClasses} ${variantClasses}`}
      >
        <Icon size={size === 'sm' ? 14 : 16} />
        <span>{FORMAT_LABELS[format]}</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg font-medium transition-all ${sizeClasses} ${variantClasses}`}
      >
        <Download size={size === 'sm' ? 14 : 16} />
        <span>Export</span>
        <ChevronDown
          size={size === 'sm' ? 12 : 14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] py-1 shadow-lg">
            {formats.map((format) => {
              const Icon = FORMAT_ICONS[format]
              return (
                <button
                  key={format}
                  onClick={() => {
                    onExport(format)
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Icon size={16} />
                  <span>{FORMAT_LABELS[format]}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

