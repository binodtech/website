/** Claude Code — Class 6: Skills, Commands & Hooks. */

export const ccSkillsCommandsHooks = {
  slug: 'skills-commands-hooks',
  title: 'Class 6 — Skills, Commands & Hooks',
  subtitle:
    'Slash commands make workflows reusable. Skills (SKILL.md) make expertise reusable. Hooks make engineering rules enforceable. Wire them into a guardrail chain: format, analyse, test, scan.',
  byline: 'Claude Code Masterclass · Class 6 of 10 · ~1h 40m read · Advanced',
  interviewTip:
    'Commands make workflows reusable; skills make expertise reusable; hooks make engineering rules enforceable. If you only remember one sentence from Session 1’s automation block, remember that.',
  sections: [
    {
      id: 'commands',
      title: 'Reusable Commands',
      children: [
        { id: 'cmd-slash', title: 'Slash commands' },
        { id: 'cmd-custom', title: 'Custom commands and standard ops' },
      ],
      html: `
        <p>Session 1 introduced slash commands in the first hour. Now you author them so the team shares one way to review, test and debug.</p>
        <h3 class="lesson-subhead" id="cmd-slash">Slash commands</h3>
        <p>A slash command is a named, reusable prompt (and sometimes a small workflow) you invoke as <code>/review</code> instead of retyping a paragraph. Built-ins control the session; customs encode how <em>your</em> team ships.</p>
        <h3 class="lesson-subhead" id="cmd-custom">Custom commands and standard ops</h3>
        <pre><code>/review              senior review: bugs, security, tests, API compat
/test                run the canonical test command from CLAUDE.md
/debug               reproduce → trace → root cause → regression test
/explain             grounded explanation with file citations
/security-review     authz, injection, secrets, least privilege
/create-api          route + service + test matching existing layers</code></pre>
        <p>Standardising developer operations means a new hire (and an agent) does not invent a fourth way to run tests. Put the command’s meaning in CLAUDE.md too, so even without slash it is discoverable.</p>
      `,
    },
    {
      id: 'skills',
      title: 'Skills and SKILL.md',
      children: [
        { id: 'sk-what', title: 'What is a skill?' },
        { id: 'sk-anatomy', title: 'SKILL.md anatomy' },
        { id: 'sk-practical', title: 'Practical skills to build' },
        { id: 'sk-session', title: 'Session 1: skill from a real workflow' },
      ],
      html: `
        <h3 class="lesson-subhead" id="sk-what">What is a skill?</h3>
        <p>A skill is packaged expertise the agent can load when the task matches: instructions, examples, maybe scripts. Unlike a one-off prompt, it is versioned with the repo (or your user skills) and reviewed like code.</p>
        <h3 class="lesson-subhead" id="sk-anatomy">SKILL.md anatomy</h3>
        <p>Session 1: <strong>reusable workflows and SKILL.md anatomy</strong>. A typical skill file states:</p>
        <ul class="lesson-layers">
          <li>Name and when to use it (trigger)</li>
          <li>Steps in order (gather → act → verify for that domain)</li>
          <li>Constraints and forbidden actions</li>
          <li>Canonical examples (input/output)</li>
          <li>Verification commands</li>
        </ul>
        <pre><code># /triage-logs (sketch)

When: user pastes logs or points at a log file.
Steps:
1. Extract timestamps, request ids, ERROR lines.
2. Map to code via grep of the message.
3. Hypothesise root cause with file citations.
4. Propose a failing test if none exists.
5. Do not restart production.

Verify: cite at least one source file. No generic "restart the pod" unless logs show crashloop.</code></pre>
        <h3 class="lesson-subhead" id="sk-practical">Practical skills to build</h3>
        <pre><code>Java code reviewer
Spring Boot architect
SQL optimizer
API security reviewer
Test generator
Documentation generator</code></pre>
        <p>Each of these is a SKILL.md plus examples from <em>your</em> codebase, not a generic internet persona.</p>
        <h3 class="lesson-subhead" id="sk-session">Session 1: skill from a real workflow</h3>
        <p>Assignment: take a workflow you already do by hand and encode it. The intensive used: <strong>build endpoint, report template, and /triage-logs skill</strong>. Pick the one you will actually invoke next week.</p>
      `,
    },
    {
      id: 'hooks',
      title: 'Hooks',
      html: `
        <p>Explain the chain:</p>
        <div class="lesson-flow">Claude action → Hook → Automated behaviour</div>
        <p>Examples:</p>
        <ul class="lesson-layers">
          <li>Before tool execution — block <code>rm -rf</code>, block writes outside the repo, block <code>.env</code>.</li>
          <li>After tool execution — format, lint, remind to run tests.</li>
          <li>Validation — schema, OpenAPI, migration dry-run.</li>
          <li>Formatting — the team formatter, not the model’s taste.</li>
          <li>Security checks — secret scan on the diff.</li>
          <li>Test execution — after a set of file writes, run the fast suite.</li>
        </ul>
        <p>Session 2 will combine hooks with agent teams. Here, get one hook working on your Todo repo: after edits to <code>src/</code>, run tests.</p>
      `,
    },
    {
      id: 'guard',
      title: 'Automating Guardrails',
      html: `
        <p>Example chain:</p>
        <div class="lesson-flow">Claude modifies Java → Formatter → Static analysis → Unit tests → Security scan</div>
        <p>Session 2’s “full loop” homework is this idea at project scale: <strong>reusable skills, validation hooks, tests, and self-correction</strong>. Start the chain in Class 6 so Class 9 is not a science fair of disconnected features.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Commands make workflows reusable; skills make expertise reusable; hooks make engineering rules enforceable.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 6',
      html: `
        <ol class="lesson-steps">
          <li>Add <code>/review</code> and <code>/test</code> as custom commands that match your CLAUDE.md.</li>
          <li>Write a SKILL.md for one real workflow (endpoint, report template, or /triage-logs).</li>
          <li>Add one hook: format or test after source edits. Confirm it fires.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 7.</strong> MCP: connect Claude Code to GitHub, databases, browsers, and your own knowledge server — and learn when not to install a server.</p></div>
      `,
    },
  ],
  sourceNote:
    'Skills, commands and hooks evolve with the product. Confirm current file locations in the <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code docs</a>.',
};
