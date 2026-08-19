'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Binary,
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
  Network,
  PanelRight,
  Play,
  Route,
  Search,
  Share2,
  Spline,
  SquareStack,
  Zap,
  BetweenHorizontalStart,
  type LucideIcon,
} from 'lucide-react';
import { dsaPatternsOrdered, getSelection, problemsForPattern, type DsaPattern } from '@/data/dsa/patterns';
import type { DsaProblem } from '@/data/dsa/problems';
import { ExplainBody } from '@/components/react/ExplainBody';
import { SITE, cn } from '@/lib/utils';

const DONE_KEY = 'binodtech-dsa-done';

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
  Zap,
  BetweenHorizonalStart: BetweenHorizontalStart,
  Boxes,
  Binary,
  Network,
  Route,
  SquareStack,
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

function parseExamples(example: string) {
  return example
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function DsaLearnShell({ initialSlug = '' }: { initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug || 'arrays');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [lang, setLang] = useState<'java' | 'python'>('java');
  const [query, setQuery] = useState('');

  const selection = useMemo(() => getSelection(slug), [slug]);

  useEffect(() => {
    setDone(loadDone());
    const startOpen: Record<string, boolean> = {};
    const focus = getSelection(initialSlug || 'arrays').pattern?.slug ?? 'arrays';
    dsaPatternsOrdered.forEach((p, i) => {
      startOpen[p.slug] = i < 3 || p.slug === focus;
    });
    setOpen(startOpen);
  }, []);

  useEffect(() => {
    if (selection.pattern) {
      setOpen((prev) => ({ ...prev, [selection.pattern!.slug]: true }));
    }
  }, [slug]);

  useEffect(() => {
    const url = slug ? `/learn/dsa?t=${encodeURIComponent(slug)}` : '/learn/dsa';
    window.history.replaceState(null, '', url);
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
        : 'Name the pattern in 10 seconds. Then complexity. Then code.';

  const interviewWhy =
    selection.kind === 'problem'
      ? selection.problem!.important
      : selection.pattern?.interviewWhy ?? 'Patterns beat memorizing 500 solutions.';

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
          { id: 'template', label: 'Template' },
          { id: 'problems', label: 'Practice problems' },
        ];

  const related =
    selection.kind === 'problem'
      ? problemsForPattern(selection.problem!.patternSlug)
          .filter((p) => p.slug !== selection.problem!.slug)
          .slice(0, 4)
      : selection.pattern?.relatedLc ?? [];

  const filteredPatterns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dsaPatternsOrdered;
    return dsaPatternsOrdered.filter((pat) => {
      if (pat.title.toLowerCase().includes(q) || pat.concepts.toLowerCase().includes(q)) return true;
      return problemsForPattern(pat.slug).some((p) => p.title.toLowerCase().includes(q) || p.slug.includes(q) || String(p.lc).includes(q));
    });
  }, [query]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* LEFT SIDEBAR — DSA only */}
        <aside className="flex flex-col border-b border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-100 p-4 dark:border-slate-800">
            <a href="/#course-hub" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to courses
            </a>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Learn code</p>
            <h1 className="mt-1 font-display text-lg font-bold">Coding / DSA</h1>
            <p className="mt-1 text-[11px] text-slate-400">25 patterns · 250 interview problems</p>
          </div>

          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter patterns…"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
            </label>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {filteredPatterns.map((pat) => {
              const Icon = ICONS[pat.icon] ?? BookOpen;
              const problems = problemsForPattern(pat.slug);
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
                          'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs',
                          patternActive
                            ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3" /> Overview
                        </span>
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
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900',
                              isDone && !active && 'text-slate-400'
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Crosshair className="h-3 w-3 shrink-0" />
                              <span className={cn('truncate', isDone && 'line-through')}>{prob.title}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1 text-slate-300">
                              {isDone && <Check className="h-3 w-3 text-teal-600" />}
                              <Play className="h-3 w-3 opacity-40" />
                            </span>
                          </button>
                        );
                      })}
                      {problems.length === 0 && (
                        <p className="px-2 py-1 text-[11px] text-slate-400">Problems coming soon</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 p-4 dark:border-slate-800">
            <a href="/pricing" className="text-xs font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-400">
              Sign in / Get Pro
            </a>
            <div className="mt-3 flex gap-3 text-slate-400">
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Play className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/binodsuman/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Link2 className="h-4 w-4" />
              </a>
              <a href="https://github.com/binodsuman" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Boxes className="h-4 w-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <main className="min-w-0 border-r border-slate-100 px-4 py-8 sm:px-8 dark:border-slate-800">
          {selection.kind === 'pattern' && selection.pattern && (
            <PatternView pattern={selection.pattern} onSelectProblem={select} />
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
          {selection.kind === 'intro' && (
            <PatternView pattern={dsaPatternsOrdered[0]} onSelectProblem={select} />
          )}
        </main>

        {/* RIGHT RAIL — changes with selection */}
        <aside className="hidden space-y-4 p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto xl:p-5">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 dark:border-teal-500/30 dark:from-teal-500/10 dark:to-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {selection.kind === 'problem' ? 'Interview technique' : 'Pattern mindset'}
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">{tip}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Unlock Premium Coding</p>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-500/30 dark:text-amber-200">
                Offer
              </span>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-amber-900/80 dark:text-amber-200/80">
              <li>• Interactive pattern walkthroughs</li>
              <li>• Full 25+ problem Java / Python bank</li>
              <li>• Mock interviewer prompts</li>
            </ul>
            <a
              href="/pricing"
              className="mt-3 flex h-9 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white hover:bg-teal-800"
            >
              Learn more
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Most important for interview</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{interviewWhy}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">On this page</p>
            <ul className="mt-2 space-y-1.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-teal-700 hover:underline dark:text-teal-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Related interview questions</p>
            <ul className="mt-3 space-y-2">
              {selection.kind === 'problem'
                ? (related as DsaProblem[]).map((p) => (
                    <li key={p.slug}>
                      <button type="button" onClick={() => select(p.slug)} className="text-left text-sm font-medium text-slate-700 hover:text-teal-700 dark:text-slate-300">
                        {p.title}
                      </button>
                      <p className="text-[11px] text-slate-400">{p.difficulty} · LC {p.lc}</p>
                    </li>
                  ))
                : (related as { title: string; reports: string }[]).map((r) => (
                    <li key={r.title}>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.title}</p>
                      <p className="text-[11px] text-slate-400">{r.reports}</p>
                    </li>
                  ))}
            </ul>
            {selection.pattern && (
              <button
                type="button"
                onClick={() => select(selection.pattern!.slug)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400"
              >
                Browse all {selection.pattern.title} <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function PatternView({ pattern, onSelectProblem }: { pattern: DsaPattern; onSelectProblem: (s: string) => void }) {
  const problems = problemsForPattern(pattern.slug);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        Pattern {pattern.order} · {problems.length} problems
      </p>
      <h2 id="overview" className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {pattern.title}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Concepts: <span className="font-medium text-slate-700 dark:text-slate-300">{pattern.concepts}</span>
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Signal: <span className="font-medium text-slate-700 dark:text-slate-300">{pattern.signal}</span>
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 dark:border-slate-700">
        <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold text-teal-300">Concept walkthrough</div>
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-teal-50 sm:text-sm">{pattern.template}</pre>
      </div>

      <div className="prose-dsa mt-8 space-y-6">
        <section>
          <h3 className="font-display text-xl font-bold">What this pattern is</h3>
          <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{pattern.overview}</p>
        </section>

        <section id="when">
          <h3 className="font-display text-xl font-bold">When do I use this?</h3>
          <ul className="mt-3 space-y-2">
            {pattern.whenToUse.map((w) => (
              <li key={w} className="flex gap-2 text-slate-600 dark:text-slate-300">
                <span className="text-teal-600">✓</span> {w}
              </li>
            ))}
          </ul>
        </section>

        <section id="template">
          <h3 className="font-display text-xl font-bold">Interview template</h3>
          <p className="mt-2 text-sm text-slate-500">Memorize the shape, not a specific problem.</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-100 p-4 font-mono text-xs dark:bg-slate-900 sm:text-sm">{pattern.template}</pre>
        </section>

        <section id="problems">
          <h3 className="font-display text-xl font-bold">Practice problems</h3>
          <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {problems.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => onSelectProblem(p.slug)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span>
                  <span className="font-semibold">{p.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">LC {p.lc} · {p.complexity}</span>
                </span>
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', diffClass(p.difficulty))}>{p.difficulty}</span>
              </button>
            ))}
            {problems.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">More problems for this pattern coming soon.</p>}
          </div>
        </section>
      </div>
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
  problem: DsaProblem;
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
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">{patternTitle}</p>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold lowercase', diffClass(problem.difficulty))}>
          {problem.difficulty}
        </span>
        <button
          type="button"
          onClick={onToggleDone}
          className={cn(
            'ml-auto rounded-full border px-3 py-1 text-[11px] font-bold',
            done
              ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300'
              : 'border-slate-200 text-slate-500 dark:border-slate-700'
          )}
        >
          {done ? '✓ Marked done' : 'Mark done'}
        </button>
      </div>

      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{problem.title}</h2>
      <p className="mt-1 text-sm text-slate-500">LeetCode {problem.lc} · {problem.complexity}</p>

      <section id="description" className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h3>
        <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{problem.question}</p>
      </section>

      <section id="examples" className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h3>
        <div className="mt-3 space-y-3">
          {examples.map((ex, i) => (
            <pre key={i} className="overflow-x-auto rounded-xl bg-slate-100 p-4 font-mono text-xs leading-relaxed dark:bg-slate-900 sm:text-sm">
              {ex}
            </pre>
          ))}
        </div>
      </section>

      <section id="thinking" className="mt-8 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-500/30 dark:bg-teal-500/10">
        <h3 className="font-display text-lg font-semibold text-teal-900 dark:text-teal-200">Interview thinking (first 60 seconds)</h3>
        <div className="mt-2 text-teal-950/90 dark:text-teal-100/90">
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
        <h3 className="font-display text-xl font-bold">Step-by-step walkthrough</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            Pattern flow
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm">{problem.patternFlow}</pre>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Key snippet</p>
          <pre className="mt-2 overflow-x-auto font-mono text-xs text-teal-800 dark:text-teal-300 sm:text-sm">{snippet}</pre>
        </div>
      </section>

      <section id="edge-cases" className="mt-8">
        <h3 className="font-display text-xl font-bold">Edge cases & inputs to mention</h3>
        <ul className="mt-3 space-y-2">
          {problem.edgeCases.map((e) => (
            <li key={e} className="flex gap-2 text-slate-700 dark:text-slate-300">
              <span className="font-bold text-orange-500">•</span> {e}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-500">{problem.followUp}</p>
      </section>

      <section id="solution" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold">Full solution</h3>
          <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {(['java', 'python'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-bold capitalize',
                  lang === l ? 'bg-teal-700 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Every line is intentional — read comments in your head: what does this variable protect?
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 sm:text-sm">
          <AnnotatedCode code={code} lang={lang} />
        </pre>
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">{problem.complexity}</p>
      </section>
    </article>
  );
}

/** Light line-by-line annotation strip for self-explanatory reading */
function AnnotatedCode({ code, lang }: { code: string; lang: 'java' | 'python' }) {
  const lines = code.split('\n');
  return (
    <code className="block">
      {lines.map((line, i) => (
        <span key={i} className="group flex gap-3">
          <span className="w-8 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
          <span className="flex-1 whitespace-pre-wrap">{line || ' '}</span>
        </span>
      ))}
      <span className="mt-4 block border-t border-slate-800 pt-3 text-[11px] text-slate-500">
        {lang === 'java'
          ? 'Java tip: prefer clear variable names (need, map, lo/hi) over clever one-liners in interviews.'
          : 'Python tip: enumerate + dict.get keeps the story readable — interviewers grade clarity.'}
      </span>
    </code>
  );
}
