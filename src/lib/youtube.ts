/** YouTube thumbnail URLs with standard fallback order */

export const YOUTUBE_THUMB_QUALITIES = ['hqdefault', 'mqdefault', 'default'] as const;

export function youtubeThumbnailUrl(videoId: string, quality: string = 'hqdefault') {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
