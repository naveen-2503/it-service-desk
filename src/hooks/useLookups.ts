import { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'
import { getCategories } from '../services/categoryService'
import type { User } from '../types/user'
import type { Category } from '../types/category'

export function useLookups() {
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUsers(), getCategories()])
      .then(([u, c]) => {
        setUsers(u)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  function userName(id: string | null): string {
    if (!id) return 'Unassigned'
    return users.find((u) => u.id === id)?.fullName ?? 'Unknown'
  }

  function categoryName(id: string): string {
    return categories.find((c) => c.id === id)?.name ?? 'Unknown'
  }

  return { users, categories, userName, categoryName, loading }
}