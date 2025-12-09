import { ShoppingCart } from 'lucide-react'

export function Sales() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sales</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Track and manage your sales performance.
        </p>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-warning)]/10">
          <ShoppingCart size={32} className="text-[var(--color-warning)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          Sales Dashboard
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--text-muted)]">
          Complete sales overview with revenue metrics, order tracking, and
          performance analytics will be available here.
        </p>
      </div>
    </div>
  )
}

