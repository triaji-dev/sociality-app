"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { useToggleLike, useToggleSave } from "@/hooks";
import { LikersDialog } from "./likers-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe?: boolean;
  onCommentClick?: () => void;
  onLikersClick?: () => void;
}

export function PostActions({
  postId,
  likeCount: initialLikeCount,
  commentCount,
  likedByMe: initialLikedByMe,
  savedByMe: initialSavedByMe = false,
  onCommentClick,
  onLikersClick,
}: PostActionsProps) {
  const [liked, setLiked] = useState(initialLikedByMe);
  const [saved, setSaved] = useState(initialSavedByMe);
  const [currentLikeCount, setCurrentLikeCount] = useState(initialLikeCount);
  const [showLikers, setShowLikers] = useState(false);

  // Sync with parent props when they change (e.g. from query refetch)
  useEffect(() => { setLiked(initialLikedByMe); }, [initialLikedByMe]);
  useEffect(() => { setSaved(initialSavedByMe); }, [initialSavedByMe]);
  useEffect(() => { setCurrentLikeCount(initialLikeCount); }, [initialLikeCount]);

  const toggleLike = useToggleLike();
  const toggleSave = useToggleSave();

  const handleLike = () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCurrentLikeCount((c) => (wasLiked ? c - 1 : c + 1));

    toggleLike.mutate(
      { postId, isLiked: wasLiked },
      {
        onSuccess: (response) => {
          if (response.data) {
            setLiked(response.data.liked);
            setCurrentLikeCount(response.data.likeCount);
          }
        },
        onError: () => {
          setLiked(wasLiked);
          setCurrentLikeCount((c) => (wasLiked ? c + 1 : c - 1));
        },
      },
    );
  };

  const handleSave = () => {
    const wasSaved = saved;
    setSaved(!wasSaved);

    toggleSave.mutate(
      { postId, isSaved: wasSaved },
      {
        onError: () => {
          setSaved(wasSaved);
        },
      },
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="-ml-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:text-red-500"
            onClick={handleLike}
            disabled={toggleLike.isPending}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all",
                liked && "fill-red-500 text-red-500",
                toggleLike.isPending && "opacity-50",
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={onCommentClick}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 h-9 w-9"
          onClick={handleSave}
          disabled={toggleSave.isPending}
        >
          <Bookmark
            className={cn(
              "h-5 w-5 transition-all",
              saved && "fill-current",
              toggleSave.isPending && "opacity-50",
            )}
          />
        </Button>
      </div>

      {currentLikeCount > 0 && (
        <button
          onClick={() => setShowLikers(true)}
          className="text-sm font-semibold hover:underline"
        >
          {currentLikeCount.toLocaleString()}{" "}
          {currentLikeCount === 1 ? "like" : "likes"}
        </button>
      )}

      {showLikers && (
        <LikersDialog
          postId={postId}
          open={showLikers}
          onOpenChange={setShowLikers}
        />
      )}
    </div>
  );
}
