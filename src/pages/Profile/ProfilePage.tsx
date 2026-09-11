import { useState, type FormEvent } from 'react'
import { User as UserIcon, Mail, Phone, Building2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateUser } from '../../services/userService'
import FormField from '../../components/common/FormField'
import { useToast } from '../../hooks/useToast'
import PageHeader from '../../components/common/PageHeader'

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfilePage() {
  const { user, login } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [department, setDepartment] = useState(user?.department ?? '')
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  if (!user) return
  setSubmitting(true)
  try {
    const updated = await updateUser(user.id, { fullName, phone, department })
    login({ ...user, ...updated })
    showToast('Profile updated successfully.')
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="max-w-2xl">
      <PageHeader title="My Profile" description="Manage your personal information." />

      <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-semibold">
            {initials(user.fullName)}
          </div>
          <div>
            <p className="font-semibold text-lg text-ink">{user.fullName}</p>
            <p className="text-sm text-ink-muted">{user.role} · {user.department}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </FormField>

          <FormField label="Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm bg-surface-sunken text-ink-muted"
              />
            </div>
          </FormField>

          <FormField label="Phone">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </FormField>

          <FormField label="Department">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}