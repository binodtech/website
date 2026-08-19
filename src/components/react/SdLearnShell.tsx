'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Crosshair,
  Globe,
  Layers,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  getSdSelection,
  sdSections,
  sdTopicsForSection,
  type SdTopic,
} from '@/data/system-design';
import type { SdSection } from '@/data/system-design/roadmap';
import { ExplainBody } from '@/components/react/ExplainBody';
import { SITE, cn } from '@/lib/utils';

const DONE_KEY = 'binodtech-sd-done';

const ICONS: Record<string, LucideIcon> = {
  Clock,
  BookOpen,
  Cpu,
  Layers,
  Crosshair,
  Sparkles,
  Globe,
  Boxes,
};

function loadDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function levelClass(d: string) {
  if (d === 'Beginner') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (d === 'Advanced') return 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300';
  return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
}

export function SdLearnShell({ initialSlug = '' }: { initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug || 'introduction');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const selection = useMemo(() => getSdSelection(slug), [slug]);

  useEffect(() => {
    setDone(loadDone());
    const focus =
      getSdSelection(initialSlug || 'introduction').section?.slug ??
      getSdSelection(initialSlug || 'introduction').topic?.sectionSlug ??
      'in-a-hurry';
    const start: Record<string, boolean> = {};
    sdSections.forEach((s, i) => {
      start[s.slug] = i < 2 || s.slug === focus;
    });
    setOpen(start);
  }, []);

  useEffect(() => {
    const sectionSlug = selection.section?.slug ?? selection.topic?.sectionSlug;
    if (sectionSlug) setOpen((p) => ({ ...p, [sectionSlug]: true }));
  }, [slug]);

  useEffect(() => {
    window.history.replaceState(
      null,
      '',
      slug ? `/learn/system-design?t=${encodeURIComponent(slug)}` : '/learn/system-design'
    );
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
    selection.kind === 'topic'
      ? selection.topic!.tip
      : selection.kind === 'section'
        ? selection.section!.tip
        : 'Start with In a Hurry, then Core Concepts, then Question Breakdowns.';

  const interviewWhy =
    selection.kind === 'topic'
      ? selection.topic!.why
      : selection.section?.overview ??
        'System design interviews reward clear requirements, APIs, and trade-offs under time pressure.';

  const toc =
    selection.kind === 'topic'
      ? selection.topic!.kind === 'problem'
        ? [
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'setup', label: 'Entities & API' },
            { id: 'what-why-how', label: 'What / Why / How' },
            { id: 'design', label: 'High-level design' },
            { id: 'deep-dives', label: 'Deep dives' },
            { id: 'impact', label: 'Impact & alternatives' },
            { id: 'qa', label: 'Interviewer Q&A' },
            { id: 'mistakes', label: 'Common mistakes' },
          ]
        : [
            { id: 'overview', label: 'Overview' },
            { id: 'what', label: 'What' },
            { id: 'why', label: 'Why' },
            { id: 'how', label: 'How' },
            { id: 'where', label: 'Where to use' },
            { id: 'impact', label: 'Impact' },
            { id: 'alternatives', label: 'Alternatives' },
            { id: 'use-cases', label: 'Use cases' },
            { id: 'qa', label: 'Interviewer Q&A' },
            { id: 'mistakes', label: 'Common mistakes' },
          ]
      : [
          { id: 'overview', label: 'Overview' },
          { id: 'topics', label: 'Topics' },
        ];

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sdSections
      .map((sec) => {
        let topics = sdTopicsForSection(sec.slug);
        if (q) {
          topics = topics.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.slug.includes(q) ||
              (t.pattern || '').toLowerCase().includes(q)
          );
          if (!sec.title.toLowerCase().includes(q) && topics.length === 0) return null;
        }
        return { sec, topics };
      })
      .filter(Boolean) as { sec: SdSection; topics: SdTopic[] }[];
  }, [query]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col border-b border-slate-200 bg-slate-50/80 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200/80 p-4 dark:border-slate-800">
            <a
              href="/#course-hub"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to courses
            </a>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Learn System Design
            </p>
            <h1 className="mt-1 font-display text-lg font-bold">System Design</h1>
            <p className="mt-1 text-[11px] text-slate-400">
              {sdSections.length} sections · {sdTopicsForSection('question-breakdowns').length}+ breakdowns · all unlocked
            </p>
          </div>

          <div className="border-b border-slate-200/80 px-3 py-2 dark:border-slate-800">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter topics…"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
            </label>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {filteredSections.map(({ sec, topics }) => {
              const Icon = ICONS[sec.icon] ?? BookOpen;
              const isOpen = open[sec.slug];
              const sectionActive = slug === sec.slug;
              return (
                <div key={sec.slug} className="mb-1">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => select(sec.slug)}
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold transition',
                        sectionActive
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                          : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                      <span className="truncate">{sec.title}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      onClick={() => setOpen((p) => ({ ...p, [sec.slug]: !p[sec.slug] }))}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="ml-2 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800">
                      {topics.map((topic) => {
                        const active = slug === topic.slug;
                        const isDone = done.has(topic.slug);
                        return (
                          <button
                            key={topic.slug}
                            type="button"
                            onClick={() => select(topic.slug)}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs',
                              active
                                ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                                : 'text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-900',
                              isDone && !active && 'text-slate-400'
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
                                  isDone
                                    ? 'border-teal-600 bg-teal-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600'
                                )}
                              >
                                {isDone && <Check className="h-2.5 w-2.5" />}
                              </span>
                              <span className={cn('truncate', isDone && 'line-through')}>{topic.title}</span>
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

          <div className="mt-auto border-t border-slate-200/80 p-4 dark:border-slate-800">
            <a href="/learn/dsa" className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              Coding / DSA track →
            </a>
            <div className="mt-3 flex gap-3 text-slate-400">
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                YouTube
              </a>
            </div>
          </div>
        </aside>

        <main className="min-w-0 border-r border-slate-100 px-4 py-8 sm:px-8 dark:border-slate-800">
          {selection.kind === 'section' && selection.section && (
            <SectionView section={selection.section} onSelect={select} />
          )}
          {selection.kind === 'topic' && selection.topic && (
            <TopicView
              topic={selection.topic}
              sectionTitle={selection.section?.title ?? ''}
              done={done.has(selection.topic.slug)}
              onToggleDone={() => toggleDone(selection.topic!.slug)}
            />
          )}
          {selection.kind === 'intro' && <SectionView section={sdSections[0]} onSelect={select} />}
        </main>

        <aside className="hidden space-y-4 p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto xl:p-5">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 dark:border-teal-500/30 dark:from-teal-500/10 dark:to-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {selection.kind === 'topic' ? 'Interview tip' : 'Study tip'}
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-800 dark:text-slate-200">{tip}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Why this matters</p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">
              {interviewWhy}
            </p>
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

          {selection.kind === 'topic' && selection.topic!.pattern && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pattern lens</p>
              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{selection.topic!.pattern}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SectionView({ section, onSelect }: { section: SdSection; onSelect: (s: string) => void }) {
  const topics = sdTopicsForSection(section.slug);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        Section {section.order} · {topics.length} topics
      </p>
      <h2 id="overview" className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {section.title}
      </h2>
      <p className="mt-3 font-normal leading-relaxed text-slate-600 dark:text-slate-300">{section.overview}</p>

      <section id="topics" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Topics in this section</h3>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {topics.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => onSelect(t.slug)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>
                <span className="font-semibold">{t.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{t.summary.slice(0, 110)}…</span>
              </span>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold', levelClass(t.level))}>
                {t.level}
              </span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function TopicView({
  topic,
  sectionTitle,
  done,
  onToggleDone,
}: {
  topic: SdTopic;
  sectionTitle: string;
  done: boolean;
  onToggleDone: () => void;
}) {
  const isProblem = topic.kind === 'problem';

  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{sectionTitle}</p>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold lowercase', levelClass(topic.level))}>
          {topic.level}
        </span>
        {topic.pattern && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {topic.pattern}
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

      <h2 id="overview" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {topic.title}
      </h2>
      <p className="mt-3 font-normal leading-relaxed text-slate-600 dark:text-slate-300">{topic.summary}</p>

      {isProblem ? <ProblemSections topic={topic} /> : <ConceptSections topic={topic} />}

      <section id="qa" className="mt-10">
        <h3 className="font-display text-xl font-semibold">Expected interviewer questions</h3>
        <div className="mt-4 space-y-4">
          {topic.interviewerQA.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Q: {item.q}</p>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-teal-700 dark:text-teal-400">A: </span>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="mistakes" className="mt-10">
        <h3 className="font-display text-xl font-semibold">Common mistakes</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.commonMistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <h4 className="mt-6 font-display text-lg font-semibold">Trade-offs to mention</h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.tradeoffs.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50/70 p-5 dark:border-sky-500/30 dark:bg-sky-500/10">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">Full walkthrough</p>
        <div className="mt-3">
          <ExplainBody text={topic.explain} />
        </div>
      </section>
    </article>
  );
}

function ConceptSections({ topic }: { topic: SdTopic }) {
  return (
    <>
      <section id="what" className="mt-8">
        <h3 className="font-display text-xl font-semibold">What</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.what}</p>
      </section>
      <section id="why" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Why</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.why}</p>
      </section>
      <section id="how" className="mt-8">
        <h3 className="font-display text-xl font-semibold">How</h3>
        <div className="mt-3">
          <ExplainBody text={topic.how} />
        </div>
      </section>
      <section id="where" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Where to use</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.whereToUse.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>
      <section id="impact" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Impact</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.impact}</p>
      </section>
      <section id="alternatives" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Alternatives</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.alternatives.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
      <section id="use-cases" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Use cases</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ProblemSections({ topic }: { topic: SdTopic }) {
  return (
    <>
      <section id="requirements" className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Functional requirements</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm font-normal text-slate-700 dark:text-slate-300">
            {topic.functionalRequirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-500/30 dark:bg-teal-500/10">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
            Non-functional requirements
          </h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm font-normal text-slate-700 dark:text-slate-300">
            {topic.nonFunctionalRequirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="setup" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Core entities</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {topic.entities.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        {topic.apis && (
          <>
            <h4 className="mt-6 font-display text-lg font-semibold">API / system interface</h4>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-100 p-4 font-mono text-xs font-normal dark:bg-slate-900 sm:text-sm">
              {topic.apis}
            </pre>
          </>
        )}
      </section>

      <section id="what-why-how" className="mt-8 space-y-6">
        <div>
          <h3 className="font-display text-xl font-semibold">What</h3>
          <p className="mt-2 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.what}</p>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Why</h3>
          <p className="mt-2 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.why}</p>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">How</h3>
          <div className="mt-2">
            <ExplainBody text={topic.how} />
          </div>
        </div>
      </section>

      <section id="design" className="mt-8">
        <h3 className="font-display text-xl font-semibold">High-level design</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.highLevelDesign}</p>
      </section>

      <section id="deep-dives" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Potential deep dives</h3>
        <div className="mt-4 space-y-4">
          {topic.deepDives.map((d, i) => (
            <div
              key={d.title}
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {i + 1}. {d.title}
              </p>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="impact" className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-semibold">Impact</h3>
          <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">{topic.impact}</p>
          <h4 className="mt-4 text-sm font-semibold">Where to use</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {topic.whereToUse.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Alternatives</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {topic.alternatives.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <h4 className="mt-4 text-sm font-semibold">Use cases</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {topic.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
