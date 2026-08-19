#!/usr/bin/env node
/**
 * Generates AI & ML curriculum for binodtech.com
 * Original course names + lessons (inspired by industry topics, not copied).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../src/data/ai-ml');

/** @typedef {{ slug: string, title: string, minutes?: number }} LessonMeta */
/** @typedef {{ slug: string, title: string, badge?: string, level: string, duration: string, icon: string, blurb: string, tip: string, lessons: LessonMeta[] }} Course */

/** @type {Course[]} */
const courses = [
  {
    slug: 'genai-foundations',
    title: 'Generative AI Foundations',
    badge: 'Top Pick',
    level: 'Beginner',
    duration: '10h',
    icon: 'Sparkles',
    blurb: 'Mental models for GenAI: transformers, foundation models, prompting, evals, multimodal, and responsible use.',
    tip: 'Build the mental model before chasing tools — architecture clarity compounds.',
    lessons: [
      { slug: 'what-is-generative-ai', title: 'What Is Generative AI?' },
      { slug: 'why-genai-matters-now', title: 'Why GenAI Matters for Engineers' },
      { slug: 'nlp-to-transformers', title: 'From NLP Pipelines to Transformers' },
      { slug: 'attention-and-context', title: 'Attention, Context Windows & Memory' },
      { slug: 'pretraining-and-objectives', title: 'Pretraining Objectives Explained' },
      { slug: 'foundation-models', title: 'Foundation Models: Capabilities & Limits' },
      { slug: 'tokenization-and-embeddings', title: 'Tokenization & Embeddings' },
      { slug: 'prompting-that-works', title: 'Prompting That Works in Production' },
      { slug: 'fine-tuning-vs-rag', title: 'Fine-Tuning vs RAG: Decision Framework' },
      { slug: 'evals-and-quality', title: 'Evals, Quality Bars & Failure Modes' },
      { slug: 'multimodal-basics', title: 'Multimodal GenAI Basics' },
      { slug: 'ethics-and-governance', title: 'Ethics, Safety & Governance' },
      { slug: 'genai-career-map', title: 'Career Map: Builder vs Operator vs Leader' },
    ],
  },
  {
    slug: 'mcp-essentials',
    title: 'MCP Essentials for AI Agents',
    level: 'Intermediate',
    duration: '2h',
    icon: 'Plug',
    blurb: 'Model Context Protocol from first principles: hosts, clients, servers, tools, resources, prompts, and safe deployment.',
    tip: 'Treat MCP as a contract layer — discoverability beats brittle one-off tool wrappers.',
    lessons: [
      { slug: 'why-agents-need-protocols', title: 'Why Agentic Systems Need a Protocol' },
      { slug: 'llm-to-agent-jump', title: 'From LLM Chat to Tool-Using Agents' },
      { slug: 'mcp-architecture', title: 'MCP Architecture: Host, Client, Server' },
      { slug: 'build-first-mcp-server', title: 'Build Your First MCP Server' },
      { slug: 'wire-an-mcp-client', title: 'Wire an MCP Client' },
      { slug: 'tools-resources-prompts', title: 'Tools, Resources & Prompt Templates' },
      { slug: 'discovery-and-schemas', title: 'Discovery, Schemas & Versioning' },
      { slug: 'security-basics-mcp', title: 'Security Basics for MCP' },
      { slug: 'single-server-to-ecosystem', title: 'From One Server to an Agent Ecosystem' },
    ],
  },
  {
    slug: 'advanced-mcp',
    title: 'Advanced MCP: Multi-Tool Agent Platforms',
    badge: 'Advanced',
    level: 'Advanced',
    duration: '7h',
    icon: 'Network',
    blurb: 'Multi-server agents, observability, retrieval tools, orchestration patterns, and production hardening for MCP.',
    tip: 'Design tool boundaries like microservice APIs — clear contracts, least privilege, measurable SLOs.',
    lessons: [
      { slug: 'multi-server-topology', title: 'Multi-Server Topology Patterns' },
      { slug: 'tool-routing-policies', title: 'Tool Routing & Policy Layers' },
      { slug: 'observability-for-agents', title: 'Observability for Agent Tool Calls' },
      { slug: 'retrieval-as-mcp-tools', title: 'Retrieval & Knowledge as MCP Tools' },
      { slug: 'human-in-the-loop', title: 'Human-in-the-Loop & Approvals' },
      { slug: 'failure-and-retries', title: 'Failures, Retries & Idempotent Tools' },
      { slug: 'image-research-assistant', title: 'Capstone: Research Assistant Agent' },
      { slug: 'prod-checklist-mcp', title: 'Production Checklist for MCP' },
    ],
  },
  {
    slug: 'n8n-workflows',
    title: 'Automate with n8n: AI Workflows',
    badge: 'Trending',
    level: 'Intermediate',
    duration: '2h',
    icon: 'Workflow',
    blurb: 'Event-driven automation: triggers, expressions, branching, Code nodes, APIs, AI agents, RAG, and production deploy.',
    tip: 'Start with a reliable trigger + one happy path, then add AI — never the reverse.',
    lessons: [
      { slug: 'developer-automation-mindset', title: 'Developer Automation Mindset' },
      { slug: 'first-github-automation', title: 'First Automation: GitHub Issues' },
      { slug: 'triggers-and-webhooks', title: 'Triggers & Webhooks' },
      { slug: 'expressions-and-data', title: 'Dynamic Expressions & Data Flow' },
      { slug: 'branching-logic', title: 'Branching & Intelligent Routing' },
      { slug: 'code-node-power', title: 'Code Node: When Nodes Are Not Enough' },
      { slug: 'api-integrations', title: 'API Integrations & Error Handling' },
      { slug: 'ai-agents-in-n8n', title: 'AI Agents & LLMs inside n8n' },
      { slug: 'rag-in-workflows', title: 'RAG Knowledge Bases in Workflows' },
      { slug: 'mcp-from-n8n', title: 'Consuming MCP Tools from Workflows' },
      { slug: 'deploy-secure-n8n', title: 'Deploy Securely & Scale' },
    ],
  },
  {
    slug: 'claude-code-studio',
    title: 'Claude Code Studio: Workflows & Tools',
    level: 'Intermediate',
    duration: '4h',
    icon: 'Terminal',
    blurb: 'Conversation-driven engineering with Claude Code: context, commands, sub-agents, hooks, MCP, and GitHub workflows.',
    tip: 'Plan in chat, execute in small diffs, verify with tests — treat the agent like a junior teammate with guardrails.',
    lessons: [
      { slug: 'claude-code-overview', title: 'Claude Code Overview & Limits' },
      { slug: 'install-and-secure-setup', title: 'Install & Secure Setup' },
      { slug: 'conversation-driven-dev', title: 'Conversation-Driven Development' },
      { slug: 'context-and-project-memory', title: 'Context Management & Project Memory' },
      { slug: 'planning-large-changes', title: 'Planning Large Changes Safely' },
      { slug: 'custom-commands-skills', title: 'Custom Commands & Skills' },
      { slug: 'subagents-orchestration', title: 'Sub-Agents & Internal Orchestration' },
      { slug: 'hooks-and-guardrails', title: 'Hooks, Guardrails & Safety' },
      { slug: 'mcp-with-claude-code', title: 'MCP Integrations with Claude Code' },
      { slug: 'github-pr-workflows', title: 'GitHub & PR Workflows' },
      { slug: 'team-playbook-claude', title: 'Team Playbook & Best Practices' },
    ],
  },
  {
    slug: 'cursor-ide-mastery',
    title: 'Cursor IDE Mastery',
    level: 'Beginner',
    duration: '3h',
    icon: 'Laptop',
    blurb: 'Ship faster with Cursor: Composer, chat, rules, codebase indexing, refactors, tests, and agentic editing habits.',
    tip: 'Write crisp rules + acceptance criteria; vague prompts create vague diffs.',
    lessons: [
      { slug: 'cursor-mental-model', title: 'Cursor Mental Model' },
      { slug: 'chat-vs-composer', title: 'Chat vs Composer vs Inline Edit' },
      { slug: 'rules-and-project-context', title: 'Rules, Docs & Project Context' },
      { slug: 'codebase-aware-refactors', title: 'Codebase-Aware Refactors' },
      { slug: 'tests-and-verification', title: 'Tests & Verification Loops' },
      { slug: 'debugging-with-agents', title: 'Debugging With Agents' },
      { slug: 'multi-file-features', title: 'Shipping Multi-File Features' },
      { slug: 'prompt-patterns-cursor', title: 'High-Leverage Prompt Patterns' },
      { slug: 'pitfalls-and-hallucinations', title: 'Pitfalls & Hallucinated APIs' },
    ],
  },
  {
    slug: 'cursor-enterprise',
    title: 'Cursor for Enterprise Teams',
    level: 'Advanced',
    duration: '5h',
    icon: 'Building2',
    blurb: 'Modernize engineering orgs with Cursor: standards, security, privacy, review culture, metrics, and rollout playbooks.',
    tip: 'Measure cycle time and defect rate — AI tooling without governance becomes shadow IT.',
    lessons: [
      { slug: 'enterprise-readiness', title: 'Enterprise Readiness Assessment' },
      { slug: 'security-privacy-model', title: 'Security & Privacy Model' },
      { slug: 'org-rules-and-standards', title: 'Org Rules, Templates & Standards' },
      { slug: 'code-review-in-ai-era', title: 'Code Review in the AI Era' },
      { slug: 'onboarding-playbook', title: 'Team Onboarding Playbook' },
      { slug: 'metrics-that-matter', title: 'Metrics That Matter' },
      { slug: 'legacy-modernization', title: 'Legacy Modernization Patterns' },
      { slug: 'compliance-and-audit', title: 'Compliance & Audit Trails' },
      { slug: 'rollout-roadmap', title: '90-Day Rollout Roadmap' },
    ],
  },
  {
    slug: 'pro-ai-ide',
    title: 'Pro AI IDE: Agent Coding at Scale',
    badge: 'Top Pick',
    level: 'Advanced',
    duration: '4h',
    icon: 'Rocket',
    blurb: 'Power-user AI IDE workflows: multi-agent cascades, repo-wide tasks, eval harnesses, and professional delivery habits.',
    tip: 'Orchestrate agents by phase (explore → plan → implement → verify) instead of one mega-prompt.',
    lessons: [
      { slug: 'ai-ide-landscape', title: 'AI IDE Landscape & Trade-offs' },
      { slug: 'agent-cascades', title: 'Agent Cascades & Task Graphs' },
      { slug: 'repo-wide-migrations', title: 'Repo-Wide Migrations Safely' },
      { slug: 'spec-driven-agents', title: 'Spec-Driven Agent Sessions' },
      { slug: 'eval-harness-local', title: 'Local Eval Harnesses' },
      { slug: 'pairing-humans-agents', title: 'Pairing Humans With Agents' },
      { slug: 'delivery-checklist-ide', title: 'Professional Delivery Checklist' },
    ],
  },
  {
    slug: 'langchain-llm-apps',
    title: 'Building LLM Apps with LangChain',
    level: 'Intermediate',
    duration: '4h',
    icon: 'Link2',
    blurb: 'Chains, retrieval, agents, memory, evals, and production patterns for LLM applications.',
    tip: 'Prefer simple runnable graphs you can observe — complexity without tracing is debt.',
    lessons: [
      { slug: 'langchain-when-to-use', title: 'When LangChain Helps (and When Not)' },
      { slug: 'runnables-and-graphs', title: 'Runnables, LCEL & Graphs' },
      { slug: 'rag-pipeline-design', title: 'RAG Pipeline Design' },
      { slug: 'agents-and-tools-lc', title: 'Agents & Tools' },
      { slug: 'memory-and-state', title: 'Memory & Stateful Conversations' },
      { slug: 'evals-tracing', title: 'Evals, Tracing & Observability' },
      { slug: 'production-hardening-lc', title: 'Production Hardening' },
    ],
  },
  {
    slug: 'llama-stack-path',
    title: 'Llama Stack Path: Build to Deploy',
    level: 'Intermediate',
    duration: '5h',
    icon: 'Boxes',
    blurb: 'From local Llama experimentation to stack components, APIs, safety, and deployment patterns.',
    tip: 'Validate quality on your domain data before optimizing inference cost.',
    lessons: [
      { slug: 'llama-ecosystem-map', title: 'Llama Ecosystem Map' },
      { slug: 'local-inference-setup', title: 'Local Inference Setup' },
      { slug: 'stack-components', title: 'Stack Components & APIs' },
      { slug: 'safety-and-guardrails-llama', title: 'Safety & Guardrails' },
      { slug: 'serving-and-scaling', title: 'Serving & Scaling' },
      { slug: 'evaluation-loop', title: 'Evaluation Loop' },
      { slug: 'deploy-checklist-llama', title: 'Deploy Checklist' },
    ],
  },
  {
    slug: 'agentic-system-design',
    title: 'Agentic System Design',
    level: 'Advanced',
    duration: '6h',
    icon: 'Cpu',
    blurb: 'Design production agent systems: planners, tools, memory, evals, multi-agent protocols, and reliability.',
    tip: 'Agents fail loudly in production — design for observability and bounded autonomy first.',
    lessons: [
      { slug: 'agent-loop-anatomy', title: 'Anatomy of an Agent Loop' },
      { slug: 'planner-executor-patterns', title: 'Planner / Executor Patterns' },
      { slug: 'memory-architectures', title: 'Memory Architectures' },
      { slug: 'tooling-contracts', title: 'Tooling Contracts & Side Effects' },
      { slug: 'multi-agent-collaboration', title: 'Multi-Agent Collaboration' },
      { slug: 'reliability-and-evals', title: 'Reliability, Evals & Guardrails' },
      { slug: 'cost-latency-tradeoffs', title: 'Cost / Latency Trade-offs' },
      { slug: 'reference-architectures', title: 'Reference Architectures' },
    ],
  },
];

