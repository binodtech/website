/** Full lesson: Agentic AI — Building a Generative AI Platform.
 *  Original BinodTech teaching material. The step-by-step section order follows
 *  the now-standard way this architecture is taught (context → guardrails →
 *  routing → caching → actions → observability); all prose, diagrams and
 *  examples are written for this site.
 */

export type LessonSubsection = { id: string; title: string };

export type LessonSection = {
  id: string;
  title: string;
  html: string;
  children?: LessonSubsection[];
};

export const agenticAiGenaiPlatform = {
  slug: 'genai-platform',
  title: 'Building a Generative AI Platform',
  subtitle:
    'Start with a model behind an API and add one component at a time — context, guardrails, routing, caching, actions, observability — until you have the architecture real teams run in production.',
  byline: 'Agentic AI track · Lesson 2 · ~2h 30m read · Intermediate',
  interviewTip:
    'When asked to design an LLM application, do not draw the finished platform. Draw the query → model → response baseline, then add components one at a time and justify each with the failure it prevents: context for staleness, guardrails for safety, a router for cost, a cache for latency, a gateway for access control. Naming the failure each box removes is what separates a senior answer from a diagram dump.',
  sections: [
    {
      id: 'baseline',
      title: 'Start From the Simplest Thing That Works',
      children: [
        { id: 'baseline-system', title: 'The baseline: query in, response out' },
        { id: 'baseline-order', title: 'How to read this lesson' },
      ],
      html: `
        <p>Platform diagrams for generative AI applications look intimidating: a dozen boxes, arrows crossing, bands labelled orchestration and observability wrapped around everything. They are intimidating because they are shown finished. Nobody builds them that way. Every one of those boxes was added by a team that hit a specific problem and needed a specific fix.</p>
        <p>So this lesson builds the platform in the order teams actually build it. Each step answers one question: <em>what broke, and which component fixes it?</em> If a step does not fix anything you are currently suffering from, skip it — an unused component is not free, it is a thing you now have to operate.</p>

        <h3 class="lesson-subhead" id="baseline-system">The baseline: query in, response out</h3>
        <p>Version one of every application is three boxes. A user sends a query, your application forwards it to a model, the model's output goes back to the user. No retrieval, no safety net, no caching, no routing. "Model API" here means either a hosted API or a model you serve yourself — from the application's point of view the difference is a base URL and who gets paged at 3am.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Baseline architecture: user query goes to the application, then to the model API, and the response returns to the user">
            <defs>
              <marker id="ah-base" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="30" y="34" width="140" height="58" rx="10" />
            <text class="dg-t" x="100" y="59" text-anchor="middle">User</text>
            <text class="dg-s" x="100" y="76" text-anchor="middle">asks a question</text>
            <rect class="dg-box" x="290" y="34" width="140" height="58" rx="10" />
            <text class="dg-t" x="360" y="59" text-anchor="middle">Your app</text>
            <text class="dg-s" x="360" y="76" text-anchor="middle">builds the prompt</text>
            <rect class="dg-box p" x="550" y="34" width="140" height="58" rx="10" />
            <text class="dg-t" x="620" y="59" text-anchor="middle">Model API</text>
            <text class="dg-s" x="620" y="76" text-anchor="middle">hosted or self-served</text>
            <path class="dg-line" d="M170 52 H286" marker-end="url(#ah-base)" />
            <path class="dg-line" d="M430 52 H546" marker-end="url(#ah-base)" />
            <path class="dg-line dash" d="M550 78 H434" marker-end="url(#ah-base)" />
            <path class="dg-line dash" d="M290 78 H174" marker-end="url(#ah-base)" />
            <text class="dg-s" x="228" y="46" text-anchor="middle">query</text>
            <text class="dg-s" x="228" y="96" text-anchor="middle">response</text>
          </svg>
          <figcaption>Figure 1 — Version one. Ship this, put it in front of real users, and let their complaints tell you which component to add next.</figcaption>
        </figure>
        <p>This baseline fails in five predictable ways, and each failure has a name that maps to a step in this lesson:</p>
        <table>
          <thead><tr><th>What users report</th><th>Underlying cause</th><th>Component you need</th></tr></thead>
          <tbody>
            <tr><td>"It makes things up about our product"</td><td>The model has no access to your data</td><td>Step 1 — context construction</td></tr>
            <tr><td>"It said something we cannot ship"</td><td>Nothing inspects inputs or outputs</td><td>Step 2 — guardrails</td></tr>
            <tr><td>"Our bill tripled"</td><td>Every query hits the most expensive model</td><td>Step 3 — router and gateway</td></tr>
            <tr><td>"It is slow"</td><td>Identical work is repeated on every request</td><td>Step 4 — caching</td></tr>
            <tr><td>"It can tell me but not do it"</td><td>No loops, no branching, no write actions</td><td>Step 5 — complex logic and actions</td></tr>
            <tr><td>"We cannot tell why it did that"</td><td>No metrics, logs or traces</td><td>Observability</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="baseline-order">How to read this lesson</h3>
        <p>The order below is common but not sacred. Two rules matter more than the sequence.</p>
        <ol class="lesson-steps">
          <li><strong>Evaluation is not a step.</strong> It runs through all of them. Every component you add changes output quality, and without an eval set you are guessing whether your change helped. Add the eval harness before you add the third box.</li>
          <li><strong>Every component is a liability as well as an asset.</strong> A cache can serve stale answers. A router can misroute. A guardrail can block legitimate requests. Add each one because a real failure justifies it, and measure it afterwards.</li>
        </ol>
        <div class="lesson-callout">This lesson is about the <strong>platform</strong>: the components, what they do, and what they cost you. It is not about prompt engineering, fine-tuning, chunking strategy or model selection — those get their own lessons in this track and in AI Engineering.</div>
      `,
    },
    {
      id: 'step1',
      title: 'Step 1. Enhance Context',
      children: [
        { id: 'step1-rags', title: 'RAGs' },
        { id: 'step1-tabular', title: 'RAGs with tabular data' },
        { id: 'step1-agentic', title: 'Agentic RAGs' },
        { id: 'step1-rewriting', title: 'Query rewriting' },
      ],
      html: `
        <p>The first real expansion is almost always the same: give the model the information it needs to answer. Assembling that information is called <strong>context construction</strong>, and it is the highest-leverage work in the entire platform.</p>
        <p>Here is the mental model that makes it click. For classical machine learning you did feature engineering — deciding what the model gets to see about each example. Context construction is the same job for foundation models. The model is fixed; what you feed it is your product.</p>
        <p>Why it matters so much: a model answering from its weights alone is answering from a compressed snapshot of the past. Ask "does the A300 printer handle 100 pages per minute?" and it will produce something confident and possibly invented. Hand it the actual spec sheet in the context and the same model answers correctly, in more detail, and with far less hallucination. Supplying context is also a form of continual learning — the model stays current about your business without retraining, because the fresh facts arrive at request time.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Architecture with context construction added: the app retrieves from documents, tables and the web before calling the model">
            <defs>
              <marker id="ah-ctx" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="20" y="72" width="110" height="54" rx="10" />
            <text class="dg-t" x="75" y="95" text-anchor="middle">User query</text>
            <text class="dg-s" x="75" y="111" text-anchor="middle">may be ambiguous</text>
            <rect class="dg-box o" x="175" y="72" width="150" height="54" rx="10" />
            <text class="dg-t" x="250" y="95" text-anchor="middle">Context construction</text>
            <text class="dg-s" x="250" y="111" text-anchor="middle">rewrite · retrieve · rank</text>
            <rect class="dg-box p" x="430" y="72" width="130" height="54" rx="10" />
            <text class="dg-t" x="495" y="95" text-anchor="middle">Model API</text>
            <text class="dg-s" x="495" y="111" text-anchor="middle">prompt + context</text>
            <rect class="dg-box b" x="600" y="72" width="100" height="54" rx="10" />
            <text class="dg-t" x="650" y="103" text-anchor="middle">Response</text>
            <rect class="dg-box g" x="150" y="10" width="110" height="40" rx="8" />
            <text class="dg-s" x="205" y="27" text-anchor="middle">Documents</text>
            <text class="dg-s" x="205" y="41" text-anchor="middle">vector + keyword</text>
            <rect class="dg-box g" x="275" y="10" width="105" height="40" rx="8" />
            <text class="dg-s" x="327" y="27" text-anchor="middle">SQL tables</text>
            <text class="dg-s" x="327" y="41" text-anchor="middle">warehouse</text>
            <rect class="dg-box g" x="150" y="150" width="110" height="40" rx="8" />
            <text class="dg-s" x="205" y="167" text-anchor="middle">Web search</text>
            <text class="dg-s" x="205" y="181" text-anchor="middle">fresh facts</text>
            <rect class="dg-box g" x="275" y="150" width="105" height="40" rx="8" />
            <text class="dg-s" x="327" y="167" text-anchor="middle">Chat history</text>
            <text class="dg-s" x="327" y="181" text-anchor="middle">this session</text>
            <path class="dg-line" d="M130 99 H171" marker-end="url(#ah-ctx)" />
            <path class="dg-line" d="M325 99 H426" marker-end="url(#ah-ctx)" />
            <path class="dg-line" d="M560 99 H596" marker-end="url(#ah-ctx)" />
            <path class="dg-line dash" d="M205 50 V72" marker-end="url(#ah-ctx)" />
            <path class="dg-line dash" d="M320 50 V72" marker-end="url(#ah-ctx)" />
            <path class="dg-line dash" d="M205 150 V128" marker-end="url(#ah-ctx)" />
            <path class="dg-line dash" d="M320 150 V128" marker-end="url(#ah-ctx)" />
          </svg>
          <figcaption>Figure 2 — Context construction is a step in your application, not a database feature. It decides what the model is allowed to know about this particular request.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="step1-rags">RAGs</h3>
        <p>Retrieval-augmented generation is the best-known pattern, and it is only two parts: a <strong>retriever</strong> that finds relevant material and a <strong>generator</strong> that writes the answer using it. Retrieval itself is old technology — search engines, recommenders and log analytics have done it for decades — which is good news, because you can borrow their algorithms and their operational wisdom.</p>
        <p>Sources are usually unstructured: contracts, memos, tickets, release notes, wiki pages. Collectively, documents. Since a document can be one paragraph or an entire book, you split them into <strong>chunks</strong> sized by your model's context budget and your latency target. Then you index the chunks and search them one of two ways.</p>
        <table>
          <thead><tr><th></th><th>Term-based (keyword)</th><th>Embedding-based (vector)</th></tr></thead>
          <tbody>
            <tr><td>How it matches</td><td>Words that literally appear</td><td>Meaning, via nearest neighbours in vector space</td></tr>
            <tr><td>Typical tooling</td><td>BM25, inverted indexes, Elasticsearch-style engines</td><td>Embedding model plus an ANN index</td></tr>
            <tr><td>Cost and speed</td><td>Cheap, fast, easy to run</td><td>More compute, more moving parts</td></tr>
            <tr><td>Fails when</td><td>The user's words differ from the document's</td><td>The embedding model does not understand your domain</td></tr>
            <tr><td>Good first move?</td><td>Yes — a strong baseline people underrate</td><td>Yes, once keyword search visibly falls short</td></tr>
          </tbody>
        </table>
        <p>When you evaluate a vector index, four numbers decide whether it will survive production: <strong>recall</strong> (did it find the true nearest neighbours), <strong>queries per second</strong>, <strong>build time</strong> (crucial if your data changes hourly), and <strong>index size</strong>. Approximate nearest-neighbour libraries all trade these against each other; there is no free ranking.</p>
        <p>Serious systems combine both approaches — that combination is called <strong>hybrid search</strong>, and it usually runs in one of two shapes.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Two hybrid retrieval shapes: sequential cheap retrieval then reranking, and ensemble retrieval with score fusion">
            <defs>
              <marker id="ah-hyb" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <text class="dg-h" x="20" y="18">SEQUENTIAL — CHEAP FILTER, THEN EXPENSIVE RANK</text>
            <rect class="dg-box b" x="20" y="28" width="96" height="46" rx="8" />
            <text class="dg-s" x="68" y="48" text-anchor="middle">query</text>
            <text class="dg-s" x="68" y="63" text-anchor="middle">“transformer”</text>
            <rect class="dg-box g" x="150" y="28" width="140" height="46" rx="8" />
            <text class="dg-t" x="220" y="48" text-anchor="middle">Keyword search</text>
            <text class="dg-s" x="220" y="63" text-anchor="middle">1000 candidates, cheap</text>
            <rect class="dg-box o" x="324" y="28" width="150" height="46" rx="8" />
            <text class="dg-t" x="399" y="48" text-anchor="middle">Reranker</text>
            <text class="dg-s" x="399" y="63" text-anchor="middle">top 20, expensive</text>
            <rect class="dg-box p" x="508" y="28" width="150" height="46" rx="8" />
            <text class="dg-t" x="583" y="48" text-anchor="middle">Context</text>
            <text class="dg-s" x="583" y="63" text-anchor="middle">5 chunks that fit</text>
            <path class="dg-line" d="M116 51 H146" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M290 51 H320" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M474 51 H504" marker-end="url(#ah-hyb)" />
            <text class="dg-h" x="20" y="118">ENSEMBLE — MANY RANKINGS, FUSED</text>
            <rect class="dg-box b" x="20" y="128" width="96" height="60" rx="8" />
            <text class="dg-s" x="68" y="163" text-anchor="middle">query</text>
            <rect class="dg-box g" x="150" y="122" width="140" height="30" rx="8" />
            <text class="dg-s" x="220" y="141" text-anchor="middle">keyword ranking</text>
            <rect class="dg-box g" x="150" y="164" width="140" height="30" rx="8" />
            <text class="dg-s" x="220" y="183" text-anchor="middle">vector ranking</text>
            <rect class="dg-box o" x="324" y="143" width="150" height="34" rx="8" />
            <text class="dg-t" x="399" y="164" text-anchor="middle">Score fusion</text>
            <rect class="dg-box p" x="508" y="143" width="150" height="34" rx="8" />
            <text class="dg-t" x="583" y="164" text-anchor="middle">Context</text>
            <path class="dg-line" d="M116 148 H146" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M116 168 H146" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M290 137 H310 V158 H320" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M290 179 H310 V162 H320" marker-end="url(#ah-hyb)" />
            <path class="dg-line" d="M474 160 H504" marker-end="url(#ah-hyb)" />
          </svg>
          <figcaption>Figure 3 — The keyword pass finds documents containing "transformer"; the rerank pass works out whether you meant the electrical device, the neural architecture or the film.</figcaption>
        </figure>
        <p>One important difference from web search: in search, being ranked first instead of fifth matters enormously. In context construction, what matters most is being <em>included at all</em>. Order still has some effect — models attend unevenly across a long context, and material in the middle can get less weight — but inclusion dominates position.</p>
        <p>And retrieval is not text-only. The same machinery indexes images, audio, video and code. A common trick for structured data is to generate short natural-language summaries of tables or dataframes, embed those summaries, and retrieve them like documents.</p>

        <h3 class="lesson-subhead" id="step1-tabular">RAGs with tabular data</h3>
        <p>Plenty of the answers your users want live in a database, not a document. That needs a different pipeline, because you cannot embed your way to "revenue by region last quarter" — you have to compute it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 175" role="img" aria-label="Text to SQL pipeline: optional table selection, SQL generation, execution, then response generation">
            <defs>
              <marker id="ah-sql" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="16" y="60" width="104" height="50" rx="8" />
            <text class="dg-s" x="68" y="82" text-anchor="middle">question</text>
            <text class="dg-s" x="68" y="97" text-anchor="middle">in English</text>
            <rect class="dg-box o" x="146" y="60" width="124" height="50" rx="8" />
            <text class="dg-t" x="208" y="80" text-anchor="middle">Pick tables</text>
            <text class="dg-s" x="208" y="97" text-anchor="middle">if schemas don't fit</text>
            <rect class="dg-box p" x="296" y="60" width="124" height="50" rx="8" />
            <text class="dg-t" x="358" y="80" text-anchor="middle">Text → SQL</text>
            <text class="dg-s" x="358" y="97" text-anchor="middle">schema-aware</text>
            <rect class="dg-box g" x="446" y="60" width="124" height="50" rx="8" />
            <text class="dg-t" x="508" y="80" text-anchor="middle">Execute</text>
            <text class="dg-s" x="508" y="97" text-anchor="middle">read-only role</text>
            <rect class="dg-box b" x="596" y="60" width="108" height="50" rx="8" />
            <text class="dg-t" x="650" y="80" text-anchor="middle">Answer</text>
            <text class="dg-s" x="650" y="97" text-anchor="middle">rows + question</text>
            <path class="dg-line" d="M120 85 H142" marker-end="url(#ah-sql)" />
            <path class="dg-line" d="M270 85 H292" marker-end="url(#ah-sql)" />
            <path class="dg-line" d="M420 85 H442" marker-end="url(#ah-sql)" />
            <path class="dg-line" d="M570 85 H592" marker-end="url(#ah-sql)" />
            <text class="dg-s" x="358" y="140" text-anchor="middle">Guard the execution step: read-only credentials, row limits, statement timeout, no DDL.</text>
            <text class="dg-s" x="358" y="26" text-anchor="middle">Same model can do every stage, or use a specialised text-to-SQL model for the middle one.</text>
          </svg>
          <figcaption>Figure 4 — Three logical stages: decide the query, run it, explain the result. The security work lives entirely in stage two.</figcaption>
        </figure>
        <p>Two practical notes. When you have hundreds of tables, their schemas will not fit in a prompt, so you need a table-selection step first — itself a retrieval problem over schema descriptions. And execution deserves paranoia: give the query a read-only role with a statement timeout and a row cap. A generated <code>SELECT</code> that accidentally cross-joins two large tables can take your warehouse down without any malice involved.</p>

        <h3 class="lesson-subhead" id="step1-agentic">Agentic RAGs</h3>
        <p>Step back and notice what you have built. Keyword search, vector search, SQL execution and web search are all just <strong>actions the system can take to improve its own context</strong>. Once you frame each one as a callable function and let the model choose, the pipeline becomes agentic — the flow is decided per request rather than hard-wired.</p>
        <p>The internet is the highest-value new source here. Asked "who won the award this year?", a system with search finds the current answer instead of confidently reporting an old one.</p>
        <div class="lesson-callout"><strong>Action vs tool.</strong> A tool can expose several actions — a people-search tool might allow lookup by name and lookup by email. The distinction rarely changes a design, which is why most engineers use the words interchangeably.</div>
        <p>The distinction that <em>does</em> matter is the one from the previous lesson: everything in this step is a <strong>read-only action</strong>. It gathers information and changes nothing. Write actions arrive in Step 5, and they carry an entirely different risk profile.</p>
        <p class="lesson-flow">Context construction, in one line: rewrite the query → choose sources → retrieve candidates → rerank → fit into the budget → hand to the model</p>

        <h3 class="lesson-subhead" id="step1-rewriting">Query rewriting</h3>
        <p>The last piece is the cheapest and the most frequently skipped. Real conversations are full of references that make no sense in isolation:</p>
        <pre><code>User: When did Anita Rao last order from us?
Assistant: On 3 January — a Mango Cap.
User: What about her sister?</code></pre>
        <p>Retrieving on the literal text "what about her sister?" returns nothing useful. The query has to be rewritten into something that stands alone: <em>"When did Anita Rao's sister last place an order?"</em> — and even that needs a database lookup to resolve who the sister actually is.</p>
        <p>Rewriting is usually done with a small model and a short instruction along the lines of "given this conversation, restate the final message so it makes sense on its own". Cheap, fast, and it fixes a large share of "retrieval is bad" complaints.</p>
        <p>It gets harder when identity resolution is involved. If the answer is not in your data, the rewriter must be allowed to say so. A rewriter that invents a plausible name to complete the sentence has manufactured a wrong answer that every downstream component will faithfully act on.</p>
        <ul class="lesson-checklist">
          <li>Resolve pronouns and follow-ups against the conversation.</li>
          <li>Expand abbreviations and internal jargon before retrieval.</li>
          <li>Split a compound question into separate retrievals.</li>
          <li>Return "cannot resolve" instead of guessing an entity.</li>
        </ul>
      `,
    },
    {
      id: 'step2',
      title: 'Step 2. Put in Guardrails',
      children: [
        { id: 'step2-input', title: 'Input guardrails' },
        { id: 'step2-leaking', title: 'Leaking private information to external APIs' },
        { id: 'step2-jailbreak', title: 'Model jailbreaking' },
        { id: 'step2-output', title: 'Output guardrails' },
        { id: 'step2-quality', title: 'Output quality measurement' },
        { id: 'step2-failure', title: 'Failure management' },
        { id: 'step2-tradeoffs', title: 'Guardrail tradeoffs' },
      ],
      html: `
        <p>Guardrails protect three parties at once: your users from bad output, your company from bad headlines, and you from a 2am incident. The principle for placing them is simple — <strong>wherever a failure can enter or leave your system</strong>. That gives two families: guardrails on the way in, and guardrails on the way out.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 205" role="img" aria-label="Architecture with input and output guardrails wrapping the model call, with block, mask and retry outcomes">
            <defs>
              <marker id="ah-guard" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="16" y="70" width="96" height="52" rx="9" />
            <text class="dg-t" x="64" y="92" text-anchor="middle">Query</text>
            <text class="dg-s" x="64" y="108" text-anchor="middle">+ context</text>
            <rect class="dg-box o" x="140" y="70" width="132" height="52" rx="9" />
            <text class="dg-t" x="206" y="90" text-anchor="middle">Input guardrails</text>
            <text class="dg-s" x="206" y="107" text-anchor="middle">PII · jailbreak · scope</text>
            <rect class="dg-box p" x="300" y="70" width="120" height="52" rx="9" />
            <text class="dg-t" x="360" y="92" text-anchor="middle">Model</text>
            <text class="dg-s" x="360" y="108" text-anchor="middle">generation</text>
            <rect class="dg-box o" x="448" y="70" width="132" height="52" rx="9" />
            <text class="dg-t" x="514" y="90" text-anchor="middle">Output guardrails</text>
            <text class="dg-s" x="514" y="107" text-anchor="middle">format · safety · facts</text>
            <rect class="dg-box g" x="608" y="70" width="96" height="52" rx="9" />
            <text class="dg-t" x="656" y="100" text-anchor="middle">User</text>
            <path class="dg-line" d="M112 96 H136" marker-end="url(#ah-guard)" />
            <path class="dg-line" d="M272 96 H296" marker-end="url(#ah-guard)" />
            <path class="dg-line" d="M420 96 H444" marker-end="url(#ah-guard)" />
            <path class="dg-line" d="M580 96 H604" marker-end="url(#ah-guard)" />
            <rect class="dg-box r" x="140" y="14" width="132" height="34" rx="8" />
            <text class="dg-s" x="206" y="35" text-anchor="middle">block · mask · redact</text>
            <path class="dg-line" d="M206 70 V52" marker-end="url(#ah-guard)" />
            <rect class="dg-box r" x="448" y="14" width="132" height="34" rx="8" />
            <text class="dg-s" x="514" y="35" text-anchor="middle">retry · fallback · human</text>
            <path class="dg-line" d="M514 70 V52" marker-end="url(#ah-guard)" />
            <path class="dg-line dash" d="M514 122 V158 H360 V126" marker-end="url(#ah-guard)" />
            <text class="dg-s" x="437" y="174" text-anchor="middle">failed check → regenerate</text>
            <rect class="dg-box" x="16" y="150" width="220" height="34" rx="8" />
            <text class="dg-s" x="126" y="171" text-anchor="middle">unmask placeholders on the way out</text>
            <path class="dg-line dash" d="M604 167 H240" marker-end="url(#ah-guard)" />
          </svg>
          <figcaption>Figure 5 — Guardrails can live in your application or inside a gateway (Step 3). The scoring models they call are usually much smaller and faster than your generation model.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="step2-input">Input guardrails</h3>
        <p>Inbound checks defend against two very different risks: <strong>private data leaving</strong>, and <strong>hostile prompts arriving</strong>. Keep them separate in your head, because one is a compliance problem and the other is a security problem.</p>

        <h3 class="lesson-subhead" id="step2-leaking">Leaking private information to external APIs</h3>
        <p>This risk exists specifically because you send data to somebody else's servers. An employee pastes an unreleased spec into a prompt; a support agent includes a customer's full card details; a debugging script forwards a whole database row. There have been well-publicised cases of staff pasting proprietary information into public assistants, with companies restricting the tools afterwards. Nothing makes third-party APIs airtight, but detection plus masking removes most of the everyday exposure.</p>
        <p>Decide first what counts as sensitive for you. Common classes:</p>
        <ul>
          <li>Personal identifiers — government IDs, phone numbers, account and card numbers, addresses.</li>
          <li>Faces and other biometric content in images.</li>
          <li>Named internal projects, unreleased product names, privileged legal or financial terms.</li>
          <li>Credentials — the API key someone will inevitably paste into a chat box.</li>
        </ul>
        <p>Detection tools are themselves usually models, because judging whether a string is a real home address needs more than a regular expression. Once something is detected you have two options: <strong>block</strong> the request, or <strong>mask</strong> the sensitive span with a placeholder such as <code>[PHONE]</code>. Masking is nicer for users, and it needs one extra piece of machinery: a reversible map from placeholder back to the original value, so that if the response contains <code>[PHONE]</code> you can restore the real number before it reaches the person who is allowed to see it.</p>

        <h3 class="lesson-subhead" id="step2-jailbreak">Model jailbreaking</h3>
        <p>Getting models to misbehave is an internet sport. It stops being funny when the model wears your logo. A support assistant that can be talked into insulting a customer, endorsing a competitor, or emitting a destructive database statement is a business problem, not a curiosity.</p>
        <p>The critical asymmetry: jailbreaks get much worse when the system holds tools. Words are recoverable; an executed <code>DELETE</code> is not. So the first line of defence is not a cleverer prompt, it is <strong>capability restriction</strong> — nothing destructive is reachable without human approval, no matter what the model was persuaded to output. Yes, approval gates add latency. That is the trade you are making.</p>
        <p>The second line is <strong>scope</strong>. Define what your application does not discuss. A billing assistant has no business answering election questions. Implementations, from crude to solid: a blocklist of phrases, a small classifier that labels the topic, and anomaly detection for prompts that look nothing like your normal traffic (useful precisely because real attacks are rare and therefore statistically strange).</p>
        <table>
          <thead><tr><th>Guardrail</th><th>Catches</th><th>Cost</th><th>Fails when</th></tr></thead>
          <tbody>
            <tr><td>Keyword / regex</td><td>Obvious cases, known secrets</td><td>Microseconds</td><td>Any rephrasing</td></tr>
            <tr><td>PII detection model</td><td>Identifiers in free text</td><td>Tens of ms</td><td>Unusual formats, other languages</td></tr>
            <tr><td>Topic classifier</td><td>Out-of-scope requests</td><td>Tens of ms</td><td>Indirect phrasing</td></tr>
            <tr><td>Anomaly detection</td><td>Never-seen attack shapes</td><td>Needs traffic history</td><td>Slow drift in normal usage</td></tr>
            <tr><td>Capability limits</td><td>Everything, structurally</td><td>Design time + approval latency</td><td>Never — this is your floor</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="step2-output">Output guardrails</h3>
        <p>Model outputs are sampled from a distribution, so unreliability is a property of the technology, not a bug you will eventually fix. Outbound guardrails do two jobs: <strong>judge each generation</strong>, and <strong>define what happens when the judgement is bad</strong>. Teams routinely build the first and forget the second, which leaves them detecting failures they have no plan for.</p>

        <h3 class="lesson-subhead" id="step2-quality">Output quality measurement</h3>
        <p>You cannot catch failures you have not named. Here is a working list, with how each is actually detected:</p>
        <table>
          <thead><tr><th>Failure</th><th>How to detect it</th></tr></thead>
          <tbody>
            <tr><td>Empty or truncated response</td><td>Length and finish-reason checks. Trivial and worth doing first.</td></tr>
            <tr><td>Malformed structure</td><td>Schema, JSON and regex validators; constrained decoding to prevent it at the source.</td></tr>
            <tr><td>Toxic or abusive content</td><td>Classifier on the output text.</td></tr>
            <tr><td>Hallucinated claims</td><td>Hardest one. Self-consistency across samples, checking claims against retrieved sources, or a verifier model. Mitigate upstream with better context.</td></tr>
            <tr><td>Sensitive data in the answer</td><td>Same detectors as the input side. Two root causes: the model memorised it, or your retrieval handed it over — fix the second by not retrieving it.</td></tr>
            <tr><td>Brand and competitor risk</td><td>Keyword monitoring plus sentiment checks; route hits to review rather than users.</td></tr>
            <tr><td>Just plain bad</td><td>A judge model scoring against your rubric — a low-calorie recipe with a cup of sugar is correct-looking and useless.</td></tr>
          </tbody>
        </table>
        <p>Judges can be general-purpose models or small specialised scorers. Small scorers are usually the better platform choice: cheaper, faster, and you can run several without blowing your latency budget.</p>

        <h3 class="lesson-subhead" id="step2-failure">Failure management</h3>
        <p>Because generation is stochastic, the same request can succeed on a second attempt. That makes <strong>retry</strong> the highest-value failure policy you own — and the one that quietly doubles your bill and your latency if you are careless.</p>
        <ul>
          <li><strong>Serial retry.</strong> Detect failure, call again. Simple; in the worst case the user waits twice as long.</li>
          <li><strong>Parallel attempts.</strong> Fire two generations at once and keep the better one. More tokens, flat latency. Sensible for short, high-stakes responses.</li>
          <li><strong>Fallback model.</strong> On repeated failure, switch to a different or larger model rather than retrying the same one identically.</li>
          <li><strong>Human handoff.</strong> Route out of the automated path entirely — on certain phrases, after N turns without resolution, or when a sentiment model detects a frustrated user. Turn-count handoff also breaks the "stuck in a loop with a bot" experience that generates complaints.</li>
        </ul>
        <p class="lesson-flow">Detect → classify → retry (bounded) → fall back → hand to a human → log every step of that decision</p>
        <div class="lesson-callout">Cap retries and make the cap visible in your metrics. An unbounded retry loop under a partial outage is how a small provider incident becomes your own cost incident.</div>

        <h3 class="lesson-subhead" id="step2-tradeoffs">Guardrail tradeoffs</h3>
        <p><strong>Reliability against latency.</strong> Every check adds milliseconds, and a few teams genuinely choose speed and skip guardrails. They are a minority, and the reasoning is usually that the risk is cheaper than the delay. Most teams conclude the opposite — one bad output costs more than a hundred slightly slower good ones. Decide explicitly, with numbers, rather than by default.</p>
        <p><strong>Streaming makes output guardrails awkward.</strong> Streaming exists to reduce perceived wait: tokens appear as they are produced. But a partial response is hard to judge, so unsafe content can reach the screen before a verdict is available. The usual compromises: run cheap checks on the stream and expensive ones at the end, delay by a short buffer, or stream only for low-risk request types.</p>
        <p><strong>Self-hosting changes which guardrails you need.</strong> Keeping the model inside your own boundary largely removes the leaking-to-third-parties problem — and hands you responsibility for building every other check yourself, instead of inheriting whatever a provider ships.</p>
      `,
    },
    {
      id: 'step3',
      title: 'Step 3. Add Model Router and Gateway',
      children: [
        { id: 'step3-router', title: 'Router' },
        { id: 'step3-gateway', title: 'Gateway' },
      ],
      html: `
        <p>By now you have one model doing everything. Two tools appear at this point in almost every platform, and they are frequently confused: a <strong>router</strong> decides <em>which</em> model or path handles a request, while a <strong>gateway</strong> is the single door through which all model traffic passes. Different jobs, often shipped in the same service.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 235" role="img" aria-label="Router classifies intent and selects a destination; gateway centralises access to all model providers with keys, limits, fallback and logging">
            <defs>
              <marker id="ah-rg" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="14" y="96" width="92" height="48" rx="9" />
            <text class="dg-t" x="60" y="126" text-anchor="middle">Query</text>
            <rect class="dg-box o" x="132" y="96" width="130" height="48" rx="9" />
            <text class="dg-t" x="197" y="116" text-anchor="middle">Router</text>
            <text class="dg-s" x="197" y="133" text-anchor="middle">intent → destination</text>
            <rect class="dg-box" x="296" y="26" width="150" height="34" rx="7" />
            <text class="dg-s" x="371" y="47" text-anchor="middle">static answer / help page</text>
            <rect class="dg-box r" x="296" y="70" width="150" height="34" rx="7" />
            <text class="dg-s" x="371" y="91" text-anchor="middle">human operator</text>
            <rect class="dg-box g" x="296" y="114" width="150" height="34" rx="7" />
            <text class="dg-s" x="371" y="135" text-anchor="middle">small / cheap model</text>
            <rect class="dg-box p" x="296" y="158" width="150" height="34" rx="7" />
            <text class="dg-s" x="371" y="179" text-anchor="middle">large / specialist model</text>
            <rect class="dg-box" x="296" y="202" width="150" height="30" rx="7" />
            <text class="dg-s" x="371" y="221" text-anchor="middle">decline: out of scope</text>
            <path class="dg-line" d="M106 120 H128" marker-end="url(#ah-rg)" />
            <path class="dg-line" d="M262 120 H278 V43 H292" marker-end="url(#ah-rg)" />
            <path class="dg-line" d="M262 120 H278 V87 H292" marker-end="url(#ah-rg)" />
            <path class="dg-line" d="M262 120 H292" marker-end="url(#ah-rg)" />
            <path class="dg-line" d="M262 120 H278 V175 H292" marker-end="url(#ah-rg)" />
            <path class="dg-line" d="M262 120 H278 V217 H292" marker-end="url(#ah-rg)" />
            <rect class="dg-band" x="486" y="26" width="220" height="206" rx="12" />
            <text class="dg-h" x="500" y="20">MODEL GATEWAY</text>
            <rect class="dg-box" x="500" y="40" width="192" height="30" rx="7" />
            <text class="dg-s" x="596" y="59" text-anchor="middle">one interface, many providers</text>
            <rect class="dg-box" x="500" y="78" width="192" height="30" rx="7" />
            <text class="dg-s" x="596" y="97" text-anchor="middle">keys + per-team access control</text>
            <rect class="dg-box" x="500" y="116" width="192" height="30" rx="7" />
            <text class="dg-s" x="596" y="135" text-anchor="middle">rate limits + spend caps</text>
            <rect class="dg-box" x="500" y="154" width="192" height="30" rx="7" />
            <text class="dg-s" x="596" y="173" text-anchor="middle">fallback on error / 429</text>
            <rect class="dg-box" x="500" y="192" width="192" height="30" rx="7" />
            <text class="dg-s" x="596" y="211" text-anchor="middle">logs, traces, usage analytics</text>
            <path class="dg-line" d="M446 131 H482" marker-end="url(#ah-rg)" />
          </svg>
          <figcaption>Figure 6 — Routing and scoring models are typically far smaller than generation models, which is why you can afford to run them on every request.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="step3-router">Router</h3>
        <p>Sending every request to your most capable model is easy and wasteful. Routing buys you two things: <strong>specialisation</strong> (a model tuned for troubleshooting beats a generalist at troubleshooting) and <strong>cost control</strong> (simple requests do not need your flagship).</p>
        <p>At the centre of a router sits an intent classifier. For a support assistant, the mapping might be:</p>
        <ul>
          <li>Password reset → send the self-service page, no generation at all.</li>
          <li>Billing dispute → straight to a human, with a summary attached.</li>
          <li>Technical fault → the model fine-tuned on your troubleshooting corpus.</li>
          <li>Product question → generalist model with documentation retrieval.</li>
          <li>Politics, medical advice, anything out of scope → a polite stock decline.</li>
        </ul>
        <p>That last row is quietly valuable: declining early costs you nothing, while generating a refusal costs a full model call. Routing to a static answer is the cheapest possible response.</p>
        <p>If your system can take actions, the router often also predicts the <strong>next action</strong> — and one legitimate action is asking for clarification. A user who types "frozen" might mean a frozen account or the weather; asking is better than confidently answering the wrong one.</p>
        <p>Classifiers here can be prompted general models or small trained ones. Small ones win on cost and latency, which matters because this runs on every single request.</p>
        <p>One subtlety that bites in production: <strong>context limits differ between destinations</strong>. Suppose a 1,000-token request is routed to a model with a 4K window, then a web search returns 8,000 tokens of material. You now have two choices — trim the context to fit, or re-route to a model with a bigger window. Decide that policy deliberately, because the silent version of it is truncation that quietly deletes the passage containing the answer.</p>

        <h3 class="lesson-subhead" id="step3-gateway">Gateway</h3>
        <p>A gateway is an unglamorous piece of infrastructure that pays for itself within weeks. It is one internal endpoint that every application calls, which then talks to every model you use — hosted or self-served — behind a uniform interface.</p>
        <p>What that buys you:</p>
        <ul>
          <li><strong>One place to change.</strong> When a provider alters its API, you update the gateway instead of eleven services.</li>
          <li><strong>Credential hygiene.</strong> Nobody gets the organisation's provider keys. They get gateway access, which you can scope and revoke per team, per application, per model.</li>
          <li><strong>Cost and abuse control.</strong> Rate limits and spend caps enforced centrally, so one runaway experiment cannot consume the quarter's budget.</li>
          <li><strong>Graceful failure.</strong> Provider outages and rate-limit responses are routine. The gateway retries with backoff, or fails over to an alternative model, so applications stay up.</li>
          <li><strong>Free observability.</strong> Every request already flows through it, making it the natural home for logging, usage analytics, and often caching and guardrails too.</li>
        </ul>
        <p>Conceptually it is thin — a request comes in naming a model and a payload, the gateway maps that onto the right provider call and normalises the response. That thinness is why so many off-the-shelf gateways exist, both open source and commercial. Build only if you have a genuinely unusual requirement.</p>
        <div class="lesson-callout"><strong>Interview framing.</strong> "Router picks the destination, gateway owns the door." Then add the operational reason each exists: the router controls spend and quality per request type, the gateway controls credentials, quotas, failover and visibility.</div>
      `,
    },
    {
      id: 'step4',
      title: 'Step 4. Reduce Latency with Cache',
      children: [
        { id: 'step4-prompt', title: 'Prompt cache' },
        { id: 'step4-exact', title: 'Exact cache' },
        { id: 'step4-semantic', title: 'Semantic cache' },
      ],
      html: `
        <p>Caching is the most underrated component of a generative AI platform. It attacks latency and cost simultaneously, which almost nothing else does — every other quality improvement in this lesson makes one of them worse.</p>
        <p>Three inference-time caches matter, in increasing order of risk. (Attention key-value caching inside the serving engine is a separate, lower-level concern and out of scope here.)</p>
        <table>
          <thead><tr><th>Cache</th><th>Reuses</th><th>Who implements it</th><th>Risk of a wrong answer</th></tr></thead>
          <tbody>
            <tr><td>Prompt cache</td><td>Repeated <em>prefix</em> tokens</td><td>Your inference API or serving stack</td><td>None</td></tr>
            <tr><td>Exact cache</td><td>Identical requests</td><td>You</td><td>Only staleness</td></tr>
            <tr><td>Semantic cache</td><td>Similar requests</td><td>You</td><td>Real — can return the wrong answer</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="step4-prompt">Prompt cache</h3>
        <p>Most prompts in an application share a long identical opening: the system prompt, tool definitions, formatting rules, few-shot examples. Without caching, the model reprocesses all of it on every single request. A prompt cache stores the processed form of that shared prefix so it is computed once and reused.</p>
        <p>The arithmetic is startling. A 1,000-token system prompt across a million daily calls is roughly a billion input tokens per day spent re-reading the same instructions. Cache the prefix and that expense largely disappears. Providers usually price cached input tokens far below normal input tokens, sometimes with a separate storage charge per hour — so it is a genuine trade, just a very favourable one.</p>
        <p>The same mechanism helps enormously when many questions concern one long document: a contract, a book, a codebase. Cache the document once, then ask twenty questions about it cheaply.</p>
        <p>Two practical rules. Put your <strong>stable content first and variable content last</strong>, because only a common prefix can be reused — a timestamp at the top of your prompt destroys the entire benefit. And when comparing inference libraries or providers, explicitly ask what prompt caching they support and how long entries live.</p>

        <h3 class="lesson-subhead" id="step4-exact">Exact cache</h3>
        <p>The plainest idea in computing: remember the answer to a request you have already served. If a user asks for a summary of product 4471 and you generated one an hour ago, return that instead of paying for it again.</p>
        <p>Exact caching applies to more than final answers, and that is where much of its value sits: cache embedding lookups, retrieval results, SQL query results, and any expensive tool call. Multi-step flows benefit most, because you are skipping a chain of work rather than one call.</p>
        <p>Implementation is standard engineering. In-memory storage is fastest; a datastore like Redis or Postgres holds far more; tiered setups balance the two. You need an eviction policy — least recently used, least frequently used, or first in first out — or the cache grows until something falls over.</p>
        <p>The interesting decision is <strong>what deserves caching at all</strong>:</p>
        <ul class="lesson-checklist">
          <li>Cache freely: stable public facts, policy explanations, product descriptions, generated documentation.</li>
          <li>Never cache: "where is my order", "what is my balance" — user-specific and nobody else will ask it.</li>
          <li>Never cache: anything time-sensitive, unless the answer carries its own timestamp.</li>
          <li>Always scope by tenant and permission. A cache that ignores who is asking is a data-leak mechanism with a performance benefit.</li>
        </ul>
        <p>Some teams train a small classifier to predict whether a query is worth caching. That is a reasonable optimisation once you have traffic data showing which categories actually repeat.</p>

        <h3 class="lesson-subhead" id="step4-semantic">Semantic cache</h3>
        <p>Semantic caching drops the requirement that requests match exactly and reuses answers for questions that <em>mean</em> the same thing. "What is the capital of Vietnam?" and "What's the capital city of Vietnam?" should not both cost a generation.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 215" role="img" aria-label="Semantic cache flow: embed the query, vector search cached queries, compare similarity against a threshold, then serve from cache or generate and store">
            <defs>
              <marker id="ah-sem" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="14" y="80" width="96" height="48" rx="9" />
            <text class="dg-t" x="62" y="102" text-anchor="middle">Query</text>
            <text class="dg-s" x="62" y="118" text-anchor="middle">new wording</text>
            <rect class="dg-box" x="132" y="80" width="110" height="48" rx="9" />
            <text class="dg-t" x="187" y="102" text-anchor="middle">Embed</text>
            <text class="dg-s" x="187" y="118" text-anchor="middle">to a vector</text>
            <rect class="dg-box o" x="264" y="80" width="130" height="48" rx="9" />
            <text class="dg-t" x="329" y="100" text-anchor="middle">Vector search</text>
            <text class="dg-s" x="329" y="117" text-anchor="middle">nearest cached query</text>
            <rect class="dg-box p" x="416" y="80" width="130" height="48" rx="9" />
            <text class="dg-t" x="481" y="100" text-anchor="middle">similarity ≥ τ ?</text>
            <text class="dg-s" x="481" y="117" text-anchor="middle">the risky threshold</text>
            <rect class="dg-box g" x="576" y="26" width="128" height="46" rx="9" />
            <text class="dg-t" x="640" y="47" text-anchor="middle">Serve cached</text>
            <text class="dg-s" x="640" y="63" text-anchor="middle">no model call</text>
            <rect class="dg-box r" x="576" y="134" width="128" height="46" rx="9" />
            <text class="dg-t" x="640" y="155" text-anchor="middle">Generate</text>
            <text class="dg-s" x="640" y="171" text-anchor="middle">then store + embed</text>
            <path class="dg-line" d="M110 104 H128" marker-end="url(#ah-sem)" />
            <path class="dg-line" d="M242 104 H260" marker-end="url(#ah-sem)" />
            <path class="dg-line" d="M394 104 H412" marker-end="url(#ah-sem)" />
            <path class="dg-line" d="M546 96 H562 V49 H572" marker-end="url(#ah-sem)" />
            <path class="dg-line" d="M546 112 H562 V157 H572" marker-end="url(#ah-sem)" />
            <text class="dg-s" x="556" y="76" text-anchor="middle">hit</text>
            <text class="dg-s" x="556" y="134" text-anchor="middle">miss</text>
            <path class="dg-line dash" d="M640 180 V198 H329 V132" marker-end="url(#ah-sem)" />
            <text class="dg-s" x="480" y="212" text-anchor="middle">write back into the cache index</text>
          </svg>
          <figcaption>Figure 7 — Every box here can be wrong: a weak embedding model, an imprecise vector search, or a badly tuned threshold each produce confidently incorrect cache hits.</figcaption>
        </figure>
        <p>Be honest about the value: this is the shakiest component in the lesson. Its correctness depends on good embeddings, working vector search, and a similarity threshold you tuned by trial and error. Set the threshold too loose and you serve the answer to a <em>different</em> question — worse than a cache miss, because it is invisible. And it is not free: every lookup is a vector search whose cost grows with the cache.</p>
        <p>So justify it with a number. If the hit rate is high — many users genuinely ask the same handful of things in different words — the savings are substantial and the risk is manageable with a conservative threshold. If the hit rate is low, you have added a failure mode and a latency tax for nothing. Measure hit rate and <em>false</em> hit rate before adopting it, and start with exact caching, which is strictly safer.</p>
        <div class="lesson-callout"><strong>Order of adoption:</strong> prompt cache (free win, no correctness risk) → exact cache (big win, staleness only) → semantic cache (only if the numbers justify it).</div>
      `,
    },
    {
      id: 'step5',
      title: 'Step 5. Add Complex Logic and Write Actions',
      children: [
        { id: 'step5-logic', title: 'Complex logic' },
        { id: 'step5-write', title: 'Write actions' },
      ],
      html: `
        <p>Everything so far has been essentially one-directional: a request comes in, context is assembled, a model generates, guardrails check, a response goes out. The final step makes the flow genuinely non-linear — outputs can loop back as inputs, branch conditionally, and trigger actions that change the world.</p>

        <h3 class="lesson-subhead" id="step5-logic">Complex logic</h3>
        <p>The core change is one new arrow: a model's output feeding back into context construction instead of going to the user. That single loop turns the pipeline into the agent loop from the previous lesson.</p>
        <p>Consider "plan a weekend in Lisbon". A first pass produces candidate activities — a viewpoint, a pastry shop, a tram ride, a museum. Each of those can be fed back in for detail: opening hours, tickets, what is nearby, how to get between them. Some branches need retrieval, some need a different model, and the loop continues until the system judges the itinerary complete and only then answers.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Full platform: orchestration band on top, observability band at the bottom, with context construction, guardrails, gateway with routing generation and scoring, caches, read and write actions">
            <defs>
              <marker id="ah-full" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-band" x="12" y="8" width="696" height="26" rx="7" />
            <text class="dg-t" x="360" y="26" text-anchor="middle">Orchestration — defines the components and chains them together</text>
            <rect class="dg-band" x="12" y="216" width="696" height="26" rx="7" />
            <text class="dg-t" x="360" y="234" text-anchor="middle">Observability — metrics, logs, traces, cost and quality per step</text>

            <rect class="dg-box b" x="20" y="112" width="84" height="44" rx="8" />
            <text class="dg-t" x="62" y="132" text-anchor="middle">Query</text>
            <text class="dg-s" x="62" y="148" text-anchor="middle">user</text>
            <rect class="dg-box" x="120" y="112" width="72" height="44" rx="8" />
            <text class="dg-t" x="156" y="132" text-anchor="middle">Cache</text>
            <text class="dg-s" x="156" y="148" text-anchor="middle">exact</text>
            <rect class="dg-box o" x="208" y="112" width="122" height="44" rx="8" />
            <text class="dg-t" x="269" y="131" text-anchor="middle">Context build</text>
            <text class="dg-s" x="269" y="147" text-anchor="middle">rewrite · retrieve · rank</text>
            <rect class="dg-box r" x="346" y="112" width="96" height="44" rx="8" />
            <text class="dg-t" x="394" y="131" text-anchor="middle">Input</text>
            <text class="dg-s" x="394" y="147" text-anchor="middle">guardrails</text>
            <rect class="dg-band" x="458" y="52" width="132" height="120" rx="10" />
            <text class="dg-h" x="468" y="46">GATEWAY</text>
            <rect class="dg-box p" x="470" y="62" width="108" height="30" rx="6" />
            <text class="dg-s" x="524" y="81" text-anchor="middle">routing</text>
            <rect class="dg-box p" x="470" y="98" width="108" height="30" rx="6" />
            <text class="dg-s" x="524" y="117" text-anchor="middle">generation</text>
            <rect class="dg-box p" x="470" y="134" width="108" height="30" rx="6" />
            <text class="dg-s" x="524" y="153" text-anchor="middle">scoring</text>
            <rect class="dg-box r" x="606" y="112" width="96" height="44" rx="8" />
            <text class="dg-t" x="654" y="131" text-anchor="middle">Output</text>
            <text class="dg-s" x="654" y="147" text-anchor="middle">guardrails</text>

            <rect class="dg-box g" x="208" y="48" width="122" height="40" rx="8" />
            <text class="dg-s" x="269" y="66" text-anchor="middle">Read actions</text>
            <text class="dg-s" x="269" y="80" text-anchor="middle">search · SQL · web</text>
            <rect class="dg-box" x="346" y="48" width="96" height="40" rx="8" />
            <text class="dg-s" x="394" y="66" text-anchor="middle">Databases</text>
            <text class="dg-s" x="394" y="80" text-anchor="middle">docs · tables</text>
            <rect class="dg-box r" x="150" y="180" width="292" height="32" rx="8" />
            <text class="dg-s" x="296" y="200" text-anchor="middle">Write actions — mail, orders, payments (gated)</text>

            <path class="dg-line" d="M104 134 H116" marker-end="url(#ah-full)" />
            <path class="dg-line" d="M192 134 H204" marker-end="url(#ah-full)" />
            <path class="dg-line" d="M330 134 H342" marker-end="url(#ah-full)" />
            <path class="dg-line" d="M442 134 H454" marker-end="url(#ah-full)" />
            <path class="dg-line" d="M590 134 H602" marker-end="url(#ah-full)" />
            <path class="dg-line dash" d="M269 112 V92" marker-end="url(#ah-full)" />
            <path class="dg-line dash" d="M330 68 H342" marker-end="url(#ah-full)" />
            <path class="dg-line hot" d="M654 156 V196 H446" marker-end="url(#ah-full)" />
            <path class="dg-line hot" d="M602 176 H470 V172" marker-end="url(#ah-full)" />
            <text class="dg-s" x="524" y="190" text-anchor="middle">loop back</text>
          </svg>
          <figcaption>Figure 8 — The platform with every component in place. The orange arrows are what make it agentic: results can re-enter the pipeline instead of going straight to the user.</figcaption>
        </figure>
        <p>Loops introduce failure modes that linear pipelines simply do not have, so add controls with them, not later: a hard step ceiling, a per-request token and cost budget, a wall-clock timeout, and duplicate detection so the system does not repeat an identical call forever. Also remember that each pass through the loop is a fresh chance for a guardrail to fire — intermediate outputs deserve checking too, not just the final answer.</p>

        <h3 class="lesson-subhead" id="step5-write">Write actions</h3>
        <p>Every action so far has been read-only: it collects information, it changes nothing. Write actions change state — the system emits "email this person with this message" and something actually sends it.</p>
        <p>This is where the platform becomes genuinely valuable and genuinely dangerous. A full outreach workflow becomes possible: research prospects, find contact details, draft messages, send them, read replies, extract orders, update records. Nobody automates that chain for fun; they automate it because it replaces a week of manual work.</p>
        <p>The reason to be careful is not squeamishness, it is proportionality. You would not give a first-week intern permission to drop production tables. An unreliable model should not be initiating payments. Between "no writes ever" and "full autonomy" sits the permission ladder from the previous lesson, and most production systems live on its middle rungs indefinitely.</p>
        <p>Beyond ordinary software vulnerabilities, these systems carry one specific to them: <strong>prompt injection</strong>. An attacker plants instructions in content your system will read — a web page, a support ticket, a PDF, a code comment — and the model treats them as directions. It is social engineering aimed at software instead of staff. The nightmare version is an internal-database-connected assistant tricked into revealing records; the worse version is one with write access tricked into corrupting them.</p>
        <ul class="lesson-checklist">
          <li>Treat everything retrieved as untrusted <em>data</em>, never as instructions.</li>
          <li>Separate the component that reads untrusted content from the one holding write credentials.</li>
          <li>Require human approval for anything irreversible, and make approval an explicit, logged event.</li>
          <li>Enforce permissions at the API, with scoped credentials — never through prompt wording.</li>
          <li>Make writes idempotent so a retry cannot double-send or double-charge.</li>
          <li>Keep an audit trail that answers "which request caused this change" in one query.</li>
        </ul>
        <p>None of that argues for never letting software act. Software already flies aircraft and settles payments, because we built layered checks around it. Agentic systems fail, and so do people; the engineering question is not whether failure happens but whether you detect and reverse it quickly.</p>
      `,
    },
    {
      id: 'observability',
      title: 'Observability',
      children: [
        { id: 'obs-metrics', title: 'Metrics' },
        { id: 'obs-logs', title: 'Logs' },
        { id: 'obs-traces', title: 'Traces' },
      ],
      html: `
        <p>Observability appears near the end of this lesson for narrative reasons only. In a real project it belongs from day one, because you cannot improve what you cannot see, and by the time a system has retrieval, routing, caching and loops, "it gave a bad answer" is not a debuggable statement.</p>
        <p>The three pillars are the same as any other distributed system — metrics, logs, traces — with model-specific additions in each.</p>

        <h3 class="lesson-subhead" id="obs-metrics">Metrics</h3>
        <p>Split metrics into two groups. <strong>System metrics</strong> are the familiar ones: throughput, error rate, memory, hardware utilisation, uptime. <strong>Model metrics</strong> are the interesting half, and they are specific to your application.</p>
        <p>Start from your failure list — the one you built for output guardrails — and turn each entry into a counter: rate of empty responses, malformed responses, timeouts, toxic outputs, refusals, sensitive-data hits. If you worry about a failure, measure it; otherwise you are relying on complaints as monitoring.</p>
        <p>Different stages need their own quality metrics. Retrieval has context relevance and precision. A vector index has recall, query latency, index size and build time. A router has intent accuracy and misroute rate. A cache has hit rate — and, if it is semantic, false-hit rate.</p>
        <p><strong>Length metrics</strong> are cheap and unreasonably informative: query length, context length, response length. They tell you whether one model is more verbose than another, which request types produce essays, and — most usefully — when something has changed. A sudden drop in average query length usually means a client or prompt template changed upstream. Length also drives cost and latency, so it is the bridge between quality and money.</p>
        <p>For latency, the numbers people actually track:</p>
        <table>
          <thead><tr><th>Metric</th><th>What it tells you</th></tr></thead>
          <tbody>
            <tr><td>Time to first token</td><td>How responsive the app feels when streaming</td></tr>
            <tr><td>Time between tokens / tokens per second</td><td>Whether the stream reads smoothly</td></tr>
            <tr><td>Time per output token</td><td>Per-token generation cost in time</td></tr>
            <tr><td>Total latency</td><td>The full journey the user waited through</td></tr>
          </tbody>
        </table>
        <p>Track them as percentiles, not averages — p95 and p99 are where your unhappy users live. For cost, track request counts and input/output token volumes, and if a provider imposes rate limits, requests per second too, so you see a ceiling approaching before it starts rejecting traffic.</p>
        <p>Two habits that make metrics genuinely useful. First, decide between <strong>spot checks</strong> (sample a slice, cheap, good enough for many quality signals) and <strong>exhaustive checks</strong> (evaluate everything, expensive, necessary for hard requirements) — most teams do both, exhaustive for cheap checks and sampled for expensive judge models. Second, make every metric breakable down by user cohort, release, prompt or chain version, request type, and time. A quality drop that appeared with version 14 of a prompt is a five-minute investigation if you tagged it and a week if you did not.</p>

        <h3 class="lesson-subhead" id="obs-logs">Logs</h3>
        <p>The logging philosophy for these systems is refreshingly simple: <strong>log everything</strong>. Configuration, the incoming query, the rewritten query, retrieved chunk ids, the final assembled prompt, tool calls with their arguments, intermediate outputs, guardrail verdicts, the final response, component start and end, and every crash. Tag each record with request id, user, version and component so you can reconstruct any single interaction later.</p>
        <p>Volume grows fast, and nobody reads it all — which is why log analysis and anomaly detection are increasingly automated. But do not let automation replace one specific human habit: <strong>read a sample of real production interactions every day</strong>. Teams that do this consistently develop much sharper taste about what good and bad output looks like for their product, and that taste flows back into better prompts and better evaluation criteria. It is the highest-return half hour in the calendar.</p>
        <div class="lesson-callout lesson-warn"><strong>One caveat that overrides "log everything":</strong> logs of prompts and responses contain user data. Redact sensitive fields at write time, set retention limits, and control access — otherwise your debugging tool becomes your largest privacy liability.</div>

        <h3 class="lesson-subhead" id="obs-traces">Traces</h3>
        <p>A trace is the recorded execution path of one request through every component — the step-by-step story from query to answer, including what was retrieved, what the model was actually sent, which tools ran, how long each step took and what it cost.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Trace waterfall showing time spent in rewrite, retrieval, rerank, generation and guardrails, with the retrieval step dominating">
            <text class="dg-h" x="14" y="18">ONE REQUEST · 3.6s TOTAL</text>
            <text class="dg-s" x="14" y="44">rewrite query</text>
            <rect class="dg-box b" x="170" y="32" width="38" height="16" rx="4" />
            <text class="dg-s" x="216" y="44">120 ms</text>
            <text class="dg-s" x="14" y="72">embed + vector search</text>
            <rect class="dg-box b" x="170" y="60" width="96" height="16" rx="4" />
            <text class="dg-s" x="274" y="72">310 ms</text>
            <text class="dg-s" x="14" y="100">rerank 200 → 8 chunks</text>
            <rect class="dg-box r" x="170" y="88" width="300" height="16" rx="4" />
            <text class="dg-s" x="478" y="100">1,050 ms  ← the real problem</text>
            <text class="dg-s" x="14" y="128">generation (streamed)</text>
            <rect class="dg-box p" x="170" y="116" width="286" height="16" rx="4" />
            <text class="dg-s" x="464" y="128">1,900 ms · 1.4k tokens</text>
            <text class="dg-s" x="14" y="156">output guardrails</text>
            <rect class="dg-box o" x="170" y="144" width="44" height="16" rx="4" />
            <text class="dg-s" x="222" y="156">160 ms</text>
            <path class="dg-line dash" d="M170 26 V172" />
            <text class="dg-s" x="170" y="188">t = 0</text>
            <text class="dg-s" x="480" y="188" text-anchor="middle">Without a trace, this is just “the app feels slow”.</text>
          </svg>
          <figcaption>Figure 9 — A trace turns a vague complaint into a decision: cache the reranker, shrink its candidate set, or accept the cost.</figcaption>
        </figure>
        <p>The test of good tracing is diagnostic precision. When a request produces a bad answer, you should be able to say <em>which step</em> failed — the rewrite mangled the question, retrieval returned irrelevant passages, the prompt exceeded the window and truncated the key paragraph, or the model was given everything it needed and still got it wrong. Those four causes have four different fixes, and without traces teams routinely apply the fourth fix to the second problem.</p>
      `,
    },
    {
      id: 'orchestration',
      title: 'AI Pipeline Orchestration',
      children: [
        { id: 'orch-what', title: 'What an orchestrator does' },
        { id: 'orch-choosing', title: 'Choosing one' },
      ],
      html: `
        <h3 class="lesson-subhead" id="orch-what">What an orchestrator does</h3>
        <p>With multiple models, several data sources, guardrails, caches and tools, something has to define how the pieces fit together. That is orchestration, and it is two jobs.</p>
        <ol class="lesson-steps">
          <li><strong>Component definition.</strong> Declare what exists: generation models, routing and scoring models, retrievers and databases, and the actions the system may take. Orchestrators that integrate with your gateway make this simpler — and several orchestrators would quite like to be your gateway.</li>
          <li><strong>Chaining.</strong> Declare the sequence from request to completion. Chaining is function composition with retries, branching and observability bolted on.</li>
        </ol>
        <p>A typical chain reads much like this lesson in miniature:</p>
        <pre><code>1  normalise and validate the raw request
2  rewrite the query using conversation history
3  check the cache — return early on a hit
4  retrieve candidates, rerank, select chunks
5  assemble the prompt within the token budget
6  run input guardrails
7  route, then call the model through the gateway
8  run output guardrails; retry or fall back on failure
9  loop back to step 4 if the task is not complete
10 store in cache, emit metrics, close the trace, respond</code></pre>
        <p>Note step 5. Whatever tool you use, someone has to enforce the context budget, and it is better done by explicit code than discovered through a provider error at peak traffic.</p>

        <h3 class="lesson-subhead" id="orch-choosing">Choosing one</h3>
        <p>You can write orchestration yourself — it is ordinary application code, and for a single linear flow that is often the right answer. Frameworks earn their place when you have many chains, want to swap components without rewriting callers, and need retries, parallelism and tracing for free.</p>
        <p>Questions worth asking before adopting one:</p>
        <ul class="lesson-checklist">
          <li>Can it run steps in <strong>parallel</strong>? Serial fan-out is the most common avoidable latency bug.</li>
          <li>Are branching, loops and step limits first-class, or bolted on?</li>
          <li>Does it emit traces and metrics in a format your existing tooling understands?</li>
          <li>How hard is it to add the twentieth tool and the third model provider?</li>
          <li>Can you see the exact final prompt sent to the model? If it is hidden, you cannot debug quality.</li>
          <li>How much does it cost to leave? Deep coupling to one framework's abstractions is a real migration bill later.</li>
        </ul>
        <div class="lesson-callout"><strong>A reasonable default:</strong> start with plain code plus a gateway, add an orchestrator when you have three or more chains that share components, and keep prompt assembly visible no matter what you choose.</div>
      `,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      children: [
        { id: 'conclusion-order', title: 'The build order, condensed' },
        { id: 'conclusion-selfcheck', title: 'Self-check' },
        { id: 'conclusion-resources', title: 'Further reading' },
      ],
      html: `
        <h3 class="lesson-subhead" id="conclusion-order">The build order, condensed</h3>
        <p>The finished architecture looks complicated, but it is only ever six decisions made in response to six problems. Keep this table; it is the whole lesson.</p>
        <table>
          <thead><tr><th>#</th><th>Add</th><th>Because</th><th>New risk you own</th></tr></thead>
          <tbody>
            <tr><td>0</td><td>Query → model → response</td><td>You need real users before real answers</td><td>Nothing yet</td></tr>
            <tr><td>1</td><td>Context construction</td><td>The model does not know your data or today's facts</td><td>Retrieval quality now caps everything</td></tr>
            <tr><td>2</td><td>Guardrails, in and out</td><td>Leaks, jailbreaks, unusable output</td><td>Latency, and false blocks</td></tr>
            <tr><td>3</td><td>Router + gateway</td><td>Cost control, specialisation, access control, failover</td><td>Misrouting; one shared dependency</td></tr>
            <tr><td>4</td><td>Caches</td><td>Repeated work is pure waste</td><td>Staleness; wrong semantic hits</td></tr>
            <tr><td>5</td><td>Loops + write actions</td><td>Doing beats describing</td><td>Runaway loops; prompt injection with consequences</td></tr>
            <tr><td>∞</td><td>Observability + orchestration</td><td>You cannot fix what you cannot see or compose</td><td>Log privacy; framework lock-in</td></tr>
          </tbody>
        </table>
        <p>Two closing principles. <strong>Skip anything you do not need</strong> — an unused component still needs operating, monitoring and debugging. And <strong>evaluate continuously</strong>, because every box you add changes output quality in ways your intuition will get wrong.</p>

        <h3 class="lesson-subhead" id="conclusion-selfcheck">Self-check</h3>
        <ol>
          <li>What is context construction the equivalent of in classical machine learning?</li>
          <li>When would you choose keyword retrieval over vector retrieval?</li>
          <li>Why does "How about her sister?" break retrieval, and what fixes it?</li>
          <li>Name the two risks input guardrails address, and one mitigation for each.</li>
          <li>Why are output guardrails awkward when streaming?</li>
          <li>What is the difference between a router and a gateway?</li>
          <li>Rank prompt, exact and semantic caching by risk, and justify the order.</li>
          <li>Which controls must accompany a loop in the pipeline?</li>
          <li>A user reports a wrong answer. Which four steps could be at fault, and how would a trace tell them apart?</li>
        </ol>
        <p><strong>Sketch answers:</strong> (1) feature engineering; (2) cheap, fast, strong baseline — and when users search with the same words your documents use; (3) it is not self-contained — rewrite it against the conversation, resolving entities from data rather than guessing; (4) private data leaving (detect and mask with reversible placeholders) and hostile prompts (restrict capabilities, define scope); (5) partial output cannot be judged, so unsafe text may already be on screen; (6) the router chooses the destination per request, the gateway is the single controlled door to all providers; (7) prompt (no correctness risk) → exact (staleness only) → semantic (can answer a different question); (8) step ceiling, cost and token budget, timeout, duplicate detection, plus guardrails on intermediate outputs; (9) rewrite, retrieval, prompt assembly or truncation, generation — a trace shows the rewritten query, the retrieved chunks, the exact final prompt, and the raw output.</p>

        <h3 class="lesson-subhead" id="conclusion-resources">Further reading</h3>
        <ul>
          <li><strong>The essay this lesson parallels</strong> — Chip Huyen, <a href="https://huyenchip.com/2024/07/25/genai-platform.html" rel="noopener noreferrer" target="_blank">Building A Generative AI Platform</a> (2024). The component-by-component framing that has become the common vocabulary for this architecture.</li>
          <li><strong>Where RAG started</strong> — Lewis et al., <a href="https://arxiv.org/abs/2005.11401" rel="noopener noreferrer" target="_blank">Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks</a> (2020).</li>
          <li><strong>Why position in the context matters</strong> — Liu et al., <a href="https://arxiv.org/abs/2307.03172" rel="noopener noreferrer" target="_blank">Lost in the Middle</a> (2023).</li>
          <li><strong>Retrieval engineering</strong> — <a href="https://ann-benchmarks.com/" rel="noopener noreferrer" target="_blank">ANN Benchmarks</a> for the recall/QPS/build-time/index-size trade-offs across vector index implementations.</li>
          <li><strong>Hallucination detection</strong> — Manakul et al., <a href="https://arxiv.org/abs/2303.08896" rel="noopener noreferrer" target="_blank">SelfCheckGPT</a> (2023); Wei et al., <a href="https://arxiv.org/abs/2403.18802" rel="noopener noreferrer" target="_blank">Long-form factuality (SAFE)</a> (2024).</li>
          <li><strong>Prompt caching</strong> — Gim et al., <a href="https://arxiv.org/abs/2311.04934" rel="noopener noreferrer" target="_blank">Prompt Cache</a> (2023), plus your provider's context-caching pricing page, since the discount and storage terms decide whether it pays.</li>
          <li><strong>Security</strong> — <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" rel="noopener noreferrer" target="_blank">OWASP Top 10 for LLM Applications</a>: prompt injection, insecure output handling, excessive agency.</li>
          <li><strong>Human-in-the-loop evaluation</strong> — Shankar et al., <a href="https://arxiv.org/abs/2404.12272" rel="noopener noreferrer" target="_blank">Who Validates the Validators?</a> (2024), on how developers' quality criteria shift as they inspect real outputs.</li>
          <li><strong>Operational foundations</strong> — Chip Huyen, <em>Designing Machine Learning Systems</em> for logging and monitoring practice that predates and still applies to LLM systems.</li>
          <li><strong>Previous lesson</strong> — <a href="/learn/agentic-ai/agents">Agents</a>, for the planning, tool-selection and failure-mode material that Step 5 depends on.</li>
        </ul>
        <p class="lesson-flow">Next in this track: memory systems · evaluation harnesses · multi-agent orchestration · cost and latency engineering</p>
      `,
    },
  ],
  sourceNote:
    'Original lesson written for BinodTech. The step-by-step structure follows the widely used framing popularised by Chip Huyen in <a href="https://huyenchip.com/2024/07/25/genai-platform.html" rel="noopener noreferrer" target="_blank">Building A Generative AI Platform</a> (2024); all explanations, diagrams, tables and exercises here are our own, and the linked sources are credited where their ideas appear.',
};
