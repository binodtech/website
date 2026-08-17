/** Full lesson: System Design Non-Functional Requirements (NFR) */

export type LessonSection = {
  id: string;
  title: string;
  html: string;
};

export const systemDesignNfr = {
  slug: 'nfr',
  title: 'Non-Functional Requirements (NFR)',
  subtitle:
    'How interviewers grade scalability, security, performance, monitoring, availability, and reliability — and how to state targets with real numbers.',
  interviewTip:
    'After functional requirements, spend 3–5 minutes on NFRs aloud: "For scale I assume 10M DAU and 10× peak; p99 read latency under 200 ms; 99.9% availability; payments need strong consistency and idempotent writes." Tie every NFR to a component.',
  sections: [
    {
      id: 'nfr-intro',
      title: '① What are NFRs — and how interviewers grade them',
      html: `
        <p><strong>Functional requirements</strong> describe what the system does: "users can post tweets, follow others, see a timeline." <strong>Non-functional requirements (NFRs)</strong> describe how well it does it: latency, uptime, security, scale, durability. In interviews, NFRs separate mid-level ("we need a database") from senior ("p99 &lt; 200 ms at 50K peak QPS with 99.95% availability").</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Architecture follows NFRs, not features. A chat app and a batch payroll system both "store messages" but NFRs diverge wildly: chat needs &lt;100 ms delivery and high availability; payroll needs ACID, audit logs, and correctness over raw speed. Interviewers dock candidates who jump to Kafka without stating latency or consistency targets.</p>
        <p>Grading rubric (typical FAANG-style):</p>
        <ul>
          <li><strong>Junior:</strong> lists NFR buzzwords without numbers.</li>
          <li><strong>Mid:</strong> states 1–2 NFRs with rough numbers (QPS, latency).</li>
          <li><strong>Senior:</strong> maps each NFR to components, trade-offs, and failure modes.</li>
          <li><strong>Staff:</strong> prioritizes NFRs when they conflict ("we sacrifice eventual consistency on likes to hit p99 during peak").</li>
        </ul>

        <h3 class="lesson-subhead">Where to use</h3>
        <p>First 5 minutes of every system design interview — immediately after functional scope. Also in RFCs, SLO documents, and product requirement docs (PRDs). Production teams encode NFRs as SLOs/SLAs monitored 24/7.</p>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Stripe API SLA:</strong> 99.99% availability, idempotent POST with <code>Idempotency-Key</code>, PCI-DSS for card data — NFRs drive API design.</li>
          <li><strong>Google Search:</strong> p95 latency ~200 ms historically; massive scale NFR drove caching, index sharding, and edge serving.</li>
          <li><strong>Hospital EMR:</strong> availability + durability &gt; raw speed; audit and encryption NFRs dominate architecture.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <p>Don't recite a 20-item NFR checklist for a 15-minute "design a rate limiter" question — pick 3–4 relevant NFRs (latency, accuracy, scale). Don't claim NFRs you won't design for ("five nines globally" without multi-region budget).</p>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Term</th><th>Meaning</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>SLA</td><td>Contract with customer; breach = credits</td><td>99.9% uptime per month</td></tr>
            <tr><td>SLO</td><td>Internal target, tighter than SLA</td><td>p99 &lt; 150 ms (SLA says 300 ms)</td></tr>
            <tr><td>SLI</td><td>Metric you measure</td><td>Ratio of requests &lt; 200 ms</td></tr>
            <tr><td>NFR</td><td>Requirement category</td><td>Security, performance, scale</td></tr>
            <tr><td>Quality attribute</td><td>Academic synonym for NFR</td><td>Modifiability, testability</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Product ask → List functional reqs → List NFRs with numbers → Prioritize conflicts → Map NFR → component → Validate in wrap-up</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Functional vs non-functional</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Functional<br/><small>WHAT: post tweet</small></div>
            <div class="lesson-box green">NFR Performance<br/><small>HOW FAST: p99 &lt; 200 ms</small></div>
            <div class="lesson-box orange">NFR Availability<br/><small>HOW RELIABLE: 99.9%</small></div>
            <div class="lesson-box blue">NFR Security<br/><small>HOW SAFE: OAuth + TLS</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>NFR category</th><th>Interview question to ask</th><th>Example target</th></tr></thead>
          <tbody>
            <tr><td>Scale</td><td>DAU? read/write ratio?</td><td>10M DAU, 100:1 read/write</td></tr>
            <tr><td>Performance</td><td>p99 latency budget?</td><td>Reads &lt; 200 ms, writes &lt; 500 ms</td></tr>
            <tr><td>Availability</td><td>Downtime acceptable?</td><td>99.9% = 43 min/month</td></tr>
            <tr><td>Reliability</td><td>Data loss acceptable?</td><td>0 lost payments; RPO 0 for money</td></tr>
            <tr><td>Security</td><td>Auth, PII, compliance?</td><td>OAuth2, encrypt PII at rest</td></tr>
            <tr><td>Consistency</td><td>Stale reads OK?</td><td>Strong for wallet; eventual for feed</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Write NFRs on the whiteboard in a box labeled "Constraints." Interviewers literally check this box on rubrics. Say: "I'll assume these NFRs unless you want different targets."</div>
      `,
    },
    {
      id: 'nfr-scalability',
      title: '② Scalability as NFR — elasticity, 10× growth, horizontal targets',
      html: `
        <p><strong>Scalability NFR</strong> answers: "Can the system grow 10× users without 10× cost or a rewrite?" It includes <strong>capacity</strong> (handle peak QPS), <strong>elasticity</strong> (auto-scale with traffic), and <strong>growth headroom</strong> (architecture supports next year's DAU).</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Products that 10× overnight (viral app, Black Friday) die if NFR was "works on my laptop." Scalability NFR forces horizontal design early: stateless APIs, partitioned data, caches, queues. Interviewers want you to name what breaks first at 10× — usually DB writes or hot keys, not CPU on app servers.</p>
        <p><strong>Elasticity</strong> means scale down at 3 AM to save cost — NFR for cost-conscious SaaS, not just scale up.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>User-facing APIs with unpredictable growth (social, gaming launches).</li>
          <li>Multi-tenant SaaS (noisy neighbor isolation NFR).</li>
          <li>Event spikes: ticket sales, elections, sports finals.</li>
          <li>Capacity planning: "support 50K peak QPS within 18 months."</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Twitter timeline read NFR:</strong> 300M DAU, ~175K avg QPS, peaks ~1–2M QPS during events → CDN + cache + read replicas mandatory; fan-out on write for celebrities.</li>
          <li><strong>Startup NFR:</strong> "10× in 12 months" → avoid premature microservices but design stateless monolith + managed RDS + Redis from day one.</li>
          <li><strong>AWS auto-scale NFR:</strong> scale app tier 10→200 instances in &lt;5 min when CPU &gt; 70% for 2 min; scale down with 15 min cooldown.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Internal admin tool with fixed 200 users — horizontal scale NFR wastes money; vertical RDS is fine.</li>
          <li>Claiming infinite scale without cost discussion — staff interviews ask $/month at target QPS.</li>
          <li>Sharding at launch for 100 QPS — violates pragmatic scalability (scale what hurts).</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Strategy</th><th>10× lever</th><th>Time to implement</th><th>Cost curve</th></tr></thead>
          <tbody>
            <tr><td>Optimize code/DB</td><td>2–5×</td><td>Days–weeks</td><td>Low</td></tr>
            <tr><td>Cache + CDN</td><td>5–20× read relief</td><td>Weeks</td><td>Medium</td></tr>
            <tr><td>Read replicas</td><td>3–10× reads</td><td>Days</td><td>Medium</td></tr>
            <tr><td>Horizontal app scale</td><td>Linear with instances</td><td>Hours (K8s)</td><td>Linear</td></tr>
            <tr><td>Sharding / partition</td><td>10×+ writes</td><td>Months</td><td>High ops</td></tr>
            <tr><td>Serverless</td><td>Elastic per request</td><td>Days</td><td>Spiky-friendly</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p><strong>10× growth math example:</strong> Today 1M DAU, 10M requests/day ≈ 116 QPS avg, peak 1.2K QPS. After 10×: 10M DAU ≈ 1.2K avg, <strong>12K peak QPS</strong>. App: 12K/200 per instance ≈ 60 instances (+ buffer → 120). DB reads at 90% cache hit: 1.2K DB QPS vs 12K without cache.</p>

        <p class="lesson-flow">Define today's QPS → multiply 10× → identify bottleneck (DB, cache, egress) → apply scale pattern → verify auto-scale policy → document next bottleneck</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Horizontal scale target architecture</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">10M DAU<br/><small>NFR input</small></div>
            <div class="lesson-box orange">12K peak QPS<br/><small>calculated</small></div>
            <div class="lesson-box green">120 API pods<br/><small>auto-scale</small></div>
            <div class="lesson-box purple">Redis cluster<br/><small>90% hit</small></div>
            <div class="lesson-box blue">DB 3 replicas<br/><small>1.2K read/s</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>Metric</th><th>Today</th><th>10× target</th><th>Component</th></tr></thead>
          <tbody>
            <tr><td>DAU</td><td>1M</td><td>10M</td><td>—</td></tr>
            <tr><td>Peak QPS</td><td>1.2K</td><td>12K</td><td>LB + app tier</td></tr>
            <tr><td>Storage</td><td>10 TB</td><td>100 TB</td><td>S3 + lifecycle</td></tr>
            <tr><td>Cache RAM</td><td>8 GB</td><td>64 GB</td><td>Redis cluster</td></tr>
            <tr><td>Monthly cost</td><td>$5K</td><td>$35–50K</td><td>estimate aloud</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> State scalability NFR as: "Design for 10× DAU in 12 months without schema rewrite — stateless services, cache-aside, read replicas first; shard when writes exceed ~5K/s on primary." Elasticity: mention auto-scale triggers and cold start risk for serverless.</div>
      `,
    },
    {
      id: 'nfr-security',
      title: '③ Security NFR — auth, encryption, OWASP, zero trust',
      html: `
        <p><strong>Security NFRs</strong> protect confidentiality, integrity, and availability from adversaries — not accidents. In interviews, cover <strong>authentication</strong> (who), <strong>authorization</strong> (what they can do), <strong>encryption</strong> (in transit and at rest), and <strong>compliance</strong> (PCI, HIPAA, GDPR) when relevant.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>One SQL injection or leaked S3 bucket ends companies. Security NFRs shape: TLS everywhere, secrets not in code, least-privilege IAM, audit logs for 7 years. Senior candidates mention OWASP Top 10 briefly and map threats to controls — not "we'll be secure."</p>
        <p><strong>Zero trust:</strong> never assume internal network is safe — verify every service call (mTLS, JWT, service mesh policies).</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Any user-facing API with accounts (OAuth2/OIDC, session management).</li>
          <li>Payment, health, government — regulatory NFRs mandatory.</li>
          <li>Multi-tenant SaaS — tenant isolation NFR (no cross-tenant data leak).</li>
          <li>Internal microservices — service-to-service auth, not IP allowlists only.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Auth0 / Google Sign-In:</strong> OAuth2 NFR — don't store passwords; delegate to IdP; short-lived access tokens (15 min) + refresh tokens (rotating).</li>
          <li><strong>PCI-DSS for cards:</strong> never store raw PAN in your DB — Stripe tokenization; scope reduction NFR.</li>
          <li><strong>AWS S3 breach pattern:</strong> encryption at rest (SSE-S3/KMS) + bucket policy deny public — NFR "no public objects."</li>
          <li><strong>OWASP A03 Injection:</strong> parameterized queries, ORM — NFR for every SQL-backed design.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Over-engineering mTLS for a public read-only blog — TLS to client is enough.</li>
          <li>Building custom crypto — NFR satisfied by AES-256-GCM and TLS 1.3 via libraries.</li>
          <li>30-minute security deep dive in a system design unless role is security-focused.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Control</th><th>Mechanism</th><th>When</th></tr></thead>
          <tbody>
            <tr><td>AuthN</td><td>OAuth2, SAML, passkeys</td><td>User identity</td></tr>
            <tr><td>AuthZ</td><td>RBAC, ABAC, OPA policies</td><td>Per-resource permissions</td></tr>
            <tr><td>Transport</td><td>TLS 1.3, mTLS internal</td><td>All external + zero trust internal</td></tr>
            <tr><td>At-rest encryption</td><td>AES-256, KMS per-tenant keys</td><td>PII, secrets, backups</td></tr>
            <tr><td>WAF / rate limit</td><td>Cloudflare, API gateway</td><td>DDoS, brute force</td></tr>
            <tr><td>Audit log</td><td>Immutable append-only store</td><td>Compliance, forensics</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Client TLS → API Gateway (JWT validate, rate limit) → Service (RBAC check) → DB (encrypted column for PII) → Audit log async</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Request security path</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Client<br/><small>TLS 1.3</small></div>
            <div class="lesson-box orange">API Gateway<br/><small>JWT + WAF</small></div>
            <div class="lesson-box green">Auth Service<br/><small>OAuth2</small></div>
            <div class="lesson-box purple">App Service<br/><small>RBAC</small></div>
            <div class="lesson-box blue">Encrypted DB<br/><small>KMS</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>OWASP risk</th><th>Control in design</th><th>Interview one-liner</th></tr></thead>
          <tbody>
            <tr><td>Broken access control</td><td>Check owner_id on every read</td><td>"Authorize in service layer, not UI"</td></tr>
            <tr><td>Injection</td><td>Prepared statements</td><td>"No string concat SQL"</td></tr>
            <tr><td>Sensitive data exposure</td><td>TLS + field-level encryption</td><td>"PII encrypted, keys in KMS"</td></tr>
            <tr><td>SSRF</td><td>Allowlist outbound URLs</td><td>"Webhook fetcher uses proxy"</td></tr>
            <tr><td>Security misconfiguration</td><td>IaC, deny public S3</td><td>"Terraform + policy scans"</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Spend 2–3 minutes on security NFR: "OAuth2 for users, TLS everywhere, RBAC on resources, encrypt PII at rest, rate limit 100 req/min per user, audit admin actions." Mention zero trust for service-to-service if microservices.</div>
      `,
    },
    {
      id: 'nfr-performance',
      title: '④ Performance NFR — latency p99, throughput, tail latency',
      html: `
        <p><strong>Performance NFRs</strong> define how fast and how much: latency (p50, p95, <strong>p99</strong>), throughput (QPS/RPS), and <strong>tail latency</strong> (worst 1% — what angry users hit). Throughput without latency is meaningless: 1M QPS at 5 s each is useless.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Users abandon after ~3 s page load; APIs targeting mobile need p99 &lt; 300 ms. Tail latency dominates SLAs — average 50 ms with p99 2 s means 1% of users suffer. Performance NFR drives caching, connection pooling, async paths, and "don't N+1 query."</p>
        <p><strong>Little's Law:</strong> concurrency = QPS × latency — at 5K QPS and 100 ms latency you need ~500 in-flight requests capacity.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>User-facing read APIs (search, feed, product page).</li>
          <li>Real-time systems (gaming, trading, video calls).</li>
          <li>Batch is different NFR — throughput jobs/hour, not p99 ms.</li>
          <li>Mobile clients on 3G — stricter payload size NFR (&lt;50 KB JSON).</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Google search NFR:</strong> sub-second perceived; aggressive caching and index locality.</li>
          <li><strong>Uber dispatch:</strong> p99 &lt; 100 ms for matching nearby drivers — geo index + in-memory grids.</li>
          <li><strong>Netflix startup:</strong> time-to-first-frame NFR drives CDN edge caches of manifest + first segment.</li>
          <li><strong>API gateway SLA:</strong> p99 &lt; 200 ms excluding client network; measure server-side spans only.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Same p99 target for writes and reads — writes often 2–5× looser (500 ms OK for create order).</li>
          <li>Optimizing microsecond latency for nightly ETL — wrong metric (use job duration).</li>
          <li>Ignoring payload size — 5 MB JSON blows mobile performance even at 50 ms server time.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Technique</th><th>Latency impact</th><th>Trade-off</th></tr></thead>
          <tbody>
            <tr><td>CDN edge</td><td>−100 to −200 ms RTT</td><td>Stale static content</td></tr>
            <tr><td>Redis cache</td><td>−10 to −50 ms DB</td><td>Consistency</td></tr>
            <tr><td>Connection pool</td><td>−20 ms conn setup</td><td>Pool sizing</td></tr>
            <tr><td>Parallel fan-out</td><td>max(A,B) vs A+B</td><td>Complexity</td></tr>
            <tr><td>Async non-critical</td><td>−50 to −500 ms user path</td><td>Delayed side effects</td></tr>
            <tr><td>gRPC vs REST JSON</td><td>−5 to −20 ms serialize</td><td>Browser support</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p><strong>Latency budget (p99 &lt; 200 ms read):</strong></p>
        <p class="lesson-flow">Budget 200 ms → allocate: network 40 ms + LB 5 ms + app 50 ms + cache 2 ms + DB 15 ms + margin 78 ms → if DB spikes, shed load or cache more</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Tail latency — parallel vs serial</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Serial: 50+80+60 ms<br/><small>p99 ~ 250 ms</small></div>
            <div class="lesson-box green">Parallel: max(50,80,60)<br/><small>p99 ~ 90 ms</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>Metric</th><th>Typical target</th><th>Measurement</th></tr></thead>
          <tbody>
            <tr><td>p50 latency</td><td>50–80 ms API</td><td>Prometheus histogram</td></tr>
            <tr><td>p99 latency</td><td>&lt; 200 ms read</td><td>Exclude client RTT optional</td></tr>
            <tr><td>Throughput</td><td>12K peak QPS</td><td>Load test + prod metrics</td></tr>
            <tr><td>Error budget</td><td>0.1% slow requests</td><td>SLO burn alerts</td></tr>
            <tr><td>Payload size</td><td>&lt; 100 KB typical API</td><td>Compression gzip/br</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Always separate read vs write latency NFR. Mention tail latency: "p99 matters more than average — I'd parallelize profile + permissions fetch and cap DB queries at 2 per request."</div>
      `,
    },
    {
      id: 'nfr-monitoring',
      title: '⑤ Monitoring NFR — metrics, logs, traces, alerting, SLOs',
      html: `
        <p>You cannot meet NFRs you cannot measure. <strong>Monitoring NFR</strong> defines what to observe (metrics, logs, traces), how fast to detect failure (&lt;1 min alert), and SLO targets that drive alerting and error budgets.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Outages without observability mean hours of blind debugging. Google SRE practice: <strong>SLI → SLO → SLA</strong>. If p99 latency SLO is 200 ms and error budget burns 50% in a day, freeze feature launches and fix perf. Interview wrap-up without monitoring sounds incomplete.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Every production service — non-negotiable NFR.</li>
          <li>High availability designs — prove failover worked via synthetic checks.</li>
          <li>Capacity planning — QPS, CPU saturation, DB conn pool graphs.</li>
          <li>Security — audit logs, anomaly detection on auth failures.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Datadog / Prometheus stack:</strong> RED metrics (Rate, Errors, Duration) per service; alert when p99 &gt; 300 ms for 5 min.</li>
          <li><strong>Distributed tracing (Jaeger):</strong> one slow request shows DB span 1.8 s — missing index found in minutes.</li>
          <li><strong>Structured logs (JSON):</strong> <code>request_id</code> correlates across 12 microservices.</li>
          <li><strong>PagerDuty on SLO burn:</strong> 99.9% monthly budget — alert at 25% consumed in 24 hr.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Logging every byte of PII — violates security NFR; log IDs not emails.</li>
          <li>Alert on everything — alert fatigue; page humans only on user-impacting SLO breach.</li>
          <li>5-minute deep dive on tool names unless interviewer asks ops details.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Pillar</th><th>Tool examples</th><th>Best for</th></tr></thead>
          <tbody>
            <tr><td>Metrics</td><td>Prometheus, CloudWatch, Datadog</td><td>Aggregates, dashboards, alerts</td></tr>
            <tr><td>Logs</td><td>ELK, Loki, Splunk</td><td>Debugging specific request</td></tr>
            <tr><td>Traces</td><td>Jaeger, Tempo, X-Ray</td><td>Latency breakdown</td></tr>
            <tr><td>Synthetic</td><td>Pingdom, canaries</td><td>Proactive uptime check</td></tr>
            <tr><td>Profiling</td><td>pprof, continuous profiler</td><td>CPU hotspots in prod</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Request → App emits metrics (latency histogram) + trace spans → Log line with trace_id → Collector → Dashboard + alert rule → PagerDuty if SLO burn</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Observability pipeline</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Services<br/><small>metrics/logs/traces</small></div>
            <div class="lesson-box orange">OpenTelemetry<br/><small>collector</small></div>
            <div class="lesson-box green">Prometheus / Loki</div>
            <div class="lesson-box purple">Grafana<br/><small>dashboards</small></div>
            <div class="lesson-box blue">Alertmanager<br/><small>SLO burn</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>SLI</th><th>SLO example</th><th>Alert threshold</th></tr></thead>
          <tbody>
            <tr><td>Availability</td><td>99.9% successful requests</td><td>&gt;0.1% 5xx for 5 min</td></tr>
            <tr><td>Latency</td><td>99% &lt; 200 ms</td><td>p99 &gt; 300 ms 10 min</td></tr>
            <tr><td>Saturation</td><td>CPU &lt; 70% avg</td><td>&gt;85% 15 min → scale</td></tr>
            <tr><td>DB connections</td><td>Pool &lt; 80%</td><td>&gt;90% → leak or scale</td></tr>
            <tr><td>Queue lag</td><td>&lt; 1 min consumer lag</td><td>&gt;5 min → worker scale</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> Close with: "I'd track RED per service, distributed traces on hot path, SLO on p99 &lt; 200 ms and 99.9% availability, page on error budget burn." Four sentences = senior ops signal.</div>
      `,
    },
    {
      id: 'nfr-availability',
      title: '⑥ Availability NFR — uptime %, HA, failover, multi-region',
      html: `
        <p><strong>Availability NFR</strong> is the fraction of time the system is usable: <strong>99.9% (three nines)</strong> = ~43 minutes downtime/month; <strong>99.99% (four nines)</strong> = ~4.3 minutes/month. Achieved via redundancy, failover, health checks, and multi-region — not wishful thinking.</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Downtime costs money and trust — Amazon estimated $220K/minute at peak (historical anecdote). Availability NFR determines single-AZ vs multi-AZ vs multi-region. You cannot get four nines on a single server; interviewers check you know the math and architecture cost.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Payment, auth, core API — high availability NFR (99.9%+).</li>
          <li>Global products — multi-region for disaster recovery (region loss).</li>
          <li>Stateful systems — leader failover (Postgres Patroni, Redis Sentinel).</li>
          <li>Planned maintenance — rolling deploys without hard downtime NFR.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>AWS multi-AZ RDS:</strong> synchronous standby in second AZ; failover ~60–120 s; meets many 99.95% NFRs.</li>
          <li><strong>Route 53 health checks:</strong> DNS failover to secondary region if primary health check fails 3×.</li>
          <li><strong>Kubernetes:</strong> 3 replicas + PDB + rolling update — pod death invisible to users.</li>
          <li><strong>Status page honesty:</strong> 99.9% SLA with credits if breached — contractual NFR.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Five nines (99.999%) for internal CI tool — ~26 sec/month downtime budget unrealistic for cost.</li>
          <li>Multi-region active-active for every app — 2× cost + consistency pain; reserve for tier-0 services.</li>
          <li>Claiming 100% availability — impossible; define degraded mode (read-only) instead.</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Pattern</th><th>Typical availability</th><th>Failover time</th><th>Cost</th></tr></thead>
          <tbody>
            <tr><td>Single server</td><td>95–99%</td><td>Hours (manual)</td><td>$</td></tr>
            <tr><td>Multi-instance + LB</td><td>99.5–99.9%</td><td>Seconds (health check)</td><td>$$</td></tr>
            <tr><td>Multi-AZ DB</td><td>99.9–99.95%</td><td>1–2 min</td><td>$$$</td></tr>
            <tr><td>Multi-region active-passive</td><td>99.95–99.99%</td><td>5–30 min DNS</td><td>$$$$</td></tr>
            <tr><td>Multi-region active-active</td><td>99.99%+</td><td>Near zero</td><td>$$$$$</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Health check fails → LB removes bad nodes → if AZ down → promote replica → if region down → DNS to secondary region → runbook + status page</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Multi-AZ high availability</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Clients</div>
            <div class="lesson-box orange">Global LB</div>
            <div class="lesson-box green">AZ-1 API + DB primary</div>
            <div class="lesson-box purple">AZ-2 API + DB standby</div>
          </div>
        </div>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Multi-region failover</div>
          <div class="lesson-arch-row">
            <div class="lesson-box green">us-east active<br/><small>100% traffic</small></div>
            <div class="lesson-box orange">Route 53 health</div>
            <div class="lesson-box purple">eu-west standby<br/><small>async replica</small></div>
          </div>
        </div>

        <table>
          <thead><tr><th>Uptime %</th><th>Downtime/month</th><th>Downtime/year</th><th>Architecture hint</th></tr></thead>
          <tbody>
            <tr><td>99% (two nines)</td><td>7.2 hours</td><td>3.65 days</td><td>Single region OK</td></tr>
            <tr><td>99.9%</td><td>43 minutes</td><td>8.7 hours</td><td>Multi-AZ, redundancy</td></tr>
            <tr><td>99.95%</td><td>22 minutes</td><td>4.4 hours</td><td>Auto failover DB</td></tr>
            <tr><td>99.99%</td><td>4.3 minutes</td><td>52 minutes</td><td>Multi-region, no single AZ</td></tr>
            <tr><td>99.999%</td><td>26 seconds</td><td>5.2 minutes</td><td>Active-active global</td></tr>
          </tbody>
        </table>

        <div class="lesson-callout"><strong>Interview tip:</strong> State availability NFR with downtime math: "99.9% allows 43 min/month — I'd use multi-AZ, 3+ app replicas, DB failover, and runbooks. Multi-region only if product needs survive region loss."</div>
      `,
    },
    {
      id: 'nfr-reliability',
      title: '⑦ Reliability NFR — durability, fault tolerance, retries, idempotency',
      html: `
        <p><strong>Reliability</strong> is whether the system behaves correctly under failure: no lost data (<strong>durability</strong>), graceful degradation (<strong>fault tolerance</strong>), and correct behavior when messages duplicate (<strong>idempotency</strong>). Availability is "up"; reliability is "right when up (and after recovery)."</p>

        <h3 class="lesson-subhead">Why it matters</h3>
        <p>Double-charging a customer once destroys more trust than 5 min outage. Reliability NFRs drive: replicated storage (11 nines S3 durability), at-least-once delivery + idempotent consumers, circuit breakers, and RPO/RTO for backups. Kafka without idempotent writes loses money on retry storms.</p>
        <p><strong>RPO</strong> (Recovery Point Objective): max data loss window — 0 for payments. <strong>RTO</strong> (Recovery Time Objective): max time to restore — 15 min for tier-1 API.</p>

        <h3 class="lesson-subhead">Where to use</h3>
        <ul>
          <li>Payment, inventory, booking — durability + idempotency mandatory.</li>
          <li>Message queues — at-least-once delivery assumed; design consumers idempotent.</li>
          <li>Microservices — circuit breakers when dependency fails; don't cascade.</li>
          <li>Backups — nightly snapshots + PITR for DB; test restore quarterly NFR.</li>
        </ul>

        <h3 class="lesson-subhead">Real use cases</h3>
        <ul>
          <li><strong>Stripe idempotency keys:</strong> same POST retried returns same result — reliability NFR for flaky mobile networks.</li>
          <li><strong>S3 durability 99.999999999%:</strong> erasure coding across AZs — object store reliability NFR.</li>
          <li><strong>Outbox pattern:</strong> DB transaction includes outbox row → worker publishes to Kafka — no lost events on crash between DB and queue.</li>
          <li><strong>Circuit breaker (Hystrix/resilience4j):</strong> stop calling failing payment API after 50% errors — fail fast, protect reliability of core path.</li>
        </ul>

        <h3 class="lesson-subhead">When NOT to use</h3>
        <ul>
          <li>Idempotency store for every read-only GET — unnecessary complexity.</li>
          <li>Sync replication globally for analytics logs — eventual OK; don't over-apply payment rules.</li>
          <li>Infinite retries without backoff — amplifies outages (retry storm).</li>
        </ul>

        <h3 class="lesson-subhead">Alternatives</h3>
        <table>
          <thead><tr><th>Pattern</th><th>Guarantee</th><th>Use when</th></tr></thead>
          <tbody>
            <tr><td>At-most-once</td><td>May lose message</td><td>Metrics OK to drop</td></tr>
            <tr><td>At-least-once + idempotent</td><td>No duplicate effect</td><td>Payments, orders</td></tr>
            <tr><td>Exactly-once</td><td>Hard in distributed</td><td>Kafka transactions, Flink</td></tr>
            <tr><td>Saga</td><td>Distributed compensating txs</td><td>Multi-service workflows</td></tr>
            <tr><td>2PC</td><td>Strong atomic commit</td><td>Rare; latency + blocking</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead">Execution / data flow</h3>
        <p class="lesson-flow">Client POST payment + Idempotency-Key → API upsert idempotency record → DB txn debit+credit → return 200 → on timeout client retries same key → API returns cached 200 (no double charge)</p>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Idempotent payment flow</div>
          <div class="lesson-arch-row">
            <div class="lesson-box blue">Client retry<br/><small>same key</small></div>
            <div class="lesson-box orange">API<br/><small>check key</small></div>
            <div class="lesson-box green">Idempotency store<br/><small>Redis/DB</small></div>
            <div class="lesson-box purple">Ledger DB<br/><small>ACID txn</small></div>
          </div>
        </div>

        <div class="lesson-diagram">
          <div class="lesson-diagram-title">Retry with exponential backoff</div>
          <div class="lesson-arch-row">
            <div class="lesson-box purple">Fail<br/><small>1s wait</small></div>
            <div class="lesson-box orange">Retry<br/><small>2s wait</small></div>
            <div class="lesson-box green">Retry<br/><small>4s wait</small></div>
            <div class="lesson-box blue">Success or DLQ</div>
          </div>
        </div>

        <table>
          <thead><tr><th>Failure</th><th>Reliability control</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Duplicate request</td><td>Idempotency key</td><td>0 duplicate charges</td></tr>
            <tr><td>Worker crash mid-job</td><td>At-least-once + idempotent worker</td><td>Job eventually done once</td></tr>
            <tr><td>DB primary dies</td><td>Replica promote + WAL</td><td>RPO &lt; 1 min, RTO &lt; 2 min</td></tr>
            <tr><td>Dependency timeout</td><td>Circuit breaker + fallback</td><td>Degraded mode, not hang</td></tr>
            <tr><td>Region loss</td><td>Cross-region backup</td><td>RPO 15 min, RTO 1 hr</td></tr>
          </tbody>
        </table>

        <p><strong>Retry numbers:</strong> max 3–5 retries, exponential backoff 1s→2s→4s, jitter ±20%; dead-letter queue after exhaustion; alert on DLQ depth &gt; 100.</p>

        <div class="lesson-callout"><strong>Interview tip:</strong> Pair reliability with concrete patterns: "Payments: idempotency keys, ACID ledger, outbox for events. Retries with backoff, circuit breakers on external APIs, RPO 0 / RTO &lt; 5 min for money." Distinguish reliability from availability explicitly.</div>
      `,
    },
  ] as LessonSection[],
};
