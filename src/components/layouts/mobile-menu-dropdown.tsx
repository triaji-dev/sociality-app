'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobileMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDropdown({
  isOpen,
  onClose,
}: MobileMenuDropdownProps) {
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-mobile-menu]')) {
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

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed top-16 left-0 w-full h-16 bg-background border-b border-border z-40 md:hidden'
      data-mobile-menu
    >
      <div className='flex flex-row items-center justify-center px-4 pt-2 gap-3'>
        {/* Login Button */}
        <Button
          asChild
          variant='outline'
          className='flex-1 h-10 border-border bg-transparent text-foreground font-bold text-sm leading-7 tracking-[-0.01em] hover:bg-accent transition-colors rounded-full'
        >
          <Link
            href='/login'
            className='flex items-center justify-center h-full'
          >
            Login
          </Link>
        </Button>

        {/* Register Button */}
        <Button
          asChild
          className='flex-1 h-10 bg-primary-300 text-white font-bold text-sm leading-7 tracking-[-0.01em] hover:opacity-90 transition-opacity rounded-full'
        >
          <Link
            href='/register'
            className='flex items-center justify-center h-full'
          >
            Register
          </Link>
        </Button>
      </div>
    </div>
  );
}
