"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useToggleLike, useToggleSave } from "@/hooks";
import { LikersDialog } from "./likers-dialog";
import { ShareModal } from "./share-modal";
import { toast } from "sonner";

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
  const [showShare, setShowShare] = useState(false);

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
            if (response.data.liked) {
              toast.success("Liked");
            } else {
              toast.error("Unliked");
            }
          }
        },
        onError: () => {
          setLiked(wasLiked);
          setCurrentLikeCount((c) => (wasLiked ? c + 1 : c - 1));
          toast.error("Failed to update like status");
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
        onSuccess: () => {
             if (!wasSaved) {
               toast.success("Saved");
             } else {
               toast.error("Unsaved");
             }
        },
        onError: () => {
          setSaved(wasSaved);
          toast.error("Failed to update save status");
        },
      },
    );
  };

  return (
    <div className="flex flex-row justify-between items-center w-full h-[30px]">
      {/* Left Actions */}
      <div className="flex flex-row items-center gap-4">
        {/* Like Button */}
        <div className="flex flex-row items-center gap-1.5">
          <button
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className="group flex flex-row items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200"
          >
             <Heart
              className={cn(
                "w-6 h-6 transition-all duration-200",
                liked ? "fill-red text-red" : "text-foreground group-hover:text-red",
                toggleLike.isPending && "opacity-50"
              )}
            />
          </button>
          <button
            onClick={() => setShowLikers(true)}
            className="group flex flex-row items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200"
          >
            <span className="text-foreground text-base font-semibold leading-[30px] tracking-[-0.02em] transition-colors duration-200 group-hover:text-red">
               {currentLikeCount}
            </span>
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={onCommentClick}
          className="group flex flex-row items-center gap-1.5 cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200"
        >
          <img src="/icons/comment-icon.svg" alt="Comment" className="w-6 h-6 transition-transform duration-200 dark:invert-0 invert" />
          <span className="text-foreground text-base font-semibold leading-[30px] tracking-[-0.02em] transition-colors duration-200">
            {commentCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShare(true)}
          className="group flex flex-row items-center gap-1.5 cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200"
        >
          <img src="/icons/share-icon.svg" alt="Share" className="w-6 h-6 transition-transform duration-200 dark:invert-0 invert" />
        </button>
      </div>

      {/* Right Action - Save */}
      <button
        onClick={handleSave}
        disabled={toggleSave.isPending}
        className="cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200"
      >
        <Bookmark
          className={cn(
            "w-6 h-6 transition-all duration-200",
            saved ? "fill-foreground text-foreground" : "text-foreground",
             toggleSave.isPending && "opacity-50"
          )}
        />
      </button>

      {showLikers && (
        <LikersDialog
          postId={postId}
          open={showLikers}
          onOpenChange={setShowLikers}
        />
      )}

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={typeof window !== "undefined" ? `${window.location.origin}/posts/${postId}` : ""}
        title="Check out this post on Sociality!"
      />
    </div>
  );
}
