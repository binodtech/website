/** Full lesson: System Design Fundamentals (expanded for beginners) */

export type LessonSection = {
  id: string;
  title: string;
  html: string;
};

export const systemDesignFundamentals = {
  slug: 'fundamentals',
  title: 'System Design Fundamentals',
  subtitle:
    'Core building blocks every senior interview expects — scalability, CAP, caching, load balancing, databases, CDN, and estimation.',
  interviewTip:
    'Start every answer: requirements (functional + non-functional) → estimate scale → high-level diagram → deep dive 2 components → trade-offs. Say aloud: "I\'ll start with requirements and scale, then draw the architecture, then go deep on X and Y."',
  sections: [
    {
      id: 'framework',
      title: '① The 45-minute interview framework',
      html: `
        <p>System design interviews are <strong>structured conversations</strong>, not trivia. You have roughly 45 minutes to show you can turn a vague product idea into a production architecture. The framework below is the same skeleton used at Google, Meta, Amazon, and in courses like Hello Interview — but here you will learn <em>what to say</em> at each step with concrete numbers and diagrams.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Without a framework, candidates jump straight to "we need Kafka and Redis" and lose 15 minutes on the wrong problem. Interviewers grade <strong>process</strong>: clarifying ambiguity, estimating scale, drawing a sane high-level design, then diving deep on two components with trade-offs. A repeatable framework prevents panic and signals seniority — you drive the room instead of waiting for prompts.</p>
        <p>Staff-level hires consistently: (1) state assumptions aloud, (2) time-box each phase, (3) check in — "Should I go deeper on the write path or caching?"</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <p>Use this skeleton for <strong>every</strong> open-ended design question: URL shortener, Twitter feed, payment system, chat, rate limiter, job scheduler, video streaming. Even when the interviewer says "design X," they are testing whether you can <em>decompose</em> X using the same steps.</p>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Design a news feed (Meta-style):</strong> Clarify read vs write ratio (often 100:1), estimate 500M DAU → ~6K average QPS, peak 60K QPS → CDN + cache for reads, fan-out on write vs pull on read deep dive.</li>
          <li><strong>Design payments:</strong> Clarify strong consistency, idempotency, PCI scope → skip CDN on money path → deep dive on DB transactions and saga/outbox.</li>
          <li><strong>Design a file upload service:</strong> Clarify max file size (100 MB), 10K uploads/min → estimate bandwidth 17 GB/min → deep dive S3 multipart + metadata DB.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <p>Do not rigidly recite slides when the interviewer is clearly steering you ("let's skip estimates, go straight to sharding"). Flex the framework — but <strong>never skip requirements</strong>. Also avoid spending 20 minutes on requirements for a simple LRU cache question; compress clarify + estimate to 5–7 minutes total for smaller scopes.</p>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Framework</th><th>Focus</th><th>When to prefer</th></tr></thead>
          <tbody>
            <tr><td>REA (Requirements, Estimation, Architecture)</td><td>Minimal 3-step</td><td>45-min interviews with strong time pressure</td></tr>
            <tr><td>Hello Interview 4-step</td><td>Requirements → high-level → deep dives → wrap-up</td><td>Very similar; merge estimation into requirements</td></tr>
            <tr><td>Educative RESHADED</td><td>Requirements, Estimation, Storage, High-level, API, Data model, Evaluation, Detail</td><td>When interviewer wants API + schema early</td></tr>
            <tr><td>This lesson (6-step + time boxes)</td><td>Explicit trade-offs + failure modes</td><td>Default for most FAANG-style loops</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p>Walk through the interview <strong>clock</strong> — say these time boxes out loud:</p>
        <ol>
          <li><strong>Clarify (5 min):</strong> functional requirements, non-functional (latency p99, availability %, consistency), explicit out-of-scope</li>
          <li><strong>Estimate (5 min):</strong> DAU, QPS (avg + 10× peak), storage, bandwidth — round numbers</li>
          <li><strong>High-level design (10 min):</strong> client, CDN, LB, services, cache, DB, async queues</li>
          <li><strong>Deep dive (15 min):</strong> pick 2 components — data model, hot path, sharding, failure handling</li>
          <li><strong>Trade-offs (5 min):</strong> SQL vs NoSQL, sync vs async, strong vs eventual consistency</li>
          <li><strong>Wrap-up (5 min):</strong> failure modes, monitoring, future 10× scale</li>
        </ol>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">45-minute interview flow</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Clarify<br/><small>5 min</small></div>
            <div class="lesson-box green">Estimate<br/><small>5 min</small></div>
            <div class="lesson-box orange">HLD<br/><small>10 min</small></div>
            <div class="lesson-box blue">Deep dive<br/><small>15 min</small></div>
            <div class="lesson-box purple">Trade-offs<br/><small>5 min</small></div>
            <div class="lesson-box green">Wrap-up<br/><small>5 min</small></div>
          </div>
        </div>

        <p class="lesson-flow">Vague prompt → Clarify scope → Numbers on paper → Boxes & arrows → Zoom into 2 boxes → Compare options → Failures & metrics</p>

        <table>
          <thead><tr><th>Minute</th><th>You say</th><th>Interviewer hears</th></tr></thead>
          <tbody>
            <tr><td>0–5</td><td>"Is search in scope? What's p99 latency target?"</td><td>Structured thinking</td></tr>
            <tr><td>5–10</td><td>"10M DAU × 20 reads/day ≈ 2,300 QPS, peak ~25K"</td><td>Can estimate scale</td></tr>
            <tr><td>10–20</td><td>Draw CDN → LB → API → Redis → Postgres</td><td>Knows standard patterns</td></tr>
            <tr><td>20–35</td><td>"Deep dive: feed generation + caching"</td><td>Depth, not breadth only</td></tr>
            <tr><td>35–45</td><td>"CP vs AP here; I'd choose eventual for likes"</td><td>Trade-off literacy</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Open with: "I'll start with requirements and scale, then draw the architecture, then go deep on two components." This one sentence buys you the entire interview structure. Staff-level signal: you <em>spoken</em> time boxes and check in before each phase transition.</div>
      `,
    },
    {
      id: 'scalability',
      title: '② Scalability — vertical vs horizontal',
      html: `
        <p><strong>Scalability</strong> means your system can handle more load (users, QPS, data) by adding resources — without rewriting the product. This section covers <em>how</em> you scale machines (vertical vs horizontal). NFR scalability targets (10× growth, elasticity) are covered in the NFR lesson.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Every successful product outgrows a single server. Instagram started on one Postgres; within years they needed sharded storage and thousands of app servers. Interviewers want to hear: <strong>stateless app tier scales horizontally</strong>; databases scale via replicas, partitioning, or different stores. Wrong scaling order (shard before cache) wastes months of engineering.</p>
        <p>Concrete trigger numbers: single Postgres often tops out around <strong>5K–10K write QPS</strong> and <strong>50K–100K read QPS</strong> with replicas — beyond that you need partitioning or a write-optimized store.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li><strong>App servers:</strong> horizontal scale behind a load balancer (stateless REST APIs).</li>
          <li><strong>Read-heavy DB:</strong> read replicas + connection pooling before sharding.</li>
          <li><strong>Write-heavy DB:</strong> partitioning/sharding, queue-based write absorption, or Cassandra/Dynamo-style scale-out.</li>
          <li><strong>Early startup:</strong> vertical scale (bigger instance) is fine until ~$500–2K/month DB tier becomes painful.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Netflix API tier:</strong> thousands of stateless instances; session and preferences in external stores — classic horizontal app scale.</li>
          <li><strong>Shopify peak (Black Friday):</strong> auto-scale app + read replicas; cart writes still hit primary — vertical + horizontal mix.</li>
          <li><strong>Discord voice:</strong> stateful (UDP rooms) — horizontal scale with <strong>consistent hashing</strong> so users land on the same gateway; not simple round-robin.</li>
          <li><strong>Internal admin tool (50 users):</strong> one t3.medium — vertical scale is enough; horizontal scale adds ops cost with no benefit.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li><strong>Vertical scale only</strong> when you need 99.99% availability — one big machine is a single point of failure.</li>
          <li><strong>Horizontal app scale</strong> when the app keeps sessions in local memory — sticky sessions are a crutch; fix statelessness first.</li>
          <li><strong>Sharding early</strong> at 200 QPS because "we might scale" — operational nightmare; cache and optimize first.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Approach</th><th>How</th><th>Pros</th><th>Cons</th><th>Example scale</th></tr></thead>
          <tbody>
            <tr><td>Vertical scale</td><td>Bigger CPU/RAM/disk (r6g.2xlarge → r6g.8xlarge)</td><td>Simple, no code changes</td><td>Hard ceiling, SPOF, expensive</td><td>0–2K QPS monolith</td></tr>
            <tr><td>Horizontal scale</td><td>More machines + LB</td><td>Near-unlimited app tier, fault tolerant</td><td>Stateless apps, partitioning, ops</td><td>10K–1M+ QPS APIs</td></tr>
            <tr><td>Auto-scaling</td><td>CPU/latency-driven instance count</td><td>Handles spikes (3× daily peak)</td><td>Cold start 30–90s, cost tuning</td><td>SaaS with diurnal traffic</td></tr>
            <tr><td>Read replicas</td><td>DB copies for reads</td><td>5×–10× read capacity</td><td>Replication lag 10ms–1s</td><td>Feeds, dashboards</td></tr>
            <tr><td>Functional scale</td><td>Split monolith into services</td><td>Team autonomy, isolate hot paths</td><td>Network latency, distributed debug</td><td>Org &gt; 50 engineers</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p>Standard scale path when traffic grows 10×:</p>
        <p class="lesson-flow">Traffic spike → Profile & optimize (indexes, N+1) → Cache + CDN → Scale reads (replicas) → Scale writes (queue, shard) → Auto-scale app tier</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Horizontal scale — stateless app tier</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Clients<br/><small>100K concurrent</small></div>
            <div class="lesson-box orange">Load Balancer<br/><small>L7, health checks</small></div>
            <div class="lesson-box green">App 1</div>
            <div class="lesson-box green">App 2</div>
            <div class="lesson-box green">App N<br/><small>auto-scale 10–200</small></div>
            <div class="lesson-box purple">Redis<br/><small>shared session</small></div>
            <div class="lesson-box blue">PostgreSQL<br/><small>primary + replicas</small></div>
          </div>
        </div>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Vertical vs horizontal — decision</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Vertical<br/><small>1 server 64 GB RAM</small></div>
            <div class="lesson-box orange">vs</div>
            <div class="lesson-box green">Horizontal<br/><small>8 servers 8 GB each</small></div>
          </div>
        </div>

        <p><strong>Numbers example:</strong> API at 8K QPS, 50 ms p99 per instance handles ~200 QPS → need ~40 instances at peak (with 2× headroom → 80 instances). DB at 8K reads/s → 2 read replicas (4K each) + 32 GB cache for hot 20% of keys.</p>

        <div class="lesson-callout"><strong>Interview tip:</strong> Say "I'd scale the stateless tier horizontally first; for the DB I'd add read replicas until write QPS exceeds ~5K, then consider sharding by user_id." Naming a threshold shows production awareness.</div>
      `,
    },
    {
      id: 'estimation',
      title: '③ Back-of-envelope estimation',
      html: `
        <p>Back-of-envelope math turns "millions of users" into <strong>QPS, storage, and bandwidth</strong> so your architecture choices are justified. You are allowed to round aggressively — interviewers care about orders of magnitude, not exactness.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Without estimates you might propose a single MySQL for YouTube-scale video or 50 Kafka clusters for a todo app. Estimates drive: how many app servers, whether you need a CDN, cache size, and sharding strategy. A 2-minute calculation often eliminates half the wrong designs.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <p>Every system design interview after clarifying requirements — typically <strong>5 minutes</strong> with pen and paper. Also used in RFCs, capacity planning, and cost forecasts ($/month for S3, RDS, egress).</p>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Twitter-like read-heavy:</strong> 300M DAU × 50 timeline reads/day = 15B reads/day ≈ <strong>175K QPS</strong> average; 10× peak ≈ <strong>1.7M QPS</strong> → CDN + aggressive cache mandatory.</li>
          <li><strong>Photo storage:</strong> 500M users × 200 photos × 2 MB = <strong>200 PB</strong> raw → S3 + lifecycle to Glacier; metadata in DB ~100 GB.</li>
          <li><strong>Chat messages:</strong> 10M users × 100 messages/day × 500 B = <strong>500 GB/day</strong> ≈ <strong>6 MB/s</strong> write bandwidth → Kafka partition count ~50–100.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <p>Skip deep estimation when the interviewer says "assume infinite scale" or for tiny scoped problems (design a mutex API). Do not spend 15 minutes on bandwidth if functional design is still unclear.</p>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Method</th><th>Description</th><th>Best for</th></tr></thead>
          <tbody>
            <tr><td>DAU × actions/day</td><td>Most common QPS formula</td><td>User-facing APIs</td></tr>
            <tr><td>Peak factor (5×–10×)</td><td>Average × multiplier</td><td>Planning capacity, auto-scale max</td></tr>
            <tr><td>Power-of-2 round</td><td>1M → 1.2M, 86,400 → 100K</td><td>Fast mental math</td></tr>
            <tr><td>Little's Law</td><td>Concurrency = QPS × latency</td><td>Connection pools, queue depth</td></tr>
            <tr><td>Spreadsheet model</td><td>Detailed cost + growth curves</td><td>Production capacity reviews</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p><strong>Worked example — URL shortener:</strong></p>
        <ul>
          <li>100M DAU, each creates 1 short URL/day + 10 redirects/day</li>
          <li>Writes: 100M/day ≈ <strong>1,200 write/s</strong> avg; peak 10× ≈ <strong>12K write/s</strong></li>
          <li>Reads: 1B redirects/day ≈ <strong>12K read/s</strong> avg; peak ≈ <strong>120K read/s</strong></li>
          <li>Storage: 100M new URLs/day × 500 B × 365 days × 5 years ≈ <strong>90 TB</strong> (+ indexes ~2×)</li>
          <li>Bandwidth: 120K RPS × 1 KB response ≈ <strong>120 MB/s</strong> egress at peak</li>
        </ul>

        <p class="lesson-flow">DAU → actions/day → divide by 86,400 → QPS avg → multiply 10× peak → storage = records × size × retention → bandwidth = QPS × payload</p>

        <table>
          <thead><tr><th>Resource</th><th>Formula</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>QPS (avg)</td><td>DAU × actions/day ÷ 86,400</td><td>10M DAU × 20 ÷ 86,400 ≈ 2,300 QPS</td></tr>
            <tr><td>QPS (peak)</td><td>Avg × 10</td><td>2,300 × 10 ≈ 23,000 QPS</td></tr>
            <tr><td>Storage</td><td>records/day × size × retention days</td><td>1B rows × 1 KB × 365 × 3 yr</td></tr>
            <tr><td>Bandwidth</td><td>QPS × avg payload</td><td>5K RPS × 50 KB = 250 MB/s</td></tr>
            <tr><td>Cache memory</td><td>hot % × dataset</td><td>20% of 100 GB = 20 GB Redis</td></tr>
            <tr><td>DB connections</td><td>QPS × query time (Little)</td><td>2K QPS × 20 ms = 40 concurrent</td></tr>
          </tbody>
        </table>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Latency budget toward p99 &lt; 200 ms</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">CDN 10 ms</div>
            <div class="lesson-box orange">LB 5 ms</div>
            <div class="lesson-box green">App 50 ms</div>
            <div class="lesson-box blue">Redis 1 ms</div>
            <div class="lesson-box purple">DB 10 ms</div>
            <div class="lesson-box orange">Total ~76 ms</div>
          </div>
        </div>

        <p><strong>Reference numbers to memorize:</strong> 1 day = 86,400 s ≈ <strong>100K</strong> for mental math; 1 MB = 1,000 KB; SSD ~1 GB/s; network cross-region ~50–100 ms; Redis GET ~1 ms; Postgres indexed PK ~1–5 ms; cross-service hop ~5–20 ms.</p>

        <div class="lesson-callout"><strong>Interview tip:</strong> State assumptions before calculating: "I'll assume 10M DAU, 20 reads per user per day, 1 KB response." Wrong assumptions with clear logic beat silent guessing.</div>
      `,
    },
    {
      id: 'load-balancing',
      title: '④ Load balancing',
      html: `
        <p>A <strong>load balancer (LB)</strong> distributes incoming traffic across multiple backend servers so no single machine melts and failed nodes are removed automatically. It is the front door of almost every horizontally scaled system.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Without an LB, one app server gets overloaded, others sit idle, and a crashed server still receives traffic. LBs provide <strong>high availability</strong> (health checks), <strong>SSL termination</strong> (offload TLS from apps), and <strong>routing</strong> (canary 5% to new version). At 50K QPS, a single nginx or AWS ALB can often handle the fan-out — apps scale behind it.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Between clients and stateless API servers (always).</li>
          <li>Between API tier and internal microservices (service mesh / sidecar LB).</li>
          <li>Database read replica routing (PgBouncer, ProxySQL, RDS reader endpoint).</li>
          <li>Global traffic: DNS + GeoDNS or anycast to regional LBs.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>AWS ALB (L7):</strong> Route <code>/api/*</code> to ECS, <code>/static/*</code> to S3; sticky sessions for legacy; weighted target groups for canary.</li>
          <li><strong>NGINX (L4/L7):</strong> 100K+ concurrent WebSocket connections with <code>least_conn</code> and upstream keepalive.</li>
          <li><strong>Consistent hashing (Memcached):</strong> key → server mapping minimizes reshuffle when one node added (still used in caches, not primary LB for HTTP).</li>
          <li><strong>Global LB (Cloudflare / AWS Global Accelerator):</strong> user in Tokyo → Tokyo region LB → reduces RTT from 200 ms to 20 ms.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Single-server deployments (&lt;500 QPS internal tool) — LB adds cost and complexity.</li>
          <li>Stateful protocols without sticky sessions or shared state — random routing breaks in-memory rooms.</li>
          <li>Using LB as database sharding router without understanding hot shards — use application-level sharding keys instead.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Algorithm</th><th>Behavior</th><th>Best for</th><th>Weak for</th></tr></thead>
          <tbody>
            <tr><td>Round robin</td><td>Rotate evenly</td><td>Homogeneous stateless, uniform latency</td><td>Long requests pile on one server if times vary</td></tr>
            <tr><td>Least connections</td><td>Fewest active conns</td><td>WebSocket, gRPC streams, variable RTT</td><td>Slightly higher LB CPU</td></tr>
            <tr><td>Weighted RR</td><td>Capacity-weighted</td><td>Mixed instance sizes (c5.xlarge + c5.4xlarge)</td><td>Manual weight tuning</td></tr>
            <tr><td>IP hash / sticky</td><td>Same client → same server</td><td>Legacy session in memory</td><td Uneven load if clients bursty</td></tr>
            <tr><td>Consistent hash</td><td>Key → server ring</td><td>Cache clusters, minimal remapping</td><td>HTTP request LB (limited)</td></tr>
            <tr><td>L4 (TCP)</td><td>IP/port, no HTTP parse</td><td>Max throughput, TLS pass-through</td><td>Can't route on URL/header</td></tr>
            <tr><td>L7 (HTTP)</td><td>URL, headers, cookies</td><td>Microservices, A/B, auth routing</td><td>Higher latency ~1–5 ms</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Client TLS → LB terminates SSL → health check OK backends only → pick algorithm → forward to app → app responds → LB returns to client</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">L7 load balancing path</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Client<br/><small>HTTPS</small></div>
            <div class="lesson-box orange">L7 LB<br/><small>SSL terminate</small></div>
            <div class="lesson-box green">API Pod 1<br/><small>healthy</small></div>
            <div class="lesson-box green">API Pod 2<br/><small>healthy</small></div>
            <div class="lesson-box purple">API Pod 3<br/><small>unhealthy — drained</small></div>
          </div>
        </div>

        <p><strong>Health checks:</strong> HTTP GET <code>/health</code> every 10s; 2 failures → remove from pool; 30s to drain long requests. At 10K QPS across 20 servers, each instance sees ~500 QPS — if one fails, LB redistributes in &lt;30s.</p>

        <p><strong>Active-active vs active-passive:</strong> Stateless APIs = active-active (all nodes serve traffic). Stateful leader (single writer DB) = active-passive failover with VIP or DNS flip — RTO 30s–5 min typical.</p>

        <div class="lesson-callout"><strong>Interview tip:</strong> "I'd use L7 for HTTP microservices routing and least-connections if requests are long-lived; L4 if we need raw throughput or TLS pass-through to apps." Mention health checks and connection draining — interviewers love operational detail.</div>
      `,
    },
    {
      id: 'caching',
      title: '⑤ Caching strategies',
      html: `
        <p><strong>Caching</strong> stores frequently accessed data in fast memory (Redis, in-process) so you avoid slow disk/network on every request. A good cache can turn <strong>50 ms DB reads into 1 ms</strong> and cut DB QPS by 80–95% for read-heavy workloads.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Database is the bottleneck in most systems. At 20K read QPS, Postgres without cache dies; with 90% hit rate, DB sees only 2K QPS. Caching is often the <strong>first</strong> scale lever after basic indexing — cheaper than sharding.</p>
        <p>Numbers: Redis single node ~100K–200K ops/s; hit ratio 80–95% typical for hot keys; TTL 60s–24h depending on freshness needs.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Read-heavy APIs: user profiles, product catalog, feed pages.</li>
          <li>Session storage: JWT validation + server-side session in Redis.</li>
          <li>Rate limiting counters, leaderboard scores, feature flags.</li>
          <li>CDN edge cache for static assets and cacheable GET JSON.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Facebook memcached layer:</strong> billions of keys; cache-aside; invalidation on profile update.</li>
          <li><strong>Amazon product page:</strong> CDN + Redis for product metadata; inventory may skip cache or use short TTL (5s) for accuracy.</li>
          <li><strong>Stack Overflow:</strong> heavy in-process + Redis; question pages cached; writes invalidate tags.</li>
          <li><strong>Session store:</strong> 50M sessions × 2 KB = <strong>100 GB</strong> Redis cluster with replication.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Strong consistency required on every read (bank balance) — cache adds staleness unless careful read-your-writes routing.</li>
          <li>Data accessed once ever (cold archival) — cache waste.</li>
          <li>Dataset entirely unique per request (random UUID lookups with no repeat) — 0% hit rate.</li>
          <li>When invalidation is harder than the problem (high churn inventory) — consider shorter TTL or no cache on that path.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Pattern</th><th>Read path</th><th>Write path</th><th>Risk</th></tr></thead>
          <tbody>
            <tr><td>Cache-aside</td><td>App → cache → miss → DB → set cache</td><td>Write DB, invalidate/delete cache</td><td>Stale if invalidation missed</td></tr>
            <tr><td>Read-through</td><td>Cache loads on miss (library)</td><td>Invalidate on write</td><td>Cache library dependency</td></tr>
            <tr><td>Write-through</td><td>Read cache</td><td>Sync write cache + DB</td><td>Higher write latency ~2×</td></tr>
            <tr><td>Write-behind</td><td>Read cache</td><td>Write cache, async flush DB</td><td>Data loss if cache crashes before flush</td></tr>
            <tr><td>CDN only</td><td>Edge for static/cacheable GET</td><td>Purge or versioned URLs</td><td>Can't cache personalized POST</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Read → Check Redis → Hit: return (1 ms) | Miss → Query DB (10–50 ms) → Set cache with TTL → Return</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Cache-aside read path</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Client</div>
            <div class="lesson-box orange">API Server</div>
            <div class="lesson-box green">Redis<br/><small>hit 90%</small></div>
            <div class="lesson-box purple">PostgreSQL<br/><small>miss 10%</small></div>
          </div>
        </div>

        <p><strong>Hot key problem:</strong> 1M QPS on celebrity tweet key — single Redis shard melts. Fixes: local in-process cache (1s TTL), replicate key across shards, pre-warm before event.</p>
        <p><strong>Cache stampede:</strong> TTL expires, 10K threads hit DB simultaneously. Fixes: <strong>singleflight</strong> (one thread repopulates), probabilistic early expiration, mutex per key.</p>

        <table>
          <thead><tr><th>Scenario</th><th>QPS</th><th>Cache hit</th><th>DB QPS</th></tr></thead>
          <tbody>
            <tr><td>No cache</td><td>20,000</td><td>0%</td><td>20,000</td></tr>
            <tr><td>Redis 90% hit</td><td>20,000</td><td>90%</td><td>2,000</td></tr>
            <tr><td>CDN + Redis</td><td>20,000</td><td>95%</td><td>1,000</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Always say cache-aside + TTL + invalidation on write. Mention stampede and hot keys for senior signal. "I'd size Redis for 20% of 500 GB dataset ≈ 100 GB with LRU eviction."</div>
      `,
    },
    {
      id: 'cap',
      title: '⑥ CAP theorem & consistency',
      html: `
        <p>The <strong>CAP theorem</strong> states that in a distributed system during a <strong>network partition</strong>, you must choose between <strong>Consistency</strong> (every read sees latest write) and <strong>Availability</strong> (every request gets a response). <strong>Partition tolerance</strong> is not optional in real networks — cables fail, regions go dark.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Wrong consistency choice causes lost payments, double bookings, or angry users seeing stale feeds. Interviewers use CAP to test whether you match storage and replication to business rules: money = CP; social likes = AP.</p>
        <p><strong>PACELC extension:</strong> Even without partition, you trade <strong>Latency</strong> vs <strong>Consistency</strong> — sync cross-region replication adds 50–150 ms per write.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Choosing database: Postgres (CP-ish single primary) vs Cassandra (AP tunable).</li>
          <li>Multi-region design: sync replication (CP, higher latency) vs async (AP, eventual).</li>
          <li>Leader election (ZooKeeper/etcd): CP for coordination.</li>
          <li>Shopping cart during partition: often AP — better available cart than error page.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Bank transfer:</strong> CP — single leader, sync replication, reject write if quorum lost; p99 write latency 100–300 ms acceptable.</li>
          <li><strong>Instagram like count:</strong> AP/eventual — count may lag 1–5s; available during partial outage.</li>
          <li><strong>DynamoDB / Cassandra:</strong> AP with tunable consistency (<code>QUORUM</code> vs <code>ONE</code>).</li>
          <li><strong>Google Spanner:</strong> CP with TrueTime — strong global consistency at higher cost/latency.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Single-node Postgres on one machine — CAP is about <em>distributed</em> trade-offs; don't over-quote CAP for monoliths.</li>
          <li>Claiming "we chose CAP" without naming concrete failure scenario — always tie to partition or replication lag.</li>
          <li>Strong consistency everywhere "because it's safer" — kills availability and latency at global scale.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Choice</th><th>Systems</th><th>Consistency</th><th>Typical latency</th></tr></thead>
          <tbody>
            <tr><td>CP</td><td>ZooKeeper, etcd, HBase, Spanner</td><td>Linearizable / strong</td><td>Write 50–300 ms multi-region</td></tr>
            <tr><td>AP</td><td>Cassandra, DynamoDB (default), Riak</td><td>Eventual, tunable</td><td>Write 5–20 ms local</td></tr>
            <tr><td>Strong (single leader)</td><td>Postgres primary</td><td>Read-your-writes on primary</td><td>Read replica lag 10ms–1s</td></tr>
            <tr><td>Eventual</td><td>Async replica, CDN</td><td>Stale reads possible</td><td>Read 1–5 ms from replica</td></tr>
            <tr><td>Causal</td><td>MongoDB sessions, some queues</td><td>Ordered per client</td><td>Middle ground</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p><strong>Partition scenario:</strong> US-East and US-West lose network link. CP system: one side stops accepting writes (or entire cluster read-only) to prevent split-brain. AP system: both sides accept writes; merge conflicts later (vector clocks, last-write-wins — risky for money).</p>

        <p class="lesson-flow">Write → Leader primary → Sync replicas (CP wait) OR Async replicate (AP fast) → Read from primary (strong) OR replica (eventual)</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">CP vs AP during partition</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Region A<br/><small>CP: reject writes</small></div>
            <div class="lesson-box orange">X partition X</div>
            <div class="lesson-box green">Region B<br/><small>AP: accept writes</small></div>
          </div>
        </div>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Read-your-writes pattern</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">User updates profile</div>
            <div class="lesson-box orange">Write to primary</div>
            <div class="lesson-box green">Route next read to primary OR version token</div>
          </div>
        </div>

        <p><strong>Numbers:</strong> Async replica lag under load: 100 ms–2 s. Sync quorum (3 nodes, write 2): add ~10–30 ms LAN, ~100 ms cross-region. Availability target 99.9% = 8.7 hr downtime/year — CP failover may violate unless multi-AZ.</p>

        <div class="lesson-callout"><strong>Interview tip:</strong> "During partition I'd prefer availability for the feed but consistency for wallet — polyglot persistence, not one CAP choice for whole system." Mention read-your-writes for user-facing updates after mutation.</div>
      `,
    },
    {
      id: 'databases',
      title: '⑦ Database types — when to use what',
      html: `
        <p>No single database wins every workload. <strong>Polyglot persistence</strong> means using Postgres for transactions, Redis for cache, Elasticsearch for search, S3 for blobs — each optimized for its access pattern.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Picking MongoDB because "it scales" for heavy relational reporting fails. Picking Postgres for 500K write/s time-series fails. Interviewers want access-pattern reasoning: <strong>read/write ratio, join needs, consistency, query shape, retention</strong>.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li><strong>OLTP transactions:</strong> SQL (Postgres, MySQL).</li>
          <li><strong>High write throughput, wide rows:</strong> Cassandra, HBase.</li>
          <li><strong>Flexible document model:</strong> MongoDB, DynamoDB.</li>
          <li><strong>Sub-ms session/cache:</strong> Redis, Memcached.</li>
          <li><strong>Full-text search / logs:</strong> Elasticsearch, OpenSearch.</li>
          <li><strong>Graph traversals (friends-of-friends):</strong> Neo4j (or SQL with limits).</li>
          <li><strong>Vector similarity (RAG):</strong> Pinecone, pgvector, Weaviate.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Stripe:</strong> Postgres for money (ACID); Redis for idempotency keys; Kafka for events.</li>
          <li><strong>Netflix:</strong> Cassandra for viewing history (high write); S3 for video; EV cache.</li>
          <li><strong>Airbnb search:</strong> Elasticsearch for listings; MySQL for bookings source of truth.</li>
          <li><strong>OpenAI RAG app:</strong> pgvector or Pinecone for embeddings; Postgres for user metadata.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Redis as sole source of truth for financial records — persistence optional, not ACID bank.</li>
          <li>Elasticsearch as primary transactional store — not designed for atomic multi-doc updates.</li>
          <li>Graph DB for simple user CRUD at 100M users — ops complexity without graph queries.</li>
          <li>Sharding Postgres before exhausting cache + read replicas — premature sharding pain.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Type</th><th>Examples</th><th>Strengths</th><th>Weak for</th><th>Scale hint</th></tr></thead>
          <tbody>
            <tr><td>SQL</td><td>PostgreSQL, MySQL</td><td>ACID, joins, constraints</td><td>Massive write on one node</td><td>~5K–10K write/s sharded</td></tr>
            <tr><td>Wide-column</td><td>Cassandra, HBase</td><td>Write throughput, TTL</td><td>Ad-hoc joins</td><td>100K+ write/s cluster</td></tr>
            <tr><td>Document</td><td>MongoDB, DynamoDB</td><td>Flexible schema, partition key scale</td><td>Cross-shard transactions</td><td>Dynamo millions RPS</td></tr>
            <tr><td>Key-value</td><td>Redis, Memcached</td><td>Sub-ms, simple ops</td><td>Complex queries</td><td>100K–1M ops/s/node</td></tr>
            <tr><td>Search</td><td>Elasticsearch</td><td>Full-text, aggregations</td><td>Primary OLTP</td><td>Billions docs with shards</td></tr>
            <tr><td>Graph</td><td>Neo4j</td><td>Relationship queries</td><td>Simple CRUD at huge scale</td><td>Millions nodes typical</td></tr>
            <tr><td>Vector</td><td>Pinecone, pgvector</td><td>Similarity search</td><td>Exact PK only workloads</td><td>Billions vectors partitioned</td></tr>
            <tr><td>Object</td><td>S3, GCS</td><td>Cost per GB, durability</td><td>Low-latency indexed queries</td><td>Exabytes</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">API write → Validate → Postgres transaction → Publish event to Kafka → Worker indexes Elasticsearch → Cache invalidation in Redis</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Polyglot persistence — e-commerce</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">API</div>
            <div class="lesson-box purple">PostgreSQL<br/><small>orders ACID</small></div>
            <div class="lesson-box green">Redis<br/><small>cart session</small></div>
            <div class="lesson-box orange">Elasticsearch<br/><small>product search</small></div>
            <div class="lesson-box blue">S3<br/><small>images</small></div>
          </div>
        </div>

        <p><strong>Sharding when:</strong> single table &gt; 500 GB–1 TB, write QPS &gt; 5K–10K on primary, or index maintenance blocks writes. Shard key: <code>user_id</code> (even spread) not <code>country</code> (hot shard).</p>

        <table>
          <thead><tr><th>Workload</th><th>Read QPS</th><th>Write QPS</th><th>Pick</th></tr></thead>
          <tbody>
            <tr><td>Bank ledger</td><td>10K</td><td>2K</td><td>Postgres + sync replica</td></tr>
            <tr><td>IoT metrics</td><td>50K</td><td>500K</td><td>Cassandra / Timescale</td></tr>
            <tr><td>Session</td><td>100K</td><td>20K</td><td>Redis</td></tr>
            <tr><td>Log search</td><td>5K</td><td>200K</td><td>Elasticsearch</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Never say "SQL vs NoSQL" — say "access pattern: need joins and ACID → Postgres; need 200K writes/s per partition → Cassandra with user_id partition key."</div>
      `,
    },
    {
      id: 'cdn',
      title: '⑧ CDN & edge delivery',
      html: `
        <p>A <strong>Content Delivery Network (CDN)</strong> caches static and cacheable content at edge servers (PoPs) worldwide so users download from a nearby city instead of your origin in Virginia. Latency drops from <strong>200 ms to 20–50 ms</strong>; origin bandwidth can drop <strong>80–95%</strong> for static assets.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>At 1M users streaming a 2 MB JS bundle, origin serves 2 TB per full cache miss wave. CDN absorbs repeat traffic. For video (Netflix, YouTube), CDN/edge is non-negotiable — origin cannot serve 100 Gbps peaks.</p>
        <p>Cost: egress from cloud origin ~$0.08–0.12/GB vs CDN ~$0.02–0.05/GB at scale.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Static assets: JS, CSS, fonts, images, WASM.</li>
          <li>Cacheable GET APIs: public product catalog, blog posts (with <code>Cache-Control</code>).</li>
          <li>Video/audio segments (HLS/DASH chunks).</li>
          <li>Software downloads, game patches, firmware.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Cloudflare / Akamai in front of SaaS:</strong> global Anycast DNS → nearest PoP; DDoS scrubbing included.</li>
          <li><strong>Spotify album art:</strong> S3 origin + CDN; immutable URLs with hash in path.</li>
          <li><strong>API caching:</strong> GET <code>/v1/products</code> with <code>Cache-Control: public, max-age=300</code> — 5 min stale OK.</li>
          <li><strong>Live sports:</strong> CDN delivers 10 Tbps aggregate during events; origin only encodes streams.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Personalized responses (user-specific JSON with auth) — cache miss every time unless edge includes user segment key.</li>
          <li>POST/PUT/DELETE — not cacheable by standard CDN rules.</li>
          <li>Highly dynamic data (&lt;1s freshness): stock ticker — CDN TTL too coarse; use dedicated streaming.</li>
          <li>Internal microservices east-west traffic inside VPC — CDN wrong tool.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Approach</th><th>Latency</th><th>Best for</th></tr></thead>
          <tbody>
            <tr><td>CDN edge cache</td><td>20–50 ms global</td><td>Static + cacheable GET</td></tr>
            <tr><td>Origin only</td><td>100–300 ms cross-region</td><td>Dev/staging, tiny traffic</td></tr>
            <tr><td>Versioned URLs (hash)</td><td>Long max-age, no purge</td><td>JS/CSS deploy immutability</td></tr>
            <tr><td>Purge API</td><td>Invalidate on deploy</td><td>HTML without hash filenames</td></tr>
            <tr><td>Edge compute (Workers)</td><td>Logic at PoP</td><td>A/B, auth at edge, geo routing</td></tr>
            <tr><td>Multi-region active</td><td>Low latency writes+reads</td><td>When CDN cache insufficient</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Client DNS → CDN edge (hit: return 20 ms) | miss → origin fetch → cache at edge → return to client</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">CDN layers</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Client<br/><small>Mumbai</small></div>
            <div class="lesson-box green">CDN PoP<br/><small>Mumbai edge</small></div>
            <div class="lesson-box orange">CDN mid-tier<br/><small>optional</small></div>
            <div class="lesson-box purple">Origin<br/><small>S3 / API us-east</small></div>
          </div>
        </div>

        <ol class="lesson-layers">
          <li><strong>Origin</strong> — S3 or app server (source of truth for content)</li>
          <li><strong>CDN edge PoPs</strong> — 200+ cities; cache hot objects</li>
          <li><strong>DNS / anycast</strong> — route client to nearest healthy PoP</li>
          <li><strong>Client</strong> — receives cached bytes; origin load drops 90%+ for static</li>
        </ol>

        <table>
          <thead><tr><th>Asset</th><th>Size</th><th>1M users</th><th>Without CDN</th><th>With CDN (90% hit)</th></tr></thead>
          <tbody>
            <tr><td>JS bundle</td><td>500 KB</td><td>500 GB transfer</td><td>Origin 500 GB</td><td>Origin 50 GB</td></tr>
            <tr><td>Hero image</td><td>200 KB</td><td>200 GB</td><td>200 GB</td><td>20 GB</td></tr>
            <tr><td>API catalog GET</td><td>50 KB</td><td>50 GB @ 1M req</td><td>50 GB</td><td>5 GB + 5 min stale</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Prefer <code>app.v2.abc123.js</code> immutable URLs over purge APIs. Say CDN for static and cacheable GET; personalized feeds stay behind API + Redis, not CDN.</div>
      `,
    },
    {
      id: 'request-path',
      title: '⑨ End-to-end request path',
      html: `
        <p>Tracing one HTTP request from finger tap to database row shows how <strong>every fundamental piece connects</strong> — DNS, TLS, CDN, LB, app, cache, DB, async workers. Senior candidates narrate this path with a latency budget.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Optimizing the wrong layer wastes effort. If p99 is 800 ms because DB missing index, CDN won't help. Latency budget forces accountability: each hop gets a millisecond cap; sum must meet SLA (often p99 &lt; 200–300 ms for APIs).</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <p>Explain hot path in every interview after high-level diagram. Production debugging: distributed tracing (Jaeger) shows which span blew the budget.</p>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Read product page:</strong> CDN hit on image (15 ms) + API miss cache → Postgres (40 ms) + ES search sidebar (30 ms) — parallelize ES.</li>
          <li><strong>Post tweet:</strong> Write primary (20 ms) + fan-out async to 10M followers impossible sync — queue + batch.</li>
          <li><strong>Login:</strong> LB → API → Redis session check (2 ms) → optional Postgres user lookup — keep auth off critical CDN path.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <p>Don't enumerate every hop for batch jobs or offline ETL — different path (S3 → Spark → warehouse). Don't ignore async: user-facing path should not wait for email/analytics indexing.</p>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Pattern</th><th>Sync path</th><th>Async path</th></tr></thead>
          <tbody>
            <tr><td>Read-heavy</td><td>CDN → cache → DB replica</td><td>None on critical path</td></tr>
            <tr><td>Write + notify</td><td>DB commit → return 201</td><td>Kafka → email worker</td></tr>
            <tr><td>Search indexing</td><td>Write DB only</td><td>CDC → ES indexer</td></tr>
            <tr><td>Feed fan-out</td><td>Write tweet ID</td><td>Workers push to follower caches</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Client → DNS (20 ms) → TLS CDN/LB (30 ms) → App (30 ms) → Redis (1 ms) → DB (10 ms) → JSON serialize (10 ms) → Response</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Typical read request path</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Mobile Client</div>
            <div class="lesson-box purple">DNS</div>
            <div class="lesson-box green">CDN Edge</div>
            <div class="lesson-box orange">Load Balancer</div>
            <div class="lesson-box blue">API Service</div>
            <div class="lesson-box green">Redis Cache</div>
            <div class="lesson-box purple">PostgreSQL</div>
          </div>
        </div>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Async off critical path</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">API<br/><small>return 200 in 80 ms</small></div>
            <div class="lesson-box orange">Kafka / SQS</div>
            <div class="lesson-box green">Analytics Worker</div>
            <div class="lesson-box purple">Email Worker</div>
            <div class="lesson-box blue">Search Indexer</div>
          </div>
        </div>

        <table>
          <thead><tr><th>Hop</th><th>Typical p50</th><th>Typical p99</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>DNS + TCP + TLS</td><td>30 ms</td><td>80 ms</td><td>TLS session resumption helps</td></tr>
            <tr><td>CDN (hit)</td><td>15 ms</td><td>40 ms</td><td>Miss adds origin RTT</td></tr>
            <tr><td>LB</td><td>2 ms</td><td>5 ms</td><td>L7 slightly higher</td></tr>
            <tr><td>App logic</td><td>20 ms</td><td>100 ms</td><td>GC pauses, N+1 queries</td></tr>
            <tr><td>Redis</td><td>0.5 ms</td><td>2 ms</td><td>Same AZ</td></tr>
            <tr><td>Postgres indexed</td><td>2 ms</td><td>15 ms</td><td>Seq scan kills p99</td></tr>
            <tr><td><strong>Total target</strong></td><td><strong>~80 ms</strong></td><td><strong>&lt; 200 ms</strong></td><td>Product SLA driven</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Draw sync path first, then dotted arrows for async. Say "User gets response before search index updates — acceptable 1–5 s staleness for search." Quantify budget: "30 ms left for app if DB is 10 ms and cache hits."</div>
      `,
    },
    {
      id: 'checklist',
      title: '⑩ Revision checklist & interview FAQ',
      html: `
        <p>Use this section the night before interviews and as a <strong>mental close</strong> in the last 5 minutes of every mock. Missing items correlate with "lean no" feedback: no estimates, no trade-offs, no failure modes.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Checklists convert broad topics into verifiable signals. Interviewers often score on a rubric — requirements, scale, diagram, depth, trade-offs, ops. Tick each box aloud in practice until automatic.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Final 5 minutes of live interview wrap-up.</li>
          <li>Mock interview self-review.</li>
          <li>RFC peer review ("did we estimate QPS?").</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <p>Candidate designs notification system, forgets idempotency — checklist catches "failure modes + retries." Another designs cache without TTL — checklist item "invalidation + stampede" triggers fix before interviewer asks.</p>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <p>Don't read checklist robotically for 3 minutes while interviewer wants deep dive on sharding. Use as internal mental model; verbalize only gaps relevant to the problem.</p>

        <h3 class="lesson-subhead">Alternatives</h3>
        <p>Rubric apps (Hello Interview grader), peer mock sheets, or company-specific ladders (Amazon L6 bar). This checklist maps to universal FAANG-style loops.</p>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Finish deep dive → Scan checklist mentally → Verbalize 2 gaps you didn't cover → Propose monitoring + scale plan → Ask interviewer for questions</p>

        <ul class="lesson-checklist">
          <li>Opened with functional + non-functional requirements</li>
          <li>Calculated QPS (avg + peak), storage, bandwidth with stated assumptions</li>
          <li>Drew CDN → LB → App → Cache → DB</li>
          <li>Explained vertical vs horizontal scaling with thresholds</li>
          <li>Named caching strategy + TTL + invalidation</li>
          <li>Applied CAP / consistency choice per data type (money vs likes)</li>
          <li>Picked SQL vs NoSQL with access-pattern justification</li>
          <li>Mentioned CDN for static and cacheable GET</li>
          <li>Async queue for non-critical work off critical path</li>
          <li>Failure modes: DB down, cache stampede, hot keys, partition</li>
          <li>Monitoring: metrics, logs, traces, SLOs, alerting</li>
          <li>Future scale: 10× users — what breaks first?</li>
        </ul>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Interview signal map</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Requirements</div>
            <div class="lesson-box green">Scale math</div>
            <div class="lesson-box orange">Architecture</div>
            <div class="lesson-box blue">Depth</div>
            <div class="lesson-box purple">Trade-offs</div>
            <div class="lesson-box green">Ops</div>
          </div>
        </div>

        <table>
          <thead><tr><th>Interviewer asks</th><th>Short answer</th><th>Numbers to cite</th></tr></thead>
          <tbody>
            <tr><td>How do you start?</td><td>Requirements + scale estimate before boxes</td><td>DAU → QPS → peak 10×</td></tr>
            <tr><td>SQL or NoSQL?</td><td>Joins + ACID → SQL; 200K writes/s partition → Cassandra</td><td>5K write/s Postgres ceiling</td></tr>
            <tr><td>When Redis?</td><td>Hot reads, sessions, rate limits — not sole money store</td><td>90% hit → 10× DB relief</td></tr>
            <tr><td>Strong vs eventual?</td><td>Money = strong; likes = eventual</td><td>Replica lag 100 ms–2 s</td></tr>
            <tr><td>What breaks at 10×?</td><td>DB writes, hot keys, egress cost — in order</td><td>Plan cache before shard</td></tr>
            <tr><td>How monitor?</td><td>p99 latency, error rate, saturation, SLO alerts</td><td>p99 &lt; 200 ms, 99.9% avail</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> In the last 2 minutes say: "If I had another 10 minutes I'd deep dive failover and multi-region." Shows roadmap thinking without rambling.</div>
      `,
    },
  ] as LessonSection[],
  video: {
    id: 'cTMomjk1iRc',
    title: 'Distributed Job Scheduler — System Design',
    playlistId: 'PLIRnO_sdVuEeyqzwYfDoJ3vbvJB4JBU6n',
  },
};
