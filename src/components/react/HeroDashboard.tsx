'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Target, TrendingUp, Zap } from 'lucide-react';

const skills = [
  { name: 'System Design', pct: 78 },
  { name: 'DSA Patterns', pct: 65 },
  { name: 'AI / RAG', pct: 52 },
];

export function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="glass relative overflow-hidden rounded-2xl p-5 sm:p-6 animate-float"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl animate-pulse-glow" />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Your prep dashboard
          </p>
          <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Interview readiness</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <Target className="h-6 w-6" />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Score', value: '82%', icon: TrendingUp },
          { label: 'Streak', value: '12d', icon: Zap },
          { label: 'Mocks', value: '3', icon: Calendar },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-800/80"
          >
            <item.icon className="mb-1 h-4 w-4 text-brand-600 dark:text-blue-400" />
            <p className="font-display text-lg font-bold">{item.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Skill roadmap</p>
        {skills.map((s, i) => (
          <div key={s.name}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{s.name}</span>
              <span className="text-brand-600 dark:text-blue-400">{s.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-violet-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Next: Design Rate Limiter — mock in 2 days</span>
      </div>
    </motion.div>
  );
}
