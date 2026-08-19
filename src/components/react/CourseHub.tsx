'use client';

import { useState } from 'react';
import {
  Boxes,
  Brain,
  Building2,
  ChevronRight,
  Cloud,
  Code2,
  Coffee,
  Database,
  Laptop,
  ListOrdered,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type HubCard = {
  title: string;
  meta: string;
  href: string;
  Icon: LucideIcon;
};

const learningTracks: HubCard[] = [
  { title: 'System Design', meta: '7 sections · 69 topics · unlocked', href: '/learn/system-design', Icon: Boxes },
  { title: 'Coding / DSA', meta: '25 patterns · 250 problems', href: '/learn/dsa', Icon: Code2 },
  { title: 'LeetCode 75', meta: '75 must-know · ★ rated', href: '/learn/leetcode-75', Icon: ListOrdered },
  { title: 'Java & LLD', meta: 'Core Java, collections, Spring', href: '/learn/java', Icon: Coffee },
  { title: 'AI & ML', meta: '11 courses · GenAI · agents · IDEs', href: '/learn/ai-engineering', Icon: Sparkles },
  { title: 'Behavioral', meta: 'STAR + leadership stories', href: '/learn/behavioral', Icon: MessageSquare },
  { title: 'Data & Cloud', meta: 'Kafka, Spark, AWS, K8s', href: '/learn/data-cloud', Icon: Cloud },
];

const companyGuides: HubCard[] = [
  { title: 'Google System Design', meta: 'Maps, Gmail, Docs, Trends', href: '/learn/system-design', Icon: Building2 },
  { title: 'Classic SD Interviews', meta: 'Chat, feed, payments, Uber-style', href: '/learn/system-design', Icon: Boxes },
  { title: 'ML Interview Guide', meta: 'ML/DL screens they actually ask', href: '/pricing?topic=ai-engineering/ml-interview', Icon: Brain },
  { title: 'Company playbooks', meta: 'Google, Meta, Amazon, OpenAI', href: '/pricing?plan=pro', Icon: Building2 },
  { title: 'AI-Enabled Coding', meta: 'Agents, MCP, production LLM apps', href: '/learn/ai-engineering', Icon: Laptop },
  { title: 'Data Engineering', meta: 'Kafka & Spark interview depth', href: '/learn/data-cloud', Icon: Database },
];

export function CourseHub() {
  const [tab, setTab] = useState<'tracks' | 'companies'>('tracks');
  const cards = tab === 'tracks' ? learningTracks : companyGuides;

  return (
    <section id="course-hub" className="px-4 pb-6 sm:px-6 lg:px-8">
      <div className="container-wide">
        <div
          className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-[#eef4f8] px-5 py-10 sm:px-10 dark:border-slate-700 dark:bg-slate-900/80"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.07) 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        >
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Learn at your own pace — it's free
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500 dark:text-slate-400">
            Pick a track. Every path has free starters — no hunting through menus.
          </p>

          <div className="mt-8 flex justify-center gap-8 border-b border-slate-300/70 dark:border-slate-700">
            {(
              [
                ['tracks', 'Learning Tracks'],
                ['companies', 'Company Guides'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'relative pb-3 text-sm font-semibold transition',
                  tab === id ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                )}
              >
                {label}
                {tab === id && (
                  <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t-full bg-teal-700 dark:bg-teal-400" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group grid grid-cols-[44px_minmax(0,1fr)_16px] items-center gap-x-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-800 text-white dark:bg-teal-600">
                  <card.Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900 dark:text-white">{card.title}</span>
                  <span className="block text-xs text-slate-500">{card.meta}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-700" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
