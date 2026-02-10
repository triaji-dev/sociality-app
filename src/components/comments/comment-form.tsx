"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAddComment } from "@/hooks/use-comments";
import { useAuthStore } from "@/stores/auth-store";
import { UserAvatar } from "@/components/users/user-avatar";

const commentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const user = useAuthStore((state) => state.user);
  const addComment = useAddComment(postId);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: "" },
  });

  function onSubmit(data: CommentFormData) {
    addComment.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  if (!user) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-3 p-4 border-t"
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
