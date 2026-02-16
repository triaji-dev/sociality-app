"use client";

import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { InfiniteScroll, EmptyState, PageLoader, ErrorState } from "@/components/shared";
import { MessageSquare } from "lucide-react";
import { useComments } from "@/hooks/use-comments";
import type { Comment } from "@/types";

interface CommentListProps {
  postId: number;
  variant?: "default" | "rich";
}

export function CommentList({ postId, variant = "default" }: CommentListProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useComments(postId);

  const comments = data?.pages.flatMap((page) => page.data?.items || []) || [];

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        {comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description="Be the first to comment!"
          />
        ) : (
          <InfiniteScroll
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          >
            <div className="divide-y">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} postId={postId} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
      
      <CommentForm postId={postId} variant={variant} />
    </div>
  );
}
