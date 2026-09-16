/** Registry for the AI Harness Masterclass. */

import type { LessonData } from '@/components/LessonPage.astro';
import { ahWhatIs } from '@/data/lessons/ah-what-is';
import { ahArchitecture } from '@/data/lessons/ah-architecture';
import { ahContextEngineering } from '@/data/lessons/ah-context-engineering';
import { ahTools } from '@/data/lessons/ah-tools';
import { ahGuardrails } from '@/data/lessons/ah-guardrails';
import { ahMemoryState } from '@/data/lessons/ah-memory-state';
import { ahMcp } from '@/data/lessons/ah-mcp';
import { ahSubagents } from '@/data/lessons/ah-subagents';
import { ahBuildHarness } from '@/data/lessons/ah-build-harness';
import { ahProduction } from '@/data/lessons/ah-production';

export const ahRegistry: Record<string, LessonData> = {
  'what-is': ahWhatIs,
  architecture: ahArchitecture,
  'context-engineering': ahContextEngineering,
  tools: ahTools,
  guardrails: ahGuardrails,
  'memory-state': ahMemoryState,
  mcp: ahMcp,
  subagents: ahSubagents,
  'build-harness': ahBuildHarness,
  production: ahProduction,
};

export function getAhClass(slug: string): LessonData | undefined {
  return ahRegistry[slug];
}

export function hasAhClass(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(ahRegistry, slug);
}

export const ahWrittenSlugs = Object.keys(ahRegistry);
