import { lc75Patterns } from './roadmap';
import { lc75Problems, type Lc75Problem } from './problems';

export type { Lc75Problem };
export { lc75Patterns, lc75Problems };

export function lc75ProblemsForPattern(patternSlug: string) {
  return lc75Problems.filter((p) => p.patternSlug === patternSlug);
}

export function getLc75Pattern(slug: string) {
  return lc75Patterns.find((p) => p.slug === slug);
}

export function getLc75Problem(slug: string) {
  return lc75Problems.find((p) => p.slug === slug);
}

export function getLc75Selection(slug: string | null) {
  if (!slug) return { kind: 'intro' as const };
  const pattern = getLc75Pattern(slug);
  if (pattern) return { kind: 'pattern' as const, pattern };
  const problem = getLc75Problem(slug);
  if (problem) return { kind: 'problem' as const, problem, pattern: getLc75Pattern(problem.patternSlug) };
  return { kind: 'intro' as const };
}
