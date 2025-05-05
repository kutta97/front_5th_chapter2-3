import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../shared/ui/button/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/card/card.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../shared/ui/dialog/dialog.tsx"
import { Textarea } from "../shared/ui/textarea/textarea.tsx"
import { Post } from "../entities/post/model.ts"
import { User } from "../entities/user/model.ts"
import { Comment, NewComment } from "../entities/comment/model.ts"
import { fetchUser } from "../entities/user/api.ts"
import { usePosts } from "../features/post/get-posts/context.tsx"
import { PostsTable } from "../features/post/get-posts/ui/posts-table.tsx"
import { highlightText } from "../shared/lib/utils.tsx"
import { PostAddDialog } from "../features/post/add-post/ui/post-add-dialog.tsx"
import { PostUpdateDialog } from "../features/post/update-post/ui/post-update-dialog.tsx"
import { PostsFilters } from "../features/post/get-posts/ui/posts-filters.tsx"
import { PostsPagination } from "../features/post/get-posts/ui/posts-pagination.tsx"
import { useComments } from "../features/comment/get-comments/context.tsx"
import { CommentsList } from "../features/comment/get-comments/ui/comments-list.tsx"

const PostsManager = () => {
  const { searchOptions } = usePosts()
  const { getComments, addComment, updateComment } = useComments()

  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [newComment, setNewComment] = useState<Omit<NewComment, "postId"> & { postId: number | null }>({
    body: "",
    postId: null,
    userId: 1,
  })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const _setShowAddCommentDialog = (showAddCommentDialog: boolean, postId: number) => {
    if (showAddCommentDialog) {
      setNewComment((prev) => ({ ...prev, postId }))
    }

    setShowAddCommentDialog(showAddCommentDialog)
  }

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

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    getComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (userId?: number) => {
    if (!userId) return

    try {
      const currentUser = await fetchUser(userId)

      setSelectedUser(currentUser)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
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
          <PostsFilters />

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

      {/* 댓글 수정 대화상자 */}
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

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchOptions.searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchOptions.searchQuery)}</p>
            <CommentsList
              postId={selectedPost?.id}
              setSelectedComment={setSelectedComment}
              setShowAddCommentDialog={_setShowAddCommentDialog}
              setShowEditCommentDialog={setShowEditCommentDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
