'use client';

import type { ReactNode } from 'react';

/** Renders lesson text with light markdown: ## headings, ol/ul, and sparse **bold** — body stays normal weight. */
export function ExplainBody({ text, className = '' }: { text: string; className?: string }) {
  const blocks = splitBlocks(text);
  return (
    <div className={`space-y-3 text-[15px] font-normal leading-relaxed text-slate-700 dark:text-slate-300 ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'h') {
          return (
            <h4 key={i} className="pt-1 font-display text-base font-semibold text-slate-900 dark:text-white">
              {block.text}
            </h4>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={i} className="list-decimal space-y-2 pl-5 marker:font-normal marker:text-slate-400">
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  <InlineText text={item} />
                  {block.subs[j]?.length ? (
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
                      {block.subs[j].map((s, k) => (
                        <li key={k}>
                          <InlineText text={s} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-teal-600">
              {block.items.map((item, j) => (
                <li key={j}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'pre') {
          return (
            <pre key={i} className="overflow-x-auto rounded-lg bg-slate-100 p-3 font-mono text-xs font-normal text-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {block.text}
            </pre>
          );
        }
        return (
          <p key={i} className="font-normal">
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <strong key={i++} className="font-semibold text-slate-800 dark:text-slate-100">
        {m[1]}
      </strong>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

type Block =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'pre'; text: string }
  | { type: 'ol'; items: string[]; subs: string[][] }
  | { type: 'ul'; items: string[] };

function splitBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const out: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      out.push({ type: 'h', text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      i++;
      const buf: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++; // close fence
      out.push({ type: 'pre', text: buf.join('\n') });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      const subs: string[][] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) {
          // peek ahead — blank inside list ok if next is continuation
          const next = lines[i + 1]?.trim() ?? '';
          if (/^\d+\.\s+/.test(next) || /^[-•*]\s+/.test(next) || /^\s+[-•*]\s+/.test(lines[i + 1] ?? '')) {
            i++;
            continue;
          }
          break;
        }
        if (/^\d+\.\s+/.test(t)) {
          items.push(t.replace(/^\d+\.\s+/, ''));
          subs.push([]);
          i++;
          continue;
        }
        if (/^[-•*]\s+/.test(t) && items.length) {
          subs[subs.length - 1].push(t.replace(/^[-•*]\s+/, ''));
          i++;
          continue;
        }
        // indented sub-bullet
        if (/^\s+[-•*]\s+/.test(lines[i]) && items.length) {
          subs[subs.length - 1].push(lines[i].trim().replace(/^[-•*]\s+/, ''));
          i++;
          continue;
        }
        break;
      }
      out.push({ type: 'ol', items, subs });
      continue;
    }

    if (/^[-•*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) break;
        if (!/^[-•*]\s+/.test(t)) break;
        items.push(t.replace(/^[-•*]\s+/, ''));
        i++;
      }
      out.push({ type: 'ul', items });
      continue;
    }

    const buf = [trimmed];
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t || t.startsWith('## ') || /^\d+\.\s+/.test(t) || /^[-•*]\s+/.test(t) || t.startsWith('```')) break;
      buf.push(t);
      i++;
    }
    out.push({ type: 'p', text: buf.join(' ') });
  }

  return out;
}
