import { systemDesignFundamentals } from '@/data/lessons/system-design-fundamentals';
import { systemDesignNfr } from '@/data/lessons/system-design-nfr';
import { agenticAiRoadmap } from '@/data/lessons/agentic-ai-roadmap';
import { agenticAiAgents } from '@/data/lessons/agentic-ai-agents';
import { agenticAiGenaiPlatform } from '@/data/lessons/agentic-ai-genai-platform';
import { agenticAiPitfalls } from '@/data/lessons/agentic-ai-pitfalls';
import { agenticAiRealTimeMl } from '@/data/lessons/agentic-ai-real-time-ml';
import { agenticAiMultimodal } from '@/data/lessons/agentic-ai-multimodal';

export const lessonRegistry: Record<string, Record<string, typeof systemDesignFundamentals>> = {
  'system-design': {
    fundamentals: systemDesignFundamentals,
    nfr: systemDesignNfr,
  },
  'agentic-ai': {
    roadmap: agenticAiRoadmap,
    agents: agenticAiAgents,
    'genai-platform': agenticAiGenaiPlatform,
    'ai-pitfalls': agenticAiPitfalls,
    'real-time-ml': agenticAiRealTimeMl,
    multimodal: agenticAiMultimodal,
  },
};

export function getLesson(category: string, topic: string) {
  return lessonRegistry[category]?.[topic];
}
