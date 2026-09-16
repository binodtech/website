/** Modern System Design — Chapter 12: Sequencer.
 *  Auto-increment fails across machines; UUID versus Snowflake; clock skew;
 *  worker bits; opaque public IDs; causality versus sortability.
 */

export const msdSequencer = {
  slug: 'sequencer',
  title: 'Sequencer: Unique ID Generation',
  subtitle:
    'A unique ID on one machine is an incrementing integer. A unique ID across many machines is a distributed-systems problem: uniqueness without a single counter, optional sortability, and the uncomfortable relationship between timestamps and causality.',
  byline: 'Modern System Design · Chapter 12 · ~1h 25m read · Intermediate',
  interviewTip:
    'Name the properties you actually need before naming Snowflake. "I need uniqueness and roughly time-ordered IDs so database inserts land at the end of a B-tree; I do not need them to establish happened-before, so a timestamp-prefixed ID with a worker and sequence number is enough; I will keep an opaque random ID for anything I expose in a URL." Candidates who jump to UUID or Snowflake without the requirements get asked "why not a database auto-increment" and stall.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Sequencer',
      children: [
        { id: 'seq-why', title: 'Why auto-increment fails' },
        { id: 'seq-req', title: 'Requirements, as a menu' },
        { id: 'seq-est', title: 'How big is the ID space' },
      ],
      html: `
        <h3 class="lesson-subhead" id="seq-why">Why auto-increment fails</h3>
        <p>On one machine, <code>id = ++counter</code> is unique, monotonic, compact, and trivial. The moment two machines issue IDs, that line of code is a bug: they will both issue 47. Coordinating a single counter across machines — a database sequence, a Redis <code>INCR</code> — restores uniqueness and reintroduces a single point of failure and a throughput ceiling. At a million IDs per second, that ceiling is real: every mint is a network round trip to a hot key.</p>
        <p>So the sequencer problem is: mint unique identifiers, at high rate, across many nodes, without a hot central counter, with whatever extra properties (sortability, opacity, causality) the product actually needs.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Two machines both issuing 47 versus local Snowflake minting">
            <defs>
              <marker id="ah-sq0" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">TWO LOCAL ++</text>
            <text class="dg-s" x="26" y="58">node A issues 47</text>
            <text class="dg-s" x="26" y="76">node B issues 47</text>
            <text class="dg-s" x="26" y="94">duplicate primary keys</text>
            <text class="dg-s" x="26" y="112">cluster size does not help</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">LOCAL COMPOSITE</text>
            <text class="dg-s" x="382" y="58">time + worker + seq</text>
            <text class="dg-s" x="382" y="76">unique if workers unique</text>
            <text class="dg-s" x="382" y="94">no hot INCR on the path</text>
            <text class="dg-s" x="382" y="112">clocks become the risk</text>
          </svg>
          <figcaption>Figure 1 — Auto-increment does not become distributed by adding machines. It becomes a duplicate factory.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="seq-req">Requirements, as a menu</h3>
        <p>Do not take all of these. Pick, because they fight each other.</p>
        <table>
          <thead><tr><th>Property</th><th>Why you might want it</th><th>What it costs</th></tr></thead>
          <tbody>
            <tr><td>Uniqueness</td><td>Two rows with the same ID is corruption</td><td>Everything if you skip it</td></tr>
            <tr><td>High rate</td><td>1M/sec is a reasonable interview target</td><td>Rules out a single DB sequence</td></tr>
            <tr><td>Low latency</td><td>ID minting is on the write path</td><td>Rules out a network RTT per ID</td></tr>
            <tr><td>Compact</td><td>64-bit IDs index and join cheaply</td><td>Less room for time + worker + seq</td></tr>
            <tr><td>Time-sortable</td><td>Inserts append to a B-tree</td><td>Clock dependence; leaks create time</td></tr>
            <tr><td>Causality</td><td>If A happened-before B, ID(A) &lt; ID(B)</td><td>Timestamps cannot do this</td></tr>
            <tr><td>Opacity</td><td>URLs should not leak volume or enumerate</td><td>Conflicts with sequential public IDs</td></tr>
          </tbody>
        </table>
        <p>The usual split: an internal 64-bit time-sortable ID for storage and joins, and a separate opaque external ID (random, or a permutation) for anything a user sees. TinyURL in <a href="/learn/modern-system-design/tinyurl">Chapter 32</a> is this split in miniature.</p>
        <p>Auto-increment also leaks volume: <code>/orders/184320</code> told a competitor how many orders you have. It invites enumeration. Even if uniqueness were free at a million QPS, opacity would still push you off a public integer. That is why this chapter is not only a throughput story.</p>

        <h3 class="lesson-subhead" id="seq-est">How big is the ID space</h3>
        <pre><code>64-bit unsigned:  1.8 × 10^19  IDs
  at 1M IDs/sec:    ~584,000 years to exhaust. Fine.

Snowflake-style layout (typical):
  1 bit  sign (kept 0 so the ID is a positive signed int64)
 41 bits milliseconds since a custom epoch
          2^41 ms ≈ 69.7 years
 10 bits worker ID → 1,024 workers
 12 bits sequence  → 4,096 IDs per worker per millisecond
                   → 4M IDs/sec per worker, 4B/sec fleet-wide

UUIDv4 (122 random bits): collision risk is negligible until
  you are in "every atom on the planet" territory. The cost is
  128 bits, randomness (index-unfriendly), and no ordering.</code></pre>
      `,
    },
    {
      id: 'generator',
      title: 'Design of a Unique ID Generator',
      children: [
        { id: 'seq-options', title: 'UUID versus Snowflake versus tickets' },
        { id: 'seq-snowflake', title: 'Snowflake-style, bit by bit' },
        { id: 'seq-worker', title: 'Assigning worker IDs safely' },
        { id: 'seq-clocks', title: 'The clock-skew problem' },
        { id: 'seq-opaque', title: 'Opacity of public IDs' },
      ],
      html: `
        <h3 class="lesson-subhead" id="seq-options">UUID versus Snowflake versus tickets</h3>
        <table>
          <thead><tr><th>Approach</th><th>Unique?</th><th>Sortable?</th><th>Rate</th><th>Failure mode</th></tr></thead>
          <tbody>
            <tr><td>DB auto-increment</td><td>Yes</td><td>Yes</td><td>Limited by the primary</td><td>SPOF and a bottleneck</td></tr>
            <tr><td>Ticket server (Flickr ranges)</td><td>Yes</td><td>Yes, roughly</td><td>High (mint a block)</td><td>Lost blocks; ticket HA still required</td></tr>
            <tr><td>UUIDv4</td><td>Yes, probabilistically</td><td>No</td><td>Unlimited, local</td><td>Index fragmentation; 128 bits</td></tr>
            <tr><td>UUIDv7 / ULID</td><td>Yes, probabilistically</td><td>Time-sortable</td><td>Unlimited, local</td><td>128 bits; clock dependence</td></tr>
            <tr><td>Snowflake-style</td><td>Yes, if workers unique</td><td>Time-sortable</td><td>Very high, local</td><td>Duplicate workers, backwards clocks</td></tr>
          </tbody>
        </table>
        <p>Ticket servers: each app server asks a small highly-available service for a block of 1,000 IDs and dishes them out locally. You get sequential-ish IDs, high rate, and a much-less-hot central service. You also get gaps (a server dies holding a half-used block) which is almost always fine, and you still have to HA the ticket service.</p>
        <p>UUIDv4 is the right public identifier and often the wrong primary key at high insert rate: random page splits in a B-tree are a measured cost. UUIDv7 / ULID buy sortability back at 128 bits. Snowflake buys 64 bits and operational rules about workers and clocks.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Three generators: central ticket, UUID, Snowflake">
            <defs>
              <marker id="ah-sq1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="126" y="60" text-anchor="middle">ticket block</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">still a central dep</text>
            <rect class="dg-box y" x="250" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="360" y="60" text-anchor="middle">UUIDv4</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">opaque, not sorted</text>
            <rect class="dg-box g" x="484" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="594" y="60" text-anchor="middle">Snowflake</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">64-bit, time order</text>
            <path class="dg-line blue" d="M236 68 H246" marker-end="url(#ah-sq1)" />
            <path class="dg-line blue" d="M470 68 H480" marker-end="url(#ah-sq1)" />
          </svg>
          <figcaption>Figure 2 — Pick by properties. UUID for the URL; Snowflake for the clustered index; tickets when you want dense integers.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="seq-snowflake">Snowflake-style, bit by bit</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="64-bit Snowflake ID layout with sign, timestamp, worker id and sequence">
            <defs>
              <marker id="ah-sq2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="28" width="70" height="52" rx="6" />
            <text class="dg-s" x="51" y="50" text-anchor="middle">1 bit</text>
            <text class="dg-s" x="51" y="66" text-anchor="middle">sign=0</text>
            <rect class="dg-box b" x="96" y="28" width="240" height="52" rx="6" />
            <text class="dg-s" x="216" y="50" text-anchor="middle">41 bits · ms</text>
            <text class="dg-s" x="216" y="66" text-anchor="middle">~70 years</text>
            <rect class="dg-box y" x="346" y="28" width="160" height="52" rx="6" />
            <text class="dg-s" x="426" y="50" text-anchor="middle">10 bits worker</text>
            <text class="dg-s" x="426" y="66" text-anchor="middle">1,024 machines</text>
            <rect class="dg-box g" x="516" y="28" width="188" height="52" rx="6" />
            <text class="dg-s" x="610" y="50" text-anchor="middle">12 bits seq</text>
            <text class="dg-s" x="610" y="66" text-anchor="middle">4096 / ms / worker</text>
            <text class="dg-s" x="16" y="108">Uniqueness is unique (time, worker, sequence). Overflow waits for the next millisecond.</text>
            <text class="dg-s" x="16" y="126">High bits are time, so later IDs compare greater — until clocks disagree.</text>
            <text class="dg-s" x="16" y="144">Tune bits: hotter workers need more sequence; larger fleets need more worker bits.</text>
          </svg>
          <figcaption>Figure 3 — A typical 64-bit layout. The numbers are knobs, not scripture.</figcaption>
        </figure>
        <p>Within one millisecond, one worker just increments sequence. If it needs more than 4,096 IDs in that millisecond, it waits — a back-pressure valve. That wait is rare at human QPS and real at a busy ingest node; size sequence bits for the hottest worker, not the average.</p>

        <h3 class="lesson-subhead" id="seq-worker">Assigning worker IDs safely</h3>
        <p>The uniqueness proof assumes worker IDs are unique. Two nodes with worker ID 7 will issue colliding IDs the moment their clocks are within a millisecond of each other — which they will be.</p>
        <ul>
          <li><strong>Static config.</strong> Fine for three machines. An operational landmine at fifty.</li>
          <li><strong>Coordination service.</strong> On boot, take a lease on a worker ID from etcd/ZooKeeper, refresh the lease, and stop minting if the lease is lost. This is fencing (Chapter 3) applied to ID generation.</li>
          <li><strong>Derived from something unique.</strong> Private IP, availability-zone + slot. Works until someone clones a VM.</li>
        </ul>
        <p>The lease approach is the one to describe in an interview. It has a clean failure story: lose the lease, stop minting, get a new ID on reconnect. A node that has been partitioned cannot keep minting under an ID another node now holds.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Worker lease from etcd, stop minting if lease lost">
            <defs>
              <marker id="ah-sq3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="44" width="180" height="48" rx="7" />
            <text class="dg-s" x="106" y="72" text-anchor="middle">etcd lease</text>
            <rect class="dg-box b" x="236" y="44" width="220" height="48" rx="7" />
            <text class="dg-s" x="346" y="64" text-anchor="middle">worker id 7</text>
            <text class="dg-s" x="346" y="80" text-anchor="middle">refresh or stop</text>
            <rect class="dg-box g" x="496" y="44" width="208" height="48" rx="7" />
            <text class="dg-s" x="600" y="72" text-anchor="middle">mint IDs</text>
            <path class="dg-line green" d="M196 68 H232" marker-end="url(#ah-sq3)" />
            <path class="dg-line green" d="M456 68 H492" marker-end="url(#ah-sq3)" />
          </svg>
          <figcaption>Figure 4 — Worker bits are a scarce lock. Treat them like a fencing token, because they are one.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="seq-clocks">The clock-skew problem</h3>
        <p>NTP steps clocks. Leap seconds happen. VMs pause. A node whose clock jumps backwards will re-issue IDs it has already issued, unless you defend against it. Defences: track the last timestamp you issued; if <code>now &lt; last</code>, refuse to mint (or wait out the gap) rather than going backwards. Prefer a monotonic clock for the sequence-wait logic. Do not mint during obvious clock insanity (jumps of seconds).</p>
        <p>Accept that time-sortable IDs are only as ordered as your clocks are synchronised — typically milliseconds, not causality. Two workers can mint in "wrong" order relative to happened-before if B's clock lags A's. That is fine for B-tree locality. It is not a Lamport clock.</p>
        <p>Waiting out a backwards jump is availability: you stop minting until wall time catches last_ts. For a 3-second NTP step that is a 3-second write outage on that worker. Failing open (mint anyway) is a uniqueness outage. Prefer the write pause. Spread worker load so one paused node is not the fleet.</p>

        <h3 class="lesson-subhead" id="seq-opaque">Opacity of public IDs</h3>
        <p>A Snowflake in a URL leaks creation time to the millisecond and, with enough samples, approximate volume. Sequential IDs let anyone enumerate objects. Competitors scrape; attackers walk <code>/orders/1</code> through <code>/orders/N</code>.</p>
        <p>Keep the sortable ID internal. Expose a random 128-bit token, or a keyed permutation of the internal id (format-preserving encryption) if you want compactness without enumerability. Never treat "the user already has the integer" as a permission check — that is TinyURL's lesson and every IDOR report.</p>
        <p>Worker-bit exhaustion is an operations problem you should name. 10 bits is 1,024 concurrent minters. Kubernetes with aggressive churn can burn through leases if you do not return ids on shutdown. Track in-use worker ids as a first-class metric. If you need more minters, steal bits from timestamp or sequence — and write down the new epoch date, because 69 years was a choice, not a constant of nature.</p>
        <p>Batch minting inside a process (pre-allocate the next 100 sequence numbers) cuts atomic increments on the local sequence. It does not remove the uniqueness rules. It does create gaps on crash, which SQL people already accept from sequences. Gaps are not bugs unless a product manager confused uniqueness with density.</p>
        <div class="lesson-callout"><strong>Internal and external IDs are different types.</strong> Joins use the 64-bit key. The internet sees noise. Mixing them is how you leak a launch date from a product URL.</div>
      `,
    },
    {
      id: 'causality',
      title: 'Unique IDs with Causality',
      children: [
        { id: 'seq-hb', title: 'Timestamps are not happened-before' },
        { id: 'seq-lamport', title: 'Lamport clocks versus sortability' },
        { id: 'seq-vector', title: 'Vector clocks and HLCs' },
        { id: 'seq-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="seq-hb">Timestamps are not happened-before</h3>
        <p>If node A sends a message that node B receives and then B mints an ID, we would like ID(A's event) &lt; ID(B's event). Wall clocks do not guarantee this: B's clock may lag A's by 20 ms, and B's ID will compare smaller. Time-sortable IDs give you approximate physical time, which is enough for B-tree locality and "roughly recent first". They do not give you causality. If you need causality — comment threads, collaborative editing, multi-leader replication — you need a logical clock.</p>

        <h3 class="lesson-subhead" id="seq-lamport">Lamport clocks versus sortability</h3>
        <p>Each node keeps a counter. Increment on every local event. On send, attach the counter. On receive, set <code>local = max(local, received) + 1</code>. If event X happened-before event Y, then clock(X) &lt; clock(Y). The converse is false: clock(X) &lt; clock(Y) does not mean X happened before Y; they may be concurrent. Lamport clocks are cheap (one integer) and insufficient when you must detect concurrency rather than just not violate causality.</p>
        <p>They are also a poor clustered index: the number is not wall time, so "recent" in the product sense is not "large id". Sortability for storage and causality for semantics are different purchases.</p>

        <h3 class="lesson-subhead" id="seq-vector">Vector clocks and HLCs</h3>
        <p>A vector clock is one counter per node. They detect concurrency: incomparable vectors mean concurrent events. They also grow with the number of nodes, which is why they are used for replica groups of known small size and not as a general-purpose ID.</p>
        <p><strong>Hybrid logical clocks</strong> combine a physical timestamp with a logical counter, so IDs are close to wall time (useful for humans and for locality) and still respect happened-before within the cluster. TrueTime-style APIs go further and expose a bounded uncertainty interval, so a system can wait out the uncertainty and then commit with a real-time order. Mention HLC as the practical modern answer when asked "what if I need causality and sortability".</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 186" role="img" aria-label="Which clock to pick: wall clock, Lamport, vector, or hybrid logical">
            <defs>
              <marker id="ah-sq4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="28" width="168" height="70" rx="8" />
            <text class="dg-t" x="100" y="48" text-anchor="middle">Snowflake</text>
            <text class="dg-s" x="100" y="66" text-anchor="middle">B-tree locality</text>
            <text class="dg-s" x="100" y="82" text-anchor="middle">not causality</text>
            <rect class="dg-box y" x="196" y="28" width="160" height="70" rx="8" />
            <text class="dg-t" x="276" y="48" text-anchor="middle">Lamport</text>
            <text class="dg-s" x="276" y="66" text-anchor="middle">never violate</text>
            <text class="dg-s" x="276" y="82" text-anchor="middle">happened-before</text>
            <rect class="dg-box o" x="368" y="28" width="160" height="70" rx="8" />
            <text class="dg-t" x="448" y="48" text-anchor="middle">vector clock</text>
            <text class="dg-s" x="448" y="66" text-anchor="middle">detect concurrent</text>
            <text class="dg-s" x="448" y="82" text-anchor="middle">small replica sets</text>
            <rect class="dg-box g" x="540" y="28" width="164" height="70" rx="8" />
            <text class="dg-t" x="622" y="48" text-anchor="middle">HLC</text>
            <text class="dg-s" x="622" y="66" text-anchor="middle">physical + logical</text>
            <text class="dg-s" x="622" y="82" text-anchor="middle">causal respect</text>
            <rect class="dg-band y" x="12" y="114" width="696" height="56" rx="10" />
            <text class="dg-s" x="26" y="136">Most products need the left column. Comments and multi-leader KV need the middle.</text>
            <text class="dg-s" x="26" y="154">Spanner-like commit order needs TrueTime. Do not buy that for a tweet ID.</text>
          </svg>
          <figcaption>Figure 5 — Causality is not a free upgrade on a timestamp. Sortability is cheap. Uniqueness is mandatory.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Public opaque ID versus internal sortable Snowflake">
            <defs>
              <marker id="ah-sq5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="40" width="320" height="56" rx="7" />
            <text class="dg-s" x="176" y="64" text-anchor="middle">internal Snowflake</text>
            <text class="dg-s" x="176" y="80" text-anchor="middle">joins, B-tree, logs</text>
            <rect class="dg-box y" x="368" y="40" width="336" height="56" rx="7" />
            <text class="dg-s" x="536" y="64" text-anchor="middle">public UUID / token</text>
            <text class="dg-s" x="536" y="80" text-anchor="middle">URLs, no enumerate</text>
            <path class="dg-line pink dash" d="M336 68 H364" marker-end="url(#ah-sq5)" />
          </svg>
          <figcaption>Figure 6 — Two identifiers. One for the database, one for the internet. That is the opacity rule.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="seq-eval">Evaluation</h3>
        <p>Snowflake-style IDs fail if worker IDs collide or clocks go backwards — both preventable, neither ignorable. They leak time. They do not establish causality. Ticket servers fail when the ticket service is down (mitigate by holding a large local block). UUIDv4 fails as a primary key in a B-tree at high insert rate because it randomises page splits. The design you should walk out of an interview with is usually: Snowflake internally, opaque externally, leases for worker IDs, refuse-on-backwards-clock, and a one-sentence admission that causality would take a different clock.</p>
        <p>Do not invent a 128-bit Snowflake "to be safer." Extra bits do not fix colliding workers. They do bloat every index. If you need more workers, reallocate the 63 payload bits and document the cutover: two epochs cannot share a table without a version nibble, which you already spent on the sign bit unless you steal sequence.</p>
        <p>Clock synch is an SLO of this building block. A fleet whose NTP is "best effort" will eventually mint duplicates or stall. Treat time the way you treat disk: alert when offset exceeds a few milliseconds, and refuse to mint on nodes that are unsynchronised. That operational sentence is more useful than drawing 41 boxes on a whiteboard.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Backwards clock stops minting rather than duplicating IDs">
            <defs>
              <marker id="ah-sq6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">clock jumped back</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">now less than last</text>
            <rect class="dg-box o" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">refuse mint</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">wait the gap</text>
            <rect class="dg-box g" x="476" y="40" width="228" height="56" rx="7" />
            <text class="dg-s" x="590" y="64" text-anchor="middle">uniqueness held</text>
            <text class="dg-s" x="590" y="80" text-anchor="middle">writes pause here</text>
            <path class="dg-line rose" d="M236 68 H252" marker-end="url(#ah-sq6)" />
            <path class="dg-line rose" d="M456 68 H472" marker-end="url(#ah-sq6)" />
          </svg>
          <figcaption>Figure 7 — A short write pause beats a silent duplicate primary key. Uniqueness is the SLO; minting is not.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is a database auto-increment the wrong default at a million IDs per second? (2) What two conditions break Snowflake uniqueness, and how do you prevent each? (3) Why might you still keep a random external ID even though you have a perfectly good internal Snowflake? (4) When is a wall-clock ID not enough for happened-before?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Unique-ID generation is a standard distributed-systems exercise; Snowflake-style layouts and logical clocks are well-documented public techniques. All explanations, diagrams and exercises are our own.',
};
