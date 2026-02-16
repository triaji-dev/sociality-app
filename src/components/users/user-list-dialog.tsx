"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
      <DialogContent className="max-sm:fixed max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:right-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:rounded-b-none max-sm:rounded-t-[20px] max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom-full max-sm:data-[state=closed]:slide-out-to-bottom-full max-sm:duration-300 sm:max-w-md p-5 gap-5 bg-background border-border text-foreground overflow-visible [&>button]:hidden">
        <div className="absolute right-0 top-0 -translate-y-[110%] max-sm:hidden">
          <DialogClose className="rounded-full p-2 hover:scale-120 transition-transform cursor-pointer">
              <X className="h-5 w-5 text-foreground" />
              <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogClose className="hidden max-sm:flex rounded-full p-2 hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden w-full minimal-scrollbar" id="user-list-scroll-area">
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
            <div className="space-y-6">
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
                    className="text-muted-foreground hover:text-foreground"
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
