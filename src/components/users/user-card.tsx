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
    <div className="flex items-center justify-between gap-3 py-2">
      <Link
        href={isMe ? "/me" : `/users/${username}`}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <UserAvatar src={avatarUrl} name={name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{name}</p>
          <p className="text-muted-foreground text-sm truncate">@{username}</p>
        </div>
      </Link>
      
      {showFollowButton && !isMe && (
        <FollowButton
          username={username}
          isFollowing={isFollowedByMe}
          size="sm"
        />
      )}
    </div>
  );
}
