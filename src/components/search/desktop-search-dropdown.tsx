'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { UserAvatar } from '@/components/users/user-avatar';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { UserSearchResult } from '@/types';

interface DesktopSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
}

export function DesktopSearchDropdown({
  isOpen,
  onClose,
  searchQuery,
}: DesktopSearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['search-users', searchQuery],
    queryFn: () => userService.searchUsers(searchQuery),
    enabled: searchQuery.length > 0 && isOpen,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || searchQuery.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className='absolute left-1/2 transform -translate-x-1/2 top-[60px] w-[491px] h-auto max-h-[384px] bg-background border border-border rounded-[20px] py-2 flex flex-col gap-2 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-4 duration-200 ease-out fill-mode-forwards minimal-scrollbar'
      style={{
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
      }}
    >
      {isLoading ? (
        <div className='flex items-center justify-center py-8'>
          <div className='text-gray-400 text-sm'>Searching...</div>
        </div>
      ) : users?.data?.items && users.data.items.length > 0 ? (
        users.data.items.map((user: UserSearchResult) => (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            onClick={onClose}
            className='flex flex-row items-center gap-3 px-4 py-2 hover:bg-accent/50 transition-all cursor-pointer'
          >
            {/* User Avatar */}
            <div className='w-12 h-12 shrink-0'>
              <UserAvatar user={user} size='md' />
            </div>

            {/* User Details */}
            <div className='flex flex-col justify-center flex-1 min-w-0'>
              {/* Name */}
              <div className='text-foreground text-sm font-bold leading-7 tracking-[-0.01em] truncate'>
                {user.name || user.username}
              </div>
              {/* Username */}
              <div className='text-gray-400 text-sm font-normal leading-7 tracking-[-0.02em] truncate'>
                @{user.username}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-8'>
          <div className='text-foreground text-sm font-bold leading-7 tracking-[-0.02em] mb-1'>
            No results found
          </div>
          <div className='text-gray-400 text-sm font-normal leading-7 tracking-[-0.02em]'>
            Change your keyword
          </div>
        </div>
      )}
    </div>
  );
}
