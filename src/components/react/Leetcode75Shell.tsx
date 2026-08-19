'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Crosshair,
  GitBranch,
  Hash,
  Layers,
  Link2,
  PanelRight,
  Play,
  Search,
  Share2,
  Spline,
  Star,
  BetweenHorizontalStart,
  type LucideIcon,
} from 'lucide-react';
import {
  getLc75Selection,
  lc75Patterns,
  lc75ProblemsForPattern,
  type Lc75Problem,
} from '@/data/leetcode75';
import type { Lc75Pattern } from '@/data/leetcode75/roadmap';
import { ExplainBody } from '@/components/react/ExplainBody';
import { SITE, cn } from '@/lib/utils';

const DONE_KEY = 'binodtech-lc75-done';

const ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight,
  PanelRight,
  Hash,
  Clock,
  Layers,
  Link: Link2,
  GitBranch,
  Share2,
  Spline,
  Search,
  BetweenHorizonalStart: BetweenHorizontalStart,
  Boxes,
};

function loadDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function diffClass(d: string) {
  if (d === 'Easy') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (d === 'Hard') return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
  return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`${n} / 5 importance`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-3 w-3', i < n ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600')}
        />
      ))}
    </span>
  );
}

function parseExamples(example: string) {
  return example.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
}

export function Leetcode75Shell({ initialSlug = '' }: { initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug || 'array-string');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [lang, setLang] = useState<'java' | 'python'>('java');
  const [query, setQuery] = useState('');
  const [mustOnly, setMustOnly] = useState(false);

  const selection = useMemo(() => getLc75Selection(slug), [slug]);

  useEffect(() => {
    setDone(loadDone());
    const focus = getLc75Selection(initialSlug || 'array-string').pattern?.slug ?? 'array-string';
    const start: Record<string, boolean> = {};
    lc75Patterns.forEach((p, i) => {
      start[p.slug] = i < 2 || p.slug === focus;
    });
    setOpen(start);
  }, []);

  useEffect(() => {
    if (selection.pattern) setOpen((p) => ({ ...p, [selection.pattern!.slug]: true }));
  }, [slug]);

  useEffect(() => {
    window.history.replaceState(null, '', slug ? `/learn/leetcode-75?t=${encodeURIComponent(slug)}` : '/learn/leetcode-75');
  }, [slug]);

  function select(next: string) {
    setSlug(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(DONE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  const tip =
    selection.kind === 'problem'
      ? selection.problem!.tip
      : selection.kind === 'pattern'
        ? selection.pattern!.tip
        : 'Finish 5-star must-dos first if time is short.';

  const interviewWhy =
    selection.kind === 'problem'
      ? selection.problem!.important
      : selection.pattern?.interviewWhy ?? 'LeetCode 75 covers the patterns that show up in most screens.';

  const toc =
    selection.kind === 'problem'
      ? [
          { id: 'description', label: 'Description' },
          { id: 'examples', label: 'Examples' },
          { id: 'thinking', label: 'Interview thinking' },
          { id: 'explanation', label: 'Explanation' },
          { id: 'approaches', label: 'Naive → Optimized' },
          { id: 'walkthrough', label: 'Step-by-step' },
          { id: 'edge-cases', label: 'Edge cases' },
          { id: 'solution', label: 'Solution' },
        ]
      : [
          { id: 'overview', label: 'Overview' },
          { id: 'when', label: 'When to use' },
          { id: 'problems', label: 'Problems' },
        ];

  const filteredPatterns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lc75Patterns
      .map((pat) => {
        let problems = lc75ProblemsForPattern(pat.slug);
        if (mustOnly) problems = problems.filter((p) => p.stars === 5);
        if (q) {
          problems = problems.filter(
            (p) => p.title.toLowerCase().includes(q) || p.slug.includes(q) || String(p.lc).includes(q)
          );
          if (!pat.title.toLowerCase().includes(q) && problems.length === 0) return null;
        }
        return { pat, problems };
      })
      .filter(Boolean) as { pat: Lc75Pattern; problems: Lc75Problem[] }[];
  }, [query, mustOnly]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:grid lg:grid-cols-[270px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col border-b border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-100 p-4 dark:border-slate-800">
            <a href="/#course-hub" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to courses
            </a>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Study plan</p>
            <h1 className="mt-1 font-display text-lg font-bold">LeetCode 75</h1>
            <p className="mt-1 text-[11px] text-slate-400">22 groups · 75 problems · ★ = importance</p>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <input type="checkbox" checked={mustOnly} onChange={(e) => setMustOnly(e.target.checked)} className="accent-teal-700" />
              Show must-do (5★) only
            </label>
          </div>

          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter problems…"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
            </label>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {filteredPatterns.map(({ pat, problems }) => {
              const Icon = ICONS[pat.icon] ?? BookOpen;
              const isOpen = open[pat.slug];
              const patternActive = slug === pat.slug;
              return (
                <div key={pat.slug} className="mb-1">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => select(pat.slug)}
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold transition',
                        patternActive
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                      <span className="truncate">{pat.title}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      onClick={() => setOpen((p) => ({ ...p, [pat.slug]: !p[pat.slug] }))}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="ml-2 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => select(pat.slug)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs',
                          patternActive
                            ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                        )}
                      >
                        <BookOpen className="h-3 w-3" /> Overview
                      </button>
                      {problems.map((prob) => {
                        const active = slug === prob.slug;
                        const isDone = done.has(prob.slug);
                        return (
                          <button
                            key={prob.slug}
                            type="button"
                            onClick={() => select(prob.slug)}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs',
                              active
                                ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400',
                              isDone && !active && 'text-slate-400'
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Crosshair className="h-3 w-3 shrink-0" />
                              <span className={cn('truncate', isDone && 'line-through')}>{prob.title}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              {prob.stars === 5 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                              {isDone && <Check className="h-3 w-3 text-teal-600" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 p-4 dark:border-slate-800">
            <a href="/learn/dsa" className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              Full DSA roadmap (250) →
            </a>
            <div className="mt-3 flex gap-3 text-slate-400">
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>
        </aside>

        <main className="min-w-0 border-r border-slate-100 px-4 py-8 sm:px-8 dark:border-slate-800">
          {selection.kind === 'pattern' && selection.pattern && (
            <PatternView pattern={selection.pattern} onSelect={select} />
          )}
          {selection.kind === 'problem' && selection.problem && (
            <ProblemView
              problem={selection.problem}
              patternTitle={selection.pattern?.title ?? ''}
              lang={lang}
              setLang={setLang}
              done={done.has(selection.problem.slug)}
              onToggleDone={() => toggleDone(selection.problem!.slug)}
            />
          )}
          {selection.kind === 'intro' && <PatternView pattern={lc75Patterns[0]} onSelect={select} />}
        </main>

        <aside className="hidden space-y-4 p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto xl:p-5">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 dark:border-teal-500/30 dark:from-teal-500/10 dark:to-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {selection.kind === 'problem' ? 'Interview technique' : 'Study tip'}
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-800 dark:text-slate-200">{tip}</p>
          </div>

          {selection.kind === 'problem' && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200">Importance</p>
              <div className="mt-2 flex items-center gap-2">
                <Stars n={selection.problem!.stars} />
                <span className="text-sm text-amber-900 dark:text-amber-100">
                  {selection.problem!.stars === 5 ? 'Must-do' : `${selection.problem!.stars}/5`}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Unlock Premium Coding</p>
            <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-200/80">Mocks, full solutions bank, and progress sync.</p>
            <a href="/pricing" className="mt-3 flex h-9 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white hover:bg-teal-800">
              Learn more
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Most important for interview</p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">{interviewWhy}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">On this page</p>
            <ul className="mt-2 space-y-1.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm font-normal text-teal-700 hover:underline dark:text-teal-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PatternView({ pattern, onSelect }: { pattern: Lc75Pattern; onSelect: (s: string) => void }) {
  const problems = lc75ProblemsForPattern(pattern.slug);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        Group {pattern.order} · {problems.length} problems
      </p>
      <h2 id="overview" className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {pattern.title}
      </h2>
      <p className="mt-3 font-normal leading-relaxed text-slate-600 dark:text-slate-300">{pattern.overview}</p>

      <section id="when" className="mt-8">
        <h3 className="font-display text-xl font-semibold">When to use</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600 dark:text-slate-300">
          {pattern.whenToUse.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>

      <section id="problems" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Problems in this group</h3>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {problems.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => onSelect(p.slug)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>
                <span className="font-semibold">{p.title}</span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                  LC {p.lc} · <Stars n={p.stars} />
                </span>
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', diffClass(p.difficulty))}>{p.difficulty}</span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function ProblemView({
  problem,
  patternTitle,
  lang,
  setLang,
  done,
  onToggleDone,
}: {
  problem: Lc75Problem;
  patternTitle: string;
  lang: 'java' | 'python';
  setLang: (l: 'java' | 'python') => void;
  done: boolean;
  onToggleDone: () => void;
}) {
  const examples = parseExamples(problem.example);
  const code = lang === 'java' ? problem.java : problem.python;
  const snippet = lang === 'java' ? problem.snippetJava : problem.snippetPython;

  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{patternTitle}</p>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold lowercase', diffClass(problem.difficulty))}>
          {problem.difficulty}
        </span>
        <Stars n={problem.stars} />
        {problem.stars === 5 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            Must-do
          </span>
        )}
        <button
          type="button"
          onClick={onToggleDone}
          className={cn(
            'ml-auto rounded-full border px-3 py-1 text-[11px] font-semibold',
            done
              ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300'
              : 'border-slate-200 text-slate-500 dark:border-slate-700'
          )}
        >
          {done ? '✓ Marked done' : 'Mark done'}
        </button>
      </div>

      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{problem.title}</h2>
      <p className="mt-1 text-sm font-normal text-slate-500">
        LeetCode {problem.lc} · {problem.complexity}
      </p>

      <section id="description" className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{problem.question}</p>
      </section>

      <section id="examples" className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Examples</h3>
        <div className="mt-3 space-y-3">
          {examples.map((ex, i) => (
            <pre key={i} className="overflow-x-auto rounded-xl bg-slate-100 p-4 font-mono text-xs font-normal leading-relaxed dark:bg-slate-900 sm:text-sm">
              {ex}
            </pre>
          ))}
        </div>
      </section>

      <section id="thinking" className="mt-8 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-500/30 dark:bg-teal-500/10">
        <h3 className="font-display text-lg font-semibold text-teal-900 dark:text-teal-200">Interview thinking (first 60 seconds)</h3>
        <div className="mt-2">
          <ExplainBody text={problem.thinking} />
        </div>
      </section>

      <section id="explanation" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Explanation</h3>
        <div className="mt-3">
          <ExplainBody text={problem.explain} />
        </div>
      </section>

      <section id="approaches" className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Naive approach</p>
          <div className="mt-2">
            <ExplainBody text={problem.naiveApproach} className="text-sm" />
          </div>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-500/30 dark:bg-teal-500/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">Optimized approach</p>
          <div className="mt-2">
            <ExplainBody text={problem.optimizedApproach} className="text-sm" />
          </div>
        </div>
      </section>

      <section id="walkthrough" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Step-by-step walkthrough</h3>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs font-normal dark:border-slate-800 dark:bg-slate-900 sm:text-sm">
          {problem.patternFlow}
        </pre>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 p-4 font-mono text-xs font-normal text-teal-800 dark:border-slate-800 dark:text-teal-300 sm:text-sm">
          {snippet}
        </pre>
      </section>

      <section id="edge-cases" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Edge cases</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {problem.edgeCases.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm font-normal text-slate-500">{problem.followUp}</p>
      </section>

      <section id="solution" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Full solution</h3>
          <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {(['java', 'python'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold capitalize',
                  lang === l ? 'bg-teal-700 text-white' : 'text-slate-500'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs font-normal leading-relaxed text-slate-100 sm:text-sm">
          {code.split('\n').map((line, i) => (
            <span key={i} className="flex gap-3">
              <span className="w-8 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
              <span className="flex-1 whitespace-pre-wrap">{line || ' '}</span>
            </span>
          ))}
        </pre>
        <p className="mt-3 text-sm font-normal text-slate-600 dark:text-slate-400">{problem.complexity}</p>
      </section>
    </article>
  );
}
