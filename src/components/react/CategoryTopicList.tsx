'use client';

import { Lock, Unlock } from 'lucide-react';
import type { Category } from '@/data/catalog';
import { cn } from '@/lib/utils';

export function CategoryTopicList({ category }: { category: Category }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {category.topics.map((topic) => {
        const href = topic.isFree
          ? `/learn/${category.slug}/${topic.slug}`
          : `/pricing?topic=${category.slug}/${topic.slug}`;

        return (
          <a
            key={topic.slug}
            href={href}
            className={cn(
              'group flex gap-4 px-4 py-4 transition sm:px-6',
              topic.isFree ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'hover:bg-amber-50/50 dark:hover:bg-amber-500/5'
            )}
          >
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                topic.isFree
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
              )}
            >
              {topic.isFree ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold group-hover:text-brand-600 dark:group-hover:text-blue-400">
                  {topic.title}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase rounded px-1.5 py-0.5',
                    topic.isFree
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                  )}
                >
                  {topic.isFree ? 'Free' : 'Pro'}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{topic.description}</p>
              <p className="mt-1 text-xs text-slate-400">
                {topic.lessons} lessons · {topic.duration} · {topic.level}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
