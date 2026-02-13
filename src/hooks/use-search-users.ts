import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";

export function useSearchUsers(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => userService.searchUsers(query),
    enabled: enabled && !!query.trim(),
    staleTime: 1000 * 60, // 1 minute
  });
}
