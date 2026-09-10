import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, Pencil } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useLookups } from '../../hooks/useLookups'
import { useToast } from '../../hooks/useToast'
import { getTicketById, updateTicket } from '../../services/ticketService'
import { getCommentsByTicket } from '../../services/commentService'
import { getUsers } from '../../services/userService'
import Badge from '../../components/common/Badge'
import CommentSection from '../../components/Comments/CommentSection'
import ResolutionSection from '../../components/Tickets/ResolutionSection'
import ActivityTimeline from '../../components/Tickets/ActivityTimeline'
import AssignmentModal from '../../components/Tickets/AssignmentModal'
import { statusTone, priorityTone } from '../../utils/ticketDisplay'
import type { Ticket, TicketStatus } from '../../types/ticket'
import type { Comment } from '../../types/comment'
import type { AuthUser, User } from '../../types/user'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-faint mb-1">{label}</p>
      <p className="text-sm font-medium text-ink">{value}</p>
    </div>
  )
}

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { userName, categoryName, loading: lookupsLoading } = useLookups()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [agents, setAgents] = useState<User[]>([])

  const loadTicket = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    Promise.all([getTicketById(id), getCommentsByTicket(id)])
      .then(([t, c]) => { setTicket(t); setComments(c) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { loadTicket() }, [loadTicket])

  useEffect(() => {
    getUsers().then((users) => setAgents(users.filter((u) => u.role === 'Support Agent' && u.status === 'Active')))
  }, [])

  if (!user) return null
  if (loading || lookupsLoading) return <p className="text-ink-muted">Loading ticket...</p>
  if (error || !ticket) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
        Could not load this ticket.{' '}
        <button onClick={() => navigate('/tickets')} className="underline font-medium">Back to tickets</button>
      </div>
    )
  }

  const isOwner = ticket.createdBy === user.id
  const isAssignedAgent = ticket.assignedAgent === user.id
  const canComment = user.role === 'Admin' || (user.role === 'Support Agent' && isAssignedAgent) || (user.role === 'Employee' && isOwner)
  const canResolve = user.role === 'Admin' || (user.role === 'Support Agent' && isAssignedAgent)
  const canEdit = user.role === 'Admin' || (user.role === 'Support Agent' && isAssignedAgent) || (user.role === 'Employee' && isOwner && ticket.status === 'Open')

  function availableStatusOptions(user: AuthUser, ticket: Ticket): TicketStatus[] {
    if (user.role === 'Admin') {
      return ['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled']
    }
    if (user.role === 'Support Agent' && isAssignedAgent) {
      const transitions: Record<string, TicketStatus[]> = {
        Assigned: ['In Progress'],
        'In Progress': ['Pending', 'Resolved'],
        Pending: ['In Progress'],
        Resolved: ['Closed'],
      }
      return transitions[ticket.status] ?? []
    }
    if (user.role === 'Employee' && isOwner) {
      if (ticket.status === 'Open') return ['Cancelled']
      if (ticket.status === 'Resolved') return ['Open']
    }
    return []
  }

  async function handleStatusChange(newStatus: TicketStatus) {
    if (!ticket) return
    setStatusUpdating(true)
    try {
      await updateTicket(ticket.id, { ...ticket, status: newStatus })
      loadTicket()
      showToast(`Status updated to ${newStatus}.`)
    } finally {
      setStatusUpdating(false)
    }
  }

  async function handleAssign(agentId: string | null) {
    if (!ticket) return
    await updateTicket(ticket.id, { ...ticket, assignedAgent: agentId, status: agentId ? 'Assigned' : 'Open' })
    loadTicket()
    showToast(agentId ? 'Ticket assigned successfully.' : 'Ticket unassigned.')
  }

  async function handleResolve(resolutionText: string) {
    if (!ticket) return
    await updateTicket(ticket.id, { ...ticket, resolution: resolutionText, resolutionDate: new Date().toISOString(), status: 'Resolved' })
    loadTicket()
    showToast('Ticket resolved successfully.')
  }

  const statusOptions = availableStatusOptions(user, ticket)

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/tickets')} className="flex items-center gap-1.5 text-sm text-brand-600 hover:underline mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to tickets
          </button>
          <h1 className="text-2xl font-bold text-ink">{ticket.subject}</h1>
          <p className="text-sm text-ink-faint">Ticket {ticket.id}</p>
        </div>
        <div className="flex gap-2">
          {user.role === 'Admin' && (
            <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-1.5 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-sunken transition">
              <UserPlus className="h-4 w-4" /> Assign
            </button>
          )}
          {canEdit && (
            <button onClick={() => navigate(`/tickets/${ticket.id}/edit`)} className="flex items-center gap-1.5 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-sunken transition">
              <Pencil className="h-4 w-4" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div>
          <p className="text-xs text-ink-faint mb-1">Status</p>
          <Badge label={ticket.status} tone={statusTone(ticket.status)} />
        </div>
        <div>
          <p className="text-xs text-ink-faint mb-1">Priority</p>
          <Badge label={ticket.priority} tone={priorityTone(ticket.priority)} />
        </div>
        <DetailField label="Category" value={categoryName(ticket.category)} />
        <DetailField label="Created By" value={userName(ticket.createdBy)} />
        <DetailField label="Assigned Agent" value={userName(ticket.assignedAgent)} />
        <DetailField label="Created" value={new Date(ticket.createdDate).toLocaleDateString()} />
        <DetailField label="Updated" value={new Date(ticket.updatedDate).toLocaleDateString()} />
        <DetailField label="Due Date" value={ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : '—'} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-5">
        <h2 className="font-semibold text-ink mb-2">Description</h2>
        <p className="text-sm text-ink-muted whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {statusOptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-5">
          <h2 className="font-semibold text-ink mb-3">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={statusUpdating}
                className="border border-border px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-surface-sunken transition disabled:opacity-50"
              >
                Move to {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <ResolutionSection ticket={ticket} canResolve={canResolve} onResolve={handleResolve} />
      <CommentSection ticketId={ticket.id} currentUser={user} userName={userName} canComment={canComment} />
      <ActivityTimeline ticket={ticket} comments={comments} userName={userName} />

      {showAssignModal && (
        <AssignmentModal currentAgentId={ticket.assignedAgent} agents={agents} onAssign={handleAssign} onClose={() => setShowAssignModal(false)} />
      )}
    </div>
  )
}