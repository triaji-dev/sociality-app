"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark } from "lucide-react";
import { useToggleLike, useToggleSave } from "@/hooks";
import { LikersDialog } from "./likers-dialog";
import { ShareModal } from "./share-modal";
import { Button } from "@/components/ui/button";
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

const actionButtonClass = "group p-0 h-auto hover:bg-transparent hover:scale-110 active:scale-90 transition-all duration-200";

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
          <Button
            variant="ghost"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className={actionButtonClass}
          >
             <Heart
              className={cn(
                "w-6! h-6! transition-all duration-200",
                liked ? "fill-red text-red" : "text-foreground group-hover:text-red",
                toggleLike.isPending && "opacity-50"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowLikers(true)}
            className={actionButtonClass}
          >
            <span className="text-foreground text-base font-semibold leading-[30px] tracking-[-0.02em] transition-colors duration-200 group-hover:text-red">
               {currentLikeCount}
            </span>
          </Button>
        </div>

        {/* Comment Button */}
        <Button
          variant="ghost"
          onClick={onCommentClick}
          className={cn(actionButtonClass, "gap-1.5")}
        >
          <img src="/icons/comment-icon.svg" alt="Comment" className="w-6 h-6 transition-transform duration-200 dark:invert-0 invert" />
          <span className="text-foreground text-base font-semibold leading-[30px] tracking-[-0.02em] transition-colors duration-200">
            {commentCount}
          </span>
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          onClick={() => setShowShare(true)}
          className={actionButtonClass}
        >
          <img src="/icons/share-icon.svg" alt="Share" className="w-6 h-6 transition-transform duration-200 dark:invert-0 invert" />
        </Button>
      </div>

      {/* Right Action - Save */}
      <Button
        variant="ghost"
        onClick={handleSave}
        disabled={toggleSave.isPending}
        className={cn(actionButtonClass, "hover:bg-transparent")}
      >
        <Bookmark
          className={cn(
            "w-6! h-6! transition-all duration-200",
            saved ? "fill-foreground text-foreground" : "text-foreground",
             toggleSave.isPending && "opacity-50"
          )}
        />
      </Button>

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
