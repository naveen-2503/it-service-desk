import { apiClient } from './apiClient'
import type { Category } from '../types/category'

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>('/categories')
  return res.data
}

export async function getCategoryById(id: string): Promise<Category> {
  const res = await apiClient.get<Category>(`/categories/${id}`)
  return res.data
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const res = await apiClient.post<Category>('/categories', data)
  return res.data
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await apiClient.patch<Category>(`/categories/${id}`, data)
  return res.data
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}