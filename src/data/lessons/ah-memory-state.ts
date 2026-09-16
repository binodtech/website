/** AI Harness — Class 6: Memory, State & Long-Running Tasks. */

export const ahMemoryState = {
  slug: 'memory-state',
  title: 'Class 6 — Memory, State & Long-Running Tasks',
  subtitle:
    'A professional harness must survive interruption. Context is what the agent currently sees; memory is what it retains. State machines, milestones, recovery.',
  byline: 'AI Harness Masterclass · Class 6 of 10 · ~1h 35m read · Advanced',
  interviewTip:
    'Agent state should not live only inside the model’s context window. If the process dies, the plan, todos and evidence must still be on disk.',
  sections: [
    {
      id: 'vs',
      title: 'Memory vs Context',
      html: `
        <pre><code>Context = What the agent currently sees
Memory  = What the agent retains for future work</code></pre>
        <p>Context is ephemeral and budgeted (Class 3). Memory is a store: files, SQLite, Redis, a <code>runs/{id}/state.json</code>. The harness <em>projects</em> a slice of memory into context each step.</p>
      `,
    },
    {
      id: 'types',
      title: 'Types of Memory',
      html: `
        <p><strong>Short-term:</strong> current conversation, current task, tool results — often just the working state file for this run.</p>
        <p><strong>Long-term:</strong> user preferences, project knowledge, previous decisions — HARNESS.md, a decisions log, embeddings of ADRs.</p>
        <p><strong>Working memory:</strong> current plan, TODOs, intermediate results — the state machine’s fields.</p>
        <pre><code>type RunMemory = {
  task: string;
  phase: Phase;
  plan?: string;
  todos: { id: string; title: string; done: boolean }[];
  facts: string[];          // extracted, durable
  artifacts: string[];      // paths to diffs, logs
  errors: { at: string; message: string }[];
};</code></pre>
      `,
    },
    {
      id: 'sm',
      title: 'State Machine',
      html: `
        <pre><code>START → UNDERSTAND → PLAN → EXECUTE → VERIFY → COMPLETE

Failure:
EXECUTE → FAIL → DIAGNOSE → RETRY</code></pre>
        <pre><code>function transition(s: RunMemory, event: Event): RunMemory {
  if (s.phase === "EXECUTE" && event.type === "tool_error") {
    return { ...s, phase: "DIAGNOSE", errors: [...s.errors, { at: now(), message: event.error }] };
  }
  if (s.phase === "VERIFY" && event.type === "tests_passed") {
    return { ...s, phase: "COMPLETE" };
  }
  if (s.phase === "VERIFY" && event.type === "tests_failed") {
    return { ...s, phase: "EXECUTE", todos: reopenFailed(s.todos, event) };
  }
  return s;
}</code></pre>
        <p>The model proposes; the state machine <em>accepts</em> legal transitions. That stops “I’m done” while tests are red.</p>
      `,
    },
    {
      id: 'long',
      title: 'Long-Running Tasks',
      html: `
        <p>Example: refactor a 500K-line application. One window cannot hold it.</p>
        <pre><code>Task → Milestone 1 → Persist state → Milestone 2 → Persist state → Milestone 3 → Final verification</code></pre>
        <p><strong>Use case.</strong> Milestone 1: inventory packages. Milestone 2: extract <code>PaymentService</code> in module A with tests. Milestone 3: migrate callers. Each milestone is a run with its own verify command. The parent task id links them in memory.</p>
      `,
    },
    {
      id: 'recovery',
      title: 'Recovery',
      html: `
        <ul class="lesson-layers">
          <li><strong>Model crashes / timeout</strong> — retry with backoff; do not lose state.json.</li>
          <li><strong>Tool fails</strong> — DIAGNOSE; cap retries; escalate to human.</li>
          <li><strong>Network fails</strong> — idempotent tools (Class 10); replay safely.</li>
          <li><strong>Context window fills</strong> — compact + spill tool output to artefacts.</li>
          <li><strong>Process restarts</strong> — load state, resume phase, do not start from zero.</li>
          <li><strong>Agent gets stuck</strong> — loop detector (same tool+args N times) → FAIL + human.</li>
        </ul>
        <pre><code>async function resume(runId: string, h: Harness) {
  const s = await h.memory.load(runId);
  if (!s) throw new Error("unknown run");
  if (s.phase === "COMPLETE") return s;
  return h.loop.runFrom(s);
}</code></pre>
        <div class="lesson-callout"><strong>Main zest.</strong> A professional harness must survive interruption. Agent state should not live only inside the model's context window.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 6',
      html: `
        <ol class="lesson-steps">
          <li>Write <code>RunMemory</code> to disk after every tool call in a fake loop.</li>
          <li>Kill the process mid-run and resume. That is the exam.</li>
          <li>Split “migrate our auth to OAuth” into milestones with verify commands.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 7.</strong> MCP: standard tool connectivity to the outside world.</p></div>
      `,
    },
  ],
  sourceNote: 'Long-horizon patterns match current agent-platform guidance: persist, milestone, continue.',
};
