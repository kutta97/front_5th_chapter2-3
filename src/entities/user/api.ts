import ApiClient from "../../shared/api/apiClient.ts"
import { User, Users } from "./model.ts"

export const fetchUsers = () => {
  return ApiClient.get<Users>("/users", {
    limit: 0,
    select: ["username", "image"].join(","),
  })
}

export const fetchUser = (userId: number) => {
  return ApiClient.get<User>(`/users/${userId}`)
}
