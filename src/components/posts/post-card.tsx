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
import { useDeletePost } from "@/hooks";
import type { Post } from "@/types";

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  showFullCaption?: boolean;
}

export function PostCard({ post, showFullCaption = false }: PostCardProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = currentUser?.id === post.author.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deletePost = useDeletePost();

  const [isExpanded, setIsExpanded] = useState(showFullCaption);
  const captionLimit = 150;
  const shouldTruncate = !showFullCaption && post.caption.length > captionLimit;

  const handleDelete = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <Link
          href={isOwner ? "/me" : `/users/${post.author.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar
            src={post.author.avatarUrl}
            name={post.author.name}
            size="md"
          />
          <div>
            <p className="font-semibold text-sm">{post.author.username}</p>
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

      <Link href={`/posts/${post.id}`}>
        <img
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          className="aspect-square w-full object-cover"
        />
      </Link>

      <CardContent className="pt-4 space-y-3">
        <PostActions
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          likedByMe={post.likedByMe}
          savedByMe={post.savedByMe}
          onCommentClick={() => router.push(`/posts/${post.id}`)}
        />

        {post.caption && (
          <div className="text-sm">
            <Link href={`/users/${post.author.username}`} className="font-semibold hover:underline">
              {post.author.username}
            </Link>{" "}
            <span className="text-muted-foreground">
              {shouldTruncate && !isExpanded
                ? post.caption.slice(0, captionLimit) + "..."
                : post.caption}
            </span>
            {shouldTruncate && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-muted-foreground hover:text-foreground ml-1"
              >
                more
              </button>
            )}
          </div>
        )}

        {post.commentCount > 0 && (
          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-muted-foreground hover:underline block"
          >
            View all {post.commentCount} comments
          </Link>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
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
