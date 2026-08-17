'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { YOUTUBE_THUMB_QUALITIES, youtubeThumbnailUrl } from '@/lib/youtube';
import { cn } from '@/lib/utils';

type VideoThumbnailProps = {
  videoId: string;
  title: string;
  className?: string;
  showPlay?: boolean;
  onClick?: () => void;
};

export function VideoThumbnail({ videoId, title, className, showPlay = false, onClick }: VideoThumbnailProps) {
  const [qualityIndex, setQualityIndex] = useState(0);
  const quality = YOUTUBE_THUMB_QUALITIES[qualityIndex] ?? 'default';

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden bg-slate-900',
        onClick && 'cursor-pointer group',
        className
      )}
    >
      <img
        src={youtubeThumbnailUrl(videoId, quality)}
        alt={title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition group-hover:scale-105"
        onError={() => {
          if (qualityIndex < YOUTUBE_THUMB_QUALITIES.length - 1) {
            setQualityIndex((i) => i + 1);
          }
        }}
      />
      {showPlay && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/40">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>
      )}
    </Wrapper>
  );
}
