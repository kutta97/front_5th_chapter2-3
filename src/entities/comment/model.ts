interface User {
  id: number
  username: string
  fullName: string
}

export interface Comment {
  id: number
  postId: number
  body: string
  likes: number
  user: User
}

export interface Comments {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface NewComment {
  userId: User["id"]
  postId: Comment["postId"]
  body: Comment["body"]
}
