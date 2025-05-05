import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui/dialog/dialog.tsx"
import { Input } from "../../../../shared/ui/input/input.tsx"
import { Textarea } from "../../../../shared/ui/textarea/textarea.tsx"
import { Button } from "../../../../shared/ui/button/button.tsx"
import { usePosts } from "../../get-posts/context.tsx"
import { Post } from "../../../../entities/post/model.ts"

type PostUpdateDialogProps = {
  showEditDialog: boolean
  setShowEditDialog: (showUpdateDialog: boolean) => void
  selectedPost: Post | null
  setSelectedPost: (newPost: Post | null) => void
}

export const PostUpdateDialog = ({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
}: PostUpdateDialogProps) => {
  const { updatePost } = usePosts()

  // 게시물 업데이트
  const _updatePost = async () => {
    if (!selectedPost) return

    try {
      await updatePost(selectedPost)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => {
              if (!selectedPost) return
              setSelectedPost({ ...selectedPost, title: e.target.value })
            }}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => {
              if (!selectedPost) return
              setSelectedPost({ ...selectedPost, body: e.target.value })
            }}
          />
          <Button onClick={_updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
