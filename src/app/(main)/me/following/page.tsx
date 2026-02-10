"use client";

import { useMyFollowing } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { UserList } from "@/components/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function FollowingContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useMyFollowing();
  const users = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/me" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Following</h1>
      </div>
      
      <UserList
        users={users}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="Not following anyone"
        emptyDescription="When you follow people, they'll appear here"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}

export default function MyFollowingPage() {
  return (
    <AuthGuard>
      <FollowingContent />
    </AuthGuard>
  );
}
