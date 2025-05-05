import ApiClient from "../../shared/api/apiClient.ts"
import { Comment, Comments, NewComment } from "./model.ts"

export const createComment = (comment: NewComment) => {
  return ApiClient.post<Comment, NewComment>("/comments/add", comment)
}

export const fetchComments = (postId: number) => {
  return ApiClient.get<Comments>(`/comments/post/${postId}`)
}

export const updateComment = (comment: Comment) => {
  return ApiClient.put<Comment, Pick<Comment, "body">>(`/comments/${comment.id}`, {
    body: comment.body,
  })
}

export const updateCommentLikes = (commentId: number, likes: number) => {
  return ApiClient.patch<Comment, Pick<Comment, "likes">>(`/comments/${commentId}`, { likes })
}

export const deleteComment = (commentId: number) => {
  return ApiClient.del(`/comments/${commentId}`)
}
