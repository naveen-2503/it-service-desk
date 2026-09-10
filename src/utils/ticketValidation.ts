import type { CreateTicketInput } from '../types/ticket'

export interface TicketFormErrors {
  subject?: string
  description?: string
  category?: string
  priority?: string
}

export function validateTicketForm(input: CreateTicketInput): TicketFormErrors {
  const errors: TicketFormErrors = {}

  if (!input.subject.trim()) {
    errors.subject = 'Subject is required.'
  } else if (input.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters.'
  }

  if (!input.description.trim()) {
    errors.description = 'Description is required.'
  } else if (input.description.trim().length < 15) {
    errors.description = 'Description must be at least 15 characters.'
  }

  if (!input.category) {
    errors.category = 'Please select a category.'
  }

  if (!input.priority) {
    errors.priority = 'Please select a priority.'
  }

  return errors
}