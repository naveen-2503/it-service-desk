import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTickets } from '../../hooks/useTickets'
import { useLookups } from '../../hooks/useLookups'
import Badge from '../../components/common/Badge'
import { statusTone, priorityTone } from '../../utils/ticketDisplay'
import type { TicketStatus, TicketPriority } from '../../types/ticket'
import PageHeader from '../../components/common/PageHeader'

const PAGE_SIZE = 5
const ALL_STATUSES: TicketStatus[] = ['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled']
const ALL_PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical']

type SortOption = 'newest' | 'oldest' | 'priority' | 'updated'

const selectClass =
 'border border-border rounded-lg px-3 py-2 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500'

export default function TicketListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tickets, loading, error, refetch } = useTickets(user)
  const { userName, categoryName, loading: lookupsLoading } = useLookups()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...tickets]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          userName(t.createdBy).toLowerCase().includes(q) ||
          userName(t.assignedAgent).toLowerCase().includes(q)
      )
    }
    if (statusFilter) result = result.filter((t) => t.status === statusFilter)
    if (priorityFilter) result = result.filter((t) => t.priority === priorityFilter)

    const priorityRank: Record<TicketPriority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
    switch (sort) {
      case 'newest': result.sort((a, b) => b.createdDate.localeCompare(a.createdDate)); break
      case 'oldest': result.sort((a, b) => a.createdDate.localeCompare(b.createdDate)); break
      case 'priority': result.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]); break
      case 'updated': result.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate)); break
    }
    return result
  }, [tickets, search, statusFilter, priorityFilter, sort, userName])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetToFirstPage<T>(setter: (v: T) => void) {
    return (value: T) => { setter(value); setPage(1) }
  }

  if (!user) return null

  return (
    <div>
      <PageHeader
  title={user.role === 'Employee' ? 'My Tickets' : 'Tickets'}
  description="Track and manage support tickets."
  action={
    user.role === 'Employee' ? (
      <button
        onClick={() => navigate('/tickets/new')}
        className="flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
      >
        <Plus className="h-4 w-4" />
        Create Ticket
      </button>
    ) : undefined
  }
/>

      <div className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search by ID, subject, or name..."
            value={search}
            onChange={(e) => resetToFirstPage(setSearch)(e.target.value)}
            className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select value={statusFilter} onChange={(e) => resetToFirstPage(setStatusFilter)(e.target.value as TicketStatus | '')} className={selectClass}>
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => resetToFirstPage(setPriorityFilter)(e.target.value as TicketPriority | '')} className={selectClass}>
          <option value="">All Priorities</option>
          {ALL_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className={selectClass}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Highest Priority</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={refetch} className="text-sm font-semibold underline">Retry</button>
        </div>
      ) : loading || lookupsLoading ? (
        <p className="text-ink-muted">Loading tickets...</p>
      ) : pageItems.length === 0 ? (
        <div className="bg-surface rounded-xl shadow-sm border border-border p-10 text-center text-ink-muted">
          No tickets found.
        </div>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken border-b border-border text-left text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Ticket ID</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Agent</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="border-b border-border last:border-0 hover:bg-surface-sunken cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-medium text-brand-600">{t.id}</td>
                  <td className="px-4 py-3 text-ink">{t.subject}</td>
                  <td className="px-4 py-3 text-ink-muted">{categoryName(t.category)}</td>
                  <td className="px-4 py-3"><Badge label={t.priority} tone={priorityTone(t.priority)} /></td>
                  <td className="px-4 py-3"><Badge label={t.status} tone={statusTone(t.status)} /></td>
                  <td className="px-4 py-3 text-ink-muted">{userName(t.assignedAgent)}</td>
                  <td className="px-4 py-3 text-ink-faint">{new Date(t.createdDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-ink-muted">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-surface-sunken transition"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="px-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-surface-sunken transition"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}