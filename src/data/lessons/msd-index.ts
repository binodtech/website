/** Registry for the Modern System Design course.
 *  Chapters are added here as they are written; the dynamic route at
 *  /learn/modern-system-design/[chapter] builds a page for every entry.
 */

import type { LessonData } from '@/components/LessonPage.astro';
import { msdIntroduction } from '@/data/lessons/msd-introduction';
import { msdInterviewPrep } from '@/data/lessons/msd-interview-prep';
import { msdPreliminaryConcepts } from '@/data/lessons/msd-preliminary-concepts';
import { msdNonFunctional } from '@/data/lessons/msd-non-functional';
import { msdBackOfEnvelope } from '@/data/lessons/msd-back-of-envelope';
import { msdBuildingBlocks } from '@/data/lessons/msd-building-blocks';
import { msdDns } from '@/data/lessons/msd-dns';
import { msdLoadBalancers } from '@/data/lessons/msd-load-balancers';
import { msdDatabases } from '@/data/lessons/msd-databases';
import { msdKeyValueStore } from '@/data/lessons/msd-key-value-store';
import { msdCdn } from '@/data/lessons/msd-cdn';
import { msdSequencer } from '@/data/lessons/msd-sequencer';
import { msdDistributedMonitoring } from '@/data/lessons/msd-distributed-monitoring';
import { msdMonitorServerSide } from '@/data/lessons/msd-monitor-server-side';
import { msdMonitorClientSide } from '@/data/lessons/msd-monitor-client-side';
import { msdDistributedCache } from '@/data/lessons/msd-distributed-cache';
import { msdMessagingQueue } from '@/data/lessons/msd-messaging-queue';
import { msdPubSub } from '@/data/lessons/msd-pub-sub';
import { msdRateLimiter } from '@/data/lessons/msd-rate-limiter';
import { msdBlobStore } from '@/data/lessons/msd-blob-store';
import { msdDistributedSearch } from '@/data/lessons/msd-distributed-search';
import { msdDistributedLogging } from '@/data/lessons/msd-distributed-logging';
import { msdTaskScheduler } from '@/data/lessons/msd-task-scheduler';
import { msdShardedCounters } from '@/data/lessons/msd-sharded-counters';
import { msdYoutube } from '@/data/lessons/msd-youtube';
import { msdQuora } from '@/data/lessons/msd-quora';
import { msdGoogleMaps } from '@/data/lessons/msd-google-maps';
import { msdYelp } from '@/data/lessons/msd-yelp';
import { msdUber } from '@/data/lessons/msd-uber';
import { msdTwitter } from '@/data/lessons/msd-twitter';
import { msdInstagramNewsfeed } from '@/data/lessons/msd-instagram-newsfeed';
import { msdTinyurl } from '@/data/lessons/msd-tinyurl';
import { msdWebCrawler } from '@/data/lessons/msd-web-crawler';
import { msdWhatsapp } from '@/data/lessons/msd-whatsapp';
import { msdTypeahead } from '@/data/lessons/msd-typeahead';
import { msdGoogleDocs } from '@/data/lessons/msd-google-docs';
import { msdCodeDeployment } from '@/data/lessons/msd-code-deployment';
import { msdPaymentSystem } from '@/data/lessons/msd-payment-system';
import { msdLeetcodeSystem } from '@/data/lessons/msd-leetcode-system';
import { msdChatgptSystem } from '@/data/lessons/msd-chatgpt-system';
import { msdAiMlDataInfra } from '@/data/lessons/msd-ai-ml-data-infra';
import { msdLlmSupportBot } from '@/data/lessons/msd-llm-support-bot';
import { msdAiCodeAssistant } from '@/data/lessons/msd-ai-code-assistant';
import { msdSystemFailures } from '@/data/lessons/msd-system-failures';

/** Chapter slug -> lesson data. Previous/Next follows catalog order, not this object. */
export const msdRegistry: Record<string, LessonData> = {
  introduction: msdIntroduction,
  'interview-prep': msdInterviewPrep,
  'preliminary-concepts': msdPreliminaryConcepts,
  'non-functional-characteristics': msdNonFunctional,
  'back-of-envelope': msdBackOfEnvelope,
  'building-blocks': msdBuildingBlocks,
  dns: msdDns,
  'load-balancers': msdLoadBalancers,
  databases: msdDatabases,
  'key-value-store': msdKeyValueStore,
  cdn: msdCdn,
  sequencer: msdSequencer,
  'distributed-monitoring': msdDistributedMonitoring,
  'monitor-server-side': msdMonitorServerSide,
  'monitor-client-side': msdMonitorClientSide,
  'distributed-cache': msdDistributedCache,
  'messaging-queue': msdMessagingQueue,
  'pub-sub': msdPubSub,
  'rate-limiter': msdRateLimiter,
  'blob-store': msdBlobStore,
  'distributed-search': msdDistributedSearch,
  'distributed-logging': msdDistributedLogging,
  'task-scheduler': msdTaskScheduler,
  'sharded-counters': msdShardedCounters,
  youtube: msdYoutube,
  quora: msdQuora,
  'google-maps': msdGoogleMaps,
  yelp: msdYelp,
  uber: msdUber,
  twitter: msdTwitter,
  'instagram-newsfeed': msdInstagramNewsfeed,
  tinyurl: msdTinyurl,
  'web-crawler': msdWebCrawler,
  whatsapp: msdWhatsapp,
  typeahead: msdTypeahead,
  'google-docs': msdGoogleDocs,
  'code-deployment': msdCodeDeployment,
  'payment-system': msdPaymentSystem,
  'leetcode-system': msdLeetcodeSystem,
  'chatgpt-system': msdChatgptSystem,
  'ai-ml-data-infra': msdAiMlDataInfra,
  'llm-support-bot': msdLlmSupportBot,
  'ai-code-assistant': msdAiCodeAssistant,
  'system-failures': msdSystemFailures,
};

export function getMsdChapter(slug: string): LessonData | undefined {
  return msdRegistry[slug];
}

export function hasMsdChapter(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(msdRegistry, slug);
}

export const msdWrittenSlugs = Object.keys(msdRegistry);
