'use client';

import { useState, useEffect } from 'react';
import { Check, Circle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

interface Episode {
  episodeNumber: number;
  name: string;
  overview: string | null;
  airDate: string | null;
  stillPath: string | null;
  runtime: number | null;
}

interface Season {
  seasonNumber: number;
  episodeCount: number;
  name: string;
}

interface EpisodeListProps {
  tmdbId: string;
  seasons: Season[];
  currentSeason: number;
  currentEpisode: number;
  onEpisodeClick: (season: number, episode: number) => void;
}

export function EpisodeList({
  tmdbId,
  seasons,
  currentSeason,
  currentEpisode,
  onEpisodeClick
}: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEpisodes(selectedSeason);
  }, [selectedSeason, tmdbId]);

  const fetchEpisodes = async (seasonNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/tv-season-episodes?tmdbId=${tmdbId}&seasonNumber=${seasonNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data.episodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const isWatched = (season: number, episode: number) => {
    if (season < currentSeason) return true;
    if (season === currentSeason && episode < currentEpisode) return true;
    return false;
  };

  const isCurrent = (season: number, episode: number) => {
    return season === currentSeason && episode === currentEpisode;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm sm:text-base font-semibold">Episodes</Label>
        <div className="w-48">
          <Select
            value={selectedSeason.toString()}
            onValueChange={(value) => setSelectedSeason(parseInt(value))}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.seasonNumber} value={season.seasonNumber.toString()}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading episodes...
        </div>
      ) : (
        <div className="space-y-2">
          {episodes.map((episode) => {
            const watched = isWatched(selectedSeason, episode.episodeNumber);
            const current = isCurrent(selectedSeason, episode.episodeNumber);

            return (
              <button
                key={episode.episodeNumber}
                onClick={() => onEpisodeClick(selectedSeason, episode.episodeNumber)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all hover:bg-accent/50 ${
                  current ? 'bg-primary/10 border-primary' : 'bg-background'
                }`}
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    {watched ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : current ? (
                      <PlayCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Episode Image */}
                  {episode.stillPath && (
                    <div className="relative w-20 sm:w-28 h-12 sm:h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={episode.stillPath}
                        alt={episode.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 112px"
                      />
                    </div>
                  )}

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-1">
                          {episode.episodeNumber}. {episode.name}
                        </h4>
                        {episode.overview && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                            {episode.overview}
                          </p>
                        )}
                      </div>
                      {current && (
                        <span className="text-xs font-medium text-primary flex-shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      {episode.airDate && (
                        <span>{new Date(episode.airDate).toLocaleDateString()}</span>
                      )}
                      {episode.runtime && (
                        <span>{episode.runtime} min</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
