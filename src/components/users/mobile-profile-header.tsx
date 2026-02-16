"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";

interface MobileProfileHeaderProps {
  title?: string;
  username?: string; // For avatar fallback if needed
  avatarUrl?: string | null; // For avatar in header (optional, maybe not needed if we just show name)
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
  isMe?: boolean;
}

export function MobileProfileHeader({
  title,
  username,
  avatarUrl,
  showBack = true,
  rightAction,
  className,
  isMe
}: MobileProfileHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full h-14 bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-border md:hidden",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        
        {/* If we want an avatar in the header when scrolling, we could add it here. 
            For now, following the design which seems to be just Title/Name 
        */}
        <div className="flex items-center gap-2">
           {avatarUrl && (
               <UserAvatar name={title || ""} src={avatarUrl} size="sm" className="w-8 h-8" />
           )}
           <span className="font-bold text-lg">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {rightAction}
      </div>
    </header>
  );
}
