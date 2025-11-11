'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { StarRating } from './star-rating';

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
  defaultMediaType?: string;
}

export function AddMediaDialog({ open, onOpenChange, onItemAdded, defaultMediaType }: AddMediaDialogProps) {
  const [mediaType, setMediaType] = useState<string>('');
  const [status, setStatus] = useState<string>('BACKLOG');
  const [rating, setRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-populate media type when dialog opens
  useEffect(() => {
    if (open && defaultMediaType) {
      setMediaType(defaultMediaType);
    }
  }, [open, defaultMediaType]);

  const handleSearch = useCallback(async () => {
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
  }, [mediaType, searchQuery]);

  const handleAddItem = async (result: SearchResult) => {
    setAdding(true);
    try {
      const body: any = {
        title: result.title,
        mediaType,
        status,
        coverImage: result.coverImage,
        creator: result.creator,
        synopsis: result.synopsis,
        apiId: result.apiId,
      };

      // Only include rating if status is COMPLETED and rating is set
      if (status === 'COMPLETED' && rating) {
        body.rating = rating;
      }

      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onItemAdded();
        // Reset state
        setMediaType('');
        setStatus('BACKLOG');
        setRating(null);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setAdding(false);
    }
  };

  // Debounce search: automatically search after user stops typing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if query is empty or media type not selected
    if (!searchQuery.trim() || !mediaType) {
      setSearchResults([]);
      return;
    }

    // Set new timer to trigger search after 500ms
    debounceTimerRef.current = setTimeout(() => {
      handleSearch();
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, mediaType, handleSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader className="space-y-1.5 sm:space-y-3 pr-6">
          <DialogTitle className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {defaultMediaType ? `Add New ${
              defaultMediaType === 'BOOK' ? 'Book' :
              defaultMediaType === 'MOVIE' ? 'Movie' :
              defaultMediaType === 'TV_SHOW' ? 'TV Show' :
              defaultMediaType === 'VIDEO_GAME' ? 'Video Game' :
              'Media'
            }` : 'Add New Media'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-base font-light text-muted-foreground leading-relaxed">
            {defaultMediaType ?
              `Search and add ${
                defaultMediaType === 'BOOK' ? 'a book' :
                defaultMediaType === 'MOVIE' ? 'a movie' :
                defaultMediaType === 'TV_SHOW' ? 'a TV show' :
                defaultMediaType === 'VIDEO_GAME' ? 'a video game' :
                'media'
              } to your collection.` :
              'Search for a book, movie, TV show, or video game to add to your collection.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-6 pt-1">
          {/* Media Type Selection - Only show if no default type */}
          {!defaultMediaType && (
            <div className="space-y-1.5 sm:space-y-3">
              <Label htmlFor="media-type" className="text-xs sm:text-sm font-semibold">Media Type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger id="media-type" className="h-10 sm:h-12">
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
          )}

          {/* Status Selection */}
          <div className="space-y-1.5 sm:space-y-3">
            <Label className="text-xs sm:text-sm font-semibold">Add as</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={status === 'BACKLOG' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatus('BACKLOG');
                  setRating(null);
                }}
                className="h-10 sm:h-12 text-xs sm:text-sm"
              >
                {(mediaType || defaultMediaType) === 'BOOK' ? 'Want to Read' :
                 (mediaType || defaultMediaType) === 'MOVIE' ? 'Want to Watch' :
                 (mediaType || defaultMediaType) === 'TV_SHOW' ? 'Want to Watch' :
                 (mediaType || defaultMediaType) === 'VIDEO_GAME' ? 'Want to Play' :
                 'Want to'}
              </Button>
              <Button
                type="button"
                variant={status === 'IN_PROGRESS' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatus('IN_PROGRESS');
                  setRating(null);
                }}
                className="h-10 sm:h-12 text-xs sm:text-sm"
              >
                {(mediaType || defaultMediaType) === 'BOOK' ? 'Reading' :
                 (mediaType || defaultMediaType) === 'MOVIE' ? 'Watching' :
                 (mediaType || defaultMediaType) === 'TV_SHOW' ? 'Watching' :
                 (mediaType || defaultMediaType) === 'VIDEO_GAME' ? 'Playing' :
                 'In Progress'}
              </Button>
              <Button
                type="button"
                variant={status === 'COMPLETED' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('COMPLETED')}
                className="h-10 sm:h-12 text-xs sm:text-sm"
              >
                {(mediaType || defaultMediaType) === 'BOOK' ? 'Read' :
                 (mediaType || defaultMediaType) === 'MOVIE' ? 'Watched' :
                 (mediaType || defaultMediaType) === 'TV_SHOW' ? 'Watched' :
                 (mediaType || defaultMediaType) === 'VIDEO_GAME' ? 'Played' :
                 'Completed'}
              </Button>
            </div>

            {/* Rating - Only show when COMPLETED */}
            {status === 'COMPLETED' && (
              <div className="pt-2">
                <Label className="text-xs sm:text-sm font-semibold mb-2 block">Rating (optional)</Label>
                <div className="flex justify-center">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Enter title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={!mediaType}
              className="h-10 sm:h-12 text-sm sm:text-base"
            />
            <Button
              onClick={handleSearch}
              disabled={!mediaType || !searchQuery.trim() || searching}
              size="lg"
              className="h-10 sm:h-12 w-10 sm:w-12 p-0 flex-shrink-0"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Search Results */}
          {searching && (
            <div className="text-center py-12 text-muted-foreground font-light">
              Searching...
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <div className="space-y-2 sm:space-y-4">
              <Label className="text-xs sm:text-sm font-semibold">Results</Label>
              <div className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                {searchResults.map((result) => (
                  <div
                    key={result.apiId}
                    className="flex gap-2.5 sm:gap-4 p-2.5 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-12 h-16 sm:w-16 sm:h-24 bg-muted rounded flex-shrink-0 relative overflow-hidden shadow-sm">
                      {result.coverImage ? (
                        <Image
                          src={result.coverImage}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-light px-1">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold line-clamp-2 sm:line-clamp-1 tracking-tight text-xs sm:text-base">{result.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 font-light mt-0.5 sm:mt-1">
                        {result.creator}
                      </p>
                      {result.synopsis && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 sm:mt-2 font-light leading-relaxed hidden sm:block">
                          {result.synopsis}
                        </p>
                      )}
                    </div>
                    <Button
                      size="default"
                      onClick={() => handleAddItem(result)}
                      disabled={adding}
                      className="self-start font-medium h-8 sm:h-10 text-xs sm:text-sm px-2.5 sm:px-4 flex-shrink-0"
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
