import { systemDesignFundamentals } from '@/data/lessons/system-design-fundamentals';
import { systemDesignNfr } from '@/data/lessons/system-design-nfr';

export const lessonRegistry: Record<string, Record<string, typeof systemDesignFundamentals>> = {
  'system-design': {
    fundamentals: systemDesignFundamentals,
    nfr: systemDesignNfr,
  },
};

export function getLesson(category: string, topic: string) {
  return lessonRegistry[category]?.[topic];
}
