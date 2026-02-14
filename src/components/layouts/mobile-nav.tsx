"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";



export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/timeline", label: "Home", icon: "home", requiresAuth: true, fallbackHref: "/timeline" },
    { href: "/posts/new", label: "Create", icon: "post", requiresAuth: true, fallbackHref: "/login" },
    { href: "/profile", label: "Profile", icon: "profile", requiresAuth: true, fallbackHref: "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background h-[82px] flex items-center justify-center">
      <div className="flex w-full justify-between px-8 md:px-0 md:justify-center md:gap-14">
        {navItems.map((item) => {
           const href = item.requiresAuth && !isAuthenticated
            ? (item.fallbackHref || "/login")
            : item.href;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
             <Link
              key={item.href}
              href={href}
              className="flex flex-col items-center justify-center gap-[2px] w-[94px] h-[46px]"
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center">
                {item.icon === 'post' ? (
                  <img
                    src="/icons/post-icon.svg"
                    alt="Post"
                    className="w-11 h-11"
                    style={{ filter: 'none' }}
                  />
                ) : (
                  <img
                    src={item.icon === 'home' ? '/icons/home-icon.svg' : '/icons/profile-icon.svg'}
                    alt={item.label}
                    className="w-5 h-5"
                    style={{ 
                        filter: isActive 
                            ? (item.icon === 'home' ? 'none' : 'brightness(0) saturate(100%) invert(51%) sepia(73%) saturate(4587%) hue-rotate(245deg) brightness(98%) contrast(93%)')
                            : (mounted && theme === 'light' ? 'brightness(0) saturate(100%) invert(60%)' : 'brightness(0) saturate(100%) invert(100%)')
                    }}
                  />
                )}
              </div>

               {/* Label - Hide for post icon */}
              {item.icon !== 'post' && (
                <span
                  className={cn(
                    "text-xs leading-4 text-center tracking-[-0.02em] w-[94px]",
                     isActive 
                        ? (item.icon === 'home' ? 'text-primary-200 font-bold' : 'text-primary-200 font-normal')
                        : 'text-muted-foreground font-normal'
                  )}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
