import { Users as UsersIcon } from 'lucide-react'

export function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Manage and analyze your user base.
        </p>
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
          <UsersIcon size={32} className="text-[var(--color-success)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          User Management
        </h2>
        <p className="mt-2 max-w-md text-center text-sm text-[var(--text-muted)]">
          User analytics, activity tracking, and performance comparison tools
          will be available here.
        </p>
      </div>
    </div>
  )
}
