'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { UserAvatar } from '@/components/users/user-avatar';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { UserSearchResult } from '@/types';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search users
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search-users', debouncedQuery],
    queryFn: () => userService.searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side='right'
        showCloseButton={false}
        className='w-full sm:max-w-none h-dvh bg-background border-b border-border p-0 flex flex-col'
      >
        <VisuallyHidden>
          <SheetTitle>Search Users</SheetTitle>
          <SheetDescription>Search for users by name or username</SheetDescription>
        </VisuallyHidden>

        {/* Header — matches navbar h-16 */}
        <header className='flex items-center gap-3 px-4 h-16 shrink-0 border-b border-border'>
          <div className='flex-1 relative'>
            <div className='flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-full'>
              <Search className='h-5 w-5 text-muted-foreground' strokeWidth={1.25} />
              <input
                type='text'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm focus:outline-none'
                autoFocus
              />
            </div>
          </div>

          <SheetClose asChild>
            <button className='p-2 hover:opacity-80 transition-opacity cursor-pointer'>
              <X className='h-6 w-6 text-foreground' strokeWidth={2} />
            </button>
          </SheetClose>
        </header>

        {/* Search Results */}
        <div className='flex-1 flex flex-col overflow-y-auto px-4 py-4'>
          {searchQuery.length === 0 ? (
            <div className='flex-1 flex flex-col items-center justify-center text-center'>
              <Search className='h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground text-sm'>
                Start typing to search for users
              </p>
            </div>
          ) : isLoading ? (
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex items-center gap-3 p-2'>
                  <div className='w-12 h-12 bg-muted rounded-full animate-pulse' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-muted rounded animate-pulse w-3/4' />
                    <div className='h-3 bg-muted rounded animate-pulse w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults?.data?.items && searchResults.data.items.length > 0 ? (
            <div className='space-y-1'>
              {searchResults.data.items.map((user: UserSearchResult) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className='flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors'
                >
                  <div className='w-12 h-12 shrink-0'>
                    <UserAvatar user={user} size='md' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-foreground text-sm font-bold leading-5 truncate'>
                      {user.name || user.username}
                    </div>
                    <div className='text-muted-foreground text-xs leading-5 truncate'>
                      @{user.username}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center text-center'>
              <p className='text-foreground text-base font-bold'>
                No results found
              </p>
              <p className='text-muted-foreground text-sm mt-1'>
                Change your keyword
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
