import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
  PieChart,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[var(--border-color)] bg-[var(--bg-primary)] transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-color)] px-4">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--chart-5)] shadow-md">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Analytics
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Dashboard
              </p>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="my-6 border-t border-[var(--border-color)]" />

          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-[var(--border-color)] p-4">
          <div className="rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--chart-5)]/10 p-4">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Pro Features
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Unlock advanced analytics and reports
            </p>
            <button className="mt-3 w-full rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

