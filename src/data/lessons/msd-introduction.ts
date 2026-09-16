/** Modern System Design — Chapter 1: Introduction.
 *  Covers what system design is, why every developer needs it, and how the course is structured.
 */

export const msdIntroduction = {
  slug: 'introduction',
  title: 'Introduction to Modern System Design',
  subtitle:
    'What system design actually is, why it matters to you even if you never sit another interview, and how the 44 chapters ahead are ordered so that each one only uses ideas you already have.',
  byline: 'Modern System Design · Chapter 1 · ~1h 10m read · Beginner',
  interviewTip:
    'The most common reason a strong coder fails a system design interview is treating it as a knowledge quiz instead of a design conversation. Nobody is checking whether you can recite what Kafka does. They are checking whether, given a vague problem, you can pin down requirements, make a decision, say out loud what that decision costs, and change your mind when the numbers say you should.',
  sections: [
    {
      id: 'what',
      title: 'Introduction to Modern System Design',
      children: [
        { id: 'what-is', title: 'What system design is' },
        { id: 'what-two-axes', title: 'The two axes: functional and non-functional' },
        { id: 'what-breaks', title: 'What breaks as you grow' },
        { id: 'what-tradeoff', title: 'There are no right answers, only trade-offs' },
        { id: 'what-modern', title: 'What makes it "modern"' },
      ],
      html: `
        <p>Writing software that works and designing a system that keeps working are different skills. The first is about correctness on your machine; the second is about behaviour under load, under failure, and under change — three conditions your laptop never shows you.</p>
        <p>You have already done system design, probably without calling it that. Choosing to add a cache, splitting a table, putting a queue between two services, deciding a job should retry — each is a design decision with consequences. This course is about making those decisions deliberately instead of by accident, and being able to explain why.</p>

        <h3 class="lesson-subhead" id="what-is">What system design is</h3>
        <p>System design is the layer between "what should this product do" and "what code do I write". It answers a specific set of questions: what components exist, what data each one owns, how they talk, where state lives, what happens when any one of them dies, and how the whole thing behaves when traffic grows by 100×.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="System design as the layer between product requirements and implementation, listing the questions it answers">
            <defs>
              <marker id="ah-in1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="30" width="150" height="58" rx="8" />
            <text class="dg-t" x="91" y="54" text-anchor="middle">product</text>
            <text class="dg-t" x="91" y="70" text-anchor="middle">requirements</text>
            <text class="dg-s" x="91" y="84" text-anchor="middle">“users should share photos”</text>
            <rect class="dg-box p" x="252" y="20" width="216" height="78" rx="9" />
            <text class="dg-t" x="360" y="46" text-anchor="middle">SYSTEM DESIGN</text>
            <text class="dg-s" x="360" y="66" text-anchor="middle">components · data ownership ·</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">communication · state · failure ·</text>
            <text class="dg-s" x="360" y="94" text-anchor="middle">scale</text>
            <rect class="dg-box g" x="554" y="30" width="150" height="58" rx="8" />
            <text class="dg-t" x="629" y="54" text-anchor="middle">implementation</text>
            <text class="dg-s" x="629" y="72" text-anchor="middle">frameworks, schemas,</text>
            <text class="dg-s" x="629" y="85" text-anchor="middle">endpoints, deploys</text>
            <path class="dg-line blue" d="M166 59 H248" marker-end="url(#ah-in1)" />
            <path class="dg-line blue" d="M468 59 H550" marker-end="url(#ah-in1)" />
            <rect class="dg-band" x="12" y="116" width="696" height="112" rx="10" />
            <text class="dg-h" x="26" y="136">THE SIX QUESTIONS EVERY DESIGN MUST ANSWER</text>
            <text class="dg-s" x="26" y="158">1 · What are the components, and what is each one responsible for?</text>
            <text class="dg-s" x="26" y="176">2 · Who owns which data, and where does the source of truth live?</text>
            <text class="dg-s" x="26" y="194">3 · How do components communicate — synchronously, or through a queue?</text>
            <text class="dg-s" x="382" y="158">4 · What happens when each component fails?</text>
            <text class="dg-s" x="382" y="176">5 · What is the bottleneck, and at what load does it bite?</text>
            <text class="dg-s" x="382" y="194">6 · How does this change when traffic grows 100×?</text>
            <text class="dg-s" x="26" y="216">If your design cannot answer all six, it is a diagram, not a design. Question 4 is the one candidates skip most often.</text>
          </svg>
          <figcaption>Figure 1 — Where system design sits, and the six questions it exists to answer.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="what-two-axes">The two axes: functional and non-functional</h3>
        <p>Every system is judged on two independent axes, and confusing them is the single most common beginner mistake.</p>
        <p><strong>Functional requirements</strong> describe what the system does — post a photo, follow a user, process a payment. They are the features. <strong>Non-functional requirements</strong> describe how well it does them — how fast, how reliably, how many users at once, how easily it can be changed. They are the qualities.</p>
        <div class="lesson-callout"><strong>Why this distinction is load-bearing.</strong> Functional requirements determine what you build. Non-functional requirements determine what you build it <em>out of</em>. "Users can post a photo" tells you nothing about your architecture. "Ten million users post a photo per day, feeds must load in under 200 ms, and no upload may ever be lost" tells you almost everything — it dictates the storage, the CDN, the queue and the replication strategy. This is why interviewers push you to state numbers before drawing boxes.</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Functional requirements describe features while non-functional requirements describe qualities, and the non-functional ones drive architecture">
            <defs>
              <marker id="ah-in2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="340" height="118" rx="11" />
            <text class="dg-h" x="26" y="36">FUNCTIONAL — WHAT IT DOES</text>
            <text class="dg-s" x="26" y="58">· a user can upload a photo</text>
            <text class="dg-s" x="26" y="76">· a user can follow another user</text>
            <text class="dg-s" x="26" y="94">· a feed shows posts from people you follow</text>
            <text class="dg-s" x="26" y="118">→ decides your features and API surface</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="118" rx="11" />
            <text class="dg-h" x="382" y="36">NON-FUNCTIONAL — HOW WELL</text>
            <text class="dg-s" x="382" y="58">· 10M uploads/day, 500M feed views/day</text>
            <text class="dg-s" x="382" y="76">· feed loads in &lt; 200 ms at p99</text>
            <text class="dg-s" x="382" y="94">· 99.99% available, zero lost uploads</text>
            <text class="dg-s" x="382" y="118">→ decides your architecture</text>
            <rect class="dg-box p" x="180" y="156" width="360" height="42" rx="9" />
            <text class="dg-t" x="360" y="174" text-anchor="middle">the numbers on the right are what force the design</text>
            <text class="dg-s" x="360" y="190" text-anchor="middle">state them before you draw a single box</text>
            <path class="dg-line violet" d="M182 134 V148 H340 V152" marker-end="url(#ah-in2)" />
            <path class="dg-line violet thick" d="M538 134 V148 H380 V152" marker-end="url(#ah-in2)" />
          </svg>
          <figcaption>Figure 2 — The two axes. Chapter 4 is devoted entirely to the right-hand column, because that is the column that decides your architecture.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="what-breaks">What breaks as you grow</h3>
        <p>The clearest way to understand why distributed systems look the way they do is to watch one grow. Nothing in the following progression is arbitrary — each stage exists because the previous stage hit a specific wall.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 344" role="img" aria-label="Progression of an architecture from a single server to a globally distributed system, showing what breaks at each stage">
            <defs>
              <marker id="ah-in3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="20">STAGE · WHAT YOU HAVE · WHAT BREAKS NEXT</text>
            <rect class="dg-box g" x="16" y="30" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="48">1 · One server: app + database together</text>
            <text class="dg-s" x="30" y="64">Fine to surprisingly high traffic. Breaks when the box saturates, or when it dies and you have no copy of anything.</text>
            <rect class="dg-box g" x="16" y="80" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="98">2 · Split app and database onto separate machines</text>
            <text class="dg-s" x="30" y="114">Each scales independently. Breaks when one app server cannot serve the request volume.</text>
            <rect class="dg-box y" x="16" y="130" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="148">3 · Many app servers behind a load balancer · add a cache · add a CDN for static files</text>
            <text class="dg-s" x="30" y="164">Now the app tier is horizontal. Breaks at the database: one writer, and reads swamping it.</text>
            <rect class="dg-box y" x="16" y="180" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="198">4 · Database replication: one primary for writes, replicas for reads</text>
            <text class="dg-s" x="30" y="214">Reads scale out. Breaks when writes exceed one primary, or the dataset outgrows one disk. Replicas also lag — hello, consistency.</text>
            <rect class="dg-box o" x="16" y="230" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="248">5 · Partition (shard) the data · move slow work to a queue · split the monolith into services</text>
            <text class="dg-s" x="30" y="264">Writes scale out. Breaks in new ways: cross-shard queries, hot shards, and distributed transactions you cannot have.</text>
            <rect class="dg-box r" x="16" y="280" width="688" height="42" rx="7" />
            <text class="dg-t" x="30" y="298">6 · Multi-region: geo-routing, replication across continents, per-region failover</text>
            <text class="dg-s" x="30" y="314">Survives a datacentre loss. The cost is that physics now limits you — light takes ~40 ms to cross the Atlantic and back.</text>
            <path class="dg-line rose" d="M708 51 H712 V310 H708" marker-end="url(#ah-in3)" />
            <text class="dg-s" x="16" y="336">Notice that every stage is provoked by a specific limit. Skipping stages before you have the limit is the most expensive mistake in this field.</text>
          </svg>
          <figcaption>Figure 3 — The growth path. Almost every design problem in this course is one of these stages examined closely, and the whole course exists to explain the six boxes in stages 3 to 6.</figcaption>
        </figure>
        <p>Two habits are worth forming from this picture. First, <strong>the bottleneck moves</strong> — you never fix scalability once. Second, <strong>later stages are strictly harder to operate</strong> than earlier ones, which is why "we are not big enough to need this yet" is a legitimate and often correct design position.</p>

        <h3 class="lesson-subhead" id="what-tradeoff">There are no right answers, only trade-offs</h3>
        <p>If you take one idea from this chapter, take this one. Design questions do not have answers in the way algorithm questions do. There is no optimal architecture, only architectures that are appropriate given constraints you have chosen to prioritise.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Five recurring trade-off dials in system design, each with what you gain and what you give up">
            <text class="dg-h" x="16" y="22">THE DIALS YOU WILL TURN IN EVERY SINGLE DESIGN</text>
            <rect class="dg-box b" x="16" y="32" width="210" height="36" rx="7" />
            <text class="dg-s" x="121" y="55" text-anchor="middle">strong consistency</text>
            <rect class="dg-box o" x="490" y="32" width="214" height="36" rx="7" />
            <text class="dg-s" x="597" y="55" text-anchor="middle">availability + low latency</text>
            <text class="dg-s" x="358" y="55" text-anchor="middle">⟷</text>
            <rect class="dg-box b" x="16" y="76" width="210" height="36" rx="7" />
            <text class="dg-s" x="121" y="99" text-anchor="middle">normalised, one source of truth</text>
            <rect class="dg-box o" x="490" y="76" width="214" height="36" rx="7" />
            <text class="dg-s" x="597" y="99" text-anchor="middle">denormalised, fast reads</text>
            <text class="dg-s" x="358" y="99" text-anchor="middle">⟷</text>
            <rect class="dg-box b" x="16" y="120" width="210" height="36" rx="7" />
            <text class="dg-s" x="121" y="143" text-anchor="middle">compute at write time</text>
            <rect class="dg-box o" x="490" y="120" width="214" height="36" rx="7" />
            <text class="dg-s" x="597" y="143" text-anchor="middle">compute at read time</text>
            <text class="dg-s" x="358" y="143" text-anchor="middle">⟷</text>
            <rect class="dg-box b" x="16" y="164" width="210" height="36" rx="7" />
            <text class="dg-s" x="121" y="187" text-anchor="middle">simple, one machine</text>
            <rect class="dg-box o" x="490" y="164" width="214" height="36" rx="7" />
            <text class="dg-s" x="597" y="187" text-anchor="middle">scalable, many machines</text>
            <text class="dg-s" x="358" y="187" text-anchor="middle">⟷</text>
            <text class="dg-s" x="16" y="222">The skill is not picking a side. It is knowing which side this particular product needs, and being able to say what you gave up.</text>
          </svg>
          <figcaption>Figure 4 — The recurring dials. An answer that acknowledges the cost of its own choice beats a "better" answer that pretends there is no cost.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="what-modern">What makes it "modern"</h3>
        <p>The fundamentals here are decades old, and they have not changed. What has changed is the environment you design in, and four shifts matter enough to shape this course:</p>
        <ul class="lesson-layers">
          <li><strong>Managed services are the default.</strong> You rarely build a queue, a blob store or a load balancer from scratch. But you still must understand how they work, because you are the one who picks between them, configures them, and debugs them at 3am. Every chapter here teaches the mechanism <em>and</em> names the managed options.</li>
          <li><strong>Global by default.</strong> Users are everywhere from launch, which makes geography and the speed of light a first-order design concern rather than an afterthought.</li>
          <li><strong>Observability is part of the design.</strong> A system you cannot see inside is a system you cannot operate. This is why monitoring and logging appear as building blocks in this course rather than as an operations appendix.</li>
          <li><strong>AI workloads are now normal system design.</strong> Serving a model has a different cost shape from serving a web request — GPUs instead of CPUs, tokens instead of rows, seconds instead of milliseconds. The last five chapters cover this, and they use exactly the same building blocks as the rest.</li>
        </ul>
      `,
    },
    {
      id: 'why',
      title: 'Why Every Developer Should Learn System Design',
      children: [
        { id: 'why-not-interview', title: 'The case that has nothing to do with interviews' },
        { id: 'why-ladder', title: 'It is the skill the career ladder is made of' },
        { id: 'why-cost', title: 'Design mistakes are the expensive kind' },
        { id: 'why-interview', title: 'And yes, the interview' },
      ],
      html: `
        <h3 class="lesson-subhead" id="why-not-interview">The case that has nothing to do with interviews</h3>
        <p>Most people arrive at system design because an interview is coming. That is a fine reason, but it undersells the skill badly. Here is the case that stands even if you never interview again.</p>
        <p><strong>You already make these decisions.</strong> Every time you add a column, introduce a background job, cache a response or call another service, you are choosing a trade-off. Without a framework you choose by habit or by whatever the last tutorial did. With one, you choose knowing what you are buying and what you are paying.</p>
        <p><strong>It is how you debug hard problems.</strong> Most genuinely difficult production incidents are not code bugs; they are interaction bugs — a retry policy amplifying a slowdown, a cache stampede after a deploy, a queue backing up because a consumer got slower. You cannot diagnose these by reading a function. You diagnose them by reasoning about the system, which requires having a model of it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="A cascading failure caused by retries, illustrating why incidents require system-level reasoning rather than reading code">
            <defs>
              <marker id="ah-wy1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">AN INCIDENT NO SINGLE FILE OF CODE EXPLAINS</text>
            <rect class="dg-box y" x="16" y="34" width="126" height="50" rx="7" />
            <text class="dg-s" x="79" y="54" text-anchor="middle">a database gets</text>
            <text class="dg-s" x="79" y="68" text-anchor="middle">slightly slower</text>
            <rect class="dg-box y" x="164" y="34" width="126" height="50" rx="7" />
            <text class="dg-s" x="227" y="54" text-anchor="middle">requests take</text>
            <text class="dg-s" x="227" y="68" text-anchor="middle">longer, time out</text>
            <rect class="dg-box o" x="312" y="34" width="126" height="50" rx="7" />
            <text class="dg-s" x="375" y="54" text-anchor="middle">clients retry —</text>
            <text class="dg-s" x="375" y="68" text-anchor="middle">load now 3×</text>
            <rect class="dg-box r" x="460" y="34" width="126" height="50" rx="7" />
            <text class="dg-s" x="523" y="54" text-anchor="middle">database slower</text>
            <text class="dg-s" x="523" y="68" text-anchor="middle">still. More retries.</text>
            <rect class="dg-box r" x="608" y="34" width="96" height="50" rx="7" />
            <text class="dg-t" x="656" y="54" text-anchor="middle">total</text>
            <text class="dg-t" x="656" y="70" text-anchor="middle">outage</text>
            <path class="dg-line rose" d="M142 59 H160" marker-end="url(#ah-wy1)" />
            <path class="dg-line rose" d="M290 59 H308" marker-end="url(#ah-wy1)" />
            <path class="dg-line rose" d="M438 59 H456" marker-end="url(#ah-wy1)" />
            <path class="dg-line rose" d="M586 59 H604" marker-end="url(#ah-wy1)" />
            <path class="dg-line rose thick dash" d="M523 84 V100 H375 V88" marker-end="url(#ah-wy1)" />
            <text class="dg-s" x="449" y="114" text-anchor="middle">the feedback loop is the bug</text>
            <rect class="dg-band g" x="12" y="130" width="696" height="82" rx="10" />
            <text class="dg-h" x="26" y="150">WHAT PREVENTS IT — ALL DESIGN DECISIONS, NOT CODE FIXES</text>
            <text class="dg-s" x="26" y="172">· exponential backoff with jitter, so retries spread out instead of synchronising</text>
            <text class="dg-s" x="26" y="190">· a retry budget and circuit breaker, so a struggling dependency stops receiving extra load</text>
            <text class="dg-s" x="26" y="206">· load shedding, so the system serves some traffic well rather than all of it badly</text>
          </svg>
          <figcaption>Figure 5 — A retry storm. Each component behaves exactly as written; the failure is in how they interact. Chapter 44 is a whole chapter of these.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="why-ladder">It is the skill the career ladder is made of</h3>
        <p>Look at what actually separates engineering levels in practice, at any company with a functioning ladder:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Engineering levels and the scope of design decisions expected at each">
            <rect class="dg-box b" x="16" y="30" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="48">Junior — implements a well-specified task correctly</text>
            <text class="dg-s" x="30" y="63">Given the design, writes the code. System design shows up as “why is our code shaped this way?”</text>
            <rect class="dg-box c" x="16" y="78" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="96">Mid-level — owns a feature end to end</text>
            <text class="dg-s" x="30" y="111">Chooses schemas, endpoints, whether work goes in a queue. First real design decisions, usually within one service.</text>
            <rect class="dg-box p" x="16" y="126" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="144">Senior — owns a service or subsystem, and its failure modes</text>
            <text class="dg-s" x="30" y="159">Expected to anticipate load, design for failure, and justify trade-offs to others. This is the level this course targets.</text>
            <rect class="dg-box o" x="16" y="174" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="192">Staff and beyond — owns decisions across services, and the consequences years out</text>
            <text class="dg-s" x="30" y="207">Migration paths, org-shaped architecture, what not to build. Almost entirely design and judgement work.</text>
          </svg>
          <figcaption>Figure 6 — What changes with level. Coding ability plateaus as a differentiator surprisingly early; design scope does not.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="why-cost">Design mistakes are the expensive kind</h3>
        <p>There is an asymmetry worth internalising: bad code is cheap to fix and bad design is not. A badly written function is rewritten in an afternoon by one person. A badly chosen partition key is a multi-quarter migration involving every team that touches that data, usually while the system stays online.</p>
        <div class="lesson-callout"><strong>The practical implication.</strong> Decisions differ enormously in reversibility, and you should spend your design effort accordingly. Choosing a web framework is reversible. Choosing your data model, your partition key, your consistency guarantees, and your service boundaries is close to permanent. Spend ten minutes on the first kind and ten days on the second.</div>

        <h3 class="lesson-subhead" id="why-interview">And yes, the interview</h3>
        <p>The system design interview exists because it is the cheapest available proxy for senior work. In 45 minutes it samples requirement-gathering under ambiguity, technical breadth, quantitative reasoning, trade-off judgement and communication — the actual content of a senior engineer's week.</p>
        <p>It is also the round candidates most often lose despite strong coding, because it rewards a completely different mode: thinking out loud, being decisive under incomplete information, and treating the interviewer as a colleague rather than an examiner. That is learnable, and the next chapter is entirely about learning it.</p>
      `,
    },
    {
      id: 'structure',
      title: 'Course Structure for Modern System Design',
      children: [
        { id: 'st-map', title: 'The five phases' },
        { id: 'st-blocks', title: 'Why building blocks come before design problems' },
        { id: 'st-howto', title: 'How to study this course' },
        { id: 'st-prereq', title: 'What you need before starting' },
      ],
      html: `
        <h3 class="lesson-subhead" id="st-map">The five phases</h3>
        <p>The 44 chapters are ordered so that no chapter needs an idea you have not met yet. That constraint is why the order looks the way it does.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 320" role="img" aria-label="The five phases of the course from foundations through building blocks to design problems and AI systems">
            <defs>
              <marker id="ah-st1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="696" height="56" rx="10" />
            <text class="dg-h" x="26" y="36">PHASE 1 · FOUNDATIONS — chapters 1 to 5</text>
            <text class="dg-s" x="26" y="56">Interview craft · RPC, consistency and failure models · the five non-functional characteristics · estimation.</text>
            <text class="dg-s" x="26" y="68">Nothing is designed yet. This is the vocabulary everything later is written in.</text>
            <rect class="dg-band g" x="12" y="82" width="696" height="72" rx="10" />
            <text class="dg-h" x="26" y="102">PHASE 2 · BUILDING BLOCKS — chapters 6 to 24</text>
            <text class="dg-s" x="26" y="122">DNS · load balancers · databases · key-value store · CDN · sequencer · monitoring · logging · cache · queue ·</text>
            <text class="dg-s" x="26" y="136">pub-sub · rate limiter · blob store · distributed search · task scheduler · sharded counters.</text>
            <text class="dg-s" x="26" y="150">Nineteen chapters. This is the bulk of the course and the highest-leverage part of it.</text>
            <rect class="dg-band o" x="12" y="164" width="696" height="72" rx="10" />
            <text class="dg-h" x="26" y="184">PHASE 3 · DESIGN PROBLEMS — chapters 25 to 39</text>
            <text class="dg-s" x="26" y="204">YouTube · Quora · Google Maps · Yelp · Uber · Twitter · Instagram · TinyURL · web crawler · WhatsApp ·</text>
            <text class="dg-s" x="26" y="218">typeahead · Google Docs · code deployment · payments · LeetCode.</text>
            <text class="dg-s" x="26" y="232">Each one is assembled from Phase 2 blocks plus one genuinely novel problem.</text>
            <rect class="dg-band p" x="12" y="246" width="696" height="42" rx="10" />
            <text class="dg-h" x="26" y="266">PHASE 4 · AI SYSTEMS — chapters 40 to 43</text>
            <text class="dg-s" x="26" y="282">ChatGPT-style serving · AI/ML data infrastructure · LLM support bot · AI code assistant.</text>
            <rect class="dg-band r" x="12" y="296" width="696" height="20" rx="8" />
            <text class="dg-h" x="26" y="311">PHASE 5 · CHAPTER 44 · LESSONS FROM SYSTEM FAILURES — where all of it is stress-tested against reality</text>
          </svg>
          <figcaption>Figure 7 — The five phases. If you only have time for part of this course, Phase 1 and Phase 2 are the part that transfers to every problem you will ever be asked.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="st-blocks">Why building blocks come before design problems</h3>
        <p>It is tempting to jump straight to "design Twitter", and it is a trap. Design problems are recombinations of a small set of components. Learn the components once and every problem becomes assembly plus one new idea; skip them and you are memorising fifty architectures with no way to handle the fifty-first.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 258" role="img" aria-label="Design problems decomposed into shared building blocks plus one novel idea each">
            <defs>
              <marker id="ah-st2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE SAME BLOCKS, RECOMBINED</text>
            <rect class="dg-box c" x="16" y="32" width="104" height="24" rx="5" />
            <text class="dg-s" x="68" y="48" text-anchor="middle">load balancer</text>
            <rect class="dg-box c" x="128" y="32" width="104" height="24" rx="5" />
            <text class="dg-s" x="180" y="48" text-anchor="middle">cache</text>
            <rect class="dg-box c" x="240" y="32" width="104" height="24" rx="5" />
            <text class="dg-s" x="292" y="48" text-anchor="middle">sharded DB</text>
            <rect class="dg-box c" x="352" y="32" width="104" height="24" rx="5" />
            <text class="dg-s" x="404" y="48" text-anchor="middle">queue</text>
            <rect class="dg-box c" x="464" y="32" width="104" height="24" rx="5" />
            <text class="dg-s" x="516" y="48" text-anchor="middle">blob store</text>
            <rect class="dg-box c" x="576" y="32" width="128" height="24" rx="5" />
            <text class="dg-s" x="640" y="48" text-anchor="middle">CDN · search · counters</text>
            <rect class="dg-box o" x="16" y="88" width="216" height="52" rx="8" />
            <text class="dg-t" x="124" y="108" text-anchor="middle">Twitter</text>
            <text class="dg-s" x="124" y="126" text-anchor="middle">+ novel: fan-out and the</text>
            <text class="dg-s" x="124" y="136" text-anchor="middle">celebrity problem</text>
            <rect class="dg-box o" x="252" y="88" width="216" height="52" rx="8" />
            <text class="dg-t" x="360" y="108" text-anchor="middle">YouTube</text>
            <text class="dg-s" x="360" y="126" text-anchor="middle">+ novel: transcoding and</text>
            <text class="dg-s" x="360" y="136" text-anchor="middle">adaptive bitrate streaming</text>
            <rect class="dg-box o" x="488" y="88" width="216" height="52" rx="8" />
            <text class="dg-t" x="596" y="108" text-anchor="middle">Uber</text>
            <text class="dg-s" x="596" y="126" text-anchor="middle">+ novel: geospatial indexing</text>
            <text class="dg-s" x="596" y="136" text-anchor="middle">and live matching</text>
            <path class="dg-line green" d="M124 56 V84" marker-end="url(#ah-st2)" />
            <path class="dg-line green" d="M360 56 V84" marker-end="url(#ah-st2)" />
            <path class="dg-line green" d="M596 56 V84" marker-end="url(#ah-st2)" />
            <rect class="dg-band l" x="12" y="158" width="696" height="90" rx="10" />
            <text class="dg-h" x="26" y="178">WHAT THIS MEANS FOR HOW YOU PREPARE</text>
            <text class="dg-s" x="26" y="200">Nineteen building-block chapters cover perhaps 80% of what any design problem needs. The per-problem novelty is</text>
            <text class="dg-s" x="26" y="218">usually one idea. So the efficient path is: learn blocks deeply, then treat each design problem as “which blocks,</text>
            <text class="dg-s" x="26" y="236">in what arrangement, and what is the one hard part here?” That question also works on problems you have never seen.</text>
          </svg>
          <figcaption>Figure 8 — Why the order matters. This is also exactly how to structure an answer in the room.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="st-howto">How to study this course</h3>
        <ol class="lesson-layers">
          <li><strong>Read Phase 1 in order, without skipping.</strong> It is the least glamorous phase and the one that makes the rest comprehensible. Consistency models in particular will be referenced in nearly every later chapter.</li>
          <li><strong>For each building block, learn the mechanism before the product name.</strong> Knowing that Redis is a cache is trivia; knowing why a cache needs an eviction policy, what a write-through policy costs you, and what happens to a cold cache after a deploy is the actual skill.</li>
          <li><strong>Attempt every design problem before reading it.</strong> Spend fifteen minutes with a blank page first. The gap between your attempt and the chapter is the thing you are actually learning — reading passively feels productive and teaches very little.</li>
          <li><strong>Do the estimation arithmetic by hand.</strong> Chapter 5 exists so you can produce numbers under pressure. Reading someone else's arithmetic builds no fluency at all.</li>
          <li><strong>Say your designs out loud.</strong> The interview tests explanation, not knowledge. Explaining to a wall, a rubber duck or a friend who does not work in tech will surface gaps that silent reading hides completely.</li>
        </ol>
        <div class="lesson-callout"><strong>On pacing.</strong> A realistic schedule for someone working full time is one building-block chapter per day or one design problem every two days, which puts the whole course at roughly six to eight weeks. Chapter 2 gives a more honest breakdown of preparation timelines depending on where you are starting from.</div>

        <h3 class="lesson-subhead" id="st-prereq">What you need before starting</h3>
        <p>Less than people fear. You need to have written and shipped some software, know roughly what a database and an HTTP request are, and be comfortable with arithmetic involving powers of ten. That is genuinely it.</p>
        <p>You do <em>not</em> need distributed systems experience, a particular language, cloud certifications, or to have worked at scale. Those help, and their absence is not a blocker — the whole point of Phase 1 is to build the vocabulary from the ground up.</p>
        <p>If you want a companion resource in a different medium, the <a href="/learn/system-design/fundamentals">System Design Fundamentals</a> and <a href="/learn/system-design/nfr">Non-Functional Requirements</a> lessons on this site cover overlapping ground more briefly and make good revision material. Chapter 4 here goes considerably deeper on the same characteristics.</p>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. The chapter list follows the standard modern system design curriculum used across the industry; all explanations, analogies, diagrams, tables and exercises are our own. External tools, papers and services are named and credited inline where referenced.',
};
