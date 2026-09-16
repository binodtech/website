/** Modern System Design — Chapter 10: Design a Key-Value Store.
 *  A Dynamo-style partitioned, replicated store: hashing, quorums, clocks, and repair.
 */

export const msdKeyValueStore = {
  slug: 'key-value-store',
  title: 'Design a Key-Value Store',
  subtitle:
    'Build a store that answers get and put for billions of keys when nodes die, racks vanish, and two clients write the same key in different cities — without a leader, without a cross-key transaction, and without pretending clocks agree.',
  byline: 'Modern System Design · Chapter 10 · ~2h 15m read · Intermediate',
  interviewTip:
    'A strong KV answer is Dynamo with numbers. State the API, estimate key count and QPS, put nodes on a consistent-hash ring with virtual nodes, pick N/W/R with W+R>N from Chapter 3, then spend the rest of the time on sloppy quorum, hinted handoff, vector clocks versus last-write-wins, and Merkle repair. If you skip failure detection and anti-entropy, you designed a happy-path cache, not a store. Say out loud that range queries and multi-key transactions are out of scope — that is a feature of the design, not an omission you got caught on.',
  sections: [
    {
      id: 'kv-system-design',
      title: 'System Design: The Key-Value Store',
      children: [
        { id: 'kv-problem', title: 'The problem this store exists to solve' },
        { id: 'kv-req', title: 'Requirements' },
        { id: 'kv-api', title: 'API sketch' },
        { id: 'kv-est', title: 'Estimation' },
      ],
      html: `
        <p>A key-value store is the simplest distributed database that is still interesting. The interface is a map: you put a blob under a key, you get it back, you delete it. There is no join, no secondary index in the core, no SERIALISABLE across keys. The interesting part is keeping that map correct and available when the cluster is on fire — which is the original Dynamo brief, and still the brief for Cassandra, Riak, and the guts of DynamoDB.</p>
        <p>We are not designing Redis-in-RAM, and we are not designing Postgres. We are designing a durable, partitioned, replicated hash table for primary-key access at large QPS, in the lineage of the 2007 Dynamo paper. Chapter 9 gave us LSM engines, leaderless replication, consistent hashing and quorums. This chapter puts them in one box and asks you to operate it.</p>

        <h3 class="lesson-subhead" id="kv-problem">The problem this store exists to solve</h3>
        <p>Shopping carts, session blobs, feature flags, device tokens, rate-limit counters, a user's last-seen timestamp — workloads where the lookup key is known at request time and a slightly stale or sibling-valued read is better than a 503. Amazon's original example was the cart: never refuse an add-to-cart because a replica in another AZ is down. Conflict resolution at read time ("two versions of the cart, merge the items") is acceptable; losing the cart is not.</p>
        <p>If your problem is "unique email and serialisable balance", stop. Use a leader plus a transaction. The KV store we design here will not save you, and pretending it will is how you lose money twice.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Good and bad fits for a Dynamo-style key-value store">
            <rect class="dg-band g" x="12" y="16" width="344" height="168" rx="11" />
            <text class="dg-h" x="26" y="36">THIS STORE</text>
            <text class="dg-s" x="26" y="60">carts, sessions, device state</text>
            <text class="dg-s" x="26" y="78">known primary key per request</text>
            <text class="dg-s" x="26" y="96">availability over one-copy truth</text>
            <text class="dg-s" x="26" y="114">mergeable values help a lot</text>
            <text class="dg-s" x="26" y="132">TTL and CAS are extras</text>
            <text class="dg-s" x="26" y="156">think Dynamo, Cassandra, Riak</text>
            <rect class="dg-band r" x="368" y="16" width="340" height="168" rx="11" />
            <text class="dg-h" x="382" y="36">NOT THIS STORE</text>
            <text class="dg-s" x="382" y="60">ledger balances, unique email</text>
            <text class="dg-s" x="382" y="78">range scan of all users in Leeds</text>
            <text class="dg-s" x="382" y="96">multi-key serialisable txns</text>
            <text class="dg-s" x="382" y="114">ad-hoc SQL, joins, GROUP BY</text>
            <text class="dg-s" x="382" y="132">search relevance, graph walks</text>
            <text class="dg-s" x="382" y="156">use Ch9's other families instead</text>
          </svg>
          <figcaption>Figure 1 — Scope is a requirement. A KV cluster that cannot range-scan is not unfinished; it is the point of hashing the key.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="kv-req">Requirements</h3>
        <table>
          <thead><tr><th></th><th>Requirement</th></tr></thead>
          <tbody>
            <tr><td><strong>Functional</strong></td><td>put(key, value), get(key), delete(key); optional compare-and-set; optional TTL</td></tr>
            <tr><td><strong>Value size</strong></td><td>typically &lt; 64 KB; we design for 2 KB average, 256 KB hard cap (larger belongs in object storage with a pointer)</td></tr>
            <tr><td><strong>Scale</strong></td><td>5 billion keys, 40 TB raw values, 3× replication ≈ 120 TB cluster</td></tr>
            <tr><td><strong>QPS</strong></td><td>80k get/sec peak, 12k put/sec peak, read-heavy</td></tr>
            <tr><td><strong>Latency</strong></td><td>get p99 &lt; 15 ms in-region; put p99 &lt; 30 ms with W=2</td></tr>
            <tr><td><strong>Availability</strong></td><td>99.99% for get/put; survive one AZ of three, and single-node death without operator</td></tr>
            <tr><td><strong>Durability</strong></td><td>acknowledged put survives the loss of one node; two-node loss may lose a key (N=3)</td></tr>
            <tr><td><strong>Consistency</strong></td><td>tunable quorums; default eventual with W+R&gt;N for latest-write-wins among versions the client can see</td></tr>
            <tr><td><strong>Out of scope</strong></td><td>range queries, joins, multi-key transactions, secondary indexes in v1</td></tr>
          </tbody>
        </table>
        <p>Non-functional numbers are what force the ring. 40 TB does not fit on one box with headroom. 80k gets/sec of 2 KB is 160 MB/s of payload plus overhead — a handful of NVMe nodes, not a supercomputer, but only if the hash spreads the hot keys. <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a> availability language: we want fault tolerance of a node and of an AZ, not of a simultaneous two-AZ disaster, unless we pay for N=5 and more disks.</p>

        <h3 class="lesson-subhead" id="kv-api">API sketch</h3>
        <pre><code>put(key: bytes, value: bytes, opts?: { ttlSec?: number, context?: VectorClock })
  -> { ok, context }

get(key: bytes)
  -> { found: false } | { found: true, values: Sibling[], context }

delete(key: bytes, context?: VectorClock)
  -> { ok }   // tombstone with TTL for anti-entropy

cas(key, expectedContext, value)
  -> { ok } | { conflict, current: Sibling[] }

// Conventions
// key: 16–128 bytes; hashed with a 128-bit hash onto the ring
// context: opaque to the app, passed back on the next write (Riak-style)
// siblings: 1 value if clocks comparable; N if concurrent writes</code></pre>
        <p>Compare-and-set is how you avoid last-write-wins accidents when the value is not mergeable. The client get()s, mutates, cas()s with the returned context. If another writer raced, cas fails and the client merges or retries. TTL is a tombstone timer: expired keys still need delete markers until every replica has seen them, or a node that was down will resurrect a key from a hinted copy. Cassandra's gc_grace_seconds is that idea as a number you will get wrong once.</p>

        <h3 class="lesson-subhead" id="kv-est">Estimation</h3>
        <pre><code>KEYS AND STORAGE
  5e9 keys x 2 KB value = 10 TB values
  per key metadata (clock, checksum, tombstone flag) ~64 B
  5e9 x 64 B = 320 GB metadata
  LSM overhead + compaction slack ~2x on disk  -> ~20 TB useful
  N=3 copies  -> ~60 TB raw SSD  (buy 90 TB for compaction, repair, failure)

NODES
  2 TB usable NVMe per node after RAID/FS  -> ~30 data nodes
  + 20% for growth and rebuilds            -> ~36 nodes
  3 AZs x 12 nodes

QPS PER NODE (if perfectly even)
  80k get / 36 ≈ 2,200 get/s/node
  12k put / 36 ≈ 330 put/s/node
  2 KB x 2200 ≈ 4.4 MB/s read  — CPU and fsync dominate, not the NIC

MEMORY
  block cache + memtable 8–16 GB/node
  bloom filters: 5e9 / 36 x 10 bits ≈ 170 MB/node  (nice)

PEAK HOT KEY
  if 1 key is 2% of gets = 1,600 get/s on 3 replicas
  still fine; if 20% of gets, you need caching or key splitting</code></pre>
        <p>The estimate says: ~36 nodes, LSM, bloom filters, and a hot-key plan. It does not say Kafka, and it does not say a leader per shard unless we change the API to want linearisability. We will keep leaderless quorums.</p>
        <div class="lesson-callout">Cap values. A 2 MB value at 80k gets/sec is 160 GB/s — that is not a KV cluster, that is a DDoS of your own NICs. Put large blobs in object storage and store a pointer plus etag. The 256 KB cap in the requirements is a product decision that saves the design.</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Client to coordinator to N replicas on a ring">
            <defs>
              <marker id="ah-kv1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="130" height="40" rx="7" />
            <text class="dg-s" x="81" y="60" text-anchor="middle">client</text>
            <rect class="dg-box c" x="180" y="36" width="150" height="40" rx="7" />
            <text class="dg-s" x="255" y="60" text-anchor="middle">any node (coord)</text>
            <rect class="dg-box g" x="370" y="16" width="120" height="32" rx="7" />
            <text class="dg-s" x="430" y="36" text-anchor="middle">replica A</text>
            <rect class="dg-box g" x="370" y="56" width="120" height="32" rx="7" />
            <text class="dg-s" x="430" y="76" text-anchor="middle">replica B</text>
            <rect class="dg-box g" x="370" y="96" width="120" height="32" rx="7" />
            <text class="dg-s" x="430" y="116" text-anchor="middle">replica C</text>
            <rect class="dg-box y" x="530" y="48" width="174" height="40" rx="7" />
            <text class="dg-s" x="617" y="72" text-anchor="middle">wait for W or R</text>
            <path class="dg-line blue" d="M146 56 H172" marker-end="url(#ah-kv1)" />
            <path class="dg-line blue" d="M330 56 H362" marker-end="url(#ah-kv1)" />
            <text class="dg-s" x="16" y="156">Every node can coordinate. The coordinator is not a leader; it is whoever received the TCP connection.</text>
          </svg>
          <figcaption>Figure 2 — The client talks to any node. That node hashes the key, forwards to the preference list, and returns when the quorum is satisfied.</figcaption>
        </figure>
      `,
    },
    {
      id: 'kv-design',
      title: 'Design of a Key-Value Store',
      children: [
        { id: 'kv-ring', title: 'Consistent hashing and virtual nodes' },
        { id: 'kv-pref', title: 'Preference lists and zone awareness' },
        { id: 'kv-coord', title: 'The coordinator path' },
        { id: 'kv-lsm', title: 'Local storage: LSM, WAL and blooms' },
      ],
      html: `
        <p>The cluster is a ring of tokens. A key hashes to a point on the ring; the next N distinct physical nodes clockwise own it. That is the whole placement algorithm. Everything else — quorums, repair, gossip — assumes you can compute that list on every node without a central mapper.</p>

        <h3 class="lesson-subhead" id="kv-ring">Consistent hashing and virtual nodes</h3>
        <p>A 128-bit hash space is drawn as a circle. Each node is assigned many <strong>virtual nodes</strong> (vnodes): say 64–256 tokens each, so 36 physical nodes × 128 vnodes = ~4,600 points. A key walks clockwise from hash(key) until it has collected N unique physical owners. Adding a physical node inserts its vnodes and steals only the ranges that now fall before those tokens. Removing a node does the reverse. Contrast <a href="/learn/modern-system-design/databases">Chapter 9</a>'s hash-mod-N disaster: here, one extra box moves ~1/36 of the data, not 97% of it.</p>
        <p>Vnodes also even out load. Without them, two adjacent physical tokens might own 8% of the ring by unlucky placement. With 128 vnodes, the law of large numbers makes per-node share close to 1/N. Cassandra popularised vnode counts as an operator knob; too many vnodes makes repair and compaction chatter. Too few reintroduces skew.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Consistent hash ring with virtual nodes and N=3 replicas clockwise">
            <defs>
              <marker id="ah-kv2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="280" y="16" width="160" height="28" rx="6" />
            <text class="dg-s" x="360" y="34" text-anchor="middle">hash(key) lands</text>
            <rect class="dg-box g" x="16" y="64" width="140" height="40" rx="7" />
            <text class="dg-s" x="86" y="80" text-anchor="middle">vnode A1</text>
            <text class="dg-s" x="86" y="96" text-anchor="middle">node A</text>
            <rect class="dg-box o" x="196" y="64" width="140" height="40" rx="7" />
            <text class="dg-s" x="266" y="80" text-anchor="middle">vnode B7</text>
            <text class="dg-s" x="266" y="96" text-anchor="middle">node B</text>
            <rect class="dg-box p" x="376" y="64" width="140" height="40" rx="7" />
            <text class="dg-s" x="446" y="80" text-anchor="middle">vnode C3</text>
            <text class="dg-s" x="446" y="96" text-anchor="middle">node C</text>
            <rect class="dg-box y" x="556" y="64" width="148" height="40" rx="7" />
            <text class="dg-s" x="630" y="80" text-anchor="middle">vnode A9</text>
            <text class="dg-s" x="630" y="96" text-anchor="middle">skip dup A</text>
            <path class="dg-line green" d="M360 44 V60" marker-end="url(#ah-kv2)" />
            <text class="dg-s" x="16" y="140">Walk clockwise: first three distinct physical nodes are the replica set for this key (N=3).</text>
            <text class="dg-s" x="16" y="158">A9 is skipped because node A is already in the set. Zone rules may skip B if A and B share a rack.</text>
            <text class="dg-s" x="16" y="176">New node D inserts vnodes; only keys whose clockwise walk now hits D move. Neighbours stream SSTables.</text>
            <text class="dg-s" x="16" y="194">Token assignment must be stored in gossiped cluster state so every coordinator computes the same list.</text>
          </svg>
          <figcaption>Figure 3 — Placement is a walk, not a modulo. Distinct physical nodes and distinct failure domains both constrain the walk.</figcaption>
        </figure>
        <div class="lesson-callout">When you add a node, do not accept writes for its new ranges until streaming finishes, or you will acknowledge puts that exist only in memory on a node that then dies. Cassandra's "joining" state exists for this reason. Bootstrap is a data-path feature, not an ops footnote.</div>

        <h3 class="lesson-subhead" id="kv-pref">Preference lists and zone awareness</h3>
        <p>The <strong>preference list</strong> is the ordered list of nodes for a key, longer than N: typically N plus a few backups used by sloppy quorum (next section). The first N are the "natural" owners. Zone awareness says: do not pick three replicas from the same AZ. Walk the ring until you have N nodes in distinct AZs (or racks). If the cluster is mis-sized — eight nodes in one AZ and two in another — you cannot satisfy the constraint for every key; the operator, not the hash, is then the bug.</p>
        <p>Put the three replicas of a key in three AZs and a single AZ outage still leaves W=2 possible. Put them in one rack and a ToR switch is a data-loss event. The ring does not know about racks unless you tell it (Cassandra snitch, Dynamo placement, Kubernetes zone labels).</p>

        <h3 class="lesson-subhead" id="kv-coord">The coordinator path</h3>
        <p>A client may send the request to any node (or to a load balancer of nodes). That node hashes, computes the preference list, and RPCs the replicas. It does not write locally unless it is on the list — otherwise it is a proxy. Timeouts on those RPCs are Chapter 3 timeouts: silence is not "the replica refused". The coordinator counts only positive acks toward W or R.</p>
        <p>Smart clients (Cassandra drivers, DynamoDB is a service so AWS is the coordinator) can hash locally and send to a replica, saving one hop. The trade-off is the client must learn token maps via gossip or a control plane, and must refresh on topology change. Dumb clients plus coordinator nodes are simpler and add ~0.3–1 ms.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Coordinator forwards put to three replicas and waits for W=2">
            <defs>
              <marker id="ah-kv3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box c" x="16" y="48" width="150" height="40" rx="7" />
            <text class="dg-s" x="91" y="72" text-anchor="middle">coordinator</text>
            <rect class="dg-box g" x="220" y="16" width="140" height="32" rx="6" />
            <text class="dg-s" x="290" y="36" text-anchor="middle">replica ack</text>
            <rect class="dg-box g" x="220" y="56" width="140" height="32" rx="6" />
            <text class="dg-s" x="290" y="76" text-anchor="middle">replica ack</text>
            <rect class="dg-box r" x="220" y="96" width="140" height="32" rx="6" />
            <text class="dg-s" x="290" y="116" text-anchor="middle">replica timeout</text>
            <rect class="dg-box y" x="420" y="48" width="280" height="40" rx="7" />
            <text class="dg-s" x="560" y="72" text-anchor="middle">W=2 satisfied, return OK</text>
            <path class="dg-line violet" d="M166 68 H212" marker-end="url(#ah-kv3)" />
            <path class="dg-line violet" d="M360 68 H412" marker-end="url(#ah-kv3)" />
            <text class="dg-s" x="16" y="152">The timed-out replica still might have the write. Repair later. The client already received success.</text>
          </svg>
          <figcaption>Figure 4 — W=2 does not mean three disks have the bytes. It means two coordinators-view acks. The third is a repair problem, not a client problem.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="kv-lsm">Local storage: LSM, WAL and blooms</h3>
        <p>Each node is an LSM tree (Chapter 9). put appends to a WAL and a memtable; get checks memtable, then bloom-filtered SSTables from newest to oldest. Tombstones are deletes that must survive until compaction and until gc_grace, or a zombie put from a repaired node resurrects the key.</p>
        <p>Compaction is the hidden QPS tax. A node at 330 puts/s may write 5–15× that to disk after levels compact. Size-tiered compaction is simple and write-heavy; leveled (RocksDB style) is read-friendlier. Operators page on "pending compaction bytes", not on the put rate you quoted in the estimate.</p>
      `,
    },
    {
      id: 'kv-scale-repl',
      title: 'Ensure Scalability and Replication',
      children: [
        { id: 'kv-nwr', title: 'N, W, R and the W+R greater than N rule' },
        { id: 'kv-sloppy', title: 'Sloppy quorum and hinted handoff' },
        { id: 'kv-hotkeys', title: 'Hot keys and client-side caching' },
      ],
      html: `
        <p>Scalability came from the ring. Replication is the copies on that ring, and the numbers N, W, R are how you trade durability against latency on every call. <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> stated the invariant: if W + R &gt; N, a get quorum and a put quorum intersect in at least one node, so a reader who waits for R sees at least one copy of the latest write that waited for W — provided those copies are comparable and nobody used a sloppy substitute. That last clause is this section.</p>

        <h3 class="lesson-subhead" id="kv-nwr">N, W, R and the W+R greater than N rule</h3>
        <p>Typical production: N=3, W=2, R=2. A put waits for two of three replica acks. A get waits for two responses and returns the latest by vector clock (or siblings). One node can be down and both put and get still succeed. W=1, R=1 is fast and can miss a write that only landed on a different replica. W=3, R=1 is durable and slow on put, fast on get, and a single slow replica stalls every write. W=3, R=3 is a committee that cannot lose a write and cannot serve during a single-node stall.</p>
        <table>
          <thead><tr><th>N,W,R</th><th>Put behaviour</th><th>Get behaviour</th><th>Use when</th></tr></thead>
          <tbody>
            <tr><td>3,2,2</td><td>survives 1 down</td><td>intersects writes</td><td>default cart / session</td></tr>
            <tr><td>3,3,1</td><td>slow, very durable</td><td>fast, may be stale if clocks lie</td><td>rare; prefer 2,2</td></tr>
            <tr><td>3,1,3</td><td>fast, easy to lose</td><td>must read all to overlap</td><td>almost never</td></tr>
            <tr><td>3,1,1</td><td>AP / EL</td><td>can miss the write</td><td>metrics, best-effort</td></tr>
            <tr><td>5,3,3</td><td>two-fault durable</td><td>heavier CPU and net</td><td>N=5 clusters</td></tr>
          </tbody>
        </table>
        <p>W+R&gt;N is necessary, not sufficient. If the "W" acks include a node that is not a natural replica (sloppy), the intersection theorem applies to a different set than the get will use later. If last-write-wins uses bad clocks, the intersecting node may still hand you the wrong value. If a replica acked in memory and died before WAL fsync, W lied. Require "ack means durable WAL" in the protocol.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Write quorum of two and read quorum of two intersecting on one replica">
            <rect class="dg-box g" x="16" y="28" width="140" height="56" rx="7" />
            <text class="dg-s" x="86" y="50" text-anchor="middle">replica A</text>
            <text class="dg-s" x="86" y="68" text-anchor="middle">W and R</text>
            <rect class="dg-box g" x="196" y="28" width="140" height="56" rx="7" />
            <text class="dg-s" x="266" y="50" text-anchor="middle">replica B</text>
            <text class="dg-s" x="266" y="68" text-anchor="middle">W only</text>
            <rect class="dg-box y" x="376" y="28" width="140" height="56" rx="7" />
            <text class="dg-s" x="446" y="50" text-anchor="middle">replica C</text>
            <text class="dg-s" x="446" y="68" text-anchor="middle">R only</text>
            <rect class="dg-band b" x="536" y="28" width="168" height="56" rx="7" />
            <text class="dg-s" x="620" y="50" text-anchor="middle">intersect = A</text>
            <text class="dg-s" x="620" y="68" text-anchor="middle">sees the put</text>
            <text class="dg-s" x="16" y="112">Put waited for A,B. Get waited for A,C. A has the write. If get had taken B,C you would still see it on B.</text>
            <text class="dg-s" x="16" y="130">If put had been W=1 on B only, get R=1 on C misses. That is W+R = 2, not greater than N=3.</text>
            <text class="dg-s" x="16" y="148">Interview: write the inequality, then say which nodes, then say durable ack, then mention sloppy quorum as the footnote that breaks it.</text>
            <text class="dg-s" x="16" y="166">Cassandra ONE/QUORUM/ALL are these knobs with friendlier names.</text>
          </svg>
          <figcaption>Figure 5 — Quorum intersection is a set-theory claim about the replica list, not a feeling about "eventual consistency".</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="kv-sloppy">Sloppy quorum and hinted handoff</h3>
        <p>If two of three natural replicas are down, a strict W=2 put fails even though the cluster is mostly healthy. Dynamo's <strong>sloppy quorum</strong> takes the next live nodes on the preference list so that W acks still happen. Those stand-ins store a <strong>hint</strong>: "this blob belongs to node A". When A returns, the stand-in forwards the hint and drops it. Availability of put is saved. The W+R&gt;N proof is paused until hints drain.</p>
        <p>Hinted handoff fails if the stand-in dies before delivering, or if hints pile up for a node that is down for hours (disk fills with other people's data). Cap hint TTL and fall back to anti-entropy. Never tell the client "durable on the natural replicas" if you only wrote hints.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 180" role="img" aria-label="Hinted handoff: write to a stand-in node then replay to the natural owner">
            <defs>
              <marker id="ah-kv4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="28" width="150" height="48" rx="7" />
            <text class="dg-s" x="91" y="48" text-anchor="middle">natural A down</text>
            <text class="dg-s" x="91" y="64" text-anchor="middle">cannot ack</text>
            <rect class="dg-box o" x="210" y="28" width="160" height="48" rx="7" />
            <text class="dg-s" x="290" y="48" text-anchor="middle">stand-in D</text>
            <text class="dg-s" x="290" y="64" text-anchor="middle">stores hint for A</text>
            <rect class="dg-box g" x="414" y="28" width="160" height="48" rx="7" />
            <text class="dg-s" x="494" y="48" text-anchor="middle">A healthy again</text>
            <text class="dg-s" x="494" y="64" text-anchor="middle">D forwards hint</text>
            <rect class="dg-box b" x="590" y="28" width="114" height="48" rx="7" />
            <text class="dg-s" x="647" y="56" text-anchor="middle">A owns it</text>
            <path class="dg-line hot" d="M166 52 H202" marker-end="url(#ah-kv4)" />
            <path class="dg-line hot" d="M370 52 H406" marker-end="url(#ah-kv4)" />
            <path class="dg-line hot" d="M574 52 H582" marker-end="url(#ah-kv4)" />
            <text class="dg-s" x="16" y="108">During the gap, gets that do not include D may miss the write. Read repair and Merkle trees close that gap.</text>
            <text class="dg-s" x="16" y="126">If D also dies, the hint is gone unless W included another natural replica. Design W so one natural replica still acked.</text>
            <text class="dg-s" x="16" y="144">Riak and Dynamo document this explicitly; skipping it in an interview is skipping the AP story.</text>
            <text class="dg-s" x="16" y="162">Hint replay must be idempotent: the same put may already have been repaired another way.</text>
          </svg>
          <figcaption>Figure 6 — Sloppy quorum is availability on credit. The debt is paid by hints, then by repair if the credit department dies.</figcaption>
        </figure>
        <div class="lesson-callout">If the interviewer says "we cannot lose a write even when two replicas are down", you need N=5, W=3, or a different store. Sloppy quorum with N=3 is not three durable copies. It is two, plus a sticky note on someone else's fridge.</div>

        <h3 class="lesson-subhead" id="kv-hotkeys">Hot keys and client-side caching</h3>
        <p>The ring spreads keys, not popularity. A flash-sale SKU as a single key funnels every get/put onto three nodes. Mitigations: cache gets in front (CDN or local LRU) so the ring sees a cache-fill rate; split the key into N stripes and sum (for counters); jittered client backoff; isolate the key via a directory exception (Chapter 9). Puts of a hot mutable blob are harder — you may need to accept W=1 on that key or move it to a specialised counter service.</p>
        <p>Coordinators should detect "same key, thousands of QPS" and shed or coalesce. Without that, compaction and GC on those three nodes fall over while 33 other nodes look idle — a false "we need to scale the cluster" incident.</p>
      `,
    },
    {
      id: 'kv-versioning',
      title: 'Versioning Data and Achieving Configurability',
      children: [
        { id: 'kv-clocks', title: 'Vector clocks, a worked example' },
        { id: 'kv-lww', title: 'Last-write-wins and why it deletes carts' },
        { id: 'kv-siblings', title: 'Siblings, client merge and CRDTs' },
        { id: 'kv-config', title: 'Per-request and per-table knobs' },
      ],
      html: `
        <p>Two clients can put the same key on different replicas during a partition. When the partition heals, the cluster must not pick a winner at random. Versioning is how you notice the fork. Configurability is how one cluster serves a cart (merge siblings) and a telemetry blob (last-write-wins) without being two products.</p>

        <h3 class="lesson-subhead" id="kv-clocks">Vector clocks, a worked example</h3>
        <p>A <strong>vector clock</strong> is a map from replica-id (or writer-id) to a counter. Replica A writes: clock {A:1}. Replica B then reads that, updates, writes {A:1, B:1}. If C never saw A's write and writes {C:1}, the two clocks are concurrent: neither dominates. A clock X dominates Y if every counter in Y is ≤ the matching counter in X, and at least one is greater. Dominance means "happened after". Concurrent means "siblings".</p>
        <p>Worked example. Empty key. Client 1 puts via node A: value="apple", clock {A:1}. Client 2 gets it, appends, puts via A: value="apple,pear", clock {A:2}. Meanwhile client 3, whose get missed the second put (R=1, hit a stale replica), puts value="banana" via node B from the first version: clock {A:1, B:1}. {A:2} and {A:1,B:1} are concurrent. A get with R=2 should return both values, not "banana" alone and not "apple,pear" alone.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 230" role="img" aria-label="Vector clocks: two concurrent branches of the same key">
            <rect class="dg-box g" x="16" y="16" width="210" height="48" rx="7" />
            <text class="dg-s" x="121" y="36" text-anchor="middle">put apple @ A</text>
            <text class="dg-s" x="121" y="52" text-anchor="middle">{A:1}</text>
            <rect class="dg-box b" x="256" y="16" width="210" height="48" rx="7" />
            <text class="dg-s" x="361" y="36" text-anchor="middle">put apple,pear @ A</text>
            <text class="dg-s" x="361" y="52" text-anchor="middle">{A:2}</text>
            <rect class="dg-box o" x="496" y="16" width="208" height="48" rx="7" />
            <text class="dg-s" x="600" y="36" text-anchor="middle">put banana @ B</text>
            <text class="dg-s" x="600" y="52" text-anchor="middle">{A:1,B:1}</text>
            <rect class="dg-band r" x="16" y="84" width="688" height="56" rx="8" />
            <text class="dg-s" x="360" y="108" text-anchor="middle">A:2 vs A:1,B:1 — concurrent, not ordered. Store both siblings.</text>
            <text class="dg-s" x="360" y="126" text-anchor="middle">Merge: apple, pear, banana. New clock {A:2, B:1} after client merge put.</text>
            <text class="dg-s" x="16" y="164">If the client blindly puts banana without sending context, you cannot tell it was concurrent; the cluster may treat it as a new causal branch or as LWW.</text>
            <text class="dg-s" x="16" y="182">Always return context on get and require it on put if you care about lost updates. That is the cas() API from section 1.</text>
            <text class="dg-s" x="16" y="200">Clocks grow with writer ids; prune carefully or a busy key's context becomes larger than the value.</text>
          </svg>
          <figcaption>Figure 7 — Concurrent clocks are the honest answer. Collapsing them with wall time is how you throw away a cart item.</figcaption>
        </figure>
        <p>Dynamo used vector clocks per key. Riak did too, then offered dotted version vectors to bound metadata growth. Cassandra defaulted to timestamp LWW instead — simpler, and a known footgun. Name which one you are implementing on the whiteboard.</p>

        <h3 class="lesson-subhead" id="kv-lww">Last-write-wins and why it deletes carts</h3>
        <p><strong>Last-write-wins (LWW)</strong> attaches a timestamp (or hybrid logical clock) and keeps the larger. It is cheap, it is what Cassandra CQL does, and it is wrong whenever two writes are concurrent and both values matter. Two add-to-cart requests, clocks 1 ms apart, one delayed in a queue: the later timestamp may be the write that never saw the first item. You silently drop "pear". NTP slew, AWS clock drift, and leap smears make "later" a policy, not a fact.</p>
        <p>LWW is acceptable for values that are truly a last snapshot: last-seen timestamp, a feature-flag blob the client always sends whole, a cache entry. It is not acceptable for sets that grow by increment. If you use LWW, the application must send the full merged value every time, and cas() with a version to avoid the lost update — at which point you have reinvented a clock.</p>
        <table>
          <thead><tr><th></th><th>Vector clocks + siblings</th><th>LWW timestamps</th></tr></thead>
          <tbody>
            <tr><td>Concurrent writes</td><td>kept, returned to client</td><td>one discarded</td></tr>
            <tr><td>Clock skew</td><td>irrelevant to causality</td><td>can invert real order</td></tr>
            <tr><td>Metadata size</td><td>grows with writers</td><td>one int64</td></tr>
            <tr><td>App complexity</td><td>must merge</td><td>must send whole value + hope</td></tr>
            <tr><td>Good fit</td><td>carts, CRDT-shaped data</td><td>last-snapshot blobs</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="kv-siblings">Siblings, client merge and CRDTs</h3>
        <p>When get() returns two siblings, someone must merge. Dynamo pushed that to the shopping-cart service: union of item ids, max of quantities. That is a hand-written merge. A <strong>CRDT</strong> (conflict-free replicated data type) is a value whose merge is mathematically guaranteed to be associative, commutative and idempotent — G-counters, OR-sets, LWW-registers for fields that really are LWW. Riak Data Types and Cassandra's clever use of timestamps on cells are this family.</p>
        <p>Do not CRDT a bank balance as a G-counter of credits without a matching PN-counter of debits and an anti-fraud story. CRDTs remove the "pick a sibling" pager; they do not remove product meaning. Tombstones in OR-sets need the same gc_grace thinking as deletes in the KV layer, or removed items reappear.</p>
        <div class="lesson-callout">If you cannot write the merge function in five lines, you do not have a mergeable value. Use cas() and a leader for that key, or accept LWW and document the lost-update. Inventing a "smart merge" in the coordinator for arbitrary JSON is how you ship a bug that only fires after a partition.</div>

        <h3 class="lesson-subhead" id="kv-config">Per-request and per-table knobs</h3>
        <p>Configurability is why one Cassandra cluster holds both "user preferences" and "audit pings". Per-request: consistency level (ONE, LOCAL_QUORUM, ALL), and whether the client wants siblings. Per-table: compaction strategy, bloom fp rate, gc_grace, default TTL, speculative retry. Per-cluster: vnode count, hinted handoff window, repair schedule.</p>
        <p>LOCAL_QUORUM (W/R in the local AZ, N still 3 across AZs) is the usual multi-AZ compromise: you pay AZ-local latency, you survive a node death, you do not wait for a transatlantic ack. A GLOBAL_QUORUM on every click is how you invent a 200 ms p99. Put the knob on the API, default it in the table, and do not let each team pick ALL "just to be safe" — that is how a single slow node becomes a site outage.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 160" role="img" aria-label="Knobs: per request quorum, per table TTL, per cluster vnode and repair">
            <rect class="dg-box b" x="16" y="24" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="46" text-anchor="middle">per request</text>
            <text class="dg-s" x="126" y="64" text-anchor="middle">W, R, timeout</text>
            <rect class="dg-box c" x="252" y="24" width="220" height="56" rx="7" />
            <text class="dg-s" x="362" y="46" text-anchor="middle">per table</text>
            <text class="dg-s" x="362" y="64" text-anchor="middle">TTL, gc_grace, LWW</text>
            <rect class="dg-box o" x="488" y="24" width="216" height="56" rx="7" />
            <text class="dg-s" x="596" y="46" text-anchor="middle">per cluster</text>
            <text class="dg-s" x="596" y="64" text-anchor="middle">vnodes, repair, hints</text>
            <text class="dg-s" x="16" y="108">A cart table: siblings on, LOCAL_QUORUM, no TTL. A session table: LWW, TTL 86400, ONE for get is often enough.</text>
            <text class="dg-s" x="16" y="126">Same ring, different product contracts. That is configurability. Two clusters is what you do when compaction profiles fight.</text>
            <text class="dg-s" x="16" y="144">Document the defaults in the design doc or every client will pick ALL after the first incident.</text>
          </svg>
          <figcaption>Figure 8 — Knobs are part of the design. A store with no knobs will be forked into three stores by Christmas.</figcaption>
        </figure>
      `,
    },
    {
      id: 'kv-fault',
      title: 'Enable Fault Tolerance and Failure Detection',
      children: [
        { id: 'kv-repair', title: 'Read repair and Merkle anti-entropy' },
        { id: 'kv-gossip', title: 'Gossip and phi-accrual failure detection' },
        { id: 'kv-eval', title: 'Evaluation: what this design refuses to do' },
      ],
      html: `
        <p>Quorums keep the happy path available. They do not make replicas identical. A node that was down for an hour, a hint that expired, a put that acked on two nodes and fsynced on one — the cluster drifts. Fault tolerance is detecting the dead, stopping coordinators from waiting on them, and copying bytes until the replica set agrees again.</p>

        <h3 class="lesson-subhead" id="kv-repair">Read repair and Merkle anti-entropy</h3>
        <p><strong>Read repair:</strong> a get with R=2 receives two values. If they differ, the coordinator writes the merged (or latest) value back to the stale replica, asynchronously. Cheap, opportunistic, only covers keys that are read. A cold key that was written during an outage stays wrong until something else notices.</p>
        <p><strong>Anti-entropy</strong> covers the cold keys. Each node keeps a <strong>Merkle tree</strong> (hash tree) over the keys it owns, typically per vnode range. Two nodes exchange root hashes; if they differ they walk down the tree until they find the differing leaves, then stream only those keys. Comparing 5 billion keys by sending every key would be a full-table copy; a Merkle tree turns that into a handful of hashes plus a delta. Cassandra repair, Dynamo Merkle sync, Riak AAE (active anti-entropy) are this loop on a schedule (daily, or after a node join).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Merkle tree comparison of two replicas exchanging hashes down to a differing leaf">
            <defs>
              <marker id="ah-kv5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="80" y="16" width="200" height="32" rx="6" />
            <text class="dg-s" x="180" y="36" text-anchor="middle">root hash A</text>
            <rect class="dg-box o" x="440" y="16" width="200" height="32" rx="6" />
            <text class="dg-s" x="540" y="36" text-anchor="middle">root hash B</text>
            <rect class="dg-box g" x="16" y="68" width="150" height="32" rx="6" />
            <text class="dg-s" x="91" y="88" text-anchor="middle">left match</text>
            <rect class="dg-box r" x="196" y="68" width="150" height="32" rx="6" />
            <text class="dg-s" x="271" y="88" text-anchor="middle">right differs</text>
            <rect class="dg-box r" x="376" y="68" width="150" height="32" rx="6" />
            <text class="dg-s" x="451" y="88" text-anchor="middle">right differs</text>
            <rect class="dg-box y" x="196" y="116" width="330" height="32" rx="6" />
            <text class="dg-s" x="361" y="136" text-anchor="middle">stream only the differing leaves</text>
            <path class="dg-line cyan" d="M280 32 H432" marker-end="url(#ah-kv5)" />
            <text class="dg-s" x="16" y="172">If roots match, stop. If not, recurse. Repair bandwidth is proportional to divergence, not to total data.</text>
            <text class="dg-s" x="16" y="190">A node down for a day diverges a lot; budget disk and net for that repair or it never catches up.</text>
          </svg>
          <figcaption>Figure 9 — Merkle repair is why Dynamo could claim durability after a long outage without scanning every key on the wire.</figcaption>
        </figure>
        <p>Repair is not free. It reads SSTables, computes hashes, and writes back. Run it in the quiet hours, limit concurrency, and never assume a cluster that skipped repair for a month is "fine because quorum still works". Quorum hides the rot until the remaining good replica dies.</p>

        <h3 class="lesson-subhead" id="kv-gossip">Gossip and phi-accrual failure detection</h3>
        <p>Nodes must know who is alive without a central health service that is itself a SPOF. <strong>Gossip</strong>: each node periodically exchanges a digest of cluster state (alive, tokens, schema version) with a random peer, with infection-style spread. Membership of 36 nodes converges in a few seconds. The same channel carries the token map the coordinator needs.</p>
        <p><strong>Phi-accrual</strong> (Hayashibara et al., used in Cassandra, Akka) is the failure detector. Instead of "if heartbeat missed for 10 s, dead", it models inter-arrival times of heartbeats and outputs a suspicion level φ. φ=1 means roughly 10% chance the node is down given the history; φ=8 is very sure. Operators set a threshold (Cassandra's phi_convict_threshold, often 8–12). The point is to adapt to a network that is usually 1 ms and sometimes 80 ms, without flapping on the 80 ms blip or waiting 30 s every time.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Phi accrual suspicion grows with missed heartbeats then a node is convicted">
            <rect class="dg-box g" x="16" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="44" text-anchor="middle">heartbeats OK</text>
            <text class="dg-s" x="96" y="60" text-anchor="middle">phi near 0</text>
            <rect class="dg-box y" x="204" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="284" y="44" text-anchor="middle">delay 80 ms</text>
            <text class="dg-s" x="284" y="60" text-anchor="middle">phi rises</text>
            <rect class="dg-box o" x="392" y="24" width="150" height="48" rx="7" />
            <text class="dg-s" x="467" y="44" text-anchor="middle">silence 2 s</text>
            <text class="dg-s" x="467" y="60" text-anchor="middle">phi ~ threshold</text>
            <rect class="dg-box r" x="570" y="24" width="134" height="48" rx="7" />
            <text class="dg-s" x="637" y="44" text-anchor="middle">convicted</text>
            <text class="dg-s" x="637" y="60" text-anchor="middle">skip in quorum</text>
            <text class="dg-s" x="16" y="100">A static 10 s timeout is either too eager on a jittery link or too slow for failover. Phi uses the link's own history.</text>
            <text class="dg-s" x="16" y="118">False conviction is expensive: the node is skipped, hints pile up, then it returns and repair storms. Tune the threshold with evidence.</text>
            <text class="dg-s" x="16" y="136">Gossip also spreads "this node is leaving" so coordinators stop including it in preference lists before disks are wiped.</text>
            <text class="dg-s" x="16" y="154">Failure detection is Chapter 3's timeout problem with a better estimator, not a different problem.</text>
          </svg>
          <figcaption>Figure 10 — Convict slowly enough to ignore jitter, fast enough that W=2 stops waiting on a dead disk.</figcaption>
        </figure>
        <p>Once convicted, the coordinator omits the node from the live preference list, sloppy-quorum kicks in, and hinted handoff starts. When φ drops and gossip says alive, the node is back in the list and must repair before you trust it as a natural replica for W.</p>
        <div class="lesson-callout">Do not use wall-clock "last heartbeat older than T" across a WAN with a single T. A busy GC pause of 4 s on a JVM node looks identical to death. Phi plus a "I am paused" gossip message (or a dedicated liveness process outside the heap) is the grown-up version. Cassandra's history of GC-induced flaps is the cautionary tale.</div>

        <h3 class="lesson-subhead" id="kv-eval">Evaluation: what this design refuses to do</h3>
        <p>This store is excellent at get/put of a known key with tunable availability. It is the wrong architecture for several things, and saying so is part of the design.</p>
        <p><strong>No range queries.</strong> Keys are hashed; adjacent user ids do not sit on one node. "All keys between A and B" is a cluster scan. If you need ranges, use order-preserving partitioning (and accept hot shards) or a different engine (Chapter 9 wide-column with an explicit partition key plus clustering columns — Cassandra the product can do both, Dynamo the paper cannot).</p>
        <p><strong>No multi-key transactions.</strong> W+R&gt;N is per key. Moving money between two keys can lose one side. There is no 2PC in this design; a saga in the application is the honest answer. Lightweight transactions (Cassandra Paxos per partition, DynamoDB transact-write) are a different protocol bolted on — mention them as an extension, do not pretend the quorum KV already has them.</p>
        <p><strong>No cheap uniqueness across keys, no join, no serialisable isolation.</strong> Concurrent siblings are a feature. If the product cannot merge, you pushed a leader problem into the client.</p>
        <p><strong>Operational cost:</strong> repair, compaction, tombstone GC, JVM or native GC, and the 3× storage tax. A 36-node LSM cluster is a team, not a weekend. For 20 GB of data, Postgres is still the answer from Chapter 9's estimate.</p>
        <p>Compared with a single-leader store: you gained AZ-outage puts and linear scale-out of writes. You lost a single linearisable timeline, SQL, and the ability to say "this read is the committed truth" without extra protocol. Dynamo, Cassandra and Riak all made that trade on purpose. Your interview answer should too.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) N=3, W=2, R=2 — why does a get still see a put if one replica was down during the put, and what does sloppy quorum do to that proof? (2) Draw clocks {A:2} and {A:1,B:1} and say whether they are ordered or concurrent, and what get() must return. (3) Why is hash-mod-N still wrong here even though we hash, and what do vnodes change? (4) Name two reasons LWW is dangerous for a shopping cart, and one kind of value where LWW is fine.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Dynamo, Cassandra and Riak are public industry designs; the walkthrough, figures, estimates and exercises here are original to this course.',
};
