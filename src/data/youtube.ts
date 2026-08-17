/** Featured YouTube content — samples of academy quality (channel only, no binodsuman.com) */

export type FeaturedVideo = {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  highlight: string;
};

export const channelStats = {
  subscribers: '50K+',
  videos: '250+',
  playlists: '30+',
  years: '8+',
};

export const featuredVideos: FeaturedVideo[] = [
  {
    id: 'C_CeOu11DmQ',
    title: 'API Gateway — System Design',
    category: 'System Design',
    duration: '18:42',
    views: '45K',
    highlight: 'Clear architecture diagrams & trade-off analysis',
  },
  {
    id: '612Y0jXmWKk',
    title: 'Vector Database Explained',
    category: 'AI Engineering',
    duration: '22:15',
    views: '38K',
    highlight: 'Production RAG concepts made simple',
  },
  {
    id: 'HtrKp6V9KuE',
    title: 'Apache Kafka Deep Dive',
    category: 'Data Engineering',
    duration: '25:08',
    views: '52K',
    highlight: 'Distributed streaming from zero to interview-ready',
  },
  {
    id: 'yE3O28E38_E',
    title: 'Design a Chat System',
    category: 'System Design',
    duration: '20:33',
    views: '41K',
    highlight: 'Real-time messaging at scale',
  },
  {
    id: 'qcIQKYGvdgk',
    title: 'House Robber — DSA Pattern',
    category: 'DSA',
    duration: '12:45',
    views: '28K',
    highlight: 'Step-by-step problem solving',
  },
  {
    id: 'aKjJ906lKZ0',
    title: 'Spring Boot Fundamentals',
    category: 'Java',
    duration: '16:20',
    views: '35K',
    highlight: 'Backend interview essentials',
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
    title: 'ChatGPT & GenAI',
    id: 'PLIRnO_sdVuEcNu_8_jEpmydZLlhKGtYMU',
    lessons: '25+',
    color: '#10a37f',
  },
  {
    title: 'Apache Kafka',
    id: 'PLIRnO_sdVuEf1Ao9hnE9G8c0WHd0MbsOk',
    lessons: '20+',
    color: '#231f20',
  },
];

export const YOUTUBE_CHANNEL = 'https://youtube.com/@binodsuman';
