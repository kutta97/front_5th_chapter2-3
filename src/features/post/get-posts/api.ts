import { fetchPosts, searchPostsByTag } from "../../../entities/post/api.ts"
import { fetchUsers } from "../../../entities/user/api.ts"
import { PostsWithAuthor, PostWithAuthor } from "./model.ts"

export const getPosts = async (limit: number, skip: number) => {
  const [posts, users] = await Promise.all([fetchPosts(limit, skip), fetchUsers()])

  return {
    posts: posts.posts.map<PostWithAuthor>((post) => ({
      ...post,
      author: users.users.find((user) => user.id === post.userId),
    })),
    total: posts.total,
  } as const satisfies PostsWithAuthor
}

export const getPostsByTag = async (tag: string) => {
  const [posts, users] = await Promise.all([searchPostsByTag(tag), fetchUsers()])

  return {
    posts: posts.posts.map((post) => ({
      ...post,
      author: users.users.find((user) => user.id === post.userId),
    })),
    total: posts.total,
  } as const satisfies PostsWithAuthor
}
