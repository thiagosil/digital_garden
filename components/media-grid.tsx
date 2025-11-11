'use client';

import { MediaCard } from './media-card';
import { MediaItem } from '@/lib/db';
import { Button } from '@/components/ui/button';
import {
  BookOpenText,
  FilmSlate,
  Television,
  GameController,
} from '@phosphor-icons/react';

interface MediaGridProps {
  items: MediaItem[];
  onRefresh?: () => void;
  mediaType?: string;
  onAddClick?: () => void;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="aspect-[2/3] bg-muted rounded-md" />
      <div className="space-y-1.5">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
      <div className="h-9 bg-muted rounded w-full" />
    </div>
  );
}

export function MediaGrid({ items, onRefresh, mediaType = 'BOOK', onAddClick, loading = false }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-12">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const getEmptyStateIcon = () => {
    switch (mediaType) {
      case 'BOOK':
        return BookOpenText;
      case 'MOVIE':
        return FilmSlate;
      case 'TV_SHOW':
        return Television;
      case 'VIDEO_GAME':
        return GameController;
      default:
        return BookOpenText;
    }
  };

  const getEmptyStateText = () => {
    switch (mediaType) {
      case 'BOOK':
        return {
          title: 'No books yet',
          description: 'Start building your library by adding books you want to read',
          buttonText: 'Add Your First Book',
        };
      case 'MOVIE':
        return {
          title: 'No movies yet',
          description: 'Start building your library by adding movies you want to watch',
          buttonText: 'Add Your First Movie',
        };
      case 'TV_SHOW':
        return {
          title: 'No TV shows yet',
          description: 'Start building your library by adding TV shows you want to watch',
          buttonText: 'Add Your First Show',
        };
      case 'VIDEO_GAME':
        return {
          title: 'No games yet',
          description: 'Start building your library by adding games you want to play',
          buttonText: 'Add Your First Game',
        };
      default:
        return {
          title: 'No items yet',
          description: 'Start building your library by adding some media',
          buttonText: 'Add Your First Item',
        };
    }
  };

  if (items.length === 0) {
    const Icon = getEmptyStateIcon();
    const emptyState = getEmptyStateText();

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-4 rounded-full bg-muted flex items-center justify-center">
          <Icon size={48} weight="thin" className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{emptyState.title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
          {emptyState.description}
        </p>
        {onAddClick && (
          <Button onClick={onAddClick}>
            {emptyState.buttonText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-12">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          id={item.id}
          title={item.title}
          creator={item.creator || 'Unknown'}
          coverImage={item.coverImage}
          status={item.status}
          mediaType={item.mediaType}
          rating={item.rating}
          completedAt={item.completedAt}
          currentSeason={item.currentSeason}
          currentEpisode={item.currentEpisode}
          totalSeasons={item.totalSeasons}
          episodesInSeason={item.episodesInSeason}
          onStatusChange={onRefresh}
        />
      ))}
    </div>
  );
}
