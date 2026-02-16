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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  if (pathname === "/profile/edit" || pathname === "/posts/new") return null;

  const navItems = [
    { href: "/timeline", label: "Home", icon: "home", requiresAuth: true, fallbackHref: "/timeline" },
    { href: "/posts/new", label: "Create", icon: "post", requiresAuth: true, fallbackHref: "/login" },
    { href: "/profile", label: "Profile", icon: "profile", requiresAuth: true, fallbackHref: "/login" },
  ];

  return (
    <nav 
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[345px] md:w-[360px] h-16 md:h-20 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-full flex flex-row justify-center items-center p-0 gap-[45px] md:gap-[25px] z-50 transition-transform duration-300 shadow-lg dark:shadow-none",
        !isVisible && "translate-y-[200%]"
      )}
    >
      <div className="flex w-full justify-between px-4 md:px-0 md:justify-center md:gap-6">
        {navItems.map((item) => {
           const href = item.requiresAuth && !isAuthenticated
            ? (item.fallbackHref || "/login")
            : item.href;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
             <Link
              key={item.href}
              href={href}
              className="flex flex-col items-center justify-center gap-[2px] w-[94px] h-[46px] transition-transform hover:scale-110 active:scale-95 duration-200 ease-in-out"
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center">
                {item.icon === 'post' ? (
                  <img
                    src="/icons/post-icon.svg"
                    alt="Post"
                    className="w-11 h-11 md:w-12 md:h-12"
                    style={{ filter: 'none' }}
                  />
                ) : (
                  <img
                    src={item.icon === 'home' ? '/icons/home-icon.svg' : '/icons/profile-icon.svg'}
                    alt={item.label}
                    className="w-5 h-5 md:w-6 md:h-6"
                    style={{ 
                        filter: isActive 
                            ? 'none'
                            : mounted && theme === 'dark'
                              ? 'brightness(0) saturate(100%) invert(100%)'
                              : 'brightness(0) saturate(100%) invert(50%)'
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
