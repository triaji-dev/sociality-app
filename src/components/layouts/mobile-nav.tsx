"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const mobileNavItems = [
  { href: "/timeline", label: "Timeline", icon: Home, requiresAuth: true, fallbackHref: "/timeline" },
  { href: "/posts/new", label: "Create", icon: PlusSquare, requiresAuth: true, fallbackHref: "/login" },
  { href: "/profile", label: "Profile", icon: User, requiresAuth: true, fallbackHref: "/login" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex h-16 items-center justify-around">
        {mobileNavItems.map((item) => {
          const href = item.requiresAuth && !isAuthenticated
            ? (item.fallbackHref || "/login")
            : item.href;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
