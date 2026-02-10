"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followService } from "@/services";
import { toast } from "sonner";

export const followKeys = {
  all: ["follow"] as const,
};

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, isFollowing }: { username: string; isFollowing: boolean }) => {
      if (isFollowing) {
        return followService.unfollow(username);
      } else {
        return followService.follow(username);
      }
    },
    onSuccess: (response, { username, isFollowing }) => {
      if (response.success) {
        toast.success(isFollowing ? "Unfollowed" : "Following");
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["users", username] });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      } else {
        toast.error(response.message || "Action failed");
      }
    },
    onError: (error: Error) => {
      console.error("Toggle follow error:", error);
      toast.error("Failed to update follow status");
    },
  });
}
