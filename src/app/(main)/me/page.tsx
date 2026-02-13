"use client";

import { useState } from "react";
import { useMe, useMyPosts, useMyLikes, useMySaved, useMyFollowers, useMyFollowing } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { ProfileHeader, UserListDialog } from "@/components/users";
import { PostGrid } from "@/components/posts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader, ErrorState } from "@/components/shared";
import { EditProfileDialog } from "./edit-profile-dialog";

function ProfileContent() {
  const [editOpen, setEditOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  const { data, isLoading, error, refetch } = useMe();
  
  // Data queries
  const postsQuery = useMyPosts();
  const likesQuery = useMyLikes();
  const savedQuery = useMySaved();
  const followersQuery = useMyFollowers();
  const followingQuery = useMyFollowing();

  const posts = postsQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];
  const likedPosts = likesQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];
  const savedPosts = savedQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  }

  const profile = data.data;



  return (
    <div className="space-y-6">
      <ProfileHeader
        id={profile.profile.id}
        username={profile.profile.username}
        name={profile.profile.name}
        bio={profile.profile.bio}
        avatarUrl={profile.profile.avatarUrl}
        stats={{
          post: profile.stats.posts,
          followers: profile.stats.followers,
          following: profile.stats.following,
          likes: profile.stats.likes,
        }}
        isMe={true}
        onFollowersClick={() => setShowFollowers(true)}
        onFollowingClick={() => setShowFollowing(true)}
        onPostsClick={() => setActiveTab("posts")}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6 focus-visible:outline-none">
          <PostGrid
            posts={posts}
            hasMore={!!postsQuery.hasNextPage}
            isLoading={postsQuery.isLoading}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            onLoadMore={() => postsQuery.fetchNextPage()}
            emptyTitle="No posts yet"
            emptyDescription="Share your first post!"
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
            emptyDescription="Posts you like will appear here"
          />
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6 focus-visible:outline-none">
          <PostGrid
            posts={savedPosts}
            hasMore={!!savedQuery.hasNextPage}
            isLoading={savedQuery.isLoading}
            isFetchingNextPage={savedQuery.isFetchingNextPage}
            onLoadMore={() => savedQuery.fetchNextPage()}
            emptyTitle="No saved posts"
            emptyDescription="Posts you save will appear here"
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

export default function MyProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
