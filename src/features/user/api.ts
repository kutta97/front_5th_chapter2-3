import { useQuery } from "@tanstack/react-query"
import { fetchUser } from "../../entities/user/api.ts"

export const useGetUser = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: Boolean(userId),
  })
}