/** Curated deeper lessons (original) */
const DEEP = {
  'what-is-generative-ai': {
    summary: 'Generative AI creates new content by modeling probability over tokens, pixels, or audio — not by retrieving a single stored answer.',
    what: 'Systems that sample from a learned distribution to produce novel text, code, images, or multimodal outputs conditioned on a prompt/context.',
    why: 'Almost every modern product surface — search, support, coding, analytics — is being rebuilt with generative interfaces.',
    how: '1. Separate “understanding” (embeddings/retrieval) from “generation” (decoding).\n2. Treat prompts as programs with constraints.\n3. Always attach evals for faithfulness and safety.',
    tip: 'If you cannot name the failure mode, you do not understand the model yet.',
    keyTakeaways: [
      'Generation ≠ search; hallucinations are distributional, not bugs alone.',
      'Context + tools beat bigger prompts for enterprise tasks.',
      'Evals are part of the product, not homework.',
    ],
  },
  'mcp-architecture': {
    summary: 'MCP standardizes how hosts/clients talk to servers that expose tools, resources, and prompts — so agents can discover capabilities dynamically.',
    what: 'A protocol with clear roles: Host (app), Client (connector), Server (capability provider).',
    why: 'Ad-hoc tool APIs do not scale across IDEs, agents, and automation runtimes; a shared contract does.',
    how: '1. Expose tools with JSON schemas.\n2. Advertise resources/prompts.\n3. Let the client discover and invoke safely.\n4. Log every call.',
    tip: 'Design servers like public APIs: versioning, auth, and least privilege.',
    failure: 'Over-privileged tools with no approval gate for destructive actions.',
  },
  'build-first-mcp-server': {
    summary: 'Stand up a minimal MCP server that exposes one safe tool and one resource, then verify discovery from a client.',
    what: 'A small server process implementing the MCP surface your client expects.',
    why: 'Reading docs is not the same as shipping a discoverable tool boundary.',
    how: '1. Scaffold server.\n2. Define tool schema.\n3. Implement handler with validation.\n4. Connect client and call end-to-end.\n5. Add logging.',
    practicePrompt: 'Build a read-only “repo stats” tool and refuse any write action.',
  },
  'prompting-that-works': {
    summary: 'Production prompting is specification writing: role, constraints, output schema, examples, and stop conditions.',
    what: 'A disciplined way to steer models with structure rather than vibes.',
    why: 'Vague prompts create non-deterministic product behavior and un-reviewable diffs.',
    how: '1. State goal + non-goals.\n2. Provide schema.\n3. Add 1–2 exemplar cases.\n4. Require uncertainty disclosure.\n5. Evaluate on a fixed set.',
    tip: 'Prefer JSON/schema outputs for anything that feeds software.',
  },
  'triggers-and-webhooks': {
    summary: 'Event-driven n8n workflows start from triggers/webhooks so automation reacts in real time instead of polling forever.',
    what: 'Entry nodes that fire when GitHub, HTTP, schedules, or apps emit events.',
    why: 'Polling wastes quota and delays action; webhooks keep latency low.',
    how: '1. Choose event source.\n2. Validate signatures.\n3. Dedupe deliveries.\n4. Enqueue work.\n5. Ack quickly.',
    tip: 'Always design for at-least-once webhook delivery.',
  },
  'ai-agents-in-n8n': {
    summary: 'Add LLM/agent nodes only after the workflow’s deterministic spine is solid — then bound tools and costs.',
    what: 'Using LLMs inside n8n for classification, drafting, or tool-using agents.',
    why: 'Automation becomes adaptive, but also non-deterministic and more expensive.',
    how: '1. Keep a deterministic backbone.\n2. Isolate AI nodes.\n3. Constrain tools.\n4. Log prompts/outputs.\n5. Add human approval for risky paths.',
  },
  'conversation-driven-dev': {
    summary: 'Treat coding as a structured dialogue: explore → plan → implement → verify, with small diffs and explicit acceptance checks.',
    what: 'A workflow where Claude Code (or similar) collaborates through turns instead of one-shot generation.',
    why: 'Large one-shot edits create unreviewable changes and subtle regressions.',
    how: '1. Ask for a plan.\n2. Approve scope.\n3. Implement in slices.\n4. Run tests.\n5. Summarize risks.',
    tip: 'Never skip the plan turn on non-trivial work.',
  },
  'chat-vs-composer': {
    summary: 'Use chat for reasoning and discovery, Composer for multi-file edits, and inline edit for surgical fixes.',
    what: 'Three interaction modes in Cursor with different blast radii.',
    why: 'Wrong mode wastes context and creates risky diffs.',
    how: '1. Chat to understand.\n2. Composer to implement across files.\n3. Inline for local tweaks.\n4. Always run tests after.',
  },
  'security-privacy-model': {
    summary: 'Enterprise AI IDE adoption hinges on data handling, secrets, repo access, and auditability — not model brand names.',
    what: 'A clear threat model for code assistants in regulated orgs.',
    why: 'One leaked secret or customer snippet can halt an entire rollout.',
    how: '1. Classify data.\n2. Configure retention/training policies.\n3. Secret scanning.\n4. Restrict high-risk repos.\n5. Audit agent actions.',
  },
  'agent-loop-anatomy': {
    summary: 'An agent loop is observe → reason → act → observe, with budgets, tools, and stop conditions.',
    what: 'The control loop behind autonomous or semi-autonomous AI systems.',
    why: 'Without a loop design, “agents” are just chat with extra steps.',
    how: '1. Define observations.\n2. Bound reasoning.\n3. Gate tools.\n4. Cap steps/cost.\n5. Evaluate trajectories.',
  },
  'fine-tuning-vs-rag': {
    summary: 'RAG injects fresh knowledge at request time; fine-tuning changes model behavior. Most enterprise apps should try RAG first.',
    what: 'A decision framework between retrieval grounding and weight updates.',
    why: 'Fine-tuning is slower/costlier and goes stale; RAG is operable when docs change weekly.',
    how: '1. If facts change often → RAG.\n2. If style/format/skills → consider SFT/LoRA.\n3. Often combine both later.',
  },
};

