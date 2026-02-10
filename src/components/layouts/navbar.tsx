"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, PlusSquare, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/hooks";
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      router.push(`/users/search?q=${encodeURIComponent(query.trim())}`);
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
        <Link href={isAuthenticated ? "/feed" : "/explore"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="hidden text-xl font-bold sm:inline-block">
            Sociality
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Create Post */}
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link href="/posts/new">
                  <PlusSquare className="h-5 w-5" />
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                    <Link href="/me">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/me/saved">Saved Posts</Link>
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
