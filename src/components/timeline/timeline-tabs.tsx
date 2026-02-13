"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeed, usePosts } from "@/hooks";
import { PostList } from "@/components/posts/post-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FeedContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useFeed();

  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <PostList
      posts={posts}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRetry={() => refetch()}
      emptyTitle="Your feed is empty"
      emptyDescription="Follow other users to see their posts here"
      emptyAction={
        <Button asChild>
          <Link href="/profile/search">Find people to follow</Link>
        </Button>
      }
    />
  );
}

function ExploreContent() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = usePosts();

  const posts = data?.pages.flatMap((page) => page.data?.items || []) || [];

  return (
    <PostList
      posts={posts}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRetry={() => refetch()}
      emptyTitle="No posts yet"
      emptyDescription="Be the first to share something!"
    />
  );
}

export function TimelineTabs() {
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="feed">Feed</TabsTrigger>
        <TabsTrigger value="explore">Explore</TabsTrigger>
      </TabsList>
      <TabsContent value="feed">
        <FeedContent />
      </TabsContent>
      <TabsContent value="explore">
        <ExploreContent />
      </TabsContent>
    </Tabs>
  );
}
