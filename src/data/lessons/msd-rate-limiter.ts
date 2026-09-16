/** Modern System Design — Chapter 19: Design a Rate Limiter. */

export const msdRateLimiter = {
  slug: 'rate-limiter',
  title: 'Design a Rate Limiter',
  subtitle:
    'A rate limiter is how a system says no — to abuse, to noisy neighbours, and to its own retry loops. The interesting parts are the algorithm (especially the fixed-window boundary burst), the distributed counter, and whether you fail open or closed when the limiter itself is sick.',
  byline: 'Modern System Design · Chapter 19 · ~1h 50m read · Intermediate',
  interviewTip:
    'Name the algorithm and the key. "Token bucket, 100 requests per minute per API key with a burst of 20, enforced at the gateway, Redis INCR/EXPIRE under the hood, fail-open for anonymous reads and fail-closed for login" is a complete answer. Then mention the fixed-window 2x burst so the interviewer knows you have seen it, and the 429 + Retry-After headers so they know you have built an API. Candidates who only say "we will rate-limit" have not started.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: The Rate Limiter',
      children: [
        { id: 'rl-why', title: 'Why rate limiting exists' },
        { id: 'rl-shed', title: 'Rate limiting versus load shedding' },
        { id: 'rl-where', title: 'Where it sits' },
      ],
      html: `
        <p>Every public API is a scarce resource wearing an infinite URL. Without a limiter, capacity is allocated by who can open the most sockets. That is not a product policy. It is a race. This chapter designs the policy: a named key, a budget, a 429 when the budget is gone, and a failure mode for when the limiter itself is sick.</p>

        <h3 class="lesson-subhead" id="rl-why">Why rate limiting exists</h3>
        <p>Capacity is finite. A rate limiter allocates it on purpose instead of by accident. The jobs, in order of how often they save you:</p>
        <ul class="lesson-layers">
          <li><strong>Protect the fleet.</strong> One customer, one bug, or one scraper should not take everyone else down.</li>
          <li><strong>Fairness.</strong> Tenants share a system; limits are how you sell "up to N/minute" as a product.</li>
          <li><strong>Abuse.</strong> Credential stuffing, card testing, SMS-pumping, scraping. Login and anything that costs money get the strictest limits.</li>
          <li><strong>Cost control.</strong> LLM tokens, SMS, third-party APIs — unbounded callers become unbounded bills.</li>
          <li><strong>Retry storms.</strong> <a href="/learn/modern-system-design/non-functional">Chapter 4</a>'s retry rule is a client behaviour; a limiter is how you survive clients that did not read it.</li>
        </ul>
        <p>The key is not always "user". Login might be IP plus username, because the attacker does not have a user id yet. A tenant might be a company id so one noisy customer cannot starve the others. A route might be part of the key so <code>/search</code> is tighter than <code>/health</code>. Naming the key is half the design.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Four reasons to rate limit: capacity, fairness, abuse and cost">
            <defs>
              <marker id="ah-rl1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="24" width="160" height="56" rx="7" />
            <text class="dg-t" x="96" y="46" text-anchor="middle">capacity</text>
            <text class="dg-s" x="96" y="64" text-anchor="middle">protect the fleet</text>
            <rect class="dg-box g" x="192" y="24" width="160" height="56" rx="7" />
            <text class="dg-t" x="272" y="46" text-anchor="middle">fairness</text>
            <text class="dg-s" x="272" y="64" text-anchor="middle">per tenant budget</text>
            <rect class="dg-box r" x="368" y="24" width="160" height="56" rx="7" />
            <text class="dg-t" x="448" y="46" text-anchor="middle">abuse</text>
            <text class="dg-s" x="448" y="64" text-anchor="middle">login, OTP, cards</text>
            <rect class="dg-box y" x="544" y="24" width="160" height="56" rx="7" />
            <text class="dg-t" x="624" y="46" text-anchor="middle">cost</text>
            <text class="dg-s" x="624" y="64" text-anchor="middle">SMS, LLM tokens</text>
            <text class="dg-s" x="16" y="108">The algorithm is how you count. The key is who you count.</text>
            <text class="dg-s" x="16" y="126">Wrong key: a NAT of 500 users shares one budget.</text>
            <text class="dg-s" x="16" y="144">Wrong algorithm: you still 2x the rate at a window edge.</text>
            <path class="dg-line blue" d="M176 52 H188" marker-end="url(#ah-rl1)" />
            <path class="dg-line blue" d="M352 52 H364" marker-end="url(#ah-rl1)" />
            <path class="dg-line blue" d="M528 52 H540" marker-end="url(#ah-rl1)" />
          </svg>
          <figcaption>Figure 1 — Four jobs, one mechanism. Name which job this limiter is for before you name Redis.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rl-shed">Rate limiting versus load shedding</h3>
        <p>Rate limiting is a <em>policy per key</em> in normal operation: user 42 may call 100 times a minute. Load shedding is what you do when the whole system is already on fire: drop 503s for anonymous browse, keep checkout, ignore that user 42 is still inside quota. A limiter that is the only defence will happily allow every well-behaved user into a dying database.</p>
        <p>You want both. The limiter shapes the everyday mix. Shedding is the circuit breaker when p99 latency or queue depth crosses a line. Do not implement shedding as "tighten everyone's limit to 1" unless you like a thundering herd when you loosen it.</p>
        <div class="lesson-callout"><strong>A 429 is a contract; a 503 is an apology.</strong> 429 says "you exceeded your budget, here is Retry-After." 503 says "we cannot take this, try later." Mixing them trains clients to retry 429s as if the fleet were sick, which is how a fair limiter becomes a retry storm.</div>

        <h3 class="lesson-subhead" id="rl-where">Where it sits</h3>
        <p>The right default is the edge / API gateway: one place, before application CPU is spent, visible as 429s. Per-service limiters catch internal fan-out the gateway never sees. Client-side limiters are courtesy, not enforcement. Database-level limits are a last line for queries that slipped through.</p>
        <p>Put the limiter as far left as you still have the key. IP is available at L4. User id is available after auth. If you limit login by user id, you have already paid for the password check. Limit login by IP and username hash at the edge; limit authenticated search by user id after the JWT is valid.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Limiter at the gateway before application servers">
            <defs>
              <marker id="ah-rl2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="44" width="88" height="44" rx="7" />
            <text class="dg-s" x="60" y="70" text-anchor="middle">client</text>
            <rect class="dg-box b" x="148" y="36" width="160" height="60" rx="7" />
            <text class="dg-s" x="228" y="60" text-anchor="middle">gateway limiter</text>
            <text class="dg-s" x="228" y="76" text-anchor="middle">429 or pass</text>
            <rect class="dg-box g" x="360" y="44" width="140" height="44" rx="7" />
            <text class="dg-s" x="430" y="70" text-anchor="middle">app CPU</text>
            <rect class="dg-box o" x="548" y="44" width="152" height="44" rx="7" />
            <text class="dg-s" x="624" y="70" text-anchor="middle">datastore</text>
            <path class="dg-line violet" d="M104 66 H144" marker-end="url(#ah-rl2)" />
            <path class="dg-line violet" d="M308 66 H356" marker-end="url(#ah-rl2)" />
            <path class="dg-line violet" d="M500 66 H544" marker-end="url(#ah-rl2)" />
          </svg>
          <figcaption>Figure 2 — Enforce before you spend CPU. A limiter behind the expensive handler is a comment, not a defence.</figcaption>
        </figure>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of a Rate Limiter's Design",
      children: [
        { id: 'rl-req', title: 'The questions that decide the design' },
        { id: 'rl-est', title: 'Estimation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="rl-req">The questions that decide the design</h3>
        <table>
          <thead><tr><th>Question</th><th>Typical answer</th></tr></thead>
          <tbody>
            <tr><td>What is the key?</td><td>API key, user id, IP+route, tenant</td></tr>
            <tr><td>What is the budget?</td><td>100/min sustained, burst 20</td></tr>
            <tr><td>Where enforced?</td><td>Edge gateway + a few hot services</td></tr>
            <tr><td>How accurate?</td><td>Slight over-allow is fine; under-allow annoys</td></tr>
            <tr><td>Fail open or closed?</td><td>Reads open, login/payments closed</td></tr>
            <tr><td>Response?</td><td>HTTP 429, Retry-After, remaining headers</td></tr>
          </tbody>
        </table>
        <p>Functional: decide allow/deny per request in a few milliseconds, expose remaining quota, support different limits per route and per plan. Non-functional: the limiter's p99 must be far below the API's; an extra 20 ms Redis RTT is acceptable, an extra 200 ms is not. Availability of the limiter is a product choice, not a slogan — see fail-open versus fail-closed below.</p>

        <h3 class="lesson-subhead" id="rl-est">Estimation</h3>
        <pre><code>50k API QPS at the edge
each request: one INCR on a Redis key  (or local token refill)
50k INCR/s is comfortable on a Redis primary if keys are hot;
  shard by hash of the limit key if one key is 10k QPS

memory: 5 million active keys × 64 B ≈ 320 MB
  plus TTL so yesterday's IPs expire

decision budget: &lt; 5 ms p99 including network
if Redis is in another AZ, that budget is already gone</code></pre>
        <p>The estimate says the limiter is a small, hot, in-memory counter problem, not a database problem. Putting the counter in Postgres serialises the whole API on row locks. Putting it only in each gateway process under-counts by the replica factor unless you accept that error. If you do accept it, say the error bar: eight replicas means the true rate can be 8× the local cap. That is a design, not an accident, and it is usually the wrong design for login.</p>
      `,
    },
    {
      id: 'design',
      title: 'Design of a Rate Limiter',
      children: [
        { id: 'rl-arch', title: 'The architecture' },
        { id: 'rl-dist', title: 'The distributed-counter problem' },
        { id: 'rl-fail', title: 'Fail open, fail closed, and headers' },
      ],
      html: `
        <h3 class="lesson-subhead" id="rl-arch">The architecture</h3>
        <p>Gateway receives the request, extracts the key, asks a limiter service (or an embedded library talking to Redis), and either proxies or returns 429. Configuration of limits lives in a control plane (plan → route → numbers) and is cached at the gateway so a config DB blip does not open the floodgates or freeze traffic, depending on your fail mode.</p>
        <p>Local in-process token buckets are fast and wrong across replicas: 8 gateways × 100/min = 800/min. Use them as a first-stage coarse filter (protect Redis) plus a central counter for the real budget. That two-layer pattern is how large CDNs do it. The local layer should be a fraction of the global budget, refreshed from Redis, so Redis loss degrades to a coarser cap rather than to infinity or to zero — unless the route is fail-closed.</p>

        <h3 class="lesson-subhead" id="rl-dist">The distributed-counter problem</h3>
        <p>The canonical Redis pattern for a fixed window is <code>INCR</code> plus <code>EXPIRE</code> on first increment, atomically in a Lua script so you never leak a key without TTL. The value is the count; compare to N. Sliding and token-bucket need more state (a score set, or tokens+timestamp). Redis Cluster hashes the key; a single viral API key still lands on one hash slot — isolate or shard that key further if one customer is 20% of QPS.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Gateway INCR on Redis then allow or 429">
            <defs>
              <marker id="ah-rl3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="48" width="140" height="52" rx="7" />
            <text class="dg-s" x="86" y="70" text-anchor="middle">gateway</text>
            <text class="dg-s" x="86" y="86" text-anchor="middle">extract key</text>
            <rect class="dg-box o" x="220" y="40" width="200" height="68" rx="7" />
            <text class="dg-s" x="320" y="66" text-anchor="middle">Redis INCR+TTL</text>
            <text class="dg-s" x="320" y="82" text-anchor="middle">Lua for atomicity</text>
            <rect class="dg-box g" x="488" y="20" width="212" height="48" rx="7" />
            <text class="dg-s" x="594" y="48" text-anchor="middle">count &lt; N: proxy</text>
            <rect class="dg-box r" x="488" y="84" width="212" height="48" rx="7" />
            <text class="dg-s" x="594" y="112" text-anchor="middle">else 429 Retry-After</text>
            <path class="dg-line green" d="M156 74 H216" marker-end="url(#ah-rl3)" />
            <path class="dg-line green" d="M420 60 H484" marker-end="url(#ah-rl3)" />
            <path class="dg-line green" d="M420 88 H484" marker-end="url(#ah-rl3)" />
          </svg>
          <figcaption>Figure 3 — The hot path is one round trip. If you need two Redis commands, you will race and leak quota.</figcaption>
        </figure>
        <pre><code>-- sketch: fixed window, one key per apiKey:epochMinute
-- INCR; if == 1 then EXPIRE 60; if value &gt; N then deny
-- token bucket stores tokens and last refill timestamp instead</code></pre>

        <h3 class="lesson-subhead" id="rl-fail">Fail open, fail closed, and headers</h3>
        <p>When Redis times out: fail open means the request proceeds (availability over strict quota). Fail closed means 429 or 503 (safety over availability). Login, OTP, card testing, and anything that spends money fail closed. Public read APIs often fail open for a short TTL, with a local emergency cap so a Redis outage is not an unbounded scrape. Log the fail-open so you can see the hole.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Fail open on reads versus fail closed on login">
            <rect class="dg-band g" x="12" y="16" width="344" height="124" rx="10" />
            <text class="dg-h" x="26" y="36">FAIL OPEN</text>
            <text class="dg-s" x="26" y="58">Redis timeout on GET /feed</text>
            <text class="dg-s" x="26" y="76">serve the read, local cap still</text>
            <text class="dg-s" x="26" y="94">quota may be exceeded briefly</text>
            <text class="dg-s" x="26" y="112">better than a site-wide 429</text>
            <rect class="dg-band r" x="368" y="16" width="340" height="124" rx="10" />
            <text class="dg-h" x="382" y="36">FAIL CLOSED</text>
            <text class="dg-s" x="382" y="58">Redis timeout on POST /login</text>
            <text class="dg-s" x="382" y="76">deny: stuffing would feast</text>
            <text class="dg-s" x="382" y="94">user retries after Retry-After</text>
            <text class="dg-s" x="382" y="112">availability of auth is not free</text>
          </svg>
          <figcaption>Figure 4 — The failure mode is part of the product. One global "fail open" is how credential stuffing wins.</figcaption>
        </figure>
        <p>On deny: HTTP 429, <code>Retry-After</code> in seconds, and optionally <code>X-RateLimit-Limit</code>, <code>Remaining</code>, <code>Reset</code>. Clients that honour Retry-After are cheaper than clients that retry immediately. Document that 429 is not 503.</p>
      `,
    },
    {
      id: 'algo',
      title: 'Rate Limiter Algorithms',
      children: [
        { id: 'rl-fixed', title: 'Fixed window, and the boundary burst' },
        { id: 'rl-sliding', title: 'Sliding log and sliding counter' },
        { id: 'rl-bucket', title: 'Token bucket and leaky bucket' },
        { id: 'rl-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="rl-fixed">Fixed window, and the boundary burst</h3>
        <p>Count requests in [T, T+W). Cheap: one integer. The bug: a client can fire N at the end of window 1 and N at the start of window 2 — 2N in an arbitrarily short interval. If N was sized for fleet safety, you just doubled the allowed spike. This is the algorithm interviewers use to see if you have operated a limiter.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Fixed window allowing a double burst at the boundary">
            <rect class="dg-box b" x="16" y="28" width="320" height="56" rx="7" />
            <text class="dg-s" x="176" y="50" text-anchor="middle">window 1: N at t=59s</text>
            <text class="dg-s" x="176" y="66" text-anchor="middle">counter resets at 60s</text>
            <rect class="dg-box b" x="384" y="28" width="320" height="56" rx="7" />
            <text class="dg-s" x="544" y="50" text-anchor="middle">window 2: N at t=60s</text>
            <text class="dg-s" x="544" y="66" text-anchor="middle">2N in one second</text>
            <rect class="dg-band r" x="16" y="100" width="688" height="40" rx="8" />
            <text class="dg-s" x="360" y="124" text-anchor="middle">fleet sized for N now sees 2N — the boundary burst</text>
          </svg>
          <figcaption>Figure 5 — Fixed windows are fine for coarse fairness. They are a lie if N is a hard safety cap.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rl-sliding">Sliding log and sliding counter</h3>
        <p>Sliding log stores timestamps and drops those older than W; accurate, memory O(N) per key, painful at high QPS. Sliding counter (or sliding window log approximation) keeps the previous window's count and weights it by overlap: count ≈ prev*(1-elapsed/W) + curr. Cheap, close enough, still not a hard cap. Redis sorted sets implement the log; two integers implement the approximation.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Sliding window overlapping previous and current counts">
            <rect class="dg-box o" x="16" y="36" width="280" height="56" rx="7" />
            <text class="dg-s" x="156" y="58" text-anchor="middle">prev window 80 hits</text>
            <text class="dg-s" x="156" y="74" text-anchor="middle">40% still in W</text>
            <rect class="dg-box g" x="332" y="36" width="180" height="56" rx="7" />
            <text class="dg-s" x="422" y="68" text-anchor="middle">curr 20</text>
            <rect class="dg-box y" x="548" y="36" width="156" height="56" rx="7" />
            <text class="dg-s" x="626" y="58" text-anchor="middle">approx 52</text>
            <text class="dg-s" x="626" y="74" text-anchor="middle">0.4*80+20</text>
          </svg>
          <figcaption>Figure 6 — Sliding counters kill the 2x burst without storing every timestamp.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rl-bucket">Token bucket and leaky bucket</h3>
        <p>Token bucket: tokens refill at rate r, bucket holds at most b. A request costs one token (or N tokens for an expensive call). Burst up to b, then sustained r. This matches how APIs are sold. Leaky bucket: queue or counter drains at r; bursts are smoothed, excess dropped or delayed. Leaky is better as a traffic shaper; token is better as a user-facing quota. They are duals; do not spend the interview proving it. Pick token bucket with explicit burst unless the prompt is "smooth this firehose into Kafka".</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Token bucket refill versus leaky bucket drain">
            <rect class="dg-band y" x="12" y="16" width="344" height="124" rx="10" />
            <text class="dg-h" x="26" y="36">TOKEN BUCKET</text>
            <text class="dg-s" x="26" y="58">refill r, cap burst b</text>
            <text class="dg-s" x="26" y="76">request takes a token</text>
            <text class="dg-s" x="26" y="94">idle users bank a burst</text>
            <text class="dg-s" x="26" y="112">usual public API choice</text>
            <rect class="dg-band c" x="368" y="16" width="340" height="124" rx="10" />
            <text class="dg-h" x="382" y="36">LEAKY BUCKET</text>
            <text class="dg-s" x="382" y="58">drain at r, queue or drop</text>
            <text class="dg-s" x="382" y="76">smooths spikes into a line</text>
            <text class="dg-s" x="382" y="94">good in front of a queue</text>
            <text class="dg-s" x="382" y="112">feels like delay, not quota</text>
          </svg>
          <figcaption>Figure 7 — Same rate r, different burst behaviour. Name burst b in the interview or the design is incomplete.</figcaption>
        </figure>
        <table>
          <thead><tr><th>Algorithm</th><th>Burst</th><th>Cost</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Fixed window</td><td>up to 2N at edge</td><td>one counter</td><td>coarse, internal</td></tr>
            <tr><td>Sliding approx</td><td>near N</td><td>two counters</td><td>good default</td></tr>
            <tr><td>Token bucket</td><td>explicit b</td><td>tokens+time</td><td>public APIs</td></tr>
            <tr><td>Leaky bucket</td><td>smoothed</td><td>queue/rate</td><td>shaping into a sink</td></tr>
          </tbody>
        </table>

        <p>Weighted tokens: a search call might cost 5, a health check 0, an LLM completion 50. The bucket still works if you refill in the same units. What fails is pretending every HTTP request is equal while your bill is not.</p>
        <p>Distributed consistency of the count is usually "Redis is the authority". If you need two regions, pin the key to a region or accept over-allow of about the replica factor. Trying to synchronously INCR across oceans will make the limiter slower than the API it protects.</p>
        <p>Hot keys: a partner integration that is 30% of QPS needs its own shard or a local limiter plus a sampled central check. One Redis hash slot should not be the company's availability.</p>
        <p>IPv6 and IPv4 dual addresses, plus mobile carrier NAT, make IP keys unfair. Prefer authenticated keys after login, and treat IP as a coarse pre-auth cap only.</p>
        <p>Allow-lists for first-party jobs (your own indexer, your own pager) must not share the public bucket. Put them on a different key or they will 429 the on-call.</p>
        <p>Document the units: per minute versus per second, per user versus per tenant. Ambiguous SLAs are how enterprise tickets start.</p>
        <p>Shadow mode: log would-deny without denying, for a week, before enforcing a new limit. You will discover the batch job you forgot.</p>
        <p>Retry-After should be truthful. Lying with 1 second trains aggressive clients. Lying with 3600 loses you the customer. Use remaining window time.</p>
        <p>Health endpoints skip the limiter. Everything else, including "just a HEAD", counts if it costs you.</p>
        <p>Publish limits in the developer docs with the same numbers the gateway uses. Surprise 429s are a support queue, not a design.</p>
        <p>If Redis is multi-tenant, isolate limiter keys from cache keys. An evicted counter looks like a reset budget — a security bug for login.</p>

        <h3 class="lesson-subhead" id="rl-eval">Evaluation</h3>
        <p>This design enforces a policy cheaply and fails in known ways. It does not stop a million new IPs (you need a bot/WAF story). It does not replace load shedding. Clock skew on sliding windows is real if you compute windows on many unsynchronised hosts — compute on Redis time or a single epoch. Multi-region active-active counters will over-allow unless you partition keys by region or accept eventual merge. Distributed INCR is not a financial ledger. Cost-based limits (LLM tokens, SMS) need a different key and a slower, durable counter than a 5 ms Redis hop; mixing them with request-rate keys is how you either leak money or 429 harmless GETs.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Draw the fixed-window 2x burst. (2) Why is INCR+EXPIRE a race if they are not atomic? (3) When do you fail closed? (4) What headers does a 429 carry, and why is it not a 503?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Rate-limiting algorithms and gateway enforcement are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
