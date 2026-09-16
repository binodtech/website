/** Claude Code — Class 9: Real-World Project & Automation. */

export const ccRealWorldProject = {
  slug: 'real-world-project',
  title: 'Class 9 — Real-World Project & Automation',
  subtitle:
    'Do not demonstrate isolated features. Build a recognisable system — an AI-powered developer productivity platform — and use Claude Code for architecture, scaffold, implementation, debugging, and productionising, including Session 2’s parallel full-stack lab.',
  byline: 'Claude Code Masterclass · Class 9 of 10 · ~1h 45m read · Advanced',
  interviewTip:
    'Don’t demonstrate isolated Claude Code features anymore — show how all the pieces work together in one real project.',
  sections: [
    {
      id: 'project',
      title: 'The project (not a toy)',
      html: `
        <p>Suggested project: <strong>AI-Powered Developer Productivity Platform</strong> — something your audience recognises as engineering, not a tutorial counter.</p>
        <pre><code>React Frontend
       ↓
Java/Spring Boot API
       ↓
PostgreSQL
       ↓
Redis
       ↓
Kafka
       ↓
AI Service
       ↓
Claude</code></pre>
        <p>You will not finish Kafka + LLM evals in one sitting. That is the point of Class 5’s large-change split. Class 9 is the <em>method</em> on a real shape: shared CLAUDE.md, contract, worktrees, skills, hooks, MCP, verification.</p>
        <p>Minimum vertical slice that still counts: React UI → API → Postgres → one AI endpoint with tests and Docker. Redis/Kafka as explicit later milestones, not fake boxes on a slide.</p>
      `,
    },
    {
      id: 'arch',
      title: 'Requirement → Architecture',
      html: `
        <p>Ask Claude to:</p>
        <ul class="lesson-layers">
          <li>Analyze requirements</li>
          <li>Create architecture</li>
          <li>Identify components</li>
          <li>Create API design</li>
          <li>Create database schema</li>
        </ul>
        <p>Session 2: put the outcome in a <strong>shared CLAUDE.md with stack, ports, and API contract</strong> before anyone codes. Ports matter when two worktrees both try to bind 8080.</p>
      `,
    },
    {
      id: 'scaffold',
      title: 'Scaffold',
      html: `
        <p>Claude creates:</p>
        <pre><code>Frontend
Backend
Database
Tests
Docker
Documentation</code></pre>
        <p>Accept the scaffold only after you can run the empty app and the empty test suite. A scaffold that does not boot is not a scaffold.</p>
      `,
    },
    {
      id: 'impl',
      title: 'Implement (including parallel)',
      html: `
        <p>Use Claude Code for APIs, database, authentication, UI, tests — with the Class 2 loop on every slice.</p>
        <p>Session 2 assignment: <strong>Build a Full-Stack App in Parallel</strong> — shared CLAUDE.md; <strong>run Claude instances in separate worktrees</strong> (API vs UI vs tests). Merge with integration tests, not hope.</p>
        <p>Connect to the real world from Class 7: one MCP read/write (issues, docs, or design) that the product actually uses.</p>
      `,
    },
    {
      id: 'debug',
      title: 'Debug on purpose',
      html: `
        <p>Intentionally introduce bugs. Let Claude:</p>
        <div class="lesson-flow">Investigate → Find root cause → Fix → Test</div>
        <p>Keep a “bug budget”: one wiring bug, one authz hole, one UI miss. Use the screenshot chain if the bug is visual.</p>
      `,
    },
    {
      id: 'prod',
      title: 'Productionize',
      html: `
        <p>Add:</p>
        <ul class="lesson-layers">
          <li>Docker</li>
          <li>Configuration (env, no secrets in images)</li>
          <li>Logging</li>
          <li>Monitoring (at least health + structured logs)</li>
          <li>Error handling</li>
          <li>Security (authn/z, dependency scan)</li>
          <li>CI/CD (pipeline that runs the same tests hooks run locally)</li>
        </ul>
        <p>Session 2: <strong>The Full Loop</strong> — reusable skills, validation hooks, tests, and self-correction, now on this repo not the Todo toy.</p>
        <p>Session 2 also: <strong>audit AI-readiness and design validation harnesses</strong>. AI-readiness means: CLAUDE.md exists, tests exist, secrets are not in git, hooks catch the dumb mistakes, the agent has a command that proves the slice works. A validation harness is that command (plus a small eval set if you call an LLM).</p>
        <div class="lesson-callout"><strong>Main zest.</strong> Show the audience how all the pieces work together in one real project.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 9',
      html: `
        <ol class="lesson-steps">
          <li>Write requirements + architecture + OpenAPI-ish contract + schema in docs, via plan mode, no code yet.</li>
          <li>Scaffold until <code>docker compose up</code> and tests are green on empty behaviour.</li>
          <li>Ship one vertical slice with parallel worktrees.</li>
          <li>Plant a bug; require grounded root cause + regression test.</li>
          <li>Turn on one hook + one skill + CI running tests.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 10.</strong> Production engineering: AI-native SDLC, guardrails, reliability, long-horizon context, CI/CD, and the future of the engineer’s job.</p></div>
      `,
    },
  ],
  sourceNote:
    'Keep feature demos version-aware; the project method is the durable artefact. Docs: <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">Claude Code</a>.',
};
