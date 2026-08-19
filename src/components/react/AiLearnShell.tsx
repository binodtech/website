'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Laptop,
  Link2,
  Network,
  Plug,
  Rocket,
  Search,
  Sparkles,
  Terminal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import {
  aiCourses,
  aiLessonsForCourse,
  getAiSelection,
  type AiLesson,
} from '@/data/ai-ml';
import type { AiCourse } from '@/data/ai-ml/roadmap';
import { ExplainBody } from '@/components/react/ExplainBody';
import { SITE, cn } from '@/lib/utils';

const DONE_KEY = 'binodtech-aiml-done';

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Plug,
  Network,
  Workflow,
  Terminal,
  Laptop,
  Building2,
  Rocket,
  Link2,
  Boxes,
  Cpu,
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

function badgeClass(badge?: string) {
  if (badge === 'Trending') return 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200';
  if (badge === 'Advanced') return 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900';
  return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200';
}

export function AiLearnShell({ initialSlug = '' }: { initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug || 'genai-foundations');
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const selection = useMemo(() => getAiSelection(slug), [slug]);

  useEffect(() => {
    setDone(loadDone());
    const focus =
      getAiSelection(initialSlug || 'genai-foundations').course?.slug ??
      getAiSelection(initialSlug || 'genai-foundations').lesson?.courseSlug ??
      'genai-foundations';
    const start: Record<string, boolean> = {};
    aiCourses.forEach((c, i) => {
      start[c.slug] = i < 2 || c.slug === focus;
    });
    setOpen(start);
  }, []);

  useEffect(() => {
    const courseSlug = selection.course?.slug ?? selection.lesson?.courseSlug;
    if (courseSlug) setOpen((p) => ({ ...p, [courseSlug]: true }));
  }, [slug]);

  useEffect(() => {
    window.history.replaceState(
      null,
      '',
      slug ? `/learn/ai-engineering?t=${encodeURIComponent(slug)}` : '/learn/ai-engineering'
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
    selection.kind === 'lesson'
      ? selection.lesson!.tip
      : selection.kind === 'course'
        ? selection.course!.tip
        : 'Start with Generative AI Foundations, then MCP Essentials, then an IDE track.';

  const interviewWhy =
    selection.kind === 'lesson'
      ? selection.lesson!.why
      : selection.course?.blurb ??
        'AI & ML fluency is now a core engineering skill — models, tools, agents, and delivery discipline.';

  const toc =
    selection.kind === 'lesson'
      ? [
          { id: 'overview', label: 'Overview' },
          { id: 'what', label: 'What' },
          { id: 'why', label: 'Why' },
          { id: 'how', label: 'How' },
          { id: 'where', label: 'Where to use' },
          { id: 'impact', label: 'Impact' },
          { id: 'alternatives', label: 'Alternatives' },
          { id: 'use-cases', label: 'Use cases' },
          { id: 'takeaways', label: 'Key takeaways' },
          { id: 'qa', label: 'Interview Q&A' },
          { id: 'practice', label: 'Practice' },
        ]
      : [
          { id: 'overview', label: 'Overview' },
          { id: 'lessons', label: 'Lessons' },
        ];

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return aiCourses
      .map((course) => {
        let lessons = aiLessonsForCourse(course.slug);
        if (q) {
          lessons = lessons.filter((l) => l.title.toLowerCase().includes(q) || l.slug.includes(q));
          if (!course.title.toLowerCase().includes(q) && lessons.length === 0) return null;
        }
        return { course, lessons };
      })
      .filter(Boolean) as { course: AiCourse; lessons: AiLesson[] }[];
  }, [query]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col border-b border-slate-200 bg-slate-50/80 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200/80 p-4 dark:border-slate-800">
            <a
              href="/#course-hub"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to courses
            </a>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Topics · AI & ML</p>
            <h1 className="mt-1 font-display text-lg font-bold">AI & ML</h1>
            <p className="mt-1 text-[11px] text-slate-400">
              {aiCourses.length} courses · all unlocked · GenAI · agents · IDEs
            </p>
          </div>

          <div className="border-b border-slate-200/80 px-3 py-2 dark:border-slate-800">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter courses & lessons…"
                className="min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
            </label>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Courses</p>
            {filteredCourses.map(({ course, lessons }) => {
              const Icon = ICONS[course.icon] ?? Sparkles;
              const isOpen = open[course.slug];
              const courseActive = slug === course.slug;
              return (
                <div key={course.slug} className="mb-1">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => select(course.slug)}
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold transition',
                        courseActive
                          ? 'bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300'
                          : 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{course.title}</span>
                        {course.badge && (
                          <span className={cn('mt-0.5 inline-block rounded px-1.5 py-px text-[9px] font-bold', badgeClass(course.badge))}>
                            {course.badge}
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      onClick={() => setOpen((p) => ({ ...p, [course.slug]: !p[course.slug] }))}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="ml-2 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800">
                      {lessons.map((lesson) => {
                        const active = slug === lesson.slug;
                        const isDone = done.has(lesson.slug);
                        return (
                          <button
                            key={lesson.slug}
                            type="button"
                            onClick={() => select(lesson.slug)}
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
                              <span className={cn('truncate', isDone && 'line-through')}>{lesson.title}</span>
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
            <a href="/learn/system-design" className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
              System Design track →
            </a>
            <div className="mt-2">
              <a href="/learn/dsa" className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
                Coding / DSA track →
              </a>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </div>
          </div>
        </aside>

        <main className="min-w-0 border-r border-slate-100 px-4 py-8 sm:px-8 dark:border-slate-800">
          {selection.kind === 'course' && selection.course && (
            <CourseView course={selection.course} onSelect={select} />
          )}
          {selection.kind === 'lesson' && selection.lesson && (
            <LessonView
              lesson={selection.lesson}
              courseTitle={selection.course?.title ?? ''}
              done={done.has(selection.lesson.slug)}
              onToggleDone={() => toggleDone(selection.lesson!.slug)}
            />
          )}
          {selection.kind === 'intro' && <CourseView course={aiCourses[0]} onSelect={select} />}
        </main>

        <aside className="hidden space-y-4 p-4 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto xl:p-5">
          <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 dark:border-teal-500/30 dark:from-teal-500/10 dark:to-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {selection.kind === 'lesson' ? 'Builder tip' : 'Study tip'}
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-slate-800 dark:text-slate-200">{tip}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Why this matters</p>
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

function CourseView({ course, onSelect }: { course: AiCourse; onSelect: (s: string) => void }) {
  const lessons = aiLessonsForCourse(course.slug);
  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          AI & ML · {course.duration}
        </p>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', levelClass(course.level))}>
          {course.level}
        </span>
        {course.badge && (
          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', badgeClass(course.badge))}>
            {course.badge}
          </span>
        )}
      </div>
      <h2 id="overview" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {course.title}
      </h2>
      <p className="mt-3 font-normal leading-relaxed text-slate-600 dark:text-slate-300">{course.blurb}</p>

      <section id="lessons" className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Lessons</h3>
          <span className="text-xs text-slate-400">{lessons.length} lessons</span>
        </div>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {lessons.map((l, i) => (
            <button
              key={l.slug}
              type="button"
              onClick={() => onSelect(l.slug)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
              <span className="min-w-0 flex-1">
                <span className="font-semibold">
                  {i + 1}. {l.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{l.summary}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

function LessonView({
  lesson,
  courseTitle,
  done,
  onToggleDone,
}: {
  lesson: AiLesson;
  courseTitle: string;
  done: boolean;
  onToggleDone: () => void;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{courseTitle}</p>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold lowercase', levelClass(lesson.level))}>
          {lesson.level}
        </span>
        <span className="text-[11px] text-slate-400">Lesson {lesson.order}</span>
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
        {lesson.title}
      </h2>
      <p className="mt-3 font-normal leading-relaxed text-slate-600 dark:text-slate-300">{lesson.summary}</p>

      <section id="what" className="mt-8">
        <h3 className="font-display text-xl font-semibold">What</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{lesson.what}</p>
      </section>
      <section id="why" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Why</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{lesson.why}</p>
      </section>
      <section id="how" className="mt-8">
        <h3 className="font-display text-xl font-semibold">How</h3>
        <div className="mt-3">
          <ExplainBody text={lesson.how} />
        </div>
      </section>
      <section id="where" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Where to use</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {lesson.whereToUse.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>
      <section id="impact" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Impact</h3>
        <p className="mt-3 font-normal leading-relaxed text-slate-700 dark:text-slate-300">{lesson.impact}</p>
      </section>
      <section id="alternatives" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Alternatives</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {lesson.alternatives.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
      <section id="use-cases" className="mt-8">
        <h3 className="font-display text-xl font-semibold">Use cases</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-normal text-slate-700 dark:text-slate-300">
          {lesson.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>

      <section id="takeaways" className="mt-8 rounded-2xl border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-500/30 dark:bg-teal-500/10">
        <h3 className="font-display text-lg font-semibold text-teal-900 dark:text-teal-200">Key takeaways</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm font-normal text-slate-700 dark:text-slate-300">
          {lesson.keyTakeaways.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </section>

      <section id="qa" className="mt-10">
        <h3 className="font-display text-xl font-semibold">Expected interviewer questions</h3>
        <div className="mt-4 space-y-4">
          {lesson.interviewerQA.map((item) => (
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

      <section id="practice" className="mt-10 rounded-2xl border border-sky-200 bg-sky-50/70 p-5 dark:border-sky-500/30 dark:bg-sky-500/10">
        <h3 className="font-display text-lg font-semibold text-sky-900 dark:text-sky-200">Practice</h3>
        <p className="mt-2 text-sm font-normal leading-relaxed text-slate-700 dark:text-slate-300">{lesson.practicePrompt}</p>
      </section>

      <section className="mt-10">
        <h3 className="font-display text-xl font-semibold">Full walkthrough</h3>
        <div className="mt-3">
          <ExplainBody text={lesson.explain} />
        </div>
      </section>
    </article>
  );
}
