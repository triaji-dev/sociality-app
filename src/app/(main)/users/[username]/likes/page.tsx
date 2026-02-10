"use client";

import { use } from "react";
import { useUserLikes } from "@/hooks";
import { PostGrid } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserLikesPageProps {
  params: Promise<{ username: string }>;
}

export default function UserLikesPage({ params }: UserLikesPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useUserLikes(username);
  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/users/${username}`} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Liked by @{username}</h1>
      </div>
      
      <PostGrid
        posts={posts}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No liked posts"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
