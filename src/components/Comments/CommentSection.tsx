import { useEffect, useState, type FormEvent } from 'react'
import { getCommentsByTicket, createComment } from '../../services/commentService'
import type { Comment } from '../../types/comment'
import type { AuthUser } from '../../types/user'

interface CommentSectionProps {
  ticketId: string
  currentUser: AuthUser
  userName: (id: string) => string
  canComment: boolean
}

export default function CommentSection({ ticketId, currentUser, userName, canComment }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  function loadComments() {
    setLoading(true)
    getCommentsByTicket(ticketId)
      .then(setComments)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      await createComment({ ticketId, userId: currentUser.id, comment: text.trim() })
      setText('')
      loadComments()
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4">Comments</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-700">{userName(c.userId)}</span>
                <span>{c.createdDate} · {c.createdTime}</span>
              </div>
              <p className="text-sm text-gray-700">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
    </div>
  )
}