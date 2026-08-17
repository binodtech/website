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
    slug: 'system-design',
    title: 'System Design',
    description: 'Classic interviews, core concepts, and Google-scale architectures.',
    icon: 'Boxes',
    color: 'from-indigo-500 to-blue-600',
    topics: [
      {
        slug: 'fundamentals',
        title: 'System Design Fundamentals',
        description: 'Scalability, CAP, caching, load balancing, databases, CDN, and the 45-minute interview framework.',
        duration: '90 min',
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
    description: 'Patterns, LeetCode-style problems, and coding interview scripts.',
    icon: 'Terminal',
    color: 'from-amber-500 to-orange-500',
    topics: [
      {
        slug: 'patterns-intro',
        title: 'DSA Patterns Overview',
        description: 'How to recognize and apply the 14 essential patterns.',
        duration: '40 min',
        lessons: 5,
        level: 'Beginner',
        isFree: true,
      },
      {
        slug: 'two-pointers',
        title: 'Two Pointers Pattern',
        description: 'Sorted arrays, sliding windows, and pair problems.',
        duration: '50 min',
        lessons: 7,
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
