/** Modern System Design — Chapter 36: Design Google Docs.
 *  Collaborative editing, OT vs CRDT, presence, persistence, websockets.
 */

export const msdGoogleDocs = {
  slug: 'google-docs',
  title: 'Design Google Docs',
  subtitle:
    'A document that two people can type into at once is a concurrency problem first and a storage problem second. Operational Transformation and CRDTs are different bets about where the truth lives. Presence and persistence ride a websocket; conflict-free-enough is the honest SLO.',
  byline: 'Modern System Design · Chapter 36 · ~1h 55m read · Advanced',
  interviewTip:
    'Do not implement OT on the whiteboard. Name the operations, the need for a total order or a merge function, and why a last-write-wins blob would destroy the product. Compare OT (central sequencer, smaller payloads, mature in Docs-like systems) with CRDTs (better offline, fatter state, trickier UX for intent). Then talk about persistence snapshots plus an op log, and presence as ephemeral. Interviewers want the trade-off, not a paper recitation.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Google Docs',
      children: [
        { id: 'gd-what', title: 'What we are actually building' },
        { id: 'gd-not', title: 'Why last-write-wins is not a document' },
        { id: 'gd-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>A document is a sequence of characters that several people mutate at once while looking at almost the same picture. Filesystems solve this with locks. Products that feel like Google Docs refuse the lock. That refusal is the architecture.</p>

        <h3 class="lesson-subhead" id="gd-what">What we are actually building</h3>
        <p>Create and persist documents, share them, edit concurrently with caret presence, and recover after a laptop sleeps. Comments and suggestions are operations too. Export/PDF is a worker. We are not building the full Office clone: no pivot tables, no macro engine. The interview is won on concurrency, not on ribbon UI.</p>
        <p>Latency the user feels is round-trip to a sequencer or to peers, typically tens of milliseconds in-region, not a 200 ms REST POST per keystroke. That forces a sticky websocket (or WebRTC) to a doc-affinity server, not a stateless load-balanced HTTP farm hashing each letter.</p>

        <h3 class="lesson-subhead" id="gd-not">Why last-write-wins is not a document</h3>
        <p>If Alice types "cat" and Bob types "dog" in the same empty doc, LWW snapshots produce one word and silently destroy the other. Users will not forgive that. You need operations (insert/delete at a position) and a rule that composes them. That rule is OT or a CRDT. Presence (who is here, where is their caret) is a different, lossy stream.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Snapshot last-write-wins versus operation merge">
            <defs>
              <marker id="ah-gd1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="124" rx="10" />
            <text class="dg-h" x="26" y="36">SNAPSHOT LWW</text>
            <text class="dg-s" x="26" y="58">save whole doc on each blur</text>
            <text class="dg-s" x="26" y="76">concurrent edits clobber</text>
            <text class="dg-s" x="26" y="94">fine for a settings blob</text>
            <text class="dg-s" x="26" y="112">fatal for a shared essay</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="124" rx="10" />
            <text class="dg-h" x="382" y="36">OPERATIONS</text>
            <text class="dg-s" x="382" y="58">insert/delete with position</text>
            <text class="dg-s" x="382" y="76">compose on a sequencer</text>
            <text class="dg-s" x="382" y="94">or merge via CRDT</text>
            <text class="dg-s" x="382" y="112">both writers survive</text>
          </svg>
          <figcaption>Figure 1 — The product dies if you treat a doc like a JSON blob in S3.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gd-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Live edits</td><td>Websocket / connection servers</td></tr>
            <tr><td>Op order (OT)</td><td>Per-doc sequencer</td></tr>
            <tr><td>Snapshots + op log</td><td>DB / log store</td></tr>
            <tr><td>Presence</td><td>Ephemeral pub/sub</td></tr>
            <tr><td>Export, images</td><td>Queue + blob store</td></tr>
            <tr><td>ACL</td><td>Metadata service, not the op path</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Shard by document id.</strong> All live editors of a doc must meet on one primary (or one CRDT replica set). Hashing keystrokes across a random fleet is how you invent split-brain typing.</div>
      `,
    },
    {
      id: 'requirements',
      title: 'Requirements of Google Docs’ Design',
      children: [
        { id: 'gd-func', title: 'Functional requirements' },
        { id: 'gd-nf', title: 'Non-functional requirements' },
        { id: 'gd-est', title: 'Estimation' },
        { id: 'gd-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gd-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li>Create, open, share documents with ACLs.</li>
          <li>Concurrent character editing with low-visible lag.</li>
          <li>Presence: caret and names.</li>
          <li>History / version restore at coarse granularity.</li>
          <li>Offline-ish: queue ops, merge on reconnect (harder with OT).</li>
          <li>Images and export as asynchronous jobs.</li>
        </ol>

        <h3 class="lesson-subhead" id="gd-nf">Non-functional requirements</h3>
        <p>Op round-trip p95 under ~80 ms in-region. Durability: do not lose acknowledged keystrokes (the product-killing bug). Availability: editing a doc should survive one AZ if the sequencer can fail over with a short pause. Scale: millions of docs idle, tens of thousands concurrently hot. Consistency: every client converges to the same sequence after they have seen the same ops — not "eventual maybe". Security: ACL on every open; ops from revoked users drop.</p>

        <h3 class="lesson-subhead" id="gd-est">Estimation</h3>
        <pre><code>10 million monthly docs, 1% concurrently open → 100k live docs
peak 3 editors/doc average 1.2 → ~120k websocket sessions
typing: 5 ops/s active editor, 10% of sessions typing
  → 12k sessions × 5 = 60k ops/s cluster-wide
mean op ~ 80 B → ~5 MB/s of op log, tiny
snapshot every 1000 ops or 30 s: still small vs video

the bottleneck is connections and sequencer CPU per hot doc,
not bytes. A viral doc with 500 carets is a special case:
  presence fan-out, not the character log.</code></pre>
        <p><a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> again: this is a connection and ordering problem. Storage is almost a rounding error until you keep every historical snapshot forever.</p>

        <h3 class="lesson-subhead" id="gd-api">API sketch</h3>
        <pre><code>POST /docs                  → { docId }
GET  /docs/{id}             snapshot + ACL
WS   /docs/{id}/session     ops, presence, ack seq
POST /docs/{id}/acl         share
GET  /docs/{id}/history     snapshot ids
POST /docs/{id}/restore     { snapshotId }</code></pre>
        <p>The websocket is the product. REST is for open, share, export. Do not PUT the whole document on every pause; that is Figure 1's failure mode. Session tokens should bind to doc id and user id, expire, and be rotatable when ACL changes. A stolen websocket URL that lives forever is a share-by-accident bug.</p>
      `,
    },
    {
      id: 'design',
      title: 'Design of Google Docs',
      children: [
        { id: 'gd-path', title: 'Websocket, log, snapshot' },
        { id: 'gd-pres', title: 'Presence' },
        { id: 'gd-acl', title: 'Persistence and ACL' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gd-path">Websocket, log, snapshot</h3>
        <p>Client opens a session to a connection server pinned to the doc's sequencer. Locally applied ops show immediately (optimistic). The sequencer assigns a monotonic sequence number, transforms against concurrent ops it already committed, appends to the log, and broadcasts. Clients apply the committed stream; if their optimistic op was transformed, the caret jumps — that is the OT tax, and it is why you buffer and transform incoming server ops against in-flight local ops.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Clients through connection servers to a per-document sequencer and log">
            <defs>
              <marker id="ah-gd2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="24" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="48" text-anchor="middle">Alice</text>
            <rect class="dg-box y" x="16" y="88" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="112" text-anchor="middle">Bob</text>
            <rect class="dg-box b" x="160" y="48" width="140" height="56" rx="7" />
            <text class="dg-s" x="230" y="72" text-anchor="middle">conn servers</text>
            <text class="dg-s" x="230" y="88" text-anchor="middle">sticky on doc</text>
            <rect class="dg-box p" x="360" y="48" width="140" height="56" rx="7" />
            <text class="dg-s" x="430" y="72" text-anchor="middle">sequencer</text>
            <text class="dg-s" x="430" y="88" text-anchor="middle">total order</text>
            <rect class="dg-box g" x="548" y="20" width="152" height="44" rx="7" />
            <text class="dg-s" x="624" y="46" text-anchor="middle">op log</text>
            <rect class="dg-box o" x="548" y="84" width="152" height="44" rx="7" />
            <text class="dg-s" x="624" y="110" text-anchor="middle">snapshot</text>
            <path class="dg-line blue" d="M116 44 H140 V76 H156" marker-end="url(#ah-gd2)" />
            <path class="dg-line blue" d="M116 108 H140 V76 H156" marker-end="url(#ah-gd2)" />
            <path class="dg-line blue" d="M300 76 H356" marker-end="url(#ah-gd2)" />
            <path class="dg-line blue" d="M500 64 H544" marker-end="url(#ah-gd2)" />
            <path class="dg-line blue" d="M500 88 H544" marker-end="url(#ah-gd2)" />
          </svg>
          <figcaption>Figure 2 — Affinity to one sequencer is the architecture. The log is the truth; snapshots are a cache of it.</figcaption>
        </figure>
        <p>Periodically compact: take the latest snapshot, apply ops through sequence S, write snapshot S, truncate the log before S (keep a window for slow clients). A client that slept for a day loads snapshot + remaining ops, not a million keystrokes.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Snapshot plus a tail of operations">
            <rect class="dg-box o" x="16" y="40" width="200" height="52" rx="7" />
            <text class="dg-s" x="116" y="70" text-anchor="middle">snapshot at seq 9000</text>
            <rect class="dg-box g" x="248" y="40" width="220" height="52" rx="7" />
            <text class="dg-s" x="358" y="70" text-anchor="middle">ops 9001–9120</text>
            <rect class="dg-box b" x="500" y="40" width="200" height="52" rx="7" />
            <text class="dg-s" x="600" y="70" text-anchor="middle">live tail</text>
            <text class="dg-s" x="16" y="116">Reconnect = snapshot + catch-up, never replay from seq 0.</text>
          </svg>
          <figcaption>Figure 3 — Compaction is how a year-old doc still opens in a second.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gd-pres">Presence</h3>
        <p>Presence is not in the op log. It is ephemeral: user id, colour, caret index, last-seen. Broadcast on a pub/sub channel for the doc, TTL of a few seconds, no disk. If you persist presence you will replay ghosts on restore. Fan-out to 500 watchers is a separate scaling problem — sample or throttle caret updates (every 50 ms, not every mouse pixel).</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Presence as a lossy side channel beside the op log">
            <defs>
              <marker id="ah-gd3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="44" width="200" height="52" rx="7" />
            <text class="dg-s" x="116" y="74" text-anchor="middle">durable op log</text>
            <rect class="dg-box y" x="260" y="44" width="200" height="52" rx="7" />
            <text class="dg-s" x="360" y="74" text-anchor="middle">lossy presence</text>
            <rect class="dg-box p" x="504" y="44" width="196" height="52" rx="7" />
            <text class="dg-s" x="602" y="74" text-anchor="middle">TTL, no replay</text>
            <path class="dg-line pink dash" d="M216 70 H256" marker-end="url(#ah-gd3)" />
            <path class="dg-line pink dash" d="M460 70 H500" marker-end="url(#ah-gd3)" />
          </svg>
          <figcaption>Figure 4 — Mixing presence into the op log makes history a graveyard of carets.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gd-acl">Persistence and ACL</h3>
        <p>Snapshots and logs go to a store sharded by doc id — the <a href="/learn/modern-system-design/blob-store">blob store</a> for large snapshots, a replicated log for the tail. ACL is checked on session open and on share changes; a revoked user is disconnected. Do not re-check ACL on every character (too slow) without a push invalidation when ACL changes. Images are blobs; the doc stores pointers, or you will serialise megabytes through the sequencer. Encryption at rest is a snapshot concern; encryption of the live websocket is TLS plus authz on the session ticket. Losing an unacked op after a sequencer failover is the bug users describe as "my sentence vanished". Fencing the old primary is mandatory, the same lesson as any leader in <a href="/learn/modern-system-design/key-value-store">Chapter 10</a>.</p>
      `,
    },
    {
      id: 'concurrency',
      title: 'Concurrency in Collaborative Editing',
      children: [
        { id: 'gd-ot', title: 'OT versus CRDT, honestly' },
        { id: 'gd-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gd-ot">OT versus CRDT, honestly</h3>
        <p>Operational Transformation: each op is defined against a known version. Concurrent ops are transformed so they can be applied in the sequencer's total order without losing intent. Requires a central authority (or a very careful peer protocol). Payloads are small. Offline is painful: you must transform a long local queue against a long server gap, and some intents are ambiguous. This is the Google Docs / Etherpad family.</p>
        <p>CRDTs (e.g. RGA, Yjs, Automerge): every character (or run) has a unique id; inserts and deletes commute by construction. Peers can merge without a sequencer. Offline is natural. State is fatter (ids, tombstones). UX surprises: "split tombstones", duplicate bullets, and merge that is mathematically correct but not what a human meant. You still often elect a server to persist and to fan out, so "no central server" is a half-truth.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="OT with a sequencer versus CRDT merge">
            <rect class="dg-band b" x="12" y="16" width="344" height="144" rx="10" />
            <text class="dg-h" x="26" y="36">OT</text>
            <text class="dg-s" x="26" y="58">central total order</text>
            <text class="dg-s" x="26" y="76">transform concurrent ops</text>
            <text class="dg-s" x="26" y="94">small ops, mature editors</text>
            <text class="dg-s" x="26" y="112">offline is the hard mode</text>
            <text class="dg-s" x="26" y="136">sequencer is an SPOF to HA</text>
            <rect class="dg-band p" x="368" y="16" width="340" height="144" rx="10" />
            <text class="dg-h" x="382" y="36">CRDT</text>
            <text class="dg-s" x="382" y="58">commutative merge</text>
            <text class="dg-s" x="382" y="76">ids on every atom</text>
            <text class="dg-s" x="382" y="94">offline is the easy mode</text>
            <text class="dg-s" x="382" y="112">fatter state, GC tombstones</text>
            <text class="dg-s" x="382" y="136">intent can still surprise UX</text>
          </svg>
          <figcaption>Figure 5 — Pick OT if you will always have a live sequencer. Pick CRDT if offline and peer merge are the product.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Two inserts transformed against a shared sequence">
            <defs>
              <marker id="ah-gd4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="44" width="180" height="52" rx="7" />
            <text class="dg-s" x="106" y="74" text-anchor="middle">Alice insert @ 3</text>
            <rect class="dg-box o" x="232" y="44" width="180" height="52" rx="7" />
            <text class="dg-s" x="322" y="74" text-anchor="middle">Bob insert @ 3</text>
            <rect class="dg-box g" x="448" y="36" width="252" height="68" rx="7" />
            <text class="dg-s" x="574" y="62" text-anchor="middle">seq: shift Bob to 4</text>
            <text class="dg-s" x="574" y="78" text-anchor="middle">both inserts remain</text>
            <path class="dg-line violet" d="M196 70 H228" marker-end="url(#ah-gd4)" />
            <path class="dg-line violet" d="M412 70 H444" marker-end="url(#ah-gd4)" />
          </svg>
          <figcaption>Figure 6 — OT's job is not "pick a winner". It is "both inserts, positions adjusted".</figcaption>
        </figure>
        <table>
          <thead><tr><th></th><th>OT</th><th>CRDT</th></tr></thead>
          <tbody>
            <tr><td>Authority</td><td>sequencer</td><td>math + optional server</td></tr>
            <tr><td>Offline</td><td>awkward</td><td>natural</td></tr>
            <tr><td>Payload</td><td>small</td><td>ids, tombstones</td></tr>
            <tr><td>UX risk</td><td>transform bugs</td><td>odd merges</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="gd-eval">Evaluation</h3>
        <p>This design gives concurrent typing, durable history, and presence. It fails at true multi-region active-active OT without a global sequencer (cross-region lag becomes visible transform jitter). CRDT across oceans is easier and still not free. Very large docs (100 MB paste) blow snapshots and memory; you need size limits. Comments threaded to positions break when text is deleted — another transform problem. We did not design real-time voice, nor Excel-class formula engines. Undo is not "pop a stack": it is an inverse op that must transform against everything that landed since, or undo becomes a time machine that fights other people.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 132" role="img" aria-label="Where the collaborative editor design falls short">
            <rect class="dg-band r" x="12" y="16" width="696" height="100" rx="10" />
            <text class="dg-h" x="26" y="36">HOLES</text>
            <text class="dg-s" x="26" y="58">global OT sequencer latency; viral-doc presence fan-out</text>
            <text class="dg-s" x="26" y="76">paste bombs, comment anchors, formula graphs</text>
            <text class="dg-s" x="26" y="94">ACL delay if you never invalidate the session</text>
          </svg>
          <figcaption>Figure 7 — A Docs interview that never names offline or a hot-doc fan-out is unfinished.</figcaption>
        </figure>
        <p>Presence colours and names are a privacy leak in shared links; honour ACL on the presence channel too. Anonymous view-only sessions should not advertise emails.</p>
        <p>Time-travel history for lawyers is a different product from editor undo. You may snapshot hourly for compliance and still compact the live op log. Do not confuse the two stores.</p>
        <p>Mobile clients will sleep mid-op. Idempotency keys on ops (client-generated) stop double-insert on retry. The sequencer must ignore duplicates by id, not only by bytes.</p>
        <p>Rich text is still ops: split, join, annotate. Treat a bold range as metadata on a span, or every style change becomes a character rewrite and OT gets harder.</p>
        <p>Suggestions/comments as first-class ops let you keep them in the same sequencer. A parallel store will desync on restore.</p>
        <p>Quota: max doc size, max ops/s per doc, max editors. A 500-caret launch event is a load test you did not schedule.</p>
        <p>Export must freeze a sequence number, render that snapshot, and not chase the live tail, or PDFs never match what people saw.</p>
        <p>Close the websocket on ACL revoke even if ops are in flight. Ack only ops that passed authz at sequence time.</p>
        <p>A doc that is "too hot" should shed presence (view-only crowd) before shedding typing. The product is the editors.</p>
        <p>Test OT with two clients and a delayed packet, not with a unit test of a single transform function only. Intent bugs are integration bugs.</p>
        <p>GC of CRDT tombstones needs a consensus that every replica has seen the delete. Skipping that is how documents grow forever.</p>
        <p>Accessibility: live carets should not trap screen readers on every remote keystroke. Throttle announcements. That is a presence design choice.</p>
        <p>Conflict UI ("we merged both sentences") is more honest than silent CRDT surprises. Show it when confidence is low.</p>
        <p>That is the design: ops, a sequencer or a merge, snapshots, ephemeral presence, and an ACL that can cut the wire.</p>
        <p>Do not implement the full OT algebra on the board. Name the transform, the total order, and the snapshot cadence. That is the pass.</p>

        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why does LWW destroy the product? (2) What does the sequencer actually order? (3) Why is presence not in the op log? (4) Give one honest reason to choose CRDT over OT, and one the other way.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Operational transformation, CRDTs and collaborative-editing persistence are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
