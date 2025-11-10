'use client';

import { MediaCard } from './media-card';

interface MediaItem {
  id: string;
  title: string;
  creator: string | null;
  coverImage: string | null;
  status: string;
  completedAt: Date | null;
}

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          id={item.id}
          title={item.title}
          creator={item.creator || 'Unknown'}
          coverImage={item.coverImage}
          status={item.status}
          completedAt={item.completedAt}
        />
      ))}
    </div>
  );
}
