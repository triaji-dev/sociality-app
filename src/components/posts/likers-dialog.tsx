"use client";

import { useLikers } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCard } from "@/components/users/user-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LikersDialogProps {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LikersDialog({ postId, open, onOpenChange }: LikersDialogProps) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useLikers(postId);

  const likers = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center">Likes</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto p-4" id="likers-scroll-area">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load likes.
            </div>
          ) : likers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No likes yet.
            </div>
          ) : (
            <div className="space-y-4">
              {likers.map((liker) => (
                <UserCard
                  key={liker.id}
                  id={liker.id}
                  username={liker.username}
                  name={liker.name}
                  avatarUrl={liker.avatarUrl}
                  isFollowedByMe={liker.isFollowedByMe}
                  showFollowButton={!liker.isMe}
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
