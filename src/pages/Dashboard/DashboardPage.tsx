import { useAuth } from '../../hooks/useAuth'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import StatCard from '../../components/Dashboard/StatCard'
import type { Ticket } from '../../types/ticket'
import {
  Ticket as TicketIcon,
  Inbox,
  UserCheck,
  Clock,
  Hourglass,
  CheckCircle2,
  Archive,
  AlertTriangle,
  UserX,
} from 'lucide-react'

function countBy(tickets: Ticket[], status: Ticket['status']) {
  return tickets.filter((t) => t.status === status).length
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { tickets, loading } = useDashboardStats(user)

  if (!user) return null

  if (loading) {
    return <p className="text-ink-muted">Loading dashboard...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-1">Dashboard</h1>
      <p className="text-ink-muted mb-6">Welcome back, {user.fullName}.</p>

      {user.role === 'Admin' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Tickets" value={tickets.length} icon={TicketIcon} />
          <StatCard label="Open" value={countBy(tickets, 'Open')} icon={Inbox} />
          <StatCard label="Assigned" value={countBy(tickets, 'Assigned')} icon={UserCheck} />
          <StatCard label="In Progress" value={countBy(tickets, 'In Progress')} icon={Clock} />
          <StatCard label="Pending" value={countBy(tickets, 'Pending')} icon={Hourglass} />
          <StatCard label="Resolved" value={countBy(tickets, 'Resolved')} icon={CheckCircle2} tone="success" />
          <StatCard label="Closed" value={countBy(tickets, 'Closed')} icon={Archive} />
          <StatCard
            label="Critical"
            value={tickets.filter((t) => t.priority === 'Critical').length}
            icon={AlertTriangle}
            tone="danger"
          />
          <StatCard
            label="Unassigned"
            value={tickets.filter((t) => !t.assignedAgent).length}
            icon={UserX}
            tone="warning"
          />
        </div>
      )}

      {user.role === 'Support Agent' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="My Assigned Tickets" value={tickets.length} icon={TicketIcon} />
          <StatCard label="New" value={countBy(tickets, 'Assigned')} icon={Inbox} />
          <StatCard label="In Progress" value={countBy(tickets, 'In Progress')} icon={Clock} />
          <StatCard label="Pending" value={countBy(tickets, 'Pending')} icon={Hourglass} />
          <StatCard label="Resolved" value={countBy(tickets, 'Resolved')} icon={CheckCircle2} tone="success" />
          <StatCard
            label="High Priority"
            value={tickets.filter((t) => t.priority === 'High' || t.priority === 'Critical').length}
            icon={AlertTriangle}
            tone="danger"
          />
        </div>
      )}

      {user.role === 'Employee' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="My Total Tickets" value={tickets.length} icon={TicketIcon} />
          <StatCard label="Open" value={countBy(tickets, 'Open')} icon={Inbox} />
          <StatCard label="In Progress" value={countBy(tickets, 'In Progress')} icon={Clock} />
          <StatCard label="Resolved" value={countBy(tickets, 'Resolved')} icon={CheckCircle2} tone="success" />
          <StatCard label="Closed" value={countBy(tickets, 'Closed')} icon={Archive} />
        </div>
      )}
    </div>
  )
}