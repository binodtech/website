/** AI Harness — Class 10: Production AI Harness & Agentic SDLC. */

export const ahProduction = {
  slug: 'production',
  title: 'Class 10 — Production AI Harness & Agentic SDLC',
  subtitle:
    'Elevate from developer tool to enterprise platform: gateway, orchestrator, observability, evaluation, reliability, cost, AI-native SDLC, and human+AI engineering. The goal is reliable autonomy within controlled boundaries — not maximum autonomy.',
  byline: 'AI Harness Masterclass · Class 10 of 10 · ~1h 50m read · Advanced',
  interviewTip:
    'Production goal is not maximum autonomy. It is reliable autonomy within controlled boundaries — with evals, cost, and humans on irreversible actions.',
  sections: [
    {
      id: 'prodarch',
      title: 'Production Architecture',
      html: `
        <pre><code>                    User
                      ↓
                  Gateway
                      ↓
               Harness API
                      ↓
              Orchestrator
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
    Context         Tools         Memory
        ↓             ↓             ↓
        └─────────────┼─────────────┘
                      ↓
                   Models
                      ↓
                 Guardrails
                      ↓
               Human Approval
                      ↓
                   Action</code></pre>
        <p>Gateway: authn/z, rate limits, tenancy. Harness API: runs, resume, approvals. Orchestrator: the state machine at scale (queues, workers). Multi-tenant memory isolation is a hard requirement.</p>
      `,
    },
    {
      id: 'obs',
      title: 'Observability',
      html: `
        <p>Track: agent runs, model calls, tool calls, latency, tokens, cost, errors, retries, user approvals, final outcomes.</p>
        <pre><code>type Span = {
  runId: string; kind: "model" | "tool" | "policy" | "approval";
  name: string; ms: number; tokensIn?: number; tokensOut?: number;
  costUsd?: number; ok: boolean; error?: string;
};</code></pre>
        <p>If you cannot join “this prod incident” to “this tool call,” you are flying blind.</p>
      `,
    },
    {
      id: 'eval',
      title: 'Evaluation',
      html: `
        <p>Do not evaluate only “did the model generate good text?”</p>
        <pre><code>Task Success · Tool Selection · Tool Accuracy · Plan Quality
Code Quality · Test Success · Security · Cost · Latency</code></pre>
        <p>Build a fixture pack: 30 tasks with golden verify commands. Score the harness, not the prose. Regression the pack on every policy or tool change.</p>
      `,
    },
    {
      id: 'rel',
      title: 'Reliability',
      html: `
        <ul class="lesson-layers">
          <li>Retry (idempotent tools only)</li>
          <li>Timeout per tool and per run</li>
          <li>Circuit breaker on a failing model or MCP server</li>
          <li>Idempotency keys on writes</li>
          <li>Failure recovery (Class 6 resume)</li>
          <li>Rate limiting (per tenant, per model)</li>
          <li>Model fallback (degraded mode: read-only)</li>
        </ul>
      `,
    },
    {
      id: 'cost',
      title: 'Cost Engineering',
      html: `
        <div class="lesson-flow">Task → Choose model → Context selection → Tool calls → Token usage → Cost</div>
        <p>Levers: model routing, context reduction, caching (same file hash), summarization, avoiding unnecessary loops (loop detector is a cost control). A 40-step “hello world” is a product bug.</p>
      `,
    },
    {
      id: 'sdlc',
      title: 'AI-Native SDLC',
      html: `
        <pre><code>Requirement
     ↓
AI Product Analyst
     ↓
AI Architect
     ↓
AI Developer
     ↓
AI Test Engineer
     ↓
AI Security Reviewer
     ↓
Human Review
     ↓
CI/CD
     ↓
Production
     ↓
AI Observability
     ↓
AI-powered Incident Response</code></pre>
        <p>Each arrow is a harness run with a role skill, tool subset, and verify. Humans remain at intent and merge/prod. This is the destination of the series — and the bridge to your Agent AI / production content.</p>
      `,
    },
    {
      id: 'human',
      title: 'Human + AI Engineering',
      html: `
        <pre><code>             HUMAN
               ↓
        Intent / Judgment
               ↓
        ┌──── AI Harness ────┐
        │  Plan  Context     │
        │  Tools Execute     │
        │  Test  Review      │
        └────────────────────┘
               ↓
             HUMAN
               ↓
        Final Decision</code></pre>
        <p>The professional model. Class 1’s AI-driven column, productionized.</p>
      `,
    },
    {
      id: 'spine',
      title: 'The conceptual spine + syllabus',
      html: `
        <pre><code>                         AI HARNESS
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
       CONTEXT              TOOLS              MEMORY
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ↓
                             LLM → AGENT LOOP → GUARDRAILS
                              ↓
                    HUMAN / POLICY CHECK → ACTION
                              ↓
                       OBSERVABILITY → EVALUATION → LEARNING</code></pre>
        <table>
          <thead><tr><th>#</th><th>Class</th><th>Theme</th><th>Outcome</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>What Is AI Harness?</td><td>LLM → Agent → Harness</td><td>Understand the paradigm</td></tr>
            <tr><td>2</td><td>Harness Architecture</td><td>Components &amp; layers</td><td>Design a harness</td></tr>
            <tr><td>3</td><td>Context Engineering</td><td>Project intelligence</td><td>Build better agent context</td></tr>
            <tr><td>4</td><td>Tools &amp; Tool Calling</td><td>Tool execution</td><td>Give agents capabilities</td></tr>
            <tr><td>5</td><td>Guardrails</td><td>Security + approval</td><td>Control agent actions</td></tr>
            <tr><td>6</td><td>Memory &amp; State</td><td>Persistence</td><td>Build long-running agents</td></tr>
            <tr><td>7</td><td>MCP</td><td>External systems</td><td>Connect real-world tools</td></tr>
            <tr><td>8</td><td>Subagents</td><td>Orchestration</td><td>Build specialized agents</td></tr>
            <tr><td>9</td><td>Build AI Harness</td><td>End-to-end project</td><td>Build a working harness</td></tr>
            <tr><td>10</td><td>Production</td><td>Reliability + eval + SDLC</td><td>Think like a platform architect</td></tr>
          </tbody>
        </table>
        <p><strong>Series name:</strong> AI Harness Masterclass — Build Production-Grade AI Agents from Scratch.<br />
        <strong>Tagline:</strong> From LLMs and prompts to tools, memory, MCP, multi-agents, guardrails and production AI systems.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> The production goal is not maximum autonomy. It is reliable autonomy within controlled boundaries.</p></div>
        <ol class="lesson-steps">
          <li>Write an eval scorecard for your Class 9 harness (10 tasks).</li>
          <li>Estimate cost of a typical coding task with your packet size × steps × model price.</li>
          <li>Draft the human approval matrix for your company (what is L3 vs L4).</li>
        </ol>
      `,
    },
  ],
  sourceNote:
    'Pair with <a href="/learn/claude-code">Claude Code</a> (using agents) and <a href="/learn/agentic-ai">Agentic AI</a> (agent theory). This track is the platform in the middle.',
};
