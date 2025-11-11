'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpenText,
  FilmSlate,
  Television,
  GameController
} from '@phosphor-icons/react';

export function BottomNavigation() {
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type') || 'BOOK';

  const tabs = [
    { type: 'BOOK', label: 'Books', icon: BookOpenText },
    { type: 'MOVIE', label: 'Movies', icon: FilmSlate },
    { type: 'TV_SHOW', label: 'TV', icon: Television },
    { type: 'VIDEO_GAME', label: 'Games', icon: GameController },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border bottom-nav-safe md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ type, label, icon: Icon }) => (
          <Link
            key={type}
            href={`/?type=${type}&status=BACKLOG`}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors active:bg-muted/50 ${
              activeType === type ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Icon size={24} weight={activeType === type ? 'fill' : 'regular'} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
