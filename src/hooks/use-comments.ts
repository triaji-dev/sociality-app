"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services";
import { CreateCommentRequest, Comment } from "@/types";
import { getStandardNextPageParam } from "@/lib/query-utils";
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
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.infinite(postId) });
      // Can add optimistic update here if needed
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: commentKeys.infinite(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
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
        toast.error("Comment deleted");
        queryClient.invalidateQueries({ queryKey: commentKeys.infinite(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
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
