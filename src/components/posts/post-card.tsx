"use client";

import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/users/user-avatar";
import { PostActions } from "./post-actions";
import { Button } from "@/components/ui/button";
import { PostImage } from "./post-image";
import { FormattedText } from "@/components/shared/formatted-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/auth-store";
import { usePostModalStore } from "@/stores/post-modal-store";
import { useDeletePost, useMediaQuery } from "@/hooks";
import type { Post } from "@/types";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  showFullCaption?: boolean;
  onCommentClick?: () => void;
}

export function PostCard({ post, showFullCaption = false, onCommentClick }: PostCardProps) {
  const router = useRouter();
  const { openPost } = usePostModalStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = currentUser?.id === post.author.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deletePost = useDeletePost();

  const [isExpanded, setIsExpanded] = useState(showFullCaption);
  const caption = post.caption || "";
  const captionLimit = 150;
  const shouldTruncate = !showFullCaption && caption.length > captionLimit;

  const handleDelete = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  const handlePostClick = () => {
    if (onCommentClick) {
      onCommentClick();
      return;
    }

    if (isDesktop) {
      openPost(post.id);
    } else {
      router.push(`/posts/${post.id}`);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick();
      return;
    }

    if (isDesktop) {
      openPost(post.id);
    } else {
      router.push(`/posts/${post.id}?action=comment`);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="flex flex-col items-start gap-3">
        {/* Post Container */}
        <div className="flex flex-col items-start gap-3 w-full">
          {/* Header */}
          <div className="flex flex-row items-center justify-between w-full h-16">
            <div className="flex flex-row items-center gap-3">
              <Link href={isOwner ? "/profile" : `/profile/${post.author.username}`}>
                <UserAvatar
                  src={post.author.avatarUrl}
                  name={post.author.name}
                  size="lg"
                />
              </Link>
              <div className="flex flex-col items-start">
                <Link
                  href={isOwner ? "/profile" : `/profile/${post.author.username}`}
                  className="text-foreground text-base font-bold leading-[30px] tracking-[-0.02em] hover:opacity-80 transition-opacity"
                >
                  {post.author.name}
                </Link>
                <p className="text-muted-foreground text-sm font-normal leading-7 tracking-[-0.02em]">
                  {dayjs(post.createdAt).fromNow()}
                </p>
              </div>
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost2" size="icon" className="h-8 w-8 hover:scale-110 active:scale-90">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-foreground cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Image */}
          <div
            className="cursor-pointer w-full"
            onClick={handlePostClick}
          >
             <div
              className="w-full aspect-square relative overflow-hidden rounded-lg bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              style={{ minHeight: '300px' }}
            >
              <PostImage
                src={post.imageUrl}
                alt={post.caption || "Post image"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="w-full">
             <PostActions
              postId={post.id}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              likedByMe={post.likedByMe}
              savedByMe={post.savedByMe}
              onCommentClick={handleCommentClick}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col items-start gap-1 w-full">
            <p className="text-foreground text-base font-normal leading-[30px] tracking-[-0.02em]">
              <Link
                href={isOwner ? "/profile" : `/profile/${post.author.username}`}
                className="text-foreground text-base font-bold leading-[30px] tracking-[-0.02em] hover:opacity-80 transition-opacity cursor-pointer mr-2"
              >
                {post.author.name}
              </Link>
              <FormattedText 
                text={shouldTruncate && !isExpanded
                  ? caption.slice(0, captionLimit) + "..."
                  : caption} 
              />
            </p>
            {shouldTruncate && !isExpanded && (
              <Button
                variant="link"
                onClick={() => setIsExpanded(true)}
                className="text-primary text-base font-semibold leading-[30px] tracking-[-0.02em] hover:opacity-80 p-0 h-auto"
              >
                Show more
              </Button>
            )}
            
            {isExpanded && caption.length > captionLimit && (
               <Button
                variant="link"
                onClick={() => setIsExpanded(false)}
                className="text-primary text-base font-semibold leading-[30px] tracking-[-0.02em] hover:opacity-80 p-0 h-auto"
              >
                Show less
              </Button>
            )}
          </div>
        </div>
      </div>



      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePost.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
