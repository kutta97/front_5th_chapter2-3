import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui/dialog/dialog.tsx"
import { Textarea } from "../../../../shared/ui/textarea/textarea.tsx"
import { Button } from "../../../../shared/ui/button/button.tsx"
import { Comment } from "../../../../entities/comment/model.ts"
import { useComments } from "../../get-comments/context.tsx"

type CommentUpdateDialogProps = {
  showEditCommentDialog: boolean
  setShowEditCommentDialog: (showEditDialog: boolean) => void
  selectedComment: Comment | null
  setSelectedComment: (newComment: Comment | null) => void
}

export const CommentUpdateDialog = ({
  showEditCommentDialog,
  setShowEditCommentDialog,
  selectedComment,
  setSelectedComment,
}: CommentUpdateDialogProps) => {
  const { updateComment } = useComments()

  // 댓글 업데이트
  const _updateComment = async () => {
    try {
      if (!selectedComment) return
      await updateComment(selectedComment)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => {
              if (!selectedComment) return
              setSelectedComment({ ...selectedComment, body: e.target.value })
            }}
          />
          <Button onClick={_updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
