"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveService } from "@/services";
import { postKeys } from "./use-posts";
import { Post, PaginatedResponse } from "@/types";
import { updatePostInInfiniteData, InfinitePostData } from "@/lib/query-utils";



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
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousFeed = queryClient.getQueryData<InfinitePostData>(postKeys.feedInfinite());
      const previousExplore = queryClient.getQueryData<InfinitePostData>(postKeys.exploreInfinite());
      const previousDetail = queryClient.getQueryData(postKeys.detail(postId));

      const updater = (post: Post): Post => ({ ...post, savedByMe: !isSaved });

      queryClient.setQueryData<InfinitePostData>(
        postKeys.feedInfinite(),
        (old) => updatePostInInfiniteData(old, postId, updater),
      );
      queryClient.setQueryData<InfinitePostData>(
        postKeys.exploreInfinite(),
        (old) => updatePostInInfiniteData(old, postId, updater),
      );
      queryClient.setQueryData(
        postKeys.detail(postId),
        (old: { success: boolean; data: Post | null } | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: updater(old.data) };
        },
      );

      return { previousFeed, previousExplore, previousDetail };
    },
    onError: (err, { postId }, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(postKeys.feedInfinite(), context.previousFeed);
      }
      if (context?.previousExplore) {
        queryClient.setQueryData(postKeys.exploreInfinite(), context.previousExplore);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousDetail);
      }
      console.error("Toggle save error:", err);
    },
    onSettled: () => {
      // Only invalidate saved list — not post queries, because the API
      // doesn't return savedByMe so refetch would overwrite our optimistic state
      queryClient.invalidateQueries({ queryKey: ["me", "saved"] });
    },
  });
}
