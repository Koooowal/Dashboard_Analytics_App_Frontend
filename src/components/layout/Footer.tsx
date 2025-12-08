import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-4 transition-theme lg:px-6">
      <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p className="text-[var(--text-muted)]">
          © {currentYear} Dashboard Analytics. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <span>Made with</span>
          <Heart
            size={14}
            className="text-[var(--color-danger)]"
            fill="currentColor"
          />
          <span>using React & TypeScript</span>
        </div>
      </div>
    </footer>
  )
}
