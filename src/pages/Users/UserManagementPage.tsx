import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import UserForm from '../../components/Users/UserForm'
import type { User } from '../../types/user'
import type { UserFormInput } from '../../utils/userValidation'
import { useToast } from '../../hooks/useToast'
import PageHeader from '../../components/common/PageHeader'

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { showToast } = useToast()

  function load() {
    setLoading(true)
    getUsers().then(setUsers).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAdd(input: UserFormInput) {
  await createUser({
    fullName: input.fullName,
    email: input.email.trim().toLowerCase(),
    password: input.password ?? '',
    phone: input.phone,
    department: input.department,
    role: input.role as User['role'],
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0],
  })
  setShowAddModal(false)
  load()
  showToast('User created successfully.')
}

async function handleEdit(input: UserFormInput) {
  if (!editingUser) return
  await updateUser(editingUser.id, {
    fullName: input.fullName,
    phone: input.phone,
    department: input.department,
    role: input.role as User['role'],
  })
  setEditingUser(null)
  load()
  showToast('User updated successfully.')
}

async function handleToggleStatus(u: User) {
  await updateUser(u.id, { status: u.status === 'Active' ? 'Inactive' : 'Active' })
  load()
  showToast(`User ${u.status === 'Active' ? 'deactivated' : 'activated'}.`)
}

async function handleDelete() {
  if (!deletingUser) return
  await deleteUser(deletingUser.id)
  setDeletingUser(null)
  load()
  showToast('User deleted successfully.')
}

   return (
    <div>
      <PageHeader
  title="User Management"
  description="Manage accounts, roles, and access."
  action={
    <button
      onClick={() => setShowAddModal(true)}
      className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
    >
      + Add User
    </button>
  }
/>

      {loading ? (
        <p className="text-ink-muted">Loading users...</p>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken border-b border-border text-left text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface-sunken transition">
                  <td className="px-4 py-3 font-medium text-ink">{u.fullName}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.department}</td>
                  <td className="px-4 py-3">
                    <Badge label={u.role} tone={u.role === 'Admin' ? 'purple' : u.role === 'Support Agent' ? 'blue' : 'gray'} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={u.status} tone={u.status === 'Active' ? 'green' : 'red'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => setEditingUser(u)} className="text-brand-600 hover:underline text-xs font-semibold">Edit</button>
                      <button onClick={() => handleToggleStatus(u)} className="text-amber-600 hover:underline text-xs font-semibold">
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => setDeletingUser(u)} className="text-red-600 hover:underline text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)}>
          <UserForm isEdit={false} onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
        </Modal>
      )}

      {editingUser && (
        <Modal title="Edit User" onClose={() => setEditingUser(null)}>
          <UserForm
            isEdit
            initial={{ fullName: editingUser.fullName, email: editingUser.email, phone: editingUser.phone, department: editingUser.department, role: editingUser.role }}
            onSubmit={handleEdit}
            onCancel={() => setEditingUser(null)}
          />
        </Modal>
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete ${deletingUser.fullName}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  )
}