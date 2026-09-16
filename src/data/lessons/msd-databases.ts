/** Modern System Design — Chapter 9: Databases.
 *  Storage engines, data models, replication, partitioning, and the PACELC trade-offs.
 */

export const msdDatabases = {
  slug: 'databases',
  title: 'Databases',
  subtitle:
    'A database is not a file with extra steps. It is a concurrent, durable, queryable system that must decide — on every write — how much it will lie, how much it will wait, and how it will find a row among billions when the machine that used to own that row is dead.',
  byline: 'Modern System Design · Chapter 9 · ~2h 10m read · Intermediate',
  interviewTip:
    'Interviewers rarely ask you to pick Postgres or Cassandra in the abstract. They ask what happens if a replica is 40 seconds behind, whether a unique email constraint still holds after you shard, and whether your secondary index is local or global. Name the isolation level you actually need, name the replication topology, and say out loud what you gave up. "We use a relational store for the money path with serialisable isolation, and a document store for the profile blob" is a design. "We use a database" is not.',
  sections: [
    {
      id: 'intro-databases',
      title: 'Introduction to Databases',
      children: [
        { id: 'db-why-not-files', title: 'Why a database is not a file' },
        { id: 'db-engine', title: 'B-trees, LSM trees and the write-ahead log' },
        { id: 'db-acid', title: 'ACID, isolation levels and the anomalies they permit' },
        { id: 'db-concurrency', title: 'Locks, MVCC and what a snapshot actually is' },
      ],
      html: `
        <p>A file can store bytes. A database stores a promise: that after a crash, after two clients write at the same time, after a query that touches a million rows, you still have a coherent picture of the world. The moment you try to keep that promise with a directory of JSON files, you invent a database badly — and then you pay for it in lock files, half-written records, and a 3 a.m. restore from last Tuesday.</p>
        <p>This chapter is the map of that promise. We start with the storage engine (how bytes hit disk), then the data model (how you shape those bytes), then the two ways a single box becomes a fleet: replication and partitioning. Every later design problem in this course — TinyURL, YouTube, a crawler, a notification system — is a specialised use of these four ideas.</p>

        <h3 class="lesson-subhead" id="db-why-not-files">Why a database is not a file</h3>
        <p>Suppose you persist user profiles as <code>/data/users/42.json</code>. Reads are easy. Writes are not. Two requests can open the same file, both rewrite it, and the last closer wins — silently dropping a password change. A process can die after writing 40% of the file, leaving JSON that no longer parses. There is no query except "open this path". There is no index except the filesystem tree. There is no backup except copying a directory that is changing under your feet.</p>
        <p>A database exists because those five problems — concurrency, atomic writes, crash recovery, query, and backup — show up together. The engine solves them once so every application does not solve them again, incorrectly.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Files versus a database: concurrency, atomicity, crash recovery, query and backup">
            <defs>
              <marker id="ah-db1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHAT A DIRECTORY OF FILES CANNOT PROMISE</text>
            <rect class="dg-band r" x="12" y="32" width="344" height="176" rx="11" />
            <text class="dg-h" x="26" y="52">FILES</text>
            <text class="dg-s" x="26" y="76">· last closer wins on the same path</text>
            <text class="dg-s" x="26" y="94">· a crash mid-write corrupts the blob</text>
            <text class="dg-s" x="26" y="112">· query is open-this-path only</text>
            <text class="dg-s" x="26" y="130">· no secondary lookup except filename</text>
            <text class="dg-s" x="26" y="148">· backup copies a moving target</text>
            <text class="dg-s" x="26" y="166">· permissions live in the OS, not the record</text>
            <text class="dg-s" x="26" y="184">· fine for config, logs, blobs, snapshots</text>
            <rect class="dg-band g" x="368" y="32" width="340" height="176" rx="11" />
            <text class="dg-h" x="382" y="52">DATABASE</text>
            <text class="dg-s" x="382" y="76">· concurrent writers with defined isolation</text>
            <text class="dg-s" x="382" y="94">· atomic commit or full rollback</text>
            <text class="dg-s" x="382" y="112">· WAL + checkpoint survive a crash</text>
            <text class="dg-s" x="382" y="130">· indexes, filters, aggregations</text>
            <text class="dg-s" x="382" y="148">· consistent snapshots for backup</text>
            <text class="dg-s" x="382" y="166">· row-level auth, constraints, types</text>
            <text class="dg-s" x="382" y="184">· pay for it in ops, latency, coupling</text>
          </svg>
          <figcaption>Figure 1 — Use files for immutable blobs and append-only logs. Use a database when two writers, a crash, or a query that is not "open this path" is in the product.</figcaption>
        </figure>
        <p>Object stores (S3) sit in the middle: they give atomic put of a whole object and eleven nines of durability, but they do not give you "update field X of user 42 while someone else updates field Y" and they do not give you "find every user whose city is Leeds". Treat them as a filesystem in the cloud, not as a substitute for the row store.</p>

        <h3 class="lesson-subhead" id="db-engine">B-trees, LSM trees and the write-ahead log</h3>
        <p>Under the SQL there is a disk layout. Two families dominate, and they make opposite bets about how a disk likes to be used.</p>
        <p>A <strong>B-tree</strong> (Postgres, InnoDB, most file-system indexes) keeps keys in sorted pages of a few kilobytes. A lookup walks ~3–4 pages from the root. An update finds the leaf page and writes the new value in place. Random writes are the tax: a 100-byte change still dirties an 8 KB page, and fsync of that page costs a disk seek on spinning rust and a journal write on SSD. The payoff is that a range scan is sequential in the tree — <code>WHERE id BETWEEN 100 AND 200</code> is cheap.</p>
        <p>An <strong>LSM tree</strong> (LevelDB, RocksDB, Cassandra, Lucene under the hood) never updates in place. Every write is an append to a memory table; when that fills, it is flushed as an immutable sorted file. Later a background compaction merges files and drops overwritten keys. Sequential appends are what SSDs and HDDs both like. The tax is read amplification: a get may check the memtable plus several files, unless bloom filters say "definitely not here". Range scans work, but they merge several sorted runs instead of walking one leaf chain.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 248" role="img" aria-label="B-tree in-place leaf updates versus LSM append, flush and compact">
            <defs>
              <marker id="ah-db2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="220" rx="11" />
            <text class="dg-h" x="26" y="36">B-TREE</text>
            <rect class="dg-box b" x="96" y="48" width="160" height="28" rx="6" />
            <text class="dg-s" x="176" y="66" text-anchor="middle">root page</text>
            <rect class="dg-box b" x="26" y="100" width="140" height="28" rx="6" />
            <text class="dg-s" x="96" y="118" text-anchor="middle">internal</text>
            <rect class="dg-box b" x="188" y="100" width="140" height="28" rx="6" />
            <text class="dg-s" x="258" y="118" text-anchor="middle">internal</text>
            <rect class="dg-box c" x="26" y="152" width="140" height="28" rx="6" />
            <text class="dg-s" x="96" y="170" text-anchor="middle">leaf (in place)</text>
            <rect class="dg-box c" x="188" y="152" width="140" height="28" rx="6" />
            <text class="dg-s" x="258" y="170" text-anchor="middle">leaf (in place)</text>
            <text class="dg-s" x="26" y="202">update dirties an 8 KB page</text>
            <text class="dg-s" x="26" y="218">range scan walks sibling leaves</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="220" rx="11" />
            <text class="dg-h" x="382" y="36">LSM TREE</text>
            <rect class="dg-box o" x="392" y="48" width="292" height="28" rx="6" />
            <text class="dg-s" x="538" y="66" text-anchor="middle">WAL + memtable (RAM)</text>
            <rect class="dg-box y" x="392" y="92" width="292" height="28" rx="6" />
            <text class="dg-s" x="538" y="110" text-anchor="middle">flush: SSTable L0 (immutable)</text>
            <rect class="dg-box y" x="392" y="136" width="292" height="28" rx="6" />
            <text class="dg-s" x="538" y="154" text-anchor="middle">compact into L1, L2, ...</text>
            <text class="dg-s" x="382" y="190">write = sequential append</text>
            <text class="dg-s" x="382" y="208">read = memtable + N files + bloom</text>
            <path class="dg-line green" d="M176 76 V96" marker-end="url(#ah-db2)" />
            <path class="dg-line green" d="M538 76 V88" marker-end="url(#ah-db2)" />
          </svg>
          <figcaption>Figure 2 — Same logical key, opposite I/O shapes. B-trees win on point updates of hot rows and on tight range scans. LSM wins on ingest rate and on write amplification that is sequential rather than random.</figcaption>
        </figure>
        <p>Both engines still need a <strong>write-ahead log (WAL)</strong>. Before a B-tree dirties a page, it appends the change to a sequential log and fsyncs it. After a crash, the engine replays the log from the last checkpoint. LSM already looks like a log; the WAL still exists so a crash before the memtable flush does not lose acknowledged writes. fsync latency is the floor of durable commit: on a good NVMe this is ~50–200 µs; on a network-attached volume it can be 2–10 ms. That is why "commit is slow" is often a disk-flush problem, not a SQL problem.</p>
        <div class="lesson-callout">A common interview trap: "LSM is always faster." LSM is faster at <em>sustained ingest</em>. A workload of 1 KB updates to a million hot keys on a B-tree with the working set in RAM is often faster than LSM, because LSM will compact those keys over and over. Ask about the working set and the update rate before you pick the engine.</div>
        <table>
          <thead><tr><th></th><th>B-tree</th><th>LSM</th></tr></thead>
          <tbody>
            <tr><td>Write path</td><td>In-place page, plus WAL</td><td>Append to WAL + memtable, later compact</td></tr>
            <tr><td>Read path</td><td>3–4 page hops, then done</td><td>Memtable + several files, bloom-filtered</td></tr>
            <tr><td>Range scan</td><td>Excellent (leaf chain)</td><td>Good (merge of sorted runs)</td></tr>
            <tr><td>Space</td><td>Updates reuse pages; fragmentation</td><td>Old versions linger until compact</td></tr>
            <tr><td>Typical</td><td>Postgres, InnoDB, MongoDB WiredTiger</td><td>Cassandra, RocksDB, ClickHouse parts</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="db-acid">ACID, isolation levels and the anomalies they permit</h3>
        <p><strong>Atomicity</strong> means a transaction's writes all land or none do. <strong>Consistency</strong> here is the database's word for "constraints hold" (unique keys, foreign keys, checks) — not the distributed-systems word from <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a>. <strong>Isolation</strong> means concurrent transactions do not see each other's dirty laundry, to a degree you choose. <strong>Durability</strong> means an acknowledged commit survives a crash, which in practice means the WAL made it to stable storage.</p>
        <p>Isolation is the one people pretend they understand. The SQL standard names levels by the anomalies they still allow. Read the table left to right as "how much concurrency you buy" versus "how many lies you tolerate".</p>
        <table>
          <thead><tr><th>Level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom</th><th>Write skew</th></tr></thead>
          <tbody>
            <tr><td>Read uncommitted</td><td>yes</td><td>yes</td><td>yes</td><td>yes</td></tr>
            <tr><td>Read committed</td><td>no</td><td>yes</td><td>yes</td><td>yes</td></tr>
            <tr><td>Repeatable read</td><td>no</td><td>no</td><td>often yes</td><td>often yes</td></tr>
            <tr><td>Snapshot (MVCC)</td><td>no</td><td>no</td><td>no (in snapshot)</td><td>yes, unless SSI</td></tr>
            <tr><td>Serialisable</td><td>no</td><td>no</td><td>no</td><td>no</td></tr>
          </tbody>
        </table>
        <p>A <strong>dirty read</strong> sees a write that later rolls back — two sessions, one deposits £100 then aborts, the other already printed a statement that included the £100. <strong>Non-repeatable read</strong>: you read a balance of £50, someone else commits a withdrawal, you read again and see £0. <strong>Phantom</strong>: you <code>COUNT(*)</code> rows matching a predicate, another transaction inserts a matching row, you count again and the number moved. <strong>Write skew</strong> is the one that bites on-call: two doctors on call, each reads "on_call_count = 1", each decides it is safe to go off call, both commit, nobody is on call. Each transaction individually preserved a constraint that the pair violated.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Write skew: two transactions each see one doctor on call and both go off duty">
            <defs>
              <marker id="ah-db3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WRITE SKEW — EACH TX IS LOCALLY FINE</text>
            <rect class="dg-box b" x="16" y="36" width="200" height="48" rx="7" />
            <text class="dg-s" x="116" y="56" text-anchor="middle">Tx A reads count=1</text>
            <text class="dg-s" x="116" y="72" text-anchor="middle">sets Alice off call</text>
            <rect class="dg-box o" x="260" y="36" width="200" height="48" rx="7" />
            <text class="dg-s" x="360" y="56" text-anchor="middle">Tx B reads count=1</text>
            <text class="dg-s" x="360" y="72" text-anchor="middle">sets Bob off call</text>
            <rect class="dg-box r" x="504" y="36" width="200" height="48" rx="7" />
            <text class="dg-s" x="604" y="56" text-anchor="middle">both commit</text>
            <text class="dg-s" x="604" y="72" text-anchor="middle">count = 0</text>
            <path class="dg-line rose" d="M216 60 H252" marker-end="url(#ah-db3)" />
            <path class="dg-line rose" d="M460 60 H496" marker-end="url(#ah-db3)" />
            <rect class="dg-band y" x="16" y="106" width="688" height="88" rx="10" />
            <text class="dg-s" x="32" y="132">Snapshot isolation does not stop this: each transaction saw a consistent snapshot where one doctor remained.</text>
            <text class="dg-s" x="32" y="150">Fix: serialisable isolation (SSI in Postgres), a lock on the on-call row, or an explicit constraint</text>
            <text class="dg-s" x="32" y="168">the database can check at commit (count of on-call doctors must stay at least one).</text>
          </svg>
          <figcaption>Figure 3 — Write skew is why "repeatable read is good enough" is a dangerous default for any invariant that spans two rows.</figcaption>
        </figure>
        <p>Postgres default is <strong>read committed</strong>. MySQL InnoDB default is <strong>repeatable read</strong>, which still allows write skew. Oracle's "serialisable" is snapshot isolation, not true serialisable. If you say "we are ACID" in an interview without naming the level, you have not said much. Name the anomaly you cannot tolerate, then pick the cheapest level that forbids it.</p>

        <h3 class="lesson-subhead" id="db-concurrency">Locks, MVCC and what a snapshot actually is</h3>
        <p><strong>Two-phase locking</strong> acquires locks as it goes and holds them until commit. Readers and writers queue. It can give serialisable behaviour; it can also give deadlocks and long waits when a report query holds a lock a writer needs.</p>
        <p><strong>MVCC</strong> (multi-version concurrency control) keeps old row versions so a reader can see a snapshot without blocking a writer. Postgres attaches a transaction id to each version; a vacuum later reclaims versions no snapshot still needs. The snapshot is not a copy of the whole database — it is a rule: "I see the latest version whose creating transaction committed before I started, and I ignore versions created by transactions that were still in flight." That rule is why long-running transactions are poison: they pin old versions, tables bloat, and disk fills with history nobody wanted to keep.</p>
        <p>Numbers that belong in your head: a Postgres row header is ~23 bytes before your columns; an extra version of a 200-byte row is another 200+ bytes until vacuum. A reporting query that holds a snapshot for 40 minutes on a table taking 2,000 updates/sec leaves ~80,000 extra versions hanging off that table. Isolation is not free; it is a storage and I/O bill with a delayed invoice.</p>
      `,
    },
    {
      id: 'types-databases',
      title: 'Types of Databases',
      children: [
        { id: 'db-relational', title: 'Relational stores and the query planner' },
        { id: 'db-families', title: 'Key-value, document, wide-column, graph, time-series, search, vector' },
        { id: 'db-norm', title: 'Normalisation versus denormalisation' },
        { id: 'db-pick', title: 'Picking a family without a religion' },
      ],
      html: `
        <p>The storage engine decides how bytes move. The data model decides which questions are cheap. A relational table, a document, a wide row, a graph edge, a time-stamped sample, an inverted index and a vector embedding are seven different bets about what "the next query" will look like. Pick the wrong bet and you will spend the next two years joining in the application, or scanning 400 GB to answer a lookup that should have been a hash.</p>

        <h3 class="lesson-subhead" id="db-relational">Relational stores and the query planner</h3>
        <p>A relational database stores rows in tables, declares constraints, and lets you ask questions the schema did not anticipate. That last part is the product: the <strong>query planner</strong> turns SQL into a tree of scans, nested loops, hash joins and index lookups. You are not writing the algorithm; you are describing the result and hoping statistics are fresh enough that the planner picks a hash join instead of a nested loop over 80 million rows.</p>
        <p>This is why relational systems dominate money, inventory and anything with a unique constraint that must be true right now. Foreign keys, check constraints and transactions are cheap compared with implementing them in six microservices. The cost is schema change (adding a column with a default on a 2 TB table is a maintenance window unless you use an online migration tool) and the temptation to grow one database into the system of record for the whole company.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="SQL to planner to index lookup versus sequential scan">
            <defs>
              <marker id="ah-db4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="28" width="150" height="40" rx="7" />
            <text class="dg-s" x="91" y="52" text-anchor="middle">SQL text</text>
            <rect class="dg-box c" x="198" y="28" width="150" height="40" rx="7" />
            <text class="dg-s" x="273" y="52" text-anchor="middle">planner + stats</text>
            <rect class="dg-box g" x="380" y="16" width="150" height="32" rx="7" />
            <text class="dg-s" x="455" y="36" text-anchor="middle">index lookup</text>
            <rect class="dg-box r" x="380" y="56" width="150" height="32" rx="7" />
            <text class="dg-s" x="455" y="76" text-anchor="middle">seq scan 80M</text>
            <rect class="dg-box y" x="562" y="28" width="142" height="40" rx="7" />
            <text class="dg-s" x="633" y="52" text-anchor="middle">result rows</text>
            <path class="dg-line blue" d="M166 48 H190" marker-end="url(#ah-db4)" />
            <path class="dg-line blue" d="M348 48 H372" marker-end="url(#ah-db4)" />
            <path class="dg-line blue" d="M530 48 H554" marker-end="url(#ah-db4)" />
            <text class="dg-s" x="16" y="120">A missing index turns a 0.4 ms lookup into a 12-second scan. The SQL did not change. The plan did.</text>
            <text class="dg-s" x="16" y="140">Always ask EXPLAIN ANALYSE in production-shaped data, not on an empty laptop database.</text>
            <text class="dg-s" x="16" y="160">Statistics drift: after a bulk load, ANALYSE or you will get last week's plan on this week's table.</text>
            <text class="dg-s" x="16" y="180">The planner is a cost model. Garbage stats in, nested-loop disaster out.</text>
          </svg>
          <figcaption>Figure 4 — Relational power is the planner. Treat missing statistics like a production incident waiting to happen.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="db-families">Key-value, document, wide-column, graph, time-series, search, vector</h3>
        <p>A <strong>key-value</strong> store (Redis, DynamoDB, the next chapter) gives <code>get(k)</code> / <code>put(k,v)</code>. Secondary questions require a second index you own. Value size is the design parameter: 200 bytes and you are in RAM; 2 MB and you are designing for network and GC.</p>
        <p>A <strong>document</strong> store (MongoDB, Couchbase, Elasticsearch documents) keeps a nested object as the unit of storage. You fetch a whole order with line items in one round trip. You lose cheap joins and, unless you are careful, you duplicate customer addresses into every order and then cannot update them in one place.</p>
        <p>A <strong>wide-column</strong> store (Cassandra, HBase, Bigtable) is a key-value store where the value is a sparse map of columns, clustered by a sort key. Time-series of events per user, inbox pages, and IoT samples fit this shape: partition key = user, clustering key = timestamp. Ad-hoc SQL across partitions does not.</p>
        <p>A <strong>graph</strong> store (Neo4j, Amazon Neptune) makes "friends of friends of this person" a walk, not a join explosion. Use it when the query is the path. Do not use it as a general row store with extra steps — writes that touch a popular node become hot spots, and operational tooling is thinner.</p>
        <p>A <strong>time-series</strong> store (Timescale, Influx, Prometheus, VictoriaMetrics) compresses sequences of (timestamp, value), downsamples, and expires. A general Postgres table of metrics will work until cardinality explodes; the specialised engine is about retention policies and compression, not about SQL flavour.</p>
        <p>A <strong>search</strong> engine (Elasticsearch, OpenSearch, Solr) inverts tokens to document ids. It is the right tool for relevance, typo tolerance and aggregations over text. It is the wrong tool of record: refresh interval (often 1 s) means a write is not immediately searchable, and mapping explosions will take the cluster down.</p>
        <p>A <strong>vector</strong> store (pgvector, Pinecone, Milvus, Weaviate) indexes embeddings for approximate nearest neighbour. Recall is not 100%. Treat it as a retrieval stage in front of a reranker, not as a source of truth, and keep the original document in a real database keyed by id.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Seven data model families and the query each makes cheap">
            <rect class="dg-box b" x="16" y="16" width="168" height="52" rx="7" />
            <text class="dg-s" x="100" y="36" text-anchor="middle">relational</text>
            <text class="dg-s" x="100" y="52" text-anchor="middle">ad-hoc join + constraint</text>
            <rect class="dg-box c" x="196" y="16" width="168" height="52" rx="7" />
            <text class="dg-s" x="280" y="36" text-anchor="middle">key-value</text>
            <text class="dg-s" x="280" y="52" text-anchor="middle">get / put by primary key</text>
            <rect class="dg-box g" x="376" y="16" width="168" height="52" rx="7" />
            <text class="dg-s" x="460" y="36" text-anchor="middle">document</text>
            <text class="dg-s" x="460" y="52" text-anchor="middle">whole aggregate fetch</text>
            <rect class="dg-box o" x="556" y="16" width="148" height="52" rx="7" />
            <text class="dg-s" x="630" y="36" text-anchor="middle">wide-column</text>
            <text class="dg-s" x="630" y="52" text-anchor="middle">user + time slice</text>
            <rect class="dg-box p" x="16" y="84" width="168" height="52" rx="7" />
            <text class="dg-s" x="100" y="104" text-anchor="middle">graph</text>
            <text class="dg-s" x="100" y="120" text-anchor="middle">path / neighbourhood</text>
            <rect class="dg-box y" x="196" y="84" width="168" height="52" rx="7" />
            <text class="dg-s" x="280" y="104" text-anchor="middle">time-series</text>
            <text class="dg-s" x="280" y="120" text-anchor="middle">scan + downsample</text>
            <rect class="dg-box i" x="376" y="84" width="168" height="52" rx="7" />
            <text class="dg-s" x="460" y="104" text-anchor="middle">search</text>
            <text class="dg-s" x="460" y="120" text-anchor="middle">token inverted index</text>
            <rect class="dg-box k" x="556" y="84" width="148" height="52" rx="7" />
            <text class="dg-s" x="630" y="104" text-anchor="middle">vector</text>
            <text class="dg-s" x="630" y="120" text-anchor="middle">ANN by embedding</text>
            <rect class="dg-band r" x="16" y="152" width="688" height="100" rx="10" />
            <text class="dg-h" x="32" y="176">THE TRAP</text>
            <text class="dg-s" x="32" y="198">One cluster cannot be all seven. Search-as-source-of-truth and "Cassandra because Netflix"</text>
            <text class="dg-s" x="32" y="216">without a partition key are how you get a second outage. Polyglot persistence means a clear owner</text>
            <text class="dg-s" x="32" y="234">for each fact, plus a sync path (CDC, dual write with an outbox) you can explain at 3 a.m.</text>
          </svg>
          <figcaption>Figure 5 — Cheap queries by family. If your access pattern is not in the box, you will fight the store for the rest of the project.</figcaption>
        </figure>
        <table>
          <thead><tr><th>Family</th><th>Unit of storage</th><th>Makes cheap</th><th>Makes expensive</th></tr></thead>
          <tbody>
            <tr><td>Relational</td><td>row in a table</td><td>joins, constraints, ad-hoc SQL</td><td>horizontal scale of one table</td></tr>
            <tr><td>Key-value</td><td>opaque blob by key</td><td>point get/put at huge QPS</td><td>any query that is not the key</td></tr>
            <tr><td>Document</td><td>JSON-like aggregate</td><td>fetch whole entity</td><td>cross-document transactions</td></tr>
            <tr><td>Wide-column</td><td>partition + clustered cells</td><td>time-range per partition</td><td>multi-partition SQL</td></tr>
            <tr><td>Graph</td><td>node + edge</td><td>bounded-depth walks</td><td>high-degree node writes</td></tr>
            <tr><td>Time-series</td><td>sample stream</td><td>compress, retain, roll up</td><td>mutating old samples</td></tr>
            <tr><td>Search</td><td>inverted postings</td><td>relevance, facets</td><td>durable exact inventory</td></tr>
            <tr><td>Vector</td><td>embedding + id</td><td>approximate neighbours</td><td>exact filters at huge recall</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout">Redis is a key-value store that happens to live in RAM and grows extra data structures (sorted sets, streams). That does not make it a database of record unless you have a persistence story you have tested with kill -9. AOF every second still loses up to a second. RDB snapshots lose everything since the last dump. Say that in the interview before you put balances in Redis.</div>

        <h3 class="lesson-subhead" id="db-norm">Normalisation versus denormalisation</h3>
        <p><strong>Normalisation</strong> stores each fact once. A customer's address lives in <code>customers</code>, orders point at <code>customer_id</code>. Updates are easy; reads join. Third normal form is the default for a system of record because a price change should not require rewriting every historical invoice line — you store the price <em>on the invoice line at purchase time</em> as a snapshot, which is a deliberate denormalisation of a fact that must not move.</p>
        <p><strong>Denormalisation</strong> copies a fact next to the query. A feed item stores author name and avatar URL so the read path is one get, not a join to users. The cost is every profile photo change becoming a fan-out write, or accepting that the feed shows a stale avatar for hours. That is the same trade-off as a cache, except the stale copy lives in the primary store.</p>
        <p>A useful rule: normalise the write path of money and identity; denormalise the read path of feeds, timelines and product cards. Store a snapshot of anything legally or financially historical (price, tax, address at dispatch). Never denormalise a unique constraint away — uniqueness has to live in one place the database can enforce.</p>

        <h3 class="lesson-subhead" id="db-pick">Picking a family without a religion</h3>
        <p>Walk the access pattern first. If you have a primary key and a blob, start with a KV or a single Postgres table. If you have joins and constraints, stay relational until QPS or size forces a split. If you have "events for user U in time range T", look at wide-column or a time-series table with a compound key. If you have full-text, add a search cluster fed by CDC, do not make Elasticsearch the order database.</p>
        <p>Postgres with JSONB, pgvector and Timescale is a legitimate first architecture for a surprising number of products. The specialised system is what you introduce when a measured bottleneck says so — not when a blog post says so.</p>
      `,
    },
    {
      id: 'data-replication',
      title: 'Data Replication',
      children: [
        { id: 'rep-why', title: 'Why copy the data at all' },
        { id: 'rep-topologies', title: 'Single-leader, multi-leader and leaderless' },
        { id: 'rep-sync', title: 'Synchronous versus asynchronous, and replication lag' },
        { id: 'rep-session', title: 'Read-your-writes and other session guarantees' },
        { id: 'rep-failover', title: 'Failover, fencing and split brain' },
        { id: 'rep-cdc', title: 'Change data capture' },
      ],
      html: `
        <p>One copy of the data is a single point of failure and a single point of capacity. Replication is how you buy durability (a disk fire in one rack does not delete the company), read scale (followers serve SELECTs), and locality (a replica in Mumbai rather than Virginia). Every topology below is a different answer to "who is allowed to accept a write" and "what does a reader see if that write is still in flight".</p>

        <h3 class="lesson-subhead" id="rep-why">Why copy the data at all</h3>
        <p>Three motives, often mixed. <strong>Durability:</strong> RAID is not a replica; a bad migration, a dropped table, or a datacentre outage needs a second machine with its own log. <strong>Read scale:</strong> a leader that can take 8,000 writes/sec might still drown under 80,000 reads; followers absorb the reads. <strong>Latency:</strong> a user in Sydney should not wait 180 ms for a round trip to eu-west-1 to load a profile that never changes.</p>
        <p>Replication is not backup. A replica that applies DROP TABLE 40 ms after the leader has also lost the table. Backup is a point-in-time copy that is not continuously applying the leader's mistakes. Keep both.</p>

        <h3 class="lesson-subhead" id="rep-topologies">Single-leader, multi-leader and leaderless</h3>
        <p><strong>Single-leader</strong> (Postgres streaming, MySQL binlog, MongoDB replica sets): all writes go to one node; followers replay the log. Conflict handling is easy because there is one writer. Failover is the hard part. This is the default for any system that cares about constraints.</p>
        <p><strong>Multi-leader</strong> (every region accepts writes, then replicates): a form you reach when you cannot pay the WAN round trip on every write. Two leaders can insert the same unique email. You need conflict resolution: last-write-wins (dangerous), merge functions, or CRDTs. Use it for calendars, drafts, and presence — not for bank balances.</p>
        <p><strong>Leaderless</strong> (Dynamo, Cassandra, Riak): a client writes to N replicas and waits for W acknowledgements. There is no failover because there is no leader. There is also no single place that knows the truth; Chapter 10 is that design in full.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 230" role="img" aria-label="Single-leader, multi-leader and leaderless replication topologies">
            <defs>
              <marker id="ah-db5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="228" height="200" rx="11" />
            <text class="dg-h" x="26" y="36">SINGLE LEADER</text>
            <rect class="dg-box g" x="46" y="48" width="160" height="32" rx="6" />
            <text class="dg-s" x="126" y="68" text-anchor="middle">leader (writes)</text>
            <rect class="dg-box b" x="46" y="100" width="160" height="28" rx="6" />
            <text class="dg-s" x="126" y="118" text-anchor="middle">follower</text>
            <rect class="dg-box b" x="46" y="136" width="160" height="28" rx="6" />
            <text class="dg-s" x="126" y="154" text-anchor="middle">follower</text>
            <text class="dg-s" x="26" y="188">one writer, easy conflicts</text>
            <rect class="dg-band o" x="252" y="16" width="228" height="200" rx="11" />
            <text class="dg-h" x="266" y="36">MULTI-LEADER</text>
            <rect class="dg-box o" x="286" y="48" width="160" height="32" rx="6" />
            <text class="dg-s" x="366" y="68" text-anchor="middle">leader region A</text>
            <rect class="dg-box o" x="286" y="100" width="160" height="32" rx="6" />
            <text class="dg-s" x="366" y="120" text-anchor="middle">leader region B</text>
            <text class="dg-s" x="266" y="160">both accept writes</text>
            <text class="dg-s" x="266" y="178">conflicts on the wire</text>
            <rect class="dg-band p" x="492" y="16" width="216" height="200" rx="11" />
            <text class="dg-h" x="506" y="36">LEADERLESS</text>
            <rect class="dg-box p" x="516" y="48" width="168" height="28" rx="6" />
            <text class="dg-s" x="600" y="66" text-anchor="middle">replica 1</text>
            <rect class="dg-box p" x="516" y="84" width="168" height="28" rx="6" />
            <text class="dg-s" x="600" y="102" text-anchor="middle">replica 2</text>
            <rect class="dg-box p" x="516" y="120" width="168" height="28" rx="6" />
            <text class="dg-s" x="600" y="138" text-anchor="middle">replica 3</text>
            <text class="dg-s" x="506" y="172">client writes W of N</text>
            <text class="dg-s" x="506" y="190">no failover ceremony</text>
            <path class="dg-line violet" d="M126 80 V96" marker-end="url(#ah-db5)" />
            <path class="dg-line violet" d="M366 80 V96" marker-end="url(#ah-db5)" />
          </svg>
          <figcaption>Figure 6 — Who may accept a write is the whole topology. Everything else (lag, failover, conflict) follows from that one decision.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rep-sync">Synchronous versus asynchronous, and replication lag</h3>
        <p><strong>Synchronous</strong> replication: the leader does not acknowledge the client until at least one follower has the bytes. You cannot lose a committed write if the leader dies — provided the follower you waited for is the one you promote. Latency becomes the slowest of those fsyncs. Semi-sync (MySQL) waits for one follower to have received, not necessarily flushed, the event.</p>
        <p><strong>Asynchronous</strong> replication: the leader acknowledges on its own WAL. Followers can be 50 ms or 50 minutes behind. A failover then loses the tail of the log. That is the default in many managed Postgres offerings because it is fast. It is also how a payment confirmation exists on the leader and never on the replica you just promoted.</p>
        <p>Lag is not a boolean. Measure it as bytes of WAL remaining and as wall-clock delay on the newest commit timestamp. A follower 40 seconds behind serving "your order status" will show a paid order as unpaid. Read replicas are not a drop-in for the leader unless the product can tolerate that window.</p>
        <table>
          <thead><tr><th></th><th>Sync</th><th>Async</th></tr></thead>
          <tbody>
            <tr><td>Commit latency</td><td>leader + follower fsync (WAN: 30–150 ms)</td><td>leader fsync only (~1 ms local NVMe)</td></tr>
            <tr><td>Failover data loss</td><td>none, if you promote a synced node</td><td>the unreplicated tail</td></tr>
            <tr><td>Availability if follower dies</td><td>writes stall unless you degrade</td><td>writes continue</td></tr>
            <tr><td>Typical use</td><td>money, inventory, leader election data</td><td>analytics replicas, caches of truth</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="rep-session">Read-your-writes and other session guarantees</h3>
        <p><a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> named session guarantees. They show up here as routing rules, not as magic on the replica. <strong>Read-your-writes:</strong> after a user posts a comment, the next GET must see it. If the GET hits a replica 200 ms behind, the comment vanishes and the user posts twice. Fix: send that user's reads to the leader for a few seconds, or sticky-session to the replica that applied their write, or wait on a write timestamp / WAL LSN before serving.</p>
        <p><strong>Monotonic reads:</strong> a user should not see version 7, then version 5, then version 7 again as they bounce between replicas. Pin the session to one replica, or require replicas to only move forward in applied LSN for that client's reads.</p>
        <p><strong>Causal consistency:</strong> if Alice's comment replies to Bob's, a reader who sees Alice must see Bob. That needs either a single replica, or version vectors, or a causal token the client passes. Eventual consistency without these rules is "the system converges", which is not the same as "this user is not confused".</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Read-your-writes fails when a follow-up read hits a lagging replica">
            <defs>
              <marker id="ah-db6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="28" width="140" height="40" rx="7" />
            <text class="dg-s" x="86" y="52" text-anchor="middle">client PUT</text>
            <rect class="dg-box b" x="196" y="28" width="140" height="40" rx="7" />
            <text class="dg-s" x="266" y="52" text-anchor="middle">leader has it</text>
            <rect class="dg-box r" x="376" y="28" width="160" height="40" rx="7" />
            <text class="dg-s" x="456" y="52" text-anchor="middle">GET hits replica</text>
            <rect class="dg-box y" x="564" y="28" width="140" height="40" rx="7" />
            <text class="dg-s" x="634" y="52" text-anchor="middle">empty feed</text>
            <path class="dg-line rose" d="M156 48 H188" marker-end="url(#ah-db6)" />
            <path class="dg-line rose" d="M336 48 H368" marker-end="url(#ah-db6)" />
            <path class="dg-line rose" d="M536 48 H556" marker-end="url(#ah-db6)" />
            <text class="dg-s" x="16" y="100">The write succeeded. The product looks broken. Route the session to the leader, or block the read until replica LSN >= write LSN.</text>
            <text class="dg-s" x="16" y="120">Sticky sessions fail when the replica dies; falling back to any replica reintroduces the gap. Have a leader fallback.</text>
            <text class="dg-s" x="16" y="140">This is not "eventual consistency is fine". It is a session guarantee the load balancer must implement.</text>
            <text class="dg-s" x="16" y="160">Interview phrase: read-your-writes is a routing problem, not a storage-engine problem.</text>
          </svg>
          <figcaption>Figure 7 — Replication lag becomes a product bug the first time a user reads their own write from a follower.</figcaption>
        </figure>
        <div class="lesson-callout">A replica that is "caught up" on average can still be behind on the one hot shard the user just wrote. Measure lag per replayed LSN, not per cluster average. Averages hide the replica that is stuck on a 20 GB sequential scan of WAL because someone ran a huge transaction.</div>

        <h3 class="lesson-subhead" id="rep-failover">Failover, fencing and split brain</h3>
        <p>When the leader is unreachable, someone must stop it writing and promote a follower. Unreachable is not dead — see Chapter 3's timeout. If the old leader is partitioned but still accepting writes, you have two leaders: <strong>split brain</strong>. Clients that hit both will diverge, unique keys will duplicate, and you will spend a weekend merging rows by hand.</p>
        <p><strong>Fencing</strong> is how you make the old leader harmless. Give each epoch a token (a fencing token, a generation, a config version). Storage refuses writes from a stale token. STONITH ("shoot the other node in the head") is the brutal version: power-cycle the old leader via the BMC. ZooKeeper/etcd/Chubby-style leases expire, so a leader that cannot renew must stop writing <em>before</em> the lease ends, with a safety margin for clock error.</p>
        <p>Postgres logical replication slots, MySQL GTID, MongoDB elections — the product names change, the rule does not: a node that might still be leader must not be able to mutate durable state after a successor has been chosen.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Split brain without fencing versus a fencing token that blocks the old leader">
            <rect class="dg-band r" x="12" y="16" width="344" height="148" rx="11" />
            <text class="dg-h" x="26" y="36">NO FENCE</text>
            <text class="dg-s" x="26" y="60">old leader still writes</text>
            <text class="dg-s" x="26" y="78">new leader also writes</text>
            <text class="dg-s" x="26" y="96">two histories, same primary keys</text>
            <text class="dg-s" x="26" y="114">restore from backup or merge</text>
            <text class="dg-s" x="26" y="140">this is an incident, not a feature</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="148" rx="11" />
            <text class="dg-h" x="382" y="36">FENCED</text>
            <text class="dg-s" x="382" y="60">epoch 17 token on new leader</text>
            <text class="dg-s" x="382" y="78">disk / etcd reject epoch 16</text>
            <text class="dg-s" x="382" y="96">old leader's writes bounce</text>
            <text class="dg-s" x="382" y="114">clients retry to the new leader</text>
            <text class="dg-s" x="382" y="140">promote only after fence is held</text>
          </svg>
          <figcaption>Figure 8 — Failover without fencing is how you get two sources of truth. The fence must live in the storage layer, not in the old process (which may not be listening).</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rep-cdc">Change data capture</h3>
        <p><strong>CDC</strong> is replication used as an integration bus. You tail the WAL (Debezium, AWS DMS, Postgres logical decoding) and emit every row change as an event to Kafka or Pulsar. Search indexes, caches, warehouses and other services stay in sync without dual writes from the application.</p>
        <p>Dual writes (app writes Postgres and Elasticsearch in one request) fail the moment one of them errors. The outbox pattern — write the row and an outbox record in the same transaction, then publish the outbox — is the application version of CDC. CDC is cleaner when you cannot change every writer.</p>
        <p>Costs: schema changes become events you must version; deletes must be real events (tombstones); a replica lag of the CDC pipeline is a search index that lies. Treat the pipeline's lag like replication lag. Exactly-once to the sink is usually at-least-once plus idempotent consumers — Chapter 3 again.</p>
      `,
    },
    {
      id: 'data-partitioning',
      title: 'Data Partitioning',
      children: [
        { id: 'part-why', title: 'Why one box is not enough' },
        { id: 'part-strategies', title: 'Range, hash, consistent hash and directory' },
        { id: 'part-modn', title: 'Why hash-mod-N is the wrong default' },
        { id: 'part-hot', title: 'Celebrities, hot spots and skew' },
        { id: 'part-indexes', title: 'Local versus global secondary indexes' },
      ],
      html: `
        <p>Replication copies the same data. Partitioning (sharding) splits different data across machines so that no single box holds the whole table. You partition when storage, write QPS, or working-set RAM no longer fits. You do not partition because the word sounds senior. A 400 GB Postgres with 2,000 QPS is happier as one well-indexed primary than as twelve shards you now have to rebalance.</p>

        <h3 class="lesson-subhead" id="part-why">Why one box is not enough</h3>
        <p>Rough ceilings, not laws: a beefy primary can do tens of thousands of simple primary-key reads per second and a few thousand writes, with a working set in RAM. Past ~10 TB of working data or write QPS that saturates WAL and CPU, you split. Vertical scale (bigger box) is cheaper operationally until it is not — and cloud instance SKUs do have a top.</p>
        <p>Partitioning buys write throughput and storage. It costs: no cheap cross-partition join, no cheap unique constraint across shards, distributed transactions if you still want them, and a rebalancing story for the day one shard is 10× another.</p>

        <h3 class="lesson-subhead" id="part-strategies">Range, hash, consistent hash and directory</h3>
        <p><strong>Range partitioning</strong> assigns contiguous key ranges to shards: user ids 1–10M on shard A, 10M–20M on B. Range scans of nearby keys stay on one node. The failure mode is a hotspot at the end of the keyspace (timestamps, incrementing ids). Snowflake ids or ULID as the partition key make "today" one shard.</p>
        <p><strong>Hash partitioning</strong> hashes the key and assigns the hash to a shard. Load is even if the key is even. Range queries become scatter-gather: every shard runs the range, the coordinator merges. That is why "shard by user_id, query by created_at across all users" is a warehouse query, not an OLTP query.</p>
        <p><strong>Consistent hashing</strong> places shards on a ring and maps each key to the next shard clockwise (Chapter 10). Adding a node steals a fraction of keys from neighbours instead of remapping everything. Virtual nodes (many positions per physical box) even out load.</p>
        <p><strong>Directory / lookup table</strong> stores key → shard in a metadata service. You can move one hot key by updating one row. The directory must be highly available and cached, or it becomes the new single box. Vitess, Cosmos DB partition maps, and many "custom sharding" layers are this idea.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Four partitioning strategies: range, hash, consistent hash ring, directory">
            <rect class="dg-box b" x="16" y="16" width="168" height="88" rx="7" />
            <text class="dg-h" x="28" y="36">RANGE</text>
            <text class="dg-s" x="28" y="56">A: 1 to 10M</text>
            <text class="dg-s" x="28" y="74">B: 10M to 20M</text>
            <text class="dg-s" x="28" y="92">scans stay local</text>
            <rect class="dg-box c" x="196" y="16" width="168" height="88" rx="7" />
            <text class="dg-h" x="208" y="36">HASH</text>
            <text class="dg-s" x="208" y="56">shard = h(k) mod N</text>
            <text class="dg-s" x="208" y="74">even if keys are even</text>
            <text class="dg-s" x="208" y="92">range = all shards</text>
            <rect class="dg-box g" x="376" y="16" width="168" height="88" rx="7" />
            <text class="dg-h" x="388" y="36">CONSISTENT</text>
            <text class="dg-s" x="388" y="56">key on a ring</text>
            <text class="dg-s" x="388" y="74">add node: steal slice</text>
            <text class="dg-s" x="388" y="92">use virtual nodes</text>
            <rect class="dg-box o" x="556" y="16" width="148" height="88" rx="7" />
            <text class="dg-h" x="568" y="36">DIRECTORY</text>
            <text class="dg-s" x="568" y="56">map key to shard</text>
            <text class="dg-s" x="568" y="74">move one hot key</text>
            <text class="dg-s" x="568" y="92">map must not die</text>
            <rect class="dg-band y" x="16" y="120" width="688" height="100" rx="10" />
            <text class="dg-s" x="32" y="144">Compound keys: partition by tenant_id, cluster by created_at. That keeps one customer's history on one shard</text>
            <text class="dg-s" x="32" y="162">and still sorted. Partition by created_at alone and every insert today lands on one node — a queue, not a cluster.</text>
            <text class="dg-s" x="32" y="180">Ask "what is in a single request's WHERE clause?" That column is the partition key candidate.</text>
            <text class="dg-s" x="32" y="198">If the answer is "sometimes user, sometimes product", you have two access paths and need two indexes or two stores.</text>
          </svg>
          <figcaption>Figure 9 — Strategy is a function of the query, not of fashion. Range for locality, hash for evenness, consistent hash for churn, directory for exceptions.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="part-modn">Why hash-mod-N is the wrong default</h3>
        <p><code>shard = hash(key) % N</code> is what everyone writes first. It is even, until N changes. Grow from 8 shards to 9 and <code>hash % 9</code> remaps almost every key — empirically about 8/9 of them move. You have turned a scale-out into a cluster-wide copy. At 10 TB that is a migration measured in days, with dual-writes or downtime.</p>
        <p>Consistent hashing (or a fixed large virtual-shard count, like 1024 vshards mapped onto N boxes, as Vitess does) remaps only the keys that belong on the new node. The interview sentence is: "I will not use hash-mod-N as the on-disk placement; I will use a placement map that can move a minority of keys when N changes."</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 170" role="img" aria-label="hash mod N remaps most keys when N grows; consistent hashing moves a slice">
            <rect class="dg-band r" x="12" y="16" width="344" height="140" rx="11" />
            <text class="dg-h" x="26" y="36">HASH MOD N</text>
            <text class="dg-s" x="26" y="60">N=8 to N=9</text>
            <text class="dg-s" x="26" y="78">~88% of keys change shard</text>
            <text class="dg-s" x="26" y="96">cluster-wide copy</text>
            <text class="dg-s" x="26" y="114">dual write or downtime</text>
            <text class="dg-s" x="26" y="136">fine only if N never changes</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="140" rx="11" />
            <text class="dg-h" x="382" y="36">RING OR VSHARDS</text>
            <text class="dg-s" x="382" y="60">add one physical node</text>
            <text class="dg-s" x="382" y="78">~1/N of keys move</text>
            <text class="dg-s" x="382" y="96">neighbours donate ranges</text>
            <text class="dg-s" x="382" y="114">1024 vshards onto N boxes</text>
            <text class="dg-s" x="382" y="136">rebalance is a slice, not a flood</text>
          </svg>
          <figcaption>Figure 10 — hash-mod-N is a homework hash. Production placement is a map you can mutate without rewriting the universe.</figcaption>
        </figure>
        <div class="lesson-callout">A fixed 1024 (or 4096) virtual shards assigned to physical nodes gives you most of the operational ease of a directory without a lookup on the read path: the vshard is <code>hash(key) % 1024</code>, which never changes, and the vshard→node table is small enough to cache on every client. Changing N updates the table, not the key hash.</div>

        <h3 class="lesson-subhead" id="part-hot">Celebrities, hot spots and skew</h3>
        <p>Even a perfect hash cannot save a key that is 5% of all traffic. A celebrity user's inbox, a flash-sale product row, a popular short URL — one partition key, one shard, one CPU. That is a <strong>hot spot</strong>.</p>
        <p>Mitigations, in order of how often they work: cache the hot row in front of the database (the shard still sees writes); split the key (<code>userId#0..15</code> random suffix on write, scatter-gather on read); isolate celebrities onto dedicated shards (directory exception); move the hot counter to Redis with periodic flush; for time-series, bucket by time so "now" is many small partitions rather than one eternal row.</p>
        <p>Zipf / 80–20 showed up in <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>. Assume it. If your estimate says 10,000 QPS uniform across 100 million keys, also ask what happens if 1% of keys take 50% of QPS — because they will.</p>

        <h3 class="lesson-subhead" id="part-indexes">Local versus global secondary indexes</h3>
        <p>A primary-key get knows the shard. A query by email does not, unless email is the partition key. A <strong>local secondary index</strong> lives on the same shard as the row: "orders for this user by date" is local if you partitioned by user. Fast writes (update the index in the same transaction as the row). A query that does not include the partition key cannot use it without visiting every shard.</p>
        <p>A <strong>global secondary index</strong> is itself partitioned, usually by the secondary key. "Find user by email" hits the email index shard, which stores a pointer to the base row. Writes now touch two shards: the base partition and the index partition. You have invented a distributed transaction, or you accept a window where the index lags (DynamoDB GSI is eventually consistent by default).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Local secondary index on the same shard versus a global index on another shard">
            <defs>
              <marker id="ah-db7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="168" rx="11" />
            <text class="dg-h" x="26" y="36">LOCAL INDEX</text>
            <rect class="dg-box b" x="46" y="48" width="276" height="32" rx="6" />
            <text class="dg-s" x="184" y="68" text-anchor="middle">shard of user 42</text>
            <rect class="dg-box c" x="46" y="92" width="276" height="32" rx="6" />
            <text class="dg-s" x="184" y="112" text-anchor="middle">index: date on same shard</text>
            <text class="dg-s" x="26" y="148">write is one transaction</text>
            <text class="dg-s" x="26" y="166">query needs partition key</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="168" rx="11" />
            <text class="dg-h" x="382" y="36">GLOBAL INDEX</text>
            <rect class="dg-box o" x="392" y="48" width="292" height="32" rx="6" />
            <text class="dg-s" x="538" y="68" text-anchor="middle">base row on shard H(user)</text>
            <rect class="dg-box y" x="392" y="92" width="292" height="32" rx="6" />
            <text class="dg-s" x="538" y="112" text-anchor="middle">email index on shard H(email)</text>
            <text class="dg-s" x="382" y="148">write touches two shards</text>
            <text class="dg-s" x="382" y="166">lookup by email is one hop</text>
            <path class="dg-line cyan" d="M184 80 V88" marker-end="url(#ah-db7)" />
            <path class="dg-line cyan" d="M538 80 V88" marker-end="url(#ah-db7)" />
          </svg>
          <figcaption>Figure 11 — Secondary indexes are a partitioning decision. Local is consistent and limited; global is flexible and a second distributed system.</figcaption>
        </figure>
        <p>Unique email across a sharded user table is a global unique index. If you cannot afford the dual-shard write, generate the id from a hash of email (so the shard is determined by email) and accept that a user cannot change email without migrating the row — which is often the right product trade-off.</p>
      `,
    },
    {
      id: 'db-tradeoffs',
      title: 'Trade-Offs in Databases',
      children: [
        { id: 'to-2pc', title: 'Two-phase commit versus sagas' },
        { id: 'to-pacelc', title: 'PACELC as a decision framework' },
        { id: 'to-est', title: 'Estimation: when one box stops being enough' },
        { id: 'to-eval', title: 'Evaluation: what this chapter still leaves you holding' },
      ],
      html: `
        <p>Every database choice is a bet you can name. This section is the language for naming it in a design interview: how you commit across shards, how you talk about latency versus consistency, how you know you have outgrown one primary, and where the designs in this chapter fail if you treat them as religion.</p>

        <h3 class="lesson-subhead" id="to-2pc">Two-phase commit versus sagas</h3>
        <p>A single-node transaction is cheap: WAL, locks or MVCC, commit record. Across two shards or two products (orders in Postgres, inventory in another Postgres), you need a protocol.</p>
        <p><strong>Two-phase commit (2PC):</strong> a coordinator asks all participants to prepare (durable yes/no). If all vote yes, it tells them to commit; otherwise abort. Isolation across shards can be real. Availability is not: if the coordinator dies after prepare, participants hold locks until a new coordinator recovers the decision. A network partition that isolates one prepared participant stalls the whole transaction. 2PC is what XA, some distributed SQL (Spanner uses Paxos per group plus 2PC across groups), and naive "just wrap it in a distributed transaction" designs reach for.</p>
        <p><strong>Sagas:</strong> a sequence of local transactions with compensating actions. Reserve inventory, then charge card, then create shipment. If charge fails, release inventory. There is no global isolation: a user can see reserved stock that will be released 400 ms later. Compensations must be written and tested; "delete the order" is not a compensation if a warehouse already printed a label.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Two-phase commit prepare and commit versus a saga of local steps with compensation">
            <defs>
              <marker id="ah-db8" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="180" rx="11" />
            <text class="dg-h" x="26" y="36">TWO-PHASE COMMIT</text>
            <text class="dg-s" x="26" y="60">1. coordinator: prepare?</text>
            <text class="dg-s" x="26" y="78">2. participants fsync yes/no</text>
            <text class="dg-s" x="26" y="96">3. coordinator: commit/abort</text>
            <text class="dg-s" x="26" y="114">locks held across the wait</text>
            <text class="dg-s" x="26" y="132">blocks if coordinator vanishes</text>
            <text class="dg-s" x="26" y="150">correct, not partition-friendly</text>
            <text class="dg-s" x="26" y="174">use inside a small trust domain</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="180" rx="11" />
            <text class="dg-h" x="382" y="36">SAGA</text>
            <text class="dg-s" x="382" y="60">T1 local commit (reserve)</text>
            <text class="dg-s" x="382" y="78">T2 local commit (charge)</text>
            <text class="dg-s" x="382" y="96">on T2 fail: compensate T1</text>
            <text class="dg-s" x="382" y="114">no global lock, visible gaps</text>
            <text class="dg-s" x="382" y="132">compensations are product code</text>
            <text class="dg-s" x="382" y="150">at-least-once + idempotency</text>
            <text class="dg-s" x="382" y="174">default for microservices</text>
            <path class="dg-line blue" d="M356 106 H364" marker-end="url(#ah-db8)" />
          </svg>
          <figcaption>Figure 12 — 2PC buys a single commit bit at the cost of availability. Sagas buy availability at the cost of writing the undo path as a first-class feature.</figcaption>
        </figure>
        <p>Interview move: money movement inside one ledger database uses a local transaction. Money movement that spans your ledger and a card network uses a saga (authorise, capture, void) because the card network will not join your 2PC. Do not propose 2PC across HTTP to a third party.</p>
        <table>
          <thead><tr><th></th><th>2PC</th><th>Saga</th></tr></thead>
          <tbody>
            <tr><td>Isolation</td><td>can be serialisable across shards</td><td>none globally; local only</td></tr>
            <tr><td>Failure</td><td>block or heuristic decisions</td><td>compensate; may need human repair</td></tr>
            <tr><td>Latency</td><td>two round trips + two fsyncs each</td><td>sum of local commits</td></tr>
            <tr><td>Ops</td><td>coordinator recovery is a pager</td><td>outbox + idempotent consumers</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="to-pacelc">PACELC as a decision framework</h3>
        <p>CAP says: in a <em>partition</em>, you choose consistency or availability. PACELC (Abadi) adds the everyday case: <em>else</em>, when the network is fine, you still choose latency versus consistency. That second letter is most production traffic.</p>
        <p>A single-leader Postgres that waits for a sync replica is PA/EC: on partition it prefers consistency (refuse writes if it cannot reach a replica, or freeze if it cannot see quorum), else it pays latency for sync. An async replica cluster is PA/EL: else it is low-latency and readers can be stale. Dynamo-style N=3 W=1 R=1 is AP/EL: always available, always racing. Dynamo N=3 W=2 R=2 is still AP on partition (you may not get a quorum) but closer to EC when healthy — Chapter 10.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="PACELC: partition then A or C; else latency or consistency">
            <rect class="dg-box y" x="16" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="44" text-anchor="middle">partition?</text>
            <text class="dg-s" x="96" y="60" text-anchor="middle">yes / no</text>
            <rect class="dg-box r" x="220" y="16" width="220" height="40" rx="7" />
            <text class="dg-s" x="330" y="40" text-anchor="middle">P: choose A or C</text>
            <rect class="dg-box g" x="220" y="72" width="220" height="40" rx="7" />
            <text class="dg-s" x="330" y="96" text-anchor="middle">EL: low lag, stale OK</text>
            <rect class="dg-box b" x="476" y="16" width="228" height="40" rx="7" />
            <text class="dg-s" x="590" y="40" text-anchor="middle">EC: wait for replicas</text>
            <rect class="dg-box o" x="476" y="72" width="228" height="40" rx="7" />
            <text class="dg-s" x="590" y="96" text-anchor="middle">else: L versus C</text>
            <text class="dg-s" x="16" y="140">Say PACELC in the interview instead of "we are CAP consistent". Name the healthy-path latency tax separately from the partition choice.</text>
            <text class="dg-s" x="16" y="160">Most user-facing reads should be EL with a session-guarantee overlay; money writes should be EC on the healthy path.</text>
          </svg>
          <figcaption>Figure 13 — PACELC forces two answers. CAP only asked the disaster question; users live in the "else".</figcaption>
        </figure>
        <div class="lesson-callout">Spanner looks like it cheats CAP with TrueTime. It does not. It bounds clock uncertainty and <em>waits out the uncertainty interval</em> on commit, which is an EC latency tax. The product is "serialisable and globally consistent, with p50 commit in the 10 ms range inside a region, worse across oceans". That is PACELC with a very good clock, not a free lunch.</div>

        <h3 class="lesson-subhead" id="to-est">Estimation: when one box stops being enough</h3>
        <p>Do the arithmetic before you draw shards. <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> methods, applied to a user-profile store:</p>
        <pre><code>USERS
  50 million accounts, 400 bytes/row average (profile + settings)
  base table: 50e6 x 400 = 20 GB  -> trivial

INDEXES
  email unique + username unique + 2 secondary
  ~2x row overhead in practice -> ~60 GB on disk with bloat

QPS
  500 writes/sec (profile edits, last_seen)
  15,000 reads/sec (app opens)
  read:write ~30:1  -> cache first, shard later

WORKING SET
  20% of users active/day = 10M x 400 B = 4 GB hot rows
  fits in RAM on one primary with room for indexes

WHEN YOU SHARD
  2 TB of history tables, or 8k durable writes/sec saturating WAL,
  or a tenant that is 30% of all rows (then isolate that tenant)

WAL / FSYNC
  8k writes/sec x 1 KB WAL = 8 MB/s sequential — disk is fine
  fsync every commit: group commit batches this; measure p99</code></pre>
        <p>The profile table did not need Cassandra. The <em>event log</em> of every last_seen might — 50M users × 1 heartbeat/min is ~830k writes/min. That is a time-series or LSM problem, and it should not live in the same table as the password hash.</p>

        <h3 class="lesson-subhead" id="to-eval">Evaluation: what this chapter still leaves you holding</h3>
        <p>A B-tree primary with sync replicas and serialisable isolation is a superb system of record. It will not serve a 2 million QPS feed, it will not invert text, it will not store 400 TB of click logs cheaply, and a mistaken sequential partition key will concentrate today's traffic on one core. Multi-leader and leaderless designs survive regions going dark; they will also surprise you with conflicting writes unless you designed the merge.</p>
        <p>2PC across more than a handful of participants is an availability trap. Sagas without idempotent steps and a dead-letter queue are an accounting trap. CDC will duplicate events. Global secondary indexes will lag. hash-mod-N will ruin a Friday migration. None of that means "do not use databases"; it means draw the box, name the anomaly, name the lag, and put the money path on the engine that can refuse a write.</p>
        <p>Chapter 10 takes the leaderless, hash-partitioned, quorum-written key-value store and designs it as if you had to build Dynamo on a whiteboard. Everything in this chapter is the vocabulary that design is made of.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) A user writes a comment then immediately reloads and does not see it — which replica did the GET hit, and which two fixes restore read-your-writes? (2) Why does hash(key) % (N+1) move almost every row, and what placement map avoids that? (3) Two doctors each read on_call_count=1 and both go off duty — which isolation anomaly is that, and which Postgres level stops it? (4) When would you pick a saga over 2PC for checkout, and what must the compensate step actually undo?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. These are standard industry storage and distributed-data concepts; every explanation, diagram, table and exercise is original to this course.',
};
