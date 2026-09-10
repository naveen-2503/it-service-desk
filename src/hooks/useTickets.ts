import { useEffect, useState, useCallback } from 'react'
import { getTickets } from '../services/ticketService'
import type { Ticket } from '../types/ticket'
import type { AuthUser } from '../types/user'

export function useTickets(user: AuthUser | null) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(() => {
    if (!user) return
    setLoading(true)
    setError(null)
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
      .catch(() => setError('Could not load tickets. Please try again.'))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return { tickets, loading, error, refetch: fetchTickets }
}