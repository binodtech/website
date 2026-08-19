/** AI & ML curriculum — original BinodTech courses (all unlocked) */
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

export const aiCourses: AiCourse[] = [
  {
    "slug": "genai-foundations",
    "title": "Generative AI Foundations",
    "badge": "Top Pick",
    "level": "Beginner",
    "duration": "10h",
    "icon": "Sparkles",
    "blurb": "Mental models for GenAI: transformers, foundation models, prompting, evals, multimodal, and responsible use.",
    "tip": "Build the mental model before chasing tools — architecture clarity compounds.",
    "lessons": [
      {
        "slug": "what-is-generative-ai",
        "title": "What Is Generative AI?"
      },
      {
        "slug": "why-genai-matters-now",
        "title": "Why GenAI Matters for Engineers"
      },
      {
        "slug": "nlp-to-transformers",
        "title": "From NLP Pipelines to Transformers"
      },
      {
        "slug": "attention-and-context",
        "title": "Attention, Context Windows & Memory"
      },
      {
        "slug": "pretraining-and-objectives",
        "title": "Pretraining Objectives Explained"
      },
      {
        "slug": "foundation-models",
        "title": "Foundation Models: Capabilities & Limits"
      },
      {
        "slug": "tokenization-and-embeddings",
        "title": "Tokenization & Embeddings"
      },
      {
        "slug": "prompting-that-works",
        "title": "Prompting That Works in Production"
      },
      {
        "slug": "fine-tuning-vs-rag",
        "title": "Fine-Tuning vs RAG: Decision Framework"
      },
      {
        "slug": "evals-and-quality",
        "title": "Evals, Quality Bars & Failure Modes"
      },
      {
        "slug": "multimodal-basics",
        "title": "Multimodal GenAI Basics"
      },
      {
        "slug": "ethics-and-governance",
        "title": "Ethics, Safety & Governance"
      },
      {
        "slug": "genai-career-map",
        "title": "Career Map: Builder vs Operator vs Leader"
      }
    ]
  },
  {
    "slug": "mcp-essentials",
    "title": "MCP Essentials for AI Agents",
    "level": "Intermediate",
    "duration": "2h",
    "icon": "Plug",
    "blurb": "Model Context Protocol from first principles: hosts, clients, servers, tools, resources, prompts, and safe deployment.",
    "tip": "Treat MCP as a contract layer — discoverability beats brittle one-off tool wrappers.",
    "lessons": [
      {
        "slug": "why-agents-need-protocols",
        "title": "Why Agentic Systems Need a Protocol"
      },
      {
        "slug": "llm-to-agent-jump",
        "title": "From LLM Chat to Tool-Using Agents"
      },
      {
        "slug": "mcp-architecture",
        "title": "MCP Architecture: Host, Client, Server"
      },
      {
        "slug": "build-first-mcp-server",
        "title": "Build Your First MCP Server"
      },
      {
        "slug": "wire-an-mcp-client",
        "title": "Wire an MCP Client"
      },
      {
        "slug": "tools-resources-prompts",
        "title": "Tools, Resources & Prompt Templates"
      },
      {
        "slug": "discovery-and-schemas",
        "title": "Discovery, Schemas & Versioning"
      },
      {
        "slug": "security-basics-mcp",
        "title": "Security Basics for MCP"
      },
      {
        "slug": "single-server-to-ecosystem",
        "title": "From One Server to an Agent Ecosystem"
      }
    ]
  },
  {
    "slug": "advanced-mcp",
    "title": "Advanced MCP: Multi-Tool Agent Platforms",
    "badge": "Advanced",
    "level": "Advanced",
    "duration": "7h",
    "icon": "Network",
    "blurb": "Multi-server agents, observability, retrieval tools, orchestration patterns, and production hardening for MCP.",
    "tip": "Design tool boundaries like microservice APIs — clear contracts, least privilege, measurable SLOs.",
    "lessons": [
      {
        "slug": "multi-server-topology",
        "title": "Multi-Server Topology Patterns"
      },
      {
        "slug": "tool-routing-policies",
        "title": "Tool Routing & Policy Layers"
      },
      {
        "slug": "observability-for-agents",
        "title": "Observability for Agent Tool Calls"
      },
      {
        "slug": "retrieval-as-mcp-tools",
        "title": "Retrieval & Knowledge as MCP Tools"
      },
      {
        "slug": "human-in-the-loop",
        "title": "Human-in-the-Loop & Approvals"
      },
      {
        "slug": "failure-and-retries",
        "title": "Failures, Retries & Idempotent Tools"
      },
      {
        "slug": "image-research-assistant",
        "title": "Capstone: Research Assistant Agent"
      },
      {
        "slug": "prod-checklist-mcp",
        "title": "Production Checklist for MCP"
      }
    ]
  },
  {
    "slug": "n8n-workflows",
    "title": "Automate with n8n: AI Workflows",
    "badge": "Trending",
    "level": "Intermediate",
    "duration": "2h",
    "icon": "Workflow",
    "blurb": "Event-driven automation: triggers, expressions, branching, Code nodes, APIs, AI agents, RAG, and production deploy.",
    "tip": "Start with a reliable trigger + one happy path, then add AI — never the reverse.",
    "lessons": [
      {
        "slug": "developer-automation-mindset",
        "title": "Developer Automation Mindset"
      },
      {
        "slug": "first-github-automation",
        "title": "First Automation: GitHub Issues"
      },
      {
        "slug": "triggers-and-webhooks",
        "title": "Triggers & Webhooks"
      },
      {
        "slug": "expressions-and-data",
        "title": "Dynamic Expressions & Data Flow"
      },
      {
        "slug": "branching-logic",
        "title": "Branching & Intelligent Routing"
      },
      {
        "slug": "code-node-power",
        "title": "Code Node: When Nodes Are Not Enough"
      },
      {
        "slug": "api-integrations",
        "title": "API Integrations & Error Handling"
      },
      {
        "slug": "ai-agents-in-n8n",
        "title": "AI Agents & LLMs inside n8n"
      },
      {
        "slug": "rag-in-workflows",
        "title": "RAG Knowledge Bases in Workflows"
      },
      {
        "slug": "mcp-from-n8n",
        "title": "Consuming MCP Tools from Workflows"
      },
      {
        "slug": "deploy-secure-n8n",
        "title": "Deploy Securely & Scale"
      }
    ]
  },
  {
    "slug": "claude-code-studio",
    "title": "Claude Code Studio: Workflows & Tools",
    "level": "Intermediate",
    "duration": "4h",
    "icon": "Terminal",
    "blurb": "Conversation-driven engineering with Claude Code: context, commands, sub-agents, hooks, MCP, and GitHub workflows.",
    "tip": "Plan in chat, execute in small diffs, verify with tests — treat the agent like a junior teammate with guardrails.",
    "lessons": [
      {
        "slug": "claude-code-overview",
        "title": "Claude Code Overview & Limits"
      },
      {
        "slug": "install-and-secure-setup",
        "title": "Install & Secure Setup"
      },
      {
        "slug": "conversation-driven-dev",
        "title": "Conversation-Driven Development"
      },
      {
        "slug": "context-and-project-memory",
        "title": "Context Management & Project Memory"
      },
      {
        "slug": "planning-large-changes",
        "title": "Planning Large Changes Safely"
      },
      {
        "slug": "custom-commands-skills",
        "title": "Custom Commands & Skills"
      },
      {
        "slug": "subagents-orchestration",
        "title": "Sub-Agents & Internal Orchestration"
      },
      {
        "slug": "hooks-and-guardrails",
        "title": "Hooks, Guardrails & Safety"
      },
      {
        "slug": "mcp-with-claude-code",
        "title": "MCP Integrations with Claude Code"
      },
      {
        "slug": "github-pr-workflows",
        "title": "GitHub & PR Workflows"
      },
      {
        "slug": "team-playbook-claude",
        "title": "Team Playbook & Best Practices"
      }
    ]
  },
  {
    "slug": "cursor-ide-mastery",
    "title": "Cursor IDE Mastery",
    "level": "Beginner",
    "duration": "3h",
    "icon": "Laptop",
    "blurb": "Ship faster with Cursor: Composer, chat, rules, codebase indexing, refactors, tests, and agentic editing habits.",
    "tip": "Write crisp rules + acceptance criteria; vague prompts create vague diffs.",
    "lessons": [
      {
        "slug": "cursor-mental-model",
        "title": "Cursor Mental Model"
      },
      {
        "slug": "chat-vs-composer",
        "title": "Chat vs Composer vs Inline Edit"
      },
      {
        "slug": "rules-and-project-context",
        "title": "Rules, Docs & Project Context"
      },
      {
        "slug": "codebase-aware-refactors",
        "title": "Codebase-Aware Refactors"
      },
      {
        "slug": "tests-and-verification",
        "title": "Tests & Verification Loops"
      },
      {
        "slug": "debugging-with-agents",
        "title": "Debugging With Agents"
      },
      {
        "slug": "multi-file-features",
        "title": "Shipping Multi-File Features"
      },
      {
        "slug": "prompt-patterns-cursor",
        "title": "High-Leverage Prompt Patterns"
      },
      {
        "slug": "pitfalls-and-hallucinations",
        "title": "Pitfalls & Hallucinated APIs"
      }
    ]
  },
  {
    "slug": "cursor-enterprise",
    "title": "Cursor for Enterprise Teams",
    "level": "Advanced",
    "duration": "5h",
    "icon": "Building2",
    "blurb": "Modernize engineering orgs with Cursor: standards, security, privacy, review culture, metrics, and rollout playbooks.",
    "tip": "Measure cycle time and defect rate — AI tooling without governance becomes shadow IT.",
    "lessons": [
      {
        "slug": "enterprise-readiness",
        "title": "Enterprise Readiness Assessment"
      },
      {
        "slug": "security-privacy-model",
        "title": "Security & Privacy Model"
      },
      {
        "slug": "org-rules-and-standards",
        "title": "Org Rules, Templates & Standards"
      },
      {
        "slug": "code-review-in-ai-era",
        "title": "Code Review in the AI Era"
      },
      {
        "slug": "onboarding-playbook",
        "title": "Team Onboarding Playbook"
      },
      {
        "slug": "metrics-that-matter",
        "title": "Metrics That Matter"
      },
      {
        "slug": "legacy-modernization",
        "title": "Legacy Modernization Patterns"
      },
      {
        "slug": "compliance-and-audit",
        "title": "Compliance & Audit Trails"
      },
      {
        "slug": "rollout-roadmap",
        "title": "90-Day Rollout Roadmap"
      }
    ]
  },
  {
    "slug": "pro-ai-ide",
    "title": "Pro AI IDE: Agent Coding at Scale",
    "badge": "Top Pick",
    "level": "Advanced",
    "duration": "4h",
    "icon": "Rocket",
    "blurb": "Power-user AI IDE workflows: multi-agent cascades, repo-wide tasks, eval harnesses, and professional delivery habits.",
    "tip": "Orchestrate agents by phase (explore → plan → implement → verify) instead of one mega-prompt.",
    "lessons": [
      {
        "slug": "ai-ide-landscape",
        "title": "AI IDE Landscape & Trade-offs"
      },
      {
        "slug": "agent-cascades",
        "title": "Agent Cascades & Task Graphs"
      },
      {
        "slug": "repo-wide-migrations",
        "title": "Repo-Wide Migrations Safely"
      },
      {
        "slug": "spec-driven-agents",
        "title": "Spec-Driven Agent Sessions"
      },
      {
        "slug": "eval-harness-local",
        "title": "Local Eval Harnesses"
      },
      {
        "slug": "pairing-humans-agents",
        "title": "Pairing Humans With Agents"
      },
      {
        "slug": "delivery-checklist-ide",
        "title": "Professional Delivery Checklist"
      }
    ]
  },
  {
    "slug": "langchain-llm-apps",
    "title": "Building LLM Apps with LangChain",
    "level": "Intermediate",
    "duration": "4h",
    "icon": "Link2",
    "blurb": "Chains, retrieval, agents, memory, evals, and production patterns for LLM applications.",
    "tip": "Prefer simple runnable graphs you can observe — complexity without tracing is debt.",
    "lessons": [
      {
        "slug": "langchain-when-to-use",
        "title": "When LangChain Helps (and When Not)"
      },
      {
        "slug": "runnables-and-graphs",
        "title": "Runnables, LCEL & Graphs"
      },
      {
        "slug": "rag-pipeline-design",
        "title": "RAG Pipeline Design"
      },
      {
        "slug": "agents-and-tools-lc",
        "title": "Agents & Tools"
      },
      {
        "slug": "memory-and-state",
        "title": "Memory & Stateful Conversations"
      },
      {
        "slug": "evals-tracing",
        "title": "Evals, Tracing & Observability"
      },
      {
        "slug": "production-hardening-lc",
        "title": "Production Hardening"
      }
    ]
  },
  {
    "slug": "llama-stack-path",
    "title": "Llama Stack Path: Build to Deploy",
    "level": "Intermediate",
    "duration": "5h",
    "icon": "Boxes",
    "blurb": "From local Llama experimentation to stack components, APIs, safety, and deployment patterns.",
    "tip": "Validate quality on your domain data before optimizing inference cost.",
    "lessons": [
      {
        "slug": "llama-ecosystem-map",
        "title": "Llama Ecosystem Map"
      },
      {
        "slug": "local-inference-setup",
        "title": "Local Inference Setup"
      },
      {
        "slug": "stack-components",
        "title": "Stack Components & APIs"
      },
      {
        "slug": "safety-and-guardrails-llama",
        "title": "Safety & Guardrails"
      },
      {
        "slug": "serving-and-scaling",
        "title": "Serving & Scaling"
      },
      {
        "slug": "evaluation-loop",
        "title": "Evaluation Loop"
      },
      {
        "slug": "deploy-checklist-llama",
        "title": "Deploy Checklist"
      }
    ]
  },
  {
    "slug": "agentic-system-design",
    "title": "Agentic System Design",
    "level": "Advanced",
    "duration": "6h",
    "icon": "Cpu",
    "blurb": "Design production agent systems: planners, tools, memory, evals, multi-agent protocols, and reliability.",
    "tip": "Agents fail loudly in production — design for observability and bounded autonomy first.",
    "lessons": [
      {
        "slug": "agent-loop-anatomy",
        "title": "Anatomy of an Agent Loop"
      },
      {
        "slug": "planner-executor-patterns",
        "title": "Planner / Executor Patterns"
      },
      {
        "slug": "memory-architectures",
        "title": "Memory Architectures"
      },
      {
        "slug": "tooling-contracts",
        "title": "Tooling Contracts & Side Effects"
      },
      {
        "slug": "multi-agent-collaboration",
        "title": "Multi-Agent Collaboration"
      },
      {
        "slug": "reliability-and-evals",
        "title": "Reliability, Evals & Guardrails"
      },
      {
        "slug": "cost-latency-tradeoffs",
        "title": "Cost / Latency Trade-offs"
      },
      {
        "slug": "reference-architectures",
        "title": "Reference Architectures"
      }
    ]
  }
];

export const aiLessonCount = 99;
