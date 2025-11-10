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
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] bg-muted overflow-hidden">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                <span className="text-center p-4 text-sm font-light">{title}</span>
              </div>
            )}
          </div>
          <div className="p-4 space-y-1.5">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground font-light line-clamp-1">
              {creator}
            </p>
            {status === 'COMPLETED' && completedAt && (
              <p className="text-xs text-muted-foreground/70 font-light pt-1">
                {new Date(completedAt).getFullYear()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
