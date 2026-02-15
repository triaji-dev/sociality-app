"use client";

import { useState, useEffect, useRef } from "react";
import { X, Smile, Loader2, MoreHorizontal } from "lucide-react";
import { usePostModalStore } from "@/stores/post-modal-store";
import { usePost, useDeletePost } from "@/hooks/use-posts";
import { useComments, useAddComment, useDeleteComment } from "@/hooks/use-comments";
import { UserAvatar } from "@/components/users/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostActions } from "@/components/posts/post-actions";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

// Helper for generic image URL handling
const getImageUrl = (url?: string) => {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_BASE_URL || ""}${url}`;
};

export function PostDetailModal() {
  const { isOpen, postId, closePost } = usePostModalStore();
  const { data: postData, isLoading: isPostLoading } = usePost(postId || 0);
  const post = postData?.data;

  // Hooks for comments
  const { 
    data: commentsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: isCommentsLoading 
  } = useComments(postId || 0);

  const comments = commentsData?.pages.flatMap((page) => page.data?.items || []) || [];

  // Mutations
  const addComment = useAddComment(postId || 0);
  const deleteComment = useDeleteComment(postId || 0);
  const deletePostMutation = useDeletePost();

  // Local State
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState<number | null>(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const currentUser = useAuthStore((state) => state.user);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageLoading(true);
      setImageError(false);
      setCommentText("");
      setShowEmojiPicker(false);
      setShowDeleteMenu(null);
      setShowPostMenu(false);
    }
  }, [isOpen, postId]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!loadMoreTriggerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: commentsContainerRef.current, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(loadMoreTriggerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle outside clicks for menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) setShowEmojiPicker(false);
      if (showDeleteMenu !== null && !target.closest('.delete-menu-container')) setShowDeleteMenu(null);
      if (showPostMenu && !target.closest('.post-menu-container')) setShowPostMenu(false);
    };

    if (showEmojiPicker || showDeleteMenu !== null || showPostMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker, showDeleteMenu, showPostMenu]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment.mutate(
      { text: commentText },
      {
        onSuccess: () => setCommentText("")
        // Toast handled by hook
      }
    );
  };

  const handleDeletePost = () => {
    if (postId) {
      deletePostMutation.mutate(postId, {
        onSuccess: () => closePost()
      });
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    '😀', '😅', '😍', '😇', '😊', '😋',
    '🤪', '🤐', '😉', '🤗', '😪', '🙄',
    '🤫', '😴', '🥵', '😫', '😭', '😱'
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePost()}>
      <DialogContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-240px)] sm:max-w-none h-[80vh] max-h-[720px] p-0 gap-0 overflow-visible bg-gray-950 border border-gray-900 flex flex-col md:flex-row [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Post Detail</DialogTitle>
          <DialogDescription>Full post view with comments</DialogDescription>
        </VisuallyHidden>

        {/* Close Button - Top-Right Corner */}
        <div className="absolute -top-10 right-0 h-10 w-10 flex items-center justify-center z-50">
          <DialogClose className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer group">
            <X className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden rounded-lg">

        {isPostLoading || !post ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
             <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-black relative shrink-0">
               {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                  </div>
                )}
                <img
                  src={getImageUrl(post.imageUrl)}
                  alt={post.caption || "Post"}
                  className={cn(
                    "w-full h-full object-contain transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setImageLoading(false)}
                  onError={() => { setImageLoading(false); setImageError(true); }}
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col w-full md:w-[40%] h-full bg-gray-950 border-l border-gray-900">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gray-950">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar user={post.author} size="md" />
                  <div className="flex flex-col min-w-0">
                    <p className="text-gray-25 text-sm font-bold truncate">
                      {post.author.name || post.author.username}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {dayjs(post.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {/* Post Menu (Owner only) */}
                {post.author.id === currentUser?.id && (
                  <div className="relative post-menu-container">
                    <button 
                      onClick={() => setShowPostMenu(!showPostMenu)}
                      className="p-1 hover:bg-gray-900 rounded-full transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-25" />
                    </button>
                    {showPostMenu && (
                      <div className="absolute right-0 top-8 w-32 bg-gray-950 border border-gray-900 rounded-lg shadow-lg z-50 py-1">
                        {/* Edit omitted as service missing */}
                        <button
                          onClick={handleDeletePost}
                          className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-900 transition-colors"
                        >
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Caption & Comments Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 minimal-scrollbar" ref={commentsContainerRef}>
                {post.caption && (
                  <div className="mb-4">
                    <p className="text-gray-25 text-sm leading-relaxed whitespace-pre-wrap">
                      {post.caption}
                    </p>
                  </div>
                )}
                
                <div className="w-full h-px bg-gray-900 mb-4" />
                
                <h3 className="text-gray-25 text-base font-bold mb-3">Comments</h3>

                <div className="space-y-4">
                  {isCommentsLoading && comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm">Loading comments...</div>
                  ) : comments.length === 0 ? (
                     <div className="text-center py-4 text-gray-400 text-sm">No comments yet</div>
                  ) : (
                    <>
                      {comments.map((comment) => (
                        <div key={comment.id} className="group flex flex-col gap-2 border-b border-gray-900 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0">
                                <UserAvatar user={comment.author} size="sm" className="w-10 h-10 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                   <span className="text-gray-25 text-sm font-bold truncate">
                                     {comment.author.name || comment.author.username}
                                   </span>
                                   <span className="text-gray-400 text-xs mt-0.5">
                                     {dayjs(comment.createdAt).fromNow()}
                                   </span>
                                </div>
                              </div>

                              {/* Comment Menu */}
                              {(post.author.id === currentUser?.id || comment.author.id === currentUser?.id) && (
                                 <div className="relative delete-menu-container opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                   <button
                                     onClick={() => setShowDeleteMenu(showDeleteMenu === comment.id ? null : comment.id)}
                                     className="p-1 hover:bg-gray-900 rounded-full transition-colors"
                                   >
                                     <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                   </button>
                                   {showDeleteMenu === comment.id && (
                                     <div className="absolute right-0 top-6 w-24 bg-gray-950 border border-gray-900 rounded-lg shadow-lg z-50 py-1">
                                       <button
                                         onClick={() => deleteComment.mutate(comment.id)}
                                         className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-gray-900 cursor-pointer"
                                       >
                                         Delete
                                       </button>
                                     </div>
                                   )}
                                 </div>
                              )}
                           </div>
                           <p className="text-gray-25 text-sm whitespace-pre-wrap word-break-all">
                             {comment.text}
                           </p>
                        </div>
                      ))}
                      
                      <div ref={loadMoreTriggerRef} className="h-4 w-full" />
                      {isFetchingNextPage && (
                        <div className="flex justify-center py-2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Footer Actions & Input */}
              <div className="p-4 bg-gray-950 mt-auto">
                 <PostActions 
                    postId={post.id}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount} 
                    likedByMe={post.likedByMe}
                    savedByMe={post.savedByMe}
                    // onCommentClick not needed as we are already in the modal
                 />
                 
                 <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2 relative">
                    <div className="relative emoji-picker-container">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="h-12 w-12 flex items-center justify-center border border-gray-900 rounded-xl hover:bg-gray-900 transition-colors"
                      >
                        <Smile className="w-5 h-5 text-gray-25" />
                      </button>
                      {showEmojiPicker && (
                         <div className="absolute bottom-14 left-0 w-[240px] bg-gray-950 border border-gray-900 rounded-xl p-2 z-50 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-6 gap-2">
                               {commonEmojis.map(emoji => (
                                 <button key={emoji} type="button" onClick={() => handleEmojiClick(emoji)} className="text-xl p-1 hover:bg-gray-900 rounded transition-colors flex items-center justify-center h-8 w-8 cursor-pointer">
                                   {emoji}
                                 </button>
                               ))}
                            </div>
                         </div>
                      )}
                    </div>

                    <div className="flex-1 relative">
                       <Input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add Comment"
                          className="h-12 bg-gray-950 border border-gray-900 pr-14 focus:border-primary-300 text-gray-25 placeholder:text-gray-500 rounded-xl"
                          disabled={addComment.isPending}
                       />
                       <Button 
                          type="submit" 
                          disabled={!commentText.trim() || addComment.isPending}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-transparent hover:bg-transparent text-primary-300 font-bold disabled:text-gray-600"
                       >
                          Post
                       </Button>
                    </div>
                 </form>
              </div>

            </div>
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
