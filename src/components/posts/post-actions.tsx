"use client";

import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { useToggleLike, useToggleSave } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  onCommentClick?: () => void;
  onLikersClick?: () => void;
}

export function PostActions({
  postId,
  likeCount,
  commentCount,
  likedByMe,
  savedByMe,
  onCommentClick,
  onLikersClick,
}: PostActionsProps) {
  const toggleLike = useToggleLike();
  const toggleSave = useToggleSave();

  const handleLike = () => {
    toggleLike.mutate({ postId, isLiked: likedByMe });
  };

  const handleSave = () => {
    toggleSave.mutate({ postId, isSaved: savedByMe });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className="hover:text-red-500"
          >
            <Heart
              className={cn(
                "h-6 w-6 transition-all",
                likedByMe && "fill-red-500 text-red-500",
                toggleLike.isPending && "opacity-50"
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onCommentClick}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          <Button variant="ghost" size="icon">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
        >
          <Bookmark
            className={cn(
              "h-6 w-6 transition-all",
              savedByMe && "fill-current",
              toggleSave.isPending && "opacity-50"
            )}
          />
        </Button>
      </div>

      {likeCount > 0 && (
        <button
          onClick={onLikersClick}
          className="text-sm font-semibold hover:underline"
        >
          {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
        </button>
      )}
    </div>
  );
}
