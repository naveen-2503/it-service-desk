export type UserRole = 'Admin' | 'Support Agent' | 'Employee'
export type UserStatus = 'Active' | 'Inactive'

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  phone: string
  department: string
  role: UserRole
  status: UserStatus
  createdDate: string
}

/** Shape used for login — only email/password are collected. */
export interface LoginCredentials {
  email: string
  password: string
}

/** The logged-in user, without the password (never keep this in state/localStorage). */
export type AuthUser = Omit<User, 'password'>