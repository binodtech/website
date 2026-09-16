/** AI Harness — Class 3: Context Engineering & Project Intelligence. */

export const ahContextEngineering = {
  slug: 'context-engineering',
  title: 'Class 3 — Context Engineering & Project Intelligence',
  subtitle:
    'Context engineering is deciding what the model should know, when it should know it, and what it should ignore. Project intelligence, retrieval, ranking, compression, and pollution.',
  byline: 'AI Harness Masterclass · Class 3 of 10 · ~1h 40m read · Intermediate',
  interviewTip:
    'Context > prompt. A mediocre prompt with the failing test, the owning module, and the coding standard beats a clever prompt with a 200k-token dump.',
  sections: [
    {
      id: 'what',
      title: 'What Is Context Engineering?',
      html: `
        <pre><code>Prompt
  + Instructions
  + Project Knowledge
  + Conversation
  + Tool Results
  + Memory
  = Agent Context</code></pre>
        <p>The model never sees “the company.” It sees a <strong>packet</strong> the harness assembled. Context engineering is the discipline of assembling that packet under a token budget.</p>
        <pre><code>type ContextPacket = {
  system: string;                 // durable instructions (policy + style)
  project: ProjectIntel;          // architecture, commands, do-not-touch
  retrieved: RetrievedChunk[];    // ranked files / docs / tickets
  conversation: Message[];        // compacted history
  toolResults: ToolResult[];      // last N observations
  memory: MemorySlice;            // decisions, todos, facts
  budgetTokens: number;
};

function assemble(req: Request, state: State, h: Harness): ContextPacket {
  const retrieved = rank(h.retrieve(req), req).slice(0, h.budget.chunks);
  return pack({ ...h.staticContext, retrieved, conversation: compact(state.messages), toolResults: state.lastTools });
}</code></pre>
      `,
    },
    {
      id: 'project',
      title: 'Building Project Intelligence',
      html: `
        <p>Project intelligence is the durable map a new engineer (or agent) needs. Examples the harness should index or summarise:</p>
        <ul class="lesson-layers">
          <li>Repository structure</li>
          <li>README</li>
          <li>Architecture documentation</li>
          <li>API specifications</li>
          <li>Coding standards</li>
          <li>Database schema</li>
          <li>Tests (often the real spec)</li>
          <li>Git history (why weird code exists)</li>
        </ul>
        <p><strong>Use case.</strong> A CLAUDE.md / HARNESS.md is a <em>compiled</em> form of project intelligence — short enough to always include. The rest is retrieved on demand (Class 3 chapter 3).</p>
        <pre><code># HARNESS.md — always in the packet
Build: ./gradlew test
Layers: web → service → repo
Never commit src/main/resources/application-prod.yml
Errors: JSON { error: { code, message } }</code></pre>
      `,
    },
    {
      id: 'select',
      title: 'Context Selection',
      html: `
        <p>The harness should not blindly send the entire repository.</p>
        <div class="lesson-flow">User Request → Find Relevant Context → Rank Context → Select Context → Send to Model</div>
        <pre><code>function selectContext(q: string, repo: Index): Chunk[] {
  const hits = repo.search(q);                    // BM25 + embeddings
  const ranked = hits.map(h => ({
    ...h,
    score: h.bm25 * 0.4 + h.vec * 0.4 + recency(h) * 0.1 + testBoost(h, q) * 0.1,
  }));
  return takeUntilTokenLimit(ranked.sort((a,b) => b.score - a.score), 8_000);
}</code></pre>
        <p>Boost tests when the request names a failure. Boost files the user @-mentioned. Demote <code>node_modules</code>, generated code, minified bundles.</p>
      `,
    },
    {
      id: 'compress',
      title: 'Context Compression',
      html: `
        <ul class="lesson-layers">
          <li><strong>Summarization</strong> — old conversation turns become a paragraph of decisions.</li>
          <li><strong>Compaction</strong> — drop tool payloads that were already applied (keep hashes / paths).</li>
          <li><strong>Conversation state</strong> — keep the current plan and last error in full fidelity.</li>
          <li><strong>Important facts</strong> — extracted into memory (Class 6), not re-pasted.</li>
          <li><strong>Intermediate results</strong> — store on disk; put a path in context, not a 2MB log.</li>
        </ul>
        <pre><code>function compact(history: Message[]): Message[] {
  const { recent, old } = split(history, { keepLast: 8 });
  const summary = summarize(old.filter(isDecisionOrError));
  return [{ role: "system", content: "Prior work: " + summary }, ...recent];
}</code></pre>
      `,
    },
    {
      id: 'pollute',
      title: 'Context Pollution',
      html: `
        <p>Dangerous because they steal budget and steer the model wrongly:</p>
        <ul class="lesson-layers">
          <li>Irrelevant files</li>
          <li>Old instructions (“we used Java 8” after you migrated)</li>
          <li>Duplicate information (README pasted twice)</li>
          <li>Huge logs</li>
          <li>Untrusted content (a webpage saying “ignore previous instructions” — Class 5)</li>
          <li>Conflicting instructions (global vs project vs task)</li>
        </ul>
        <p><strong>Theory.</strong> Models overweight recent and repeated text. Pollution is not only waste; it is a control-plane bug. Treat untrusted tool output as <em>data</em>, wrapped in delimiters, never merged into the system prompt.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Context engineering is the discipline of deciding what the model should know, when it should know it, and what it should ignore.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 3',
      html: `
        <ol class="lesson-steps">
          <li>Write a 40-line HARNESS.md for a real repo.</li>
          <li>For one ticket, list the 8 files you would retrieve and the 50 you would not.</li>
          <li>Take a 20-turn chat and compact it to 8 lines of decisions. That is your memory schema seed.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 4.</strong> Tools: the hands of the agent, with schemas and permissions.</p></div>
      `,
    },
  ],
  sourceNote: 'Retrieval details vary (grep vs embeddings). The packet + budget model does not.',
};
