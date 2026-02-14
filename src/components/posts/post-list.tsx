"use client";

import { Post } from "@/types";
import { PostCard } from "./post-card";
import { InfiniteScroll, PageLoader, ErrorState, EmptyState } from "@/components/shared";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error?: Error | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function PostList({
  posts,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  error,
  onRetry,
  emptyTitle = "No posts found",
  emptyDescription = "There are no posts to display.",
  emptyAction,
}: PostListProps) {
  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <InfiniteScroll
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    >
      <div className="flex flex-col">
        {posts.map((post, index) => (
          <div key={post.id}>
            <PostCard post={post} />
            {index < posts.length - 1 && (
              <div className="h-px w-full bg-border my-6" />
            )}
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
