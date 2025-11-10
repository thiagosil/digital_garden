'use client';

import { useEffect, useState } from 'react';
import { MediaGrid } from '@/components/media-grid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddMediaDialog } from '@/components/add-media-dialog';
import { FilterBar } from '@/components/filter-bar';

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
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

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
    fetchItems();
  }, [statusFilter, typeFilter]);

  const handleItemAdded = () => {
    fetchItems();
    setIsAddDialogOpen(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Media Garden</h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl font-light">
              Your personal collection of books, movies, shows, and games
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
            className="shrink-0 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Media
          </Button>
        </div>

        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
        />

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg font-light">Loading...</p>
          </div>
        ) : (
          <MediaGrid items={items} />
        )}

        {/* Add Media Dialog */}
        <AddMediaDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onItemAdded={handleItemAdded}
        />
      </div>
    </main>
  );
}
