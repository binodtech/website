/** Featured YouTube — @binodsuman (embed-verified, user-curated) */

export type FeaturedVideo = {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  highlight: string;
};

export const channelStats = {
  subscribers: '34,000+',
  videos: '250+',
  playlists: '30+',
  years: '8+',
};

export const featuredVideos: FeaturedVideo[] = [
  {
    id: 'hLvB2haod5w',
    title: 'Design Distributed Job Scheduler',
    category: 'System Design',
    duration: '45:00',
    views: '22K',
    highlight: 'Airflow / Temporal / Celery — full HLD & LLD walkthrough',
  },
  {
    id: '9dKaw65JqR4',
    title: 'Change Data Capture (CDC) with Debezium',
    category: 'Data Engineering',
    duration: '25:00',
    views: '3.6K',
    highlight: 'MySQL CDC setup — step-by-step production pattern',
  },
  {
    id: 'Ua1gin5uDWY',
    title: 'Kafka 4.2 — Brokers & Partitions',
    category: 'Apache Kafka',
    duration: '18:00',
    views: '470',
    highlight: 'Kafka 4.2 broker changes explained clearly',
  },
  {
    id: '0icnoQh2mUM',
    title: 'Apache ZooKeeper — Basics',
    category: 'ZooKeeper',
    duration: '20:00',
    views: '3.5K',
    highlight: 'Why ZooKeeper, use cases, whiteboard fundamentals',
  },
  {
    id: 'KETUdCgXqg8',
    title: 'Distributed Monitoring with ZooKeeper',
    category: 'ZooKeeper',
    duration: '22:00',
    views: '360+',
    highlight: 'Whiteboard + live coding for distributed monitoring',
  },
  {
    id: '44H3cEC2fFM',
    title: 'Merge Intervals (LeetCode 56)',
    category: 'DSA',
    duration: '12:00',
    views: '263K',
    highlight: 'Sorting pattern — classic FAANG interval problem',
  },
];

export const featuredPlaylists = [
  {
    title: 'System Design',
    id: 'PLIRnO_sdVuEeyqzwYfDoJ3vbvJB4JBU6n',
    lessons: '40+',
    color: '#6366f1',
  },
  {
    title: 'DSA & LeetCode',
    id: 'PLIRnO_sdVuEehloCrpt330PC6tZX6O-6a',
    lessons: '50+',
    color: '#f59e0b',
  },
  {
    title: 'Apache Kafka',
    id: 'PLIRnO_sdVuEf1Ao9hnE9G8c0WHd0MbsOk',
    lessons: '20+',
    color: '#231f20',
  },
  {
    title: 'Apache ZooKeeper',
    id: 'PLIRnO_sdVuEdSDgDBDU2QbDPiFfAIDB-Q',
    lessons: '10+',
    color: '#059669',
  },
];

export const YOUTUBE_CHANNEL = 'https://youtube.com/@binodsuman';
