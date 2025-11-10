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
    <Link href={`/media/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] bg-muted">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span className="text-center p-4 text-sm">{title}</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-2 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{creator}</p>
            {status === 'COMPLETED' && completedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Finished {new Date(completedAt).getFullYear()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
