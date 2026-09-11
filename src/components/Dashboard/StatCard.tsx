import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone?: 'default' | 'danger' | 'warning' | 'success'
}

const toneClasses = {
  default: 'bg-brand-500/10 text-brand-500',
  danger: 'bg-red-500/10 text-red-500',
  warning: 'bg-orange-500/10 text-orange-500',
  success: 'bg-green-500/10 text-green-500',
}

export default function StatCard({ label, value, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-ink-muted mb-0.5">{label}</p>
        <p className="text-3xl font-bold text-ink">{value}</p>
      </div>
    </div>
  )
}