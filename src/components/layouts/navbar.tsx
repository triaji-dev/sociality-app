'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ProfileDropdown } from './profile-dropdown';
import { MobileSearchModal } from '@/components/search/mobile-search-modal';
import { DesktopSearchDropdown } from '@/components/search/desktop-search-dropdown';
import { MobileMenuDropdown } from './mobile-menu-dropdown';
import { useAuthStore } from '@/stores/auth-store';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export function Navbar() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const pathname = usePathname();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(desktopSearchQuery, 300);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleClearDesktopSearch = () => {
    setDesktopSearchQuery('');
    setIsDesktopDropdownOpen(false);
  };

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch updated user data if authenticated to ensure freshness
  useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
        const response = await userService.getMe();
        if (response.data) {
             useAuthStore.getState().setUser(response.data.profile);
        }
        return response;
    },
    enabled: isAuthenticated && mounted,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isProfilePage = pathname.startsWith('/profile');

  return (
    <header className={cn(
      'fixed top-0 left-0 w-full h-16 md:h-20 bg-background/80 backdrop-blur-md border-b border-border flex flex-row justify-between items-center px-4 md:px-[120px] gap-4 md:gap-[124px] z-50',
      isProfilePage ? 'hidden md:flex' : 'flex'
    )}>
      {/* Logo Section */}
      <Link
        href='/timeline'
        onClick={(e) => {
          if (pathname === '/timeline') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className='flex items-center gap-3 hover:opacity-90 transition-all hover:scale-105 ease-in-out duration-200'
      >
        <Image
          src='/logos/main-logo.svg'
          alt='Sociality'
          width={30}
          height={30}
          className='w-[30px] h-[30px] dark:invert-0 invert'
        />
        <span className='text-foreground text-xl md:text-lg font-bold md:font-semibold'>
          Sociality
        </span>
      </Link>

      {/* Desktop Search Bar - Hidden on mobile */}
      <div className='hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='relative w-[491px] h-12'>
          <Search
            className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500'
            strokeWidth={1.25}
          />
          <Input
            type='text'
            placeholder='Search'
            value={desktopSearchQuery}
            onChange={(e) => {
              setDesktopSearchQuery(e.target.value);
              setIsDesktopDropdownOpen(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (desktopSearchQuery.length > 0) {
                setIsDesktopDropdownOpen(true);
              }
            }}
            className='w-full h-full pl-10 pr-10 bg-muted/50 border-border text-foreground placeholder-muted-foreground focus:border-purple-500 focus:ring-purple-500 rounded-full'
          />
          {desktopSearchQuery && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleClearDesktopSearch}
              className='absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full group'
            >
              <X className='h-4 w-4 p-[3px] text-background bg-muted-foreground rounded-full group-hover:text-foreground' strokeWidth={4} />
            </Button>
          )}
        </div>

        {/* Desktop Search Dropdown */}
        <DesktopSearchDropdown
          isOpen={isDesktopDropdownOpen}
          onClose={() => {
            setIsDesktopDropdownOpen(false);
            setDesktopSearchQuery('');
          }}
          searchQuery={debouncedSearchQuery}
        />
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-4 md:gap-3'>
        {/* Mobile Search Icon - Only visible on mobile */}
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden'
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search className='h-5 w-5 text-foreground' strokeWidth={1.25} />
        </Button>

        {/* Profile Section */}
        {!mounted || isAuthLoading ? (
          // Show loading state
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-muted rounded-full animate-pulse'></div>
          </div>
        ) : user && isAuthenticated ? (
          <ProfileDropdown user={user} />
        ) : (
          <>
            {/* Mobile Menu Icon - Only visible on mobile when logged out */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
            >
              <Menu className='h-6 w-6 text-foreground' strokeWidth={1.5} />
            </Button>

            {/* Desktop Auth Buttons - Hidden on mobile */}
            <div className='hidden md:flex items-center gap-3'>
              <Link
                href='/login'
                className='flex items-center justify-center w-[130px] h-11 border border-border rounded-full text-foreground font-bold text-base leading-[30px] tracking-[-0.02em] hover:bg-accent transition-colors'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='flex items-center justify-center w-[130px] h-11 bg-primary-300 rounded-full text-white font-bold text-base leading-[30px] tracking-[-0.02em] hover:opacity-90 transition-opacity'
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Mobile Menu Dropdown */}
      <MobileMenuDropdown
        isOpen={isMenuDropdownOpen}
        onClose={() => setIsMenuDropdownOpen(false)}
      />
    </header>
  );
}
