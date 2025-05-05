import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/ui/select/select.tsx"
import { Button } from "../../../../shared/ui/button/button.tsx"
import { usePosts } from "../context.tsx"

export const PostsPagination = () => {
  const { total, searchOptions, setSearchOptions } = usePosts()

  return (
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
  )
}
