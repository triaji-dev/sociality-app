"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { FollowButton } from "./follow-button";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  id: number;
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  stats: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing?: boolean;
  isMe: boolean;
  onPostsClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

export function ProfileHeader({
  id,
  username,
  name,
  bio,
  avatarUrl,
  stats,
  isFollowing = false,
  isMe,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) {

  return (
    <div className="space-y-6">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <UserAvatar src={avatarUrl} name={name} size="xl" className="shrink-0" />
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-xl font-semibold">@{username}</h1>
            
            {isMe ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/edit">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            ) : (
              <FollowButton username={username} isFollowing={isFollowing} />
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <button 
              onClick={onPostsClick}
              className="hover:underline flex items-center gap-1"
            >
              <span className="font-semibold">{stats.post}</span>{" "}
              <span className="text-muted-foreground">posts</span>
            </button>
            <button 
              onClick={onFollowersClick}
              className="hover:underline flex items-center gap-1"
            >
              <span className="font-semibold">{stats.followers}</span>{" "}
              <span className="text-muted-foreground">followers</span>
            </button>
            <button 
              onClick={onFollowingClick}
              className="hover:underline flex items-center gap-1"
            >
              <span className="font-semibold">{stats.following}</span>{" "}
              <span className="text-muted-foreground">following</span>
            </button>
          </div>

          {/* Bio */}
          <div>
            <p className="font-medium">{name}</p>
            {bio && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
