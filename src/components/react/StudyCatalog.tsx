'use client';

import { Lock, Unlock, ChevronRight } from 'lucide-react';
import { categories } from '@/data/catalog';
import { cn } from '@/lib/utils';

export function StudyCatalog() {
  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const free = cat.topics.filter((t) => t.isFree);
        const locked = cat.topics.filter((t) => !t.isFree);

        return (
          <section
            key={cat.slug}
            className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
              <div>
                <a href={`/learn/${cat.slug}`} className="font-display text-xl font-bold hover:text-brand-600 dark:hover:text-blue-400">
                  {cat.title}
                </a>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{cat.description}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  {free.length} free
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {locked.length} premium
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cat.topics.map((topic) => (
                <TopicRow key={topic.slug} categorySlug={cat.slug} topic={topic} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TopicRow({
  categorySlug,
  topic,
}: {
  categorySlug: string;
  topic: { slug: string; title: string; description: string; duration: string; lessons: number; level: string; isFree: boolean };
}) {
  const href = topic.isFree
    ? `/learn/${categorySlug}/${topic.slug}`
    : `/pricing?topic=${categorySlug}/${topic.slug}`;

  return (
    <a
      href={href}
      className={cn(
        'group flex items-center gap-4 px-5 py-4 transition sm:px-6',
        topic.isFree ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'hover:bg-amber-50/50 dark:hover:bg-amber-500/5'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          topic.isFree
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
        )}
      >
        {topic.isFree ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold group-hover:text-brand-600 dark:group-hover:text-blue-400">{topic.title}</p>
          {topic.isFree ? (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              Free
            </span>
          ) : (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              Pro
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">{topic.description}</p>
        <p className="mt-1 text-xs text-slate-400">
          {topic.lessons} lessons · {topic.duration} · {topic.level}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </a>
  );
}
