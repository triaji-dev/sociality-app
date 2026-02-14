"use client";

import { use, useState } from "react";
import { useUser, useUserPosts, useUserLikes, useUserFollowers, useUserFollowing } from "@/hooks";
import { UserListDialog } from "@/components/users";
import { FollowButton } from "@/components/users/follow-button";
import { PostGrid } from "@/components/posts";
import { PageLoader, ErrorState } from "@/components/shared";
import { UserAvatar } from "@/components/users/user-avatar";
import { Loader2, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;

  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const { data, isLoading, error, refetch } = useUser(username);

  // Data queries
  const postsQuery = useUserPosts(username);
  const likesQuery = useUserLikes(username);
  const followersQuery = useUserFollowers(username);
  const followingQuery = useUserFollowing(username);

  const posts = postsQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];
  const likedPosts = likesQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message || "User not found"} onRetry={() => refetch()} />;
  }

  const profile = data.data;

  // Redirect to /profile if viewing own profile
  if (profile.isMe) {
    return (
      <div className="text-center py-8">
        <p>Redirecting to your profile...</p>
        <Link href="/profile" className="text-primary hover:underline">
          Go to My Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Profile Section */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-0 relative">
          {/* User Info */}
          <div className="flex flex-row items-center md:items-end gap-3 md:gap-5">
            <UserAvatar user={profile} size="xl" className="w-16 h-16" />
            <div className="flex flex-col">
              <div className="text-foreground text-sm md:text-base font-bold leading-7 md:leading-[30px] tracking-tight">
                {profile.name || profile.username}
              </div>
              <div className="text-foreground text-sm md:text-base font-normal leading-7 md:leading-[30px] tracking-tight">
                @{profile.username}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row items-center gap-3 w-full md:w-auto md:absolute md:right-0 md:top-0">
            <div className="flex-1 md:flex-none">
              <FollowButton username={profile.username} isFollowing={profile.isFollowing} />
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${profile.name || profile.username}'s Profile`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-10 h-10 md:w-12 md:h-12 border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Image
                src="/icons/share-icon.svg"
                alt="Share"
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6"
              />
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-foreground text-sm md:text-base font-normal leading-7 md:leading-[30px] tracking-tight whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-row items-center justify-between">
          {/* Posts */}
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {profile.counts.post}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Posts
            </div>
          </div>

          <div className="w-px h-[50px] md:h-[66px] bg-border" />

          {/* Followers */}
          <button
            onClick={() => setShowFollowers(true)}
            className="flex flex-col items-center gap-0.5 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {profile.counts.followers}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Followers
            </div>
          </button>

          <div className="w-px h-[50px] md:h-[66px] bg-border" />

          {/* Following */}
          <button
            onClick={() => setShowFollowing(true)}
            className="flex flex-col items-center gap-0.5 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {profile.counts.following}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Following
            </div>
          </button>

          <div className="w-px h-[50px] md:h-[66px] bg-border" />

          {/* Likes */}
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {profile.counts.likes}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Likes
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Tabs */}
      <div className="flex flex-col gap-6">
        {/* Tab Headers */}
        <div className="flex flex-row items-center w-full">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 border-b-2 transition-colors ${
              activeTab === "posts" ? "border-foreground" : "border-border"
            }`}
          >
            <Image
              src="/icons/gallery-icon.svg"
              alt="Gallery"
              width={20}
              height={20}
              className={`w-5 h-5 md:w-6 md:h-6 transition-all ${
                activeTab !== "posts"
                  ? "brightness-0 saturate-100 invert-65% sepia-11 hue-rotate-183"
                  : ""
              }`}
            />
            <span
              className={`text-sm md:text-base tracking-tight ${
                activeTab === "posts"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground font-medium"
              }`}
            >
              Gallery
            </span>
          </button>

          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 border-b-2 transition-colors ${
              activeTab === "likes" ? "border-foreground" : "border-border"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 md:w-6 md:h-6 ${
                activeTab === "likes" ? "text-foreground" : "text-muted-foreground"
              }`}
              strokeWidth={1.5}
            />
            <span
              className={`text-sm md:text-base tracking-tight ${
                activeTab === "likes"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground font-medium"
              }`}
            >
              Likes
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" ? (
          <PostGrid
            posts={posts}
            hasMore={!!postsQuery.hasNextPage}
            isLoading={postsQuery.isLoading}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            onLoadMore={() => postsQuery.fetchNextPage()}
            emptyTitle="No posts yet"
          />
        ) : (
          <PostGrid
            posts={likedPosts}
            hasMore={!!likesQuery.hasNextPage}
            isLoading={likesQuery.isLoading}
            isFetchingNextPage={likesQuery.isFetchingNextPage}
            onLoadMore={() => likesQuery.fetchNextPage()}
            emptyTitle="No liked posts"
            emptyDescription="Posts liked by this user will appear here"
          />
        )}
      </div>

      {/* Followers Dialog */}
      <UserListDialog
        open={showFollowers}
        onOpenChange={setShowFollowers}
        title="Followers"
        data={followersQuery.data}
        isLoading={followersQuery.isLoading}
        isError={followersQuery.isError}
        fetchNextPage={followersQuery.fetchNextPage}
        hasNextPage={followersQuery.hasNextPage}
        isFetchingNextPage={followersQuery.isFetchingNextPage}
        emptyMessage="No followers yet."
      />

      {/* Following Dialog */}
      <UserListDialog
        open={showFollowing}
        onOpenChange={setShowFollowing}
        title="Following"
        data={followingQuery.data}
        isLoading={followingQuery.isLoading}
        isError={followingQuery.isError}
        fetchNextPage={followingQuery.fetchNextPage}
        hasNextPage={followingQuery.hasNextPage}
        isFetchingNextPage={followingQuery.isFetchingNextPage}
        emptyMessage="Not following anyone yet."
      />
    </div>
  );
}
