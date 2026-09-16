/** Registry for the Claude Code course.
 *  Classes are added here as they are written; the dynamic route at
 *  /learn/claude-code/[chapter] builds a page for every entry, and the
 *  generic [category]/[topic] route skips anything registered here.
 */

import type { LessonData } from '@/components/LessonPage.astro';
import { ccFundamentals } from '@/data/lessons/cc-fundamentals';
import { ccCliFirstProject } from '@/data/lessons/cc-cli-first-project';
import { ccContextEngineering } from '@/data/lessons/cc-context-engineering';
import { ccCodingAgent } from '@/data/lessons/cc-coding-agent';
import { ccAdvancedWorkflow } from '@/data/lessons/cc-advanced-workflow';
import { ccSkillsCommandsHooks } from '@/data/lessons/cc-skills-commands-hooks';
import { ccMcp } from '@/data/lessons/cc-mcp';
import { ccSubagents } from '@/data/lessons/cc-subagents';
import { ccRealWorldProject } from '@/data/lessons/cc-real-world-project';
import { ccProduction } from '@/data/lessons/cc-production';

/** Class slug -> lesson data. Order here defines Previous/Next navigation. */
export const ccRegistry: Record<string, LessonData> = {
  fundamentals: ccFundamentals,
  'cli-first-project': ccCliFirstProject,
  'context-engineering': ccContextEngineering,
  'coding-agent': ccCodingAgent,
  'advanced-workflow': ccAdvancedWorkflow,
  'skills-commands-hooks': ccSkillsCommandsHooks,
  mcp: ccMcp,
  subagents: ccSubagents,
  'real-world-project': ccRealWorldProject,
  production: ccProduction,
};

export function getCcClass(slug: string): LessonData | undefined {
  return ccRegistry[slug];
}

export function hasCcClass(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(ccRegistry, slug);
}

/** Written class slugs, in course order. */
export const ccWrittenSlugs = Object.keys(ccRegistry);
