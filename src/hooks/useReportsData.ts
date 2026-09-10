import { useEffect, useState } from 'react'
import { getTickets } from '../services/ticketService'
import { getUsers } from '../services/userService'
import type { Ticket, TicketStatus, TicketPriority } from '../types/ticket'
import type { User } from '../types/user'

export interface StatusCount {
  status: TicketStatus
  count: number
}

export interface PriorityCount {
  priority: TicketPriority
  count: number
}

export interface AgentWorkload {
  agentName: string
  assigned: number
  resolved: number
}

export interface DailyTrend {
  date: string
  created: number
}

export function useReportsData() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTickets(), getUsers()])
      .then(([t, u]) => {
        setTickets(t)
        setUsers(u)
      })
      .finally(() => setLoading(false))
  }, [])

  const statusBreakdown: StatusCount[] = (
    ['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled'] as TicketStatus[]
  ).map((status) => ({
    status,
    count: tickets.filter((t) => t.status === status).length,
  }))

  const priorityBreakdown: PriorityCount[] = (
    ['Low', 'Medium', 'High', 'Critical'] as TicketPriority[]
  ).map((priority) => ({
    priority,
    count: tickets.filter((t) => t.priority === priority).length,
  }))

  const agents = users.filter((u) => u.role === 'Support Agent')
  const agentWorkload: AgentWorkload[] = agents.map((agent) => ({
    agentName: agent.fullName,
    assigned: tickets.filter((t) => t.assignedAgent === agent.id).length,
    resolved: tickets.filter((t) => t.assignedAgent === agent.id && (t.status === 'Resolved' || t.status === 'Closed')).length,
  }))

  const trendMap = new Map<string, number>()
  for (const t of tickets) {
    const day = t.createdDate.split('T')[0]
    trendMap.set(day, (trendMap.get(day) ?? 0) + 1)
  }
  const dailyTrend: DailyTrend[] = Array.from(trendMap.entries())
    .map(([date, created]) => ({ date, created }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const avgResolutionDays = (() => {
    const resolved = tickets.filter((t) => t.resolutionDate)
    if (resolved.length === 0) return 0
    const totalDays = resolved.reduce((sum, t) => {
      const created = new Date(t.createdDate).getTime()
      const resolvedAt = new Date(t.resolutionDate).getTime()
      return sum + (resolvedAt - created) / (1000 * 60 * 60 * 24)
    }, 0)
    return Math.round((totalDays / resolved.length) * 10) / 10
  })()

  return {
    loading,
    totalTickets: tickets.length,
    statusBreakdown,
    priorityBreakdown,
    agentWorkload,
    dailyTrend,
    avgResolutionDays,
  }
}