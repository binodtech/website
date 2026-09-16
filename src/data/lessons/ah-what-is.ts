/** AI Harness — Class 1: What is an AI Harness? */

export const ahWhatIs = {
  slug: 'what-is',
  title: 'Class 1 — What Is an AI Harness?',
  subtitle:
    'An LLM provides intelligence. An AI harness provides the environment, tools, context, memory, controls and execution loop that turn that intelligence into useful, repeatable work. This class is the mental model for the whole masterclass.',
  byline: 'AI Harness Masterclass · Class 1 of 10 · ~1h 20m read · Beginner',
  interviewTip:
    'If someone asks “what’s the difference between ChatGPT and Claude Code?”, the precise answer is the harness: same class of model, different environment, tools, loop and controls. Senior interviews reward that sentence more than a list of product names.',
  sections: [
    {
      id: 'understand',
      title: 'Understanding AI Harness',
      children: [
        { id: 'u-def', title: 'What is an AI harness?' },
        { id: 'u-why', title: 'Why do we need a harness?' },
        { id: 'u-triple', title: 'Model vs agent vs harness' },
        { id: 'u-llm', title: 'LLM vs coding agent vs harness' },
        { id: 'u-chat', title: 'Chatbot vs agentic system' },
        { id: 'u-assist', title: 'AI-assisted vs AI-driven development' },
      ],
      html: `
        <p>This series is beginner-friendly at the door and professional in engineering depth. The goal is not “learn how to use an AI coding tool.” The goal is <strong>learn how to build a reliable AI-assisted software engineering harness</strong>.</p>
        <p>Your <a href="/learn/claude-code">Claude Code Masterclass</a> answers: how do I <em>use</em> an AI coding agent well? This course answers: how do I <em>understand and build</em> the infrastructure behind one?</p>
        <div class="lesson-flow">Claude Code series → using the agent → developer productivity · This series → building the agent environment → architecture</div>

        <h3 class="lesson-subhead" id="u-def">What is an AI harness?</h3>
        <p>A <strong>harness</strong> is the software around a model that lets it do work in the real world: it gathers context, offers tools, runs a loop, stores state, enforces policy, and records what happened. The word comes from systems engineering — a test harness is the fixture that holds a component, feeds it inputs, and observes outputs. An AI harness does the same for an LLM.</p>
        <blockquote><p>An LLM provides intelligence; an AI harness provides the environment, tools, context, memory, controls and execution loop that turns that intelligence into useful work.</p></blockquote>
        <pre><code>// Conceptual types — the rest of the course implements these for real.

type Harness = {
  interface: "cli" | "ide" | "web" | "api";
  contextEngine: ContextEngine;   // what the model is allowed to see
  toolRegistry: ToolRegistry;     // what the model is allowed to do
  memory: MemoryStore;            // what survives a session
  loop: AgentLoop;                // plan → act → observe → verify
  guardrails: PolicyEngine;       // what must never happen
  observability: Telemetry;       // what you can audit later
  model: ModelRouter;             // which intelligence to call
};</code></pre>

        <h3 class="lesson-subhead" id="u-why">Why do we need a harness?</h3>
        <p>A raw LLM API call is a function <code>(messages) → text</code>. Software engineering is not a function of that shape. It requires files that actually change, tests that actually run, permissions that actually block <code>DROP TABLE</code>, and a record of who approved what. None of that lives inside the weights. It lives in the harness.</p>
        <p><strong>Use case.</strong> You paste “fix auth” into a chatbot. You get a code snippet. You still copy it, still run tests, still open the PR. The harness is everything you just did by hand — automated, with a loop, under policy.</p>

        <h3 class="lesson-subhead" id="u-triple">Model vs agent vs harness</h3>
        <table>
          <thead><tr><th>Thing</th><th>What it is</th><th>What it owns</th></tr></thead>
          <tbody>
            <tr><td><strong>Model (LLM)</strong></td><td>A next-token predictor with world knowledge</td><td>Reasoning and generation given a context window</td></tr>
            <tr><td><strong>Agent</strong></td><td>A loop that uses a model to pursue an objective</td><td>Choosing the next step (often a tool call)</td></tr>
            <tr><td><strong>Harness</strong></td><td>The product/platform the agent runs inside</td><td>Context, tools, memory, permissions, UI, logs, evals</td></tr>
          </tbody>
        </table>
        <p>People say “the agent did X.” Often they mean “the harness executed a tool the model requested.” That distinction is the whole of Class 4 and Class 5.</p>

        <h3 class="lesson-subhead" id="u-llm">LLM vs coding agent vs harness</h3>
        <ul class="lesson-layers">
          <li><strong>LLM</strong> — Claude, GPT, Gemini, an open-weights model. Intelligence only.</li>
          <li><strong>Coding agent</strong> — an agent specialised to repositories: read, edit, test, git. Claude Code, Codex-style agents, many IDE agents.</li>
          <li><strong>Harness</strong> — the general architecture. A coding agent is one <em>application</em> of a harness. A support agent or DevOps agent is another application of the same layers.</li>
        </ul>

        <h3 class="lesson-subhead" id="u-chat">Chatbot vs agentic system</h3>
        <p>A chatbot is request/response. An agentic system holds an objective across many steps, calls tools, and only stops when a verification condition is met (or a budget/policy says stop). Chat is a valid <em>interface</em> to a harness; it is not the harness.</p>

        <h3 class="lesson-subhead" id="u-assist">AI-assisted vs AI-driven development</h3>
        <table>
          <thead><tr><th></th><th>AI-assisted</th><th>AI-driven (still human-owned)</th></tr></thead>
          <tbody>
            <tr><td>Who holds the plan</td><td>You</td><td>The agent, inside harness constraints</td></tr>
            <tr><td>Unit of work</td><td>Snippet, line, answer</td><td>Task with acceptance criteria</td></tr>
            <tr><td>Verification</td><td>You, immediately</td><td>Harness runs tests; you review evidence</td></tr>
            <tr><td>Failure mode</td><td>Wrong snippet you notice</td><td>Wrong multi-file change you must catch via policy + review</td></tr>
          </tbody>
        </table>
        <p>This course builds the second column without pretending the human disappears. Class 10’s zest: reliable autonomy within controlled boundaries — not maximum autonomy.</p>
      `,
    },
    {
      id: 'arch',
      title: 'The Basic Architecture',
      html: `
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 280" role="img" aria-label="User to harness to context tools memory to LLM to action">
            <defs>
              <marker id="ah1a" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="280" y="8" width="160" height="36" rx="8" />
            <text class="dg-t" x="360" y="31" text-anchor="middle">User</text>
            <rect class="dg-box p" x="250" y="64" width="220" height="40" rx="8" />
            <text class="dg-t" x="360" y="89" text-anchor="middle">AI Harness</text>
            <rect class="dg-box c" x="24" y="140" width="140" height="44" rx="8" />
            <text class="dg-s" x="94" y="167" text-anchor="middle">Context</text>
            <rect class="dg-box o" x="190" y="140" width="140" height="44" rx="8" />
            <text class="dg-s" x="260" y="167" text-anchor="middle">Tools</text>
            <rect class="dg-box y" x="356" y="140" width="140" height="44" rx="8" />
            <text class="dg-s" x="426" y="167" text-anchor="middle">Memory</text>
            <rect class="dg-box g" x="522" y="140" width="174" height="44" rx="8" />
            <text class="dg-s" x="609" y="167" text-anchor="middle">Guardrails (later)</text>
            <rect class="dg-box" x="250" y="214" width="220" height="40" rx="8" />
            <text class="dg-t" x="360" y="239" text-anchor="middle">LLM → Action / Result</text>
            <path class="dg-line violet" d="M360 44 V60" marker-end="url(#ah1a)" />
            <path class="dg-line violet" d="M360 104 V136" marker-end="url(#ah1a)" />
            <path class="dg-line violet" d="M94 184 V200 H360 V210" marker-end="url(#ah1a)" />
          </svg>
          <figcaption>Figure 1 — The spine of all ten classes. Context, tools and memory feed the model; the harness owns the loop around it. Guardrails and observability complete the picture in Classes 5 and 10.</figcaption>
        </figure>
        <pre><code>User
  ↓
AI Harness
  ↓
┌─────────┼─────────┐
↓         ↓         ↓
Context    Tools     Memory
↓         ↓         ↓
└─────────┼─────────┘
          ↓
        LLM
          ↓
     Action/Result</code></pre>
        <p>Every product you will study is this diagram with different defaults: Claude Code is a CLI harness specialised to git trees; an IDE agent is the same layers in an editor; an enterprise support agent swaps the filesystem for CRM tools.</p>
      `,
    },
    {
      id: 'why',
      title: 'Why Harness Matters',
      html: `
        <p>An LLM by itself can:</p>
        <div class="lesson-flow">Understand → Generate</div>
        <p>A harness adds the engineering loop:</p>
        <div class="lesson-flow">Understand → Plan → Access context → Use tools → Take action → Observe result → Correct → Verify</div>
        <p><strong>Use case — expired JWT bug.</strong> Without a harness: the model generates a patch from a pasted file. With a harness: it searches <code>AuthFilter</code>, reads the failing test, edits three files, runs <code>mvn test -Dtest=AuthFilterTest</code>, sees a failure, corrects a date helper, re-runs, reports evidence. The intelligence was similar; the <em>work</em> only happened because tools, context and verify were in the loop.</p>
        <pre><code>async function agentLoop(task: Task, h: Harness): Promise&lt;Report&gt; {
  let state = await h.memory.load(task.id) ?? { status: "UNDERSTAND" };
  while (state.status !== "COMPLETE" && !h.budget.exhausted()) {
    const ctx = await h.context.select(task, state);
    const decision = await h.model.decide({ task, ctx, tools: h.tools.list() });
    if (decision.kind === "tool") {
      const allowed = h.guardrails.check(decision.call);
      if (!allowed.ok) {
        if (allowed.needsHuman) await h.approvals.request(decision.call);
        else { state = diagnose(state, allowed.reason); continue; }
      }
      const result = await h.tools.execute(decision.call);
      state = observe(state, result);
    } else if (decision.kind === "done") {
      const evidence = await h.verify(task, state);
      state.status = evidence.ok ? "COMPLETE" : "VERIFY_FAILED";
    }
    await h.memory.save(task.id, state);
  }
  return h.report(state);
}</code></pre>
        <p>You will implement a real version of this loop in Class 9. Classes 2–8 are the components it calls.</p>
      `,
    },
    {
      id: 'examples',
      title: 'Examples in the Wild',
      html: `
        <p>Introduce the concept through products you already know. Same architecture, different tool packs and policies.</p>
        <table>
          <thead><tr><th>System</th><th>Interface</th><th>Primary tools</th><th>Typical guardrail</th></tr></thead>
          <tbody>
            <tr><td><strong>Claude Code</strong></td><td>CLI</td><td>FS, shell, git, tests, MCP</td><td>Permission prompts, CLAUDE.md</td></tr>
            <tr><td><strong>Codex-style coding agents</strong></td><td>CLI / cloud</td><td>Repo sandbox, tests</td><td>Network isolation, time budget</td></tr>
            <tr><td><strong>IDE agents</strong></td><td>Editor</td><td>Indexed project, apply-patch, terminal</td><td>You see the diff before accept</td></tr>
            <tr><td><strong>Internal enterprise agents</strong></td><td>Slack / web</td><td>Jira, Confluence, HR APIs</td><td>SSO, data boundaries, audit</td></tr>
            <tr><td><strong>Customer-support agents</strong></td><td>Chat widget</td><td>Ticket DB, refund API, KB RAG</td><td>Refund caps, PII redaction</td></tr>
            <tr><td><strong>Research agents</strong></td><td>Notebook / web</td><td>Search, browser, PDF parse</td><td>Citation required, no uncited claims</td></tr>
            <tr><td><strong>DevOps agents</strong></td><td>ChatOps</td><td>k8s, CI, paging</td><td>Prod mutate = two-person rule</td></tr>
          </tbody>
        </table>
        <p>When you design (Class 2), you pick interface, tools, memory and control for the <em>job</em>, not a fashionable model name.</p>
        <div class="lesson-callout"><strong>Main zest.</strong> An LLM provides intelligence; an AI harness provides the environment, tools, context, memory, controls and execution loop that turns that intelligence into useful work.</p></div>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 1',
      html: `
        <ol class="lesson-steps">
          <li>Pick one tool you use (Claude Code, Cursor, a support bot). Map it onto Figure 1: what is context, tools, memory, guardrails?</li>
          <li>Write four sentences: model, agent, harness, chatbot — without using product names.</li>
          <li>Take a real work task and write the harness loop you wish existed (plan, tools, verify command).</li>
          <li>List three actions that must never be auto-approved in your job. That list is the seed of Class 5.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 2.</strong> Seven layers of a professional harness. A prompt wrapped around an LLM is not an architecture.</p></div>
      `,
    },
  ],
  sourceNote:
    'Conceptual course for Binod Suman Academy. Product names are examples of harnesses, not endorsements. Pair with the <a href="/learn/claude-code">Claude Code</a> track for the “how to use” half of the same ideas.',
};
