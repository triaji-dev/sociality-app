"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  avatarUrl?: string | null;
  name?: string;
  username?: string;
}

interface UserAvatarProps {
  user?: User | null;
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export function UserAvatar({
  src,
  name,
  user,
  size = "md",
  className,
}: UserAvatarProps) {
  const avatarUrl = user ? user.avatarUrl : src;
  const displayName = user ? user.name || user.username || "??" : name || "??";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={avatarUrl || undefined}
        alt={displayName}
        className="object-cover"
      />
      <AvatarFallback className="bg-linear-to-br from-neutral-600 to-neutral-800 text-white">
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
}
