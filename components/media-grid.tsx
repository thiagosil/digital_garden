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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items found. Start by adding some media to your garden!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
