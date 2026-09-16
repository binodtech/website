/** Modern System Design — Chapter 28: Design Yelp.
 *  Local search: geospatial index, reviews, photos, ranking nearby businesses.
 */

export const msdYelp = {
  slug: 'yelp',
  title: 'Design Yelp',
  subtitle:
    'Yelp is nearby search with a reputation layer. The hard parts are a geospatial index that stays fast as reviews accrue, ranking that is not "closest only", and photos that must never sit in the same store as the review text.',
  byline: 'Modern System Design · Chapter 28 · ~1h 40m read · Advanced',
  interviewTip:
    'Lead with "this is a geo query plus a ranking function", then put photos on blob+CDN in the first diagram. Interviewers ding candidates who JOIN reviews in the nearby path. Nearby should return business ids from the geo index, hydrate cards from a cache, and attach a precomputed score. If you mention geohash covering cells and a separate review write path, you are already ahead of most rooms.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Yelp',
      children: [
        { id: 'ye-what', title: 'What we are actually building' },
        { id: 'ye-vs-maps', title: 'How this differs from a map' },
        { id: 'ye-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>A user opens the app in a new neighbourhood and wants a coffee shop that is good, open, and not a kilometre away. That sentence is the whole product: a radius query, a ranking function, and a page of photos they can trust not to be a decade old.</p>

        <h3 class="lesson-subhead" id="ye-what">What we are actually building</h3>
        <p>Business listings (name, hours, lat/lng, categories), user reviews and ratings, photos, and two query surfaces: nearby (geo) and typed search (text + geo bias). Check-ins and reservations are optional later; they do not change the core.</p>

        <h3 class="lesson-subhead" id="ye-vs-maps">How this differs from a map</h3>
        <p><a href="/learn/modern-system-design/google-maps">Google Maps</a> must render the planet. Yelp must rank a few dozen businesses in a kilometre. Tiles are optional (you can overlay pins on a maps SDK). The geo index is not optional. Reviews are a write-light, read-heavy append log with a ranking problem that looks a bit like Quora's answers, except the "question" is a place and it never closes.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 160" role="img" aria-label="Nearby path versus review write path">
            <defs>
              <marker id="ah-ye1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="128" rx="10" />
            <text class="dg-h" x="26" y="36">NEARBY READ</text>
            <text class="dg-s" x="26" y="58">geo index -> ids -> hydrate cards</text>
            <text class="dg-s" x="26" y="76">precomputed score on the business</text>
            <text class="dg-s" x="26" y="94">photos via CDN URLs only</text>
            <text class="dg-s" x="26" y="120">p99 target ~150 ms</text>
            <rect class="dg-band o" x="368" y="16" width="340" height="128" rx="10" />
            <text class="dg-h" x="382" y="36">REVIEW WRITE</text>
            <text class="dg-s" x="382" y="58">append review row</text>
            <text class="dg-s" x="382" y="76">photo to blob, then URL on row</text>
            <text class="dg-s" x="382" y="94">async: update score, index</text>
            <text class="dg-s" x="382" y="120">user waits for 201, not for rank</text>
          </svg>
          <figcaption>Figure 1 — Keep the nearby path free of review-table joins and photo bytes.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ye-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Radius and bbox queries</td><td>Geohash / quadtree index (Ch 27)</td></tr>
            <tr><td>Business and review metadata</td><td>Partitioned DB</td></tr>
            <tr><td>Photos</td><td>Blob store + CDN</td></tr>
            <tr><td>Name and category search</td><td>Search index</td></tr>
            <tr><td>Hot listings in a city centre</td><td>Cache keyed by geohash cell</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>The listing card must be denormalised.</strong> Nearby returns 20 businesses. If each card joins 50 reviews to compute stars, you have lost. Store <code>avg_score</code>, <code>review_count</code>, <code>hero_photo_url</code> on the business document and refresh them asynchronously.</div>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of Yelp’s Design",
      children: [
        { id: 'ye-func', title: 'Functional requirements' },
        { id: 'ye-nonfunc', title: 'Non-functional requirements' },
        { id: 'ye-est', title: 'Estimation' },
        { id: 'ye-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ye-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li>Search nearby businesses by category and radius.</li>
          <li>Typed search biased by location.</li>
          <li>Business page with ranked reviews and photos.</li>
          <li>Write a review, optionally with photos.</li>
          <li>Basic ranking: quality, distance, recency, personalisation later.</li>
        </ol>
        <h3 class="lesson-subhead" id="ye-nonfunc">Non-functional requirements</h3>
        <table>
          <thead><tr><th>Metric</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Nearby p99</td><td>&lt; 150 ms</td></tr>
            <tr><td>Business page p99</td><td>&lt; 200 ms</td></tr>
            <tr><td>Review write</td><td>201 in &lt; 300 ms; ranking lag &lt; 1 min</td></tr>
            <tr><td>Photo durability</td><td>blob-class; never lose a user's upload</td></tr>
            <tr><td>Score consistency</td><td>eventual; author sees own review immediately</td></tr>
          </tbody>
        </table>
        <h3 class="lesson-subhead" id="ye-est">Estimation</h3>
        <pre><code>50M DAU, 5 nearby searches/day, 0.05 reviews/user/day
nearby QPS: 50M x 5 / 10^5 ≈ 2,500/sec avg, ~8k peak
reviews: 50M x 0.05 / 10^5 ≈ 25/sec  <- write-light
photos: 0.4 per review x 400 KB = 4 MB/sec  -> blob, not DB

200M businesses x 1 KB listing = 200 GB
reviews: 25/sec x 1 KB x 10^5 s/day = 2.5 GB/day text

GEO
  city-centre cell may hold 50k restaurants
  a 1 km radius is a handful of geohash cells
  filter + rank 200 candidates, not 200M</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 120" role="img" aria-label="Yelp traffic is read heavy">
            <defs>
              <marker id="ah-ye2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="28" width="220" height="50" rx="7" />
            <text class="dg-s" x="126" y="58" text-anchor="middle">8k nearby QPS</text>
            <rect class="dg-box o" x="260" y="28" width="220" height="50" rx="7" />
            <text class="dg-s" x="370" y="58" text-anchor="middle">25 reviews/sec</text>
            <rect class="dg-box y" x="504" y="28" width="200" height="50" rx="7" />
            <text class="dg-s" x="604" y="58" text-anchor="middle">photos off-path</text>
            <path class="dg-line green" d="M236 53 H256" marker-end="url(#ah-ye2)" />
            <path class="dg-line green" d="M480 53 H500" marker-end="url(#ah-ye2)" />
            <text class="dg-s" x="16" y="104">Read:write ~ 300:1. Spend the interview on geo + rank, not on review sharding.</text>
          </svg>
          <figcaption>Figure 2 — Arithmetic again: this is not a write problem.</figcaption>
        </figure>
        <h3 class="lesson-subhead" id="ye-api">API sketch</h3>
        <pre><code>GET /nearby?lat=&amp;lng=&amp;r=&amp;cat=&amp;cursor=
GET /search?q=&amp;lat=&amp;lng=
GET /biz/{id}                    # listing + first review page
GET /biz/{id}/reviews?cursor=
POST /biz/{id}/reviews           { stars, text }
POST /photos/upload-url          -> put bytes to blob
POST /biz/{id}/photos            { blobKey, caption }</code></pre>
      `,
    },
    {
      id: 'design',
      title: 'Design of Yelp',
      children: [
        { id: 'ye-geo', title: 'The geo index' },
        { id: 'ye-rank', title: 'Ranking nearby businesses' },
        { id: 'ye-photos', title: 'Photos: blob and CDN' },
        { id: 'ye-arch', title: 'High-level architecture' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ye-geo">The geo index</h3>
        <p>Index every business by geohash (or S2 cell) at a precision that matches city-scale queries — typically ~1 km cells, with a second coarser index for 10 km "in this town" searches. A nearby query covers the cells that intersect the radius, fetches business ids, filters by true distance and category, then ranks. Businesses on cell edges are found because you query neighbours, the same covering trick as maps.</p>
        <p>When a listing moves (rare) or is created, update the cell posting list. This is a tiny write. Do not store reviews in this index.</p>

        <h3 class="lesson-subhead" id="ye-rank">Ranking nearby businesses</h3>
        <p>Distance-only ranking produces a street of tourist traps next to the station. A useful score mixes: damped star rating (Wilson or Bayesian average so 5 stars from two reviews lose to 4.4 from 400), recency of reviews, category match, personalisation (cuisines you actually open), and a small distance decay — close enough, then quality wins.</p>
        <p>Precompute the quality part on the business document whenever reviews change. Online, combine <code>quality</code> with <code>distance_decay(d)</code> and a diversity penalty so the list is not twelve chains.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Nearby ranking pipeline">
            <defs>
              <marker id="ah-ye3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="12" y="36" width="130" height="44" rx="7" />
            <text class="dg-s" x="77" y="62" text-anchor="middle">cover cells</text>
            <rect class="dg-box c" x="162" y="36" width="130" height="44" rx="7" />
            <text class="dg-s" x="227" y="62" text-anchor="middle">fetch ids</text>
            <rect class="dg-box y" x="312" y="36" width="130" height="44" rx="7" />
            <text class="dg-s" x="377" y="62" text-anchor="middle">hydrate</text>
            <rect class="dg-box p" x="462" y="36" width="120" height="44" rx="7" />
            <text class="dg-s" x="522" y="62" text-anchor="middle">score</text>
            <rect class="dg-box g" x="602" y="36" width="106" height="44" rx="7" />
            <text class="dg-s" x="655" y="62" text-anchor="middle">page</text>
            <path class="dg-line violet" d="M142 58 H158" marker-end="url(#ah-ye3)" />
            <path class="dg-line violet" d="M292 58 H308" marker-end="url(#ah-ye3)" />
            <path class="dg-line violet" d="M442 58 H458" marker-end="url(#ah-ye3)" />
            <path class="dg-line violet" d="M582 58 H598" marker-end="url(#ah-ye3)" />
            <text class="dg-s" x="12" y="112">Hydrate from a listing cache, not from the review table. Score uses stored quality plus distance.</text>
          </svg>
          <figcaption>Figure 3 — Candidate generation is geo; ranking is a cheap function on denormalised fields.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ye-photos">Photos: blob and CDN</h3>
        <p>Client requests a pre-signed PUT, uploads to the blob store, then posts the key to the API. Thumbnails are generated by workers (queue), stored as sibling objects, served from a CDN. The review row holds URLs, never bytes. This is YouTube's upload path at photograph scale.</p>

        <h3 class="lesson-subhead" id="ye-arch">High-level architecture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Yelp high level architecture">
            <defs>
              <marker id="ah-ye4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="24" width="90" height="36" rx="6" />
            <text class="dg-s" x="61" y="46" text-anchor="middle">client</text>
            <rect class="dg-box b" x="124" y="24" width="90" height="36" rx="6" />
            <text class="dg-s" x="169" y="46" text-anchor="middle">API</text>
            <rect class="dg-box c" x="232" y="24" width="110" height="36" rx="6" />
            <text class="dg-s" x="287" y="46" text-anchor="middle">geo index</text>
            <rect class="dg-box y" x="360" y="24" width="110" height="36" rx="6" />
            <text class="dg-s" x="415" y="46" text-anchor="middle">listings</text>
            <rect class="dg-box o" x="488" y="24" width="100" height="36" rx="6" />
            <text class="dg-s" x="538" y="46" text-anchor="middle">reviews</text>
            <rect class="dg-box g" x="606" y="24" width="98" height="36" rx="6" />
            <text class="dg-s" x="655" y="46" text-anchor="middle">CDN</text>
            <rect class="dg-box p" x="232" y="84" width="110" height="36" rx="6" />
            <text class="dg-s" x="287" y="106" text-anchor="middle">search</text>
            <rect class="dg-box l" x="360" y="84" width="110" height="36" rx="6" />
            <text class="dg-s" x="415" y="106" text-anchor="middle">score jobs</text>
            <rect class="dg-box r" x="488" y="84" width="100" height="36" rx="6" />
            <text class="dg-s" x="538" y="106" text-anchor="middle">blobs</text>
            <path class="dg-line hot" d="M106 42 H120" marker-end="url(#ah-ye4)" />
            <path class="dg-line hot" d="M214 42 H228" marker-end="url(#ah-ye4)" />
            <text class="dg-s" x="16" y="148">Reviews shard by business_id so a page is one partition. Geo index holds only ids and thin fields.</text>
          </svg>
          <figcaption>Figure 4 — Listings, reviews, geo and blobs are four stores on purpose.</figcaption>
        </figure>
      `,
    },
    {
      id: 'considerations',
      title: 'Design Considerations of Yelp',
      children: [
        { id: 'ye-cache', title: 'Caching cells, not users' },
        { id: 'ye-abuse', title: 'Fake reviews and photos' },
        { id: 'ye-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ye-cache">Caching cells, not users</h3>
        <p>Anonymous nearby for "restaurants in cell X" is a shared cache key. Personalisation is a rerank of that shared candidate list. Caching per-user nearby results will not hit. Caching cell+category will.</p>
        <p>Business pages of famous restaurants are CDN-cacheable for anonymous users, with a small authenticated overlay.</p>

        <h3 class="lesson-subhead" id="ye-abuse">Fake reviews and photos</h3>
        <p>Ranking that trusts raw stars is a product that can be bought. Keep a trust score on accounts, delay the effect of new accounts on <code>avg_score</code>, and run photos through a duplicate detector so the same plate is not ten "unique" reviews. This is a scoring input, not a separate moral chapter — mention it or the interviewer will.</p>

        <h3 class="lesson-subhead" id="ye-eval">Evaluation</h3>
        <p>Geohash covering gets clumsy for long, thin queries (a beach strip). S2 would be cleaner; we traded simplicity. Precomputed scores lag, so a restaurant that just got food-poisoning reviews still ranks well for a minute — maybe too long. We have no inventory of tables, so "nearby" cannot mean "you can sit down now". The maps chapter's live data would help and we did not integrate it.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) What lives in the geo index, and what must not? (2) Why Bayesian-average stars? (3) Sketch the photo upload path. (4) Why cache by cell instead of by user?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Local search, geospatial indexes and review ranking are standard industry ideas; the explanations, diagrams, tables and exercises are our own.',
};
