/** Navigation structure — Educative mega-menu + Hello Interview learn tracks */

export type SidebarItem = {
  id: string;
  label: string;
  href?: string;
  badge?: 'New' | 'Trending';
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    title: 'Learn',
    items: [
      { id: 'courses', label: 'Courses' },
      { id: 'paths', label: 'Paths', href: '/#paths' },
      { id: 'technologies', label: 'Technologies', href: '/learn' },
      { id: 'tutorials', label: 'Interactive Tutorials', href: '/learn' },
    ],
  },
  {
    title: 'Practice',
    items: [
      { id: 'projects', label: 'Projects', href: '/#projects' },
      { id: 'cloud-labs', label: 'Cloud Labs', href: '/pricing?feature=labs' },
    ],
  },
  {
    title: 'Get Hired',
    items: [
      { id: 'mocks', label: 'Mock Interviews', href: '/pricing?feature=mock', badge: 'New' },
      { id: 'interview-prep', label: 'Interview Prep', href: '/#interview-hub', badge: 'Trending' },
    ],
  },
];

/** Hello Interview–style learn tracks (simple dropdown) */
export const learnTracks = [
  {
    label: 'System Design',
    description: 'Concepts, patterns & 30+ breakdowns',
    href: '/learn/system-design',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  },
  {
    label: 'Data Structures & Algorithms',
    description: 'Patterns and top problems',
    href: '/learn/dsa',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  },
  {
    label: 'LeetCode 75',
    description: '75 must-know interview problems',
    href: '/learn/leetcode-75',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  },
  {
    label: 'AI & ML',
    description: 'GenAI, MCP, agents, Cursor & automation',
    href: '/learn/ai-engineering',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  },
  {
    label: 'Behavioral',
    description: 'STAR and senior-level stories',
    href: '/learn/behavioral',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  },
  {
    label: 'Data & Cloud',
    description: 'Kafka, Spark, AWS',
    href: '/learn/data-cloud',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  {
    label: 'Java & Backend',
    description: 'Core Java and Spring',
    href: '/learn/java',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  },
];

/** Educative middle-column — one entry per category */
export const exploreTopics = [
  { slug: 'system-design', label: 'System Design' },
  { slug: 'ai-engineering', label: 'Generative AI' },
  { slug: 'data-cloud', label: 'AWS & Cloud' },
  { slug: 'java', label: 'Web Development' },
  { slug: 'dsa', label: 'Data Structures' },
  { slug: 'behavioral', label: 'Behavioral' },
];

export const catalogFilters = [
  { label: 'Popular Courses', href: '/learn?filter=popular' },
  { label: 'Beginner-Friendly', href: '/learn?filter=beginner' },
  { label: 'Free Courses', href: '/learn?filter=free' },
];

/** Course badges for mega-menu right column */
export function topicBadge(slug: string, isFree: boolean): string | null {
  if (slug === 'fundamentals' || slug === 'patterns-intro') return 'Top Pick';
  if (slug === 'google-collection') return 'Staff Level';
  if (slug === 'chatgpt-system') return 'Trending';
  if (isFree) return 'Free';
  return null;
}
