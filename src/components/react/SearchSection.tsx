'use client';

import { useMemo, useState } from 'react';
import { Search, TrendingUp, Lock, Unlock } from 'lucide-react';
import { searchCatalog, trendingSearches } from '@/data/content';
import { cn } from '@/lib/utils';

export function SearchSection() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchCatalog.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to learn today? (System Design, DSA, RAG…)"
          className={cn(
            'h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base shadow-lg shadow-slate-200/50 outline-none transition',
            'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
            'dark:border-slate-700 dark:bg-slate-900 dark:shadow-none dark:focus:border-blue-500'
          )}
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-3 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {results.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span className="flex items-center gap-2 font-medium">
                  {r.isFree ? (
                    <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  {r.title}
                </span>
                <span className="text-xs text-slate-500">{r.category}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <TrendingUp className="h-3.5 w-3.5" /> Trending
        </span>
        {trendingSearches.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => setQuery(term)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
