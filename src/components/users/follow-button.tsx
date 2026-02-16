"use client";

import { useState, useEffect } from "react";
import { useToggleFollow } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { analytics } from "@/lib/analytics";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
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
             analytics.track(response.data.following ? "follow_user" : "unfollow_user", { targetUsername: username });
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
        "rounded-full transition-all duration-200 whitespace-nowrap active:scale-95",
        isFollowing 
          ? "border-border text-foreground hover:bg-accent hover:text-foreground hover:scale-105 w-[140px]" 
          : "bg-primary-300 hover:bg-primary-300/90 hover:scale-105 hover:shadow-lg hover:shadow-primary-300/40 text-white shadow-md shadow-primary-300/20 w-[90px]",
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
