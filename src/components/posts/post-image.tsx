"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function PostImage({ src, alt, className, containerClassName }: PostImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className={cn("relative w-full h-full", containerClassName)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
}
