import { useState } from "react"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../shared/ui/button/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/card/card.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/ui/select/select.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../shared/ui/dialog/dialog.tsx"
import { Textarea } from "../shared/ui/textarea/textarea.tsx"
import { Post } from "../entities/post/model.ts"
import { User } from "../entities/user/model.ts"
import { Comment, NewComment } from "../entities/comment/model.ts"
import { fetchUser } from "../entities/user/api.ts"
import { createComment, deleteComment, fetchComments, updateComment } from "../entities/comment/api.ts"
import { likeComment } from "../features/comment/like-comment/api.ts"
import { usePosts } from "../features/post/get-posts/context.tsx"
import { PostsTable } from "../features/post/get-posts/ui/posts-table.tsx"
import { highlightText } from "../shared/lib/utils.tsx"
import { PostAddDialog } from "../features/post/add-post/ui/post-add-dialog.tsx"
import { PostUpdateDialog } from "../features/post/update-post/ui/post-update-dialog.tsx"
import { PostsFilters } from "../features/post/get-posts/ui/posts-filters.tsx"

const PostsManager = () => {
  const { total, searchOptions, setSearchOptions } = usePosts()

  // 상태 관리
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [comments, setComments] = useState<Record<string, Comment[]>>({})

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

  // 댓글 가져오기
  const _fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const comments = await fetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: comments.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      if (newComment.postId === null) return

      const comment = await createComment(newComment as NewComment)
      setComments((prev) => ({
        ...prev,
        [comment.postId]: [...(prev[comment.postId] || []), comment],
      }))
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
      const updatedComment = await updateComment(selectedComment)
      setComments((prev) => ({
        ...prev,
        [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment,
        ),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const _deleteComment = async (commentId: number, postId: number) => {
    try {
      await deleteComment(commentId)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const _likeComment = async (commentId: number, postId: number) => {
    try {
      const likedComment = comments[postId].find((c) => c.id === commentId)
      if (!likedComment) return

      const newComment = await likeComment(likedComment)

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === newComment.id
            ? {
                ...newComment,
                likes: comment.likes + 1,
              }
            : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    _fetchComments(post.id)
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

  // 댓글 렌더링
  const renderComments = (postId?: number) => {
    if (!postId) return null

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button
            size="sm"
            onClick={() => {
              setNewComment((prev) => ({ ...prev, postId }))
              setShowAddCommentDialog(true)
            }}
          >
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
                <Button variant="ghost" size="sm" onClick={() => _likeComment(comment.id, postId)}>
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
                <Button variant="ghost" size="sm" onClick={() => _deleteComment(comment.id, postId)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={searchOptions.limit.toString()}
                onValueChange={(value) => setSearchOptions({ limit: Number(value) })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={searchOptions.skip === 0}
                onClick={() => setSearchOptions({ skip: Math.max(0, searchOptions.skip - searchOptions.limit) })}
              >
                이전
              </Button>
              <Button
                disabled={searchOptions.skip + searchOptions.limit >= total}
                onClick={() => setSearchOptions({ skip: searchOptions.skip + searchOptions.limit })}
              >
                다음
              </Button>
            </div>
          </div>
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
            <Button onClick={addComment}>댓글 추가</Button>
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
            {renderComments(selectedPost?.id)}
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
