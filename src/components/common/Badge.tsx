interface BadgeProps {
  label: string
  tone: 'gray' | 'blue' | 'yellow' | 'green' | 'red' | 'purple'
}

const toneClasses: Record<BadgeProps['tone'], string> = {
  gray: 'bg-slate-100 text-slate-700 ring-slate-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
}

export default function Badge({ label, tone }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}