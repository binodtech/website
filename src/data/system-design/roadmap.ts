/** System Design curriculum — Hello Interview–style (all topics unlocked) */
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

export const sdSections: SdSection[] = [
  {
    "slug": "in-a-hurry",
    "title": "In a Hurry",
    "order": 1,
    "icon": "Clock",
    "overview": "Fast orientation for system design interviews — what to study, how to deliver, and how to structure 45 minutes.",
    "tip": "Read Introduction → How to Prepare → Delivery Framework before diving into concepts.",
    "topics": [
      {
        "slug": "introduction",
        "title": "Introduction",
        "kind": "guide",
        "level": "Beginner"
      },
      {
        "slug": "how-to-prepare",
        "title": "How to Prepare",
        "kind": "guide",
        "level": "Beginner"
      },
      {
        "slug": "delivery-framework",
        "title": "Delivery Framework",
        "kind": "guide",
        "level": "Beginner"
      }
    ]
  },
  {
    "slug": "core-concepts",
    "title": "Core Concepts",
    "order": 2,
    "icon": "BookOpen",
    "overview": "Building blocks every strong system design answer uses: networking, APIs, data, caching, sharding, CAP, indexing, and numbers.",
    "tip": "Know what each concept trades off — interviewers probe trade-offs, not definitions.",
    "topics": [
      {
        "slug": "networking-essentials",
        "title": "Networking Essentials",
        "kind": "concept",
        "level": "Beginner"
      },
      {
        "slug": "api-design",
        "title": "API Design",
        "kind": "concept",
        "level": "Beginner"
      },
      {
        "slug": "data-modeling",
        "title": "Data Modeling",
        "kind": "concept",
        "level": "Intermediate"
      },
      {
        "slug": "caching",
        "title": "Caching",
        "kind": "concept",
        "level": "Intermediate"
      },
      {
        "slug": "sharding",
        "title": "Sharding",
        "kind": "concept",
        "level": "Intermediate"
      },
      {
        "slug": "consistent-hashing",
        "title": "Consistent Hashing",
        "kind": "concept",
        "level": "Intermediate"
      },
      {
        "slug": "cap-theorem",
        "title": "CAP Theorem",
        "kind": "concept",
        "level": "Beginner"
      },
      {
        "slug": "database-indexing",
        "title": "Database Indexing",
        "kind": "concept",
        "level": "Intermediate"
      },
      {
        "slug": "numbers-to-know",
        "title": "Numbers to Know",
        "kind": "concept",
        "level": "Beginner"
      }
    ]
  },
  {
    "slug": "key-technologies",
    "title": "Key Technologies",
    "order": 3,
    "icon": "Cpu",
    "overview": "When to reach for Redis, Kafka, Elasticsearch, DynamoDB, Postgres, and friends — and what they are not.",
    "tip": "Name a technology only if you can explain why it fits the requirements.",
    "topics": [
      {
        "slug": "redis",
        "title": "Redis",
        "kind": "tech",
        "level": "Intermediate"
      },
      {
        "slug": "elasticsearch",
        "title": "Elasticsearch",
        "kind": "tech",
        "level": "Intermediate"
      },
      {
        "slug": "kafka",
        "title": "Kafka",
        "kind": "tech",
        "level": "Intermediate"
      },
      {
        "slug": "api-gateway",
        "title": "API Gateway",
        "kind": "tech",
        "level": "Beginner"
      },
      {
        "slug": "cassandra",
        "title": "Cassandra",
        "kind": "tech",
        "level": "Advanced"
      },
      {
        "slug": "dynamodb",
        "title": "DynamoDB",
        "kind": "tech",
        "level": "Intermediate"
      },
      {
        "slug": "postgresql",
        "title": "PostgreSQL",
        "kind": "tech",
        "level": "Beginner"
      },
      {
        "slug": "flink",
        "title": "Flink",
        "kind": "tech",
        "level": "Advanced"
      },
      {
        "slug": "zookeeper",
        "title": "ZooKeeper",
        "kind": "tech",
        "level": "Advanced"
      }
    ]
  },
  {
    "slug": "common-patterns",
    "title": "Common Patterns",
    "order": 4,
    "icon": "Layers",
    "overview": "Reusable interview patterns: realtime, contention, multi-step flows, scaling reads/writes, blobs, and long-running work.",
    "tip": "Map the problem to 1–2 patterns early — it frames the rest of the design.",
    "topics": [
      {
        "slug": "real-time-updates",
        "title": "Real-time Updates",
        "kind": "pattern",
        "level": "Intermediate"
      },
      {
        "slug": "dealing-with-contention",
        "title": "Dealing with Contention",
        "kind": "pattern",
        "level": "Advanced"
      },
      {
        "slug": "multi-step-processes",
        "title": "Multi-step Processes",
        "kind": "pattern",
        "level": "Intermediate"
      },
      {
        "slug": "scaling-reads",
        "title": "Scaling Reads",
        "kind": "pattern",
        "level": "Intermediate"
      },
      {
        "slug": "scaling-writes",
        "title": "Scaling Writes",
        "kind": "pattern",
        "level": "Intermediate"
      },
      {
        "slug": "handling-large-blobs",
        "title": "Handling Large Blobs",
        "kind": "pattern",
        "level": "Intermediate"
      },
      {
        "slug": "managing-long-running-tasks",
        "title": "Managing Long Running Tasks",
        "kind": "pattern",
        "level": "Intermediate"
      }
    ]
  },
  {
    "slug": "question-breakdowns",
    "title": "Question Breakdowns",
    "order": 5,
    "icon": "Crosshair",
    "overview": "Full interview walkthroughs: requirements → entities → API → high-level design → deep dives → level expectations.",
    "tip": "Practice out loud. Cover breadth first, then 1–2 deep dives for senior bar.",
    "topics": [
      {
        "slug": "bitly",
        "title": "Bitly (URL Shortener)",
        "kind": "problem",
        "level": "Beginner",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "dropbox",
        "title": "Dropbox",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Handling Large Blobs"
      },
      {
        "slug": "local-delivery-service",
        "title": "Local Delivery Service",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "ticketmaster",
        "title": "Ticketmaster",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Dealing with Contention"
      },
      {
        "slug": "fb-news-feed",
        "title": "FB News Feed",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "tinder",
        "title": "Tinder",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "leetcode",
        "title": "LeetCode",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Multi-step Processes"
      },
      {
        "slug": "whatsapp",
        "title": "WhatsApp",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "rate-limiter",
        "title": "Rate Limiter",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Dealing with Contention"
      },
      {
        "slug": "youtube",
        "title": "YouTube",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Handling Large Blobs"
      },
      {
        "slug": "fb-live-comments",
        "title": "FB Live Comments",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "youtube-top-k",
        "title": "YouTube Top K",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Scaling Writes"
      },
      {
        "slug": "uber",
        "title": "Uber",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "web-crawler",
        "title": "Web Crawler",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Managing Long Running Tasks"
      },
      {
        "slug": "ad-click-aggregator",
        "title": "Ad Click Aggregator",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Scaling Writes"
      },
      {
        "slug": "fb-post-search",
        "title": "FB Post Search",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "yelp",
        "title": "Yelp",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "instagram",
        "title": "Instagram",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "strava",
        "title": "Strava",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Handling Large Blobs"
      },
      {
        "slug": "distributed-cache",
        "title": "Distributed Cache",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "online-auction",
        "title": "Online Auction",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Dealing with Contention"
      },
      {
        "slug": "job-scheduler",
        "title": "Job Scheduler",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Managing Long Running Tasks"
      },
      {
        "slug": "news-aggregator",
        "title": "News Aggregator",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Scaling Reads"
      },
      {
        "slug": "price-tracking-service",
        "title": "Price Tracking Service",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Managing Long Running Tasks"
      },
      {
        "slug": "notification-system",
        "title": "Notification System",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Multi-step Processes"
      },
      {
        "slug": "robinhood",
        "title": "Robinhood",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Dealing with Contention"
      },
      {
        "slug": "google-docs",
        "title": "Google Docs",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "payment-system",
        "title": "Payment System",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Multi-step Processes"
      },
      {
        "slug": "metrics-monitoring",
        "title": "Metrics Monitoring",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Scaling Writes"
      },
      {
        "slug": "online-chess",
        "title": "Online Chess",
        "kind": "problem",
        "level": "Intermediate",
        "pattern": "Real-time Updates"
      },
      {
        "slug": "chatgpt",
        "title": "ChatGPT",
        "kind": "problem",
        "level": "Advanced",
        "pattern": "Managing Long Running Tasks"
      }
    ]
  },
  {
    "slug": "advanced-topics",
    "title": "Advanced Topics",
    "order": 6,
    "icon": "Sparkles",
    "overview": "Senior+ depth: geo search, time series, big-data structures, vectors, and CDC.",
    "tip": "Bring these up only when the problem needs them — they signal senior depth.",
    "topics": [
      {
        "slug": "proximity-search",
        "title": "Proximity Search",
        "kind": "concept",
        "level": "Advanced"
      },
      {
        "slug": "time-series-databases",
        "title": "Time Series Databases",
        "kind": "concept",
        "level": "Advanced"
      },
      {
        "slug": "data-structures-for-big-data",
        "title": "Data Structures for Big Data",
        "kind": "concept",
        "level": "Advanced"
      },
      {
        "slug": "vector-databases",
        "title": "Vector Databases",
        "kind": "concept",
        "level": "Advanced"
      },
      {
        "slug": "change-data-capture",
        "title": "Change Data Capture",
        "kind": "concept",
        "level": "Advanced"
      }
    ]
  },
  {
    "slug": "in-the-wild",
    "title": "In the Wild",
    "order": 7,
    "icon": "Globe",
    "overview": "How real companies solve hard problems — patterns you can reuse in interviews.",
    "tip": "Steal the pattern, not the company name. Interviewers care about the trade-off story.",
    "topics": [
      {
        "slug": "shopify-inventory-reservations",
        "title": "Shopify Inventory Reservations",
        "kind": "wild",
        "level": "Advanced"
      },
      {
        "slug": "discord-message-storage",
        "title": "Discord Message Storage",
        "kind": "wild",
        "level": "Advanced"
      },
      {
        "slug": "slack-job-queue",
        "title": "Slack Job Queue",
        "kind": "wild",
        "level": "Intermediate"
      },
      {
        "slug": "figma-multiplayer",
        "title": "Figma Multiplayer",
        "kind": "wild",
        "level": "Advanced"
      },
      {
        "slug": "spotify-data-lake",
        "title": "Spotify Data Lake",
        "kind": "wild",
        "level": "Advanced"
      }
    ]
  }
];

export const sdTopicCount = 69;
