/** Study material catalog — all links stay on this domain */

export type Topic = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isFree: boolean;
};

export type Category = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
};

export const categories: Category[] = [
  {
    slug: 'modern-system-design',
    title: 'Modern System Design',
    description:
      'Zero to hero in 44 chapters — interview craft, preliminary concepts, non-functional characteristics, estimation, then every building block, then 20 real system designs from YouTube to AI code assistants.',
    icon: 'Layers',
    color: 'from-sky-500 to-indigo-600',
    topics: [
      // ---- Foundations -------------------------------------------------
      {
        slug: 'introduction',
        title: 'Introduction to Modern System Design',
        description:
          'What system design is, why every developer needs it regardless of interviews, and how this course is structured so the order you learn things in actually builds on itself.',
        duration: '1h 10m',
        lessons: 3,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'interview-prep',
        title: 'The System Design Interview',
        description:
          'How to prepare, the do\u2019s and don\u2019ts, the traps that sink strong engineers, an honest answer to \u201chow long will this take\u201d, and how to run mock interviews that are worth the hour.',
        duration: '1h 40m',
        lessons: 5,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'preliminary-concepts',
        title: 'Preliminary System Design Concepts',
        description:
          'The three things that make distributed systems hard: network abstractions and RPC, the full spectrum of consistency models, and the spectrum of failure models.',
        duration: '1h 45m',
        lessons: 3,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'non-functional-characteristics',
        title: 'Non-Functional System Characteristics',
        description:
          'Availability, reliability, scalability, maintainability and fault tolerance \u2014 defined precisely, measured properly, and turned into the requirements you state in an interview.',
        duration: '2h',
        lessons: 6,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'back-of-envelope',
        title: 'Back-of-the-Envelope Calculations',
        description:
          'The numbers every engineer should know by heart, how to put them in perspective, and worked resource estimations for servers, storage, bandwidth and memory.',
        duration: '1h 20m',
        lessons: 2,
        level: 'Beginner',
        isFree: true,
      },

      // ---- Building blocks ---------------------------------------------
      {
        slug: 'building-blocks',
        title: 'Introduction to Building Blocks',
        description:
          'The sixteen reusable components that every design problem is assembled from, and why learning them once beats memorising fifty architectures.',
        duration: '40 min',
        lessons: 1,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'dns',
        title: 'Domain Name System (DNS)',
        description: 'What DNS is, its hierarchy and caching layers, and how a name becomes an IP address.',
        duration: '55 min',
        lessons: 2,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'load-balancers',
        title: 'Load Balancers',
        description:
          'Why they exist, global versus local balancing, layer 4 versus layer 7, algorithms, health checks and how balancers avoid being the single point of failure.',
        duration: '1h 20m',
        lessons: 3,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'databases',
        title: 'Databases',
        description:
          'Relational versus non-relational, replication topologies, partitioning and sharding strategies, and the trade-offs that decide which you pick.',
        duration: '2h 10m',
        lessons: 5,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'key-value-store',
        title: 'Design a Key-Value Store',
        description:
          'Consistent hashing, replication and quorums, versioning with vector clocks, configurability, gossip-based failure detection and Merkle-tree repair.',
        duration: '2h 15m',
        lessons: 5,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'cdn',
        title: 'Content Delivery Network (CDN)',
        description:
          'Push versus pull, edge topology and request routing, cache hierarchies and eviction, invalidation, consistency, and how to evaluate a CDN design.',
        duration: '2h 20m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'sequencer',
        title: 'Sequencer: Unique ID Generation',
        description:
          'Why auto-increment fails at scale, UUIDs versus Snowflake-style IDs, clock skew, and generating IDs that preserve causality.',
        duration: '1h 15m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'distributed-monitoring',
        title: 'Distributed Monitoring',
        description:
          'Why monitoring is a design requirement rather than an afterthought, and the prerequisites any monitoring system must satisfy.',
        duration: '1h 15m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'monitor-server-side',
        title: 'Monitoring Server-Side Errors',
        description:
          'Designing the metrics pipeline end to end: collection, storage in a time-series database, alerting rules, and visualisation.',
        duration: '1h 25m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'monitor-client-side',
        title: 'Monitoring Client-Side Errors',
        description:
          'Why server-side monitoring is blind to half your outages, and how to design client-side error reporting that survives the network being the problem.',
        duration: '1h',
        lessons: 2,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'distributed-cache',
        title: 'Distributed Cache',
        description:
          'Cache placement and writing policies, eviction, sharding and replication, hot keys, the thundering herd, and Memcached versus Redis.',
        duration: '2h 20m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'messaging-queue',
        title: 'Distributed Messaging Queue',
        description:
          'Delivery semantics, ordering, visibility timeouts, dead-letter queues, and a full design plus evaluation against its requirements.',
        duration: '2h 20m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'pub-sub',
        title: 'The Pub-Sub Abstraction',
        description:
          'How publish-subscribe differs from a queue, topics and subscriptions, fan-out, and designing a pub-sub system.',
        duration: '1h 15m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'rate-limiter',
        title: 'Design a Rate Limiter',
        description:
          'Requirements, placement, and the algorithm family \u2014 fixed window, sliding log, sliding window counter, token bucket and leaky bucket \u2014 plus distributed enforcement.',
        duration: '1h 35m',
        lessons: 4,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'blob-store',
        title: 'Design a Blob Store',
        description:
          'Object storage versus file and block storage, metadata and data separation, partitioning, replication, versioning and evaluation.',
        duration: '2h',
        lessons: 5,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'distributed-search',
        title: 'Distributed Search',
        description:
          'Inverted indexes, index partitioning by document versus term, distributed query execution, relevance scoring, and scaling both search and indexing.',
        duration: '2h 20m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'distributed-logging',
        title: 'Distributed Logging',
        description:
          'Why logs are hard once there are a thousand services, structured logging, sampling, and designing a logging service with tracing built in.',
        duration: '1h 15m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'task-scheduler',
        title: 'Distributed Task Scheduler',
        description:
          'Requirements, queue and worker design, resource estimation, at-least-once execution, retries and idempotency, and delayed or recurring jobs.',
        duration: '1h 40m',
        lessons: 4,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'sharded-counters',
        title: 'Sharded Counters',
        description:
          'Why a single row cannot count viral events, how sharding a counter fixes write contention, and the read-path cost you accept in exchange.',
        duration: '1h 10m',
        lessons: 3,
        level: 'Intermediate',
        isFree: true,
      },

      // ---- Design problems --------------------------------------------
      {
        slug: 'youtube',
        title: 'Design YouTube',
        description:
          'Upload and transcoding pipelines, adaptive bitrate streaming, metadata storage, CDN delivery and view counting at scale.',
        duration: '1h 30m',
        lessons: 3,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'quora',
        title: 'Design Quora',
        description:
          'Questions, answers and votes, ranking, sharding a read-heavy social graph, and evolving from an initial to a final design.',
        duration: '1h 40m',
        lessons: 4,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'google-maps',
        title: 'Design Google Maps',
        description:
          'Map segmentation, graph routing at planetary scale, shortest-path precomputation, live traffic ingestion and ETA prediction.',
        duration: '2h',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'yelp',
        title: 'Design Yelp',
        description:
          'Proximity search, quadtrees versus geohashing, reviews and ratings, and the design considerations that make nearby-search fast.',
        duration: '1h 40m',
        lessons: 4,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'uber',
        title: 'Design Uber',
        description:
          'Driver location updates, matching riders to drivers, trip lifecycle state machines, surge pricing, payments and fraud detection.',
        duration: '2h 10m',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'twitter',
        title: 'Design Twitter',
        description:
          'Timeline generation, fan-out on write versus read, the celebrity problem, search and trends, and a client-side load balancer.',
        duration: '2h 10m',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'instagram-newsfeed',
        title: 'Design a Newsfeed & Instagram',
        description:
          'The general newsfeed pattern, then Instagram specifically: media upload, feed ranking, following graph and story delivery.',
        duration: '2h',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'tinyurl',
        title: 'Design TinyURL',
        description: 'Short-code generation, collision handling, redirects, custom aliases, expiry and click analytics.',
        duration: '50 min',
        lessons: 1,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'web-crawler',
        title: 'Design a Web Crawler',
        description:
          'Frontier management, politeness and robots.txt, duplicate detection, DNS bottlenecks, traps and freshness recrawl policy.',
        duration: '1h',
        lessons: 1,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'whatsapp',
        title: 'Design WhatsApp',
        description:
          'Long-lived connections, message delivery and receipts, offline queues, group messaging, end-to-end encryption and design evaluation.',
        duration: '2h',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'typeahead',
        title: 'Design Typeahead Suggestions',
        description:
          'Requirements and latency budget, tries and their memory cost, ranking by popularity, sharding the trie, and updating it from a query stream.',
        duration: '2h',
        lessons: 5,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'google-docs',
        title: 'Design Google Docs',
        description:
          'Collaborative editing requirements, the document model, and concurrency control through operational transformation versus CRDTs.',
        duration: '1h 40m',
        lessons: 4,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'code-deployment',
        title: 'Design a Code Deployment System',
        description:
          'Build artefacts, global distribution, blue-green and canary rollouts, health gating and automated rollback.',
        duration: '1h',
        lessons: 1,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'payment-system',
        title: 'Design a Payment System',
        description:
          'The payment flow and its actors, idempotency and exactly-once semantics, ledgers, double-entry bookkeeping and reconciliation.',
        duration: '1h 30m',
        lessons: 3,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'leetcode-system',
        title: 'Design the LeetCode System',
        description:
          'Problem and submission storage, sandboxed code execution, judging at scale, contests, leaderboards and anti-cheat.',
        duration: '1h 30m',
        lessons: 3,
        level: 'Advanced',
        isFree: true,
      },

      // ---- AI systems --------------------------------------------------
      {
        slug: 'chatgpt-system',
        title: 'Design a ChatGPT-Style System',
        description:
          'Inference serving and batching, KV cache and GPU memory, streaming responses, context and conversation storage, safety and cost control.',
        duration: '1h 30m',
        lessons: 2,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'ai-ml-data-infra',
        title: 'Data Infrastructure for AI/ML Systems',
        description:
          'The training and serving data path: ingestion, lakehouse storage, feature stores, pipeline orchestration, lineage and the training-serving skew problem.',
        duration: '1h 45m',
        lessons: 3,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'llm-support-bot',
        title: 'Design an LLM-Powered Support Bot',
        description:
          'Retrieval over a knowledge base, tool calls into ticketing systems, escalation to humans, guardrails and quality measurement.',
        duration: '1h 15m',
        lessons: 2,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'ai-code-assistant',
        title: 'Design an AI-Powered Code Assistant',
        description:
          'Repository indexing, context assembly under a token budget, low-latency completion serving, edit application and evaluation.',
        duration: '1h 15m',
        lessons: 2,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'system-failures',
        title: 'Lessons from System Failures',
        description:
          'Real outage patterns \u2014 retry storms, cascading failure, capacity cliffs, configuration pushes and correlated redundancy \u2014 and the design habits that prevent them.',
        duration: '1h',
        lessons: 1,
        level: 'Advanced',
        isFree: true,
      },
    ],
  },
  {
    slug: 'system-design',
    title: 'System Design',
    description: 'Classic interviews, core concepts, and Google-scale architectures.',
    icon: 'Boxes',
    color: 'from-indigo-500 to-blue-600',
    topics: [
      {
        slug: 'nfr',
        title: 'Non-Functional Requirements (NFR)',
        description: 'Scalability, security, performance, monitoring, availability, and reliability — why, where, how, and when with execution flows.',
        duration: '2h',
        lessons: 7,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'fundamentals',
        title: 'System Design Fundamentals',
        description: 'Scalability, CAP, caching, load balancing, databases, CDN, and the 45-minute interview framework.',
        duration: '2h 30m',
        lessons: 10,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'url-shortener',
        title: 'Design URL Shortener',
        description: 'Hashing, redirects, analytics, and storage trade-offs.',
        duration: '55 min',
        lessons: 8,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'rate-limiter',
        title: 'Design Rate Limiter',
        description: 'Token bucket, sliding window, Redis, and distributed limits.',
        duration: '1h 10m',
        lessons: 10,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'chatgpt-system',
        title: 'Design ChatGPT System',
        description: 'LLM serving, context windows, caching, and guardrails.',
        duration: '1h 25m',
        lessons: 12,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'core-concepts',
        title: '31 Core Concepts',
        description: 'Load balancing, sharding, CDN, messaging, Bloom filters, and more.',
        duration: '6h',
        lessons: 31,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'google-collection',
        title: 'Google SD Collection',
        description: 'Maps, Gmail, Docs, Trends, Street View, and feature flags.',
        duration: '4h',
        lessons: 12,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'news-feed',
        title: 'Design News Feed',
        description: 'Fan-out, ranking, caching, and celebrity problem.',
        duration: '1h 15m',
        lessons: 11,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'payment-system',
        title: 'Design Payment System',
        description: 'Idempotency, reconciliation, and exactly-once semantics.',
        duration: '1h 20m',
        lessons: 12,
        level: 'Advanced',
        isFree: false,
      },
    ],
  },
  {
    slug: 'dsa',
    title: 'DSA & Coding',
    description: '25 patterns × 10 problems — the interview roadmap that covers 80–90% of coding rounds.',
    icon: 'Terminal',
    color: 'from-amber-500 to-orange-500',
    topics: [
      {
        slug: 'patterns-intro',
        title: 'DSA Patterns Overview',
        description: 'How to recognize and apply the 25 essential patterns.',
        duration: '40 min',
        lessons: 5,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'two-pointers',
        title: 'Open full DSA track',
        description: '250 LeetCode problems with Java/Python — Hello Interview–style lessons.',
        duration: '40h+',
        lessons: 250,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'top-problems',
        title: 'Top Interview Problems',
        description: 'Curated FAANG-style problems with walkthroughs.',
        duration: '3h',
        lessons: 25,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'leetcode-25',
        title: 'LeetCode 25 Must-Do',
        description: 'High-frequency problems with pattern tags.',
        duration: '2h 30m',
        lessons: 25,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'dynamic-programming',
        title: 'Dynamic Programming Deep Dive',
        description: 'State machines, memoization, and interview templates.',
        duration: '2h',
        lessons: 18,
        level: 'Advanced',
        isFree: false,
      },
    ],
  },
  {
    slug: 'agentic-ai',
    title: 'Agentic AI',
    description: 'Agents, tools, planning, reflection, evals — how autonomous LLM systems actually work.',
    icon: 'Bot',
    color: 'from-fuchsia-500 to-violet-600',
    topics: [
      {
        slug: 'roadmap',
        title: 'Agentic AI Roadmap: From Beginner to Master',
        description:
          'The complete path in 15 stages and 5 phases — computer fundamentals, Python, data, ML, deep learning, transformers, LLM apps, RAG, agents, frameworks, MCP, multi-agent, automation, evaluation and production. With pacing, checkpoints and a 10-project ladder.',
        duration: '2h 45m',
        lessons: 26,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'agents',
        title: 'Agents',
        description:
          'Environment, tools, planning, function calling, control flow, reflection, and how agents fail — with diagrams, worked traces and eval metrics.',
        duration: '2h',
        lessons: 21,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'genai-platform',
        title: 'Building a Generative AI Platform',
        description:
          'Grow the architecture one component at a time: context construction, guardrails, router and gateway, caching, write actions, observability, orchestration.',
        duration: '2h 30m',
        lessons: 24,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'ai-pitfalls',
        title: 'Common Pitfalls When Building GenAI Applications',
        description:
          'The seven failure modes that waste the most time and money — wrong tool, product mistaken for model, premature complexity, misleading demos, missing human evaluation, no portfolio strategy, and the newer traps around context, cost, agents and injection.',
        duration: '2h 15m',
        lessons: 22,
        level: 'All levels',
        isFree: true,
      },
      {
        slug: 'real-time-ml',
        title: 'Real-Time Machine Learning: Challenges and Solutions',
        description:
          'Two maturity ladders — prediction freshness and model freshness. Batch prediction, session-based online serving, streaming and real-time features, bandits for online evaluation, stateless vs stateful training, continual learning, and the streaming infrastructure each stage demands.',
        duration: '2h 30m',
        lessons: 23,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'multimodal',
        title: 'Multimodality and Large Multimodal Models (LMMs)',
        description:
          'Why multimodality, how modalities convert into one another, generation vs vision-language understanding, then the fundamentals through CLIP and Flamingo — contrastive learning, joint embedding spaces, frozen encoders, gated cross-attention — plus native multimodality, video, GUI and robot agents, and multimodal output.',
        duration: '2h 45m',
        lessons: 25,
        level: 'All levels',
        isFree: true,
      },
    ],
  },
  {
    slug: 'claude-code',
    title: 'Claude Code',
    description:
      'Claude Code Masterclass in 10 classes — from your first install to an AI-native engineering workflow: the CLI, context engineering with CLAUDE.md, agentic coding, skills, commands, hooks, MCP, subagents, a real end-to-end project and production guardrails.',
    icon: 'Terminal',
    color: 'from-orange-400 to-rose-500',
    topics: [
      {
        slug: 'fundamentals',
        title: 'Class 1 — Claude Code Fundamentals & Agentic Coding',
        description:
          'What Claude Code actually is, how the gather → act → verify agent loop works, why an agent differs from autocomplete and chat, and the full capability surface — files, search, shell, tests, git.',
        duration: '1h 15m',
        lessons: 5,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'cli-first-project',
        title: 'Class 2 — Installation, CLI & Your First Project',
        description:
          'Install and authenticate, learn the interactive session, slash commands, shortcuts, models and the permission system, then run a first real task on a Todo API: explore, understand, plan, implement, test, verify.',
        duration: '1h 25m',
        lessons: 6,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'context-engineering',
        title: 'Class 3 — Prompting, Context & CLAUDE.md',
        description:
          'Context as finite working memory: what to put in it, what to keep out, how to write a CLAUDE.md that actually changes behaviour, hierarchical instructions, auto memory and the seven-part agent prompt.',
        duration: '1h 35m',
        lessons: 7,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'coding-agent',
        title: 'Class 4 — Claude Code as a Software Engineering Agent',
        description:
          'The agent loop in practice: codebase exploration, plan mode, grounded investigation, debugging from symptom to root cause with a regression test, and refactoring with acceptance criteria.',
        duration: '1h 30m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'advanced-workflow',
        title: 'Class 5 — Advanced Development Workflow',
        description:
          'A full feature end to end, test-driven development with an agent, working safely with git, senior-level code review, and how to decompose a change too large for one session.',
        duration: '1h 35m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'skills-commands-hooks',
        title: 'Class 6 — Skills, Commands & Hooks',
        description:
          'Make workflows reusable with slash commands, expertise reusable with SKILL.md, and engineering rules enforceable with hooks — then wire all three into an automated guardrail chain.',
        duration: '1h 40m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'mcp',
        title: 'Class 7 — MCP & External Tools',
        description:
          'Why MCP exists, its client/server architecture, tools versus resources versus prompts, installing servers (and when not to), browser automation, building your own knowledge server, and MCP security.',
        duration: '1h 40m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'subagents',
        title: 'Class 8 — Subagents & Multi-Agent Development',
        description:
          'What a subagent is, when delegation genuinely helps, subagents versus agent teams, parallel development with git worktrees, and how to coordinate results without ending up with four conflicting branches.',
        duration: '1h 35m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'real-world-project',
        title: 'Class 9 — Real-World Project & Automation',
        description:
          'Build a full-stack developer productivity platform with Claude Code: requirements to architecture, scaffolding, parallel implementation, deliberate bug hunts, and productionising with Docker, logging and CI.',
        duration: '1h 45m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'production',
        title: 'Class 10 — Production Engineering & Best Practices',
        description:
          'The AI-native SDLC: permissions and sandboxing, reliability habits, long-horizon context management, Claude Code in CI/CD for review and tests, auditability, and what the engineering role becomes.',
        duration: '1h 45m',
        lessons: 7,
        level: 'Advanced',
        isFree: true,
      },
    ],
  },
  {
    slug: 'ai-harness',
    title: 'AI Harness',
    description:
      'AI Harness Masterclass — build production-grade AI agents from scratch: from LLMs and prompts to tools, memory, MCP, multi-agents, guardrails, evaluation and an agentic SDLC. Beginner entry, professional engineering depth.',
    icon: 'Cpu',
    color: 'from-cyan-500 to-indigo-600',
    topics: [
      {
        slug: 'what-is',
        title: 'Class 1 — What Is an AI Harness?',
        description:
          'LLM vs agent vs harness, chatbot vs agentic system, AI-assisted vs AI-driven development, the basic architecture (context, tools, memory, loop), and product examples from Claude Code to DevOps agents.',
        duration: '1h 20m',
        lessons: 5,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'architecture',
        title: 'Class 2 — AI Harness Architecture & Core Components',
        description:
          'Think like an AI systems architect: context, tools, memory, model, agent loop, guardrails, output — plus seven layers from interface through observability.',
        duration: '1h 35m',
        lessons: 4,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'context-engineering',
        title: 'Class 3 — Context Engineering & Project Intelligence',
        description:
          'What agent context is made of, how to build project intelligence, retrieve and rank context, compress it, and stop context pollution.',
        duration: '1h 40m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'tools',
        title: 'Class 4 — Tools, Commands & Tool Calling',
        description:
          'Tools as the agent’s hands: registry, JSON schemas, the tool-call loop, validation, errors, and tool security (allowlist, destructive ops, credentials).',
        duration: '1h 35m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'guardrails',
        title: 'Class 5 — Guardrails, Permissions & Human-in-the-Loop',
        description:
          'Permission levels, risk-based human approval, policy engines, and prompt injection (including tool-result and document injection).',
        duration: '1h 40m',
        lessons: 6,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'memory-state',
        title: 'Class 6 — Memory, State & Long-Running Tasks',
        description:
          'Context vs memory, short/long/working memory, the agent state machine, milestone persistence, and recovery when the process dies.',
        duration: '1h 35m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'mcp',
        title: 'Class 7 — MCP & External Systems',
        description:
          'MCP as the harness connectivity layer: client/server, tool discovery, GitHub/Jira/Slack/Postgres, security, and a company-knowledge server.',
        duration: '1h 35m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'subagents',
        title: 'Class 8 — Subagents & Multi-Agent Harness',
        description:
          'Single agent vs subagents, specialized roles, sequential/parallel/hierarchical/reviewer patterns, and communication with isolated context.',
        duration: '1h 35m',
        lessons: 6,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'build-harness',
        title: 'Class 9 — Build a Real AI Engineering Harness',
        description:
          'Hero project: a miniature Claude-Code-like CLI with tool registry, agent loop, memory, policy engine, MCP, and a manager + specialist subagents.',
        duration: '1h 50m',
        lessons: 8,
        level: 'Advanced',
        isFree: true,
      },
      {
        slug: 'production',
        title: 'Class 10 — Production AI Harness & Agentic SDLC',
        description:
          'Enterprise platform: gateway, orchestrator, observability, evals, reliability, cost engineering, AI-native SDLC, and human+AI engineering.',
        duration: '1h 50m',
        lessons: 8,
        level: 'Advanced',
        isFree: true,
      },
    ],
  },
  {
    slug: 'ai-engineering',
    title: 'AI Engineering',
    description: 'LLMs, RAG, agents, MCP, and AI system design.',
    icon: 'Sparkles',
    color: 'from-violet-500 to-purple-600',
    topics: [
      {
        slug: 'prompt-engineering',
        title: 'Prompt Engineering Basics',
        description: 'Few-shot, chain-of-thought, and evaluation.',
        duration: '35 min',
        lessons: 4,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'rag-fundamentals',
        title: 'RAG Fundamentals',
        description: 'Embeddings, retrieval, chunking, and vector stores.',
        duration: '55 min',
        lessons: 8,
        level: 'Intermediate',
        isFree: true,
      },
      {
        slug: 'agents-mcp',
        title: 'Agents & MCP',
        description: 'Tool use, orchestration, and Model Context Protocol.',
        duration: '1h 30m',
        lessons: 14,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'fine-tuning',
        title: 'Fine-Tuning & LoRA',
        description: 'When to fine-tune, datasets, and deployment.',
        duration: '1h 15m',
        lessons: 10,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'ml-interview',
        title: 'ML Interview Guide',
        description: 'ML/DL fundamentals for technical screens.',
        duration: '2h',
        lessons: 16,
        level: 'Advanced',
        isFree: false,
      },
      {
        slug: 'langchain-production',
        title: 'LangChain in Production',
        description: 'Chains, memory, evals, and observability.',
        duration: '1h 40m',
        lessons: 12,
        level: 'Intermediate',
        isFree: false,
      },
    ],
  },
  {
    slug: 'data-cloud',
    title: 'Data & Cloud',
    description: 'Kafka, Spark, AWS, and distributed data systems.',
    icon: 'Cloud',
    color: 'from-emerald-500 to-teal-600',
    topics: [
      {
        slug: 'kafka-basics',
        title: 'Apache Kafka Basics',
        description: 'Topics, partitions, consumer groups, and delivery semantics.',
        duration: '45 min',
        lessons: 6,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'spark-fundamentals',
        title: 'Apache Spark Fundamentals',
        description: 'RDDs, DataFrames, Spark SQL, and cluster modes.',
        duration: '1h 20m',
        lessons: 11,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'aws-architect',
        title: 'AWS Cloud Architect',
        description: 'VPC, S3, RDS, Lambda, and well-architected patterns.',
        duration: '3h',
        lessons: 22,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'kubernetes',
        title: 'Kubernetes for Engineers',
        description: 'Pods, services, ingress, and production operations.',
        duration: '2h 30m',
        lessons: 18,
        level: 'Advanced',
        isFree: false,
      },
    ],
  },
  {
    slug: 'behavioral',
    title: 'Behavioral',
    description: 'STAR method, leadership stories, and senior-level communication.',
    icon: 'MessageSquare',
    color: 'from-rose-500 to-pink-600',
    topics: [
      {
        slug: 'star-method',
        title: 'STAR Method Mastery',
        description: 'Structure stories for impact, conflict, and leadership.',
        duration: '30 min',
        lessons: 4,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'top-questions',
        title: 'Top Behavioral Questions',
        description: '50+ questions with answer frameworks.',
        duration: '1h 30m',
        lessons: 15,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'staff-promo',
        title: 'Staff+ Promotion Stories',
        description: 'Scope, influence, and executive communication.',
        duration: '1h',
        lessons: 8,
        level: 'Advanced',
        isFree: false,
      },
    ],
  },
  {
    slug: 'java',
    title: 'Java & Backend',
    description: 'Core Java, collections, Spring, and backend interview prep.',
    icon: 'Coffee',
    color: 'from-orange-500 to-red-500',
    topics: [
      {
        slug: 'java-core',
        title: 'Java Core Concepts',
        description: 'OOP, generics, streams, and concurrency basics.',
        duration: '50 min',
        lessons: 7,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'collections',
        title: 'Java Collections Deep Dive',
        description: 'Lists, maps, sets, and interview favorites.',
        duration: '1h 15m',
        lessons: 10,
        level: 'Intermediate',
        isFree: false,
      },
      {
        slug: 'spring-boot',
        title: 'Spring Boot Interview Prep',
        description: 'DI, REST, security, and production patterns.',
        duration: '2h',
        lessons: 16,
        level: 'Intermediate',
        isFree: false,
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTopic(categorySlug: string, topicSlug: string): Topic | undefined {
  const cat = getCategory(categorySlug);
  return cat?.topics.find((t) => t.slug === topicSlug);
}

export function getAllTopicPaths(): { category: string; topic: string }[] {
  return categories.flatMap((c) =>
    c.topics.map((t) => ({ category: c.slug, topic: t.slug }))
  );
}

export function countTopics() {
  const all = categories.flatMap((c) => c.topics);
  return {
    total: all.length,
    free: all.filter((t) => t.isFree).length,
    premium: all.filter((t) => !t.isFree).length,
  };
}
