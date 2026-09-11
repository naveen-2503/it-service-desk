import { useState, type FormEvent } from 'react'
import type { Ticket } from '../../types/ticket'

interface ResolutionSectionProps {
  ticket: Ticket
  canResolve: boolean
  onResolve: (resolution: string) => Promise<void>
}

export default function ResolutionSection({ ticket, canResolve, onResolve }: ResolutionSectionProps) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const alreadyResolved = ticket.status === 'Resolved' || ticket.status === 'Closed'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!text.trim()) {
      setError('Please describe how the issue was resolved.')
      return
    }
    setSubmitting(true)
    try {
      await onResolve(text.trim())
      setText('')
    } catch {
      setError('Could not save the resolution. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-5">
      <h2 className="font-semibold text-ink mb-4">Resolution</h2>

      {ticket.resolution && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
          <p className="text-sm text-ink-muted">{ticket.resolution}</p>
          {ticket.resolutionDate && (
            <p className="text-xs text-ink-faint mt-1">
              Resolved on {new Date(ticket.resolutionDate).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {canResolve && !alreadyResolved && (
        <form onSubmit={handleSubmit} className="space-y-2">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Describe how this issue was resolved..."
            className="w-full border border-border rounded px-3 py-2 text-sm bg-surface text-ink"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Mark as Resolved'}
          </button>
        </form>
      )}

      {!ticket.resolution && !canResolve && (
        <p className="text-sm text-ink-faint">No resolution yet.</p>
      )}
    </div>
  )
}