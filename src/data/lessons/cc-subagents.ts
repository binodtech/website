/** Claude Code — Class 8: Subagents & Multi-Agent Development. */

export const ccSubagents = {
  slug: 'subagents',
  title: 'Class 8 — Subagents & Multi-Agent Development',
  subtitle:
    'What a subagent is, when delegation helps, subagents versus agent teams, parallel work with git worktrees, and coordination: boundaries, conflicts, verification, synthesis.',
  byline: 'Claude Code Masterclass · Class 8 of 10 · ~1h 35m read · Advanced',
  interviewTip:
    'Multi-agent development isn’t about spawning as many agents as possible. The important question is: which work benefits from independent context or parallel execution?',
  sections: [
    {
      id: 'what',
      title: 'What is a Subagent?',
      html: `
        <pre><code>Main Agent
    |
    +---- Research Agent
    |
    +---- Coding Agent
    |
    +---- Testing Agent
    |
    +---- Security Agent</code></pre>
        <p>A subagent is a delegated run with its own context window (and often a specialised prompt/skill). The parent assigns a bounded task and reads the result. Anthropic’s agentic guidance recommends delegation when work can be parallelized or benefits from isolated context.</p>
        <p>Isolated context is the point: a reviewer that did not write the code is less likely to defend it.</p>
      `,
    },
    {
      id: 'why',
      title: 'Why Use Subagents?',
      html: `
        <ul class="lesson-layers">
          <li><strong>Parallel work</strong> — backend and frontend on a stable API contract.</li>
          <li><strong>Specialized expertise</strong> — security skill vs implementation skill.</li>
          <li><strong>Context isolation</strong> — research dump does not pollute the coding thread.</li>
          <li><strong>Complex tasks</strong> — investigate three hypotheses without mixing traces.</li>
          <li><strong>Independent investigation</strong> — two readers of the same incident.</li>
        </ul>
        <p>Do not use subagents to split a two-line bugfix. Coordination cost exceeds the gain.</p>
      `,
    },
    {
      id: 'teams',
      title: 'Subagents vs Agent Teams + hooks',
      html: `
        <p>Session 2: <strong>Subagents vs. Agent Teams + hooks</strong>.</p>
        <ul class="lesson-layers">
          <li><strong>Subagent</strong> — child of this session, result returns here, lifetime is the task.</li>
          <li><strong>Agent team / extra instances</strong> — separate Claude Code processes, often in <strong>git worktrees</strong>, merging via PR. Longer lived, more isolation, more human merge work.</li>
          <li><strong>Hooks</strong> — still fire per instance. Teams without shared hooks ship four formatters. Put hooks in the repo so every worktree inherits them.</li>
        </ul>
      `,
    },
    {
      id: 'workflow',
      title: 'Build a Multi-Agent Workflow',
      html: `
        <pre><code>                Claude Code
                     |
        +------------+------------+
        |            |            |
   Architect      Developer    Security
        |            |            |
        +------------+------------+
                     |
                  Tester
                     |
                 Final Review</code></pre>
        <p>Architect produces a plan artefact (files, API, risks). Developer implements against that plan. Security reviews the diff with a security skill. Tester adds/runs tests. Final review is human or a fresh review command.</p>
        <p>Serialize Architect → Developer if the API is not stable. Parallelize Developer and “write tests from the contract” only when the contract is written down.</p>
      `,
    },
    {
      id: 'parallel',
      title: 'Parallel Development',
      html: `
        <pre><code>Task
 |
 +-- Agent 1 → Backend
 |
 +-- Agent 2 → Frontend
 |
 +-- Agent 3 → Tests
 |
 +-- Agent 4 → Documentation</code></pre>
        <p>Session 2: <strong>git worktrees and multi-agent workflow</strong>. Worktrees give each instance its own files on disk so they do not overwrite each other mid-edit.</p>
        <p>Session 2 assignment preview (you will fully execute in Class 9): <strong>shared CLAUDE.md with stack, ports, and API contract; run Claude instances in separate worktrees</strong>.</p>
        <p>Without a shared contract, parallel agents invent two APIs. The CLAUDE.md is the lockfile of intent.</p>
      `,
    },
    {
      id: 'coord',
      title: 'Agent Coordination',
      html: `
        <p>Teach:</p>
        <ul class="lesson-layers">
          <li><strong>Delegation</strong> — one owner of the objective.</li>
          <li><strong>Context</strong> — what each child is allowed to see.</li>
          <li><strong>Task boundaries</strong> — files or layers owned per agent.</li>
          <li><strong>Results</strong> — artefacts: plan.md, diff, test output — not vibes.</li>
          <li><strong>Conflicts</strong> — same file edited twice; merge is a human skill.</li>
          <li><strong>Verification</strong> — integration tests after the merge, not only unit tests in each tree.</li>
          <li><strong>Final synthesis</strong> — one narrative of what shipped.</li>
        </ul>
        <div class="lesson-callout"><strong>Main zest.</strong> Delegate only when independent context or genuine parallelism helps.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 8',
      html: `
        <ol class="lesson-steps">
          <li>On Todo, delegate a security review of DELETE to a subagent (or a fresh session with only the diff).</li>
          <li>Create two git worktrees. Agent A adds a field on the API; Agent B updates README. Merge. Note the conflicts you did not expect.</li>
          <li>Write a one-page API contract before attempting any parallel feature work.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 9.</strong> One real application, all pieces together: architecture, scaffold, implement, debug, productionise, plus Session 2’s full-stack parallel lab.</p></div>
      `,
    },
  ],
  sourceNote:
    'Subagent orchestration: Anthropic agentic guidance and current <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code documentation</a>.',
};
