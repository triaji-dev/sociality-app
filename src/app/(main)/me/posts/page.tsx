"use client";

import { useUserPosts } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { PostGrid } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMe } from "@/hooks";

function PostsContent() {
  const { data: meData } = useMe();
  const username = meData?.data?.profile.username || "";
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useUserPosts(username);
  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/me" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">My Posts</h1>
      </div>
      
      <PostGrid
        posts={posts}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No posts yet"
        emptyDescription="Share your first post!"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}

export default function MyPostsPage() {
  return (
    <AuthGuard>
      <PostsContent />
    </AuthGuard>
  );
}
