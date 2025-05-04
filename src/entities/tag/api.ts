import ApiClient from "../../shared/api/apiClient.ts"
import { Tag } from "./model.ts"

export const fetchTags = () => {
  return ApiClient.get<Tag[]>("/posts/tags")
}
