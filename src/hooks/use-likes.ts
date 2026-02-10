"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { likeService } from "@/services";
import { postKeys } from "./use-posts";
import { Post } from "@/types";

export const likeKeys = {
  all: ["likes"] as const,
  likers: (postId: number) => [...likeKeys.all, "likers", postId] as const,
};

export function useLikers(postId: number) {
  return useInfiniteQuery({
    queryKey: likeKeys.likers(postId),
    queryFn: ({ pageParam = 1 }) => likeService.getLikers(postId, { page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return likeService.unlikePost(postId);
      } else {
        return likeService.likePost(postId);
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData(postKeys.detail(postId));

      // Optimistically update the post
      queryClient.setQueryData(postKeys.detail(postId), (old: { success: boolean; data: Post | null } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            likedByMe: !isLiked,
            likeCount: isLiked ? old.data.likeCount - 1 : old.data.likeCount + 1,
          },
        };
      });

      return { previousPost };
    },
    onError: (err, { postId }, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }
      console.error("Toggle like error:", err);
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.feedInfinite() });
      queryClient.invalidateQueries({ queryKey: postKeys.exploreInfinite() });
      queryClient.invalidateQueries({ queryKey: ["me", "likes"] });
    },
  });
}
