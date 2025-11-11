'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';
import { Drop } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface NavigationHeaderProps {
  onAddMedia?: () => void;
}

export function NavigationHeader({ onAddMedia }: NavigationHeaderProps) {
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
    <header className="border-b border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
              <Drop size={28} weight="fill" className="text-background" />
            </div>
            <span className="text-xl font-semibold tracking-tight lowercase">echo</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/?type=BOOK"
              className={`text-sm font-medium transition-colors ${
                activeType === 'BOOK' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              BOOKS
            </Link>
            <Link
              href="/?type=MOVIE"
              className={`text-sm font-medium transition-colors ${
                activeType === 'MOVIE' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              MOVIES
            </Link>
            <Link
              href="/?type=TV_SHOW"
              className={`text-sm font-medium transition-colors ${
                activeType === 'TV_SHOW' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              TV SHOWS
            </Link>
            <Link
              href="/?type=VIDEO_GAME"
              className={`text-sm font-medium transition-colors ${
                activeType === 'VIDEO_GAME' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              GAMES
            </Link>
          </nav>

          {/* Add Media Button & Logout */}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button
                onClick={onAddMedia}
                variant="ghost"
                size="sm"
                className="shrink-0 text-sm font-medium hover:text-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Media
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="shrink-0 text-sm font-medium hover:text-foreground"
                disabled={isLoggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
