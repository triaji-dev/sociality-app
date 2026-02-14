'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/users/user-avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser } from '@/types';

interface ProfileDropdownProps {
  user: AuthUser;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none'
      >
        <UserAvatar user={user} size='md' />
        <span className='text-white text-sm font-medium hidden sm:block'>
          {user.name || user.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-56 bg-gray-950 border border-gray-900 rounded-xl shadow-lg py-2 z-50 animate-in slide-in-from-top-2 duration-200'>
          {/* Profile Link */}
          <Link
            href='/me'
            className='flex items-center gap-3 px-4 py-3 text-sm text-gray-25 hover:bg-gray-900 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            <User className='h-4 w-4 text-gray-400' />
            <span className='font-medium'>View Profile</span>
          </Link>

          {/* Settings Link */}
          <Link
            href='/settings'
            className='flex items-center gap-3 px-4 py-3 text-sm text-gray-25 hover:bg-gray-900 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            <Settings className='h-4 w-4 text-gray-400' />
            <span className='font-medium'>Settings</span>
          </Link>

          {/* Divider */}
          <div className='border-t border-gray-900 my-2' />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 px-4 py-3 text-sm text-red hover:bg-gray-900 transition-colors w-full text-left'
          >
            <LogOut className='h-4 w-4' />
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
