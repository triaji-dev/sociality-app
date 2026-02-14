'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { UserAvatar } from '@/components/users/user-avatar';
import { userService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';
import { UserSearchResult } from '@/types';
import Link from 'next/link';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-background flex flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 py-4 border-b border-border'>
        {/* Search Bar */}
        <div className='flex-1 flex items-center gap-3'>
          <div className='flex-1 relative'>
            <div className='flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-full'>
              <Search className='h-5 w-5 text-gray-500' strokeWidth={1.25} />
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className='p-2 hover:opacity-80 transition-opacity'
          >
            <X className='h-6 w-6 text-foreground' strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Search Results */}
      <div className='flex-1 overflow-y-auto px-4 py-4'>
        {searchQuery.length === 0 ? (
          <div className='text-center py-12'>
            <Search className='h-12 w-12 text-gray-500 mx-auto mb-4' />
            <p className='text-gray-400 text-sm'>
              Start typing to search for users
            </p>
          </div>
        ) : isLoading ? (
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center gap-3 p-2'>
                <div className='w-12 h-12 bg-gray-900 rounded-full animate-pulse'></div>
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-900 rounded animate-pulse w-3/4'></div>
                  <div className='h-3 bg-gray-900 rounded animate-pulse w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResults?.data?.items && searchResults.data.items.length > 0 ? (
          <div className='space-y-4'>
            {searchResults.data.items.map((user: UserSearchResult) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                onClick={onClose}
                className='flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer'
              >
                <div className="w-16 h-16">
                  <UserAvatar user={user} size='lg' />
                </div>
                <div className='flex-1'>
                  <div className='text-foreground text-sm font-bold leading-7'>
                    {user.name || user.username}
                  </div>
                  <div className='text-gray-400 text-sm leading-7'>
                    @{user.username}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center pt-24'>
            <div className='flex flex-col justify-center items-start gap-1 w-[138px] h-[155px]'>
              <div className='text-center text-foreground text-base font-bold leading-[30px] tracking-[-0.02em] w-full'>
                No results found
              </div>
              <div className='text-center text-gray-400 text-sm font-normal leading-7 tracking-[-0.02em] w-full'>
                Change your keyword
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