function lessonBody(course, lesson, index) {
  const n = index + 1;
  const title = lesson.title;
  const courseTitle = course.title;

  const what = `${title} is a practical building block inside ${courseTitle}. You will leave with a clear definition, a decision framework, and a concrete way to apply it in real systems.`;
  const why = `Teams that skip this lesson usually misuse tools, over-prompt, or ship agents that cannot be debugged. Mastering ${title} raises both speed and reliability.`;
  const how = `1. Restate the problem in one sentence.\n2. Map where ${title} sits in the stack (model, data, tools, UI, or ops).\n3. Apply a minimal working pattern.\n4. Add measurement (quality, cost, latency, or risk).\n5. Compare one simpler alternative.`;
  const whereToUse = [
    `Day-to-day work in ${courseTitle}`,
    'Production GenAI / agent features',
    'Interview explanations and design reviews',
  ];
  const impact = `Done well, ${title} reduces rework and makes AI behavior inspectable. Done poorly, it creates silent failures and unbounded cost.`;
  const alternatives = [
    'A simpler manual workflow if volume is low',
    'A managed platform feature instead of custom glue',
    'A narrower scoped MVP before full automation',
  ];
  const useCases = [
    `Implementing ${title} in an internal tool`,
    `Explaining ${title} in an AI engineering interview`,
    'Teaching teammates a shared vocabulary',
  ];

  const explain = `## What
${what}

## Why it matters
${why}

## How to do it
${how}

## Where to use
1. ${whereToUse[0]}
2. ${whereToUse[1]}
3. ${whereToUse[2]}

## Impact
${impact}

## Alternatives
1. ${alternatives[0]}
2. ${alternatives[1]}
3. ${alternatives[2]}

## Use cases
1. ${useCases[0]}
2. ${useCases[1]}
3. ${useCases[2]}

## Expert playbook
1. Prefer measurable outcomes over vibe-based prompting.
2. Keep a human-readable trace of model + tool steps.
3. Bound autonomy: allowlists, budgets, and approval gates for irreversible actions.
4. Write the failure story first (timeouts, bad retrieval, tool errors).
5. Ship a thin vertical slice, then deepen.

## Mini exercise
Design a one-page note: goal, inputs, outputs, risks, and success metric for applying **${title}** this week.`;

  const deepBits = DEEP[lesson.slug];
  return {
    slug: lesson.slug,
    title,
    courseSlug: course.slug,
    order: n,
    level: course.level,
    summary: deepBits?.summary ?? `${title} — practical lesson inside ${courseTitle}.`,
    what: deepBits?.what ?? what,
    why: deepBits?.why ?? why,
    how: deepBits?.how ?? how,
    whereToUse: deepBits?.whereToUse ?? whereToUse,
    impact: deepBits?.impact ?? impact,
    alternatives: deepBits?.alternatives ?? alternatives,
    useCases: deepBits?.useCases ?? useCases,
    explain: deepBits?.explain ?? explain,
    keyTakeaways: deepBits?.keyTakeaways ?? [
      `You can explain ${title} without buzzwords.`,
      'You know when NOT to use it.',
      'You have a measurable success criterion.',
    ],
    interviewerQA: deepBits?.interviewerQA ?? [
      {
        q: `Explain ${title} to a staff engineer in 60 seconds.`,
        a: `${title} is the technique/layer that lets us ${lesson.slug.includes('mcp') ? 'connect models to tools safely via a standard protocol' : 'get reliable GenAI outcomes under real constraints'}. The key trade-off is capability vs control/cost.`,
      },
      {
        q: 'What would you measure after shipping this?',
        a: 'Task success rate, p95 latency, cost per successful run, and human escalation rate. For agents, also tool-error rate and policy violations.',
      },
      {
        q: 'What is the most common failure mode?',
        a: deepBits?.failure ?? 'Unobserved behavior: no traces, no evals, and prompts that drift without regression tests.',
      },
    ],
    tip: deepBits?.tip ?? course.tip,
    practicePrompt:
      deepBits?.practicePrompt ??
      `Apply ${title}: write a short design (inputs → steps → outputs → risks) and list two eval cases.`,
  };
}

