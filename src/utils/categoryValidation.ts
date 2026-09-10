export interface CategoryFormInput {
  name: string
  description: string
  status: 'Active' | 'Inactive'
}

export interface CategoryFormErrors {
  name?: string
  description?: string
}

export function validateCategoryForm(input: CategoryFormInput): CategoryFormErrors {
  const errors: CategoryFormErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Category name is required.'
  }

  if (!input.description.trim()) {
    errors.description = 'Description is required.'
  } else if (input.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters.'
  }

  return errors
}