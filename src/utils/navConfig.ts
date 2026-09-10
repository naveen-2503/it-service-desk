import type { UserRole } from '../types/user'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  FolderKanban,
  BarChart3,
  UserCircle,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const navByRole: Record<UserRole, NavItem[]> = {
  Admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tickets', path: '/tickets', icon: Ticket },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Categories', path: '/categories', icon: FolderKanban },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  'Support Agent': [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tickets', path: '/tickets', icon: Ticket },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
  Employee: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Ticket', path: '/tickets/new', icon: PlusCircle },
    { label: 'My Tickets', path: '/tickets', icon: Ticket },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ],
}