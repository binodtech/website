/** Modern System Design — Chapter 22: Distributed Logging.
 *  Volume math, structured logs, trace IDs, a non-blocking agent, sampling,
 *  secret redaction, and Loki versus Elasticsearch versus ClickHouse.
 */

export const msdDistributedLogging = {
  slug: 'distributed-logging',
  title: 'Distributed Logging',
  subtitle:
    'Logs are a high-volume, lossy-on-purpose telemetry stream. They must not stall the request path, must carry a trace ID, and must never contain a secret. The design is mostly arithmetic and isolation, not a brand of indexer.',
  byline: 'Modern System Design · Chapter 22 · ~1h 25m read · Intermediate',
  interviewTip:
    'Quantify first. "Ten thousand hosts at 2,000 lines per second at 400 bytes is 8 GB/s; we cannot index all of it." Then: structured JSON, a trace ID on every line, a local agent that never blocks the app, sample successes and keep errors, redact tokens at the agent. Name Loki, Elasticsearch or ClickHouse and say why. That is a logging design. "We use ELK" is a shopping list.',
  sections: [
    {
      id: 'dl-sys',
      title: 'System Design: Distributed Logging',
      children: [
        { id: 'dl-why', title: 'Why logs still exist next to metrics and traces' },
        { id: 'dl-struct', title: 'Structured logs and trace IDs' },
        { id: 'dl-agent', title: 'The app must never block on the network store' },
        { id: 'dl-req', title: 'Functional and non-functional requirements' },
      ],
      html: `
        <p><a href="/learn/modern-system-design/distributed-monitoring">Chapter 13</a> split telemetry into metrics, logs and traces. This chapter is the log pipe: high cardinality, high volume, the thing you grep at 3am when the metric only said "something is wrong." Metrics tell you <em>that</em> p99 jumped. Traces tell you <em>which hop</em>. Logs tell you <em>which order_id, which exception, which if-branch</em>.</p>
        <p>That power is why they explode in cost and why they leak secrets. A design that "just ships stdout to Elastic" is a bill and a breach waiting on a token in a URL. Logs are also the worst SLO citizen: a blocked <code>fprintf</code> stalls the request. The first requirement is therefore negative: logging must not take the product down.</p>

        <h3 class="lesson-subhead" id="dl-why">Why logs still exist next to metrics and traces</h3>
        <p>Keep a metric when you already know the question: error rate, queue depth, heap. Keep a trace when you need the critical path of one request. Keep a log when you need an unbounded string you did not instrument yesterday — a vendor error body, a feature-flag snapshot, a SQL that only fires on one tenant.</p>
        <p>The trap is using logs as a dashboard. If you parse a field and average it every minute, that should have been a metric from the start. Logs are for investigation. Dashboards that scrape logs will time out the moment the incident produces the volume you most need to read.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Metrics traces and logs as three jobs not three copies of the same stream">
            <defs>
              <marker id="ah-dl1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="28" width="216" height="56" rx="7" />
            <text class="dg-t" x="124" y="50" text-anchor="middle">metrics</text>
            <text class="dg-s" x="124" y="68" text-anchor="middle">known questions</text>
            <rect class="dg-box p" x="252" y="28" width="216" height="56" rx="7" />
            <text class="dg-t" x="360" y="50" text-anchor="middle">traces</text>
            <text class="dg-s" x="360" y="68" text-anchor="middle">one request path</text>
            <rect class="dg-box y" x="488" y="28" width="216" height="56" rx="7" />
            <text class="dg-t" x="596" y="50" text-anchor="middle">logs</text>
            <text class="dg-s" x="596" y="68" text-anchor="middle">unknown strings</text>
            <text class="dg-s" x="16" y="112">Join them with a trace_id. Without it you have three silos and a grep lottery.</text>
            <text class="dg-s" x="16" y="130">Loss of some info lines in a spike is acceptable. Loss of the request path is not.</text>
            <path class="dg-line blue" d="M232 56 H248" marker-end="url(#ah-dl1)" />
            <path class="dg-line blue" d="M468 56 H484" marker-end="url(#ah-dl1)" />
          </svg>
          <figcaption>Figure 1 — Three signals, one join key. Logging design starts at that join, not at the indexer logo.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dl-struct">Structured logs and trace IDs</h3>
        <p>A line is a JSON object (or protobuf) with a schema: timestamp, severity, service, host, trace_id, span_id, message, and a small bag of typed fields. Unstructured "human" sentences cannot be filtered without regex theatre, and regex theatre is how you miss the outage.</p>
        <p>The trace_id is how you jump from a span in the APM tool to the lines that explain it. If 20% of lines lack it, you do not have distributed logging; you have 10,000 unrelated files. Generate the id at the edge, propagate on RPC (<a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a>), and refuse to emit a line without it in production code paths.</p>
        <p>Cardinality in indexed fields is the same bomb as metric labels. A raw user_id as an indexed term creates millions of dictionary entries. Hash or bucket for indexes; put the raw id in a stored-not-indexed field if on-call must grep it.</p>
        <pre><code>{"ts":"2026-09-16T15:02:11.441Z","sev":"ERROR","svc":"checkout",
 "host":"ck-7f","trace":"4bf2…","span":"a91c…","route":"POST /pay",
 "order":"ord_9k","ms":842,"err":"card_declined"}</code></pre>

        <h3 class="lesson-subhead" id="dl-agent">The app must never block on the network store</h3>
        <p>The application writes to a local socket, stdout pipe, or in-process ring buffer. A sidecar or node agent (Fluent Bit, Vector, OpenTelemetry collector) owns disk, batching, backoff and drop. If the store is down, the buffer drops tail lines, not requests. Bounded memory: when full, drop info first, keep error and the lines attached to sampled traces.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="App writes to a local agent, never directly to the network store">
            <defs>
              <marker id="ah-dl2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="70" text-anchor="middle">app</text>
            <text class="dg-s" x="66" y="86" text-anchor="middle">non-block</text>
            <rect class="dg-box p" x="180" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="250" y="70" text-anchor="middle">agent + buffer</text>
            <text class="dg-s" x="250" y="86" text-anchor="middle">drop if full</text>
            <rect class="dg-box b" x="384" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="444" y="70" text-anchor="middle">shipper</text>
            <text class="dg-s" x="444" y="86" text-anchor="middle">batch</text>
            <rect class="dg-box g" x="568" y="52" width="136" height="44" rx="7" />
            <text class="dg-s" x="636" y="70" text-anchor="middle">log store</text>
            <text class="dg-s" x="636" y="86" text-anchor="middle">index / scan</text>
            <path class="dg-line violet" d="M116 74 H176" marker-end="url(#ah-dl2)" />
            <path class="dg-line violet" d="M320 74 H380" marker-end="url(#ah-dl2)" />
            <path class="dg-line violet" d="M504 74 H564" marker-end="url(#ah-dl2)" />
          </svg>
          <figcaption>Figure 2 — The app talks to localhost. The store's outage is a telemetry incident, not a checkout incident.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Wide events beat log spam.</strong> One JSON object per request with the fields you will filter on (status, route, hashed user, duration, downstream errors) plus a stack on failures is more useful than 40 debug lines, and cheaper. Debug lines belong behind a flag.</div>

        <h3 class="lesson-subhead" id="dl-req">Functional and non-functional requirements</h3>
        <p>Functional: ingest from every service; query by time, service, severity, trace_id, and a small set of indexed fields; retain hot data for investigation; archive cold data for compliance; redact secrets before persist. Non-functional: app p99 must not move when logging is sick; ingest lag under a minute at peak after sampling; multi-tenant quotas so one noisy service cannot fill the cluster; the store is widely readable by on-call, so treat it as a production database of accidents.</p>
        <p>Clock source: emit UTC with millisecond precision and attach the trace. Do not sort logs across hosts by wall clock and call it a story. The story is the trace DAG. Host time is for "approximately when this box thought it was." NTP skew of 50 ms is enough to invert two lines from two services on the same request.</p>
        <p>Multi-line stack traces are one event, not twenty lines that another request can interleave. The agent must reassemble or the app must emit the stack as a single JSON field. Interleaved stacks are why people still SSH to boxes during an incident.</p>
      `,
    },
    {
      id: 'dl-intro',
      title: 'Introduction to Distributed Logging',
      children: [
        { id: 'dl-vol', title: 'Volume arithmetic' },
        { id: 'dl-sample', title: 'Head-based versus tail-based sampling' },
        { id: 'dl-sec', title: 'Never log secrets' },
      ],
      html: `
        <h3 class="lesson-subhead" id="dl-vol">Volume arithmetic</h3>
        <p>Do the sum before you pick a vendor. <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> is not optional here; logging is one of the few building blocks whose bill is dominated by bytes, not by QPS of user traffic.</p>
        <pre><code>10,000 hosts * 2,000 lines/s * 400 bytes
  = 8 GB/s ingest
  = 8 * 86400 = 691,200 GB/day  ~ 690 TB/day raw
  Elasticsearch on-disk often 3-5x with replicas + inverted index
    -&gt; multi-petabyte month if you index everything hot

CONCLUSION
  you will not keep all of it hot
  sample successful 200s (1% or adaptive)
  keep 4xx/5xx, slow requests, sampled traces' logs
  hot retention 7-14 days, cold object storage after</code></pre>
        <p>At 8 GB/s, a 10 Gbit NIC is already a lie, let alone a Lucene heap. Sampling is not a cost optimisation bolted on later. It is how the system exists. Wide events shrink line count; they do not remove the need to drop boring successes.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Most success lines dropped, errors and slow requests kept">
            <defs>
              <marker id="ah-dl3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band y" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">KEEP</text>
            <text class="dg-s" x="26" y="58">4xx / 5xx, timeouts, panics</text>
            <text class="dg-s" x="26" y="76">slow requests over SLO</text>
            <text class="dg-s" x="26" y="94">logs for sampled traces</text>
            <text class="dg-s" x="26" y="112">security and audit events</text>
            <rect class="dg-band r" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">DROP OR SAMPLE</text>
            <text class="dg-s" x="382" y="58">healthy 200s at 1 percent</text>
            <text class="dg-s" x="382" y="76">debug behind a flag</text>
            <text class="dg-s" x="382" y="94">health-check chatter</text>
            <text class="dg-s" x="382" y="112">repeated identical info</text>
          </svg>
          <figcaption>Figure 3 — The keep list is the product of on-call. The drop list is how you pay the bill.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dl-sample">Head-based versus tail-based sampling</h3>
        <p>Head-based sampling decides at the start of a request: keep 1% at random. It is simple and will miss the one-in-a-thousand bug that only happens on a particular tenant. Tail-based sampling waits until the request finishes, then keeps the full logs (and spans) if it was slow or failed. Prefer tail-based when you already have traces; the trace decision can drive the log keep.</p>
        <p>You still need a floor of random successes so you have a baseline of "what healthy looks like." Adaptive sampling: raise the keep rate when error rate rises, lower it when the cluster is quiet. Cap per service so a crash loop cannot fill the day.</p>
        <p>Head-based is what you ship on day one because it is a random number at the edge. Tail-based is what you owe on-call once traces exist: the interesting 0.3% is not uniformly distributed. Mix them. A pure tail sampler that only keeps failures will leave you blind to "this tenant's 200s are 8 seconds." Those are successes in HTTP and failures in product.</p>

        <h3 class="lesson-subhead" id="dl-sec">Never log secrets</h3>
        <p>Authorization headers, cookies, query tokens, payment account numbers, session ids, password fields, JWT bodies, the raw body of a login. Redact at the agent with a denylist of keys and a regex for <code>eyJ</code>-shaped tokens. Do not rely on developers remembering; the agent is the last chokepoint before disk that other teams can read.</p>
        <p>Encrypt at rest. Audit who can query. Treat a log store as production data, because it is. This is not optional colour for interviews — it is why companies get fined. If a field cannot be explained to a regulator, it should not be in the line.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Redaction at the agent before the durable store">
            <defs>
              <marker id="ah-dl4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="44" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="64" text-anchor="middle">raw line</text>
            <text class="dg-s" x="96" y="80" text-anchor="middle">may hold token</text>
            <rect class="dg-box r" x="220" y="44" width="200" height="48" rx="7" />
            <text class="dg-s" x="320" y="64" text-anchor="middle">agent redact</text>
            <text class="dg-s" x="320" y="80" text-anchor="middle">keys + regex</text>
            <rect class="dg-box g" x="464" y="44" width="240" height="48" rx="7" />
            <text class="dg-s" x="584" y="64" text-anchor="middle">durable store</text>
            <text class="dg-s" x="584" y="80" text-anchor="middle">on-call can query</text>
            <path class="dg-line rose" d="M176 68 H216" marker-end="url(#ah-dl4)" />
            <path class="dg-line rose" d="M420 68 H460" marker-end="url(#ah-dl4)" />
          </svg>
          <figcaption>Figure 4 — Redact before persist. A later "we will scrub the index" is a breach with extra steps.</figcaption>
        </figure>
      `,
    },
    {
      id: 'dl-des',
      title: 'Design of a Distributed Logging Service',
      children: [
        { id: 'dl-pipe', title: 'Agent, buffer, shipper, queue and store' },
        { id: 'dl-store', title: 'Loki, Elasticsearch and ClickHouse' },
        { id: 'dl-eval', title: 'Where this design falls short' },
        { id: 'dl-quota', title: 'Tenants, noisy neighbours and proof' },
        { id: 'dl-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="dl-pipe">Agent, buffer, shipper, queue and store</h3>
        <p>Sidecar or node agent reads stdout or a socket. Local disk buffer, bounded. Ship in batches with backoff. Fan-out at the collector: errors to a high-priority topic, info to a cheap one. Put a <a href="/learn/modern-system-design/messaging-queue">queue</a> in front of the indexer so a mapping explosion does not stall agents into filling disks on every app host.</p>
        <pre><code>POST /v1/logs          { batch[], dropped, host }   # agent -&gt; collector
GET  /query            service, sev, trace_id, q, from, to
GET  /trace/{id}/logs  # join from APM

# ops
GET  /tenants/{id}/quota
POST /pipelines/sample { rule, keep }</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Collector fans out to a queue then hot store and cold archive">
            <defs>
              <marker id="ah-dl5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="78" text-anchor="middle">collector</text>
            <rect class="dg-box o" x="176" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="236" y="78" text-anchor="middle">Kafka</text>
            <rect class="dg-box b" x="336" y="24" width="160" height="40" rx="7" />
            <text class="dg-s" x="416" y="48" text-anchor="middle">hot 14-day store</text>
            <rect class="dg-box g" x="336" y="84" width="160" height="40" rx="7" />
            <text class="dg-s" x="416" y="108" text-anchor="middle">Parquet on S3</text>
            <rect class="dg-box y" x="536" y="52" width="168" height="44" rx="7" />
            <text class="dg-s" x="620" y="78" text-anchor="middle">query UI</text>
            <path class="dg-line green" d="M136 74 H172" marker-end="url(#ah-dl5)" />
            <path class="dg-line green" d="M296 66 H332 V44" marker-end="url(#ah-dl5)" />
            <path class="dg-line green" d="M296 82 H332 V104" marker-end="url(#ah-dl5)" />
            <path class="dg-line green" d="M496 44 H536 V74" marker-end="url(#ah-dl5)" />
          </svg>
          <figcaption>Figure 5 — Queue as shock absorber. Interactive query on hot data; compliance on cold objects.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dl-store">Loki, Elasticsearch and ClickHouse</h3>
        <table>
          <thead><tr><th>Store</th><th>Index model</th><th>Pick when</th></tr></thead>
          <tbody>
            <tr><td>Elasticsearch</td><td>Inverted index, full-text, hungry RAM</td><td>Ad-hoc search and you can pay</td></tr>
            <tr><td>Loki</td><td>Index labels only, scan chunks</td><td>You already think in Prometheus labels</td></tr>
            <tr><td>ClickHouse</td><td>Columnar, cheap scan, SQL</td><td>Wide events, aggregations, cost control</td></tr>
            <tr><td>S3 + Athena</td><td>None until you query</td><td>Compliance archive, not the 3am path</td></tr>
          </tbody>
        </table>
        <p>A common production shape: OTel collector → Kafka → ClickHouse for 14-day interactive, Parquet to object storage for 400 days, Elasticsearch only for a small "debug this trace" subset if the team still wants Lucene. "ELK for everything" is how the logging cluster becomes the most expensive system you run.</p>
        <p>Index mapping explosions in Elasticsearch deserve a paragraph of fear. A new field name per request (a timestamp in the key, a user id as a field name) creates millions of mappings, then the cluster falls over, then agents buffer, then disks fill, then the app — if you made the mistake of blocking — stalls. Strict mappings, a dead-letter index for rejects, and the queue in Figure 5 are how you survive a well-meaning debug field.</p>
        <p>Loki is cheap if your filters are the labels you already have (service, cluster, level). It is painful if on-call greps free text across a terabyte of chunks at incident time. ClickHouse shines when the unit is a wide event you can GROUP BY. Elasticsearch shines when the unit is an unknown sentence. Match the store to the query, not to the resume.</p>
        <p>Object storage is not a 3am tool. Athena or a Parquet scan over 400 days is for compliance, slow forensics, and training a new index. Hot query has to hit a system that has already paid for an index or a sparse label set. Designing one store for both jobs is how you get a cluster that is expensive and still slow.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Three stores compared by index versus scan">
            <defs>
              <marker id="ah-dl6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="126" y="60" text-anchor="middle">Elasticsearch</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">index every token</text>
            <rect class="dg-box p" x="250" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="360" y="60" text-anchor="middle">Loki</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">labels then scan</text>
            <rect class="dg-box g" x="484" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="594" y="60" text-anchor="middle">ClickHouse</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">columns + SQL</text>
            <path class="dg-line cyan" d="M236 68 H246" marker-end="url(#ah-dl6)" />
            <path class="dg-line cyan" d="M470 68 H480" marker-end="url(#ah-dl6)" />
          </svg>
          <figcaption>Figure 6 — Cost follows the index. Full-text is a feature you buy, not a default.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dl-eval">Where this design falls short</h3>
        <p>You will still lose logs in a correlated failure (every agent buffer full at once). You cannot prove a negative ("this line never happened") after sampling. Clock skew makes order across hosts a lie without the trace. Multi-tenant: one noisy service fills the cluster; per-tenant quotas are mandatory and rarely built in v1.</p>
        <p>Tail-based sampling needs the request to finish in a place that still holds the buffered lines; a crash mid-request loses the interesting half. And logs remain a terrible dashboard — if you are averaging a parsed field to get a metric, go back to Chapter 13.</p>

        <h3 class="lesson-subhead" id="dl-quota">Tenants, noisy neighbours and proof</h3>
        <p>One checkout service in a crash loop can emit 50× its usual volume. Without a per-service byte quota at the collector, that loop is how you lose everyone else's errors in the same minute you most need them. Drop the noisy tenant's info lines first; never drop another tenant's errors to make room. Publish the drop counter as a metric (Chapter 13) so the noisy team gets paged for telemetry, not for a silent hole.</p>
        <p>Sampling also destroys proof. "We never logged a refund for order X" is not a statement you can defend in a dispute after a 1% keep on 200s. Audit events (refunds, permission changes, logins) ride a separate, unsampled, longer-retained pipe. Mixing audit into the debug firehose is how finance learns about sampling the hard way.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Per tenant quota protecting error lines of quiet services">
            <defs>
              <marker id="ah-dl7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">noisy service</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">quota drop info</text>
            <rect class="dg-box g" x="260" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="370" y="64" text-anchor="middle">quiet service</text>
            <text class="dg-s" x="370" y="80" text-anchor="middle">errors still land</text>
            <rect class="dg-box y" x="504" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="604" y="64" text-anchor="middle">audit pipe</text>
            <text class="dg-s" x="604" y="80" text-anchor="middle">never sampled</text>
            <path class="dg-line rose" d="M236 68 H256" marker-end="url(#ah-dl7)" />
            <path class="dg-line rose" d="M480 68 H500" marker-end="url(#ah-dl7)" />
          </svg>
          <figcaption>Figure 7 — Quotas are isolation. Audit is a different product from debug logs.</figcaption>
        </figure>
        <p>Local disks on app hosts are not a backup of the log store. If the agent cannot ship, you have minutes of buffer, not days. Planning "we will drain host disks after the Elastic outage" is how you discover the disks were already full of info-level chatter. Bound the buffer in minutes of worst-case errors, not in "a generous 20 GB."</p>
        <p>PII in traces is the same incident as PII in logs. If the trace exporter dumps HTTP headers, you have two pipes to redact. Align the denylist. On-call tools that jump from span to logs will otherwise display the secret the agent just stripped from the sibling signal.</p>

        <h3 class="lesson-subhead" id="dl-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) 10k hosts, 2k lines/s, 400 B — why can you not index all of it? (2) Where does the app block, and what should happen when the buffer is full? (3) Why does every line need a trace_id? (4) Pick a store for "grep this order_id" versus "p99 by route for 14 days" and justify cost.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Distributed logging pipelines and stores are standard industry practice; all explanations, diagrams, tables and exercises are our own.',
};
