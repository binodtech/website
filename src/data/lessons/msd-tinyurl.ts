/** Modern System Design — Chapter 32: Design TinyURL.
 *  A deceptively simple problem whose estimation reveals that the entire mapping
 *  can fit in memory, which completely changes the architecture.
 */

export const msdTinyurl = {
  slug: 'tinyurl',
  title: 'Design TinyURL',
  subtitle:
    'A URL shortener looks like a toy until you do the arithmetic: the entire mapping of a hundred million links fits in a few tens of gigabytes of RAM, which means the interesting questions are not storage or scale but collision, uniqueness, redirects, and what you do about abuse.',
  byline: 'Modern System Design · Chapter 32 · ~50 min read · Beginner',
  interviewTip:
    'The tell of a strong TinyURL answer is finishing the estimate and changing the design because of it. "The mapping is 40 GB after five years, so it fits in memory on a handful of machines, therefore we can serve redirects from a cache-first path with a 301" is the sentence. Candidates who draw a Kafka cluster and a Cassandra ring for this problem have not listened to their own numbers.',
  sections: [
    {
      id: 'design',
      title: 'System Design: TinyURL',
      children: [
        { id: 'tu-problem', title: 'The problem, and why it is a good interview question' },
        { id: 'tu-req', title: 'Requirements' },
        { id: 'tu-est', title: 'Estimation: the numbers that simplify everything' },
        { id: 'tu-api', title: 'API sketch' },
        { id: 'tu-ids', title: 'How short codes are generated' },
        { id: 'tu-arch', title: 'The architecture' },
        { id: 'tu-redirect', title: 'The redirect path, and 301 versus 302' },
        { id: 'tu-custom', title: 'Custom aliases, expiry and analytics' },
        { id: 'tu-eval', title: 'Evaluation and the things people over-design' },
      ],
      html: `
        <p>A URL shortener takes a long URL and returns a short one that redirects to it. That is the entire functional surface, and it is why this is usually the first design problem people practise — and why it is a surprisingly good interview, because everything that looks like it might be complicated collapses under arithmetic, leaving only a handful of genuine decisions.</p>

        <h3 class="lesson-subhead" id="tu-problem">The problem, and why it is a good interview question</h3>
        <p>The product is familiar: you paste <code>https://example.com/very/long/path?with=query</code> and get back <code>https://short.ly/aB3xK9</code>. Anyone who follows the short link is redirected to the original. Variants exist — custom aliases, expiry dates, click analytics — but the core is a mapping from a short code to a long URL, plus a very fast lookup on that mapping.</p>
        <p>It is a good interview because it is small enough to finish, and because it tests whether you let numbers change your mind. Candidates who skip estimation usually over-design it; candidates who estimate first usually under-design it, which is the rarer and more useful error.</p>

        <h3 class="lesson-subhead" id="tu-req">Requirements</h3>
        <table>
          <thead><tr><th></th><th>Requirement</th></tr></thead>
          <tbody>
            <tr><td><strong>Functional</strong></td><td>Create a short URL for a long one; redirect; optional custom alias; optional expiry; optional per-link click counts</td></tr>
            <tr><td><strong>Write QPS</strong></td><td>100 million new links/month ≈ 40 writes/sec average, ~200 at peak</td></tr>
            <tr><td><strong>Read QPS</strong></td><td>Assume 100 clicks per link over its life, heavily front-loaded → ~10k redirects/sec peak</td></tr>
            <tr><td><strong>Read:write</strong></td><td>~50–100:1, so this is a cache problem, not a write problem</td></tr>
            <tr><td><strong>Latency</strong></td><td>Redirect p99 &lt; 20 ms. Create can take 100 ms without anyone noticing</td></tr>
            <tr><td><strong>Availability</strong></td><td>99.99% on the redirect path (a failed redirect is a broken link on the public internet)</td></tr>
            <tr><td><strong>Durability</strong></td><td>Links must not vanish. A 404 on a shortened URL that was printed in a book is unrecoverable</td></tr>
            <tr><td><strong>Uniqueness</strong></td><td>Two long URLs may share a short code only if we decide they should (usually they should not, because analytics attach to the short code)</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="tu-est">Estimation: the numbers that simplify everything</h3>
        <pre><code>NEW LINKS
  100M / month
  x 12 = 1.2B / year
  x 5 years = 6B links

SHORT CODE
  62-character alphabet (A-Z a-z 0-9)
  6 characters → 62^6 ≈ 56 billion codes   <- 10x our 5-year volume, comfortable
  7 characters → 3.5 trillion              <- if we ever need it

STORAGE PER ROW
  short code   7 bytes
  long URL     ~100 bytes (average; some are much longer)
  created_at, expiry, user_id, flags
               ~50 bytes
  total        ~160 bytes  -> round to 200 bytes with indexes

TOTAL STORAGE
  6B x 200 B = 1.2 TB after five years
  of which the hot mapping (code → URL) is:
  6B x 110 B ≈ 660 GB of payload, plus indexes

MEMORY
  If 20% of links get 80% of clicks (Chapter 5's 80/20):
  0.2 x 6B x 110 B ≈ 130 GB of hot mappings
  Across a 3-replica cache cluster this is ~45 GB per node
  -> the working set fits in RAM. Redirects do not have to hit disk.</code></pre>
        <p>This is the moment the design changes. 40 writes a second is a laptop. 10,000 reads a second of 110-byte values is a small cache cluster. There is no partitioning crisis, no queue, no blob store. The interesting remaining questions are uniqueness of codes, the redirect semantics, and abuse.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 186" role="img" aria-label="How TinyURL estimates collapse most of the architecture into a cache-backed key-value lookup">
            <defs>
              <marker id="ah-tu1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHAT THE NUMBERS PERMIT YOU TO DROP</text>
            <rect class="dg-box r" x="16" y="32" width="220" height="70" rx="8" />
            <text class="dg-t" x="126" y="52" text-anchor="middle">NOT NEEDED</text>
            <text class="dg-s" x="126" y="70" text-anchor="middle">sharding, queues, blob store,</text>
            <text class="dg-s" x="126" y="86" text-anchor="middle">CDN, search, sequencer fleet</text>
            <rect class="dg-box g" x="268" y="32" width="220" height="70" rx="8" />
            <text class="dg-t" x="378" y="52" text-anchor="middle">NEEDED</text>
            <text class="dg-s" x="378" y="70" text-anchor="middle">KV / SQL store, a cache,</text>
            <text class="dg-s" x="378" y="86" text-anchor="middle">a unique-code generator</text>
            <rect class="dg-box y" x="520" y="32" width="184" height="70" rx="8" />
            <text class="dg-t" x="612" y="52" text-anchor="middle">NEEDED LATER</text>
            <text class="dg-s" x="612" y="70" text-anchor="middle">analytics pipeline,</text>
            <text class="dg-s" x="612" y="86" text-anchor="middle">rate limiter, abuse checks</text>
            <rect class="dg-band g" x="12" y="118" width="696" height="60" rx="10" />
            <text class="dg-s" x="26" y="140">The skill this problem tests is subtraction. A design with fewer boxes that you can defend with numbers beats a</text>
            <text class="dg-s" x="26" y="156">design that dutifully includes every building block from Chapter 6. Interviewers are specifically watching for this.</text>
            <text class="dg-s" x="26" y="172">If you cannot say why a box is absent, you do not yet understand the problem.</text>
          </svg>
          <figcaption>Figure 1 — TinyURL as a subtraction exercise. Most of the course's building blocks have no job here.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tu-api">API sketch</h3>
        <pre><code>POST /api/v1/links
  body: { url, customAlias?, expiresAt? }
  auth: API key or session
  -> 201 { shortCode, shortUrl }
  -> 409 if customAlias already taken
  -> 400 if url fails validation (scheme, length, blocked domain)

GET  /{shortCode}
  -> 301 Location: {originalUrl}          # permanent; see below
  or 302 Location: {originalUrl}          # if we need to count every click
  or 404 if unknown / expired

GET  /api/v1/links/{shortCode}
  auth required (owner)
  -> { url, createdAt, expiresAt, clicks }

DELETE /api/v1/links/{shortCode}
  auth required
  -> 204</code></pre>

        <h3 class="lesson-subhead" id="tu-ids">How short codes are generated</h3>
        <p>This is the one design decision with real depth, and it is a smaller version of <a href="/learn/modern-system-design/sequencer">Chapter 12</a>. Three families of approach, with an honest comparison:</p>
        <table>
          <thead><tr><th>Approach</th><th>How</th><th>Pros</th><th>Cons</th></tr></thead>
          <tbody>
            <tr><td><strong>Hash the URL</strong></td><td>MD5/SHA-256, take the first 43 bits, base62-encode to 7 chars</td><td>Deterministic: same URL → same code, which can be a feature</td><td>Collisions exist (birthday paradox at billions of links). Same URL from two users shares analytics. You still need a collision fallback</td></tr>
            <tr><td><strong>Counter + encode</strong></td><td>A unique integer from a sequencer, base62-encoded</td><td>No collisions. Codes are short (a 6-char code covers 56B). Trivial</td><td>Codes are enumerable, so people can scrape the entire space. Counter is a single point of failure unless designed as in Ch 12</td></tr>
            <tr><td><strong>Random generation</strong></td><td>Draw 6–7 random chars, insert, retry on collision</td><td>Not enumerable. No sequencer to run. Simple</td><td>Retry loop (vanishingly rare at 6 chars / 56B space). Not deterministic</td></tr>
          </tbody>
        </table>
        <p>The production default is usually <strong>random generation with a uniqueness constraint in the store</strong>, plus a reserved namespace for custom aliases. Hashing is tempting and usually a mistake: you do not actually want two users shortening the same article to share a short code, because then you cannot attribute clicks, cannot expire one without the other, and cannot let one of them pick a custom alias later.</p>
        <p>If you do use a counter, do not expose it as a sequential integer in the URL — permute it (a simple modular multiply with an odd constant, or a Feistel) so the public codes are not an invitation to scrape. This is the same "opaque external ID, sequential internal ID" split from Chapter 12.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 194" role="img" aria-label="Random short-code generation with a uniqueness check and a retry on the rare collision">
            <defs>
              <marker id="ah-tu2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">CREATE PATH · RANDOM CODE WITH A UNIQUENESS CONSTRAINT</text>
            <rect class="dg-box b" x="16" y="34" width="120" height="40" rx="7" />
            <text class="dg-s" x="76" y="52" text-anchor="middle">validate URL</text>
            <text class="dg-s" x="76" y="66" text-anchor="middle">scheme, length, denylist</text>
            <rect class="dg-box c" x="156" y="34" width="120" height="40" rx="7" />
            <text class="dg-s" x="216" y="52" text-anchor="middle">draw 7 chars</text>
            <text class="dg-s" x="216" y="66" text-anchor="middle">from [A-Za-z0-9]</text>
            <rect class="dg-box y" x="296" y="34" width="140" height="40" rx="7" />
            <text class="dg-s" x="366" y="52" text-anchor="middle">INSERT … ON CONFLICT</text>
            <text class="dg-s" x="366" y="66" text-anchor="middle">unique(short_code)</text>
            <rect class="dg-box g" x="456" y="34" width="120" height="40" rx="7" />
            <text class="dg-s" x="516" y="52" text-anchor="middle">success</text>
            <text class="dg-s" x="516" y="66" text-anchor="middle">return short URL</text>
            <rect class="dg-box r" x="596" y="34" width="108" height="40" rx="7" />
            <text class="dg-s" x="650" y="52" text-anchor="middle">conflict</text>
            <text class="dg-s" x="650" y="66" text-anchor="middle">draw again</text>
            <path class="dg-line violet" d="M136 54 H152" marker-end="url(#ah-tu2)" />
            <path class="dg-line violet" d="M276 54 H292" marker-end="url(#ah-tu2)" />
            <path class="dg-line violet" d="M436 54 H452" marker-end="url(#ah-tu2)" />
            <path class="dg-line rose" d="M436 54 H444 V96 H650 V78" marker-end="url(#ah-tu2)" />
            <rect class="dg-band g" x="12" y="122" width="696" height="64" rx="10" />
            <text class="dg-s" x="26" y="142">Collision probability at 6B codes in a 3.5-trillion space is negligible — you will retry on conflict far more often because a</text>
            <text class="dg-s" x="26" y="158">custom alias was taken than because random generation clashed. The unique constraint is still required, because "almost</text>
            <text class="dg-s" x="26" y="174">never" is not the same as "impossible", and two links sharing a code is a data-corruption bug, not a retry.</text>
          </svg>
          <figcaption>Figure 2 — Code generation. The uniqueness constraint in the database is the source of truth; the generator is allowed to be naive because conflicts are handled, not prevented.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="tu-arch">The architecture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 248" role="img" aria-label="TinyURL architecture with a write path through the API and a read path served from cache">
            <defs>
              <marker id="ah-tu3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tu4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-tu5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WRITE PATH · 40 QPS, UNINTERESTING</text>
            <rect class="dg-box o" x="16" y="32" width="100" height="32" rx="6" />
            <text class="dg-s" x="66" y="52" text-anchor="middle">client</text>
            <rect class="dg-box r" x="136" y="32" width="100" height="32" rx="6" />
            <text class="dg-s" x="186" y="52" text-anchor="middle">rate limiter</text>
            <rect class="dg-box b" x="256" y="32" width="100" height="32" rx="6" />
            <text class="dg-s" x="306" y="52" text-anchor="middle">API servers</text>
            <rect class="dg-box p" x="376" y="32" width="140" height="32" rx="6" />
            <text class="dg-s" x="446" y="52" text-anchor="middle">primary DB (unique codes)</text>
            <rect class="dg-box g" x="536" y="32" width="168" height="32" rx="6" />
            <text class="dg-s" x="620" y="52" text-anchor="middle">cache populate on write</text>
            <path class="dg-line hot" d="M116 48 H132" marker-end="url(#ah-tu5)" />
            <path class="dg-line blue" d="M236 48 H252" marker-end="url(#ah-tu3)" />
            <path class="dg-line blue" d="M356 48 H372" marker-end="url(#ah-tu3)" />
            <path class="dg-line green" d="M516 48 H532" marker-end="url(#ah-tu4)" />

            <text class="dg-h" x="16" y="96">READ PATH · 10k QPS, THIS IS THE PRODUCT</text>
            <rect class="dg-box o" x="16" y="106" width="100" height="32" rx="6" />
            <text class="dg-s" x="66" y="126" text-anchor="middle">browser</text>
            <rect class="dg-box b" x="136" y="106" width="100" height="32" rx="6" />
            <text class="dg-s" x="186" y="126" text-anchor="middle">edge / LB</text>
            <rect class="dg-box g" x="256" y="106" width="140" height="32" rx="6" />
            <text class="dg-s" x="326" y="126" text-anchor="middle">cache (code → URL)</text>
            <rect class="dg-box p" x="416" y="106" width="140" height="32" rx="6" />
            <text class="dg-s" x="486" y="126" text-anchor="middle">DB on miss only</text>
            <rect class="dg-box c" x="576" y="106" width="128" height="32" rx="6" />
            <text class="dg-s" x="640" y="126" text-anchor="middle">301 to long URL</text>
            <path class="dg-line green" d="M116 122 H132" marker-end="url(#ah-tu4)" />
            <path class="dg-line green" d="M236 122 H252" marker-end="url(#ah-tu4)" />
            <path class="dg-line green dash" d="M396 122 H412" marker-end="url(#ah-tu4)" />
            <path class="dg-line green" d="M556 122 H572" marker-end="url(#ah-tu4)" />

            <rect class="dg-band y" x="12" y="156" width="696" height="84" rx="10" />
            <text class="dg-h" x="26" y="176">TWO DETAILS THAT MATTER MORE THAN THE BOXES</text>
            <text class="dg-s" x="26" y="196">· Put the rate limiter on the write path. Creating links is where abuse lives (spam, phishing, malware). Redirects of existing</text>
            <text class="dg-s" x="26" y="212">  links should be cheap and mostly unauthenticated — that is the public contract of a short URL.</text>
            <text class="dg-s" x="26" y="228">· Cache misses must be cheap too: a 404 for an unknown code is itself cacheable, otherwise scanners will DDoS the database.</text>
          </svg>
          <figcaption>Figure 3 — Two paths. The write path is where you spend design effort on uniqueness and abuse; the read path is a cache lookup and an HTTP redirect.</figcaption>
        </figure>
        <p>For the store itself, a relational database with a unique index on <code>short_code</code> is the correct default: 40 writes/sec and 1 TB in five years is well inside what one primary plus replicas handles. A key-value store is a fine alternative if you already operate one. Do not introduce a new storage system for this.</p>

        <h3 class="lesson-subhead" id="tu-redirect">The redirect path, and 301 versus 302</h3>
        <p>This is the question that separates people who have operated a shortener from people who have only drawn one. A <strong>301 Moved Permanently</strong> tells the browser (and every intermediary) it can cache the mapping forever and never ask you again. A <strong>302 Found</strong> tells them to come back next time.</p>
        <ul class="lesson-layers">
          <li><strong>301</strong> is faster for the user, cheaper for you, and means you will never see most of the clicks. Analytics become a sample, not a census. You also cannot change the destination later — caches will serve the old one.</li>
          <li><strong>302</strong> lets you count every click, expire links, and retarget. It costs you a request per click, forever.</li>
        </ul>
        <p>A reasonable production answer: 301 for links with no analytics and no expiry, 302 otherwise. If you must count clicks under 301, do it on a sampled beacon or on the first hop only, and accept that the number is approximate — which, per Chapter 24, is the correct posture for a counter of this kind.</p>

        <h3 class="lesson-subhead" id="tu-custom">Custom aliases, expiry and analytics</h3>
        <p><strong>Custom aliases</strong> are just short codes the user chose, inserted into the same unique index. Validate length, charset, and a denylist of reserved words (<code>api</code>, <code>health</code>, <code>login</code>, and anything offensive or deceptive). Rate-limit alias creation harder than random creation, because the interesting aliases are a scarce namespace and a squatting target.</p>
        <p><strong>Expiry</strong> is a column and a cache TTL. Do not run a sweeping delete job that walks the whole table; expire lazily on read (if <code>now &gt; expires_at</code>, 404 and delete) and have a low-priority cleaner for rows nobody reads. Lazy expiry is cheaper and has no impact on the read path of live links.</p>
        <p><strong>Analytics</strong> must not be on the redirect path. Fire a click event onto a queue and aggregate asynchronously, exactly as view counts were handled in the YouTube chapter. The redirect's only job is to return a Location header quickly.</p>

        <h3 class="lesson-subhead" id="tu-eval">Evaluation and the things people over-design</h3>
        <p>The honest weaknesses of this design:</p>
        <ul>
          <li><strong>Enumerable codes</strong> (if you used a counter without permutation) invite scraping and let attackers walk the entire space looking for sensitive destinations. Random codes plus rate limiting on 404s are the mitigation.</li>
          <li><strong>Phishing and malware</strong> are the actual operational problem, not scale. A shortener hides the destination, which is catnip for attackers. You need a denylist of known-bad domains, a malware-scanning partnership, a rapid takedown path, and the ability to 410 a code across the cache immediately. This is a bigger system than the shortener itself.</li>
          <li><strong>Single-region assumption.</strong> Redirect latency across an ocean is the ~150 ms from Chapter 5, which users feel. A global product wants the cache (at least) in multiple regions, with the database remaining single-primary. DNS or anycast sends users to the nearest cache.</li>
          <li><strong>Analytics under 301</strong> are incomplete by construction. State that trade-off rather than pretending you have both zero-latency cached redirects and a perfect click census.</li>
        </ul>
        <p>And the things this design correctly refuses to include: a message queue on the create path, a CDN for 110-byte redirects, a search index, a blob store, and sharding. If an interviewer pushes you to add them, add them with a number that would force it — "if we were at 50,000 writes/sec I would shard by short-code prefix" — rather than adding them to look complete.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Why does hashing the long URL to produce the short code usually turn out to be a worse idea than it first looks? Why might you choose a 302 over a 301 even though 301 is faster? And what is the one estimate that, if a candidate skipped it, would most reliably send them into over-engineering this problem?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. URL shortening is a standard, widely-taught design exercise; the numbers here are illustrative teaching estimates. All explanations, diagrams, tables and exercises are our own.',
};
