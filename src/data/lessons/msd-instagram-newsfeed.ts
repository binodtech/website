/** Modern System Design — Chapter 31: Design a Newsfeed & Instagram.
 *  Hybrid fan-out, media transcode, retrieve-then-rank, stories TTL, celebrities and counters.
 */

export const msdInstagramNewsfeed = {
  slug: 'instagram-newsfeed',
  title: 'Design a Newsfeed & Instagram',
  subtitle:
    'A newsfeed is a social graph plus a media pipeline plus a ranker. Hybrid fan-out of post ids, transcode before anyone fans out bytes, retrieve-then-rank on read, stories as TTL lists, and sharded counters for likes. The celebrity problem does not vanish because the payload got prettier.',
  byline: 'Modern System Design · Chapter 31 · ~2h 10m read · Advanced',
  interviewTip:
    'Reuse hybrid fan-out from Twitter, then spend original minutes on media: pre-signed upload, async transcode, feed stores ids and a CDN URL, never the bytes. Ranking is retrieve-then-rank, not a JOIN. Stories are the same graph with a 24-hour TTL and a ring UI. Celebrities still pull at read time. Likes are sharded counters. Infinite scroll is cursor pagination on a precomputed id list.',
  sections: [
    {
      id: 'nf-problem',
      title: 'System Design: Newsfeed and Instagram',
      children: [
        { id: 'nf-what', title: 'Feed, stories, and the media path' },
        { id: 'nf-vs-tw', title: 'What Twitter already solved' },
        { id: 'nf-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>Instagram is a social graph, a media CDN, and a ranked home feed. The graph and the fan-out argument are <a href="/learn/modern-system-design/twitter">Chapter 30</a>. The new work is large immutable objects, transcoding that must finish before you promise a playable URL, and a ranker that is allowed to be wrong in interesting ways (engagement) rather than strictly chronological.</p>

        <h3 class="lesson-subhead" id="nf-what">Feed, stories, and the media path</h3>
        <p>A user posts a photo or short video. Followers see it in a home feed, possibly ranked, possibly with ads injected. Stories vanish after 24 hours and are viewed in a ring per followee. Explore and search are a different retrieval system. Direct messages are chat (Chapter 34) and out of scope. Live video is closer to <a href="/learn/modern-system-design/youtube">YouTube</a>.</p>
        <p>The upload must succeed on a flaky mobile radio. The feed must paint in a few hundred milliseconds of ids plus cached cards, with images streaming from the edge. If the home request waits on a transcode or a blob GET inside the datacentre, you have coupled the wrong planes.</p>
        <p>A post is metadata: author, caption, media ids, variants (width, codec, bitrate), created_at, visibility. Bytes live in the <a href="/learn/modern-system-design/blob-store">blob store</a> behind a <a href="/learn/modern-system-design/cdn">CDN</a>. Fan-out copies ids, not JPEGs.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Upload path to blob and async transcode versus feed path of ids and CDN">
            <defs>
              <marker id="ah-nf1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">WRITE  ·  MEDIA</text>
            <text class="dg-s" x="26" y="58">pre-signed PUT to blob</text>
            <text class="dg-s" x="26" y="76">queue transcode variants</text>
            <text class="dg-s" x="26" y="94">commit post metadata</text>
            <text class="dg-s" x="26" y="112">fan-out ids, not bytes</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">READ  ·  FEED</text>
            <text class="dg-s" x="382" y="58">timeline list of post ids</text>
            <text class="dg-s" x="382" y="76">hydrate cards from cache</text>
            <text class="dg-s" x="382" y="94">images from CDN</text>
            <text class="dg-s" x="382" y="112">ranker reorders the page</text>
          </svg>
          <figcaption>Figure 1 — Ids in the feed, bytes at the edge, transcode on a queue. Opposite of a JOIN of follows and photos.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-vs-tw">What Twitter already solved</h3>
        <p>Hybrid fan-out: write into the timeline cache of ordinary followers; celebrities are pulled at read time. Timeline is a Redis list or KV of post ids, not HTML. Hydration from a post store. The celebrity threshold still exists — a million followers cannot be a million writes on the publish path. Reuse that argument; do not re-derive it for twenty minutes.</p>
        <p>What changes is payload and ranking. A tweet is a few hundred bytes and often chronological. A photo post is useless until variants exist, and the home surface is ranked. That pushes transcode before fan-out (or fan-out of a “processing” placeholder that you would rather not ship in an interview unless asked).</p>

        <h3 class="lesson-subhead" id="nf-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Photo/video bytes</td><td><a href="/learn/modern-system-design/blob-store">Blob store</a> + <a href="/learn/modern-system-design/cdn">CDN</a></td></tr>
            <tr><td>Transcode</td><td><a href="/learn/modern-system-design/messaging-queue">Queue</a> + workers</td></tr>
            <tr><td>Fan-out</td><td>Same as Twitter, plus a <a href="/learn/modern-system-design/task-scheduler">scheduler</a> for story expiry</td></tr>
            <tr><td>Likes</td><td><a href="/learn/modern-system-design/sharded-counters">Sharded counters</a></td></tr>
            <tr><td>Search / explore</td><td><a href="/learn/modern-system-design/distributed-search">Search</a> + candidate generator</td></tr>
          </tbody>
        </table>
        <p>Follow graph is the same directed graph as Twitter. Privacy (private accounts, close-friends stories) is a filter on fan-out and on pull, not a hope that the CDN URL stays secret — URLs leak; signed cookies or short-lived tokens belong in the media path.</p>
        <p>Comments and likes are social objects that must not sit on the home-request JOIN. Prefetch counts into the card cache; fetch the likesheet only when the user opens it. That split is how the home p99 stays about ids and a handful of JSON blobs.</p>
      `,
    },
    {
      id: 'nf-req',
      title: 'Requirements and estimation',
      children: [
        { id: 'nf-fn', title: 'Functional and non-functional' },
        { id: 'nf-est', title: 'The numbers that force the architecture' },
        { id: 'nf-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="nf-fn">Functional and non-functional</h3>
        <p>Post photo or video, follow, home feed, like and comment, stories with 24-hour TTL, cursor pagination. NFR: feed p99 under 200 ms for the id list, images from the edge, resumable upload, post durability like a KV/SQL store, stories gone after TTL without a leftover CDN bill (lifecycle on the blob).</p>
        <p>Out of scope: ads auction internals, full explore ML, DMs, live. Mention them so the interviewer knows you can stop.</p>
        <table>
          <thead><tr><th>NFR</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Home id list</td><td>p99 &lt; 200 ms, cache hit on timeline</td></tr>
            <tr><td>First image</td><td>from CDN POP, not origin on the hot path</td></tr>
            <tr><td>Publish ack</td><td>metadata durable; transcode async; optional “processing”</td></tr>
            <tr><td>Story expiry</td><td>not visible after 24h; blob lifecycle within hours after</td></tr>
            <tr><td>Like increment</td><td>approximate is allowed; never block the feed on a count</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="nf-est">The numbers that force the architecture</h3>
        <pre><code>500M DAU, avg 30 min session, 2 feed opens, 20 posts seen per open
  feed reads: 500M x 2 = 1B/day  -&gt; ~12k/s avg, ~60-80k/s peak
  posts: 0.1 post/user/day = 50M/day -&gt; ~600/s average writes
  stories: similar order, vanish in 24h so storage is a ring, not a warehouse

FAN-OUT
  median followers ~150, celebrity tail to 1e7
  naive write fan-out 600/s x 150 = 90k timeline writes/s — fine
  one celebrity 1e7 followers x 1 post = 1e7 writes — not on the request path

MEDIA
  50M posts/day x 2 MB original ≈ 100 TB/day ingest
  variants (feed, story, profile) x3-8 — transcode cluster is a factory
  feed must not wait on that factory

LIKES
  20 posts seen x 0.05 like = 1 like/open, 1B opens -&gt; 1B likes/day ≈ 12k/s
  hot posts skew: sharded counters, not a single row</code></pre>
        <p>Writes of posts are easy. Reads of feeds are the product. Fan-out cost is in the tail of the follower distribution, unchanged from Twitter. Storage cost is media. CPU cost is transcode. Ranking cost is a two-stage model on a few hundred candidates, not on the entire follow graph at request time.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Post rate versus feed read rate versus media ingest">
            <defs>
              <marker id="ah-nf2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="126" y="58" text-anchor="middle">POSTS</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">~600/s average</text>
            <text class="dg-s" x="126" y="98" text-anchor="middle">easy if ids only</text>
            <rect class="dg-box b" x="250" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="360" y="58" text-anchor="middle">FEED READS</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">tens of k/s peak</text>
            <text class="dg-s" x="360" y="98" text-anchor="middle">precomputed lists</text>
            <rect class="dg-box o" x="484" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="594" y="58" text-anchor="middle">MEDIA</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">100 TB/day</text>
            <text class="dg-s" x="594" y="98" text-anchor="middle">blob + transcode</text>
          </svg>
          <figcaption>Figure 2 — Three different bottlenecks. One box labelled “feed service” cannot own all three.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-api">API sketch</h3>
        <pre><code>POST /media/uploads
  -&gt; { uploadUrl, mediaId }          # pre-signed PUT

POST /posts
  { mediaId, caption, location? }
  -&gt; 202 { postId, state: processing|ready }

GET  /feed?cursor=&amp;limit=20
  -&gt; { items: [{ postId, author, media, likeCount, ... }], nextCursor }

POST /posts/{id}/likes
GET  /stories/ring
GET  /stories/{userId}

# internal
transcode queue: mediaId -&gt; variants[]
fan-out: postId -&gt; follower timeline lists (non-celebrity)
celebrity posts attached at read</code></pre>
        <p>Cursors are opaque (timestamp + id), not OFFSET. Clients must tolerate a post disappearing between pages (delete, privacy change, story expiry).</p>
        <p>Resumable upload ( tus or chunked PUT ) matters more than the JSON API. A 20 MB video on a train is the real write path. The post commit is a small transaction after the object exists, with a checksum the transcode worker verifies before it spends CPU.</p>
      `,
    },
    {
      id: 'nf-design',
      title: 'Fan-out, ranking, stories and counters',
      children: [
        { id: 'nf-fan', title: 'Hybrid fan-out after transcode' },
        { id: 'nf-rank', title: 'Retrieve then rank' },
        { id: 'nf-stories', title: 'Stories as TTL' },
        { id: 'nf-celeb', title: 'Celebrities and the CDN' },
        { id: 'nf-likes', title: 'Likes as sharded counters' },
        { id: 'nf-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="nf-fan">Hybrid fan-out after transcode</h3>
        <p>Upload lands in blob. A worker produces feed-sized JPEGs, story crops, and video ladders. Only when a default variant is ready do we commit the post as readable and enqueue fan-out. Fan-out-on-write walks non-celebrity followers and LPUSHes the post id onto each timeline list (capped, e.g. a few thousand ids). Celebrity authors skip that walk; their posts live in an author outbox that readers merge.</p>
        <p>Why after transcode: fanning out an id whose CDN URL 404s is a feed full of grey boxes. A short “processing” state on the author’s own profile is acceptable; polluting millions of timelines with a broken card is not.</p>
        <p>Fan-out is a <a href="/learn/modern-system-design/task-scheduler">queued job</a>, chunked by follower id ranges, so a 50k-follower account does not hold a lock. Idempotent inserts (post id already in list) make retries safe.</p>
        <p>Deletes and archive: tombstone the id in timelines or ACL-check at hydrate. Tombstones bloat lists; ACL-check adds a lookup. Celebrities already pull, so a privacy flip is “stop merging the outbox” plus invalidate cached cards. Ordinary fan-out needs both a stop-the-job and a retract for ids already pushed.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Transcode then hybrid fan-out to ordinary timelines and celebrity outbox">
            <defs>
              <marker id="ah-nf3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="88" text-anchor="middle">upload</text>
            <rect class="dg-box o" x="148" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="208" y="88" text-anchor="middle">transcode</text>
            <rect class="dg-box b" x="300" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="360" y="88" text-anchor="middle">post meta</text>
            <rect class="dg-box g" x="452" y="24" width="248" height="40" rx="7" />
            <text class="dg-s" x="576" y="48" text-anchor="middle">ordinary timelines</text>
            <rect class="dg-box p" x="452" y="104" width="248" height="40" rx="7" />
            <text class="dg-s" x="576" y="128" text-anchor="middle">celeb outbox pull</text>
            <path class="dg-line blue" d="M116 84 H144" marker-end="url(#ah-nf3)" />
            <path class="dg-line blue" d="M268 84 H296" marker-end="url(#ah-nf3)" />
            <path class="dg-line blue" d="M420 84 H448" marker-end="url(#ah-nf3)" />
          </svg>
          <figcaption>Figure 3 — Transcode gates publish. Ordinary followers get write fan-out; celebrities stay on the read merge.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-rank">Retrieve then rank</h3>
        <p>Do not score the entire follow graph on a feed open. Retrieve a candidate set: head of the precomputed timeline (hundreds of ids) plus recent celebrity outboxes plus maybe a few ads slots. Hydrate cards from a post cache. A ranker (light GBDT or a tiny neural net) reorders that page using viewer features, post features, and predicted watch time. Then return 10–20 items.</p>
        <p>The retrieve stage must be fast and slightly stale; the ranker can be a few milliseconds. If the model dies, fall back to chronological ids — a ranked feed that becomes empty is worse than an old-fashioned list. Feature stores belong off the request path; join them in batch to the candidate objects.</p>
        <p>Pagination: the cursor is into the retrieved list, not a replay of the model with a different random seed. Users notice reshuffle-on-scroll and hate it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Retrieve candidates then rank a small page">
            <defs>
              <marker id="ah-nf4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="52" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="80" text-anchor="middle">timeline ids</text>
            <rect class="dg-box p" x="212" y="52" width="160" height="48" rx="7" />
            <text class="dg-s" x="292" y="80" text-anchor="middle">celeb merge</text>
            <rect class="dg-box y" x="408" y="52" width="140" height="48" rx="7" />
            <text class="dg-s" x="478" y="80" text-anchor="middle">ranker</text>
            <rect class="dg-box g" x="584" y="52" width="120" height="48" rx="7" />
            <text class="dg-s" x="644" y="80" text-anchor="middle">page of 20</text>
            <path class="dg-line green" d="M176 76 H208" marker-end="url(#ah-nf4)" />
            <path class="dg-line green" d="M372 76 H404" marker-end="url(#ah-nf4)" />
            <path class="dg-line green" d="M548 76 H580" marker-end="url(#ah-nf4)" />
          </svg>
          <figcaption>Figure 4 — Retrieve a few hundred, rank a page. Never rank millions of follows online.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-stories">Stories as TTL</h3>
        <p>Stories are posts with a 24-hour lifetime and a different UI (rings, sequential clips). Fan-out can be the same hybrid, but the list is a time-bounded structure: Redis sorted set by expiry, or a list you trim with a <a href="/learn/modern-system-design/task-scheduler">scheduler</a>. After expiry, the id must not appear in the ring, and the blob should lifecycle-delete so you do not pay for yesterday’s 4K video forever.</p>
        <p>Close-friends lists are a second fan-out set, not a flag on a public CDN object. Seen-state is per viewer (a small bitmap or KV), not a global counter of “views” as source of truth for privacy.</p>
        <p>The ring API should return who has an unexpired story, not the bytes. Playback then fetches the playlist of clip ids. That keeps the first paint small when you follow hundreds of people who all posted a sunset.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Story ring list then clip playlist then CDN bytes">
            <defs>
              <marker id="ah-nf7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="52" width="160" height="44" rx="7" />
            <text class="dg-s" x="96" y="78" text-anchor="middle">ring of users</text>
            <rect class="dg-box p" x="212" y="52" width="160" height="44" rx="7" />
            <text class="dg-s" x="292" y="78" text-anchor="middle">clip ids TTL</text>
            <rect class="dg-box o" x="408" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="478" y="78" text-anchor="middle">CDN</text>
            <rect class="dg-box g" x="584" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="644" y="78" text-anchor="middle">expire</text>
            <path class="dg-line violet" d="M176 74 H208" marker-end="url(#ah-nf7)" />
            <path class="dg-line violet" d="M372 74 H404" marker-end="url(#ah-nf7)" />
            <path class="dg-line violet" d="M548 74 H580" marker-end="url(#ah-nf7)" />
          </svg>
          <figcaption>Figure 5 — Stories are a TTL playlist, not a second feed JOIN. Expiry must hide the id and eventually the blob.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-celeb">Celebrities and the CDN</h3>
        <p>A celebrity post is one blob, many viewers. The CDN is the actual scale-out: origin shield, cache keys by variant, long TTL because media is immutable. The feed service still only returns URLs. Stampeding a million clients onto origin when a cache key is wrong is a self-inflicted outage; version the variant in the path.</p>
        <p>Read-merge for celebrities: on feed open, fetch N recent ids from each followed celebrity outbox (there are few — people follow tens of true celebrities, not thousands). Merge with the precomputed list, then rank. Bound N so one Super Bowl account cannot dominate retrieve.</p>
        <div class="lesson-callout"><strong>Cache the card, not the bytes, in the feed tier.</strong> Hydration caches JSON. Bytes belong at the CDN. Mixing them produces a feed cluster that OOMs on JPEGs.</div>

        <h3 class="lesson-subhead" id="nf-likes">Likes as sharded counters</h3>
        <p>Like QPS on a viral post is a hotspot. Use <a href="/learn/modern-system-design/sharded-counters">sharded counters</a>: increment a shard, periodically roll up. The feed can show a slightly stale count. The like edge (who liked) is a separate graph for the likesheet UI and for “unlike.” Do not put the viewer’s like bit in the counter store; that is a per-user set or a bitmap.</p>
        <p>Comments are a threaded list per post, not a feed problem. Cap and paginate. Fan-out of “comment notifications” is another hybrid-fan-out product; skip unless asked.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Like increments go to shards then a rolled-up count on the card">
            <defs>
              <marker id="ah-nf5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="48" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="74" text-anchor="middle">like tap</text>
            <rect class="dg-box c" x="176" y="48" width="160" height="44" rx="7" />
            <text class="dg-s" x="256" y="74" text-anchor="middle">counter shards</text>
            <rect class="dg-box b" x="376" y="48" width="140" height="44" rx="7" />
            <text class="dg-s" x="446" y="74" text-anchor="middle">rollup</text>
            <rect class="dg-box g" x="556" y="48" width="148" height="44" rx="7" />
            <text class="dg-s" x="630" y="74" text-anchor="middle">card count</text>
            <path class="dg-line pink" d="M136 70 H172" marker-end="url(#ah-nf5)" />
            <path class="dg-line pink" d="M336 70 H372" marker-end="url(#ah-nf5)" />
            <path class="dg-line pink" d="M516 70 H552" marker-end="url(#ah-nf5)" />
          </svg>
          <figcaption>Figure 6 — Likes are an approximate counter plus a per-user edge. The feed must not wait on either.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="nf-eval">Evaluation</h3>
        <p>Hybrid fan-out still lags: a newly followed celebrity will not backfill perfectly; a privacy change must retract ids that already landed in lists (tombstones, or live ACL checks at hydrate — pick one and pay). Ranking needs labelled data you will not have on a whiteboard. Transcode delay makes “posted” and “seen by followers” different moments; some products show a placeholder, which we avoided for cleanliness and which product may demand.</p>
        <p>Stories expiry is eventually consistent with CDN caches: a 24-hour object with a 12-hour edge TTL can linger. Short cache TTLs or URL tokens with exp claim fix that at a hit-rate cost. Explore is not designed here; pretending the home ranker is explore will not survive contact with a candidate-generation team.</p>
        <p>We also ignored abuse (CSAM scanning on upload, before CDN), region-specific takedowns, and ads. Those sit on the media ingest and the ranker slotting, respectively.</p>
        <p>Follow-graph churn (mass unfollow, block) should drop candidates at hydrate even if fan-out already wrote the id. The cheap check is a bloom or a small block list per viewer, not a rebuild of every timeline.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="What this design leaves out">
            <defs>
              <marker id="ah-nf6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="220" height="72" rx="8" />
            <text class="dg-s" x="126" y="68" text-anchor="middle">explore / search</text>
            <text class="dg-s" x="126" y="86" text-anchor="middle">separate retrieval</text>
            <rect class="dg-box o" x="250" y="40" width="220" height="72" rx="8" />
            <text class="dg-s" x="360" y="68" text-anchor="middle">ads auction</text>
            <text class="dg-s" x="360" y="86" text-anchor="middle">slotting only</text>
            <rect class="dg-box y" x="484" y="40" width="220" height="72" rx="8" />
            <text class="dg-s" x="594" y="68" text-anchor="middle">DMs and live</text>
            <text class="dg-s" x="594" y="86" text-anchor="middle">other chapters</text>
          </svg>
          <figcaption>Figure 7 — Scope control is part of the design. Home feed, stories, media, likes — then stop.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why transcode before fan-out? (2) What is retrieve-then-rank, and what is the fallback if the model is down? (3) How do stories differ from posts in storage? (4) Why are likes sharded, and why may the count be stale on the card?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Newsfeed fan-out, ranking stages and media pipelines are standard industry patterns; the explanations, diagrams, tables and exercises are our own.',
};
