"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveService } from "@/services";
import { postKeys } from "./use-posts";
import { Post } from "@/types";

export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isSaved }: { postId: number; isSaved: boolean }) => {
      if (isSaved) {
        return saveService.unsavePost(postId);
      } else {
        return saveService.savePost(postId);
      }
    },
    onMutate: async ({ postId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      const previousPost = queryClient.getQueryData(postKeys.detail(postId));

      // Optimistic update
      queryClient.setQueryData(postKeys.detail(postId), (old: { success: boolean; data: Post | null } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            savedByMe: !isSaved,
          },
        };
      });

      return { previousPost };
    },
    onError: (err, { postId }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }
      console.error("Toggle save error:", err);
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.feedInfinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.exploreInfinite() });
      queryClient.invalidateQueries({ queryKey: ["me", "saved"] });
    },
  });
}
