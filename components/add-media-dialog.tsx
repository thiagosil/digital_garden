'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
  apiId: string;
  title: string;
  creator: string;
  coverImage: string | null;
  synopsis: string | null;
}

interface AddMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

export function AddMediaDialog({ open, onOpenChange, onItemAdded }: AddMediaDialogProps) {
  const [mediaType, setMediaType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleSearch = async () => {
    if (!mediaType || !searchQuery.trim()) {
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${mediaType}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddItem = async (result: SearchResult) => {
    setAdding(true);
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          mediaType,
          coverImage: result.coverImage,
          creator: result.creator,
          synopsis: result.synopsis,
          apiId: result.apiId,
        }),
      });

      if (response.ok) {
        onItemAdded();
        // Reset state
        setMediaType('');
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Media</DialogTitle>
          <DialogDescription className="text-base font-light text-muted-foreground">
            Search for a book, movie, TV show, or video game to add to your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Media Type Selection */}
          <div className="space-y-3">
            <Label htmlFor="media-type" className="text-sm font-semibold">Media Type</Label>
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger id="media-type" className="h-11">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOOK">Book</SelectItem>
                <SelectItem value="MOVIE">Movie</SelectItem>
                <SelectItem value="TV_SHOW">TV Show</SelectItem>
                <SelectItem value="VIDEO_GAME">Video Game</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <Label htmlFor="search" className="text-sm font-semibold">Search</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Enter title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={!mediaType}
                className="h-11"
              />
              <Button
                onClick={handleSearch}
                disabled={!mediaType || !searchQuery.trim() || searching}
                size="lg"
                className="px-5"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searching && (
            <div className="text-center py-12 text-muted-foreground font-light">
              Searching...
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Results</Label>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {searchResults.map((result) => (
                  <div
                    key={result.apiId}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-16 h-24 bg-muted rounded flex-shrink-0 relative overflow-hidden shadow-sm">
                      {result.coverImage ? (
                        <Image
                          src={result.coverImage}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-light">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold line-clamp-1 tracking-tight">{result.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1 font-light mt-0.5">
                        {result.creator}
                      </p>
                      {result.synopsis && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-light leading-relaxed">
                          {result.synopsis}
                        </p>
                      )}
                    </div>
                    <Button
                      size="default"
                      onClick={() => handleAddItem(result)}
                      disabled={adding}
                      className="self-start font-medium"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!searching && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-light">
              No results found. Try a different search term.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
