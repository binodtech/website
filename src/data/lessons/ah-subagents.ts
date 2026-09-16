/** AI Harness — Class 8: Subagents & Multi-Agent Harness. */

export const ahSubagents = {
  slug: 'subagents',
  title: 'Class 8 — Subagents & Multi-Agent Harness',
  subtitle:
    'Multi-agent architecture is primarily an orchestration problem — not creating more agents. Single agent, subagents, specialists, patterns, communication.',
  byline: 'AI Harness Masterclass · Class 8 of 10 · ~1h 35m read · Advanced',
  interviewTip:
    'Delegate only for isolated context or real parallelism. Four agents on a one-file bug is a coordination tax, not architecture.',
  sections: [
    {
      id: 'single',
      title: 'Single Agent',
      html: `
        <pre><code>User → Agent → Tools</code></pre>
        <p>Default. One loop, one context, one permission grant. Prefer this until it hurts (context pollution between research and coding, or wall-clock on independent workstreams).</p>
      `,
    },
    {
      id: 'sub',
      title: 'Subagent',
      html: `
        <pre><code>                Main Agent
                    |
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    Research      Coding      Testing
     Agent         Agent       Agent</code></pre>
        <p>A subagent is a nested run: own context window, own tool subset, returns an <strong>artefact</strong> (report, patch, test output) to the parent. The parent is the orchestrator (Class 2 layer 2).</p>
        <pre><code>async function delegate(h: Harness, spec: SubagentSpec): Promise&lt;Artifact&gt; {
  const child = h.spawn({
    tools: spec.tools,           // often read-only for research
    grant: spec.maxLevel,
    system: spec.skill,          // specialized instructions
  });
  return child.loop.run(spec.task);
}</code></pre>
      `,
    },
    {
      id: 'roles',
      title: 'Specialized Agents',
      html: `
        <ul class="lesson-layers">
          <li><strong>Architect</strong> — designs; writes plan.md; no write_file to src/.</li>
          <li><strong>Developer</strong> — implements against the plan; L1–L2.</li>
          <li><strong>Test</strong> — writes/runs tests; may not “fix” by weakening asserts.</li>
          <li><strong>Security</strong> — reviews diff; read + report only.</li>
          <li><strong>Reviewer</strong> — fresh context, does not see the developer’s chain-of-thought, only the diff.</li>
        </ul>
      `,
    },
    {
      id: 'patterns',
      title: 'Orchestration Patterns',
      html: `
        <p><strong>Sequential:</strong> <code>A → B → C → D</code> — architect then developer then tests. Use when outputs are dependencies.</p>
        <p><strong>Parallel:</strong> task fans out to A, B, C — frontend / backend / docs on a frozen API contract.</p>
        <p><strong>Hierarchical:</strong> manager assigns workers, synthesises.</p>
        <p><strong>Reviewer:</strong> Developer → Reviewer → Developer fixes → Reviewer. Stop after N rounds.</p>
        <pre><code>async function reviewerLoop(h: Harness, task: Task) {
  let diff = await delegate(h, developer(task));
  for (let i = 0; i &lt; 3; i++) {
    const review = await delegate(h, reviewer(diff));
    if (review.approved) return diff;
    diff = await delegate(h, developer({ ...task, feedback: review }));
  }
  return h.approvals.escalate(diff);
}</code></pre>
      `,
    },
    {
      id: 'comm',
      title: 'Agent Communication',
      html: `
        <ul class="lesson-layers">
          <li><strong>Shared state</strong> — parent RunMemory, not a free-for-all chat.</li>
          <li><strong>Task results</strong> — typed artefacts (plan, patch, junit xml path).</li>
          <li><strong>Messages</strong> — sparse; prefer files.</li>
          <li><strong>Artifacts</strong> — git diffs, screenshots.</li>
          <li><strong>Context boundaries</strong> — security agent must not inherit the exploit PoC as “instructions.”</li>
          <li><strong>Conflict resolution</strong> — file locks / worktrees; human merge for overlapping writes.</li>
        </ul>
        <div class="lesson-callout"><strong>Main zest.</strong> Multi-agent architecture is primarily an orchestration problem—not simply a matter of creating more agents.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 8',
      html: `
        <ol class="lesson-steps">
          <li>For three real tasks, say single vs sequential vs parallel — and why.</li>
          <li>Define tool allowlists per specialist.</li>
          <li>Design the artefact schema the developer must return to the reviewer.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 9.</strong> Build the miniature coding harness end to end.</p></div>
      `,
    },
  ],
  sourceNote: 'Patterns are from distributed systems + agent literature; implement the smallest pattern that works.',
};
