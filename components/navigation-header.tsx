'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Drop } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface NavigationHeaderProps {
  onAddMedia?: () => void;
}

export function NavigationHeader({ onAddMedia }: NavigationHeaderProps) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type') || 'BOOK';

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

          {/* Add Media Button */}
          <Button
            onClick={onAddMedia}
            variant="ghost"
            size="sm"
            className="shrink-0 text-sm font-medium hover:text-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Media
          </Button>
        </div>
      </div>
    </header>
  );
}
