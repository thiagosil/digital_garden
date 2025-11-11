'use client';

import { MediaCard } from './media-card';
import { MediaItem } from '@/lib/db';

interface MediaGridProps {
  items: MediaItem[];
  onRefresh?: () => void;
}

export function MediaGrid({ items, onRefresh }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg font-light">
          No items found. Start by adding some media to your library!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
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
          onStatusChange={onRefresh}
        />
      ))}
    </div>
  );
}
