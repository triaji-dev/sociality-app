"use client";

import { useState, useEffect } from "react";
import { useToggleFollow } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function FollowButton({ 
  username, 
  isFollowing: initialIsFollowing, 
  size = "default", 
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const toggleFollow = useToggleFollow();

  // Sync with parent props when they change (e.g. from query refetch)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic toggle
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    toggleFollow.mutate(
      { username, isFollowing: !newIsFollowing }, // send CURRENT server state (which is !new)
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
             // Server confirms new state
             setIsFollowing(response.data.following);
          } else {
             // Revert on API logic failure 
             setIsFollowing(!newIsFollowing); 
          }
        },
        onError: () => {
          // Revert on network/server error
          setIsFollowing(!newIsFollowing);
        },
      }
    );
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
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
