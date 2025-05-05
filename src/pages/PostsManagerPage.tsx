import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../shared/ui/button/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/card/card.tsx"
import { Post } from "../entities/post/model.ts"
import { Comment } from "../entities/comment/model.ts"
import { PostsTable } from "../features/post/get-posts/ui/posts-table.tsx"
import { PostAddDialog } from "../features/post/add-post/ui/post-add-dialog.tsx"
import { PostUpdateDialog } from "../features/post/update-post/ui/post-update-dialog.tsx"
import { PostsFilters } from "../features/post/get-posts/ui/posts-filters.tsx"
import { PostsPagination } from "../features/post/get-posts/ui/posts-pagination.tsx"
import { useComments } from "../features/comment/get-comments/context.tsx"
import { CommentsList } from "../features/comment/get-comments/ui/comments-list.tsx"
import { CommentAddDialog } from "../features/comment/add-comment/ui/comment-add-dialog.tsx"
import { CommentUpdateDialog } from "../features/comment/update-comment/ui/comment-update-dialog.tsx"
import { PostDetailModal } from "../features/post/get-post/ui/post-detail-modal.tsx"
import { UserDetailModal } from "../features/user/get-user/ui/user-detail-modal.tsx"
import { TagsSelect } from "../features/tags/ui/tags-select.tsx"
import { usePosts } from "../features/post/get-posts/context.tsx"

const PostsManager = () => {
  const { searchOptions, setSearchOptions } = usePosts()
  const { getComments } = useComments()

  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 게시물 상세 보기
  const openPostDetail = async (post: Post) => {
    setSelectedPost(post)
    await getComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (userId?: number) => {
    if (!userId) return

    setSelectedUserId(userId)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostsFilters>
            <TagsSelect value={searchOptions.tag} onValueChange={(value) => setSearchOptions({ tag: value })} />
          </PostsFilters>

          {/* 게시물 테이블 */}
          <PostsTable
            openPostDetail={openPostDetail}
            setSelectedPost={setSelectedPost}
            openUserModal={openUserModal}
            setShowEditDialog={setShowEditDialog}
          />

          {/* 페이지네이션 */}
          <PostsPagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} />

      {/* 게시물 수정 대화상자 */}
      <PostUpdateDialog
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog
        postId={selectedPost?.id}
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentUpdateDialog
        showEditCommentDialog={showEditCommentDialog}
        setShowEditCommentDialog={setShowEditCommentDialog}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailModal
        post={selectedPost}
        showPostDetailDialog={showPostDetailDialog}
        setShowPostDetailDialog={setShowPostDetailDialog}
      >
        <CommentsList
          postId={selectedPost?.id}
          setSelectedComment={setSelectedComment}
          setShowAddCommentDialog={setShowAddCommentDialog}
          setShowEditCommentDialog={setShowEditCommentDialog}
        />
      </PostDetailModal>

      {/* 사용자 모달 */}
      <UserDetailModal
        userId={selectedUserId}
        showUserDetailModal={showUserModal}
        setShowUserDetailModal={setShowUserModal}
      />
    </Card>
  )
}

export default PostsManager
