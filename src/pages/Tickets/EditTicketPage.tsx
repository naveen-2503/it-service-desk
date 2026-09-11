import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getTicketById, updateTicket } from '../../services/ticketService'
import { getCategories } from '../../services/categoryService'
import { validateTicketForm, type TicketFormErrors } from '../../utils/ticketValidation'
import FormField from '../../components/common/FormField'
import type { Category } from '../../types/category'
import type { Ticket, CreateTicketInput, TicketPriority, ContactMethod } from '../../types/ticket'
import { useToast } from '../../hooks/useToast'

export default function EditTicketPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CreateTicketInput | null>(null)
  const [errors, setErrors] = useState<TicketFormErrors>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setLoadError(false)
    Promise.all([getTicketById(id), getCategories()])
      .then(([t, cats]) => {
        setTicket(t)
        setCategories(cats)
        setForm({
          subject: t.subject,
          description: t.description,
          category: t.category,
          priority: t.priority,
          preferredContactMethod: t.preferredContactMethod,
        })
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [id])

  function update<K extends keyof CreateTicketInput>(key: K, value: CreateTicketInput[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!form || !ticket) return

    const validationErrors = validateTicketForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await updateTicket(ticket.id, { ...ticket, ...form })
      showToast('Ticket updated successfully.')
      navigate(`/tickets/${ticket.id}`)
    } catch {
      setSubmitError('Could not save changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  if (loading) return <p className="text-ink-muted">Loading ticket...</p>

  if (loadError || !ticket || !form) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
        Could not load this ticket.{' '}
        <button onClick={() => navigate('/tickets')} className="underline font-medium">
          Back to tickets
        </button>
      </div>
    )
  }

  // Permission check per the role matrix — mirror TicketDetailsPage's canEdit logic
  const isOwner = ticket.createdBy === user.id
  const isAssignedAgent = ticket.assignedAgent === user.id
  const canEdit =
    user.role === 'Admin' ||
    (user.role === 'Support Agent' && isAssignedAgent) ||
    (user.role === 'Employee' && isOwner && ticket.status === 'Open')

  if (!canEdit) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200">
        You don't have permission to edit this ticket.{' '}
        <button onClick={() => navigate(`/tickets/${ticket.id}`)} className="underline font-medium">
          Back to ticket
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(`/tickets/${ticket.id}`)} className="text-sm text-blue-600 hover:underline mb-4">
        ← Back to ticket
      </button>
      <h1 className="text-2xl font-bold mb-6">Edit Ticket</h1>

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
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
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
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="px-5 py-2 rounded text-sm font-medium border border-border hover:bg-surface-sunken"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}