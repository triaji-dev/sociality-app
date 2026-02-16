"use client";

import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { FollowButton } from "./follow-button";
import { useAuthStore } from "@/stores/auth-store";

interface UserCardProps {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe?: boolean;
  showFollowButton?: boolean;
}

export function UserCard({
  id,
  username,
  name,
  avatarUrl,
  isFollowedByMe = false,
  showFollowButton = true,
}: UserCardProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isMe = currentUser?.id === id;

  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={isMe ? "/profile" : `/profile/${username}`}
        className="flex flex-1 items-center gap-3 min-w-0 group"
      >
        <UserAvatar 
          src={avatarUrl} 
          name={name} 
          size="md" 
          className="h-12 w-12 border-2 border-border shrink-0"
        />
        <div className="min-w-0 flex flex-col">
          <span className="font-bold text-base leading-tight truncate group-hover:underline decoration-foreground/50 underline-offset-4 decoration-2 transition-all">
            {name}
          </span>
          <span className="text-muted-foreground text-sm truncate">@{username}</span>
        </div>
      </Link>
      
      {showFollowButton && !isMe && (
        <FollowButton
          username={username}
          isFollowing={isFollowedByMe}
        />
      )}
    </div>
  );
}
