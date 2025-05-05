import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui/dialog/dialog.tsx"
import { highlightText } from "../../../../shared/lib/utils.tsx"
import { usePosts } from "../../get-posts/context.tsx"
import { Post } from "../../../../entities/post/model.ts"
import { PropsWithChildren } from "react"

type PostDetailModalProps = PropsWithChildren<{
  post: Post | null
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void
}>

export const PostDetailModal = ({
  post,
  showPostDetailDialog,
  setShowPostDetailDialog,
  children,
}: PostDetailModalProps) => {
  const { searchOptions } = usePosts()

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title, searchOptions.searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body, searchOptions.searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
