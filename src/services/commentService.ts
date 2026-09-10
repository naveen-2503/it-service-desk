import { apiClient } from './apiClient'
import type { Comment, CreateCommentInput } from '../types/comment'

export async function getCommentsByTicket(ticketId: string): Promise<Comment[]> {
  const res = await apiClient.get<Comment[]>('/comments', { params: { ticketId } })
  return res.data
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const now = new Date()
  const payload: Omit<Comment, 'id'> = {
    ...input,
    createdDate: now.toISOString().split('T')[0],
    createdTime: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  }
  const res = await apiClient.post<Comment>('/comments', payload)
  return res.data
}