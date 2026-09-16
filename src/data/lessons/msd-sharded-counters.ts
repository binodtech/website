/** Modern System Design — Chapter 24: Sharded Counters.
 *  Single-row contention, N shards plus a rollup, exact versus HyperLogLog,
 *  CRDT PN-counters, inventory oversell, and never money.
 */

export const msdShardedCounters = {
  slug: 'sharded-counters',
  title: 'Sharded Counters',
  subtitle:
    'A popular counter on a single database row becomes a lock. Sharding the counter, rolling it up, and knowing when HyperLogLog is allowed — and when it is a lawsuit — is the whole design.',
  byline: 'Modern System Design · Chapter 24 · ~1h 20m read · Intermediate',
  interviewTip:
    'State the problem as write contention, not as "we need a counter". Then: N shards, increment a random shard, periodically sum. Ask whether the read must be exact. If unique viewers, HyperLogLog is fine; if account balance, it is not. Mention CRDT PN-counters for multi-region and monotonic reads if a user must never see the count go backwards. For inventory, pre-allocate shard budgets or you will oversell. That is a complete answer.',
  sections: [
    {
      id: 'sc-sys',
      title: 'System Design: The Sharded Counters',
      children: [
        { id: 'sc-row', title: 'The single-row hotspot' },
        { id: 'sc-when', title: 'When a counter is a system, not a column' },
        { id: 'sc-req', title: 'Requirements: exact, stale, and money' },
      ],
      html: `
        <p>A like count, a view count, a "n tickets remaining" — all look like <code>UPDATE counts SET n = n + 1 WHERE id = ?</code>. Under a viral post that update is a single row taking every write in the system. The row's page is the lock. The lock is the outage.</p>
        <p>This is not a SQL trivia item. It is the celebrity-key problem from <a href="/learn/modern-system-design/distributed-cache">Chapter 16</a> wearing a plus-one operator. Throughput does not scale with cluster size while every increment serialises on one cell.</p>

        <h3 class="lesson-subhead" id="sc-row">The single-row hotspot</h3>
        <p>InnoDB will happily serialise a few thousand increments a second on one row and then fall over as the same row also serves the read that paints the page. Redis <code>INCR</code> on one key is faster and still one CPU, one NIC, one hot slot. Adding replicas does not help writes: they still meet at the primary.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="All increments hitting one row versus spread across shards">
            <defs>
              <marker id="ah-sc1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">ONE ROW</text>
            <rect class="dg-box r" x="120" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="180" y="88" text-anchor="middle">likes=9e6</text>
            <text class="dg-s" x="26" y="132">Every INCR waits on the same lock.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">N SHARDS</text>
            <rect class="dg-box g" x="392" y="56" width="70" height="28" rx="5" />
            <text class="dg-s" x="427" y="74" text-anchor="middle">s0</text>
            <rect class="dg-box g" x="476" y="56" width="70" height="28" rx="5" />
            <text class="dg-s" x="511" y="74" text-anchor="middle">s1</text>
            <rect class="dg-box g" x="560" y="56" width="70" height="28" rx="5" />
            <text class="dg-s" x="595" y="74" text-anchor="middle">s2</text>
            <rect class="dg-box g" x="644" y="56" width="48" height="28" rx="5" />
            <text class="dg-s" x="668" y="74" text-anchor="middle">sN</text>
            <text class="dg-s" x="382" y="132">Write a random shard; read the sum.</text>
          </svg>
          <figcaption>Figure 1 — Throughput scales with shard count until the read of the sum becomes the new problem.</figcaption>
        </figure>
        <p>The fix is to stop pretending there is one cell. N independent counters, same logical id, writes spread, reads reconstructed. That reconstruction is the rest of the chapter: how stale, how exact, how multi-region, and which domains must not play this game.</p>

        <h3 class="lesson-subhead" id="sc-when">When a counter is a system, not a column</h3>
        <p>If the write rate of one id exceeds what one replica can serialise — a few thousand INCR/s on a row, tens of thousands on Redis — you are in this chapter. View counts on a viral video, votes on a front-page answer, remaining stock on a flash sale. If the id is quiet, a column is correct and this design is vanity.</p>
        <p>Ask two product questions before drawing shards: must the displayed number be exact, and may it go backwards on refresh? Marketing counters (views, likes) tolerate approximate and even slightly stale. Inventory and money do not.</p>

        <h3 class="lesson-subhead" id="sc-req">Requirements: exact, stale, and money</h3>
        <table>
          <thead><tr><th>Question</th><th>Likes / views</th><th>Inventory / money</th></tr></thead>
          <tbody>
            <tr><td>Exact?</td><td>Usually no; stale by seconds is fine</td><td>Yes, auditable</td></tr>
            <tr><td>May go backwards?</td><td>Ugly UX; pin or max()</td><td>Never for balances</td></tr>
            <tr><td>May overshoot?</td><td>Harmless</td><td>Oversell is an incident</td></tr>
            <tr><td>Technique</td><td>N shards + rollup, or HLL</td><td>Ledger or pre-allocated budgets</td></tr>
          </tbody>
        </table>
        <p>Functional: increment, decrement, read (possibly stale), rebuild from durable shards after cache loss. Non-functional: survive a celebrity id at 100k+ writes/s; read p99 of a few milliseconds from cache; no single-row lock on the hot id.</p>
        <p>A quiet id at 5 writes/s does not need this chapter. Premature sharding doubles the number of keys, complicates backups, and makes "just UPDATE the row" look like wisdom in hindsight. Measure the write QPS of the hottest id before you draw N boxes. Celebrity keys are a distribution, not a personality type: one video, one flash SKU, one World Cup goal.</p>
        <p>Reads often dominate. A million clients polling a like count every two seconds is 500k reads/s of a number that changes far slower. That is a cache problem wearing a counter costume. Design the write path for the burst and the read path for the audience size; they are different numbers by orders of magnitude.</p>
      `,
    },
    {
      id: 'sc-hl',
      title: 'High-Level Design of Sharded Counters',
      children: [
        { id: 'sc-n', title: 'N shards and a periodic rollup' },
        { id: 'sc-exact', title: 'Exact counts versus HyperLogLog' },
        { id: 'sc-inv', title: 'Inventory oversell if you shard like likes' },
      ],
      html: `
        <h3 class="lesson-subhead" id="sc-n">N shards and a periodic rollup</h3>
        <p>Store N cells: <code>(id, shard) → count</code>. On increment, pick <code>shard = random(N)</code> or <code>hash(user) % N</code> if you also want a cheap "did this user already like" on the same cell (usually you do not mix those). On read, SUM the N cells. N=10 to 100 is typical; N=1000 makes the read a 1000-row scatter for a number on a page.</p>
        <p>Rollup: a job periodically writes <code>id → total</code> to a cache or a summary table so the page does not SUM on every GET. The summary is stale by the job interval. For viral pages, also INCR a Redis replica of the total (lossy on crash, rebuilt from shards) for the read path, and treat shards as the durable truth.</p>
        <p>Choosing N is load division, not aesthetics. Too small and you are back on a hotspot. Too large and every read (or every rollup) is a scatter. Start from write QPS / per-shard capacity. Redis INCR is tens of thousands per shard on a healthy box; SQL row updates are thousands. Add headroom for unlucky random: if you pick uniformly, some shards will see 2× the mean for a while. N=64 is a boring, defensible interview number for a 200k/s like burst.</p>
        <pre><code>WRITE  INCR shard[id][rand(N)]          # durable, spread
READ   GET  cache[id]  else SUM shards  # stale by seconds
JOB    every 1s: cache[id] = SUM shards # or on a sample of hot ids

ESTIMATE
  200k likes/s on one post during a burst
  N = 64 shards -&gt; ~3k writes/s each  — Redis is fine
  SUM of 64 keys is one pipeline, &lt; 1 ms
  if you SUM in MySQL every page view, you have not designed a read path</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Writes hit random shards, rollup fills the read cache">
            <defs>
              <marker id="ah-sc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="78" text-anchor="middle">INCR</text>
            <rect class="dg-box g" x="156" y="36" width="200" height="76" rx="7" />
            <text class="dg-s" x="256" y="60" text-anchor="middle">N shard cells</text>
            <text class="dg-s" x="256" y="78" text-anchor="middle">durable truth</text>
            <text class="dg-s" x="256" y="96" text-anchor="middle">random write</text>
            <rect class="dg-box p" x="396" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="456" y="78" text-anchor="middle">rollup job</text>
            <rect class="dg-box b" x="556" y="52" width="148" height="44" rx="7" />
            <text class="dg-s" x="630" y="78" text-anchor="middle">read cache</text>
            <path class="dg-line violet" d="M116 74 H152" marker-end="url(#ah-sc2)" />
            <path class="dg-line violet" d="M356 74 H392" marker-end="url(#ah-sc2)" />
            <path class="dg-line violet" d="M516 74 H552" marker-end="url(#ah-sc2)" />
          </svg>
          <figcaption>Figure 2 — Shards absorb writes. The cache absorbs reads. Mixing those jobs puts the lock back.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-exact">Exact counts versus HyperLogLog</h3>
        <p>Sharded sums are exact (ignoring crash windows on the cache). Unique viewers are not a sum — they are a set. A set of 50 million user ids is tens of gigabytes. HyperLogLog estimates cardinality in a few kilobytes at roughly 1% error. Likes-from-unique-users, daily active, "how many devices saw this" are HLL-shaped. "How many cents does this account hold" is not.</p>
        <p>Count-min sketch estimates frequencies (heavy hitters) when you cannot keep a map of all keys. Same rule: dashboards yes, ledgers no. In interviews, saying "HLL for uniques, sharded INCR for totals, never for money" scores more than naming a paper.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Exact shard sum versus HyperLogLog for unique counts">
            <defs>
              <marker id="ah-sc3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="240" height="64" rx="7" />
            <text class="dg-t" x="136" y="60" text-anchor="middle">exact SUM</text>
            <text class="dg-s" x="136" y="80" text-anchor="middle">total likes, clicks</text>
            <rect class="dg-box y" x="280" y="36" width="200" height="64" rx="7" />
            <text class="dg-t" x="380" y="60" text-anchor="middle">HLL</text>
            <text class="dg-s" x="380" y="80" text-anchor="middle">unique viewers</text>
            <rect class="dg-box r" x="504" y="36" width="200" height="64" rx="7" />
            <text class="dg-t" x="604" y="60" text-anchor="middle">forbidden</text>
            <text class="dg-s" x="604" y="80" text-anchor="middle">money, seats</text>
            <path class="dg-line green" d="M256 68 H276" marker-end="url(#ah-sc3)" />
          </svg>
          <figcaption>Figure 3 — 1% HLL error on a million views is 10,000. Fine for a badge. Fatal for seats.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-inv">Inventory oversell if you shard like likes</h3>
        <p>Flash-sale remaining stock is a counter that must not go negative. Random shards can oversell: each shard thinks it still has stock. Ten shards with "some remaining" can each sell one of the last three items. Use a single remaining-stock key with a Lua or SQL compare-and-decr, or allocate stock into shards in advance (10,000 per shard, never borrow). Oversell is a product incident; "we sharded like likes" is the cause.</p>
        <div class="lesson-callout"><strong>Pre-allocate, do not share a leftover pool at sale time.</strong> Shard 3 may sit on unsold units while shard 7 is empty. That is leftover allocation waste — a business choice — not silent oversell. Oversell is the unforgivable failure mode.</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Random remaining stock per shard oversells versus pre-allocated budgets">
            <defs>
              <marker id="ah-sc4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">NAIVE SHARDS</text>
            <text class="dg-s" x="26" y="58">each shard decrements freely</text>
            <text class="dg-s" x="26" y="76">global remaining is a rumour</text>
            <text class="dg-s" x="26" y="94">sold 103 of 100 tickets</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">BUDGETED SHARDS</text>
            <text class="dg-s" x="382" y="58">each shard owns a quota</text>
            <text class="dg-s" x="382" y="76">empty shard rejects</text>
            <text class="dg-s" x="382" y="94">never borrow at checkout</text>
          </svg>
          <figcaption>Figure 4 — Inventory is a reservation, not a like. Budgets beat rumours.</figcaption>
        </figure>
      `,
    },
    {
      id: 'sc-det',
      title: 'Detailed Design of Sharded Counters',
      children: [
        { id: 'sc-crdt', title: 'CRDT PN-counters and monotonic reads' },
        { id: 'sc-money', title: 'When not to approximate' },
        { id: 'sc-read', title: 'The read path is a different number' },
        { id: 'sc-eval', title: 'Where this design falls short' },
        { id: 'sc-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="sc-crdt">CRDT PN-counters and monotonic reads</h3>
        <p>Multi-region: a PN-counter (increment and decrement vectors per replica) merges by taking per-replica maxima of increments (P) and decrements (N). The value is sum(P) − sum(N). It converges without a global lock. Two regions can increment offline and merge later; you do not lose counts the way last-write-wins would.</p>
        <p>The displayed value can still jump backwards if a reader hops from a replica that has seen more increments to one that has not — unless you pin the session to a replica or you only ever show <code>max(last_shown, current)</code> for metrics where backwards is a UX bug (view counts that drop look like a defect).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Two regions holding PN-counter shards that merge by max">
            <defs>
              <marker id="ah-sc5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="200" height="48" rx="7" />
            <text class="dg-s" x="116" y="60" text-anchor="middle">region US +400</text>
            <text class="dg-s" x="116" y="76" text-anchor="middle">P=400 N=0</text>
            <rect class="dg-box g" x="260" y="40" width="200" height="48" rx="7" />
            <text class="dg-s" x="360" y="60" text-anchor="middle">region EU +250</text>
            <text class="dg-s" x="360" y="76" text-anchor="middle">P=250 N=0</text>
            <rect class="dg-box p" x="504" y="40" width="200" height="48" rx="7" />
            <text class="dg-s" x="604" y="60" text-anchor="middle">merge P=650</text>
            <text class="dg-s" x="604" y="76" text-anchor="middle">no lock</text>
            <path class="dg-line violet" d="M216 64 H256" marker-end="url(#ah-sc5)" />
            <path class="dg-line violet" d="M460 64 H500" marker-end="url(#ah-sc5)" />
          </svg>
          <figcaption>Figure 5 — CRDT merge is a max of vectors, not a distributed transaction. Session stickiness keeps the number from shrinking on refresh.</figcaption>
        </figure>
        <p>Decrements need their own N vector. A "unlike" that always hits shard 0 reintroduces the hotspot. Spread decrements the same way as increments. Lost unlike messages in a PN-counter still converge if they eventually arrive; dropped unlikes without a retry are silent overcounts — acceptable for likes, not for stock.</p>

        <h3 class="lesson-subhead" id="sc-money">When not to approximate</h3>
        <p>Account balances, reserved inventory, "tickets left" at checkout: exact, atomic, auditable. Use a ledger (<a href="/learn/modern-system-design/payment-system">the payments chapter</a>), or a single-row transaction, or pre-allocated shard budgets. HLL error of 1% on a million is 10,000 — fine for views, fatal for seats. Last-write-wins counters in multi-region will drop increments; that is a silent financial bug.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Money stays on a ledger, marketing counters may shard and approximate">
            <defs>
              <marker id="ah-sc6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="40" width="320" height="56" rx="7" />
            <text class="dg-s" x="176" y="64" text-anchor="middle">views likes uniques</text>
            <text class="dg-s" x="176" y="80" text-anchor="middle">shards, HLL, CRDT OK</text>
            <rect class="dg-box r" x="368" y="40" width="336" height="56" rx="7" />
            <text class="dg-s" x="536" y="64" text-anchor="middle">balances tickets payouts</text>
            <text class="dg-s" x="536" y="80" text-anchor="middle">ledger, never HLL</text>
            <path class="dg-line hot dash" d="M336 68 H364" marker-end="url(#ah-sc6)" />
          </svg>
          <figcaption>Figure 6 — Draw a hard line. Approximating money is not a performance trick; it is a lawsuit.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-read">The read path is a different number</h3>
        <p>Writes during a viral burst might be 200k/s. Reads of the badge on the page might be 2M/s. Serving those reads from SUM(N) is a self-inflicted outage. The rollup cache is mandatory. TTL of one second is stale by one second, which users cannot see on a like count. TTL of one second on remaining concert seats is a lie — seats use reservation, not a cached SUM.</p>
        <p>Rebuild after cache loss: scan shards for hot ids first (the ones currently in the top-N of a "trending" set), not the entire id space. A cold start that SUMs every counter in the database is how a Redis blip becomes an hour of elevated error rates.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Write burst versus much larger read QPS served from cache">
            <defs>
              <marker id="ah-sc7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">writes 200k/s</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">N shards</text>
            <rect class="dg-box p" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">rollup 1 Hz</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">hot ids first</text>
            <rect class="dg-box b" x="476" y="40" width="228" height="56" rx="7" />
            <text class="dg-s" x="590" y="64" text-anchor="middle">reads 2M/s</text>
            <text class="dg-s" x="590" y="80" text-anchor="middle">cache only</text>
            <path class="dg-line blue" d="M236 68 H252" marker-end="url(#ah-sc7)" />
            <path class="dg-line blue" d="M456 68 H472" marker-end="url(#ah-sc7)" />
          </svg>
          <figcaption>Figure 7 — Design writes for the celebrity burst and reads for the audience. They are not the same QPS.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Zipf hot ids versus uniform test ids">
            <defs>
              <marker id="ah-sc8" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="320" height="56" rx="7" />
            <text class="dg-s" x="176" y="64" text-anchor="middle">Zipf: one video</text>
            <text class="dg-s" x="176" y="80" text-anchor="middle">90 percent of writes</text>
            <rect class="dg-box g" x="368" y="40" width="336" height="56" rx="7" />
            <text class="dg-s" x="536" y="64" text-anchor="middle">uniform UUIDs</text>
            <text class="dg-s" x="536" y="80" text-anchor="middle">false comfort</text>
            <path class="dg-line rose dash" d="M336 68 H364" marker-end="url(#ah-sc8)" />
          </svg>
          <figcaption>Figure 8 — Load tests that hash uniformly will not find the hotspot this chapter exists to fix.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-eval">Where this design falls short</h3>
        <p>SUM of N shards is eventually consistent with the writes still in flight. Rollup jobs are another delay. Hot shards still happen if random is unlucky or if you hash a bot onto one shard. Re-sharding N→2N is a rewrite of keys. None of this is analytics: "likes by country by hour" is a stream aggregation, not a counter cell.</p>
        <p>CRDTs do not give you a linearisable remaining-stock. Monotonic display hacks hide replica lag; they also hide real decrements if you max() a view count that should have gone down after a recount. Know which lie you chose.</p>
        <p>Re-sharding deserves an honest cost. Doubling N means copying or splitting keys while writes continue. A typical trick: new writes go to 2N, reads sum old N plus new 2N during a window, then compact. If you cannot describe that window, you are not ready to change N in production. Bots that hash onto one shard are a security problem as much as a capacity one — rate-limit the increment API; do not "fix" it by growing N forever.</p>
        <p>Never use a sharded counter as a uniqueness check ("this user liked once") unless the shard key is the user, which then re-hotspots popular users and does not spread celebrity posts. Likes-once is a set or a unique constraint on (post_id, user_id), sharded by post, not a PN-counter.</p>
        <p>Hot-key detection should feed this chapter. If one id's write QPS crosses a threshold, automatically raise N for that id or move it onto a dedicated Redis shard. Static N for every counter wastes keys on quiet ids and still loses when one video goes worldwide. Per-id N, stored next to the rollup, is the grown-up version of Figure 1.</p>
        <p>Testing: you cannot load-test this with uniform ids. Generate a Zipf: 1% of ids take 90% of writes. If your test uses UUID keys, you will ship a design that melts on the first celebrity. That is the same lesson as cache chapter hot keys, and interviewers expect you to say it.</p>
        <p>TTL on the rollup cache must be shorter than the product lie you are willing to tell. A 30-second cache on a live viewer count is a TV studio delay. A 30-second cache on a flash-sale remaining count is oversell. Same mechanism, different contract. Write the contract next to N.</p>
        <p>Decrements after a crash: if the cache INCR'd the display total but the shard write never landed, the badge runs hot until rebuild. Rebuild from shards, never from the cache. The cache is a rumour with a TTL.</p>
        <p>Idempotent likes: the client retries. Two INCRs for one tap inflate the number. Dedup with a short-lived (post_id, user_id, request_id) key, or accept a small overcount on marketing counters. Do not "fix" retries by holding a global lock on the post — that is Figure 1 again.</p>
        <p>Regional failover: if you fail over reads to a replica that has not merged PN vectors, the count drops. Pin sessions or show max(last, current) for badges. For inventory, do not fail over to a replica that is not the reservation primary.</p>
        <p>Export for analytics is a stream, not a SUM poll. Emit increment events to the log from Chapter 18 if you need likes-by-country-by-hour. The cell is a badge. The stream is a warehouse. Collapsing them is how the counter table becomes a data lake nobody can query.</p>
        <p>Name the lie in the interview: stale by one second, approximate uniques, monotonic display, leftover inventory on empty shards. A design with no named lie is a design that will lie by accident.</p>
        <p>Shard keys belong in the same availability zone as the write API that owns them for inventory. Cross-region INCR for seats is how two continents sell the last ticket. Likes can roam. Stock cannot.</p>
        <p>If the product wants a live ticker, push deltas on a pub-sub channel and keep the durable shards in the background. Polling SUM is not "real time"; it is a load test of your rollup.</p>
        <p>Last: never put money in this pattern. Ledgers first. Counters second. That ordering is the whole chapter in six words.</p>
        <p>If an interviewer asks for a class diagram, refuse politely and draw the write path, the rollup, and the money red line. The class diagram is how you hide the hotspot.</p>

        <h3 class="lesson-subhead" id="sc-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why does a single popular row cap write throughput regardless of cluster size? (2) Pick N for 100k INCR/s and justify the read path. (3) When is HyperLogLog acceptable, and when is it a lawsuit? (4) How can a sharded inventory counter oversell, and what allocation policy prevents it?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Sharded counters, HyperLogLog and CRDTs are standard distributed-systems techniques; all explanations, diagrams, tables and exercises are our own.',
};
