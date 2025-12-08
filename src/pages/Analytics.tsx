import { BarChart3 } from 'lucide-react'

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Detailed analytics and insights for your business.
        </p>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
          <BarChart3 size={32} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          Analytics Dashboard
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--text-muted)]">
          Advanced analytics with interactive charts, filters, and data export
          capabilities will be available here.
        </p>
      </div>
    </div>
  )
}
