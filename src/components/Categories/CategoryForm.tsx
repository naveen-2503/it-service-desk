import { useState, type FormEvent } from 'react'
import FormField from '../common/FormField'
import { validateCategoryForm, type CategoryFormInput, type CategoryFormErrors } from '../../utils/categoryValidation'

interface CategoryFormProps {
  initial?: CategoryFormInput
  isEdit: boolean
  onSubmit: (input: CategoryFormInput) => Promise<void>
  onCancel: () => void
}

const EMPTY: CategoryFormInput = { name: '', description: '', status: 'Active' }

export default function CategoryForm({ initial, isEdit, onSubmit, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormInput>(initial ?? EMPTY)
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function update<K extends keyof CategoryFormInput>(key: K, value: CategoryFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validateCategoryForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch {
      setSubmitError('Could not save this category. Please try again.')
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

      <FormField label="Category Name" error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </FormField>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Category'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}