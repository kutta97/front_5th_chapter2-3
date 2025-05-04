import { Comment } from "../../../entities/comment/model.ts"
import ApiClient from "../../../shared/api/apiClient.ts"

export const likeComment = (comment: Comment) => {
  return ApiClient.patch<Comment, Pick<Comment, "likes">>(`/comments/${comment.id}`, {
    likes: comment.likes + 1,
  })
}
