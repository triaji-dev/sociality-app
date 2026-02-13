"use client";

import { AuthGuard } from "@/components/auth";
import { CreatePostForm } from "@/components/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/timeline" className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Create Post</h1>
        </div>
        
        <CreatePostForm />
      </div>
    </AuthGuard>
  );
}
