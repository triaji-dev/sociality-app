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
      <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-transparent p-0 rounded-none border-b border-border gap-0">
        <TabsTrigger 
          value="feed" 
          className="flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 rounded-none border-b-2 transition-colors data-[state=active]:border-foreground data-[state=inactive]:border-border data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium md:text-base tracking-tight bg-transparent dark:data-[state=active]:border-white text-2xl"
        >
          <Home className="w-5 h-5 md:w-6 md:h-6" />
          Feed
        </TabsTrigger>
        <TabsTrigger 
          value="explore" 
          className="flex-1 flex flex-row justify-center items-center gap-2 md:gap-3 h-12 rounded-none border-b-2 transition-colors data-[state=active]:border-foreground data-[state=inactive]:border-border data-[state=active]:text-foreground data-[state=active]:font-bold data-[state=inactive]:text-muted-foreground data-[state=inactive]:font-medium text-2xl md:text-base tracking-tight bg-transparent dark:data-[state=active]:border-white"
        >
          <Compass className="w-5 h-5 md:w-6 md:h-6" />
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
