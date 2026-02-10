"use client";

import { use } from "react";
import { useUser, useUserPosts } from "@/hooks";
import { ProfileHeader } from "@/components/users";
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
  
  const { data, isLoading, error, refetch } = useUser(username);
  const postsQuery = useUserPosts(username);
  const posts = postsQuery.data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message || "User not found"} onRetry={() => refetch()} />;
  }

  const profile = data.data;

  // Redirect to /me if viewing own profile
  if (profile.isMe) {
    return (
      <div className="text-center py-8">
        <p>Redirecting to your profile...</p>
        <Link href="/me" className="text-primary hover:underline">
          Go to My Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/explore" className="p-2 hover:bg-muted rounded-full">
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
      />

      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <PostGrid
            posts={posts}
            hasMore={!!postsQuery.hasNextPage}
            isLoading={postsQuery.isLoading}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            onLoadMore={() => postsQuery.fetchNextPage()}
            emptyTitle="No posts yet"
          />
        </TabsContent>
        
        <TabsContent value="likes" className="mt-6">
          <p className="text-center text-muted-foreground py-8">
            View <a href={`/users/${username}/likes`} className="text-primary hover:underline">liked posts</a>
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
