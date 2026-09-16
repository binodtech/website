/** Claude Code — Class 4: Claude Code as a Software Engineering Agent. */

export const ccCodingAgent = {
  slug: 'coding-agent',
  title: 'Class 4 — Claude Code as a Software Engineering Agent',
  subtitle:
    'Move from assistant to engineer: the agent loop, grounded codebase exploration, planning before coding, debugging from symptom to regression test, and refactoring against acceptance criteria.',
  byline: 'Claude Code Masterclass · Class 4 of 10 · ~1h 30m read · Intermediate',
  interviewTip:
    'Don’t ask Claude merely to “write code.” Give it an engineering objective with acceptance criteria. That sentence is the whole class.',
  sections: [
    {
      id: 'loop',
      title: 'The Agent Loop',
      children: [
        { id: 'loop-pic', title: 'Observe through verify' },
        { id: 'loop-human', title: 'Where you stay in the loop' },
      ],
      html: `
        <p>Class 1 named gather → act → verify. Now we run it as an engineer’s loop, including the correction cycle.</p>
        <div class="lesson-flow">Observe → Understand → Plan → Act → Observe → Test → Correct → Verify</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 160" role="img" aria-label="Engineering agent loop">
            <rect class="dg-box b" x="12" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="52" y="64" text-anchor="middle">observe</text>
            <rect class="dg-box c" x="108" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="148" y="64" text-anchor="middle">understand</text>
            <rect class="dg-box p" x="204" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="244" y="64" text-anchor="middle">plan</text>
            <rect class="dg-box o" x="300" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="340" y="64" text-anchor="middle">act</text>
            <rect class="dg-box y" x="396" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="436" y="64" text-anchor="middle">observe</text>
            <rect class="dg-box" x="492" y="40" width="80" height="40" rx="8" /><text class="dg-s" x="532" y="64" text-anchor="middle">test</text>
            <rect class="dg-box r" x="588" y="40" width="52" height="40" rx="8" /><text class="dg-s" x="614" y="64" text-anchor="middle">fix</text>
            <rect class="dg-box g" x="652" y="40" width="56" height="40" rx="8" /><text class="dg-s" x="680" y="64" text-anchor="middle">verify</text>
            <text class="dg-s" x="16" y="110">The second Observe is not optional: it is reading the compiler, the test runner, the log line.</text>
            <text class="dg-s" x="16" y="128">Correct re-enters Plan with new evidence. Verify is a command, not a vibe.</text>
          </svg>
          <figcaption>Figure 1 — Same loop as Class 1, named the way a senior engineer narrates a debugging session.</figcaption>
        </figure>
        <h3 class="lesson-subhead" id="loop-human">Where you stay in the loop</h3>
        <p>You own the objective, the constraints, and the final “ship it.” The agent owns search, drafting, running tests, iterating. If you skip reading the plan, you have hired a intern you never talk to.</p>
      `,
    },
    {
      id: 'explore',
      title: 'Codebase Exploration',
      children: [
        { id: 'ex-moves', title: 'The investigation moves' },
        { id: 'ex-grounded', title: 'Grounded claims only' },
      ],
      html: `
        <p>Anthropic’s current docs emphasise <strong>grounded investigation of the codebase</strong>. Teach the agent — and yourself — these moves:</p>
        <ul class="lesson-layers">
          <li><strong>Search</strong> — symbols, error strings, route paths.</li>
          <li><strong>File discovery</strong> — where the feature actually lives vs where the name suggests.</li>
          <li><strong>Dependency tracing</strong> — who imports this, what it imports.</li>
          <li><strong>Call-chain analysis</strong> — request in, side effects out.</li>
          <li><strong>Configuration discovery</strong> — env, flags, feature gates.</li>
          <li><strong>Finding tests</strong> — the executable spec.</li>
          <li><strong>Understanding architecture</strong> — layers, boundaries, “this package is the source of truth.”</li>
        </ul>
        <h3 class="lesson-subhead" id="ex-grounded">Grounded claims only</h3>
        <p>Reject answers that start with “typically in Spring apps…” unless they immediately cite <em>your</em> files. Ask: “Quote the function and path that implements this.”</p>
      `,
    },
    {
      id: 'plan',
      title: 'Planning Before Coding',
      html: `
        <p>Force this sequence, especially on anything larger than a typo:</p>
        <ol class="lesson-steps">
          <li>Understand requirements</li>
          <li>Inspect existing implementation</li>
          <li>Identify affected components</li>
          <li>Create implementation plan</li>
          <li>Discuss risks</li>
          <li>Implement</li>
          <li>Test</li>
        </ol>
        <p>Session 1 used plan mode to onboard. Session 2 will use it at scale. Here, plan mode is how you stop the agent from coding the first idea that fits a blog post.</p>
        <blockquote><p>Do not edit yet. List files you would touch, risks (API compatibility, data migration, perf), and the test command you will run. Wait for my OK.</p></blockquote>
      `,
    },
    {
      id: 'debug',
      title: 'Debugging',
      html: `
        <p>Real demonstration path:</p>
        <div class="lesson-flow">Bug → Reproduce → Inspect logs → Trace code → Identify root cause → Fix → Regression test → Verify</div>
        <p>Give the agent the reproduction, not the theory. “It fails on expired tokens in staging” is weaker than “here is the request, here is the log line, here is the test I expect to fail.”</p>
        <p>If it cannot reproduce, it cannot honestly claim a fix. Make reproduction the first acceptance criterion.</p>
      `,
    },
    {
      id: 'refactor',
      title: 'Refactoring',
      html: `
        <p>Examples that are agent-sized if tests exist:</p>
        <ul class="lesson-layers">
          <li>Extract a service</li>
          <li>Remove duplication</li>
          <li>Improve error handling</li>
          <li>Improve performance (with a measurement, not a feeling)</li>
          <li>Modernize legacy code (with a compatibility constraint)</li>
        </ul>
        <p>Always attach: public behaviour unchanged; tests are the contract; show the diffstat before you merge the session mentally.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Don’t ask Claude merely to “write code.” Give Claude an engineering objective with acceptance criteria.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 4',
      html: `
        <ol class="lesson-steps">
          <li>Plant a bug in the Todo app (e.g. DELETE returns 200 but does not delete). Ask the agent to debug using the loop. Require a new regression test.</li>
          <li>Ask for a refactor (extract service) with “API unchanged” and a full test run.</li>
          <li>Timebox a plan-only session on a real work bug. Only implement after you accept the plan.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 5.</strong> A real software-development session: feature work, TDD, git, code review, large changes.</p></div>
      `,
    },
  ],
  sourceNote:
    'Agentic coding and grounded investigation: <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code docs</a>.',
};
