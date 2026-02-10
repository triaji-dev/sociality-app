"use client";

import { useMyFollowers } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { UserList } from "@/components/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function FollowersContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useMyFollowers();
  const users = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/me" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Followers</h1>
      </div>
      
      <UserList
        users={users}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No followers yet"
        emptyDescription="When people follow you, they'll appear here"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}

export default function MyFollowersPage() {
  return (
    <AuthGuard>
      <FollowersContent />
    </AuthGuard>
  );
}
