import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface MediaCardProps {
  id: string;
  title: string;
  creator: string;
  coverImage: string | null;
  status: string;
  completedAt: Date | null;
}

export function MediaCard({ id, title, creator, coverImage, status, completedAt }: MediaCardProps) {
  return (
    <Link href={`/media/${id}`} className="group block">
      <div className="space-y-3">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] bg-muted overflow-hidden rounded-md shadow-sm transition-all duration-300 group-hover:shadow-lg">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
              <span className="text-center p-4 text-sm font-light">{title}</span>
            </div>
          )}

          {/* Finished Badge */}
          {status === 'COMPLETED' && completedAt && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm py-2 px-3">
              <p className="text-xs font-medium text-foreground text-center">
                Finished {new Date(completedAt).getFullYear()}
              </p>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-muted-foreground transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-light line-clamp-1">
            {creator}
          </p>
        </div>
      </div>
    </Link>
  );
}
