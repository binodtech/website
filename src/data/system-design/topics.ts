/** System Design lesson bodies */
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

export const sdTopics: SdTopic[] = [
  {
    "slug": "introduction",
    "title": "Introduction",
    "sectionSlug": "in-a-hurry",
    "kind": "guide",
    "level": "Beginner",
    "pattern": null,
    "summary": "System design interviews test how you decompose ambiguous products into scalable services, data models, and clear trade-offs under time pressure.",
    "what": "A structured conversation where you clarify requirements, propose APIs and data models, draw a high-level architecture, and deepen into bottlenecks.",
    "why": "Companies hire engineers who can reason about scale, failure, and cost — not just write correct code for known inputs.",
    "how": "1. Clarify functional + non-functional requirements with numbers.\n2. Define entities and APIs.\n3. Draw a simple working design.\n4. Identify bottlenecks and deep-dive 1–3 areas.\n5. Summarize trade-offs.",
    "whereToUse": [
      "FAANG and startup onsite loops",
      "Staff promotion packets",
      "Architecture reviews at work"
    ],
    "impact": "Strong SD performance often decides senior offers; weak delivery sinks otherwise strong coding candidates.",
    "alternatives": [
      "Take-home architecture docs",
      "Pairing on real incidents",
      "Design docs in the job"
    ],
    "useCases": [
      "Design a feed",
      "Design a chat",
      "Design a payments ledger",
      "Design a rate limiter"
    ],
    "explain": "## What\nA structured conversation where you clarify requirements, propose APIs and data models, draw a high-level architecture, and deepen into bottlenecks.\n\n## Why\nCompanies hire engineers who can reason about scale, failure, and cost — not just write correct code for known inputs.\n\n## How\n1. Clarify functional + non-functional requirements with numbers.\n2. Define entities and APIs.\n3. Draw a simple working design.\n4. Identify bottlenecks and deep-dive 1–3 areas.\n5. Summarize trade-offs.\n\n## Where to use\n1. FAANG and startup onsite loops\n2. Staff promotion packets\n3. Architecture reviews at work\n\n## Impact\nStrong SD performance often decides senior offers; weak delivery sinks otherwise strong coding candidates.\n\n## Alternatives\n1. Take-home architecture docs\n2. Pairing on real incidents\n3. Design docs in the job\n\n## Use cases\n1. Design a feed\n2. Design a chat\n3. Design a payments ledger\n4. Design a rate limiter\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Introduction as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Introduction and why does it matter in interviews?",
        "a": "Introduction shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Introduction without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Breadth first, depth second. Never disappear into one component for 20 minutes.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "how-to-prepare",
    "title": "How to Prepare",
    "sectionSlug": "in-a-hurry",
    "kind": "guide",
    "level": "Beginner",
    "pattern": null,
    "summary": "Study concepts → drill patterns → do timed question breakdowns → review weak deep dives.",
    "what": "A prep plan focused on reusable patterns rather than memorizing one company design.",
    "why": "Random YouTube designs without timed practice do not transfer under pressure.",
    "how": "Week plan: core concepts, then 2 patterns/day, then 3 full mocks/week with self-review checklist.",
    "whereToUse": [
      "8–12 week interview prep"
    ],
    "impact": "Pattern fluency cuts design time so you can spend minutes on deep dives.",
    "alternatives": [
      "Bootcamps",
      "Peer mocks",
      "Paid coaching"
    ],
    "useCases": [
      "Career switch",
      "Leveling up to senior"
    ],
    "explain": "## What\nA prep plan focused on reusable patterns rather than memorizing one company design.\n\n## Why\nRandom YouTube designs without timed practice do not transfer under pressure.\n\n## How\nWeek plan: core concepts, then 2 patterns/day, then 3 full mocks/week with self-review checklist.\n\n## Where to use\n1. 8–12 week interview prep\n\n## Impact\nPattern fluency cuts design time so you can spend minutes on deep dives.\n\n## Alternatives\n1. Bootcamps\n2. Peer mocks\n3. Paid coaching\n\n## Use cases\n1. Career switch\n2. Leveling up to senior\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose How to Prepare as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is How to Prepare and why does it matter in interviews?",
        "a": "How to Prepare shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping How to Prepare without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Record yourself; fix filler and missing numbers.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "delivery-framework",
    "title": "Delivery Framework",
    "sectionSlug": "in-a-hurry",
    "kind": "guide",
    "level": "Beginner",
    "pattern": null,
    "summary": "A repeatable 45-minute script: clarify → model → API → HLD → deep dives → wrap-up.",
    "what": "A timed agenda that keeps you from rabbit-holing and signals senior communication.",
    "why": "Interviewers grade process as much as the final box diagram.",
    "how": "0–5 clarify, 5–12 entities/API, 12–25 HLD, 25–40 deep dives, 40–45 summary + risks.",
    "whereToUse": [
      "Every system design interview"
    ],
    "impact": "Candidates who follow a framework finish stronger designs more often.",
    "alternatives": [
      "Company-specific frameworks",
      "Excalidraw templates"
    ],
    "useCases": [
      "Mock interviews",
      "Onsites"
    ],
    "explain": "## What\nA timed agenda that keeps you from rabbit-holing and signals senior communication.\n\n## Why\nInterviewers grade process as much as the final box diagram.\n\n## How\n0–5 clarify, 5–12 entities/API, 12–25 HLD, 25–40 deep dives, 40–45 summary + risks.\n\n## Where to use\n1. Every system design interview\n\n## Impact\nCandidates who follow a framework finish stronger designs more often.\n\n## Alternatives\n1. Company-specific frameworks\n2. Excalidraw templates\n\n## Use cases\n1. Mock interviews\n2. Onsites\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Delivery Framework as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Delivery Framework and why does it matter in interviews?",
        "a": "Delivery Framework shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Delivery Framework without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Say the agenda out loud in minute one.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "networking-essentials",
    "title": "Networking Essentials",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Beginner",
    "pattern": null,
    "summary": "Networking Essentials: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Networking Essentials is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Networking Essentials helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Networking Essentials addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need networking essentials to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Networking Essentials can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Networking Essentials",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nNetworking Essentials is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Networking Essentials helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Networking Essentials addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need networking essentials to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Networking Essentials can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Networking Essentials\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Networking Essentials as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Networking Essentials and why does it matter in interviews?",
        "a": "Networking Essentials shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Networking Essentials without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "api-design",
    "title": "API Design",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Beginner",
    "pattern": null,
    "summary": "API Design: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "API Design is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when API Design helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that API Design addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need api design to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of API Design can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving API Design",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nAPI Design is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when API Design helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that API Design addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need api design to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of API Design can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving API Design\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose API Design as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is API Design and why does it matter in interviews?",
        "a": "API Design shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping API Design without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "data-modeling",
    "title": "Data Modeling",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Data Modeling: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Data Modeling is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Data Modeling helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Data Modeling addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need data modeling to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Data Modeling can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Data Modeling",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nData Modeling is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Data Modeling helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Data Modeling addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need data modeling to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Data Modeling can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Data Modeling\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Data Modeling as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Data Modeling and why does it matter in interviews?",
        "a": "Data Modeling shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Data Modeling without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "caching",
    "title": "Caching",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Caching stores hot data closer to the caller to cut latency and load on primary stores — at the cost of freshness and complexity.",
    "what": "A layer (client, CDN, reverse proxy, app memory, or Redis/Memcached) that serves previously computed or fetched data faster than the source of truth.",
    "why": "Databases and remote services are often 10–100× slower than a cache hit. At high QPS, caching is how you meet <100–500ms latency budgets.",
    "how": "1. Identify hot keys and read/write ratio.\n2. Choose placement (CDN vs edge vs app vs shared Redis).\n3. Pick strategy: cache-aside, read-through, write-through, write-behind.\n4. Set TTL + eviction (LRU/LFU).\n5. Plan invalidation on writes and stampede protection.",
    "whereToUse": [
      "News feeds",
      "Session stores",
      "Product catalogs",
      "Config and feature flags",
      "CDN for static + video"
    ],
    "impact": "Can drop p99 latency from tens of ms to ~1ms and reduce DB load by orders of magnitude — if invalidation is correct.",
    "alternatives": [
      "Materialized views / precompute",
      "Read replicas",
      "In-memory application state",
      "Faster primary store"
    ],
    "useCases": [
      "Redis for feed timelines",
      "CDN for images",
      "Local process cache for configs"
    ],
    "explain": "## What\nA layer (client, CDN, reverse proxy, app memory, or Redis/Memcached) that serves previously computed or fetched data faster than the source of truth.\n\n## Why\nDatabases and remote services are often 10–100× slower than a cache hit. At high QPS, caching is how you meet <100–500ms latency budgets.\n\n## How\n1. Identify hot keys and read/write ratio.\n2. Choose placement (CDN vs edge vs app vs shared Redis).\n3. Pick strategy: cache-aside, read-through, write-through, write-behind.\n4. Set TTL + eviction (LRU/LFU).\n5. Plan invalidation on writes and stampede protection.\n\n## Where to use\n1. News feeds\n2. Session stores\n3. Product catalogs\n4. Config and feature flags\n5. CDN for static + video\n\n## Impact\nCan drop p99 latency from tens of ms to ~1ms and reduce DB load by orders of magnitude — if invalidation is correct.\n\n## Alternatives\n1. Materialized views / precompute\n2. Read replicas\n3. In-memory application state\n4. Faster primary store\n\n## Use cases\n1. Redis for feed timelines\n2. CDN for images\n3. Local process cache for configs\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Caching as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Caching and why does it matter in interviews?",
        "a": "Caching shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Caching without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Always say what happens on write and how you avoid thundering herds.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "sharding",
    "title": "Sharding",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Partition data across nodes by a shard key so no single machine holds the whole dataset or QPS.",
    "what": "Horizontal partitioning of a dataset/service state.",
    "why": "Vertical scaling hits a wall; sharding is how stores grow past one box.",
    "how": "Choose shard key → pick strategy (range, hash, directory) → plan resharding → handle cross-shard queries carefully.",
    "whereToUse": [
      "User-partitioned social graphs",
      "Multi-tenant SaaS",
      "High-write metrics"
    ],
    "impact": "Bad shard keys create hot partitions; good keys scale nearly linearly.",
    "alternatives": [
      "Read replicas only",
      "Federation by service",
      "Move cold data to object storage"
    ],
    "useCases": [
      "UserId sharding",
      "TenantId sharding",
      "Time-based shards for logs"
    ],
    "explain": "## What\nHorizontal partitioning of a dataset/service state.\n\n## Why\nVertical scaling hits a wall; sharding is how stores grow past one box.\n\n## How\nChoose shard key → pick strategy (range, hash, directory) → plan resharding → handle cross-shard queries carefully.\n\n## Where to use\n1. User-partitioned social graphs\n2. Multi-tenant SaaS\n3. High-write metrics\n\n## Impact\nBad shard keys create hot partitions; good keys scale nearly linearly.\n\n## Alternatives\n1. Read replicas only\n2. Federation by service\n3. Move cold data to object storage\n\n## Use cases\n1. UserId sharding\n2. TenantId sharding\n3. Time-based shards for logs\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Sharding as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Sharding and why does it matter in interviews?",
        "a": "Sharding shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Sharding without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Always discuss hot keys and resharding pain.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "consistent-hashing",
    "title": "Consistent Hashing",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Consistent Hashing: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Consistent Hashing is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Consistent Hashing helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Consistent Hashing addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need consistent hashing to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Consistent Hashing can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Consistent Hashing",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nConsistent Hashing is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Consistent Hashing helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Consistent Hashing addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need consistent hashing to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Consistent Hashing can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Consistent Hashing\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Consistent Hashing as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Consistent Hashing and why does it matter in interviews?",
        "a": "Consistent Hashing shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Consistent Hashing without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "cap-theorem",
    "title": "CAP Theorem",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Beginner",
    "pattern": null,
    "summary": "CAP Theorem: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "CAP Theorem is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when CAP Theorem helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that CAP Theorem addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need cap theorem to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of CAP Theorem can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving CAP Theorem",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nCAP Theorem is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when CAP Theorem helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that CAP Theorem addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need cap theorem to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of CAP Theorem can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving CAP Theorem\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose CAP Theorem as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is CAP Theorem and why does it matter in interviews?",
        "a": "CAP Theorem shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping CAP Theorem without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "database-indexing",
    "title": "Database Indexing",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Database Indexing: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Database Indexing is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Database Indexing helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Database Indexing addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need database indexing to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Database Indexing can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Database Indexing",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nDatabase Indexing is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Database Indexing helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Database Indexing addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need database indexing to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Database Indexing can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Database Indexing\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Database Indexing as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Database Indexing and why does it matter in interviews?",
        "a": "Database Indexing shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Database Indexing without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "numbers-to-know",
    "title": "Numbers to Know",
    "sectionSlug": "core-concepts",
    "kind": "concept",
    "level": "Beginner",
    "pattern": null,
    "summary": "Numbers to Know: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Numbers to Know is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Numbers to Know helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Numbers to Know addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need numbers to know to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Numbers to Know can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Numbers to Know",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nNumbers to Know is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Numbers to Know helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Numbers to Know addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need numbers to know to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Numbers to Know can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Numbers to Know\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Numbers to Know as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Numbers to Know and why does it matter in interviews?",
        "a": "Numbers to Know shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Numbers to Know without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "redis",
    "title": "Redis",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Intermediate",
    "pattern": null,
    "summary": "In-memory data structure store used as cache, session store, rate limiter, and realtime leaderboard engine.",
    "what": "Single-threaded (per instance) memory-first KV with rich types (strings, hashes, zsets, streams).",
    "why": "Sub-millisecond ops unlock feed caches, locks, and counters that DBs cannot serve at the same QPS.",
    "how": "Pick data structure → set TTL → plan eviction → decide cluster vs sentinel → handle persistence if needed.",
    "whereToUse": [
      "Caching",
      "Rate limits",
      "Leaderboards",
      "Pub/sub light realtime"
    ],
    "impact": "Massive read offload; risk of stampede and treating Redis as source of truth.",
    "alternatives": [
      "Memcached",
      "Local caches",
      "DynamoDB DAX",
      "Application memory"
    ],
    "useCases": [
      "Session cache",
      "Feed cache",
      "Sliding window counters"
    ],
    "explain": "## What\nSingle-threaded (per instance) memory-first KV with rich types (strings, hashes, zsets, streams).\n\n## Why\nSub-millisecond ops unlock feed caches, locks, and counters that DBs cannot serve at the same QPS.\n\n## How\nPick data structure → set TTL → plan eviction → decide cluster vs sentinel → handle persistence if needed.\n\n## Where to use\n1. Caching\n2. Rate limits\n3. Leaderboards\n4. Pub/sub light realtime\n\n## Impact\nMassive read offload; risk of stampede and treating Redis as source of truth.\n\n## Alternatives\n1. Memcached\n2. Local caches\n3. DynamoDB DAX\n4. Application memory\n\n## Use cases\n1. Session cache\n2. Feed cache\n3. Sliding window counters\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Redis as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Redis and why does it matter in interviews?",
        "a": "Redis shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use Redis?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping Redis without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Say what happens when Redis is empty or restarted.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "elasticsearch",
    "title": "Elasticsearch",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Elasticsearch: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Elasticsearch is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Elasticsearch helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Elasticsearch addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need elasticsearch to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Elasticsearch can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Elasticsearch",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nElasticsearch is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Elasticsearch helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Elasticsearch addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need elasticsearch to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Elasticsearch can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Elasticsearch\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Elasticsearch as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Elasticsearch and why does it matter in interviews?",
        "a": "Elasticsearch shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use Elasticsearch?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping Elasticsearch without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "kafka",
    "title": "Kafka",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Durable, ordered, replayable log for event streaming between services.",
    "what": "Distributed commit log with topics, partitions, consumer groups.",
    "why": "Decouples producers/consumers, absorbs spikes, enables async fan-out and stream processing.",
    "how": "Model topics by domain event → partition for parallelism → choose retention → consumer groups for competing consumers.",
    "whereToUse": [
      "Activity streams",
      "CDC pipelines",
      "Async notifications",
      "Metrics ingest"
    ],
    "impact": "Turns fragile sync call chains into resilient pipelines — at the cost of eventual processing.",
    "alternatives": [
      "SQS/PubSub",
      "Pulsar",
      "DB outbox + workers"
    ],
    "useCases": [
      "Post-create fan-out queue",
      "Clickstream",
      "Order events"
    ],
    "explain": "## What\nDistributed commit log with topics, partitions, consumer groups.\n\n## Why\nDecouples producers/consumers, absorbs spikes, enables async fan-out and stream processing.\n\n## How\nModel topics by domain event → partition for parallelism → choose retention → consumer groups for competing consumers.\n\n## Where to use\n1. Activity streams\n2. CDC pipelines\n3. Async notifications\n4. Metrics ingest\n\n## Impact\nTurns fragile sync call chains into resilient pipelines — at the cost of eventual processing.\n\n## Alternatives\n1. SQS/PubSub\n2. Pulsar\n3. DB outbox + workers\n\n## Use cases\n1. Post-create fan-out queue\n2. Clickstream\n3. Order events\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Kafka as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Kafka and why does it matter in interviews?",
        "a": "Kafka shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use Kafka?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping Kafka without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Explain at-least-once delivery and idempotent consumers.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "api-gateway",
    "title": "API Gateway",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Beginner",
    "pattern": null,
    "summary": "API Gateway: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "API Gateway is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when API Gateway helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that API Gateway addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need api gateway to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of API Gateway can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving API Gateway",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nAPI Gateway is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when API Gateway helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that API Gateway addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need api gateway to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of API Gateway can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving API Gateway\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose API Gateway as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is API Gateway and why does it matter in interviews?",
        "a": "API Gateway shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use API Gateway?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping API Gateway without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "cassandra",
    "title": "Cassandra",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Advanced",
    "pattern": null,
    "summary": "Cassandra: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Cassandra is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Cassandra helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Cassandra addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need cassandra to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Cassandra can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Cassandra",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nCassandra is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Cassandra helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Cassandra addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need cassandra to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Cassandra can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Cassandra\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Cassandra as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Cassandra and why does it matter in interviews?",
        "a": "Cassandra shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use Cassandra?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping Cassandra without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "dynamodb",
    "title": "DynamoDB",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Intermediate",
    "pattern": null,
    "summary": "DynamoDB: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "DynamoDB is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when DynamoDB helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that DynamoDB addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need dynamodb to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of DynamoDB can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving DynamoDB",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nDynamoDB is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when DynamoDB helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that DynamoDB addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need dynamodb to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of DynamoDB can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving DynamoDB\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose DynamoDB as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is DynamoDB and why does it matter in interviews?",
        "a": "DynamoDB shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use DynamoDB?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping DynamoDB without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "postgresql",
    "title": "PostgreSQL",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Beginner",
    "pattern": null,
    "summary": "PostgreSQL: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "PostgreSQL is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when PostgreSQL helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that PostgreSQL addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need postgresql to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of PostgreSQL can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving PostgreSQL",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nPostgreSQL is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when PostgreSQL helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that PostgreSQL addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need postgresql to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of PostgreSQL can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving PostgreSQL\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose PostgreSQL as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is PostgreSQL and why does it matter in interviews?",
        "a": "PostgreSQL shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use PostgreSQL?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping PostgreSQL without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "flink",
    "title": "Flink",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Advanced",
    "pattern": null,
    "summary": "Flink: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Flink is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Flink helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Flink addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need flink to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Flink can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Flink",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nFlink is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Flink helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Flink addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need flink to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Flink can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Flink\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Flink as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Flink and why does it matter in interviews?",
        "a": "Flink shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use Flink?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping Flink without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "zookeeper",
    "title": "ZooKeeper",
    "sectionSlug": "key-technologies",
    "kind": "tech",
    "level": "Advanced",
    "pattern": null,
    "summary": "ZooKeeper: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "ZooKeeper is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when ZooKeeper helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that ZooKeeper addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need zookeeper to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of ZooKeeper can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving ZooKeeper",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nZooKeeper is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when ZooKeeper helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that ZooKeeper addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need zookeeper to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of ZooKeeper can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving ZooKeeper\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose ZooKeeper as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is ZooKeeper and why does it matter in interviews?",
        "a": "ZooKeeper shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "When would you NOT use ZooKeeper?",
        "a": "When another tool fits the access pattern better (e.g. do not use a search engine as a primary OLTP store, or a cache as the only source of truth)."
      }
    ],
    "commonMistakes": [
      "Name-dropping ZooKeeper without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "real-time-updates",
    "title": "Real-time Updates",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Real-time Updates: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Real-time Updates is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Real-time Updates helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Real-time Updates addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need real-time updates to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Real-time Updates can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Real-time Updates",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nReal-time Updates is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Real-time Updates helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Real-time Updates addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need real-time updates to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Real-time Updates can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Real-time Updates\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Real-time Updates as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Real-time Updates and why does it matter in interviews?",
        "a": "Real-time Updates shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Real-time Updates without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "dealing-with-contention",
    "title": "Dealing with Contention",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Advanced",
    "pattern": null,
    "summary": "Dealing with Contention: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Dealing with Contention is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Dealing with Contention helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Dealing with Contention addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need dealing with contention to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Dealing with Contention can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Dealing with Contention",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nDealing with Contention is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Dealing with Contention helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Dealing with Contention addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need dealing with contention to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Dealing with Contention can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Dealing with Contention\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Dealing with Contention as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Dealing with Contention and why does it matter in interviews?",
        "a": "Dealing with Contention shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Dealing with Contention without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "multi-step-processes",
    "title": "Multi-step Processes",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Multi-step Processes: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Multi-step Processes is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Multi-step Processes helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Multi-step Processes addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need multi-step processes to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Multi-step Processes can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Multi-step Processes",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nMulti-step Processes is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Multi-step Processes helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Multi-step Processes addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need multi-step processes to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Multi-step Processes can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Multi-step Processes\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Multi-step Processes as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Multi-step Processes and why does it matter in interviews?",
        "a": "Multi-step Processes shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Multi-step Processes without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "scaling-reads",
    "title": "Scaling Reads",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Techniques to serve huge read QPS: caches, replicas, CQRS, precomputation, CDNs.",
    "what": "A pattern family for read-heavy systems.",
    "why": "Most consumer apps are read-dominated; naive primary DB reads will not meet latency.",
    "how": "Measure read/write ratio → add cache → replicas → precompute views → CDN for static → shard if needed.",
    "whereToUse": [
      "Feeds",
      "Catalogs",
      "Profiles",
      "Search results pages"
    ],
    "impact": "Orders-of-magnitude more QPS with the same write path.",
    "alternatives": [
      "Scale writes less often needed; vertical scale for small apps"
    ],
    "useCases": [
      "News feed",
      "Product detail pages"
    ],
    "explain": "## What\nA pattern family for read-heavy systems.\n\n## Why\nMost consumer apps are read-dominated; naive primary DB reads will not meet latency.\n\n## How\nMeasure read/write ratio → add cache → replicas → precompute views → CDN for static → shard if needed.\n\n## Where to use\n1. Feeds\n2. Catalogs\n3. Profiles\n4. Search results pages\n\n## Impact\nOrders-of-magnitude more QPS with the same write path.\n\n## Alternatives\n1. Scale writes less often needed; vertical scale for small apps\n\n## Use cases\n1. News feed\n2. Product detail pages\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Scaling Reads as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Scaling Reads and why does it matter in interviews?",
        "a": "Scaling Reads shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Scaling Reads without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Precompute what users actually scroll (first page), not infinite history.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "scaling-writes",
    "title": "Scaling Writes",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Scaling Writes: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Scaling Writes is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Scaling Writes helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Scaling Writes addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need scaling writes to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Scaling Writes can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Scaling Writes",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nScaling Writes is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Scaling Writes helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Scaling Writes addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need scaling writes to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Scaling Writes can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Scaling Writes\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Scaling Writes as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Scaling Writes and why does it matter in interviews?",
        "a": "Scaling Writes shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Scaling Writes without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "handling-large-blobs",
    "title": "Handling Large Blobs",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Handling Large Blobs: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Handling Large Blobs is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Handling Large Blobs helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Handling Large Blobs addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need handling large blobs to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Handling Large Blobs can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Handling Large Blobs",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nHandling Large Blobs is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Handling Large Blobs helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Handling Large Blobs addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need handling large blobs to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Handling Large Blobs can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Handling Large Blobs\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Handling Large Blobs as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Handling Large Blobs and why does it matter in interviews?",
        "a": "Handling Large Blobs shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Handling Large Blobs without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "managing-long-running-tasks",
    "title": "Managing Long Running Tasks",
    "sectionSlug": "common-patterns",
    "kind": "pattern",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Managing Long Running Tasks: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Managing Long Running Tasks is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Managing Long Running Tasks helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Managing Long Running Tasks addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need managing long running tasks to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Managing Long Running Tasks can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Managing Long Running Tasks",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nManaging Long Running Tasks is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Managing Long Running Tasks helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Managing Long Running Tasks addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need managing long running tasks to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Managing Long Running Tasks can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Managing Long Running Tasks\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Managing Long Running Tasks as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Managing Long Running Tasks and why does it matter in interviews?",
        "a": "Managing Long Running Tasks shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Managing Long Running Tasks without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "bitly",
    "title": "Bitly (URL Shortener)",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Beginner",
    "pattern": "Scaling Reads",
    "summary": "Design a URL shortener: create short links, redirect fast, and track basic analytics at huge read QPS.",
    "what": "Map long URLs to short codes; GET short code returns 302 to original; optional click counts.",
    "why": "Classic warm-up that tests hashing, storage choice, cache for redirects, and write vs read asymmetry.",
    "how": "FR/NFR → encode ID to base62 → KV store → cache hot redirects → analytics async.",
    "whereToUse": [
      "Marketing links",
      "SMS links",
      "Internal deep links"
    ],
    "impact": "Redirect path must be extremely fast; DB on every redirect will not scale.",
    "alternatives": [
      "Hash of URL with collision handling",
      "Sequential IDs + base62",
      "Custom aliases"
    ],
    "useCases": [
      "bit.ly",
      "t.co",
      "TinyURL"
    ],
    "explain": "## Understanding the problem\nMap long URLs to short codes; GET short code returns 302 to original; optional click counts.\n\n## Functional requirements\n1. Create short URL\n2. Redirect short → long\n3. Optional custom alias\n4. Basic click count\n\n## Non-functional requirements\n1. Redirect < 50–100ms\n2. Highly available reads\n3. Billions of redirects/day\n4. Short codes reasonably short\n\n## Why this question\nClassic warm-up that tests hashing, storage choice, cache for redirects, and write vs read asymmetry.\n\n## How to approach (45 minutes)\nFR/NFR → encode ID to base62 → KV store → cache hot redirects → analytics async.\n\n## Core entities\n1. User\n2. Link (code, longUrl, createdAt)\n3. ClickEvent\n\n## API / system interface\n```\nPOST /links { longUrl, customAlias? } → { code, shortUrl }\nGET /{code} → 302 Location: longUrl\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. ID generation\nCounter service, DB auto-increment + base62, or hash with retry on collision. Discuss uniqueness and predictability.\n\n### 2. Redirect hot path\nCache code→url in Redis/CDN edge; DB is fallback. 301 vs 302 trade-off for analytics.\n\n### 3. Analytics\nDo not write clicks synchronously on redirect — queue click events and aggregate async.\n\n## Where this pattern appears\n1. Marketing links\n2. SMS links\n3. Internal deep links\n\n## Impact if you get it wrong\nRedirect path must be extremely fast; DB on every redirect will not scale.\n\n## Alternatives\n1. Hash of URL with collision handling\n2. Sequential IDs + base62\n3. Custom aliases\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Bitly (URL Shortener) and why does it matter in interviews?",
        "a": "Bitly (URL Shortener) shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Bitly",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Spend time on redirect caching and ID generation collisions — not on pretty UI.",
    "functionalRequirements": [
      "Create short URL",
      "Redirect short → long",
      "Optional custom alias",
      "Basic click count"
    ],
    "nonFunctionalRequirements": [
      "Redirect < 50–100ms",
      "Highly available reads",
      "Billions of redirects/day",
      "Short codes reasonably short"
    ],
    "entities": [
      "User",
      "Link (code, longUrl, createdAt)",
      "ClickEvent"
    ],
    "apis": "POST /links { longUrl, customAlias? } → { code, shortUrl }\nGET /{code} → 302 Location: longUrl",
    "deepDives": [
      {
        "title": "ID generation",
        "body": "Counter service, DB auto-increment + base62, or hash with retry on collision. Discuss uniqueness and predictability."
      },
      {
        "title": "Redirect hot path",
        "body": "Cache code→url in Redis/CDN edge; DB is fallback. 301 vs 302 trade-off for analytics."
      },
      {
        "title": "Analytics",
        "body": "Do not write clicks synchronously on redirect — queue click events and aggregate async."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "dropbox",
    "title": "Dropbox",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Handling Large Blobs",
    "summary": "Design cloud file sync: upload/download large files, dedupe chunks, and sync metadata across devices.",
    "what": "Users store files in folders; clients sync deltas efficiently.",
    "why": "Tests large blob handling, chunking, metadata vs block storage split.",
    "how": "Chunk files → content-addressed blocks in object store → metadata DB → notification for sync.",
    "whereToUse": [
      "Drive products",
      "Backup",
      "Artifact storage"
    ],
    "impact": "Storing whole files in SQL is a fail; chunking + dedupe saves cost and bandwidth.",
    "alternatives": [
      "Git-like content addressing",
      "rsync-style rolling hash",
      "Provider SDKs"
    ],
    "useCases": [
      "Dropbox",
      "Google Drive",
      "OneDrive"
    ],
    "explain": "## Understanding the problem\nUsers store files in folders; clients sync deltas efficiently.\n\n## Functional requirements\n1. Upload/download file\n2. List folder\n3. Sync changes\n4. Share link optional\n\n## Non-functional requirements\n1. Large files (GBs)\n2. Efficient delta sync\n3. Durable storage\n4. Multi-device\n\n## Why this question\nTests large blob handling, chunking, metadata vs block storage split.\n\n## How to approach (45 minutes)\nChunk files → content-addressed blocks in object store → metadata DB → notification for sync.\n\n## Core entities\n1. User\n2. Namespace/Folder\n3. FileMetadata\n4. Block\n\n## API / system interface\n```\nPOST /files/upload-session\nGET /files/{id}\nGET /namespaces/{id}/delta?cursor=\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Handling Large Blobs pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Chunking & dedupe\nSplit into blocks, hash content, store unique blocks once in object storage.\n\n### 2. Metadata store\nRelational/metadata DB for tree; never put bytes here.\n\n### 3. Sync protocol\nCursor-based delta API; clients apply changes; conflicts: last-writer or branch.\n\n## Where this pattern appears\n1. Drive products\n2. Backup\n3. Artifact storage\n\n## Impact if you get it wrong\nStoring whole files in SQL is a fail; chunking + dedupe saves cost and bandwidth.\n\n## Alternatives\n1. Git-like content addressing\n2. rsync-style rolling hash\n3. Provider SDKs\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Dropbox and why does it matter in interviews?",
        "a": "Dropbox shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Dropbox",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with chunk + metadata separation.",
    "functionalRequirements": [
      "Upload/download file",
      "List folder",
      "Sync changes",
      "Share link optional"
    ],
    "nonFunctionalRequirements": [
      "Large files (GBs)",
      "Efficient delta sync",
      "Durable storage",
      "Multi-device"
    ],
    "entities": [
      "User",
      "Namespace/Folder",
      "FileMetadata",
      "Block"
    ],
    "apis": "POST /files/upload-session\nGET /files/{id}\nGET /namespaces/{id}/delta?cursor=",
    "deepDives": [
      {
        "title": "Chunking & dedupe",
        "body": "Split into blocks, hash content, store unique blocks once in object storage."
      },
      {
        "title": "Metadata store",
        "body": "Relational/metadata DB for tree; never put bytes here."
      },
      {
        "title": "Sync protocol",
        "body": "Cursor-based delta API; clients apply changes; conflicts: last-writer or branch."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Handling Large Blobs). Cover each FR before deep dives."
  },
  {
    "slug": "local-delivery-service",
    "title": "Local Delivery Service",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Real-time Updates",
    "summary": "Interview breakdown for Local Delivery Service — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Local Delivery Service: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Local Delivery Service is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Local Delivery Service",
      "Production systems similar to Local Delivery Service"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Local Delivery Service's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Local Delivery Service",
      "Variants of Local Delivery Service in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Local Delivery Service: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Local Delivery Service\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nLocal Delivery Service is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. LocalDeliveryServiceEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Local Delivery Service)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Local Delivery Service\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Local Delivery Service\n2. Any system needing Real-time Updates\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Local Delivery Service and why does it matter in interviews?",
        "a": "Local Delivery Service shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Local Delivery Service",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Real-time Updates pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Local Delivery Service",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "LocalDeliveryServiceEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Local Delivery Service)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Local Delivery Service",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "ticketmaster",
    "title": "Ticketmaster",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Dealing with Contention",
    "summary": "Interview breakdown for Ticketmaster — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Ticketmaster: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Ticketmaster is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Ticketmaster",
      "Production systems similar to Ticketmaster"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Ticketmaster's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Ticketmaster",
      "Variants of Ticketmaster in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Ticketmaster: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Ticketmaster\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nTicketmaster is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. TicketmasterEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Ticketmaster)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Dealing with Contention pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Ticketmaster\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Ticketmaster\n2. Any system needing Dealing with Contention\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Ticketmaster and why does it matter in interviews?",
        "a": "Ticketmaster shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Ticketmaster",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Dealing with Contention pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Ticketmaster",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "TicketmasterEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Ticketmaster)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Ticketmaster",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Dealing with Contention). Cover each FR before deep dives."
  },
  {
    "slug": "fb-news-feed",
    "title": "FB News Feed",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Scaling Reads",
    "summary": "Design a reverse-chronological feed of posts from people you follow — the classic fan-out / scaling-reads interview.",
    "what": "Users create posts and follow others; viewing the feed returns recent posts from followees with pagination.",
    "why": "Tests whether you can move from a naive fan-out-on-read design to hybrid fan-out, async workers, and hot-key caching under billions of users.",
    "how": "Clarify FR/NFR → entities (User, Follow, Post) → APIs → naive design → deep dive celebrity/fan-out → hybrid precompute + merge → post cache.",
    "whereToUse": [
      "Social feeds",
      "Activity streams",
      "Notification inboxes"
    ],
    "impact": "Wrong fan-out strategy fails either latency (read path) or write amplification (celebrity posts).",
    "alternatives": [
      "Pure fan-out on read for small graphs",
      "Pure fan-out on write for small follow counts",
      "Ranked feeds (ML) instead of chrono"
    ],
    "useCases": [
      "Facebook/Instagram chrono feed",
      "Twitter/X home timeline",
      "LinkedIn feed"
    ],
    "explain": "## Understanding the problem\nUsers create posts and follow others; viewing the feed returns recent posts from followees with pagination.\n\n## Functional requirements\n1. Users can create posts\n2. Users can follow other users\n3. Users can view a reverse-chronological feed of followees\n4. Users can page through the feed (cursor)\n\n## Non-functional requirements\n1. Highly available; tolerate ~1 minute post staleness\n2. Post + feed view < 500ms\n3. Scale to ~2B users\n4. Unlimited follows / followers (discuss product caps)\n\n## Why this question\nTests whether you can move from a naive fan-out-on-read design to hybrid fan-out, async workers, and hot-key caching under billions of users.\n\n## How to approach (45 minutes)\nClarify FR/NFR → entities (User, Follow, Post) → APIs → naive design → deep dive celebrity/fan-out → hybrid precompute + merge → post cache.\n\n## Core entities\n1. User\n2. Follow (follower → followee)\n3. Post\n4. PrecomputedFeed (optional)\n\n## API / system interface\n```\nPOST /posts { content } → { postId }\nPUT /users/{id}/follow\nGET /feed?pageSize=&cursor= → { items, nextCursor }\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Users following many accounts (fan-out on read)\nNaive: query all followees then merge posts — too many reads. Fix: precompute feeds on write for most users; cap product follows; fall back to on-read merge for deep pages.\n\n### 2. Celebrity / mega-follower writes (fan-out on write)\nDo not blast millions of feed writes synchronously. Queue async workers; for mega accounts skip precompute and merge their recent posts at read time (hybrid).\n\n### 3. Hot posts / uneven read load\nCache posts in Redis. Prefer redundant (replicated) cache instances over single-shard keys so viral posts do not melt one partition.\n\n## Where this pattern appears\n1. Social feeds\n2. Activity streams\n3. Notification inboxes\n\n## Impact if you get it wrong\nWrong fan-out strategy fails either latency (read path) or write amplification (celebrity posts).\n\n## Alternatives\n1. Pure fan-out on read for small graphs\n2. Pure fan-out on write for small follow counts\n3. Ranked feeds (ML) instead of chrono\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is FB News Feed and why does it matter in interviews?",
        "a": "FB News Feed shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for FB News Feed",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "State eventual consistency (e.g. 1 minute staleness) early — it unlocks async fan-out.",
    "functionalRequirements": [
      "Users can create posts",
      "Users can follow other users",
      "Users can view a reverse-chronological feed of followees",
      "Users can page through the feed (cursor)"
    ],
    "nonFunctionalRequirements": [
      "Highly available; tolerate ~1 minute post staleness",
      "Post + feed view < 500ms",
      "Scale to ~2B users",
      "Unlimited follows / followers (discuss product caps)"
    ],
    "entities": [
      "User",
      "Follow (follower → followee)",
      "Post",
      "PrecomputedFeed (optional)"
    ],
    "apis": "POST /posts { content } → { postId }\nPUT /users/{id}/follow\nGET /feed?pageSize=&cursor= → { items, nextCursor }",
    "deepDives": [
      {
        "title": "Users following many accounts (fan-out on read)",
        "body": "Naive: query all followees then merge posts — too many reads. Fix: precompute feeds on write for most users; cap product follows; fall back to on-read merge for deep pages."
      },
      {
        "title": "Celebrity / mega-follower writes (fan-out on write)",
        "body": "Do not blast millions of feed writes synchronously. Queue async workers; for mega accounts skip precompute and merge their recent posts at read time (hybrid)."
      },
      {
        "title": "Hot posts / uneven read load",
        "body": "Cache posts in Redis. Prefer redundant (replicated) cache instances over single-shard keys so viral posts do not melt one partition."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "tinder",
    "title": "Tinder",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for Tinder — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Tinder: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Tinder is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Tinder",
      "Production systems similar to Tinder"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Tinder's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Tinder",
      "Variants of Tinder in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Tinder: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Tinder\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nTinder is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. TinderEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Tinder)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Tinder\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Tinder\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Tinder and why does it matter in interviews?",
        "a": "Tinder shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Tinder",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Tinder",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "TinderEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Tinder)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Tinder",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "leetcode",
    "title": "LeetCode",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Multi-step Processes",
    "summary": "Interview breakdown for LeetCode — requirements, API, design, deep dives, and Q&A.",
    "what": "Design LeetCode: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "LeetCode is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Multi-step Processes).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Multi-step Processes).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design LeetCode",
      "Production systems similar to LeetCode"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under LeetCode's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "LeetCode",
      "Variants of LeetCode in other companies"
    ],
    "explain": "## Understanding the problem\nDesign LeetCode: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for LeetCode\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nLeetCode is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Multi-step Processes).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Multi-step Processes).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. LeetCodeEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for LeetCode)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Multi-step Processes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for LeetCode\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Multi-step Processes.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like LeetCode\n2. Any system needing Multi-step Processes\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is LeetCode and why does it matter in interviews?",
        "a": "LeetCode shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for LeetCode",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Multi-step Processes pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for LeetCode",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "LeetCodeEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for LeetCode)",
    "deepDives": [
      {
        "title": "Primary bottleneck for LeetCode",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Multi-step Processes."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Multi-step Processes). Cover each FR before deep dives."
  },
  {
    "slug": "whatsapp",
    "title": "WhatsApp",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Real-time Updates",
    "summary": "Design mobile messaging: 1:1 and group chat, delivery receipts, media, and presence at massive concurrency.",
    "what": "Send/receive messages in near real time with offline queues and multi-device sync.",
    "why": "Stresses realtime fan-out, connection management, and storage of huge chat histories.",
    "how": "WebSocket/MQTT gateways → message service → per-user inbox queues → media via blob store → push for offline.",
    "whereToUse": [
      "Chat apps",
      "Customer support messaging",
      "Notification delivery"
    ],
    "impact": "Connection fan-out and inbox storage dominate cost; media must not ride the chat DB.",
    "alternatives": [
      "HTTP long polling",
      "Provider-hosted chat (Twilio)",
      "Email-like async only"
    ],
    "useCases": [
      "WhatsApp",
      "Signal",
      "iMessage-style"
    ],
    "explain": "## Understanding the problem\nSend/receive messages in near real time with offline queues and multi-device sync.\n\n## Functional requirements\n1. 1:1 messages\n2. Group messages\n3. Delivery/read receipts\n4. Media messages\n5. Offline delivery\n\n## Non-functional requirements\n1. Low latency online delivery\n2. At-least-once to inbox\n3. Global scale\n4. End-to-end encryption optional discussion\n\n## Why this question\nStresses realtime fan-out, connection management, and storage of huge chat histories.\n\n## How to approach (45 minutes)\nWebSocket/MQTT gateways → message service → per-user inbox queues → media via blob store → push for offline.\n\n## Core entities\n1. User\n2. Chat\n3. Message\n4. DeviceSession\n5. MediaObject\n\n## API / system interface\n```\nWS /connect\nPOST /messages { chatId, body }\nGET /chats/{id}/messages?cursor=\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Online fan-out\nConnection gateway holds sockets; message service pushes to online devices; care for group fan-out.\n\n### 2. Offline queues\nPer-user inbox in durable store; drain on reconnect; dedupe by message id.\n\n### 3. Media path\nUpload to object storage, send pointer in message; CDN for download.\n\n## Where this pattern appears\n1. Chat apps\n2. Customer support messaging\n3. Notification delivery\n\n## Impact if you get it wrong\nConnection fan-out and inbox storage dominate cost; media must not ride the chat DB.\n\n## Alternatives\n1. HTTP long polling\n2. Provider-hosted chat (Twilio)\n3. Email-like async only\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is WhatsApp and why does it matter in interviews?",
        "a": "WhatsApp shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for WhatsApp",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Separate chat metadata from media blobs early.",
    "functionalRequirements": [
      "1:1 messages",
      "Group messages",
      "Delivery/read receipts",
      "Media messages",
      "Offline delivery"
    ],
    "nonFunctionalRequirements": [
      "Low latency online delivery",
      "At-least-once to inbox",
      "Global scale",
      "End-to-end encryption optional discussion"
    ],
    "entities": [
      "User",
      "Chat",
      "Message",
      "DeviceSession",
      "MediaObject"
    ],
    "apis": "WS /connect\nPOST /messages { chatId, body }\nGET /chats/{id}/messages?cursor=",
    "deepDives": [
      {
        "title": "Online fan-out",
        "body": "Connection gateway holds sockets; message service pushes to online devices; care for group fan-out."
      },
      {
        "title": "Offline queues",
        "body": "Per-user inbox in durable store; drain on reconnect; dedupe by message id."
      },
      {
        "title": "Media path",
        "body": "Upload to object storage, send pointer in message; CDN for download."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "rate-limiter",
    "title": "Rate Limiter",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Dealing with Contention",
    "summary": "Limit requests per key (user/IP/token) across a distributed fleet without becoming the bottleneck.",
    "what": "A service or middleware that allows or rejects requests based on quota algorithms.",
    "why": "Protects APIs from abuse and noisy neighbors; almost every large API needs it.",
    "how": "Choose algorithm (token bucket / sliding window) → centralized Redis counters → fail-open vs fail-closed → per-route limits.",
    "whereToUse": [
      "Public APIs",
      "Login endpoints",
      "LLM token budgets"
    ],
    "impact": "Wrong limits hurt UX; missing limits take down origin services.",
    "alternatives": [
      "API gateway built-in limits",
      "Envoy local rate limits",
      "Quota service"
    ],
    "useCases": [
      "Twitter API",
      "Stripe API",
      "Internal platform limits"
    ],
    "explain": "## Understanding the problem\nA service or middleware that allows or rejects requests based on quota algorithms.\n\n## Functional requirements\n1. Check-and-consume quota\n2. Configure limits per key/route\n3. Return retry-after on deny\n\n## Non-functional requirements\n1. Very low added latency\n2. Correct under concurrent requests\n3. Survive limiter outages with a stated policy\n\n## Why this question\nProtects APIs from abuse and noisy neighbors; almost every large API needs it.\n\n## How to approach (45 minutes)\nChoose algorithm (token bucket / sliding window) → centralized Redis counters → fail-open vs fail-closed → per-route limits.\n\n## Core entities\n1. LimitPolicy\n2. CounterKey\n3. Decision(allow/deny)\n\n## API / system interface\n```\nPOST /v1/check { key, cost } → { allowed, remaining, resetAt }\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Dealing with Contention pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Algorithm choice\nToken bucket allows bursts; sliding window is smoother; fixed window is simple but bursty at boundaries.\n\n### 2. Distributed counters\nRedis INCR/PEXPIRE or sorted sets for sliding window; discuss race conditions and Lua/scripts.\n\n### 3. Failure mode\nFail-open (availability) vs fail-closed (safety). Pick based on threat model.\n\n## Where this pattern appears\n1. Public APIs\n2. Login endpoints\n3. LLM token budgets\n\n## Impact if you get it wrong\nWrong limits hurt UX; missing limits take down origin services.\n\n## Alternatives\n1. API gateway built-in limits\n2. Envoy local rate limits\n3. Quota service\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Rate Limiter and why does it matter in interviews?",
        "a": "Rate Limiter shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Rate Limiter",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Compare token bucket vs sliding window and say where the counter lives.",
    "functionalRequirements": [
      "Check-and-consume quota",
      "Configure limits per key/route",
      "Return retry-after on deny"
    ],
    "nonFunctionalRequirements": [
      "Very low added latency",
      "Correct under concurrent requests",
      "Survive limiter outages with a stated policy"
    ],
    "entities": [
      "LimitPolicy",
      "CounterKey",
      "Decision(allow/deny)"
    ],
    "apis": "POST /v1/check { key, cost } → { allowed, remaining, resetAt }",
    "deepDives": [
      {
        "title": "Algorithm choice",
        "body": "Token bucket allows bursts; sliding window is smoother; fixed window is simple but bursty at boundaries."
      },
      {
        "title": "Distributed counters",
        "body": "Redis INCR/PEXPIRE or sorted sets for sliding window; discuss race conditions and Lua/scripts."
      },
      {
        "title": "Failure mode",
        "body": "Fail-open (availability) vs fail-closed (safety). Pick based on threat model."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Dealing with Contention). Cover each FR before deep dives."
  },
  {
    "slug": "youtube",
    "title": "YouTube",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Handling Large Blobs",
    "summary": "Design video upload + streaming: process encodings, store blobs, and serve via CDN at global scale.",
    "what": "Creators upload video; viewers stream adaptive bitrates worldwide.",
    "why": "Ultimate large-blob + CDN + async processing interview.",
    "how": "Upload to blob → transcoding pipeline → manifest (HLS) → CDN edge → metadata/search separate.",
    "whereToUse": [
      "Video platforms",
      "Course video",
      "Live + VOD"
    ],
    "impact": "Without CDN and async transcode, origin and UX collapse.",
    "alternatives": [
      "Managed video (Mux/Cloudflare Stream)",
      "Progressive download only"
    ],
    "useCases": [
      "YouTube",
      "Vimeo",
      "Netflix-like VOD"
    ],
    "explain": "## Understanding the problem\nCreators upload video; viewers stream adaptive bitrates worldwide.\n\n## Functional requirements\n1. Upload video\n2. Process multiple resolutions\n3. Stream playback\n4. Thumbnails/titles\n\n## Non-functional requirements\n1. Huge throughput\n2. Global low startup latency\n3. Cost-efficient storage cold/hot\n\n## Why this question\nUltimate large-blob + CDN + async processing interview.\n\n## How to approach (45 minutes)\nUpload to blob → transcoding pipeline → manifest (HLS) → CDN edge → metadata/search separate.\n\n## Core entities\n1. Video\n2. Encoding\n3. Channel\n4. ViewEvent\n\n## API / system interface\n```\nPOST /videos\nPOST /videos/{id}/upload\nGET /videos/{id}/manifest.m3u8\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Handling Large Blobs pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Transcoding pipeline\nQueue workers generate renditions; store in object storage; update metadata when ready.\n\n### 2. CDN & adaptive streaming\nHLS/DASH via CDN; hot titles cached at edge.\n\n### 3. Hot vs cold storage\nLifecycle policies move rarely watched videos to colder tiers.\n\n## Where this pattern appears\n1. Video platforms\n2. Course video\n3. Live + VOD\n\n## Impact if you get it wrong\nWithout CDN and async transcode, origin and UX collapse.\n\n## Alternatives\n1. Managed video (Mux/Cloudflare Stream)\n2. Progressive download only\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is YouTube and why does it matter in interviews?",
        "a": "YouTube shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for YouTube",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Separate control plane (metadata) from data plane (bytes + CDN).",
    "functionalRequirements": [
      "Upload video",
      "Process multiple resolutions",
      "Stream playback",
      "Thumbnails/titles"
    ],
    "nonFunctionalRequirements": [
      "Huge throughput",
      "Global low startup latency",
      "Cost-efficient storage cold/hot"
    ],
    "entities": [
      "Video",
      "Encoding",
      "Channel",
      "ViewEvent"
    ],
    "apis": "POST /videos\nPOST /videos/{id}/upload\nGET /videos/{id}/manifest.m3u8",
    "deepDives": [
      {
        "title": "Transcoding pipeline",
        "body": "Queue workers generate renditions; store in object storage; update metadata when ready."
      },
      {
        "title": "CDN & adaptive streaming",
        "body": "HLS/DASH via CDN; hot titles cached at edge."
      },
      {
        "title": "Hot vs cold storage",
        "body": "Lifecycle policies move rarely watched videos to colder tiers."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Handling Large Blobs). Cover each FR before deep dives."
  },
  {
    "slug": "fb-live-comments",
    "title": "FB Live Comments",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Real-time Updates",
    "summary": "Interview breakdown for FB Live Comments — requirements, API, design, deep dives, and Q&A.",
    "what": "Design FB Live Comments: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "FB Live Comments is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design FB Live Comments",
      "Production systems similar to FB Live Comments"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under FB Live Comments's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "FB Live Comments",
      "Variants of FB Live Comments in other companies"
    ],
    "explain": "## Understanding the problem\nDesign FB Live Comments: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for FB Live Comments\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nFB Live Comments is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. FBLiveCommentsEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for FB Live Comments)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for FB Live Comments\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like FB Live Comments\n2. Any system needing Real-time Updates\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is FB Live Comments and why does it matter in interviews?",
        "a": "FB Live Comments shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for FB Live Comments",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Real-time Updates pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for FB Live Comments",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "FBLiveCommentsEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for FB Live Comments)",
    "deepDives": [
      {
        "title": "Primary bottleneck for FB Live Comments",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "youtube-top-k",
    "title": "YouTube Top K",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Scaling Writes",
    "summary": "Interview breakdown for YouTube Top K — requirements, API, design, deep dives, and Q&A.",
    "what": "Design YouTube Top K: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "YouTube Top K is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design YouTube Top K",
      "Production systems similar to YouTube Top K"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under YouTube Top K's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "YouTube Top K",
      "Variants of YouTube Top K in other companies"
    ],
    "explain": "## Understanding the problem\nDesign YouTube Top K: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for YouTube Top K\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nYouTube Top K is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. YouTubeTopKEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for YouTube Top K)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Writes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for YouTube Top K\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like YouTube Top K\n2. Any system needing Scaling Writes\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is YouTube Top K and why does it matter in interviews?",
        "a": "YouTube Top K shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for YouTube Top K",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Writes pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for YouTube Top K",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "YouTubeTopKEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for YouTube Top K)",
    "deepDives": [
      {
        "title": "Primary bottleneck for YouTube Top K",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Writes). Cover each FR before deep dives."
  },
  {
    "slug": "uber",
    "title": "Uber",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Real-time Updates",
    "summary": "Interview breakdown for Uber — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Uber: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Uber is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Uber",
      "Production systems similar to Uber"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Uber's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Uber",
      "Variants of Uber in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Uber: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Uber\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nUber is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. UberEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Uber)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Uber\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Uber\n2. Any system needing Real-time Updates\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Uber and why does it matter in interviews?",
        "a": "Uber shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Uber",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Real-time Updates pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Uber",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "UberEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Uber)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Uber",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "web-crawler",
    "title": "Web Crawler",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Managing Long Running Tasks",
    "summary": "Interview breakdown for Web Crawler — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Web Crawler: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Web Crawler is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Web Crawler",
      "Production systems similar to Web Crawler"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Web Crawler's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Web Crawler",
      "Variants of Web Crawler in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Web Crawler: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Web Crawler\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nWeb Crawler is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. WebCrawlerEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Web Crawler)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Managing Long Running Tasks pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Web Crawler\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Web Crawler\n2. Any system needing Managing Long Running Tasks\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Web Crawler and why does it matter in interviews?",
        "a": "Web Crawler shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Web Crawler",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Managing Long Running Tasks pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Web Crawler",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "WebCrawlerEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Web Crawler)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Web Crawler",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Managing Long Running Tasks). Cover each FR before deep dives."
  },
  {
    "slug": "ad-click-aggregator",
    "title": "Ad Click Aggregator",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Scaling Writes",
    "summary": "Interview breakdown for Ad Click Aggregator — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Ad Click Aggregator: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Ad Click Aggregator is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Ad Click Aggregator",
      "Production systems similar to Ad Click Aggregator"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Ad Click Aggregator's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Ad Click Aggregator",
      "Variants of Ad Click Aggregator in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Ad Click Aggregator: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Ad Click Aggregator\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nAd Click Aggregator is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. AdClickAggregatorEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Ad Click Aggregator)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Writes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Ad Click Aggregator\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Ad Click Aggregator\n2. Any system needing Scaling Writes\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Ad Click Aggregator and why does it matter in interviews?",
        "a": "Ad Click Aggregator shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Ad Click Aggregator",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Writes pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Ad Click Aggregator",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "AdClickAggregatorEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Ad Click Aggregator)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Ad Click Aggregator",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Writes). Cover each FR before deep dives."
  },
  {
    "slug": "fb-post-search",
    "title": "FB Post Search",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for FB Post Search — requirements, API, design, deep dives, and Q&A.",
    "what": "Design FB Post Search: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "FB Post Search is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design FB Post Search",
      "Production systems similar to FB Post Search"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under FB Post Search's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "FB Post Search",
      "Variants of FB Post Search in other companies"
    ],
    "explain": "## Understanding the problem\nDesign FB Post Search: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for FB Post Search\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nFB Post Search is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. FBPostSearchEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for FB Post Search)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for FB Post Search\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like FB Post Search\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is FB Post Search and why does it matter in interviews?",
        "a": "FB Post Search shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for FB Post Search",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for FB Post Search",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "FBPostSearchEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for FB Post Search)",
    "deepDives": [
      {
        "title": "Primary bottleneck for FB Post Search",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "yelp",
    "title": "Yelp",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for Yelp — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Yelp: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Yelp is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Yelp",
      "Production systems similar to Yelp"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Yelp's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Yelp",
      "Variants of Yelp in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Yelp: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Yelp\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nYelp is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. YelpEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Yelp)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Yelp\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Yelp\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Yelp and why does it matter in interviews?",
        "a": "Yelp shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Yelp",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Yelp",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "YelpEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Yelp)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Yelp",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "instagram",
    "title": "Instagram",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for Instagram — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Instagram: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Instagram is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Instagram",
      "Production systems similar to Instagram"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Instagram's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Instagram",
      "Variants of Instagram in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Instagram: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Instagram\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nInstagram is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. InstagramEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Instagram)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Instagram\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Instagram\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Instagram and why does it matter in interviews?",
        "a": "Instagram shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Instagram",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Instagram",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "InstagramEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Instagram)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Instagram",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "strava",
    "title": "Strava",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Handling Large Blobs",
    "summary": "Interview breakdown for Strava — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Strava: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Strava is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Handling Large Blobs).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Handling Large Blobs).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Strava",
      "Production systems similar to Strava"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Strava's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Strava",
      "Variants of Strava in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Strava: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Strava\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nStrava is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Handling Large Blobs).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Handling Large Blobs).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. StravaEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Strava)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Handling Large Blobs pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Strava\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Handling Large Blobs.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Strava\n2. Any system needing Handling Large Blobs\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Strava and why does it matter in interviews?",
        "a": "Strava shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Strava",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Handling Large Blobs pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Strava",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "StravaEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Strava)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Strava",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Handling Large Blobs."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Handling Large Blobs). Cover each FR before deep dives."
  },
  {
    "slug": "distributed-cache",
    "title": "Distributed Cache",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for Distributed Cache — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Distributed Cache: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Distributed Cache is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Distributed Cache",
      "Production systems similar to Distributed Cache"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Distributed Cache's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Distributed Cache",
      "Variants of Distributed Cache in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Distributed Cache: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Distributed Cache\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nDistributed Cache is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. DistributedCacheEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Distributed Cache)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Distributed Cache\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Distributed Cache\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Distributed Cache and why does it matter in interviews?",
        "a": "Distributed Cache shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Distributed Cache",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Distributed Cache",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "DistributedCacheEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Distributed Cache)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Distributed Cache",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "online-auction",
    "title": "Online Auction",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Dealing with Contention",
    "summary": "Interview breakdown for Online Auction — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Online Auction: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Online Auction is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Online Auction",
      "Production systems similar to Online Auction"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Online Auction's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Online Auction",
      "Variants of Online Auction in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Online Auction: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Online Auction\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nOnline Auction is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. OnlineAuctionEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Online Auction)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Dealing with Contention pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Online Auction\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Online Auction\n2. Any system needing Dealing with Contention\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Online Auction and why does it matter in interviews?",
        "a": "Online Auction shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Online Auction",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Dealing with Contention pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Online Auction",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "OnlineAuctionEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Online Auction)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Online Auction",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Dealing with Contention). Cover each FR before deep dives."
  },
  {
    "slug": "job-scheduler",
    "title": "Job Scheduler",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Managing Long Running Tasks",
    "summary": "Interview breakdown for Job Scheduler — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Job Scheduler: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Job Scheduler is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Job Scheduler",
      "Production systems similar to Job Scheduler"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Job Scheduler's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Job Scheduler",
      "Variants of Job Scheduler in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Job Scheduler: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Job Scheduler\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nJob Scheduler is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. JobSchedulerEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Job Scheduler)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Managing Long Running Tasks pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Job Scheduler\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Job Scheduler\n2. Any system needing Managing Long Running Tasks\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Job Scheduler and why does it matter in interviews?",
        "a": "Job Scheduler shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Job Scheduler",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Managing Long Running Tasks pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Job Scheduler",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "JobSchedulerEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Job Scheduler)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Job Scheduler",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Managing Long Running Tasks). Cover each FR before deep dives."
  },
  {
    "slug": "news-aggregator",
    "title": "News Aggregator",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Scaling Reads",
    "summary": "Interview breakdown for News Aggregator — requirements, API, design, deep dives, and Q&A.",
    "what": "Design News Aggregator: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "News Aggregator is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design News Aggregator",
      "Production systems similar to News Aggregator"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under News Aggregator's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "News Aggregator",
      "Variants of News Aggregator in other companies"
    ],
    "explain": "## Understanding the problem\nDesign News Aggregator: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for News Aggregator\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nNews Aggregator is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Reads).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Reads).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. NewsAggregatorEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for News Aggregator)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Reads pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for News Aggregator\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like News Aggregator\n2. Any system needing Scaling Reads\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is News Aggregator and why does it matter in interviews?",
        "a": "News Aggregator shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for News Aggregator",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Reads pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for News Aggregator",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "NewsAggregatorEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for News Aggregator)",
    "deepDives": [
      {
        "title": "Primary bottleneck for News Aggregator",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Reads."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Reads). Cover each FR before deep dives."
  },
  {
    "slug": "price-tracking-service",
    "title": "Price Tracking Service",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Managing Long Running Tasks",
    "summary": "Interview breakdown for Price Tracking Service — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Price Tracking Service: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Price Tracking Service is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Price Tracking Service",
      "Production systems similar to Price Tracking Service"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Price Tracking Service's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Price Tracking Service",
      "Variants of Price Tracking Service in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Price Tracking Service: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Price Tracking Service\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nPrice Tracking Service is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. PriceTrackingServiceEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Price Tracking Service)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Managing Long Running Tasks pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Price Tracking Service\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Price Tracking Service\n2. Any system needing Managing Long Running Tasks\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Price Tracking Service and why does it matter in interviews?",
        "a": "Price Tracking Service shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Price Tracking Service",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Managing Long Running Tasks pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Price Tracking Service",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "PriceTrackingServiceEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Price Tracking Service)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Price Tracking Service",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Managing Long Running Tasks). Cover each FR before deep dives."
  },
  {
    "slug": "notification-system",
    "title": "Notification System",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Multi-step Processes",
    "summary": "Interview breakdown for Notification System — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Notification System: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Notification System is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Multi-step Processes).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Multi-step Processes).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Notification System",
      "Production systems similar to Notification System"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Notification System's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Notification System",
      "Variants of Notification System in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Notification System: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Notification System\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nNotification System is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Multi-step Processes).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Multi-step Processes).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. NotificationSystemEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Notification System)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Multi-step Processes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Notification System\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Multi-step Processes.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Notification System\n2. Any system needing Multi-step Processes\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Notification System and why does it matter in interviews?",
        "a": "Notification System shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Notification System",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Multi-step Processes pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Notification System",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "NotificationSystemEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Notification System)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Notification System",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Multi-step Processes."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Multi-step Processes). Cover each FR before deep dives."
  },
  {
    "slug": "robinhood",
    "title": "Robinhood",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Dealing with Contention",
    "summary": "Interview breakdown for Robinhood — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Robinhood: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Robinhood is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Robinhood",
      "Production systems similar to Robinhood"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Robinhood's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Robinhood",
      "Variants of Robinhood in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Robinhood: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Robinhood\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nRobinhood is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Dealing with Contention).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Dealing with Contention).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. RobinhoodEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Robinhood)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Dealing with Contention pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Robinhood\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Robinhood\n2. Any system needing Dealing with Contention\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Robinhood and why does it matter in interviews?",
        "a": "Robinhood shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Robinhood",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Dealing with Contention pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Robinhood",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "RobinhoodEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Robinhood)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Robinhood",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Dealing with Contention."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Dealing with Contention). Cover each FR before deep dives."
  },
  {
    "slug": "google-docs",
    "title": "Google Docs",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Real-time Updates",
    "summary": "Interview breakdown for Google Docs — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Google Docs: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Google Docs is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Google Docs",
      "Production systems similar to Google Docs"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Google Docs's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Google Docs",
      "Variants of Google Docs in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Google Docs: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Google Docs\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nGoogle Docs is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. GoogleDocsEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Google Docs)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Google Docs\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Google Docs\n2. Any system needing Real-time Updates\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Google Docs and why does it matter in interviews?",
        "a": "Google Docs shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Google Docs",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Real-time Updates pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Google Docs",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "GoogleDocsEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Google Docs)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Google Docs",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "payment-system",
    "title": "Payment System",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Multi-step Processes",
    "summary": "Ledger-correct money movement with idempotency, reconciliation, and strong auditability.",
    "what": "Wallets/ledgers, payment intents, PSP integration, webhooks, and reconciliation jobs.",
    "why": "Money systems prioritize correctness over availability theatre — double-spend is unacceptable.",
    "how": "Idempotency keys → double-entry ledger → async PSP webhooks → reconciliation → exactly-once effects via inbox/outbox.",
    "whereToUse": [
      "Checkout",
      "Payouts",
      "Marketplaces",
      "Wallets"
    ],
    "impact": "Bugs mean real financial loss and compliance risk.",
    "alternatives": [
      "Fully outsource to Stripe-like PSP for MVP",
      "Saga vs 2PC carefully"
    ],
    "useCases": [
      "Card charge",
      "Refunds",
      "Split payments"
    ],
    "explain": "## Understanding the problem\nWallets/ledgers, payment intents, PSP integration, webhooks, and reconciliation jobs.\n\n## Functional requirements\n1. Create payment intent\n2. Capture/confirm payment\n3. Refund\n4. View ledger/balance\n\n## Non-functional requirements\n1. Strong correctness\n2. Idempotent APIs\n3. Audit trail\n4. High availability for reads of status\n\n## Why this question\nMoney systems prioritize correctness over availability theatre — double-spend is unacceptable.\n\n## How to approach (45 minutes)\nIdempotency keys → double-entry ledger → async PSP webhooks → reconciliation → exactly-once effects via inbox/outbox.\n\n## Core entities\n1. Account\n2. LedgerEntry\n3. PaymentIntent\n4. Payout\n\n## API / system interface\n```\nPOST /payments {amount, currency, idempotencyKey}\nPOST /payments/{id}/capture\nPOST /payments/{id}/refund\nGET /accounts/{id}/ledger\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Multi-step Processes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Idempotency\nClient idempotency keys stored with payment intent; duplicate POSTs return the same result.\n\n### 2. Reconciliation\nNightly job compares PSP reports vs ledger; alerts on drift; never mutate history — append adjustments.\n\n### 3. Exactly-once side effects\nTransactional outbox + inbox dedupe so emails/fulfillment do not double-fire.\n\n## Where this pattern appears\n1. Checkout\n2. Payouts\n3. Marketplaces\n4. Wallets\n\n## Impact if you get it wrong\nBugs mean real financial loss and compliance risk.\n\n## Alternatives\n1. Fully outsource to Stripe-like PSP for MVP\n2. Saga vs 2PC carefully\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Payment System and why does it matter in interviews?",
        "a": "Payment System shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Payment System",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with idempotency and ledger invariants before drawing boxes.",
    "functionalRequirements": [
      "Create payment intent",
      "Capture/confirm payment",
      "Refund",
      "View ledger/balance"
    ],
    "nonFunctionalRequirements": [
      "Strong correctness",
      "Idempotent APIs",
      "Audit trail",
      "High availability for reads of status"
    ],
    "entities": [
      "Account",
      "LedgerEntry",
      "PaymentIntent",
      "Payout"
    ],
    "apis": "POST /payments {amount, currency, idempotencyKey}\nPOST /payments/{id}/capture\nPOST /payments/{id}/refund\nGET /accounts/{id}/ledger",
    "deepDives": [
      {
        "title": "Idempotency",
        "body": "Client idempotency keys stored with payment intent; duplicate POSTs return the same result."
      },
      {
        "title": "Reconciliation",
        "body": "Nightly job compares PSP reports vs ledger; alerts on drift; never mutate history — append adjustments."
      },
      {
        "title": "Exactly-once side effects",
        "body": "Transactional outbox + inbox dedupe so emails/fulfillment do not double-fire."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Multi-step Processes). Cover each FR before deep dives."
  },
  {
    "slug": "metrics-monitoring",
    "title": "Metrics Monitoring",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Scaling Writes",
    "summary": "Interview breakdown for Metrics Monitoring — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Metrics Monitoring: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Metrics Monitoring is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Metrics Monitoring",
      "Production systems similar to Metrics Monitoring"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Metrics Monitoring's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Metrics Monitoring",
      "Variants of Metrics Monitoring in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Metrics Monitoring: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Metrics Monitoring\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nMetrics Monitoring is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Scaling Writes).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Scaling Writes).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. MetricsMonitoringEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Metrics Monitoring)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Scaling Writes pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Metrics Monitoring\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Metrics Monitoring\n2. Any system needing Scaling Writes\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Metrics Monitoring and why does it matter in interviews?",
        "a": "Metrics Monitoring shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Metrics Monitoring",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Scaling Writes pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Metrics Monitoring",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "MetricsMonitoringEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Metrics Monitoring)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Metrics Monitoring",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Scaling Writes."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Scaling Writes). Cover each FR before deep dives."
  },
  {
    "slug": "online-chess",
    "title": "Online Chess",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Intermediate",
    "pattern": "Real-time Updates",
    "summary": "Interview breakdown for Online Chess — requirements, API, design, deep dives, and Q&A.",
    "what": "Design Online Chess: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "Online Chess is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design Online Chess",
      "Production systems similar to Online Chess"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under Online Chess's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "Online Chess",
      "Variants of Online Chess in other companies"
    ],
    "explain": "## Understanding the problem\nDesign Online Chess: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for Online Chess\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nOnline Chess is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Real-time Updates).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Real-time Updates).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. OnlineChessEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Online Chess)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Real-time Updates pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for Online Chess\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like Online Chess\n2. Any system needing Real-time Updates\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is Online Chess and why does it matter in interviews?",
        "a": "Online Chess shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for Online Chess",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Real-time Updates pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for Online Chess",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "OnlineChessEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for Online Chess)",
    "deepDives": [
      {
        "title": "Primary bottleneck for Online Chess",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Real-time Updates."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Real-time Updates). Cover each FR before deep dives."
  },
  {
    "slug": "chatgpt",
    "title": "ChatGPT",
    "sectionSlug": "question-breakdowns",
    "kind": "problem",
    "level": "Advanced",
    "pattern": "Managing Long Running Tasks",
    "summary": "Interview breakdown for ChatGPT — requirements, API, design, deep dives, and Q&A.",
    "what": "Design ChatGPT: clarify product scope, then build a scalable architecture that meets FR/NFR.",
    "why": "ChatGPT is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).",
    "how": "1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.",
    "whereToUse": [
      "Interview: Design ChatGPT",
      "Production systems similar to ChatGPT"
    ],
    "impact": "Wrong architecture fails latency, cost, or correctness under ChatGPT's peak load.",
    "alternatives": [
      "MVP single-region design",
      "Managed services vs self-built",
      "Product constraints to reduce fan-out"
    ],
    "useCases": [
      "ChatGPT",
      "Variants of ChatGPT in other companies"
    ],
    "explain": "## Understanding the problem\nDesign ChatGPT: clarify product scope, then build a scalable architecture that meets FR/NFR.\n\n## Functional requirements\n1. Core create / read flows for ChatGPT\n2. Auth assumed via session/JWT unless asked\n3. Pagination or streaming where lists are large\n4. Below-the-line features explicitly out of scope\n\n## Non-functional requirements\n1. Availability over strict consistency unless money/ledger\n2. p99 latency target stated with a number (e.g. < 300–500ms)\n3. Scale estimate: DAU, QPS, payload size\n4. Durability and multi-region if product needs it\n\n## Why this question\nChatGPT is a high-frequency interview prompt that combines data modeling with a clear scaling pattern (Managing Long Running Tasks).\n\n## How to approach (45 minutes)\n1. Requirements (FR + NFR with numbers).\n2. Entities + API.\n3. High-level design covering each FR.\n4. Deep dives on the hard path (Managing Long Running Tasks).\n5. Level check: mid = breadth; senior = 2 deep dives.\n\n## Core entities\n1. User\n2. ChatGPTEntity\n3. Relationship / membership edges as needed\n\n## API / system interface\n```\nPOST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for ChatGPT)\n```\n\n## High-level design\n1. Stateless services behind a load balancer / API gateway.\n2. Primary datastore chosen for the access pattern (KV vs relational vs search).\n3. Cache and/or async workers where the Managing Long Running Tasks pattern demands it.\n4. Observability: metrics, logs, traces on the hot path.\n\n## Deep dives\n### 1. Primary bottleneck for ChatGPT\nIdentify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks.\n\n### 2. Failure and consistency\nDescribe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows.\n\n### 3. Cost and capacity\nBack-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost.\n\n## Where this pattern appears\n1. Products like ChatGPT\n2. Any system needing Managing Long Running Tasks\n\n## Impact if you get it wrong\nMissed SLOs, hot partitions, or an infeasible fan-out that cannot meet latency.\n\n## Alternatives\n1. Simpler monolith + single DB for MVP scale\n2. Different storage engine\n3. Product limits to avoid extreme fan-out\n\n## What interviewers expect by level\n1. Mid: working HLD + API + data model; surface-level components.\n2. Senior: fast HLD + two solid deep dives with trade-offs.\n3. Staff+: proactive bottleneck discovery, production war stories, capacity math.",
    "interviewerQA": [
      {
        "q": "What is ChatGPT and why does it matter in interviews?",
        "a": "ChatGPT shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      },
      {
        "q": "Fan-out on read vs fan-out on write — when each?",
        "a": "Fan-out on write when reads dominate and graphs are bounded; fan-out on read when writes are rare or fan-out targets explode (celebrities). Hybrid is often best."
      }
    ],
    "commonMistakes": [
      "Jumping to microservices before requirements",
      "Skipping API and data model",
      "One deep dive that consumes the whole interview",
      "No numbers on QPS / storage"
    ],
    "tradeoffs": [
      "Consistency vs availability for ChatGPT",
      "Precompute vs on-demand computation",
      "Operational complexity vs peak performance"
    ],
    "tip": "Lead with the Managing Long Running Tasks pattern, then deepen.",
    "functionalRequirements": [
      "Core create / read flows for ChatGPT",
      "Auth assumed via session/JWT unless asked",
      "Pagination or streaming where lists are large",
      "Below-the-line features explicitly out of scope"
    ],
    "nonFunctionalRequirements": [
      "Availability over strict consistency unless money/ledger",
      "p99 latency target stated with a number (e.g. < 300–500ms)",
      "Scale estimate: DAU, QPS, payload size",
      "Durability and multi-region if product needs it"
    ],
    "entities": [
      "User",
      "ChatGPTEntity",
      "Relationship / membership edges as needed"
    ],
    "apis": "POST /… create\nGET /…/{id} read\nGET /…?cursor= list/page\n(Extend with domain-specific endpoints for ChatGPT)",
    "deepDives": [
      {
        "title": "Primary bottleneck for ChatGPT",
        "body": "Identify the hottest path (reads, writes, fan-out, or contention). Propose a naive fix, then a production-grade fix (cache, queue, shard, or hybrid). Pattern lens: Managing Long Running Tasks."
      },
      {
        "title": "Failure and consistency",
        "body": "Describe retries, idempotency, and what users see if a replica lags. Prefer eventual consistency when product allows."
      },
      {
        "title": "Cost and capacity",
        "body": "Back-of-envelope storage and QPS. Show the design stays within reasonable $ and ops cost."
      }
    ],
    "highLevelDesign": "Gateway → services → datastore (+ cache/queue as needed for Managing Long Running Tasks). Cover each FR before deep dives."
  },
  {
    "slug": "proximity-search",
    "title": "Proximity Search",
    "sectionSlug": "advanced-topics",
    "kind": "concept",
    "level": "Advanced",
    "pattern": null,
    "summary": "Proximity Search: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Proximity Search is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Proximity Search helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Proximity Search addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need proximity search to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Proximity Search can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Proximity Search",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nProximity Search is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Proximity Search helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Proximity Search addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need proximity search to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Proximity Search can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Proximity Search\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Proximity Search as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Proximity Search and why does it matter in interviews?",
        "a": "Proximity Search shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Proximity Search without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "time-series-databases",
    "title": "Time Series Databases",
    "sectionSlug": "advanced-topics",
    "kind": "concept",
    "level": "Advanced",
    "pattern": null,
    "summary": "Time Series Databases: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Time Series Databases is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Time Series Databases helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Time Series Databases addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need time series databases to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Time Series Databases can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Time Series Databases",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nTime Series Databases is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Time Series Databases helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Time Series Databases addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need time series databases to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Time Series Databases can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Time Series Databases\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Time Series Databases as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Time Series Databases and why does it matter in interviews?",
        "a": "Time Series Databases shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Time Series Databases without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "data-structures-for-big-data",
    "title": "Data Structures for Big Data",
    "sectionSlug": "advanced-topics",
    "kind": "concept",
    "level": "Advanced",
    "pattern": null,
    "summary": "Data Structures for Big Data: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Data Structures for Big Data is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Data Structures for Big Data helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Data Structures for Big Data addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need data structures for big data to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Data Structures for Big Data can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Data Structures for Big Data",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nData Structures for Big Data is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Data Structures for Big Data helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Data Structures for Big Data addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need data structures for big data to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Data Structures for Big Data can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Data Structures for Big Data\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Data Structures for Big Data as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Data Structures for Big Data and why does it matter in interviews?",
        "a": "Data Structures for Big Data shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Data Structures for Big Data without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "vector-databases",
    "title": "Vector Databases",
    "sectionSlug": "advanced-topics",
    "kind": "concept",
    "level": "Advanced",
    "pattern": null,
    "summary": "Vector Databases: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Vector Databases is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Vector Databases helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Vector Databases addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need vector databases to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Vector Databases can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Vector Databases",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nVector Databases is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Vector Databases helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Vector Databases addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need vector databases to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Vector Databases can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Vector Databases\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Vector Databases as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Vector Databases and why does it matter in interviews?",
        "a": "Vector Databases shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Vector Databases without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "change-data-capture",
    "title": "Change Data Capture",
    "sectionSlug": "advanced-topics",
    "kind": "concept",
    "level": "Advanced",
    "pattern": null,
    "summary": "Change Data Capture: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Change Data Capture is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Change Data Capture helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Change Data Capture addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need change data capture to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Change Data Capture can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Change Data Capture",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nChange Data Capture is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Change Data Capture helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Change Data Capture addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need change data capture to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Change Data Capture can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Change Data Capture\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Change Data Capture as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Change Data Capture and why does it matter in interviews?",
        "a": "Change Data Capture shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Change Data Capture without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "shopify-inventory-reservations",
    "title": "Shopify Inventory Reservations",
    "sectionSlug": "in-the-wild",
    "kind": "wild",
    "level": "Advanced",
    "pattern": null,
    "summary": "Shopify Inventory Reservations: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Shopify Inventory Reservations is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Shopify Inventory Reservations helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Shopify Inventory Reservations addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need shopify inventory reservations to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Shopify Inventory Reservations can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Shopify Inventory Reservations",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nShopify Inventory Reservations is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Shopify Inventory Reservations helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Shopify Inventory Reservations addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need shopify inventory reservations to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Shopify Inventory Reservations can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Shopify Inventory Reservations\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Shopify Inventory Reservations as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Shopify Inventory Reservations and why does it matter in interviews?",
        "a": "Shopify Inventory Reservations shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Shopify Inventory Reservations without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "discord-message-storage",
    "title": "Discord Message Storage",
    "sectionSlug": "in-the-wild",
    "kind": "wild",
    "level": "Advanced",
    "pattern": null,
    "summary": "Discord Message Storage: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Discord Message Storage is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Discord Message Storage helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Discord Message Storage addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need discord message storage to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Discord Message Storage can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Discord Message Storage",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nDiscord Message Storage is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Discord Message Storage helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Discord Message Storage addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need discord message storage to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Discord Message Storage can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Discord Message Storage\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Discord Message Storage as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Discord Message Storage and why does it matter in interviews?",
        "a": "Discord Message Storage shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Discord Message Storage without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "slack-job-queue",
    "title": "Slack Job Queue",
    "sectionSlug": "in-the-wild",
    "kind": "wild",
    "level": "Intermediate",
    "pattern": null,
    "summary": "Slack Job Queue: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Slack Job Queue is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Slack Job Queue helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Slack Job Queue addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need slack job queue to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Slack Job Queue can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Slack Job Queue",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nSlack Job Queue is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Slack Job Queue helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Slack Job Queue addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need slack job queue to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Slack Job Queue can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Slack Job Queue\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Slack Job Queue as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Slack Job Queue and why does it matter in interviews?",
        "a": "Slack Job Queue shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Slack Job Queue without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "figma-multiplayer",
    "title": "Figma Multiplayer",
    "sectionSlug": "in-the-wild",
    "kind": "wild",
    "level": "Advanced",
    "pattern": null,
    "summary": "Figma Multiplayer: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Figma Multiplayer is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Figma Multiplayer helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Figma Multiplayer addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need figma multiplayer to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Figma Multiplayer can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Figma Multiplayer",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nFigma Multiplayer is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Figma Multiplayer helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Figma Multiplayer addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need figma multiplayer to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Figma Multiplayer can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Figma Multiplayer\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Figma Multiplayer as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Figma Multiplayer and why does it matter in interviews?",
        "a": "Figma Multiplayer shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Figma Multiplayer without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  },
  {
    "slug": "spotify-data-lake",
    "title": "Spotify Data Lake",
    "sectionSlug": "in-the-wild",
    "kind": "wild",
    "level": "Advanced",
    "pattern": null,
    "summary": "Spotify Data Lake: what it is, why you use it, how it works, where it fits, impact, alternatives, and interviewer Q&A.",
    "what": "Spotify Data Lake is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.",
    "why": "Interviewers expect you to know when Spotify Data Lake helps, what it costs, and what breaks if you misuse it.",
    "how": "1. Restate the problem need that Spotify Data Lake addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.",
    "whereToUse": [
      "Systems that need spotify data lake to meet SLOs",
      "High-QPS read or write paths",
      "Multi-region or multi-tenant products"
    ],
    "impact": "Correct use of Spotify Data Lake can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.",
    "alternatives": [
      "Simpler design without this layer (if numbers allow)",
      "A neighboring pattern that solves the same bottleneck",
      "Managed cloud service vs self-hosted"
    ],
    "useCases": [
      "Classic interview prompts involving Spotify Data Lake",
      "Production systems with similar constraints"
    ],
    "explain": "## What\nSpotify Data Lake is a core system-design building block used to meet scale, latency, or reliability goals in distributed systems.\n\n## Why\nInterviewers expect you to know when Spotify Data Lake helps, what it costs, and what breaks if you misuse it.\n\n## How\n1. Restate the problem need that Spotify Data Lake addresses.\n2. Place it in the architecture (client, edge, service, data plane).\n3. Describe the control path and failure modes.\n4. Quantify impact with back-of-envelope numbers.\n5. Compare 1–2 alternatives.\n\n## Where to use\n1. Systems that need spotify data lake to meet SLOs\n2. High-QPS read or write paths\n3. Multi-region or multi-tenant products\n\n## Impact\nCorrect use of Spotify Data Lake can be the difference between a design that works at interview scale and one that collapses under hot keys or fan-out.\n\n## Alternatives\n1. Simpler design without this layer (if numbers allow)\n2. A neighboring pattern that solves the same bottleneck\n3. Managed cloud service vs self-hosted\n\n## Use cases\n1. Classic interview prompts involving Spotify Data Lake\n2. Production systems with similar constraints\n\n## Interview playbook\n1. Define the bottleneck in one sentence.\n2. Propose Spotify Data Lake as the lever.\n3. State consistency / latency / cost trade-offs.\n4. Name failure modes (cache stampede, hot shard, split brain, etc.).\n5. Offer one simpler alternative if scale is lower.",
    "interviewerQA": [
      {
        "q": "What is Spotify Data Lake and why does it matter in interviews?",
        "a": "Spotify Data Lake shows up because it forces clear requirements, a data model, and explicit trade-offs around latency, consistency, and cost."
      },
      {
        "q": "How would you measure success for this design?",
        "a": "Pick SLOs: p99 latency, availability %, freshness/staleness, error rate, and cost per user or per request. Tie every major component to one of these."
      },
      {
        "q": "What fails first when traffic spikes 10×?",
        "a": "Usually a hot partition, a synchronous fan-out, an uncached read path, or a single writer. Name the bottleneck and the mitigation (shard, queue, cache, backpressure)."
      },
      {
        "q": "What would you cut if you only had 20 minutes left?",
        "a": "Keep a working end-to-end path for core FRs, one clear deep dive, and explicit trade-offs. Skip ornamental components."
      }
    ],
    "commonMistakes": [
      "Name-dropping Spotify Data Lake without tying it to a requirement",
      "Ignoring invalidation, retries, or failure modes",
      "Optimizing before a working end-to-end design exists"
    ],
    "tradeoffs": [
      "Complexity vs latency/throughput gains",
      "Consistency vs availability",
      "Cost vs peak-load headroom"
    ],
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "functionalRequirements": [],
    "nonFunctionalRequirements": [],
    "entities": [],
    "apis": "",
    "deepDives": [],
    "highLevelDesign": ""
  }
];
