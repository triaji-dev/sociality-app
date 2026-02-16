"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [error, setError] = useState(false);

  // Fallback image if the original fails to load
  const fallbackSrc = "/images/placeholder-post.webp"; // Ensure this exists or use a generic one

  return (
    <div className={cn("relative w-full h-full bg-muted overflow-hidden flex items-center justify-center", containerClassName)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
      )}
      
      <Image
        src={error ? fallbackSrc : (src || fallbackSrc)}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "object-cover transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        priority={false}
      />
    </div>
  );
}
