import { sdSections } from './roadmap';
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
