"use client";

import { usePostModalStore } from "@/stores/post-modal-store";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePost } from "@/hooks";
import { UserAvatar } from "@/components/users/user-avatar";
import { PostActions } from "@/components/posts/post-actions";
import { CommentList } from "@/components/comments";
import { PageLoader, ErrorState } from "@/components/shared";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

dayjs.extend(relativeTime);

export function PostDetailModal() {
  const { isOpen, postId, closePost } = usePostModalStore();
  const { data, isLoading, error } = usePost(postId || 0);

  if (!isOpen) return null;

  const post = data?.data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePost()}>
      <DialogContent className="max-w-screen-2xl w-full p-0 overflow-hidden h-[90vh] flex flex-col md:flex-row gap-0">
        <VisuallyHidden>
          <DialogTitle>Post Detail</DialogTitle>
          <DialogDescription>
            Details of the post including image, caption, and comments
          </DialogDescription>
        </VisuallyHidden>

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <PageLoader />
          </div>
        ) : error || !post ? (
          <div className="flex items-center justify-center w-full h-full p-6">
            <ErrorState message={error?.message || "Post not found"} />
          </div>
        ) : (
          <>
            {/* Left side - Image */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[40vh] md:min-h-full">
              <img
                src={post.imageUrl}
                alt={post.caption || "Post image"}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Right side - Details */}
            <div className="w-full md:w-[400px] flex flex-col h-full bg-background border-l">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <Link
                  href={`/profile/${post.author.username}`}
                  onClick={closePost}
                  className="flex items-center gap-3"
                >
                  <UserAvatar
                    src={post.author.avatarUrl}
                    name={post.author.name}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-none">
                      {post.author.username}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Comments Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Caption */}
                  {post.caption && (
                     <div className="flex gap-3">
                      <Link
                        href={`/profile/${post.author.username}`}
                        onClick={closePost}
                      >
                         <UserAvatar
                          src={post.author.avatarUrl}
                          name={post.author.name}
                          size="sm"
                          className="h-8 w-8"
                        />
                      </Link>
                      <div className="space-y-1 text-sm">
                        <Link
                          href={`/profile/${post.author.username}`}
                          onClick={closePost}
                          className="font-semibold mr-2"
                        >
                          {post.author.username}
                        </Link>
                        <span className="whitespace-pre-wrap">{post.caption}</span>
                         <p className="text-xs text-muted-foreground mt-1">
                          {dayjs(post.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  )}

                   <div className="my-4 border-t" />
                   
                   <CommentList postId={post.id} />
                </div>
              </ScrollArea>

               {/* Footer Actions */}
              <div className="p-4 border-t bg-background mt-auto">
                 <PostActions
                  postId={post.id}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  likedByMe={post.likedByMe}
                  savedByMe={post.savedByMe}
                  onCommentClick={() => {}} 
                />
                 <p className="text-xs text-muted-foreground mt-2 uppercase">
                  {dayjs(post.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
