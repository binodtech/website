/** Modern System Design — Chapter 3: Preliminary System Design Concepts.
 *  Network abstractions and RPC, the spectrum of consistency models,
 *  and the spectrum of failure models.
 */

export const msdPreliminaryConcepts = {
  slug: 'preliminary-concepts',
  title: 'Preliminary System Design Concepts',
  subtitle:
    'Three ideas that make distributed systems different from ordinary programs: calling code on another machine is nothing like calling a function, replicated data can legitimately disagree with itself, and "broken" is not one condition but a spectrum from cleanly dead to actively lying.',
  byline: 'Modern System Design · Chapter 3 · ~1h 45m read · Beginner',
  interviewTip:
    'Interviewers probe these three concepts indirectly. "What happens if that call times out?" is testing whether you know a timeout tells you nothing about whether the work happened. "Can a user see their own comment immediately?" is testing whether you can name read-your-writes as a session guarantee rather than hand-waving about eventual consistency. Answer with the vocabulary from this chapter and you sound like someone who has operated a system, not just read about one.',
  sections: [
    {
      id: 'rpc',
      title: 'Network Abstractions: Remote Procedure Calls',
      children: [
        { id: 'rpc-abstraction', title: 'What an abstraction buys and costs' },
        { id: 'rpc-flow', title: 'How an RPC actually executes' },
        { id: 'rpc-leaks', title: 'Where the illusion leaks' },
        { id: 'rpc-semantics', title: 'Delivery semantics: at-most-once, at-least-once, exactly-once' },
        { id: 'rpc-styles', title: 'RPC, REST, GraphQL and messaging' },
      ],
      html: `
        <p>A single program has one enormous luxury: when one function calls another, the call always happens. It may throw, it may loop forever, but it cannot half-happen, and the caller never wonders whether the callee received the arguments.</p>
        <p>The moment those two functions live on different machines, every one of those guarantees evaporates. A <strong>Remote Procedure Call (RPC)</strong> is the abstraction that tries to hide this — to make calling code on another machine look like calling a local function. Understanding precisely where that illusion holds and where it leaks is the foundation for everything else in this course.</p>

        <h3 class="lesson-subhead" id="rpc-abstraction">What an abstraction buys and costs</h3>
        <p>The purpose of an abstraction is to let you stop thinking about something. RPC lets you write <code>getUser(42)</code> instead of manually serialising a request, opening a socket, handling partial reads, parsing a response and mapping errors. That is a genuine and large win.</p>
        <p>The cost is that abstractions which hide something <em>expensive</em> tend to get used as though it were cheap. A local function call and a remote one look nearly identical in source code and differ by roughly six orders of magnitude in cost.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="Comparison of a local function call and a remote procedure call across cost, failure modes and shared memory">
            <defs>
              <marker id="ah-ab" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">IDENTICAL IN YOUR EDITOR, NOT REMOTELY ALIKE AT RUNTIME</text>
            <rect class="dg-band g" x="12" y="32" width="344" height="180" rx="11" />
            <text class="dg-h" x="26" y="52">LOCAL CALL</text>
            <rect class="dg-box g" x="26" y="62" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="79" text-anchor="middle">user = getUser(42)</text>
            <text class="dg-s" x="26" y="108">· cost: ~1 nanosecond</text>
            <text class="dg-s" x="26" y="126">· either runs or throws — never partially</text>
            <text class="dg-s" x="26" y="144">· shares memory, so pointers work</text>
            <text class="dg-s" x="26" y="162">· arguments cost nothing to pass</text>
            <text class="dg-s" x="26" y="180">· caller and callee versions always match</text>
            <text class="dg-s" x="26" y="200">· failure means a bug in your code</text>

            <rect class="dg-band r" x="368" y="32" width="340" height="180" rx="11" />
            <text class="dg-h" x="382" y="52">REMOTE CALL</text>
            <rect class="dg-box r" x="382" y="62" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="79" text-anchor="middle">user = userService.getUser(42)</text>
            <text class="dg-s" x="382" y="108">· cost: ~0.5 ms same datacentre, ~150 ms intercontinental</text>
            <text class="dg-s" x="382" y="126">· can half-happen, and you cannot tell</text>
            <text class="dg-s" x="382" y="144">· no shared memory — everything is copied</text>
            <text class="dg-s" x="382" y="162">· big arguments cost real time and bandwidth</text>
            <text class="dg-s" x="382" y="180">· the other side may run different code than you expect</text>
            <text class="dg-s" x="382" y="200">· failure often means nothing is wrong with your code</text>
          </svg>
          <figcaption>Figure 1 — The gap RPC hides. A remote call is roughly 500,000 times more expensive than a local one in the best case, and that is the least important difference on this list.</figcaption>
        </figure>
        <p>Keep those latency numbers in mind, because they decide architecture. A design that makes 50 sequential remote calls to serve one page cannot be fast, no matter how efficient each service is — 50 × 0.5 ms is already 25 ms of pure waiting. This is why "chatty" interfaces are considered a design smell, and why batching and parallelising calls matters more than optimising any single one.</p>

        <h3 class="lesson-subhead" id="rpc-flow">How an RPC actually executes</h3>
        <p>To reason about failure you need to know what the machinery does. Ten steps sit between your function call and its return value.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 300" role="img" aria-label="The ten steps of a remote procedure call from client stub through marshalling, transport, server dispatch and back">
            <defs>
              <marker id="ah-rp" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-rp2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="330" height="128" rx="11" />
            <text class="dg-h" x="26" y="36">CLIENT MACHINE</text>
            <rect class="dg-box b" x="26" y="46" width="140" height="28" rx="6" />
            <text class="dg-s" x="96" y="64" text-anchor="middle">1 · your code calls</text>
            <rect class="dg-box b" x="26" y="80" width="140" height="28" rx="6" />
            <text class="dg-s" x="96" y="98" text-anchor="middle">2 · client stub</text>
            <rect class="dg-box c" x="188" y="46" width="140" height="28" rx="6" />
            <text class="dg-s" x="258" y="64" text-anchor="middle">3 · marshal args</text>
            <rect class="dg-box c" x="188" y="80" width="140" height="28" rx="6" />
            <text class="dg-s" x="258" y="98" text-anchor="middle">4 · OS sends bytes</text>
            <text class="dg-s" x="26" y="128">the stub is generated code — you never write it by hand</text>

            <rect class="dg-band o" x="378" y="16" width="330" height="128" rx="11" />
            <text class="dg-h" x="392" y="36">SERVER MACHINE</text>
            <rect class="dg-box o" x="392" y="46" width="140" height="28" rx="6" />
            <text class="dg-s" x="462" y="64" text-anchor="middle">6 · server stub</text>
            <rect class="dg-box o" x="392" y="80" width="140" height="28" rx="6" />
            <text class="dg-s" x="462" y="98" text-anchor="middle">7 · unmarshal args</text>
            <rect class="dg-box g" x="554" y="46" width="140" height="28" rx="6" />
            <text class="dg-s" x="624" y="64" text-anchor="middle">8 · run the function</text>
            <rect class="dg-box g" x="554" y="80" width="140" height="28" rx="6" />
            <text class="dg-s" x="624" y="98" text-anchor="middle">9 · marshal result</text>
            <text class="dg-s" x="392" y="128">the server has no idea the caller was remote</text>

            <rect class="dg-box r" x="248" y="164" width="224" height="34" rx="8" />
            <text class="dg-t" x="360" y="186" text-anchor="middle">5 · THE NETWORK</text>
            <path class="dg-line violet" d="M328 94 H340 V170 H244" marker-end="url(#ah-rp)" />
            <path class="dg-line green" d="M476 182 H540 V116 H462 V112" marker-end="url(#ah-rp2)" />
            <text class="dg-s" x="486" y="160">10 · response travels back,</text>
            <text class="dg-s" x="486" y="174">unmarshals, your call returns</text>

            <rect class="dg-band r" x="12" y="216" width="696" height="76" rx="10" />
            <text class="dg-h" x="26" y="236">EVERY STEP IS A PLACE THE CALL CAN DIE — AND STEP 5 IS THE CRUEL ONE</text>
            <text class="dg-s" x="26" y="258">If the request dies before step 8, nothing happened. If it dies after step 8 but before the response arrives, the work</text>
            <text class="dg-s" x="26" y="276">happened and you will never know. From the caller's seat these two outcomes are completely indistinguishable.</text>
          </svg>
          <figcaption>Figure 2 — The full round trip. Steps 3 and 7 are marshalling (turning objects into bytes and back); the stubs are code generated from an interface definition so both sides agree on the shape of the data.</figcaption>
        </figure>
        <p>Two pieces of vocabulary from that diagram are worth owning. <strong>Marshalling</strong> (or serialisation) is converting in-memory objects into a byte sequence — JSON, Protocol Buffers, Avro, Thrift. An <strong>Interface Definition Language (IDL)</strong> is the schema both sides compile against, which is how the client stub and server stub stay compatible.</p>

        <h3 class="lesson-subhead" id="rpc-leaks">Where the illusion leaks</h3>
        <p>Classic advice in this field is a list of assumptions that distributed programs are tempted to make and that are all false. They are worth internalising as a checklist, because each one names a real outage.</p>
        <table>
          <thead><tr><th>The tempting assumption</th><th>Why it is false</th><th>What it costs you when ignored</th></tr></thead>
          <tbody>
            <tr><td>The network is reliable</td><td>Packets drop, links saturate, cables get unplugged</td><td>Lost writes, stuck requests with no error</td></tr>
            <tr><td>Latency is zero</td><td>Same rack is microseconds; across an ocean is ~150 ms</td><td>Chatty designs that cannot meet a latency budget</td></tr>
            <tr><td>Bandwidth is infinite</td><td>Links have a ceiling, and large payloads share it</td><td>One heavy endpoint starves everything else</td></tr>
            <tr><td>The network is secure</td><td>Traffic can be observed and tampered with</td><td>Data leaks; the reason for TLS everywhere</td></tr>
            <tr><td>Topology does not change</td><td>Machines are replaced, scaled, rescheduled constantly</td><td>Hardcoded addresses; the need for service discovery</td></tr>
            <tr><td>There is one administrator</td><td>Different teams own different pieces</td><td>Nobody can answer "why is it slow" end to end</td></tr>
            <tr><td>Transport cost is zero</td><td>Serialisation burns CPU; traffic costs money</td><td>Surprise cloud bills, CPU spent on JSON parsing</td></tr>
            <tr><td>The network is homogeneous</td><td>Mixed versions, languages, protocols coexist</td><td>Breaking changes that take down a dependent</td></tr>
          </tbody>
        </table>
        <p>Beyond that list, one leak deserves its own treatment because it causes the most damage in practice: <strong>partial failure</strong>. In a single program, a function either ran or it did not. In a distributed one, "I did not get a response" has at least four possible explanations, and no amount of cleverness on the client lets you distinguish them.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 244" role="img" aria-label="Four indistinguishable causes of a timeout: request lost, server slow, server crashed after doing the work, and response lost">
            <defs>
              <marker id="ah-pf" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">YOUR CALL TIMED OUT. WHICH OF THESE HAPPENED?</text>
            <rect class="dg-box y" x="16" y="32" width="336" height="40" rx="7" />
            <text class="dg-s" x="30" y="49">A · the request never arrived</text>
            <text class="dg-s" x="30" y="65">→ the work did NOT happen. Safe to retry.</text>
            <rect class="dg-box y" x="368" y="32" width="336" height="40" rx="7" />
            <text class="dg-s" x="382" y="49">B · the server is just slow, still working</text>
            <text class="dg-s" x="382" y="65">→ the work is happening RIGHT NOW. Retry duplicates it.</text>
            <rect class="dg-box y" x="16" y="82" width="336" height="40" rx="7" />
            <text class="dg-s" x="30" y="99">C · server did the work, then crashed</text>
            <text class="dg-s" x="30" y="115">→ the work DID happen. Retry duplicates it.</text>
            <rect class="dg-box y" x="368" y="82" width="336" height="40" rx="7" />
            <text class="dg-s" x="382" y="99">D · work done, response lost on the way back</text>
            <text class="dg-s" x="382" y="115">→ the work DID happen. Retry duplicates it.</text>
            <rect class="dg-box r" x="176" y="140" width="368" height="40" rx="8" />
            <text class="dg-t" x="360" y="157" text-anchor="middle">The client observes exactly the same thing in all four cases</text>
            <text class="dg-s" x="360" y="173" text-anchor="middle">silence</text>
            <path class="dg-line rose" d="M184 122 V136" marker-end="url(#ah-pf)" />
            <path class="dg-line rose" d="M536 122 V136" marker-end="url(#ah-pf)" />
            <rect class="dg-band g" x="12" y="196" width="696" height="42" rx="10" />
            <text class="dg-s" x="26" y="216">This is why <tspan class="dg-t">idempotency</tspan> is not an optional nicety. If a retried operation is harmless, you no longer need to know which case</text>
            <text class="dg-s" x="26" y="232">you are in — and since you can never know, designing so it does not matter is the only workable answer.</text>
          </svg>
          <figcaption>Figure 3 — The four-way ambiguity of a timeout. Every retry policy, idempotency key and deduplication table in production exists because of this diagram.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>The practical rule.</strong> Make write operations idempotent by giving the client a way to say "this is the same request as before" — usually an idempotency key or a client-generated request ID that the server records. Then a retry that arrives twice is recognised and ignored the second time. Payment systems live and die by this, which is why Chapter 38 returns to it in detail.</div>

        <h3 class="lesson-subhead" id="rpc-semantics">Delivery semantics: at-most-once, at-least-once, exactly-once</h3>
        <p>Given that ambiguity, a system has to choose what it promises. There are three options and one of them is partly a marketing term.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 234" role="img" aria-label="Three delivery semantics compared: at most once, at least once, and effectively exactly once via idempotency">
            <defs>
              <marker id="ah-sm" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="228" height="204" rx="11" />
            <text class="dg-h" x="26" y="36">AT MOST ONCE</text>
            <text class="dg-s" x="26" y="56">send, never retry</text>
            <rect class="dg-box r" x="26" y="66" width="200" height="24" rx="5" />
            <text class="dg-s" x="126" y="83" text-anchor="middle">0 or 1 executions</text>
            <text class="dg-s" x="26" y="110">✓ never duplicates</text>
            <text class="dg-s" x="26" y="128">✗ silently loses work</text>
            <text class="dg-s" x="26" y="152">Fine for: a metrics ping,</text>
            <text class="dg-s" x="26" y="166">a cache warm, a log line</text>
            <text class="dg-s" x="26" y="190">Never for: money,</text>
            <text class="dg-s" x="26" y="204">orders, state changes</text>

            <rect class="dg-band y" x="252" y="16" width="228" height="204" rx="11" />
            <text class="dg-h" x="266" y="36">AT LEAST ONCE</text>
            <text class="dg-s" x="266" y="56">send, retry until acked</text>
            <rect class="dg-box y" x="266" y="66" width="200" height="24" rx="5" />
            <text class="dg-s" x="366" y="83" text-anchor="middle">1 or more executions</text>
            <text class="dg-s" x="266" y="110">✓ never loses work</text>
            <text class="dg-s" x="266" y="128">✗ can duplicate</text>
            <text class="dg-s" x="266" y="152">The default for most</text>
            <text class="dg-s" x="266" y="166">queues and RPC layers</text>
            <text class="dg-s" x="266" y="190">Safe only if the receiver</text>
            <text class="dg-s" x="266" y="204">handles duplicates</text>

            <rect class="dg-band g" x="492" y="16" width="216" height="204" rx="11" />
            <text class="dg-h" x="506" y="36">“EXACTLY ONCE”</text>
            <text class="dg-s" x="506" y="56">at-least-once + dedup</text>
            <rect class="dg-box g" x="506" y="66" width="188" height="24" rx="5" />
            <text class="dg-s" x="600" y="83" text-anchor="middle">1 visible effect</text>
            <text class="dg-s" x="506" y="110">Not magic: the message</text>
            <text class="dg-s" x="506" y="124">still arrives twice.</text>
            <text class="dg-s" x="506" y="146">The receiver recognises</text>
            <text class="dg-s" x="506" y="160">the duplicate and makes</text>
            <text class="dg-s" x="506" y="174">the second one a no-op.</text>
            <text class="dg-s" x="506" y="198">Say “effectively once”</text>
            <text class="dg-s" x="506" y="212">and interviewers relax.</text>
          </svg>
          <figcaption>Figure 4 — The three semantics. The honest framing of exactly-once is at-least-once delivery plus idempotent processing; anyone claiming exactly-once delivery over an unreliable network is describing deduplication.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rpc-styles">RPC, REST, GraphQL and messaging</h3>
        <p>RPC is one communication style among several. Choosing between them is a real design decision that interviewers ask about, so it helps to have the trade-offs straight.</p>
        <table>
          <thead><tr><th></th><th>Mental model</th><th>Strong when</th><th>Weak when</th></tr></thead>
          <tbody>
            <tr><td><strong>RPC / gRPC</strong></td><td>Call a function elsewhere</td><td>Internal service-to-service, low latency, strict schema, streaming</td><td>Public APIs, browser clients, loose coupling</td></tr>
            <tr><td><strong>REST</strong></td><td>Act on resources over HTTP verbs</td><td>Public APIs, caching, ubiquity, debuggability</td><td>Chatty when a screen needs many resources</td></tr>
            <tr><td><strong>GraphQL</strong></td><td>Client declares the shape it wants</td><td>Many client types, avoiding over-fetching</td><td>Caching, cost control, unpredictable queries</td></tr>
            <tr><td><strong>Messaging / queue</strong></td><td>Hand work off, do not wait</td><td>Decoupling, spikes, retries, slow work</td><td>When the caller genuinely needs an answer now</td></tr>
          </tbody>
        </table>
        <p>The most important distinction is not in that table but across it: whether the call is <strong>synchronous</strong> (the caller waits and is coupled to the callee's availability) or <strong>asynchronous</strong> (the caller hands off work and is not). Converting a synchronous call into a queued one is the single most common fix for both latency and reliability problems, and it appears in nearly every design in this course.</p>
      `,
    },
    {
      id: 'consistency',
      title: 'Spectrum of Consistency Models',
      children: [
        { id: 'cons-why', title: 'Why replicas disagree at all' },
        { id: 'cons-spectrum', title: 'The spectrum, strongest to weakest' },
        { id: 'cons-session', title: 'Session guarantees: the practical middle' },
        { id: 'cons-quorum', title: 'Tuning consistency with quorums' },
        { id: 'cons-cap', title: 'CAP, and the more useful PACELC' },
        { id: 'cons-choose', title: 'Choosing a model in an interview' },
      ],
      html: `
        <p>The instant you keep more than one copy of a piece of data, you have created the possibility that the copies disagree. A <strong>consistency model</strong> is the contract that tells you what disagreements a system will let you observe.</p>
        <p>Most engineers know two words here — "strong" and "eventual" — and treat them as the only options. They are the endpoints of a spectrum with several genuinely useful stops in between, and knowing those stops is what lets you give a precise answer instead of a vague one.</p>

        <h3 class="lesson-subhead" id="cons-why">Why replicas disagree at all</h3>
        <p>You replicate data for three reasons: to survive a machine dying, to serve reads from more machines than one, and to put data physically near users. All three are good reasons and all three create the same problem — a write has to reach several places, and it cannot reach them at the same instant.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="A write reaching one replica before another, causing two readers to observe different values at the same moment">
            <defs>
              <marker id="ah-cw" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cw2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE WHOLE PROBLEM, IN ONE PICTURE</text>
            <rect class="dg-box b" x="16" y="34" width="120" height="40" rx="7" />
            <text class="dg-s" x="76" y="52" text-anchor="middle">writer</text>
            <text class="dg-s" x="76" y="66" text-anchor="middle">sets x = 2</text>
            <rect class="dg-box g" x="216" y="30" width="150" height="44" rx="7" />
            <text class="dg-s" x="291" y="49" text-anchor="middle">replica A</text>
            <text class="dg-t" x="291" y="65" text-anchor="middle">x = 2 ✓ applied</text>
            <rect class="dg-box r" x="216" y="106" width="150" height="44" rx="7" />
            <text class="dg-s" x="291" y="125" text-anchor="middle">replica B</text>
            <text class="dg-t" x="291" y="141" text-anchor="middle">x = 1 ✗ not yet</text>
            <path class="dg-line blue" d="M136 52 H212" marker-end="url(#ah-cw)" />
            <path class="dg-line rose dash" d="M136 60 H176 V128 H212" marker-end="url(#ah-cw2)" />
            <text class="dg-s" x="146" y="92">in flight…</text>
            <rect class="dg-box c" x="446" y="30" width="150" height="44" rx="7" />
            <text class="dg-s" x="521" y="49" text-anchor="middle">reader 1 sees</text>
            <text class="dg-t" x="521" y="65" text-anchor="middle">x = 2</text>
            <rect class="dg-box c" x="446" y="106" width="150" height="44" rx="7" />
            <text class="dg-s" x="521" y="125" text-anchor="middle">reader 2 sees</text>
            <text class="dg-t" x="521" y="141" text-anchor="middle">x = 1</text>
            <path class="dg-line blue" d="M366 52 H442" marker-end="url(#ah-cw)" />
            <path class="dg-line rose" d="M366 128 H442" marker-end="url(#ah-cw2)" />
            <rect class="dg-band y" x="12" y="168" width="696" height="60" rx="10" />
            <text class="dg-h" x="26" y="188">THE DESIGN QUESTION IS NOT “HOW DO I PREVENT THIS”</text>
            <text class="dg-s" x="26" y="208">You cannot prevent it — the gap is physics. The question is what you promise readers during that gap: block them until</text>
            <text class="dg-s" x="26" y="222">everyone agrees (slow but simple), or serve the stale value (fast but the application must tolerate it)?</text>
          </svg>
          <figcaption>Figure 5 — Two readers, same moment, different answers. Every consistency model is a different policy for what to do about this window.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cons-spectrum">The spectrum, strongest to weakest</h3>
        <p>Read this table top to bottom as "giving up guarantees in exchange for latency and availability".</p>
        <table>
          <thead><tr><th>Model</th><th>What it promises</th><th>Cost</th><th>Typical use</th></tr></thead>
          <tbody>
            <tr><td><strong>Linearizable</strong> (strong)</td><td>Every read returns the most recent write; the system behaves as if there were one copy</td><td>Highest latency; needs coordination on every operation; unavailable during partitions</td><td>Account balances, locks, leader election, inventory counts</td></tr>
            <tr><td><strong>Sequential</strong></td><td>All nodes see operations in the same order, but that order may lag real time</td><td>Still needs agreement on ordering</td><td>Replicated state machines</td></tr>
            <tr><td><strong>Causal</strong></td><td>Operations that are causally related appear in order everywhere; unrelated ones may differ</td><td>Must track causality (vector clocks, version vectors)</td><td>Comment threads, collaborative editing, chat</td></tr>
            <tr><td><strong>Eventual</strong></td><td>If writes stop, replicas converge — eventually. No ordering promise before that</td><td>Application must tolerate stale and out-of-order reads</td><td>View counts, likes, DNS, product catalogues</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="The consistency spectrum from linearizable to eventual, showing what each model allows and its latency cost">
            <defs>
              <marker id="ah-cs" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">STRONGER GUARANTEES ←→ LOWER LATENCY AND HIGHER AVAILABILITY</text>
            <rect class="dg-box r" x="16" y="34" width="164" height="72" rx="8" />
            <text class="dg-t" x="98" y="54" text-anchor="middle">LINEARIZABLE</text>
            <text class="dg-s" x="98" y="72" text-anchor="middle">one logical copy</text>
            <text class="dg-s" x="98" y="86" text-anchor="middle">reads never stale</text>
            <text class="dg-s" x="98" y="100" text-anchor="middle">slowest · needs quorum</text>
            <rect class="dg-box o" x="196" y="34" width="164" height="72" rx="8" />
            <text class="dg-t" x="278" y="54" text-anchor="middle">SEQUENTIAL</text>
            <text class="dg-s" x="278" y="72" text-anchor="middle">same order for all</text>
            <text class="dg-s" x="278" y="86" text-anchor="middle">may lag real time</text>
            <text class="dg-s" x="278" y="100" text-anchor="middle">still coordinated</text>
            <rect class="dg-box y" x="376" y="34" width="164" height="72" rx="8" />
            <text class="dg-t" x="458" y="54" text-anchor="middle">CAUSAL</text>
            <text class="dg-s" x="458" y="72" text-anchor="middle">cause before effect</text>
            <text class="dg-s" x="458" y="86" text-anchor="middle">unrelated may differ</text>
            <text class="dg-s" x="458" y="100" text-anchor="middle">tracks causality</text>
            <rect class="dg-box g" x="556" y="34" width="148" height="72" rx="8" />
            <text class="dg-t" x="630" y="54" text-anchor="middle">EVENTUAL</text>
            <text class="dg-s" x="630" y="72" text-anchor="middle">converges someday</text>
            <text class="dg-s" x="630" y="86" text-anchor="middle">any order allowed</text>
            <text class="dg-s" x="630" y="100" text-anchor="middle">fastest · always writable</text>
            <path class="dg-line violet thick" d="M16 122 H700" marker-end="url(#ah-cs)" />
            <text class="dg-s" x="16" y="140">coordination cost falls →</text>
            <text class="dg-s" x="470" y="140">→ anomalies the app must handle rise</text>
            <rect class="dg-band b" x="12" y="156" width="340" height="98" rx="10" />
            <text class="dg-h" x="26" y="176">THE ANOMALY EACH ONE ALLOWS</text>
            <text class="dg-s" x="26" y="196">linearizable · none</text>
            <text class="dg-s" x="26" y="212">sequential · you may read a slightly old world</text>
            <text class="dg-s" x="26" y="228">causal · unrelated events may look reordered</text>
            <text class="dg-s" x="26" y="242">eventual · a reply before the thing it replies to</text>
            <rect class="dg-band g" x="368" y="156" width="340" height="98" rx="10" />
            <text class="dg-h" x="382" y="176">HOW TO PICK, IN ONE QUESTION</text>
            <text class="dg-s" x="382" y="196">“If two users see different values for a second,</text>
            <text class="dg-s" x="382" y="212">does anyone lose money or get confused?”</text>
            <text class="dg-s" x="382" y="232">Money → linearizable. Confusion → causal.</text>
            <text class="dg-s" x="382" y="246">Nobody notices → eventual.</text>
          </svg>
          <figcaption>Figure 6 — The spectrum. Naming the middle two models is what separates a precise answer from "we'll use eventual consistency".</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cons-session">Session guarantees: the practical middle</h3>
        <p>Here is the thing that most tutorials skip and that most real products actually need. Global consistency is expensive, but users do not perceive global state — they perceive <em>their own</em> session. Four guarantees, scoped to one user, deliver most of the felt benefit of strong consistency at a fraction of the cost.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Four session guarantees: read your writes, monotonic reads, monotonic writes, and writes follow reads, each with the bug it prevents">
            <defs>
              <marker id="ah-sg" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">GUARANTEE → THE USER-VISIBLE BUG IT PREVENTS</text>
            <rect class="dg-box b" x="16" y="32" width="200" height="46" rx="7" />
            <text class="dg-t" x="116" y="52" text-anchor="middle">read your writes</text>
            <text class="dg-s" x="116" y="69" text-anchor="middle">you see your own changes</text>
            <rect class="dg-box r" x="272" y="32" width="432" height="46" rx="7" />
            <text class="dg-s" x="286" y="51">Without it: you post a comment, the page reloads from a lagging</text>
            <text class="dg-s" x="286" y="68">replica, your comment is gone, you post it again. Duplicate comments.</text>
            <path class="dg-line green" d="M216 55 H268" marker-end="url(#ah-sg)" />
            <rect class="dg-box b" x="16" y="88" width="200" height="46" rx="7" />
            <text class="dg-t" x="116" y="108" text-anchor="middle">monotonic reads</text>
            <text class="dg-s" x="116" y="125" text-anchor="middle">time never runs backwards</text>
            <rect class="dg-box r" x="272" y="88" width="432" height="46" rx="7" />
            <text class="dg-s" x="286" y="107">Without it: you refresh and see 12 replies, refresh again and see 9,</text>
            <text class="dg-s" x="286" y="124">because the second read hit a staler replica. Users think it is broken.</text>
            <path class="dg-line green" d="M216 111 H268" marker-end="url(#ah-sg)" />
            <rect class="dg-box b" x="16" y="144" width="200" height="46" rx="7" />
            <text class="dg-t" x="116" y="164" text-anchor="middle">monotonic writes</text>
            <text class="dg-s" x="116" y="181" text-anchor="middle">your writes stay in order</text>
            <rect class="dg-box r" x="272" y="144" width="432" height="46" rx="7" />
            <text class="dg-s" x="286" y="163">Without it: you rename a file then delete it, the operations land out of</text>
            <text class="dg-s" x="286" y="180">order, and the delete misses. The file comes back with the old name.</text>
            <path class="dg-line green" d="M216 167 H268" marker-end="url(#ah-sg)" />
            <rect class="dg-box b" x="16" y="200" width="200" height="46" rx="7" />
            <text class="dg-t" x="116" y="220" text-anchor="middle">writes follow reads</text>
            <text class="dg-s" x="116" y="237" text-anchor="middle">replies land after posts</text>
            <rect class="dg-box r" x="272" y="200" width="432" height="46" rx="7" />
            <text class="dg-s" x="286" y="219">Without it: your reply to a message is visible to others before the</text>
            <text class="dg-s" x="286" y="236">message it answers. Conversations read as nonsense.</text>
            <path class="dg-line green" d="M216 223 H268" marker-end="url(#ah-sg)" />
          </svg>
          <figcaption>Figure 7 — The four session guarantees. In an interview, "eventual consistency globally, with read-your-writes and monotonic reads for the author's own session" is a far stronger answer than either extreme.</figcaption>
        </figure>
        <p>The usual implementation is unglamorous and effective: pin a user's session to one replica, or have the client carry the version it last saw and let the server refuse to serve anything older.</p>

        <h3 class="lesson-subhead" id="cons-quorum">Tuning consistency with quorums</h3>
        <p>Consistency is not only chosen per system; it can be tuned per operation. With <code>N</code> replicas, a write acknowledged by <code>W</code> of them and a read that consults <code>R</code> of them, the useful inequality is:</p>
        <pre><code>W + R &gt; N   →  the read set and write set must overlap,
               so at least one replica in every read
               has seen the latest write

W + R ≤ N   →  the sets can miss each other entirely,
               so reads may return stale data</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 214" role="img" aria-label="Quorum configurations with five replicas showing strong, balanced, fast-write and fast-read setups">
            <defs>
              <marker id="ah-qm" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">N = 5 REPLICAS · FOUR WAYS TO SET W AND R</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="49">W=3, R=3 · 3+3&gt;5 ✓ overlapping · balanced, the common default. Survives 2 failures for both reads and writes.</text>
            <text class="dg-s" x="30" y="64">Use when you want strong reads without making either operation dramatically slower than the other.</text>
            <rect class="dg-box b" x="16" y="78" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="95">W=5, R=1 · 5+1&gt;5 ✓ overlapping · reads are instant from any replica; writes must reach every node.</text>
            <text class="dg-s" x="30" y="110">Use for read-heavy, rarely-written data: configuration, feature flags, reference tables.</text>
            <rect class="dg-box y" x="16" y="124" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="141">W=1, R=5 · 1+5&gt;5 ✓ overlapping · writes are instant; reads must consult everyone and pick the newest.</text>
            <text class="dg-s" x="30" y="156">Use for write-heavy ingestion where reads are rare — sensor data, event capture, audit trails.</text>
            <rect class="dg-box r" x="16" y="170" width="688" height="38" rx="7" />
            <text class="dg-s" x="30" y="187">W=1, R=1 · 1+1≤5 ✗ no overlap guaranteed · both operations are as fast as possible and reads may be stale.</text>
            <text class="dg-s" x="30" y="202">This is eventual consistency, chosen deliberately. Correct for view counters; wrong for a bank balance.</text>
          </svg>
          <figcaption>Figure 8 — Quorum tuning. Being able to say "N=5, W=3, R=3, so reads overlap writes and we tolerate two node failures" is exactly the level of precision senior interviews look for.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cons-cap">CAP, and the more useful PACELC</h3>
        <p><strong>CAP</strong> says that when the network partitions, a system must choose between consistency and availability. It is true and it is narrower than its fame suggests, because it only describes behaviour during a partition — a rare event.</p>
        <p><strong>PACELC</strong> extends it usefully: if there is a <em>P</em>artition, choose <em>A</em>vailability or <em>C</em>onsistency; <em>E</em>lse, in normal operation, choose <em>L</em>atency or <em>C</em>onsistency. That second clause is the one you live with every day.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 224" role="img" aria-label="PACELC decision tree covering behaviour during a partition and during normal operation">
            <defs>
              <marker id="ah-pc" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="272" y="20" width="176" height="34" rx="8" />
            <text class="dg-t" x="360" y="42" text-anchor="middle">Is the network partitioned?</text>
            <rect class="dg-box r" x="56" y="80" width="260" height="34" rx="7" />
            <text class="dg-s" x="186" y="102" text-anchor="middle">YES (rare) · pick A or C</text>
            <rect class="dg-box b" x="404" y="80" width="260" height="34" rx="7" />
            <text class="dg-s" x="534" y="102" text-anchor="middle">NO (almost always) · pick L or C</text>
            <path class="dg-line violet" d="M320 54 V70 H186 V76" marker-end="url(#ah-pc)" />
            <path class="dg-line violet" d="M400 54 V70 H534 V76" marker-end="url(#ah-pc)" />
            <rect class="dg-box y" x="20" y="132" width="140" height="46" rx="7" />
            <text class="dg-s" x="90" y="151" text-anchor="middle">stay available,</text>
            <text class="dg-s" x="90" y="167" text-anchor="middle">serve stale data</text>
            <rect class="dg-box c" x="176" y="132" width="140" height="46" rx="7" />
            <text class="dg-s" x="246" y="151" text-anchor="middle">refuse writes,</text>
            <text class="dg-s" x="246" y="167" text-anchor="middle">stay correct</text>
            <rect class="dg-box y" x="368" y="132" width="140" height="46" rx="7" />
            <text class="dg-s" x="438" y="151" text-anchor="middle">answer locally,</text>
            <text class="dg-s" x="438" y="167" text-anchor="middle">fast but maybe stale</text>
            <rect class="dg-box c" x="524" y="132" width="140" height="46" rx="7" />
            <text class="dg-s" x="594" y="151" text-anchor="middle">coordinate first,</text>
            <text class="dg-s" x="594" y="167" text-anchor="middle">correct but slower</text>
            <path class="dg-line violet" d="M120 114 V128" marker-end="url(#ah-pc)" />
            <path class="dg-line violet" d="M252 114 V128" marker-end="url(#ah-pc)" />
            <path class="dg-line violet" d="M468 114 V128" marker-end="url(#ah-pc)" />
            <path class="dg-line violet" d="M600 114 V128" marker-end="url(#ah-pc)" />
            <rect class="dg-band g" x="12" y="192" width="696" height="26" rx="8" />
            <text class="dg-s" x="26" y="209">The everyday trade-off is the right-hand branch. CAP gets quoted; PACELC's “else” clause is what actually shapes your latency.</text>
          </svg>
          <figcaption>Figure 9 — PACELC. Mentioning the "else latency-or-consistency" half signals you understand that partitions are the exception, not the design centre.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cons-choose">Choosing a model in an interview</h3>
        <p>Do not pick one model for the whole system. Pick per data type — that is what real systems do, and saying so demonstrates judgement.</p>
        <ul class="lesson-layers">
          <li><strong>Linearizable:</strong> money, inventory decrements, unique username claims, distributed locks, leader election. Anything where a double-spend or duplicate is unacceptable.</li>
          <li><strong>Causal:</strong> messages, comments, collaborative documents. Anywhere ordering is visible to humans in a conversation.</li>
          <li><strong>Eventual, plus session guarantees:</strong> feeds, profiles, search indexes, catalogues. Most of a typical product.</li>
          <li><strong>Eventual, no guarantees needed:</strong> view counts, like totals, recommendation scores, analytics.</li>
        </ul>
        <div class="lesson-callout"><strong>A sentence that works in almost any design interview.</strong> "Balances and inventory are linearizable through the primary; the feed and profile reads are eventually consistent from replicas, with read-your-writes for the author so they always see their own post; counters are approximate and I'll use sharded counters for them." That single sentence covers four data types and four models, and it lands better than any amount of CAP theory.</div>
      `,
    },
    {
      id: 'failure',
      title: 'The Spectrum of Failure Models',
      children: [
        { id: 'fail-chain', title: 'Fault, error, failure' },
        { id: 'fail-spectrum', title: 'The five failure models' },
        { id: 'fail-gray', title: 'Partial and gray failure: the ones that hurt' },
        { id: 'fail-detect', title: 'Detecting failure, and why it is impossible to do perfectly' },
        { id: 'fail-splitbrain', title: 'Split brain and fencing' },
      ],
      html: `
        <p>"The server failed" is not a useful sentence, because failure is not one condition. A machine that cleanly stops is a gift; a machine that stays up and returns wrong answers is a nightmare. Designs that survive the first can be destroyed by the second, so it pays to be precise about which kind you are defending against.</p>

        <h3 class="lesson-subhead" id="fail-chain">Fault, error, failure</h3>
        <p>Three words that get used interchangeably and should not be.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 190" role="img" aria-label="The chain from fault to error to failure, showing where fault tolerance interrupts it">
            <defs>
              <marker id="ah-fc" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-fc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="180" height="56" rx="8" />
            <text class="dg-t" x="106" y="60" text-anchor="middle">FAULT</text>
            <text class="dg-s" x="106" y="78" text-anchor="middle">a defect exists</text>
            <text class="dg-s" x="106" y="91" text-anchor="middle">bad disk, bug, cut cable</text>
            <rect class="dg-box o" x="266" y="40" width="180" height="56" rx="8" />
            <text class="dg-t" x="356" y="60" text-anchor="middle">ERROR</text>
            <text class="dg-s" x="356" y="78" text-anchor="middle">the defect is triggered</text>
            <text class="dg-s" x="356" y="91" text-anchor="middle">state is now wrong</text>
            <rect class="dg-box r" x="516" y="40" width="188" height="56" rx="8" />
            <text class="dg-t" x="610" y="60" text-anchor="middle">FAILURE</text>
            <text class="dg-s" x="610" y="78" text-anchor="middle">the user is affected</text>
            <text class="dg-s" x="610" y="91" text-anchor="middle">service misbehaves</text>
            <path class="dg-line rose" d="M196 68 H262" marker-end="url(#ah-fc)" />
            <path class="dg-line rose" d="M446 68 H512" marker-end="url(#ah-fc)" />
            <rect class="dg-box g" x="266" y="122" width="180" height="46" rx="8" />
            <text class="dg-t" x="356" y="142" text-anchor="middle">fault tolerance</text>
            <text class="dg-s" x="356" y="159" text-anchor="middle">breaks the chain here</text>
            <path class="dg-line green" d="M356 118 V100" marker-end="url(#ah-fc2)" />
            <text class="dg-s" x="470" y="134">Faults are inevitable at scale.</text>
            <text class="dg-s" x="470" y="150">Failures are optional — that is</text>
            <text class="dg-s" x="470" y="166">the entire job.</text>
          </svg>
          <figcaption>Figure 10 — The chain. You cannot prevent faults in a fleet of thousands of machines; you prevent them from becoming failures.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="fail-spectrum">The five failure models</h3>
        <p>Ordered from easiest to hardest to tolerate. Each row assumes everything above it is also possible.</p>
        <table>
          <thead><tr><th>Model</th><th>Behaviour</th><th>How you handle it</th><th>Difficulty</th></tr></thead>
          <tbody>
            <tr><td><strong>Fail-stop</strong></td><td>Halts, and everyone reliably learns that it halted</td><td>Failover to a replica</td><td>Easiest — mostly theoretical</td></tr>
            <tr><td><strong>Crash / fail-silent</strong></td><td>Halts without announcing it; others must infer</td><td>Timeouts, heartbeats, health checks</td><td>The usual working assumption</td></tr>
            <tr><td><strong>Omission</strong></td><td>Stays alive but drops some messages it sends or receives</td><td>Retries, acknowledgements, sequence numbers</td><td>Moderate</td></tr>
            <tr><td><strong>Timing</strong></td><td>Responds, but too late to be useful, or with skewed clocks</td><td>Deadlines, budgets, hedged requests, logical clocks</td><td>Hard — often worse than a crash</td></tr>
            <tr><td><strong>Byzantine</strong></td><td>Arbitrary behaviour: wrong data, inconsistent answers to different peers, possibly malicious</td><td>Cryptographic verification, BFT consensus, quorums of 3f+1</td><td>Hardest and most expensive</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 232" role="img" aria-label="Five failure models arranged from easiest to hardest with the design response to each">
            <defs>
              <marker id="ah-fm" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">EASIER TO TOLERATE ————————————————→ HARDER</text>
            <rect class="dg-box g" x="16" y="34" width="132" height="60" rx="7" />
            <text class="dg-t" x="82" y="53" text-anchor="middle">FAIL-STOP</text>
            <text class="dg-s" x="82" y="71" text-anchor="middle">stops, and says so</text>
            <text class="dg-s" x="82" y="85" text-anchor="middle">→ just fail over</text>
            <rect class="dg-box b" x="158" y="34" width="132" height="60" rx="7" />
            <text class="dg-t" x="224" y="53" text-anchor="middle">CRASH</text>
            <text class="dg-s" x="224" y="71" text-anchor="middle">stops silently</text>
            <text class="dg-s" x="224" y="85" text-anchor="middle">→ heartbeats</text>
            <rect class="dg-box c" x="300" y="34" width="132" height="60" rx="7" />
            <text class="dg-t" x="366" y="53" text-anchor="middle">OMISSION</text>
            <text class="dg-s" x="366" y="71" text-anchor="middle">drops messages</text>
            <text class="dg-s" x="366" y="85" text-anchor="middle">→ retry + ack</text>
            <rect class="dg-box y" x="442" y="34" width="132" height="60" rx="7" />
            <text class="dg-t" x="508" y="53" text-anchor="middle">TIMING</text>
            <text class="dg-s" x="508" y="71" text-anchor="middle">too slow, bad clocks</text>
            <text class="dg-s" x="508" y="85" text-anchor="middle">→ deadlines</text>
            <rect class="dg-box r" x="584" y="34" width="120" height="60" rx="7" />
            <text class="dg-t" x="644" y="53" text-anchor="middle">BYZANTINE</text>
            <text class="dg-s" x="644" y="71" text-anchor="middle">lies, arbitrarily</text>
            <text class="dg-s" x="644" y="85" text-anchor="middle">→ BFT, crypto</text>
            <path class="dg-line hot thick" d="M16 108 H700" marker-end="url(#ah-fm)" />
            <rect class="dg-band b" x="12" y="126" width="340" height="98" rx="10" />
            <text class="dg-h" x="26" y="146">WHAT TO ASSUME BY DEFAULT</text>
            <text class="dg-s" x="26" y="166">Most systems design for crash + omission + timing.</text>
            <text class="dg-s" x="26" y="184">Byzantine tolerance is reserved for cases with no</text>
            <text class="dg-s" x="26" y="198">trust between participants — blockchains, some</text>
            <text class="dg-s" x="26" y="212">aerospace and financial clearing systems.</text>
            <rect class="dg-band y" x="368" y="126" width="340" height="98" rx="10" />
            <text class="dg-h" x="382" y="146">WHY TIMING IS WORSE THAN CRASHING</text>
            <text class="dg-s" x="382" y="166">A dead node stops consuming resources and is</text>
            <text class="dg-s" x="382" y="180">removed from rotation. A very slow node keeps</text>
            <text class="dg-s" x="382" y="194">accepting work, holds connections open, and drags</text>
            <text class="dg-s" x="382" y="208">every caller's latency up with it. Killing a sick node</text>
            <text class="dg-s" x="382" y="222">is often better than letting it limp.</text>
          </svg>
          <figcaption>Figure 11 — The five models. The bottom-right panel is a genuinely non-obvious operational insight: a slow node can do more damage than a dead one.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="fail-gray">Partial and gray failure: the ones that hurt</h3>
        <p>Real incidents rarely look like a machine turning off. They look like this:</p>
        <ul class="lesson-layers">
          <li><strong>Partial failure.</strong> Some components work, others do not. Writes succeed while reads fail; one shard is down and nine are fine; one availability zone is unreachable from a second but both are reachable from a third.</li>
          <li><strong>Gray failure.</strong> The component is not down by any measure it reports about itself. Health checks pass, the process is alive, and yet it is serving 4% errors or 30× normal latency. Monitoring says green; users say broken.</li>
        </ul>
        <p>Gray failure is why health checks should exercise the real dependency path rather than returning a hardcoded 200, and why you alert on user-visible symptoms — error rate and latency percentiles — rather than only on process liveness. Chapters 13 to 15 build the monitoring for exactly this.</p>

        <h3 class="lesson-subhead" id="fail-detect">Detecting failure, and why it is impossible to do perfectly</h3>
        <p>There is a hard result underneath all of this. In an asynchronous network with no bound on message delay, <strong>you cannot distinguish a crashed node from a slow one</strong>. Not with a better timeout, not with a smarter algorithm — the information is not available.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="The timeout tuning dilemma between declaring healthy nodes dead and taking too long to notice real failures">
            <defs>
              <marker id="ah-to" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">EVERY FAILURE DETECTOR PICKS ITS POISON</text>
            <rect class="dg-band r" x="12" y="32" width="340" height="96" rx="10" />
            <text class="dg-h" x="26" y="52">SHORT TIMEOUT</text>
            <text class="dg-s" x="26" y="72">✓ notices real failures quickly</text>
            <text class="dg-s" x="26" y="90">✗ declares healthy-but-busy nodes dead</text>
            <text class="dg-s" x="26" y="108">✗ needless failovers, and under load this</text>
            <text class="dg-s" x="26" y="122">  cascades: each eviction loads the rest</text>
            <rect class="dg-band y" x="368" y="32" width="340" height="96" rx="10" />
            <text class="dg-h" x="382" y="52">LONG TIMEOUT</text>
            <text class="dg-s" x="382" y="72">✓ tolerates latency spikes calmly</text>
            <text class="dg-s" x="382" y="90">✗ real outages persist for the whole window</text>
            <text class="dg-s" x="382" y="108">✗ requests keep being routed into a</text>
            <text class="dg-s" x="382" y="122">  black hole until it expires</text>
            <rect class="dg-band g" x="12" y="142" width="696" height="78" rx="10" />
            <text class="dg-h" x="26" y="162">WHAT PRODUCTION SYSTEMS ACTUALLY DO</text>
            <text class="dg-s" x="26" y="182">· heartbeats plus adaptive detectors that learn the normal response-time distribution and output a suspicion</text>
            <text class="dg-s" x="26" y="196">  level rather than a yes/no verdict · several observers must agree before eviction, so one bad link cannot evict a node</text>
            <text class="dg-s" x="26" y="212">· and critically: assume the “dead” node might still be alive and acting, which is what fencing below is for</text>
          </svg>
          <figcaption>Figure 12 — The timeout dilemma. There is no correct value, only a choice about which failure mode you prefer.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="fail-splitbrain">Split brain and fencing</h3>
        <p>The nastiest consequence of imperfect detection: a primary is declared dead and a new one is promoted, but the old primary was only slow. Now two nodes both believe they are the leader, both accept writes, and the data diverges. This is <strong>split brain</strong>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 248" role="img" aria-label="Split brain scenario where an old primary keeps writing after a new one is promoted, and how fencing tokens prevent it">
            <defs>
              <marker id="ah-sb" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-sb2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE PROBLEM</text>
            <rect class="dg-box y" x="16" y="32" width="152" height="44" rx="7" />
            <text class="dg-s" x="92" y="51" text-anchor="middle">primary A is slow,</text>
            <text class="dg-s" x="92" y="66" text-anchor="middle">not dead</text>
            <rect class="dg-box b" x="208" y="32" width="152" height="44" rx="7" />
            <text class="dg-s" x="284" y="51" text-anchor="middle">cluster declares it</text>
            <text class="dg-s" x="284" y="66" text-anchor="middle">dead, promotes B</text>
            <rect class="dg-box r" x="400" y="32" width="152" height="44" rx="7" />
            <text class="dg-s" x="476" y="51" text-anchor="middle">A recovers and keeps</text>
            <text class="dg-s" x="476" y="66" text-anchor="middle">writing — it never knew</text>
            <rect class="dg-box r" x="576" y="32" width="128" height="44" rx="7" />
            <text class="dg-t" x="640" y="51" text-anchor="middle">two primaries</text>
            <text class="dg-s" x="640" y="66" text-anchor="middle">data diverges</text>
            <path class="dg-line rose" d="M168 54 H204" marker-end="url(#ah-sb)" />
            <path class="dg-line rose" d="M360 54 H396" marker-end="url(#ah-sb)" />
            <path class="dg-line rose" d="M552 54 H572" marker-end="url(#ah-sb)" />
            <text class="dg-h" x="16" y="106">THE FIX · FENCING TOKENS</text>
            <rect class="dg-box g" x="16" y="116" width="212" height="52" rx="7" />
            <text class="dg-s" x="122" y="136" text-anchor="middle">every leadership term gets a</text>
            <text class="dg-s" x="122" y="152" text-anchor="middle">monotonically increasing number</text>
            <rect class="dg-box g" x="268" y="116" width="212" height="52" rx="7" />
            <text class="dg-s" x="374" y="136" text-anchor="middle">A holds token 7,</text>
            <text class="dg-s" x="374" y="152" text-anchor="middle">B is promoted with token 8</text>
            <rect class="dg-box p" x="520" y="116" width="184" height="52" rx="7" />
            <text class="dg-s" x="612" y="136" text-anchor="middle">storage rejects any write</text>
            <text class="dg-s" x="612" y="152" text-anchor="middle">with a token below 8</text>
            <path class="dg-line green" d="M228 142 H264" marker-end="url(#ah-sb2)" />
            <path class="dg-line green" d="M480 142 H516" marker-end="url(#ah-sb2)" />
            <rect class="dg-band g" x="12" y="184" width="696" height="58" rx="10" />
            <text class="dg-s" x="26" y="204">A's write with token 7 is now refused by the storage layer itself, so it does not matter that A is confused about its own</text>
            <text class="dg-s" x="26" y="220">status. The safety property no longer depends on failure detection being correct — which is the only robust way to build it,</text>
            <text class="dg-s" x="26" y="236">since we established above that failure detection cannot be made correct.</text>
          </svg>
          <figcaption>Figure 13 — Split brain and fencing. The general principle is worth more than the specific mechanism: never let correctness depend on a distributed agreement about who is alive.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> You should now be able to answer three questions without hesitating. Why can a client never learn whether a timed-out write was applied? What is the difference between causal and eventual consistency, and which does a comment thread need? Why does promoting a new leader require fencing rather than just a health check? If any of those is shaky, reread that section before Chapter 4 — the non-functional characteristics chapter assumes all three.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. This chapter covers standard distributed systems concepts — remote procedure calls, the fallacies of distributed computing, consistency models and failure models — that are documented across the academic and industry literature. All explanations, analogies, diagrams, tables and exercises are our own.',
};
