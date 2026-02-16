"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services";
import { CreateCommentRequest, Comment, Post } from "@/types";
import { getStandardNextPageParam, updatePostInInfiniteData, InfinitePostData } from "@/lib/query-utils";
import { postKeys } from "./use-posts";
import { toast } from "sonner";

export const commentKeys = {
  all: ["comments"] as const,
  list: (postId: number) => [...commentKeys.all, "list", postId] as const,
  infinite: (postId: number) => [...commentKeys.all, "infinite", postId] as const,
};

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: commentKeys.infinite(postId),
    queryFn: ({ pageParam = 1 }) => commentService.getComments(postId, { page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: !!postId,
  });
}

export function useAddComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.addComment(postId, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Comment added");
        queryClient.invalidateQueries({ queryKey: commentKeys.infinite(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });

        // Optimistically update comment count in lists
        const updateCommentCount = (post: Post) => ({
             ...post,
             commentCount: post.commentCount + 1
        });

        queryClient.setQueryData<InfinitePostData>(
             postKeys.feedInfinite(),
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );
        queryClient.setQueryData<InfinitePostData>(
             postKeys.exploreInfinite(),
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );
        queryClient.setQueriesData<InfinitePostData>(
             { queryKey: ["users"] },
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );

      } else {
        toast.error(response.message || "Failed to add comment");
      }
    },
    onError: (error: Error) => {
      console.error("Add comment error:", error);
      toast.error("Failed to add comment");
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.deleteComment(commentId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Comment deleted");
        queryClient.invalidateQueries({ queryKey: commentKeys.infinite(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });

        // Optimistically update comment count in lists
        const updateCommentCount = (post: Post) => ({
             ...post,
             commentCount: Math.max(0, post.commentCount - 1)
        });

        queryClient.setQueryData<InfinitePostData>(
             postKeys.feedInfinite(),
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );
        queryClient.setQueryData<InfinitePostData>(
             postKeys.exploreInfinite(),
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );
        queryClient.setQueriesData<InfinitePostData>(
             { queryKey: ["users"] },
             (old) => updatePostInInfiniteData(old, postId, updateCommentCount)
        );

      } else {
        toast.error(response.message || "Failed to delete comment");
      }
    },
    onError: (error: Error) => {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment");
    },
  });
}
