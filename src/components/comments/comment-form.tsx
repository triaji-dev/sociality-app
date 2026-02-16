import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAddComment } from "@/hooks/use-comments";
import { useAuthStore } from "@/stores/auth-store";
import { UserAvatar } from "@/components/users/user-avatar";
import { cn } from "@/lib/utils";

const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: number;
  variant?: "default" | "rich"; 
  className?: string;
}

export function CommentForm({ postId, variant = "default", className }: CommentFormProps) {
  const user = useAuthStore((state) => state.user);
  const addComment = useAddComment(postId);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: "" },
  });

  const commonEmojis = [
    '😀', '😅', '😍', '😇', '😊', '😋',
    '🤪', '🤐', '😉', '🤗', '😪', '🙄',
    '🤫', '😴', '🥵', '😫', '😭', '😱'
  ];

  function onSubmit(data: CommentFormData) {
    if (!data.text.trim()) return;
    
    addComment.mutate(data, {
      onSuccess: () => {
        form.reset();
        setShowEmojiPicker(false);
      },
    });
  }

  const handleEmojiClick = (emoji: string) => {
    const currentText = form.getValues("text");
    form.setValue("text", currentText + emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  if (variant === "rich") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("mt-auto p-4 bg-background", className)}>
            <div className="flex gap-2 relative">
                <div className="relative" ref={emojiPickerRef}>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="h-12 w-12 rounded-xl shrink-0"
                  >
                    <Smile className="w-5! h-5! text-foreground" />
                  </Button>
                  {showEmojiPicker && (
                      <div className="absolute bottom-14 left-0 w-[240px] bg-background border border-border rounded-xl p-2 z-50 shadow-xl overflow-hidden">
                        <div className="grid grid-cols-6 gap-2">
                            {commonEmojis.map(emoji => (
                              <button key={emoji} type="button" onClick={() => handleEmojiClick(emoji)} className="text-xl p-1 hover:bg-accent rounded transition-colors flex items-center justify-center h-8 w-8 cursor-pointer">
                                {emoji}
                              </button>
                            ))}
                        </div>
                      </div>
                  )}
                </div>

                <div className="flex-1 relative">
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Add Comment"
                              disabled={addComment.isPending}
                              className="h-12 bg-background border border-border pr-14 focus:border-primary-300 text-foreground placeholder:text-muted-foreground rounded-xl"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                        type="submit" 
                        disabled={!form.watch("text")?.trim() || addComment.isPending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-transparent hover:bg-transparent text-primary-300 font-bold disabled:text-muted-foreground shadow-none"
                    >
                        Post
                    </Button>
                </div>
            </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex items-center gap-3 p-4 border-t", className)}
      >
        <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Add a comment..."
                  disabled={addComment.isPending}
                  className="border-0 focus-visible:ring-0 px-0"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          disabled={addComment.isPending || !form.watch("text").trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
