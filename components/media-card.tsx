'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface MediaCardProps {
  id: string;
  title: string;
  creator: string;
  coverImage: string | null;
  status: string;
  mediaType: string;
  completedAt: Date | null;
  onStatusChange?: () => void;
}

export function MediaCard({ id, title, creator, coverImage, status, mediaType, completedAt, onStatusChange }: MediaCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
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

  const getStatusLabel = (statusValue: string) => {
    const labels: Record<string, Record<string, string>> = {
      BOOK: {
        BACKLOG: 'Want to Read',
        IN_PROGRESS: 'Reading',
        COMPLETED: 'Read',
      },
      MOVIE: {
        BACKLOG: 'Want to Watch',
        IN_PROGRESS: 'Watching',
        COMPLETED: 'Watched',
      },
      TV_SHOW: {
        BACKLOG: 'Want to Watch',
        IN_PROGRESS: 'Watching',
        COMPLETED: 'Watched',
      },
      VIDEO_GAME: {
        BACKLOG: 'Want to Play',
        IN_PROGRESS: 'Playing',
        COMPLETED: 'Played',
      },
    };

    return labels[mediaType]?.[statusValue] || statusValue;
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

      {/* Quick Status Change */}
      <div
        className="mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Select
          value={currentStatus}
          onValueChange={handleStatusChange}
          disabled={updating}
        >
          <SelectTrigger className="h-8 text-xs w-full">
            <SelectValue>
              {updating ? 'Updating...' : getStatusLabel(currentStatus)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BACKLOG">{getStatusLabel('BACKLOG')}</SelectItem>
            <SelectItem value="IN_PROGRESS">{getStatusLabel('IN_PROGRESS')}</SelectItem>
            <SelectItem value="COMPLETED">{getStatusLabel('COMPLETED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
