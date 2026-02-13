"use client";

import { use } from "react";
import { usePost } from "@/hooks";
import { PostCard } from "@/components/posts";
import { CommentList } from "@/components/comments";
import { PageLoader, ErrorState } from "@/components/shared";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id);
  const { data, isLoading, error, refetch } = usePost(postId);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message || "Post not found"} onRetry={() => refetch()} />;
  }

  const post = data.data;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/timeline" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <div className="space-y-6">
        <PostCard post={post} showFullCaption />
        
        <div className="border rounded-lg">
          <h2 className="font-semibold p-4 border-b">Comments</h2>
          <CommentList postId={postId} />
        </div>
      </div>
    </div>
  );
}
