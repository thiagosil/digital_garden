'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StarRating } from './star-rating';

interface MediaCardProps {
  id: string;
  title: string;
  creator: string;
  coverImage: string | null;
  status: string;
  mediaType: string;
  rating: number | null;
  completedAt: string | null;
  onStatusChange?: () => void;
}

export function MediaCard({ id, title, creator, coverImage, status, mediaType, rating, completedAt, onStatusChange }: MediaCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentRating, setCurrentRating] = useState(rating);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCurrentStatus(newStatus);
        onStatusChange?.();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating || null }),
      });

      if (response.ok) {
        setCurrentRating(newRating);
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const getActionButton = () => {
    const buttonConfig: Record<string, Record<string, { label: string; nextStatus: string }>> = {
      BOOK: {
        BACKLOG: { label: 'Start Reading', nextStatus: 'IN_PROGRESS' },
        IN_PROGRESS: { label: 'Mark as Read', nextStatus: 'COMPLETED' },
      },
      MOVIE: {
        BACKLOG: { label: 'Start Watching', nextStatus: 'IN_PROGRESS' },
        IN_PROGRESS: { label: 'Mark as Watched', nextStatus: 'COMPLETED' },
      },
      TV_SHOW: {
        BACKLOG: { label: 'Start Watching', nextStatus: 'IN_PROGRESS' },
        IN_PROGRESS: { label: 'Mark as Watched', nextStatus: 'COMPLETED' },
      },
      VIDEO_GAME: {
        BACKLOG: { label: 'Start Playing', nextStatus: 'IN_PROGRESS' },
        IN_PROGRESS: { label: 'Mark as Played', nextStatus: 'COMPLETED' },
      },
    };

    return buttonConfig[mediaType]?.[currentStatus];
  };

  return (
    <div className="group relative">
      <Link href={`/media/${id}`} className="block">
        <div className="space-y-2 sm:space-y-3">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] bg-muted overflow-hidden rounded-md shadow-sm transition-all duration-300 group-hover:shadow-lg active:scale-[0.98]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
              <span className="text-center p-3 sm:p-4 text-xs sm:text-sm font-light">{title}</span>
            </div>
          )}

          {/* Finished Badge */}
          {currentStatus === 'COMPLETED' && completedAt && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm py-1.5 sm:py-2 px-2 sm:px-3">
              <p className="text-[10px] sm:text-xs font-medium text-foreground text-center">
                Finished {new Date(completedAt).getFullYear()}
              </p>
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-muted-foreground transition-colors">
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-light line-clamp-1">
            {creator}
          </p>
        </div>
        </div>
      </Link>

      {/* Action Button or Rating */}
      <div
        className="mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {currentStatus === 'COMPLETED' ? (
          <div className="flex items-center justify-center py-1">
            <StarRating
              rating={currentRating}
              onRatingChange={handleRatingChange}
              size="sm"
            />
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={() => {
              const action = getActionButton();
              if (action) handleStatusChange(action.nextStatus);
            }}
            disabled={updating}
          >
            {updating ? 'Updating...' : getActionButton()?.label}
          </Button>
        )}
      </div>
    </div>
  );
}
