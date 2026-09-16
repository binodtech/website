/** Full lesson: Real-time machine learning — online prediction and continual learning.
 *  The two maturity ladders, feature freshness taxonomy, bandits for online evaluation,
 *  stateless vs stateful training, and what changed between 2022 and 2026.
 */

export type LessonSubsection = { id: string; title: string };

export type LessonSection = {
  id: string;
  title: string;
  html: string;
  children?: LessonSubsection[];
};

export const agenticAiRealTimeMl = {
  slug: 'real-time-ml',
  title: 'Real-Time Machine Learning: From Batch Predictions to Continual Learning',
  subtitle:
    'Two independent maturity ladders — how fresh your predictions are, and how fresh your model is. Batch prediction, session-based online prediction, streaming features, bandits for online evaluation, stateless versus stateful training, and the infrastructure each stage demands.',
  byline: 'Agentic AI track · Lesson 4 · ~2h 30m read · Intermediate to Advanced',
  interviewTip:
    'When asked to design a recommender, fraud detector or delivery-time estimator, place yourself on both ladders out loud: "predictions online with streaming features, model on automated stateful daily training." Then name the infrastructure each choice forces — streaming transport, stream compute, an online store, a model store with lineage. That framing is what senior ML systems interviews are actually testing.',
  sections: [
    {
      id: 'intro',
      title: 'Two Ladders, Not One',
      children: [
        { id: 'intro-what', title: 'What "real-time ML" actually means' },
        { id: 'intro-ladders', title: 'The two independent ladders' },
        { id: 'intro-place', title: 'Placing your own system' },
      ],
      html: `
        <p>Real-time machine learning means using fresh data to make better predictions and to keep models aligned with a changing world. It sounds like one problem. It is two, and conflating them is why so many "let's go real-time" projects stall.</p>

        <h3 class="lesson-subhead" id="intro-what">What "real-time ML" actually means</h3>
        <p>Two separate questions hide inside the phrase:</p>
        <ul class="lesson-layers">
          <li><strong>How fresh is the prediction?</strong> Was it computed hours ago and looked up, or computed now, using what the user did ten seconds ago? This is the <em>online prediction</em> ladder.</li>
          <li><strong>How fresh is the model?</strong> Was it trained last quarter, last night, or is it continuously adapting as distributions shift? This is the <em>continual learning</em> ladder.</li>
        </ul>
        <p>You can be advanced on one and primitive on the other, and most companies are. A system serving predictions online from a model nobody has retrained in eight months is common — and so is a nightly-retrained model whose predictions are all precomputed in a batch job.</p>
        <p>One more piece of vocabulary before we start, because the industry is loose about it: some teams say "streaming prediction" for systems built on streaming infrastructure and reserve "online prediction" for those that are not. Here, online prediction covers both.</p>

        <h3 class="lesson-subhead" id="intro-ladders">The two independent ladders</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="Two independent maturity ladders: three stages of online prediction and four stages of continual learning">
            <defs>
              <marker id="ah-l1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-l2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="340" height="230" rx="12" />
            <text class="dg-h" x="26" y="36">LADDER A — PREDICTION FRESHNESS</text>
            <rect class="dg-box b" x="26" y="46" width="312" height="52" rx="9" />
            <text class="dg-t" x="182" y="66" text-anchor="middle">Stage 1 · Batch prediction</text>
            <text class="dg-s" x="182" y="82" text-anchor="middle">precomputed every few hours or nightly</text>
            <text class="dg-s" x="182" y="94" text-anchor="middle">looked up when the request arrives</text>
            <rect class="dg-box c" x="26" y="112" width="312" height="52" rx="9" />
            <text class="dg-t" x="182" y="132" text-anchor="middle">Stage 2 · Online, batch features</text>
            <text class="dg-s" x="182" y="148" text-anchor="middle">computed per request from session activity</text>
            <text class="dg-s" x="182" y="160" text-anchor="middle">features are still precomputed lookups</text>
            <rect class="dg-box g" x="26" y="178" width="312" height="56" rx="9" />
            <text class="dg-t" x="182" y="198" text-anchor="middle">Stage 3 · Online, online features</text>
            <text class="dg-s" x="182" y="214" text-anchor="middle">streaming + real-time features, computed fresh</text>
            <text class="dg-s" x="182" y="226" text-anchor="middle">hundreds of features, joins, windowed aggregates</text>
            <path class="dg-line blue thick" d="M182 98 V108" marker-end="url(#ah-l1)" />
            <path class="dg-line blue thick" d="M182 164 V174" marker-end="url(#ah-l1)" />

            <rect class="dg-band p" x="368" y="16" width="340" height="230" rx="12" />
            <text class="dg-h" x="382" y="36">LADDER B — MODEL FRESHNESS</text>
            <rect class="dg-box r" x="382" y="46" width="312" height="38" rx="9" />
            <text class="dg-t" x="538" y="63" text-anchor="middle">Stage 1 · Manual, stateless retraining</text>
            <text class="dg-s" x="538" y="77" text-anchor="middle">ad-hoc, when someone has time</text>
            <rect class="dg-box o" x="382" y="94" width="312" height="38" rx="9" />
            <text class="dg-t" x="538" y="111" text-anchor="middle">Stage 2 · Automated retraining</text>
            <text class="dg-s" x="538" y="125" text-anchor="middle">a scheduled script, still from scratch</text>
            <rect class="dg-box y" x="382" y="142" width="312" height="42" rx="9" />
            <text class="dg-t" x="538" y="159" text-anchor="middle">Stage 3 · Automated, stateful training</text>
            <text class="dg-s" x="538" y="173" text-anchor="middle">fine-tune on new data instead of restarting</text>
            <rect class="dg-box p" x="382" y="194" width="312" height="40" rx="9" />
            <text class="dg-t" x="538" y="211" text-anchor="middle">Stage 4 · Continual learning</text>
            <text class="dg-s" x="538" y="225" text-anchor="middle">updates triggered by drift, not by the clock</text>
            <path class="dg-line violet thick" d="M538 84 V90" marker-end="url(#ah-l2)" />
            <path class="dg-line violet thick" d="M538 132 V138" marker-end="url(#ah-l2)" />
            <path class="dg-line violet thick" d="M538 184 V190" marker-end="url(#ah-l2)" />
          </svg>
          <figcaption>Figure 1 — The two ladders are climbed independently, with different owners: Ladder A is mostly a platform and streaming problem, Ladder B mostly a training and evaluation problem.</figcaption>
        </figure>
        <p>The rest of this lesson walks up Ladder A, detours into online evaluation with bandits (which online prediction makes possible), then walks up Ladder B, then covers the streaming-versus-batch trade-offs that decide both. Some stages will be beneath you depending on your experience — skip freely.</p>

        <h3 class="lesson-subhead" id="intro-place">Placing your own system</h3>
        <p>Before reading on, locate yourself on this grid. It predicts which problems you are about to have.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="Maturity grid crossing prediction freshness against model freshness, with typical company positions in each cell">
            <rect class="dg-band" x="150" y="20" width="546" height="180" rx="10" />
            <text class="dg-h" x="150" y="14">MODEL FRESHNESS →</text>
            <text class="dg-s" x="240" y="36" text-anchor="middle">manual</text>
            <text class="dg-s" x="420" y="36" text-anchor="middle">automated (stateless)</text>
            <text class="dg-s" x="600" y="36" text-anchor="middle">stateful / continual</text>
            <text class="dg-s" x="142" y="80" text-anchor="end">online +</text>
            <text class="dg-s" x="142" y="94" text-anchor="end">streaming features</text>
            <text class="dg-s" x="142" y="140" text-anchor="end">online +</text>
            <text class="dg-s" x="142" y="154" text-anchor="end">batch features</text>
            <text class="dg-s" x="142" y="188" text-anchor="end">batch prediction</text>
            <rect class="dg-box y" x="162" y="60" width="156" height="46" rx="8" />
            <text class="dg-s" x="240" y="80" text-anchor="middle">rare and unstable —</text>
            <text class="dg-s" x="240" y="94" text-anchor="middle">fresh data, stale model</text>
            <rect class="dg-box g" x="330" y="60" width="156" height="46" rx="8" />
            <text class="dg-s" x="408" y="80" text-anchor="middle">strong: fraud, delivery</text>
            <text class="dg-s" x="408" y="94" text-anchor="middle">ETA, ads, search</text>
            <rect class="dg-box p" x="498" y="60" width="186" height="46" rx="8" />
            <text class="dg-s" x="591" y="80" text-anchor="middle">the frontier — big tech</text>
            <text class="dg-s" x="591" y="94" text-anchor="middle">recsys and marketplaces</text>
            <rect class="dg-box o" x="162" y="120" width="156" height="46" rx="8" />
            <text class="dg-s" x="240" y="140" text-anchor="middle">common first step</text>
            <text class="dg-s" x="240" y="154" text-anchor="middle">into online serving</text>
            <rect class="dg-box c" x="330" y="120" width="156" height="46" rx="8" />
            <text class="dg-s" x="408" y="140" text-anchor="middle">healthy mainstream</text>
            <text class="dg-s" x="408" y="154" text-anchor="middle">session-based recsys</text>
            <rect class="dg-box b" x="498" y="120" width="186" height="46" rx="8" />
            <text class="dg-s" x="591" y="140" text-anchor="middle">good, if evaluation</text>
            <text class="dg-s" x="591" y="154" text-anchor="middle">keeps up with updates</text>
            <rect class="dg-box r" x="162" y="176" width="156" height="20" rx="6" />
            <text class="dg-s" x="240" y="190" text-anchor="middle">where most start</text>
            <rect class="dg-box" x="330" y="176" width="156" height="20" rx="6" />
            <text class="dg-s" x="408" y="190" text-anchor="middle">classic mature batch ML</text>
            <rect class="dg-box" x="498" y="176" width="186" height="20" rx="6" />
            <text class="dg-s" x="591" y="190" text-anchor="middle">effort spent in the wrong place</text>
            <text class="dg-h" x="14" y="220">PREDICTION FRESHNESS ↑ · pick the axis your metrics actually need first</text>
          </svg>
          <figcaption>Figure 2 — The grid. Bottom-right is the most common wasted investment: elaborate retraining machinery serving predictions that are already hours stale by the time a user sees them.</figcaption>
        </figure>
      `,
    },
    {
      id: 'stage-a1',
      title: 'Ladder A · Stage 1 — Batch Prediction',
      children: [
        { id: 'a1-how', title: 'How it works' },
        { id: 'a1-break', title: 'Where it breaks: the anonymous visitor' },
        { id: 'a1-legacy', title: 'Batch is not a prerequisite for online' },
      ],
      html: `
        <p>At this stage every prediction is precomputed on a schedule — every four hours, every night — written to a store, and looked up when a request arrives. Collaborative filtering and content-based recommendation are the classic fits, and the pattern has been used at serious scale: DoorDash's restaurant recommendations, Reddit's subreddit suggestions, and Netflix's recommendations as of around 2021, before they moved serving online.</p>

        <h3 class="lesson-subhead" id="a1-how">How it works</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Batch prediction workflow: warehouse data processed on a schedule into precomputed predictions that are looked up at request time">
            <defs>
              <marker id="ah-a1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-a1g" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="470" height="96" rx="11" />
            <text class="dg-h" x="26" y="36">OFFLINE — RUNS ON A SCHEDULE</text>
            <rect class="dg-box b" x="26" y="46" width="104" height="52" rx="8" />
            <text class="dg-s" x="78" y="66" text-anchor="middle">data warehouse</text>
            <text class="dg-s" x="78" y="80" text-anchor="middle">historical events</text>
            <rect class="dg-box b" x="150" y="46" width="104" height="52" rx="8" />
            <text class="dg-s" x="202" y="66" text-anchor="middle">batch job</text>
            <text class="dg-s" x="202" y="80" text-anchor="middle">Spark / SQL</text>
            <rect class="dg-box b" x="274" y="46" width="94" height="52" rx="8" />
            <text class="dg-s" x="321" y="66" text-anchor="middle">model</text>
            <text class="dg-s" x="321" y="80" text-anchor="middle">scores everyone</text>
            <rect class="dg-box c" x="388" y="46" width="80" height="52" rx="8" />
            <text class="dg-s" x="428" y="66" text-anchor="middle">predictions</text>
            <text class="dg-s" x="428" y="80" text-anchor="middle">table</text>
            <path class="dg-line blue" d="M130 72 H146" marker-end="url(#ah-a1)" />
            <path class="dg-line blue" d="M254 72 H270" marker-end="url(#ah-a1)" />
            <path class="dg-line blue" d="M368 72 H384" marker-end="url(#ah-a1)" />

            <rect class="dg-band g" x="12" y="126" width="470" height="66" rx="11" />
            <text class="dg-h" x="26" y="146">AT REQUEST TIME — JUST A LOOKUP</text>
            <rect class="dg-box g" x="26" y="154" width="104" height="30" rx="8" />
            <text class="dg-s" x="78" y="173" text-anchor="middle">user arrives</text>
            <rect class="dg-box g" x="150" y="154" width="140" height="30" rx="8" />
            <text class="dg-s" x="220" y="173" text-anchor="middle">read precomputed row</text>
            <rect class="dg-box g" x="310" y="154" width="158" height="30" rx="8" />
            <text class="dg-s" x="389" y="173" text-anchor="middle">serve (milliseconds, cheap)</text>
            <path class="dg-line green" d="M130 169 H146" marker-end="url(#ah-a1g)" />
            <path class="dg-line green" d="M290 169 H306" marker-end="url(#ah-a1g)" />
            <path class="dg-line blue dash" d="M428 98 V150" marker-end="url(#ah-a1)" />

            <rect class="dg-box r" x="498" y="16" width="210" height="176" rx="11" />
            <text class="dg-h" x="512" y="36">WHAT YOU GIVE UP</text>
            <text class="dg-s" x="512" y="56">· nothing adapts within a session</text>
            <text class="dg-s" x="512" y="76">· new or logged-out visitors</text>
            <text class="dg-s" x="512" y="90">  have no row at all</text>
            <text class="dg-s" x="512" y="110">· predictions age until the</text>
            <text class="dg-s" x="512" y="124">  next run</text>
            <text class="dg-s" x="512" y="144">· you pay to score users who</text>
            <text class="dg-s" x="512" y="158">  never show up</text>
            <text class="dg-s" x="512" y="178">· low latency is the one real win</text>
          </svg>
          <figcaption>Figure 3 — Batch prediction. The dashed line is the only link between the two halves, and the gap between them is exactly how stale your predictions can be.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="a1-break">Where it breaks: the anonymous visitor</h3>
        <p>Consider an e-commerce site where half the traffic is new or logged-out users. Those people have no precomputed row, so they see something generic. By the time the next batch run could have learned anything about them, they have already browsed, failed to find anything relevant, and left. The prediction you needed was one that did not exist yet.</p>
        <p>There is a second, quieter cost: you compute predictions for everyone whether or not they visit. If only a small fraction of your users are active daily — Grubhub in 2020 had roughly 31 million users against about 622,000 daily orders — then the overwhelming majority of that compute is wasted. This matters for the argument later that online prediction is not automatically more expensive than batch.</p>

        <h3 class="lesson-subhead" id="a1-legacy">Batch is not a prerequisite for online</h3>
        <blockquote>
          <p>Batch prediction is <strong>not</strong> a prerequisite for online prediction. It is largely an artefact of legacy systems.</p>
          <cite>Paraphrasing Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022)</cite>
        </blockquote>
        <p>The history explains the habit. For a decade, large-scale data processing meant MapReduce and then Spark — batch systems that periodically chew through enormous datasets very efficiently. When companies started doing machine learning, they naturally ran it on the batch infrastructure they already had. The architecture followed the tooling, not the requirement.</p>
        <p>So if you are building a new ML system today, you can start with online prediction. You do not owe anyone a batch phase first. Where batch still genuinely wins: precomputing something expensive that is identical for everyone, one-off scoring of very large static datasets, and any case where the freshest possible answer is worth nothing to the user.</p>
      `,
    },
    {
      id: 'stage-a2',
      title: 'Ladder A · Stage 2 — Online Prediction With Batch Features',
      children: [
        { id: 'a2-session', title: 'In-session adaptation, worked through' },
        { id: 'a2-retrieval', title: 'Retrieval then ranking' },
        { id: 'a2-req', title: 'What you need to build' },
        { id: 'a2-challenges', title: 'The three challenges' },
        { id: 'a2-myth', title: 'The "online is more expensive" myth' },
      ],
      html: `
        <p>At this stage predictions are generated <em>after</em> the request arrives rather than before. User activity is collected in real time — but note the boundary that defines this stage: those events are only used to <strong>look up precomputed embeddings</strong> and combine them. No features are computed from streaming data yet.</p>

        <h3 class="lesson-subhead" id="a2-session">In-session adaptation, worked through</h3>
        <p>Back to the e-commerce site. A brand-new visitor arrives; you know nothing about them. They look at a keyboard, then a monitor. That is enough to infer a work-from-home setup, and to recommend HDMI cables and monitor mounts rather than a generic bestseller list.</p>
        <p>Mechanically: the visitor views items 1, 10 and 20; you fetch the precomputed embeddings for those three items from your warehouse or online store; you combine them — averaging is the standard starting point — into a <strong>session embedding</strong> representing what this person seems to want right now.</p>

        <h3 class="lesson-subhead" id="a2-retrieval">Retrieval then ranking</h3>
        <p>Now find the most relevant items for that session embedding. The naive approach — score every item and sort — dies immediately at scale, because you may have millions of items and the user will not wait. So nearly everyone uses a cheap first pass to cut the catalogue down to a manageable candidate set (a thousand or so) and only then runs the expensive ranking model. That first pass is <strong>candidate generation</strong>, also called <strong>retrieval</strong>, and it is usually something inexpensive like item-item collaborative filtering or k-nearest neighbours.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 232" role="img" aria-label="Session-based recommendation pipeline: activities to embedding lookup to session embedding to candidate retrieval to ranking to recommendations">
            <defs>
              <marker id="ah-a2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">MILLISECONDS, PER REQUEST</text>
            <rect class="dg-box g" x="16" y="34" width="106" height="50" rx="9" />
            <text class="dg-s" x="69" y="54" text-anchor="middle">session activity</text>
            <text class="dg-s" x="69" y="68" text-anchor="middle">items 1, 10, 20</text>
            <rect class="dg-box b" x="142" y="34" width="118" height="50" rx="9" />
            <text class="dg-s" x="201" y="54" text-anchor="middle">look up item</text>
            <text class="dg-s" x="201" y="68" text-anchor="middle">embeddings (batch)</text>
            <rect class="dg-box i" x="280" y="34" width="118" height="50" rx="9" />
            <text class="dg-s" x="339" y="54" text-anchor="middle">session embedding</text>
            <text class="dg-s" x="339" y="68" text-anchor="middle">e.g. averaged</text>
            <rect class="dg-box p" x="418" y="34" width="132" height="50" rx="9" />
            <text class="dg-s" x="484" y="48" text-anchor="middle">candidate generation</text>
            <text class="dg-s" x="484" y="62" text-anchor="middle">item-item CF / kNN</text>
            <text class="dg-s" x="484" y="76" text-anchor="middle">millions → ~1,000</text>
            <rect class="dg-box k" x="570" y="34" width="134" height="50" rx="9" />
            <text class="dg-s" x="637" y="48" text-anchor="middle">ranking model</text>
            <text class="dg-s" x="637" y="62" text-anchor="middle">scores candidates</text>
            <text class="dg-s" x="637" y="76" text-anchor="middle">→ top items shown</text>
            <path class="dg-line cyan" d="M122 59 H138" marker-end="url(#ah-a2)" />
            <path class="dg-line cyan" d="M260 59 H276" marker-end="url(#ah-a2)" />
            <path class="dg-line cyan" d="M398 59 H414" marker-end="url(#ah-a2)" />
            <path class="dg-line cyan" d="M550 59 H566" marker-end="url(#ah-a2)" />

            <rect class="dg-band c" x="12" y="104" width="696" height="60" rx="10" />
            <text class="dg-h" x="26" y="124">THREE MODELS, OFTEN — IF EMBEDDINGS ARE LEARNED SEPARATELY</text>
            <rect class="dg-box c" x="26" y="132" width="212" height="24" rx="6" />
            <text class="dg-s" x="132" y="148" text-anchor="middle">1 · embedding model</text>
            <rect class="dg-box c" x="250" y="132" width="212" height="24" rx="6" />
            <text class="dg-s" x="356" y="148" text-anchor="middle">2 · retrieval model</text>
            <rect class="dg-box c" x="474" y="132" width="220" height="24" rx="6" />
            <text class="dg-s" x="584" y="148" text-anchor="middle">3 · ranking model</text>
            <text class="dg-s" x="16" y="188">Same shape applies far beyond recommendations: ads click-through prediction, search, and any retrieval task.</text>
            <text class="dg-s" x="16" y="208">Goal of session-based prediction: convert first-time visitors, lift click-through, improve retention.</text>
            <text class="dg-s" x="16" y="226">Embeddings can also be learned jointly with ranking — then it is fewer models but a tighter coupling.</text>
          </svg>
          <figcaption>Figure 4 — Session-based recommendation. Retrieval exists purely because ranking is too expensive to run on the whole catalogue; every latency budget in this stage is spent deciding that split.</figcaption>
        </figure>
        <p>Companies that adopted this — Netflix, YouTube, Roblox, Coveo among them — reported metric wins consistently enough that the 2022 prediction has largely come true: session-based serving is now the default expectation for recommenders, with every click, view and transaction feeding fresher suggestions.</p>

        <h3 class="lesson-subhead" id="a2-req">What you need to build</h3>
        <ol class="lesson-steps">
          <li><strong>Change the models from batch to session-based prediction</strong> — which may mean adding models you do not currently have, such as a separate embedding or retrieval model. <em>Owner: data science / ML.</em></li>
          <li><strong>Get session data into the prediction service,</strong> which normally means streaming infrastructure in two parts. <em>Owner: data / ML platform.</em>
            <ul>
              <li>A <strong>streaming transport</strong> to move user activity — Kafka, AWS Kinesis, GCP Dataflow. Most teams pay for a managed one, because self-hosting Kafka is genuinely painful.</li>
              <li>A <strong>streaming computation engine</strong> — Flink SQL, ksqlDB, Spark Streaming — which here is responsible for cutting activity into sessions and keeping per-session state. Flink SQL and ksqlDB have the broadest industry recognition and offer a SQL surface that data scientists can actually use.</li>
            </ul>
          </li>
        </ol>
        <p>If you already stream your logs, this is a smaller step than it sounds — though it does put real load on that infrastructure, which may need upgrading for throughput and reliability rather than best-effort logging.</p>

        <h3 class="lesson-subhead" id="a2-challenges">The three challenges</h3>
        <ul class="lesson-layers">
          <li><strong>Inference latency becomes your problem.</strong> In batch it did not exist; now every millisecond of model time is user-facing. This is what forces the retrieval/ranking split, model distillation, and careful caching.</li>
          <li><strong>Setting up streaming infrastructure.</strong> Many engineers remain wary of SQL-style joins over streams, even as the tooling improves. Windowing, late arrivals and state size are genuinely subtle.</li>
          <li><strong>Getting high-quality embeddings,</strong> which is hardest when you have several item types that must share a space — products, videos, articles, sellers — and cold-start items with no interaction history.</li>
        </ul>

        <h3 class="lesson-subhead" id="a2-myth">The "online is more expensive" myth</h3>
        <p>A common objection: batching is more efficient than handling requests one at a time, so online prediction must cost more. That is not necessarily true, for the reason introduced earlier — with online prediction <strong>you only compute predictions for users who actually show up.</strong> If 2% of your users are active on a given day, then in a batch world roughly 98% of your prediction compute produces nothing.</p>
        <p>The honest version is that it depends on the shape of your workload, which is exactly what the streaming-versus-batch section later in this lesson unpacks along three dimensions: cost, performance and talent.</p>
      `,
    },
    {
      id: 'stage-a3',
      title: 'Ladder A · Stage 3 — Online Prediction With Online Features',
      children: [
        { id: 'a3-taxonomy', title: 'Batch, real-time and near-real-time features' },
        { id: 'a3-rt', title: 'Real-time features: easy to build, hard to scale' },
        { id: 'a3-nrt', title: 'Near-real-time features: async and cheap to serve' },
        { id: 'a3-doordash', title: 'One prediction, three kinds of feature' },
        { id: 'a3-req', title: 'The four requirements' },
      ],
      html: `
        <p>Stage 2 kept features precomputed. Stage 3 computes them from fresh data — and this is where the hard engineering lives.</p>

        <h3 class="lesson-subhead" id="a3-taxonomy">Batch, real-time and near-real-time features</h3>
        <p>Three categories, distinguished by when the computation happens:</p>
        <ul class="lesson-layers">
          <li><strong>Batch features</strong> — extracted from historical data by batch processing. Also called static or historical features. Example: this restaurant's average preparation time over the past months.</li>
          <li><strong>Real-time (RT) features</strong> — computed at the moment the prediction request arrives. Freshness in milliseconds.</li>
          <li><strong>Near-real-time features</strong> — precomputed like batch features, but recomputed continuously by a stream processor, so staleness is seconds rather than hours.</li>
        </ul>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Comparison of batch, near real-time and real-time features across when they are computed, their staleness, and their effect on user-facing latency">
            <rect class="dg-band b" x="12" y="20" width="226" height="212" rx="11" />
            <text class="dg-h" x="26" y="40">BATCH FEATURES</text>
            <rect class="dg-box b" x="26" y="50" width="198" height="26" rx="6" />
            <text class="dg-s" x="125" y="67" text-anchor="middle">computed: on a schedule</text>
            <rect class="dg-box b" x="26" y="82" width="198" height="26" rx="6" />
            <text class="dg-s" x="125" y="99" text-anchor="middle">staleness: hours to days</text>
            <rect class="dg-box g" x="26" y="114" width="198" height="26" rx="6" />
            <text class="dg-s" x="125" y="131" text-anchor="middle">user latency added: none</text>
            <rect class="dg-box g" x="26" y="146" width="198" height="26" rx="6" />
            <text class="dg-s" x="125" y="163" text-anchor="middle">complexity: unlimited</text>
            <text class="dg-s" x="26" y="192">Engine: Spark / SQL on the</text>
            <text class="dg-s" x="26" y="206">warehouse or lakehouse.</text>
            <text class="dg-s" x="26" y="224">Use for slow-moving history.</text>

            <rect class="dg-band c" x="248" y="20" width="226" height="212" rx="11" />
            <text class="dg-h" x="262" y="40">NEAR-REAL-TIME</text>
            <rect class="dg-box c" x="262" y="50" width="198" height="26" rx="6" />
            <text class="dg-s" x="361" y="67" text-anchor="middle">computed: async, continuously</text>
            <rect class="dg-box c" x="262" y="82" width="198" height="26" rx="6" />
            <text class="dg-s" x="361" y="99" text-anchor="middle">staleness: seconds</text>
            <rect class="dg-box g" x="262" y="114" width="198" height="26" rx="6" />
            <text class="dg-s" x="361" y="131" text-anchor="middle">user latency added: none</text>
            <rect class="dg-box g" x="262" y="146" width="198" height="26" rx="6" />
            <text class="dg-s" x="361" y="163" text-anchor="middle">complexity: high, affordable</text>
            <text class="dg-s" x="262" y="192">Engine: stream processor</text>
            <text class="dg-s" x="262" y="206">(Flink / ksqlDB / Spark SS).</text>
            <text class="dg-s" x="262" y="224">The sweet spot for most teams.</text>

            <rect class="dg-band r" x="484" y="20" width="224" height="212" rx="11" />
            <text class="dg-h" x="498" y="40">REAL-TIME (RT)</text>
            <rect class="dg-box r" x="498" y="50" width="196" height="26" rx="6" />
            <text class="dg-s" x="596" y="67" text-anchor="middle">computed: at request time</text>
            <rect class="dg-box g" x="498" y="82" width="196" height="26" rx="6" />
            <text class="dg-s" x="596" y="99" text-anchor="middle">staleness: milliseconds</text>
            <rect class="dg-box r" x="498" y="114" width="196" height="26" rx="6" />
            <text class="dg-s" x="596" y="131" text-anchor="middle">user latency added: all of it</text>
            <rect class="dg-box r" x="498" y="146" width="196" height="26" rx="6" />
            <text class="dg-s" x="596" y="163" text-anchor="middle">complexity: must stay small</text>
            <text class="dg-s" x="498" y="192">Engine: a lambda or a query</text>
            <text class="dg-s" x="498" y="206">against a live database.</text>
            <text class="dg-s" x="498" y="224">Easy to start, hard to scale.</text>
          </svg>
          <figcaption>Figure 5 — The freshness/latency trade-off. The green cells show each option's advantage: batch and near-real-time cost the user nothing at request time, real-time wins only on absolute freshness.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="a3-rt">Real-time features: easy to build, hard to scale</h3>
        <p>Say you want the number of views a product has had in the last 30 minutes, computed exactly now. Two straightforward approaches: a lambda function that takes recent activity and counts views, or storing activity in a database like Postgres and issuing a SQL query for the count.</p>
        <p>Both are easy to stand up, and both share a structural weakness: <strong>the computation happens inside the request, so its latency lands directly on the user.</strong> Traffic growth and spikes hit that latency hard, and genuinely complex features — big windows, multi-way joins — are simply infeasible because they take too long. Real-time features scale badly for reasons that have nothing to do with your model.</p>

        <h3 class="lesson-subhead" id="a3-nrt">Near-real-time features: async and cheap to serve</h3>
        <p>Near-real-time features behave like batch features at serving time — you retrieve the latest materialised value — but they are recomputed constantly by a stream processor, so staleness is seconds. Because the computation is asynchronous, <strong>it costs the user nothing</strong>, which means you can afford as many features as you like and make them as complex as you like.</p>
        <p>They also avoid batch's waste: if a user never visits, their values are not recomputed. For most teams this is the right default, and the reason streaming infrastructure earns its keep at this stage even if it was barely needed at Stage 2.</p>

        <h3 class="lesson-subhead" id="a3-doordash">One prediction, three kinds of feature</h3>
        <p>Estimating delivery time after someone places a DoorDash order needs all three categories at once — which is why the taxonomy is not academic:</p>
        <table>
          <thead><tr><th>Kind</th><th>Feature</th><th>Why it must be that kind</th></tr></thead>
          <tbody>
            <tr><td>Batch</td><td>This restaurant's mean preparation time historically</td><td>Slow-moving; recomputing it per request would be pointless</td></tr>
            <tr><td>Real-time</td><td>Distance from restaurant to delivery address</td><td>Only knowable once this specific order exists</td></tr>
            <tr><td>Streaming</td><td>How many other orders the restaurant has right now; how many couriers will be free in the next 30 minutes</td><td>Changes by the second and depends on aggregating the whole live event stream</td></tr>
          </tbody>
        </table>
        <p>The same upgrade applies to the session-based recommender from Stage 2: instead of session embeddings alone, add online features like how long the user has been on the site or how many times an item has been purchased in the last 24 hours. Companies operating at this level include Stripe, Uber and Faire, for fraud detection, credit scoring, delivery and driving estimates, and recommendations.</p>
        <blockquote>
          <p>A single prediction can involve hundreds or thousands of online features, with joins, aggregations over long windows, and transformations that depend on other transformations. Building a system that computes all of that efficiently and affordably is genuinely hard.</p>
          <cite>Paraphrasing Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022)</cite>
        </blockquote>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Architecture combining batch and streaming feature pipelines into a feature store serving an online prediction service">
            <defs>
              <marker id="ah-a3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-a3c" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-a3r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">BATCH PATH — HISTORY</text>
            <rect class="dg-box b" x="16" y="32" width="120" height="42" rx="8" />
            <text class="dg-s" x="76" y="51" text-anchor="middle">warehouse /</text>
            <text class="dg-s" x="76" y="65" text-anchor="middle">lakehouse</text>
            <rect class="dg-box b" x="160" y="32" width="120" height="42" rx="8" />
            <text class="dg-s" x="220" y="51" text-anchor="middle">batch feature</text>
            <text class="dg-s" x="220" y="65" text-anchor="middle">pipeline</text>
            <path class="dg-line blue" d="M136 53 H156" marker-end="url(#ah-a3)" />

            <text class="dg-h" x="16" y="108">STREAMING PATH — NOW</text>
            <rect class="dg-box c" x="16" y="118" width="120" height="42" rx="8" />
            <text class="dg-s" x="76" y="137" text-anchor="middle">events → Kafka</text>
            <text class="dg-s" x="76" y="151" text-anchor="middle">Kinesis / Dataflow</text>
            <rect class="dg-box c" x="160" y="118" width="120" height="42" rx="8" />
            <text class="dg-s" x="220" y="137" text-anchor="middle">stream compute</text>
            <text class="dg-s" x="220" y="151" text-anchor="middle">Flink / ksqlDB</text>
            <path class="dg-line cyan" d="M136 139 H156" marker-end="url(#ah-a3c)" />

            <rect class="dg-box i" x="312" y="70" width="128" height="60" rx="9" />
            <text class="dg-t" x="376" y="94" text-anchor="middle">Feature store</text>
            <text class="dg-s" x="376" y="110" text-anchor="middle">materialised values,</text>
            <text class="dg-s" x="376" y="122" text-anchor="middle">train/serve consistency</text>
            <path class="dg-line blue" d="M280 53 H296 V88 H308" marker-end="url(#ah-a3)" />
            <path class="dg-line cyan" d="M280 139 H296 V112 H308" marker-end="url(#ah-a3c)" />

            <rect class="dg-box p" x="472" y="70" width="130" height="60" rx="9" />
            <text class="dg-t" x="537" y="94" text-anchor="middle">Prediction service</text>
            <text class="dg-s" x="537" y="110" text-anchor="middle">+ RT features</text>
            <text class="dg-s" x="537" y="122" text-anchor="middle">computed inline</text>
            <path class="dg-line blue" d="M440 100 H468" marker-end="url(#ah-a3)" />
            <rect class="dg-box g" x="634" y="80" width="70" height="40" rx="8" />
            <text class="dg-s" x="669" y="105" text-anchor="middle">user</text>
            <path class="dg-line blue" d="M602 100 H630" marker-end="url(#ah-a3)" />
            <path class="dg-line rose dash" d="M669 120 V150 H76 V162" marker-end="url(#ah-a3r)" />
            <text class="dg-s" x="360" y="146" text-anchor="middle">activity flows back into the stream — this loop is what makes it real-time</text>

            <rect class="dg-band o" x="12" y="184" width="696" height="76" rx="10" />
            <text class="dg-h" x="26" y="204">THE HARD PART IS NOT SERVING — IT IS CONSISTENCY</text>
            <rect class="dg-box o" x="26" y="212" width="212" height="40" rx="7" />
            <text class="dg-s" x="132" y="228" text-anchor="middle">same feature definition</text>
            <text class="dg-s" x="132" y="242" text-anchor="middle">in training and serving</text>
            <rect class="dg-box o" x="250" y="212" width="212" height="40" rx="7" />
            <text class="dg-s" x="356" y="228" text-anchor="middle">point-in-time correctness</text>
            <text class="dg-s" x="356" y="242" text-anchor="middle">no future data in training rows</text>
            <rect class="dg-box o" x="474" y="212" width="220" height="40" rx="7" />
            <text class="dg-s" x="584" y="228" text-anchor="middle">time travel for debugging</text>
            <text class="dg-s" x="584" y="242" text-anchor="middle">recreate any past feature value</text>
          </svg>
          <figcaption>Figure 6 — Stage 3 architecture. Two pipelines, one feature store, and three consistency guarantees that decide whether your offline scores mean anything online.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="a3-req">The four requirements</h3>
        <ol class="lesson-steps">
          <li><strong>Mature streaming infrastructure</strong> with a stream processing engine efficient enough to compute all your streaming features within budget — a request must get into the transport and be processed quickly enough for the prediction service, before the next request arrives.</li>
          <li><strong>A feature store</strong> to manage materialised features and keep stream features consistent between training and serving. Note the caveat that was true when this was written and is only partly fixed now: feature stores typically manage materialised features, not the computation itself or the source code that defines it.</li>
          <li><strong>A model store.</strong> A new stream feature has to be validated, and the way you validate it is by adding it to a model — which effectively creates a new model. Ideally your model store would help you manage and evaluate those models; stores that also evaluate did not exist, and you could push part of the job onto a feature store.</li>
          <li><strong>A better development environment.</strong> Data scientists usually build streaming features while working off historical data, which makes it awkward to invent and validate them. The fix is to give them direct access to live streams — reading incoming data from a notebook rather than only yesterday's tables.</li>
        </ol>
        <p>Requirement four is the one I would push hardest on today, because it is a productivity multiplier rather than a piece of plumbing: the gap between "I can imagine this feature" and "I can see whether it separates the classes on live traffic" is where most feature ideas quietly die.</p>
      `,
    },
    {
      id: 'bandits',
      title: 'What Online Prediction Unlocks: Bandits',
      children: [
        { id: 'b-idea', title: 'Where the name comes from' },
        { id: 'b-ab', title: 'A/B testing is stateless, bandits are stateful' },
        { id: 'b-eval', title: 'Bandits for model evaluation' },
        { id: 'b-req', title: 'What bandits require' },
        { id: 'b-contextual', title: 'Contextual bandits as an exploration strategy' },
      ],
      html: `
        <p>Online prediction does more than improve accuracy. It makes a better class of online evaluation possible — and a better way to decide what to show users in the first place.</p>

        <h3 class="lesson-subhead" id="b-idea">Where the name comes from</h3>
        <p>Bandit algorithms come from gambling. A casino has several slot machines with different payouts, and a slot machine is nicknamed a one-armed bandit. You do not know which machine pays best, so you must experiment to find out <em>while</em> trying to maximise your winnings along the way.</p>
        <p><strong>Multi-armed bandits</strong> are the algorithms that balance those two urges: exploitation (keep pulling the arm that has paid most so far) against exploration (try other arms that might pay more).</p>

        <h3 class="lesson-subhead" id="b-ab">A/B testing is stateless, bandits are stateful</h3>
        <p>The industry standard for online model evaluation is A/B testing: route traffic randomly between models and, at the end of the trial, measure which did better.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 238" role="img" aria-label="A/B testing routes traffic on a fixed random split while a bandit shifts traffic towards the better-performing model as feedback arrives">
            <defs>
              <marker id="ah-ab" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-bd" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="340" height="206" rx="11" />
            <text class="dg-h" x="26" y="36">A/B TEST — STATELESS</text>
            <rect class="dg-box b" x="26" y="46" width="80" height="34" rx="7" />
            <text class="dg-s" x="66" y="67" text-anchor="middle">traffic</text>
            <rect class="dg-box" x="140" y="46" width="90" height="34" rx="7" />
            <text class="dg-s" x="185" y="67" text-anchor="middle">50% → A</text>
            <rect class="dg-box" x="140" y="92" width="90" height="34" rx="7" />
            <text class="dg-s" x="185" y="113" text-anchor="middle">50% → B</text>
            <path class="dg-line blue" d="M106 60 H122 V63 H136" marker-end="url(#ah-ab)" />
            <path class="dg-line blue" d="M106 68 H122 V109 H136" marker-end="url(#ah-ab)" />
            <text class="dg-s" x="248" y="60">split is fixed</text>
            <text class="dg-s" x="248" y="76">for the whole</text>
            <text class="dg-s" x="248" y="92">trial, whatever</text>
            <text class="dg-s" x="248" y="108">the results say</text>
            <text class="dg-s" x="26" y="152">· no need to know current performance</text>
            <text class="dg-s" x="26" y="170">· works even with batch prediction</text>
            <text class="dg-s" x="26" y="188">· half your users keep seeing the</text>
            <text class="dg-s" x="26" y="202">  worse model until the trial ends</text>

            <rect class="dg-band g" x="368" y="16" width="340" height="206" rx="11" />
            <text class="dg-h" x="382" y="36">BANDIT — STATEFUL</text>
            <rect class="dg-box g" x="382" y="46" width="80" height="34" rx="7" />
            <text class="dg-s" x="422" y="67" text-anchor="middle">traffic</text>
            <rect class="dg-box g" x="496" y="46" width="90" height="34" rx="7" />
            <text class="dg-s" x="541" y="67" text-anchor="middle">85% → A</text>
            <rect class="dg-box" x="496" y="92" width="90" height="34" rx="7" />
            <text class="dg-s" x="541" y="113" text-anchor="middle">15% → B</text>
            <path class="dg-line green thick" d="M462 60 H478 V63 H492" marker-end="url(#ah-bd)" />
            <path class="dg-line green" d="M462 68 H478 V109 H492" marker-end="url(#ah-bd)" />
            <text class="dg-s" x="604" y="60">split shifts as</text>
            <text class="dg-s" x="604" y="76">feedback</text>
            <text class="dg-s" x="604" y="92">arrives</text>
            <path class="dg-line green dash" d="M600 126 V138 H422 V84" marker-end="url(#ah-bd)" />
            <text class="dg-s" x="382" y="152">· must compute each model's current</text>
            <text class="dg-s" x="382" y="166">  performance before routing</text>
            <text class="dg-s" x="382" y="184">· far more data-efficient; in many</text>
            <text class="dg-s" x="382" y="198">  cases provably optimal</text>
            <text class="dg-s" x="382" y="216">· fewer bad predictions shown to users</text>
          </svg>
          <figcaption>Figure 7 — The structural difference. A/B testing needs no knowledge of current performance, which is why it works even with batch prediction; bandits need it before every routing decision.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="b-eval">Bandits for model evaluation</h3>
        <p>Treat each model you are evaluating as a slot machine whose payout — prediction accuracy, click-through, conversion — is unknown. A bandit then decides how to route each request, converging on the best model while minimising how many poor predictions reach users.</p>
        <p>Bandits are well studied and considerably more data-efficient than A/B testing; in many settings they are the optimal approach. They need less data to identify the best model <em>and</em> reduce opportunity cost, because traffic shifts toward the winner sooner.</p>
        <p>The gap is larger than most people expect. In an experiment by Google's Greg Rafferty, an A/B test needed over 630,000 samples to reach a 95% confidence interval, while a simple Thompson Sampling bandit established that one model was 5% better with fewer than 12,000 samples. There are also public write-ups from LinkedIn, Netflix, Facebook, Dropbox and Stitch Fix, and for theory, chapter 2 of Sutton &amp; Barto's <em>Reinforcement Learning</em>.</p>

        <h3 class="lesson-subhead" id="b-req">What bandits require</h3>
        <ol class="lesson-steps">
          <li><strong>Online prediction.</strong> Non-negotiable — you cannot reroute a prediction that was computed last night.</li>
          <li><strong>Preferably short feedback loops.</strong> You need to know whether a prediction was good in order to update each model's standing. Recommendations are the ideal case: a click implies the recommendation was decent. Long feedback loops do not make bandits impossible, just slower to converge.</li>
          <li><strong>Machinery to collect feedback, compute and track per-model performance, and route requests accordingly.</strong> This is the part teams underestimate — it is stateful, it must be fast, and it must be correct.</li>
        </ol>
        <p>Which is why bandits, despite being better on the merits, are not widely used outside a handful of large tech companies. They are markedly harder to implement than an A/B test, and the barrier is infrastructure rather than mathematics.</p>

        <h3 class="lesson-subhead" id="b-contextual">Contextual bandits as an exploration strategy</h3>
        <p>Terminology first, because it is genuinely confusing: some people use "contextual bandits" for bandits used in model evaluation. Here, contextual bandits mean something different — determining the payout of each <strong>action</strong> rather than each model. In recommendation terms, the action is which item to show and the payout is how likely the user clicks it.</p>
        <p>Why you need them: suppose you have 10,000 items and show 10 at a time. You learn whether those 10 were clicked. You learn <em>nothing</em> about the other 9,990.</p>
        <blockquote>
          <p>If you only ever show users the items they are most likely to click, you end up trapped in a feedback loop — surfacing popular items forever and never gathering evidence about the rest of the catalogue.</p>
          <cite>Paraphrasing Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022)</cite>
        </blockquote>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Without exploration a recommender collects feedback only on popular items; with contextual bandits it deliberately samples unknown items and discovers new winners">
            <defs>
              <marker id="ah-cb" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cb2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="340" height="184" rx="11" />
            <text class="dg-h" x="26" y="36">PURE EXPLOITATION — THE TRAP</text>
            <rect class="dg-box r" x="26" y="46" width="100" height="34" rx="7" />
            <text class="dg-s" x="76" y="67" text-anchor="middle">show top 10</text>
            <rect class="dg-box r" x="150" y="46" width="100" height="34" rx="7" />
            <text class="dg-s" x="200" y="67" text-anchor="middle">get feedback</text>
            <rect class="dg-box r" x="150" y="102" width="100" height="34" rx="7" />
            <text class="dg-s" x="200" y="123" text-anchor="middle">model confirms</text>
            <rect class="dg-box" x="26" y="102" width="100" height="34" rx="7" />
            <text class="dg-s" x="76" y="118" text-anchor="middle">9,990 items</text>
            <text class="dg-s" x="76" y="132" text-anchor="middle">never seen</text>
            <path class="dg-line rose" d="M126 63 H146" marker-end="url(#ah-cb)" />
            <path class="dg-line rose" d="M200 80 V98" marker-end="url(#ah-cb)" />
            <path class="dg-line rose" d="M150 119 H130" marker-end="url(#ah-cb)" />
            <path class="dg-line rose dash" d="M76 102 V84" marker-end="url(#ah-cb)" />
            <text class="dg-s" x="26" y="164">Popular items stay popular because they</text>
            <text class="dg-s" x="26" y="178">are shown, not because they are best.</text>
            <text class="dg-s" x="26" y="192">The long tail is invisible forever.</text>

            <rect class="dg-band p" x="368" y="16" width="340" height="184" rx="11" />
            <text class="dg-h" x="382" y="36">CONTEXTUAL BANDIT — BALANCED</text>
            <rect class="dg-box g" x="382" y="46" width="146" height="34" rx="7" />
            <text class="dg-s" x="455" y="67" text-anchor="middle">8 known-good (exploit)</text>
            <rect class="dg-box y" x="382" y="88" width="146" height="34" rx="7" />
            <text class="dg-s" x="455" y="109" text-anchor="middle">2 uncertain (explore)</text>
            <rect class="dg-box p" x="552" y="46" width="142" height="76" rx="7" />
            <text class="dg-s" x="623" y="72" text-anchor="middle">uses context —</text>
            <text class="dg-s" x="623" y="86" text-anchor="middle">user, session, time —</text>
            <text class="dg-s" x="623" y="100" text-anchor="middle">to choose which</text>
            <text class="dg-s" x="623" y="114" text-anchor="middle">unknowns are worth a try</text>
            <path class="dg-line violet" d="M528 63 H548" marker-end="url(#ah-cb2)" />
            <path class="dg-line violet" d="M528 105 H548" marker-end="url(#ah-cb2)" />
            <text class="dg-s" x="382" y="150">Cost: a few suboptimal impressions.</text>
            <text class="dg-s" x="382" y="164">Payoff: you discover items the greedy</text>
            <text class="dg-s" x="382" y="178">policy would never have surfaced.</text>
            <text class="dg-s" x="382" y="192">Reported gains at Twitter and Google.</text>
          </svg>
          <figcaption>Figure 8 — Contextual bandits spend a small, deliberate amount of traffic buying information about items you know nothing about, using context to spend it wisely.</figcaption>
        </figure>
        <p>Contextual bandits are well researched and have been shown to improve model performance substantially, with public reports from Twitter and Google. They are also harder to implement than model-evaluation bandits, because the exploration strategy is entangled with the model architecture — a decision tree and a neural network need different approaches — which makes the solution less portable between use cases.</p>
        <div class="lesson-callout"><strong>Practical order of adoption:</strong> A/B testing → interleaving or shadow deployment for cheap comparisons → bandits for model selection once feedback is fast and routing is stateful → contextual bandits only where catalogue coverage genuinely limits your metrics.</div>
      `,
    },
    {
      id: 'cl-what',
      title: 'Ladder B — What Continual Learning Actually Means',
      children: [
        { id: 'cl-myth', title: 'It is not about retraining frequency' },
        { id: 'cl-stateful', title: 'Stateless retraining vs stateful training' },
        { id: 'cl-iteration', title: 'Model iteration vs data iteration' },
      ],
      html: `
        <p>Say "continual learning" and people picture models updating every five minutes. The usual objections follow: we do not have the traffic to justify that, and our models do not decay that fast. Both objections are fair — and both miss what the term means.</p>

        <h3 class="lesson-subhead" id="cl-myth">It is not about retraining frequency</h3>
        <p>Continual learning is not about <em>how often</em> you retrain. It is about <em>the manner in which</em> the model is retrained.</p>
        <p>Most companies do <strong>stateless retraining</strong>: every update trains a fresh model from scratch. Continual learning means enabling <strong>stateful training</strong>: the existing model keeps training on new data — fine-tuning rather than restarting.</p>
        <blockquote>
          <p>Once your infrastructure supports stateful training, the update frequency becomes just a knob you turn — hourly, daily, or whenever the system detects a distribution shift.</p>
          <cite>Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022)</cite>
        </blockquote>
        <p>That reframing is the whole point. Arguing about whether you need five-minute updates is arguing about the knob. The engineering work is building the thing the knob is attached to.</p>

        <h3 class="lesson-subhead" id="cl-stateful">Stateless retraining vs stateful training</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="Stateless retraining reprocesses months of data each time while stateful training fine-tunes the previous model on only the newest data">
            <defs>
              <marker id="ah-st" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-st2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="696" height="98" rx="11" />
            <text class="dg-h" x="26" y="36">STATELESS RETRAINING — FROM SCRATCH, EVERY TIME</text>
            <rect class="dg-box r" x="26" y="46" width="150" height="54" rx="8" />
            <text class="dg-s" x="101" y="66" text-anchor="middle">3 months of data</text>
            <text class="dg-s" x="101" y="80" text-anchor="middle">reprocessed</text>
            <text class="dg-s" x="101" y="94" text-anchor="middle">Mon update</text>
            <rect class="dg-box r" x="196" y="46" width="150" height="54" rx="8" />
            <text class="dg-s" x="271" y="66" text-anchor="middle">3 months of data</text>
            <text class="dg-s" x="271" y="80" text-anchor="middle">reprocessed again</text>
            <text class="dg-s" x="271" y="94" text-anchor="middle">Tue update</text>
            <rect class="dg-box r" x="366" y="46" width="150" height="54" rx="8" />
            <text class="dg-s" x="441" y="66" text-anchor="middle">3 months of data</text>
            <text class="dg-s" x="441" y="80" text-anchor="middle">reprocessed again</text>
            <text class="dg-s" x="441" y="94" text-anchor="middle">Wed update</text>
            <rect class="dg-box" x="536" y="46" width="158" height="54" rx="8" />
            <text class="dg-s" x="615" y="66" text-anchor="middle">almost all of this</text>
            <text class="dg-s" x="615" y="80" text-anchor="middle">computation is</text>
            <text class="dg-s" x="615" y="94" text-anchor="middle">redundant</text>
            <path class="dg-line rose" d="M176 73 H192" marker-end="url(#ah-st)" />
            <path class="dg-line rose" d="M346 73 H362" marker-end="url(#ah-st)" />
            <path class="dg-line rose dash" d="M516 73 H532" marker-end="url(#ah-st)" />

            <rect class="dg-band g" x="12" y="126" width="696" height="98" rx="11" />
            <text class="dg-h" x="26" y="146">STATEFUL TRAINING — CONTINUE FROM WHERE YOU WERE</text>
            <rect class="dg-box g" x="26" y="156" width="150" height="54" rx="8" />
            <text class="dg-s" x="101" y="176" text-anchor="middle">model v1</text>
            <text class="dg-s" x="101" y="190" text-anchor="middle">+ Monday's data</text>
            <text class="dg-s" x="101" y="204" text-anchor="middle">→ v2</text>
            <rect class="dg-box g" x="196" y="156" width="150" height="54" rx="8" />
            <text class="dg-s" x="271" y="176" text-anchor="middle">model v2</text>
            <text class="dg-s" x="271" y="190" text-anchor="middle">+ Tuesday's data</text>
            <text class="dg-s" x="271" y="204" text-anchor="middle">→ v3</text>
            <rect class="dg-box g" x="366" y="156" width="150" height="54" rx="8" />
            <text class="dg-s" x="441" y="176" text-anchor="middle">model v3</text>
            <text class="dg-s" x="441" y="190" text-anchor="middle">+ Wednesday's data</text>
            <text class="dg-s" x="441" y="204" text-anchor="middle">→ v4</text>
            <rect class="dg-box l" x="536" y="156" width="158" height="54" rx="8" />
            <text class="dg-s" x="615" y="176" text-anchor="middle">Grubhub reported a</text>
            <text class="dg-s" x="615" y="190" text-anchor="middle">45× training cost</text>
            <text class="dg-s" x="615" y="204" text-anchor="middle">reduction (2021)</text>
            <path class="dg-line green" d="M176 183 H192" marker-end="url(#ah-st2)" />
            <path class="dg-line green" d="M346 183 H362" marker-end="url(#ah-st2)" />
            <path class="dg-line green" d="M516 183 H532" marker-end="url(#ah-st2)" />
          </svg>
          <figcaption>Figure 9 — Stateless versus stateful. Grubhub's move from stateless to stateful daily retraining cut training cost by a factor of 45 — the strongest single number in favour of this ladder.</figcaption>
        </figure>
        <p>Stateful training also lets you update on far less data. Monthly updates might need three months of history retrained from scratch; daily updates need only yesterday's data fine-tuned onto the existing model.</p>
        <p>There is a subtler benefit worth noting: with incremental training you only need to see each data sample at most twice — once when it produced a prediction, once when it trained the model. If data privacy or retention limits matter to you, you may be able to discard samples after use rather than keeping years of history to re-scan.</p>

        <h3 class="lesson-subhead" id="cl-iteration">Model iteration vs data iteration</h3>
        <p>Two different things get called "updating the model", and only one of them can currently be stateful:</p>
        <table>
          <thead><tr><th>Type</th><th>What changes</th><th>Can it be stateful?</th></tr></thead>
          <tbody>
            <tr><td><strong>Model iteration</strong></td><td>Adding a feature to an existing architecture, or changing the architecture itself</td><td>No — you retrain from scratch</td></tr>
            <tr><td><strong>Data iteration</strong></td><td>Same architecture, same features, new data</td><td>Yes — this is what stateful training means today</td></tr>
          </tbody>
        </table>
        <p>There is research on relaxing that limit — knowledge transfer work from Google (2015) and OpenAI's model surgery (2019), which transfers trained weights from one network into another after deciding which parts are unchanged and which must be reinitialised. Several large labs have experimented with it, without clear industry results at the time of writing.</p>
        <p>The practical consequence for planning: <strong>a new feature is a new model.</strong> If your roadmap includes a lot of feature experimentation, most of your compute will still go on from-scratch training regardless of how good your stateful pipeline is.</p>
      `,
    },
    {
      id: 'cl-stages',
      title: 'Ladder B · Stages 1–2 — Manual, Then Automated Retraining',
      children: [
        { id: 'b1-manual', title: 'Stage 1 · Manual, stateless retraining' },
        { id: 'b2-auto', title: 'Stage 2 · Automated retraining' },
        { id: 'b2-schedules', title: 'Different models, different schedules' },
        { id: 'b2-req', title: 'Requirements: model store, scheduler, data access' },
        { id: 'b2-logwait', title: 'Bonus: log and wait' },
      ],
      html: `
        <h3 class="lesson-subhead" id="b1-manual">Stage 1 · Manual, stateless retraining</h3>
        <p>Early on, an ML team is judged on how many business problems it can attack — fraud, recommendations, delivery estimates — so building new models crowds out maintaining old ones. An existing model gets updated only when two conditions coincide: its performance has decayed to the point of doing more harm than good, <em>and</em> somebody has time.</p>
        <p>The result is a fleet with wildly different ages. Some models updated in the last quarter, some every six months, some deployed a year ago and never touched since.</p>
        <p>The process itself is manual and hand-offy, and the description below is worth reading closely because the bug it produces is so common:</p>
        <ul class="lesson-layers">
          <li>Someone, often on the data platform team, queries the warehouse for new data.</li>
          <li>Someone else cleans it, extracts features, retrains the model from scratch on old plus new data, and exports a binary.</li>
          <li>Someone else takes that binary and deploys it.</li>
          <li><strong>The failure mode:</strong> feature, model or processing code was changed during retraining, but those changes never made it to production — producing bugs that are extremely hard to trace, because the model that was trained is not quite the model that is serving.</li>
        </ul>
        <p>If that sounds familiar, it is not unusual. The vast majority of companies outside tech — roughly, anyone who adopted ML recently and has no ML platform team — are here.</p>

        <h3 class="lesson-subhead" id="b2-auto">Stage 2 · Automated retraining</h3>
        <p>Now a script executes the retraining process on a schedule, usually as a batch job in something like Spark. Most companies with reasonably mature ML infrastructure are at this stage.</p>
        <p>A few sophisticated teams run experiments to find the optimal retraining frequency. For most, the frequency comes from instinct — "daily feels about right", or "kick it off overnight when compute is idle". That is not necessarily wrong, but it is worth knowing that it is a guess rather than a measurement.</p>

        <h3 class="lesson-subhead" id="b2-schedules">Different models, different schedules</h3>
        <p>An important detail once you have more than one model: <strong>different models in the same pipeline may need different retraining schedules.</strong></p>
        <p>Take the session-based recommender. If the embedding model is separate from the ranking model, embeddings might be fine weekly while ranking needs daily updates — unless you add many new items each day, in which case embeddings need to keep up too.</p>
        <p>And it gets harder with dependencies: because the ranking model consumes the embeddings, changing the embeddings means the ranking model should be updated as well. That dependency graph is the thing that turns a cron job into an orchestration problem.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 202" role="img" aria-label="Model dependency graph showing that retraining the embedding model forces the ranking model to be retrained too">
            <defs>
              <marker id="ah-dep" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">DEPENDENCIES DECIDE THE SCHEDULE — NOT CONVENIENCE</text>
            <rect class="dg-box i" x="30" y="40" width="150" height="48" rx="9" />
            <text class="dg-t" x="105" y="60" text-anchor="middle">Embedding model</text>
            <text class="dg-s" x="105" y="76" text-anchor="middle">weekly — unless many</text>
            <rect class="dg-box p" x="250" y="40" width="150" height="48" rx="9" />
            <text class="dg-t" x="325" y="60" text-anchor="middle">Retrieval model</text>
            <text class="dg-s" x="325" y="76" text-anchor="middle">follows embeddings</text>
            <rect class="dg-box k" x="470" y="40" width="150" height="48" rx="9" />
            <text class="dg-t" x="545" y="60" text-anchor="middle">Ranking model</text>
            <text class="dg-s" x="545" y="76" text-anchor="middle">daily</text>
            <path class="dg-line violet" d="M180 64 H246" marker-end="url(#ah-dep)" />
            <path class="dg-line violet" d="M400 64 H466" marker-end="url(#ah-dep)" />
            <path class="dg-line violet dash" d="M105 88 V124 H545 V92" marker-end="url(#ah-dep)" />
            <text class="dg-s" x="325" y="140" text-anchor="middle">if embeddings change, everything downstream must be retrained and re-evaluated</text>
            <rect class="dg-box o" x="30" y="152" width="590" height="34" rx="8" />
            <text class="dg-s" x="325" y="173" text-anchor="middle">A stale downstream model on fresh upstream embeddings is a silent accuracy loss — nothing errors, scores just drift</text>
          </svg>
          <figcaption>Figure 10 — Retraining schedules are a graph problem, not a list of cron entries. The silent failure in the orange box is why this matters.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="b2-req">Requirements: model store, scheduler, data access</h3>
        <p>If you already run models in production, you probably have most of the pieces. The one thing you may be missing is a <strong>model store</strong> that automatically versions and stores all the code and artefacts needed to reproduce a model.</p>
        <p>The simplest usable model store is an S3 bucket holding serialised models in some structured layout. For something more capable, the two commonly cited options were SageMaker (managed, harder to use, and does not store your model's code and artefacts) and MLflow (open source, more featureful, but potentially awkward if your platform has many quirks).</p>
        <p>Beyond that you need scripts and configuration to sample data, extract features, and process or annotate labels automatically. Two factors dominate how long that takes:</p>
        <ol class="lesson-steps">
          <li><strong>Scheduler.</strong> If you already run Airflow, Argo or similar, wiring the steps together is not the hard part.</li>
          <li><strong>Data access and availability.</strong> Is the data you need actually in the warehouse? Do you have to join across organisational boundaries? Do tables need building from scratch? Stitch Fix's ML/data platform manager Stefan Krawczyk suspected this is where most people's time actually goes — and that matches what I have seen.</li>
        </ol>

        <h3 class="lesson-subhead" id="b2-logwait">Bonus: log and wait</h3>
        <p>Here is a trick that deserves to be better known. When you retrain on new data, that data has usually already passed through your prediction service — which means the features were <em>already computed once</em>, at prediction time. Rather than recomputing them for training, log them and reuse them. This is called <strong>log and wait</strong>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 196" role="img" aria-label="Log and wait: features computed at prediction time are logged and reused for training, avoiding recomputation and training-serving skew">
            <defs>
              <marker id="ah-lw" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-lw2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="20" y="40" width="118" height="46" rx="8" />
            <text class="dg-s" x="79" y="59" text-anchor="middle">request arrives</text>
            <text class="dg-s" x="79" y="73" text-anchor="middle">features computed</text>
            <rect class="dg-box c" x="176" y="40" width="118" height="46" rx="8" />
            <text class="dg-s" x="235" y="59" text-anchor="middle">prediction</text>
            <text class="dg-s" x="235" y="73" text-anchor="middle">served</text>
            <rect class="dg-box y" x="332" y="40" width="130" height="46" rx="8" />
            <text class="dg-s" x="397" y="59" text-anchor="middle">log the features</text>
            <text class="dg-s" x="397" y="73" text-anchor="middle">exactly as used</text>
            <rect class="dg-box o" x="500" y="40" width="118" height="46" rx="8" />
            <text class="dg-s" x="559" y="59" text-anchor="middle">wait for the</text>
            <text class="dg-s" x="559" y="73" text-anchor="middle">label to arrive</text>
            <rect class="dg-box g" x="332" y="122" width="130" height="46" rx="8" />
            <text class="dg-s" x="397" y="141" text-anchor="middle">training example,</text>
            <text class="dg-s" x="397" y="155" text-anchor="middle">no recomputation</text>
            <path class="dg-line cyan" d="M138 63 H172" marker-end="url(#ah-lw)" />
            <path class="dg-line cyan" d="M294 63 H328" marker-end="url(#ah-lw)" />
            <path class="dg-line cyan" d="M462 63 H496" marker-end="url(#ah-lw)" />
            <path class="dg-line green" d="M559 86 V104 H397 V118" marker-end="url(#ah-lw2)" />
            <text class="dg-h" x="20" y="24">LOG AND WAIT — REUSE WHAT YOU ALREADY COMPUTED</text>
            <text class="dg-s" x="20" y="140">Two wins:</text>
            <text class="dg-s" x="20" y="156">· saves feature computation</text>
            <text class="dg-s" x="20" y="172">· kills training–serving skew</text>
            <text class="dg-s" x="500" y="140">Cost: you must wait for labels,</text>
            <text class="dg-s" x="500" y="156">and store logged features</text>
            <text class="dg-s" x="500" y="172">reliably at volume.</text>
          </svg>
          <figcaption>Figure 11 — Log and wait. The second benefit is the bigger one: features used in training are byte-for-byte the ones used in production, which removes a whole category of bug.</figcaption>
        </figure>
        <p>That second benefit is the classic motivation: it attacks <strong>training-serving skew</strong>, the bugs caused by mismatches between how features are computed in production versus development. Faire published a good discussion of the trade-offs in their own log-and-wait approach. It was described as not yet popular but growing, with an expectation it would become standard — and that has broadly happened, with logged-feature pipelines now a normal part of mature feature platforms.</p>
      `,
    },
    {
      id: 'cl-34',
      title: 'Ladder B · Stages 3–4 — Stateful Training, Then Continual Learning',
      children: [
        { id: 'b3-stateful', title: 'Stage 3 · Automated, stateful training' },
        { id: 'b3-req', title: 'Requirements: lineage and stream reproducibility' },
        { id: 'b4-cl', title: 'Stage 4 · Continual learning' },
        { id: 'b4-triggers', title: 'Triggers: time, performance, drift' },
        { id: 'b4-eval', title: 'Continually evaluating a moving model' },
        { id: 'b4-edge', title: 'The edge deployment endgame' },
      ],
      html: `
        <h3 class="lesson-subhead" id="b3-stateful">Stage 3 · Automated, stateful training</h3>
        <p>Same automation as Stage 2, but the training itself continues from the previous model rather than starting over — the shift illustrated in Figure 9, with Grubhub's 45× cost reduction as the headline result.</p>
        <p>Note what has <em>not</em> changed at this stage: the trigger is still a schedule. You have made each update dramatically cheaper, which is precisely what makes frequent updates viable, but nothing yet decides when an update is needed.</p>

        <h3 class="lesson-subhead" id="b3-req">Requirements: lineage and stream reproducibility</h3>
        <p>The main thing you need here is a better model store, with two capabilities:</p>
        <ul class="lesson-layers">
          <li><strong>Model lineage.</strong> Not just versioning, but tracking which model was fine-tuned from which. With stateful training your model has ancestry, and when something goes wrong you need to know which ancestor introduced it.</li>
          <li><strong>Streaming feature reproducibility.</strong> The ability to time-travel: extract streaming features as they were at some past moment, and reconstruct the exact training data used for a model at any point in history, so you can debug it.</li>
        </ul>
        <p>At the time this was written, no model store offered both. You could potentially delegate stream reproducibility to a feature store, but you would likely end up building part of the solution in-house — and in my experience that remains substantially true today, even though feature platforms have improved point-in-time correctness considerably.</p>
        <div class="lesson-callout"><strong>Why lineage is not optional here.</strong> With stateless retraining, a bad model is a bad run — throw it away and retrain. With stateful training, a bad update contaminates every descendant, so you need to know where to roll back to. Keep periodic from-scratch "anchor" models for exactly this reason.</div>

        <h3 class="lesson-subhead" id="b4-cl">Stage 4 · Continual learning</h3>
        <p>The destination:</p>
        <blockquote>
          <p>Instead of updating your models on a fixed schedule, update them continually — whenever data distributions shift and model performance drops.</p>
          <cite>Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022)</cite>
        </blockquote>
        <p>The step from Stage 3 to Stage 4 is steep, because it requires three things that are each genuinely hard.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Continual learning loop: triggers detect drift, an orchestrator spins up an update, the candidate passes an evaluation gauntlet before replacing the serving model">
            <defs>
              <marker id="ah-cl" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cl2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band p" x="12" y="16" width="230" height="118" rx="11" />
            <text class="dg-h" x="26" y="36">1 · TRIGGER</text>
            <rect class="dg-box y" x="26" y="44" width="202" height="26" rx="6" />
            <text class="dg-s" x="127" y="61" text-anchor="middle">time-based — every N minutes</text>
            <rect class="dg-box o" x="26" y="76" width="202" height="26" rx="6" />
            <text class="dg-s" x="127" y="93" text-anchor="middle">performance-based — metric drops</text>
            <rect class="dg-box r" x="26" y="108" width="202" height="26" rx="6" />
            <text class="dg-s" x="127" y="125" text-anchor="middle">drift-based — distribution shifts</text>

            <rect class="dg-box i" x="272" y="46" width="150" height="60" rx="9" />
            <text class="dg-t" x="347" y="70" text-anchor="middle">2 · Orchestrator</text>
            <text class="dg-s" x="347" y="86" text-anchor="middle">spins up instances to</text>
            <text class="dg-s" x="347" y="98" text-anchor="middle">update + evaluate</text>
            <path class="dg-line violet" d="M242 76 H268" marker-end="url(#ah-cl)" />

            <rect class="dg-box c" x="452" y="46" width="120" height="60" rx="9" />
            <text class="dg-t" x="512" y="70" text-anchor="middle">candidate</text>
            <text class="dg-s" x="512" y="86" text-anchor="middle">fine-tuned on</text>
            <text class="dg-s" x="512" y="98" text-anchor="middle">the newest data</text>
            <path class="dg-line violet" d="M422 76 H448" marker-end="url(#ah-cl)" />

            <rect class="dg-band g" x="12" y="146" width="696" height="76" rx="11" />
            <text class="dg-h" x="26" y="166">3 · EVALUATION GAUNTLET — A STATIONARY TEST SET NO LONGER SUFFICES</text>
            <rect class="dg-box g" x="26" y="174" width="122" height="38" rx="7" />
            <text class="dg-s" x="87" y="190" text-anchor="middle">backtest</text>
            <text class="dg-s" x="87" y="203" text-anchor="middle">recent held-out</text>
            <rect class="dg-box g" x="160" y="174" width="122" height="38" rx="7" />
            <text class="dg-s" x="221" y="190" text-anchor="middle">progressive</text>
            <text class="dg-s" x="221" y="203" text-anchor="middle">evaluation</text>
            <rect class="dg-box c" x="294" y="174" width="122" height="38" rx="7" />
            <text class="dg-s" x="355" y="190" text-anchor="middle">shadow</text>
            <text class="dg-s" x="355" y="203" text-anchor="middle">deployment</text>
            <rect class="dg-box b" x="428" y="174" width="122" height="38" rx="7" />
            <text class="dg-s" x="489" y="190" text-anchor="middle">canary</text>
            <text class="dg-s" x="489" y="203" text-anchor="middle">analysis</text>
            <rect class="dg-box p" x="562" y="174" width="132" height="38" rx="7" />
            <text class="dg-s" x="628" y="190" text-anchor="middle">A/B test</text>
            <text class="dg-s" x="628" y="203" text-anchor="middle">or bandit</text>
            <path class="dg-line green" d="M512 106 V140 H628 V170" marker-end="url(#ah-cl2)" />
            <rect class="dg-box l" x="596" y="240" width="112" height="22" rx="6" />
            <text class="dg-s" x="652" y="255" text-anchor="middle">promote to serving</text>
            <path class="dg-line green" d="M628 212 V236" marker-end="url(#ah-cl2)" />
            <path class="dg-line violet dash" d="M596 251 H127 V138" marker-end="url(#ah-cl)" />
            <text class="dg-s" x="300" y="240">and the loop watches the new model too — promotion is not the end</text>
          </svg>
          <figcaption>Figure 12 — The continual learning loop. Most teams can build the trigger and the orchestrator; the gauntlet in the green band is where the real difficulty lives.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="b4-triggers">Triggers: time, performance, drift</h3>
        <p>You need a mechanism to trigger updates, and it can be time-based (every five minutes), performance-based (accuracy plummets), or drift-based (input distributions move).</p>
        <p>Drift-based triggering runs into a problem that is worth stating precisely, because it is the crux of monitoring in this field. Most monitoring tools analyse features — tracking summary statistics like mean, variance, min and max, and alerting when they change materially. But a model may have hundreds or thousands of features, and <strong>most statistical changes are harmless.</strong> The difficulty is not detecting change; it is knowing which change deserves your attention.</p>
        <p>What I would add from the intervening years: the most useful practical answer has been to move up the stack and monitor <em>outputs and outcomes</em> rather than inputs — prediction distribution shifts, score calibration, business-metric deltas — and to reserve feature-level alerts for a small set of features you know the model leans on hardest. That converts thousands of noisy signals into a handful of meaningful ones.</p>

        <h3 class="lesson-subhead" id="b4-eval">Continually evaluating a moving model</h3>
        <p>Writing the function that updates the model is not much harder than Stage 3. The hard part is making sure the updated model actually works — and because you are updating precisely to adapt to a changing environment, <strong>a fixed test set no longer tells you what you need to know.</strong> A model tuned for this week's distribution may look worse on last quarter's held-out data while being genuinely better in production.</p>
        <p>So evaluation becomes a layered process rather than a single number: backtesting on the most recent data, progressive evaluation as results arrive, and testing in production through shadow deployment, A/B testing, canary analysis and bandits. This is where the bandits section earlier stops being a curiosity and becomes load-bearing infrastructure.</p>
        <p>Finally you need an <strong>orchestrator</strong> to spin up instances that update and evaluate models without disturbing the prediction service that is currently serving users.</p>

        <h3 class="lesson-subhead" id="b4-edge">The edge deployment endgame</h3>
        <p>The most ambitious version combines continual learning with edge deployment: ship a base model on a device — a phone, a watch, a drone — and let the model on that device keep adapting to its own environment. No centralised serving cost, and no data shuttling between device and cloud.</p>
        <p>Four years on, the honest status report: on-device inference has become genuinely mainstream, with capable small models running locally on phones and laptops. On-device <em>continual training</em> remains rare in production, mostly limited to narrow personalisation, and federated learning — training across many devices without centralising their data — has found real but selective deployment (keyboard prediction and similar) rather than becoming the default. The vision is still right; the timeline was optimistic, largely because evaluating thousands of independently drifting models is even harder than evaluating one.</p>
      `,
    },
    {
      id: 'streaming',
      title: 'Stream vs Batch, and What Feature Stores Really Do',
      children: [
        { id: 'sv-cost', title: 'Cost efficiency' },
        { id: 'sv-perf', title: 'Performance efficiency' },
        { id: 'sv-talent', title: 'Talent efficiency' },
        { id: 'sv-fs', title: 'What feature stores actually do' },
      ],
      html: `
        <p>Both ladders converge on the same dependency: streaming infrastructure. Online prediction needs it, and while the training half of continual learning can be done in batch, the online evaluation half cannot. So it is worth being precise about when streaming wins, along three dimensions — cost, performance and talent.</p>

        <h3 class="lesson-subhead" id="sv-cost">Cost efficiency</h3>
        <p>There is no universal formula. It depends on latency requirements, data size, tolerance for late arrivals, failure tolerance, and statefulness. Streaming's strength is <strong>stateful, continuous, unbounded</strong> processing, and used well it is often cheaper than stateless batch.</p>
        <p>The clearest illustration: suppose you need a sliding window scoring user engagement across a 30-day trial. A batch job recomputes 30 days of data on every single run. A stateful streaming job maintains the window incrementally and skips all that redundant work. Conversely, for one-off processing of an enormous dataset at rest, batch remains the better tool. The best teams are fluent in both.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="A 30-day sliding window recomputed daily by batch versus maintained incrementally by a stateful stream processor">
            <defs>
              <marker id="ah-sv" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">SAME FEATURE · 30-DAY SLIDING WINDOW · THREE CONSECUTIVE DAYS</text>
            <rect class="dg-box r" x="16" y="34" width="216" height="24" rx="6" />
            <text class="dg-s" x="124" y="50" text-anchor="middle">batch: rescan 30 days</text>
            <rect class="dg-box r" x="240" y="34" width="216" height="24" rx="6" />
            <text class="dg-s" x="348" y="50" text-anchor="middle">batch: rescan 30 days</text>
            <rect class="dg-box r" x="464" y="34" width="216" height="24" rx="6" />
            <text class="dg-s" x="572" y="50" text-anchor="middle">batch: rescan 30 days</text>
            <text class="dg-s" x="16" y="76">→ 90 days of processing to produce 3 days of updates</text>
            <rect class="dg-box g" x="16" y="96" width="70" height="24" rx="6" />
            <text class="dg-s" x="51" y="112" text-anchor="middle">+1 day</text>
            <rect class="dg-box g" x="94" y="96" width="70" height="24" rx="6" />
            <text class="dg-s" x="129" y="112" text-anchor="middle">+1 day</text>
            <rect class="dg-box g" x="172" y="96" width="70" height="24" rx="6" />
            <text class="dg-s" x="207" y="112" text-anchor="middle">+1 day</text>
            <rect class="dg-box l" x="256" y="96" width="230" height="24" rx="6" />
            <text class="dg-s" x="371" y="112" text-anchor="middle">stateful stream keeps the window in state</text>
            <text class="dg-s" x="16" y="138">→ 3 days of processing for the same 3 updates, minus the expired edge</text>
            <path class="dg-line green" d="M86 108 H90" marker-end="url(#ah-sv)" />
            <path class="dg-line green" d="M164 108 H168" marker-end="url(#ah-sv)" />
            <path class="dg-line green" d="M242 108 H252" marker-end="url(#ah-sv)" />
            <rect class="dg-box b" x="16" y="156" width="664" height="34" rx="7" />
            <text class="dg-s" x="348" y="177" text-anchor="middle">But invert the case — score one enormous static dataset once — and batch wins outright. Neither is universally cheaper.</text>
          </svg>
          <figcaption>Figure 13 — Where streaming's cost advantage comes from: avoided redundancy on continuous, stateful work. It is not a general claim about streaming being cheap.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sv-perf">Performance efficiency</h3>
        <p>Stream processing is a sophisticated, mature technology — Flink is proven to be highly scalable and fully distributed. It is optimised for speed and unbounded data, measured by throughput per operator, with availability SLAs typically expressed as the percentage of events processed inside a delay tolerance.</p>
        <p>Its weakness is the mirror image: stream processing is <strong>not</strong> optimised for large bounded datasets, and performs significantly worse on big historical jobs such as backfills. Unified architectures that use each engine for its strengths were an active area of development, with the expectation that the streaming/batch divide would close as abstractions moved up the stack.</p>
        <p>That prediction has largely held. The practical shape it took: lakehouse table formats and incremental/streaming table abstractions now let one declarative definition serve both a historical backfill and a continuous update, which is exactly the "you should not have to care" outcome that was anticipated. The divide has not vanished, but for most application teams it is now a configuration choice rather than two separate systems and two separate codebases.</p>

        <h3 class="lesson-subhead" id="sv-talent">Talent efficiency</h3>
        <p>The consensus was that streaming is hard to run in-house: you need a strong infrastructure team comfortable with both deep technical work and operations. But as data processing capability becomes commoditised, more companies will sensibly buy rather than build — you do not need to employ nuclear scientists if what you want is electricity.</p>
        <p>My update: this is now the dimension where the situation has improved most. Managed streaming — hosted Kafka-compatible transports, managed Flink, and serverless stream processing — has moved a working setup from "requires a platform team" to "requires an afternoon and a budget line". For most teams reading this, the streaming infrastructure that gated Stage 3 in 2022 is no longer the blocker. The remaining hard parts are conceptual: windowing semantics, late and out-of-order data, exactly-once versus at-least-once delivery, and state size management. Those you still have to learn.</p>
        <table>
          <thead><tr><th>Dimension</th><th>Streaming wins when…</th><th>Batch wins when…</th></tr></thead>
          <tbody>
            <tr><td>Cost</td><td>Continuous, stateful, incremental work over moving windows</td><td>One-off processing of very large data at rest</td></tr>
            <tr><td>Performance</td><td>Unbounded data, latency measured in seconds</td><td>Backfills and large bounded jobs</td></tr>
            <tr><td>Talent</td><td>You can buy a managed service</td><td>Your team already lives in Spark and SQL</td></tr>
            <tr><td>Correctness</td><td>You need the value as of now</td><td>You need reproducibility above all</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="sv-fs">What feature stores actually do</h3>
        <p>This deserves emphasis because the marketing and the reality differ. The position as of 2022, credited to Stefan Krawczyk:</p>
        <ul class="lesson-layers">
          <li>Feature stores such as Tecton and Feast do perform some streaming feature computation, but only on data that needs no joins — so they are unlikely to orchestrate an entire feature computation flow for you.</li>
          <li>SageMaker's feature store only stores materialised data; you must connect it to pipelines that do the actual computation. People then reference the materialised features rather than the code that produced them.</li>
        </ul>
        <p>In other words: most feature stores are <strong>storage and consistency layers, not computation engines.</strong> That distinction determines what you still have to build yourself.</p>
        <p>Where this stands now: the category rebranded toward "feature platforms" and moved genuinely closer to owning computation — declarative feature definitions that compile to both a batch backfill and a streaming job, on-demand transformations executed at request time, and much better point-in-time-correct training set generation. But the underlying caveat survives in a new form: the more a platform generates your pipelines, the less visible the actual computation becomes, and complex multi-source joins still tend to end up as your code running outside the platform. Ask any vendor the same two questions — does it compute, or only store? And can I reproduce a feature value as of an arbitrary past timestamp?</p>
      `,
    },
    {
      id: 'since',
      title: 'What Changed Since 2022',
      children: [
        { id: 'sc-held', title: 'Predictions that held up' },
        { id: 'sc-infra', title: 'The infrastructure got much easier' },
        { id: 'sc-llm', title: 'Real-time ML for LLM and RAG systems' },
        { id: 'sc-adapt', title: 'Continual learning, reframed by foundation models' },
        { id: 'sc-latency', title: 'Latency engineering moved to the GPU' },
        { id: 'sc-eval', title: 'Online evaluation in the LLM era' },
        { id: 'sc-same', title: 'What has not changed at all' },
      ],
      html: `
        <p>The two ladders have aged remarkably well — better than most infrastructure writing from the same period. What has changed is the surrounding technology, plus an entire new class of system (LLM applications) that inherits every one of these problems under different names.</p>

        <h3 class="lesson-subhead" id="sc-held">Predictions that held up</h3>
        <ul class="lesson-checklist">
          <li><strong>Session-based serving became the default</strong> for recommendation, search and ads, exactly as forecast. Sequential and transformer-style recommenders that consume a user's recent event sequence are now the mainstream architecture rather than a research curiosity.</li>
          <li><strong>The streaming/batch divide narrowed,</strong> and largely for the predicted reason: the abstraction moved up, so a single declarative definition can serve both continuous updates and historical backfill.</li>
          <li><strong>Log and wait became normal practice</strong> rather than a clever trick, and logged-feature pipelines are now a standard part of mature feature platforms.</li>
          <li><strong>Bandits remained niche.</strong> Still better on the merits, still mostly confined to companies with the stateful routing infrastructure to support them — the barrier was infrastructure, and for most teams it still is.</li>
        </ul>

        <h3 class="lesson-subhead" id="sc-infra">The infrastructure got much easier</h3>
        <table>
          <thead><tr><th>Then</th><th>Now</th><th>What it changes for you</th></tr></thead>
          <tbody>
            <tr><td>Self-hosting Kafka was painful; managed transport was the pragmatic choice</td><td>Managed Kafka-compatible transports and managed Flink are commodity purchases</td><td>Stage 3 is no longer gated on hiring a streaming team</td></tr>
            <tr><td>Streaming SQL joins intimidated engineers</td><td>Streaming SQL and incremental view maintenance are ordinary tooling</td><td>Data scientists can define streaming features themselves</td></tr>
            <tr><td>Warehouse and stream were separate worlds</td><td>Lakehouse table formats plus streaming/incremental tables unify storage</td><td>One feature definition, two execution modes</td></tr>
            <tr><td>Feature stores mostly stored materialised values</td><td>Feature platforms compute too — declarative definitions, on-demand transforms, point-in-time training sets</td><td>Less glue code, but verify what it actually computes</td></tr>
            <tr><td>Model stores lacked lineage and stream reproducibility</td><td>Lineage tracking is common; reproducing arbitrary past stream features is still often bespoke</td><td>Stage 3's hardest requirement remains partly unsolved</td></tr>
          </tbody>
        </table>
        <p>The upshot: if streaming was your reason for staying on batch prediction, that reason has largely expired. What remains genuinely hard is conceptual — windowing, late and out-of-order events, exactly-once versus at-least-once semantics, and keeping state size under control.</p>

        <h3 class="lesson-subhead" id="sc-llm">Real-time ML for LLM and RAG systems</h3>
        <p>This is the biggest addition, and it is why this lesson belongs next to the agent material rather than in a museum. An LLM application has the same two ladders wearing different clothes.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Mapping classical real-time ML concepts onto their equivalents in LLM and RAG systems">
            <defs>
              <marker id="ah-map2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">CLASSICAL ML</text>
            <text class="dg-h" x="404" y="22">LLM / AGENT SYSTEM</text>
            <rect class="dg-box b" x="16" y="32" width="200" height="30" rx="7" />
            <text class="dg-s" x="116" y="51" text-anchor="middle">feature engineering</text>
            <rect class="dg-box p" x="404" y="32" width="300" height="30" rx="7" />
            <text class="dg-s" x="554" y="51" text-anchor="middle">context construction — what you retrieve and format</text>
            <rect class="dg-box b" x="16" y="70" width="200" height="30" rx="7" />
            <text class="dg-s" x="116" y="89" text-anchor="middle">batch features</text>
            <rect class="dg-box p" x="404" y="70" width="300" height="30" rx="7" />
            <text class="dg-s" x="554" y="89" text-anchor="middle">the nightly-rebuilt vector index</text>
            <rect class="dg-box b" x="16" y="108" width="200" height="30" rx="7" />
            <text class="dg-s" x="116" y="127" text-anchor="middle">streaming features</text>
            <rect class="dg-box p" x="404" y="108" width="300" height="30" rx="7" />
            <text class="dg-s" x="554" y="127" text-anchor="middle">streaming ingestion — docs indexed seconds after edit</text>
            <rect class="dg-box b" x="16" y="146" width="200" height="30" rx="7" />
            <text class="dg-s" x="116" y="165" text-anchor="middle">real-time features</text>
            <rect class="dg-box p" x="404" y="146" width="300" height="30" rx="7" />
            <text class="dg-s" x="554" y="165" text-anchor="middle">tool calls that fetch live state at request time</text>
            <rect class="dg-box b" x="16" y="184" width="200" height="30" rx="7" />
            <text class="dg-s" x="116" y="203" text-anchor="middle">training–serving skew</text>
            <rect class="dg-box p" x="404" y="184" width="300" height="30" rx="7" />
            <text class="dg-s" x="554" y="203" text-anchor="middle">eval prompts that differ from production prompts</text>
            <path class="dg-line violet" d="M216 47 H400" marker-end="url(#ah-map2)" />
            <path class="dg-line violet" d="M216 85 H400" marker-end="url(#ah-map2)" />
            <path class="dg-line violet" d="M216 123 H400" marker-end="url(#ah-map2)" />
            <path class="dg-line violet" d="M216 161 H400" marker-end="url(#ah-map2)" />
            <path class="dg-line violet" d="M216 199 H400" marker-end="url(#ah-map2)" />
            <text class="dg-s" x="16" y="230">Everything you learn on the left transfers to the right. The vocabulary changed; the engineering did not.</text>
          </svg>
          <figcaption>Figure 14 — The concepts map almost one to one. A team that solved feature freshness in 2022 already knows how to solve index freshness today.</figcaption>
        </figure>
        <p>Concretely, the questions to ask about any RAG or agent system are the Ladder A questions: how stale is the index when a user asks a question; is a document searchable seconds or hours after it changes; which parts of the context are precomputed lookups versus computed live by a tool call; and are the features and prompts used in evaluation identical to those used in production. The <a href="/learn/agentic-ai/genai-platform">platform lesson</a> covers the serving architecture; this lesson explains the freshness properties it must have.</p>

        <h3 class="lesson-subhead" id="sc-adapt">Continual learning, reframed by foundation models</h3>
        <p>The most interesting shift. In 2022, keeping a model current meant updating weights. For foundation-model applications, most adaptation now happens <em>without touching weights at all</em>:</p>
        <ul class="lesson-layers">
          <li><strong>Retrieval instead of retraining.</strong> New knowledge enters through the index rather than the parameters. Updating a document is now the fastest form of "model update" available, and it is instant, auditable and reversible — properties no fine-tune has.</li>
          <li><strong>In-context adaptation.</strong> Behaviour is adjusted by changing instructions and examples, which makes the prompt a versioned artefact that needs the same lineage discipline Stage 3 demands of models.</li>
          <li><strong>Parameter-efficient fine-tuning.</strong> Adapter-style methods such as LoRA make weight updates cheap and, importantly, <em>composable and hot-swappable</em> — much closer to the "training frequency is just a knob" ideal than full fine-tuning ever was.</li>
          <li><strong>Preference and reinforcement-style tuning</strong> turned collected feedback into a routine training input, which is the data flywheel this article's continual-learning section was reaching for.</li>
        </ul>
        <p>What has <strong>not</strong> been solved: catastrophic forgetting is still real, so continuous fine-tuning still drifts away from capabilities you did not test; the distinction between model iteration and data iteration still holds, since a new feature or a new base model still means starting over; and periodic from-scratch anchor models are still the only reliable defence against a contaminated lineage.</p>

        <h3 class="lesson-subhead" id="sc-latency">Latency engineering moved to the GPU</h3>
        <p>The "is online prediction less efficient than batch?" debate acquired a new chapter. For GPU-served models, batching genuinely does improve throughput dramatically — so the modern answer is that you get both: requests arrive individually and are <strong>batched inside the server</strong>, continuously, without waiting for a scheduled window. Continuous batching, key-value caching, prefix and prompt caching, and speculative decoding are the tools; the effect is that the old cost objection to online serving is now handled at the inference layer rather than by precomputing predictions nobody asked for.</p>
        <p>Practical consequence for the Stage 2 latency problem: your budget is now spent on tokens and cache hit rates rather than on candidate-set size alone, and the retrieval/ranking split has a direct analogue in cheap-model-filters-then-expensive-model-decides.</p>

        <h3 class="lesson-subhead" id="sc-eval">Online evaluation in the LLM era</h3>
        <p>Online evaluation became more important, not less, because LLM outputs are harder to grade offline. Three developments worth knowing:</p>
        <ul>
          <li><strong>Judge models supplement human labels</strong> for fast online scoring — with the caveat from the <a href="/learn/agentic-ai/ai-pitfalls">pitfalls lesson</a> that a judge is itself a model requiring validation against human graders.</li>
          <li><strong>Model routing is a bandit problem.</strong> Choosing which model tier handles a request, based on observed quality and cost, is exactly the model-evaluation bandit from earlier — and it is the setting where bandits have quietly become most practical, because feedback is fast and routing is already stateful.</li>
          <li><strong>Guardrails are real-time classifiers</strong> sitting in the request path, which means they are subject to every Stage 2 concern: their latency is user-facing, and their precision/recall trade-off is a product decision.</li>
        </ul>

        <h3 class="lesson-subhead" id="sc-same">What has not changed at all</h3>
        <p>Four things are exactly as true today as when this was written, and they are the reason the lesson still matters:</p>
        <ol class="lesson-steps">
          <li><strong>Real-time ML is largely an infrastructure problem,</strong> and solving it requires the data science team and the platform team to work together. No tool has changed that.</li>
          <li><strong>Training-serving skew and point-in-time correctness</strong> remain the top sources of "it worked offline" failures, in classical ML and in LLM evaluation alike.</li>
          <li><strong>Detecting change is easy; knowing which change matters is hard.</strong> Alert fatigue from thousands of benign feature-statistic shifts is still the reason most drift monitoring gets ignored.</li>
          <li><strong>Feedback loops still degenerate.</strong> A system that only shows what it already believes is popular still learns nothing about the rest of its catalogue — and the same trap now appears in systems whose training data is increasingly shaped by their own past outputs.</li>
        </ol>
      `,
    },
    {
      id: 'summary',
      title: 'Summary',
      children: [
        { id: 'sum-table', title: 'Both ladders in one table' },
        { id: 'sum-assess', title: 'A 12-question maturity assessment' },
        { id: 'sum-check', title: 'Self-check' },
        { id: 'sum-read', title: 'Further reading' },
      ],
      html: `
        <h3 class="lesson-subhead" id="sum-table">Both ladders in one table</h3>
        <table>
          <thead><tr><th>Ladder</th><th>Stage</th><th>What defines it</th><th>Infrastructure it demands</th></tr></thead>
          <tbody>
            <tr><td rowspan="3">A · Prediction freshness</td><td>1 · Batch prediction</td><td>Predictions precomputed on a schedule, looked up on request</td><td>Warehouse + batch engine. No latency worries, no in-session adaptation</td></tr>
            <tr><td>2 · Online, batch features</td><td>Predictions computed per request; features still precomputed lookups</td><td>Streaming transport + stream compute for sessionisation; retrieval/ranking split</td></tr>
            <tr><td>3 · Online, online features</td><td>Features computed fresh — real-time inline and near-real-time async</td><td>Mature stream processing, feature store, model store, live-data dev environment</td></tr>
            <tr><td rowspan="4">B · Model freshness</td><td>1 · Manual, stateless</td><td>Ad-hoc retraining when performance degrades and someone is free</td><td>None — and that is the problem; code changes escape to production untracked</td></tr>
            <tr><td>2 · Automated retraining</td><td>Scheduled script, still training from scratch</td><td>Model store, scheduler, reliable data access; per-model schedules and dependencies</td></tr>
            <tr><td>3 · Automated, stateful</td><td>Fine-tune the existing model on new data</td><td>Model lineage + streaming feature reproducibility (time travel)</td></tr>
            <tr><td>4 · Continual learning</td><td>Updates triggered by drift or performance, not the clock</td><td>Triggers, layered production evaluation, an orchestrator that does not disturb serving</td></tr>
          </tbody>
        </table>
        <p>And the two connectors between the ladders: <strong>online prediction is what makes bandits possible</strong>, and <strong>bandits and shadow/canary testing are what make continual learning safe.</strong> That is why neither ladder can be climbed to the top alone.</p>

        <h3 class="lesson-subhead" id="sum-assess">A 12-question maturity assessment</h3>
        <p>Run this against any ML or LLM system. Each hesitation locates a specific stage you have not actually reached.</p>
        <ul class="lesson-checklist">
          <li>What does a brand-new, logged-out visitor see, and how good is it?</li>
          <li>How stale can a served prediction be, in the worst case?</li>
          <li>Which fraction of your batch predictions are never used?</li>
          <li>For each feature, is it batch, near-real-time or real-time — and does anyone know?</li>
          <li>Which features are computed inside the request, and what do they add to p95?</li>
          <li>Are feature definitions shared between training and serving, or written twice?</li>
          <li>Can you reconstruct the exact feature values a model saw for a request last month?</li>
          <li>How often is each model retrained, and who chose that number?</li>
          <li>Is retraining stateless or stateful, and do you track which model descends from which?</li>
          <li>When an upstream model changes, what forces downstream models to be retrained?</li>
          <li>What triggers an unscheduled model update, and what would block a bad one from shipping?</li>
          <li>How do you evaluate a model whose target distribution moved since your test set was made?</li>
        </ul>

        <h3 class="lesson-subhead" id="sum-check">Self-check</h3>
        <ol>
          <li>Why is batch prediction not a prerequisite for online prediction, and what historical accident made people think it was?</li>
          <li>In Stage 2, why is a retrieval step needed before ranking?</li>
          <li>What exactly distinguishes Stage 2 from Stage 3?</li>
          <li>Compare real-time and near-real-time features on freshness, user-facing latency and feasible complexity.</li>
          <li>Give the three feature types needed to estimate a food delivery time, with an example of each.</li>
          <li>Why is A/B testing stateless and a bandit stateful, and why does that make bandits harder to deploy?</li>
          <li>What does a contextual bandit buy you that a greedy recommender cannot?</li>
          <li>Continual learning is not about frequency — so what is it about?</li>
          <li>Why can data iteration be stateful while model iteration cannot?</li>
          <li>What two capabilities does a model store need at Ladder B Stage 3, and why does lineage matter more once training is stateful?</li>
          <li>Why does a stationary test set stop working at Stage 4, and what replaces it?</li>
          <li>Why is "detecting drift" the easy half of drift monitoring?</li>
        </ol>
        <p><strong>Sketch answers:</strong> (1) batch prediction is an artefact of the MapReduce/Spark era — teams ran ML on the batch systems they already had, and a new system can start online today; (2) scoring millions of items per request is too slow, so a cheap pass cuts the catalogue to about a thousand candidates before the expensive ranker runs; (3) at Stage 2 fresh events only look up precomputed embeddings, at Stage 3 features are genuinely computed from fresh data; (4) real-time is millisecond-fresh but adds all its computation to user latency and must stay simple, near-real-time is seconds-stale but async, so it adds nothing to latency and can be arbitrarily complex; (5) batch — the restaurant's historical mean prep time; real-time — distance from restaurant to delivery address; streaming — current order backlog and couriers free in the next 30 minutes; (6) A/B routing needs no knowledge of current performance while a bandit must compute every model's standing before routing, which requires feedback collection, performance tracking and stateful routing; (7) it spends a little traffic deliberately on uncertain items, escaping the popularity feedback loop that leaves the long tail permanently unmeasured; (8) the manner of retraining — stateful continuation instead of from-scratch — after which frequency is just a knob; (9) stateful training continues from existing weights, which only works if the architecture and features are unchanged; (10) model lineage and streaming feature reproducibility — with stateful training a bad update contaminates all its descendants, so you must know where to roll back; (11) because you are deliberately adapting to a shifted distribution, so old held-out data no longer represents production — you need backtests, progressive evaluation, shadow deployment, canary analysis, A/B tests and bandits; (12) because with thousands of features most statistical shifts are benign, so the real problem is deciding which ones deserve attention.</p>

        <h3 class="lesson-subhead" id="sum-read">Further reading</h3>
        <ul>
          <li><strong>The article this lesson follows</strong> — Chip Huyen, <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (2022), and its predecessor <a href="https://huyenchip.com/2020/12/27/real-time-machine-learning.html" rel="noopener noreferrer" target="_blank">Machine learning is going real-time</a> (2020).</li>
          <li><strong>Book-length treatment</strong> — <em>Designing Machine Learning Systems</em> (O'Reilly, 2022) covers online prediction and continual learning in far more depth, and <em>AI Engineering</em> (2025) carries the same thinking into foundation-model systems.</li>
          <li><strong>Session-based recommendation</strong> — Eugene Yan's <a href="https://eugeneyan.com/writing/session-based-sequential-recommendations/" rel="noopener noreferrer" target="_blank">primer on session-based and sequential recommendations</a>, and Google's free <a href="https://developers.google.com/machine-learning/recommendation" rel="noopener noreferrer" target="_blank">recommendation systems crash course</a> for the retrieval/ranking split.</li>
          <li><strong>Bandits</strong> — chapter 2 of Sutton &amp; Barto, <a href="http://incompleteideas.net/book/the-book.html" rel="noopener noreferrer" target="_blank">Reinforcement Learning: An Introduction</a> (2020), for the theory behind Thompson Sampling and friends.</li>
          <li><strong>Streaming semantics</strong> — Tyler Akidau et al., <em>Streaming Systems</em>, for windowing, watermarks, late data and exactly-once — the concepts that are still hard even now that the infrastructure is managed.</li>
          <li><strong>Related lessons here</strong> — <a href="/learn/agentic-ai/genai-platform">Building a Generative AI Platform</a> for the serving architecture, <a href="/learn/agentic-ai/ai-pitfalls">Common Pitfalls</a> for evaluation discipline, and the <a href="/learn/agentic-ai/roadmap">Agentic AI Roadmap</a> to see where this material sits in a full learning path.</li>
        </ul>
        <p class="lesson-flow">Pick one ladder. Move up exactly one rung. Measure whether your metrics moved before starting the next.</p>
      `,
    },
  ],
  sourceNote:
    'Original lesson written for BinodTech. The two-ladder structure, stage definitions and case studies (DoorDash, Netflix, Grubhub, Stripe, Uber, Faire, the Rafferty bandit experiment, and the analyses credited to Zhenzhong Xu and Stefan Krawczyk) follow Chip Huyen\u2019s <a href="https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html" rel="noopener noreferrer" target="_blank">Real-time machine learning: challenges and solutions</a> (January 2022, updated 2023) and are credited to her and to the original contributors. All explanations, diagrams, tables, assessments and exercises are our own, as is the \u201cWhat Changed Since 2022\u201d section covering managed streaming, feature platforms, LLM/RAG freshness, parameter-efficient adaptation, GPU-side batching and online evaluation. Quoted lines are short and attributed.',
};
