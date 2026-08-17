'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Lock, Menu, Unlock, X } from 'lucide-react';
import { categories } from '@/data/catalog';
import { learnTracks } from '@/data/nav';
import { SITE, cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/react/ThemeToggle';

export function AppHeader() {
  const [browseOpen, setBrowseOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState(categories[0]?.slug ?? '');
  const ref = useRef<HTMLElement>(null);

  const hovered = categories.find((c) => c.slug === hoveredSlug) ?? categories[0];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setBrowseOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setBrowseOpen(false);
    }
    if (browseOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [browseOpen]);

  return (
    <header ref={ref} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-wide flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 lg:hidden dark:text-slate-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <a href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white shadow-md shadow-brand-600/30"
              aria-hidden="true"
            >
              {SITE.shortName}
            </span>
            <span className="hidden sm:inline leading-tight">
              Binod Suman{' '}
              <span className="text-brand-600 dark:text-blue-400">Academy</span>
            </span>
          </a>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setBrowseOpen((o) => !o)}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition',
                browseOpen
                  ? 'bg-brand-50 text-brand-700 dark:bg-blue-500/10 dark:text-blue-300'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-blue-400'
              )}
            >
              Browse tracks
              <ChevronDown className={cn('h-4 w-4 transition', browseOpen && 'rotate-180')} />
            </button>

            {browseOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
                <div className="grid sm:grid-cols-2">
                  <div className="border-b border-slate-100 p-3 sm:border-b-0 sm:border-r dark:border-slate-800">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pick a track
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {categories.map((cat) => {
                        const free = cat.topics.filter((t) => t.isFree).length;
                        return (
                          <li key={cat.slug}>
                            <button
                              type="button"
                              onMouseEnter={() => setHoveredSlug(cat.slug)}
                              onFocus={() => setHoveredSlug(cat.slug)}
                              onClick={() => {
                                setBrowseOpen(false);
                                window.location.href = `/learn/${cat.slug}`;
                              }}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                                hoveredSlug === cat.slug
                                  ? 'bg-brand-50 dark:bg-blue-500/10'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              )}
                            >
                              <span
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white',
                                  cat.color
                                )}
                              >
                                {cat.title.charAt(0)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">{cat.title}</span>
                                <span className="text-xs text-slate-500">
                                  {free} free · {cat.topics.length} topics
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href="/learn"
                      onClick={() => setBrowseOpen(false)}
                      className="mt-2 block rounded-xl bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      View full library
                    </a>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {hovered?.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {hovered?.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {hovered?.topics.slice(0, 5).map((topic) => {
                        const href = topic.isFree
                          ? `/learn/${hovered.slug}/${topic.slug}`
                          : `/pricing?topic=${hovered.slug}/${topic.slug}`;
                        return (
                          <li key={topic.slug}>
                            <a
                              href={href}
                              onClick={() => setBrowseOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              {topic.isFree ? (
                                <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-amber-500" />
                              )}
                              <span className="font-medium">{topic.title}</span>
                              <span className="ml-auto text-[10px] font-bold uppercase text-slate-400">
                                {topic.isFree ? 'Free' : 'Pro'}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href={`/learn/${hovered?.slug}`}
                      onClick={() => setBrowseOpen(false)}
                      className="mt-3 text-xs font-semibold text-brand-600 hover:underline dark:text-blue-400"
                    >
                      See all in {hovered?.title} →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a href="/learn" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-blue-400">
            Study Material
          </a>
          <a href="/#paths" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-blue-400">
            Learning Paths
          </a>
          <a href="/#youtube" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-blue-400">
            Video Samples
          </a>
          <a href="/pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-blue-400">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/pricing"
            className="hidden rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-brand-300 dark:border-slate-700 sm:inline-block"
          >
            Pro
          </a>
          <a
            href="/learn"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
          >
            Start Free
          </a>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 px-4 py-4 lg:hidden dark:border-slate-800">
          {learnTracks.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.label}
            </a>
          ))}
          <a href="/learn" className="mt-2 block px-3 text-sm font-semibold text-brand-600">
            Full library →
          </a>
        </div>
      )}
    </header>
  );
}
