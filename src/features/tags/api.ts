import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "../../entities/tag/api.ts"

export const useGetTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
  })
}
