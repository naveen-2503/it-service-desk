import { LifeBuoy, ExternalLink, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
        <div className="flex items-center gap-1.5">
          <LifeBuoy className="h-3.5 w-3.5" />
          <span>IT Service Desk © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-1 hover:text-ink-muted transition">
            <ExternalLink className="h-3.5 w-3.5" /> GitHub
          </a>
          <a href="#" className="flex items-center gap-1 hover:text-ink-muted transition">
            <Mail className="h-3.5 w-3.5" /> Support
          </a>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}