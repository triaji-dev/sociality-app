"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadCloud, ArrowUpToLine, Trash2 } from "lucide-react";
import { useCreatePost } from "@/hooks";

const createPostSchema = z.object({
  image: z.instanceof(File, { message: "Please select an image" }),
  caption: z.string().max(2200, "Caption must be at most 2200 characters").optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const router = useRouter();
  const createPost = useCreatePost();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
    },
  });

  const imageValue = form.watch("image");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        form.setValue("image", file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: createPost.isPending,
  });

  const handleRemoveImage = () => {
    form.setValue("image", undefined as unknown as File);
    setPreview(null);
  };

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end gap-4 w-full"
      >
        {/* Photo Upload Section */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="w-full">
              <Label className="w-full text-foreground text-sm font-bold leading-7 tracking-tight">
                Photo
              </Label>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`w-full bg-muted/30 border border-dashed rounded-xl flex flex-col items-center gap-3 p-6 transition-all cursor-pointer ${
                    imageValue ? "h-auto justify-start" : "h-36 justify-center"
                  } ${
                    isDragActive
                      ? "border-primary-300 bg-primary-300/10"
                      : "border-border"
                  }`}
                >
                  <input {...getInputProps()} />

                  {imageValue && preview ? (
                    <>
                      {/* Image Preview */}
                      <div className="w-full max-w-[395px] aspect-square relative overflow-hidden rounded-lg">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div
                        className="flex flex-row items-start gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Change Image */}
                        <div
                          {...getRootProps()}
                          className="flex flex-row items-center px-3 gap-1.5 h-10 bg-muted border border-border rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <ArrowUpToLine className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                          <span className="text-foreground text-sm font-medium leading-7 tracking-tight">
                            Change Image
                          </span>
                        </div>

                        {/* Delete Image */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex flex-row items-center px-3 gap-1.5 h-10 bg-muted border border-border rounded-xl hover:bg-red/10 hover:border-red transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red" strokeWidth={1.5} />
                          <span className="text-red text-sm font-medium leading-7 tracking-tight">
                            Delete Image
                          </span>
                        </button>
                      </div>

                      {/* File Info */}
                      <div className="text-primary-200 text-sm font-medium leading-7 tracking-tight text-center">
                        ✓ {imageValue.name} - Ready to post
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Upload Icon */}
                      <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center shrink-0">
                        <UploadCloud className="w-5 h-5 text-foreground" strokeWidth={1.67} />
                      </div>

                      {/* Text */}
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="flex flex-row items-center gap-1">
                          <span className="text-primary-200 text-sm font-bold leading-7 tracking-tight">
                            Click to upload
                          </span>
                          <span className="text-muted-foreground text-sm font-semibold leading-7 tracking-tight">
                            or drag and drop
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm font-semibold leading-7 tracking-tight text-center">
                          PNG or JPG (max. 5mb)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Caption Section */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label className="w-full text-foreground text-sm font-bold leading-7 tracking-tight">
                Caption
              </Label>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className="w-full min-h-[101px] px-4 py-2 bg-muted/30 text-foreground placeholder:text-muted-foreground text-sm md:text-base leading-7 md:leading-[30px] tracking-tight rounded-xl resize-none border border-border focus:border-primary-300 focus:ring-primary-300 overflow-hidden"
                  style={{ fieldSizing: "content" } as React.CSSProperties}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary-300 text-white text-base font-bold leading-[30px] tracking-tight rounded-full hover:opacity-90 transition-opacity"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Creating..." : "Share"}
        </Button>
      </form>
    </Form>
  );
}
