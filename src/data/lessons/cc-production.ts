/** Claude Code — Class 10: Production Engineering & Best Practices. */

export const ccProduction = {
  slug: 'production',
  title: 'Class 10 — Production Engineering & Best Practices',
  subtitle:
    'Capstone: the AI-native engineer’s SDLC, production guardrails, reliability habits, long-horizon context, Claude Code in CI/CD, and what the role becomes. The goal is not to replace the software engineer.',
  byline: 'Claude Code Masterclass · Class 10 of 10 · ~1h 45m read · Advanced',
  interviewTip:
    'The goal isn’t to replace the software engineer. The goal is to change what the software engineer spends time doing — specifying, reviewing, verifying, and designing guardrails.',
  sections: [
    {
      id: 'role',
      title: 'From Developer → AI-Augmented Engineer',
      html: `
        <p>Traditional engineer:</p>
        <div class="lesson-flow">Requirement → Design → Code → Test → Review → Deploy</div>
        <p>AI-native engineer:</p>
        <div class="lesson-flow">Requirement → AI-assisted Design → AI-assisted Coding → AI Testing → AI Review → Security Validation → Human Approval → Deploy</div>
        <p>Human approval did not disappear. It moved to the highest-leverage points: objectives, threat model, merge, production data.</p>
      `,
    },
    {
      id: 'guard',
      title: 'Production Guardrails',
      html: `
        <ul class="lesson-layers">
          <li><strong>Permissions</strong> — least privilege for tools, MCP, and shell.</li>
          <li><strong>Human approval</strong> — destructive ops, schema changes, dependency adds, prod deploys.</li>
          <li><strong>Secrets</strong> — never in prompts, CLAUDE.md, logs, or screenshots.</li>
          <li><strong>Sensitive data</strong> — treat customer dumps as off-limits unless you have a legal/process reason and a scrubber.</li>
          <li><strong>Tool access</strong> — production MCP vs staging MCP are different trust worlds.</li>
          <li><strong>Sandboxing</strong> — prefer containers/devboxes for autonomous runs.</li>
          <li><strong>Auditability</strong> — who ran which agent, on which commit, with which tools. Keep transcripts for incident review.</li>
          <li><strong>Code review</strong> — no “the agent said tests passed” without CI on the same SHA.</li>
        </ul>
      `,
    },
    {
      id: 'rel',
      title: 'Reliability',
      html: `
        <ul class="lesson-layers">
          <li>Don’t blindly trust generated code</li>
          <li>Tests are mandatory</li>
          <li>Verify assumptions (the library you “know” may not be the one in package.json)</li>
          <li>Validate dependencies (typosquatting, surprise majors)</li>
          <li>Review destructive operations</li>
          <li>Don’t allow uncontrolled autonomy</li>
        </ul>
        <p>Session 2’s <strong>AI-readiness audit</strong> is a checklist you run on every repo before widening permissions: tests, CLAUDE.md, secrets hygiene, hooks, a verify command, rollback story.</p>
        <p><strong>Validation harnesses</strong> are how you keep agents honest: contract tests, golden screenshots, eval sets for the AI service, CI as the source of truth.</p>
      `,
    },
    {
      id: 'ctx',
      title: 'Context Management (long-horizon)',
      html: `
        <p>Anthropic’s current guidance discusses long-horizon work, context windows, persistent state, and continuing complex tasks across windows.</p>
        <div class="lesson-flow">Large task → Break into milestones → Persist state → Update documentation → Continue → Verify</div>
        <p>Persist in the repo: milestone list, decisions, CLAUDE.md updates, failing tests that define the next slice. Do not persist in a chat you will lose.</p>
      `,
    },
    {
      id: 'cicd',
      title: 'Claude Code + CI/CD',
      html: `
        <pre><code>GitHub PR
    ↓
Claude Code
    ↓
Code Review
    ↓
Tests
    ↓
Security Analysis
    ↓
Human Approval
    ↓
Deployment</code></pre>
        <p>Non-interactive / CI modes exist so the agent can comment on a PR. Same rules: no secrets in logs, least privilege tokens, human merge gate. The agent is a reviewer, not the release manager.</p>
      `,
    },
    {
      id: 'future',
      title: 'The Future of Software Engineering',
      html: `
        <p>Discuss, as a coherent stack you now have language for:</p>
        <ul class="lesson-layers">
          <li>AI coding agents</li>
          <li>Agentic SDLC</li>
          <li>MCP</li>
          <li>Skills</li>
          <li>Subagents</li>
          <li>Autonomous debugging</li>
          <li>AI code review</li>
          <li>AI testing</li>
          <li>Human-in-the-loop engineering</li>
        </ul>
        <p>Positioning for Binod Suman Academy (not a beginner-only CLI course):</p>
        <blockquote><p>Claude Code: From AI Coding Assistant to Autonomous Software Engineering Agent</p></blockquote>
        <div class="lesson-flow">Claude → Claude Code → AI Coding → Agentic Coding → Context Engineering → Tools → MCP → Skills → Subagents → Multi-Agent Engineering → AI-Native SDLC → Production</div>
        <p>Keep demonstrations version-aware. Model names and flags age; the five spine ideas do not: context engineering, agentic workflow, tool use, delegation, guardrails.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> The goal isn’t to replace the software engineer. The goal is to change what the software engineer spends time doing.</p></div>
      `,
    },
    {
      id: 'glance',
      title: 'The 10-class syllabus at a glance',
      html: `
        <table>
          <thead><tr><th>#</th><th>Class</th><th>Core theme</th><th>Major outcome</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Claude Code Fundamentals</td><td>AI coding agents</td><td>Understand Claude Code</td></tr>
            <tr><td>2</td><td>Installation &amp; First Project</td><td>CLI + workflow</td><td>Build first project</td></tr>
            <tr><td>3</td><td>Prompting + Context + CLAUDE.md</td><td>Context engineering</td><td>Give better instructions</td></tr>
            <tr><td>4</td><td>Agentic Coding</td><td>Explore → Plan → Code → Test</td><td>Use Claude as engineer</td></tr>
            <tr><td>5</td><td>Advanced Development</td><td>TDD + Git + debugging</td><td>Professional workflow</td></tr>
            <tr><td>6</td><td>Skills + Commands + Hooks</td><td>Reusable automation</td><td>Build custom workflows</td></tr>
            <tr><td>7</td><td>MCP</td><td>External tools</td><td>Connect Claude to systems</td></tr>
            <tr><td>8</td><td>Subagents</td><td>Multi-agent development</td><td>Parallelize engineering</td></tr>
            <tr><td>9</td><td>Real Project</td><td>End-to-end development</td><td>Build production-like app</td></tr>
            <tr><td>10</td><td>Production</td><td>AI-native SDLC</td><td>Production engineering</td></tr>
          </tbody>
        </table>
        <p>Spine to keep repeating in every video and every internal doc:</p>
        <ol class="lesson-steps">
          <li>Context &gt; Prompt</li>
          <li>Understand → Plan → Act → Test → Verify</li>
          <li>Claude → Tools → Codebase → Terminal → Git → MCP</li>
          <li>One agent → specialised agents, only when it helps</li>
          <li>Autonomy + human control + tests + permissions + verification</li>
        </ol>
        <ol class="lesson-steps">
          <li>Run an AI-readiness audit on your work repo and fix the top three gaps.</li>
          <li>Add a CI job that runs tests on every PR; optionally add an agent review commenter with read-only permissions.</li>
          <li>Write a one-page “when we allow the agent to merge” policy (spoiler: you don’t — you allow it to propose).</li>
        </ol>
      `,
    },
  ],
  sourceNote:
    'Long-horizon work, models and deprecations change. Prefer evergreen process over hardcoded model names. <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code docs</a> · <a href="https://docs.anthropic.com/en/docs/about-claude/model-deprecations" target="_blank" rel="noopener noreferrer">model deprecations</a>.',
};
