/** Featured YouTube — embed-verified, highest-view videos on @binodsuman */

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

/** Sorted by view count — API Gateway removed (embed blocked) */
export const featuredVideos: FeaturedVideo[] = [
  {
    id: 'Y1qxI-Df4Lk',
    title: 'Convolutional Neural Networks (CNN)',
    category: 'Deep Learning',
    duration: '18:00',
    views: '735K',
    highlight: 'Most watched — CNN kernels & architecture made simple',
  },
  {
    id: 'SFQ-owZaU_s',
    title: 'NLP — CKY Parsing Algorithm',
    category: 'NLP',
    duration: '22:00',
    views: '190K',
    highlight: 'Deep NLP theory with clear whiteboard explanations',
  },
  {
    id: 'KBftoy0DPxI',
    title: 'Recurrent Neural Networks & LSTM',
    category: 'Deep Learning',
    duration: '20:00',
    views: '174K',
    highlight: 'RNN/LSTM foundations for ML interviews',
  },
  {
    id: 'irRCDQQtTh8',
    title: 'Hidden Markov Models — Part 1',
    category: 'Machine Learning',
    duration: '18:00',
    views: '128K',
    highlight: 'Classic ML concept explained step by step',
  },
  {
    id: 'Opj2AT0iYCw',
    title: 'LSTM Architecture & Calculations',
    category: 'Deep Learning',
    duration: '16:00',
    views: '116K',
    highlight: 'Architecture walkthrough recruiters love',
  },
  {
    id: 'aKjJ906lKZ0',
    title: 'Spring Boot — Controller, Service & DAO',
    category: 'Java & Backend',
    duration: '16:20',
    views: '41K',
    highlight: 'Backend interview essentials with live code',
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
