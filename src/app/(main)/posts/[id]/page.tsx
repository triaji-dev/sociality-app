"use client";

import { useState, use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePost, useMediaQuery } from "@/hooks";
import { PostCard } from "@/components/posts";
import { CommentList } from "@/components/comments";
import { PageLoader, ErrorState } from "@/components/shared";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id);
  const { data, isLoading, error, refetch } = usePost(postId);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "comment") {
      setIsCommentOpen(true);
    }
  }, [searchParams]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data?.data) {
    return <ErrorState message={error?.message || "Post not found"} onRetry={() => refetch()} />;
  }

  const post = data.data;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/timeline" className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <div className="space-y-6">
        <PostCard 
          post={post} 
          showFullCaption 
          preventNavigation
          onCommentClick={!isDesktop ? () => setIsCommentOpen(true) : undefined}
        />
        
        {/* Comment Sheet (Styled like LikersDialog) */}
        <div className="hidden md:block mt-8">
           <CommentList postId={postId} variant="rich" />
        </div>

        {/* Comment Sheet (Mobile Only) */}
        <div className="md:hidden">
            <Sheet open={isCommentOpen} onOpenChange={setIsCommentOpen}>
            <SheetContent 
                side="bottom" 
                className="max-h-[85vh] h-auto flex flex-col p-0 rounded-t-[20px] overflow-hidden"
            >
                <SheetHeader className="p-4">
                <SheetTitle>Comments</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden relative">
                <CommentList postId={postId} variant="rich" />
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </div>
  );
}
