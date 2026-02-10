"use client";

import { usePosts } from "@/hooks";
import { PostGrid } from "@/components/posts";

export default function ExplorePage() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = usePosts();

  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <PostGrid
        posts={posts}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No posts yet"
        emptyDescription="Be the first to share something!"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
