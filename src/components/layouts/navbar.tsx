"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PlusSquare, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout, useDebounce, useSearchUsers } from "@/hooks";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  const { data: searchResults, isLoading } = useSearchUsers(debouncedQuery);
  const users = searchResults?.pages.flatMap((page) => page.data?.items || []) || [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      router.push(`/profile/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={isAuthenticated ? "/timeline" : "/timeline"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">
            Sociality
          </span>
        </Link>

        {/* Search */}
        <div className="hidden flex-1 max-w-md md:block relative">
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

          {isOpen && (searchQuery.trim() || debouncedQuery.trim()) && (
            <>
              {/* Overlay to close dropdown on click outside */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsOpen(false)} 
              />
              
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover text-popover-foreground rounded-md border shadow-md overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                       Searching...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No users found.
                    </div>
                  ) : (
                    users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.username}`}
                        className="flex items-center gap-3 p-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">{user.name}</span>
                          <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
                        </div>
                      </Link>
                    ))
                  )}
                  {(!debouncedQuery.trim() && searchQuery.trim()) && (
                     <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Typing...
                     </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
                      <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white text-sm">
                        {user ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name} />
                      <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white">
                        {user ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
