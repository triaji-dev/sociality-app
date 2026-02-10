"use client";

import { use } from "react";
import { useUserFollowing } from "@/hooks";
import { UserList } from "@/components/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserFollowingPageProps {
  params: Promise<{ username: string }>;
}

export default function UserFollowingPage({ params }: UserFollowingPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useUserFollowing(username);
  const users = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/users/${username}`} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">@{username} is Following</h1>
      </div>
      
      <UserList
        users={users}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="Not following anyone"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
