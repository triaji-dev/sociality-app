"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-col items-start gap-3 w-full">
          {/* Header */}
          <div className="flex flex-row items-center gap-3 w-full h-16">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>

          {/* Image */}
          <Skeleton className="w-full aspect-square rounded-lg" style={{ minHeight: '300px' }} />

          {/* Actions */}
          <div className="flex flex-row items-center gap-4 w-full py-1">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
            <div className="ml-auto">
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-1.5 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <PostCardSkeleton />
          {i < count - 1 && (
            <div className="h-px w-full bg-border my-6" />
          )}
        </div>
      ))}
    </div>
  );
}
