import { useState } from 'react'
import type { User } from '../../types/user'

interface AssignmentModalProps {
  currentAgentId: string | null
  agents: User[]
  onAssign: (agentId: string | null) => Promise<void>
  onClose: () => void
}

export default function AssignmentModal({ currentAgentId, agents, onAssign, onClose }: AssignmentModalProps) {
  const [selected, setSelected] = useState<string>(currentAgentId ?? '')
  const [submitting, setSubmitting] = useState(false)

  async function handleSave() {
    setSubmitting(true)
    try {
      await onAssign(selected || null)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Assign Ticket</h2>

        <label className="block text-sm font-medium text-ink mb-1">Support Agent</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-border rounded px-3 py-2 text-sm mb-4 bg-surface text-ink"
        >
          <option value="">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.fullName}</option>
          ))}
        </select>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-sm font-medium border border-border hover:bg-surface-sunken"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}