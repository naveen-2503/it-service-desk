export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Pending'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled'

export type ContactMethod = 'Email' | 'Phone' | 'Chat'

export interface Ticket {
  id: string
  subject: string
  description: string
  createdBy: string // User id
  assignedAgent: string | null // User id, or null if unassigned
  category: string // Category id
  priority: TicketPriority
  status: TicketStatus
  createdDate: string
  updatedDate: string
  dueDate: string
  resolution: string
  resolutionDate: string
  preferredContactMethod: ContactMethod
}

/** Fields collected when an Employee creates a new ticket. */
export interface CreateTicketInput {
  subject: string
  description: string
  category: string
  priority: TicketPriority
  preferredContactMethod: ContactMethod
}

/** Fields an Agent submits when resolving a ticket. */
export interface ResolutionInput {
  resolution: string
  resolutionDate: string
}