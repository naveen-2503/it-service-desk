import { useEffect, useState } from 'react'
import { getTickets } from '../services/ticketService'
import type { Ticket } from '../types/ticket'
import type { AuthUser } from '../types/user'

export function useDashboardStats(user: AuthUser | null) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getTickets()
      .then((all) => {
        if (user.role === 'Admin') {
          setTickets(all)
        } else if (user.role === 'Support Agent') {
          setTickets(all.filter((t) => t.assignedAgent === user.id))
        } else {
          setTickets(all.filter((t) => t.createdBy === user.id))
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  return { tickets, loading }
}