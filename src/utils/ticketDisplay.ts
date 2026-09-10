import type { TicketStatus, TicketPriority } from '../types/ticket'

export function statusTone(status: TicketStatus) {
  switch (status) {
    case 'Open':
      return 'blue' as const
    case 'Assigned':
      return 'purple' as const
    case 'In Progress':
      return 'yellow' as const
    case 'Pending':
      return 'yellow' as const
    case 'Resolved':
      return 'green' as const
    case 'Closed':
      return 'gray' as const
    case 'Cancelled':
      return 'red' as const
    default:
      return 'gray' as const
  }
}

export function priorityTone(priority: TicketPriority) {
  switch (priority) {
    case 'Low':
      return 'gray' as const
    case 'Medium':
      return 'blue' as const
    case 'High':
      return 'yellow' as const
    case 'Critical':
      return 'red' as const
    default:
      return 'gray' as const
  }
}