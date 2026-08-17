/** Full lesson: System Design Fundamentals (from binodsuman study material, expanded) */

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
        <p><strong>Every system design answer follows the same skeleton:</strong></p>
        <ol>
          <li><strong>Clarify (5 min):</strong> functional requirements, non-functional (latency, availability, consistency, scale), out of scope</li>
          <li><strong>Estimate (5 min):</strong> DAU, QPS, storage, bandwidth — round numbers, state assumptions</li>
          <li><strong>High-level design (10 min):</strong> client, CDN, LB, services, cache, DB, async queues</li>
          <li><strong>Deep dive (15 min):</strong> pick 2 components — data model, hot path, sharding</li>
          <li><strong>Trade-offs (5 min):</strong> SQL vs NoSQL, sync vs async, strong vs eventual consistency</li>
          <li><strong>Wrap-up (5 min):</strong> failure modes, monitoring, future scale</li>
        </ol>
        <div class="lesson-callout"><strong>Staff-level signal:</strong> Hello Interview and Educative both teach frameworks — yours should be <em>spoken out loud</em> with time boxes. Interviewers hire candidates who drive the room, not wait for prompts.</div>
      `,
    },
    {
      id: 'scalability',
      title: '② Scalability — vertical vs horizontal',
      html: `
        <table>
          <thead><tr><th>Approach</th><th>How</th><th>Pros</th><th>Cons</th></tr></thead>
          <tbody>
            <tr><td>Vertical scale</td><td>Bigger CPU/RAM/disk</td><td>Simple, no code changes</td><td>Hard ceiling, SPOF, expensive</td></tr>
            <tr><td>Horizontal scale</td><td>More machines + LB</td><td>Near-unlimited, fault tolerant</td><td>Stateless apps, partitioning, ops</td></tr>
            <tr><td>Auto-scaling</td><td>Metrics-driven instances</td><td>Handles spikes</td><td>Cold start, tuning</td></tr>
            <tr><td>Read replicas</td><td>DB copies for reads</td><td>Offload reads</td><td>Replication lag</td></tr>
          </tbody>
        </table>
        <p><strong>Stateless services scale easily:</strong> session in Redis/DB, not app memory. <strong>Stateful</strong> (WebSocket rooms, counters) needs sharding or consistent hashing.</p>
        <p class="lesson-flow">Traffic growing? → Optimize → Cache + CDN → Scale reads → Scale writes</p>
      `,
    },
    {
      id: 'estimation',
      title: '③ Back-of-envelope estimation',
      html: `
        <p><strong>Worked example assumptions:</strong></p>
        <ul>
          <li>1M DAU × 10 requests/day = 10M/day ≈ <strong>116 req/s</strong> average</li>
          <li>Plan for 10× peak → ~<strong>1,200 req/s</strong> peak</li>
          <li>1 KB in + 5 KB out × 1.2K RPS ≈ <strong>7 MB/s</strong> bandwidth</li>
          <li>100 B × 1B records = 100 GB raw (+ indexes 2–3×)</li>
        </ul>
        <table>
          <thead><tr><th>Resource</th><th>Formula</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>QPS</td><td>DAU × actions/day ÷ 86,400</td><td>10M DAU × 20 ÷ 86,400 ≈ 2,300</td></tr>
            <tr><td>Storage</td><td>records × size × retention</td><td>1B users × 500 B × 5 yr</td></tr>
            <tr><td>Bandwidth</td><td>QPS × avg payload</td><td>5K RPS × 50 KB = 250 MB/s</td></tr>
            <tr><td>Cache memory</td><td>hot % × dataset</td><td>20% of 100 GB = 20 GB Redis</td></tr>
          </tbody>
        </table>
        <p><strong>Latency budget:</strong> CDN 10ms + LB 5ms + app 50ms + cache 1ms + DB 10ms ≈ 76ms toward a 200ms p99 target.</p>
      `,
    },
    {
      id: 'load-balancing',
      title: '④ Load balancing',
      html: `
        <table>
          <thead><tr><th>Algorithm</th><th>Behavior</th><th>Best for</th></tr></thead>
          <tbody>
            <tr><td>Round robin</td><td>Rotate evenly</td><td>Homogeneous stateless servers</td></tr>
            <tr><td>Least connections</td><td>Fewest active conns</td><td>Long-lived / variable request time</td></tr>
            <tr><td>Weighted RR</td><td>Capacity-weighted</td><td>Mixed hardware</td></tr>
            <tr><td>Consistent hash</td><td>Same client → same server</td><td>Affinity without shared store (limited)</td></tr>
            <tr><td>L4 (TCP)</td><td>IP/port routing</td><td>Throughput, WebSocket</td></tr>
            <tr><td>L7 (HTTP)</td><td>URL, headers, cookies</td><td>Microservices, canary, A/B</td></tr>
          </tbody>
        </table>
        <p><strong>Health checks</strong> remove bad nodes in seconds. <strong>SSL termination</strong> at LB offloads crypto. Active-active for stateless; active-passive for stateful leaders.</p>
      `,
    },
    {
      id: 'caching',
      title: '⑤ Caching strategies',
      html: `
        <table>
          <thead><tr><th>Pattern</th><th>Read</th><th>Write</th><th>Risk</th></tr></thead>
          <tbody>
            <tr><td>Cache-aside</td><td>App → cache → miss → DB</td><td>Write DB, invalidate cache</td><td>Stale if invalidation missed</td></tr>
            <tr><td>Read-through</td><td>Cache loads on miss</td><td>Invalidate on write</td><td>Library support needed</td></tr>
            <tr><td>Write-through</td><td>Read cache</td><td>Cache + DB sync</td><td>Write latency</td></tr>
            <tr><td>Write-behind</td><td>Read cache</td><td>Async flush to DB</td><td>Loss if cache crashes</td></tr>
          </tbody>
        </table>
        <p><strong>Always set TTL.</strong> <strong>Hot keys:</strong> replicate key, local in-process cache, pre-warm. <strong>Cache stampede:</strong> singleflight so one thread repopulates.</p>
        <p class="lesson-flow">Read → Check Redis → Hit return | Miss → DB → Set cache → Return</p>
      `,
    },
    {
      id: 'cap',
      title: '⑥ CAP theorem & consistency',
      html: `
        <p><strong>CAP:</strong> During partition, choose <strong>Consistency</strong> (same data everywhere) or <strong>Availability</strong> (every request answered). Partition tolerance is mandatory in distributed systems.</p>
        <table>
          <thead><tr><th>Choice</th><th>Examples</th><th>Use when</th></tr></thead>
          <tbody>
            <tr><td>CP</td><td>ZooKeeper, etcd, HBase</td><td>Banking, inventory, leader election</td></tr>
            <tr><td>AP</td><td>Cassandra, DynamoDB</td><td>Feeds, carts, analytics</td></tr>
            <tr><td>Strong consistency</td><td>Sync replication</td><td>Money, unique constraints</td></tr>
            <tr><td>Eventual</td><td>Async replication</td><td>Profiles, like counts</td></tr>
          </tbody>
        </table>
        <p><strong>PACELC:</strong> Without partition, choose latency vs consistency. <strong>Read-your-writes:</strong> route to primary or version check after user mutation.</p>
      `,
    },
    {
      id: 'databases',
      title: '⑦ Database types — when to use what',
      html: `
        <table>
          <thead><tr><th>Type</th><th>Examples</th><th>Strengths</th><th>Weak for</th></tr></thead>
          <tbody>
            <tr><td>SQL</td><td>PostgreSQL, MySQL</td><td>ACID, joins</td><td>Massive write scale on one node</td></tr>
            <tr><td>Wide-column</td><td>Cassandra, HBase</td><td>Write throughput, time-series</td><td>Ad-hoc joins</td></tr>
            <tr><td>Document</td><td>MongoDB, DynamoDB</td><td>Flexible schema</td><td>Multi-doc ACID (improving)</td></tr>
            <tr><td>Key-value</td><td>Redis</td><td>Sub-ms, sessions</td><td>Complex queries</td></tr>
            <tr><td>Search</td><td>Elasticsearch</td><td>Full-text, logs</td><td>Primary transactional store</td></tr>
            <tr><td>Graph</td><td>Neo4j</td><td>Relationships</td><td>Simple CRUD at huge scale</td></tr>
            <tr><td>Vector</td><td>Pinecone, pgvector</td><td>RAG similarity</td><td>Exact PK lookups only</td></tr>
          </tbody>
        </table>
        <p><strong>Polyglot persistence:</strong> PG for orders, Redis sessions, ES search, S3 blobs — each store for its access pattern.</p>
      `,
    },
    {
      id: 'cdn',
      title: '⑧ CDN & edge delivery',
      html: `
        <ol class="lesson-layers">
          <li><strong>Origin</strong> — app or object storage (S3)</li>
          <li><strong>CDN edge PoPs</strong> — cache static assets and cacheable GET APIs globally</li>
          <li><strong>DNS / anycast</strong> — route to nearest edge</li>
          <li><strong>Client</strong> — content from edge, lower latency, less origin load</li>
        </ol>
        <p>Cache static JS/CSS/images, video segments, cacheable GET with <code>Cache-Control</code>. Do <strong>not</strong> cache personalized or POST responses. Prefer versioned URLs (<code>app.v2.js</code>) over purge APIs.</p>
      `,
    },
    {
      id: 'request-path',
      title: '⑨ End-to-end request path',
      html: `
        <p class="lesson-flow">Client → DNS → CDN → Load Balancer → App → Cache → Database</p>
        <p><strong>p99 &lt; 200ms budget example:</strong> DNS+TLS 20ms · CDN 10ms · LB 5ms · App 30ms · Redis 1ms · DB 10ms · serialization 20ms</p>
        <p><strong>Async off critical path:</strong> analytics, email, search indexing → Kafka/SQS → workers. Return user response before side effects finish.</p>
      `,
    },
    {
      id: 'checklist',
      title: '⑩ Revision checklist & interview FAQ',
      html: `
        <ul class="lesson-checklist">
          <li>Opened with functional + non-functional requirements</li>
          <li>Calculated QPS, storage, bandwidth with stated assumptions</li>
          <li>Drew CDN → LB → App → Cache → DB</li>
          <li>Explained vertical vs horizontal scaling</li>
          <li>Named caching strategy + invalidation</li>
          <li>Applied CAP with CP vs AP relevant to the problem</li>
          <li>Picked SQL vs NoSQL with access-pattern justification</li>
          <li>Mentioned CDN for static and cacheable reads</li>
          <li>Async for non-critical work</li>
          <li>Failure modes: DB down, stampede, hot keys</li>
        </ul>
        <table>
          <thead><tr><th>Interviewer asks</th><th>Short answer</th></tr></thead>
          <tbody>
            <tr><td>How do you start?</td><td>Requirements + scale estimate before boxes</td></tr>
            <tr><td>SQL or NoSQL?</td><td>Depends on joins, consistency, write QPS</td></tr>
            <tr><td>When Redis?</td><td>Hot reads, sessions, rate limits — not source of truth alone</td></tr>
            <tr><td>Strong vs eventual?</td><td>Money = strong; likes = eventual</td></tr>
          </tbody>
        </table>
      `,
    },
  ] as LessonSection[],
  video: {
    id: 'cTMomjk1iRc',
    title: 'Distributed Job Scheduler — System Design',
    playlistId: 'PLIRnO_sdVuEeyqzwYfDoJ3vbvJB4JBU6n',
  },
};
