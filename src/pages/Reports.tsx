import { PieChart } from 'lucide-react'

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Reports
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Generate and export detailed reports.
        </p>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--chart-5)]/10">
          <PieChart size={32} className="text-[var(--chart-5)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          Reports Center
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--text-muted)]">
          Custom report generation with PDF/CSV export and scheduling features
          will be available here.
        </p>
      </div>
    </div>
  )
}

