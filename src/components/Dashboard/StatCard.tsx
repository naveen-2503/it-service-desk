import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone?: 'default' | 'danger' | 'warning' | 'success'
}

const toneClasses = {
  default: 'bg-brand-50 text-brand-600',
  danger: 'bg-red-50 text-red-600',
  warning: 'bg-orange-50 text-orange-600',
  success: 'bg-green-50 text-green-600',
}

export default function StatCard({ label, value, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex items-center gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-ink-muted">{label}</p>
        <p className="text-2xl font-bold text-ink mt-0.5">{value}</p>
      </div>
    </div>
  )
}