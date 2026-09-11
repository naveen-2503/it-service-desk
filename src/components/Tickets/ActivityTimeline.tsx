import type { Ticket } from '../../types/ticket'
import type { Comment } from '../../types/comment'

interface ActivityTimelineProps {
  ticket: Ticket
  comments: Comment[]
  userName: (id: string) => string
}

interface Event {
  time: string
  label: string
}

export default function ActivityTimeline({ ticket, comments, userName }: ActivityTimelineProps) {
  const events: Event[] = []

  events.push({ time: ticket.createdDate, label: `Ticket created by ${userName(ticket.createdBy)}` })
  if (ticket.assignedAgent) {
    events.push({ time: ticket.createdDate, label: `Assigned to ${userName(ticket.assignedAgent)}` })
  }
  for (const c of comments) {
    events.push({ time: `${c.createdDate}T00:00:00Z`, label: `Comment added by ${userName(c.userId)}` })
  }
  if (ticket.resolutionDate) {
    events.push({ time: ticket.resolutionDate, label: 'Resolution added' })
  }
  if (ticket.status === 'Closed') {
    events.push({ time: ticket.updatedDate, label: 'Ticket closed' })
  }

  events.sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-5">
      <h2 className="font-semibold text-ink mb-4">Activity History</h2>
      <ul className="space-y-2">
        {events.map((e, i) => (
          <li key={i} className="text-sm text-ink-muted flex gap-2">
            <span className="text-ink-faint shrink-0">
              {new Date(e.time).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
            </span>
            <span>— {e.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}