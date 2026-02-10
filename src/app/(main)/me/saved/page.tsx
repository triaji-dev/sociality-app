"use client";

import { useMySaved } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { PostGrid } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function SavedContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useMySaved();
  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/me" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Saved Posts</h1>
      </div>
      
      <PostGrid
        posts={posts}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No saved posts"
        emptyDescription="Save posts to view them later"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}

export default function MySavedPage() {
  return (
    <AuthGuard>
      <SavedContent />
    </AuthGuard>
  );
}
