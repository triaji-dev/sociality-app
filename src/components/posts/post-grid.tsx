"use client";

import { Heart, MessageCircle } from "lucide-react";
import { InfiniteScroll, EmptyState, PageLoader, ErrorState } from "@/components/shared";
import { ImageOff } from "lucide-react";
import type { Post, SavedPost, LikedPost } from "@/types";
import { usePostModalStore } from "@/stores/post-modal-store";
import { PostImage } from "./post-image";

import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PostGridProps {
  posts: (Post | SavedPost | LikedPost)[];
  hasMore: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: Error | null;
  onRetry?: () => void;
}

export function PostGrid({
  posts,
  hasMore,
  isLoading,
  isFetchingNextPage,
  onLoadMore,
  emptyTitle = "No posts yet",
  emptyDescription,
  error,
  onRetry,
}: PostGridProps) {
  const { openPost } = usePostModalStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const handlePostClick = (postId: number) => {
    if (isDesktop) {
      openPost(postId);
    } else {
      router.push(`/posts/${postId}`);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={ImageOff}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <InfiniteScroll
      hasMore={hasMore}
      isLoading={isFetchingNextPage}
      onLoadMore={onLoadMore}
    >
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className="group relative aspect-square overflow-hidden bg-muted cursor-pointer"
          >
            <PostImage
              src={post.imageUrl}
              alt={post.caption || "Post"}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            
            {/* Hover overlay - only show if stats are available */}
            {'likeCount' in post && 'commentCount' in post && (
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-1 text-white">
                  <Heart className="h-5 w-5 fill-white" />
                  <span className="font-semibold">{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-1 text-white">
                  <MessageCircle className="h-5 w-5 fill-white" />
                  <span className="font-semibold">{post.commentCount}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
