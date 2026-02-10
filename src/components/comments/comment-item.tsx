"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/users/user-avatar";
import { Button } from "@/components/ui/button";
import { useDeleteComment } from "@/hooks/use-comments";
import type { Comment } from "@/types";

dayjs.extend(relativeTime);

interface CommentItemProps {
  comment: Comment;
  postId: number;
}

export function CommentItem({ comment, postId }: CommentItemProps) {
  const deleteComment = useDeleteComment(postId);

  const handleDelete = () => {
    deleteComment.mutate(comment.id);
  };

  return (
    <div className="flex gap-3 py-3">
      <Link href={`/users/${comment.author.username}`}>
        <UserAvatar
          src={comment.author.avatarUrl}
          name={comment.author.name}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <Link
            href={`/users/${comment.author.username}`}
            className="font-semibold hover:underline"
          >
            {comment.author.username}
          </Link>{" "}
          <span className="text-muted-foreground">{comment.text}</span>
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">
            {dayjs(comment.createdAt).fromNow()}
          </span>
          {comment.isMine && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
