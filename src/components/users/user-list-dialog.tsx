"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse, UserListItem, Liker } from "@/types";

interface UserListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: InfiniteData<PaginatedResponse<UserListItem | Liker>> | undefined;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  emptyMessage?: string;
  errorMessage?: string;
}

export function UserListDialog({
  open,
  onOpenChange,
  title,
  data,
  isLoading,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  emptyMessage = "No users found.",
  errorMessage = "Failed to load users.",
}: UserListDialogProps) {
  const users = data?.pages.flatMap((page) => page.data?.items ?? []).filter((u): u is UserListItem | Liker => !!u) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              {errorMessage}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  username={user.username}
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  isFollowedByMe={user.isFollowedByMe}
                  showFollowButton={!('isMe' in user && user.isMe) && ('isMe' in user ? !user.isMe : true)} 
                />
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "Load more"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
