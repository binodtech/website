/** Full lesson: Agentic AI — Common pitfalls when building generative AI applications.
 *  Original BinodTech teaching material. Pitfalls 1-6 follow the taxonomy from
 *  Chip Huyen's essay (Jan 2025) and cover every point in it; pitfall 7 collects
 *  failure modes that became common after that essay was written.
 */

export type LessonSubsection = { id: string; title: string };

export type LessonSection = {
  id: string;
  title: string;
  html: string;
  children?: LessonSubsection[];
};

export const agenticAiPitfalls = {
  slug: 'ai-pitfalls',
  title: 'Common Pitfalls When Building Generative AI Applications',
  subtitle:
    'The mistakes that waste the most time and money — reaching for generative AI when you do not need it, blaming the model for a product problem, starting too complex, trusting an early demo, dropping human evaluation, and letting a wishlist replace a strategy.',
  byline: 'Agentic AI track · Lesson 3 · ~2h 15m read · All levels',
  interviewTip:
    'When asked "how would you approach this AI project?", start by trying to disqualify AI: what does the dumb baseline score, and what would we do with the result? Interviewers remember the candidate who says "before we fine-tune anything, I want a 200-example eval set and one week of daily human review" — because that is what the job actually is.',
  sections: [
    {
      id: 'intro',
      title: 'How to Use This Lesson',
      children: [
        { id: 'intro-why', title: 'Why the same mistakes repeat' },
        { id: 'intro-map', title: 'The six classics, plus what changed since' },
      ],
      html: `
        <p>Everything else in this track teaches you how to build. This lesson is about what goes wrong — and the failures are remarkably consistent across companies, sectors and team sizes. If you have shipped anything with a foundation model, you will recognise at least three of these from your own project.</p>

        <h3 class="lesson-subhead" id="intro-why">Why the same mistakes repeat</h3>
        <p>None of these pitfalls come from ignorance. They come from incentives.</p>
        <ul>
          <li>"We used AI" is easier to present to a leadership team than "we solved the problem".</li>
          <li>A demo takes a weekend; a product takes quarters — and the demo is what gets applauded.</li>
          <li>Adopting a framework feels like progress, while writing forty lines of your own feels like falling behind.</li>
          <li>Automated evaluation looks scalable, and reading outputs by hand looks like something a junior should do.</li>
        </ul>
        <p>Each pitfall below is a locally rational decision with a bad global outcome. That is why knowing about them is not enough — you need the counter-habit written into how your team works.</p>

        <h3 class="lesson-subhead" id="intro-map">The six classics, plus what changed since</h3>
        <p>Sections 1 to 6 are the durable ones, in the order they usually bite a project: a bad problem choice, a product problem misdiagnosed as a model problem, premature complexity, a misleading demo, missing human evaluation, and no strategy behind the use cases.</p>
        <p>Section 7 collects the pitfalls that became common <em>after</em> the classics were first written up — the ones created by reasoning models, huge context windows, standardised tool calling and cheap agent frameworks. New capabilities did not remove the old traps; they added faster ways to reach them.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Map of where each pitfall strikes across the project lifecycle: problem choice, prototype, product, scale and portfolio">
            <defs>
              <marker id="ah-map" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <path class="dg-line" d="M20 104 H690" marker-end="url(#ah-map)" />
            <rect class="dg-box r" x="24" y="34" width="118" height="44" rx="8" />
            <text class="dg-s" x="83" y="53" text-anchor="middle">1 · wrong tool</text>
            <text class="dg-s" x="83" y="68" text-anchor="middle">for the problem</text>
            <text class="dg-h" x="24" y="128">PROBLEM CHOICE</text>
            <rect class="dg-box o" x="164" y="120" width="118" height="44" rx="8" />
            <text class="dg-s" x="223" y="139" text-anchor="middle">3 · started</text>
            <text class="dg-s" x="223" y="154" text-anchor="middle">too complex</text>
            <text class="dg-h" x="164" y="90">PROTOTYPE</text>
            <rect class="dg-box r" x="304" y="34" width="118" height="44" rx="8" />
            <text class="dg-s" x="363" y="53" text-anchor="middle">2 · blamed the</text>
            <text class="dg-s" x="363" y="68" text-anchor="middle">model, not the UX</text>
            <rect class="dg-box o" x="304" y="120" width="118" height="44" rx="8" />
            <text class="dg-s" x="363" y="139" text-anchor="middle">4 · trusted the</text>
            <text class="dg-s" x="363" y="154" text-anchor="middle">early demo</text>
            <text class="dg-h" x="304" y="182">PRODUCT</text>
            <rect class="dg-box r" x="444" y="34" width="118" height="44" rx="8" />
            <text class="dg-s" x="503" y="53" text-anchor="middle">5 · no human</text>
            <text class="dg-s" x="503" y="68" text-anchor="middle">evaluation</text>
            <rect class="dg-box o" x="444" y="120" width="118" height="44" rx="8" />
            <text class="dg-s" x="503" y="139" text-anchor="middle">7 · newer traps</text>
            <text class="dg-s" x="503" y="154" text-anchor="middle">cost · context · agents</text>
            <text class="dg-h" x="444" y="182">SCALE</text>
            <rect class="dg-box r" x="584" y="34" width="118" height="44" rx="8" />
            <text class="dg-s" x="643" y="53" text-anchor="middle">6 · wishlist</text>
            <text class="dg-s" x="643" y="68" text-anchor="middle">instead of strategy</text>
            <text class="dg-h" x="584" y="128">PORTFOLIO</text>
          </svg>
          <figcaption>Figure 1 — Pitfalls cluster by project stage. The expensive ones (1 and 6) happen before anyone writes code, which is why they survive so long undetected.</figcaption>
        </figure>
      `,
    },
    {
      id: 'pitfall-1',
      title: '1. Use Generative AI When You Do Not Need Generative AI',
      children: [
        { id: 'p1-story', title: 'The energy-scheduling story' },
        { id: 'p1-baselines', title: 'The baselines that keep winning' },
        { id: 'p1-test', title: 'A five-question disqualification test' },
      ],
      html: `
        <p>Every new technology produces the same sigh from experienced engineers: not everything is a nail. Generative AI makes the urge worse, because a model that can plausibly attempt <em>any</em> text task creates the illusion that it is the right way to do any text task.</p>

        <h3 class="lesson-subhead" id="p1-story">The energy-scheduling story</h3>
        <p>The clearest example I know of comes from Chip Huyen's write-up of this pitfall. A team pitched an app that reduced household electricity bills by feeding a list of energy-hungry chores and hourly tariffs into a language model and asking it to produce a schedule. Their measurements showed roughly a 30% saving. Genuinely useful — who would say no?</p>
        <p>The question that ended the project was simply: how does that compare to a rule anyone could write in an afternoon — run the washing machine and charge the car after 10pm, when power is cheapest? They said they would check. They never came back with a number, and the app was dropped shortly after.</p>
        <p>Notice what went wrong. The 30% was real. The problem was that nobody knew how much of it belonged to the model rather than to the obvious rule, and that comparison decides whether the product exists at all. Even where a greedy rule is not optimal, scheduling under price constraints is a solved problem — linear programming answers it exactly, cheaply, and identically every time.</p>
        <p>Huyen lists other versions of the same instinct that she has seen in large organisations: detecting anomalies in network traffic, forecasting inbound call volume, and — worryingly — screening hospital patients for malnutrition. Each is a well-studied task with established methods, evaluation practices and, in the clinical case, an accountability trail that a probabilistic text generator cannot provide.</p>

        <h3 class="lesson-subhead" id="p1-baselines">The baselines that keep winning</h3>
        <p>Before building, work out which of these already solves your problem. If one does, it will be cheaper, faster, more predictable and easier to explain to an auditor.</p>
        <table>
          <thead><tr><th>If the task is…</th><th>Reach for</th><th>Why it beats a model</th></tr></thead>
          <tbody>
            <tr><td>Scheduling or allocation under constraints</td><td>Linear / integer programming, greedy heuristics</td><td>Provably optimal, deterministic, milliseconds</td></tr>
            <tr><td>Forecasting a number from history</td><td>Time-series models, gradient boosting</td><td>Calibrated intervals, cheap retraining</td></tr>
            <tr><td>Fraud or anomaly detection at volume</td><td>Supervised classifiers, statistical detectors</td><td>Precision/recall you can tune and defend</td></tr>
            <tr><td>Ranking or recommendation</td><td>Learning-to-rank, collaborative filtering</td><td>Trains on your own click data</td></tr>
            <tr><td>Extraction from fixed-layout documents</td><td>Templates, OCR plus rules</td><td>Deterministic, auditable, no drift</td></tr>
            <tr><td>Routing to the right queue</td><td>Small text classifier</td><td>Tiny, fast, easy to monitor</td></tr>
            <tr><td>Clinical or legal decisions</td><td>Validated instruments, human experts</td><td>Accountability and regulation</td></tr>
          </tbody>
        </table>
        <p>Generative models genuinely dominate where the output is open-ended language or code, where the input is messy and unstructured, where the task changes faster than you could label data, and where a human is reviewing the result anyway. That is a large space — it is just not every space.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Decision path from problem to solution: rules, classical machine learning, or generative AI, with a mandatory baseline comparison">
            <defs>
              <marker id="ah-dec" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="20" y="104" width="130" height="46" rx="9" />
            <text class="dg-t" x="85" y="124" text-anchor="middle">The problem</text>
            <text class="dg-s" x="85" y="140" text-anchor="middle">stated as an outcome</text>
            <rect class="dg-box p" x="188" y="104" width="146" height="46" rx="9" />
            <text class="dg-t" x="261" y="124" text-anchor="middle">Is the output</text>
            <text class="dg-s" x="261" y="140" text-anchor="middle">open-ended language?</text>
            <rect class="dg-box g" x="376" y="24" width="150" height="44" rx="9" />
            <text class="dg-s" x="451" y="43" text-anchor="middle">No, it is a number</text>
            <text class="dg-s" x="451" y="58" text-anchor="middle">→ classical ML</text>
            <rect class="dg-box g" x="376" y="80" width="150" height="44" rx="9" />
            <text class="dg-s" x="451" y="99" text-anchor="middle">No, it is a decision</text>
            <text class="dg-s" x="451" y="114" text-anchor="middle">→ rules / optimisation</text>
            <rect class="dg-box o" x="376" y="136" width="150" height="44" rx="9" />
            <text class="dg-s" x="451" y="155" text-anchor="middle">Yes, and messy input</text>
            <text class="dg-s" x="451" y="170" text-anchor="middle">→ generative AI</text>
            <rect class="dg-box r" x="376" y="192" width="150" height="44" rx="9" />
            <text class="dg-s" x="451" y="211" text-anchor="middle">Nobody can say</text>
            <text class="dg-s" x="451" y="226" text-anchor="middle">→ stop, define success</text>
            <rect class="dg-box" x="560" y="104" width="140" height="46" rx="9" />
            <text class="dg-t" x="630" y="124" text-anchor="middle">Beat the baseline</text>
            <text class="dg-s" x="630" y="140" text-anchor="middle">or do not ship</text>
            <path class="dg-line" d="M150 127 H184" marker-end="url(#ah-dec)" />
            <path class="dg-line" d="M334 127 H356 V46 H372" marker-end="url(#ah-dec)" />
            <path class="dg-line" d="M334 127 H356 V102 H372" marker-end="url(#ah-dec)" />
            <path class="dg-line" d="M334 127 H356 V158 H372" marker-end="url(#ah-dec)" />
            <path class="dg-line dash" d="M334 127 H356 V214 H372" marker-end="url(#ah-dec)" />
            <path class="dg-line" d="M526 46 H544 V124 H556" marker-end="url(#ah-dec)" />
            <path class="dg-line" d="M526 158 H544 V130 H556" marker-end="url(#ah-dec)" />
          </svg>
          <figcaption>Figure 2 — Every path ends at the same gate. A solution that cannot beat the obvious baseline is not a solution, however impressive its internals.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p1-test">A five-question disqualification test</h3>
        <p>Run this before the first line of code. The goal is to <em>try to kill the idea</em> — anything that survives is worth building.</p>
        <ol class="lesson-steps">
          <li><strong>What is the dumbest thing that could work,</strong> and what does it score? A keyword rule, a lookup table, a greedy heuristic. Write the number down.</li>
          <li><strong>What decision changes</strong> because of the output? If nobody acts differently, you are building a demo.</li>
          <li><strong>Who is accountable</strong> when it is wrong, and can they be? If the answer involves health, credit, employment or law, non-determinism is a liability, not a feature.</li>
          <li><strong>What does a wrong answer cost,</strong> and how would we notice? Silent failure at volume is the expensive kind.</li>
          <li><strong>Would we still do this</strong> if we could not mention AI anywhere? If the honest answer is no, you have a headline, not a product.</li>
        </ol>
        <p>Exploring a new approach purely to learn what is now possible is legitimate and often valuable — as long as everyone is clear that the objective is testing a solution rather than solving a problem. Those two activities need different funding, different timelines and very different success criteria. "We solved the problem" and "we used generative AI" are two different achievements, and it is worth being honest about which one you are pursuing.</p>
      `,
    },
    {
      id: 'pitfall-2',
      title: "2. Confuse 'Bad Product' With 'Bad AI'",
      children: [
        { id: 'p2-cases', title: 'Three cases where the model was fine' },
        { id: 'p2-helpful', title: 'Correct is not the same as helpful' },
        { id: 'p2-friction', title: 'UX patterns that remove the friction' },
      ],
      html: `
        <p>This is the opposite failure, and it is just as expensive. A team tries generative AI, users dislike the result, and the conclusion is "the technology is not ready for our use case" — while a competitor ships something similar and users love it. When you can actually look inside those projects, the difference is usually not the model. It is the product.</p>
        <p>Engineers say this out loud constantly: the technical part turned out to be the easy part. What is hard is deciding what the interface should be, where the feature belongs in an existing workflow, and how a human stays in the loop without feeling babysat.</p>
        <p>And UX is harder here than in normal software, because the ground is still moving. Generative AI is visibly changing how people read, write, learn, teach and work — but nobody yet knows what the settled version of those activities looks like. You are designing for a workflow that has not stabilised.</p>

        <h3 class="lesson-subhead" id="p2-cases">Three cases where the model was fine</h3>
        <p>These examples come from Huyen's essay, and they are worth internalising because in all three the fix was product work, not model work.</p>
        <ul class="lesson-layers">
          <li><strong>Meeting summaries.</strong> A team building transcript summarisation spent its energy on the right length — three sentences or five? User research showed the summary itself was close to irrelevant. What people wanted was the list of action items <em>assigned to them</em>. The winning feature was a different output, not a better one.</li>
          <li><strong>LinkedIn's skill-fit assessment.</strong> Their chatbot could tell a user they were a poor match for a role. Accurate, and useless: "you are a terrible fit" gives the user nothing to do. People wanted the gaps named and advice on closing them. Correctness was never the constraint — helpfulness was.</li>
          <li><strong>Intuit's tax assistant.</strong> Early feedback was flat. The cause turned out to be the blank input box: facing an empty chat, users had no idea what the bot could do or how to phrase a question, and typing itself was a barrier. Adding a few clickable suggested questions per turn lowered the friction, built trust gradually, and turned the sentiment around. (Shared by Intuit's VP of AI, Nhung Ho.)</li>
        </ul>
        <p>The pattern across all three: the model was capable of the right behaviour the whole time. What changed was what the product asked it for and how the result was presented.</p>

        <h3 class="lesson-subhead" id="p2-helpful">Correct is not the same as helpful</h3>
        <p>This distinction deserves its own paragraph because it is the most transferable idea in the lesson. Most evaluation setups measure correctness, since correctness is what you can grade automatically. Users experience something else: did this move me forward?</p>
        <table>
          <thead><tr><th>Situation</th><th>Correct response</th><th>Helpful response</th></tr></thead>
          <tbody>
            <tr><td>Poor fit for a job</td><td>"You are not a fit."</td><td>The three missing skills, and a route to each</td></tr>
            <tr><td>Unanswerable from your data</td><td>"I don't know."</td><td>What is missing, plus who or where can answer it</td></tr>
            <tr><td>Request is out of policy</td><td>"That is not permitted."</td><td>The rule, the reason, and the nearest allowed option</td></tr>
            <tr><td>Ambiguous question</td><td>An answer to one reading of it</td><td>One clarifying question with two concrete choices</td></tr>
            <tr><td>Long document summary</td><td>An accurate précis</td><td>The parts that affect the reader's decision</td></tr>
          </tbody>
        </table>
        <p>If your rubric only rewards column two, your team will optimise towards outputs users quietly resent. Add helpfulness — actionability, next step present, ambiguity surfaced — as an explicit scored dimension.</p>

        <h3 class="lesson-subhead" id="p2-friction">UX patterns that remove the friction</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 205" role="img" aria-label="A blank chat box compared with an assisted interface offering suggested prompts, cited sources, an edit affordance and feedback controls">
            <rect class="dg-band" x="12" y="28" width="330" height="164" rx="12" />
            <text class="dg-h" x="24" y="20">WHAT USERS GET STUCK ON</text>
            <rect class="dg-box" x="30" y="44" width="294" height="46" rx="8" />
            <text class="dg-s" x="177" y="66" text-anchor="middle">“Ask me anything”</text>
            <text class="dg-s" x="177" y="82" text-anchor="middle">a blank box and a blinking cursor</text>
            <text class="dg-s" x="30" y="112">· no idea what it can do</text>
            <text class="dg-s" x="30" y="132">· typing is work</text>
            <text class="dg-s" x="30" y="152">· one bad answer ends the trust</text>
            <text class="dg-s" x="30" y="172">· no way to correct it</text>

            <rect class="dg-band" x="378" y="28" width="330" height="164" rx="12" />
            <text class="dg-h" x="390" y="20">WHAT WORKS INSTEAD</text>
            <rect class="dg-box g" x="392" y="44" width="140" height="26" rx="6" />
            <text class="dg-s" x="462" y="61" text-anchor="middle">suggested questions</text>
            <rect class="dg-box g" x="544" y="44" width="150" height="26" rx="6" />
            <text class="dg-s" x="619" y="61" text-anchor="middle">visible capabilities</text>
            <rect class="dg-box b" x="392" y="80" width="140" height="26" rx="6" />
            <text class="dg-s" x="462" y="97" text-anchor="middle">cited sources</text>
            <rect class="dg-box b" x="544" y="80" width="150" height="26" rx="6" />
            <text class="dg-s" x="619" y="97" text-anchor="middle">editable draft, not verdict</text>
            <rect class="dg-box o" x="392" y="116" width="140" height="26" rx="6" />
            <text class="dg-s" x="462" y="133" text-anchor="middle">confidence + gaps</text>
            <rect class="dg-box o" x="544" y="116" width="150" height="26" rx="6" />
            <text class="dg-s" x="619" y="133" text-anchor="middle">one-click undo</text>
            <rect class="dg-box p" x="392" y="152" width="302" height="26" rx="6" />
            <text class="dg-s" x="543" y="169" text-anchor="middle">thumbs + “what was wrong?” → straight into your eval set</text>
          </svg>
          <figcaption>Figure 3 — None of the right-hand column requires a better model. All of it requires product decisions, and the bottom row is also how you get training and evaluation data for free.</figcaption>
        </figure>
        <p>Since everyone has access to broadly similar models, the AI component of most AI products is close to commodity. Whatever advantage you have is in the product: the workflow you chose, the friction you removed, the trust you earned, and the feedback loop you built. That is a slightly deflating conclusion for engineers and a very freeing one for teams — it means the differentiator is something you fully control.</p>
        <div class="lesson-callout"><strong>Diagnostic.</strong> Before concluding the model is not good enough, run this test: hand the same task to a competent human with the same information the model had, and show users the human's output blind. If users dislike that too, you have a product problem, not a model problem.</div>
      `,
    },
    {
      id: 'pitfall-3',
      title: '3. Start Too Complex',
      children: [
        { id: 'p3-forms', title: 'The four classic over-builds' },
        { id: 'p3-abstractions', title: 'What early abstractions cost you' },
        { id: 'p3-ladder', title: 'The simplest-thing-first ladder' },
      ],
      html: `
        <p>New tooling is genuinely exciting, and adopting it feels like doing the work properly. But reaching for the sophisticated option first is one of the most reliable ways to slow a project down.</p>

        <h3 class="lesson-subhead" id="p3-forms">The four classic over-builds</h3>
        <p>Huyen names four, and they remain the four you will see most often:</p>
        <ol class="lesson-steps">
          <li><strong>An agent framework where plain API calls would do.</strong> If your flow is "retrieve, then answer", it is a function, not an agent.</li>
          <li><strong>Weeks spent choosing a vector database</strong> when keyword retrieval solves the task and needs no vector store at all.</li>
          <li><strong>Fine-tuning when prompting works.</strong> Fine-tuning commits you to a data pipeline, a training loop, versioned artefacts and a migration every time you change base model.</li>
          <li><strong>Semantic caching.</strong> Discussed in the platform lesson: its correctness depends on embeddings, vector search and a hand-tuned threshold, and a false hit answers a question the user never asked.</li>
        </ol>
        <p>To that list I would add three that have become just as common: standing up a multi-agent topology for a single-agent job, adding a graph database before proving that flat retrieval fails, and building a fine-tuning pipeline before anyone has written an eval set to prove the tuned model is better.</p>

        <h3 class="lesson-subhead" id="p3-abstractions">What early abstractions cost you</h3>
        <p>Pulling in heavy tooling too early causes two specific harms.</p>
        <p><strong>It hides the details you most need to see.</strong> The single most valuable artefact when debugging a generative AI application is the exact string sent to the model. A framework that assembles that string for you, several layers down, converts a five-minute fix into an afternoon of reading someone else's source. Early on you should be able to print your entire prompt on demand.</p>
        <p><strong>It introduces bugs you did not write.</strong> Framework authors are ordinary engineers; their default prompts contain typos and questionable instructions. Reviewing framework code and finding mistakes in shipped default prompts is a common experience. Worse, if a library changes its internal prompt in a minor release, your application's behaviour changes and nothing in your own repository explains why.</p>
        <p>This is not an argument against abstraction. Good abstractions are how engineering scales — but a good abstraction encodes practices that have been tested over time, and AI engineering is young enough that the practices are still being worked out. Adopt deliberately, pin versions, read the code you depend on, and know what it would take to remove.</p>
        <table>
          <thead><tr><th>Reach for the complex option when…</th><th>Not when…</th></tr></thead>
          <tbody>
            <tr><td>The simple version is measurably failing on your eval set</td><td>You have not built an eval set</td></tr>
            <tr><td>You have three or more flows sharing components</td><td>You have one flow</td></tr>
            <tr><td>Keyword retrieval demonstrably misses paraphrases users type</td><td>You assume it will</td></tr>
            <tr><td>Prompting has plateaued and you have hundreds of good examples</td><td>Prompting is untuned</td></tr>
            <tr><td>Your cache hit rate justifies the false-hit risk</td><td>You have not measured hit rate</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="p3-ladder">The simplest-thing-first ladder</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 215" role="img" aria-label="Escalation ladder from a direct API call up to fine-tuning, with the rule that each rung requires evidence from the one below">
            <defs>
              <marker id="ah-lad3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="16" y="152" width="126" height="44" rx="8" />
            <text class="dg-s" x="79" y="171" text-anchor="middle">direct API call</text>
            <text class="dg-s" x="79" y="186" text-anchor="middle">+ a good prompt</text>
            <rect class="dg-box b" x="156" y="126" width="126" height="44" rx="8" />
            <text class="dg-s" x="219" y="145" text-anchor="middle">+ keyword</text>
            <text class="dg-s" x="219" y="160" text-anchor="middle">retrieval</text>
            <rect class="dg-box g" x="296" y="100" width="126" height="44" rx="8" />
            <text class="dg-s" x="359" y="119" text-anchor="middle">+ embeddings</text>
            <text class="dg-s" x="359" y="134" text-anchor="middle">and rerank</text>
            <rect class="dg-box o" x="436" y="74" width="126" height="44" rx="8" />
            <text class="dg-s" x="499" y="93" text-anchor="middle">+ tools, loops</text>
            <text class="dg-s" x="499" y="108" text-anchor="middle">(an agent)</text>
            <rect class="dg-box r" x="576" y="48" width="126" height="44" rx="8" />
            <text class="dg-s" x="639" y="67" text-anchor="middle">+ fine-tuning</text>
            <text class="dg-s" x="639" y="82" text-anchor="middle">or a framework</text>
            <path class="dg-line" d="M142 170 H152" marker-end="url(#ah-lad3)" />
            <path class="dg-line" d="M282 144 H292" marker-end="url(#ah-lad3)" />
            <path class="dg-line" d="M422 118 H432" marker-end="url(#ah-lad3)" />
            <path class="dg-line" d="M562 92 H572" marker-end="url(#ah-lad3)" />
            <text class="dg-h" x="16" y="28">ONE RUNG PER PROVEN FAILURE — AND THE EVAL SET COMES FIRST</text>
            <text class="dg-s" x="16" y="44">Each step up buys capability and costs debuggability. Never skip two rungs at once.</text>
          </svg>
          <figcaption>Figure 4 — The ladder is not a maturity model to climb as fast as possible. Most successful products live permanently on rungs one to three.</figcaption>
        </figure>
        <p>The discipline is simple to state and hard to follow: <strong>you may only move up a rung when you can show, on your evaluation set, that the rung below is failing.</strong> That rule protects you from the most demoralising failure mode in this field — a complicated system nobody can debug, which may or may not be better than the version you replaced.</p>
      `,
    },
    {
      id: 'pitfall-4',
      title: '4. Over-Index on Early Success',
      children: [
        { id: 'p4-curve', title: 'The last 15% takes most of the year' },
        { id: 'p4-walls', title: 'The specific walls teams hit' },
        { id: 'p4-external', title: 'Reliability, compliance and safety' },
        { id: 'p4-planning', title: 'Planning with cautious optimism' },
      ],
      html: `
        <p>This is usually the first genuinely painful lesson of an AI project, and almost nobody escapes it. A weekend prototype produces something startlingly good, everyone updates their expectations, and then progress falls off a cliff.</p>

        <h3 class="lesson-subhead" id="p4-curve">The last 15% takes most of the year</h3>
        <p>The published numbers are consistent enough to plan around.</p>
        <ul class="lesson-layers">
          <li><strong>LinkedIn</strong> reached about 80% of their target experience in roughly one month, then needed about four more months to get past 95% — and described how discouraging each additional percentage point became, particularly around hallucinations.</li>
          <li><strong>An e-commerce AI sales assistant startup</strong> reported that going from 0 to 80% took about as long as going from 80% to 90%.</li>
          <li><strong>The UltraChat authors</strong> (Ding et al., 2023) put the same shape more bluntly, noting that getting from zero to sixty is easy while</li>
        </ul>
        <blockquote>
          <p>“progressing from 60 to 100 becomes exceedingly challenging.”</p>
          <cite>Ding et al., <a href="https://arxiv.org/abs/2305.14233" rel="noopener noreferrer" target="_blank">UltraChat</a> (2023)</cite>
        </blockquote>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 235" role="img" aria-label="Curve showing quality rising steeply in the first month to eighty percent then flattening, taking four more months to pass ninety-five percent">
            <defs>
              <marker id="ah-curve" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <path class="dg-line" d="M70 30 V186 H660" />
            <text class="dg-s" x="62" y="36" text-anchor="end">100%</text>
            <text class="dg-s" x="62" y="70" text-anchor="end">95%</text>
            <text class="dg-s" x="62" y="105" text-anchor="end">80%</text>
            <text class="dg-s" x="62" y="190" text-anchor="end">0%</text>
            <path class="dg-line dash" d="M70 66 H660" opacity="0.35" />
            <path class="dg-line dash" d="M70 101 H660" opacity="0.35" />
            <path class="dg-line hot" d="M70 186 C 100 150, 130 118, 188 101" />
            <path class="dg-line" d="M188 101 C 300 92, 420 78, 640 63" />
            <path class="dg-line dash" d="M188 101 V186" opacity="0.5" />
            <text class="dg-s" x="196" y="128">month 1: the demo</text>
            <text class="dg-s" x="196" y="145">that got everyone excited</text>
            <text class="dg-s" x="330" y="205" text-anchor="middle">months 2–5: hallucinations, latency, tool confusion, tone, testing</text>
            <text class="dg-s" x="130" y="205" text-anchor="middle">1 month</text>
            <text class="dg-s" x="600" y="205" text-anchor="middle">5 months</text>
            <text class="dg-h" x="70" y="20">EXPERIENCE QUALITY</text>
            <text class="dg-s" x="648" y="46" text-anchor="end">each further 1% costs more than the last</text>
          </svg>
          <figcaption>Figure 5 — Shape of every serious project. The dangerous moment is the elbow, because that is when the roadmap gets written by someone extrapolating from the steep part.</figcaption>
        </figure>
        <p>Building a demo is easy; building a product is hard. Demos are graded on the best case you can produce; products are graded on the worst case a user can trigger. Between those two standards sits every hard problem in the field.</p>

        <h3 class="lesson-subhead" id="p4-walls">The specific walls teams hit</h3>
        <p>The e-commerce team's list is worth keeping, because it is unusually concrete about what the second half of the work consists of:</p>
        <ul>
          <li><strong>Accuracy against latency.</strong> More planning and self-correction means more steps, and more steps mean a slower answer. The two goals pull directly against each other.</li>
          <li><strong>Tool calling.</strong> Agents struggle to distinguish between tools that resemble each other — the failure is in your API design as much as in the model.</li>
          <li><strong>Tone instructions.</strong> A system prompt asking the assistant to sound like a luxury-brand concierge is followed loosely and inconsistently. Style is far less controllable than content.</li>
          <li><strong>Intent understanding.</strong> Getting the model to fully grasp what a customer actually wants remains hard, especially in short or emotional messages.</li>
          <li><strong>Testing.</strong> You cannot enumerate unit tests when the space of possible queries is effectively infinite, so you need sampled evaluation sets and monitoring instead of exhaustive tests.</li>
        </ul>
        <p>Add hallucinations, which sit behind more of the remaining gap than any other single cause, and you have an accurate picture of months two through five.</p>

        <h3 class="lesson-subhead" id="p4-external">Reliability, compliance and safety</h3>
        <p>Then there is a second category — problems that have nothing to do with model quality and will not appear in any prototype.</p>
        <table>
          <thead><tr><th>Category</th><th>What actually happens</th><th>What it forces you to build</th></tr></thead>
          <tbody>
            <tr><td>Provider reliability</td><td>One team reported around 10% of their API calls timing out. Model versions change underneath you and behaviour shifts with them.</td><td>Retries with backoff, fallback models, a gateway, pinned versions, regression evals on every model change</td></tr>
            <tr><td>Compliance</td><td>Copyright status of generated output, data access and sharing rules, user privacy, security exposure through retrieval and caching layers, unclear training-data lineage</td><td>Data maps, retention and redaction policy, tenant isolation in caches and indexes, legal review of outputs</td></tr>
            <tr><td>Safety</td><td>Bad actors probing your product; the system producing insensitive or offensive content under your brand</td><td>Abuse detection and rate limits, input and output guardrails, an incident path, red-teaming before launch</td></tr>
          </tbody>
        </table>
        <p>Note how much of that is ordinary platform engineering rather than machine learning. That is exactly why it gets left out of estimates written during the exciting first month.</p>

        <h3 class="lesson-subhead" id="p4-planning">Planning with cautious optimism</h3>
        <p>The useful phrase for this posture is <em>cautiously optimistic</em>: assume the technology will work, and assume the path to production is longer than the path to the demo.</p>
        <ol class="lesson-steps">
          <li>Set milestones on <strong>quality thresholds</strong>, not dates: "95% on the eval set at p95 under two seconds", not "launch in March".</li>
          <li>Budget the phases separately. If the prototype took a month, plan several months for hardening — and say so out loud when the demo lands, while everyone is happy.</li>
          <li>Define the launch bar before you start, including what failure rate is acceptable and who signs off.</li>
          <li>Track the flat part explicitly: quality per week, cost per task, and human-intervention rate. A stalled metric is information, not shame.</li>
          <li>Keep a kill criterion. Some demos never become products, and stopping at month three costs far less than stopping at month twelve.</li>
        </ol>
        <div class="lesson-callout"><strong>Say this at demo time:</strong> "This is the 80% version. Historically the remaining 15% costs three to five times what we just spent, and most of it is hallucinations, latency and edge cases rather than features." It is much easier to say before expectations harden than after.</div>
      `,
    },
    {
      id: 'pitfall-5',
      title: '5. Forgo Human Evaluation',
      children: [
        { id: 'p5-judges', title: 'AI judges are applications too' },
        { id: 'p5-daily', title: 'The daily review habit' },
        { id: 'p5-guidelines', title: 'Annotation guidelines earn their keep twice' },
        { id: 'p5-judgefails', title: 'How judges fail, concretely' },
      ],
      html: `
        <p>To evaluate at any scale, teams reach for AI-as-a-judge: a model scoring another model's output. It is a genuinely useful technique. The pitfall is dropping human evaluation entirely once the automated scores start flowing.</p>

        <h3 class="lesson-subhead" id="p5-judges">AI judges are applications too</h3>
        <p>A judge is not a measuring instrument in the way a unit test is. It is another probabilistic system whose quality depends on the judge model, the judge prompt, and the specifics of your use case. Build it carelessly and it will report confident, precise, wrong numbers about your product — the worst possible outcome, because it feels like data.</p>
        <p>Which means a judge must be developed, validated and iterated exactly like the application it grades. It needs its own set of examples with known-correct scores, its own version history, and its own regression checks when you change the judge model.</p>
        <p>The teams with the best products all keep human evaluation alongside the automated kind. In practice that looks like a human expert grading a sample of real outputs every day — typically somewhere between 30 and 1,000 examples depending on volume and stakes.</p>

        <h3 class="lesson-subhead" id="p5-daily">The daily review habit</h3>
        <p>That daily pass does three distinct jobs, and each one justifies it on its own.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 225" role="img" aria-label="Chart comparing an AI judge score rising while the human score falls, showing the divergence that signals a broken judge">
            <path class="dg-line" d="M70 26 V178 H660" />
            <text class="dg-h" x="70" y="18">SCORE</text>
            <text class="dg-s" x="62" y="32" text-anchor="end">high</text>
            <text class="dg-s" x="62" y="182" text-anchor="end">low</text>
            <polyline class="dg-line" points="90,120 190,112 290,104 390,96 490,88 590,78 650,72" />
            <polyline class="dg-line hot" points="90,116 190,120 290,118 390,132 490,146 590,158 650,166" />
            <text class="dg-s" x="656" y="72">AI judge: “we are improving”</text>
            <text class="dg-s" x="600" y="186">human: “we are not”</text>
            <path class="dg-line dash" d="M390 40 V178" opacity="0.5" />
            <text class="dg-s" x="396" y="52">divergence starts here</text>
            <text class="dg-s" x="396" y="68">→ investigate the judge, not the app</text>
            <text class="dg-s" x="90" y="205">week 1</text>
            <text class="dg-s" x="640" y="205" text-anchor="end">week 12</text>
          </svg>
          <figcaption>Figure 6 — The single most valuable output of human review: catching the moment your measuring instrument and your reality part company.</figcaption>
        </figure>
        <ol class="lesson-steps">
          <li><strong>Correlate human scores with judge scores.</strong> When the human line falls while the judge line rises, the judge is the thing that is broken. Without the human line you would have shipped that divergence as progress.</li>
          <li><strong>Understand how people actually use the product.</strong> Real requests are stranger than any test set, and reading them generates most of your best feature ideas.</li>
          <li><strong>Spot behaviour changes that automation misses.</strong> A human reviewer who knows what happened in the news this week can recognise why traffic suddenly shifted; a metric dashboard can only tell you that it did.</li>
        </ol>
        <p>The general version of this is the most reliable advice in applied machine learning: look at your data. Fifteen minutes of reading real inputs and outputs routinely surfaces something that saves hours of misdirected work. Greg Brockman's version of the point has stuck around because it is true:</p>
        <blockquote>
          <p>“Manual inspection of data has probably the highest value-to-prestige ratio of any activity in machine learning.”</p>
          <cite>Greg Brockman</cite>
        </blockquote>

        <h3 class="lesson-subhead" id="p5-guidelines">Annotation guidelines earn their keep twice</h3>
        <p>Human evaluation is only as reliable as the instructions given to the humans. Two reviewers with different mental models of "good" produce noise, not signal — and you will mistake that noise for model variance.</p>
        <p>Writing the guidelines pays off in two further ways that are easy to miss:</p>
        <ul class="lesson-checklist">
          <li><strong>They improve your prompts.</strong> If a careful human cannot follow your definition of a good answer, the model has no chance either. Ambiguity you discover while writing guidelines is ambiguity you can remove from the system prompt.</li>
          <li><strong>They become training data later.</strong> Graded examples with a documented rubric are exactly what you need if you eventually fine-tune, and building that dataset early costs almost nothing extra.</li>
        </ul>
        <p>Keep the rubric small — four or five dimensions with concrete anchors beats twenty vague ones. Include at least one example of each score, and periodically re-grade an old batch to check the reviewers themselves have not drifted.</p>

        <h3 class="lesson-subhead" id="p5-judgefails">How judges fail, concretely</h3>
        <p>Since the original essay was written, judge behaviour has been studied a great deal more, and the failure modes now have names. Test for these explicitly:</p>
        <table>
          <thead><tr><th>Bias</th><th>What it looks like</th><th>Mitigation</th></tr></thead>
          <tbody>
            <tr><td>Position bias</td><td>In A/B comparisons, whichever answer comes first wins more often</td><td>Run both orders and average; discard pairs where the verdict flips</td></tr>
            <tr><td>Verbosity bias</td><td>Longer answers score higher regardless of substance</td><td>Control for length; score conciseness as its own dimension</td></tr>
            <tr><td>Self-preference</td><td>A judge favours text generated by its own model family</td><td>Use a different family for judging than for generating</td></tr>
            <tr><td>Style over substance</td><td>Confident, well-formatted, wrong answers beat hesitant correct ones</td><td>Require the judge to cite the evidence for its verdict</td></tr>
            <tr><td>Rubric drift</td><td>Scores shift after a provider silently updates the judge model</td><td>Pin versions; keep a golden set with known scores as a canary</td></tr>
            <tr><td>Leniency at scale</td><td>Judge marks almost everything acceptable, so the metric stops discriminating</td><td>Check score distribution, not just the mean</td></tr>
          </tbody>
        </table>
        <p>A practical setup that works: keep a fixed golden set of a few hundred human-graded examples, re-run your judge against it whenever the judge prompt or model changes, and track agreement with the humans as a first-class metric. When agreement drops, you fix the judge before you trust another experiment.</p>
        <p class="lesson-flow">Ship rule — no evaluation claim without: a versioned judge, a human-graded golden set, an agreement number, and a daily sample somebody actually reads</p>
      `,
    },
    {
      id: 'pitfall-6',
      title: '6. Crowdsource Use Cases',
      children: [
        { id: 'p6-how', title: 'How a wishlist replaces a strategy' },
        { id: 'p6-portfolio', title: 'Choosing a portfolio instead' },
        { id: 'p6-scoring', title: 'A scoring sheet you can defend' },
      ],
      html: `
        <p>This one belongs to leadership rather than engineering, and it produced a lot of wasted budget during the first enterprise rush.</p>

        <h3 class="lesson-subhead" id="p6-how">How a wishlist replaces a strategy</h3>
        <p>The pattern: an executive team has no view on where generative AI would actually pay, so they ask the whole company for ideas. The reasoning sounds unimpeachable — we hired clever people, let them tell us what to build — and then the resulting list gets worked through more or less in order.</p>
        <p>What comes out the other end, as Huyen puts it, is a million text-to-SQL projects, a million Slack bots and a billion code plugins.</p>
        <p>The flaw is not that employees have bad ideas. It is that individuals naturally propose fixes for whatever annoys them personally, which is a very different question from where the company would see the largest return. Suggestions cluster around small daily frictions, and nobody in the pile is responsible for the big picture. Twelve months later you have a portfolio of minor tools, no meaningful business impact, and an executive team concluding that generative AI has no return on investment — when what actually failed was the selection process.</p>
        <p>Worse, the duplicates are invisible at the start. Four teams independently build four internal chatbots over four document sets, each with its own retrieval stack, evaluation approach and maintenance burden, when one platform plus four configurations would have served everyone.</p>

        <h3 class="lesson-subhead" id="p6-portfolio">Choosing a portfolio instead</h3>
        <p>Collect ideas widely — that part is fine and healthy. Then apply a strategy on top: place them on impact against effort, deliberately fund a mix, and say no in public.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Impact versus effort matrix with quadrants for quick wins, strategic bets, filler work and money pits">
            <rect class="dg-band" x="80" y="24" width="560" height="180" rx="10" />
            <path class="dg-line dash" d="M360 24 V204" opacity="0.6" />
            <path class="dg-line dash" d="M80 114 H640" opacity="0.6" />
            <text class="dg-h" x="80" y="16">BUSINESS IMPACT ↑ · EFFORT →</text>
            <rect class="dg-box g" x="96" y="38" width="248" height="64" rx="8" />
            <text class="dg-t" x="220" y="62" text-anchor="middle">Quick wins — do now</text>
            <text class="dg-s" x="220" y="79" text-anchor="middle">support draft replies, internal doc search,</text>
            <text class="dg-s" x="220" y="93" text-anchor="middle">code review assist, ticket triage</text>
            <rect class="dg-box b" x="376" y="38" width="248" height="64" rx="8" />
            <text class="dg-t" x="500" y="62" text-anchor="middle">Strategic bets — fund 1 or 2</text>
            <text class="dg-s" x="500" y="79" text-anchor="middle">workflow automation with write actions,</text>
            <text class="dg-s" x="500" y="93" text-anchor="middle">customer-facing agents, shared platform</text>
            <rect class="dg-box" x="96" y="126" width="248" height="64" rx="8" />
            <text class="dg-t" x="220" y="150" text-anchor="middle">Filler — let teams self-serve</text>
            <text class="dg-s" x="220" y="167" text-anchor="middle">meeting notes, snippet generators,</text>
            <text class="dg-s" x="220" y="181" text-anchor="middle">one-off Slack bots</text>
            <rect class="dg-box r" x="376" y="126" width="248" height="64" rx="8" />
            <text class="dg-t" x="500" y="150" text-anchor="middle">Money pits — say no loudly</text>
            <text class="dg-s" x="500" y="167" text-anchor="middle">bespoke models per team, chatbots</text>
            <text class="dg-s" x="500" y="181" text-anchor="middle">nobody asked for, demos for board slides</text>
            <text class="dg-s" x="360" y="224" text-anchor="middle">The most common enterprise failure is a full year spent entirely in the bottom-left quadrant.</text>
          </svg>
          <figcaption>Figure 7 — Filler work is not worthless, but it should not consume a central AI team. Give people self-serve tooling for it and reserve funded effort for the top row.</figcaption>
        </figure>
        <p>Two structural moves make this stick. First, <strong>build the shared platform once</strong> — gateway, retrieval, evaluation harness, guardrails, observability — so individual use cases become configuration rather than new stacks. Second, appoint someone accountable for the <em>portfolio</em>, whose job includes killing duplicates and publishing what was declined and why. An unpublished "no" gets rebuilt in another department within a quarter.</p>

        <h3 class="lesson-subhead" id="p6-scoring">A scoring sheet you can defend</h3>
        <p>When you need to compare fifty submitted ideas without descending into politics, score each one on the same axes:</p>
        <table>
          <thead><tr><th>Axis</th><th>The question to ask</th><th>Kill signal</th></tr></thead>
          <tbody>
            <tr><td>Value</td><td>What measurable outcome moves, and by how much?</td><td>Nobody can name the metric</td></tr>
            <tr><td>Frequency</td><td>How often does this task happen?</td><td>Twice a quarter</td></tr>
            <tr><td>Baseline gap</td><td>What does the non-AI solution already achieve?</td><td>The baseline is fine</td></tr>
            <tr><td>Data readiness</td><td>Does the context this needs exist and is it accessible?</td><td>It lives in three systems nobody owns</td></tr>
            <tr><td>Failure cost</td><td>What happens when the output is wrong?</td><td>Irreversible harm with no review step</td></tr>
            <tr><td>Reuse</td><td>Would the components serve other use cases?</td><td>Entirely bespoke</td></tr>
            <tr><td>Owner</td><td>Which team runs this in production for years?</td><td>No named owner</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>One page per idea, same seven rows.</strong> That format alone eliminates most of the bottom-right quadrant, because the "failure cost" and "owner" rows are where enthusiastic proposals quietly fall apart.</div>
      `,
    },
    {
      id: 'pitfall-7',
      title: '7. Newer Pitfalls: What Changed Since 2025',
      children: [
        { id: 'p7-context', title: 'Assuming a big context window replaces retrieval' },
        { id: 'p7-reasoning', title: 'Treating reasoning models like chat models' },
        { id: 'p7-agentwash', title: 'Agent-washing a workflow' },
        { id: 'p7-budgets', title: 'No cost and latency budget' },
        { id: 'p7-injection', title: 'Ignoring prompt injection once tools appear' },
        { id: 'p7-versioning', title: 'Unversioned prompts and model migration debt' },
        { id: 'p7-flywheel', title: 'No data flywheel' },
      ],
      html: `
        <p>The six classics are durable. But the ground has moved since they were written: reasoning-style models became standard, context windows grew enormously, tool calling got standardised across providers, token prices fell sharply, and agent frameworks became a default rather than an experiment. Each of those improvements created its own new way to waste six months.</p>

        <h3 class="lesson-subhead" id="p7-context">Assuming a big context window replaces retrieval</h3>
        <p>Once a model accepts hundreds of thousands of tokens, the tempting simplification is to stop building retrieval and paste everything in. It demos beautifully and degrades badly.</p>
        <ul>
          <li><strong>Cost and latency scale with what you send,</strong> every single request. Retrieval is a filter that also happens to be a cost control.</li>
          <li><strong>Attention is not uniform</strong> across a long context. Burying the decisive paragraph in the middle of a huge dump makes it likelier to be underweighted — the "lost in the middle" effect.</li>
          <li><strong>Irrelevant context actively hurts.</strong> Extra plausible-but-wrong material gives the model more ways to justify a wrong answer.</li>
          <li><strong>It hides your quality problem.</strong> With retrieval you can measure whether the right chunk was found. With a giant dump you only see the final answer.</li>
        </ul>
        <p>The productive framing: long context does not replace retrieval, it <strong>relaxes your chunking constraints</strong>. Retrieve fewer, larger, better-chosen passages instead of many tiny ones.</p>

        <h3 class="lesson-subhead" id="p7-reasoning">Treating reasoning models like chat models</h3>
        <p>Models that spend extra computation thinking before answering behave differently enough to break habits built on earlier ones.</p>
        <table>
          <thead><tr><th>Old habit</th><th>Why it misfires now</th></tr></thead>
          <tbody>
            <tr><td>"Think step by step" in every prompt</td><td>Redundant, and can interfere with the model's own process</td></tr>
            <tr><td>Long chain-of-thought few-shot examples</td><td>Often unnecessary; adds cost for little gain</td></tr>
            <tr><td>Same latency budget as a chat model</td><td>Thinking time is real time — your p95 changes shape</td></tr>
            <tr><td>Counting only visible output tokens</td><td>Internal reasoning tokens are billed and invisible in your response length metrics</td></tr>
            <tr><td>Using the strongest reasoning model everywhere</td><td>Massive overkill for routing, extraction and classification</td></tr>
          </tbody>
        </table>
        <p>The engineering response is a <strong>tiered model policy</strong>: cheap fast models for classification, routing, extraction and translation; reasoning models reserved for genuinely hard planning and analysis steps; and an eval that checks whether the expensive tier actually wins on your tasks rather than in general.</p>

        <h3 class="lesson-subhead" id="p7-agentwash">Agent-washing a workflow</h3>
        <p>This is pitfall 3 wearing current clothes. A deterministic three-step pipeline gets rebuilt as a multi-agent system with a planner, a critic and a supervisor because that is the interesting architecture — and you inherit non-determinism, higher cost, harder debugging and compound error for a flow that had none of those problems.</p>
        <p>The test from the Agents lesson still applies: if your flow does not need to <em>decide</em> what to do next based on what it observes, it is a pipeline. Write it as code, keep it fast, and put your agent budget where the branching is genuinely unpredictable.</p>
        <p>The related trap is <strong>tool sprawl</strong>. Standardised tool protocols made it trivial to attach dozens of integrations, so people do — and selection accuracy drops, prompts fill with descriptions, and the blast radius grows. Attach what the task needs for this request, not everything you have access to.</p>

        <h3 class="lesson-subhead" id="p7-budgets">No cost and latency budget</h3>
        <p>Falling token prices made teams careless in a specific way: per-call cost dropped while calls per task multiplied. Reasoning tokens, multi-step agents, reflection passes, retries and judge calls all stack, and the total per completed task can easily exceed what a single call cost two years ago.</p>
        <p>Write the budget down before building, in the same document as the quality bar:</p>
        <ul class="lesson-checklist">
          <li>Cost per completed task, including retries, judges and reasoning tokens.</li>
          <li>p50 and p95 latency, measured end to end from the user's click.</li>
          <li>Maximum steps and maximum spend per request, enforced in code.</li>
          <li>Cost per <em>successful</em> task — the only number that compares two designs honestly.</li>
        </ul>
        <p>A system at 92% quality for four cents often beats one at 94% for forty. Without a budget nobody is allowed to make that trade, so the expensive design wins by default.</p>

        <h3 class="lesson-subhead" id="p7-injection">Ignoring prompt injection once tools appear</h3>
        <p>In early 2025 most applications only read and wrote text, so injection was a theoretical concern for many teams. Now that the same applications browse pages, open tickets, read repositories and hold write credentials, hostile instructions hidden in retrieved content are a live attack path — and one that "be careful" in a system prompt does not close.</p>
        <p>Minimum posture, repeated from the platform lesson because it is the pitfall most likely to end a project badly: treat all retrieved content as data rather than instructions; keep the component that reads untrusted content separate from the one holding write credentials; require human approval for irreversible actions; enforce permissions with scoped credentials at the API; and log every action with the request that caused it.</p>

        <h3 class="lesson-subhead" id="p7-versioning">Unversioned prompts and model migration debt</h3>
        <p>Two related operational traps that cost teams weeks.</p>
        <p><strong>Prompts that are not versioned artefacts.</strong> If your prompt lives in a string edited in production, you cannot attribute a quality change to a prompt change, and you cannot roll back. Treat prompts like code: in the repository, reviewed, versioned, and tagged in every log line and metric so a regression is traceable to a specific edit.</p>
        <p><strong>Assuming the model you launched on will stay available.</strong> Providers deprecate versions, and behaviour shifts between releases even when the name looks similar. Teams that hand-tuned prompts against one specific checkpoint discover the tuning was to a moving target. The defences: a gateway so the model is a configuration value, a regression eval you run against any candidate replacement, and enough abstraction that swapping a provider is an afternoon rather than a quarter.</p>

        <h3 class="lesson-subhead" id="p7-flywheel">No data flywheel</h3>
        <p>The last one is a pitfall of omission, and it compounds. Products that improve over time do so because usage generates data that improves the product. Products that plateau are usually throwing that data away.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Data flywheel: usage produces traces and feedback, which feed the eval set, which guides improvements, which improve the product and increase usage">
            <defs>
              <marker id="ah-fly" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path class="dg-ah" d="M0 0 L9 3.5 L0 7 z" />
              </marker>
            </defs>
            <rect class="dg-box b" x="40" y="82" width="130" height="52" rx="9" />
            <text class="dg-t" x="105" y="104" text-anchor="middle">Real usage</text>
            <text class="dg-s" x="105" y="120" text-anchor="middle">queries you never imagined</text>
            <rect class="dg-box g" x="220" y="18" width="140" height="52" rx="9" />
            <text class="dg-t" x="290" y="40" text-anchor="middle">Traces + feedback</text>
            <text class="dg-s" x="290" y="56" text-anchor="middle">thumbs, edits, escalations</text>
            <rect class="dg-box o" x="420" y="18" width="140" height="52" rx="9" />
            <text class="dg-t" x="490" y="40" text-anchor="middle">Eval set grows</text>
            <text class="dg-s" x="490" y="56" text-anchor="middle">failures become test cases</text>
            <rect class="dg-box p" x="560" y="110" width="130" height="52" rx="9" />
            <text class="dg-t" x="625" y="132" text-anchor="middle">Targeted fixes</text>
            <text class="dg-s" x="625" y="148" text-anchor="middle">prompt · retrieval · tools</text>
            <rect class="dg-box b" x="290" y="140" width="180" height="52" rx="9" />
            <text class="dg-t" x="380" y="162" text-anchor="middle">Better product</text>
            <text class="dg-s" x="380" y="178" text-anchor="middle">measurably, not anecdotally</text>
            <path class="dg-line" d="M120 82 V44 H216" marker-end="url(#ah-fly)" />
            <path class="dg-line" d="M360 44 H416" marker-end="url(#ah-fly)" />
            <path class="dg-line" d="M560 44 H625 V106" marker-end="url(#ah-fly)" />
            <path class="dg-line" d="M560 136 H474" marker-end="url(#ah-fly)" />
            <path class="dg-line" d="M290 166 H105 V138" marker-end="url(#ah-fly)" />
          </svg>
          <figcaption>Figure 8 — The loop that separates products that compound from products that plateau. Every arrow is engineering work, and none of it requires a better model.</figcaption>
        </figure>
        <p>Concretely: capture a trace for every request, make feedback one click, route every escalation and every user edit into a review queue, and promote real failures into your eval set the same week they happen. A team that adds twenty genuine failure cases a week has a meaningfully harder and more useful benchmark within two months — and it is made of your users' actual problems rather than someone else's benchmark.</p>
      `,
    },
    {
      id: 'summary',
      title: 'Summary',
      children: [
        { id: 'summary-table', title: 'All pitfalls in one table' },
        { id: 'summary-review', title: 'A project review you can run in 30 minutes' },
        { id: 'summary-selfcheck', title: 'Self-check' },
        { id: 'summary-resources', title: 'Further reading' },
      ],
      html: `
        <h3 class="lesson-subhead" id="summary-table">All pitfalls in one table</h3>
        <table>
          <thead><tr><th>#</th><th>Pitfall</th><th>The one-line correction</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Using generative AI when you do not need it</td><td>Generative AI is not a universal solution, and many problems need no AI at all. Beat the dumb baseline first.</td></tr>
            <tr><td>2</td><td>Confusing a bad product with bad AI</td><td>For most AI products the AI is the easy part and the product is the hard part. Optimise for helpful, not just correct.</td></tr>
            <tr><td>3</td><td>Starting too complex</td><td>Frameworks, vector databases and fine-tuning are useful later — not as a first move. Climb one rung per proven failure.</td></tr>
            <tr><td>4</td><td>Over-indexing on early success</td><td>Demo-ready to production-ready takes far longer than reaching the demo. Plan the flat part of the curve.</td></tr>
            <tr><td>5</td><td>Forgoing human evaluation</td><td>Validate AI judges against systematic human review, and read real outputs daily.</td></tr>
            <tr><td>6</td><td>Crowdsourcing use cases</td><td>Collect ideas widely, then apply a portfolio strategy so effort follows return on investment.</td></tr>
            <tr><td>7</td><td>The newer traps</td><td>Long context is not retrieval, reasoning models need their own policy, pipelines are not agents, budgets are requirements, injection is real once tools exist, prompts are versioned artefacts, and usage data must feed back.</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="summary-review">A project review you can run in 30 minutes</h3>
        <p>Take any AI project — yours or someone else's — and ask these in order. Each maps to a pitfall above, and a hesitant answer is the finding.</p>
        <ul class="lesson-checklist">
          <li>What does the non-AI baseline score on the same task?</li>
          <li>What decision changes because of the output, and who makes it?</li>
          <li>Have we watched five real users complete the workflow?</li>
          <li>Can we print the exact prompt sent to the model, right now?</li>
          <li>What is on the rung below our current architecture, and why did it fail?</li>
          <li>What percentage of the target experience are we at, and what does the last 5% cost?</li>
          <li>Who read production outputs yesterday, and what did they find?</li>
          <li>What is our judge's agreement rate with human graders?</li>
          <li>What is our cost per successful task, and our p95 latency?</li>
          <li>Which irreversible actions can the system take without a human?</li>
          <li>Is the prompt in version control, and is its version in our logs?</li>
          <li>How many new eval cases did real failures contribute this month?</li>
        </ul>
        <p>Twelve questions, no slides. In my experience the answers to questions 1, 7 and 12 predict whether a project will still exist in a year better than anything on its architecture diagram.</p>

        <h3 class="lesson-subhead" id="summary-selfcheck">Self-check</h3>
        <ol>
          <li>Why was the energy-scheduling app abandoned, and what single question caused it?</li>
          <li>Give two examples where users wanted something other than a correct answer.</li>
          <li>Name the two specific harms of adopting a framework too early.</li>
          <li>Roughly how long did LinkedIn take to reach 80% versus 95%, and what dominated the gap?</li>
          <li>List the three purposes of daily human evaluation.</li>
          <li>Name three ways an AI judge can be biased and one mitigation for each.</li>
          <li>Why does crowdsourcing use cases lead to the wrong conclusion about ROI?</li>
          <li>Why does a very large context window not remove the need for retrieval?</li>
          <li>What is the difference between cost per task and cost per successful task, and why does only one of them let you compare designs?</li>
        </ol>
        <p><strong>Sketch answers:</strong> (1) nobody compared it against a trivial "run appliances after 10pm" rule, so the model's contribution was unknown; (2) action items rather than summaries, and gap analysis rather than a blunt "not a fit"; (3) it hides critical details such as the final prompt, and it introduces bugs and silent prompt changes you did not write; (4) about a month to 80% and roughly four more months past 95%, dominated by hallucinations and the surrounding edge cases; (5) correlating human with judge scores, understanding real usage, and spotting behaviour shifts automation misses; (6) position, verbosity and self-preference bias — swap the order, control for length, judge with a different model family; (7) individual suggestions favour personal friction over business impact, so the portfolio fills with low-impact tools and leadership concludes there is no return; (8) cost and latency scale with context, attention is uneven across long inputs, irrelevant material misleads, and you lose the ability to measure retrieval quality; (9) the second includes the retries, judges and reasoning tokens spent on failures, which is where the real difference between two designs shows up.</p>

        <h3 class="lesson-subhead" id="summary-resources">Further reading</h3>
        <ul>
          <li><strong>The essay this lesson follows</strong> — Chip Huyen, <a href="https://huyenchip.com/2025/01/16/ai-engineering-pitfalls.html" rel="noopener noreferrer" target="_blank">Common pitfalls when building generative AI applications</a> (2025). Source of pitfalls 1–6 and the LinkedIn, Intuit and meeting-summary cases.</li>
          <li><strong>Book-length treatment</strong> — Chip Huyen, <em>AI Engineering</em> (2025), and <em>Designing Machine Learning Systems</em> for the evaluation and monitoring foundations.</li>
          <li><strong>The 0-to-60 quote in context</strong> — Ding et al., <a href="https://arxiv.org/abs/2305.14233" rel="noopener noreferrer" target="_blank">UltraChat</a> (2023).</li>
          <li><strong>Long-context limits</strong> — Liu et al., <a href="https://arxiv.org/abs/2307.03172" rel="noopener noreferrer" target="_blank">Lost in the Middle</a> (2023), the empirical basis for section 7's retrieval argument.</li>
          <li><strong>Judge reliability</strong> — Zheng et al., <a href="https://arxiv.org/abs/2306.05685" rel="noopener noreferrer" target="_blank">Judging LLM-as-a-Judge (MT-Bench / Chatbot Arena)</a> (2023) on position and verbosity bias; Shankar et al., <a href="https://arxiv.org/abs/2404.12272" rel="noopener noreferrer" target="_blank">Who Validates the Validators?</a> (2024) on aligning judges with human criteria.</li>
          <li><strong>Agent patterns and restraint</strong> — Anthropic, <a href="https://www.anthropic.com/engineering/building-effective-agents" rel="noopener noreferrer" target="_blank">Building effective agents</a> (2024), notable for advising the simplest pattern that works.</li>
          <li><strong>Security</strong> — <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" rel="noopener noreferrer" target="_blank">OWASP Top 10 for LLM Applications</a>: prompt injection and excessive agency, the two that turn a quality problem into an incident.</li>
          <li><strong>Earlier lessons in this track</strong> — <a href="/learn/agentic-ai/agents">Agents</a> for planning, tool selection and failure modes, and <a href="/learn/agentic-ai/genai-platform">Building a Generative AI Platform</a> for the components referenced throughout.</li>
        </ul>
        <p class="lesson-flow">Next in this track: evaluation harnesses in practice · memory systems · multi-agent orchestration · cost and latency engineering</p>
      `,
    },
  ],
  sourceNote:
    'Original lesson written for BinodTech. Pitfalls 1\u20136 follow the taxonomy and cover every point from Chip Huyen\u2019s <a href="https://huyenchip.com/2025/01/16/ai-engineering-pitfalls.html" rel="noopener noreferrer" target="_blank">Common pitfalls when building generative AI applications</a> (January 2025), including the case studies she reports from LinkedIn, Intuit and other teams \u2014 credited to her and to the original speakers. Section 7 and all diagrams, tables, checklists and exercises are our own additions covering developments since that essay. Quoted lines are short and attributed to their authors.',
};
