#!/usr/bin/env node
/**
 * Generates System Design roadmap + lesson content for binodtech.com
 * Hello Interview–style curriculum (unlocked — no pro gating in data).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../src/data/system-design');

const sections = [
  {
    slug: 'in-a-hurry',
    title: 'In a Hurry',
    order: 1,
    icon: 'Clock',
    overview: 'Fast orientation for system design interviews — what to study, how to deliver, and how to structure 45 minutes.',
    tip: 'Read Introduction → How to Prepare → Delivery Framework before diving into concepts.',
    topics: [
      { slug: 'introduction', title: 'Introduction', kind: 'guide', level: 'Beginner' },
      { slug: 'how-to-prepare', title: 'How to Prepare', kind: 'guide', level: 'Beginner' },
      { slug: 'delivery-framework', title: 'Delivery Framework', kind: 'guide', level: 'Beginner' },
    ],
  },
  {
    slug: 'core-concepts',
    title: 'Core Concepts',
    order: 2,
    icon: 'BookOpen',
    overview: 'Building blocks every strong system design answer uses: networking, APIs, data, caching, sharding, CAP, indexing, and numbers.',
    tip: 'Know what each concept trades off — interviewers probe trade-offs, not definitions.',
    topics: [
      { slug: 'networking-essentials', title: 'Networking Essentials', kind: 'concept', level: 'Beginner' },
      { slug: 'api-design', title: 'API Design', kind: 'concept', level: 'Beginner' },
      { slug: 'data-modeling', title: 'Data Modeling', kind: 'concept', level: 'Intermediate' },
      { slug: 'caching', title: 'Caching', kind: 'concept', level: 'Intermediate' },
      { slug: 'sharding', title: 'Sharding', kind: 'concept', level: 'Intermediate' },
      { slug: 'consistent-hashing', title: 'Consistent Hashing', kind: 'concept', level: 'Intermediate' },
      { slug: 'cap-theorem', title: 'CAP Theorem', kind: 'concept', level: 'Beginner' },
      { slug: 'database-indexing', title: 'Database Indexing', kind: 'concept', level: 'Intermediate' },
      { slug: 'numbers-to-know', title: 'Numbers to Know', kind: 'concept', level: 'Beginner' },
    ],
  },
  {
    slug: 'key-technologies',
    title: 'Key Technologies',
    order: 3,
    icon: 'Cpu',
    overview: 'When to reach for Redis, Kafka, Elasticsearch, DynamoDB, Postgres, and friends — and what they are not.',
    tip: 'Name a technology only if you can explain why it fits the requirements.',
    topics: [
      { slug: 'redis', title: 'Redis', kind: 'tech', level: 'Intermediate' },
      { slug: 'elasticsearch', title: 'Elasticsearch', kind: 'tech', level: 'Intermediate' },
      { slug: 'kafka', title: 'Kafka', kind: 'tech', level: 'Intermediate' },
      { slug: 'api-gateway', title: 'API Gateway', kind: 'tech', level: 'Beginner' },
      { slug: 'cassandra', title: 'Cassandra', kind: 'tech', level: 'Advanced' },
      { slug: 'dynamodb', title: 'DynamoDB', kind: 'tech', level: 'Intermediate' },
      { slug: 'postgresql', title: 'PostgreSQL', kind: 'tech', level: 'Beginner' },
      { slug: 'flink', title: 'Flink', kind: 'tech', level: 'Advanced' },
      { slug: 'zookeeper', title: 'ZooKeeper', kind: 'tech', level: 'Advanced' },
    ],
  },
  {
    slug: 'common-patterns',
    title: 'Common Patterns',
    order: 4,
    icon: 'Layers',
    overview: 'Reusable interview patterns: realtime, contention, multi-step flows, scaling reads/writes, blobs, and long-running work.',
    tip: 'Map the problem to 1–2 patterns early — it frames the rest of the design.',
    topics: [
      { slug: 'real-time-updates', title: 'Real-time Updates', kind: 'pattern', level: 'Intermediate' },
      { slug: 'dealing-with-contention', title: 'Dealing with Contention', kind: 'pattern', level: 'Advanced' },
      { slug: 'multi-step-processes', title: 'Multi-step Processes', kind: 'pattern', level: 'Intermediate' },
      { slug: 'scaling-reads', title: 'Scaling Reads', kind: 'pattern', level: 'Intermediate' },
      { slug: 'scaling-writes', title: 'Scaling Writes', kind: 'pattern', level: 'Intermediate' },
      { slug: 'handling-large-blobs', title: 'Handling Large Blobs', kind: 'pattern', level: 'Intermediate' },
      { slug: 'managing-long-running-tasks', title: 'Managing Long Running Tasks', kind: 'pattern', level: 'Intermediate' },
    ],
  },
  {
    slug: 'question-breakdowns',
    title: 'Question Breakdowns',
    order: 5,
    icon: 'Crosshair',
    overview: 'Full interview walkthroughs: requirements → entities → API → high-level design → deep dives → level expectations.',
    tip: 'Practice out loud. Cover breadth first, then 1–2 deep dives for senior bar.',
    topics: [
      { slug: 'bitly', title: 'Bitly (URL Shortener)', kind: 'problem', level: 'Beginner', pattern: 'Scaling Reads' },
      { slug: 'dropbox', title: 'Dropbox', kind: 'problem', level: 'Intermediate', pattern: 'Handling Large Blobs' },
      { slug: 'local-delivery-service', title: 'Local Delivery Service', kind: 'problem', level: 'Intermediate', pattern: 'Real-time Updates' },
      { slug: 'ticketmaster', title: 'Ticketmaster', kind: 'problem', level: 'Advanced', pattern: 'Dealing with Contention' },
      { slug: 'fb-news-feed', title: 'FB News Feed', kind: 'problem', level: 'Advanced', pattern: 'Scaling Reads' },
      { slug: 'tinder', title: 'Tinder', kind: 'problem', level: 'Intermediate', pattern: 'Scaling Reads' },
      { slug: 'leetcode', title: 'LeetCode', kind: 'problem', level: 'Intermediate', pattern: 'Multi-step Processes' },
      { slug: 'whatsapp', title: 'WhatsApp', kind: 'problem', level: 'Advanced', pattern: 'Real-time Updates' },
      { slug: 'rate-limiter', title: 'Rate Limiter', kind: 'problem', level: 'Intermediate', pattern: 'Dealing with Contention' },
      { slug: 'youtube', title: 'YouTube', kind: 'problem', level: 'Advanced', pattern: 'Handling Large Blobs' },
      { slug: 'fb-live-comments', title: 'FB Live Comments', kind: 'problem', level: 'Advanced', pattern: 'Real-time Updates' },
      { slug: 'youtube-top-k', title: 'YouTube Top K', kind: 'problem', level: 'Advanced', pattern: 'Scaling Writes' },
      { slug: 'uber', title: 'Uber', kind: 'problem', level: 'Advanced', pattern: 'Real-time Updates' },
      { slug: 'web-crawler', title: 'Web Crawler', kind: 'problem', level: 'Intermediate', pattern: 'Managing Long Running Tasks' },
      { slug: 'ad-click-aggregator', title: 'Ad Click Aggregator', kind: 'problem', level: 'Advanced', pattern: 'Scaling Writes' },
      { slug: 'fb-post-search', title: 'FB Post Search', kind: 'problem', level: 'Intermediate', pattern: 'Scaling Reads' },
      { slug: 'yelp', title: 'Yelp', kind: 'problem', level: 'Intermediate', pattern: 'Scaling Reads' },
      { slug: 'instagram', title: 'Instagram', kind: 'problem', level: 'Advanced', pattern: 'Scaling Reads' },
      { slug: 'strava', title: 'Strava', kind: 'problem', level: 'Intermediate', pattern: 'Handling Large Blobs' },
      { slug: 'distributed-cache', title: 'Distributed Cache', kind: 'problem', level: 'Advanced', pattern: 'Scaling Reads' },
      { slug: 'online-auction', title: 'Online Auction', kind: 'problem', level: 'Advanced', pattern: 'Dealing with Contention' },
      { slug: 'job-scheduler', title: 'Job Scheduler', kind: 'problem', level: 'Intermediate', pattern: 'Managing Long Running Tasks' },
      { slug: 'news-aggregator', title: 'News Aggregator', kind: 'problem', level: 'Intermediate', pattern: 'Scaling Reads' },
      { slug: 'price-tracking-service', title: 'Price Tracking Service', kind: 'problem', level: 'Intermediate', pattern: 'Managing Long Running Tasks' },
      { slug: 'notification-system', title: 'Notification System', kind: 'problem', level: 'Intermediate', pattern: 'Multi-step Processes' },
      { slug: 'robinhood', title: 'Robinhood', kind: 'problem', level: 'Advanced', pattern: 'Dealing with Contention' },
      { slug: 'google-docs', title: 'Google Docs', kind: 'problem', level: 'Advanced', pattern: 'Real-time Updates' },
      { slug: 'payment-system', title: 'Payment System', kind: 'problem', level: 'Advanced', pattern: 'Multi-step Processes' },
      { slug: 'metrics-monitoring', title: 'Metrics Monitoring', kind: 'problem', level: 'Intermediate', pattern: 'Scaling Writes' },
      { slug: 'online-chess', title: 'Online Chess', kind: 'problem', level: 'Intermediate', pattern: 'Real-time Updates' },
      { slug: 'chatgpt', title: 'ChatGPT', kind: 'problem', level: 'Advanced', pattern: 'Managing Long Running Tasks' },
    ],
  },
  {
    slug: 'advanced-topics',
    title: 'Advanced Topics',
    order: 6,
    icon: 'Sparkles',
    overview: 'Senior+ depth: geo search, time series, big-data structures, vectors, and CDC.',
    tip: 'Bring these up only when the problem needs them — they signal senior depth.',
    topics: [
      { slug: 'proximity-search', title: 'Proximity Search', kind: 'concept', level: 'Advanced' },
      { slug: 'time-series-databases', title: 'Time Series Databases', kind: 'concept', level: 'Advanced' },
      { slug: 'data-structures-for-big-data', title: 'Data Structures for Big Data', kind: 'concept', level: 'Advanced' },
      { slug: 'vector-databases', title: 'Vector Databases', kind: 'concept', level: 'Advanced' },
      { slug: 'change-data-capture', title: 'Change Data Capture', kind: 'concept', level: 'Advanced' },
    ],
  },
  {
    slug: 'in-the-wild',
    title: 'In the Wild',
    order: 7,
    icon: 'Globe',
    overview: 'How real companies solve hard problems — patterns you can reuse in interviews.',
    tip: 'Steal the pattern, not the company name. Interviewers care about the trade-off story.',
    topics: [
      { slug: 'shopify-inventory-reservations', title: 'Shopify Inventory Reservations', kind: 'wild', level: 'Advanced' },
      { slug: 'discord-message-storage', title: 'Discord Message Storage', kind: 'wild', level: 'Advanced' },
      { slug: 'slack-job-queue', title: 'Slack Job Queue', kind: 'wild', level: 'Intermediate' },
      { slug: 'figma-multiplayer', title: 'Figma Multiplayer', kind: 'wild', level: 'Advanced' },
      { slug: 'spotify-data-lake', title: 'Spotify Data Lake', kind: 'wild', level: 'Advanced' },
    ],
  },
];

/** Curated deep content for key topics */
const DEEP = {
  introduction: {
    summary: 'System design interviews test how you decompose ambiguous products into scalable services, data models, and clear trade-offs under time pressure.',
    what: 'A structured conversation where you clarify requirements, propose APIs and data models, draw a high-level architecture, and deepen into bottlenecks.',
    why: 'Companies hire engineers who can reason about scale, failure, and cost — not just write correct code for known inputs.',
    how: '1. Clarify functional + non-functional requirements with numbers.\n2. Define entities and APIs.\n3. Draw a simple working design.\n4. Identify bottlenecks and deep-dive 1–3 areas.\n5. Summarize trade-offs.',
    whereToUse: ['FAANG and startup onsite loops', 'Staff promotion packets', 'Architecture reviews at work'],
    impact: 'Strong SD performance often decides senior offers; weak delivery sinks otherwise strong coding candidates.',
    alternatives: ['Take-home architecture docs', 'Pairing on real incidents', 'Design docs in the job'],
    useCases: ['Design a feed', 'Design a chat', 'Design a payments ledger', 'Design a rate limiter'],
    tip: 'Breadth first, depth second. Never disappear into one component for 20 minutes.',
  },
  caching: {
    summary: 'Caching stores hot data closer to the caller to cut latency and load on primary stores — at the cost of freshness and complexity.',
    what: 'A layer (client, CDN, reverse proxy, app memory, or Redis/Memcached) that serves previously computed or fetched data faster than the source of truth.',
    why: 'Databases and remote services are often 10–100× slower than a cache hit. At high QPS, caching is how you meet <100–500ms latency budgets.',
    how: '1. Identify hot keys and read/write ratio.\n2. Choose placement (CDN vs edge vs app vs shared Redis).\n3. Pick strategy: cache-aside, read-through, write-through, write-behind.\n4. Set TTL + eviction (LRU/LFU).\n5. Plan invalidation on writes and stampede protection.',
    whereToUse: ['News feeds', 'Session stores', 'Product catalogs', 'Config and feature flags', 'CDN for static + video'],
    impact: 'Can drop p99 latency from tens of ms to ~1ms and reduce DB load by orders of magnitude — if invalidation is correct.',
    alternatives: ['Materialized views / precompute', 'Read replicas', 'In-memory application state', 'Faster primary store'],
    useCases: ['Redis for feed timelines', 'CDN for images', 'Local process cache for configs'],
    tip: 'Always say what happens on write and how you avoid thundering herds.',
  },
  'fb-news-feed': {
    summary: 'Design a reverse-chronological feed of posts from people you follow — the classic fan-out / scaling-reads interview.',
    what: 'Users create posts and follow others; viewing the feed returns recent posts from followees with pagination.',
    why: 'Tests whether you can move from a naive fan-out-on-read design to hybrid fan-out, async workers, and hot-key caching under billions of users.',
    how: 'Clarify FR/NFR → entities (User, Follow, Post) → APIs → naive design → deep dive celebrity/fan-out → hybrid precompute + merge → post cache.',
    whereToUse: ['Social feeds', 'Activity streams', 'Notification inboxes'],
    impact: 'Wrong fan-out strategy fails either latency (read path) or write amplification (celebrity posts).',
    alternatives: ['Pure fan-out on read for small graphs', 'Pure fan-out on write for small follow counts', 'Ranked feeds (ML) instead of chrono'],
    useCases: ['Facebook/Instagram chrono feed', 'Twitter/X home timeline', 'LinkedIn feed'],
    tip: 'State eventual consistency (e.g. 1 minute staleness) early — it unlocks async fan-out.',
    functional: [
      'Users can create posts',
      'Users can follow other users',
      'Users can view a reverse-chronological feed of followees',
      'Users can page through the feed (cursor)',
    ],
    nonFunctional: [
      'Highly available; tolerate ~1 minute post staleness',
      'Post + feed view < 500ms',
      'Scale to ~2B users',
      'Unlimited follows / followers (discuss product caps)',
    ],
    entities: ['User', 'Follow (follower → followee)', 'Post', 'PrecomputedFeed (optional)'],
    apis: `POST /posts { content } → { postId }
PUT /users/{id}/follow
GET /feed?pageSize=&cursor= → { items, nextCursor }`,
    deepDives: [
      {
        title: 'Users following many accounts (fan-out on read)',
        body: 'Naive: query all followees then merge posts — too many reads. Fix: precompute feeds on write for most users; cap product follows; fall back to on-read merge for deep pages.',
      },
      {
        title: 'Celebrity / mega-follower writes (fan-out on write)',
        body: 'Do not blast millions of feed writes synchronously. Queue async workers; for mega accounts skip precompute and merge their recent posts at read time (hybrid).',
      },
      {
        title: 'Hot posts / uneven read load',
        body: 'Cache posts in Redis. Prefer redundant (replicated) cache instances over single-shard keys so viral posts do not melt one partition.',
      },
    ],
  },
};

