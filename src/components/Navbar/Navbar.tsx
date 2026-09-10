import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="text-sm text-ink-muted">
        {user?.department} <span className="mx-1.5 text-ink-faint">·</span> {user?.role}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {user ? initials(user.fullName) : ''}
          </div>
          <span className="text-sm font-medium text-ink">{user?.fullName}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-red-600 font-medium transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  )
}