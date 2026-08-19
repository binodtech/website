import { dsaRoadmap, interviewOrder, type RoadmapPattern } from './roadmap';
import { dsaProblems, type DsaProblem } from './problems';

export type DsaPattern = {
  slug: string;
  title: string;
  order: number;
  icon: string;
  concepts: string;
  signal: string;
  overview: string;
  whenToUse: string[];
  template: string;
  tip: string;
  interviewWhy: string;
  relatedLc: { title: string; reports: string }[];
};

export const dsaPatterns: DsaPattern[] = dsaRoadmap.map((p) => ({
  slug: p.slug,
  title: p.title,
  order: p.order,
  icon: p.icon,
  concepts: p.concepts,
  signal: p.signal,
  overview: p.overview,
  whenToUse: p.whenToUse,
  template: p.template,
  tip: p.tip,
  interviewWhy: p.interviewWhy,
  relatedLc: p.problems.slice(0, 3).map((q) => ({
    title: `LeetCode ${q.lc}. ${q.title}`,
    reports: q.difficulty,
  })),
}));

/** Prefer interview-priority order in the sidebar */
export const dsaPatternsOrdered: DsaPattern[] = (() => {
  const bySlug = Object.fromEntries(dsaPatterns.map((p) => [p.slug, p]));
  const ordered: DsaPattern[] = [];
  for (const slug of interviewOrder) {
    if (bySlug[slug]) ordered.push(bySlug[slug]);
  }
  for (const p of dsaPatterns) {
    if (!ordered.find((x) => x.slug === p.slug)) ordered.push(p);
  }
  return ordered;
})();

export function problemsForPattern(patternSlug: string): DsaProblem[] {
  return dsaProblems.filter((p) => p.patternSlug === patternSlug);
}

export function getPattern(slug: string): DsaPattern | undefined {
  return dsaPatterns.find((p) => p.slug === slug);
}

export function getProblem(slug: string): DsaProblem | undefined {
  return dsaProblems.find((p) => p.slug === slug);
}

export function getSelection(slug: string | null): {
  kind: 'intro' | 'pattern' | 'problem';
  pattern?: DsaPattern;
  problem?: DsaProblem;
} {
  if (!slug) return { kind: 'intro' };
  const pattern = getPattern(slug);
  if (pattern) return { kind: 'pattern', pattern };
  const problem = getProblem(slug);
  if (problem) {
    return { kind: 'problem', problem, pattern: getPattern(problem.patternSlug) };
  }
  return { kind: 'intro' };
}

export function roadmapStats() {
  return {
    patterns: dsaRoadmap.length,
    problems: dsaRoadmap.reduce((n, p) => n + p.problems.length, 0),
  };
}

export type { RoadmapPattern, DsaProblem };
