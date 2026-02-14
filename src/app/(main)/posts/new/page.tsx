"use client";

import { AuthGuard } from "@/components/auth";
import { CreatePostForm } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="w-full md:w-[452px] mx-auto px-4 md:px-0 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-7 h-7 text-foreground" strokeWidth={2.5} />
          </button>
          <h1 className="text-foreground text-2xl font-bold leading-9">
            Add Post
          </h1>
        </div>

        <CreatePostForm />
      </div>
    </AuthGuard>
  );
}