function slugTitle(s) {
  return s;
}

function qaFor(title, kind) {
  const base = [
    {
      q: `What is ${title} and why does it matter in interviews?`,
      a: `${title} shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost.`,
    },
    {
      q: 'How would you measure success for this design?',
      a: 'Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these.',
    },
    {
      q: 'What fails first when traffic spikes 10×?',
      a: 'Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure).',
    },
    {
      q: 'What would you cut if you only had 20 minutes left?',
      a: 'Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components.',
    },
  ];
  if (kind === 'problem') {
    base.push({
      q: 'Fan-out on read vs fan-out on write — when each?',
      a: 'Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best.',
    });
  }
  if (kind === 'tech') {
    base.push({
      q: `When would you NOT use ${title}?`,
      a: `When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth).`,
    });
  }
  return base;
}

function conceptBody(meta, section) {
  const deep = DEEP[meta.slug];
  const title = meta.title;
  const what = deep?.what ?? `${title} is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.`;
  const why = deep?.why ?? `Interviewers expect you to know when ${title} helps, what it costs, and what breaks if you misuse it.`;
  const how =
    deep?.how ??
    `1. Restate the problem need that ${title} addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.`;
  const where = deep?.whereToUse ?? [`Systems that need ${title.toLowerCase()} to meet SLOs`, 'High-QPS read or write paths', 'Multi-region or multi-tenant products'];
  const impact = deep?.impact ?? `Correct use of ${title} can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.`;
  const alternatives = deep?.alternatives ?? ['Simpler design without this layer (if numbers allow)', 'A neighboring pattern that solves the same bottleneck', 'Managed cloud service vs self-hosted'];
  const useCases = deep?.useCases ?? [`Classic interview prompts involving ${title}`, 'Production systems with similar constraints'];
  const summary = deep?.summary ?? `${title}: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.`;

  const explain = `## What
${what}

## Why
${why}

## How
${how}

## Where to use
${where.map((w, i) => `${i + 1}. ${w}`).join('\n')}

## Impact
${impact}

## Alternatives
${alternatives.map((a, i) => `${i + 1}. ${a}`).join('\n')}

## Use cases
${useCases.map((u, i) => `${i + 1}. ${u}`).join('\n')}

## Interview playbook
1. Define the bottleneck in one sentence.
2. Propose ${title} as the lever.
3. State consistency / latency / cost trade-offs.
4. Name failure modes (cache stampede, hot shard, split brain, etc.).
5. Offer one simpler alternative if scale is lower.`;

  return {
    slug: meta.slug,
    title,
    sectionSlug: section.slug,
    kind: meta.kind,
    level: meta.level,
    pattern: meta.pattern || null,
    summary,
    what,
    why,
    how,
    whereToUse: where,
    impact,
    alternatives,
    useCases,
    explain,
    interviewerQA: qaFor(title, meta.kind),
    commonMistakes: [
      `Name-dropping ${title} without tying it to a requirement`,
      'Ignoring invalidation, retries, or failure modes',
      'Optimizing before a working end-to-end design exists',
    ],
    tradeoffs: [
      'Complexity vs latency/throughput gains',
      'Consistency vs availability',
      'Cost vs peak-load headroom',
    ],
    tip: deep?.tip ?? section.tip,
    functionalRequirements: deep?.functional || [],
    nonFunctionalRequirements: deep?.nonFunctional || [],
    entities: deep?.entities || [],
    apis: deep?.apis || '',
    deepDives: deep?.deepDives || [],
    highLevelDesign: '',
  };
}

