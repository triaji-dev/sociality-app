"use client";

import { use, useState } from "react";
import { useUser, useUserPosts, useUserLikes, useUserFollowers, useUserFollowing } from "@/hooks";
import { ProfileHeader, UserListDialog } from "@/components/users";
import { PostGrid } from "@/components/posts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader, ErrorState } from "@/components/shared";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  
  const [activeTab, setActiveTab] = useState("posts");
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
    return <PageLoader />;
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/timeline" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">@{username}</h1>
      </div>

      <ProfileHeader
        id={profile.id}
        username={profile.username}
        name={profile.name}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
        stats={profile.counts}
        isFollowing={profile.isFollowing}
        isMe={false}
        onFollowersClick={() => setShowFollowers(true)}
        onFollowingClick={() => setShowFollowing(true)}
        onPostsClick={() => setActiveTab("posts")}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6 focus-visible:outline-none">
          <PostGrid
            posts={posts}
            hasMore={!!postsQuery.hasNextPage}
            isLoading={postsQuery.isLoading}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            onLoadMore={() => postsQuery.fetchNextPage()}
            emptyTitle="No posts yet"
          />
        </TabsContent>
        
        <TabsContent value="likes" className="mt-6 focus-visible:outline-none">
          <PostGrid
            posts={likedPosts}
            hasMore={!!likesQuery.hasNextPage}
            isLoading={likesQuery.isLoading}
            isFetchingNextPage={likesQuery.isFetchingNextPage}
            onLoadMore={() => likesQuery.fetchNextPage()}
            emptyTitle="No liked posts"
            emptyDescription="Posts liked by this user will appear here"
          />
        </TabsContent>
      </Tabs>

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
