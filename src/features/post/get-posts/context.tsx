import { createContext, useState, useEffect, useContext, PropsWithChildren } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PostWithAuthor } from "./model"
import { getPosts, getPostsByTag } from "./api"
import { createPost, deletePost, searchPosts, updatePost } from "../../../entities/post/api"
import { NewPost, Post } from "../../../entities/post/model.ts"

interface PostsSearchOptions {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  tag: string
}

interface PostsContextState {
  posts: PostWithAuthor[]
  total: number
  searchOptions: PostsSearchOptions
  loading: boolean
}

interface PostsContextActions {
  getPostsByTag: (tag: string) => Promise<void>
  searchPosts: () => Promise<void>
  addPost: (post: NewPost) => Promise<void>
  updatePost: (post: Post) => Promise<void>
  deletePost: (postId: number) => Promise<void>
  setSearchOptions: (searchOptions: Partial<PostsSearchOptions>) => void
  updateURL: VoidFunction
}

type PostsContextValue = PostsContextState & PostsContextActions

const PostsContext = createContext<PostsContextValue | undefined>(undefined)

export const PostsProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [loading, setLoading] = useState(false)

  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [total, setTotal] = useState(0)

  const [searchOptions, setSearchOptions] = useState<PostsSearchOptions>({
    skip: parseInt(queryParams.get("skip") || "0"),
    limit: parseInt(queryParams.get("limit") || "10"),
    searchQuery: queryParams.get("search") || "",
    sortBy: queryParams.get("sortBy") || "",
    sortOrder: queryParams.get("sortOrder") || "asc",
    tag: queryParams.get("tag") || "",
  })

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchOptions.skip) params.set("skip", searchOptions.skip.toString())
    if (searchOptions.limit) params.set("limit", searchOptions.limit.toString())
    if (searchOptions.searchQuery) params.set("search", searchOptions.searchQuery)
    if (searchOptions.sortBy) params.set("sortBy", searchOptions.sortBy)
    if (searchOptions.sortOrder) params.set("sortOrder", searchOptions.sortOrder)
    if (searchOptions.tag) params.set("tag", searchOptions.tag)
    navigate(`?${params.toString()}`)
  }

  const fetchPosts = async (options?: Partial<PostsSearchOptions>) => {
    if (options?.tag && options?.tag !== "all") {
      return getPostsByTag(options.tag)
    }

    if (options?.searchQuery) {
      return searchPosts(options.searchQuery)
    }

    return getPosts(searchOptions.limit, searchOptions.skip)
  }

  // 게시물 가져오기
  const _getPosts = async () => {
    setLoading(true)

    try {
      const { posts, total } = await fetchPosts()
      setPosts(posts)
      setTotal(total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 태그별 게시물 가져오기
  const _getPostsByTag = async (tag: string) => {
    setLoading(true)
    try {
      const { posts, total } = await fetchPosts({ tag })

      setPosts(posts)
      setTotal(total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 검색
  const _searchPosts = async () => {
    setLoading(true)
    try {
      const { posts, total } = await fetchPosts({ searchQuery: searchOptions.searchQuery })

      setPosts(posts)
      setTotal(total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 추가
  const _addPost = async (newPost: NewPost) => {
    const post = await createPost(newPost)
    setPosts([post, ...posts])
  }

  // 게시물 업데이트
  const _updatePost = async (post: PostWithAuthor) => {
    const updatedPost = await updatePost(post)

    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const _deletePost = async (postId: number) => {
    await deletePost(postId)
    setPosts(posts.filter((post) => post.id !== postId))
  }

  const setPostSearchOptions = (options: Partial<PostsSearchOptions>) => {
    setSearchOptions((prevState) => ({
      ...prevState,
      ...options,
    }))
  }

  useEffect(() => {
    if (searchOptions.tag) {
      _getPostsByTag(searchOptions.tag)
    } else {
      _getPosts()
    }
    updateURL()
  }, [searchOptions.skip, searchOptions.limit, searchOptions.sortBy, searchOptions.sortOrder, searchOptions.tag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    setPostSearchOptions({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("searchQuery") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      tag: params.get("tag") || "",
    })
  }, [location.search])

  const contextValue: PostsContextValue = {
    posts,
    total,
    searchOptions,
    loading,
    getPostsByTag: _getPostsByTag,
    searchPosts: _searchPosts,
    addPost: _addPost,
    updatePost: _updatePost,
    deletePost: _deletePost,
    setSearchOptions: setPostSearchOptions,
    updateURL,
  }

  return <PostsContext.Provider value={contextValue}>{children}</PostsContext.Provider>
}

export const usePosts = (): PostsContextValue => {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