function problemBody(meta, section) {
  const deep = DEEP[meta.slug];
  const title = meta.title.replace(/ \(.*\)$/, '');
  const pattern = meta.pattern || 'Scaling Reads';

  const functional =
    deep?.functional ||
    [
      `Core create / read flows for ${title}`,
      'Auth assumed via session/JWT unless asked',
      'Pagination or streaming where lists are large',
      'Below-the-line features explicitly out of scope',
    ];
  const nonFunctional =
    deep?.nonFunctional ||
    [
      'Availability over strict consistency unless money/ledger',
      'p99 latency target stated with a number (e.g. < 300–500ms)',
      'Scale estimate: DAU, QPS, payload size',
      'Durability and multi-region if product needs it',
    ];
  const entities =
    deep?.entities ||
    ['User', `${title.replace(/\s+/g, '')}Entity`, 'Relationship / membership edges as needed'];
  const apis =
    deep?.apis ||
    `POST /… create
GET /…/{id} read
GET /…?cursor= list/page
(Extend with domain-specific endpoints for ${title})`;

  const deepDives =
    deep?.deepDives ||
    [
      {
        title: `Primary bottleneck for ${title}`,
        body: `Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: ${pattern}.`,
      },
      {
        title: 'Failure and consistency',
        body: 'Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.',
      },
      {
        title: 'Cost and capacity',
        body: 'Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.',
      },
    ];

  const what = deep?.what ?? `Design ${title}: clarify product scope, then build a scalable architecture that meets FR/NFR.`;
  const why = deep?.why ?? `${title} is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (${pattern}).`;
  const how =
    deep?.how ??
    `1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (${pattern}).\n5. Level check: mid = breadth; senior = 2 deep dives.`;
  const summary = deep?.summary ?? `Interview breakdown for ${title} — requirements, API, design, deep dives, and Q&A.`;

  const explain = `## Understanding the problem
${what}

## Functional requirements
${functional.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## Non-functional requirements
${nonFunctional.map((f, i) => `${i + 1}. ${f}`).join('\n')}

## Why this question
${why}

## How to approach (45 minutes)
${how}

## Core entities
${entities.map((e, i) => `${i + 1}. ${e}`).join('\n')}

## API / system interface
\`\`\`
${apis}
\`\`\`

## High-level design
1. Stateless services behind a load balancer / API gateway.
2. Primary datastore chosen for the access pattern (KV vs relational vs search).
3. Cache and/or async workers where the ${pattern} pattern demands it.
4. Observability: metrics, logs, traces on the hot path.

## Deep dives
${deepDives.map((d, i) => `### ${i + 1}. ${d.title}\n${d.body}`).join('\n\n')}

## Where this pattern appears
${(deep?.whereToUse || [`Products like ${title}`, `Any system needing ${pattern}`]).map((w, i) => `${i + 1}. ${w}`).join('\n')}

## Impact if you get it wrong
${deep?.impact || 'Missed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.'}

## Alternatives
${(deep?.alternatives || ['Simpler monolith + single DB for MVP scale', 'Different storage engine', 'Product limits to avoid extreme fan-out']).map((a, i) => `${i + 1}. ${a}`).join('\n')}

## What interviewers expect by level
1. Mid: working HLD + API + data model; surface-level components.
2. Senior: fast HLD + two solid deep dives with trade-offs.
3. Staff+: proactive bottleneck discovery, production war stories, capacity math.`;

  return {
    slug: meta.slug,
    title: meta.title,
    sectionSlug: section.slug,
    kind: meta.kind,
    level: meta.level,
    pattern,
    summary,
    what,
    why,
    how,
    whereToUse: deep?.whereToUse || [`Interview: Design ${title}`, `Production systems similar to ${title}`],
    impact: deep?.impact || `Wrong architecture fails latency, cost, or correctness under ${title}'s peak load.`,
    alternatives: deep?.alternatives || ['MVP single-region design', 'Managed services vs self-built', 'Product constraints to reduce fan-out'],
    useCases: deep?.useCases || [title, `Variants of ${title} in other companies`],
    explain,
    interviewerQA: qaFor(meta.title, 'problem'),
    commonMistakes: [
      'Jumping to microservices before requirements',
      'Skipping API and data model',
      'One deep dive that consumes the whole interview',
      'No numbers on QPS / storage',
    ],
    tradeoffs: [
      `Consistency vs availability for ${title}`,
      'Precompute vs on-demand computation',
      'Operational complexity vs peak performance',
    ],
    tip: deep?.tip ?? `Lead with the ${pattern} pattern, then deepen.`,
    functionalRequirements: functional,
    nonFunctionalRequirements: nonFunctional,
    entities,
    apis,
    deepDives,
    highLevelDesign: `Gateway → services → datastore (+ cache/queue as needed for ${pattern}). Cover each FR before deep dives.`,
  };
}


