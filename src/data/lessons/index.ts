import { systemDesignFundamentals } from '@/data/lessons/system-design-fundamentals';

export const lessonRegistry: Record<string, Record<string, typeof systemDesignFundamentals>> = {
  'system-design': {
    fundamentals: systemDesignFundamentals,
  },
};

export function getLesson(category: string, topic: string) {
  return lessonRegistry[category]?.[topic];
}
