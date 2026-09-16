/** Modern System Design — Chapter 25: Design YouTube.
 *  The first full design problem: a read-dominated, bandwidth-bound video platform.
 */

export const msdYoutube = {
  slug: 'youtube',
  title: 'Design YouTube',
  subtitle:
    'The first full design problem, and a deliberate choice of opener: video forces you to confront storage, bandwidth and asynchronous compute all at once, and its numbers are so lopsided that the arithmetic does most of the architectural work for you.',
  byline: 'Modern System Design · Chapter 25 · ~1h 30m read · Advanced',
  interviewTip:
    'Two moves separate a strong YouTube answer from a weak one. First, split the upload path from the watch path early and out loud — they have opposite characteristics, and candidates who design "one system" tie themselves in knots. Second, get to the bandwidth number fast: once you have said "roughly 1 Tbps at peak", the interviewer knows you understand that this is a distribution problem with a database attached, not a database problem with video attached. Candidates who spend twenty minutes on the metadata schema have misread the question.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: YouTube',
      children: [
        { id: 'yt-what', title: 'What we are actually building' },
        { id: 'yt-why-first', title: 'Why this is the right first design problem' },
        { id: 'yt-two-paths', title: 'The two paths through the system' },
        { id: 'yt-blocks', title: 'Which building blocks this needs' },
      ],
      html: `
        <p>Everything up to here has been parts. This chapter is the first time we assemble them into a whole system, and from now on the shape of each chapter is the one <a href="/learn/modern-system-design/building-blocks">Chapter 6</a> promised: the problem, then requirements, then estimation, then a high-level design, then detail, then an honest evaluation of what we got wrong.</p>

        <h3 class="lesson-subhead" id="yt-what">What we are actually building</h3>
        <p>A video platform where users upload videos of arbitrary length and quality, and other users watch them on any device and any connection, starting playback almost immediately and without buffering. Around that core sit the things that make it a product: search, recommendations, view counts, comments, subscriptions and channels.</p>
        <p>The temptation is to treat all of that as one system. It is not. The upload path and the watch path have almost nothing in common, and recognising that is the first real design decision.</p>

        <h3 class="lesson-subhead" id="yt-why-first">Why this is the right first design problem</h3>
        <p>Video is a good teacher because it refuses to let you ignore any dimension. A URL shortener is all metadata and no bytes; a chat system is all latency and small payloads. Video is large, expensive to process, expensive to store, expensive to move, and read far more often than written — so it exercises the blob store, the CDN, the queue, the worker fleet, the cache and the database in one problem.</p>
        <p>It also demonstrates the central claim of <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> more starkly than any other design: the estimation genuinely dictates the architecture. You do not need taste to know that YouTube needs a CDN. You need one multiplication.</p>

        <h3 class="lesson-subhead" id="yt-two-paths">The two paths through the system</h3>
        <p>Before any diagram, separate the two flows and note how differently they behave.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Comparison of the upload path and the watch path showing their opposite characteristics">
            <defs>
              <marker id="ah-yt1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="220" rx="11" />
            <text class="dg-h" x="26" y="36">UPLOAD PATH · WRITE</text>
            <rect class="dg-box o" x="26" y="46" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="63" text-anchor="middle">rare · heavy · slow · asynchronous</text>
            <text class="dg-s" x="26" y="92">· ~500k videos/day, so only ~6 per second</text>
            <text class="dg-s" x="26" y="110">· each one is hundreds of megabytes</text>
            <text class="dg-s" x="26" y="128">· transcoding is CPU-bound and takes minutes</text>
            <text class="dg-s" x="26" y="146">· nobody is waiting, so it can be queued</text>
            <text class="dg-s" x="26" y="164">· must be resumable — connections drop</text>
            <text class="dg-s" x="26" y="182">· failure is recoverable: retry the job</text>
            <text class="dg-s" x="26" y="208">Optimise for: throughput, cost, durability.</text>
            <text class="dg-s" x="26" y="226">Latency barely matters here.</text>

            <rect class="dg-band b" x="368" y="16" width="340" height="220" rx="11" />
            <text class="dg-h" x="382" y="36">WATCH PATH · READ</text>
            <rect class="dg-box b" x="382" y="46" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="63" text-anchor="middle">constant · huge volume · must feel instant</text>
            <text class="dg-s" x="382" y="92">· ~500M views/day, ~15k/sec at peak</text>
            <text class="dg-s" x="382" y="110">· sustained multi-terabit egress</text>
            <text class="dg-s" x="382" y="128">· almost no computation — just moving bytes</text>
            <text class="dg-s" x="382" y="146">· a user is staring at a spinner</text>
            <text class="dg-s" x="382" y="164">· heavily skewed: a few videos get most views</text>
            <text class="dg-s" x="382" y="182">· failure is immediately visible</text>
            <text class="dg-s" x="382" y="208">Optimise for: latency, bandwidth, cache</text>
            <text class="dg-s" x="382" y="226">hit ratio. Cost follows from those.</text>
            <path class="dg-line violet" d="M356 126 H364" marker-end="url(#ah-yt1)" />
          </svg>
          <figcaption>Figure 1 — Two paths, opposite requirements. Almost every design decision in this chapter follows from keeping them separate.</figcaption>
        </figure>
        <p>Notice the asymmetry in the numbers: roughly 6 uploads per second against 15,000 views per second, a ratio near 1:2500. A system that read-optimises everything and treats writes as background work is not a compromise here — it is the correct shape.</p>

        <h3 class="lesson-subhead" id="yt-blocks">Which building blocks this needs</h3>
        <p>Applying the trigger table from Chapter 6 to what we have just described:</p>
        <table>
          <thead><tr><th>Requirement in this problem</th><th>Building block</th><th>Chapter</th></tr></thead>
          <tbody>
            <tr><td>Store hundreds of petabytes of immutable video</td><td>Blob store</td><td><a href="/learn/modern-system-design/blob-store">20</a></td></tr>
            <tr><td>Serve terabits per second near the user</td><td>CDN</td><td><a href="/learn/modern-system-design/cdn">11</a></td></tr>
            <tr><td>Transcode without making the uploader wait</td><td>Messaging queue + workers</td><td><a href="/learn/modern-system-design/messaging-queue">17</a></td></tr>
            <tr><td>Video, channel and user metadata with queries</td><td>Database (partitioned)</td><td><a href="/learn/modern-system-design/databases">9</a></td></tr>
            <tr><td>Hot video metadata at low latency</td><td>Distributed cache</td><td><a href="/learn/modern-system-design/distributed-cache">16</a></td></tr>
            <tr><td>Find videos by title, description, transcript</td><td>Distributed search</td><td><a href="/learn/modern-system-design/distributed-search">21</a></td></tr>
            <tr><td>View counts at enormous write rates</td><td>Sharded counters</td><td><a href="/learn/modern-system-design/sharded-counters">24</a></td></tr>
            <tr><td>Unique video IDs across many machines</td><td>Sequencer</td><td><a href="/learn/modern-system-design/sequencer">12</a></td></tr>
            <tr><td>Spread traffic, survive instance loss</td><td>Load balancers</td><td><a href="/learn/modern-system-design/load-balancers">8</a></td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>This table is the answer to "how do I even start".</strong> You are not inventing an architecture from nothing. You are reading requirements, matching each to a block you already understand, and then spending your time on the two or three genuinely hard parts — which here are transcoding throughput and delivery economics, not the metadata schema.</div>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of YouTube's Design",
      children: [
        { id: 'yt-func', title: 'Functional requirements' },
        { id: 'yt-nonfunc', title: 'Non-functional requirements, as numbers' },
        { id: 'yt-scope', title: 'What we deliberately exclude' },
        { id: 'yt-estimate', title: 'Estimation: the numbers that decide the design' },
        { id: 'yt-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="yt-func">Functional requirements</h3>
        <p>Stated as capabilities, in rough priority order:</p>
        <ol class="lesson-layers">
          <li><strong>Upload a video</strong> of arbitrary size, resumably, with title, description and thumbnail.</li>
          <li><strong>Watch a video</strong> on any device, at a quality appropriate to the current connection, with playback starting quickly and seeking supported.</li>
          <li><strong>Search</strong> for videos by text.</li>
          <li><strong>View counts</strong> and basic engagement (likes, comments).</li>
          <li><strong>Channels and subscriptions</strong>, so users can follow creators.</li>
          <li><strong>Recommendations</strong> on the home page and beside the player.</li>
        </ol>

        <h3 class="lesson-subhead" id="yt-nonfunc">Non-functional requirements, as numbers</h3>
        <p>Per <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a>, adjectives are useless here. Committing to numbers:</p>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why this number</th></tr></thead>
          <tbody>
            <tr><td>Watch availability</td><td>99.99%</td><td>Playback failure is the product failing; needs automated failover</td></tr>
            <tr><td>Upload availability</td><td>99.9%</td><td>Creators tolerate a retry; uploads can be queued and resumed</td></tr>
            <tr><td>Time to first frame</td><td>p95 &lt; 1 s, p99 &lt; 2 s</td><td>Above this, viewers abandon</td></tr>
            <tr><td>Rebuffer ratio</td><td>&lt; 0.5% of playback time</td><td>The metric viewers actually feel; adaptive bitrate exists for this</td></tr>
            <tr><td>Metadata read latency</td><td>p99 &lt; 100 ms</td><td>The page must render while video buffers</td></tr>
            <tr><td>Upload to watchable</td><td>&lt; 30 min for a 10 min video</td><td>Transcoding is async; creators accept minutes, not hours</td></tr>
            <tr><td>Durability of uploaded video</td><td>≥ 11 nines</td><td>Losing a creator's only copy is unrecoverable reputational damage</td></tr>
            <tr><td>Consistency: video bytes</td><td>Immutable once published</td><td>Immutability removes the entire cache-invalidation problem</td></tr>
            <tr><td>Consistency: view counts</td><td>Eventual, approximate</td><td>Nobody is harmed by a count that lags a minute</td></tr>
            <tr><td>Consistency: subscriptions</td><td>Read-your-writes for the actor</td><td>A user must see their own subscribe take effect</td></tr>
          </tbody>
        </table>
        <p>That last block of three rows is worth pausing on, because it is exactly the per-data-type consistency answer <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> argued for. One system, three different consistency models, each justified.</p>

        <h3 class="lesson-subhead" id="yt-scope">What we deliberately exclude</h3>
        <p>Saying what you are not designing is a strength, not an evasion. Out of scope here: live streaming (a genuinely different system with different latency constraints), monetisation and ad serving, copyright matching, and the machine-learning internals of recommendation ranking. We will design the <em>serving</em> path for recommendations but not the model that produces them.</p>

        <h3 class="lesson-subhead" id="yt-estimate">Estimation: the numbers that decide the design</h3>
        <p>Following the five-step framework from Chapter 5. Round everything to one significant figure and say the assumptions out loud.</p>
        <pre><code>ASSUMPTIONS
  1B total users, 100M daily active
  each DAU watches 5 videos/day
  500,000 videos uploaded/day
  average video: 10 minutes

STEP 1 · TRAFFIC
  views:   100M x 5 = 500M/day
           500M / 10^5 s = 5,000 views/sec average
           peak (x3)     = 15,000 views/sec
  uploads: 500k / 10^5 s = 5/sec average, ~15/sec peak
  view:upload ratio ~ 1000:1  <- read-dominated

STEP 2 · STORAGE
  raw upload: 10 min at ~50 MB/min      = 500 MB
  transcode to 5 renditions (240p-1080p)
    total encoded output ~ 1.5x original = 750 MB
  keep the original master too           = ~1.25 GB/video

  500,000 x 1.25 GB = 625 TB/day
  x 365             = 230 PB/year        <- storage-dominated

  Metadata for comparison:
  500k videos x ~2 KB = 1 GB/day = 365 GB/year
  -> 6 orders of magnitude smaller. Different system entirely.

STEP 3 · BANDWIDTH  <- the number that dictates the architecture
  Assume 1M concurrent viewers at peak, average 3 Mbps
  1M x 3 Mbps = 3,000,000 Mbps = 3 Tbps sustained egress

  Inbound (uploads): 15/sec x 500 MB = 7.5 GB/sec = 60 Gbps
  -> egress is ~50x ingress

  A single datacentre cannot serve 3 Tbps to the public internet.
  CONCLUSION: this is a content distribution problem. The CDN is
  not an optimisation, it is the primary architecture.

STEP 4 · TRANSCODING COMPUTE
  Roughly 1-2x real time per rendition per core
  500,000 videos x 10 min x 5 renditions = 25M video-minutes/day
  25M / 1,440 min per day = ~17,000 minutes of work per minute
  -> ~17,000 cores busy continuously, so a large async fleet
     with a queue in front. Confirms transcoding must never be
     on the request path.

STEP 5 · CACHE AND SERVERS
  Access is heavily skewed: assume the top 5% of videos drive
  ~80-90% of views (Chapter 5's 80/20 rule, more extreme here)
  Cache the hot 5% of one year's content at the edges
  Metadata QPS 15,000 -> ~20-30 app servers with caching,
  which is small. The fleet cost is in transcoding and egress.</code></pre>
        <p>Five multiplications, and the architecture has largely announced itself: an object store for enormous immutable files, a CDN doing the actual serving, an asynchronous transcoding fleet fed by a queue, and a comparatively tiny metadata tier.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="How each estimate maps to a specific architectural decision">
            <defs>
              <marker id="ah-yt2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE NUMBER → THE DECISION IT FORCES</text>
            <rect class="dg-box b" x="16" y="32" width="212" height="30" rx="6" />
            <text class="dg-s" x="30" y="52">3 Tbps peak egress</text>
            <rect class="dg-box g" x="272" y="32" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="52">CDN is the primary serving tier; origin only fills cache misses</text>
            <rect class="dg-box b" x="16" y="68" width="212" height="30" rx="6" />
            <text class="dg-s" x="30" y="88">230 PB/year, immutable</text>
            <rect class="dg-box g" x="272" y="68" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="88">blob store with erasure coding and storage tiers, not a database</text>
            <rect class="dg-box b" x="16" y="104" width="212" height="30" rx="6" />
            <text class="dg-s" x="30" y="124">17,000 cores of transcode</text>
            <rect class="dg-box g" x="272" y="104" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="124">queue + worker fleet, chunk-parallel, never on the request path</text>
            <rect class="dg-box b" x="16" y="140" width="212" height="30" rx="6" />
            <text class="dg-s" x="30" y="160">1000:1 read:write</text>
            <rect class="dg-box g" x="272" y="140" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="160">cache aggressively; replicas for reads; writes need no sharding yet</text>
            <rect class="dg-box b" x="16" y="176" width="212" height="30" rx="6" />
            <text class="dg-s" x="30" y="196">metadata only 365 GB/year</text>
            <rect class="dg-box g" x="272" y="176" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="196">a boring replicated database is genuinely fine — do not over-engineer</text>
            <path class="dg-line green" d="M228 47 H268" marker-end="url(#ah-yt2)" />
            <path class="dg-line green" d="M228 83 H268" marker-end="url(#ah-yt2)" />
            <path class="dg-line green" d="M228 119 H268" marker-end="url(#ah-yt2)" />
            <path class="dg-line green" d="M228 155 H268" marker-end="url(#ah-yt2)" />
            <path class="dg-line green" d="M228 191 H268" marker-end="url(#ah-yt2)" />
          </svg>
          <figcaption>Figure 2 — Estimates to decisions. The last row matters as much as the first: knowing what <em>not</em> to scale is part of the skill.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="yt-api">API sketch</h3>
        <pre><code>UPLOAD (three steps, because the file is large)
  POST /videos
    body: { title, description, visibility, sizeBytes, mimeType }
    -> { videoId, uploadUrl, uploadId }     # pre-signed, direct to blob store
  PUT  {uploadUrl}?partNumber=N&uploadId=...
    body: raw bytes of part N              # resumable, parallel, retryable
    -> { etag }
  POST /videos/{videoId}/complete
    body: { uploadId, parts: [{ partNumber, etag }] }
    -> { videoId, status: "processing" }

WATCH
  GET /videos/{videoId}
    -> { title, description, channel, manifestUrl, thumbnails, stats }
  GET {manifestUrl}                        # served by CDN, not by us
    -> adaptive streaming manifest listing renditions and segments
  GET {segmentUrl}                         # served by CDN
    -> a few seconds of video

ENGAGEMENT
  POST /videos/{videoId}/view              # fire-and-forget, sampled
  POST /videos/{videoId}/like
  GET  /search?q=...&pageToken=...
  GET  /feed?pageToken=...</code></pre>
        <div class="lesson-callout"><strong>The most important line in that sketch is <code>uploadUrl</code>.</strong> The client uploads bytes <em>directly to the blob store</em> using a pre-signed URL, never through our application servers. Routing 7.5 GB/sec of uploads through your own fleet means paying for servers whose only job is copying bytes, and it makes resumable upload your problem instead of the storage layer's. Interviewers notice when a candidate spots this.</div>
      `,
    },
    {
      id: 'design',
      title: 'Design of YouTube',
      children: [
        { id: 'yt-high', title: 'High-level architecture' },
        { id: 'yt-upload-detail', title: 'The upload and transcoding pipeline' },
        { id: 'yt-watch-detail', title: 'The watch path and adaptive streaming' },
        { id: 'yt-metadata', title: 'Metadata, sharding and caching' },
        { id: 'yt-counts', title: 'View counts and engagement' },
        { id: 'yt-recommend', title: 'Search, feed and recommendation serving' },
        { id: 'yt-eval', title: 'Evaluation: where this design falls short' },
      ],
      html: `
        <h3 class="lesson-subhead" id="yt-high">High-level architecture</h3>
        <p>Putting the blocks together, with the two paths kept visibly separate.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 336" role="img" aria-label="High level YouTube architecture showing the upload pipeline, the metadata tier and the watch path through a CDN">
            <defs>
              <marker id="ah-yt3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-yt4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-yt5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="20">UPLOAD PATH · ASYNCHRONOUS</text>
            <rect class="dg-box o" x="16" y="30" width="96" height="32" rx="6" />
            <text class="dg-s" x="64" y="50" text-anchor="middle">creator</text>
            <rect class="dg-box o" x="132" y="30" width="104" height="32" rx="6" />
            <text class="dg-s" x="184" y="50" text-anchor="middle">upload service</text>
            <rect class="dg-box y" x="256" y="30" width="112" height="32" rx="6" />
            <text class="dg-s" x="312" y="50" text-anchor="middle">raw blob store</text>
            <rect class="dg-box r" x="388" y="30" width="104" height="32" rx="6" />
            <text class="dg-s" x="440" y="50" text-anchor="middle">transcode queue</text>
            <rect class="dg-box p" x="512" y="30" width="112" height="32" rx="6" />
            <text class="dg-s" x="568" y="50" text-anchor="middle">worker fleet</text>
            <path class="dg-line hot" d="M112 46 H128" marker-end="url(#ah-yt3)" />
            <path class="dg-line hot dash" d="M64 62 V78 H312 V66" marker-end="url(#ah-yt3)" />
            <text class="dg-s" x="120" y="76">bytes go direct via pre-signed URL</text>
            <path class="dg-line hot" d="M368 46 H384" marker-end="url(#ah-yt3)" />
            <path class="dg-line hot" d="M492 46 H508" marker-end="url(#ah-yt3)" />

            <rect class="dg-box p" x="512" y="96" width="112" height="32" rx="6" />
            <text class="dg-s" x="568" y="116" text-anchor="middle">encoded blob store</text>
            <path class="dg-line hot" d="M568 62 V92" marker-end="url(#ah-yt3)" />
            <text class="dg-s" x="636" y="106">renditions</text>
            <text class="dg-s" x="636" y="120">+ manifest</text>

            <text class="dg-h" x="16" y="160">METADATA AND CONTROL PLANE</text>
            <rect class="dg-box b" x="16" y="170" width="112" height="34" rx="6" />
            <text class="dg-s" x="72" y="191" text-anchor="middle">metadata DB</text>
            <rect class="dg-box g" x="148" y="170" width="112" height="34" rx="6" />
            <text class="dg-s" x="204" y="191" text-anchor="middle">cache</text>
            <rect class="dg-box c" x="280" y="170" width="112" height="34" rx="6" />
            <text class="dg-s" x="336" y="191" text-anchor="middle">search index</text>
            <rect class="dg-box y" x="412" y="170" width="112" height="34" rx="6" />
            <text class="dg-s" x="468" y="191" text-anchor="middle">counters</text>
            <rect class="dg-box l" x="544" y="170" width="112" height="34" rx="6" />
            <text class="dg-s" x="600" y="191" text-anchor="middle">feed / recs</text>
            <path class="dg-line hot dash" d="M568 128 V150 H72 V166" marker-end="url(#ah-yt3)" />
            <text class="dg-s" x="150" y="146">on completion, mark video ready and index it</text>

            <text class="dg-h" x="16" y="238">WATCH PATH · SYNCHRONOUS, HIGH VOLUME</text>
            <rect class="dg-box b" x="16" y="248" width="96" height="34" rx="6" />
            <text class="dg-s" x="64" y="269" text-anchor="middle">viewer</text>
            <rect class="dg-box b" x="132" y="248" width="104" height="34" rx="6" />
            <text class="dg-s" x="184" y="269" text-anchor="middle">load balancer</text>
            <rect class="dg-box b" x="256" y="248" width="112" height="34" rx="6" />
            <text class="dg-s" x="312" y="269" text-anchor="middle">API servers</text>
            <rect class="dg-box g" x="388" y="248" width="136" height="34" rx="6" />
            <text class="dg-s" x="456" y="269" text-anchor="middle">CDN edge</text>
            <rect class="dg-box p" x="544" y="248" width="160" height="34" rx="6" />
            <text class="dg-s" x="624" y="269" text-anchor="middle">origin (encoded blobs)</text>
            <path class="dg-line blue" d="M112 264 H128" marker-end="url(#ah-yt4)" />
            <path class="dg-line blue" d="M236 264 H252" marker-end="url(#ah-yt4)" />
            <path class="dg-line blue" d="M312 248 V216 H204 V208" marker-end="url(#ah-yt4)" />
            <text class="dg-s" x="330" y="228">page metadata from cache</text>
            <path class="dg-line green thick" d="M64 282 V302 H456 V286" marker-end="url(#ah-yt5)" />
            <text class="dg-s" x="150" y="316">video segments go viewer ↔ CDN directly — this is the 3 Tbps, and it never touches our servers</text>
            <path class="dg-line green dash" d="M524 264 H540" marker-end="url(#ah-yt5)" />
            <text class="dg-s" x="560" y="300">cache miss only</text>
          </svg>
          <figcaption>Figure 3 — The full architecture. The thick green line carries essentially all the bytes in the system and bypasses our application tier entirely; that is the single most important property of this design.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="yt-upload-detail">The upload and transcoding pipeline</h3>
        <p>The uploader's request finishes as soon as the bytes are durably in the raw blob store. Everything after that is background work, tracked by a status field the client can poll.</p>
        <p><strong>Why transcode at all?</strong> Because you cannot ship one file to everyone. A viewer on a phone over a weak mobile connection and a viewer on a television over fibre need different bitrates and resolutions, and neither wants the creator's 4K master. Transcoding converts one unpredictable input into a known ladder of outputs.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="The transcoding pipeline splitting a video into chunks, encoding them in parallel, and reassembling into a rendition ladder">
            <defs>
              <marker id="ah-yt6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHY CHUNKING IS THE WHOLE TRICK</text>
            <rect class="dg-box y" x="16" y="32" width="120" height="40" rx="7" />
            <text class="dg-s" x="76" y="50" text-anchor="middle">raw master</text>
            <text class="dg-s" x="76" y="64" text-anchor="middle">10 min, 500 MB</text>
            <rect class="dg-box b" x="176" y="32" width="120" height="40" rx="7" />
            <text class="dg-s" x="236" y="50" text-anchor="middle">split into chunks</text>
            <text class="dg-s" x="236" y="64" text-anchor="middle">~10 s each, 60 chunks</text>
            <rect class="dg-box p" x="336" y="26" width="112" height="24" rx="5" />
            <text class="dg-s" x="392" y="42" text-anchor="middle">worker A → 240p</text>
            <rect class="dg-box p" x="336" y="54" width="112" height="24" rx="5" />
            <text class="dg-s" x="392" y="70" text-anchor="middle">worker B → 480p</text>
            <rect class="dg-box p" x="336" y="82" width="112" height="24" rx="5" />
            <text class="dg-s" x="392" y="98" text-anchor="middle">worker C → 720p</text>
            <rect class="dg-box p" x="336" y="110" width="112" height="24" rx="5" />
            <text class="dg-s" x="392" y="126" text-anchor="middle">worker D → 1080p</text>
            <rect class="dg-box g" x="488" y="54" width="120" height="52" rx="7" />
            <text class="dg-s" x="548" y="74" text-anchor="middle">reassemble +</text>
            <text class="dg-s" x="548" y="90" text-anchor="middle">write manifest</text>
            <rect class="dg-box c" x="632" y="54" width="72" height="52" rx="7" />
            <text class="dg-s" x="668" y="74" text-anchor="middle">CDN</text>
            <text class="dg-s" x="668" y="90" text-anchor="middle">ready</text>
            <path class="dg-line violet" d="M136 52 H172" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M296 46 H332" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M296 56 H320 V66 H332" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M296 62 H312 V94 H332" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M296 68 H304 V122 H332" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M448 80 H484" marker-end="url(#ah-yt6)" />
            <path class="dg-line violet" d="M608 80 H628" marker-end="url(#ah-yt6)" />
            <rect class="dg-band g" x="12" y="150" width="696" height="104" rx="10" />
            <text class="dg-h" x="26" y="170">WHAT CHUNKING BUYS</text>
            <text class="dg-s" x="26" y="190">· parallelism · 60 chunks x 5 renditions = 300 independent jobs, so a 10-minute video finishes in minutes not hours</text>
            <text class="dg-s" x="26" y="208">· fault isolation · one chunk failing costs one retry of 10 seconds of video, not the whole file (Chapter 4's blast radius)</text>
            <text class="dg-s" x="26" y="226">· progress · you can report percentage complete honestly, and publish lower renditions before higher ones finish</text>
            <text class="dg-s" x="26" y="244">· it is also exactly what adaptive streaming needs at playback time, so the chunks are the delivery unit too</text>
          </svg>
          <figcaption>Figure 4 — Chunk-parallel transcoding. The same chunk boundaries serve two purposes: parallel encoding on the way in and adaptive bitrate switching on the way out.</figcaption>
        </figure>
        <p>The pipeline stages beyond encoding are worth naming, because interviewers ask what else happens: validation and virus scanning, metadata extraction (duration, codec, resolution), thumbnail generation at several timestamps, audio track extraction, optional speech-to-text for captions and search, content fingerprinting for copyright matching, and finally publication — flipping the video's status to ready and pushing it into the search index.</p>
        <p>Every one of these is a queue-and-worker stage, which means each can be scaled, retried and monitored independently. Per <a href="/learn/modern-system-design/messaging-queue">Chapter 17</a>, workers must be idempotent: a transcode job that runs twice must produce the same output rather than duplicating it, because at-least-once delivery guarantees it will occasionally run twice.</p>

        <h3 class="lesson-subhead" id="yt-watch-detail">The watch path and adaptive streaming</h3>
        <p>Playback is a two-request pattern. First the player fetches a small manifest describing what renditions and segments exist. Then it fetches segments, choosing a rendition per segment based on measured throughput and buffer health. This is what "adaptive bitrate" means, and it is why video degrades to blurry rather than stopping when a connection weakens.</p>
        <pre><code>MANIFEST (conceptually)
  video 8f3a2b, duration 600s, segment length 10s
    240p   ->  400 kbps  ->  seg_240_0001.ts ... seg_240_0060.ts
    480p   -> 1000 kbps  ->  seg_480_0001.ts ...
    720p   -> 2500 kbps  ->  seg_720_0001.ts ...
   1080p   -> 5000 kbps  ->  seg1080_0001.ts ...

PLAYER LOGIC (simplified)
  start at a conservative rendition so playback begins fast
  after each segment:
    measured_bandwidth = bytes / seconds
    if measured > 1.5x current bitrate and buffer healthy: step up
    if measured < current bitrate or buffer draining:      step down
  seeking = jump to the segment index covering that timestamp</code></pre>
        <p>Three consequences of this design are worth stating explicitly. Segments are small, immutable, independently cacheable files, which is precisely what a CDN is best at. Seeking needs no server-side work — it is just requesting a different segment. And time-to-first-frame is governed by the first segment's size, which is why players start low and step up rather than gambling on 1080p.</p>
        <div class="lesson-callout"><strong>The immutability dividend.</strong> Because published segments never change, cache invalidation — the hardest problem in <a href="/learn/modern-system-design/distributed-cache">Chapter 16</a> — simply does not arise on the byte path. Segment URLs can be cached for a year. If a creator replaces a video, it gets new segment URLs. Designing for immutability rather than fighting for consistency is one of the most transferable lessons in this chapter.</div>

        <h3 class="lesson-subhead" id="yt-metadata">Metadata, sharding and caching</h3>
        <p>The estimation said metadata is roughly 365 GB/year — small. So the honest answer is that a replicated relational database with read replicas and a cache in front handles this comfortably, and inventing a sharding scheme up front would be over-engineering.</p>
        <p>That said, an interviewer will ask how it scales, so know the answer: <strong>shard by video ID</strong>, since almost every access is by video ID and that gives an even distribution with no cross-shard queries for the common path. Shard the channel and subscription data by channel ID and user ID respectively. The awkward query is "all videos in this channel, newest first", which under video-ID sharding must fan out — so denormalise it into a per-channel list maintained on publish, which is a cheap write given only 6 uploads per second.</p>
        <p>Caching follows Chapter 16's cache-aside pattern on video metadata keyed by video ID, with a long TTL because the data is nearly static. Given the extreme access skew, a small cache captures most reads: caching the hot 5% of videos should yield a hit ratio well above 90%.</p>

        <h3 class="lesson-subhead" id="yt-counts">View counts and engagement</h3>
        <p>At 15,000 views per second, incrementing a row per video is the exact anti-pattern <a href="/learn/modern-system-design/sharded-counters">Chapter 24</a> exists to fix — and a viral video concentrates those writes onto one row.</p>
        <p>The design: clients fire a view event asynchronously; events land in a queue; workers aggregate in memory and flush periodically to sharded counters; a background job rolls shards up into a materialised total that reads consume. The count is approximate and lags by seconds to a minute, which the requirements table already declared acceptable. Views also need abuse handling — deduplication per user per video within a window, and bot filtering — which is another reason to process them asynchronously rather than incrementing on the request path.</p>
        <p>Comments and likes are ordinary writes at much lower volume; likes use the same sharded-counter treatment, comments are a straightforward partitioned table with pagination.</p>

        <h3 class="lesson-subhead" id="yt-recommend">Search, feed and recommendation serving</h3>
        <p>Search is <a href="/learn/modern-system-design/distributed-search">Chapter 21</a> applied to titles, descriptions, tags, channel names and — valuably — auto-generated transcripts, which make the spoken content searchable. Indexing happens at publish time, so index lag is measured in seconds and nobody notices.</p>
        <p>For recommendations, the serving pattern matters more than the model. Ranking millions of candidate videos per request is impossible within a latency budget, so the standard shape is a funnel: <strong>candidate generation</strong> narrows millions to hundreds using cheap precomputed signals, then <strong>ranking</strong> scores those hundreds with an expensive model, then <strong>filtering</strong> removes already-watched and ineligible items. Precompute per-user candidate sets offline and cache them, so the request path does ranking only. This is the same precompute-and-cache pattern the feed problems in later chapters use.</p>

        <h3 class="lesson-subhead" id="yt-eval">Evaluation: where this design falls short</h3>
        <p>Per the course convention, criticise it before someone else does.</p>
        <table>
          <thead><tr><th>Weakness</th><th>Why it matters</th><th>What you would do about it</th></tr></thead>
          <tbody>
            <tr><td>Cost is dominated by egress and storage</td><td>230 PB/year accumulating forever is unsustainable</td><td>Tier cold videos to cheaper storage, drop unwatched high renditions, re-encode with better codecs, negotiate peering</td></tr>
            <tr><td>The long tail caches badly</td><td>Most videos are watched rarely, so they always miss the edge cache and hit origin</td><td>Accept lower hit ratio for the tail; use regional mid-tier caches; serve tail from fewer, cheaper locations</td></tr>
            <tr><td>A newly viral video is a stampede</td><td>Thousands of edges miss simultaneously and hammer origin</td><td>Request coalescing at the edge, origin shield tier, proactive push for predicted-popular content</td></tr>
            <tr><td>Transcoding cost scales with uploads, not views</td><td>You pay to encode 1080p for videos nobody watches</td><td>Encode a cheap baseline immediately, generate higher renditions lazily on first demand</td></tr>
            <tr><td>Upload-to-watchable latency for long videos</td><td>A three-hour upload takes a long time even chunked</td><td>Publish low renditions first and upgrade progressively; show the creator honest progress</td></tr>
            <tr><td>Single-region metadata tier</td><td>Global viewers pay a cross-continent round trip for page data</td><td>Regional read replicas with eventual consistency; keep writes in one region</td></tr>
            <tr><td>We hand-waved recommendation quality</td><td>It is the main driver of engagement in the real product</td><td>Out of scope by declaration, but say so rather than pretending it is easy</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Four questions. Why does the client upload directly to the blob store instead of through your API servers? Why does chunking a video help both transcoding and playback? Why is cache invalidation a non-problem on the byte path here, and what design choice earned that? And why is the metadata tier the part of this system you should refuse to over-engineer? If those are solid, the design problems ahead will feel like variations rather than new puzzles.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. This is an original design exercise on a well-known public problem; the numbers are illustrative estimates for teaching, not figures from any company. All explanations, diagrams, tables, API sketches and exercises are our own.',
};
