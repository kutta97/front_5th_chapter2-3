import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/select/select.tsx"
import { useGetTags } from "../api.ts"

type TagsSelectProps = {
  value: string
  onValueChange: (value: string) => void
}

export const TagsSelect = ({ value, onValueChange }: TagsSelectProps) => {
  const { data: tags } = useGetTags()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags?.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