Object.assign(DEEP, {
  bitly: {
    summary: 'Design a URL shortener: create short links, redirect fast, and track basic analytics at huge read QPS.',
    what: 'Map long URLs to short codes; GET short code returns 302 to original; optional click counts.',
    why: 'Classic warm-up that tests hashing, storage choice, cache for redirects, and write vs read asymmetry.',
    how: 'FR/NFR → encode ID to base62 → KV store → cache hot redirects → analytics async.',
    whereToUse: ['Marketing links', 'SMS links', 'Internal deep links'],
    impact: 'Redirect path must be extremely fast; DB on every redirect will not scale.',
    alternatives: ['Hash of URL with collision handling', 'Sequential IDs + base62', 'Custom aliases'],
    useCases: ['bit.ly', 't.co', 'TinyURL'],
    tip: 'Spend time on redirect caching and ID generation collisions — not on pretty UI.',
    functional: ['Create short URL', 'Redirect short → long', 'Optional custom alias', 'Basic click count'],
    nonFunctional: ['Redirect < 50–100ms', 'Highly available reads', 'Billions of redirects/day', 'Short codes reasonably short'],
    entities: ['User', 'Link (code, longUrl, createdAt)', 'ClickEvent'],
    apis: `POST /links { longUrl, customAlias? } → { code, shortUrl }
GET /{code} → 302 Location: longUrl`,
    deepDives: [
      { title: 'ID generation', body: 'Counter service, DB auto-increment + base62, or hash with retry on collision. Discuss uniqueness and predictability.' },
      { title: 'Redirect hot path', body: 'Cache code→url in Redis/CDN edge; DB is fallback. 301 vs 302 trade-off for analytics.' },
      { title: 'Analytics', body: 'Do not write clicks synchronously on redirect — queue click events and aggregate async.' },
    ],
  },
  'rate-limiter': {
    summary: 'Limit requests per key (user/IP/token) across a distributed fleet without becoming the bottleneck.',
    what: 'A service or middleware that allows or rejects requests based on quota algorithms.',
    why: 'Protects APIs from abuse and noisy neighbors; almost every large API needs it.',
    how: 'Choose algorithm (token bucket / sliding window) → centralized Redis counters → fail-open vs fail-closed → per-route limits.',
    whereToUse: ['Public APIs', 'Login endpoints', 'LLM token budgets'],
    impact: 'Wrong limits hurt UX; missing limits take down origin services.',
    alternatives: ['API gateway built-in limits', 'Envoy local rate limits', 'Quota service'],
    useCases: ['Twitter API', 'Stripe API', 'Internal platform limits'],
    tip: 'Compare token bucket vs sliding window and say where the counter lives.',
    functional: ['Check-and-consume quota', 'Configure limits per key/route', 'Return retry-after on deny'],
    nonFunctional: ['Very low added latency', 'Correct under concurrent requests', 'Survive limiter outages with a stated policy'],
    entities: ['LimitPolicy', 'CounterKey', 'Decision(allow/deny)'],
    apis: 'POST /v1/check { key, cost } → { allowed, remaining, resetAt }',
    deepDives: [
      { title: 'Algorithm choice', body: 'Token bucket allows bursts; sliding window is smoother; fixed window is simple but bursty at boundaries.' },
      { title: 'Distributed counters', body: 'Redis INCR/PEXPIRE or sorted sets for sliding window; discuss race conditions and Lua/scripts.' },
      { title: 'Failure mode', body: 'Fail-open (availability) vs fail-closed (safety). Pick based on threat model.' },
    ],
  },
  whatsapp: {
    summary: 'Design mobile messaging: 1:1 and group chat, delivery receipts, media, and presence at massive concurrency.',
    what: 'Send/receive messages in near real time with offline queues and multi-device sync.',
    why: 'Stresses realtime fan-out, connection management, and storage of huge chat histories.',
    how: 'WebSocket/MQTT gateways → message service → per-user inbox queues → media via blob store → push for offline.',
    whereToUse: ['Chat apps', 'Customer support messaging', 'Notification delivery'],
    impact: 'Connection fan-out and inbox storage dominate cost; media must not ride the chat DB.',
    alternatives: ['HTTP long polling', 'Provider-hosted chat (Twilio)', 'Email-like async only'],
    useCases: ['WhatsApp', 'Signal', 'iMessage-style'],
    tip: 'Separate chat metadata from media blobs early.',
    functional: ['1:1 messages', 'Group messages', 'Delivery/read receipts', 'Media messages', 'Offline delivery'],
    nonFunctional: ['Low latency online delivery', 'At-least-once to inbox', 'Global scale', 'End-to-end encryption optional discussion'],
    entities: ['User', 'Chat', 'Message', 'DeviceSession', 'MediaObject'],
    apis: `WS /connect
POST /messages { chatId, body }
GET /chats/{id}/messages?cursor=`,
    deepDives: [
      { title: 'Online fan-out', body: 'Connection gateway holds sockets; message service pushes to online devices; care for group fan-out.' },
      { title: 'Offline queues', body: 'Per-user inbox in durable store; drain on reconnect; dedupe by message id.' },
      { title: 'Media path', body: 'Upload to object storage, send pointer in message; CDN for download.' },
    ],
  },
  dropbox: {
    summary: 'Design cloud file sync: upload/download large files, dedupe chunks, and sync metadata across devices.',
    what: 'Users store files in folders; clients sync deltas efficiently.',
    why: 'Tests large blob handling, chunking, metadata vs block storage split.',
    how: 'Chunk files → content-addressed blocks in object store → metadata DB → notification for sync.',
    whereToUse: ['Drive products', 'Backup', 'Artifact storage'],
    impact: 'Storing whole files in SQL is a fail; chunking + dedupe saves cost and bandwidth.',
    alternatives: ['Git-like content addressing', 'rsync-style rolling hash', 'Provider SDKs'],
    useCases: ['Dropbox', 'Google Drive', 'OneDrive'],
    tip: 'Lead with chunk + metadata separation.',
    functional: ['Upload/download file', 'List folder', 'Sync changes', 'Share link optional'],
    nonFunctional: ['Large files (GBs)', 'Efficient delta sync', 'Durable storage', 'Multi-device'],
    entities: ['User', 'Namespace/Folder', 'FileMetadata', 'Block'],
    apis: `POST /files/upload-session
GET /files/{id}
GET /namespaces/{id}/delta?cursor=`,
    deepDives: [
      { title: 'Chunking & dedupe', body: 'Split into blocks, hash content, store unique blocks once in object storage.' },
      { title: 'Metadata store', body: 'Relational/metadata DB for tree; never put bytes here.' },
      { title: 'Sync protocol', body: 'Cursor-based delta API; clients apply changes; conflicts: last-writer or branch.' },
    ],
  },
  youtube: {
    summary: 'Design video upload + streaming: process encodings, store blobs, and serve via CDN at global scale.',
    what: 'Creators upload video; viewers stream adaptive bitrates worldwide.',
    why: 'Ultimate large-blob + CDN + async processing interview.',
    how: 'Upload to blob → transcoding pipeline → manifest (HLS) → CDN edge → metadata/search separate.',
    whereToUse: ['Video platforms', 'Course video', 'Live + VOD'],
    impact: 'Without CDN and async transcode, origin and UX collapse.',
    alternatives: ['Managed video (Mux/Cloudflare Stream)', 'Progressive download only'],
    useCases: ['YouTube', 'Vimeo', 'Netflix-like VOD'],
    tip: 'Separate control plane (metadata) from data plane (bytes + CDN).',
    functional: ['Upload video', 'Process multiple resolutions', 'Stream playback', 'Thumbnails/titles'],
    nonFunctional: ['Huge throughput', 'Global low startup latency', 'Cost-efficient storage cold/hot'],
    entities: ['Video', 'Encoding', 'Channel', 'ViewEvent'],
    apis: `POST /videos
POST /videos/{id}/upload
GET /videos/{id}/manifest.m3u8`,
    deepDives: [
      { title: 'Transcoding pipeline', body: 'Queue workers generate renditions; store in object storage; update metadata when ready.' },
      { title: 'CDN & adaptive streaming', body: 'HLS/DASH via CDN; hot titles cached at edge.' },
      { title: 'Hot vs cold storage', body: 'Lifecycle policies move rarely watched videos to colder tiers.' },
    ],
  },
});

