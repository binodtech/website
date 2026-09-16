/** Modern System Design — Chapter 16: Distributed Cache.
 *  Why RAM is the only place hot keys can live, and how a cache cluster fails.
 */

export const msdDistributedCache = {
  slug: 'distributed-cache',
  title: 'Distributed Cache',
  subtitle:
    'A distributed cache is a shared RAM tier in front of a slower store. It exists because disks cannot serve a Zipf-shaped read mix at the latency users will tolerate, and it fails the moment eviction, invalidation, or hashing is treated as an afterthought.',
  byline: 'Modern System Design · Chapter 16 · ~2h 20m read · Intermediate',
  interviewTip:
    'Do not say "we will add Redis" and sit down. Name the cache key, the write policy, the TTL, and what happens when the cluster disappears. "Read-through on product pages, write-through on inventory, 60-second TTL plus explicit invalidation on publish, and if the cache dies we shed 70% of traffic rather than melt the database" is a design. Then mention stampede coalescing and hot-key fan-out — those two sentences separate people who have run caches from people who have read a slide.',
  sections: [
    {
      id: 'dc-problem',
      title: 'System Design: The Distributed Cache',
      children: [
        { id: 'dc-p-why', title: 'The 80-20 mix that disks cannot serve' },
        { id: 'dc-p-hit', title: 'Hit-ratio arithmetic, with real numbers' },
        { id: 'dc-p-where', title: 'Where a cache can sit' },
        { id: 'dc-p-map', title: 'How this chapter proceeds' },
      ],
      html: `
        <p>A product catalogue of ten million SKUs is not ten million equally popular SKUs. A handful of items soak up most of the reads. That skew is not a bug in the data; it is how humans browse. The database still has to store the long tail, but it does not have to answer the head on every request, and it cannot — not at the latency a page will tolerate.</p>
        <p>This chapter is the design of the RAM tier that sits in front of that store. The idea is simple. The failure modes are not. A cache that is merely "Redis in front of Postgres" will look correct in a whiteboard sketch and then take the database down the first time it restarts, the first time a celebrity lands on one key, or the first time a write races a read.</p>

        <h3 class="lesson-subhead" id="dc-p-why">The 80-20 mix that disks cannot serve</h3>
        <p>Locality of reference is the only reason caches work. Temporal locality: the SKU you just looked at is likely to be looked at again in the next few seconds, by you or by someone else. Spatial locality: neighbouring keys — other SKUs in the same category — tend to be requested together. Zipf's law is the empirical shape of that locality on the internet: rank <em>r</em> is requested about 1/<em>r</em> as often as rank 1.</p>
        <p>The 80-20 rule of thumb is crude and useful. If 20% of keys receive 80% of reads, then a cache that holds that 20% in RAM answers most traffic without touching disk. RAM is roughly a hundred times faster than an SSD random read and a thousand times faster than a spinning disk. The cost is capacity: a 64 GB cache node holds far fewer rows than a 4 TB disk, so the cache is a filter, not a copy of the database.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="A Zipf-shaped request mix with a small RAM cache covering the hot head and disk covering the long tail">
            <defs>
              <marker id="ah-dc1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">MOST READS HIT A TINY HEAD. THAT IS THE ONLY CACHE YOU NEED.</text>
            <rect class="dg-band o" x="12" y="36" width="220" height="168" rx="10" />
            <text class="dg-h" x="26" y="56">HOT HEAD</text>
            <text class="dg-s" x="26" y="78">20% of keys</text>
            <text class="dg-s" x="26" y="94">80% of reads</text>
            <text class="dg-s" x="26" y="118">Lives in RAM.</text>
            <text class="dg-s" x="26" y="134">Sub-millisecond.</text>
            <text class="dg-s" x="26" y="158">This is the cache.</text>
            <rect class="dg-band b" x="250" y="36" width="220" height="168" rx="10" />
            <text class="dg-h" x="264" y="56">WARM MIDDLE</text>
            <text class="dg-s" x="264" y="78">30% of keys</text>
            <text class="dg-s" x="264" y="94">15% of reads</text>
            <text class="dg-s" x="264" y="118">Sometimes cached.</text>
            <text class="dg-s" x="264" y="134">TTL decides.</text>
            <rect class="dg-band k" x="488" y="36" width="220" height="168" rx="10" />
            <text class="dg-h" x="502" y="56">LONG TAIL</text>
            <text class="dg-s" x="502" y="78">50% of keys</text>
            <text class="dg-s" x="502" y="94">5% of reads</text>
            <text class="dg-s" x="502" y="118">Stay on disk.</text>
            <text class="dg-s" x="502" y="134">Caching them wastes RAM.</text>
            <path class="dg-line blue" d="M232 120 H246" marker-end="url(#ah-dc1)" />
            <path class="dg-line blue" d="M470 120 H484" marker-end="url(#ah-dc1)" />
          </svg>
          <figcaption>Figure 1 — Locality is a filter. The cache exists to hold the head, not to pretend RAM is cheaper than disk.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dc-p-hit">Hit-ratio arithmetic, with real numbers</h3>
        <p>Average latency is not a feel-good metric. It is a weighted sum, and the weights are the hit ratio. Write it down before you pick a cache size.</p>
        <pre><code>L_avg = H * L_cache + (1 - H) * L_miss

  H          = hit ratio
  L_cache    = ~0.5 ms  (same-AZ Redis GET)
  L_miss     = L_cache + L_db  (~0.5 + 8 ms = 8.5 ms on a warm SSD)

  H = 0.80  →  L_avg = 0.8*0.5 + 0.2*8.5 = 2.1 ms
  H = 0.95  →  L_avg = 0.95*0.5 + 0.05*8.5 = 0.90 ms
  H = 0.50  →  L_avg = 0.5*0.5 + 0.5*8.5 = 4.5 ms</code></pre>
        <p>The jump from 80% to 95% more than halves average latency. The jump from 50% to 80% is smaller than it feels, and a 50% cache is often worse than no cache at all once you count the extra hop, the stampede risk, and the operational cost. Throughput follows the same weights: at 10,000 QPS and H = 0.80 the database sees 2,000 QPS; at H = 0.95 it sees 500. That is the origin-offload argument from the CDN chapter, applied inside the datacentre.</p>
        <p>RAM versus disk is the other half of the arithmetic. A 64 GB cache of 2 KB values holds about 32 million entries. If the working set of hot keys is 8 million, you have headroom. If it is 80 million, you will thrash: every insertion evicts something that is about to be read again, H collapses, and the database inherits the full mix plus the cache's own miss traffic.</p>
        <div class="lesson-callout"><strong>Size the cache to the working set, not to the catalogue.</strong> Ten million SKUs of 2 KB is 20 GB on disk and looks cacheable. If 80% of reads concentrate on 200,000 SKUs, you need about 400 MB of RAM plus overhead, not 20 GB. Caching the tail is how teams buy a cluster they never hit.</div>

        <h3 class="lesson-subhead" id="dc-p-where">Where a cache can sit</h3>
        <p>Location is a requirement, not a brand. Each place on the path buys a different latency and a different consistency headache.</p>
        <table>
          <thead><tr><th>Location</th><th>Typical hit</th><th>Shared?</th><th>What it is good for</th></tr></thead>
          <tbody>
            <tr><td>Browser / app</td><td>0 ms after first fetch</td><td>No</td><td>Immutable assets, user-private data</td></tr>
            <tr><td>CDN / edge</td><td>5–20 ms</td><td>Per PoP</td><td>Public pages, images, see Chapter 11</td></tr>
            <tr><td>Local in-process</td><td>&lt;0.05 ms</td><td>No</td><td>Config, feature flags, tiny hot maps</td></tr>
            <tr><td>Distributed cache</td><td>0.3–1 ms same AZ</td><td>Yes</td><td>Shared working set in front of a DB</td></tr>
            <tr><td>Database buffer pool</td><td>0.1 ms inside the DB</td><td>Yes, but opaque</td><td>Pages the engine already decided to keep</td></tr>
          </tbody>
        </table>
        <p>This chapter is the shared, addressable RAM tier — Memcached or Redis as a cluster — because that is the one you design in an interview. The others still exist. An in-process cache in front of Redis in front of Postgres is common and correct; each layer must have a TTL shorter than the one behind it or you will serve fossils.</p>

        <h3 class="lesson-subhead" id="dc-p-map">How this chapter proceeds</h3>
        <p>Background first: write policies, eviction, invalidation. Then a high-level design with consistent hashing. Then the details that actually break production — stampedes, hot keys, negative caching, cold start, the cache/database race. Then an evaluation that assumes the cache tier dies. Then Memcached versus Redis, which is a choose-when, not a brand war.</p>
        <p>Functional requirements: get, set, delete by key; TTL; optional bulk get. Non-functional: sub-millisecond p50 in-AZ, survive a node loss without reshuffling the whole keyspace, and fail in a way the database can survive. We will put numbers on those as we go, using the estimation habits of <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>.</p>
      `,
    },
    {
      id: 'dc-background',
      title: 'Background of Distributed Cache',
      children: [
        { id: 'dc-b-aside', title: 'Cache-aside versus the through-family' },
        { id: 'dc-b-write', title: 'Write-through, write-back, write-around' },
        { id: 'dc-b-evict', title: 'LRU, LFU and TTL are not the same decision' },
        { id: 'dc-b-inval', title: 'Invalidation is the hard part' },
      ],
      html: `
        <p>Before drawing boxes, name the contract between the application, the cache and the database. That contract is the write policy, and every later failure mode is a consequence of it.</p>

        <h3 class="lesson-subhead" id="dc-b-aside">Cache-aside versus the through-family</h3>
        <p><strong>Cache-aside</strong> (lazy loading) puts the application in charge. On a read, the app asks the cache. On a miss it loads from the database, then fills the cache. On a write it writes the database and then deletes (or overwrites) the cache key. The cache does not know the database exists. That ignorance is the point: the cache stays a dumb dictionary, which is why Memcached can be so fast.</p>
        <p>The cost is that every caller must get the sequence right. Two app instances can both miss, both load, both write — that is a stampede, treated later. A writer can update the database and crash before deleting the key, leaving a stale value until TTL. Cache-aside is the default for a reason: it is explicit, and explicit is debuggable.</p>
        <p><strong>Read-through</strong> hides the miss path inside the cache library or a cache proxy. The app always talks to the cache; on a miss the cache itself loads the store. Coalescing a thundering herd is easier because one component sees every miss. The cost is coupling: the cache now needs credentials, a loader, and a story for loader failure.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Cache-aside with the application loading the database on miss versus read-through where the cache loads the store">
            <defs>
              <marker id="ah-dc2a" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-dc2b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="180" rx="10" />
            <text class="dg-h" x="26" y="36">CACHE-ASIDE</text>
            <rect class="dg-box b" x="26" y="48" width="120" height="28" rx="6" />
            <text class="dg-s" x="86" y="66" text-anchor="middle">application</text>
            <rect class="dg-box c" x="210" y="48" width="120" height="28" rx="6" />
            <text class="dg-s" x="270" y="66" text-anchor="middle">cache</text>
            <rect class="dg-box o" x="210" y="140" width="120" height="28" rx="6" />
            <text class="dg-s" x="270" y="158" text-anchor="middle">database</text>
            <path class="dg-line blue" d="M146 62 H206" marker-end="url(#ah-dc2a)" />
            <path class="dg-line blue dash" d="M86 76 V154 H206" marker-end="url(#ah-dc2a)" />
            <text class="dg-s" x="26" y="100">App fills on miss.</text>
            <text class="dg-s" x="26" y="116">Cache is a dictionary.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="180" rx="10" />
            <text class="dg-h" x="382" y="36">READ-THROUGH</text>
            <rect class="dg-box b" x="382" y="48" width="120" height="28" rx="6" />
            <text class="dg-s" x="442" y="66" text-anchor="middle">application</text>
            <rect class="dg-box c" x="560" y="48" width="120" height="28" rx="6" />
            <text class="dg-s" x="620" y="66" text-anchor="middle">cache</text>
            <rect class="dg-box o" x="560" y="140" width="120" height="28" rx="6" />
            <text class="dg-s" x="620" y="158" text-anchor="middle">database</text>
            <path class="dg-line green" d="M502 62 H556" marker-end="url(#ah-dc2b)" />
            <path class="dg-line green" d="M620 76 V140" marker-end="url(#ah-dc2b)" />
            <text class="dg-s" x="382" y="100">App only talks to cache.</text>
            <text class="dg-s" x="382" y="116">Cache owns the miss path.</text>
          </svg>
          <figcaption>Figure 2 — Who loads the store is the design. Cache-aside keeps the cache dumb; read-through makes stampedes one component's problem.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dc-b-write">Write-through, write-back, write-around</h3>
        <p><strong>Write-through</strong> writes the cache and the database in the same request, typically cache then store, or store then cache, with a defined order. Reads after a successful write see the new value if they hit the same cache. Latency of the write is the sum of both stores. Use it when stale reads after a write are unacceptable and the write rate is modest — inventory counts, not click streams.</p>
        <p><strong>Write-back</strong> (write-behind) writes the cache immediately and flushes to the database later, often in batches. Write latency looks like RAM. Durability looks like a sticky note. If the cache node dies before flush, those writes vanish. Write-back is for derived data you can rebuild, or for a system that already has a WAL in front of the cache. It is almost never the right first answer in an interview unless you name the durability hole.</p>
        <p><strong>Write-around</strong> writes only the database and lets the cache fill on the next read. It avoids polluting the cache with write-once keys (logs, rare SKUs). The first reader after a write always misses. Combine it with cache-aside when the write mix is much larger than the read mix of those keys.</p>
        <table>
          <thead><tr><th>Policy</th><th>Write path</th><th>Read freshness</th><th>When to pick it</th></tr></thead>
          <tbody>
            <tr><td>Cache-aside</td><td>App writes DB, deletes key</td><td>Stale until delete or TTL</td><td>Default. Keep the cache dumb.</td></tr>
            <tr><td>Write-through</td><td>Cache and DB in one request</td><td>Fresh on that cache</td><td>Correctness over write latency</td></tr>
            <tr><td>Write-back</td><td>Cache now, DB later</td><td>Fresh in cache, DB lags</td><td>Only if loss is acceptable</td></tr>
            <tr><td>Write-around</td><td>DB only</td><td>First read misses</td><td>Write-heavy, rarely re-read keys</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="dc-b-evict">LRU, LFU and TTL are not the same decision</h3>
        <p><strong>LRU</strong> evicts the key that has gone longest without a hit. It matches temporal locality. It fails on scans: a one-shot crawl of the tail pushes the working set out. <strong>LFU</strong> evicts the least frequently used key, which protects a celebrity key that is hit constantly, and punishes a key that was hot yesterday. Production systems often use an approximation (Redis's eviction is a sampled LRU by default) because exact LRU on millions of keys is itself a data structure problem.</p>
        <p><strong>TTL</strong> is not an eviction algorithm. It is a freshness bound. A key can be LRU-hot and still expired. Always set a TTL even when you also invalidate explicitly: invalidation is a best-effort signal; TTL is the backstop that stops a missed delete from living forever. Typical product-page TTLs are 30–120 seconds. Config might be 5 seconds. Immutable versioned blobs can be hours.</p>
        <div class="lesson-callout"><strong>TTL is a consistency budget, not a memory trick.</strong> Setting TTL to "never" because RAM is plentiful is how a deleted comment stays on the site until someone reboots the cluster. Memory pressure is LRU's job. Staleness is TTL's job. Do not hire one to do the other.</div>

        <h3 class="lesson-subhead" id="dc-b-inval">Invalidation is the hard part</h3>
        <p>There are only two hard things in computer science, and this is one of them for a reason. A cache key is a function of the query. If the same product is cached as <code>product:42</code>, as a fragment of <code>category:shoes:page:1</code>, and as part of a search document, a price change must find every function or wait for TTL. Versioned keys (<code>product:42:v17</code>) make the old key unreachable without a broadcast, which is the CDN trick applied inside the datacentre.</p>
        <p>Explicit delete-on-write is the honest cache-aside path. Pub-sub invalidation (the next chapter) fans a "key 42 changed" event to every cache node. That is how a multi-node in-process cache stays vaguely coherent. It is not instantaneous, and it is not free. If you cannot name the key function, you do not have an invalidation strategy — you have a TTL and a prayer.</p>
      `,
    },
    {
      id: 'dc-hld',
      title: 'High-Level Design of a Distributed Cache',
      children: [
        { id: 'dc-h-api', title: 'The interface is a dictionary' },
        { id: 'dc-h-shard', title: 'Why naive sharding reshuffles everything' },
        { id: 'dc-h-hash', title: 'Consistent hashing, with virtual nodes' },
        { id: 'dc-h-nf', title: 'Requirements, written as numbers' },
      ],
      html: `
        <p>A distributed cache is a fleet of memory-bound processes, a way to map a key to a process, and a client library that hides that map. There is no query planner. If you need a secondary index you have left the cache and entered a database.</p>

        <h3 class="lesson-subhead" id="dc-h-api">The interface is a dictionary</h3>
        <pre><code>GET    key            →  value | miss
SET    key, value, ttl
DEL    key
MGET   key...         →  values in key order, misses as holes
INCR   key            →  integer  (atomic; Redis, not Memcached's strength)</code></pre>
        <p>That is almost the whole API you should admit on a whiteboard. CAS (compare-and-set) exists for people who want a lock without building a lock service. Expiry is per key. There is no transaction that spans keys on different nodes unless you add one, and adding one is how you accidentally build a database.</p>
        <p>Clients are typically in-process libraries: they hash, they pick a node, they speak a simple binary protocol. A proxy (Twemproxy, Envoy) sits in front when you do not want every language to implement hashing. The proxy is another hop (~0.1 ms) and another thing that can die; it is worth it when client diversity is the problem.</p>

        <h3 class="lesson-subhead" id="dc-h-shard">Why naive sharding reshuffles everything</h3>
        <p>Modulo hashing — <code>node = hash(key) % N</code> — is correct until N changes. Add a node, and almost every key maps somewhere new. The new node is empty. The old nodes still hold values nobody will ask them for. Hit ratio collapses to near zero. The database sees a cold-start storm. This is not a theoretical complaint; it is the incident report after "we scaled the cache from 8 to 9 nodes".</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Modulo hashing moving almost every key when a fourth node is added versus consistent hashing moving only a slice">
            <defs>
              <marker id="ah-dc3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">MODULO · ADD ONE NODE</text>
            <text class="dg-s" x="26" y="60">hash % 3  →  hash % 4</text>
            <text class="dg-s" x="26" y="80">~75% of keys remap.</text>
            <text class="dg-s" x="26" y="100">Cluster looks empty.</text>
            <text class="dg-s" x="26" y="120">Database inherits a storm.</text>
            <rect class="dg-box r" x="26" y="140" width="300" height="28" rx="6" />
            <text class="dg-s" x="176" y="158" text-anchor="middle">do not scale this way</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="168" rx="10" />
            <text class="dg-h" x="382" y="36">CONSISTENT HASH · ADD ONE</text>
            <text class="dg-s" x="382" y="60">Ring position decides owner.</text>
            <text class="dg-s" x="382" y="80">Only ~1/N of keys move.</text>
            <text class="dg-s" x="382" y="100">Old nodes keep their rest.</text>
            <text class="dg-s" x="382" y="120">Hit ratio dips, then recovers.</text>
            <rect class="dg-box g" x="382" y="140" width="300" height="28" rx="6" />
            <text class="dg-s" x="532" y="158" text-anchor="middle">this is the HLD</text>
            <path class="dg-line rose" d="M356 100 H364" marker-end="url(#ah-dc3)" />
          </svg>
          <figcaption>Figure 3 — Scaling a cache is a hashing problem. If adding capacity flushes the working set, you did not add capacity.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dc-h-hash">Consistent hashing, with virtual nodes</h3>
        <p>Place nodes on a ring of 2<sup>32</sup> (or 2<sup>64</sup>) positions. Hash the key onto the same ring. Walk clockwise to the first node. When a node joins, it takes a slice from its clockwise neighbour; when it leaves, that neighbour inherits the slice. Expected movement is about 1/N of keys. That is the entire trick.</p>
        <p>One physical node at one ring position is a bad idea: random placement is lumpy, and a fat node still owns one arc. Give each physical node hundreds of <strong>virtual nodes</strong> (vnodes) — extra ring positions that all route to the same process. Load spreads. When a 64 GB box dies, its vnodes scatter across the remaining fleet instead of dumping a contiguous 1/N onto one victim.</p>
        <p>Replication of cache data is optional and expensive. Memcached traditionally does not replicate: a miss is a miss, reload from DB. Redis Cluster can replicate. Replicating a cache buys you fewer misses on node death and a new consistency problem (which replica is source of truth). For a pure cache, prefer reload-from-store over replica-of-cache unless the miss is ruinously expensive to recompute.</p>

        <h3 class="lesson-subhead" id="dc-h-nf">Requirements, written as numbers</h3>
        <p>Functional: GET/SET/DEL/MGET; per-key TTL; cluster membership that does not remap the world. Non-functional, for a 50,000 QPS product page:</p>
        <pre><code>Working set     8e6 keys × 2 KB  ≈ 16 GB  (+ 30% overhead ≈ 21 GB)
Nodes           4 × 16 GB RAM, 50% full  (headroom for hot-key copies)
p50 GET         &lt; 1 ms in-AZ
p99 GET         &lt; 5 ms  (tail is network + busy node, not disk)
Hit ratio       ≥ 90% after warmup
Node loss       ≤ 1/N extra miss rate, no full flush
Cache-down      DB protected by load shed, not hope</code></pre>
        <p>Those numbers are the design. The next section is everything that still goes wrong when hashing is correct.</p>
      `,
    },
    {
      id: 'dc-detailed',
      title: 'Detailed Design of a Distributed Cache',
      children: [
        { id: 'dc-d-stampede', title: 'Stampede coalescing' },
        { id: 'dc-d-hot', title: 'Hot keys and negative caching' },
        { id: 'dc-d-cold', title: 'Cold start is a planned outage' },
        { id: 'dc-d-race', title: 'The cache versus database race' },
      ],
      html: `
        <p>Hashing gets keys onto nodes. Production is about what happens when a popular key expires, when one key is too popular, when the cluster is empty, and when a write and a fill pass each other in the night.</p>

        <h3 class="lesson-subhead" id="dc-d-stampede">Stampede coalescing</h3>
        <p>A hot key expires. Ten thousand concurrent requests miss at once. All ten thousand hit the database for the same row. The database, sized for the 10% miss rate, receives a 100× spike on one query. This is a <strong>thundering herd</strong> or cache stampede. TTL alignment makes it worse: if every key was filled in a burst, they expire in a burst.</p>
        <p>Coalescing means only one miss is allowed to load the store; the others wait for that fill. Read-through caches do this naturally. Cache-aside needs a lock, a single-flight primitive, or a "please wait, refill in progress" token. Probabilistic early expiry — refresh a key slightly before TTL with probability proportional to remaining life — spreads the refill. Jittered TTLs stop synchronized expiry.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Many concurrent misses hitting the database versus a single coalesced load that fills the cache for waiters">
            <defs>
              <marker id="ah-dc4a" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-dc4b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">STAMPEDE</text>
            <rect class="dg-box r" x="26" y="48" width="90" height="24" rx="5" />
            <text class="dg-s" x="71" y="64" text-anchor="middle">10k waits</text>
            <rect class="dg-box o" x="220" y="88" width="110" height="36" rx="6" />
            <text class="dg-s" x="275" y="110" text-anchor="middle">database</text>
            <path class="dg-line rose" d="M116 60 H170 V106 H216" marker-end="url(#ah-dc4a)" />
            <text class="dg-s" x="26" y="150">Every miss becomes a query.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="168" rx="10" />
            <text class="dg-h" x="382" y="36">COALESCED</text>
            <rect class="dg-box g" x="382" y="48" width="90" height="24" rx="5" />
            <text class="dg-s" x="427" y="64" text-anchor="middle">10k waits</text>
            <rect class="dg-box c" x="520" y="48" width="90" height="24" rx="5" />
            <text class="dg-s" x="565" y="64" text-anchor="middle">1 loader</text>
            <rect class="dg-box o" x="560" y="108" width="110" height="36" rx="6" />
            <text class="dg-s" x="615" y="130" text-anchor="middle">database</text>
            <path class="dg-line green" d="M472 60 H516" marker-end="url(#ah-dc4b)" />
            <path class="dg-line green" d="M565 72 V108" marker-end="url(#ah-dc4b)" />
            <text class="dg-s" x="382" y="168">Waiters share one fill.</text>
          </svg>
          <figcaption>Figure 4 — Coalescing turns a herd into a queue. The database still pays for the miss; it does not pay ten thousand times.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dc-d-hot">Hot keys and negative caching</h3>
        <p>A celebrity product, a viral post, a login token for a bot army — one key can saturate a single cache node's NIC. Consistent hashing will not save you; hashing is why the heat is concentrated. Mitigations: replicate that key onto several nodes and pick at random; add a tiny in-process cache in the application for the hottest N keys; split the value (sharded counters) so no single key is the entire truth.</p>
        <p><strong>Negative caching</strong> stores the fact of a miss. "User 999999 does not exist" is a result. Without a negative entry, every probe for a missing key is a database hit, which is exactly what attackers and broken clients do. Negative entries need short TTLs — 10–30 seconds — because creating the user should not wait an hour to become visible. Cache-aside fills negatives on empty DB results the same way it fills positives.</p>

        <h3 class="lesson-subhead" id="dc-d-cold">Cold start is a planned outage</h3>
        <p>A new cluster, a region failover, a rolling restart that emptied RAM: hit ratio starts at 0%. At 50,000 QPS that is 50,000 QPS on the database until the working set refills. If the working set is 8 million keys at 2 KB, you must move 16 GB through the database and the cache NIC. At 200 MB/s that is more than a minute of overload, not a blip.</p>
        <p>Warm the cache before you send traffic: replay yesterday's key log, copy from a replica that was left up, or load-shed until H recovers. Rolling restarts should replace one node at a time so 1/N of keys miss, not all of them. If your deploy story is "restart the pool", your deploy story is an incident.</p>
        <div class="lesson-callout"><strong>Treat cache empty as a feature flag, not a surprise.</strong> A health check that is only "process is up" will send 100% of traffic at an empty node. Gate on hit ratio or on a warmup flag. The database's capacity plan assumed a warm cache; honour that assumption operationally.</div>

        <h3 class="lesson-subhead" id="dc-d-race">The cache versus database race</h3>
        <p>The classic cache-aside race: request A reads the database (old value), request B writes the database (new value) and deletes the cache key, then A fills the cache with the old value. The delete happened, the fill happened later, and the cache is now permanently stale until TTL.</p>
        <p>Fixes, none of them free: (1) fill only if the key is still absent, using SETNX, which still loses if the delete already happened and A is filling an empty slot with old data — so this is not sufficient alone; (2) version the value in the database and refuse to cache a version older than the last write; (3) delete-after-read with a short lock around the fill; (4) write-through so the writer owns the cache key. In interviews, naming the race is worth more than a perfect lock protocol. Then pick write-through for the few keys that must not be stale, and TTL-plus-delete for the rest.</p>
        <p>Lease / CAS tokens (Memcached leases, Redis GET with version) exist so a filler can abort if someone else wrote. Use them when the stale window is a product bug, not when it is a slightly outdated view count.</p>
      `,
    },
    {
      id: 'dc-eval',
      title: "Evaluation of a Distributed Cache's Design",
      children: [
        { id: 'dc-e-death', title: 'What happens when the cache tier dies' },
        { id: 'dc-e-short', title: 'Where this design still falls short' },
      ],
      html: `
        <p>A cache that is in the request path is a dependency, even if every value is recoverable. Evaluation means asking what the system does when that dependency is wrong, slow, or gone — the same honesty <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a> demanded of availability numbers.</p>

        <h3 class="lesson-subhead" id="dc-e-death">What happens when the cache tier dies</h3>
        <p>If the cache is optional, the correct failure is to skip it and hit the database. If the database was sized for 10% of QPS, that "correct" failure is an outage. So cache-down is not a boolean. It is a load-shed decision: serve stale from a dying node if you still can, return 503 for the tail, keep login and checkout on a tiny reserved DB pool, and never let a retry loop from the web tier multiply the remaining QPS.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Cache cluster failure with traffic either melting the database or being shed at the edge">
            <defs>
              <marker id="ah-dc5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="28" width="140" height="40" rx="7" />
            <text class="dg-s" x="86" y="52" text-anchor="middle">cache dead</text>
            <rect class="dg-box y" x="220" y="16" width="200" height="64" rx="7" />
            <text class="dg-t" x="320" y="40" text-anchor="middle">no shed</text>
            <text class="dg-s" x="320" y="58" text-anchor="middle">DB at 10× design QPS</text>
            <rect class="dg-box g" x="220" y="100" width="200" height="64" rx="7" />
            <text class="dg-t" x="320" y="124" text-anchor="middle">shed + stale</text>
            <text class="dg-s" x="320" y="142" text-anchor="middle">DB stays inside budget</text>
            <rect class="dg-box o" x="488" y="16" width="216" height="64" rx="7" />
            <text class="dg-s" x="596" y="40" text-anchor="middle">outage of everything</text>
            <text class="dg-s" x="596" y="58" text-anchor="middle">including the DB</text>
            <rect class="dg-box b" x="488" y="100" width="216" height="64" rx="7" />
            <text class="dg-s" x="596" y="124" text-anchor="middle">degraded reads</text>
            <text class="dg-s" x="596" y="142" text-anchor="middle">writes still land</text>
            <path class="dg-line rose" d="M156 40 H216" marker-end="url(#ah-dc5)" />
            <path class="dg-line rose dash" d="M156 56 V132 H216" marker-end="url(#ah-dc5)" />
            <path class="dg-line rose" d="M420 48 H484" marker-end="url(#ah-dc5)" />
            <path class="dg-line rose" d="M420 132 H484" marker-end="url(#ah-dc5)" />
          </svg>
          <figcaption>Figure 5 — Cache death is a capacity event. The design is the shed policy, not the hope that Redis will not crash.</figcaption>
        </figure>
        <p>Partial death — one node of N — should cost about 1/N extra misses if hashing is consistent. Watch for the secondary effect: clients retrying the dead node, timeouts stacking, thread pools filling. Timeouts on the cache path must be much shorter than the database timeout, or a dead cache makes every request wait the long timeout before falling through.</p>

        <h3 class="lesson-subhead" id="dc-e-short">Where this design still falls short</h3>
        <p>Consistent hashing with vnodes does not solve hot keys; it concentrates them. Cache-aside does not solve the fill race; it creates it. TTL does not solve multi-key invalidation. Write-back does not survive a power loss. A single-AZ cache does not survive an AZ. Multi-AZ cache replication fights the "dumb dictionary" model and still loses to a well-warmed local miss-reload if the store is fast enough.</p>
        <p>This design also says nothing about <em>what</em> you cache. Caching a user-specific HTML blob explodes cardinality and wrecks hit ratio. Caching a public product JSON with a 60-second TTL is the job this chapter is for. If the interview problem is a social feed, the cache key design is harder than the cluster design — and pretending otherwise is how you draw Redis and still fail.</p>
        <p>Multi-tenant fairness is missing. One noisy tenant can fill LRU with their tail and evict everyone else's head. Per-tenant memory budgets exist in some products and almost never in a first-cut whiteboard. Mention them if the prompt has tenants.</p>
      `,
    },
    {
      id: 'dc-mem-redis',
      title: 'Memcached versus Redis',
      children: [
        { id: 'dc-mr-model', title: 'Different tools, overlapping job' },
        { id: 'dc-mr-when', title: 'Choose when, not which brand' },
      ],
      html: `
        <p>Interviewers treat "Redis versus Memcached" as a personality test. It is a requirements test. Both are in-memory stores with a network protocol. They diverge on data structures, persistence, clustering, and what happens when RAM is full.</p>

        <h3 class="lesson-subhead" id="dc-mr-model">Different tools, overlapping job</h3>
        <table>
          <thead><tr><th></th><th>Memcached</th><th>Redis</th></tr></thead>
          <tbody>
            <tr><td>Model</td><td>Pure cache, keys and blobs</td><td>Data structure server</td></tr>
            <tr><td>Threads</td><td>Multi-threaded IO</td><td>Mostly single-threaded commands</td></tr>
            <tr><td>Persistence</td><td>None (by design)</td><td>Optional RDB/AOF</td></tr>
            <tr><td>Replication</td><td>Not the point</td><td>Replica, Cluster, Sentinel</td></tr>
            <tr><td>Eviction</td><td>LRU, slab allocator</td><td>Configurable policies</td></tr>
            <tr><td>Atomics</td><td>Limited (incr, CAS)</td><td>Rich (INCR, Lua, streams)</td></tr>
            <tr><td>Memory</td><td>Very efficient blobs</td><td>Higher overhead per key</td></tr>
          </tbody>
        </table>
        <p>Memcached's slab allocator groups similarly sized values so RAM is not shredded by allocator fragmentation. That is why it still wins on "billions of small blobs, nothing but GET/SET". Redis wins the moment you need a set, a sorted set, a lock, a rate limiter (next chapter), or a stream. Using Redis as a cache is fine and common; using Memcached as a queue is a category error.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Decision split: blobs and eviction go to Memcached, structures and atomics go to Redis">
            <defs>
              <marker id="ah-dc6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="28" width="160" height="48" rx="7" />
            <text class="dg-t" x="96" y="48" text-anchor="middle">need RAM GET</text>
            <text class="dg-s" x="96" y="64" text-anchor="middle">shared working set</text>
            <rect class="dg-box b" x="280" y="16" width="180" height="48" rx="7" />
            <text class="dg-t" x="370" y="36" text-anchor="middle">blobs + LRU</text>
            <text class="dg-s" x="370" y="52" text-anchor="middle">Memcached</text>
            <rect class="dg-box p" x="280" y="80" width="180" height="48" rx="7" />
            <text class="dg-t" x="370" y="100" text-anchor="middle">structs + INCR</text>
            <text class="dg-s" x="370" y="116" text-anchor="middle">Redis</text>
            <rect class="dg-box c" x="520" y="16" width="184" height="48" rx="7" />
            <text class="dg-s" x="612" y="36" text-anchor="middle">dumb dictionary</text>
            <text class="dg-s" x="612" y="52" text-anchor="middle">scale by hashing</text>
            <rect class="dg-box l" x="520" y="80" width="184" height="48" rx="7" />
            <text class="dg-s" x="612" y="100" text-anchor="middle">also locks, queues</text>
            <text class="dg-s" x="612" y="116" text-anchor="middle">do not pretend it is one</text>
            <path class="dg-line violet" d="M176 44 H276" marker-end="url(#ah-dc6)" />
            <path class="dg-line violet dash" d="M176 52 V104 H276" marker-end="url(#ah-dc6)" />
            <path class="dg-line violet" d="M460 40 H516" marker-end="url(#ah-dc6)" />
            <path class="dg-line violet" d="M460 104 H516" marker-end="url(#ah-dc6)" />
          </svg>
          <figcaption>Figure 6 — Pick the memory model, then the product. Persistence on a cache is a smell unless you have named a durability requirement.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dc-mr-when">Choose when, not which brand</h3>
        <p>Choose Memcached when the value is an opaque blob, the cluster should be empty after a crash, and you want simple horizontal scale with a client hash. Choose Redis when you need atomic counters, sets for unique views, sorted sets for leaderboards, or a primitive you will reuse for rate limiting. Choose neither as a source of truth for money. Redis with AOF enabled is still not your bank.</p>
        <p>Many production stacks run both: Memcached for rendered pages and Redis for sessions and counters. That is not indecision. It is refusing to make one process the answer to two different SLOs.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) At H = 0.9, L_cache = 0.5 ms, L_miss = 8.5 ms, what is average latency — and what QPS does the database see at 20,000 reads/s? (2) Why does adding a node with <code>hash % N</code> cause a stampede? (3) Describe the cache-aside fill race and one mitigation. (4) Cache cluster gone: why is "fall through to the database" not a complete answer?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Caching, eviction, hashing and write policies are standard industry ideas; every explanation, figure, table and exercise in this chapter is our own.',
};
