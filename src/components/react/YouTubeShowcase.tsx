'use client';

import { useState } from 'react';
import { Play, ExternalLink, Users, Video } from 'lucide-react';
import { featuredVideos, featuredPlaylists, channelStats, YOUTUBE_CHANNEL } from '@/data/youtube';
import { youtubeEmbedUrl } from '@/lib/youtube';
import { VideoThumbnail } from '@/components/react/VideoThumbnail';
import { cn } from '@/lib/utils';

export function YouTubeShowcase() {
  const [activeId, setActiveId] = useState(featuredVideos[0].id);
  const [embedActive, setEmbedActive] = useState(false);
  const active = featuredVideos.find((v) => v.id === activeId) ?? featuredVideos[0];

  const selectVideo = (id: string) => {
    setActiveId(id);
    setEmbedActive(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
      <div className="lg:col-span-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-2xl dark:border-slate-700">
          <div className="aspect-video">
            {embedActive ? (
              <iframe
                title={active.title}
                src={youtubeEmbedUrl(active.id)}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <VideoThumbnail
                videoId={active.id}
                title={active.title}
                className="h-full w-full"
                showPlay
                onClick={() => setEmbedActive(true)}
              />
            )}
          </div>
          <div className="border-t border-slate-800 bg-slate-900 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">{active.category}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-white">{active.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{active.highlight}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {active.duration}</span>
              <span>{active.views} views</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {featuredVideos.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => selectVideo(v.id)}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-2 text-left transition',
                activeId === v.id
                  ? 'border-brand-500 bg-brand-50 dark:border-blue-500 dark:bg-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900'
              )}
            >
              <VideoThumbnail
                videoId={v.id}
                title={v.title}
                className="h-16 w-28 shrink-0 rounded-lg"
              />
              <div className="min-w-0 py-0.5">
                <p className="text-sm font-semibold leading-snug">{v.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{v.category} · {v.views} views</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-brand-600 dark:text-blue-400">Sample the quality</p>
          <h3 className="mt-1 font-display text-2xl font-bold">
            YouTube is your free preview
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Every paid lesson follows the same clarity: structured diagrams, interview frameworks,
            and production-level depth. Watch samples here — unlock the full library with Pro.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="flex items-center gap-1 text-xs text-slate-500"><Users className="h-3.5 w-3.5" /> Subscribers</dt>
              <dd className="font-display text-xl font-bold">{channelStats.subscribers}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <dt className="flex items-center gap-1 text-xs text-slate-500"><Video className="h-3.5 w-3.5" /> Videos</dt>
              <dd className="font-display text-xl font-bold">{channelStats.videos}</dd>
            </div>
          </dl>

          <p className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Featured playlists</p>
          <ul className="mt-3 space-y-2">
            {featuredPlaylists.map((p) => (
              <li key={p.id}>
                <a
                  href={`https://www.youtube.com/playlist?list=${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:border-brand-300 dark:border-slate-700"
                >
                  <span className="font-medium">{p.title}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    {p.lessons} videos <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-11 items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
