"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSearchUsers } from "@/hooks";
import { UserList } from "@/components/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useSearchUsers(initialQuery);
  const users = data?.pages.flatMap((page) => page.data?.items || []) || [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/users/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Users</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {initialQuery ? (
        <UserList
          users={users}
          hasMore={!!hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          emptyTitle={`No users found for "${initialQuery}"`}
          emptyDescription="Try a different search term"
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Enter a search term to find users
        </p>
      )}
    </div>
  );
}
