'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StarRating } from './star-rating';
import { haptics } from '@/lib/haptics';

interface MediaCardProps {
  id: string;
  title: string;
  creator: string;
  coverImage: string | null;
  status: string;
  mediaType: string;
  rating: number | null;
  completedAt: string | null;
  currentSeason?: number | null;
  currentEpisode?: number | null;
  totalSeasons?: number | null;
  episodesInSeason?: number | null;
  onStatusChange?: () => void;
}

export function MediaCard({ id, title, creator, coverImage, status, mediaType, rating, completedAt, currentSeason, currentEpisode, totalSeasons, episodesInSeason, onStatusChange }: MediaCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentRating, setCurrentRating] = useState(rating);
  const [updating, setUpdating] = useState(false);
  const [season, setSeason] = useState(currentSeason || 1);
  const [episode, setEpisode] = useState(currentEpisode || 1);

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

  const handleNextEpisode = async () => {
    haptics.light();
    setUpdating(true);
    try {
      const newEpisode = episode + 1;
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEpisode: newEpisode,
          currentSeason: season,
        }),
      });

      if (response.ok) {
        setEpisode(newEpisode);
        onStatusChange?.();
      }
    } catch (error) {
      console.error('Failed to update episode:', error);
    } finally {
      setUpdating(false);
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
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              priority={false}
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
              <span className="text-center p-3 sm:p-4 text-xs sm:text-sm font-light">{title}</span>
            </div>
          )}

          {/* Finished Badge */}
          {currentStatus === 'COMPLETED' && completedAt && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm py-1.5 sm:py-2 px-2 sm:px-3">
              <p className="text-xs sm:text-sm font-medium text-foreground text-center">
                Finished {new Date(completedAt).getFullYear()}
              </p>
            </div>
          )}

          {/* TV Show Progress Badge */}
          {mediaType === 'TV_SHOW' && currentStatus === 'IN_PROGRESS' && season && episode && (
            <div className="absolute bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-sm py-1.5 sm:py-2 px-2 sm:px-3">
              <p className="text-xs sm:text-sm font-medium text-primary-foreground text-center">
                S{season}E{episode}
                {episodesInSeason && ` of ${episodesInSeason}`}
              </p>
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-muted-foreground transition-colors">
            {title}
          </h3>
          {mediaType === 'TV_SHOW' && currentStatus === 'IN_PROGRESS' && season && episode ? (
            <p className="text-xs sm:text-sm text-primary font-medium line-clamp-1">
              S{season}E{episode}
              {episodesInSeason && ` of ${episodesInSeason}`}
              {totalSeasons && ` • Season ${season}/${totalSeasons}`}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground font-light line-clamp-1">
              {creator}
            </p>
          )}
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
        ) : mediaType === 'TV_SHOW' && currentStatus === 'IN_PROGRESS' ? (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 sm:h-10 text-sm"
              onClick={handleNextEpisode}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Next Episode'}
            </Button>
            <Link href={`/media/${id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 sm:h-10 text-sm px-3"
              >
                Edit
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 sm:h-10 text-sm"
            onClick={() => {
              haptics.light();
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
