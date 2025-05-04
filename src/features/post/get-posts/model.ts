import { Post, Posts } from "../../../entities/post/model.ts"
import { BaseUser } from "../../../entities/user/model.ts"

export interface PostWithAuthor extends Post {
  author?: BaseUser
}

export interface PostsWithAuthor {
  posts: PostWithAuthor[]
  total: Posts["total"]
}
