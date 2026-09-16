/** Modern System Design — Chapter 6: Introduction to Building Blocks.
 *  The reusable components every design is assembled from, the conventions
 *  used for the rest of the course, and how to reason about which blocks a
 *  problem actually needs.
 */

export const msdBuildingBlocks = {
  slug: 'building-blocks',
  title: 'Introduction to Building Blocks for Modern System Design',
  subtitle:
    'Almost every large system is assembled from the same short list of reusable components. Learn the list once, understand what each one is for and what it costs, and design problems stop being fifty things to memorise and become combinations of sixteen things you know.',
  byline: 'Modern System Design · Chapter 6 · ~40 min read · Beginner',
  interviewTip:
    'The tell of an inexperienced candidate is reaching for components because they sound impressive. The tell of an experienced one is justifying each block from a requirement and being willing to leave blocks out. "I am not adding a message queue because every operation here needs a synchronous answer" is a stronger sentence than adding one and hoping nobody asks why.',
  sections: [
    {
      id: 'blocks',
      title: 'Introduction to Building Blocks for Modern System Design',
      children: [
        { id: 'bb-why', title: 'Why think in building blocks' },
        { id: 'bb-list', title: 'The sixteen blocks' },
        { id: 'bb-layers', title: 'How they compose: the request path' },
        { id: 'bb-which', title: 'Which blocks does this problem need?' },
        { id: 'bb-cost', title: 'Every block has a cost' },
        { id: 'bb-conventions', title: 'Conventions for the rest of this course' },
        { id: 'bb-order', title: 'The order ahead, and why' },
      ],
      html: `
        <p>If you approach system design as a catalogue of architectures to memorise — one for a chat app, one for a video site, one for a ride-hailing service — the subject is effectively infinite and you will always be one unfamiliar prompt away from being stuck.</p>
        <p>The alternative is to notice that these architectures are made of the same parts. A feed, a map service and a payment system look nothing alike as products and share most of their components: something to balance load, something to cache, something to store blobs, something to queue work, something to watch it all. Learn the parts and their trade-offs, and a novel problem becomes an exercise in selection rather than recall.</p>

        <h3 class="lesson-subhead" id="bb-why">Why think in building blocks</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Contrast between memorising whole architectures and composing designs from reusable building blocks">
            <defs>
              <marker id="ah-bb" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="186" rx="11" />
            <text class="dg-h" x="26" y="36">MEMORISING ARCHITECTURES</text>
            <rect class="dg-box r" x="26" y="46" width="96" height="24" rx="5" />
            <text class="dg-s" x="74" y="62" text-anchor="middle">“design YouTube”</text>
            <rect class="dg-box r" x="130" y="46" width="96" height="24" rx="5" />
            <text class="dg-s" x="178" y="62" text-anchor="middle">“design Uber”</text>
            <rect class="dg-box r" x="234" y="46" width="108" height="24" rx="5" />
            <text class="dg-s" x="288" y="62" text-anchor="middle">“design WhatsApp”</text>
            <text class="dg-s" x="26" y="90">Each one is a separate thing to remember.</text>
            <text class="dg-s" x="26" y="108">Fifty prompts means fifty memorised answers,</text>
            <text class="dg-s" x="26" y="122">and none of them transfer.</text>
            <text class="dg-s" x="26" y="146">✗ an unfamiliar prompt leaves you blank</text>
            <text class="dg-s" x="26" y="164">✗ you cannot justify choices, only recite them</text>
            <text class="dg-s" x="26" y="182">✗ follow-up questions expose the gap fast</text>

            <rect class="dg-band g" x="368" y="16" width="340" height="186" rx="11" />
            <text class="dg-h" x="382" y="36">COMPOSING FROM BLOCKS</text>
            <rect class="dg-box g" x="382" y="46" width="72" height="24" rx="5" />
            <text class="dg-s" x="418" y="62" text-anchor="middle">cache</text>
            <rect class="dg-box b" x="462" y="46" width="72" height="24" rx="5" />
            <text class="dg-s" x="498" y="62" text-anchor="middle">queue</text>
            <rect class="dg-box c" x="542" y="46" width="72" height="24" rx="5" />
            <text class="dg-s" x="578" y="62" text-anchor="middle">blob store</text>
            <rect class="dg-box y" x="622" y="46" width="72" height="24" rx="5" />
            <text class="dg-s" x="658" y="62" text-anchor="middle">CDN</text>
            <text class="dg-s" x="382" y="90">Sixteen components, each understood once,</text>
            <text class="dg-s" x="382" y="108">recombine into any of those fifty problems</text>
            <text class="dg-s" x="382" y="122">— and into ones nobody has asked yet.</text>
            <text class="dg-s" x="382" y="146">✓ novel prompts are just new combinations</text>
            <text class="dg-s" x="382" y="164">✓ you can justify and defend every choice</text>
            <text class="dg-s" x="382" y="182">✓ follow-ups become easy, because you know</text>
            <text class="dg-s" x="382" y="196">  what each block costs</text>
            <path class="dg-line green" d="M356 110 H364" marker-end="url(#ah-bb)" />
          </svg>
          <figcaption>Figure 1 — Recall versus composition. The right-hand approach is also how practitioners actually think, which is why interviewers reward it.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bb-list">The sixteen blocks</h3>
        <p>Each of these gets its own chapter. Read this table now for orientation — you are not expected to understand the details yet, only to see the shape of what is coming and what problem each block exists to solve.</p>
        <table>
          <thead><tr><th>#</th><th>Building block</th><th>The problem it solves</th><th>Chapter</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>DNS</strong></td><td>Turning a human-readable name into an address, and steering users to the right place</td><td>7</td></tr>
            <tr><td>2</td><td><strong>Load balancer</strong></td><td>Spreading traffic across many servers and routing around dead ones</td><td>8</td></tr>
            <tr><td>3</td><td><strong>Database</strong></td><td>Storing data durably with queries, replication and partitioning</td><td>9</td></tr>
            <tr><td>4</td><td><strong>Key-value store</strong></td><td>Fast lookups by key at enormous scale, with tunable consistency</td><td>10</td></tr>
            <tr><td>5</td><td><strong>CDN</strong></td><td>Serving bytes from physically near the user, and absorbing bandwidth</td><td>11</td></tr>
            <tr><td>6</td><td><strong>Sequencer</strong></td><td>Generating unique IDs across many machines, sometimes ordered</td><td>12</td></tr>
            <tr><td>7</td><td><strong>Distributed monitoring</strong></td><td>Knowing what your system is doing right now, and being told when it changes</td><td>13–15</td></tr>
            <tr><td>8</td><td><strong>Distributed cache</strong></td><td>Keeping hot data in memory to cut latency and shield the database</td><td>16</td></tr>
            <tr><td>9</td><td><strong>Messaging queue</strong></td><td>Decoupling producers from consumers and absorbing spikes</td><td>17</td></tr>
            <tr><td>10</td><td><strong>Pub-sub</strong></td><td>Broadcasting one event to many independent interested parties</td><td>18</td></tr>
            <tr><td>11</td><td><strong>Rate limiter</strong></td><td>Protecting the system from abuse, runaway clients and overload</td><td>19</td></tr>
            <tr><td>12</td><td><strong>Blob store</strong></td><td>Storing large immutable objects — images, video, backups — cheaply</td><td>20</td></tr>
            <tr><td>13</td><td><strong>Distributed search</strong></td><td>Finding things by content rather than by key</td><td>21</td></tr>
            <tr><td>14</td><td><strong>Distributed logging</strong></td><td>Collecting events from everywhere so failures can be reconstructed</td><td>22</td></tr>
            <tr><td>15</td><td><strong>Task scheduler</strong></td><td>Running work later, repeatedly, or in dependency order</td><td>23</td></tr>
            <tr><td>16</td><td><strong>Sharded counters</strong></td><td>Counting very fast things without creating a single hot row</td><td>24</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="bb-layers">How they compose: the request path</h3>
        <p>The blocks are not a flat list — they occupy positions in a request's journey. This diagram is worth returning to as you work through the course, because almost every design in Chapters 25 onwards is a variation of it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 330" role="img" aria-label="The canonical request path from client through DNS, CDN, load balancer, services, cache and storage, with asynchronous and observability planes">
            <defs>
              <marker id="ah-pt" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-pt2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-pt3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="20">THE SYNCHRONOUS PATH · THE USER IS WAITING FOR ALL OF THIS</text>
            <rect class="dg-box" x="16" y="30" width="92" height="34" rx="7" />
            <text class="dg-s" x="62" y="51" text-anchor="middle">client</text>
            <rect class="dg-box c" x="124" y="30" width="82" height="34" rx="7" />
            <text class="dg-s" x="165" y="51" text-anchor="middle">DNS</text>
            <rect class="dg-box y" x="222" y="30" width="82" height="34" rx="7" />
            <text class="dg-s" x="263" y="51" text-anchor="middle">CDN</text>
            <rect class="dg-box b" x="320" y="30" width="110" height="34" rx="7" />
            <text class="dg-s" x="375" y="51" text-anchor="middle">load balancer</text>
            <rect class="dg-box r" x="446" y="30" width="96" height="34" rx="7" />
            <text class="dg-s" x="494" y="51" text-anchor="middle">rate limiter</text>
            <rect class="dg-box p" x="558" y="30" width="146" height="34" rx="7" />
            <text class="dg-s" x="631" y="51" text-anchor="middle">application services</text>
            <path class="dg-line blue" d="M108 47 H120" marker-end="url(#ah-pt)" />
            <path class="dg-line blue" d="M206 47 H218" marker-end="url(#ah-pt)" />
            <path class="dg-line blue" d="M304 47 H316" marker-end="url(#ah-pt)" />
            <path class="dg-line blue" d="M430 47 H442" marker-end="url(#ah-pt)" />
            <path class="dg-line blue" d="M542 47 H554" marker-end="url(#ah-pt)" />

            <text class="dg-h" x="16" y="94">THE DATA LAYER · CHECK MEMORY BEFORE DISK, ALWAYS</text>
            <rect class="dg-box g" x="124" y="104" width="128" height="40" rx="7" />
            <text class="dg-s" x="188" y="121" text-anchor="middle">distributed cache</text>
            <text class="dg-s" x="188" y="136" text-anchor="middle">~100 µs</text>
            <rect class="dg-box b" x="272" y="104" width="128" height="40" rx="7" />
            <text class="dg-s" x="336" y="121" text-anchor="middle">database</text>
            <text class="dg-s" x="336" y="136" text-anchor="middle">~1–10 ms</text>
            <rect class="dg-box c" x="420" y="104" width="128" height="40" rx="7" />
            <text class="dg-s" x="484" y="121" text-anchor="middle">key-value store</text>
            <text class="dg-s" x="484" y="136" text-anchor="middle">~1 ms</text>
            <rect class="dg-box y" x="568" y="104" width="136" height="40" rx="7" />
            <text class="dg-s" x="636" y="121" text-anchor="middle">blob store</text>
            <text class="dg-s" x="636" y="136" text-anchor="middle">large objects</text>
            <path class="dg-line blue" d="M631 64 V80 H188 V100" marker-end="url(#ah-pt)" />
            <path class="dg-line blue dash" d="M252 124 H268" marker-end="url(#ah-pt)" />
            <text class="dg-s" x="16" y="164">On a cache miss, fall through to the store behind it — and populate the cache on the way back.</text>

            <text class="dg-h" x="16" y="196">THE ASYNCHRONOUS PLANE · THE USER IS NOT WAITING</text>
            <rect class="dg-box o" x="124" y="206" width="122" height="40" rx="7" />
            <text class="dg-s" x="185" y="223" text-anchor="middle">messaging queue</text>
            <text class="dg-s" x="185" y="238" text-anchor="middle">work handed off</text>
            <rect class="dg-box o" x="266" y="206" width="122" height="40" rx="7" />
            <text class="dg-s" x="327" y="223" text-anchor="middle">pub-sub</text>
            <text class="dg-s" x="327" y="238" text-anchor="middle">fan out events</text>
            <rect class="dg-box o" x="408" y="206" width="122" height="40" rx="7" />
            <text class="dg-s" x="469" y="223" text-anchor="middle">task scheduler</text>
            <text class="dg-s" x="469" y="238" text-anchor="middle">later / recurring</text>
            <rect class="dg-box p" x="550" y="206" width="154" height="40" rx="7" />
            <text class="dg-s" x="627" y="223" text-anchor="middle">workers</text>
            <text class="dg-s" x="627" y="238" text-anchor="middle">transcode, index, email</text>
            <path class="dg-line hot" d="M631 64 H700 V90 H108 V226 H120" marker-end="url(#ah-pt2)" />
            <path class="dg-line hot" d="M530 226 H546" marker-end="url(#ah-pt2)" />

            <text class="dg-h" x="16" y="278">THE OBSERVABILITY PLANE · WRAPS EVERYTHING ABOVE</text>
            <rect class="dg-box g" x="124" y="288" width="176" height="34" rx="7" />
            <text class="dg-s" x="212" y="309" text-anchor="middle">monitoring + metrics</text>
            <rect class="dg-box g" x="320" y="288" width="176" height="34" rx="7" />
            <text class="dg-s" x="408" y="309" text-anchor="middle">distributed logging</text>
            <rect class="dg-box g" x="516" y="288" width="188" height="34" rx="7" />
            <text class="dg-s" x="610" y="309" text-anchor="middle">tracing + alerting</text>
            <path class="dg-line green dash" d="M108 305 H120" marker-end="url(#ah-pt3)" />
          </svg>
          <figcaption>Figure 2 — The canonical request path in three planes. Recognising which plane a requirement belongs to is most of the skill: anything the user need not wait for belongs on the middle plane.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bb-which">Which blocks does this problem need?</h3>
        <p>Selection should be driven by requirements, never by habit. Each of these triggers is a sentence you might hear in a prompt, and the block it should make you reach for.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Requirement triggers mapped to the building block each one implies">
            <defs>
              <marker id="ah-tr" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">IF YOU HEAR THIS → REACH FOR THIS</text>
            <rect class="dg-box b" x="16" y="32" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="50">“the same data is read far more than written”</text>
            <rect class="dg-box g" x="392" y="32" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="50">cache · read replicas · precomputation</text>
            <rect class="dg-box b" x="16" y="64" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="82">“users are all over the world”</text>
            <rect class="dg-box g" x="392" y="64" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="82">CDN · regional replicas · geo-DNS</text>
            <rect class="dg-box b" x="16" y="96" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="114">“this step takes seconds and can happen later”</text>
            <rect class="dg-box g" x="392" y="96" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="114">messaging queue · workers · task scheduler</text>
            <rect class="dg-box b" x="16" y="128" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="146">“one event must notify several systems”</text>
            <rect class="dg-box g" x="392" y="128" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="146">pub-sub</text>
            <rect class="dg-box b" x="16" y="160" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="178">“we store photos, video, or backups”</text>
            <rect class="dg-box g" x="392" y="160" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="178">blob store (+ CDN in front of it)</text>
            <rect class="dg-box b" x="16" y="192" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="210">“users search by text, not by ID”</text>
            <rect class="dg-box g" x="392" y="192" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="210">distributed search with an inverted index</text>
            <rect class="dg-box b" x="16" y="224" width="330" height="26" rx="5" />
            <text class="dg-s" x="30" y="242">“clients might hammer us, deliberately or not”</text>
            <rect class="dg-box g" x="392" y="224" width="312" height="26" rx="5" />
            <text class="dg-s" x="406" y="242">rate limiter · quotas · load shedding</text>
            <path class="dg-line violet" d="M346 45 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 77 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 109 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 141 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 173 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 205 H388" marker-end="url(#ah-tr)" />
            <path class="dg-line violet" d="M346 237 H388" marker-end="url(#ah-tr)" />
          </svg>
          <figcaption>Figure 3 — Triggers and their blocks. In an interview, saying the trigger out loud before naming the block ("reads dominate 100 to 1, so I want a cache here") is what makes the choice look reasoned rather than reflexive.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bb-cost">Every block has a cost</h3>
        <p>This is the half of the subject that beginners skip. Adding a component always buys something and always charges for it, and the charge is usually paid in consistency, operational burden or new failure modes.</p>
        <table>
          <thead><tr><th>Block</th><th>What it buys</th><th>What it charges you</th></tr></thead>
          <tbody>
            <tr><td>Cache</td><td>Large latency reduction, database protection</td><td>Stale reads, invalidation logic, a cold-start thundering herd, one more thing to run</td></tr>
            <tr><td>Replication</td><td>Availability and read capacity</td><td>Replication lag and the whole consistency spectrum from Chapter 3</td></tr>
            <tr><td>Partitioning</td><td>Write throughput and unbounded storage</td><td>Cross-partition queries get hard; hot keys; rebalancing; no easy transactions</td></tr>
            <tr><td>Message queue</td><td>Decoupling, spike absorption, retries</td><td>Eventual processing, duplicate delivery, ordering questions, backlog monitoring</td></tr>
            <tr><td>CDN</td><td>Global latency and bandwidth relief</td><td>Cache invalidation at the edge, cost, harder debugging</td></tr>
            <tr><td>Microservices</td><td>Independent teams and deploys</td><td>Network calls where function calls used to be — reread Chapter 3's failure list</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>The habit to build now.</strong> Every time you add a box to a diagram, say what it costs in the same breath. "I'll put a cache in front of the profile service — that gives us sub-millisecond reads, and it means a profile edit can take up to 30 seconds to appear, which I think is acceptable here." That sentence pattern, repeated, is most of what separates a senior-sounding answer from a junior one.</div>

        <h3 class="lesson-subhead" id="bb-conventions">Conventions for the rest of this course</h3>
        <p>Every building-block chapter from here follows the same shape, so you always know where you are:</p>
        <ol class="lesson-layers">
          <li><strong>The problem</strong> — what breaks without this block, stated concretely.</li>
          <li><strong>Requirements</strong> — functional first, then the non-functional targets from Chapter 4.</li>
          <li><strong>Estimation</strong> — the Chapter 5 arithmetic that constrains the design.</li>
          <li><strong>Design</strong> — a high-level architecture, then progressive detail.</li>
          <li><strong>Evaluation</strong> — does it meet the requirements, and where does it still fall short?</li>
        </ol>
        <p>That final step is deliberate and unusual. A design you cannot criticise is a design you do not understand, and interviewers specifically probe whether you can name your own design's weaknesses before they do.</p>
        <p>Two notational conventions used throughout: diagrams read left to right for the request path and top to bottom for layers, with dashed lines marking asynchronous or optional paths. And numbers are always rounded to one significant figure, per Chapter 5.</p>

        <h3 class="lesson-subhead" id="bb-order">The order ahead, and why</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="Course phases from foundations through building blocks to design problems and modern AI systems">
            <defs>
              <marker id="ah-or" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="34" width="160" height="62" rx="8" />
            <text class="dg-t" x="96" y="54" text-anchor="middle">FOUNDATIONS</text>
            <text class="dg-s" x="96" y="72" text-anchor="middle">Ch 1–5 · done</text>
            <text class="dg-s" x="96" y="88" text-anchor="middle">vocabulary and numbers</text>
            <rect class="dg-box b" x="196" y="34" width="160" height="62" rx="8" />
            <text class="dg-t" x="276" y="54" text-anchor="middle">BUILDING BLOCKS</text>
            <text class="dg-s" x="276" y="72" text-anchor="middle">Ch 6–24 · next</text>
            <text class="dg-s" x="276" y="88" text-anchor="middle">the reusable parts</text>
            <rect class="dg-box y" x="376" y="34" width="160" height="62" rx="8" />
            <text class="dg-t" x="456" y="54" text-anchor="middle">DESIGN PROBLEMS</text>
            <text class="dg-s" x="456" y="72" text-anchor="middle">Ch 25–39</text>
            <text class="dg-s" x="456" y="88" text-anchor="middle">assembling the parts</text>
            <rect class="dg-box p" x="556" y="34" width="148" height="62" rx="8" />
            <text class="dg-t" x="630" y="54" text-anchor="middle">AI-ERA SYSTEMS</text>
            <text class="dg-s" x="630" y="72" text-anchor="middle">Ch 40–44</text>
            <text class="dg-s" x="630" y="88" text-anchor="middle">what is new</text>
            <path class="dg-line violet" d="M176 65 H192" marker-end="url(#ah-or)" />
            <path class="dg-line violet" d="M356 65 H372" marker-end="url(#ah-or)" />
            <path class="dg-line violet" d="M536 65 H552" marker-end="url(#ah-or)" />
            <rect class="dg-band b" x="12" y="112" width="696" height="120" rx="10" />
            <text class="dg-h" x="26" y="132">WHY THIS ORDER AND NOT ANOTHER</text>
            <text class="dg-s" x="26" y="154">Blocks come before problems because every problem uses several blocks. Designing YouTube before you understand blob</text>
            <text class="dg-s" x="26" y="170">stores and CDNs means memorising an answer instead of deriving one.</text>
            <text class="dg-s" x="26" y="192">Within the blocks, the order follows the request path — DNS, load balancer, database, cache — so each chapter sits next to</text>
            <text class="dg-s" x="26" y="208">the one it talks to. The AI-era chapters come last because they are ordinary distributed systems with unusual constraints:</text>
            <text class="dg-s" x="26" y="224">expensive stateless compute, large models to load, and non-deterministic output. They need everything before them.</text>
          </svg>
          <figcaption>Figure 4 — The four phases. You are at the start of phase two, and the foundations you now have are exactly what the next nineteen chapters assume.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Before you continue.</strong> Chapter 7 begins the blocks with DNS. If any of these is still fuzzy, it is worth ten minutes now rather than confusion later: what a timeout does and does not tell you (Ch 3), what an error budget is for (Ch 4), and how many seconds are in a day (Ch 5). Everything ahead leans on those three.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. The set of building blocks reflects the standard vocabulary of modern distributed systems as taught across the industry; all framing, explanations, trade-off tables, diagrams and conventions here are our own.',
};
