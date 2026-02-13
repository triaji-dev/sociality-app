"use client";

import { useState } from "react";
import { useMe, useMyPosts } from "@/hooks";
import { AuthGuard } from "@/components/auth";
import { ProfileHeader } from "@/components/users";
import { PostGrid } from "@/components/posts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader, ErrorState } from "@/components/shared";
import { EditProfileDialog } from "./edit-profile-dialog";

function ProfileContent() {
  const [editOpen, setEditOpen] = useState(false);
  const { data, isLoading, error, refetch } = useMe();

  const postsQuery = useMyPosts();
  const posts = postsQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];

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
        onEditClick={() => setEditOpen(true)}
      />

      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
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
        
        <TabsContent value="likes" className="mt-6">
          <p className="text-center text-muted-foreground py-8">
            View your <a href="/me/likes" className="text-primary hover:underline">liked posts</a>
          </p>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <p className="text-center text-muted-foreground py-8">
            View your <a href="/me/saved" className="text-primary hover:underline">saved posts</a>
          </p>
        </TabsContent>
      </Tabs>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile.profile}
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
