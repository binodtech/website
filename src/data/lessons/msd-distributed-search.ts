/** Modern System Design — Chapter 21: Distributed Search.
 *  Inverted indexes, BM25, document-partitioned scatter-gather, and why
 *  search is a latency-tail problem more than a throughput problem.
 */

export const msdDistributedSearch = {
  slug: 'distributed-search',
  title: 'Distributed Search',
  subtitle:
    'Search is not "put the documents in a database and LIKE them". It is an inverted index, a ranking function, a fleet of shards that must all answer before the user does, and a reindex strategy that does not take the site down.',
  byline: 'Modern System Design · Chapter 21 · ~2h 20m read · Advanced',
  interviewTip:
    'Draw an inverted index on the whiteboard before any boxes. Tokenise, postings lists, BM25. Then partition by document, scatter the query, gather and merge. The interviewer is waiting for tail latency: p99 of the whole query is dominated by the slowest shard, so you need replica shards and hedging. Mention hybrid lexical plus vector search and alias-swap reindexing and you sound like you have shipped Elasticsearch, not just used it.',
  sections: [
    {
      id: 'ds-sys',
      title: 'System Design: The Distributed Search',
      children: [
        { id: 'ds-why', title: 'Why a database query is not search' },
        { id: 'ds-inv', title: 'The inverted index in one picture' },
      ],
      html: `
        <p>Search is the problem of ranking documents that match a query in tens of milliseconds over corpora that do not fit on one machine. <code>SELECT * FROM docs WHERE body LIKE '%query%'</code> is not that problem: it cannot rank, cannot use an inverted index, and cannot scatter work.</p>

        <h3 class="lesson-subhead" id="ds-why">Why a database query is not search</h3>
        <p>A relational index answers equality and range. Full-text "contains this token" over billions of documents needs an <strong>inverted index</strong>: token → postings list of document IDs (and positions, frequencies). Ranking needs a model (BM25, or a learned ranker) using those statistics. Pagination needs a stable sort. Relevance is not uniqueness of a primary key.</p>
        <p>You can put an inverted index inside a database (Postgres tsvector, MySQL FULLTEXT). At web scale you still outgrow one node, and then you have this chapter: shards, replicas, scatter-gather, and reindex. The source of truth is usually a database or a log; the search cluster is a derived, rebuildable artefact. That distinction saves you when an index is corrupt.</p>

        <h3 class="lesson-subhead" id="ds-inv">The inverted index in one picture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Tokens pointing to postings lists of document ids">
            <defs>
              <marker id="ah-ds1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="20" width="120" height="36" rx="6" />
            <text class="dg-s" x="76" y="42" text-anchor="middle">search</text>
            <rect class="dg-box b" x="16" y="68" width="120" height="36" rx="6" />
            <text class="dg-s" x="76" y="90" text-anchor="middle">latency</text>
            <rect class="dg-box b" x="16" y="116" width="120" height="36" rx="6" />
            <text class="dg-s" x="76" y="138" text-anchor="middle">index</text>
            <rect class="dg-box g" x="200" y="20" width="500" height="36" rx="6" />
            <text class="dg-s" x="450" y="42" text-anchor="middle">doc 2, doc 9, doc 18, doc 41</text>
            <rect class="dg-box g" x="200" y="68" width="500" height="36" rx="6" />
            <text class="dg-s" x="450" y="90" text-anchor="middle">doc 9, doc 41, doc 88</text>
            <rect class="dg-box g" x="200" y="116" width="500" height="36" rx="6" />
            <text class="dg-s" x="450" y="138" text-anchor="middle">doc 1, doc 2, doc 18</text>
            <path class="dg-line blue" d="M136 38 H196" marker-end="url(#ah-ds1)" />
            <path class="dg-line blue" d="M136 86 H196" marker-end="url(#ah-ds1)" />
            <path class="dg-line blue" d="M136 134 H196" marker-end="url(#ah-ds1)" />
          </svg>
          <figcaption>Figure 1 — The map is token to documents, not document to tokens. Query "search latency" intersects lists, then ranks.</figcaption>
        </figure>
        <p>AND queries intersect postings (skip lists, roaring bitmaps). Phrase queries use positions. The entire performance story of search is "those lists are huge; do not scan them naïvely, and do not wait for the slowest shard." Stop words, stemming and language analysers change recall; they belong in the same pipeline that built the lists, or query and index disagree. A German analyser on ingest and an English analyser on query is a silent relevance outage that looks like "search is broken".</p>
      `,
    },
    {
      id: 'ds-req',
      title: "Requirements of a Distributed Search System's Design",
      children: [
        { id: 'ds-fn', title: 'Functional requirements' },
        { id: 'ds-nfn', title: 'Non-functional requirements' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ds-fn">Functional requirements</h3>
        <p>Index documents (create, update, delete). Query with tokens, filters (category, time), and pagination. Near-real-time: a newly published article searchable within seconds, not hours, unless the product says otherwise. Highlighting and aggregations (facets) are usually in scope for a site search; they are expensive and should be named as optional. Autocomplete is a different index (prefix, typeahead) — see <a href="/learn/modern-system-design/typeahead">Chapter 32</a> if the interviewer goes there.</p>

        <h3 class="lesson-subhead" id="ds-nfn">Non-functional requirements</h3>
        <p>Query p99 of 50–200 ms at the 95th percentile of QPS. Indexing throughput that keeps up with the write stream (a catalogue of 500 million products with 5% daily change is a different machine than a blog). Durability of the index (can rebuild from source of truth — that is mandatory — but rebuilds take hours, so the live index still needs replicas). Relevance is a product SLO: NDCG, or human raters, not just latency.</p>
        <pre><code>500 million docs × 8 KB analysed text ≈ 4 TB source
index expansion ~ 0.3–1× source for a typical inverted index  → 2–4 TB
10 shards × 2 replicas                                        → 4–8 TB cluster
query 2,000 QPS, p99 100 ms including gather
fanout 10 shards: each shard has ~10 ms compute budget if serialised;
  so shard work must be parallel and tail-tolerant</code></pre>
        <table>
          <thead><tr><th>Requirement</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Query latency</td><td>p99 &lt; 150 ms</td></tr>
            <tr><td>Freshness</td><td>seconds for publishes</td></tr>
            <tr><td>Availability</td><td>read replicas; rebuild from source</td></tr>
            <tr><td>Relevance</td><td>offline NDCG plus online CTR</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 'ds-idx',
      title: 'Indexing in a Distributed Search',
      children: [
        { id: 'ds-tok', title: 'Tokenisation, postings and BM25' },
        { id: 'ds-seg', title: 'Immutable segments' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ds-tok">Tokenisation, postings and BM25</h3>
        <p>Tokenisation is not <code>split(' ')</code>. Lowercase, strip punctuation, apply a language analyser, optionally stem. Each token is stored with document frequency (how many docs contain it) and, per document, term frequency and positions. BM25 scores a document as a sum over query terms of IDF times a TF saturation term that also punishes very long documents. The constants k1 and b are knobs; they are not magic. The point in an interview is: ranking uses collection statistics that live on the shard, so you must either broadcast globals or accept approximate IDF across shards.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="BM25 uses term frequency, inverse document frequency and length">
            <rect class="dg-box b" x="16" y="28" width="216" height="56" rx="7" />
            <text class="dg-s" x="124" y="50" text-anchor="middle">TF in this doc</text>
            <text class="dg-s" x="124" y="66" text-anchor="middle">saturates, not linear</text>
            <rect class="dg-box g" x="252" y="28" width="216" height="56" rx="7" />
            <text class="dg-s" x="360" y="50" text-anchor="middle">IDF in collection</text>
            <text class="dg-s" x="360" y="66" text-anchor="middle">rare terms weigh more</text>
            <rect class="dg-box y" x="488" y="28" width="216" height="56" rx="7" />
            <text class="dg-s" x="596" y="50" text-anchor="middle">doc length norm</text>
            <text class="dg-s" x="596" y="66" text-anchor="middle">long docs discounted</text>
            <text class="dg-s" x="16" y="112">Filters (in stock, last 7 days) run first when they are cheap.</text>
            <text class="dg-s" x="16" y="130">Scoring 50 million hits is how you miss p99; prune with postings.</text>
            <text class="dg-s" x="16" y="148">Learned rankers rerank a short candidate list, not the corpus.</text>
          </svg>
          <figcaption>Figure 2 — BM25 is a ranking function over inverted-index statistics, not a machine-learning mystery.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ds-seg">Immutable segments</h3>
        <p>Lucene-style indexes write immutable segments. New documents land in a small in-memory buffer, flush to a segment, and a background merge concatenates small segments into larger ones (like LSM compaction). Deletes are tombstones until a merge drops them. Near-real-time search is "refresh the searcher to see the new segment" every second, not "rewrite the whole index."</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="In-memory buffer flushing to immutable segments that merge">
            <defs>
              <marker id="ah-ds2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="48" width="120" height="48" rx="7" />
            <text class="dg-s" x="76" y="76" text-anchor="middle">RAM buffer</text>
            <rect class="dg-box b" x="184" y="24" width="100" height="40" rx="6" />
            <text class="dg-s" x="234" y="48" text-anchor="middle">seg A</text>
            <rect class="dg-box b" x="184" y="80" width="100" height="40" rx="6" />
            <text class="dg-s" x="234" y="104" text-anchor="middle">seg B</text>
            <rect class="dg-box g" x="348" y="48" width="140" height="48" rx="7" />
            <text class="dg-s" x="418" y="76" text-anchor="middle">merged C</text>
            <rect class="dg-box p" x="540" y="48" width="160" height="48" rx="7" />
            <text class="dg-s" x="620" y="76" text-anchor="middle">searcher</text>
            <path class="dg-line green" d="M136 72 H180" marker-end="url(#ah-ds2)" />
            <path class="dg-line green" d="M284 44 H320 V72 H344" marker-end="url(#ah-ds2)" />
            <path class="dg-line green" d="M284 100 H320 V72 H344" marker-end="url(#ah-ds2)" />
            <path class="dg-line green" d="M488 72 H536" marker-end="url(#ah-ds2)" />
          </svg>
          <figcaption>Figure 3 — Writes append. Queries see a snapshot of segments. Merges are the compaction tax.</figcaption>
        </figure>
        <p>Update is delete-plus-insert. A document that changes ten times a day produces tombstones; merges must keep up or heap and disk fill with ghosts. This is why "update every keystroke into search" is a bad product idea.</p>
      `,
    },
    {
      id: 'ds-des',
      title: 'Design of a Distributed Search',
      children: [
        { id: 'ds-scatter', title: 'Document-partitioned scatter-gather' },
        { id: 'ds-tail', title: 'Tail latency and hedging' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ds-scatter">Document-partitioned scatter-gather</h3>
        <p>Partition by document id (or routing key: tenant, date). Each shard holds a slice of the inverted index. A query is sent to every shard that could contain a hit (usually all of them unless a filter pins a routing key), each shard returns its top k, a coordinator merges and re-ranks. Term-partitioned indexes (one shard owns "latency") look attractive until a popular term becomes a hot shard; document partition is the default that scales.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Coordinator scatters a query to shards and gathers top hits">
            <defs>
              <marker id="ah-ds3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="90" text-anchor="middle">query</text>
            <rect class="dg-box b" x="160" y="64" width="120" height="44" rx="7" />
            <text class="dg-s" x="220" y="90" text-anchor="middle">coordinator</text>
            <rect class="dg-box g" x="340" y="16" width="140" height="40" rx="6" />
            <text class="dg-s" x="410" y="40" text-anchor="middle">shard 0 top-k</text>
            <rect class="dg-box g" x="340" y="68" width="140" height="40" rx="6" />
            <text class="dg-s" x="410" y="92" text-anchor="middle">shard 1 top-k</text>
            <rect class="dg-box g" x="340" y="120" width="140" height="40" rx="6" />
            <text class="dg-s" x="410" y="144" text-anchor="middle">shard 9 top-k</text>
            <rect class="dg-box p" x="540" y="64" width="160" height="44" rx="7" />
            <text class="dg-s" x="620" y="90" text-anchor="middle">merged page</text>
            <path class="dg-line violet" d="M116 86 H156" marker-end="url(#ah-ds3)" />
            <path class="dg-line violet" d="M280 76 H320 V36 H336" marker-end="url(#ah-ds3)" />
            <path class="dg-line violet" d="M280 86 H336" marker-end="url(#ah-ds3)" />
            <path class="dg-line violet" d="M280 96 H320 V140 H336" marker-end="url(#ah-ds3)" />
            <path class="dg-line violet" d="M480 88 H536" marker-end="url(#ah-ds3)" />
          </svg>
          <figcaption>Figure 4 — Fan-out is the architecture. The user waits for the last shard, not the average shard.</figcaption>
        </figure>
        <p>Deep pagination (page 400) is expensive if you naïvely merge. Use search_after / a sort cursor, not OFFSET 10000. Aggregations (facets) are another scatter-gather with different merge logic; they can dominate latency more than the hit list. Global ordinals and doc-values are how Elasticsearch makes sorts and aggs less of a scan; mention them if the interviewer lives in that stack, but the idea is "columnar side structures next to postings", not a product recitation.</p>

        <h3 class="lesson-subhead" id="ds-tail">Tail latency and hedging</h3>
        <p>If each shard's p99 is 20 ms independent, ten shards in parallel still have a query p99 closer to the max of ten draws. That is why search is a tail problem. Mitigations: replica shards so the coordinator can pick a warm replica; hedged requests (send a second copy after a percentile delay, take the first complete); isolate heavy aggregations; cache the query parser and filter bitsets; keep heap from GC storms (the classic Elasticsearch outage).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Hedged request to a replica after a slow primary shard">
            <defs>
              <marker id="ah-ds4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="52" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="80" text-anchor="middle">coordinator</text>
            <rect class="dg-box r" x="220" y="20" width="180" height="48" rx="7" />
            <text class="dg-s" x="310" y="48" text-anchor="middle">shard 4 primary slow</text>
            <rect class="dg-box g" x="220" y="88" width="180" height="48" rx="7" />
            <text class="dg-s" x="310" y="116" text-anchor="middle">shard 4 replica</text>
            <rect class="dg-box y" x="468" y="52" width="232" height="48" rx="7" />
            <text class="dg-s" x="584" y="80" text-anchor="middle">first complete wins</text>
            <path class="dg-line rose dash" d="M156 68 H216" marker-end="url(#ah-ds4)" />
            <path class="dg-line rose" d="M156 88 H216" marker-end="url(#ah-ds4)" />
            <path class="dg-line rose" d="M400 112 H440 V76 H464" marker-end="url(#ah-ds4)" />
          </svg>
          <figcaption>Figure 5 — Hedge after a delay, not immediately, or you double cluster load on every query.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Replica count is a latency knob, not only a durability knob.</strong> Two replicas let you skip a GC-ing JVM. Durability of search still comes from the source of truth plus snapshots of the index.</div>
      `,
    },
    {
      id: 'ds-scale',
      title: 'Scaling Search and Indexing',
      children: [
        { id: 'ds-hyb', title: 'Hybrid lexical and vector search' },
        { id: 'ds-alias', title: 'Alias-swap reindex' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ds-hyb">Hybrid lexical and vector search</h3>
        <p>Lexical search (BM25) is precise on rare tokens and cheap filters. Vector search (HNSW, IVF) finds semantic neighbours when the query never shares a token with the document. Production site search is usually hybrid: retrieve two candidate lists, fuse (RRF or a learned mix), then apply the same filters. Vectors are RAM-hungry; you do not put a 768-d float per field on every replica without a budget. Approximate nearest neighbour misses; say the recall/latency trade-off.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Lexical and vector retrieval fused into one ranked page">
            <defs>
              <marker id="ah-ds5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="20" width="200" height="48" rx="7" />
            <text class="dg-s" x="116" y="48" text-anchor="middle">BM25 candidates</text>
            <rect class="dg-box p" x="16" y="88" width="200" height="48" rx="7" />
            <text class="dg-s" x="116" y="116" text-anchor="middle">ANN vector hits</text>
            <rect class="dg-box g" x="276" y="52" width="180" height="48" rx="7" />
            <text class="dg-s" x="366" y="80" text-anchor="middle">fuse + filters</text>
            <rect class="dg-box y" x="516" y="52" width="184" height="48" rx="7" />
            <text class="dg-s" x="608" y="80" text-anchor="middle">ranked page</text>
            <path class="dg-line cyan" d="M216 44 H248 V76 H272" marker-end="url(#ah-ds5)" />
            <path class="dg-line cyan" d="M216 112 H248 V76 H272" marker-end="url(#ah-ds5)" />
            <path class="dg-line cyan" d="M456 76 H512" marker-end="url(#ah-ds5)" />
          </svg>
          <figcaption>Figure 6 — Hybrid is two retrievers and a fusion, not "the LLM searches". Filters still belong on both paths.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ds-alias">Alias-swap reindex</h3>
        <p>Mappings, analysers and ranking features change. You cannot mutate an inverted index in place the way you ALTER TABLE. Build a new index from the source of truth (or from a change stream plus a baseline), then atomically point an alias at the new index. Readers never see a half-built mapping. Keep the old index until you are sure; disk is cheaper than a rollback story you do not have.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Alias atomically swapped from old index to new index">
            <defs>
              <marker id="ah-ds6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="48" width="120" height="48" rx="7" />
            <text class="dg-s" x="76" y="76" text-anchor="middle">alias shop</text>
            <rect class="dg-box frozen" x="196" y="20" width="200" height="44" rx="7" />
            <text class="dg-s" x="296" y="46" text-anchor="middle">index v1 live</text>
            <rect class="dg-box g" x="196" y="84" width="200" height="44" rx="7" />
            <text class="dg-s" x="296" y="110" text-anchor="middle">index v2 built</text>
            <rect class="dg-box b" x="460" y="48" width="240" height="48" rx="7" />
            <text class="dg-s" x="580" y="76" text-anchor="middle">swap is one metadata write</text>
            <path class="dg-line hot dash" d="M136 64 H192" marker-end="url(#ah-ds6)" />
            <path class="dg-line hot" d="M136 80 H192" marker-end="url(#ah-ds6)" />
          </svg>
          <figcaption>Figure 7 — Reindex is a blue/green of the inverted index. The alias is the cutover.</figcaption>
        </figure>
      `,
    },
    {
      id: 'ds-eval',
      title: "Evaluation of a Distributed Search's Design",
      children: [
        { id: 'ds-short', title: 'Where this design falls short' },
        { id: 'ds-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ds-short">Where this design falls short</h3>
        <p>Scatter-gather multiplies tail latency and cluster cost; a 50-shard index at 2,000 QPS is 100,000 shard-queries per second. Relevance is never "done": BM25 will lose to a tuned ranker, and a tuned ranker will lose to spam. Multi-tenant noisy neighbours share JVM heaps unless you isolate. Cross-cluster search across regions adds another gather hop. Highlighting and scripted scores are CPU traps. The index is not the source of truth; if the change stream lags, search lies.</p>
        <p>This design also does not give you transactions with the primary database. "Searchable the instant the row commits" needs a dual-write story or CDC with a lag SLO. Dual-write without a log will drift. Prefer the log. Multi-language corpora need per-field analysers; one global stemmer will mutilate product SKUs. Security: document-level permissions are a filter bitset you must compute per user, or you leak hits in the gather. That bitset is often the real p99, not BM25.</p>

        <p>Spell correction and synonyms expand the query into more tokens and more postings intersections. That is recall you pay for in tail latency. Cap expansions. Put them behind a flag when p99 is already on fire.</p>
        <p>Warm-up: after a rolling restart, page cache is cold and every shard is slow together. Hedge plus replica diversity helps; a staged restart helps more. Search clusters hate simultaneous GC and simultaneous cold cache.</p>
        <p>Replica shards should not share a physical disk or a noisy neighbour JVM if you are buying them for tail latency. Correlation is how hedging fails together.</p>
        <p>Index templates and ILM (hot-warm-delete) are operational BM25: they keep the cluster from becoming a museum of unread segments.</p>
        <p>Query circuit-breakers (max clause count, timeout) protect the cluster from a single bad regex. Fail that query, not the node.</p>

        <h3 class="lesson-subhead" id="ds-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is an inverted index the wrong shape for a relational primary key lookup? (2) Why does query p99 track the slowest shard, and what is hedging? (3) When would you choose document partitioning over term partitioning? (4) How do you change an analyser without taking search down?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Inverted indexes, BM25, scatter-gather and alias-based reindex are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
