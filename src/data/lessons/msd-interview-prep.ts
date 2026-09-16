/** Modern System Design — Chapter 2: The System Design Interview.
 *  Preparation, do's and don'ts, failure traps, timelines, and mock interviews.
 */

export const msdInterviewPrep = {
  slug: 'interview-prep',
  title: 'The System Design Interview',
  subtitle:
    'What the round is actually measuring, a seven-step structure with a minute-by-minute budget, the behaviours that earn and lose points, the traps that sink strong engineers, an honest preparation timeline, and how to run mocks that are worth the hour.',
  byline: 'Modern System Design · Chapter 2 · ~1h 40m read · Beginner',
  interviewTip:
    'The single highest-leverage habit: spend the first five minutes asking questions and writing down requirements, and do not draw a box until you have numbers on the board. Candidates who start drawing in minute one almost always end up designing the wrong system beautifully. Interviewers read that opening as a proxy for how you behave on a real project.',
  sections: [
    {
      id: 'ready',
      title: 'Getting Ready for the System Design Interview',
      children: [
        { id: 'rd-measured', title: 'What is actually being measured' },
        { id: 'rd-structure', title: 'The seven-step structure' },
        { id: 'rd-budget', title: 'A minute-by-minute budget' },
        { id: 'rd-requirements', title: 'Step 1 in detail: requirements' },
        { id: 'rd-deepdive', title: 'Step 6 in detail: the deep dive' },
      ],
      html: `
        <p>A system design interview is a 45-minute conversation in which you are handed a deliberately vague problem — "design Instagram" — and asked to produce an architecture. There is no correct answer, no test suite, and often no clear finish line. That ambiguity is the point, and it is why the round feels so different from a coding interview.</p>

        <h3 class="lesson-subhead" id="rd-measured">What is actually being measured</h3>
        <p>Interviewers are not scoring your recall of technologies. They are sampling five behaviours, and it helps enormously to know which:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 244" role="img" aria-label="The five signals a system design interview measures, with what strong and weak evidence looks like for each">
            <text class="dg-h" x="16" y="22">SIGNAL · WHAT STRONG LOOKS LIKE · WHAT WEAK LOOKS LIKE</text>
            <rect class="dg-box b" x="16" y="32" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="50">1 · Handling ambiguity</text>
            <text class="dg-s" x="30" y="65">Strong: asks who the users are and what scale, then writes requirements down. Weak: starts drawing immediately.</text>
            <rect class="dg-box c" x="16" y="80" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="98">2 · Technical breadth</text>
            <text class="dg-s" x="30" y="113">Strong: knows several options and when each applies. Weak: one hammer, applied to everything, usually Kafka.</text>
            <rect class="dg-box g" x="16" y="128" width="688" height="40" rx="7" />
            <text class="dg-t" x="30" y="146">3 · Quantitative reasoning</text>
            <text class="dg-s" x="30" y="161">Strong: estimates QPS and storage, and lets the numbers pick the design. Weak: “it should scale fine” with no arithmetic.</text>
            <rect class="dg-box p" x="16" y="176" width="688" height="30" rx="7" />
            <text class="dg-t" x="30" y="194">4 · Trade-off judgement — strong candidates volunteer the cost of their own choice, unprompted</text>
            <rect class="dg-box o" x="16" y="214" width="688" height="26" rx="7" />
            <text class="dg-t" x="30" y="232">5 · Communication — thinks out loud, checks in, and can be redirected without getting defensive</text>
          </svg>
          <figcaption>Figure 1 — The five signals. Notice that only one of them is knowledge. The other four are habits, which is why practice beats reading.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rd-structure">The seven-step structure</h3>
        <p>Having a structure is worth more than knowing any individual technology, for two reasons: it stops you freezing on an open-ended prompt, and it signals to the interviewer that you have done this before. Any sensible structure works; this is the one used throughout this course.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 302" role="img" aria-label="A seven-step structure for answering a system design question, from requirements through to evaluation">
            <defs>
              <marker id="ah-iv1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="24" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="41">1 · REQUIREMENTS — functional, non-functional, and explicitly out of scope</text>
            <text class="dg-s" x="30" y="55">Ask questions. Write the answers where both of you can see them. Get agreement before moving on.</text>
            <rect class="dg-box c" x="16" y="66" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="83">2 · ESTIMATION — QPS, storage, bandwidth, memory</text>
            <text class="dg-s" x="30" y="97">Round aggressively. The goal is an order of magnitude, because that is what changes the design.</text>
            <rect class="dg-box g" x="16" y="108" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="125">3 · API — the handful of endpoints that define the system's contract</text>
            <text class="dg-s" x="30" y="139">Three or four signatures is plenty. This is where scope creep gets caught early.</text>
            <rect class="dg-box y" x="16" y="150" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="167">4 · DATA MODEL — entities, relationships, and the access patterns that matter</text>
            <text class="dg-s" x="30" y="181">Then choose storage. Access patterns pick the database; the database does not pick the access patterns.</text>
            <rect class="dg-box o" x="16" y="192" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="209">5 · HIGH-LEVEL DESIGN — the boxes and arrows, end to end, kept deliberately simple</text>
            <text class="dg-s" x="30" y="223">Walk one request through the whole path out loud. Resist adding components you cannot yet justify.</text>
            <rect class="dg-box p" x="16" y="234" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="251">6 · DEEP DIVE — one or two components, in real depth</text>
            <text class="dg-s" x="30" y="265">Usually the interviewer chooses. This is where most of the signal is generated.</text>
            <rect class="dg-box r" x="16" y="276" width="688" height="24" rx="7" />
            <text class="dg-t" x="30" y="293">7 · EVALUATION — bottlenecks, failure modes, what you would do with more time</text>
            <path class="dg-line violet" d="M708 42 H714 V288 H708" marker-end="url(#ah-iv1)" />
          </svg>
          <figcaption>Figure 2 — The seven steps. Steps 1, 2 and 6 generate most of your score; steps 3 and 4 are where candidates most often waste time on detail nobody asked for.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rd-budget">A minute-by-minute budget</h3>
        <p>Time management is a graded skill, because running out of time before the deep dive is a common and entirely avoidable way to lose. For a 45-minute round:</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="A time budget for a 45 minute system design interview shown as a proportional bar">
            <text class="dg-h" x="16" y="22">45 MINUTES, ALLOCATED</text>
            <rect class="dg-box b" x="16" y="32" width="92" height="40" rx="5" />
            <text class="dg-s" x="62" y="50" text-anchor="middle">requirements</text>
            <text class="dg-s" x="62" y="65" text-anchor="middle">5–7 min</text>
            <rect class="dg-box c" x="112" y="32" width="66" height="40" rx="5" />
            <text class="dg-s" x="145" y="50" text-anchor="middle">estimate</text>
            <text class="dg-s" x="145" y="65" text-anchor="middle">4 min</text>
            <rect class="dg-box g" x="182" y="32" width="82" height="40" rx="5" />
            <text class="dg-s" x="223" y="50" text-anchor="middle">API + data</text>
            <text class="dg-s" x="223" y="65" text-anchor="middle">6 min</text>
            <rect class="dg-box o" x="268" y="32" width="124" height="40" rx="5" />
            <text class="dg-s" x="330" y="50" text-anchor="middle">high-level design</text>
            <text class="dg-s" x="330" y="65" text-anchor="middle">8–10 min</text>
            <rect class="dg-box p" x="396" y="32" width="212" height="40" rx="5" />
            <text class="dg-s" x="502" y="50" text-anchor="middle">DEEP DIVE — the main event</text>
            <text class="dg-s" x="502" y="65" text-anchor="middle">12–15 min</text>
            <rect class="dg-box r" x="612" y="32" width="92" height="40" rx="5" />
            <text class="dg-s" x="658" y="50" text-anchor="middle">wrap-up + Qs</text>
            <text class="dg-s" x="658" y="65" text-anchor="middle">4 min</text>
            <rect class="dg-band y" x="12" y="90" width="696" height="100" rx="10" />
            <text class="dg-h" x="26" y="110">HOW THIS GOES WRONG IN PRACTICE</text>
            <text class="dg-s" x="26" y="132">· 15 minutes on requirements — thorough, but there is now no time to design anything. Set yourself a hard cap.</text>
            <text class="dg-s" x="26" y="150">· A beautiful database schema at minute 25, with no architecture yet. Schemas are cheap signal; go breadth-first.</text>
            <text class="dg-s" x="26" y="168">· Never reaching the deep dive. If you are at minute 25 with no high-level design, simplify out loud and move on.</text>
            <text class="dg-s" x="26" y="184">· Ignoring hints. “How would this handle a celebrity with 50M followers?” is a request to change direction, not small talk.</text>
          </svg>
          <figcaption>Figure 3 — Where the time goes. Keeping an eye on the clock and saying "let me move on so we reach the interesting part" is itself a positive signal.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rd-requirements">Step 1 in detail: requirements</h3>
        <p>This step is short in minutes and decisive in outcome, because everything downstream is judged against it. Three things to produce, out loud and written down:</p>
        <ul class="lesson-layers">
          <li><strong>Functional requirements</strong> — three to five core capabilities, no more. For a photo app: upload a photo, follow users, view a feed. Deliberately exclude the rest.</li>
          <li><strong>Non-functional requirements with numbers</strong> — daily active users, read-to-write ratio, latency target, availability target, retention. Propose numbers rather than asking for them: "shall we assume 100 million daily actives and a 100:1 read-to-write ratio?" is far stronger than "how many users?", because it shows you know which quantities matter.</li>
          <li><strong>Explicit non-goals</strong> — "I will leave out messaging, ads and the recommendation model unless you would like those instead." This protects your time and demonstrates scoping judgement, which is a senior behaviour.</li>
        </ul>
        <div class="lesson-callout"><strong>The read-to-write ratio is the most useful single number you can establish.</strong> A 100:1 read-heavy system wants caching, replication and denormalised precomputed views. A write-heavy system wants partitioning, batching and queues. One question splits the entire design space in half, which is why experienced candidates ask it in the first two minutes.</div>

        <h3 class="lesson-subhead" id="rd-deepdive">Step 6 in detail: the deep dive</h3>
        <p>The deep dive is where the hire decision is usually made, because it is the only part that cannot be faked with a memorised diagram. The interviewer picks a component and asks you to go deeper, and what they are testing is whether your understanding has a second layer.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="How a deep dive question escalates through layers of understanding">
            <defs>
              <marker id="ah-iv2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE ESCALATION — EACH LAYER FILTERS OUT MORE CANDIDATES</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="32" rx="7" />
            <text class="dg-s" x="30" y="52">“You put a cache here — what kind?” · Layer 1: can you name a technology. Nearly everyone passes.</text>
            <rect class="dg-box y" x="16" y="72" width="688" height="32" rx="7" />
            <text class="dg-s" x="30" y="92">“What is the eviction policy, and what is the key?” · Layer 2: do you know the mechanism. Many candidates stop here.</text>
            <rect class="dg-box o" x="16" y="112" width="688" height="32" rx="7" />
            <text class="dg-s" x="30" y="132">“What happens on a deploy when the cache is empty?” · Layer 3: failure and cold-start reasoning. Now it thins out.</text>
            <rect class="dg-box r" x="16" y="152" width="688" height="32" rx="7" />
            <text class="dg-s" x="30" y="172">“One key gets 40% of traffic. Now what?” · Layer 4: hot keys, request coalescing, local caches. This is the senior bar.</text>
            <path class="dg-line rose" d="M708 48 H714 V168 H708" marker-end="url(#ah-iv2)" />
            <text class="dg-s" x="16" y="204">Every building-block chapter in this course is written to take you to layer 4, because layers 1 and 2 are what the internet already gives you.</text>
          </svg>
          <figcaption>Figure 4 — Deep dive escalation. When you genuinely do not know, say so and reason from first principles out loud; that scores far better than confident invention.</figcaption>
        </figure>
      `,
    },
    {
      id: 'dos',
      title: 'The Do\u2019s and Don\u2019ts of the System Design Interview',
      children: [
        { id: 'do-list', title: 'Do these' },
        { id: 'dont-list', title: 'Avoid these' },
        { id: 'do-phrases', title: 'Phrases that buy you credit' },
      ],
      html: `
        <h3 class="lesson-subhead" id="do-list">Do these</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Behaviours that earn credit in a system design interview">
            <text class="dg-h" x="16" y="22">✓ DO</text>
            <rect class="dg-box g" x="16" y="30" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="47">Think out loud, continuously</text>
            <text class="dg-s" x="30" y="61">Silence is unscorable. A wrong idea spoken and then corrected scores better than a right idea kept internal.</text>
            <rect class="dg-box g" x="16" y="74" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="91">Start simple, then add complexity when something forces it</text>
            <text class="dg-s" x="30" y="105">“One database first. Now the numbers say 40,000 writes per second, so let us shard” is a narrative interviewers love.</text>
            <rect class="dg-box g" x="16" y="118" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="135">Volunteer the cost of every choice</text>
            <text class="dg-s" x="30" y="149">“I will denormalise the feed, which means writes get more expensive and I now own a consistency problem.”</text>
            <rect class="dg-box g" x="16" y="162" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="179">Drive the conversation, and check in at each transition</text>
            <text class="dg-s" x="30" y="193">“That is my high-level design — shall I go deeper on the feed or on storage?” You lead; they steer.</text>
            <rect class="dg-box g" x="16" y="206" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="223">Take hints gratefully and change direction</text>
            <text class="dg-s" x="30" y="237">Every interviewer hint is a gift. Defending a position after a hint is one of the fastest ways to fail the round.</text>
            <text class="dg-s" x="16" y="260">And: manage the clock out loud. Naming a time trade-off (“let me simplify here so we reach the deep dive”) is a senior signal.</text>
          </svg>
          <figcaption>Figure 5 — The behaviours that earn credit. None of them require knowing more technology.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dont-list">Avoid these</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Behaviours that lose points in a system design interview">
            <text class="dg-h" x="16" y="22">✗ DON'T</text>
            <rect class="dg-box r" x="16" y="30" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="47">Start drawing before you have requirements</text>
            <text class="dg-s" x="30" y="61">The most common single mistake. You end up designing something well that nobody asked for.</text>
            <rect class="dg-box r" x="16" y="74" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="91">Name-drop technologies as a substitute for reasoning</text>
            <text class="dg-s" x="30" y="105">“I would use Kafka, Cassandra and Kubernetes” invites exactly one question: why? Have the answer, or do not say it.</text>
            <rect class="dg-box r" x="16" y="118" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="135">Over-engineer from minute one</text>
            <text class="dg-s" x="30" y="149">Microservices, multi-region and event sourcing for a system whose load you have not estimated reads as inexperience.</text>
            <rect class="dg-box r" x="16" y="162" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="179">Go silent while you think, or bluff when you are stuck</text>
            <text class="dg-s" x="30" y="193">Say “let me think for fifteen seconds” instead. And “I do not know, but here is how I would reason about it” scores well.</text>
            <rect class="dg-box r" x="16" y="206" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="223">Ignore failure entirely</text>
            <text class="dg-s" x="30" y="237">If nothing in your design ever dies, you have described a diagram. Interviewers notice this immediately.</text>
            <text class="dg-s" x="16" y="260">Also avoid: arguing with hints, inventing statistics, and asking “is this right?” repeatedly — it reads as needing supervision.</text>
          </svg>
          <figcaption>Figure 6 — The behaviours that cost you. The first and the last are the two most commonly fatal.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="do-phrases">Phrases that buy you credit</h3>
        <p>These are not tricks; they are the verbal form of senior thinking, and having them ready reduces cognitive load in the room.</p>
        <ul>
          <li><em>"Before I design anything, let me pin down requirements and scale."</em> — sets the frame.</li>
          <li><em>"Let me assume 100 million daily actives and a 100:1 read-to-write ratio — does that match what you have in mind?"</em> — proposes rather than asks.</li>
          <li><em>"That gives roughly 50,000 reads per second, which is too much for a single database, so…"</em> — lets arithmetic drive design.</li>
          <li><em>"I am choosing X over Y. The cost is Z, and I would revisit it if the write volume grew."</em> — trade-off plus a revision trigger.</li>
          <li><em>"Let me walk one request through end to end."</em> — proves the design is coherent, and often catches your own gaps.</li>
          <li><em>"If this component dies, here is what happens."</em> — the sentence most candidates never say.</li>
          <li><em>"With more time I would look at X — I think it is the next bottleneck."</em> — a strong closing move.</li>
        </ul>
      `,
    },
    {
      id: 'traps',
      title: 'Interview Traps: Why Engineers Fail and Succeed',
      children: [
        { id: 'tr-why-fail', title: 'Why strong engineers fail this round' },
        { id: 'tr-traps', title: 'The seven specific traps' },
        { id: 'tr-succeed', title: 'What successful candidates do differently' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tr-why-fail">Why strong engineers fail this round</h3>
        <p>It is genuinely common for an engineer who ships excellent production software to fail a system design interview. That is not a paradox once you see the mismatch: the job rewards depth in a familiar system over months, while the interview rewards breadth across unfamiliar problems in 45 minutes, spoken aloud.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Mismatch between how engineers work day to day and what the interview format rewards">
            <rect class="dg-band b" x="12" y="16" width="340" height="130" rx="11" />
            <text class="dg-h" x="26" y="36">YOUR DAY JOB REWARDS</text>
            <text class="dg-s" x="26" y="58">· depth in one system you know well</text>
            <text class="dg-s" x="26" y="76">· decisions made over days, with data</text>
            <text class="dg-s" x="26" y="94">· reading code and dashboards to decide</text>
            <text class="dg-s" x="26" y="112">· whatever your company already chose</text>
            <text class="dg-s" x="26" y="134">· silent, individual thinking time</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="130" rx="11" />
            <text class="dg-h" x="382" y="36">THE INTERVIEW REWARDS</text>
            <text class="dg-s" x="382" y="58">· breadth across unfamiliar problems</text>
            <text class="dg-s" x="382" y="76">· decisions in minutes, from assumptions</text>
            <text class="dg-s" x="382" y="94">· arithmetic done in your head</text>
            <text class="dg-s" x="382" y="112">· knowing the alternatives you did not use</text>
            <text class="dg-s" x="382" y="134">· continuous narration of your reasoning</text>
            <text class="dg-s" x="16" y="170">The gap is real, and it is a format gap rather than an ability gap — which is exactly why deliberate practice closes it quickly.</text>
            <text class="dg-s" x="16" y="188">The corollary: experience alone does not prepare you for this round, and juniors who practise properly often outperform seniors who do not.</text>
          </svg>
          <figcaption>Figure 7 — The mismatch. Read this as good news: the gap is closed by practice in the format, not by years.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tr-traps">The seven specific traps</h3>
        <ol class="lesson-layers">
          <li><strong>Solving the wrong problem.</strong> You designed a video platform; they wanted the recommendation feed. Prevented entirely by step 1 — write requirements down and get explicit agreement.</li>
          <li><strong>The complexity flex.</strong> Reaching for the most sophisticated architecture you know to demonstrate range. It reads as an inability to judge what a problem needs. Simple-then-justified always beats complex-by-default.</li>
          <li><strong>Arithmetic avoidance.</strong> Skipping estimation because mental maths under pressure is uncomfortable. But without numbers, every design decision is unfalsifiable opinion — and interviewers know it. Chapter 5 exists to make this automatic.</li>
          <li><strong>Depth-first descent.</strong> Twenty minutes on the perfect schema while the architecture never materialises. Go breadth-first, then let the interviewer choose where to dig.</li>
          <li><strong>Assuming nothing fails.</strong> Not mentioning replication, failover, retries or partial failure anywhere. This is the fastest way to look junior regardless of how elegant the happy path is.</li>
          <li><strong>Defending instead of listening.</strong> An interviewer's question is usually a hint. Treating it as an attack and arguing converts a recoverable gap into a rejection, and it also predicts how you will behave in design reviews.</li>
          <li><strong>Reciting a memorised answer.</strong> Blueprints from videos fall apart on the first "why", and interviewers probe precisely because they have seen the blueprint too. Learn mechanisms, not layouts.</li>
        </ol>
        <div class="lesson-callout"><strong>The meta-trap.</strong> Six of the seven above are behavioural, not technical. You could know every building block in this course and still fail on trap 1, 4 or 6. That is why this chapter comes before all the technical material rather than after it.</div>

        <h3 class="lesson-subhead" id="tr-succeed">What successful candidates do differently</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 224" role="img" aria-label="Comparison of how weak and strong candidates handle the same moments in an interview">
            <text class="dg-h" x="16" y="22">SAME MOMENT · TWO RESPONSES</text>
            <rect class="dg-box r" x="16" y="32" width="336" height="52" rx="7" />
            <text class="dg-s" x="30" y="50">Asked to design X:</text>
            <text class="dg-s" x="30" y="66">“OK, so we need a load balancer, then</text>
            <text class="dg-s" x="30" y="79">app servers, then a database…” (drawing)</text>
            <rect class="dg-box g" x="368" y="32" width="336" height="52" rx="7" />
            <text class="dg-s" x="382" y="50">Asked to design X:</text>
            <text class="dg-s" x="382" y="66">“Let me clarify scope and scale first —</text>
            <text class="dg-s" x="382" y="79">who uses this, and how many?”</text>
            <rect class="dg-box r" x="16" y="92" width="336" height="52" rx="7" />
            <text class="dg-s" x="30" y="110">Asked “why that database?”:</text>
            <text class="dg-s" x="30" y="126">“Cassandra scales well and is used at</text>
            <text class="dg-s" x="30" y="139">big companies.”</text>
            <rect class="dg-box g" x="368" y="92" width="336" height="52" rx="7" />
            <text class="dg-s" x="382" y="110">Asked “why that database?”:</text>
            <text class="dg-s" x="382" y="126">“Writes dominate and queries are all by</text>
            <text class="dg-s" x="382" y="139">user ID, so I do not need joins — cost is ad-hoc queries.”</text>
            <rect class="dg-box r" x="16" y="152" width="336" height="52" rx="7" />
            <text class="dg-s" x="30" y="170">Hit with a hard follow-up:</text>
            <text class="dg-s" x="30" y="186">Guesses confidently, or freezes and</text>
            <text class="dg-s" x="30" y="199">goes quiet.</text>
            <rect class="dg-box g" x="368" y="152" width="336" height="52" rx="7" />
            <text class="dg-s" x="382" y="170">Hit with a hard follow-up:</text>
            <text class="dg-s" x="382" y="186">“I have not built this — let me reason it</text>
            <text class="dg-s" x="382" y="199">out. The constraint is…”</text>
            <text class="dg-s" x="16" y="220">The right column is not more knowledgeable. It is more structured, more quantitative, and more honest.</text>
          </svg>
          <figcaption>Figure 8 — The same three moments, handled two ways. The difference is habit, and habit is trainable in weeks.</figcaption>
        </figure>
      `,
    },
    {
      id: 'howlong',
      title: 'How Long Does It Take to Prepare?',
      children: [
        { id: 'hl-depends', title: 'It depends on where you start' },
        { id: 'hl-plans', title: 'Three realistic plans' },
        { id: 'hl-ready', title: 'How to tell when you are ready' },
      ],
      html: `
        <h3 class="lesson-subhead" id="hl-depends">It depends on where you start</h3>
        <p>The honest answer is four to twelve weeks of consistent part-time study, and the range is driven almost entirely by your starting point rather than your intelligence or years of experience.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Preparation time estimates based on starting point">
            <text class="dg-h" x="16" y="22">STARTING POINT · REALISTIC TIME TO INTERVIEW-READY</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="49">Already build distributed systems at work, just need the format · 2–4 weeks</text>
            <text class="dg-s" x="30" y="63">Skim Phase 2 for vocabulary gaps, then spend most of your time on mocks and speaking out loud.</text>
            <rect class="dg-box y" x="16" y="76" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="93">Backend engineer, comfortable with databases and caches, no large-scale exposure · 6–8 weeks</text>
            <text class="dg-s" x="30" y="107">The most common case. Full Phase 1 and 2, then a design problem every two days. This is the course's default pace.</text>
            <rect class="dg-box o" x="16" y="120" width="688" height="36" rx="7" />
            <text class="dg-t" x="30" y="137">Frontend, mobile, data or ML background moving toward backend system design · 8–12 weeks</text>
            <text class="dg-s" x="30" y="151">Phase 1 needs real time. Do not rush consistency and failure models; everything later leans on them.</text>
            <rect class="dg-box r" x="16" y="164" width="688" height="30" rx="7" />
            <text class="dg-t" x="30" y="182">Fewer than 2 years experience, first senior-level loop · 12+ weeks, and prioritise mocks heavily</text>
          </svg>
          <figcaption>Figure 9 — Timelines by starting point. Interviewing in a week is possible but it is a lottery; the round is too broad to cram.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="hl-plans">Three realistic plans</h3>
        <p><strong>The 4-week sprint (interview already scheduled).</strong> Week 1: Phase 1 in full, plus estimation drilled until it is automatic. Week 2: the eight highest-leverage building blocks — load balancer, database, cache, queue, key-value store, CDN, blob store, rate limiter. Week 3: six design problems, attempting each before reading. Week 4: mocks only, two or three, with feedback.</p>
        <p><strong>The 8-week standard.</strong> Weeks 1–2: Phase 1. Weeks 3–5: all nineteen building blocks, roughly one per day. Weeks 6–7: ten design problems. Week 8: mocks and revision. This is the plan the course is paced for.</p>
        <p><strong>The 12-week thorough.</strong> As above but with a project: actually build something with a cache, a queue and a sharded store, and load-test it until it breaks. Nothing teaches the material like watching your own system fall over, and it also gives you stories to tell in the behavioural round.</p>
        <div class="lesson-callout"><strong>Ratio guidance.</strong> Whatever your timeline, aim for roughly 50% reading, 30% attempting problems on a blank page, and 20% speaking out loud in mocks. Most people accidentally run at 95/5/0 and then wonder why the real interview feels nothing like their preparation.</div>

        <h3 class="lesson-subhead" id="hl-ready">How to tell when you are ready</h3>
        <p>Not "have I finished the course" but "can I do these things", which you can test honestly:</p>
        <ol class="lesson-checklist">
          <li>Given an unfamiliar prompt, you produce requirements and scale numbers within five minutes, without freezing.</li>
          <li>You can estimate QPS, storage and bandwidth in your head, roughly, without a calculator.</li>
          <li>You can explain replication, partitioning, caching and queueing to someone else without notes.</li>
          <li>For any component you place, you can answer "what happens when it fails?"</li>
          <li>You can name the cost of every choice you make, unprompted.</li>
          <li>You have completed at least three mocks with a human and acted on the feedback.</li>
          <li>You can talk continuously for 45 minutes about a design without running dry or rambling.</li>
        </ol>
      `,
    },
    {
      id: 'mocks',
      title: 'System Design Mock Interviews',
      children: [
        { id: 'mk-why', title: 'Why mocks are non-negotiable' },
        { id: 'mk-run', title: 'How to run one properly' },
        { id: 'mk-rubric', title: 'A rubric you can score against' },
        { id: 'mk-alone', title: 'If you have nobody to practise with' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mk-why">Why mocks are non-negotiable</h3>
        <p>Reading builds knowledge; mocks build the skill actually being tested. The gap between "I understand consistent hashing" and "I can explain consistent hashing out loud, under time pressure, while drawing it and being interrupted" is enormous, and it is invisible until you try.</p>
        <p>Mocks surface a specific class of problem that solo study cannot: filler words and rambling, running out of time, drawing something you cannot then explain, and — most commonly — discovering that an idea you thought you understood dissolves the moment you have to say it in complete sentences.</p>

        <h3 class="lesson-subhead" id="mk-run">How to run one properly</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 224" role="img" aria-label="Structure of an effective 60 minute mock interview session">
            <defs>
              <marker id="ah-mk1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">A 60-MINUTE MOCK, DONE RIGHT</text>
            <rect class="dg-box b" x="16" y="32" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="52" text-anchor="middle">0–45 min</text>
            <text class="dg-s" x="96" y="68" text-anchor="middle">the interview, uninterrupted</text>
            <rect class="dg-box c" x="196" y="32" width="160" height="48" rx="7" />
            <text class="dg-s" x="276" y="52" text-anchor="middle">45–55 min</text>
            <text class="dg-s" x="276" y="68" text-anchor="middle">structured feedback</text>
            <rect class="dg-box g" x="376" y="32" width="160" height="48" rx="7" />
            <text class="dg-s" x="456" y="52" text-anchor="middle">55–60 min</text>
            <text class="dg-s" x="456" y="68" text-anchor="middle">write down 3 fixes</text>
            <rect class="dg-box p" x="556" y="32" width="148" height="48" rx="7" />
            <text class="dg-s" x="630" y="52" text-anchor="middle">next mock</text>
            <text class="dg-s" x="630" y="68" text-anchor="middle">check those 3 fixes</text>
            <path class="dg-line green" d="M176 56 H192" marker-end="url(#ah-mk1)" />
            <path class="dg-line green" d="M356 56 H372" marker-end="url(#ah-mk1)" />
            <path class="dg-line green" d="M536 56 H552" marker-end="url(#ah-mk1)" />
            <rect class="dg-band y" x="12" y="98" width="696" height="118" rx="10" />
            <text class="dg-h" x="26" y="118">RULES THAT MAKE THE DIFFERENCE</text>
            <text class="dg-s" x="26" y="140">· Use a real timer and stop at 45 minutes even mid-sentence. Overrunning teaches you the wrong pacing.</text>
            <text class="dg-s" x="26" y="158">· Speak every thought aloud. If your partner cannot hear reasoning, neither could an interviewer.</text>
            <text class="dg-s" x="26" y="176">· Record it. Watching yourself is uncomfortable and unusually instructive — you will spot rambling you cannot feel live.</text>
            <text class="dg-s" x="26" y="194">· The partner must interrupt with “why?” and at least one hint you are expected to act on.</text>
            <text class="dg-s" x="26" y="210">· Do not look anything up during the 45 minutes. The whole value is performing under the real constraint.</text>
          </svg>
          <figcaption>Figure 10 — Mock structure. The final box is the one people skip, and it is where nearly all the improvement comes from.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="mk-rubric">A rubric you can score against</h3>
        <p>Give this to your partner. Vague feedback ("that was pretty good") is useless; scored feedback against the five signals is actionable.</p>
        <table>
          <thead><tr><th>Dimension</th><th>1 — weak</th><th>3 — solid</th><th>5 — strong</th></tr></thead>
          <tbody>
            <tr><td><strong>Requirements</strong></td><td>Started designing immediately</td><td>Asked some questions</td><td>Functional, non-functional with numbers, and explicit non-goals inside 6 minutes</td></tr>
            <tr><td><strong>Estimation</strong></td><td>None, or hand-waved</td><td>Rough QPS and storage</td><td>QPS, storage, bandwidth — and used them to choose the design</td></tr>
            <tr><td><strong>High-level design</strong></td><td>Confused or incomplete path</td><td>Coherent boxes and arrows</td><td>Walked a request end to end; complexity added only where justified</td></tr>
            <tr><td><strong>Depth</strong></td><td>Fell apart on first “why”</td><td>Knew mechanisms</td><td>Handled hot keys, cold start, partial failure without prompting</td></tr>
            <tr><td><strong>Trade-offs</strong></td><td>Presented choices as obvious</td><td>Named costs when asked</td><td>Volunteered costs and gave revision triggers</td></tr>
            <tr><td><strong>Failure handling</strong></td><td>Never mentioned</td><td>Mentioned replication</td><td>Failure mode named for every major component</td></tr>
            <tr><td><strong>Communication</strong></td><td>Long silences or rambling</td><td>Clear, some filler</td><td>Continuous narration, checked in at transitions, took hints well</td></tr>
            <tr><td><strong>Time management</strong></td><td>Never reached deep dive</td><td>Covered most steps</td><td>All seven steps, with the deep dive getting the most time</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="mk-alone">If you have nobody to practise with</h3>
        <p>Solo practice is much better than no practice, provided you keep the constraints that make mocks work — the timer, the speaking, and the no-lookups rule.</p>
        <ul class="lesson-layers">
          <li><strong>Record yourself answering a prompt for 45 minutes,</strong> then watch it as if you were the interviewer and score it with the rubric above. Brutal, effective.</li>
          <li><strong>Use an LLM as the interviewer.</strong> Ask it to play a senior interviewer, to interrupt with "why" questions, to give exactly one hint, and to score you against the rubric at the end. It is genuinely decent at generating follow-ups, and it never gets tired of your fourth attempt at the same problem.</li>
          <li><strong>Teach the topic to someone non-technical.</strong> If you can explain why a cache needs an eviction policy to a family member, you understand it. This is the cheapest gap-detector available.</li>
          <li><strong>Explain to a rubber duck, standing up, with a whiteboard.</strong> Sounds silly, works well — the physical act of drawing while speaking is the actual skill.</li>
        </ul>
        <p>Whichever route you take, the next chapter starts the technical material: remote procedure calls, consistency models and failure models — the three ideas that every later chapter assumes.</p>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. The seven-step structure, rubric, timelines and all diagrams are our own; the underlying interview format is industry-standard and taught in many variations. No third-party course material is reproduced.',
};