const lessons = [];
for (const course of courses) {
  course.lessons.forEach((lesson, i) => {
    lessons.push(lessonBody(course, lesson, i));
  });
}

const roadmapSrc = `/** AI & ML curriculum — original BinodTech courses (all unlocked) */
export type AiLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type AiLessonMeta = {
  slug: string;
  title: string;
  minutes?: number;
};

export type AiCourse = {
  slug: string;
  title: string;
  badge?: string;
  level: AiLevel;
  duration: string;
  icon: string;
  blurb: string;
  tip: string;
  lessons: AiLessonMeta[];
};

export const aiCourses: AiCourse[] = ${JSON.stringify(courses, null, 2)};

export const aiLessonCount = ${lessons.length};
`;

const lessonsSrc = `/** AI & ML lesson bodies — original professional content */
import type { AiLevel } from './roadmap';

export type AiQA = { q: string; a: string };

export type AiLesson = {
  slug: string;
  title: string;
  courseSlug: string;
  order: number;
  level: AiLevel;
  summary: string;
  what: string;
  why: string;
  how: string;
  whereToUse: string[];
  impact: string;
  alternatives: string[];
  useCases: string[];
  explain: string;
  keyTakeaways: string[];
  interviewerQA: AiQA[];
  tip: string;
  practicePrompt: string;
};

export const aiLessons: AiLesson[] = ${JSON.stringify(lessons, null, 2)};
`;

const indexSrc = `import { aiCourses } from './roadmap';
import { aiLessons, type AiLesson } from './lessons';

export type { AiLesson };
export { aiCourses, aiLessons };
export { aiLessonCount } from './roadmap';

export function getAiCourse(slug: string) {
  return aiCourses.find((c) => c.slug === slug);
}

export function getAiLesson(slug: string) {
  return aiLessons.find((l) => l.slug === slug);
}

export function aiLessonsForCourse(courseSlug: string) {
  return aiLessons.filter((l) => l.courseSlug === courseSlug);
}

export function getAiSelection(slug: string | null) {
  if (!slug) return { kind: 'intro' as const };
  const course = getAiCourse(slug);
  if (course) return { kind: 'course' as const, course };
  const lesson = getAiLesson(slug);
  if (lesson) return { kind: 'lesson' as const, lesson, course: getAiCourse(lesson.courseSlug) };
  return { kind: 'intro' as const };
}
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'roadmap.ts'), roadmapSrc);
fs.writeFileSync(path.join(outDir, 'lessons.ts'), lessonsSrc);
fs.writeFileSync(path.join(outDir, 'index.ts'), indexSrc);
console.log(`Wrote ${courses.length} courses · ${lessons.length} lessons → ${outDir}`);
