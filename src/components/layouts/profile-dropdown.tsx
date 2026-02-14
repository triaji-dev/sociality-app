'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/users/user-avatar';
import { LogOut, User, Sun, Moon, UserPen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser } from '@/types';

interface ProfileDropdownProps {
  user: AuthUser;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className='cursor-pointer flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105 ease-in-out duration-200 focus:outline-none'
      >
        <UserAvatar user={user} size='md' />
        <span className='text-foreground text-sm font-medium hidden sm:block'>
          {user.name || user.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ease-out fill-mode-forwards'>
          {/* Profile Link */}
          <Link
            href='/profile'
            className='flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/50 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            <User className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>View Profile</span>
          </Link>
          
          {/* Edit Profile Link */}
          <Link
            href='/profile/edit'
            className='flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/50 transition-colors'
            onClick={() => setIsOpen(false)}
          >
            <UserPen className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Edit Profile</span>
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/50 transition-colors w-full text-left cursor-pointer'
            >
              {theme === 'dark' ? (
                <>
                  <Sun className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium'>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium'>Dark Mode</span>
                </>
              )}
            </button>
          )}

          {/* Divider */}
          <div className='border-t border-border my-2' />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 px-4 py-3 text-sm text-red hover:bg-accent/50 transition-colors w-full text-left cursor-pointer'
          >
            <LogOut className='h-4 w-4' />
            <span className='font-medium'>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
