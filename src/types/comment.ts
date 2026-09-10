export interface Comment {
  id: string
  ticketId: string
  userId: string
  comment: string
  createdDate: string
  createdTime: string
}

export interface CreateCommentInput {
  ticketId: string
  userId: string
  comment: string
}