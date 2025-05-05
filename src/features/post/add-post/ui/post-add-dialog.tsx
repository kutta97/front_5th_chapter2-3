import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui/dialog/dialog.tsx"
import { Input } from "../../../../shared/ui/input/input.tsx"
import { Textarea } from "../../../../shared/ui/textarea/textarea.tsx"
import { Button } from "../../../../shared/ui/button/button.tsx"
import { useState } from "react"
import { NewPost } from "../../../../entities/post/model.ts"
import { usePosts } from "../../get-posts/context.tsx"

type PostAddDialogProps = {
  showAddDialog: boolean
  setShowAddDialog: (showAddDialog: boolean) => void
}

export const PostAddDialog = ({ showAddDialog, setShowAddDialog }: PostAddDialogProps) => {
  const { addPost } = usePosts()

  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })

  // 게시물 추가
  const _addPost = async () => {
    try {
      await addPost(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={_addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
