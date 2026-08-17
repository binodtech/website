import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  shortName: 'BSA',
  name: 'Binod Suman Academy',
  displayName: 'Binod Academy',
  tagline: 'Learn. Build. Crack Interviews. Transform Your Career.',
  url: 'https://binodtech.com',
  youtubeUrl: 'https://youtube.com/@binodsuman',
};
