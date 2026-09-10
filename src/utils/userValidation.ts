export interface UserFormInput {
  fullName: string
  email: string
  phone: string
  department: string
  role: string
  password?: string
}

export interface UserFormErrors {
  fullName?: string
  email?: string
  phone?: string
  department?: string
  role?: string
  password?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\d{10}$/

export function validateUserForm(input: UserFormInput, requirePassword: boolean): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!input.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!input.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!input.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!PHONE_REGEX.test(input.phone.trim())) {
    errors.phone = 'Phone number must be 10 digits.'
  }

  if (!input.department.trim()) {
    errors.department = 'Department is required.'
  }

  if (!input.role) {
    errors.role = 'Please select a role.'
  }

  if (requirePassword && !input.password?.trim()) {
    errors.password = 'Password is required.'
  } else if (input.password && input.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}