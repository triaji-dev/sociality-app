"use client";

import { UserCard } from "./user-card";
import { InfiniteScroll, EmptyState, PageLoader, ErrorState } from "@/components/shared";
import { Users } from "lucide-react";
import type { UserListItem, UserSearchResult } from "@/types";

interface UserListProps {
  users: (UserListItem | UserSearchResult)[];
  hasMore: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: Error | null;
  onRetry?: () => void;
}

export function UserList({
  users,
  hasMore,
  isLoading,
  isFetchingNextPage,
  onLoadMore,
  emptyTitle = "No users found",
  emptyDescription,
  error,
  onRetry,
}: UserListProps) {
  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <InfiniteScroll
      hasMore={hasMore}
      isLoading={isFetchingNextPage}
      onLoadMore={onLoadMore}
    >
      <div className="space-y-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            username={user.username}
            name={user.name}
            avatarUrl={user.avatarUrl}
            isFollowedByMe={user.isFollowedByMe}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
