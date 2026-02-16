"use client";

import { useState } from "react";
import { useMe, useMyPosts, useMySaved, useMyFollowers, useMyFollowing } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { UserListDialog, MobileProfileHeader } from "@/components/users";
import { PostGrid } from "@/components/posts";
import { ShareModal } from "@/components/posts/share-modal";
import { PageLoader, ErrorState } from "@/components/shared";
import { UserAvatar } from "@/components/users/user-avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function ProfileContent() {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const { data, isLoading, error, refetch } = useMe();

  // Data queries
  const postsQuery = useMyPosts();
  const savedQuery = useMySaved();
  const followersQuery = useMyFollowers();
  const followingQuery = useMyFollowing();

  const posts = postsQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];
  const savedPosts = savedQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  const profile = data.data;
  const user = profile.profile;
  const stats = profile.stats;

  return (
    <div className="w-full flex flex-col gap-4 -mt-6 md:mt-0">
      {/* Profile Section */}
      <div className="flex flex-col gap-4 pt-4 md:pt-0">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-0 relative">
          {/* User Info */}
          <div className="flex flex-row items-center md:items-end gap-3 md:gap-5">
            <UserAvatar user={user} size="xl" className="w-16 h-16" />
            <div className="flex flex-col">
              <div className="text-foreground text-sm md:text-base font-bold leading-7 md:leading-[30px] tracking-tight">
                {user.name || user.username}
              </div>
              <div className="text-foreground text-sm md:text-base font-normal leading-7 md:leading-[30px] tracking-tight">
                @{user.username}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row items-center gap-3 w-full md:w-auto md:absolute md:right-0 md:top-0 mt-4 md:mt-0">
            <Link href="/profile/edit" className="flex-1 md:flex-none">
              <Button className="w-full md:w-[130px] h-10 md:h-12 border border-border bg-transparent text-foreground text-sm md:text-base font-bold rounded-full hover:bg-accent hover:border-accent">
                Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => setShowShare(true)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex"
            >
              <Image
                src="/icons/share-icon.svg"
                alt="Share"
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6 dark:invert-0 invert"
              />
            </Button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-foreground text-sm md:text-base font-normal leading-7 md:leading-[30px] tracking-tight whitespace-pre-wrap">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-row items-center justify-between w-full">
          {/* Posts */}
          <Button
            variant="profileStats"
            onClick={() => setActiveTab("posts")}
            className="flex flex-col items-center gap-0.5 flex-1 p-0 md:px-0"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {stats.posts}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Post
            </div>
          </Button>

          <div className="w-px h-[30px] md:h-[66px] bg-border mx-2 md:mx-0" />

          {/* Followers */}
          <Button
            variant="profileStats"
            onClick={() => setShowFollowers(true)}
            className="flex flex-col items-center gap-0.5 flex-1 p-0 md:px-0"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {stats.followers}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Followers
            </div>
          </Button>

          <div className="w-px h-[30px] md:h-[66px] bg-border mx-2 md:mx-0" />

          {/* Following */}
          <Button
            variant="profileStats"
            onClick={() => setShowFollowing(true)}
            className="flex flex-col items-center gap-0.5 flex-1 p-0 md:px-0"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {stats.following}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Following
            </div>
          </Button>

          <div className="w-px h-[30px] md:h-[66px] bg-border mx-2 md:mx-0" />

          {/* Likes */}
          <Button
            variant="profileStats"
            className="flex flex-col items-center gap-0.5 flex-1 p-0 md:px-0 cursor-default hover:scale-100! hover:text-foreground!"
          >
            <div className="text-foreground text-lg md:text-xl font-bold leading-8 md:leading-[34px] tracking-tight">
              {stats.likes}
            </div>
            <div className="text-muted-foreground text-xs md:text-base font-normal leading-4 md:leading-[30px]">
              Likes
            </div>
          </Button>
        </div>
      </div>

      {/* Gallery Tabs */}
      <div className="flex flex-col gap-6">
        {/* Tab Headers */}
        <div className="flex flex-row items-center w-full">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 border-b-2 transition-colors cursor-pointer ${
              activeTab === "posts" ? "border-foreground" : "border-border"
            }`}
          >
            <Image
              src="/icons/gallery-icon.svg"
              alt="Gallery"
              width={20}
              height={20}
              className={`w-5 h-5 md:w-6 md:h-6 transition-all ${
                activeTab === "posts"
                  ? "dark:invert-0 invert"
                  : "dark:invert-0 invert opacity-50"
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
            onClick={() => setActiveTab("saved")}
            className={`flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 border-b-2 transition-colors cursor-pointer ${
              activeTab === "saved" ? "border-foreground" : "border-border"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 md:w-6 md:h-6 ${
                activeTab === "saved" ? "text-foreground" : "text-muted-foreground"
              }`}
              strokeWidth={1.5}
            />
            <span
              className={`text-sm md:text-base tracking-tight ${
                activeTab === "saved"
                  ? "text-foreground font-bold"
                  : "text-muted-foreground font-medium"
              }`}
            >
              Saved
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
            emptyDescription="Share your first post!"
          />
        ) : (
          <PostGrid
            posts={savedPosts}
            hasMore={!!savedQuery.hasNextPage}
            isLoading={savedQuery.isLoading}
            isFetchingNextPage={savedQuery.isFetchingNextPage}
            onLoadMore={() => savedQuery.fetchNextPage()}
            emptyTitle="No saved posts"
            emptyDescription="Posts you save will appear here"
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

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={typeof window !== "undefined" ? window.location.href : ""}
        title={`${user.name || user.username}'s Profile`}
      />
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
