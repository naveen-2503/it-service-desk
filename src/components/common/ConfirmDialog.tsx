import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="h-11 w-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h2 className="font-semibold text-lg text-ink mb-2">{title}</h2>
        <p className="text-sm text-ink-muted mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-sunken transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}