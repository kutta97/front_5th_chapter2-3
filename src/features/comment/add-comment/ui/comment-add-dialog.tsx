import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui/dialog/dialog.tsx"
import { Textarea } from "../../../../shared/ui/textarea/textarea.tsx"
import { Button } from "../../../../shared/ui/button/button.tsx"
import { useComments } from "../../get-comments/context.tsx"
import { NewComment } from "../../../../entities/comment/model.ts"
import { useState } from "react"

type CommentAddDialogProps = {
  postId?: number | null
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (showAddCommentDialog: boolean) => void
}

export const CommentAddDialog = ({
  postId = null,
  showAddCommentDialog,
  setShowAddCommentDialog,
}: CommentAddDialogProps) => {
  const { addComment } = useComments()

  const [newComment, setNewComment] = useState<Omit<NewComment, "postId"> & { postId: number | null }>({
    body: "",
    postId,
    userId: 1,
  })

  // 댓글 추가
  const _addComment = async () => {
    if (newComment.postId === null) return

    try {
      await addComment(newComment as NewComment)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={_addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
