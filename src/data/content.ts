import { categories } from './catalog';

export const trustLogos = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'OpenAI'];

export const trendingSearches = [
  'System Design',
  'DSA Patterns',
  'Rate Limiter',
  'RAG',
  'Google Maps SD',
  'AWS',
  'Behavioral STAR',
  'Kubernetes',
  'GenAI Agents',
  'Java Collections',
];

export const searchCatalog = categories.flatMap((cat) =>
  cat.topics.map((t) => ({
    title: t.title,
    category: cat.title,
    href: t.isFree ? `/learn/${cat.slug}/${t.slug}` : `/pricing?topic=${cat.slug}/${t.slug}`,
    isFree: t.isFree,
  }))
);

export const learningPaths = categories.map((cat) => ({
  title: cat.title,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
  topics: cat.topics.slice(0, 4).map((t) => t.title),
  href: `/learn/${cat.slug}`,
  freeCount: cat.topics.filter((t) => t.isFree).length,
  totalCount: cat.topics.length,
}));

export const popularCourses = [
  {
    title: 'FAANG Interview Preparation',
    subtitle: 'Structured paths across SD, DSA, AI & behavioral',
    lessons: 120,
    mocks: 40,
    rating: 4.9,
    students: '12K+',
    duration: '12 weeks',
    level: 'Intermediate',
    instructor: 'Binod Suman',
    href: '/learn/system-design',
    badge: 'Most Popular',
    premium: false,
  },
  {
    title: 'System Design Mastery',
    subtitle: 'Beginner → Staff-level delivery frameworks',
    lessons: 65,
    mocks: 15,
    rating: 4.9,
    students: '8K+',
    duration: '8 weeks',
    level: 'All levels',
    instructor: 'Binod Suman',
    href: '/learn/system-design',
    premium: true,
  },
  {
    title: 'Data Structures & Algorithms',
    subtitle: 'Patterns + curated top interview problems',
    lessons: 85,
    mocks: 25,
    rating: 4.8,
    students: '15K+',
    duration: '10 weeks',
    level: 'Beginner',
    instructor: 'Binod Suman',
    href: '/learn/dsa',
    premium: true,
  },
  {
    title: 'Generative AI Engineering',
    subtitle: 'LLMs, RAG, agents, MCP, fine-tuning',
    lessons: 45,
    mocks: 8,
    rating: 4.9,
    students: '6K+',
    duration: '6 weeks',
    level: 'Intermediate',
    instructor: 'Binod Suman',
    href: '/learn/ai-engineering',
    premium: true,
  },
  {
    title: 'Google System Design Collection',
    subtitle: 'Maps, Gmail, Docs, Trends & more',
    lessons: 12,
    mocks: 12,
    rating: 4.9,
    students: '4K+',
    duration: '4 weeks',
    level: 'Advanced',
    instructor: 'Binod Suman',
    href: '/pricing?plan=pro',
    badge: 'Premium',
    premium: true,
  },
  {
    title: 'Machine Learning Interview Guide',
    subtitle: 'ML/DL fundamentals for technical screens',
    lessons: 30,
    mocks: 6,
    rating: 4.7,
    students: '3K+',
    duration: '5 weeks',
    level: 'Advanced',
    instructor: 'Binod Suman',
    href: '/pricing?plan=pro',
    premium: true,
  },
];

export const interviewHub = [
  { title: 'Coding Interviews', desc: 'DSA patterns & top problems', href: '/learn/dsa', icon: 'Terminal' },
  { title: 'System Design', desc: '34 full revision tracks', href: '/learn/system-design', icon: 'Boxes' },
  { title: 'Behavioral', desc: 'STAR & top questions', href: '/learn/behavioral', icon: 'MessageSquare' },
  { title: 'AI Engineering', desc: 'RAG, agents, ML interviews', href: '/learn/ai-engineering', icon: 'Sparkles' },
  { title: 'Mock Interviews', desc: 'Practice with AI interviewer', href: '/pricing?feature=mock', icon: 'Mic' },
  { title: 'Company Playbooks', desc: 'Google, Meta, Amazon…', href: '/pricing?plan=pro', icon: 'Building2' },
];

export const companyPrep = [
  { name: 'Google', href: '/pricing?company=google' },
  { name: 'Amazon', href: '/pricing?company=amazon' },
  { name: 'Meta', href: '/pricing?company=meta' },
  { name: 'Microsoft', href: '/pricing?company=microsoft' },
  { name: 'OpenAI', href: '/pricing?company=openai' },
  { name: 'Netflix', href: '/pricing?company=netflix' },
];

export const aiFeatures = [
  { title: 'AI Tutor', desc: 'Context-aware help on every lesson', icon: 'GraduationCap' },
  { title: 'AI Roadmap', desc: 'Personalized prep timeline', icon: 'Map' },
  { title: 'AI Mock Interviewer', desc: 'System design & coding practice', icon: 'Bot' },
  { title: 'AI Resume Analyzer', desc: 'Staff-level feedback', icon: 'FileText' },
  { title: 'AI Career Coach', desc: 'Level-up guidance', icon: 'TrendingUp' },
];

export const projects = [
  { title: 'Build a Rate Limiter', stack: 'Redis · Java', level: 'Intermediate', hours: 6, href: '/pricing?project=rate-limiter' },
  { title: 'RAG Chatbot', stack: 'Python · Vector DB', level: 'Advanced', hours: 8, href: '/pricing?project=rag' },
  { title: 'News Feed API', stack: 'Node · Cassandra', level: 'Advanced', hours: 10, href: '/pricing?project=news-feed' },
  { title: 'URL Shortener', stack: 'Go · PostgreSQL', level: 'Beginner', hours: 4, href: '/learn/system-design/url-shortener' },
];

export const stats = [
  { value: '100+', label: 'Study guides' },
  { value: '34', label: 'SD interviews' },
  { value: '31', label: 'Core concepts' },
  { value: '250+', label: 'Video lessons' },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Starter lessons in every category',
    features: ['2 free topics per track', 'YouTube samples', 'Community access', 'Basic search'],
    cta: 'Start Free',
    href: '/learn',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/month',
    description: 'Full library + interview prep',
    features: [
      'All study material unlocked',
      'Google SD collection',
      'AI mock interviewer',
      'Downloadable sheets',
      'Priority updates',
    ],
    cta: 'Get Pro',
    href: '/pricing?plan=pro',
    highlighted: true,
  },
  {
    name: 'Cohort',
    price: '₹14,999',
    period: '/program',
    description: 'Live mentorship + mocks',
    features: [
      'Everything in Pro',
      '8 live mock interviews',
      'Resume review',
      'Cohort community',
      'Career coaching',
    ],
    cta: 'Join Cohort',
    href: '/pricing?plan=cohort',
    highlighted: false,
  },
];
