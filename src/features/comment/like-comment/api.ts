import { Comment } from "../../../entities/comment/model.ts"
import { updateCommentLikes } from "../../../entities/comment/api.ts"

export const likeComment = (comment: Comment) => {
  return updateCommentLikes(comment.id, comment.likes + 1)
}
