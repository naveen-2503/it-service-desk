import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="text-ink-muted mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}