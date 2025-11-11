'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MediaGrid } from '@/components/media-grid';
import { BookshelfTabs } from '@/components/bookshelf-tabs';

interface MediaItem {
  id: string;
  title: string;
  creator: string | null;
  coverImage: string | null;
  status: string;
  completedAt: Date | null;
  mediaType: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>('COMPLETED');
  const [typeFilter, setTypeFilter] = useState<string | null>(searchParams.get('type') || 'BOOK');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('mediaType', typeFilter);

      const response = await fetch(`/api/media?${params.toString()}`);
      const data = await response.json();

      // Check if the response is successful and has items
      if (response.ok && data.items) {
        setItems(data.items);
      } else {
        console.error('Failed to fetch items:', data.error || 'Unknown error');
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const typeFromUrl = searchParams.get('type') || 'BOOK';
    setTypeFilter(typeFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [statusFilter, typeFilter]);

  // Dynamic content based on media type
  const getPageContent = () => {
    switch (typeFilter) {
      case 'BOOK':
        return {
          title: 'Bookshelf',
          description: 'Books I\'ve read, with reviews and notes. Each cover links to a longer take.'
        };
      case 'MOVIE':
        return {
          title: 'Movies',
          description: 'Movies I\'ve watched, with reviews and thoughts. Each poster links to a longer take.'
        };
      case 'TV_SHOW':
        return {
          title: 'TV Shows',
          description: 'TV shows I\'ve watched, with reviews and thoughts. Each poster links to a longer take.'
        };
      case 'VIDEO_GAME':
        return {
          title: 'Games',
          description: 'Video games I\'ve played, with reviews and thoughts. Each cover links to a longer take.'
        };
      default:
        return {
          title: 'Bookshelf',
          description: 'Books I\'ve read, with reviews and notes. Each cover links to a longer take.'
        };
    }
  };

  const pageContent = getPageContent();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              LIBRARY
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">{pageContent.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl font-light">
              {pageContent.description}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <BookshelfTabs
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          mediaType={typeFilter || 'BOOK'}
        />

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16 sm:py-20">
            <p className="text-muted-foreground text-base sm:text-lg font-light">Loading...</p>
          </div>
        ) : (
          <MediaGrid items={items} />
        )}
      </div>
    </main>
  );
}
