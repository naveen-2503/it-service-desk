import { apiClient } from './apiClient'
import type { Ticket, CreateTicketInput } from '../types/ticket'

export async function getTickets(): Promise<Ticket[]> {
  const res = await apiClient.get<Ticket[]>('/tickets')
  return res.data
}

export async function getTicketById(id: string): Promise<Ticket> {
  const res = await apiClient.get<Ticket>(`/tickets/${id}`)
  return res.data
}

export async function getTicketsByCreator(userId: string): Promise<Ticket[]> {
  const res = await apiClient.get<Ticket[]>('/tickets', { params: { createdBy: userId } })
  return res.data
}

export async function getTicketsByAgent(agentId: string): Promise<Ticket[]> {
  const res = await apiClient.get<Ticket[]>('/tickets', { params: { assignedAgent: agentId } })
  return res.data
}

export async function createTicket(
  input: CreateTicketInput,
  createdBy: string
): Promise<Ticket> {
  const now = new Date().toISOString()
  const payload: Omit<Ticket, 'id'> = {
    subject: input.subject,
    description: input.description,
    category: input.category,
    priority: input.priority,
    preferredContactMethod: input.preferredContactMethod,
    createdBy,
    assignedAgent: null,
    status: 'Open',
    createdDate: now,
    updatedDate: now,
    dueDate: '',
    resolution: '',
    resolutionDate: '',
  }
  const res = await apiClient.post<Ticket>('/tickets', payload)
  return res.data
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket> {
  const res = await apiClient.put<Ticket>(`/tickets/${id}`, {
    ...data,
    updatedDate: new Date().toISOString(),
  })
  return res.data
}

export async function deleteTicket(id: string): Promise<void> {
  await apiClient.delete(`/tickets/${id}`)
}