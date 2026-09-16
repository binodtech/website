/** Modern System Design — Chapter 35: Design Typeahead Suggestions.
 *  Prefix search under a 50 ms budget, tries with top-K, sharding, popularity and safety.
 */

export const msdTypeahead = {
  slug: 'typeahead',
  title: 'Design Typeahead Suggestions',
  subtitle:
    'Typeahead is search with a 50 ms budget and a query that changes every keystroke. A trie or prefix index in RAM, sharded by prefix, with top-K cached at each node, an edge cache for one- and two-character prefixes, a batched popularity stream, and a denylist. Disk per keystroke has already lost.',
  byline: 'Modern System Design · Chapter 35 · ~2h read · Advanced',
  interviewTip:
    'State the latency first: 50–100 ms p99 including RTT, so the service has perhaps 10–20 ms. That kills RPC-to-SQL. Then: in-memory prefix index, top-K per node, cache the first two characters at the edge. Personalisation is a rerank of a small K, not a different index. Popularity updates are batched; do not INCR the trie on every search. Mention Unicode/CJK: characters are not English letters. Mention a safety denylist on the write path into the index.',
  sections: [
    {
      id: 'ta-problem',
      title: 'System Design: Typeahead Suggestions',
      children: [
        { id: 'ta-what', title: 'The product and the budget' },
        { id: 'ta-trie', title: 'Why a trie, and why not only a trie' },
        { id: 'ta-cjk', title: 'Unicode and CJK' },
      ],
      html: `
        <p>The user types “s”, then “st”, then “sta”. Each prefix should yield a handful of completions before the next key. This is <a href="/learn/modern-system-design/distributed-search">search</a> with a sadistic latency SLO and a tiny result set. The query is incomplete on purpose. Ranking is popularity plus a little personalisation, not BM25 over documents.</p>

        <h3 class="lesson-subhead" id="ta-what">The product and the budget</h3>
        <p>Scope: query suggestions (what people type), or entity suggestions (users, pages), or both. We design query-completion plus a mention of entity prefix search (same index shape, different documents). Debounce on the client (~30 ms) so “st” does not always fire if “sta” is already in flight. Cancel in-flight requests. Cache last results for backspace.</p>
        <p>End-to-end p99 of 50–100 ms includes mobile RTT. The service budget is 10–20 ms. That number is the architecture. Anything that takes a lock, hits disk, or fans out to five microservices has failed before you draw the trie.</p>
        <table>
          <thead><tr><th>Budget</th><th>Number</th></tr></thead>
          <tbody>
            <tr><td>p99 end-to-end</td><td>50–100 ms (aim 50 ms)</td></tr>
            <tr><td>Service time</td><td>~10–20 ms</td></tr>
            <tr><td>K</td><td>8–10 suggestions</td></tr>
            <tr><td>QPS</td><td>keystrokes, not searches: often 5–10× search QPS</td></tr>
            <tr><td>Empty / 1-char</td><td>the hottest keys; must be cached at the edge</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="ta-trie">Why a trie, and why not only a trie</h3>
        <p>A trie shares prefixes. At each node you store the current top-K completions so a lookup is a walk of a few characters plus a read of K pointers — O(length) in RAM, no heap scan of the dictionary. Pure tries blow up on Unicode, on huge branching, and on “the top-K at this node is stale.”</p>
        <p>Many production systems use a finite automaton, an edge n-gram index in a search engine, or a hash of prefix → top-K list (especially for the first two or three characters, which are the hottest). On the whiteboard a trie with cached top-K is the right picture; mention the prefix→list cache as what you actually ship for the head of the Zipf curve.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Prefix sta walking a trie node that stores top-K completions">
            <defs>
              <marker id="ah-ta1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="80" height="36" rx="6" />
            <text class="dg-s" x="56" y="86" text-anchor="middle">s</text>
            <rect class="dg-box y" x="140" y="64" width="80" height="36" rx="6" />
            <text class="dg-s" x="180" y="86" text-anchor="middle">t</text>
            <rect class="dg-box g" x="264" y="64" width="80" height="36" rx="6" />
            <text class="dg-s" x="304" y="86" text-anchor="middle">a</text>
            <rect class="dg-box b" x="400" y="24" width="300" height="120" rx="8" />
            <text class="dg-h" x="416" y="44">TOP-K AT NODE</text>
            <text class="dg-s" x="416" y="68">starbucks</text>
            <text class="dg-s" x="416" y="86">stackoverflow</text>
            <text class="dg-s" x="416" y="104">stanford</text>
            <text class="dg-s" x="416" y="122">spotify</text>
            <path class="dg-line violet" d="M96 82 H136" marker-end="url(#ah-ta1)" />
            <path class="dg-line violet" d="M220 82 H260" marker-end="url(#ah-ta1)" />
            <path class="dg-line violet" d="M344 82 H396" marker-end="url(#ah-ta1)" />
          </svg>
          <figcaption>Figure 1 — Walk the prefix; return the precomputed top-K. Do not scan the dictionary on the keystroke.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Empty prefix and one-character prefix are the cost centre.</strong> Almost everyone types “s”. That node must be cached at the edge, or you have designed a thundering herd onto one machine.</div>

        <h3 class="lesson-subhead" id="ta-cjk">Unicode and CJK</h3>
        <p>English typeahead pretends a character is a byte. CJK input is often pinyin or other romanisation on the way to ideographs, or the user types the ideograph itself. A trie on Unicode code points still works, but branching factors and memory change, and “prefix” for Japanese may be a reading, not the kanji you will display.</p>
        <p>Normalise: Unicode NFC, lowercase where it exists, strip zero-width characters, decide what to do with emoji. Store display strings separately from the match key. If you only demo ASCII on the whiteboard, say so, then spend thirty seconds on CJK so the interviewer knows the index key is a normalised form, not raw UTF-8 from the text box.</p>
        <p>Grapheme clusters and combining marks mean “character count” for sharding is not strlen. Shard on the normalised match key’s first code units after you have a defined normalisation, or you will split the same user query across shards depending on how they typed the accent.</p>
      `,
    },
    {
      id: 'ta-req',
      title: 'Requirements and estimation',
      children: [
        { id: 'ta-fn', title: 'Functional and non-functional' },
        { id: 'ta-est', title: 'Memory and QPS' },
        { id: 'ta-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ta-fn">Functional and non-functional</h3>
        <p>Given a prefix, return K suggestions with optional highlight offsets. Personalise lightly (locale, logged-in verticals). Never suggest denylisted queries. Updates from a popularity stream should appear on a minutes-to-hours lag, not instantly, except for emergency kills.</p>
        <table>
          <thead><tr><th>NFR</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Latency</td><td>p99 service &lt; 20 ms; empty/1-char from edge</td></tr>
            <tr><td>Availability</td><td>degrade to stale cache rather than empty box</td></tr>
            <tr><td>Freshness</td><td>popularity lag of minutes is fine; safety lag of seconds is not</td></tr>
            <tr><td>Safety</td><td>denylist wins over popularity, always</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="ta-est">Memory and QPS</h3>
        <pre><code>INDEX
  10M distinct queries, avg 12 chars
  naive strings: 10M x 12 ≈ 120 MB plus pointers
  trie with top-K=10 at hot nodes: extra pointers, still RAM-sized
  budget 10-50 GB/shard — this is a memory system

QPS
  20k searches/s x 5 keystrokes after debounce = 100k/s
  first two chars hit an edge cache 80%+
  origin typeahead QPS ≈ 20k/s of cache misses and long prefixes

SHARDS
  shard by first 1-2 characters (after normalisation)
  "s" is hotter than "q" — cap shard load by hashing longer prefixes
  or replicate the hot 1-char maps everywhere (they are small)

UPDATE RATE
  query log: 20k/s, aggregate in 1-5 min windows
  rebuild top-K offline; swap pointer atomically
  emergency denylist: push to all replicas in seconds</code></pre>
        <p>The working set fits in RAM on a handful of boxes if you are careful with the head. The operational problem is load imbalance on “s”, “a”, “c” — not total memory. Edge cache exists to absorb that head.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Most traffic hits short prefixes at the edge">
            <defs>
              <marker id="ah-ta2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">1-2 CHAR PREFIX</text>
            <text class="dg-s" x="26" y="58">huge QPS, tiny keyspace</text>
            <text class="dg-s" x="26" y="76">edge cache, long TTL</text>
            <text class="dg-s" x="26" y="94">replicated, not sharded hot</text>
            <rect class="dg-band b" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">LONGER PREFIX</text>
            <text class="dg-s" x="382" y="58">lower QPS, more distinct</text>
            <text class="dg-s" x="382" y="76">shard by prefix</text>
            <text class="dg-s" x="382" y="94">trie walk in RAM</text>
          </svg>
          <figcaption>Figure 2 — Short prefixes are a cache product. Long prefixes are a sharded RAM index.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ta-api">API sketch</h3>
        <pre><code>GET /suggest?q=sta&amp;locale=en-GB&amp;k=10
  -&gt; { prefix, items: [{ text, score, type }] }
  headers: Cache-Control for q length &lt;= 2

# client
debounce 30ms, abort controller on each keystroke
backspace: reuse last in-memory map

# internal
popularity topic: raw queries (sampled)
aggregator: count by normalised query per window
index builder: merge counts, apply denylist, write new top-K snapshots
safety: denylist service, kill-switch per string / regex</code></pre>
        <p>Return a stable request id so client telemetry can join prefix, latency, and whether the user issued a search. That log is how you know the 50 ms budget is real, not a dashboard of origin-only times that ignore the edge.</p>
        <p>Empty query behaviour is a product choice: trending, recents, or nothing. Recents are a per-user list in a KV with a tiny TTL, not the global trie. Mixing them into shard empty-prefix is how you personalise by accident and miss the cache.</p>
      `,
    },
    {
      id: 'ta-design',
      title: 'Sharding, cache, popularity and safety',
      children: [
        { id: 'ta-shard', title: 'Shard by prefix' },
        { id: 'ta-edge', title: 'Edge cache for 1-2 characters' },
        { id: 'ta-pop', title: 'Popularity stream' },
        { id: 'ta-safe', title: 'Safety denylist' },
        { id: 'ta-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ta-shard">Shard by prefix</h3>
        <p>Route “sta…” to the shard that owns the normalised prefix bucket. A simple scheme is first two characters → N shards, with overflow hashing if a bucket is hot. Replicas of each shard keep the same trie snapshot. Failover is another replica of the same prefix range, not a disk rebuild on the request path.</p>
        <p>Personalisation does not change the shard. Fetch the global top-K (or top-2K), then rerank with user features in a few milliseconds: locale boost, recency of the user’s own queries, vertical (shopping vs people). If the personalisation service times out, return the global list. Empty is worse than impersonal.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Request routed by prefix to a RAM shard then optional rerank">
            <defs>
              <marker id="ah-ta3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="88" text-anchor="middle">prefix</text>
            <rect class="dg-box c" x="156" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="216" y="88" text-anchor="middle">router</text>
            <rect class="dg-box b" x="316" y="64" width="160" height="40" rx="7" />
            <text class="dg-s" x="396" y="88" text-anchor="middle">RAM shard</text>
            <rect class="dg-box g" x="516" y="64" width="188" height="40" rx="7" />
            <text class="dg-s" x="610" y="88" text-anchor="middle">rerank K</text>
            <path class="dg-line blue" d="M116 84 H152" marker-end="url(#ah-ta3)" />
            <path class="dg-line blue" d="M276 84 H312" marker-end="url(#ah-ta3)" />
            <path class="dg-line blue" d="M476 84 H512" marker-end="url(#ah-ta3)" />
          </svg>
          <figcaption>Figure 3 — Shard by prefix, serve from RAM, rerank a tiny K. Timeout on rerank returns the global top-K.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ta-edge">Edge cache for 1-2 characters</h3>
        <p>The keyspace for length 1–2 after normalisation is small (thousands of keys, not millions). CDN or an edge KV can hold the JSON of top-K with a TTL of tens of seconds to a few minutes. Language and market belong in the cache key (<code>en-GB:s</code> versus <code>en-US:s</code>) or you will suggest the wrong football.</p>
        <p>Invalidation: popularity can lag. Safety cannot. On a denylist hit, purge edge keys that could include that string (all 1–2 char keys for that locale is acceptable — they are few) and push to origin immediately. Do not wait for TTL when the suggestion is toxic.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Client hits edge cache then origin shard">
            <defs>
              <marker id="ah-ta4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="78" text-anchor="middle">client</text>
            <rect class="dg-box o" x="176" y="52" width="180" height="44" rx="7" />
            <text class="dg-s" x="266" y="78" text-anchor="middle">edge 1-2 chars</text>
            <rect class="dg-box b" x="396" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="466" y="78" text-anchor="middle">origin</text>
            <rect class="dg-box g" x="576" y="52" width="128" height="44" rx="7" />
            <text class="dg-s" x="640" y="78" text-anchor="middle">trie</text>
            <path class="dg-line green" d="M136 74 H172" marker-end="url(#ah-ta4)" />
            <path class="dg-line green dash" d="M356 74 H392" marker-end="url(#ah-ta4)" />
            <path class="dg-line green" d="M536 74 H572" marker-end="url(#ah-ta4)" />
          </svg>
          <figcaption>Figure 4 — Dashed path is cache miss. Length ≤ 2 should rarely reach the trie shard.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ta-pop">Popularity stream</h3>
        <p>Every search (and maybe every accepted suggestion) emits a log line. That stream is sampled if needed, counted in windows (1–5 minutes), and merged into a decaying score: recent counts outweigh last month. The builder recomputes top-K for affected nodes and publishes a snapshot. Serving processes mmap or pointer-swap the new structure. No request path increments a node counter — that is write amplification on the hottest prefixes and a consistency mess.</p>
        <p>Trending spikes (a celebrity name, a breaking event) appear after a window or two. If product wants faster, shorten the window and pay CPU. Do not confuse this with the denylist path.</p>
        <p>Sampling the log is mandatory at 100k keystrokes/s. Count on a sketch (Count-Min) for the body of the Zipf curve and exact counts for a watched set of head queries. The builder must not require a full group-by of raw strings every minute on a single reducer.</p>
        <p>Decay: a linear sliding window forgets last week’s meme. Without decay the trie fossilises around 2019 queries. Document the half-life; interviewers like a number (for example 24–72 hours).</p>

        <h3 class="lesson-subhead" id="ta-safe">Safety denylist</h3>
        <p>Popularity will promote harmful, illegal, or simply embarrassing completions. A denylist (exact strings, prefixes, regexes you keep tiny) is applied at index build and at serve as a last filter. An allowlist for navigational queries (you still want “youtube” even if a substring matches a clumsy regex) sits beside it.</p>
        <p>Operators need a kill that propagates in seconds: a sidecar watch on a small KV of banned strings. The popularity pipeline catching up tomorrow is not good enough for a viral slur. Log the suppression; do not return a hole that teaches the client to retry oddly.</p>
        <p>Legal and policy lists differ by market. Cache keys already include locale; denylist keys must too, or a banned string in one country blanks a navigational query in another. Keep the regex set tiny; most kills are exact strings.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Popularity build path versus fast denylist path">
            <defs>
              <marker id="ah-ta5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band g" x="12" y="16" width="344" height="124" rx="10" />
            <text class="dg-h" x="26" y="36">POPULARITY</text>
            <text class="dg-s" x="26" y="58">logs -&gt; windows -&gt; scores</text>
            <text class="dg-s" x="26" y="76">rebuild top-K snapshot</text>
            <text class="dg-s" x="26" y="94">lag of minutes is OK</text>
            <rect class="dg-band r" x="368" y="16" width="340" height="124" rx="10" />
            <text class="dg-h" x="382" y="36">DENYLIST</text>
            <text class="dg-s" x="382" y="58">seconds, not minutes</text>
            <text class="dg-s" x="382" y="76">purge edge keys</text>
            <text class="dg-s" x="382" y="94">filter at serve too</text>
          </svg>
          <figcaption>Figure 5 — Two clocks. Popularity may be eventual. Safety is a push.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ta-eval">Evaluation</h3>
        <p>A static top-K trie is bad at tail queries and at brand-new terms until the window fills. Entity typeahead (user names) needs a different document set and privacy (do not suggest private accounts). Personalisation that requires a heavy user vector on every keystroke will blow the 20 ms budget; keep it a rerank.</p>
        <p>Prefix sharding still leaves “s” fat unless you replicate that head. Tries are painful to mutate incrementally; snapshot swap is simpler and briefly doubles memory. CJK and mixed-script queries will look like a bug if you only test ASCII. Regex denylists will false-positive navigational queries if you let them grow.</p>
        <p>We did not build spell-correction (that is a second candidate generator) or multi-language mixing in one box. Offline metrics (suggest-success rate, abandoned prefixes, time-to-first-result) matter more than QPS vanity.</p>
        <p>A/B testing a new ranker must still hit the latency SLO. Shadow a second top-K in the snapshot and rerank in the same 20 ms, or you will ship a better nDCG that misses the next keystroke and loses the session.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Popularity windows merge into a snapshot swap on the shard">
            <defs>
              <marker id="ah-ta6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="78" text-anchor="middle">query log</text>
            <rect class="dg-box c" x="196" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="266" y="78" text-anchor="middle">windows</text>
            <rect class="dg-box b" x="376" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="446" y="78" text-anchor="middle">builder</text>
            <rect class="dg-box g" x="556" y="52" width="148" height="44" rx="7" />
            <text class="dg-s" x="630" y="78" text-anchor="middle">swap trie</text>
            <path class="dg-line violet" d="M156 74 H192" marker-end="url(#ah-ta6)" />
            <path class="dg-line violet" d="M336 74 H372" marker-end="url(#ah-ta6)" />
            <path class="dg-line violet" d="M516 74 H552" marker-end="url(#ah-ta6)" />
          </svg>
          <figcaption>Figure 6 — Popularity never writes the live trie. Count offline, publish a snapshot, pointer-swap.</figcaption>
        </figure>
        <p>Client cooperation is part of the SLO. Debounce, abort, and cache backspace locally. If every keydown hits the network, no server design of 20 ms will feel like 50 ms on a 80 ms RTT. Say that in the interview so you are not blamed for physics.</p>
        <p>Multi-region: serve from the closest RAM replica of the same snapshot. Popularity build can be central; safety kills must fan out to every edge POP. A region with a stale denylist is a policy incident, not a ranking incident.</p>
        <p>Entity typeahead (people, pages) often uses the same prefix→top-K shape with a document id instead of a query string. Privacy filters belong at serve: drop documents the viewer cannot see, then backfill from a slightly larger K so the list does not look sparse.</p>
        <table>
          <thead><tr><th>Failure</th><th>User sees</th><th>Design response</th></tr></thead>
          <tbody>
            <tr><td>Shard down</td><td>empty or slow for some letters</td><td>replica in another AZ; fail static edge cache</td></tr>
            <tr><td>Builder stuck</td><td>stale suggestions</td><td>keep last snapshot; alert on age</td></tr>
            <tr><td>Denylist lag</td><td>toxic completion</td><td>push path, purge 1-2 char keys</td></tr>
            <tr><td>Rerank timeout</td><td>generic list</td><td>return global K, never empty</td></tr>
            <tr><td>CJK mismatch</td><td>no hits for a typed reading</td><td>index romanisation and ideograph keys</td></tr>
          </tbody>
        </table>
        <p>That table is the evaluation in operational form. Typeahead fails quietly (empty box) more often than loudly (500), and empty boxes train users to stop typing.</p>
        <p>Warm-up: after a deploy, edge caches are cold and 1-char prefixes slam one shard. Pre-seed the edge with the 1-2 character maps from the snapshot before you take traffic, or you will DDoS yourself at release time.</p>
        <p>Scoring mix: popularity is not CTR of the suggestion itself unless you log accepts. Using raw search count promotes misspelled majority queries; a small editorial allowlist for properties (your own brand, legal names) sits above the stream.</p>
        <p>Length limits: refuse prefixes over a few dozen characters. A 2 KB q= is not typeahead; it is a search box someone pasted into. Bound it so the trie walk cannot become a CPU vector.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is the service budget ~20 ms, and what does that forbid? (2) Why cache 1–2 character prefixes at the edge? (3) Why must popularity updates be batched rather than incrementing the trie live? (4) How does the denylist clock differ from the popularity clock, and what changes for CJK?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Prefix indexes, typeahead latency budgets and popularity ranking are standard ideas; the explanations, diagrams, tables and exercises are our own.',
};
