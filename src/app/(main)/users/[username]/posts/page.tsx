"use client";

import { use } from "react";
import { useUserPosts } from "@/hooks";
import { PostGrid } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserPostsPageProps {
  params: Promise<{ username: string }>;
}

export default function UserPostsPage({ params }: UserPostsPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useUserPosts(username);
  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/users/${username}`} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Posts by @{username}</h1>
      </div>
      
      <PostGrid
        posts={posts}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No posts yet"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
