"use client";

import { useState, useEffect } from "react";
import { useToggleFollow } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

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
        "rounded-full transition-all whitespace-nowrap",
        isFollowing 
          ? "border-gray-600 text-white hover:bg-gray-800 hover:text-white w-[140px]" 
          : "bg-primary-300 hover:bg-primary-300/90 text-white shadow-md shadow-primary-300/20 w-[90px]",
        className
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
