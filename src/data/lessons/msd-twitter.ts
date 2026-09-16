/** Modern System Design — Chapter 30: Design Twitter.
 *  Fan-out, celebrities, home timeline cache, tweet store, search and trending.
 */

export const msdTwitter = {
  slug: 'twitter',
  title: 'Design Twitter',
  subtitle:
    'Twitter is a tiny write (a tweet) that must appear in millions of home timelines without pretending every user is equal. Fan-out-on-write, fan-out-on-read, and a hybrid for celebrities are the interview. Search and trending are separate systems that consume the same firehose.',
  byline: 'Modern System Design · Chapter 30 · ~2h 10m read · Advanced',
  interviewTip:
    'Reuse the Quora hybrid fan-out argument, then tighten it: tweets are smaller, QPS is higher, and the home timeline is the product, not a question page. Name the celebrity threshold, the timeline cache as a Redis list of ids, and hydration from a tweet store. Mention a client-side load balancer or sticky session only if you have time — it is a nice extra, not a substitute for the fan-out discussion.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Twitter',
      children: [
        { id: 'tw-what', title: 'The product, tightly scoped' },
        { id: 'tw-vs-q', title: 'What we already know from Quora' },
        { id: 'tw-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>Users post short messages, follow each other, and read a home timeline that should feel instant. The write is a few hundred bytes. The read is the entire company. If you design a single table of tweets and <code>SELECT FROM follows JOIN tweets</code>, you have described 2007, not the system people mean in interviews.</p>

        <h3 class="lesson-subhead" id="tw-what">The product, tightly scoped</h3>
        <p>Post, follow, home timeline, user profile timeline, search, trending. Media is blob+CDN. DMs are a chat system (WhatsApp chapter) and we will not hide a chat design inside this one. Ads are a ranking feature on the same timeline, not a second product here.</p>

        <h3 class="lesson-subhead" id="tw-vs-q">What we already know from Quora</h3>
        <p><a href="/learn/modern-system-design/quora">Chapter 26</a> already argued hybrid fan-out. Twitter is that argument with worse celebrities and a higher read QPS. Tweets are immutable enough (edits are a later product) that denormalised id lists stay valid. Deletes are tombstones. The home timeline is closer to Instagram's feed than to a question page: there is no bounded "this thread" cache for the main surface.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Tweet write versus home timeline read">
            <defs>
              <marker id="ah-tw1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">WRITE</text>
            <text class="dg-s" x="26" y="58">~10k tweets/sec peak at large scale</text>
            <text class="dg-s" x="26" y="76">tiny payload, huge fan-out risk</text>
            <text class="dg-s" x="26" y="94">must ack the author fast</text>
            <text class="dg-s" x="26" y="112">fan-out is async</text>
            <rect class="dg-band b" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">HOME TIMELINE</text>
            <text class="dg-s" x="382" y="58">hundreds of thousands of reads/sec</text>
            <text class="dg-s" x="382" y="76">must feel like a local list</text>
            <text class="dg-s" x="382" y="94">hydrate ids from tweet cache</text>
            <text class="dg-s" x="382" y="112">rank / ads optional overlay</text>
          </svg>
          <figcaption>Figure 1 — Author latency and follower latency are different SLOs. Do not make the author wait for fan-out.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tw-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Tweet objects</td><td>KV / wide-column store</td></tr>
            <tr><td>Home lists</td><td>Redis/cache lists or Cassandra timelines</td></tr>
            <tr><td>Follow graph</td><td>adjacency lists, cached</td></tr>
            <tr><td>Search</td><td>inverted index on the firehose</td></tr>
            <tr><td>Trending</td><td>stream counts + damping</td></tr>
            <tr><td>Media</td><td>blob + CDN</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Ids, then hydrate.</strong> Every timeline is a list of tweet ids (and maybe author ids). Bodies live in a tweet cache with a very high hit rate because timelines are bursty and tweets are tiny. Copying tweet text into millions of home lists is how you make deletes and edits impossible.</div>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of Twitter’s Design",
      children: [
        { id: 'tw-func', title: 'Functional requirements' },
        { id: 'tw-nf', title: 'Non-functional requirements' },
        { id: 'tw-est', title: 'Estimation' },
        { id: 'tw-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tw-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li>Post a tweet (text, optional media, reply/retweet as pointers).</li>
          <li>Follow / unfollow.</li>
          <li>Home timeline and profile timeline.</li>
          <li>Search tweets and users.</li>
          <li>Trending topics for a geo.</li>
        </ol>
        <h3 class="lesson-subhead" id="tw-nf">Non-functional requirements</h3>
        <table>
          <thead><tr><th>Metric</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Post ack</td><td>p99 &lt; 200 ms (durable tweet, not full fan-out)</td></tr>
            <tr><td>Home timeline</td><td>p99 &lt; 200 ms</td></tr>
            <tr><td>Fan-out lag</td><td>seconds for normal users; celebrities via pull</td></tr>
            <tr><td>Availability</td><td>reads 99.99%; posting 99.9%</td></tr>
            <tr><td>Tweet durability</td><td>once acked, it exists</td></tr>
          </tbody>
        </table>
        <h3 class="lesson-subhead" id="tw-est">Estimation</h3>
        <pre><code>300M DAU
  0.1 tweets/user/day average (heavy tail) -> 30M tweets/day -> 300/sec avg, ~10k peak
  20 home refreshes/user/day -> 60k reads/sec avg, ~200k peak

FOLLOWERS
  median a few hundred
  celebrity 50M+
  naive fan-out of one celebrity tweet: 50M list pushes  -> not on the request path,
    and not even on a shared async pool without isolation

STORAGE
  300/sec x 300 B x 10^5 ≈ 9 GB/day tweets
  media dominates; blob store
  home lists: 300M users x 800 ids x 16 B ≈ 4 TB  (trim old ids)</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 110" role="img" aria-label="Twitter read write ratio">
            <defs>
              <marker id="ah-tw2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="24" width="220" height="44" rx="7" />
            <text class="dg-s" x="126" y="50" text-anchor="middle">10k write QPS peak</text>
            <rect class="dg-box b" x="268" y="24" width="220" height="44" rx="7" />
            <text class="dg-s" x="378" y="50" text-anchor="middle">200k read QPS peak</text>
            <rect class="dg-box r" x="520" y="24" width="184" height="44" rx="7" />
            <text class="dg-s" x="612" y="50" text-anchor="middle">50M fan-out</text>
            <path class="dg-line green" d="M236 46 H264" marker-end="url(#ah-tw2)" />
            <path class="dg-line green" d="M488 46 H516" marker-end="url(#ah-tw2)" />
            <text class="dg-s" x="16" y="92">The third box is why hybrid fan-out exists. The second box is why timelines are cached.</text>
          </svg>
          <figcaption>Figure 2 — Reads dwarf writes; celebrity fan-out dwarfs both if you are naive.</figcaption>
        </figure>
        <h3 class="lesson-subhead" id="tw-api">API sketch</h3>
        <pre><code>POST /tweets          { text, mediaKeys[], replyTo? }
POST /follow          { userId }
GET  /timeline/home?cursor=
GET  /users/{id}/tweets?cursor=
GET  /search?q=
GET  /trends?woeid=</code></pre>
      `,
    },
    {
      id: 'high',
      title: 'High-level Design of Twitter',
      children: [
        { id: 'tw-fan', title: 'Fan-out on write versus on read' },
        { id: 'tw-store', title: 'Tweet store and timeline cache' },
        { id: 'tw-arch', title: 'Architecture' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tw-fan">Fan-out on write versus on read</h3>
        <p>On write: push the new tweet id into each follower's home list. Reads are O(1) range of a list. Celebrities explode writes. On read: fetch latest tweets from each followee's user timeline (an outbox), merge. Reads explode with follow count. Hybrid: push for users below a follower threshold; celebrities have only an outbox, merged at read time. This is Quora's table with tweets as the unit.</p>
        <table>
          <thead><tr><th></th><th>Write fan-out</th><th>Read fan-out</th><th>Hybrid</th></tr></thead>
          <tbody>
            <tr><td>Home read</td><td>fast</td><td>scatter-gather</td><td>fast + small pull</td></tr>
            <tr><td>Post</td><td>O(followers)</td><td>O(1)</td><td>O(followers) if small</td></tr>
            <tr><td>Celebrity</td><td>melts</td><td>hurts their followers' reads</td><td>isolated</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="tw-store">Tweet store and timeline cache</h3>
        <p>Tweet store: key = tweet id, value = body + author + media keys. Cache it. User timeline: the author's posts, used for profiles and as the celebrity outbox. Home timeline: the denormalised list for non-celebrity follows. Trim homes to a few hundred ids; older content is "load more" via on-read for people who scroll that far (they are rare).</p>

        <h3 class="lesson-subhead" id="tw-arch">Architecture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 170" role="img" aria-label="Twitter high level fan-out architecture">
            <defs>
              <marker id="ah-tw3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="24" width="100" height="40" rx="6" />
            <text class="dg-s" x="66" y="48" text-anchor="middle">post API</text>
            <rect class="dg-box y" x="140" y="24" width="110" height="40" rx="6" />
            <text class="dg-s" x="195" y="48" text-anchor="middle">tweet store</text>
            <rect class="dg-box r" x="274" y="24" width="120" height="40" rx="6" />
            <text class="dg-s" x="334" y="48" text-anchor="middle">fan-out Q</text>
            <rect class="dg-box g" x="418" y="24" width="130" height="40" rx="6" />
            <text class="dg-s" x="483" y="48" text-anchor="middle">home lists</text>
            <rect class="dg-box p" x="572" y="24" width="132" height="40" rx="6" />
            <text class="dg-s" x="638" y="48" text-anchor="middle">celeb outbox</text>
            <rect class="dg-box b" x="16" y="90" width="100" height="40" rx="6" />
            <text class="dg-s" x="66" y="114" text-anchor="middle">timeline</text>
            <rect class="dg-box c" x="140" y="90" width="110" height="40" rx="6" />
            <text class="dg-s" x="195" y="114" text-anchor="middle">hydrate</text>
            <rect class="dg-box l" x="274" y="90" width="120" height="40" rx="6" />
            <text class="dg-s" x="334" y="114" text-anchor="middle">search</text>
            <rect class="dg-box y" x="418" y="90" width="130" height="40" rx="6" />
            <text class="dg-s" x="483" y="114" text-anchor="middle">trends</text>
            <path class="dg-line violet" d="M116 44 H136" marker-end="url(#ah-tw3)" />
            <path class="dg-line violet" d="M250 44 H270" marker-end="url(#ah-tw3)" />
            <path class="dg-line violet" d="M394 44 H414" marker-end="url(#ah-tw3)" />
            <text class="dg-s" x="16" y="156">Search and trends tap the firehose; they do not join home lists.</text>
          </svg>
          <figcaption>Figure 3 — Persist the tweet first, then fan-out, then let search catch up.</figcaption>
        </figure>
      `,
    },
    {
      id: 'detailed',
      title: 'Detailed Design of Twitter',
      children: [
        { id: 'tw-search', title: 'Search' },
        { id: 'tw-trend', title: 'Trending' },
        { id: 'tw-media', title: 'Media and deletes' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tw-search">Search</h3>
        <p>Inverted index built from the tweet firehose, partitioned by time (recent vs archive) because almost all search is recent. Hashtags are terms. Early-bird-style in-memory indexes for the last day, with a slower store behind. Ranking is recency plus engagement, not PageRank of the web.</p>

        <h3 class="lesson-subhead" id="tw-trend">Trending</h3>
        <p>Count terms in sliding windows per geo, subtract a baseline so "the" never trends, damp bursts that look like bots. Trending is a stream job that writes a tiny top-K table. It is allowed to be wrong for a minute. It is not allowed to take down posting.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 120" role="img" aria-label="Firehose to search and trends">
            <defs>
              <marker id="ah-tw4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="32" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="58" text-anchor="middle">tweet log</text>
            <rect class="dg-box c" x="196" y="32" width="150" height="44" rx="7" />
            <text class="dg-s" x="271" y="58" text-anchor="middle">search index</text>
            <rect class="dg-box y" x="386" y="32" width="150" height="44" rx="7" />
            <text class="dg-s" x="461" y="58" text-anchor="middle">window counts</text>
            <rect class="dg-box g" x="576" y="32" width="128" height="44" rx="7" />
            <text class="dg-s" x="640" y="58" text-anchor="middle">top-K</text>
            <path class="dg-line hot" d="M156 54 H192" marker-end="url(#ah-tw4)" />
            <path class="dg-line hot" d="M346 54 H382" marker-end="url(#ah-tw4)" />
            <path class="dg-line hot" d="M536 54 H572" marker-end="url(#ah-tw4)" />
            <text class="dg-s" x="16" y="104">One log, many consumers. Do not make posting wait on the indexer.</text>
          </svg>
          <figcaption>Figure 4 — Search and trending are consumers of the same durable log.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tw-media">Media and deletes</h3>
        <p>Media URLs on the tweet, bytes in blob+CDN. Deletes: tombstone the tweet; hydration skips it; home lists compact later. Unfollow does not rewrite history; it only stops future fan-out. That surprises users and is still the scalable choice.</p>
      `,
    },
    {
      id: 'cslb',
      title: 'Client-side Load Balancer for Twitter',
      children: [
        { id: 'tw-cslb', title: 'Why the client might pick a backend' },
        { id: 'tw-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="tw-cslb">Why the client might pick a backend</h3>
        <p>At this QPS, a central L7 balancer is a lot of connections and a lot of east-west hops. A client-side load balancer (or a smart DNS + local proxy like a sidecar) lets the app pick among discovered timeline replicas, skip a sick one, and keep connections warm. Twitter-scale shops have published variants of this: the phone talks to an edge, the edge talks to a subset of cache machines with consistent hashing on user id so a user's home list stays hot on a few boxes.</p>
        <p>Sticky hashing on <code>userId</code> is the point: home timeline cache hit rate collapses if every request lands on a random replica. This is the same "session or key affinity" idea as <a href="/learn/modern-system-design/load-balancers">Chapter 8</a>, pushed closer to the client.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 130" role="img" aria-label="User-id hashed timeline cache replicas">
            <defs>
              <marker id="ah-tw5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="64" text-anchor="middle">client / edge</text>
            <rect class="dg-box g" x="200" y="16" width="150" height="40" rx="7" />
            <text class="dg-s" x="275" y="40" text-anchor="middle">cache A</text>
            <rect class="dg-box g" x="200" y="64" width="150" height="40" rx="7" />
            <text class="dg-s" x="275" y="88" text-anchor="middle">cache B</text>
            <rect class="dg-box g" x="380" y="40" width="150" height="40" rx="7" />
            <text class="dg-s" x="455" y="64" text-anchor="middle">cache C</text>
            <rect class="dg-box y" x="560" y="40" width="144" height="40" rx="7" />
            <text class="dg-s" x="632" y="64" text-anchor="middle">tweet KV</text>
            <path class="dg-line blue" d="M156 60 H196" marker-end="url(#ah-tw5)" />
            <path class="dg-line blue dash" d="M350 36 H376" marker-end="url(#ah-tw5)" />
            <text class="dg-s" x="16" y="116">Hash userId to a replica. Random LB looks fair and wrecks the working set.</text>
          </svg>
          <figcaption>Figure 5 — Affinity is a cache-correctness feature, not a premature optimisation.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tw-eval">Evaluation</h3>
        <p>Hybrid thresholds still thrash. Ranking/For You as a full recommender is a different system we only waved at (see Instagram next). Client-side LB adds operational complexity: stale membership, security of service discovery, and debugging "only some phones are slow". Search lag after a breaking news tweet is a product incident. We did not design abuse, bots, or rate limits beyond a sentence, and those are half the real site.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Compare write vs read fan-out for a 20-follower user and a 20M-follower user. (2) Why store ids on the home list? (3) How do trends stay off the post path? (4) Why hash timeline cache by user id?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Timeline fan-out and celebrity handling are standard industry ideas; the explanations, diagrams, tables and exercises are our own.',
};
