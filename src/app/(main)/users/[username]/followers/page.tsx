"use client";

import { use } from "react";
import { useUserFollowers } from "@/hooks";
import { UserList } from "@/components/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserFollowersPageProps {
  params: Promise<{ username: string }>;
}

export default function UserFollowersPage({ params }: UserFollowersPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useUserFollowers(username);
  const users = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/users/${username}`} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">@{username}&apos;s Followers</h1>
      </div>
      
      <UserList
        users={users}
        hasMore={!!hasNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        emptyTitle="No followers"
        error={error}
        onRetry={() => refetch()}
      />
    </div>
  );
}
