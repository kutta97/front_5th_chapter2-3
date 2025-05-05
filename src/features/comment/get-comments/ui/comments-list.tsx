import { Button } from "../../../../shared/ui/button/button.tsx"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { highlightText } from "../../../../shared/lib/utils.tsx"
import { useComments } from "../context.tsx"
import { Comment } from "../../../../entities/comment/model.ts"
import { usePosts } from "../../../post/get-posts/context.tsx"

type CommentsListProps = {
  postId?: number
  setSelectedComment: (comment: Comment) => void
  setShowAddCommentDialog: (showAddCommentDialog: boolean, postId: number) => void
  setShowEditCommentDialog: (showEditCommentDialog: boolean) => void
}

export const CommentsList = ({
  postId,
  setSelectedComment,
  setShowAddCommentDialog,
  setShowEditCommentDialog,
}: CommentsListProps) => {
  const { comments, deleteComment, likeComment } = useComments()
  const { searchOptions } = usePosts()

  const handleClickAddCommentButton = () => {
    if (!postId) return

    setShowAddCommentDialog(true, postId)
  }

  if (!postId) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleClickAddCommentButton}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchOptions.searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
