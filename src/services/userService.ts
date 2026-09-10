import { apiClient } from './apiClient'
import type { User } from '../types/user'

export async function getUsers(): Promise<User[]> {
  const res = await apiClient.get<User[]>('/users')
  return res.data
}

export async function getUserById(id: string): Promise<User> {
  const res = await apiClient.get<User>(`/users/${id}`)
  return res.data
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await apiClient.get<User[]>('/users', { params: { email } })
  return res.data[0] ?? null
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const res = await apiClient.post<User>('/users', data)
  return res.data
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await apiClient.patch<User>(`/users/${id}`, data)
  return res.data
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}