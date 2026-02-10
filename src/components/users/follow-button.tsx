"use client";

import { useToggleFollow } from "@/hooks";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function FollowButton({ username, isFollowing, size = "default", className }: FollowButtonProps) {
  const toggleFollow = useToggleFollow();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFollow.mutate({ username, isFollowing });
  };

  return (
    <Button
      onClick={handleClick}
      variant={isFollowing ? "outline" : "default"}
      size={size}
      disabled={toggleFollow.isPending}
      className={cn(
        "min-w-[100px] transition-all",
        isFollowing && "hover:border-destructive hover:text-destructive hover:bg-destructive/10",
        className
      )}
    >
      {toggleFollow.isPending ? (
        <LoadingSpinner size="sm" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
