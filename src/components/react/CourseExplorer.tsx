'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Crosshair, Layers, Search } from 'lucide-react';
import type { Category } from '@/data/catalog';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'binodtech-learn-done';

function loadDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function topicHref(categorySlug: string, topic: Category['topics'][number]) {
  return topic.isFree ? `/learn/${categorySlug}/${topic.slug}` : `/pricing?topic=${categorySlug}/${topic.slug}`;
}

function topicKey(categorySlug: string, slug: string) {
  return `${categorySlug}:${slug}`;
}

function levelPill(level: string) {
  if (level === 'Beginner') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (level === 'Advanced') return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
  return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
}

export function CourseExplorer({
  category,
  categories,
}: {
  category: Category;
  categories: Category[];
}) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  useEffect(() => {
    setDone(loadDone());
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('course-search')?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function toggleDone(key: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const free = category.topics.filter((t) => t.isFree);
  const pro = category.topics.filter((t) => !t.isFree);
  const modules = [
    { id: 'free', title: 'Free starters', items: free },
    { id: 'pro', title: 'Pro library', items: pro },
  ].filter((m) => m.items.length);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return modules;
    return modules
      .map((m) => ({
        ...m,
        items: m.items.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.level.toLowerCase().includes(q)
        ),
      }))
      .filter((m) => m.items.length);
  }, [q, category]);

  const total = category.topics.length;
  const doneCount = category.topics.filter((t) => done.has(topicKey(category.slug, t.slug))).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4">
            <a href="/#course-hub" className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              ← Back to courses
            </a>
            <p className="mt-5 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Learn</p>
            <nav className="mt-2 space-y-0.5">
              {categories.map((c) => (
                <a
                  key={c.slug}
                  href={`/learn/${c.slug}`}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium',
                    c.slug === category.slug
                      ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-500/10 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  {c.title}
                </a>
              ))}
            </nav>

            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              {modules.map((mod) => {
                const pct = Math.round(
                  (mod.items.filter((t) => done.has(topicKey(category.slug, t.slug))).length / mod.items.length) * 100
                );
                return (
                  <details key={mod.id} open className="border-b border-slate-100 py-2 dark:border-slate-800">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {mod.title}
                      <span className="text-[11px] font-semibold text-slate-400">{pct}%</span>
                    </summary>
                    <div className="mt-1 space-y-0.5">
                      {mod.items.map((t) => (
                        <a
                          key={t.slug}
                          href={topicHref(category.slug, t)}
                          className={cn(
                            'flex items-start gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                            done.has(topicKey(category.slug, t.slug)) && 'text-slate-400 line-through'
                          )}
                        >
                          {t.isFree ? <BookOpen className="mt-0.5 h-3 w-3 shrink-0 text-teal-600" /> : <Layers className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />}
                          {t.title}
                        </a>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="px-4 py-8 sm:px-8 lg:px-10">
          <label className="mx-auto mb-8 flex max-w-md items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-slate-400 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-4 w-4" />
            <input
              id="course-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this track…"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none dark:text-white"
            />
            <kbd className="hidden rounded border border-slate-200 px-1.5 text-[10px] sm:inline dark:border-slate-700">⌘K</kbd>
          </label>

          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Interview track</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Learn {category.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{category.description}</p>
          <p className="mt-2 text-sm text-slate-400">
            {doneCount} of {total} marked done · {free.length} free · {pro.length} Pro
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <VizCard title="Build intuition" bars={[40, 75, 95, 55, 30]} />
            <VizCard title="Interview patterns" window />
            <VizCard title="Scale & trade-offs" grid />
          </div>

          <div className="mt-10 space-y-5">
            {filtered.map((mod) => {
              const n = mod.items.filter((t) => done.has(topicKey(category.slug, t.slug))).length;
              const pct = Math.round((n / mod.items.length) * 100);
              const first = mod.items[0];
              return (
                <section key={mod.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  <header className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
                    <div>
                      <h2 className="font-display text-lg font-bold">{mod.title}</h2>
                      <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {n} / {mod.items.length} complete
                      </p>
                    </div>
                    {first && (
                      <a
                        href={topicHref(category.slug, first)}
                        className="rounded-full bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
                      >
                        Open first
                      </a>
                    )}
                  </header>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="border-y border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-950">
                        <tr>
                          <th className="px-5 py-2.5 sm:px-6">Done</th>
                          <th>Lesson / problem</th>
                          <th>Type</th>
                          <th>Level</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {mod.items.map((t) => {
                          const key = topicKey(category.slug, t.slug);
                          return (
                            <tr key={t.slug} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40">
                              <td className="px-5 py-3 sm:px-6">
                                <input
                                  type="checkbox"
                                  checked={done.has(key)}
                                  onChange={() => toggleDone(key)}
                                  aria-label={`Mark ${t.title} done`}
                                  className="h-4 w-4 accent-teal-700"
                                />
                              </td>
                              <td className="py-3 pr-4">
                                <a href={topicHref(category.slug, t)} className="inline-flex items-center gap-2 font-semibold hover:text-teal-700 dark:hover:text-teal-400">
                                  {category.slug === 'dsa' && !t.slug.includes('patterns') ? (
                                    <Crosshair className="h-3.5 w-3.5 text-teal-600" />
                                  ) : (
                                    <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                                  )}
                                  {t.title}
                                </a>
                                <p className="mt-0.5 max-w-md text-xs text-slate-500">{t.description}</p>
                              </td>
                              <td className="text-slate-500">{t.isFree ? 'Lesson' : 'Hub'}</td>
                              <td>
                                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', levelPill(t.level))}>
                                  {t.level}
                                </span>
                              </td>
                              <td className="pr-5 text-right sm:pr-6">
                                <a href={topicHref(category.slug, t)} className="inline-flex text-slate-400 hover:text-teal-700">
                                  <ChevronRight className="h-4 w-4" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
            {filtered.length === 0 && <p className="text-sm text-slate-500">No matches in this track.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

function VizCard({ title, bars, window, grid }: { title: string; bars?: number[]; window?: boolean; grid?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex h-20 items-end justify-center">
        {bars && (
          <div className="flex h-full w-3/4 items-end gap-2">
            {bars.map((h, i) => (
              <span
                key={i}
                className={cn('flex-1 rounded-t', i % 2 ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700')}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
        {window && (
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <i
                key={i}
                className={cn(
                  'block h-10 w-5 rounded',
                  i >= 1 && i <= 3 ? 'bg-teal-500 outline outline-2 outline-offset-2 outline-teal-800' : 'bg-slate-200 dark:bg-slate-700'
                )}
              />
            ))}
          </div>
        )}
        {grid && (
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} className={cn('block h-4 w-4 rounded-sm', [0, 1, 4, 5, 10].includes(i) ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700')} />
            ))}
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{title}</p>
    </div>
  );
}
