import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createTicket } from '../../services/ticketService'
import { getCategories } from '../../services/categoryService'
import { validateTicketForm, type TicketFormErrors } from '../../utils/ticketValidation'
import FormField from '../../components/common/FormField'
import type { Category } from '../../types/category'
import type { CreateTicketInput, TicketPriority, ContactMethod } from '../../types/ticket'
import { useToast } from '../../hooks/useToast'

const EMPTY_FORM: CreateTicketInput = {
  subject: '',
  description: '',
  category: '',
  priority: 'Medium',
  preferredContactMethod: 'Email',
}

export default function CreateTicketPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CreateTicketInput>(EMPTY_FORM)
  const [errors, setErrors] = useState<TicketFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  function update<K extends keyof CreateTicketInput>(key: K, value: CreateTicketInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validateTicketForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    if (!user) return

    setSubmitting(true)
    try {
      const ticket = await createTicket(form, user.id)
      showToast('Ticket created successfully.')
      navigate(`/tickets/${ticket.id}`)
    } catch {
      setSubmitError('Could not create the ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create Ticket</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-sm border border-border p-6 space-y-4">
        {submitError && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded border border-red-200">
            {submitError}
          </div>
        )}

        <FormField label="Subject" error={errors.subject}>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
            placeholder="Brief summary of the issue"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
            placeholder="Provide as much detail as possible"
          />
        </FormField>

        <FormField label="Category" error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Priority" error={errors.priority}>
          <select
            value={form.priority}
            onChange={(e) => update('priority', e.target.value as TicketPriority)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </FormField>

        <FormField label="Preferred Contact Method">
          <select
            value={form.preferredContactMethod}
            onChange={(e) => update('preferredContactMethod', e.target.value as ContactMethod)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="Chat">Chat</option>
          </select>
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Ticket'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="px-5 py-2 rounded text-sm font-medium border border-border hover:bg-surface-sunken"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}