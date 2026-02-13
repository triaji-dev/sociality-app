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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { usePostModalStore } from "@/stores/post-modal-store";
import { useDeletePost } from "@/hooks";
import type { Post } from "@/types";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  showFullCaption?: boolean;
}

export function PostCard({ post, showFullCaption = false }: PostCardProps) {
  const router = useRouter();
  const { openPost } = usePostModalStore();
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

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 px-4 py-3">
        <Link
          href={isOwner ? "/profile" : `/profile/${post.author.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar
            src={post.author.avatarUrl}
            name={post.author.name}
            size="md"
          />
          <div>
            <p className="text-sm font-semibold leading-tight">
              {post.author.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </Link>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <div
        className="cursor-pointer"
        onClick={() => openPost(post.id)}
      >
        <img
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          className="aspect-square w-full object-cover"
        />
      </div>

      <CardContent className="space-y-2 px-4 py-3">
        <PostActions
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          likedByMe={post.likedByMe}
          savedByMe={post.savedByMe}
          onCommentClick={() => openPost(post.id)}
        />

        {caption && (
          <div className="text-sm leading-snug">
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.username}
            </Link>{" "}
            <span className="text-muted-foreground">
              {shouldTruncate && !isExpanded
                ? caption.slice(0, captionLimit) + "..."
                : caption}
            </span>
            {shouldTruncate && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                more
              </button>
            )}
          </div>
        )}

        {post.commentCount > 0 && (
          <button
            onClick={() => openPost(post.id)}
            className="block text-sm text-muted-foreground/80 hover:text-muted-foreground text-left"
          >
            View all {post.commentCount} comments
          </button>
        )}
      </CardContent>

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
    </Card>
  );
}
