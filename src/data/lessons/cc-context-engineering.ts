/** Claude Code — Class 3: Prompting, Context & CLAUDE.md. */

export const ccContextEngineering = {
  slug: 'context-engineering',
  title: 'Class 3 — Prompting, Context & CLAUDE.md',
  subtitle:
    'Treat context as finite working memory. Write prompts that specify investigation, constraints and verification. Put durable project rules in CLAUDE.md. Stack global → project → directory → task instructions. Use auto memory without turning it into junk.',
  byline: 'Claude Code Masterclass · Class 3 of 10 · ~1h 35m read · Intermediate',
  interviewTip:
    'The quality of an AI coding agent depends heavily on the quality of context and instructions you provide — not simply on the model. If two engineers get wildly different results from the same tool, look at what they put in CLAUDE.md and how they specified verification.',
  sections: [
    {
      id: 'prompt',
      title: 'Prompting Claude Code',
      children: [
        { id: 'prompt-bad', title: 'Bad vs better' },
        { id: 'prompt-seven', title: 'The seven-part agent prompt' },
      ],
      html: `
        <p>This is one of the most important classes. Anthropic’s prompting guidance emphasises clear instructions, relevant context, examples and structure. For an agent, the prompt is not a clever one-liner. It is a work order.</p>

        <h3 class="lesson-subhead" id="prompt-bad">Bad vs better</h3>
        <p>❌ Bad:</p>
        <blockquote><p>Fix my code.</p></blockquote>
        <p>✅ Better:</p>
        <blockquote><p>Investigate the authentication flow, identify why expired JWTs are accepted, explain the root cause, propose a fix, implement the fix, add regression tests, and run the relevant test suite.</p></blockquote>
        <p>The second prompt names the system (auth), the symptom (expired JWTs accepted), the required artefacts (root cause, proposal, implementation, tests), and the verification (run the suite). The agent now has a loop it can close.</p>
        <table>
          <thead><tr><th>Vague ask</th><th>What the agent is forced to invent</th><th>How to tighten it</th></tr></thead>
          <tbody>
            <tr><td>Fix my code</td><td>Which file, which bug, what “fixed” means</td><td>Symptom + module + failing test name</td></tr>
            <tr><td>Make it faster</td><td>Which metric, which path</td><td>p95 of GET /search, current 800ms, target 200ms, no schema change</td></tr>
            <tr><td>Add auth</td><td>OAuth? sessions? which IdP?</td><td>Existing user table, JWT already issued, wire middleware only</td></tr>
            <tr><td>Clean this up</td><td>Taste</td><td>“Extract FooService; public API unchanged; tests must stay green”</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="prompt-seven">The seven-part agent prompt</h3>
        <div class="lesson-flow">Role → Context → Task → Constraints → Expected output → Acceptance criteria → Verification</div>
        <ul class="lesson-layers">
          <li><strong>Role</strong> — only if it changes behaviour (“act as a security reviewer”, not “you are a helpful assistant”).</li>
          <li><strong>Context</strong> — pointers: files, failing tests, tickets, “do not touch billing/”.</li>
          <li><strong>Task</strong> — the engineering objective in one sentence.</li>
          <li><strong>Constraints</strong> — style, compatibility, time, blast radius.</li>
          <li><strong>Expected output</strong> — plan, diff, explanation, or all three in order.</li>
          <li><strong>Acceptance criteria</strong> — what “done” looks like in product terms.</li>
          <li><strong>Verification</strong> — the command whose output settles it.</li>
        </ul>
        <pre><code>Role: senior engineer on this repo (follow CLAUDE.md).
Context: failing test AuthFilterTest#rejectsExpiredToken; JWT middleware in src/auth.
Task: expired tokens must be rejected with 401.
Constraints: no new dependencies; keep existing token format.
Expected output: root cause in 5 lines, then a minimal patch.
Acceptance: expired token → 401; valid token still 200.
Verification: run the auth test class and paste the summary.</code></pre>
      `,
    },
    {
      id: 'context',
      title: 'Context Engineering',
      children: [
        { id: 'context-what', title: 'What context means' },
        { id: 'context-kinds', title: 'Kinds of context that actually help' },
        { id: 'context-finite', title: 'Context as finite working memory' },
        { id: 'context-chain', title: 'Better context → better code' },
      ],
      html: `
        <p>Session 1’s core context lesson: <strong>treat context as finite working memory</strong>. Everything you stuff in competes with the files the agent still needs to read.</p>

        <h3 class="lesson-subhead" id="context-what">What context means</h3>
        <p>Context is the information currently available to the model for this decision: your message, CLAUDE.md, open files it read, tool results, memory notes, MCP resources. It is not “the whole company wiki” unless you retrieved the relevant page.</p>

        <h3 class="lesson-subhead" id="context-kinds">Kinds of context that actually help</h3>
        <ul class="lesson-layers">
          <li><strong>Repository context</strong> — layout, languages, how to run tests.</li>
          <li><strong>Relevant files</strong> — the module you named, not the entire monorepo.</li>
          <li><strong>Documentation</strong> — README, ADRs, API specs that match the task.</li>
          <li><strong>Architecture</strong> — who owns the request path.</li>
          <li><strong>Existing conventions</strong> — naming, error envelopes, logging.</li>
          <li><strong>Tests</strong> — the contract. Often more honest than comments.</li>
          <li><strong>Git history</strong> — why a weird check exists (“don’t remove this, incident from 2024”).</li>
        </ul>
        <p>Dumping all of these into every prompt is how you blow the window. Point, don’t paste a novel.</p>

        <h3 class="lesson-subhead" id="context-finite">Context as finite working memory</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Finite context window filled with noise versus a lean window with CLAUDE.md, the failing test and two files">
            <rect class="dg-band r" x="12" y="16" width="336" height="140" rx="11" />
            <text class="dg-h" x="26" y="36">NOISE — WINDOW FULL, BRAIN EMPTY</text>
            <text class="dg-s" x="26" y="58">entire README pasted twice</text>
            <text class="dg-s" x="26" y="76">unrelated Slack thread</text>
            <text class="dg-s" x="26" y="94">generated code from last week</text>
            <text class="dg-s" x="26" y="112">“be careful” repeated 40 times</text>
            <text class="dg-s" x="26" y="138">Then the agent never reads the failing test.</text>
            <rect class="dg-band g" x="372" y="16" width="336" height="140" rx="11" />
            <text class="dg-h" x="386" y="36">LEAN — ROOM TO THINK</text>
            <text class="dg-s" x="386" y="58">CLAUDE.md (durable rules)</text>
            <text class="dg-s" x="386" y="76">failing test name</text>
            <text class="dg-s" x="386" y="94">two file paths</text>
            <text class="dg-s" x="386" y="112">constraint: no public API change</text>
            <text class="dg-s" x="386" y="138">Gather fills the rest on purpose.</text>
            <text class="dg-s" x="16" y="178">Session 1: CLAUDE.md + Second Brain / auto memory are how you persist the lean set across sessions without re-pasting.</text>
            <text class="dg-s" x="16" y="196">If memory is wrong, it is worse than no memory. Curate it.</text>
          </svg>
          <figcaption>Figure 1 — Context engineering is subtraction as much as addition.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="context-chain">Better context → better code</h3>
        <div class="lesson-flow">Better Context → Better Understanding → Better Plan → Better Code</div>
        <p>This is the critical concept. You cannot prompt your way out of a missing architectural fact. Put the fact where the agent will see it (CLAUDE.md or the task), then let the loop run.</p>
      `,
    },
    {
      id: 'claude-md',
      title: 'CLAUDE.md',
      children: [
        { id: 'md-what', title: 'What it is and why it matters' },
        { id: 'md-contents', title: 'What to put in it' },
        { id: 'md-example', title: 'A concrete skeleton' },
        { id: 'md-memory', title: 'Second brain and auto memory' },
      ],
      html: `
        <h3 class="lesson-subhead" id="md-what">What it is and why it matters</h3>
        <p><code>CLAUDE.md</code> is project-level instruction that is loaded into the agent’s working memory for this repo. It is how you stop repeating “we use JUnit 5, never Mockito inline mocks in this module” every session.</p>
        <p>It matters because the model does not remember last Tuesday. Files do.</p>

        <h3 class="lesson-subhead" id="md-contents">What to put in it</h3>
        <ul class="lesson-layers">
          <li>Project architecture (one screen, not a book)</li>
          <li>Coding standards that are non-obvious</li>
          <li>Architecture rules (“no business logic in controllers”)</li>
          <li>Testing instructions and the exact commands</li>
          <li>Security rules (no secrets in logs, PII handling)</li>
          <li>Build / lint / typecheck commands</li>
          <li>Database rules (migrations only via X)</li>
          <li>API conventions (error JSON shape)</li>
          <li>Do-not-change areas</li>
        </ul>
        <p>Session 1 assignment: <strong>initialize CLAUDE.md and write canonical patterns</strong> — the patterns a new engineer (or agent) would otherwise violate on day one.</p>

        <h3 class="lesson-subhead" id="md-example">A concrete skeleton</h3>
        <pre><code>CLAUDE.md

# Architecture
- HTTP → routes → services → repo. Do not skip layers.
- Todos persist in SQLite via src/repo.

# Coding standards
- Match existing file names and error helpers.
- No new dependencies without asking.

# Testing
- npm test
- New HTTP behaviour needs a test in tests/.

# Database
- Schema changes only in migrations/.

# API conventions
- JSON { data, error }. HTTP codes as in routes/todos.js.

# Security
- Never log tokens. Never commit .env.

# Do not change
- scripts/prod-deploy.sh</code></pre>
        <p>Keep it short enough that it gets read. A 3,000-line CLAUDE.md is a second unread README.</p>

        <h3 class="lesson-subhead" id="md-memory">Second brain and auto memory</h3>
        <p>Session 1 groups <strong>CLAUDE.md, second brain, auto memory</strong>. Durable project truth belongs in CLAUDE.md (versioned, reviewed). Session-learned trivia (“the flaky test is timezone-related”) may land in auto memory if the product offers it. Review memory the way you review code: wrong memories become permanent bugs in the agent’s head.</p>
      `,
    },
    {
      id: 'hierarchy',
      title: 'Hierarchical Instructions',
      children: [
        { id: 'h-stack', title: 'The stack' },
        { id: 'h-conflict', title: 'When they conflict' },
      ],
      html: `
        <h3 class="lesson-subhead" id="h-stack">The stack</h3>
        <div class="lesson-flow">Global instructions → Project instructions → Directory/module instructions → Task-specific instructions</div>
        <ul class="lesson-layers">
          <li><strong>Global</strong> — your user-level Claude Code preferences (how you like commits explained, language).</li>
          <li><strong>Project</strong> — CLAUDE.md at repo root.</li>
          <li><strong>Directory/module</strong> — nested CLAUDE.md or module READMEs the agent is told to honour for that tree.</li>
          <li><strong>Task</strong> — this chat’s work order. Most specific wins for this session.</li>
        </ul>

        <h3 class="lesson-subhead" id="h-conflict">When they conflict</h3>
        <p>If global says “always use bun” and the project uses npm, the project should win for this repo — and you should not fight it in the prompt every time. Put the exception in CLAUDE.md. Task-level “do not edit today, only plan” must override a CLAUDE.md that says “always implement.”</p>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 3',
      html: `
        <ol class="lesson-steps">
          <li>Rewrite one vague work ticket as a seven-part prompt.</li>
          <li>Write CLAUDE.md for the Todo app (or the open-source repo from Class 2). Include test commands and one do-not-change path.</li>
          <li>Add 5–10 canonical patterns (error shape, layering, how to name tests).</li>
          <li>Run the same “add a feature” prompt twice: once with empty CLAUDE.md, once with yours. Diff the two agent behaviours. That comparison is the lesson.</li>
        </ol>
        <div class="lesson-callout"><strong>Main zest.</strong> The quality of an AI coding agent depends heavily on the quality of context and instructions you provide — not simply on the model.</p></div>
        <div class="lesson-callout"><strong>Next up — Class 4.</strong> Claude Code as a software-engineering agent: the observe/plan/act loop in practice, exploration, planning before coding, debugging, refactoring.</p></div>
      `,
    },
  ],
  sourceNote:
    'Prompting and agentic-system guidance: <a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables" target="_blank" rel="noopener noreferrer">Anthropic prompting docs</a> and <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code overview</a>.',
};
