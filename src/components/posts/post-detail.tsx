"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserAvatar } from "@/components/users/user-avatar";
import { PostActions } from "./post-actions";
import Link from "next/link";
import type { Post } from "@/types";

dayjs.extend(relativeTime);

interface PostDetailProps {
  post: Post;
  onCommentClick?: () => void;
  onLikersClick?: () => void;
}

export function PostDetail({ post, onCommentClick, onLikersClick }: PostDetailProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-0 overflow-hidden rounded-lg border bg-card">
      {/* Image */}
      <div className="bg-black flex items-center justify-center">
        <img
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          className="max-h-[600px] w-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Link href={`/profile/${post.author.username}`}>
            <UserAvatar
              src={post.author.avatarUrl}
              name={post.author.name}
              size="md"
            />
          </Link>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold text-sm hover:underline"
            >
              {post.author.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="p-4 border-b">
            <p className="text-sm whitespace-pre-wrap">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:underline"
              >
                {post.author.username}
              </Link>{" "}
              <span className="text-muted-foreground">{post.caption}</span>
            </p>
          </div>
        )}

        {/* Comments slot - filled by parent */}
        <div className="flex-1 overflow-y-auto" id="comments-container" />

        {/* Actions */}
        <div className="border-t p-4">
          <PostActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            likedByMe={post.likedByMe}
            savedByMe={post.savedByMe}
            onCommentClick={onCommentClick}
            onLikersClick={onLikersClick}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {dayjs(post.createdAt).format("MMMM D, YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
}