function buildTopic(meta, section) {
  if (meta.kind === 'problem') return problemBody(meta, section);
  return conceptBody(meta, section);
}

// Enrich a few more deep concept/tech snippets
Object.assign(DEEP, {
  'delivery-framework': {
    summary: 'A repeatable 45-minute script: clarify → model → API → HLD → deep dives → wrap-up.',
    what: 'A timed agenda that keeps you from rabbit-holing and signals senior communication.',
    why: 'Interviewers grade process as much as the final box diagram.',
    how: '0–5 clarify, 5–12 entities/API, 12–25 HLD, 25–40 deep dives, 40–45 summary + risks.',
    whereToUse: ['Every system design interview'],
    impact: 'Candidates who follow a framework finish stronger designs more often.',
    alternatives: ['Company-specific frameworks', 'Excalidraw templates'],
    useCases: ['Mock interviews', 'Onsites'],
    tip: 'Say the agenda out loud in minute one.',
  },
  'how-to-prepare': {
    summary: 'Study concepts → drill patterns → do timed question breakdowns → review weak deep dives.',
    what: 'A prep plan focused on reusable patterns rather than memorizing one company design.',
    why: 'Random YouTube designs without timed practice do not transfer under pressure.',
    how: 'Week plan: core concepts, then 2 patterns/day, then 3 full mocks/week with self-review checklist.',
    whereToUse: ['8–12 week interview prep'],
    impact: 'Pattern fluency cuts design time so you can spend minutes on deep dives.',
    alternatives: ['Bootcamps', 'Peer mocks', 'Paid coaching'],
    useCases: ['Career switch', 'Leveling up to senior'],
    tip: 'Record yourself; fix filler and missing numbers.',
  },
  sharding: {
    summary: 'Partition data across nodes by a shard key so no single machine holds the whole dataset or QPS.',
    what: 'Horizontal partitioning of a dataset/service state.',
    why: 'Vertical scaling hits a wall; sharding is how stores grow past one box.',
    how: 'Choose shard key → pick strategy (range, hash, directory) → plan resharding → handle cross-shard queries carefully.',
    whereToUse: ['User-partitioned social graphs', 'Multi-tenant SaaS', 'High-write metrics'],
    impact: 'Bad shard keys create hot partitions; good keys scale nearly linearly.',
    alternatives: ['Read replicas only', 'Federation by service', 'Move cold data to object storage'],
    useCases: ['UserId sharding', 'TenantId sharding', 'Time-based shards for logs'],
    tip: 'Always discuss hot keys and resharding pain.',
  },
  kafka: {
    summary: 'Durable, ordered, replayable log for event streaming between services.',
    what: 'Distributed commit log with topics, partitions, consumer groups.',
    why: 'Decouples producers/consumers, absorbs spikes, enables async fan-out and stream processing.',
    how: 'Model topics by domain event → partition for parallelism → choose retention → consumer groups for competing consumers.',
    whereToUse: ['Activity streams', 'CDC pipelines', 'Async notifications', 'Metrics ingest'],
    impact: 'Turns fragile sync call chains into resilient pipelines — at the cost of eventual processing.',
    alternatives: ['SQS/PubSub', 'Pulsar', 'DB outbox + workers'],
    useCases: ['Post-create fan-out queue', 'Clickstream', 'Order events'],
    tip: 'Explain at-least-once delivery and idempotent consumers.',
  },
  redis: {
    summary: 'In-memory data structure store used as cache, session store, rate limiter, and realtime leaderboard engine.',
    what: 'Single-threaded (per instance) memory-first KV with rich types (strings, hashes, zsets, streams).',
    why: 'Sub-millisecond ops unlock feed caches, locks, and counters that DBs cannot serve at the same QPS.',
    how: 'Pick data structure → set TTL → plan eviction → decide cluster vs sentinel → handle persistence if needed.',
    whereToUse: ['Caching', 'Rate limits', 'Leaderboards', 'Pub/sub light realtime'],
    impact: 'Massive read offload; risk of stampede and treating Redis as source of truth.',
    alternatives: ['Memcached', 'Local caches', 'DynamoDB DAX', 'Application memory'],
    useCases: ['Session cache', 'Feed cache', 'Sliding window counters'],
    tip: 'Say what happens when Redis is empty or restarted.',
  },
  'scaling-reads': {
    summary: 'Techniques to serve huge read QPS: caches, replicas, CQRS, precomputation, CDNs.',
    what: 'A pattern family for read-heavy systems.',
    why: 'Most consumer apps are read-dominated; naive primary DB reads will not meet latency.',
    how: 'Measure read/write ratio → add cache → replicas → precompute views → CDN for static → shard if needed.',
    whereToUse: ['Feeds', 'Catalogs', 'Profiles', 'Search results pages'],
    impact: 'Orders-of-magnitude more QPS with the same write path.',
    alternatives: ['Scale writes less often needed; vertical scale for small apps'],
    useCases: ['News feed', 'Product detail pages'],
    tip: 'Precompute what users actually scroll (first page), not infinite history.',
  },
  'payment-system': {
    summary: 'Ledger-correct money movement with idempotency, reconciliation, and strong auditability.',
    what: 'Wallets/ledgers, payment intents, PSP integration, webhooks, and reconciliation jobs.',
    why: 'Money systems prioritize correctness over availability theatre — double-spend is unacceptable.',
    how: 'Idempotency keys → double-entry ledger → async PSP webhooks → reconciliation → exactly-once effects via inbox/outbox.',
    whereToUse: ['Checkout', 'Payouts', 'Marketplaces', 'Wallets'],
    impact: 'Bugs mean real financial loss and compliance risk.',
    alternatives: ['Fully outsource to Stripe-like PSP for MVP', 'Saga vs 2PC carefully'],
    useCases: ['Card charge', 'Refunds', 'Split payments'],
    tip: 'Lead with idempotency and ledger invariants before drawing boxes.',
    functional: ['Create payment intent', 'Capture/confirm payment', 'Refund', 'View ledger/balance'],
    nonFunctional: ['Strong correctness', 'Idempotent APIs', 'Audit trail', 'High availability for reads of status'],
    entities: ['Account', 'LedgerEntry', 'PaymentIntent', 'Payout'],
    apis: `POST /payments {amount, currency, idempotencyKey}
POST /payments/{id}/capture
POST /payments/{id}/refund
GET /accounts/{id}/ledger`,
    deepDives: [
      { title: 'Idempotency', body: 'Client idempotency keys stored with payment intent; duplicate POSTs return the same result.' },
      { title: 'Reconciliation', body: 'Nightly job compares PSP reports vs ledger; alerts on drift; never mutate history — append adjustments.' },
      { title: 'Exactly-once side effects', body: 'Transactional outbox + inbox dedupe so emails/fulfillment do not double-fire.' },
    ],
  },
});

