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
      setItems(data.items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Media Garden</h1>
            <p className="text-muted-foreground mt-2">
              Your personal collection of books, movies, shows, and games
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
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
