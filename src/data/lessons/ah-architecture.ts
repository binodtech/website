/** AI Harness — Class 2: Architecture & Core Components. */

export const ahArchitecture = {
  slug: 'architecture',
  title: 'Class 2 — AI Harness Architecture & Core Components',
  subtitle:
    'A professional AI harness is a systems architecture, not a prompt wrapped around an LLM. Core components plus seven layers: interface, orchestration, intelligence, context, tools, control, observability.',
  byline: 'AI Harness Masterclass · Class 2 of 10 · ~1h 35m read · Beginner',
  interviewTip:
    'Staff-level answer: draw the seven layers, then say which layer owns retries, which owns secrets, and which owns “did the task actually succeed.” If everything is “the LLM,” you have not designed a harness.',
  sections: [
    {
      id: 'core',
      title: 'Core Components',
      html: `
        <pre><code>                AI Harness
                    |
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
   Context        Tools         Memory
      ↓             ↓             ↓
      └─────────────┼─────────────┘
                    ↓
                  Model
                    ↓
              Agent Loop
                    ↓
               Guardrails
                    ↓
                Output</code></pre>
        <p>Class 1’s spine, expanded. <strong>Context</strong> is selected knowledge. <strong>Tools</strong> are verbs. <strong>Memory</strong> is durable state. <strong>Model</strong> is replaceable intelligence (Class 10 routes between models). <strong>Agent loop</strong> is control flow. <strong>Guardrails</strong> sit on every tool call, not only on the final message. <strong>Output</strong> is what the human sees plus artefacts (diffs, reports).</p>
        <pre><code>export type CoreHarness = {
  context: { select(req: Request, state: State): Promise&lt;ContextPacket&gt; };
  tools: { list(): ToolSpec[]; execute(call: ToolCall): Promise&lt;ToolResult&gt; };
  memory: { load(id: string): Promise&lt;State | null&gt;; save(id: string, s: State): Promise&lt;void&gt; };
  model: { complete(input: ModelInput): Promise&lt;ModelOutput&gt; };
  loop: { run(task: Task): Promise&lt;RunReport&gt; };
  guardrails: { authorize(call: ToolCall): Decision };
  output: { present(report: RunReport): void };
};</code></pre>
        <p><strong>Use case.</strong> “Add pagination to /search.” Context selects the route + existing list helper + tests. Tools: read/write/search/test. Memory stores the plan after step 1 so a crash does not forget it. Guardrails block writing <code>.env</code>. Output is a diffstat + test summary, not “I have paginated it.”</p>
      `,
    },
    {
      id: 'layers',
      title: 'Seven Harness Layers',
      children: [
        { id: 'l1', title: 'Layer 1 — Interface' },
        { id: 'l2', title: 'Layer 2 — Orchestration' },
        { id: 'l3', title: 'Layer 3 — Intelligence' },
        { id: 'l4', title: 'Layer 4 — Context' },
        { id: 'l5', title: 'Layer 5 — Tools' },
        { id: 'l6', title: 'Layer 6 — Control' },
        { id: 'l7', title: 'Layer 7 — Observability' },
      ],
      html: `
        <h3 class="lesson-subhead" id="l1">Layer 1 — Interface</h3>
        <p>CLI, web UI, IDE, API. The interface is not the agent. It is how objectives and approvals enter, and how evidence leaves. Same orchestrator can serve all four.</p>
        <pre><code>// CLI is one adapter.
async function main(argv: string[]) {
  const task = parseArgv(argv);          // "fix flaky AuthFilterTest"
  const report = await harness.loop.run(task);
  print(report.evidence);
}</code></pre>
        <p>IDE adapters stream diffs into the editor. API adapters are for CI (Class 10). Web UIs are for non-engineers (support harness).</p>

        <h3 class="lesson-subhead" id="l2">Layer 2 — Orchestration</h3>
        <p>Agent loop, planning, task management, state machine. This layer decides <em>when</em> to call the model vs a tool vs a human. It is a workflow engine with an LLM in the middle — closer to Temporal than to a chatbot.</p>
        <pre><code>type Phase = "UNDERSTAND" | "PLAN" | "EXECUTE" | "VERIFY" | "COMPLETE" | "FAILED";
type StateMachine = { phase: Phase; todos: Todo[]; lastError?: string };</code></pre>

        <h3 class="lesson-subhead" id="l3">Layer 3 — Intelligence</h3>
        <p>LLM, reasoning, model selection. Treat the model as a <em>dependency with an SLA</em>: latency, cost, quality, context window. Routing: cheap model for classify/rank; strong model for plan/debug. Never hard-code a model name into business logic — inject a <code>ModelRouter</code>.</p>

        <h3 class="lesson-subhead" id="l4">Layer 4 — Context</h3>
        <p>Files, documentation, database, RAG, conversation history. Class 3 is this layer in depth. Architecturally: a pipeline <code>retrieve → rank → budget → pack</code>, not “dump the repo.”</p>

        <h3 class="lesson-subhead" id="l5">Layer 5 — Tools</h3>
        <p>Shell, git, browser, APIs, MCP. Tools have schemas and side effects. The orchestrator must not let the model invent a tool that is not in the registry (Class 4).</p>

        <h3 class="lesson-subhead" id="l6">Layer 6 — Control</h3>
        <p>Permissions, policies, approval, security. This layer is a <em>gate on side effects</em>, independent of how clever the model is. A smarter model with no control is more dangerous, not less.</p>

        <h3 class="lesson-subhead" id="l7">Layer 7 — Observability</h3>
        <p>Logs, traces, token usage, tool calls, evaluation. If you cannot answer “which tool ran on prod last Tuesday, with which args, after which approval,” you do not have a production harness (Class 10).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Seven layers stacked">
            <rect class="dg-band b" x="16" y="8" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="28">1 Interface — CLI / IDE / Web / API</text>
            <rect class="dg-band p" x="16" y="44" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="64">2 Orchestration — loop, plan, tasks, state machine</text>
            <rect class="dg-band c" x="16" y="80" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="100">3 Intelligence — LLM, reasoning, model router</text>
            <rect class="dg-band o" x="16" y="116" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="136">4 Context — files, docs, DB, RAG, history</text>
            <rect class="dg-band y" x="16" y="152" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="172">5 Tools — shell, git, browser, APIs, MCP</text>
            <rect class="dg-band r" x="16" y="188" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="208">6 Control — permissions, policy, approval, security</text>
            <rect class="dg-band g" x="16" y="224" width="688" height="30" rx="6" /><text class="dg-s" x="28" y="244">7 Observability — logs, traces, tokens, evals</text>
          </svg>
          <figcaption>Figure 1 — Design reviews should name the layer. “The model hallucinated a file” is layer 4. “It rm’d prod” is layer 6 missing. “We don’t know why it cost $40” is layer 7 missing.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Main zest.</strong> A professional AI harness is a systems architecture, not just a prompt wrapped around an LLM.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 2',
      html: `
        <ol class="lesson-steps">
          <li>Draw the seven layers for your team’s current AI tool. Mark which layers you do not control (vendor black box).</li>
          <li>For a support-agent use case, write one bullet per layer: what would you build vs buy?</li>
          <li>Sketch <code>CoreHarness</code> types in your language of choice. Leave implementations empty. Class 9 fills them.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 3.</strong> Context engineering: what the model should know, when, and what it should ignore.</p></div>
      `,
    },
  ],
  sourceNote: 'Architecture patterns are implementation-agnostic. Concrete CLIs appear in Class 9.',
};
