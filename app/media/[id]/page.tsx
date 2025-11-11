'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { StarRating } from '@/components/star-rating';

interface MediaItem {
  id: string;
  title: string;
  mediaType: string;
  status: string;
  coverImage: string | null;
  creator: string | null;
  synopsis: string | null;
  notes: string | null;
  rating: number | null;
  completedAt: Date | null;
}

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [completedAt, setCompletedAt] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/media/${id}`);
      const data = await response.json();
      setItem(data.item);
      setStatus(data.item.status);
      setNotes(data.item.notes || '');
      setRating(data.item.rating || null);

      // Format completedAt for input[type="date"]
      if (data.item.completedAt) {
        const date = new Date(data.item.completedAt);
        setCompletedAt(date.toISOString().split('T')[0]);
      } else {
        setCompletedAt('');
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: any = { status, notes, rating };

      // Include completedAt only if it's set and status is COMPLETED
      if (status === 'COMPLETED' && completedAt) {
        body.completedAt = new Date(completedAt).toISOString();
      } else if (status !== 'COMPLETED') {
        body.completedAt = null;
      }

      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setItem(data.item);

        // Update local state with returned data
        if (data.item.completedAt) {
          const date = new Date(data.item.completedAt);
          setCompletedAt(date.toISOString().split('T')[0]);
        } else {
          setCompletedAt('');
        }
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg font-light">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-muted-foreground text-lg font-light">Item not found</p>
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-6 sm:mb-8 lg:mb-12">
          <Button variant="ghost" size="sm" className="font-medium h-10 sm:h-11">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Library</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>

        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 sm:gap-8 lg:gap-12">
          {/* Cover Image */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative aspect-[2/3] max-w-[240px] sm:max-w-none mx-auto sm:mx-0 bg-muted rounded-md overflow-hidden shadow-lg">
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span className="text-center p-4 font-light text-sm">No cover image</span>
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="h-11 sm:h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm font-semibold">Rating</Label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="md"
              />
            </div>

            {/* Completion Date */}
            {status === 'COMPLETED' && (
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="completedAt" className="text-sm font-semibold">Completion Date</Label>
                <Input
                  id="completedAt"
                  type="date"
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                  className="w-full h-11 sm:h-12"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                {item.title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light">
                {item.creator}
              </p>
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-muted rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                {item.mediaType.replace('_', ' ')}
              </div>
            </div>

            {/* Synopsis */}
            {item.synopsis && (
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold">Synopsis</h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
                  {item.synopsis}
                </p>
              </div>
            )}

            {/* Personal Notes */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="notes" className="text-sm sm:text-base font-semibold">Your Notes</Label>
              <Textarea
                id="notes"
                placeholder="Write your thoughts, review, or personal notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 min-h-[200px] sm:min-h-[240px] text-sm sm:text-base leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 font-medium h-11 sm:h-12"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                size="lg"
                className="sm:w-auto font-medium h-11 sm:h-12"
              >
                <Trash2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
