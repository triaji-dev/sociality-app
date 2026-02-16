"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { postService } from "@/services";
import { CreatePostRequest, Post, PaginatedResponse } from "@/types";
import { getStandardNextPageParam } from "@/lib/query-utils";
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
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.exploreInfinite(),
    queryFn: ({ pageParam = 1 }) => postService.getPosts({ page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function usePost(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: !!id,
    initialData: () => {
      const feedData = queryClient.getQueryData<InfiniteData<PaginatedResponse<Post>>>(postKeys.feedInfinite());
      const feedPost = feedData?.pages.flatMap((page) => page.data?.items ?? []).find((p) => p.id === id);

      if (feedPost) {
        return { success: true, message: "From cache", data: feedPost };
      }

      const exploreData = queryClient.getQueryData<InfiniteData<PaginatedResponse<Post>>>(postKeys.exploreInfinite());
      const explorePost = exploreData?.pages.flatMap((page) => page.data?.items ?? []).find((p) => p.id === id);

      if (explorePost) {
        return { success: true, message: "From cache", data: explorePost };
      }

      return undefined;
    },
    initialDataUpdatedAt: () => {
      const feedState = queryClient.getQueryState(postKeys.feedInfinite());
      const exploreState = queryClient.getQueryState(postKeys.exploreInfinite());
      return Math.max(feedState?.dataUpdatedAt || 0, exploreState?.dataUpdatedAt || 0);
    },
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
        toast.error("Post deleted");
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
