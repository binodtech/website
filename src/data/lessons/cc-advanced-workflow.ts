/** Claude Code — Class 5: Advanced Development Workflow. */

export const ccAdvancedWorkflow = {
  slug: 'advanced-workflow',
  title: 'Class 5 — Advanced Development Workflow',
  subtitle:
    'A real software-development session: feature work end to end, TDD with an agent, git that stays safe, senior-level review, and decomposing changes too large for one sitting.',
  byline: 'Claude Code Masterclass · Class 5 of 10 · ~1h 35m read · Intermediate',
  interviewTip:
    'Claude Code becomes significantly more useful when you treat it like a junior/mid-level engineer working inside a disciplined engineering process rather than an autocomplete tool.',
  sections: [
    {
      id: 'feature',
      title: 'Feature Development',
      html: `
        <p>This class should feel like a real session, not a feature tour. Example objective:</p>
        <blockquote><p>Add OAuth2 authentication to an existing Spring Boot application. Match existing package structure. Do not invent a second security stack if Spring Security is already there. Tests must cover the happy path and unauthorized.</p></blockquote>
        <p>Claude should:</p>
        <div class="lesson-flow">Analyze → Plan → Implement → Test → Document</div>
        <p>If your stack is Node instead of Spring, keep the shape: existing app, real auth, tests, docs. The stack in the example is for BSA’s Java audience; the workflow is universal.</p>
        <p>Analyze means: find current security config, user model, how tests stand up the context. Plan means: files, risks (session vs JWT, redirect URIs). Implement is boring if the plan was good. Document is the README/CLAUDE.md update so the next session does not rediscover OAuth from scratch.</p>
      `,
    },
    {
      id: 'tdd',
      title: 'Test-Driven Development',
      children: [
        { id: 'tdd-loop', title: 'The TDD loop with an agent' },
        { id: 'tdd-kinds', title: 'Kinds of tests' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tdd-loop">The TDD loop with an agent</h3>
        <div class="lesson-flow">Requirement → Test → Implementation → Run test → Fix → Refactor</div>
        <blockquote><p>Write a failing test for DELETE /todos/:id returning 404 when missing. Do not implement yet. Run the test and show the failure. Then implement until it passes. Then refactor if the code is noisy. Do not weaken the test to get green.</p></blockquote>
        <p>Agents love to write the implementation first and a test that mirrors it. Your job is to freeze the test’s meaning before the code exists.</p>
        <h3 class="lesson-subhead" id="tdd-kinds">Kinds of tests</h3>
        <ul class="lesson-layers">
          <li><strong>Unit tests</strong> — fast, isolated, good for domain rules.</li>
          <li><strong>Integration tests</strong> — HTTP + DB, the ones that catch wiring bugs.</li>
          <li><strong>Regression tests</strong> — the bug you just fixed, named after the incident if you have one.</li>
          <li><strong>Test failure analysis</strong> — read the assertion, not just “it’s red.” Agents skip this; make them quote the failure.</li>
        </ul>
      `,
    },
    {
      id: 'git',
      title: 'Working With Git',
      html: `
        <ul class="lesson-layers">
          <li><strong>Git status</strong> — start every session knowing what was already dirty.</li>
          <li><strong>Branches</strong> — one agent session, one branch, named after the objective.</li>
          <li><strong>Diff</strong> — you review <code>git diff</code>, not the model’s summary of the diff.</li>
          <li><strong>Commit strategy</strong> — small commits you would be willing to revert independently. Do not let the agent squash a refactor with a behaviour change.</li>
          <li><strong>Reviewing changes</strong> — file by file, especially generated config.</li>
          <li><strong>Safe changes</strong> — no force-push, no amending shared history, no committing secrets. Put this in CLAUDE.md.</li>
          <li><strong>Pull-request preparation</strong> — title, summary of why, test evidence, risk notes. Ask the agent to draft; you own the merge.</li>
        </ul>
        <div class="lesson-callout lesson-warn"><strong>Default git rules for agents.</strong> Never update git config. Never skip hooks unless you explicitly asked. Never force-push main. Class 10 repeats this as production law.</p></div>
      `,
    },
    {
      id: 'review',
      title: 'Code Review',
      html: `
        <blockquote><p>Review this change as a senior engineer. Do not flatter. Cite files.</p></blockquote>
        <p>Review for:</p>
        <ul class="lesson-layers">
          <li>Bugs</li>
          <li>Security</li>
          <li>Performance</li>
          <li>Maintainability</li>
          <li>Error handling</li>
          <li>Test coverage</li>
          <li>API compatibility</li>
        </ul>
        <p>A useful pattern: one session implements, a fresh session (or subagent in Class 8) reviews with a clean context so it does not defend its own code.</p>
      `,
    },
    {
      id: 'large',
      title: 'Large Changes',
      html: `
        <p>Teach how to divide:</p>
        <div class="lesson-flow">Large requirement → Architecture → Tasks → Implementation → Testing → Review</div>
        <p>One context window cannot hold a rewrite of payments. Milestones persist in docs, tickets, and CLAUDE.md. Each session takes one task with its own tests. Class 10 returns to long-horizon work explicitly.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Treat Claude Code like a junior/mid engineer inside a disciplined process, not an autocomplete tool.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 5',
      html: `
        <ol class="lesson-steps">
          <li>Add one real feature to Todo (filtering, pagination, or API tokens) using TDD with the agent.</li>
          <li>Open a PR-style summary from the agent; then review the diff yourself and write three comments the agent missed.</li>
          <li>Take a large wish (“turn this into a multi-user app”) and split it into an architecture note plus a sequenced task list. Implement only task 1.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 6.</strong> Skills, slash commands, SKILL.md anatomy, hooks, and automated guardrails — the Session 1 automation block, done properly.</p></div>
      `,
    },
  ],
  sourceNote:
    'Workflow habits compose with official tool behaviour in the <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code documentation</a>.',
};
