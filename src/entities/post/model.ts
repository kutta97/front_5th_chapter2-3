export interface Post {
  id: number
  userId: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

export interface Posts {
  limit: number
  posts: Post[]
  skip: number
  total: number
}

export interface NewPost {
  userId: Post["userId"]
  title: Post["title"]
  body: Post["body"]
}
