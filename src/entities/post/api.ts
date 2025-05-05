import ApiClient from "../../shared/api/apiClient.ts"
import { Post, Posts, NewPost } from "./model.ts"

export const createPost = (post: NewPost) => {
  return ApiClient.post<Post, NewPost>(`/posts/add`, post)
}

export const fetchPosts = (limit: number, skip: number) => {
  return ApiClient.get<Posts>("/posts", { limit, skip })
}

export const updatePost = (post: Post) => {
  return ApiClient.put<Post, Post>(`/posts/${post.id}`, post)
}

export const deletePost = (postId: number) => {
  return ApiClient.del(`/posts/${postId}`)
}

export const searchPosts = (searchQuery: string) => {
  return ApiClient.get<Posts>(`/posts/search`, { q: searchQuery })
}

export const searchPostsByTag = (tag: string) => {
  return ApiClient.get<Posts>(`/posts/tag/${tag}`)
}
