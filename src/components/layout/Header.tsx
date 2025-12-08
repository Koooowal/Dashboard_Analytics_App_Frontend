import { Menu, Moon, Sun, Bell, Search, User } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function Header({ onMenuClick, theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 shadow-[var(--shadow-sm)] transition-theme lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-64 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
        </button>

        <button
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="ml-2 flex items-center gap-3 border-l border-[var(--border-color)] pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              John Doe
            </p>
            <p className="text-xs text-[var(--text-muted)]">Administrator</p>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90"
            aria-label="User menu"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
