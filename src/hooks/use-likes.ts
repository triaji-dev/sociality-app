"use client";

import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { likeService } from "@/services";
import { postKeys } from "./use-posts";
import { Post, PaginatedResponse } from "@/types";
import { updatePostInInfiniteData, InfinitePostData, getStandardNextPageParam } from "@/lib/query-utils";
import { toast } from "sonner";

export const likeKeys = {
  all: ["likes"] as const,
  likers: (postId: number) => [...likeKeys.all, "likers", postId] as const,
};



export function useLikers(postId: number) {
  return useInfiniteQuery({
    queryKey: likeKeys.likers(postId),
    queryFn: ({ pageParam = 1 }) => likeService.getLikers(postId, { page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
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
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousFeed = queryClient.getQueryData<InfinitePostData>(postKeys.feedInfinite());
      const previousExplore = queryClient.getQueryData<InfinitePostData>(postKeys.exploreInfinite());
      const previousDetail = queryClient.getQueryData(postKeys.detail(postId));

      const updater = (post: Post): Post => ({
        ...post,
        likedByMe: !isLiked,
        likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
      });

      queryClient.setQueryData<InfinitePostData>(
        postKeys.feedInfinite(),
        (old) => updatePostInInfiniteData(old, postId, updater),
      );
      queryClient.setQueryData<InfinitePostData>(
        postKeys.exploreInfinite(),
        (old) => updatePostInInfiniteData(old, postId, updater),
      );

      queryClient.setQueriesData<InfinitePostData>(
        { queryKey: ["users"] },
        (old) => updatePostInInfiniteData(old, postId, updater)
      );
      queryClient.setQueriesData<InfinitePostData>(
        { queryKey: ["me"] },
        (old) => updatePostInInfiniteData(old, postId, updater)
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
    onSuccess: (response, { postId, isLiked }) => {
      if (!response.data) return;
      
      const action = isLiked ? "Unliked" : "Liked";
      toast.success(`Post ${action} successfully`);

      const { liked, likeCount } = response.data;

      const reconcile = (post: Post): Post => ({
        ...post,
        likedByMe: liked,
        likeCount,
      });

      queryClient.setQueryData<InfinitePostData>(
        postKeys.feedInfinite(),
        (old) => updatePostInInfiniteData(old, postId, reconcile),
      );
      queryClient.setQueryData<InfinitePostData>(
        postKeys.exploreInfinite(),
        (old) => updatePostInInfiniteData(old, postId, reconcile),
      );

      queryClient.setQueriesData<InfinitePostData>(
        { queryKey: ["users"] },
        (old) => updatePostInInfiniteData(old, postId, reconcile)
      );
      queryClient.setQueriesData<InfinitePostData>(
        { queryKey: ["me"] },
        (old) => updatePostInInfiniteData(old, postId, reconcile)
      );

      queryClient.setQueryData(
        postKeys.detail(postId),
        (old: { success: boolean; data: Post | null } | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: reconcile(old.data) };
        },
      );
    },
    onError: (err, { postId }, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(postKeys.feedInfinite(), context.previousFeed);
      }
      if (context?.previousExplore) {
        queryClient.setQueryData(postKeys.exploreInfinite(), context.previousExplore);
      }
       queryClient.invalidateQueries({ queryKey: ["users"] });
       queryClient.invalidateQueries({ queryKey: ["me"] });
      
      if (context?.previousDetail) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousDetail);
      }
      console.error("Toggle like error:", err);
      toast.error("Failed to like/unlike post");
    },
    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.likers(postId) });
      queryClient.invalidateQueries({ queryKey: ["me", "likes"] });
    },
  });
}
