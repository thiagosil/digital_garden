'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MediaGrid } from '@/components/media-grid';
import { BookshelfTabs } from '@/components/bookshelf-tabs';
import { AddMediaDialog } from '@/components/add-media-dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@phosphor-icons/react';
import { MediaItem } from '@/lib/db';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.get('status') || 'BACKLOG');
  const [typeFilter, setTypeFilter] = useState<string | null>(searchParams.get('type') || 'BOOK');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const mediaTypes = ['BOOK', 'MOVIE', 'TV_SHOW', 'VIDEO_GAME'];

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

  // Pull-to-refresh and swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;

    if (window.scrollY === 0 && !loading) {
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || loading) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    if (distance > 0) {
      // Add resistance to the pull
      const adjustedDistance = Math.min(distance * 0.5, 100);
      setPullDistance(adjustedDistance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
      const currentIndex = mediaTypes.indexOf(typeFilter || 'BOOK');

      if (deltaX < 0 && currentIndex < mediaTypes.length - 1) {
        // Swipe left - next type
        router.push(`/?type=${mediaTypes[currentIndex + 1]}&status=${statusFilter}`);
      } else if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - previous type
        router.push(`/?type=${mediaTypes[currentIndex - 1]}&status=${statusFilter}`);
      }
    }

    // Handle pull-to-refresh
    if (isPulling) {
      if (pullDistance > 60) {
        fetchItems();
      }

      setIsPulling(false);
      setPullDistance(0);
    }

    touchStartY.current = 0;
    touchStartX.current = 0;
  };

  const handleItemAdded = () => {
    setIsAddDialogOpen(false);
    // Trigger a page refresh to show the new item
    window.location.reload();
  };

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
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200 md:hidden"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="text-muted-foreground text-sm font-medium">
            {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-12 lg:py-20 mobile-content transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="mb-4 sm:mb-12 lg:mb-16">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">{pageContent.title}</h1>
              {/* Desktop plus button - inline with header */}
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                variant="ghost"
                size="sm"
                className="hidden md:flex md:shrink-0 md:text-foreground md:hover:text-foreground/80 [&_svg]:!size-auto md:h-11 md:w-11 p-0 md:rounded-md md:bg-transparent md:text-foreground md:shadow-none md:hover:shadow-none md:hover:scale-100"
              >
                <PlusIcon size={28} weight="bold" className="md:[&]:w-6 md:[&]:h-6" />
              </Button>
            </div>
            <p className="hidden sm:block text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl font-light">
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
        <MediaGrid
          items={items}
          onRefresh={fetchItems}
          mediaType={typeFilter || 'BOOK'}
          onAddClick={() => setIsAddDialogOpen(true)}
          loading={loading}
        />
      </div>

      {/* Mobile floating action button - fixed position */}
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        variant="ghost"
        size="sm"
        className="fab md:hidden [&_svg]:!size-auto h-14 w-14 p-0 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
      >
        <PlusIcon size={28} weight="bold" />
      </Button>

      <AddMediaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onItemAdded={handleItemAdded}
        defaultMediaType={typeFilter || 'BOOK'}
      />
    </main>
  );
}
