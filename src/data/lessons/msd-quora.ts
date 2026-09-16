/** Modern System Design — Chapter 26: Design Quora.
 *  A Q&A product whose real load is the feed, not the question write path.
 */

export const msdQuora = {
  slug: 'quora',
  title: 'Design Quora',
  subtitle:
    'Questions are rare; reading answers, following topics and ranking a personalised home feed are the product. The architecture is therefore a write-light, read-heavy ranking system with a celebrity-follow problem, not a forum bolted onto a single database.',
  byline: 'Modern System Design · Chapter 26 · ~1h 40m read · Advanced',
  interviewTip:
    'Name the write:read split in the first minute and then spend the interview on ranking and fan-out, not on the question schema. Interviewers are waiting for you to notice that a celebrity follow cannot be treated like a normal follow, and that "denormalise the feed on write" versus "assemble it on read" is the decision the rest of the design hangs on. If you never mention ranking features, you have designed a dump of recent posts, not Quora.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Quora',
      children: [
        { id: 'q-what', title: 'What we are actually building' },
        { id: 'q-why-hard', title: 'Why a Q&A site is harder than it looks' },
        { id: 'q-two-reads', title: 'The two kinds of read' },
        { id: 'q-blocks', title: 'Which building blocks this needs' },
      ],
      html: `
        <p>A Q&A product looks like a blog with comments until you write down what people actually do on it. Almost nobody asks a question. Almost everybody reads, follows, searches, and scrolls a ranked feed of answers they did not explicitly request. The write path is small. The ranking and distribution path is the system.</p>

        <h3 class="lesson-subhead" id="q-what">What we are actually building</h3>
        <p>Users ask questions, other users write answers, and the product has to decide which answers are worth showing, to whom, and in what order. Around that core sit follows (people, topics, questions), a home feed, search, comments, upvotes, and notifications. Photos and short videos appear as attachments, not as the product — that is Instagram, later.</p>
        <p>The unit of ranking is the <em>answer</em>, not the question. A question with two hundred answers is a ranking problem. A question with none is a matching problem: who should we ping to write the first one?</p>

        <h3 class="lesson-subhead" id="q-why-hard">Why a Q&A site is harder than it looks</h3>
        <p>Forums dump newest-first. That fails here for three structural reasons. First, quality is not recency: a five-year-old answer can still be the correct one, and a new one can be spam. Second, the graph is not a simple follower list — topics, questions and people are three different follow edges with different fan-out. Third, a handful of writers have millions of followers, so a naive "push every answer to every follower's feed" design melts on celebrity writes.</p>
        <p>Those three facts decide more of the architecture than any choice of database.</p>

        <h3 class="lesson-subhead" id="q-two-reads">The two kinds of read</h3>
        <p>Separate the request paths before drawing boxes. A question page is a lookup plus a ranked list of answers. The home feed is a personalised ranking over a much larger candidate set. They share storage; they do not share serving logic.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Question page reads versus home feed reads">
            <defs>
              <marker id="ah-q1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="208" rx="11" />
            <text class="dg-h" x="26" y="36">QUESTION PAGE</text>
            <rect class="dg-box b" x="26" y="46" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="63" text-anchor="middle">lookup · bounded · cache-friendly</text>
            <text class="dg-s" x="26" y="92">· one question id, a few hundred answers</text>
            <text class="dg-s" x="26" y="110">· rank answers for this question only</text>
            <text class="dg-s" x="26" y="128">· same page for most readers</text>
            <text class="dg-s" x="26" y="146">· easy to cache at the CDN for popular Qs</text>
            <text class="dg-s" x="26" y="164">· write is rare: a new answer</text>
            <text class="dg-s" x="26" y="196">Optimise for: ranked list latency.</text>
            <text class="dg-s" x="26" y="212">A 50 ms p99 is plenty.</text>

            <rect class="dg-band o" x="368" y="16" width="340" height="208" rx="11" />
            <text class="dg-h" x="382" y="36">HOME FEED</text>
            <rect class="dg-box o" x="382" y="46" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="63" text-anchor="middle">personal · unbounded · hard to cache</text>
            <text class="dg-s" x="382" y="92">· candidates from follows + topics</text>
            <text class="dg-s" x="382" y="110">· rank per user, per request</text>
            <text class="dg-s" x="382" y="128">· celebrity follows explode fan-out</text>
            <text class="dg-s" x="382" y="146">· cannot cache the whole feed</text>
            <text class="dg-s" x="382" y="164">· this is where the QPS lives</text>
            <text class="dg-s" x="382" y="196">Optimise for: candidate retrieval</text>
            <text class="dg-s" x="382" y="212">plus ranking under a budget.</text>
            <path class="dg-line blue" d="M356 120 H364" marker-end="url(#ah-q1)" />
          </svg>
          <figcaption>Figure 1 — Two reads. Caching the question page is easy; caching the home feed is mostly a waste of RAM.</figcaption>
        </figure>
        <p>If you treat both as "get some posts from MySQL", you will pass the first ten minutes of the interview and fail the next twenty.</p>

        <h3 class="lesson-subhead" id="q-blocks">Which building blocks this needs</h3>
        <table>
          <thead><tr><th>Requirement</th><th>Building block</th><th>Chapter</th></tr></thead>
          <tbody>
            <tr><td>Question, answer, user metadata</td><td>Partitioned database</td><td><a href="/learn/modern-system-design/databases">9</a></td></tr>
            <tr><td>Hot question pages</td><td>Cache + optional CDN</td><td><a href="/learn/modern-system-design/distributed-cache">16</a></td></tr>
            <tr><td>Follow graph and fan-out</td><td>Graph store or adjacency lists</td><td>this chapter</td></tr>
            <tr><td>Full-text search over Q&amp;A</td><td>Distributed search</td><td><a href="/learn/modern-system-design/distributed-search">21</a></td></tr>
            <tr><td>Upvotes at high write rates</td><td>Sharded counters</td><td><a href="/learn/modern-system-design/sharded-counters">24</a></td></tr>
            <tr><td>New-answer notifications</td><td>Queue + workers</td><td><a href="/learn/modern-system-design/messaging-queue">17</a></td></tr>
            <tr><td>Answer attachments</td><td>Blob store + CDN</td><td><a href="/learn/modern-system-design/blob-store">20</a></td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Ranking is not a building block you can fetch from Chapter 6.</strong> It is a service with its own latency budget, feature store and model refresh. Treat it as a first-class component from the high-level diagram onwards, or you will spend the detailed-design round inventing it under time pressure.</div>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of Quora's Design",
      children: [
        { id: 'q-func', title: 'Functional requirements' },
        { id: 'q-nonfunc', title: 'Non-functional requirements, as numbers' },
        { id: 'q-scope', title: 'What we deliberately exclude' },
        { id: 'q-est', title: 'Estimation: the numbers that decide the design' },
        { id: 'q-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="q-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li><strong>Ask and answer</strong> with rich text, optional images, edits and comments.</li>
          <li><strong>Rank answers</strong> on a question page by quality, not only by time.</li>
          <li><strong>Follow</strong> people, topics and questions.</li>
          <li><strong>Home feed</strong> of ranked answers from the follow graph and topics.</li>
          <li><strong>Search</strong> questions and answers by text.</li>
          <li><strong>Vote and notify</strong> without making either look like a source of truth for ranking.</li>
        </ol>

        <h3 class="lesson-subhead" id="q-nonfunc">Non-functional requirements, as numbers</h3>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why this number</th></tr></thead>
          <tbody>
            <tr><td>Question-page p99</td><td>&lt; 150 ms</td><td>A Wikipedia-like read; users bounce if the page feels sticky</td></tr>
            <tr><td>Home-feed p99</td><td>&lt; 300 ms</td><td>Ranking is allowed to spend ~80 ms; the rest is retrieval</td></tr>
            <tr><td>Write availability</td><td>99.9%</td><td>A failed ask can retry; a failed vote should not block the page</td></tr>
            <tr><td>Read availability</td><td>99.99%</td><td>The product is a reading surface</td></tr>
            <tr><td>Answer ranking freshness</td><td>minutes</td><td>A new great answer should surface quickly, not instantly</td></tr>
            <tr><td>Feed consistency</td><td>eventual</td><td>Missing a post for 30 s is acceptable; duplicates are not</td></tr>
            <tr><td>Search freshness</td><td>&lt; 1 min</td><td>New questions must be findable; ranking can lag</td></tr>
          </tbody>
        </table>
        <p>Consistency is per data type, as <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> required. Votes are approximate. The author's own follow list is read-your-writes. The public feed is not.</p>

        <h3 class="lesson-subhead" id="q-scope">What we deliberately exclude</h3>
        <p>Out of scope: the training of the ranking model, ads, Spaces/live audio, and a full moderation platform. We will specify <em>where</em> ranking sits and which features it consumes, not how the model is trained. Moderation is a queue of signals into the same ranking service (downrank, hide), not a separate product in this chapter.</p>

        <h3 class="lesson-subhead" id="q-est">Estimation: the numbers that decide the design</h3>
        <pre><code>ASSUMPTIONS
  300M MAU, 50M DAU
  5 questions asked / 1,000 DAU / day  -> 250k questions/day
  8 answers per question over its life, most in the first week
    -> ~2M new answers/day
  each DAU opens 8 question pages and 12 feed pages

STEP 1 · TRAFFIC
  questions written: 250k / 10^5 s ≈ 3/sec
  answers written:   2M / 10^5 s ≈ 20/sec
  votes: assume 10x answers → 200/sec average, ~1k/sec peak
  question-page reads: 50M x 8 / 10^5 ≈ 4,000/sec avg, ~12k peak
  feed reads: 50M x 12 / 10^5 ≈ 6,000/sec avg, ~18k peak
  write:read ≈ 1:400   <- cache and ranking, not write sharding

STEP 2 · STORAGE
  question + answers text ~ 8 KB average thread
  250k x 8 KB = 2 GB/day of text  -> 0.7 TB/year
  votes, follows, events: larger than text, still low TBs/year
  images: 10% of answers, 200 KB each
    0.1 x 2M x 200 KB = 40 GB/day  -> blob store, not the DB

STEP 3 · FAN-OUT
  median follows: 40 people + 20 topics
  celebrity (top 0.01%): 1M+ followers
  naive push of one celebrity answer:
    1M feed writes in a few seconds  -> this cannot be the default path

STEP 4 · FEED WORKING SET
  50M DAU x 500 cached feed items x 200 B ≈ 5 TB
  too big to hold every user's feed in RAM
  -> cache a window for active users; assemble on demand for the rest</code></pre>
        <p>The celebrity number is the one that kills the first architecture. Everything else is a medium-sized website with a ranking service attached.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 186" role="img" aria-label="Estimates mapping to architectural decisions for Quora">
            <defs>
              <marker id="ah-q2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">NUMBER TO DECISION</text>
            <rect class="dg-box b" x="16" y="32" width="220" height="30" rx="6" />
            <text class="dg-s" x="30" y="52">20 answers/sec writes</text>
            <rect class="dg-box g" x="272" y="32" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="52">one primary DB is enough for the write path</text>
            <rect class="dg-box b" x="16" y="70" width="220" height="30" rx="6" />
            <text class="dg-s" x="30" y="90">18k feed reads/sec peak</text>
            <rect class="dg-box g" x="272" y="70" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="90">feed service + cache, not a SQL join per request</text>
            <rect class="dg-box b" x="16" y="108" width="220" height="30" rx="6" />
            <text class="dg-s" x="30" y="128">1M-follower celebrities</text>
            <rect class="dg-box g" x="272" y="108" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="128">hybrid fan-out: push to normals, pull celebs</text>
            <rect class="dg-box b" x="16" y="146" width="220" height="30" rx="6" />
            <text class="dg-s" x="30" y="166">5 TB of full feed cache</text>
            <rect class="dg-box g" x="272" y="146" width="432" height="30" rx="6" />
            <text class="dg-s" x="286" y="166">cache active users only; others assemble on read</text>
            <path class="dg-line green" d="M236 47 H268" marker-end="url(#ah-q2)" />
            <path class="dg-line green" d="M236 85 H268" marker-end="url(#ah-q2)" />
            <path class="dg-line green" d="M236 123 H268" marker-end="url(#ah-q2)" />
            <path class="dg-line green" d="M236 161 H268" marker-end="url(#ah-q2)" />
          </svg>
          <figcaption>Figure 2 — The celebrity row is the only one that forces a hybrid, not a bigger database.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="q-api">API sketch</h3>
        <pre><code>POST /questions                 { title, body, topics[] }
POST /questions/{id}/answers    { body }
POST /answers/{id}/vote         { value: +1 | -1 }   # idempotent per user
POST /follow                    { type, id }         # user | topic | question

GET  /questions/{id}            ranked answers, cursor
GET  /feed?cursor=              personalised, not cache-shared
GET  /search?q=&amp;cursor=

GET  /users/{id}/answers
DELETE is a soft hide: ranking must see a tombstone, not a 404 hole</code></pre>
        <div class="lesson-callout"><strong>Votes must be idempotent per (user, answer).</strong> Double-taps and retries are the common case on mobile. Store a vote row with a uniqueness constraint, and derive the counter from that table asynchronously. Never increment a counter from the client with no record of who voted.</div>
      `,
    },
    {
      id: 'initial',
      title: 'Initial Design of Quora',
      children: [
        { id: 'q-naive', title: 'The design that fits on a whiteboard' },
        { id: 'q-onread', title: 'Assemble the feed on read' },
        { id: 'q-onwrite', title: 'Denormalise the feed on write' },
        { id: 'q-fail', title: 'Where the first design breaks' },
      ],
      html: `
        <h3 class="lesson-subhead" id="q-naive">The design that fits on a whiteboard</h3>
        <p>Start with the boring system. A primary-replica SQL cluster holds users, questions, answers, votes and follows. Writes go to the primary. Reads go to replicas. A cache sits in front of popular question pages. Search is a separately indexed copy. This is enough for the first million users and almost none of the interesting load.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Naive Quora architecture with SQL, cache and search">
            <defs>
              <marker id="ah-q3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="60" text-anchor="middle">client</text>
            <rect class="dg-box b" x="140" y="36" width="110" height="40" rx="7" />
            <text class="dg-s" x="195" y="60" text-anchor="middle">API servers</text>
            <rect class="dg-box g" x="276" y="16" width="130" height="40" rx="7" />
            <text class="dg-s" x="341" y="40" text-anchor="middle">cache</text>
            <rect class="dg-box y" x="276" y="72" width="130" height="40" rx="7" />
            <text class="dg-s" x="341" y="96" text-anchor="middle">SQL primary</text>
            <rect class="dg-box y" x="432" y="72" width="130" height="40" rx="7" />
            <text class="dg-s" x="497" y="96" text-anchor="middle">SQL replicas</text>
            <rect class="dg-box c" x="588" y="36" width="116" height="40" rx="7" />
            <text class="dg-s" x="646" y="60" text-anchor="middle">search</text>
            <path class="dg-line violet" d="M116 56 H136" marker-end="url(#ah-q3)" />
            <path class="dg-line violet" d="M250 56 H272" marker-end="url(#ah-q3)" />
            <path class="dg-line violet" d="M406 92 H428" marker-end="url(#ah-q3)" />
            <path class="dg-line violet" d="M250 56 H272" />
            <path class="dg-line violet dash" d="M406 36 H584" marker-end="url(#ah-q3)" />
            <text class="dg-s" x="16" y="140">Question pages work. The home feed is a JOIN over follows that you will regret at 18k QPS.</text>
            <text class="dg-s" x="16" y="156">Search is already a separate system, which is the one thing this sketch gets right.</text>
          </svg>
          <figcaption>Figure 3 — A fine day-one architecture. It is also a trap if you stop here.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="q-onread">Assemble the feed on read</h3>
        <p>On each home-feed request: load the user's follow lists, fetch recent answers from each followed person and topic, merge, rank, return a page. No denormalised state. Writes stay cheap. Reads get more expensive as the follow graph grows, and they get catastrophically expensive for people who follow a few celebrities plus hundreds of topics.</p>
        <p>The attraction is correctness. There is one copy of each answer. Edits and deletes are free. The cost is latency variance: you are doing a scatter-gather of dozens of sources under a 300 ms budget.</p>

        <h3 class="lesson-subhead" id="q-onwrite">Denormalise the feed on write</h3>
        <p>When an answer is published, push a pointer into every follower's feed list (a per-user Redis list or a Cassandra timeline table). Reads become "get the next 20 ids, hydrate, rank among those". Writes become fan-out. For a user with 40 followers this is nothing. For a user with a million, you have just issued a million writes, and the publisher's request cannot wait for them.</p>
        <table>
          <thead><tr><th></th><th>On-read assembly</th><th>On-write fan-out</th></tr></thead>
          <tbody>
            <tr><td>Write cost</td><td>O(1)</td><td>O(followers)</td></tr>
            <tr><td>Read cost</td><td>O(followees) scatter-gather</td><td>O(page) from one list</td></tr>
            <tr><td>Edits/deletes</td><td>trivial</td><td>must repair many lists or hydrate lazily</td></tr>
            <tr><td>Celebrity</td><td>hurts readers who follow them</td><td>hurts the write path, can melt the cluster</td></tr>
            <tr><td>Storage</td><td>minimal duplication</td><td>one copy of each pointer per follower</td></tr>
          </tbody>
        </table>
        <p>Neither column is acceptable on its own at this scale. That is the point of the table: the initial design is a choice of which failure mode you prefer, not a solution.</p>

        <h3 class="lesson-subhead" id="q-fail">Where the first design breaks</h3>
        <p>Three breaks, in the order you will hit them. (1) Popular question pages stampede the replica set until you cache them. (2) The home-feed JOIN exceeds the latency SLO for heavy follow graphs. (3) A celebrity posts and the fan-out queue backs up for minutes, delaying everyone else's notifications because you shared a queue. Ranking is still a <code>ORDER BY votes DESC</code>, which is not ranking.</p>
        <div class="lesson-callout"><strong>Do not share a queue between celebrity fan-out and everyone else.</strong> Isolate high-fan-out work on its own topic and consumer pool, or a single famous writer takes the notification path hostage. This is the same noisy-neighbour lesson as partitioned queues in <a href="/learn/modern-system-design/messaging-queue">Chapter 17</a>.</div>
      `,
    },
    {
      id: 'final',
      title: 'Final Design of Quora',
      children: [
        { id: 'q-hybrid', title: 'Hybrid fan-out' },
        { id: 'q-rank', title: 'Ranking answers, not sorting votes' },
        { id: 'q-search-feed', title: 'Search, topics and the question page' },
        { id: 'q-eval', title: 'Evaluation: where this design falls short' },
      ],
      html: `
        <h3 class="lesson-subhead" id="q-hybrid">Hybrid fan-out</h3>
        <p>Split followees into two classes at write time. If follower count is below a threshold — 10,000 is a reasonable first number — push a pointer into each follower's timeline asynchronously. If above, write the answer only to a celebrity outbox. On read, merge the user's denormalised timeline with a pull from the outboxes of the celebrities they follow. Most users follow few celebrities, so the pull set is small.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Hybrid fan-out for normal writers versus celebrities">
            <defs>
              <marker id="ah-q4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WRITE PATH</text>
            <rect class="dg-box o" x="16" y="34" width="120" height="40" rx="7" />
            <text class="dg-s" x="76" y="58" text-anchor="middle">new answer</text>
            <rect class="dg-box y" x="168" y="34" width="130" height="40" rx="7" />
            <text class="dg-s" x="233" y="58" text-anchor="middle">fan-out worker</text>
            <rect class="dg-box g" x="332" y="16" width="170" height="36" rx="7" />
            <text class="dg-s" x="417" y="38" text-anchor="middle">push to N timelines</text>
            <rect class="dg-box r" x="332" y="60" width="170" height="36" rx="7" />
            <text class="dg-s" x="417" y="82" text-anchor="middle">append celeb outbox</text>
            <rect class="dg-box b" x="530" y="34" width="174" height="40" rx="7" />
            <text class="dg-s" x="617" y="58" text-anchor="middle">notify subset</text>
            <path class="dg-line hot" d="M136 54 H164" marker-end="url(#ah-q4)" />
            <path class="dg-line hot" d="M298 54 H328" marker-end="url(#ah-q4)" />
            <path class="dg-line hot" d="M502 54 H526" marker-end="url(#ah-q4)" />
            <text class="dg-h" x="16" y="128">READ PATH</text>
            <rect class="dg-box b" x="16" y="140" width="150" height="40" rx="7" />
            <text class="dg-s" x="91" y="164" text-anchor="middle">user timeline</text>
            <rect class="dg-box r" x="192" y="140" width="170" height="40" rx="7" />
            <text class="dg-s" x="277" y="164" text-anchor="middle">celeb outboxes</text>
            <rect class="dg-box p" x="388" y="140" width="140" height="40" rx="7" />
            <text class="dg-s" x="458" y="164" text-anchor="middle">ranker</text>
            <rect class="dg-box g" x="554" y="140" width="150" height="40" rx="7" />
            <text class="dg-s" x="629" y="164" text-anchor="middle">page of answers</text>
            <path class="dg-line hot" d="M166 160 H188" marker-end="url(#ah-q4)" />
            <path class="dg-line hot" d="M362 160 H384" marker-end="url(#ah-q4)" />
            <path class="dg-line hot" d="M528 160 H550" marker-end="url(#ah-q4)" />
            <text class="dg-s" x="16" y="204">Hydrate ids from the answer store after ranking, not before. Ranking on fat objects is how you blow the budget.</text>
          </svg>
          <figcaption>Figure 4 — Push the common case, pull the celebrity case, rank a merged candidate set.</figcaption>
        </figure>
        <p>Store timelines as id lists, not as copied answer bodies. Hydration is a batched multi-get against a cache of answers. Deletes become a tombstone on the answer; timelines can keep the id until a later compaction. That is cheaper than hunting a million lists.</p>

        <h3 class="lesson-subhead" id="q-rank">Ranking answers, not sorting votes</h3>
        <p>Votes are a feature, not the rank. A good ranker for a question page uses: vote score with time decay, author reputation, whether the asker marked it, comment quality, report rate, and freshness if the topic is news. A good ranker for the home feed adds affinity with the author, topic overlap, and diversity so the page is not twelve answers from one person.</p>
        <p>Run ranking as an online service with a strict deadline. If the model times out, fall back to a cheap score (votes × decay). Never block the page on a feature that is missing; missing features default to zero.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Ranking pipeline from candidates to scored page">
            <defs>
              <marker id="ah-q5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="150" height="50" rx="7" />
            <text class="dg-s" x="91" y="62" text-anchor="middle">candidates</text>
            <text class="dg-s" x="91" y="78" text-anchor="middle">~200 ids</text>
            <rect class="dg-box y" x="196" y="40" width="150" height="50" rx="7" />
            <text class="dg-s" x="271" y="62" text-anchor="middle">features</text>
            <text class="dg-s" x="271" y="78" text-anchor="middle">cache + store</text>
            <rect class="dg-box p" x="376" y="40" width="150" height="50" rx="7" />
            <text class="dg-s" x="451" y="62" text-anchor="middle">model</text>
            <text class="dg-s" x="451" y="78" text-anchor="middle">80 ms budget</text>
            <rect class="dg-box g" x="556" y="40" width="148" height="50" rx="7" />
            <text class="dg-s" x="630" y="62" text-anchor="middle">top K page</text>
            <text class="dg-s" x="630" y="78" text-anchor="middle">hydrate bodies</text>
            <path class="dg-line blue" d="M166 65 H192" marker-end="url(#ah-q5)" />
            <path class="dg-line blue" d="M346 65 H372" marker-end="url(#ah-q5)" />
            <path class="dg-line blue" d="M526 65 H552" marker-end="url(#ah-q5)" />
            <text class="dg-s" x="16" y="122">Deadline first, quality second. A slightly worse order in 80 ms beats a better order in 800 ms.</text>
            <text class="dg-s" x="16" y="138">Timeouts must return a heuristic ranking, not an error page.</text>
          </svg>
          <figcaption>Figure 5 — Ranking is a latency-bounded service, not a batch job you run after the request.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="q-search-feed">Search, topics and the question page</h3>
        <p>Index questions and answers separately. Question search is the product ("how do I…"); answer search is for power users and for ranking features. Keep the index a few tens of seconds behind writes. The question page itself is cacheable: the HTML/JSON is almost the same for anonymous readers, and personalisation is a thin overlay (your vote, follow button state).</p>
        <p>Topics are not tags you filter in SQL. They are a second follow graph and a second inverted index. A new answer on a hot topic fans out like a mid-tier celebrity — treat popular topics as celebrity-like outboxes if membership is in the millions.</p>

        <h3 class="lesson-subhead" id="q-eval">Evaluation: where this design falls short</h3>
        <p>Hybrid fan-out still has a bad threshold region: accounts that oscillate around 10,000 followers thrash between modes. Ranking quality depends on a feature store we have not designed here; stale reputation scores will promote yesterday's experts forever. We have no story for "why was this shown", which is now a product requirement in many jurisdictions. The feed will duplicate answers that match both a person and a topic follow unless we dedupe by answer id before ranking — easy to forget, ugly in screenshots.</p>
        <p>Search and feed can disagree: a question is findable but never surfaces in the home feed of the people who would answer it. That matching problem (who should write the first answer) is a different system we waved at with notifications.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is the home feed a different system from the question page? (2) Walk through one celebrity answer on the hybrid path. (3) Why are vote counters not the rank? (4) What breaks if you fan-out answer <em>bodies</em> instead of ids?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. These are standard industry ideas about Q&A products, ranking and feed fan-out; the explanations, diagrams, tables and exercises are our own.',
};
