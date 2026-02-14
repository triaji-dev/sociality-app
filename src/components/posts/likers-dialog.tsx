import { useState, useEffect } from "react";
import { useLikers, useToggleFollow } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/users/user-avatar";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

interface LikersDialogProps {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DialogFollowButton({ username, isFollowing: initialIsFollowing }: { username: string, isFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const toggleFollow = useToggleFollow();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    toggleFollow.mutate(
      { username, isFollowing: !newIsFollowing },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setIsFollowing(response.data.following);
          } else {
            setIsFollowing(!newIsFollowing);
          }
        },
        onError: () => {
          setIsFollowing(!newIsFollowing);
        },
      }
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={toggleFollow.isPending}
      variant={isFollowing ? "outline" : "default"}
      className={cn(
        "rounded-full transition-all px-4 py-3 whitespace-nowrap",
        isFollowing 
          ? "border-gray-600 text-white hover:bg-gray-800 hover:text-white w-[140px]" 
          : "bg-primary-300 hover:bg-primary-300/90 text-white shadow-md shadow-primary-300/20 w-[90px]"
      )}
    >
      {isFollowing ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Following
        </>
      ) : (
        "Follow"
      )}
    </Button>
  );
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
  const currentUser = useAuthStore((state) => state.user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5 gap-5 bg-gray-950 border-gray-800 text-white overflow-visible [&>button]:hidden">
        <div className="absolute right-0 top-0 -translate-y-[140%]">
          <DialogClose className="rounded-full p-2 hover:scale-120 transition-transform cursor-pointer">
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Likes</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden w-full" id="likers-scroll-area">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-gray-400">
              Failed to load likes.
            </div>
          ) : likers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No likes yet.
            </div>
          ) : (
            <div className="space-y-6">
              {likers.map((liker) => (
                <div key={liker.id} className="flex items-center justify-between gap-3">
                  <Link href={currentUser?.id === liker.id ? "/profile" : `/profile/${liker.username}`} className="flex items-center gap-3 min-w-0 flex-1 group">
                    <UserAvatar 
                      src={liker.avatarUrl} 
                      name={liker.name} 
                      size="md"
                      className="h-12 w-12 border-2 border-[#12151A] shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-base leading-tight truncate group-hover:underline decoration-white/50 underline-offset-4 decoration-2 transition-all">{liker.name}</span>
                      <span className="text-gray-400 text-sm truncate">@{liker.username}</span>
                    </div>
                  </Link>

                  {currentUser?.id !== liker.id && (
                    <DialogFollowButton 
                      username={liker.username} 
                      isFollowing={liker.isFollowedByMe} 
                    />
                  )}
                </div>
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-gray-400 hover:text-white"
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
