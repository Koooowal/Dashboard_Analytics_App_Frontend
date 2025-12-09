import { HelpCircle } from 'lucide-react'

export function Help() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Help</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Get help and support for your dashboard.
        </p>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-info)]/10">
          <HelpCircle size={32} className="text-[var(--color-info)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          Help Center
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--text-muted)]">
          Documentation, FAQs, tutorials, and contact support options will be
          available here.
        </p>
      </div>
    </div>
  )
}

