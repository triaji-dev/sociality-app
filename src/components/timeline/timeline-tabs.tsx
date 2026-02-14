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

import { Home, Compass } from "lucide-react";

export function TimelineTabs() {
  return (
    <Tabs defaultValue="feed" className="w-full" onValueChange={() => window.scrollTo(0, 0)}>
      <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-muted p-1 rounded-full gap-1">
        <TabsTrigger 
          value="feed" 
          className="btn-shine relative overflow-hidden data-[state=active]:bg-linear-to-r data-[state=active]:from-primary-200 data-[state=active]:to-primary-300 dark:data-[state=active]:from-primary-200 dark:data-[state=active]:to-primary-300 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-linear-to-r hover:from-primary-200/50 hover:to-primary-300/50 transition-all duration-200 py-2.5 data-[state=active]:font-extrabold rounded-l-full rounded-r-2xl flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Feed
        </TabsTrigger>
        <TabsTrigger 
          value="explore" 
          className="btn-shine relative overflow-hidden data-[state=active]:bg-linear-to-r data-[state=active]:from-primary-200 data-[state=active]:to-primary-300 dark:data-[state=active]:from-primary-200 dark:data-[state=active]:to-primary-300 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-linear-to-r hover:from-primary-200/50 hover:to-primary-300/50 transition-all duration-200 py-2.5 data-[state=active]:font-extrabold rounded-r-full rounded-l-2xl flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Explore
        </TabsTrigger>
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
