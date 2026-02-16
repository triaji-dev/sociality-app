"use client";

import { AuthGuard } from "@/components/auth";
import { CreatePostForm } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewPostPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="w-full md:w-[452px] mx-auto px-4 md:px-0 flex flex-col gap-6">
        {/* Header */}
        <div className="hidden md:flex flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-7! h-7! text-foreground" strokeWidth={2.5} />
          </Button>
          <h1 className="text-foreground text-2xl font-bold leading-9">
            Add Post
          </h1>
        </div>

        <CreatePostForm />
      </div>
    </AuthGuard>
  );
}
