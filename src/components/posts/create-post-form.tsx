"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useCreatePost } from "@/hooks";

const createPostSchema = z.object({
  image: z.instanceof(File, { message: "Please select an image" }),
  caption: z.string().max(2200, "Caption must be at most 2200 characters").optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const router = useRouter();
  const createPost = useCreatePost();

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
    },
  });

  function onSubmit(data: CreatePostFormData) {
    createPost.mutate(
      { image: data.image, caption: data.caption },
      {
        onSuccess: () => {
          router.push("/timeline");
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a caption..."
                  className="min-h-[100px] resize-none"
                  disabled={createPost.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground text-right">
                {field.value?.length || 0}/2200
              </p>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={createPost.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={createPost.isPending}>
            {createPost.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Posting...
              </>
            ) : (
              "Share"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
