"use client";

import { useFeed } from "@/hooks";
import { PostCard } from "@/components/posts";
import { InfiniteScroll, PageLoader, ErrorState, EmptyState } from "@/components/shared";
import { AuthGuard } from "@/components/auth";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FeedContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useFeed();

  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Your feed is empty"
        description="Follow other users to see their posts here"
        action={
          <Button asChild>
            <Link href="/users/search">Find people to follow</Link>
          </Button>
        }
      />
    );
  }

  return (
    <InfiniteScroll
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
      onLoadMore={() => fetchNextPage()}
    >
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default function FeedPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Feed</h1>
        <FeedContent />
      </div>
    </AuthGuard>
  );
}
