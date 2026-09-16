/** Modern System Design — Chapter 20: A Blob Store.
 *  Immutable large objects, eleven nines of durability, and the split between
 *  a tiny metadata plane and a vast data plane.
 */

export const msdBlobStore = {
  slug: 'blob-store',
  title: 'A Blob Store',
  subtitle:
    'A blob store is not a database. It is a system for immutable, large, opaque objects with durability targets that ordinary replication cannot cheaply hit. Chunking, manifests, pre-signed uploads, erasure coding and scrubbing are the design, not optional extras.',
  byline: 'Modern System Design · Chapter 20 · ~2h 10m read · Intermediate',
  interviewTip:
    'Start with the split: metadata is a strongly consistent small store; bytes are a separately placed data plane. Then say "we chunk, we write a manifest, clients upload with pre-signed URLs so the API servers never touch the payload." Durability is the arithmetic: compare 3-way replication (3x storage) with Reed-Solomon 6+3 (~1.5x) and say where each fails. Finish with the small-object weakness — a blob store is a poor key-value store.',
  sections: [
    {
      id: 'bs-sys',
      title: 'System Design: A Blob Store',
      children: [
        { id: 'bs-why', title: 'Why a database is the wrong starting point' },
        { id: 'bs-imm', title: 'Immutable objects change the whole design' },
      ],
      html: `
        <p>Users upload videos, backups, container images, ML checkpoints, PDFs. The objects are large, opaque, written once, read many times, and almost never updated in place. A database row is the wrong shape: WAL amplification, page splits, backups that copy the same gigabytes again, and a query planner that has nothing to plan.</p>

        <h3 class="lesson-subhead" id="bs-why">Why a database is the wrong starting point</h3>
        <p>Postgres with a <code>bytea</code> column will hold a 20 MB PDF. It will not hold a hundred petabytes of video. The engine assumes values fit in pages and that updates are common. Blob workloads invert both: values are megabytes to gigabytes, and an "update" is a new object with a new id. Put the bytes on a data plane that only appends and replicates; put the name, size, checksum and ACL in a small metadata store. That split is the architecture.</p>
        <p>File systems (NFS, POSIX) give you mutation, directories and locking — extra surface you will spend years making consistent across regions. Block stores give you volumes for VMs. Object stores give you HTTP PUT/GET of immutable blobs with a flat namespace. Pick the third when the product is "store this file forever and serve it."</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="API metadata plane versus chunked data plane">
            <defs>
              <marker id="ah-bs1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="88" height="40" rx="7" />
            <text class="dg-s" x="60" y="88" text-anchor="middle">client</text>
            <rect class="dg-box b" x="152" y="20" width="200" height="52" rx="7" />
            <text class="dg-s" x="252" y="42" text-anchor="middle">metadata plane</text>
            <text class="dg-s" x="252" y="58" text-anchor="middle">id, ACL, manifest</text>
            <rect class="dg-box o" x="152" y="92" width="200" height="52" rx="7" />
            <text class="dg-s" x="252" y="114" text-anchor="middle">data plane</text>
            <text class="dg-s" x="252" y="130" text-anchor="middle">chunks on disks</text>
            <rect class="dg-box g" x="420" y="56" width="280" height="56" rx="7" />
            <text class="dg-s" x="560" y="78" text-anchor="middle">pre-signed PUT of bytes</text>
            <text class="dg-s" x="560" y="94" text-anchor="middle">API never proxies GB</text>
            <path class="dg-line violet" d="M104 84 H148" marker-end="url(#ah-bs1)" />
            <path class="dg-line violet" d="M352 46 H388 V84 H416" marker-end="url(#ah-bs1)" />
            <path class="dg-line violet dash" d="M352 118 H388 V84 H416" marker-end="url(#ah-bs1)" />
          </svg>
          <figcaption>Figure 1 — Metadata is small and consistent. Bytes are large and dumb. Mix them in one process and you get a slow database.</figcaption>
        </figure>
        <p>The interview mistake is drawing one box labelled "S3". The interesting design is two planes with different consistency, scaling and failure domains. The API fleet scales with metadata QPS. The disk fleet scales with bytes. Couple them and a 4 GB upload saturates every request thread.</p>

        <h3 class="lesson-subhead" id="bs-imm">Immutable objects change the whole design</h3>
        <p>Immutability is not a taste. If object <code>v1</code> never changes, caches and CDNs can store it forever (versioned URL). Replication is copy, not merge. Concurrent writers cannot corrupt a blob; they create another. Deletes are tombstones plus a GC that waits until every cache and replica has had a chance to drop it. The one mutation you still need — overwrite — is implemented as write-new then atomically swing the metadata pointer. Readers who already opened <code>v1</code> keep <code>v1</code>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Overwrite as a new blob plus an atomic metadata pointer swing">
            <defs>
              <marker id="ah-bs2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="48" width="140" height="56" rx="7" />
            <text class="dg-s" x="86" y="70" text-anchor="middle">name photo.jpg</text>
            <text class="dg-s" x="86" y="86" text-anchor="middle">pointer = v2</text>
            <rect class="dg-box frozen" x="220" y="20" width="200" height="48" rx="7" />
            <text class="dg-s" x="320" y="40" text-anchor="middle">blob v1 immutable</text>
            <text class="dg-s" x="320" y="56" text-anchor="middle">readers keep v1</text>
            <rect class="dg-box g" x="220" y="88" width="200" height="48" rx="7" />
            <text class="dg-s" x="320" y="108" text-anchor="middle">blob v2 new bytes</text>
            <text class="dg-s" x="320" y="124" text-anchor="middle">commit then swing</text>
            <rect class="dg-box y" x="488" y="48" width="208" height="56" rx="7" />
            <text class="dg-s" x="592" y="70" text-anchor="middle">CDN caches v1 URL</text>
            <text class="dg-s" x="592" y="86" text-anchor="middle">v2 is a new URL</text>
            <path class="dg-line blue dash" d="M156 64 H216" marker-end="url(#ah-bs2)" />
            <path class="dg-line blue" d="M156 88 H216" marker-end="url(#ah-bs2)" />
          </svg>
          <figcaption>Figure 2 — Overwrite is not mutate-in-place. It is a new object plus one atomic pointer. That is why CDNs work.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>YouTube's watch path is a blob store plus a CDN.</strong> If you designed <a href="/learn/modern-system-design/youtube">Chapter 25</a> first, this chapter is the interior of that box. If you are designing this first, Chapter 25 is the reason the box exists.</div>
      `,
    },
    {
      id: 'bs-req',
      title: "Requirements of a Blob Store's Design",
      children: [
        { id: 'bs-fn', title: 'Functional requirements' },
        { id: 'bs-nfn', title: 'Non-functional requirements and eleven nines' },
        { id: 'bs-est', title: 'Capacity arithmetic' },
      ],
      html: `
        <h3 class="lesson-subhead" id="bs-fn">Functional requirements</h3>
        <ol class="lesson-layers">
          <li><strong>PUT</strong> an object up to a stated size (5 TB class, chunked), resumable after disconnect.</li>
          <li><strong>GET</strong> by id, with range requests (video seeking, retry of a chunk).</li>
          <li><strong>HEAD</strong> for size, checksum, content type, user metadata.</li>
          <li><strong>DELETE</strong> with a grace period; optional versioning so overwrite is not silent loss.</li>
          <li><strong>List</strong> by prefix (not a query language) — slow, paginated, eventually consistent is acceptable.</li>
          <li><strong>Pre-signed URLs</strong> so browsers upload/download without the API fleet seeing bytes.</li>
        </ol>
        <p>Out of scope unless asked: POSIX rename across prefixes, server-side SQL over object bodies, and "edit byte 12 of a 4 GB file". Those are a filesystem or a database.</p>

        <h3 class="lesson-subhead" id="bs-nfn">Non-functional requirements and eleven nines</h3>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Durability</td><td>11 nines / year class</td><td>S3's public claim; it is erasure coding plus scrubbing, not luck</td></tr>
            <tr><td>Availability</td><td>99.9%–99.99% GET</td><td>Durability and availability are different; you can lose a region and keep the bits</td></tr>
            <tr><td>GET TTFB</td><td>tens of ms in-region for small; throughput for large</td><td>Video cares about the second; backups care about GB/s</td></tr>
            <tr><td>PUT</td><td>resumable, parallel chunks</td><td>Mobile uploads drop</td></tr>
            <tr><td>Consistency</td><td>read-after-write for new PUTs in-region</td><td>List and cross-region may lag; say so</td></tr>
          </tbody>
        </table>
        <p>Eleven nines of annual durability is "one object in 100 billion lost per year" as a modelling target, not a measurement you can confirm with a spreadsheet. You get there by independent failure domains, checksums, background scrubbing, and enough coding redundancy that two disks and a rack can die together. Availability is a different SLO: a region outage can still keep every bit, while GET 404s until DNS and the control plane recover. Do not quote 11 nines as uptime.</p>

        <h3 class="lesson-subhead" id="bs-est">Capacity arithmetic</h3>
        <pre><code>ASSUME a video + backup store
  500k new objects/day, average 80 MB  -&gt; 40 TB/day ingest
  keep 4 years hot-ish, then colder    -&gt; ~58 PB logical
  200k GET/s at peak of 4 MB (chunks), not whole files

3-WAY REPLICATION
  58 PB * 3 = 174 PB raw   — the bill that makes CFOs notice

ERASURE 6+3 (data+parity)
  58 PB * 1.5 = 87 PB raw  — half the disks, more CPU and rebuild pain

EGRESS
  if 10% of GET volume leaves the region via CDN, plan that bill
  separately; the blob store should not be the edge</code></pre>
        <p>Ingest of 40 TB/day is ~3.7 Gbps average, perhaps 15 Gbps peak. The data plane's NIC and disk sequential write matter; the metadata plane's QPS is 500k/86400 ≈ 6 PUTs/s of objects plus millions of chunk completions — still small if you chunk on the client and only commit the manifest at the end. <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> is the habit: convert "store videos" into disks, NICs and metadata rows before you draw boxes.</p>
      `,
    },
    {
      id: 'bs-des',
      title: 'Design of a Blob Store',
      children: [
        { id: 'bs-planes', title: 'Metadata plane versus data plane' },
        { id: 'bs-chunk', title: 'Chunking, manifests and pre-signed uploads' },
        { id: 'bs-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="bs-planes">Metadata plane versus data plane</h3>
        <p>Metadata: object id, owner, ACL, content-type, size, checksum, storage class, pointer to a manifest of chunk ids, version. This is a few hundred bytes. Store it in a strongly consistent replicated database or a KV store with W=N for the pointer swing. The commit of a successful upload is an atomic metadata write. Until that write, GET 404s; after it, GET finds the chunks. This is how you avoid serving a half-uploaded video.</p>
        <p>Data plane: chunk servers (or a cluster of erasure-coded disks, or S3 itself if you are building a product on top). Chunks are identified by content hash (dedup is a bonus, integrity is the point). Place chunks by hash into failure domains: different disks, racks, AZs. Do not put all chunks of one object in one rack even if the hash wants it — encode placement as "hash then pick distinct domains."</p>
        <p>The metadata store must not be the same failure domain as the disks. If a rack death takes both the pointer and two of three copies, durability arithmetic is fiction. This is the same independence argument as <a href="/learn/modern-system-design/non-functional">Chapter 4</a>'s correlated-failure warning.</p>

        <h3 class="lesson-subhead" id="bs-chunk">Chunking, manifests and pre-signed uploads</h3>
        <p>Split at 8–16 MB. The client (or an upload proxy at the edge) PUTs chunks in parallel to pre-signed URLs, retries the failed ones, then PUTs a manifest of hashes. The API verifies the manifest against received chunks, writes metadata, returns the object id. Range GET maps byte offsets onto chunks. Resumable upload is "which chunks of this upload-id are already present?"</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Client uploads chunks in parallel then commits a manifest">
            <defs>
              <marker id="ah-bs3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="72" width="88" height="40" rx="7" />
            <text class="dg-s" x="60" y="96" text-anchor="middle">client</text>
            <rect class="dg-box o" x="148" y="16" width="108" height="32" rx="6" />
            <text class="dg-s" x="202" y="36" text-anchor="middle">chunk 1</text>
            <rect class="dg-box o" x="148" y="56" width="108" height="32" rx="6" />
            <text class="dg-s" x="202" y="76" text-anchor="middle">chunk 2</text>
            <rect class="dg-box o" x="148" y="96" width="108" height="32" rx="6" />
            <text class="dg-s" x="202" y="116" text-anchor="middle">chunk 3</text>
            <rect class="dg-box p" x="316" y="56" width="140" height="56" rx="7" />
            <text class="dg-s" x="386" y="78" text-anchor="middle">data disks</text>
            <text class="dg-s" x="386" y="94" text-anchor="middle">by content hash</text>
            <rect class="dg-box b" x="508" y="56" width="192" height="56" rx="7" />
            <text class="dg-s" x="604" y="78" text-anchor="middle">manifest commit</text>
            <text class="dg-s" x="604" y="94" text-anchor="middle">metadata atomic</text>
            <path class="dg-line green" d="M104 92 H144" marker-end="url(#ah-bs3)" />
            <path class="dg-line green" d="M256 32 H288 V84 H312" marker-end="url(#ah-bs3)" />
            <path class="dg-line green" d="M256 72 H312" marker-end="url(#ah-bs3)" />
            <path class="dg-line green" d="M256 112 H288 V84 H312" marker-end="url(#ah-bs3)" />
            <path class="dg-line green" d="M456 84 H504" marker-end="url(#ah-bs3)" />
            <text class="dg-s" x="16" y="156">Failed chunk 2 retries without restarting the 80 MB video.</text>
            <text class="dg-s" x="16" y="172">GET is 404 until the metadata write; listing chunks is not existence.</text>
          </svg>
          <figcaption>Figure 3 — Bytes never sit in API RAM. The only atomic step is the metadata pointer to a complete manifest.</figcaption>
        </figure>
        <p>Pre-signed URLs expire (minutes to hours). They encode bucket, object, method, and a signature. The data plane checks the signature; the API servers scale with metadata QPS, not with gigabits. This is also how you keep long-lived credentials off the browser. Clock skew of a few minutes is tolerated; a URL valid for 24 hours is a leak if the tab is shared.</p>

        <h3 class="lesson-subhead" id="bs-api">API sketch</h3>
        <pre><code>POST /uploads                  -&gt; { uploadId, chunkSize, urls[] }
PUT  /uploads/{id}/chunks/{n}  pre-signed, body = bytes
POST /uploads/{id}/complete    { hashes[] } -&gt; { objectId, version }
GET  /objects/{id}             Range: bytes=start-end
HEAD /objects/{id}
DELETE /objects/{id}
GET  /objects?prefix=&amp;cursor=</code></pre>
        <p>Complete is idempotent: retry after a timeout must not create two object ids. Use the upload id as a dedup key. Range GET is mandatory for video; without it every seek re-downloads the file.</p>
      `,
    },
    {
      id: 'bs-con',
      title: 'Design Considerations of a Blob Store',
      children: [
        { id: 'bs-ec', title: 'Replication versus erasure coding' },
        { id: 'bs-place', title: 'Placement, failure domains and scrubbing' },
        { id: 'bs-ver', title: 'Versioning and storage classes' },
      ],
      html: `
        <h3 class="lesson-subhead" id="bs-ec">Replication versus erasure coding</h3>
        <p>3-way replication: simple, fast rebuild (copy the object), 3× storage. Erasure coding (Reed-Solomon k+m, e.g. 6+3): split into k data shards and m parity; any k of k+m recover the object. Storage overhead (k+m)/k. Rebuild is CPU-heavy and reads from many disks — the "rebuild storm" after a large disk failure is a well-known cluster event. Use replication for hot, small, latency-sensitive objects; erasure coding for cold, large, capacity-sensitive ones. Many stores use both as storage classes.</p>
        <table>
          <thead><tr><th></th><th>3-way copy</th><th>RS 6+3</th></tr></thead>
          <tbody>
            <tr><td>Raw / logical</td><td>3.0×</td><td>1.5×</td></tr>
            <tr><td>Survive</td><td>2 copies dead</td><td>3 shards dead</td></tr>
            <tr><td>GET latency</td><td>one disk</td><td>k disks, or one if you keep a decoded cache</td></tr>
            <tr><td>Rebuild</td><td>sequential copy</td><td>read k shards, recompute</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Three-way replication versus Reed-Solomon six plus three">
            <defs>
              <marker id="ah-bs4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band y" x="12" y="16" width="344" height="144" rx="10" />
            <text class="dg-h" x="26" y="36">3-WAY COPY</text>
            <text class="dg-s" x="26" y="58">three full objects, 3.0x disks</text>
            <text class="dg-s" x="26" y="76">GET from any one replica</text>
            <text class="dg-s" x="26" y="94">rebuild = stream a copy</text>
            <text class="dg-s" x="26" y="112">hot path, small objects</text>
            <text class="dg-s" x="26" y="136">simple, expensive at PB</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="144" rx="10" />
            <text class="dg-h" x="382" y="36">RS 6+3</text>
            <text class="dg-s" x="382" y="58">six data, three parity, 1.5x</text>
            <text class="dg-s" x="382" y="76">any six shards rebuild all</text>
            <text class="dg-s" x="382" y="94">GET may touch six disks</text>
            <text class="dg-s" x="382" y="112">cold, large, capacity path</text>
            <text class="dg-s" x="382" y="136">rebuild storms after disk death</text>
          </svg>
          <figcaption>Figure 4 — Same durability class, different bills. Interviews that only say "erasure coding" miss the rebuild tax.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bs-place">Placement, failure domains and scrubbing</h3>
        <p>Never place two shards of the same code stripe on the same disk, rack, or AZ if N allows. Scrub: read chunks in the background, compare checksums, reconstruct on mismatch. Bit rot is real; eleven nines without scrubbing is a press release. Track "last scrubbed" in metadata. Throttle scrubs so they do not compete with user GET at peak.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Scrubber reading checksums and reconstructing a rotten shard">
            <defs>
              <marker id="ah-bs5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="28" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="54" text-anchor="middle">shard A ok</text>
            <rect class="dg-box g" x="152" y="28" width="120" height="44" rx="7" />
            <text class="dg-s" x="212" y="54" text-anchor="middle">shard B ok</text>
            <rect class="dg-box r" x="288" y="28" width="120" height="44" rx="7" />
            <text class="dg-s" x="348" y="54" text-anchor="middle">shard C rot</text>
            <rect class="dg-box b" x="448" y="20" width="252" height="60" rx="7" />
            <text class="dg-s" x="574" y="44" text-anchor="middle">scrubber</text>
            <text class="dg-s" x="574" y="60" text-anchor="middle">checksum vs reconstruct</text>
            <path class="dg-line rose" d="M408 50 H444" marker-end="url(#ah-bs5)" />
            <rect class="dg-band y" x="16" y="104" width="684" height="68" rx="10" />
            <text class="dg-s" x="32" y="128">Silent bit flips wait years. Scrub on a duty cycle, not only on GET.</text>
            <text class="dg-s" x="32" y="148">Throttle vs user traffic; a 20 TB rebuild must not starve video.</text>
          </svg>
          <figcaption>Figure 5 — Durability models assume you notice corruption. Scrubbing is how you notice before the next two disks die.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bs-ver">Versioning and storage classes</h3>
        <p>Versioning: each complete PUT is a new version; DELETE inserts a delete marker. You pay storage for ghosts until lifecycle rules expire them. Storage classes: hot (replicated SSD), warm (erasure HDD), cold (tape/Glacier-like, GET in hours). Lifecycle is a batch job on metadata, not a rewrite of bytes, until you actually move classes — then it is a drain with checksums.</p>
        <div class="lesson-callout"><strong>Multipart complete is the consistency event.</strong> Listing chunks is not "the object exists." Clients that GET by guessed id during upload should 404. If they 200 a prefix of the bytes, you have a player-crash bug that looks like a network bug.</div>
      `,
    },
    {
      id: 'bs-eval',
      title: "Evaluation of a Blob Store's Design",
      children: [
        { id: 'bs-short', title: 'What this design does well and where it fails' },
        { id: 'bs-small', title: 'The small-object weakness' },
        { id: 'bs-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="bs-short">What this design does well and where it fails</h3>
        <p>It stores large immutable objects cheaply, survives disk and AZ loss, and keeps API servers off the byte path. It fails at rename-as-transaction across many objects, at POSIX semantics, at low-latency tiny GETs, and at "query the contents." Cross-region replication is asynchronous; a GET in the replica region can 404 for seconds or minutes. That is not 11 nines of availability.</p>
        <p>Rebuild after a 20 TB disk death in an erasure-coded cluster can saturate the remaining disks. Rate-limit rebuilds; accept a window of reduced redundancy. This is the operational truth behind the durability model. Listing by prefix is eventually consistent and slow; if your product needs "all photos of user 12 in date order", that is an index, not ListObjects.</p>

        <h3 class="lesson-subhead" id="bs-small">The small-object weakness</h3>
        <p>A 1 KB object still pays a metadata write, a manifest (or a one-chunk special case), and a disk write that may be 4 KB plus coding. A billion 1 KB objects is a metadata-plane disaster and a terrible use of erasure coding. That workload is the <a href="/learn/modern-system-design/key-value-store">key-value store</a>. Some blob stores pack small objects into logs (S3's own internals, or a "small object" tier). Mention packing if the prompt mixes avatars and movies; do not pretend one plane is optimal for both.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Small objects belong in a KV store, large immutable in a blob store">
            <defs>
              <marker id="ah-bs6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="48" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="70" text-anchor="middle">1 KB session blob</text>
            <text class="dg-s" x="116" y="86" text-anchor="middle">millions per sec</text>
            <rect class="dg-box p" x="268" y="48" width="160" height="56" rx="7" />
            <text class="dg-s" x="348" y="80" text-anchor="middle">KV store</text>
            <rect class="dg-box o" x="492" y="20" width="208" height="48" rx="7" />
            <text class="dg-s" x="596" y="40" text-anchor="middle">80 MB video</text>
            <text class="dg-s" x="596" y="56" text-anchor="middle">write once</text>
            <rect class="dg-box g" x="492" y="84" width="208" height="48" rx="7" />
            <text class="dg-s" x="596" y="112" text-anchor="middle">blob store</text>
            <path class="dg-line violet" d="M216 76 H264" marker-end="url(#ah-bs6)" />
            <text class="dg-s" x="16" y="148">Same PUT/GET words. Different metadata rate, disk IO, and coding.</text>
          </svg>
          <figcaption>Figure 6 — The API looks like PUT/GET in both cases. The durability math and the metadata rate do not.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Where the design falls short">
            <rect class="dg-band r" x="12" y="16" width="696" height="108" rx="10" />
            <text class="dg-h" x="26" y="36">THIS DESIGN DOES NOT</text>
            <text class="dg-s" x="26" y="58">give POSIX mutate, rename as a multi-object transaction, or SQL</text>
            <text class="dg-s" x="26" y="76">serve 200 us tiny GETs at millions QPS (use Chapter 10)</text>
            <text class="dg-s" x="26" y="94">guarantee cross-region read-after-write; list is eventually consistent</text>
          </svg>
          <figcaption>Figure 7 — Say the holes in the interview. The strongest blob answer is also a KV referral.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bs-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why must the API fleet not proxy the object body? (2) Compare 3× replication and RS 6+3 on storage and on rebuild. (3) When does an object become GET-able, and why not earlier? (4) A product stores 800-byte JSON documents in the blob store — what goes wrong, and which chapter is the fix?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Blob stores, erasure coding and object storage classes are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
