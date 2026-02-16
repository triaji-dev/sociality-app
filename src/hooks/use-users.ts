"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/services";
import { UpdateProfileRequest } from "@/types";
import { getStandardNextPageParam } from "@/lib/query-utils";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  me: () => ["me"] as const,
  myPosts: () => ["me", "posts"] as const,
  myLikes: () => ["me", "likes"] as const,
  mySaved: () => ["me", "saved"] as const,
  myFollowers: () => ["me", "followers"] as const,
  myFollowing: () => ["me", "following"] as const,
  search: (query: string) => [...userKeys.all, "search", query] as const,
  detail: (username: string) => [...userKeys.all, "detail", username] as const,
  userPosts: (username: string) => [...userKeys.all, username, "posts"] as const,
  userLikes: (username: string) => [...userKeys.all, username, "likes"] as const,
  userFollowers: (username: string) => [...userKeys.all, username, "followers"] as const,
  userFollowing: (username: string) => [...userKeys.all, username, "following"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
  });
}

export function useMyPosts() {
  return useInfiniteQuery({
    queryKey: userKeys.myPosts(),
    queryFn: ({ pageParam = 1 }) => userService.getMyPosts({ page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateMe(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success("Profile updated!");
        queryClient.invalidateQueries({ queryKey: userKeys.me() });
        setUser({
          id: response.data.id,
          name: response.data.name,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          avatarUrl: response.data.avatarUrl,
        });
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error: Error) => {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile");
    },
  });
}

export function useMyLikes() {
  return useInfiniteQuery({
    queryKey: userKeys.myLikes(),
    queryFn: ({ pageParam = 1 }) => userService.getMyLikes({ page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function useMySaved() {
  return useInfiniteQuery({
    queryKey: userKeys.mySaved(),
    queryFn: ({ pageParam = 1 }) => userService.getMySaved({ page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function useMyFollowers() {
  return useInfiniteQuery({
    queryKey: userKeys.myFollowers(),
    queryFn: ({ pageParam = 1 }) => userService.getMyFollowers({ page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function useMyFollowing() {
  return useInfiniteQuery({
    queryKey: userKeys.myFollowing(),
    queryFn: ({ pageParam = 1 }) => userService.getMyFollowing({ page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
  });
}

export function useSearchUsers(query: string) {
  return useInfiniteQuery({
    queryKey: userKeys.search(query),
    queryFn: ({ pageParam = 1 }) => userService.searchUsers(query, { page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: query.length > 0,
  });
}

export function useUser(username: string) {
  return useQuery({
    queryKey: userKeys.detail(username),
    queryFn: () => userService.getUser(username),
    enabled: !!username,
  });
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: userKeys.userPosts(username),
    queryFn: ({ pageParam = 1 }) => userService.getUserPosts(username, { page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: !!username,
  });
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: userKeys.userLikes(username),
    queryFn: ({ pageParam = 1 }) => userService.getUserLikes(username, { page: pageParam, limit: 12 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: !!username,
  });
}

export function useUserFollowers(username: string) {
  return useInfiniteQuery({
    queryKey: userKeys.userFollowers(username),
    queryFn: ({ pageParam = 1 }) => userService.getUserFollowers(username, { page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: !!username,
  });
}

export function useUserFollowing(username: string) {
  return useInfiniteQuery({
    queryKey: userKeys.userFollowing(username),
    queryFn: ({ pageParam = 1 }) => userService.getUserFollowing(username, { page: pageParam, limit: 20 }),
    getNextPageParam: getStandardNextPageParam,
    initialPageParam: 1,
    enabled: !!username,
  });
}
