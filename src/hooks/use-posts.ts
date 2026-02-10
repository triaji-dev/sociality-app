"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { postService } from "@/services";
import { CreatePostRequest, Post } from "@/types";
import { toast } from "sonner";

export const postKeys = {
  all: ["posts"] as const,
  feed: (page?: number) => [...postKeys.all, "feed", page] as const,
  feedInfinite: () => [...postKeys.all, "feed", "infinite"] as const,
  explore: (page?: number) => [...postKeys.all, "explore", page] as const,
  exploreInfinite: () => [...postKeys.all, "explore", "infinite"] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
};

export function useFeed() {
  return useInfiniteQuery({
    queryKey: postKeys.feedInfinite(),
    queryFn: ({ pageParam = 1 }) => postService.getFeed({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.exploreInfinite(),
    queryFn: ({ pageParam = 1 }) => postService.getPosts({ page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data) return undefined;
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postService.createPost(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Post created!");
        queryClient.invalidateQueries({ queryKey: postKeys.feedInfinite() });
        queryClient.invalidateQueries({ queryKey: postKeys.exploreInfinite() });
        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else {
        toast.error(response.message || "Failed to create post");
      }
    },
    onError: (error: Error) => {
      console.error("Create post error:", error);
      toast.error("Failed to create post");
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postService.deletePost(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success("Post deleted");
        queryClient.invalidateQueries({ queryKey: postKeys.feedInfinite() });
        queryClient.invalidateQueries({ queryKey: postKeys.exploreInfinite() });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else {
        toast.error(response.message || "Failed to delete post");
      }
    },
    onError: (error: Error) => {
      console.error("Delete post error:", error);
      toast.error("Failed to delete post");
    },
  });
}