const topics = [];
for (const section of sections) {
  for (const meta of section.topics) {
    topics.push(buildTopic(meta, section));
  }
}

const roadmapSrc = `/** System Design curriculum — Hello Interview–style (all topics unlocked) */
export type SdLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SdKind = 'guide' | 'concept' | 'tech' | 'pattern' | 'problem' | 'wild';

export type SdTopicMeta = {
  slug: string;
  title: string;
  kind: SdKind;
  level: SdLevel;
  pattern?: string;
};

export type SdSection = {
  slug: string;
  title: string;
  order: number;
  icon: string;
  overview: string;
  tip: string;
  topics: SdTopicMeta[];
};

export const sdSections: SdSection[] = ${JSON.stringify(sections, null, 2)};

export const sdTopicCount = ${topics.length};
`;

const topicsSrc = `/** System Design lesson bodies */
import type { SdKind, SdLevel } from './roadmap';

export type SdQA = { q: string; a: string };

export type SdDeepDive = { title: string; body: string };

export type SdTopic = {
  slug: string;
  title: string;
  sectionSlug: string;
  kind: SdKind;
  level: SdLevel;
  pattern: string | null;
  summary: string;
  what: string;
  why: string;
  how: string;
  whereToUse: string[];
  impact: string;
  alternatives: string[];
  useCases: string[];
  explain: string;
  interviewerQA: SdQA[];
  commonMistakes: string[];
  tradeoffs: string[];
  tip: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  entities: string[];
  apis: string;
  deepDives: SdDeepDive[];
  highLevelDesign: string;
};

export const sdTopics: SdTopic[] = ${JSON.stringify(topics, null, 2)};
`;

const indexSrc = `import { sdSections } from './roadmap';
import { sdTopics, type SdTopic } from './topics';

export type { SdTopic };
export { sdSections, sdTopics };
export { sdTopicCount } from './roadmap';

export function getSdSection(slug: string) {
  return sdSections.find((s) => s.slug === slug);
}

export function getSdTopic(slug: string) {
  return sdTopics.find((t) => t.slug === slug);
}

export function sdTopicsForSection(sectionSlug: string) {
  return sdTopics.filter((t) => t.sectionSlug === sectionSlug);
}

export function getSdSelection(slug: string | null) {
  if (!slug) return { kind: 'intro' as const };
  const section = getSdSection(slug);
  if (section) return { kind: 'section' as const, section };
  const topic = getSdTopic(slug);
  if (topic) return { kind: 'topic' as const, topic, section: getSdSection(topic.sectionSlug) };
  return { kind: 'intro' as const };
}
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'roadmap.ts'), roadmapSrc);
fs.writeFileSync(path.join(outDir, 'topics.ts'), topicsSrc);
fs.writeFileSync(path.join(outDir, 'index.ts'), indexSrc);
console.log(`Wrote ${topics.length} topics across ${sections.length} sections → ${outDir}`);
