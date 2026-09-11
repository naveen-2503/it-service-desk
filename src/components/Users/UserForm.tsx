import { useState, type FormEvent } from 'react'
import FormField from '../common/FormField'
import { validateUserForm, type UserFormInput, type UserFormErrors } from '../../utils/userValidation'
import type { UserRole } from '../../types/user'

interface UserFormProps {
  initial?: UserFormInput
  isEdit: boolean
  onSubmit: (input: UserFormInput) => Promise<void>
  onCancel: () => void
}

const EMPTY: UserFormInput = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  role: 'Employee',
  password: '',
}

export default function UserForm({ initial, isEdit, onSubmit, onCancel }: UserFormProps) {
  const [form, setForm] = useState<UserFormInput>(initial ?? EMPTY)
  const [errors, setErrors] = useState<UserFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function update<K extends keyof UserFormInput>(key: K, value: UserFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validateUserForm(form, !isEdit)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch {
      setSubmitError('Could not save this user. The email may already be in use.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">
          {submitError}
        </div>
      )}

      <FormField label="Full Name" error={errors.fullName}>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
        />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          disabled={isEdit}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
        />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
        />
      </FormField>

      <FormField label="Department" error={errors.department}>
        <input
          type="text"
          value={form.department}
          onChange={(e) => update('department', e.target.value)}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
        />
      </FormField>

      <FormField label="Role" error={errors.role}>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value as UserRole)}
          className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
        >
          <option value="Admin">Admin</option>
          <option value="Support Agent">Support Agent</option>
          <option value="Employee">Employee</option>
        </select>
      </FormField>

      {!isEdit && (
        <FormField label="Password" error={errors.password}>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
          />
        </FormField>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add User'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded text-sm font-medium border border-border hover:bg-surface-sunken"
        >
          Cancel
        </button>
      </div>
    </form>
  )
} 