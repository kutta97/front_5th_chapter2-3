import { Search } from "lucide-react"
import { Input } from "../../../../shared/ui/input/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui/select/select.tsx"
import { usePosts } from "../context.tsx"
import { PropsWithChildren } from "react"

export const PostsFilters = ({ children }: PropsWithChildren) => {
  const { searchOptions, searchPosts, setSearchOptions } = usePosts()

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchOptions.searchQuery}
            onChange={(e) => setSearchOptions({ searchQuery: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && searchPosts()}
          />
        </div>
      </div>
      {children}
      <Select value={searchOptions.sortBy} onValueChange={(value) => setSearchOptions({ sortBy: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={searchOptions.sortOrder} onValueChange={(value) => setSearchOptions({ sortOrder: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
