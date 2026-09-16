/** Modern System Design — Chapter 40: Design a ChatGPT-Style System.
 *  Inference serving, KV cache, streaming, sessions, safety and cost.
 */

export const msdChatgptSystem = {
  slug: 'chatgpt-system',
  title: 'Design a ChatGPT-Style System',
  subtitle:
    'A chat product is not "call OpenAI." It is session storage, a prompt assembled under a token budget, a GPU fleet that batches without ruining tail latency, streamed tokens to the client, and a cost/safety envelope that can say no.',
  byline: 'Modern System Design · Chapter 40 · ~1h 30m read · Advanced',
  interviewTip:
    'Split control plane from inference. Sessions and messages are a normal store. Generation is a queue to GPU workers with continuous batching and a KV cache per request. Stream tokens over SSE/WebSocket; never wait for the full answer to 200. Quote the memory math: KV cache, not weights, often bounds concurrency. Rate-limit by tokens not requests. Safety is a classifier on input and output, plus policy, not a vibe.',
  sections: [
    {
      id: 'cg-problem',
      title: 'System Design: A ChatGPT-Style System',
      children: [
        { id: 'cg-what', title: 'What we are actually serving' },
        { id: 'cg-split', title: 'Control plane versus GPU plane' },
        { id: 'cg-prefill', title: 'Prefill is not decode' },
        { id: 'cg-blocks', title: 'Which building blocks this reuses' },
      ],
      html: `
        <p>A user sends a message in a thread. The system builds a prompt from system policy, optional memory, optional retrieved docs, and the recent turns. A model then emits tokens until a stop condition. The user sees those tokens as they appear. A second user must not steal the first's GPUs without a quota. That is the product. The weights are a dependency you may buy, host, or mix.</p>
        <p>Interviewers punish "we will call the OpenAI API" as the architecture. That is an integration. This chapter is what you design when you <em>are</em> the API: admission control, a scarce accelerator pool, a context window that is a hard budget, and a bill that tracks tokens not HTTP requests.</p>

        <h3 class="lesson-subhead" id="cg-what">What we are actually serving</h3>
        <p>In scope: authenticated chat, conversation persistence, streaming completion, a bounded tool-call loop, usage quotas, input/output safety filters. Out of scope: training the foundation model (that is <a href="/learn/modern-system-design/ai-ml-data-infra">Chapter 41</a>), a full agent platform, and the iOS client. Multimodal prefill (images) is the same control plane with a heavier encoder queue — name it, do not design the vision stack in the remaining time.</p>
        <p>The unit of work is a <em>generation</em>: one user turn in, a stream of tokens out, possibly paused for tools, then resumed. Generations have a max output length, a max wall clock, and a max tool-step count. Without those caps a single prompt becomes an unbounded GPU lease.</p>

        <h3 class="lesson-subhead" id="cg-split">Control plane versus GPU plane</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Control plane for sessions and safety versus GPU inference plane">
            <defs>
              <marker id="ah-cg1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">CONTROL  ·  CPU</text>
            <text class="dg-s" x="26" y="58">auth, sessions, quota</text>
            <text class="dg-s" x="26" y="76">prompt assemble + trim</text>
            <text class="dg-s" x="26" y="94">safety pre and post</text>
            <text class="dg-s" x="26" y="112">SSE / WebSocket to client</text>
            <text class="dg-s" x="26" y="130">tool allowlist + timeouts</text>
            <text class="dg-s" x="26" y="160">Scales like a web app.</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="168" rx="10" />
            <text class="dg-h" x="382" y="36">INFERENCE  ·  GPU</text>
            <text class="dg-s" x="382" y="58">admission queue</text>
            <text class="dg-s" x="382" y="76">continuous batching</text>
            <text class="dg-s" x="382" y="94">paged KV cache</text>
            <text class="dg-s" x="382" y="112">token stream back</text>
            <text class="dg-s" x="382" y="130">prefill vs decode slots</text>
            <text class="dg-s" x="382" y="160">Scales like a scheduler.</text>
          </svg>
          <figcaption>Figure 1 — Do not put session SQL and a 70B forward pass in one process. The CPU plane retries; the GPU plane is leased.</figcaption>
        </figure>
        <p>The control plane owns identity, the conversation store, prompt assembly, policy, and the byte stream to the browser. The GPU plane owns kernels. Crossing them with "one HTTP handler per GPU" wastes the accelerator on epoll. Workers run a scheduler (vLLM, TensorRT-LLM, a custom batcher). The API holds an SSE connection and is a consumer of that scheduler's token topic.</p>

        <h3 class="lesson-subhead" id="cg-prefill">Prefill is not decode</h3>
        <p>Prefill ingests the prompt: highly parallel matrix work, latency dominated by prompt length. Decode emits one token at a time: memory-bandwidth bound, latency dominated by the KV read of everything so far. A fleet that only measures "tokens per second" will pack long prefills onto the same SM schedule as interactive decode and destroy time-to-first-token (TTFT). Production serving splits or at least prioritises: interactive decode high, offline summarisation low, long prefills in their own pool if the mix is hostile.</p>
        <p>Continuous batching lets a new request join an in-flight decode batch when a slot frees, instead of waiting for the whole batch to finish. That is the difference between a demo and a product at a few hundred concurrent chats.</p>

        <h3 class="lesson-subhead" id="cg-blocks">Which building blocks this reuses</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Session rows, message log</td><td><a href="/learn/modern-system-design/databases">Database</a> / <a href="/learn/modern-system-design/key-value-store">KV</a></td></tr>
            <tr><td>Token quota</td><td><a href="/learn/modern-system-design/rate-limiter">Rate limiter</a> on tokens, not QPS</td></tr>
            <tr><td>Generation queue</td><td><a href="/learn/modern-system-design/messaging-queue">Queue</a> with priority</td></tr>
            <tr><td>Tool side effects</td><td>Allowlisted APIs + <a href="/learn/modern-system-design/preliminary-concepts">idempotency</a></td></tr>
            <tr><td>Retrieved docs</td><td><a href="/learn/modern-system-design/distributed-search">Search</a> / vectors, untrusted in the prompt</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>The model is not a database.</strong> If the product must remember last week's thread, that is the session store. If it must know this week's policy PDF, that is retrieval with a versioned index. Stuffing "the company" into the system prompt is how you blow the window and still hallucinate the refund rule.</div>
      `,
    },
    {
      id: 'cg-req',
      title: 'Requirements and estimation',
      children: [
        { id: 'cg-fn', title: 'Functional and non-functional' },
        { id: 'cg-est', title: 'The arithmetic that sizes GPUs' },
        { id: 'cg-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cg-fn">Functional and non-functional</h3>
        <ol class="lesson-layers">
          <li><strong>Create/list threads</strong>, append a user message, stream an assistant message.</li>
          <li><strong>Stop / regenerate</strong> without double-billing the same turn when the client retries.</li>
          <li><strong>Quota</strong> per user and per tenant: tokens/day and in-flight generations.</li>
          <li><strong>Safety</strong> on input and output; an audit trail with a retention policy.</li>
          <li><strong>Degrade:</strong> when GPUs are full, queue with a visible wait or 503 — do not silently drop to a worse model unless the product says so.</li>
        </ol>
        <table>
          <thead><tr><th>NFR</th><th>Target</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>TTFT p99</td><td>&lt; 500 ms interactive</td><td>Chat that stares feels broken</td></tr>
            <tr><td>Decode</td><td>~30–50 tok/s perceived</td><td>Faster than reading is wasted</td></tr>
            <tr><td>Availability</td><td>control plane 99.9%; GPU 99%</td><td>Idle GPUs vs a 5xx login are different sins</td></tr>
            <tr><td>Durability</td><td>acked messages survive API death</td><td>The stream can die; the thread cannot</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="cg-est">The arithmetic that sizes GPUs</h3>
        <pre><code>ASSUME 200k DAU, 4 turns/user/day, 800 tokens in + 400 out
  generations/day = 800k
  peak ~ 40x average / 86400  wait, use a 8% concurrent peak:
  concurrent generations ~= 800k * 40s / 86400  ~= 370
  round to 500 concurrent for headroom

DECODE
  500 * 40 tok/s = 20k tok/s fleet-wide
  if one GPU in batch does ~2k tok/s decode  -&gt; ~10 GPUs
  PLUS prefill, PLUS KV headroom, PLUS one AZ spare
  CONCLUSION: plan ~20 GPUs, not 10

KV MEMORY (order of magnitude)
  cache bytes ~= 2 * layers * kv_heads * dim * seq * bytes * batch
  long contexts shrink batch before weights do
  admission control: tokens-in-flight, not requests/s

STORAGE
  800k * 1.2 KB/msg * 90 days  ~= 80 GB  — trivial next to HBM</code></pre>
        <p>The estimate's punchline: the conversation database is cheap. HBM and queue delay are the product. A 70B cold start is minutes unless you keep a warm pool — autoscaling like a stateless web tier will miss the morning peak.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Tokens in flight as the admission metric versus request QPS">
            <defs>
              <marker id="ah-cg2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="36" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="58" text-anchor="middle">100 tiny requests</text>
            <text class="dg-s" x="126" y="76" text-anchor="middle">looks like low QPS</text>
            <rect class="dg-box o" x="280" y="36" width="200" height="56" rx="7" />
            <text class="dg-s" x="380" y="58" text-anchor="middle">each 32k context</text>
            <text class="dg-s" x="380" y="76" text-anchor="middle">KV fills HBM</text>
            <rect class="dg-box y" x="520" y="36" width="184" height="56" rx="7" />
            <text class="dg-s" x="612" y="58" text-anchor="middle">admit by tokens</text>
            <text class="dg-s" x="612" y="76" text-anchor="middle">not by QPS</text>
            <path class="dg-line rose" d="M236 64 H276" marker-end="url(#ah-cg2)" />
            <path class="dg-line rose" d="M480 64 H516" marker-end="url(#ah-cg2)" />
          </svg>
          <figcaption>Figure 2 — A "light" QPS of long prompts is a memory outage. Count tokens in flight.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cg-api">API sketch</h3>
        <pre><code>POST /v1/threads
POST /v1/threads/{id}/turns
  Idempotency-Key: ...
  { message, maxOut, tools? }
  -&gt; SSE: token | tool_call | done | error

POST /v1/turns/{id}/stop
GET  /v1/threads/{id}/messages?cursor=

# internal
enqueue generation { tenant, priority, promptTokens, kvHint }</code></pre>
      `,
    },
    {
      id: 'cg-infer',
      title: 'Inference: KV cache, batching and streaming',
      children: [
        { id: 'cg-kv', title: 'KV cache, paging and prefix reuse' },
        { id: 'cg-batch', title: 'Continuous batching and fairness' },
        { id: 'cg-stream', title: 'Streaming, retries and tools' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cg-kv">KV cache, paging and prefix reuse</h3>
        <p>Attention stores keys and values for every prior token. That cache grows with sequence length and with concurrent generations. Fragmentation used to waste a large fraction of HBM; paged KV (the vLLM idea) allocates blocks like a virtual memory, so a 4k prompt and an 8k prompt can share the pool without one hogging a max-length slab.</p>
        <p>Prefix caching reuses KV for a shared system prompt or a repeated RAG header. Hit ratio here is as important as in <a href="/learn/modern-system-design/distributed-cache">Chapter 16</a>: a 2k-token system prompt recomputed on every turn is a tax you chose. Multi-tenant prefix cache must be keyed by tenant plus prompt hash so you never serve another customer's prefix.</p>
        <p>You generally cannot migrate a warm KV to another GPU in a few milliseconds. Sticky routing to a worker helps for follow-up turns; it fights load balance. Design for "best effort sticky, recompute on miss" rather than a distributed KV cache in v1 — replicating HBM across the network is a research paper, not a first-cut whiteboard.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Paged KV blocks shared across requests versus one slab per max length">
            <defs>
              <marker id="ah-cg3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">MAX SLAB</text>
            <rect class="dg-box r" x="40" y="56" width="280" height="36" rx="6" />
            <text class="dg-s" x="180" y="78" text-anchor="middle">request uses 20% still holds 100%</text>
            <text class="dg-s" x="26" y="128">HBM dies of empty reservations.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">PAGED BLOCKS</text>
            <rect class="dg-box g" x="392" y="52" width="60" height="28" rx="5" />
            <text class="dg-s" x="422" y="70" text-anchor="middle">b0</text>
            <rect class="dg-box g" x="464" y="52" width="60" height="28" rx="5" />
            <text class="dg-s" x="494" y="70" text-anchor="middle">b1</text>
            <rect class="dg-box c" x="536" y="52" width="60" height="28" rx="5" />
            <text class="dg-s" x="566" y="70" text-anchor="middle">b2</text>
            <rect class="dg-box y" x="608" y="52" width="72" height="28" rx="5" />
            <text class="dg-s" x="644" y="70" text-anchor="middle">free</text>
            <text class="dg-s" x="382" y="128">Allocate what the seq actually used.</text>
          </svg>
          <figcaption>Figure 3 — Paging is a memory allocator for attention, not a cache of model weights.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cg-batch">Continuous batching and fairness</h3>
        <p>The scheduler packs decode steps from many generations into one kernel. A tenant that sends 32k-token legal dumps can crowd out interactive chat unless you have quotas per tenant on blocks and on queued prefills. Fairness here is weighted fair queueing, not round-robin of HTTP requests. Preempt a low-priority offline job; do not preempt an interactive decode mid-token if you can avoid it (you will still have to when HBM is gone).</p>
        <p>Speculative decoding (a small model drafts, a large model verifies) raises tok/s when it hits. Mention it as an optimisation, not as the architecture. It does not remove the KV bound.</p>

        <h3 class="lesson-subhead" id="cg-stream">Streaming, retries and tools</h3>
        <p>Stream from the first token. The client renders incrementally. The API must not buffer the full answer for a JSON 200 — that is a batch summarisation API, a different SLO. If the SSE dies, the client reconnects with the turn id; the server either resumes from the last seq or marks the turn failed. Retries without an idempotency key start a second generation and double the bill — same lesson as <a href="/learn/modern-system-design/payment-system">payments</a>.</p>
        <p>Tools: the model emits a structured call. The control plane executes an allowlisted function with a timeout, appends the result as a tool message, and resumes. Cap steps (4–8). The GPU must not call the network itself. Prompt injection via retrieved docs or tool output is untrusted text — delimit it, never treat it as instructions. The support-bot chapter tightens this; here, keep the loop dumb and bounded.</p>
      `,
    },
    {
      id: 'cg-ops',
      title: 'Sessions, safety, cost and evaluation',
      children: [
        { id: 'cg-sess', title: 'Conversation store and the window' },
        { id: 'cg-safe', title: 'Quotas, safety and privacy' },
        { id: 'cg-eval', title: 'Where this design falls short' },
        { id: 'cg-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cg-sess">Conversation store and the window</h3>
        <p>Threads and messages live in a normal store: <code>(thread_id, seq, role, content, token_count, model, created_at)</code>. The GPU never queries this on the hot path except through the assembled prompt the control plane already built. When the running token count exceeds the window, you must trim or summarise — a background job that writes a compact "memory" message. Silent drop of the first user requirements is a product bug that looks like a dumb model.</p>
        <p>Pin <code>model_id</code> and tokenizer version on the turn. Changing the system prompt mid-thread without a version is how evals become incomparable.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Session store assembling a trimmed prompt for the GPU worker">
            <defs>
              <marker id="ah-cg4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="44" width="150" height="48" rx="7" />
            <text class="dg-s" x="91" y="72" text-anchor="middle">message log</text>
            <rect class="dg-box p" x="204" y="44" width="160" height="48" rx="7" />
            <text class="dg-s" x="284" y="72" text-anchor="middle">trim / summarise</text>
            <rect class="dg-box o" x="400" y="44" width="140" height="48" rx="7" />
            <text class="dg-s" x="470" y="72" text-anchor="middle">GPU worker</text>
            <rect class="dg-box g" x="576" y="44" width="128" height="48" rx="7" />
            <text class="dg-s" x="640" y="72" text-anchor="middle">SSE client</text>
            <path class="dg-line violet" d="M166 68 H200" marker-end="url(#ah-cg4)" />
            <path class="dg-line violet" d="M364 68 H396" marker-end="url(#ah-cg4)" />
            <path class="dg-line violet" d="M540 68 H572" marker-end="url(#ah-cg4)" />
          </svg>
          <figcaption>Figure 4 — The window is a budget the control plane spends. The GPU only sees the prompt it was handed.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cg-safe">Quotas, safety and privacy</h3>
        <p>Rate-limit tokens and in-flight generations (<a href="/learn/modern-system-design/rate-limiter">Chapter 19</a>). Fail closed on quota. Fail closed on safety for outputs you would not show a child; fail open on a downed optional classifier only if legal agrees — usually they do not. Log prompts under a retention and access policy; they are user content, not metrics. Tenants who forbid training on their logs need a hard switch, not a blog post.</p>
        <p>Output filters add latency after the last token; streaming means you may have already shown a bad prefix. You need a rollback in the UI ("this message was removed") and a stop of the generation, not only a post-hoc classifier on the finished string.</p>

        <h3 class="lesson-subhead" id="cg-eval">Where this design falls short</h3>
        <p>We did not solve multi-region sticky KV, mixture-of-experts routing, or training. We under-specified abuse (one tenant saturating prefix cache). We treated tools as a cute loop; production tool-use is authz, audit, and idempotency. Eval is thumbs plus a golden set — that will not catch a quiet policy regression. Cost: idle warm GPUs versus cold-start minutes is a CFO fight, not a diagram. And a 200k-context model shifts the estimate; it does not remove admission control.</p>

        <h3 class="lesson-subhead" id="cg-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why does KV cache bound concurrency more than parameter count at long context? (2) Why stream tokens, and what does a client retry without an idempotency key do? (3) What do you rate-limit — requests or tokens — and why? (4) When the prompt exceeds the window, what must the control plane do besides "the model is smart"?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. LLM serving, KV caches and streaming inference are standard industry ideas; all explanations, figures and exercises are our own.',
};
