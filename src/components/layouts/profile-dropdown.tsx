'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/users/user-avatar';
import { LogOut, User, Sun, Moon, UserPen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { AuthUser } from '@/types';

interface ProfileDropdownProps {
  user: AuthUser;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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
    setIsOpen(false);
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant='ghost2'
        onClick={() => setIsOpen(!isOpen)}
        className='gap-3 hover:scale-105 focus:outline-none p-0 h-auto'
      >
        <UserAvatar user={user} size='md' />
        <span className='text-foreground text-sm font-medium hidden sm:block'>
          {user.name || user.username}
        </span>
      </Button>

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
            <Button
              variant='ghost'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='w-full justify-start gap-3 px-4 py-3 text-sm text-foreground rounded-none h-auto'
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
            </Button>
          )}

          {/* Divider */}
          <div className='border-t border-border my-2' />

          {/* Logout Button */}
          <Button
            variant='ghost'
            onClick={handleLogout}
            className='w-full justify-start gap-3 px-4 py-3 text-sm text-red hover:text-red rounded-none h-auto'
          >
            <LogOut className='h-4 w-4' />
            <span className='font-medium'>Logout</span>
          </Button>
        </div>
      )}

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
