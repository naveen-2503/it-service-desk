import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CategoryForm from '../../components/Categories/CategoryForm'
import type { Category } from '../../types/category'
import type { CategoryFormInput } from '../../utils/categoryValidation'
import { useToast } from '../../hooks/useToast'

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const { showToast } = useToast()

  function load() {
    setLoading(true)
    getCategories().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAdd(input: CategoryFormInput) {
  await createCategory({ name: input.name, description: input.description, status: 'Active' })
  setShowAddModal(false)
  load()
  showToast('Category created successfully.')
}

async function handleEdit(input: CategoryFormInput) {
  if (!editingCategory) return
  await updateCategory(editingCategory.id, { name: input.name, description: input.description })
  setEditingCategory(null)
  load()
  showToast('Category updated successfully.')
}

async function handleToggleStatus(c: Category) {
  await updateCategory(c.id, { status: c.status === 'Active' ? 'Inactive' : 'Active' })
  load()
  showToast(`Category ${c.status === 'Active' ? 'deactivated' : 'activated'}.`)
}

async function handleDelete() {
  if (!deletingCategory) return
  await deleteCategory(deletingCategory.id)
  setDeletingCategory(null)
  load()
  showToast('Category deleted successfully.')
}

    return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-ink">Category Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading categories...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-sunken border-b border-border text-left text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-sunken transition">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.description}</td>
                  <td className="px-4 py-3">
                    <Badge label={c.status} tone={c.status === 'Active' ? 'green' : 'red'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => setEditingCategory(c)} className="text-brand-600 hover:underline text-xs font-semibold">Edit</button>
                      <button onClick={() => handleToggleStatus(c)} className="text-amber-600 hover:underline text-xs font-semibold">
                        {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => setDeletingCategory(c)} className="text-red-600 hover:underline text-xs font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Category" onClose={() => setShowAddModal(false)}>
          <CategoryForm isEdit={false} onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
        </Modal>
      )}

      {editingCategory && (
        <Modal title="Edit Category" onClose={() => setEditingCategory(null)}>
          <CategoryForm
            isEdit
            initial={{ name: editingCategory.name, description: editingCategory.description, status: editingCategory.status }}
            onSubmit={handleEdit}
            onCancel={() => setEditingCategory(null)}
          />
        </Modal>
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Delete Category"
          message={`Are you sure you want to delete "${deletingCategory.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  )
}