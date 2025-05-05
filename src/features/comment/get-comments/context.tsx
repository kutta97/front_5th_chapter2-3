import { createContext, PropsWithChildren, useContext, useState } from "react"
import { Comment, NewComment } from "../../../entities/comment/model.ts"
import { createComment, deleteComment, fetchComments, updateComment } from "../../../entities/comment/api.ts"
import { likeComment } from "../like-comment/api.ts"

interface CommentsContextState {
  comments: Record<string, Comment[]>
}

interface CommentContextActions {
  getComments: (postId: number) => Promise<void>
  addComment: (newComment: NewComment) => Promise<void>
  updateComment: (comment: Comment) => Promise<void>
  deleteComment: (commentId: number, postId: number) => Promise<void>
  likeComment: (commentId: number, postId: number) => Promise<void>
}

type CommentsContextValue = CommentsContextState & CommentContextActions

const CommentsContext = createContext<CommentsContextValue | undefined>(undefined)

export const CommentsProvider = ({ children }: PropsWithChildren) => {
  const [comments, setComments] = useState<Record<string, Comment[]>>({})

  // 댓글 가져오기
  const _getComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const comments = await fetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: comments.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async (newComment: NewComment) => {
    const comment = await createComment(newComment as NewComment)
    setComments((prev) => ({
      ...prev,
      [comment.postId]: [...(prev[comment.postId] || []), comment],
    }))
  }

  // 댓글 업데이트
  const _updateComment = async (comment: Comment) => {
    const updatedComment = await updateComment(comment)
    setComments((prev) => ({
      ...prev,
      [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    }))
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

  const contextValue: CommentsContextValue = {
    comments,
    getComments: _getComments,
    addComment,
    updateComment: _updateComment,
    deleteComment: _deleteComment,
    likeComment: _likeComment,
  }

  return <CommentsContext.Provider value={contextValue}>{children}</CommentsContext.Provider>
}

export const useComments = (): CommentsContextValue => {
  const context = useContext(CommentsContext)
  if (context === undefined) {
    throw new Error("useComments must be used within the context")
  }
  return context
}
