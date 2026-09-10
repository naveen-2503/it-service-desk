import { getUserByEmail } from './userService'
import type { LoginCredentials, AuthUser } from '../types/user'

export async function login({ email, password }: LoginCredentials): Promise<AuthUser> {
  const user = await getUserByEmail(email.trim().toLowerCase())
  if (!user) {
    throw new Error('Invalid email or password.')
  }
  if (user.password !== password) {
    throw new Error('Invalid email or password.')
  }
  if (user.status !== 'Active') {
    throw new Error('This account is inactive. Contact your administrator.')
  }
  // Strip the password before storing/returning — never keep it in state.
  const { password: _password, ...authUser } = user
  return authUser
}