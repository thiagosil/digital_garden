'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DropIcon, SignOutIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface NavigationHeaderProps {}

export function NavigationHeader({}: NavigationHeaderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeType = searchParams.get('type') || 'BOOK';
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsAuthenticated(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        setIsLoggingOut(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsLoggingOut(false);
      }
    };
    checkAuth();
  }, [pathname]);

  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-lg flex items-center justify-center">
                  <DropIcon size={24} weight="fill" className="text-background sm:[&]:w-7 sm:[&]:h-7" />
                </div>
                <span className="text-lg sm:text-xl font-semibold tracking-tight lowercase">echo</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/?type=BOOK&status=BACKLOG"
                className={`text-sm font-medium transition-colors ${
                  activeType === 'BOOK' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                BOOKS
              </Link>
              <Link
                href="/?type=MOVIE&status=BACKLOG"
                className={`text-sm font-medium transition-colors ${
                  activeType === 'MOVIE' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                MOVIES
              </Link>
              <Link
                href="/?type=TV_SHOW&status=BACKLOG"
                className={`text-sm font-medium transition-colors ${
                  activeType === 'TV_SHOW' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                TV SHOWS
              </Link>
              <Link
                href="/?type=VIDEO_GAME&status=BACKLOG"
                className={`text-sm font-medium transition-colors ${
                  activeType === 'VIDEO_GAME' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GAMES
              </Link>
            </nav>

            {/* Logout */}
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-foreground hover:text-foreground/80 [&_svg]:!size-auto h-11 w-11 p-0"
                  disabled={isLoggingOut}
                >
                  <SignOutIcon size={24} weight="bold" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
