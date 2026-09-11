import { NavLink } from 'react-router-dom'
import { LifeBuoy } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { navByRole } from '../../utils/navConfig'

export default function Sidebar() {
  const { user } = useAuth()
  if (!user) return null

  const items = navByRole[user.role]

  return (
    <aside className="w-72 shrink-0 bg-sidebar-bg text-sidebar-text min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-5 py-6 text-lg font-bold border-b border-white/10">
        <LifeBuoy className="h-6 w-6 text-brand-500" />
        IT Service Desk
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/tickets'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}