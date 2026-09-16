/** Full lesson: Agentic AI — the complete roadmap from beginner to master.
 *  Built from Binod's 15-stage roadmap outline, expanded with pacing guidance,
 *  checkpoints, project rubrics and colour-coded flow diagrams for every phase.
 */

export type LessonSubsection = { id: string; title: string };

export type LessonSection = {
  id: string;
  title: string;
  html: string;
  children?: LessonSubsection[];
};

export const agenticAiRoadmap = {
  slug: 'roadmap',
  title: 'Agentic AI Roadmap: From Beginner to Master',
  subtitle:
    'The full path in 15 stages — computer fundamentals, Python, data, machine learning, deep learning, transformers, LLM application engineering, RAG, agents, frameworks, MCP, multi-agent systems, automation, evaluation and production. With pacing, checkpoints, a 10-project ladder and a shortcut for people who only want agents.',
  byline: 'Agentic AI track · Start here · ~2h 45m read · Beginner to Advanced',
  interviewTip:
    'The single question that separates a hobbyist from a hireable agent engineer: "what happens when your agent calls the wrong tool at step 4 of 9?" Everything in Phase 5 — retries, idempotency, checkpoints, trajectory evaluation, human approval gates — exists to answer that. Learn the stages in order and you will be able to.',
  sections: [
    {
      id: 'start',
      title: 'How to Use This Roadmap',
      children: [
        { id: 'start-wrong', title: 'The wrong way to start' },
        { id: 'start-line', title: 'The whole journey in one line' },
        { id: 'start-phases', title: 'Five phases, fifteen stages' },
        { id: 'start-pace', title: 'How long this actually takes' },
        { id: 'start-rules', title: 'Six rules that keep you moving' },
      ],
      html: `
        <p>If you are entering AI or Agentic AI as a beginner, my advice is blunt: <strong>do not start with LangChain, MCP, multi-agent frameworks, or a "build an AI agent in 10 minutes" tutorial.</strong> You will get something working, you will not understand why it works, and the first time it breaks in production you will have no model of the system in your head to debug with.</p>
        <p>There is a natural order to this material, and each step makes the next one easier:</p>
        <p class="lesson-flow">Programming → Data → ML → Deep Learning → Transformers/LLMs → LLM Application Engineering → RAG/Tools → Agents → Multi-Agent Systems → Automation → Production AI</p>

        <h3 class="lesson-subhead" id="start-wrong">The wrong way to start</h3>
        <p>The most common 2026 beginner path looks like this: watch an agent tutorial, copy a framework example, swap in your own API key, get a demo working in an afternoon, then spend six months stuck. Stuck, specifically, because you cannot answer questions like: why did retrieval return the wrong chunk, why is the agent picking the wrong tool, why does the same input produce a different answer, why does this cost $2 per request, and how do I prove any change made it better?</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Comparison of the shortcut path that stalls against the staged path that compounds">
            <defs>
              <marker id="ah-w1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-w2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="24" width="696" height="76" rx="12" />
            <text class="dg-h" x="26" y="44">THE SHORTCUT — fast demo, then a wall</text>
            <rect class="dg-box r" x="26" y="52" width="110" height="34" rx="7" />
            <text class="dg-s" x="81" y="73" text-anchor="middle">tutorial</text>
            <rect class="dg-box r" x="166" y="52" width="110" height="34" rx="7" />
            <text class="dg-s" x="221" y="73" text-anchor="middle">framework demo</text>
            <rect class="dg-box r" x="306" y="52" width="110" height="34" rx="7" />
            <text class="dg-s" x="361" y="73" text-anchor="middle">it works!</text>
            <rect class="dg-box" x="446" y="52" width="248" height="34" rx="7" />
            <text class="dg-s" x="570" y="66" text-anchor="middle">…it breaks and you cannot debug it</text>
            <text class="dg-s" x="570" y="79" text-anchor="middle">no mental model to fall back on</text>
            <path class="dg-line rose" d="M136 69 H162" marker-end="url(#ah-w1)" />
            <path class="dg-line rose" d="M276 69 H302" marker-end="url(#ah-w1)" />
            <path class="dg-line rose" d="M416 69 H442" marker-end="url(#ah-w1)" />

            <rect class="dg-band g" x="12" y="116" width="696" height="88" rx="12" />
            <text class="dg-h" x="26" y="136">THE STAGED PATH — slower start, no ceiling</text>
            <rect class="dg-box g" x="26" y="144" width="96" height="44" rx="7" />
            <text class="dg-s" x="74" y="163" text-anchor="middle">Python</text>
            <text class="dg-s" x="74" y="177" text-anchor="middle">+ data</text>
            <rect class="dg-box c" x="142" y="144" width="96" height="44" rx="7" />
            <text class="dg-s" x="190" y="163" text-anchor="middle">ML + DL</text>
            <text class="dg-s" x="190" y="177" text-anchor="middle">intuition</text>
            <rect class="dg-box b" x="258" y="144" width="96" height="44" rx="7" />
            <text class="dg-s" x="306" y="163" text-anchor="middle">LLMs +</text>
            <text class="dg-s" x="306" y="177" text-anchor="middle">prompting</text>
            <rect class="dg-box i" x="374" y="144" width="96" height="44" rx="7" />
            <text class="dg-s" x="422" y="163" text-anchor="middle">RAG +</text>
            <text class="dg-s" x="422" y="177" text-anchor="middle">tools</text>
            <rect class="dg-box p" x="490" y="144" width="96" height="44" rx="7" />
            <text class="dg-s" x="538" y="163" text-anchor="middle">agents +</text>
            <text class="dg-s" x="538" y="177" text-anchor="middle">MCP</text>
            <rect class="dg-box o" x="606" y="144" width="88" height="44" rx="7" />
            <text class="dg-s" x="650" y="163" text-anchor="middle">production</text>
            <text class="dg-s" x="650" y="177" text-anchor="middle">+ evals</text>
            <path class="dg-line green" d="M122 166 H138" marker-end="url(#ah-w2)" />
            <path class="dg-line green" d="M238 166 H254" marker-end="url(#ah-w2)" />
            <path class="dg-line green" d="M354 166 H370" marker-end="url(#ah-w2)" />
            <path class="dg-line green" d="M470 166 H486" marker-end="url(#ah-w2)" />
            <path class="dg-line green" d="M586 166 H602" marker-end="url(#ah-w2)" />
          </svg>
          <figcaption>Figure 1 — Both paths reach a working demo. Only one of them reaches a system you can operate, debug and improve.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="start-line">The whole journey in one line</h3>
        <p>Here is the framing I want you to keep for the next year of study, because it explains <em>why</em> the order is what it is:</p>
        <blockquote>
          <p>Do not learn AI as a collection of technologies. Learn it as a progression: <strong>understanding intelligence → building AI applications → giving AI tools → giving AI autonomy → orchestrating multiple agents → operating them reliably in production.</strong></p>
        </blockquote>
        <p>Every stage below is one step along that sentence. When you feel lost, come back and ask which clause you are currently in.</p>

        <h3 class="lesson-subhead" id="start-phases">Five phases, fifteen stages</h3>
        <p>Fifteen stages is a lot to hold in your head, so they are grouped into five phases. Each phase ends with a checkpoint you can honestly self-assess.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 300" role="img" aria-label="The five phases of the roadmap with their constituent stages and the capability unlocked by each">
            <defs>
              <marker id="ah-ph" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path class="dg-ah violet" d="M0 0 L10 4 L0 8 z" /></marker>
            </defs>
            <rect class="dg-band g" x="12" y="16" width="696" height="46" rx="10" />
            <rect class="dg-pill" x="24" y="28" width="66" height="22" rx="11" />
            <text class="dg-pill-t" x="57" y="43" text-anchor="middle">PHASE 1</text>
            <text class="dg-t" x="102" y="37">Foundations</text>
            <text class="dg-s" x="102" y="52">Stage 0 prerequisites · Stage 1 data + maths</text>
            <text class="dg-s" x="696" y="37" text-anchor="end">unlocks: you can write real programs</text>
            <text class="dg-s" x="696" y="52" text-anchor="end">and reason about data</text>

            <rect class="dg-band c" x="12" y="72" width="696" height="46" rx="10" />
            <rect class="dg-pill" x="24" y="84" width="66" height="22" rx="11" />
            <text class="dg-pill-t" x="57" y="99" text-anchor="middle">PHASE 2</text>
            <text class="dg-t" x="102" y="93">Machine Learning &amp; Deep Learning</text>
            <text class="dg-s" x="102" y="108">Stage 2 classical ML · Stage 3 neural networks</text>
            <text class="dg-s" x="696" y="93" text-anchor="end">unlocks: you know when AI is</text>
            <text class="dg-s" x="696" y="108" text-anchor="end">the wrong tool</text>

            <rect class="dg-band b" x="12" y="128" width="696" height="46" rx="10" />
            <rect class="dg-pill" x="24" y="140" width="66" height="22" rx="11" />
            <text class="dg-pill-t" x="57" y="155" text-anchor="middle">PHASE 3</text>
            <text class="dg-t" x="102" y="149">Transformers, LLMs &amp; Applications</text>
            <text class="dg-s" x="102" y="164">Stage 4 transformers · Stage 5 LLM apps · Stage 6 RAG</text>
            <text class="dg-s" x="696" y="149" text-anchor="end">unlocks: you can ship a real</text>
            <text class="dg-s" x="696" y="164" text-anchor="end">LLM product</text>

            <rect class="dg-band p" x="12" y="184" width="696" height="46" rx="10" />
            <rect class="dg-pill" x="24" y="196" width="66" height="22" rx="11" />
            <text class="dg-pill-t" x="57" y="211" text-anchor="middle">PHASE 4</text>
            <text class="dg-t" x="102" y="205">Agents &amp; Multi-Agent Systems</text>
            <text class="dg-s" x="102" y="220">Stages 7–11 agents · frameworks · MCP · multi-agent · automation</text>
            <text class="dg-s" x="696" y="205" text-anchor="end">unlocks: software that acts,</text>
            <text class="dg-s" x="696" y="220" text-anchor="end">not just answers</text>

            <rect class="dg-band o" x="12" y="240" width="696" height="46" rx="10" />
            <rect class="dg-pill" x="24" y="252" width="66" height="22" rx="11" />
            <text class="dg-pill-t" x="57" y="267" text-anchor="middle">PHASE 5</text>
            <text class="dg-t" x="102" y="261">Production, Evaluation &amp; Deployment</text>
            <text class="dg-s" x="102" y="276">Stage 12 reliability · Stage 13 evals · Stage 14 deploy</text>
            <text class="dg-s" x="696" y="261" text-anchor="end">unlocks: employability —</text>
            <text class="dg-s" x="696" y="276" text-anchor="end">this is the real job</text>

            <path class="dg-line violet thick" d="M6 62 V282" marker-end="url(#ah-ph)" opacity="0.65" />
          </svg>
          <figcaption>Figure 2 — Five phases. Most self-taught learners stop at the end of Phase 4; the people who get hired and stay hired are the ones who finish Phase 5.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="start-pace">How long this actually takes</h3>
        <p>Honest numbers, assuming roughly 10 to 15 focused hours a week. Halve them if you already write software professionally.</p>
        <table>
          <thead><tr><th>Phase</th><th>Complete beginner</th><th>Working software engineer</th><th>What you must not skip</th></tr></thead>
          <tbody>
            <tr><td>1 · Foundations</td><td>3–5 months</td><td>2–4 weeks</td><td>Python fluency, Git, HTTP/JSON, SQL</td></tr>
            <tr><td>2 · ML &amp; DL</td><td>3–4 months</td><td>4–6 weeks</td><td>Overfitting, evaluation metrics, backprop intuition</td></tr>
            <tr><td>3 · Transformers → RAG</td><td>2–3 months</td><td>4–6 weeks</td><td>Attention, tokens/context, embeddings, retrieval quality</td></tr>
            <tr><td>4 · Agents → automation</td><td>2–3 months</td><td>4–8 weeks</td><td>The agent loop by hand before any framework</td></tr>
            <tr><td>5 · Production &amp; evals</td><td>2–3 months</td><td>6–10 weeks</td><td>Evaluation harness, observability, security</td></tr>
          </tbody>
        </table>
        <p>So: roughly a year of consistent effort from zero, or three to five months if you are already an engineer. Anyone promising "agentic AI in 30 days" is selling you Phase 4 with none of the foundation that makes it stick.</p>

        <h3 class="lesson-subhead" id="start-rules">Six rules that keep you moving</h3>
        <ol class="lesson-steps">
          <li><strong>Build at every stage.</strong> Reading about a stage does not count as finishing it. Every stage below has a build item; that is the deliverable.</li>
          <li><strong>Learn the maths alongside the thing that uses it,</strong> not before. You do not need to become a mathematician to start.</li>
          <li><strong>No tutorial-following without a variation.</strong> Finish the tutorial, then change the dataset, the tool, or the goal. The variation is where learning happens.</li>
          <li><strong>Concepts before frameworks, always.</strong> Frameworks change every six months; state, tools, routing, retries and checkpoints do not.</li>
          <li><strong>Write down what broke.</strong> Keep a running failure log from Stage 5 onwards — it becomes your evaluation set in Stage 13.</li>
          <li><strong>You do not need to master a stage before advancing.</strong> Competent is enough. Perfectionism at Stage 2 is the most common reason people never reach Stage 7.</li>
        </ol>
        <div class="rm-goal rm-skip">In a hurry and specifically targeting agents? Read the pacing table above, then jump to <em>The Shortcut — Three Parallel Tracks</em> near the end. It tells you exactly which parts of Phases 1–3 you can defer and which you genuinely cannot.</div>
      `,
    },
    {
      id: 'phase-1',
      title: 'Phase 1 — Foundations',
      children: [
        { id: 's0', title: 'Stage 0 · Prerequisites' },
        { id: 's0-computer', title: 'Computer fundamentals' },
        { id: 's0-python', title: 'Programming fundamentals: Python' },
        { id: 's0-problem', title: 'Problem solving' },
        { id: 's1', title: 'Stage 1 · Data fundamentals' },
        { id: 's1-math', title: 'The maths you actually need' },
        { id: 'p1-check', title: 'Phase 1 checkpoint' },
      ],
      html: `
        <div class="rm-phase" style="--rm-a:#059669;--rm-b:#0891b2">
          <div class="rm-phase-k">Phase 1 · Stages 0–1</div>
          <div class="rm-phase-t">Foundations — computers, Python, data and just enough maths</div>
          <div class="rm-phase-d">Nothing here is AI, and everything here is load-bearing. An agent is a program that calls APIs, parses JSON, handles errors and runs in a container. If those words are shaky, agents will feel like magic instead of engineering.</div>
        </div>

        <h3 class="lesson-subhead" id="s0">Stage 0 · Prerequisites</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Stage zero flow from computer fundamentals through Python to problem solving">
            <defs>
              <marker id="ah-s0" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box" x="16" y="62" width="112" height="48" rx="9" />
            <text class="dg-t" x="72" y="82" text-anchor="middle">Beginner</text>
            <text class="dg-s" x="72" y="98" text-anchor="middle">day zero</text>
            <rect class="dg-box c" x="160" y="52" width="152" height="68" rx="9" />
            <text class="dg-t" x="236" y="72" text-anchor="middle">Computer fundamentals</text>
            <text class="dg-s" x="236" y="88" text-anchor="middle">CPU · memory · storage · OS</text>
            <text class="dg-s" x="236" y="102" text-anchor="middle">files · processes · HTTP · JSON</text>
            <text class="dg-s" x="236" y="115" text-anchor="middle">Git · GitHub · Linux terminal</text>
            <rect class="dg-box g" x="344" y="52" width="152" height="68" rx="9" />
            <text class="dg-t" x="420" y="72" text-anchor="middle">Python</text>
            <text class="dg-s" x="420" y="88" text-anchor="middle">types · loops · functions</text>
            <text class="dg-s" x="420" y="102" text-anchor="middle">OOP · errors · packages · venv</text>
            <text class="dg-s" x="420" y="115" text-anchor="middle">files · REST calls · async</text>
            <rect class="dg-box l" x="528" y="52" width="176" height="68" rx="9" />
            <text class="dg-t" x="616" y="72" text-anchor="middle">Problem solving</text>
            <text class="dg-s" x="616" y="88" text-anchor="middle">Big-O · arrays · strings · hashmap</text>
            <text class="dg-s" x="616" y="102" text-anchor="middle">stack · queue · trees basics</text>
            <text class="dg-s" x="616" y="115" text-anchor="middle">search · sort · recursion</text>
            <path class="dg-line green" d="M128 86 H156" marker-end="url(#ah-s0)" />
            <path class="dg-line green" d="M312 86 H340" marker-end="url(#ah-s0)" />
            <path class="dg-line green" d="M496 86 H524" marker-end="url(#ah-s0)" />
            <text class="dg-h" x="16" y="34">STAGE 0 — BEFORE ANY AI</text>
            <text class="dg-s" x="16" y="150">Goal: build a small Python application without following a tutorial line by line.</text>
            <text class="dg-s" x="16" y="166">Agent-relevant bonus: HTTP, JSON and async are literally what tool calling is made of.</text>
          </svg>
          <figcaption>Figure 3 — Stage 0. The three blocks are sequential in emphasis but overlapping in practice: keep using Git from week one rather than "learning Git" as a separate module.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s0-computer">Computer fundamentals</h4>
        <p>You need a working mental model of the machine your code runs on: how a computer works, the roles of CPU, memory and storage, what an operating system does, how files and processes behave, and — most relevant later — how HTTP and APIs work and what JSON is. Add Git and GitHub, plus enough Linux and terminal to move around confidently.</p>
        <ul class="rm-chips">
          <li class="c">CPU / memory / storage</li>
          <li class="c">operating systems</li>
          <li class="c">files &amp; processes</li>
          <li class="b">HTTP</li>
          <li class="b">REST APIs</li>
          <li class="b">JSON</li>
          <li class="g">Git</li>
          <li class="g">GitHub</li>
          <li class="y">Linux / terminal</li>
        </ul>
        <p>Why this matters for agents specifically: a tool call is an HTTP request with a JSON body, an agent trace is a log stream, and every deployment you make later is a process in a container. Beginners who skip this layer end up unable to tell a model problem from a networking problem.</p>

        <h4 class="lesson-subhead4" id="s0-python">Programming fundamentals: Python</h4>
        <p>Pick Python and go deep rather than sampling three languages. Cover variables and data types, conditionals and loops, functions, lists/dictionaries/sets, classes and OOP, exceptions, modules and packages, virtual environments, file handling, calling REST APIs, and the basics of async programming.</p>
        <ul class="rm-grid">
          <li style="--rm:#16a34a"><span class="rm-k">Core</span><span class="rm-n">Language mechanics</span><span class="rm-d">Types, control flow, functions, comprehensions, the collection types and when each is the right one.</span></li>
          <li style="--rm:#0891b2"><span class="rm-k">Structure</span><span class="rm-n">Classes, modules, packages</span><span class="rm-d">OOP well enough to read library code, plus imports, packaging and virtual environments per project.</span></li>
          <li style="--rm:#d97706"><span class="rm-k">Robustness</span><span class="rm-n">Exceptions and files</span><span class="rm-d">try/except/finally, custom exceptions, context managers, reading and writing files safely.</span></li>
          <li style="--rm:#7c3aed"><span class="rm-k">Networked</span><span class="rm-n">REST calls and async</span><span class="rm-d">requests/httpx, status codes, retries, timeouts, then async/await and concurrent calls — the exact shape of LLM and tool calls.</span></li>
        </ul>
        <p>Two additions I would make for 2026, because they pay off from Stage 5 onward: <strong>type hints</strong> (they make structured LLM output and validation far easier) and <strong>Pydantic</strong>, which is how most modern Python code defines the schemas that tool calling and structured output depend on.</p>

        <h4 class="lesson-subhead4" id="s0-problem">Problem solving</h4>
        <p>Enough to think clearly, not enough to win contests: Big-O basics, arrays and strings, hash maps, stacks and queues, tree basics, searching and sorting, and simple recursion. Hash maps and recursion carry the most weight later — the first because caching and deduplication are everywhere, the second because agent loops and tree-structured plans are recursive by nature.</p>
        <div class="rm-goal">Stage 0 goal: you can build a small Python application — say, a CLI that calls a public API, handles failures, and saves results to a file — without following a tutorial line by line.</div>

        <h3 class="lesson-subhead" id="s1">Stage 1 · Data fundamentals</h3>
        <p>AI is data work before it is model work. This stage is what lets you look at a dataset, or later a log of agent traces, and actually see what is going on.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Stage one flow: Python to data handling to statistics to linear algebra to calculus">
            <defs>
              <marker id="ah-s1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band c" x="12" y="20" width="696" height="128" rx="12" />
            <text class="dg-h" x="26" y="40">STAGE 1 — DATA + THE MATHS THAT SUPPORTS IT</text>
            <rect class="dg-box g" x="26" y="52" width="120" height="80" rx="9" />
            <text class="dg-t" x="86" y="72" text-anchor="middle">Data handling</text>
            <text class="dg-s" x="86" y="89" text-anchor="middle">NumPy · Pandas</text>
            <text class="dg-s" x="86" y="103" text-anchor="middle">Matplotlib · SQL</text>
            <text class="dg-s" x="86" y="117" text-anchor="middle">CSV / JSON · cleaning</text>
            <rect class="dg-box b" x="184" y="52" width="132" height="80" rx="9" />
            <text class="dg-t" x="250" y="72" text-anchor="middle">Statistics</text>
            <text class="dg-s" x="250" y="89" text-anchor="middle">mean · median · variance</text>
            <text class="dg-s" x="250" y="103" text-anchor="middle">probability · distributions</text>
            <text class="dg-s" x="250" y="117" text-anchor="middle">correlation · sampling · Bayes</text>
            <rect class="dg-box i" x="354" y="52" width="132" height="80" rx="9" />
            <text class="dg-t" x="420" y="72" text-anchor="middle">Linear algebra</text>
            <text class="dg-s" x="420" y="89" text-anchor="middle">vectors · matrices</text>
            <text class="dg-s" x="420" y="103" text-anchor="middle">matmul · dot product</text>
            <text class="dg-s" x="420" y="117" text-anchor="middle">transpose · eigen (idea only)</text>
            <rect class="dg-box p" x="524" y="52" width="170" height="80" rx="9" />
            <text class="dg-t" x="609" y="72" text-anchor="middle">Calculus</text>
            <text class="dg-s" x="609" y="89" text-anchor="middle">functions · derivatives</text>
            <text class="dg-s" x="609" y="103" text-anchor="middle">gradients · partials</text>
            <text class="dg-s" x="609" y="117" text-anchor="middle">chain rule</text>
            <path class="dg-line cyan" d="M146 92 H180" marker-end="url(#ah-s1)" />
            <path class="dg-line cyan" d="M316 92 H350" marker-end="url(#ah-s1)" />
            <path class="dg-line cyan" d="M486 92 H520" marker-end="url(#ah-s1)" />
            <text class="dg-s" x="26" y="172">Where each one pays off later:</text>
            <text class="dg-s" x="26" y="188">Pandas → eval analysis · statistics → A/B tests &amp; judge agreement · vectors → embeddings · gradients → training</text>
          </svg>
          <figcaption>Figure 4 — Stage 1. Each block has a direct downstream use, shown at the bottom. Learn each one <em>because</em> of that use, not for its own sake.</figcaption>
        </figure>
        <p><strong>Data handling.</strong> NumPy, Pandas, Matplotlib and SQL, plus the everyday realities: CSV and JSON, data cleaning, transformation and visualisation. SQL deserves emphasis — enterprise agents spend much of their time querying databases, and text-to-SQL is still one of the highest-value applications.</p>
        <ul class="rm-chips">
          <li class="g">NumPy</li>
          <li class="g">Pandas</li>
          <li class="g">Matplotlib</li>
          <li class="b">SQL</li>
          <li class="b">joins &amp; aggregation</li>
          <li class="y">CSV / JSON</li>
          <li class="o">data cleaning</li>
          <li class="o">transformation</li>
          <li class="p">visualisation</li>
        </ul>

        <h4 class="lesson-subhead4" id="s1-math">The maths you actually need</h4>
        <p>Learn only the mathematics AI actually uses, in this order of priority:</p>
        <ul class="lesson-layers">
          <li><strong>Statistics and probability</strong> — mean, median, mode, variance and standard deviation, probability and conditional probability, distributions, correlation, sampling, hypothesis testing, Bayes' theorem. This is the most immediately useful block: it is how you read an evaluation result and decide whether a change was real or noise.</li>
          <li><strong>Linear algebra</strong> — vectors, matrices, matrix multiplication, dot product, transpose, and a conceptual grasp of eigenvalues and eigenvectors. Cosine similarity in Stage 6 is a dot product; embeddings are vectors. That is the payoff.</li>
          <li><strong>Calculus</strong> — functions, derivatives, gradients, partial derivatives, the chain rule. You need this exactly once, to understand backpropagation in Stage 3, and then almost never again in application work.</li>
        </ul>
        <p>You do not need to become a mathematician before starting AI. Learn the mathematics <strong>alongside the concepts that use it</strong> — when a loss function stops going down, that is the moment gradients become interesting and memorable.</p>
        <div class="rm-goal">Stage 1 goal: given a messy CSV and a question, you can load it, clean it, query or group it, plot the answer, and say whether the difference you are seeing is meaningful.</div>

        <h4 class="lesson-subhead4" id="p1-check">Phase 1 checkpoint</h4>
        <ul class="lesson-checklist">
          <li>You can write a 200-line Python program with classes, error handling and a virtual environment.</li>
          <li>You can call a REST API, handle a timeout, retry, and parse the JSON response.</li>
          <li>You can use Git branches and open a pull request without looking up commands.</li>
          <li>You can write a SQL query with a join and an aggregate.</li>
          <li>You can explain variance, correlation and Bayes' theorem in plain language.</li>
          <li>You know what a vector and a dot product are, and why cosine similarity measures closeness.</li>
        </ul>
      `,
    },
    {
      id: 'phase-2',
      title: 'Phase 2 — Machine Learning & Deep Learning',
      children: [
        { id: 's2', title: 'Stage 2 · Machine learning fundamentals' },
        { id: 's2-concepts', title: 'The concepts that matter most' },
        { id: 's2-eval', title: 'Model evaluation' },
        { id: 's3', title: 'Stage 3 · Deep learning' },
        { id: 's3-arch', title: 'Architectures and PyTorch' },
        { id: 'p2-check', title: 'Phase 2 checkpoint' },
      ],
      html: `
        <div class="rm-phase" style="--rm-a:#0891b2;--rm-b:#4f46e5">
          <div class="rm-phase-k">Phase 2 · Stages 2–3</div>
          <div class="rm-phase-t">Machine learning and deep learning — the intuition an LLM cannot give you</div>
          <div class="rm-phase-d">This is the phase agent-only learners skip, and it is why they cannot tell when generative AI is the wrong tool. Classical ML teaches you evaluation discipline; deep learning teaches you what a model actually is. Both make everything after Stage 4 feel obvious instead of mystical.</div>
        </div>

        <h3 class="lesson-subhead" id="s2">Stage 2 · Machine learning fundamentals</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Stage two structure: supervised and unsupervised learning feeding core concepts, evaluation and projects">
            <defs>
              <marker id="ah-s2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box c" x="16" y="96" width="118" height="52" rx="9" />
            <text class="dg-t" x="75" y="117" text-anchor="middle">Data + maths</text>
            <text class="dg-s" x="75" y="133" text-anchor="middle">from Phase 1</text>

            <rect class="dg-box g" x="172" y="26" width="176" height="76" rx="9" />
            <text class="dg-t" x="260" y="46" text-anchor="middle">Supervised learning</text>
            <text class="dg-s" x="260" y="63" text-anchor="middle">linear · logistic regression</text>
            <text class="dg-s" x="260" y="77" text-anchor="middle">decision tree · random forest</text>
            <text class="dg-s" x="260" y="91" text-anchor="middle">gradient boosting · XGBoost</text>

            <rect class="dg-box p" x="172" y="118" width="176" height="62" rx="9" />
            <text class="dg-t" x="260" y="138" text-anchor="middle">Unsupervised learning</text>
            <text class="dg-s" x="260" y="155" text-anchor="middle">clustering · K-Means</text>
            <text class="dg-s" x="260" y="169" text-anchor="middle">dimensionality reduction · PCA</text>

            <rect class="dg-box b" x="386" y="26" width="152" height="90" rx="9" />
            <text class="dg-t" x="462" y="46" text-anchor="middle">Core concepts</text>
            <text class="dg-s" x="462" y="63" text-anchor="middle">features · labels</text>
            <text class="dg-s" x="462" y="77" text-anchor="middle">train / validate / test</text>
            <text class="dg-s" x="462" y="91" text-anchor="middle">over- &amp; underfitting</text>
            <text class="dg-s" x="462" y="105" text-anchor="middle">bias vs variance · leakage</text>

            <rect class="dg-box y" x="386" y="128" width="152" height="76" rx="9" />
            <text class="dg-t" x="462" y="148" text-anchor="middle">Evaluation</text>
            <text class="dg-s" x="462" y="165" text-anchor="middle">accuracy · precision</text>
            <text class="dg-s" x="462" y="179" text-anchor="middle">recall · F1 · ROC-AUC</text>
            <text class="dg-s" x="462" y="193" text-anchor="middle">confusion matrix</text>

            <rect class="dg-box o" x="576" y="70" width="128" height="110" rx="9" />
            <text class="dg-t" x="640" y="90" text-anchor="middle">Build 4 projects</text>
            <text class="dg-s" x="640" y="109" text-anchor="middle">house prices</text>
            <text class="dg-s" x="640" y="126" text-anchor="middle">customer churn</text>
            <text class="dg-s" x="640" y="143" text-anchor="middle">fraud detection</text>
            <text class="dg-s" x="640" y="160" text-anchor="middle">recommender</text>

            <path class="dg-line blue" d="M134 112 H168" marker-end="url(#ah-s2)" />
            <path class="dg-line blue" d="M134 122 H152 V148 H168" marker-end="url(#ah-s2)" />
            <path class="dg-line blue" d="M348 64 H382" marker-end="url(#ah-s2)" />
            <path class="dg-line blue" d="M348 148 H366 V166 H382" marker-end="url(#ah-s2)" />
            <path class="dg-line blue" d="M538 71 H556 V120 H572" marker-end="url(#ah-s2)" />
            <path class="dg-line blue" d="M538 166 H556 V130 H572" marker-end="url(#ah-s2)" />
            <text class="dg-s" x="16" y="228">Classical ML is where you learn that a number without a baseline and a test set means nothing.</text>
            <text class="dg-s" x="16" y="244">That habit is what makes you good at LLM evaluation in Stage 13.</text>
          </svg>
          <figcaption>Figure 5 — Stage 2. Notice that concepts and evaluation sit downstream of both algorithm families: the algorithms are interchangeable, the discipline is not.</figcaption>
        </figure>
        <p><strong>Supervised learning</strong> — linear regression, logistic regression, decision trees, random forests, gradient boosting and XGBoost. <strong>Unsupervised learning</strong> — clustering, K-Means, dimensionality reduction and PCA. You do not need to implement these from scratch; you need to know what each assumes, what it is good at, and how to read its errors.</p>

        <h4 class="lesson-subhead4" id="s2-concepts">The concepts that matter most</h4>
        <p>Understand these deeply, because every single one reappears in LLM and agent work under a different name:</p>
        <table>
          <thead><tr><th>Concept</th><th>Where it reappears in agentic AI</th></tr></thead>
          <tbody>
            <tr><td>Features and labels</td><td>Prompt inputs and expected outputs in your eval set</td></tr>
            <tr><td>Train / validation / test split</td><td>Dev set for prompt iteration vs held-out set for honest scores</td></tr>
            <tr><td>Overfitting</td><td>Prompts tuned so tightly to 20 examples that they fail on the 21st</td></tr>
            <tr><td>Underfitting</td><td>A prompt too vague to constrain the model at all</td></tr>
            <tr><td>Bias vs variance</td><td>Systematic wrongness vs run-to-run inconsistency at temperature &gt; 0</td></tr>
            <tr><td>Feature engineering</td><td>Context construction — what you retrieve and how you format it</td></tr>
            <tr><td>Data leakage</td><td>Benchmark contamination, and answers leaking into your test prompts</td></tr>
            <tr><td>Cross-validation</td><td>Multiple runs and seeds before believing a small improvement</td></tr>
          </tbody>
        </table>

        <h4 class="lesson-subhead4" id="s2-eval">Model evaluation</h4>
        <p>Accuracy, precision, recall, F1, ROC-AUC, the confusion matrix, and the regression metrics (MAE, RMSE, R²). Precision versus recall is the most transferable idea in the whole stage: a guardrail that blocks too much and a guardrail that lets bad content through are the same trade-off, and you will be tuning it for the rest of your career.</p>
        <div class="rm-goal rm-build">Build, in order: <strong>house price prediction → customer churn → fraud detection → a recommendation system.</strong> Each adds one difficulty: regression, then imbalanced classes, then rare-event detection with a real precision/recall trade-off, then ranking. Write down each project's metrics and its dumb-baseline comparison.</div>

        <h3 class="lesson-subhead" id="s3">Stage 3 · Deep learning</h3>
        <p>Now the mechanics of neural networks. The goal is not to train frontier models — it is to make the inside of an LLM stop being a black box.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 244" role="img" aria-label="Deep learning stage: neural network mechanics, the training loop, architectures and build projects">
            <defs>
              <marker id="ah-s3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE TRAINING LOOP — LEARN THIS ONCE AND LLMS MAKE SENSE FOREVER</text>
            <rect class="dg-box b" x="16" y="34" width="104" height="46" rx="8" />
            <text class="dg-s" x="68" y="53" text-anchor="middle">input × weights</text>
            <text class="dg-s" x="68" y="68" text-anchor="middle">+ bias</text>
            <rect class="dg-box i" x="148" y="34" width="104" height="46" rx="8" />
            <text class="dg-s" x="200" y="53" text-anchor="middle">activation</text>
            <text class="dg-s" x="200" y="68" text-anchor="middle">non-linearity</text>
            <rect class="dg-box p" x="280" y="34" width="104" height="46" rx="8" />
            <text class="dg-s" x="332" y="53" text-anchor="middle">forward pass</text>
            <text class="dg-s" x="332" y="68" text-anchor="middle">→ prediction</text>
            <rect class="dg-box k" x="412" y="34" width="104" height="46" rx="8" />
            <text class="dg-s" x="464" y="53" text-anchor="middle">loss function</text>
            <text class="dg-s" x="464" y="68" text-anchor="middle">how wrong?</text>
            <rect class="dg-box o" x="544" y="34" width="104" height="46" rx="8" />
            <text class="dg-s" x="596" y="53" text-anchor="middle">backprop</text>
            <text class="dg-s" x="596" y="68" text-anchor="middle">gradients</text>
            <path class="dg-line violet" d="M120 57 H144" marker-end="url(#ah-s3)" />
            <path class="dg-line violet" d="M252 57 H276" marker-end="url(#ah-s3)" />
            <path class="dg-line violet" d="M384 57 H408" marker-end="url(#ah-s3)" />
            <path class="dg-line violet" d="M516 57 H540" marker-end="url(#ah-s3)" />
            <path class="dg-line violet dash" d="M596 80 V100 H68 V84" marker-end="url(#ah-s3)" />
            <text class="dg-s" x="330" y="115" text-anchor="middle">gradient descent updates the weights · learning rate · batch · epoch</text>

            <rect class="dg-band p" x="12" y="128" width="340" height="102" rx="10" />
            <text class="dg-h" x="26" y="148">ARCHITECTURES, IN THIS ORDER</text>
            <rect class="dg-box b" x="26" y="156" width="72" height="30" rx="6" />
            <text class="dg-s" x="62" y="175" text-anchor="middle">MLP</text>
            <rect class="dg-box g" x="106" y="156" width="72" height="30" rx="6" />
            <text class="dg-s" x="142" y="175" text-anchor="middle">CNN</text>
            <rect class="dg-box y" x="186" y="156" width="72" height="30" rx="6" />
            <text class="dg-s" x="222" y="175" text-anchor="middle">RNN</text>
            <rect class="dg-box o" x="266" y="156" width="72" height="30" rx="6" />
            <text class="dg-s" x="302" y="175" text-anchor="middle">LSTM</text>
            <rect class="dg-box r" x="26" y="192" width="312" height="30" rx="6" />
            <text class="dg-s" x="182" y="211" text-anchor="middle">ATTENTION — the bridge into Stage 4, learn it slowly</text>

            <rect class="dg-band b" x="366" y="128" width="342" height="102" rx="10" />
            <text class="dg-h" x="380" y="148">BUILD FOUR THINGS · FRAMEWORK: PYTORCH</text>
            <rect class="dg-box c" x="380" y="156" width="150" height="30" rx="6" />
            <text class="dg-s" x="455" y="175" text-anchor="middle">image classifier</text>
            <rect class="dg-box c" x="544" y="156" width="150" height="30" rx="6" />
            <text class="dg-s" x="619" y="175" text-anchor="middle">text classifier</text>
            <rect class="dg-box g" x="380" y="192" width="150" height="30" rx="6" />
            <text class="dg-s" x="455" y="211" text-anchor="middle">sequence model</text>
            <rect class="dg-box l" x="544" y="192" width="150" height="30" rx="6" />
            <text class="dg-s" x="619" y="211" text-anchor="middle">net from scratch, no library</text>
          </svg>
          <figcaption>Figure 6 — Stage 3. The dashed arrow is the whole trick: the error flows backwards and adjusts the weights. Everything else is scale.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s3-arch">Architectures and PyTorch</h4>
        <p>Understand the neuron, weights, bias, activation functions, forward propagation, loss functions, backpropagation, gradient descent, learning rate, and the batch/epoch vocabulary. Then work through MLP, CNN, RNN, LSTM and finally attention, using <strong>PyTorch</strong> as your framework.</p>
        <p>Two notes on relevance in 2026. CNNs, RNNs and LSTMs are no longer state of the art for most language work, but they are still the cheapest way to build intuition about representation, sequence and memory — and RNN limitations are precisely what motivate attention, so skipping them makes transformers harder to appreciate, not easier. Meanwhile, one thing worth adding to this stage: <strong>fine-tuning mechanics at a conceptual level</strong>, including what LoRA and other parameter-efficient methods do, since that is the form of training you are most likely to touch in application work.</p>
        <div class="rm-goal rm-build">Build: an image classifier, a text classifier, a sequence model, and — the most valuable of the four — <strong>a small neural network from scratch in NumPy</strong>, with your own forward pass and backprop. Do that once and no LLM diagram will ever intimidate you.</div>

        <h4 class="lesson-subhead4" id="p2-check">Phase 2 checkpoint</h4>
        <ul class="lesson-checklist">
          <li>You can frame a problem as supervised or unsupervised and pick a sensible first algorithm.</li>
          <li>You can explain why a 99%-accurate fraud model can be worthless.</li>
          <li>You can spot data leakage in a described setup.</li>
          <li>You can describe backpropagation in three sentences without hand-waving.</li>
          <li>You have trained something in PyTorch and debugged a loss that would not decrease.</li>
          <li>You can say, for a given business problem, whether it needs an LLM, a classical model, or no AI at all.</li>
        </ul>
        <div class="rm-goal rm-skip">Shortcut note: if you are an experienced engineer targeting agents, you can compress this phase to two weeks — read about evaluation metrics and overfitting properly, build one small model end to end, and move on. Do not skip it entirely; the evaluation instinct from this phase is what Phase 5 is built on.</div>
      `,
    },
    {
      id: 'phase-3',
      title: 'Phase 3 — Transformers, LLMs & Applications',
      children: [
        { id: 's4', title: 'Stage 4 · Transformers and generative AI' },
        { id: 's4-llm', title: 'What to understand about LLMs' },
        { id: 's5', title: 'Stage 5 · LLM application engineering' },
        { id: 's5-prompt', title: 'Prompt engineering' },
        { id: 's6', title: 'Stage 6 · RAG' },
        { id: 's6-advanced', title: 'Advanced RAG' },
        { id: 'p3-check', title: 'Phase 3 checkpoint' },
      ],
      html: `
        <div class="rm-phase" style="--rm-a:#2563eb;--rm-b:#7c3aed">
          <div class="rm-phase-k">Phase 3 · Stages 4–6</div>
          <div class="rm-phase-t">Transformers, LLM applications and RAG — from "how does it work" to "what can I ship"</div>
          <div class="rm-phase-d">This is where the journey becomes GenAI. Stage 4 opens the box, Stage 5 turns the model into software, and Stage 6 connects it to knowledge it was never trained on. Finish this phase and you are employable even before touching agents.</div>
        </div>

        <h3 class="lesson-subhead" id="s4">Stage 4 · Transformers and generative AI</h3>
        <p>Start with NLP fundamentals — tokenization, embeddings, word embeddings, sequence representation, attention — then build up the transformer itself.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 252" role="img" aria-label="From NLP fundamentals through self-attention and multi-head attention to the full transformer and large language models">
            <defs>
              <marker id="ah-s4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-s4v" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">NLP FUNDAMENTALS → TRANSFORMER → LLM</text>
            <rect class="dg-box c" x="16" y="34" width="96" height="44" rx="8" />
            <text class="dg-s" x="64" y="53" text-anchor="middle">text →</text>
            <text class="dg-s" x="64" y="68" text-anchor="middle">tokenization</text>
            <rect class="dg-box c" x="128" y="34" width="96" height="44" rx="8" />
            <text class="dg-s" x="176" y="53" text-anchor="middle">tokens →</text>
            <text class="dg-s" x="176" y="68" text-anchor="middle">embeddings</text>
            <rect class="dg-box b" x="240" y="34" width="104" height="44" rx="8" />
            <text class="dg-s" x="292" y="53" text-anchor="middle">self-attention</text>
            <text class="dg-s" x="292" y="68" text-anchor="middle">Q · K · V</text>
            <rect class="dg-box i" x="360" y="34" width="104" height="44" rx="8" />
            <text class="dg-s" x="412" y="53" text-anchor="middle">multi-head</text>
            <text class="dg-s" x="412" y="68" text-anchor="middle">attention</text>
            <rect class="dg-box p" x="480" y="34" width="104" height="44" rx="8" />
            <text class="dg-s" x="532" y="53" text-anchor="middle">positional</text>
            <text class="dg-s" x="532" y="68" text-anchor="middle">encoding</text>
            <rect class="dg-box k" x="600" y="34" width="104" height="44" rx="8" />
            <text class="dg-s" x="652" y="53" text-anchor="middle">encoder /</text>
            <text class="dg-s" x="652" y="68" text-anchor="middle">decoder</text>
            <path class="dg-line blue" d="M112 56 H124" marker-end="url(#ah-s4)" />
            <path class="dg-line blue" d="M224 56 H236" marker-end="url(#ah-s4)" />
            <path class="dg-line blue" d="M344 56 H356" marker-end="url(#ah-s4)" />
            <path class="dg-line blue" d="M464 56 H476" marker-end="url(#ah-s4)" />
            <path class="dg-line blue" d="M584 56 H596" marker-end="url(#ah-s4)" />

            <rect class="dg-box r" x="252" y="96" width="216" height="34" rx="8" />
            <text class="dg-t" x="360" y="118" text-anchor="middle">THE TRANSFORMER</text>
            <path class="dg-line violet thick" d="M652 78 V90 H360 V92" marker-end="url(#ah-s4v)" />

            <rect class="dg-band b" x="12" y="146" width="340" height="94" rx="10" />
            <text class="dg-h" x="26" y="166">HOW MODELS ARE MADE</text>
            <rect class="dg-box g" x="26" y="174" width="150" height="26" rx="6" />
            <text class="dg-s" x="101" y="191" text-anchor="middle">pre-training</text>
            <rect class="dg-box g" x="188" y="174" width="150" height="26" rx="6" />
            <text class="dg-s" x="263" y="191" text-anchor="middle">fine-tuning</text>
            <rect class="dg-box o" x="26" y="206" width="150" height="26" rx="6" />
            <text class="dg-s" x="101" y="223" text-anchor="middle">instruction tuning</text>
            <rect class="dg-box o" x="188" y="206" width="150" height="26" rx="6" />
            <text class="dg-s" x="263" y="223" text-anchor="middle">RLHF / preference opt.</text>

            <rect class="dg-band p" x="366" y="146" width="342" height="94" rx="10" />
            <text class="dg-h" x="380" y="166">THE KNOBS YOU WILL TOUCH DAILY</text>
            <rect class="dg-box y" x="380" y="174" width="100" height="26" rx="6" />
            <text class="dg-s" x="430" y="191" text-anchor="middle">context window</text>
            <rect class="dg-box y" x="490" y="174" width="100" height="26" rx="6" />
            <text class="dg-s" x="540" y="191" text-anchor="middle">tokens</text>
            <rect class="dg-box y" x="600" y="174" width="94" height="26" rx="6" />
            <text class="dg-s" x="647" y="191" text-anchor="middle">parameters</text>
            <rect class="dg-box k" x="380" y="206" width="100" height="26" rx="6" />
            <text class="dg-s" x="430" y="223" text-anchor="middle">temperature</text>
            <rect class="dg-box k" x="490" y="206" width="100" height="26" rx="6" />
            <text class="dg-s" x="540" y="223" text-anchor="middle">sampling</text>
            <rect class="dg-box r" x="600" y="206" width="94" height="26" rx="6" />
            <text class="dg-s" x="647" y="223" text-anchor="middle">hallucination</text>
          </svg>
          <figcaption>Figure 7 — Stage 4. Left band is how the model came to exist; right band is what you control at inference time. Application engineers live entirely in the right band.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s4-llm">What to understand about LLMs</h4>
        <p>Pre-training, fine-tuning, instruction tuning, RLHF and preference optimisation, context window, tokens, parameters, temperature, sampling, and hallucination. Then get hands-on with the model families — OpenAI models, Gemini, Claude, and open-source models — so you know their differences in practice rather than from a leaderboard.</p>
        <p>Additions worth making in 2026, since they changed how applications are built:</p>
        <ul class="lesson-layers">
          <li><strong>Reasoning models.</strong> Models that spend extra computation before answering, billed as reasoning tokens you never see. They change your latency profile and your cost model, and they make old "think step by step" prompting habits redundant.</li>
          <li><strong>Long context, and its limits.</strong> Context windows grew enormously, but attention is not uniform across a huge prompt — material buried in the middle gets underweighted. Long context relaxes chunking constraints; it does not delete retrieval.</li>
          <li><strong>Multimodality.</strong> Images, audio and documents as native inputs. For agents this matters most for screenshot- and PDF-heavy workflows.</li>
          <li><strong>Model tiers as an engineering decision.</strong> Small/cheap for classification and routing, mid for most generation, frontier for genuinely hard reasoning. Choosing per step is a skill in itself.</li>
        </ul>
        <div class="rm-goal">Stage 4 goal: you can explain what happens inside an LLM when you send a prompt — even though you could not train a billion-parameter model yourself. That is the right bar.</div>

        <h3 class="lesson-subhead" id="s5">Stage 5 · LLM application engineering</h3>
        <p>Now the shift that matters most for your career: from <em>"how does an LLM work?"</em> to <em>"how do I build software using an LLM?"</em></p>
        <p>Learn the API surface properly: prompts, system versus user messages, structured output, JSON output, streaming, function/tool calling, and context management. Tool calling is the single most important item on that list — it is the primitive that all of Phase 4 is built from, and you should be comfortable with it long before you meet the word "agent".</p>
        <ul class="rm-grid">
          <li style="--rm:#2563eb"><span class="rm-k">API</span><span class="rm-n">Messages and roles</span><span class="rm-d">System vs user vs assistant, multi-turn state, and the fact that the model is stateless — you resend history every time.</span></li>
          <li style="--rm:#7c3aed"><span class="rm-k">Contracts</span><span class="rm-n">Structured output</span><span class="rm-d">JSON mode, schemas, Pydantic validation, and what to do when validation fails — repair, retry, or reject.</span></li>
          <li style="--rm:#0891b2"><span class="rm-k">UX</span><span class="rm-n">Streaming</span><span class="rm-d">Token streaming for perceived latency, and how it interacts with validation and guardrails.</span></li>
          <li style="--rm:#db2777"><span class="rm-k">Power</span><span class="rm-n">Function / tool calling</span><span class="rm-d">Schemas, arguments, results back into context. Learn this by hand, in a loop you wrote yourself.</span></li>
          <li style="--rm:#ea580c"><span class="rm-k">Budget</span><span class="rm-n">Context management</span><span class="rm-d">Token counting, truncation, summarisation of history, and what to drop first when you run out of room.</span></li>
          <li style="--rm:#16a34a"><span class="rm-k">Ops</span><span class="rm-n">Errors and cost</span><span class="rm-d">Timeouts, retries with backoff, rate limits, and logging tokens and cost per request from day one.</span></li>
        </ul>

        <h4 class="lesson-subhead4" id="s5-prompt">Prompt engineering</h4>
        <p>Zero-shot, few-shot, role prompting, the chain-of-thought concept, structured prompting, prompt templates, and prompt evaluation. That last one is the difference between a hobbyist and an engineer: keep a file of test inputs and expected behaviour, and re-run it after every prompt edit. It takes an hour to set up and saves you weeks.</p>
        <p>Treat prompts as versioned artefacts from the very beginning — in the repository, reviewed like code, with the version recorded in your logs. Prompts edited live in production are unattributable and unrollbackable.</p>
        <div class="rm-goal rm-build">Build, in order: <strong>a chatbot → a document summarizer → an AI SQL assistant → an AI coding assistant → an AI customer support assistant.</strong> The SQL one is the sharpest teacher — it forces structured output, schema context, validation, and a hard think about what happens when the generated query is wrong.</div>

        <h3 class="lesson-subhead" id="s6">Stage 6 · RAG</h3>
        <p>Now bring in knowledge that lives outside the model's training data. Start with embeddings — text becomes a vector — then vector search, then the full pipeline.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="RAG pipeline from documents through chunking, embedding and vector database to retrieval, context and answer, with advanced techniques layered underneath">
            <defs>
              <marker id="ah-rag" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-rag2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">INDEXING — DONE ONCE, AHEAD OF TIME</text>
            <rect class="dg-box" x="16" y="32" width="96" height="42" rx="8" />
            <text class="dg-s" x="64" y="58" text-anchor="middle">documents</text>
            <rect class="dg-box c" x="132" y="32" width="96" height="42" rx="8" />
            <text class="dg-s" x="180" y="58" text-anchor="middle">chunking</text>
            <rect class="dg-box b" x="248" y="32" width="96" height="42" rx="8" />
            <text class="dg-s" x="296" y="58" text-anchor="middle">embeddings</text>
            <rect class="dg-box i" x="364" y="32" width="112" height="42" rx="8" />
            <text class="dg-s" x="420" y="51" text-anchor="middle">vector DB</text>
            <text class="dg-s" x="420" y="65" text-anchor="middle">+ metadata</text>
            <path class="dg-line cyan" d="M112 53 H128" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M228 53 H244" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M344 53 H360" marker-end="url(#ah-rag)" />

            <text class="dg-h" x="16" y="106">QUERY TIME — EVERY REQUEST</text>
            <rect class="dg-box g" x="16" y="116" width="90" height="42" rx="8" />
            <text class="dg-s" x="61" y="142" text-anchor="middle">user query</text>
            <rect class="dg-box b" x="126" y="116" width="90" height="42" rx="8" />
            <text class="dg-s" x="171" y="135" text-anchor="middle">embed the</text>
            <text class="dg-s" x="171" y="149" text-anchor="middle">query</text>
            <rect class="dg-box i" x="236" y="116" width="100" height="42" rx="8" />
            <text class="dg-s" x="286" y="135" text-anchor="middle">retrieve top-k</text>
            <text class="dg-s" x="286" y="149" text-anchor="middle">cosine / ANN</text>
            <rect class="dg-box p" x="356" y="116" width="100" height="42" rx="8" />
            <text class="dg-s" x="406" y="142" text-anchor="middle">build context</text>
            <rect class="dg-box k" x="476" y="116" width="90" height="42" rx="8" />
            <text class="dg-s" x="521" y="142" text-anchor="middle">LLM</text>
            <rect class="dg-box g" x="586" y="116" width="118" height="42" rx="8" />
            <text class="dg-s" x="645" y="135" text-anchor="middle">answer</text>
            <text class="dg-s" x="645" y="149" text-anchor="middle">+ citations</text>
            <path class="dg-line cyan" d="M106 137 H122" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M216 137 H232" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M336 137 H352" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M456 137 H472" marker-end="url(#ah-rag)" />
            <path class="dg-line cyan" d="M566 137 H582" marker-end="url(#ah-rag)" />
            <path class="dg-line violet dash" d="M420 74 V96 H286 V112" marker-end="url(#ah-rag2)" />

            <rect class="dg-band p" x="12" y="176" width="696" height="72" rx="10" />
            <text class="dg-h" x="26" y="196">ADVANCED RAG — ADD ONLY WHEN MEASUREMENT SHOWS YOU NEED IT</text>
            <rect class="dg-box y" x="26" y="204" width="104" height="30" rx="6" />
            <text class="dg-s" x="78" y="223" text-anchor="middle">hybrid search</text>
            <rect class="dg-box y" x="140" y="204" width="104" height="30" rx="6" />
            <text class="dg-s" x="192" y="223" text-anchor="middle">reranking</text>
            <rect class="dg-box o" x="254" y="204" width="104" height="30" rx="6" />
            <text class="dg-s" x="306" y="223" text-anchor="middle">query rewriting</text>
            <rect class="dg-box o" x="368" y="204" width="104" height="30" rx="6" />
            <text class="dg-s" x="420" y="223" text-anchor="middle">multi-query</text>
            <rect class="dg-box r" x="482" y="204" width="104" height="30" rx="6" />
            <text class="dg-s" x="534" y="223" text-anchor="middle">parent/child chunks</text>
            <rect class="dg-box r" x="596" y="204" width="98" height="30" rx="6" />
            <text class="dg-s" x="645" y="223" text-anchor="middle">graph RAG</text>
          </svg>
          <figcaption>Figure 8 — Stage 6. The dashed arrow is the only connection between the two halves: indexing happens offline, retrieval happens per request. Confusing the two is the most common beginner bug.</figcaption>
        </figure>
        <p><strong>Vector database concepts</strong> to learn: vector, similarity, cosine similarity, approximate nearest neighbour (ANN), HNSW, and metadata filtering. Then meet the implementations — pgvector, Pinecone, Weaviate, Milvus. My advice: start with pgvector or even a plain keyword index. Choosing a vector database is a decision you should make <em>after</em> you have retrieval quality problems, not before.</p>

        <h4 class="lesson-subhead4" id="s6-advanced">Advanced RAG</h4>
        <p>Hybrid search (keyword plus vector), reranking, query rewriting, multi-query retrieval, metadata filtering, parent/child chunking, and graph RAG. Add these one at a time, and only when your retrieval metrics say the simple version is failing.</p>
        <p>Which means you need retrieval metrics. This is the part most tutorials omit: measure <strong>recall@k</strong> (was the right chunk retrieved at all?) separately from answer quality. If recall is the problem, no amount of prompt tuning will save you — and if recall is fine but answers are wrong, the retriever is not your bug.</p>
        <div class="rm-goal rm-build">Build: <strong>"chat with my documents" → an enterprise knowledge assistant.</strong> The step between them is not the model — it is permissions, freshness, citations, multiple document types, and knowing when to say "I don't know".</div>

        <h4 class="lesson-subhead4" id="p3-check">Phase 3 checkpoint</h4>
        <ul class="lesson-checklist">
          <li>You can explain self-attention and why positional encoding is needed.</li>
          <li>You can count the tokens in a request and predict its cost before sending it.</li>
          <li>You can get reliable JSON out of a model and handle the case where you do not.</li>
          <li>You have written a tool-calling loop by hand, without a framework.</li>
          <li>You have a prompt test file that you re-run after every edit.</li>
          <li>You can measure retrieval recall separately from answer quality, and say which one is failing.</li>
          <li>You have shipped something a real person other than you has used.</li>
        </ul>
      `,
    },
    {
      id: 'phase-4',
      title: 'Phase 4 — Agents & Multi-Agent Systems',
      children: [
        { id: 's7', title: 'Stage 7 · AI agents' },
        { id: 's7-tools', title: 'Tool integration' },
        { id: 's8', title: 'Stage 8 · Agent frameworks' },
        { id: 's9', title: 'Stage 9 · MCP and the tool ecosystem' },
        { id: 's10', title: 'Stage 10 · Multi-agent systems' },
        { id: 's10-comm', title: 'Agent communication' },
        { id: 's11', title: 'Stage 11 · Agent automation' },
        { id: 'p4-check', title: 'Phase 4 checkpoint' },
      ],
      html: `
        <div class="rm-phase" style="--rm-a:#7c3aed;--rm-b:#db2777">
          <div class="rm-phase-k">Phase 4 · Stages 7–11</div>
          <div class="rm-phase-t">Agents — giving the model tools, autonomy and colleagues</div>
          <div class="rm-phase-d">Now — and only now — start learning agents. Everything here is a small addition to what you already have: an LLM, plus tools, plus memory, plus reasoning, plus a loop. If you arrived here through Stages 0–6, this phase will feel like a natural next step rather than a leap.</div>
        </div>

        <h3 class="lesson-subhead" id="s7">Stage 7 · AI agents</h3>
        <p>The formula worth memorising:</p>
        <p class="lesson-flow">Agent = LLM + Tools + Memory + Reasoning + Loop</p>
        <p>Learn the vocabulary precisely, because the industry uses it loosely: agent, tool, function calling, state, memory, planning, reasoning, observation, action, feedback loop. Then implement the basic pattern yourself.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 270" role="img" aria-label="The agent loop: user request to model decision to tool call to observation and back to the model until a final answer">
            <defs>
              <marker id="ah-ag" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path class="dg-ah violet" d="M0 0 L10 4 L0 8 z" /></marker>
              <marker id="ah-ag2" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path class="dg-ah pink" d="M0 0 L10 4 L0 8 z" /></marker>
            </defs>
            <rect class="dg-box g" x="20" y="112" width="96" height="44" rx="9" />
            <text class="dg-t" x="68" y="139" text-anchor="middle">User</text>
            <rect class="dg-box k" x="156" y="112" width="110" height="44" rx="9" />
            <text class="dg-t" x="211" y="131" text-anchor="middle">LLM</text>
            <text class="dg-s" x="211" y="147" text-anchor="middle">reason over state</text>
            <rect class="dg-box p" x="306" y="112" width="118" height="44" rx="9" />
            <text class="dg-t" x="365" y="131" text-anchor="middle">Decide</text>
            <text class="dg-s" x="365" y="147" text-anchor="middle">tool or answer?</text>
            <rect class="dg-box b" x="464" y="46" width="110" height="44" rx="9" />
            <text class="dg-t" x="519" y="65" text-anchor="middle">Tool</text>
            <text class="dg-s" x="519" y="81" text-anchor="middle">API · DB · search</text>
            <rect class="dg-box c" x="464" y="112" width="110" height="44" rx="9" />
            <text class="dg-t" x="519" y="131" text-anchor="middle">Observation</text>
            <text class="dg-s" x="519" y="147" text-anchor="middle">tool result</text>
            <rect class="dg-box o" x="608" y="180" width="96" height="44" rx="9" />
            <text class="dg-t" x="656" y="199" text-anchor="middle">Final</text>
            <text class="dg-s" x="656" y="215" text-anchor="middle">answer</text>

            <path class="dg-line violet" d="M116 134 H152" marker-end="url(#ah-ag)" />
            <path class="dg-line violet" d="M266 134 H302" marker-end="url(#ah-ag)" />
            <path class="dg-line violet" d="M424 128 H444 V68 H460" marker-end="url(#ah-ag)" />
            <path class="dg-line violet" d="M519 90 V108" marker-end="url(#ah-ag)" />
            <path class="dg-line pink thick" d="M574 134 H592 V96 H211 V160" marker-end="url(#ah-ag2)" />
            <text class="dg-s" x="360" y="92" text-anchor="middle">the loop — result goes back into context, model decides again</text>
            <path class="dg-line violet" d="M424 145 H444 V196 H604" marker-end="url(#ah-ag)" />
            <text class="dg-s" x="500" y="212" text-anchor="middle">when the goal is met</text>

            <rect class="dg-band r" x="20" y="196" width="560" height="58" rx="10" />
            <text class="dg-h" x="34" y="216">CONTROLS YOU MUST ADD FROM DAY ONE — THE LOOP CAN RUN FOREVER</text>
            <rect class="dg-box r" x="34" y="222" width="122" height="24" rx="6" />
            <text class="dg-s" x="95" y="238" text-anchor="middle">max steps</text>
            <rect class="dg-box r" x="166" y="222" width="122" height="24" rx="6" />
            <text class="dg-s" x="227" y="238" text-anchor="middle">token / cost budget</text>
            <rect class="dg-box r" x="298" y="222" width="122" height="24" rx="6" />
            <text class="dg-s" x="359" y="238" text-anchor="middle">wall-clock timeout</text>
            <rect class="dg-box r" x="430" y="222" width="136" height="24" rx="6" />
            <text class="dg-s" x="498" y="238" text-anchor="middle">repeat-call detection</text>
            <text class="dg-h" x="20" y="26">THE AGENT LOOP — BUILD THIS BY HAND BEFORE ANY FRAMEWORK</text>
          </svg>
          <figcaption>Figure 9 — Stage 7. The pink arrow is the whole idea of an agent: the model's own output re-enters its context, so it can decide again with new information.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s7-tools">Tool integration</h4>
        <p>Teach the agent to use real capabilities: REST APIs, databases, search, a calculator, the file system, email, calendar, and internal enterprise APIs. Each one teaches a different lesson — search teaches you about noisy results, databases about schemas and permissions, email and calendar about actions you cannot undo.</p>
        <ul class="rm-chips">
          <li class="b">REST APIs</li>
          <li class="b">database</li>
          <li class="c">web search</li>
          <li class="g">calculator</li>
          <li class="y">file system</li>
          <li class="o">email</li>
          <li class="o">calendar</li>
          <li class="p">internal enterprise APIs</li>
        </ul>
        <p>Three things that separate a toy tool from a production one, and they are worth internalising now: <strong>a description precise enough that the model picks it correctly</strong> when five similar tools exist; <strong>errors returned as usable text</strong> the model can recover from rather than raw stack traces; and <strong>idempotency</strong>, so a retried call does not send the same email twice.</p>
        <div class="rm-goal rm-build">Build: a single agent with three to five tools, your own loop, a step limit, and a printed trace of every decision. Then deliberately break a tool and watch what the agent does — recovery behaviour is the real skill here.</div>

        <h3 class="lesson-subhead" id="s8">Stage 8 · Agent frameworks</h3>
        <p>Only after understanding the architecture, learn frameworks: LangGraph, Google ADK, OpenAI Agents SDK, AutoGen, CrewAI. The important thing is <strong>not memorising frameworks</strong> — they change constantly. Learn the underlying concepts, which do not:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 152" role="img" aria-label="Framework-independent concepts: state, node, tool, router, condition, human approval, retry, checkpoint, persistence and observability">
            <defs>
              <marker id="ah-fw" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">CONCEPTS THAT OUTLIVE EVERY FRAMEWORK</text>
            <rect class="dg-box b" x="16" y="32" width="98" height="34" rx="7" />
            <text class="dg-s" x="65" y="53" text-anchor="middle">state</text>
            <rect class="dg-box b" x="126" y="32" width="98" height="34" rx="7" />
            <text class="dg-s" x="175" y="53" text-anchor="middle">node</text>
            <rect class="dg-box c" x="236" y="32" width="98" height="34" rx="7" />
            <text class="dg-s" x="285" y="53" text-anchor="middle">tool</text>
            <rect class="dg-box i" x="346" y="32" width="98" height="34" rx="7" />
            <text class="dg-s" x="395" y="53" text-anchor="middle">router</text>
            <rect class="dg-box p" x="456" y="32" width="98" height="34" rx="7" />
            <text class="dg-s" x="505" y="53" text-anchor="middle">condition</text>
            <rect class="dg-box k" x="566" y="32" width="138" height="34" rx="7" />
            <text class="dg-s" x="635" y="53" text-anchor="middle">human approval</text>
            <rect class="dg-box y" x="16" y="80" width="98" height="34" rx="7" />
            <text class="dg-s" x="65" y="101" text-anchor="middle">retry</text>
            <rect class="dg-box o" x="126" y="80" width="98" height="34" rx="7" />
            <text class="dg-s" x="175" y="101" text-anchor="middle">checkpoint</text>
            <rect class="dg-box o" x="236" y="80" width="98" height="34" rx="7" />
            <text class="dg-s" x="285" y="101" text-anchor="middle">persistence</text>
            <rect class="dg-box g" x="346" y="80" width="98" height="34" rx="7" />
            <text class="dg-s" x="395" y="101" text-anchor="middle">observability</text>
            <rect class="dg-box" x="456" y="80" width="248" height="34" rx="7" />
            <text class="dg-s" x="580" y="101" text-anchor="middle">↑ if a framework hides these, you cannot debug it</text>
            <path class="dg-line pink" d="M114 49 H122" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M224 49 H232" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M334 49 H342" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M444 49 H452" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M554 49 H562" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M114 97 H122" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M224 97 H232" marker-end="url(#ah-fw)" />
            <path class="dg-line pink" d="M334 97 H342" marker-end="url(#ah-fw)" />
            <text class="dg-s" x="16" y="140">Learn one framework deeply, then read a second one's source. The second takes days, not weeks.</text>
          </svg>
          <figcaption>Figure 10 — Stage 8. Evaluate any framework by asking how easily it lets you see these ten things. If the answer involves reading its internals, that is your answer.</figcaption>
        </figure>
        <p>My recommendation: pick <strong>one</strong> graph-style framework (LangGraph is the reference implementation of these ideas) and learn it properly, including how to inspect its state and print the exact prompt it sends. Treat the others as variations to read about, not to learn separately.</p>

        <h3 class="lesson-subhead" id="s9">Stage 9 · MCP and the tool ecosystem</h3>
        <p>Then learn MCP — the Model Context Protocol. The key concept in one sentence:</p>
        <blockquote>
          <p><strong>MCP is a standardised way for AI applications to discover and interact with external capabilities.</strong></p>
        </blockquote>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="MCP architecture: AI model to MCP client to MCP server exposing tools, resources and prompts, connecting to enterprise systems">
            <defs>
              <marker id="ah-mcp" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box k" x="286" y="20" width="148" height="38" rx="9" />
            <text class="dg-t" x="360" y="44" text-anchor="middle">AI model / app</text>
            <rect class="dg-box p" x="286" y="76" width="148" height="38" rx="9" />
            <text class="dg-t" x="360" y="100" text-anchor="middle">MCP client</text>
            <rect class="dg-box i" x="286" y="132" width="148" height="38" rx="9" />
            <text class="dg-t" x="360" y="156" text-anchor="middle">MCP server</text>
            <path class="dg-line blue thick" d="M360 58 V72" marker-end="url(#ah-mcp)" />
            <path class="dg-line blue thick" d="M360 114 V128" marker-end="url(#ah-mcp)" />

            <rect class="dg-box c" x="122" y="76" width="112" height="38" rx="8" />
            <text class="dg-s" x="178" y="100" text-anchor="middle">tools</text>
            <rect class="dg-box c" x="122" y="132" width="112" height="38" rx="8" />
            <text class="dg-s" x="178" y="156" text-anchor="middle">resources</text>
            <rect class="dg-box c" x="486" y="76" width="112" height="38" rx="8" />
            <text class="dg-s" x="542" y="100" text-anchor="middle">prompts</text>
            <path class="dg-line dash" d="M286 151 H238" />
            <path class="dg-line dash" d="M286 145 H262 V95 H238" />
            <path class="dg-line dash" d="M434 145 H460 V95 H482" />
            <text class="dg-h" x="122" y="66">SERVER EXPOSES</text>

            <rect class="dg-band g" x="12" y="186" width="696" height="46" rx="10" />
            <text class="dg-h" x="26" y="204">ENTERPRISE SYSTEMS BEHIND THE SERVER</text>
            <rect class="dg-box g" x="26" y="208" width="98" height="20" rx="5" />
            <text class="dg-s" x="75" y="222" text-anchor="middle">GitHub</text>
            <rect class="dg-box g" x="134" y="208" width="98" height="20" rx="5" />
            <text class="dg-s" x="183" y="222" text-anchor="middle">Database</text>
            <rect class="dg-box g" x="242" y="208" width="98" height="20" rx="5" />
            <text class="dg-s" x="291" y="222" text-anchor="middle">Slack</text>
            <rect class="dg-box g" x="350" y="208" width="98" height="20" rx="5" />
            <text class="dg-s" x="399" y="222" text-anchor="middle">Jira</text>
            <rect class="dg-box g" x="458" y="208" width="112" height="20" rx="5" />
            <text class="dg-s" x="514" y="222" text-anchor="middle">Google Drive</text>
            <rect class="dg-box g" x="580" y="208" width="114" height="20" rx="5" />
            <text class="dg-s" x="637" y="222" text-anchor="middle">Internal APIs</text>
            <path class="dg-line blue thick" d="M360 170 V182" marker-end="url(#ah-mcp)" />
          </svg>
          <figcaption>Figure 11 — Stage 9. Before MCP, every integration was bespoke glue. After it, capabilities are discoverable — which is exactly why tool sprawl and permission scoping become your problems.</figcaption>
        </figure>
        <p>Learn to both consume and write MCP servers — writing one is the fastest way to understand the protocol. And learn the security posture at the same time, because a standard protocol connected to Slack, Jira, Drive and your database is a standard protocol with real blast radius: scoped credentials per server, no untrusted content treated as instructions, and human approval on anything irreversible.</p>

        <h3 class="lesson-subhead" id="s10">Stage 10 · Multi-agent systems</h3>
        <p>Now move from one agent to several specialised ones. The canonical shape is a supervisor delegating to specialists:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Supervisor agent delegating to researcher, developer and reviewer agents, whose results are combined by a final agent and returned to the user">
            <defs>
              <marker id="ah-ma" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="300" y="14" width="120" height="34" rx="8" />
            <text class="dg-t" x="360" y="36" text-anchor="middle">User</text>
            <rect class="dg-box p" x="284" y="64" width="152" height="38" rx="9" />
            <text class="dg-t" x="360" y="83" text-anchor="middle">Supervisor agent</text>
            <text class="dg-s" x="360" y="97" text-anchor="middle">plans &amp; delegates</text>
            <rect class="dg-box b" x="60" y="128" width="140" height="42" rx="9" />
            <text class="dg-t" x="130" y="147" text-anchor="middle">Researcher</text>
            <text class="dg-s" x="130" y="162" text-anchor="middle">search · read · cite</text>
            <rect class="dg-box c" x="290" y="128" width="140" height="42" rx="9" />
            <text class="dg-t" x="360" y="147" text-anchor="middle">Developer</text>
            <text class="dg-s" x="360" y="162" text-anchor="middle">write · run · fix</text>
            <rect class="dg-box y" x="520" y="128" width="140" height="42" rx="9" />
            <text class="dg-t" x="590" y="147" text-anchor="middle">Reviewer</text>
            <text class="dg-s" x="590" y="162" text-anchor="middle">critique · verify</text>
            <rect class="dg-box o" x="284" y="196" width="152" height="38" rx="9" />
            <text class="dg-t" x="360" y="215" text-anchor="middle">Final agent</text>
            <text class="dg-s" x="360" y="229" text-anchor="middle">merge &amp; respond</text>
            <rect class="dg-box g" x="300" y="248" width="120" height="16" rx="6" />
            <text class="dg-s" x="360" y="260" text-anchor="middle">User</text>
            <path class="dg-line violet" d="M360 48 V60" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M360 102 V114 H130 V124" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M360 102 V124" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M360 102 V114 H590 V124" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M130 170 V182 H360 V192" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M360 170 V192" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M590 170 V182 H360 V192" marker-end="url(#ah-ma)" />
            <path class="dg-line violet" d="M360 234 V246" marker-end="url(#ah-ma)" />
            <text class="dg-s" x="676" y="212" text-anchor="end">shared state carries context between them</text>
          </svg>
          <figcaption>Figure 12 — Stage 10. Every extra agent multiplies cost and failure surface. Add one only when a single agent with more tools has measurably failed.</figcaption>
        </figure>
        <p><strong>Multi-agent patterns</strong> to learn: supervisor, hierarchical, sequential, parallel, debate, reviewer/critic, planner/executor, handoff, swarm, and event-driven agents. Recognise them as topologies you choose deliberately, not as a maturity ladder.</p>
        <table>
          <thead><tr><th>Pattern</th><th>Use it when</th><th>Cost of getting it wrong</th></tr></thead>
          <tbody>
            <tr><td>Supervisor</td><td>Distinct specialities, one owner of the plan</td><td>Supervisor becomes a bottleneck and a single point of confusion</td></tr>
            <tr><td>Sequential</td><td>Fixed stages, each needing the previous output</td><td>You built a pipeline with extra latency — write code instead</td></tr>
            <tr><td>Parallel</td><td>Independent subtasks, results merge cleanly</td><td>Conflicting outputs nobody reconciles</td></tr>
            <tr><td>Reviewer / critic</td><td>Quality matters more than latency</td><td>Doubles cost; critics agree with anything if prompted vaguely</td></tr>
            <tr><td>Planner / executor</td><td>Long tasks needing an explicit plan</td><td>Plans that ignore what execution learned</td></tr>
            <tr><td>Debate</td><td>Genuinely ambiguous judgement calls</td><td>Expensive theatre for questions with one right answer</td></tr>
            <tr><td>Handoff / swarm</td><td>Ownership transfers by domain</td><td>Context lost at every handoff</td></tr>
            <tr><td>Event-driven</td><td>Work arrives asynchronously from systems</td><td>Invisible failures with no trace to follow</td></tr>
          </tbody>
        </table>

        <h4 class="lesson-subhead4" id="s10-comm">Agent communication</h4>
        <p>Understand shared state, messages, events, task delegation, agent-to-agent communication, and context propagation. Context propagation is where most multi-agent systems actually fail: agent three does not know what agent one learned, so it repeats the work or contradicts it. Decide explicitly what is shared state and what is private, and log both.</p>

        <h3 class="lesson-subhead" id="s11">Stage 11 · Agent automation</h3>
        <p>Now connect agents to real-world workflows, which is where agentic AI stops being a chat interface and becomes automation.</p>
        <p class="lesson-flow">Agents → Workflow engine → Enterprise systems</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 232" role="img" aria-label="An automation pipeline triggered by a new email, running research, analysis and decision agents, then a human approval gate before the action agent writes to CRM, email and Jira">
            <defs>
              <marker id="ah-au" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-au2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">A REAL AUTOMATION — NOTE WHERE THE HUMAN SITS</text>
            <rect class="dg-box" x="16" y="34" width="92" height="40" rx="8" />
            <text class="dg-s" x="62" y="52" text-anchor="middle">new email</text>
            <text class="dg-s" x="62" y="66" text-anchor="middle">arrives</text>
            <rect class="dg-box y" x="124" y="34" width="84" height="40" rx="8" />
            <text class="dg-s" x="166" y="59" text-anchor="middle">trigger</text>
            <rect class="dg-box b" x="224" y="34" width="104" height="40" rx="8" />
            <text class="dg-s" x="276" y="52" text-anchor="middle">research</text>
            <text class="dg-s" x="276" y="66" text-anchor="middle">agent</text>
            <rect class="dg-box c" x="344" y="34" width="104" height="40" rx="8" />
            <text class="dg-s" x="396" y="52" text-anchor="middle">analysis</text>
            <text class="dg-s" x="396" y="66" text-anchor="middle">agent</text>
            <rect class="dg-box p" x="464" y="34" width="104" height="40" rx="8" />
            <text class="dg-s" x="516" y="52" text-anchor="middle">decision</text>
            <text class="dg-s" x="516" y="66" text-anchor="middle">agent</text>
            <rect class="dg-box r" x="584" y="34" width="120" height="40" rx="8" />
            <text class="dg-s" x="644" y="52" text-anchor="middle">human approval</text>
            <text class="dg-s" x="644" y="66" text-anchor="middle">the gate</text>
            <path class="dg-line green" d="M108 54 H120" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M208 54 H220" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M328 54 H340" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M448 54 H460" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M568 54 H580" marker-end="url(#ah-au)" />
            <rect class="dg-box o" x="284" y="104" width="152" height="38" rx="8" />
            <text class="dg-t" x="360" y="128" text-anchor="middle">action agent</text>
            <path class="dg-line rose" d="M644 74 V90 H360 V100" marker-end="url(#ah-au2)" />
            <rect class="dg-box g" x="160" y="160" width="120" height="32" rx="7" />
            <text class="dg-s" x="220" y="180" text-anchor="middle">CRM</text>
            <rect class="dg-box g" x="300" y="160" width="120" height="32" rx="7" />
            <text class="dg-s" x="360" y="180" text-anchor="middle">Email</text>
            <rect class="dg-box g" x="440" y="160" width="120" height="32" rx="7" />
            <text class="dg-s" x="500" y="180" text-anchor="middle">Jira</text>
            <path class="dg-line green" d="M360 142 V152 H220 V156" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M360 142 V156" marker-end="url(#ah-au)" />
            <path class="dg-line green" d="M360 142 V152 H500 V156" marker-end="url(#ah-au)" />
            <text class="dg-s" x="16" y="216">Workflow engines: n8n · Temporal · Airflow · Kafka · event-driven architecture</text>
          </svg>
          <figcaption>Figure 13 — Stage 11. Read-only agents can be autonomous; agents that write to systems of record need the red gate. That single design choice is what makes automation deployable in a company.</figcaption>
        </figure>
        <p>Learn at least one workflow engine and the event-driven mindset that comes with it: <strong>n8n</strong> for fast integration work, <strong>Temporal</strong> for durable long-running workflows with retries and state you can trust, <strong>Airflow</strong> for scheduled batch pipelines, and <strong>Kafka</strong> for event streams. The concept that matters more than any tool: a workflow that survives a crash halfway through, and resumes without repeating the actions it already took.</p>
        <div class="rm-goal rm-build">Build: a triggered end-to-end automation with at least one write action behind a human approval step, and a durable record of every step taken. This is the project that gets you hired.</div>

        <h4 class="lesson-subhead4" id="p4-check">Phase 4 checkpoint</h4>
        <ul class="lesson-checklist">
          <li>You have written an agent loop from scratch and can explain every line.</li>
          <li>You can name the ten framework-independent concepts and find each one in a framework's API.</li>
          <li>You have written an MCP server and connected it to a client.</li>
          <li>You can justify a multi-agent topology — or argue convincingly for a single agent instead.</li>
          <li>Your agent has hard limits: max steps, budget, timeout, repeat detection.</li>
          <li>You have shipped one automation with a human approval gate and durable state.</li>
        </ul>
      `,
    },
    {
      id: 'phase-5',
      title: 'Phase 5 — Production, Evaluation & Deployment',
      children: [
        { id: 's12', title: 'Stage 12 · AI production engineering' },
        { id: 's12-sec', title: 'Security and observability' },
        { id: 's13', title: 'Stage 13 · AI evaluation' },
        { id: 's13-agent', title: 'Agent evaluation' },
        { id: 's14', title: 'Stage 14 · Deploy to production' },
        { id: 's14-arch', title: 'The production agent system' },
        { id: 'p5-check', title: 'Phase 5 checkpoint' },
      ],
      html: `
        <div class="rm-phase" style="--rm-a:#ea580c;--rm-b:#dc2626">
          <div class="rm-phase-k">Phase 5 · Stages 12–14</div>
          <div class="rm-phase-t">Production engineering, evaluation and deployment</div>
          <div class="rm-phase-d">This is the stage most AI tutorials skip entirely. A prototype is easy. <strong>Production AI is the real engineering challenge</strong> — and it is also the reason a competent backend engineer who learns this phase properly is more employable than someone who has read every agent paper.</div>
        </div>

        <h3 class="lesson-subhead" id="s12">Stage 12 · AI production engineering</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Four pillars of production AI engineering: reliability, scalability, security and observability with their component techniques">
            <rect class="dg-band b" x="12" y="20" width="170" height="212" rx="10" />
            <text class="dg-h" x="26" y="40">RELIABILITY</text>
            <rect class="dg-box b" x="26" y="48" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="63" text-anchor="middle">retry + backoff</text>
            <rect class="dg-box b" x="26" y="76" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="91" text-anchor="middle">timeout</text>
            <rect class="dg-box b" x="26" y="104" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="119" text-anchor="middle">circuit breaker</text>
            <rect class="dg-box b" x="26" y="132" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="147" text-anchor="middle">idempotency</text>
            <rect class="dg-box b" x="26" y="160" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="175" text-anchor="middle">fallback models</text>
            <rect class="dg-box b" x="26" y="188" width="142" height="22" rx="5" />
            <text class="dg-s" x="97" y="203" text-anchor="middle">rate limiting</text>
            <text class="dg-s" x="26" y="226">+ dead-letter queues</text>

            <rect class="dg-band g" x="190" y="20" width="170" height="212" rx="10" />
            <text class="dg-h" x="204" y="40">SCALABILITY</text>
            <rect class="dg-box g" x="204" y="48" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="63" text-anchor="middle">async processing</text>
            <rect class="dg-box g" x="204" y="76" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="91" text-anchor="middle">queues</text>
            <rect class="dg-box g" x="204" y="104" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="119" text-anchor="middle">Kafka</text>
            <rect class="dg-box g" x="204" y="132" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="147" text-anchor="middle">caching</text>
            <rect class="dg-box g" x="204" y="160" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="175" text-anchor="middle">load balancing</text>
            <rect class="dg-box g" x="204" y="188" width="142" height="22" rx="5" />
            <text class="dg-s" x="275" y="203" text-anchor="middle">horizontal scaling</text>
            <text class="dg-s" x="204" y="226">+ distributed systems</text>

            <rect class="dg-band r" x="368" y="20" width="170" height="212" rx="10" />
            <text class="dg-h" x="382" y="40">SECURITY</text>
            <rect class="dg-box r" x="382" y="48" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="63" text-anchor="middle">authentication</text>
            <rect class="dg-box r" x="382" y="76" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="91" text-anchor="middle">authorization</text>
            <rect class="dg-box r" x="382" y="104" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="119" text-anchor="middle">secrets management</text>
            <rect class="dg-box r" x="382" y="132" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="147" text-anchor="middle">prompt injection</text>
            <rect class="dg-box r" x="382" y="160" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="175" text-anchor="middle">PII + data leakage</text>
            <rect class="dg-box r" x="382" y="188" width="142" height="22" rx="5" />
            <text class="dg-s" x="453" y="203" text-anchor="middle">tool authorization</text>
            <text class="dg-s" x="382" y="226">+ tenant isolation</text>

            <rect class="dg-band p" x="546" y="20" width="162" height="212" rx="10" />
            <text class="dg-h" x="560" y="40">OBSERVABILITY</text>
            <rect class="dg-box p" x="560" y="48" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="63" text-anchor="middle">latency</text>
            <rect class="dg-box p" x="560" y="76" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="91" text-anchor="middle">token usage + cost</text>
            <rect class="dg-box p" x="560" y="104" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="119" text-anchor="middle">errors</text>
            <rect class="dg-box p" x="560" y="132" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="147" text-anchor="middle">tool calls</text>
            <rect class="dg-box p" x="560" y="160" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="175" text-anchor="middle">agent trajectories</text>
            <rect class="dg-box p" x="560" y="188" width="134" height="22" rx="5" />
            <text class="dg-s" x="627" y="203" text-anchor="middle">retrieval quality</text>
            <text class="dg-s" x="560" y="226">+ model quality</text>
          </svg>
          <figcaption>Figure 14 — Stage 12. Almost none of this is machine learning, which is exactly why it gets skipped — and why engineers who have it are scarce.</figcaption>
        </figure>
        <p><strong>Reliability</strong> — retry, timeout, circuit breaker, idempotency, fallback models, rate limiting, dead-letter queues. Idempotency deserves special attention in agent systems: a retried step must not send the same email or create the same ticket twice, which means every write action needs an idempotency key.</p>
        <p><strong>Scalability</strong> — async processing, queues, Kafka, caching, load balancing, horizontal scaling, distributed systems thinking. Agent workloads are unusual: individual requests are slow (seconds to minutes) and bursty, so queue-and-worker beats request-response for anything long-running.</p>

        <h4 class="lesson-subhead4" id="s12-sec">Security and observability</h4>
        <p><strong>Security</strong> — authentication, authorization, secrets management, prompt injection, data leakage, PII protection, tool authorization, tenant isolation. The two that are specific to this field, and the two that end projects: prompt injection (hostile instructions hidden in content your agent reads) and excessive agency (an agent holding credentials broader than the task needs). Enforce permissions at the API with scoped credentials — never in the prompt.</p>
        <p><strong>Observability</strong> — monitor latency, token usage, cost, errors, tool calls, agent trajectories, retrieval quality and model quality. The agent-specific one is <em>trajectories</em>: you need to replay the exact sequence of thoughts, tool calls and results for any request, or you cannot debug a failure you did not witness. Structured tracing (the OpenTelemetry GenAI conventions are the emerging standard) is the practical answer.</p>
        <div class="rm-goal">Stage 12 goal: for any request in the last 30 days, you can pull up its full trace, its cost, and every action it took — and you can explain what happens when your model provider has an outage.</div>

        <h3 class="lesson-subhead" id="s13">Stage 13 · AI evaluation</h3>
        <p>This deserves its own stage, because it is the skill that makes every other skill measurable.</p>
        <p><strong>LLM evaluation</strong> — golden datasets, ground truth, LLM-as-a-judge, human evaluation, automated evaluation. Metrics: correctness, relevance, faithfulness, groundedness, safety, tool accuracy, task completion.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="Evaluation loop combining a golden dataset, automated judges and human review, feeding results back into fixes">
            <defs>
              <marker id="ah-ev" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">TWO LAYERS OF EVALUATION — YOU NEED BOTH</text>
            <rect class="dg-box y" x="16" y="34" width="132" height="52" rx="9" />
            <text class="dg-t" x="82" y="55" text-anchor="middle">Golden dataset</text>
            <text class="dg-s" x="82" y="71" text-anchor="middle">real failures, graded</text>
            <rect class="dg-box b" x="180" y="34" width="132" height="52" rx="9" />
            <text class="dg-t" x="246" y="55" text-anchor="middle">Automated eval</text>
            <text class="dg-s" x="246" y="71" text-anchor="middle">judge + assertions</text>
            <rect class="dg-box g" x="344" y="34" width="132" height="52" rx="9" />
            <text class="dg-t" x="410" y="55" text-anchor="middle">Human review</text>
            <text class="dg-s" x="410" y="71" text-anchor="middle">daily sample</text>
            <rect class="dg-box p" x="508" y="34" width="196" height="52" rx="9" />
            <text class="dg-t" x="606" y="55" text-anchor="middle">Judge–human agreement</text>
            <text class="dg-s" x="606" y="71" text-anchor="middle">if it drops, fix the judge first</text>
            <path class="dg-line cyan" d="M148 60 H176" marker-end="url(#ah-ev)" />
            <path class="dg-line cyan" d="M312 60 H340" marker-end="url(#ah-ev)" />
            <path class="dg-line cyan" d="M476 60 H504" marker-end="url(#ah-ev)" />

            <rect class="dg-band c" x="12" y="104" width="696" height="108" rx="10" />
            <text class="dg-h" x="26" y="124">AGENT EVALUATION — SIX QUESTIONS PER RUN</text>
            <rect class="dg-box c" x="26" y="132" width="218" height="26" rx="6" />
            <text class="dg-s" x="135" y="149" text-anchor="middle">did it choose the correct tool?</text>
            <rect class="dg-box c" x="252" y="132" width="218" height="26" rx="6" />
            <text class="dg-s" x="361" y="149" text-anchor="middle">did it execute the correct sequence?</text>
            <rect class="dg-box c" x="478" y="132" width="216" height="26" rx="6" />
            <text class="dg-s" x="586" y="149" text-anchor="middle">did it recover from failure?</text>
            <rect class="dg-box i" x="26" y="166" width="218" height="26" rx="6" />
            <text class="dg-s" x="135" y="183" text-anchor="middle">did it achieve the goal?</text>
            <rect class="dg-box i" x="252" y="166" width="218" height="26" rx="6" />
            <text class="dg-s" x="361" y="183" text-anchor="middle">how much did it cost?</text>
            <rect class="dg-box i" x="478" y="166" width="216" height="26" rx="6" />
            <text class="dg-s" x="586" y="183" text-anchor="middle">how long did it take?</text>
          </svg>
          <figcaption>Figure 15 — Stage 13. Answer quality alone is not agent evaluation. A correct answer reached through six wasted tool calls is a bug you will pay for at scale.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s13-agent">Agent evaluation</h4>
        <p>Evaluate the trajectory, not just the answer: did the agent choose the correct tool, execute the correct sequence, recover from failure, achieve the goal, at what cost, and in what time. Those six questions are your dashboard.</p>
        <p>Two practices worth adopting early. First, keep an <strong>eval set built from your own production failures</strong> — twenty new cases a week makes a genuinely hard benchmark within two months. Second, <strong>validate your judge</strong>: keep a human-graded subset, track agreement, and treat a divergence between judge scores and human scores as a broken judge rather than progress. Judges have known biases — favouring longer answers, favouring whichever option is shown first, favouring their own model family — so test for those explicitly.</p>

        <h3 class="lesson-subhead" id="s14">Stage 14 · Deploy to production</h3>
        <p>Finally, the path from your laptop to a system other people depend on:</p>
        <p class="lesson-flow">Local prototype → Git → CI/CD → Docker → Cloud → API / service → Monitoring → Evaluation → Security → Scaling → Production agent system</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 274" role="img" aria-label="Production agent system architecture from user through API gateway and agent orchestrator to model, RAG and tools, with evaluation and observability layer and enterprise systems">
            <defs>
              <marker id="ah-pr" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-pr2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="292" y="12" width="136" height="30" rx="8" />
            <text class="dg-t" x="360" y="32" text-anchor="middle">User</text>
            <rect class="dg-box y" x="292" y="56" width="136" height="30" rx="8" />
            <text class="dg-t" x="360" y="76" text-anchor="middle">API gateway</text>
            <rect class="dg-box p" x="276" y="100" width="168" height="38" rx="9" />
            <text class="dg-t" x="360" y="119" text-anchor="middle">Agent orchestrator</text>
            <text class="dg-s" x="360" y="133" text-anchor="middle">state · routing · retries</text>
            <rect class="dg-box k" x="60" y="156" width="150" height="34" rx="8" />
            <text class="dg-s" x="135" y="177" text-anchor="middle">LLM models (tiered)</text>
            <rect class="dg-box b" x="286" y="156" width="150" height="34" rx="8" />
            <text class="dg-s" x="361" y="177" text-anchor="middle">RAG + vector store</text>
            <rect class="dg-box c" x="512" y="156" width="150" height="34" rx="8" />
            <text class="dg-s" x="587" y="177" text-anchor="middle">Tools / MCP servers</text>
            <rect class="dg-box o" x="252" y="204" width="216" height="34" rx="8" />
            <text class="dg-t" x="360" y="225" text-anchor="middle">Evaluation &amp; observability</text>
            <rect class="dg-box" x="252" y="248" width="216" height="24" rx="7" />
            <text class="dg-s" x="360" y="264" text-anchor="middle">Enterprise systems</text>
            <path class="dg-line blue" d="M360 42 V52" marker-end="url(#ah-pr)" />
            <path class="dg-line blue" d="M360 86 V96" marker-end="url(#ah-pr)" />
            <path class="dg-line blue" d="M360 138 V148 H135 V152" marker-end="url(#ah-pr)" />
            <path class="dg-line blue" d="M360 138 V152" marker-end="url(#ah-pr)" />
            <path class="dg-line blue" d="M360 138 V148 H587 V152" marker-end="url(#ah-pr)" />
            <path class="dg-line violet" d="M135 190 V200 H360" marker-end="url(#ah-pr2)" />
            <path class="dg-line violet" d="M361 190 V200" marker-end="url(#ah-pr2)" />
            <path class="dg-line violet" d="M587 190 V200 H360" marker-end="url(#ah-pr2)" />
            <path class="dg-line blue" d="M360 238 V244" marker-end="url(#ah-pr)" />
            <rect class="dg-band b" x="12" y="12" width="230" height="130" rx="10" opacity="0.55" />
            <text class="dg-h" x="26" y="32">SHIPPING PIPELINE</text>
            <text class="dg-s" x="26" y="50">Git → CI/CD → Docker → Cloud</text>
            <text class="dg-s" x="26" y="68">· prompts versioned in the repo</text>
            <text class="dg-s" x="26" y="86">· evals run in CI, blocking merge</text>
            <text class="dg-s" x="26" y="104">· secrets from a vault, not env files</text>
            <text class="dg-s" x="26" y="122">· model pinned + swappable by config</text>
            <rect class="dg-band o" x="478" y="12" width="230" height="130" rx="10" opacity="0.55" />
            <text class="dg-h" x="492" y="32">DAY-2 OPERATIONS</text>
            <text class="dg-s" x="492" y="50">· cost per successful task tracked</text>
            <text class="dg-s" x="492" y="68">· p95 latency alerting</text>
            <text class="dg-s" x="492" y="86">· traces retained and searchable</text>
            <text class="dg-s" x="492" y="104">· daily human review of a sample</text>
            <text class="dg-s" x="492" y="122">· rollback plan for prompt + model</text>
          </svg>
          <figcaption>Figure 16 — Stage 14. The centre column is the system; the side panels are the practices that keep it alive. Both are the job.</figcaption>
        </figure>

        <h4 class="lesson-subhead4" id="s14-arch">The production agent system</h4>
        <p>Read the architecture above as the destination of the whole roadmap. Every earlier stage supplies one box: Phase 1 gives you the service and the container, Phase 2 the evaluation instinct, Phase 3 the model and the retrieval layer, Phase 4 the orchestrator and the tools, Phase 5 the gateway, the observability and the confidence to let real users near it.</p>
        <div class="rm-goal rm-build">Build: take your best Phase 4 project and put it fully in production — containerised, deployed, CI running your eval set on every pull request, traces searchable, cost dashboarded, secrets in a vault, and a documented rollback. This one project is worth more in an interview than the other nine combined.</div>

        <h4 class="lesson-subhead4" id="p5-check">Phase 5 checkpoint</h4>
        <ul class="lesson-checklist">
          <li>Your system survives a provider outage without losing work.</li>
          <li>Retried write actions cannot double-send, because every one has an idempotency key.</li>
          <li>Your CI fails a pull request that lowers your eval score.</li>
          <li>You can replay any production trajectory step by step.</li>
          <li>You know your cost per successful task and your p95 latency.</li>
          <li>An agent's credentials are scoped to its task, and irreversible actions need approval.</li>
          <li>You can roll back both the prompt and the model in minutes.</li>
        </ul>
      `,
    },
    {
      id: 'shortcut',
      title: 'The Shortcut — Three Parallel Tracks',
      children: [
        { id: 'sc-idea', title: 'You do not need to master every stage first' },
        { id: 'sc-tracks', title: 'Track 1 engineering · Track 2 AI · Track 3 agentic AI' },
        { id: 'sc-converge', title: 'Where the tracks converge' },
        { id: 'sc-defer', title: 'What you can safely defer' },
      ],
      html: `
        <h3 class="lesson-subhead" id="sc-idea">You do not need to master every stage first</h3>
        <p>Here is the important escape hatch. A beginner does <strong>not</strong> need to master every stage before moving forward. If your goal is specifically Agentic AI, run three tracks in parallel instead of marching through fifteen stages in single file.</p>
        <p>The tracks progress at different speeds and reinforce each other: engineering makes your agents deployable, AI fundamentals make them explainable, and the agentic track keeps you motivated because you are building the thing you actually came for.</p>

        <h3 class="lesson-subhead" id="sc-tracks">Track 1 engineering · Track 2 AI · Track 3 agentic AI</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Three parallel learning tracks - engineering, AI and agentic AI - converging on production AI">
            <defs>
              <marker id="ah-tk" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tk2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tk3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tk4" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path class="dg-ah rose" d="M0 0 L10 4 L0 8 z" /></marker>
            </defs>
            <rect class="dg-band g" x="12" y="14" width="560" height="58" rx="10" />
            <rect class="dg-pill" x="24" y="30" width="82" height="24" rx="12" />
            <text class="dg-pill-t" x="65" y="46" text-anchor="middle">TRACK 1</text>
            <text class="dg-t" x="118" y="38">Engineering</text>
            <text class="dg-s" x="118" y="56">Python → Git → APIs → SQL → Linux → Docker → Cloud → distributed systems</text>

            <rect class="dg-band b" x="12" y="82" width="560" height="58" rx="10" />
            <rect class="dg-pill" x="24" y="98" width="82" height="24" rx="12" />
            <text class="dg-pill-t" x="65" y="114" text-anchor="middle">TRACK 2</text>
            <text class="dg-t" x="118" y="106">AI</text>
            <text class="dg-s" x="118" y="124">statistics → ML → deep learning → transformers → LLMs → embeddings → RAG → evaluation</text>

            <rect class="dg-band p" x="12" y="150" width="560" height="58" rx="10" />
            <rect class="dg-pill" x="24" y="166" width="82" height="24" rx="12" />
            <text class="dg-pill-t" x="65" y="182" text-anchor="middle">TRACK 3</text>
            <text class="dg-t" x="118" y="174">Agentic AI</text>
            <text class="dg-s" x="118" y="192">prompting → structured output → function calling → tools → agents → MCP → workflows → multi-agent</text>

            <rect class="dg-box r" x="588" y="82" width="120" height="58" rx="10" />
            <text class="dg-t" x="648" y="106" text-anchor="middle">Production AI</text>
            <text class="dg-s" x="648" y="122" text-anchor="middle">where all three meet</text>
            <path class="dg-line green" d="M572 43 H584 V100" marker-end="url(#ah-tk)" />
            <path class="dg-line blue" d="M572 111 H584" marker-end="url(#ah-tk2)" />
            <path class="dg-line violet" d="M572 179 H584 V124" marker-end="url(#ah-tk3)" />
            <text class="dg-h" x="12" y="234">CONVERGENCE ORDER — SOFTWARE ENGINEERING FIRST, PRODUCTION LAST</text>
            <text class="dg-s" x="12" y="252">engineering → AI fundamentals → LLM applications → RAG → agents → multi-agent → automation → evaluation &amp; security → production AI</text>
            <path class="dg-line rose thick" d="M12 258 H700" marker-end="url(#ah-tk4)" opacity="0.6" />
          </svg>
          <figcaption>Figure 17 — Three tracks, one destination. Track 3 is the fun one and the reason you will keep going; Tracks 1 and 2 are what stop it from being a toy.</figcaption>
        </figure>
        <ul class="rm-grid">
          <li style="--rm:#16a34a"><span class="rm-k">Track 1 · Engineering</span><span class="rm-n">Makes it deployable</span><span class="rm-d">Python, Git, APIs, SQL, Linux, Docker, cloud, distributed systems. Never stop advancing this track — it is what separates an AI enthusiast from an AI engineer.</span></li>
          <li style="--rm:#2563eb"><span class="rm-k">Track 2 · AI</span><span class="rm-n">Makes it explainable</span><span class="rm-d">Statistics, ML, deep learning, transformers, LLMs, embeddings, RAG, evaluation. Go one level deeper than you think you need; this is where judgement comes from.</span></li>
          <li style="--rm:#7c3aed"><span class="rm-k">Track 3 · Agentic AI</span><span class="rm-n">Makes it useful</span><span class="rm-d">Prompting, structured output, function calling, tools, agents, MCP, workflows, multi-agent, automation, production. Start this in week two, not month ten.</span></li>
        </ul>

        <h3 class="lesson-subhead" id="sc-converge">Where the tracks converge</h3>
        <p>Read the convergence as a dependency order rather than a schedule:</p>
        <p class="lesson-flow">software engineering → AI fundamentals → LLM applications → RAG → agents → multi-agent systems → agent automation → evaluation &amp; security → production AI</p>
        <p>Whenever you feel stuck on the agentic track, the blockage is almost always in one of the other two. Cannot debug why retrieval is poor? That is Track 2. Cannot get the thing deployed with secrets and traces? That is Track 1.</p>

        <h3 class="lesson-subhead" id="sc-defer">What you can safely defer</h3>
        <table>
          <thead><tr><th>Topic</th><th>Verdict</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>CNNs, RNNs, LSTMs in depth</td><td>Defer</td><td>Useful intuition, rarely used directly in language work today</td></tr>
            <tr><td>Training a model from scratch</td><td>Defer</td><td>One small from-scratch network is enough; you will not pre-train</td></tr>
            <tr><td>Eigenvalues, advanced calculus</td><td>Defer</td><td>Conceptual understanding suffices for application work</td></tr>
            <tr><td>Choosing a vector database</td><td>Defer</td><td>Start with pgvector or keyword search; decide when you have real retrieval problems</td></tr>
            <tr><td>Fine-tuning</td><td>Defer</td><td>Prompting plus retrieval solves most problems; fine-tune when you can prove they do not</td></tr>
            <tr><td>Five agent frameworks</td><td>Defer</td><td>Learn one deeply; the rest are variations</td></tr>
            <tr><td><strong>Python fluency</strong></td><td><strong>Never</strong></td><td>Everything is written in it</td></tr>
            <tr><td><strong>HTTP, JSON, APIs, SQL</strong></td><td><strong>Never</strong></td><td>Tool calling and enterprise data access are made of these</td></tr>
            <tr><td><strong>Evaluation metrics and overfitting</strong></td><td><strong>Never</strong></td><td>Without them you cannot tell whether any change helped</td></tr>
            <tr><td><strong>Tokens, context, cost</strong></td><td><strong>Never</strong></td><td>These are your budget and your constraints</td></tr>
            <tr><td><strong>The agent loop by hand</strong></td><td><strong>Never</strong></td><td>Skip it and every framework stays magic forever</td></tr>
            <tr><td><strong>Security basics</strong></td><td><strong>Never</strong></td><td>Injection plus write access is how projects get cancelled</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 'projects',
      title: 'The 10-Project Ladder',
      children: [
        { id: 'pj-ladder', title: 'Ten projects in sequence' },
        { id: 'pj-table', title: 'What each project teaches' },
        { id: 'pj-grade', title: 'How to grade your own project' },
      ],
      html: `
        <h3 class="lesson-subhead" id="pj-ladder">Ten projects in sequence</h3>
        <p>Instead of studying everything theoretically, build these ten things in order. Each one adds exactly one new difficulty, which is what makes the sequence work — you are never debugging two unfamiliar things at once.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 300" role="img" aria-label="A staircase of ten projects rising from a Python utility to a production-grade multi-agent application">
            <defs>
              <marker id="ah-pj" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="252" width="128" height="34" rx="8" />
            <text class="dg-s" x="80" y="273" text-anchor="middle">1 · Python AI utility</text>
            <rect class="dg-box g" x="82" y="228" width="128" height="34" rx="8" />
            <text class="dg-s" x="146" y="249" text-anchor="middle">2 · ML prediction</text>
            <rect class="dg-box c" x="148" y="204" width="128" height="34" rx="8" />
            <text class="dg-s" x="212" y="225" text-anchor="middle">3 · neural network</text>
            <rect class="dg-box c" x="214" y="180" width="128" height="34" rx="8" />
            <text class="dg-s" x="278" y="201" text-anchor="middle">4 · LLM chatbot</text>
            <rect class="dg-box b" x="280" y="156" width="128" height="34" rx="8" />
            <text class="dg-s" x="344" y="177" text-anchor="middle">5 · RAG assistant</text>
            <rect class="dg-box i" x="346" y="132" width="128" height="34" rx="8" />
            <text class="dg-s" x="410" y="153" text-anchor="middle">6 · tool-calling AI</text>
            <rect class="dg-box p" x="412" y="108" width="128" height="34" rx="8" />
            <text class="dg-s" x="476" y="129" text-anchor="middle">7 · single agent</text>
            <rect class="dg-box p" x="478" y="84" width="128" height="34" rx="8" />
            <text class="dg-s" x="542" y="105" text-anchor="middle">8 · MCP-enabled agent</text>
            <rect class="dg-box k" x="544" y="60" width="160" height="34" rx="8" />
            <text class="dg-s" x="624" y="81" text-anchor="middle">9 · multi-agent system</text>
            <rect class="dg-box o" x="544" y="20" width="160" height="34" rx="8" />
            <text class="dg-s" x="624" y="34" text-anchor="middle">10 · production-grade</text>
            <text class="dg-s" x="624" y="47" text-anchor="middle">multi-agent application</text>
            <path class="dg-line pink" d="M144 262 H160 V242" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M210 238 H226 V218" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M276 214 H292 V194" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M342 190 H358 V170" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M408 166 H424 V146" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M474 142 H490 V122" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M540 118 H556 V98" marker-end="url(#ah-pj)" />
            <path class="dg-line pink" d="M606 94 H622 V74" marker-end="url(#ah-pj)" />
            <path class="dg-line pink thick" d="M624 60 V58" marker-end="url(#ah-pj)" />
            <text class="dg-h" x="16" y="120">EACH STEP ADDS</text>
            <text class="dg-s" x="16" y="138">ONE NEW DIFFICULTY —</text>
            <text class="dg-s" x="16" y="154">never two at once.</text>
            <text class="dg-s" x="16" y="176">Finish each one and</text>
            <text class="dg-s" x="16" y="192">write down what broke.</text>
          </svg>
          <figcaption>Figure 18 — The project ladder. Project 10 is not a bigger project 9; it is project 9 with reliability, security, evaluation and deployment around it.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pj-table">What each project teaches</h3>
        <table>
          <thead><tr><th>#</th><th>Project</th><th>New difficulty it introduces</th><th>Stage</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Python AI utility</td><td>Structure, APIs, error handling, packaging</td><td>0</td></tr>
            <tr><td>2</td><td>ML prediction system</td><td>Data splits, metrics, baselines, overfitting</td><td>2</td></tr>
            <tr><td>3</td><td>Neural-network project</td><td>Training loops, loss curves, tensors</td><td>3</td></tr>
            <tr><td>4</td><td>LLM chatbot</td><td>Prompting, message state, streaming, cost</td><td>5</td></tr>
            <tr><td>5</td><td>RAG document assistant</td><td>Chunking, embeddings, retrieval quality, citations</td><td>6</td></tr>
            <tr><td>6</td><td>Tool-calling AI assistant</td><td>Schemas, structured output, tool errors</td><td>5–7</td></tr>
            <tr><td>7</td><td>Single autonomous agent</td><td>The loop, planning, step limits, recovery</td><td>7</td></tr>
            <tr><td>8</td><td>MCP-enabled agent</td><td>Protocol integration, discovery, scoped permissions</td><td>9</td></tr>
            <tr><td>9</td><td>Multi-agent research or automation system</td><td>Delegation, shared state, cost control, human gates</td><td>10–11</td></tr>
            <tr><td>10</td><td>Production-grade multi-agent application</td><td>Reliability, security, evals in CI, observability, deployment</td><td>12–14</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="pj-grade">How to grade your own project</h3>
        <p>A project counts as finished when you can answer yes to all of these. Most portfolio projects fail on the last three, which is exactly why they do not impress interviewers.</p>
        <ul class="lesson-checklist">
          <li>Someone other than you has used it and given feedback.</li>
          <li>You can state what it does <em>worse</em> than the obvious non-AI approach.</li>
          <li>You have a test or eval file that fails when you break something.</li>
          <li>You know its cost per request and its p95 latency.</li>
          <li>You have written down three failures you observed and what you changed.</li>
          <li>You can hand someone the repository and they can run it from the README alone.</li>
        </ul>
        <div class="rm-goal">Ten finished projects at this bar beat fifty tutorial repositories. Depth of one project you can discuss for 30 minutes is worth more in an interview than breadth you can only describe in headlines.</div>
      `,
    },
    {
      id: 'oneflow',
      title: 'The Complete Roadmap in One Flow',
      children: [
        { id: 'of-flow', title: 'The one-page version' },
        { id: 'of-mastery', title: 'Signals you have actually mastered a phase' },
        { id: 'of-week', title: 'A weekly rhythm that works' },
        { id: 'of-resources', title: 'Resources and next lessons' },
        { id: 'of-check', title: 'Self-check' },
      ],
      html: `
        <h3 class="lesson-subhead" id="of-flow">The one-page version</h3>
        <p>This is the version to keep on your wall. Everything above is elaboration on this single column.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 470" role="img" aria-label="The complete roadmap as one vertical flow from beginner through 22 steps to AI agent engineer, colour-coded by phase">
            <defs>
              <marker id="ah-of" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path class="dg-ah violet" d="M0 0 L8 3 L0 6 z" /></marker>
            </defs>
            <rect class="dg-band g" x="188" y="10" width="344" height="106" rx="10" />
            <rect class="dg-band c" x="188" y="122" width="344" height="76" rx="10" />
            <rect class="dg-band b" x="188" y="204" width="344" height="106" rx="10" />
            <rect class="dg-band p" x="188" y="316" width="344" height="76" rx="10" />
            <rect class="dg-band o" x="188" y="398" width="344" height="62" rx="10" />
            <text class="dg-h" x="176" y="30" text-anchor="end">PHASE 1</text>
            <text class="dg-h" x="176" y="142" text-anchor="end">PHASE 2</text>
            <text class="dg-h" x="176" y="224" text-anchor="end">PHASE 3</text>
            <text class="dg-h" x="176" y="336" text-anchor="end">PHASE 4</text>
            <text class="dg-h" x="176" y="418" text-anchor="end">PHASE 5</text>
            <text class="dg-s" x="176" y="46" text-anchor="end">foundations</text>
            <text class="dg-s" x="176" y="158" text-anchor="end">ML + DL</text>
            <text class="dg-s" x="176" y="240" text-anchor="end">LLMs + RAG</text>
            <text class="dg-s" x="176" y="352" text-anchor="end">agents</text>
            <text class="dg-s" x="176" y="434" text-anchor="end">production</text>

            <rect class="dg-box" x="288" y="14" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="28" text-anchor="middle">BEGINNER</text>
            <rect class="dg-box g" x="288" y="40" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="54" text-anchor="middle">computer fundamentals</text>
            <rect class="dg-box g" x="288" y="66" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="80" text-anchor="middle">Python / Git</text>
            <rect class="dg-box g" x="288" y="92" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="106" text-anchor="middle">data + SQL + statistics</text>
            <rect class="dg-box c" x="288" y="126" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="140" text-anchor="middle">machine learning</text>
            <rect class="dg-box c" x="288" y="152" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="166" text-anchor="middle">deep learning</text>
            <rect class="dg-box c" x="288" y="178" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="192" text-anchor="middle">neural nets + PyTorch</text>
            <rect class="dg-box b" x="288" y="208" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="222" text-anchor="middle">NLP + transformers</text>
            <rect class="dg-box b" x="288" y="234" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="248" text-anchor="middle">LLM fundamentals</text>
            <rect class="dg-box b" x="288" y="260" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="274" text-anchor="middle">LLM API + prompting</text>
            <rect class="dg-box i" x="288" y="286" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="300" text-anchor="middle">structured output + tools</text>
            <rect class="dg-box i" x="288" y="320" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="334" text-anchor="middle">RAG</text>
            <rect class="dg-box p" x="288" y="346" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="360" text-anchor="middle">AI agents</text>
            <rect class="dg-box p" x="288" y="372" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="386" text-anchor="middle">frameworks · MCP · multi-agent</text>
            <rect class="dg-box o" x="288" y="402" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="416" text-anchor="middle">evaluation + observability</text>
            <rect class="dg-box r" x="288" y="428" width="144" height="20" rx="6" />
            <text class="dg-s" x="360" y="442" text-anchor="middle">security + reliability</text>
            <path class="dg-line violet" d="M360 34 V38" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 60 V64" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 86 V90" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 112 V124" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 146 V150" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 172 V176" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 198 V206" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 228 V232" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 254 V258" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 280 V284" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 306 V318" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 340 V344" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 366 V370" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 392 V400" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M360 422 V426" marker-end="url(#ah-of)" />

            <rect class="dg-box y" x="552" y="402" width="152" height="20" rx="6" />
            <text class="dg-s" x="628" y="416" text-anchor="middle">Docker · CI/CD · cloud</text>
            <rect class="dg-box g" x="552" y="428" width="152" height="20" rx="6" />
            <text class="dg-t" x="628" y="443" text-anchor="middle">🚀 AI / Agent Engineer</text>
            <path class="dg-line violet" d="M432 412 H548" marker-end="url(#ah-of)" />
            <path class="dg-line violet" d="M432 438 H548" marker-end="url(#ah-of)" />
            <text class="dg-s" x="552" y="374">automation · workflow</text>
            <text class="dg-s" x="552" y="390">engines · durable state</text>
            <text class="dg-s" x="552" y="30">Track 1 engineering and</text>
            <text class="dg-s" x="552" y="46">Track 3 agentic AI run</text>
            <text class="dg-s" x="552" y="62">in parallel with this —</text>
            <text class="dg-s" x="552" y="78">see the shortcut section.</text>
            <text class="dg-s" x="16" y="88">Print this column.</text>
            <text class="dg-s" x="16" y="104">Tick one box a week</text>
            <text class="dg-s" x="16" y="120">and you finish inside</text>
            <text class="dg-s" x="16" y="136">a year.</text>
          </svg>
          <figcaption>Figure 19 — The complete roadmap as one flow, colour-banded by phase. Twenty-two boxes, roughly one per week for a year of consistent study.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="of-mastery">Signals you have actually mastered a phase</h3>
        <p>Self-assessment is hard, so use behavioural signals rather than feelings of confidence.</p>
        <table>
          <thead><tr><th>Phase</th><th>You are done when…</th><th>Not done if…</th></tr></thead>
          <tbody>
            <tr><td>1 · Foundations</td><td>You build tools for yourself without a tutorial</td><td>You still copy boilerplate you do not understand</td></tr>
            <tr><td>2 · ML &amp; DL</td><td>You can argue a problem does not need an LLM</td><td>Every problem looks like a prompt to you</td></tr>
            <tr><td>3 · LLMs &amp; RAG</td><td>You can debug a bad answer to its root cause — retrieval, prompt, or model</td><td>Your fix for everything is a longer prompt</td></tr>
            <tr><td>4 · Agents</td><td>You can predict where your agent will fail before running it</td><td>You cannot explain what your framework does internally</td></tr>
            <tr><td>5 · Production</td><td>Other people rely on something you deployed and you sleep fine</td><td>Your best work only runs on your laptop</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="of-week">A weekly rhythm that works</h3>
        <ol class="lesson-steps">
          <li><strong>One concept</strong> — read or watch material on exactly one new topic from your current stage. Not five.</li>
          <li><strong>One build</strong> — write code that uses it, however small. Code that runs beats notes that look tidy.</li>
          <li><strong>One variation</strong> — change the dataset, the tool, or the goal so you leave the tutorial's rails.</li>
          <li><strong>One write-up</strong> — a few paragraphs on what broke and why. This becomes your portfolio and your interview material.</li>
          <li><strong>One review</strong> — re-run your eval or test file from earlier weeks so old work does not silently rot.</li>
        </ol>
        <p>Four weeks of that rhythm finishes a stage. Fifteen stages is therefore about a year — which matches the pacing table at the top, and is a far more realistic plan than any 30-day promise.</p>

        <h3 class="lesson-subhead" id="of-resources">Resources and next lessons</h3>
        <ul>
          <li><strong>Next in this track</strong> — <a href="/learn/agentic-ai/agents">Agents</a> covers Stages 7–10 in depth: planning, tool selection, control flow, reflection and failure modes.</li>
          <li><strong>Then</strong> — <a href="/learn/agentic-ai/genai-platform">Building a Generative AI Platform</a> is the concrete architecture for Stages 6, 12 and 14: context construction, guardrails, routing, caching, write actions and observability.</li>
          <li><strong>And</strong> — <a href="/learn/agentic-ai/ai-pitfalls">Common Pitfalls When Building GenAI Applications</a> is the failure catalogue for the whole roadmap; read it before starting any project.</li>
          <li><strong>Foundations reading</strong> — Chip Huyen's <em>Designing Machine Learning Systems</em> for Phase 2 discipline and <em>AI Engineering</em> for Phases 3–5.</li>
          <li><strong>Deep learning</strong> — Andrej Karpathy's <a href="https://karpathy.ai/zero-to-hero.html" rel="noopener noreferrer" target="_blank">Neural Networks: Zero to Hero</a> is the best possible companion to Stage 3, and his GPT-from-scratch video covers Stage 4's transformer.</li>
          <li><strong>Transformers</strong> — Vaswani et al., <a href="https://arxiv.org/abs/1706.03762" rel="noopener noreferrer" target="_blank">Attention Is All You Need</a> (2017), and Jay Alammar's <a href="https://jalammar.github.io/illustrated-transformer/" rel="noopener noreferrer" target="_blank">Illustrated Transformer</a> for the visual version.</li>
          <li><strong>Agents</strong> — Anthropic's <a href="https://www.anthropic.com/engineering/building-effective-agents" rel="noopener noreferrer" target="_blank">Building effective agents</a> for Stage 7–8 restraint, and the <a href="https://modelcontextprotocol.io" rel="noopener noreferrer" target="_blank">Model Context Protocol docs</a> for Stage 9.</li>
          <li><strong>Security</strong> — the <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" rel="noopener noreferrer" target="_blank">OWASP Top 10 for LLM Applications</a>, essential before Stage 11's write actions.</li>
        </ul>

        <h3 class="lesson-subhead" id="of-check">Self-check</h3>
        <ol>
          <li>Why is starting with an agent framework a bad first move, in two concrete failure terms?</li>
          <li>Which three Stage 0 topics turn out to be exactly what tool calling is made of?</li>
          <li>Where does linear algebra pay off later, and where does calculus?</li>
          <li>Name four classical ML concepts and their agentic-AI equivalents.</li>
          <li>Why build a neural network from scratch once, even though you will never pre-train a model?</li>
          <li>What is the difference between measuring retrieval recall and measuring answer quality, and why do you need both?</li>
          <li>Write the agent formula, and name the four controls every loop needs.</li>
          <li>What are the ten framework-independent concepts from Stage 8?</li>
          <li>State the MCP idea in one sentence, and name its main security risk.</li>
          <li>Give three multi-agent patterns and one situation where each is the wrong choice.</li>
          <li>What are the six questions of agent evaluation?</li>
          <li>Name five things in Stage 12 that have nothing to do with machine learning.</li>
        </ol>
        <p><strong>Sketch answers:</strong> (1) you cannot see the exact prompt being sent, and you inherit bugs and silent prompt changes you did not write; (2) HTTP, JSON and async — a tool call is an HTTP request with a JSON body, often concurrent; (3) vectors and dot products become embeddings and cosine similarity, gradients are needed once to understand backpropagation; (4) train/test split → dev and held-out eval sets, overfitting → prompts tuned to 20 examples, feature engineering → context construction, leakage → benchmark contamination; (5) because it converts the inside of a model from magic into arithmetic you have personally performed; (6) recall asks whether the right chunk was retrieved at all, quality asks what the model did with it — prompt tuning cannot fix a recall failure; (7) LLM + tools + memory + reasoning + loop, with max steps, cost budget, wall-clock timeout and repeat-call detection; (8) state, node, tool, router, condition, human approval, retry, checkpoint, persistence, observability; (9) a standardised way for AI applications to discover and use external capabilities — the risk is broad credentials plus untrusted content, so scope permissions and gate irreversible actions; (10) sequential is wrong when a plain pipeline would do, debate is wrong for questions with one right answer, reviewer/critic is wrong when latency matters more than polish; (11) correct tool, correct sequence, recovery from failure, goal achieved, cost, duration; (12) retries, timeouts, circuit breakers, idempotency, queues, secrets management, tenant isolation — pick any five.</p>
        <p class="lesson-flow">You are here → Stage 0. The next box is the only one that matters today.</p>
      `,
    },
  ],
  sourceNote:
    'Roadmap structure and stage breakdown by Binod Suman. Expanded for this lesson with pacing estimates, phase checkpoints, project grading criteria, comparison tables, 2026 additions (reasoning models, long-context limits, model tiering, MCP security, durable workflows, trajectory evaluation) and nineteen original colour-coded diagrams. External books, papers and documentation are credited inline where referenced.',
};
