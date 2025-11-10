'use client';

import { useEffect, useState } from 'react';
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

interface MediaItem {
  id: string;
  title: string;
  mediaType: string;
  status: string;
  coverImage: string | null;
  creator: string | null;
  synopsis: string | null;
  notes: string | null;
  completedAt: Date | null;
}

export default function MediaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [completedAt, setCompletedAt] = useState('');

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/media/${params.id}`);
      const data = await response.json();
      setItem(data.item);
      setStatus(data.item.status);
      setNotes(data.item.notes || '');

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
      const body: any = { status, notes };

      // Include completedAt only if it's set and status is COMPLETED
      if (status === 'COMPLETED' && completedAt) {
        body.completedAt = new Date(completedAt).toISOString();
      } else if (status !== 'COMPLETED') {
        body.completedAt = null;
      }

      const response = await fetch(`/api/media/${params.id}`, {
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
      const response = await fetch(`/api/media/${params.id}`, {
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Item not found</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Garden
          </Button>
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Cover Image */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
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
                  <span className="text-center p-4">No cover image</span>
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Completion Date */}
            {status === 'COMPLETED' && (
              <div className="space-y-2">
                <Label htmlFor="completedAt">Completion Date</Label>
                <Input
                  id="completedAt"
                  type="date"
                  value={completedAt}
                  onChange={(e) => setCompletedAt(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <p className="text-lg text-muted-foreground">{item.creator}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-muted rounded-full text-sm">
                {item.mediaType.replace('_', ' ')}
              </div>
            </div>

            {/* Synopsis */}
            {item.synopsis && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.synopsis}
                </p>
              </div>
            )}

            {/* Personal Notes */}
            <div>
              <Label htmlFor="notes">Your Notes</Label>
              <Textarea
                id="notes"
                placeholder="Write your thoughts, review, or personal notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
