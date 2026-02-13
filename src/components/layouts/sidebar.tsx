"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, User, Bookmark, PlusSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const navItems = [
  { href: "/timeline", label: "Timeline", icon: Home, requiresAuth: true },
  { href: "/posts/new", label: "Create", icon: PlusSquare, requiresAuth: true },
  { href: "/me", label: "Profile", icon: User, requiresAuth: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const visibleItems = navItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
