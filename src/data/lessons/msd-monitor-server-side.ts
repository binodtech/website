/** Modern System Design — Chapter 14: Server-Side Monitoring Design.
 *  The pipeline from instrumentation to dashboards, and the storage, sharding,
 *  compression and alerting choices that make it survive production scale.
 */

export const msdMonitorServerSide = {
  slug: 'monitor-server-side',
  title: 'Design of a Server-Side Monitoring System',
  subtitle:
    'Chapter 13 named the telemetry. This chapter draws the pipeline that carries it: agents, ingest, queues, a time-series store, query, alerting, and dashboards that are useful in an incident rather than impressive in a demo.',
  byline: 'Modern System Design · Chapter 14 · ~1h 45m read · Intermediate',
  interviewTip:
    'Draw the pipeline left to right — instrumentation, agent, ingest, queue, TSDB, query, alert, dashboard — and then spend your remaining time on the store. Interviewers care whether you know Gorilla-style compression, why you downsample, how you shard by metric name plus labels, and why an alert must fire for a duration rather than on a single sample. Finish by saying traces are sampled and dashboards exist for the on-call, not for executives.',
  sections: [
    {
      id: 'ss-design',
      title: 'Design of a Monitoring System',
      children: [
        { id: 'ss-req', title: 'Requirements, functional and non-functional' },
        { id: 'ss-pipe', title: 'The pipeline, end to end' },
        { id: 'ss-agent', title: 'Instrumentation and the agent' },
        { id: 'ss-ingest', title: 'Ingest, fan-in and the queue' },
      ],
      html: `
        <p><a href="/learn/modern-system-design/distributed-monitoring">Chapter 13</a> gave us types, SLIs and a volume estimate. Now we have to move samples from a process to a human without losing them during the outage they describe. That is a pipeline with a store in the middle, not a library call.</p>

        <h3 class="lesson-subhead" id="ss-req">Requirements, functional and non-functional</h3>
        <p>Functional: accept metrics (and optionally traces) from every replica; store them for weeks at full resolution and months at coarser resolution; query ranges and instant values; evaluate alert rules; render dashboards. Non-functional: ingest must keep up with the scrape or push rate from Chapter 13; query p95 under a second for the on-call's default boards; durability of recent samples across one AZ failure; the stack more available than the product, as already argued.</p>
        <p>Out of scope here: client RUM (Chapter 15), full log indexing (Chapter 22). Those share the "do not block the app" rule but have different stores.</p>
        <table>
          <thead><tr><th>Requirement</th><th>Target we will design to</th></tr></thead>
          <tbody>
            <tr><td>Ingest</td><td>tens of thousands of samples/s, burst 10×</td></tr>
            <tr><td>Query</td><td>p95 &lt; 1 s for 6-hour golden-signal boards</td></tr>
            <tr><td>Retention</td><td>15 s resolution for 15 days; 5 min for 1 year</td></tr>
            <tr><td>Alert delay</td><td>evaluate every 15–30 s; fire after for-duration</td></tr>
            <tr><td>Availability</td><td>one extra nine vs the product</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="ss-pipe">The pipeline, end to end</h3>
        <p>The path is linear on purpose. Each hop exists to protect the next from the previous: instrumentation is in-process and cheap; the agent batches and buffers; ingest authenticates and rate-limits; a queue absorbs spikes; the TSDB owns durability and compression; query and alert read replicas; dashboards are a thin client of query.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Monitoring pipeline from instrumentation to dashboards">
            <defs>
              <marker id="ah-ss1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="12" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="52" y="42" text-anchor="middle">instr.</text>
            <text class="dg-s" x="52" y="56" text-anchor="middle">in-proc</text>
            <rect class="dg-box c" x="108" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="148" y="42" text-anchor="middle">agent</text>
            <text class="dg-s" x="148" y="56" text-anchor="middle">buffer</text>
            <rect class="dg-box g" x="204" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="244" y="42" text-anchor="middle">ingest</text>
            <text class="dg-s" x="244" y="56" text-anchor="middle">auth</text>
            <rect class="dg-box y" x="300" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="340" y="42" text-anchor="middle">queue</text>
            <text class="dg-s" x="340" y="56" text-anchor="middle">spikes</text>
            <rect class="dg-box o" x="396" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="436" y="42" text-anchor="middle">TSDB</text>
            <text class="dg-s" x="436" y="56" text-anchor="middle">compress</text>
            <rect class="dg-box p" x="492" y="24" width="80" height="44" rx="6" />
            <text class="dg-s" x="532" y="42" text-anchor="middle">query</text>
            <text class="dg-s" x="532" y="56" text-anchor="middle">alert</text>
            <rect class="dg-box i" x="588" y="24" width="120" height="44" rx="6" />
            <text class="dg-s" x="648" y="42" text-anchor="middle">dashboards</text>
            <text class="dg-s" x="648" y="56" text-anchor="middle">pager</text>
            <path class="dg-line blue" d="M92 46 H104" marker-end="url(#ah-ss1)" />
            <path class="dg-line blue" d="M188 46 H200" marker-end="url(#ah-ss1)" />
            <path class="dg-line blue" d="M284 46 H296" marker-end="url(#ah-ss1)" />
            <path class="dg-line blue" d="M380 46 H392" marker-end="url(#ah-ss1)" />
            <path class="dg-line blue" d="M476 46 H488" marker-end="url(#ah-ss1)" />
            <path class="dg-line blue" d="M572 46 H584" marker-end="url(#ah-ss1)" />
            <text class="dg-s" x="16" y="96">Each hop trades a bit of lag for isolation.</text>
            <text class="dg-s" x="16" y="114">Sync ingest into the TSDB lets compaction stall every agent.</text>
            <text class="dg-s" x="16" y="132">The queue exists so a TSDB restart is not a lost scrape window.</text>
            <text class="dg-s" x="16" y="150">Agents drop or sample; they never block the request thread.</text>
          </svg>
          <figcaption>Figure 1 — The pipeline you should be able to draw from memory in an interview.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-agent">Instrumentation and the agent</h3>
        <p>In-process counters and histograms must be lock-free or striped. The agent (sidecar or daemon) scrapes or receives pushes, adds resource labels (pod, zone), and ships batches. If the agent blocks on a full buffer, you have coupled the product to the monitor — the original sin. Bounded buffer, drop-oldest or sample, metric on drops. That drop metric is how you know the picture is a lie.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="In-process metrics to a bounded agent buffer">
            <defs>
              <marker id="ah-ss2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="160" height="52" rx="7" />
            <text class="dg-s" x="96" y="70" text-anchor="middle">app, never blocks</text>
            <rect class="dg-box y" x="228" y="40" width="200" height="52" rx="7" />
            <text class="dg-s" x="328" y="70" text-anchor="middle">agent bounded buf</text>
            <rect class="dg-box g" x="480" y="40" width="220" height="52" rx="7" />
            <text class="dg-s" x="590" y="70" text-anchor="middle">batch to ingest</text>
            <path class="dg-line green" d="M176 66 H224" marker-end="url(#ah-ss2)" />
            <path class="dg-line green" d="M428 66 H476" marker-end="url(#ah-ss2)" />
          </svg>
          <figcaption>Figure 2 — A full agent buffer drops samples. It does not pause checkout.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-ingest">Ingest, fan-in and the queue</h3>
        <p>Ingest authenticates tenants, rejects unbounded cardinality (user_id as a label is how TSDBs die), and writes a durable queue (Kafka, Pub/Sub). The TSDB consumes at its compaction pace. Back-pressure stops at the queue, not at the app. Burst 10× at deploy time is normal; size the queue for tens of minutes, not tens of seconds, or a TSDB restart becomes a monitoring blackout during the incident you needed it for.</p>
        <p>Multi-tenant ingest needs per-tenant tokens and per-tenant series caps. One customer sending a unique label per HTTP path including query strings will take the cluster down for everyone. The polite response is 429 on write, not silent drop of everyone else's samples. That is the same fail-closed instinct as login rate limits in Chapter 19.</p>
        <pre><code>50k samples/s × 40 B compressed ≈ 2 MB/s steady
burst 10× for 10 min → extra ~1.2 GB in the queue
cardinality cap: 1e6 active series per tenant as a starting fight</code></pre>
      `,
    },
    {
      id: 'ss-detail',
      title: 'Detailed Design of a Monitoring System',
      children: [
        { id: 'ss-tsdb', title: 'The time-series store and Gorilla-style compression' },
        { id: 'ss-down', title: 'Downsampling, retention and sharding' },
        { id: 'ss-alert', title: 'Alerting: for-duration, not a single spike' },
        { id: 'ss-trace', title: 'Tracing, sampling and joining to metrics' },
        { id: 'ss-api', title: 'A sketch of the query and write APIs' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ss-tsdb">The time-series store and Gorilla-style compression</h3>
        <p>Facebook's Gorilla paper is the compression story you should know: timestamps are delta-of-delta, values are XOR of consecutive floats with leading/trailing zero compression. Regular 15 s gauges compress absurdly well (often 1–2 bytes per sample). That is why a TSDB can keep weeks of high-resolution data in RAM or cheap SSD when a naive row store would not. Irregular events compress worse; do not promise Gorilla ratios for sparse traces.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Gorilla delta-of-delta timestamps and XOR values">
            <rect class="dg-box b" x="16" y="28" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="50" text-anchor="middle">timestamp deltas</text>
            <text class="dg-s" x="126" y="66" text-anchor="middle">regular scrape → tiny</text>
            <rect class="dg-box g" x="256" y="28" width="220" height="56" rx="7" />
            <text class="dg-s" x="366" y="50" text-anchor="middle">value XOR chain</text>
            <text class="dg-s" x="366" y="66" text-anchor="middle">stable gauges win</text>
            <rect class="dg-box y" x="496" y="28" width="204" height="56" rx="7" />
            <text class="dg-s" x="598" y="50" text-anchor="middle">~1–2 B / sample</text>
            <text class="dg-s" x="598" y="66" text-anchor="middle">not for sparse logs</text>
            <text class="dg-s" x="16" y="112">Block layout: many samples of one series, not one row per sample.</text>
            <text class="dg-s" x="16" y="130">Query is scan of compressed blocks, then decode.</text>
          </svg>
          <figcaption>Figure 3 — Compression is a layout choice. Row-per-sample stores will not hit Gorilla densities.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-down">Downsampling, retention and sharding</h3>
        <p>Keep 15 s for 15 days for paging. Roll up to 1 min / 5 min for months. Downsampling is not "delete points"; it is min/max/avg/count so you do not lie about peaks. Shard by hash(metric name + identifying labels), not by time alone (time sharding makes "now" a hot shard). High-cardinality labels blow the shard map — reject them at ingest.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Hot high-resolution data rolling into coarse long retention">
            <defs>
              <marker id="ah-ss3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="62" text-anchor="middle">15s for 15 days</text>
            <text class="dg-s" x="116" y="78" text-anchor="middle">page from this</text>
            <rect class="dg-box o" x="260" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="360" y="62" text-anchor="middle">5 min for 1 year</text>
            <text class="dg-s" x="360" y="78" text-anchor="middle">keep min max avg</text>
            <rect class="dg-box g" x="504" y="40" width="196" height="56" rx="7" />
            <text class="dg-s" x="602" y="70" text-anchor="middle">capacity holds</text>
            <path class="dg-line hot" d="M216 68 H256" marker-end="url(#ah-ss3)" />
            <path class="dg-line hot" d="M460 68 H500" marker-end="url(#ah-ss3)" />
          </svg>
          <figcaption>Figure 4 — Downsample with aggregates. Mean-only rollups hide the spike that paged you.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-alert">Alerting: for-duration, not a single spike</h3>
        <p>A single 15 s sample above threshold is noise: a GC pause, a scrape blip, a deploy. Rules should be <code>for: 5m</code> (Prometheus-speak): the condition must hold across evaluations. That trades a few minutes of extra MTTD for a night of sleep. Alerting evaluates on a schedule against the TSDB (or a streaming subset of golden signals). Deduplicate, group, and route; a thousand firing series is one incident if they share a scrape failure.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Alert fires only after the condition holds for a duration">
            <rect class="dg-box r" x="16" y="28" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="56" text-anchor="middle">one spike</text>
            <rect class="dg-box y" x="200" y="28" width="200" height="48" rx="7" />
            <text class="dg-s" x="300" y="56" text-anchor="middle">still high at +2m</text>
            <rect class="dg-box r" x="424" y="28" width="276" height="48" rx="7" />
            <text class="dg-s" x="562" y="56" text-anchor="middle">for 5m → page</text>
            <text class="dg-s" x="16" y="100">Pending is not firing. Firing is not resolved until healthy for a while.</text>
            <text class="dg-s" x="16" y="118">Flap loops are how on-call learns to ignore you.</text>
            <text class="dg-s" x="16" y="136">Symptom alerts (SLI) beat cause alerts (CPU) at 03:00.</text>
          </svg>
          <figcaption>Figure 5 — For-duration is the difference between a pager and a random number generator.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-trace">Tracing, sampling and joining to metrics</h3>
        <p>Traces are too fat to keep 100%. Head-based sampling (decide at the start) is simple and biased against rare errors; tail-based (keep if the trace was slow or errored) needs a buffer. Join to metrics by shared labels (service, route), not by stuffing every trace id into the TSDB. Exemplars are the civilised bridge: a metric point may point at one example trace. Clock skew between traces and metrics makes joins look like bugs; NTP is part of the monitoring design, which is an embarrassing sentence and a true one.</p>

        <h3 class="lesson-subhead" id="ss-api">A sketch of the query and write APIs</h3>
        <pre><code>POST /write   protobuf|prometheus remote write
GET  /query?expr=&amp;start=&amp;end=&amp;step=
GET  /query_range  (graphs)
POST /alerts/rules
# expr looks like: sum(rate(http_requests_total{job="api"}[5m]))</code></pre>
        <p>Writes are batched. Queries that would scan 1e8 series are rejected. This is a product feature, not rudeness. Recording rules (pre-aggregate golden signals) exist because the on-call board cannot afford to compute <code>histogram_quantile</code> over raw samples during an incident. Pay that CPU on ingest or on a five-minute batch, not on every dashboard refresh.</p>
        <p>HA of the TSDB itself is replication of recent blocks plus object-storage of older ones. Compaction must not stall writes: that is why the queue exists. If you run Prometheus locally on each app host you have not designed this chapter — you have a scrape target. Federation and remote-write are how that becomes a system.</p>
      `,
    },
    {
      id: 'ss-viz',
      title: 'Visualize Data in a Monitoring System',
      children: [
        { id: 'ss-dash', title: 'Dashboards for incidents, not demos' },
        { id: 'ss-eval', title: 'Where this design falls short' },
        { id: 'ss-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ss-dash">Dashboards for incidents, not demos</h3>
        <p>The default board is golden signals: latency, traffic, errors, saturation, plus deploy markers. Ten panels you can read at 3am beat forty colourful histograms. Link from alert to the board with the firing labels already templated. Heatmaps for latency, not only averages. Averages hide the p99 that users feel. Dark-mode and huge fonts are not a joke: the on-call is tired. Unit tests for dashboards do not exist, so treat JSON board files as code in review.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Incident dashboard layout with golden signals">
            <rect class="dg-box r" x="16" y="20" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="48" text-anchor="middle">errors</text>
            <rect class="dg-box y" x="192" y="20" width="160" height="48" rx="7" />
            <text class="dg-s" x="272" y="48" text-anchor="middle">latency p99</text>
            <rect class="dg-box b" x="368" y="20" width="160" height="48" rx="7" />
            <text class="dg-s" x="448" y="48" text-anchor="middle">traffic</text>
            <rect class="dg-box o" x="544" y="20" width="160" height="48" rx="7" />
            <text class="dg-s" x="624" y="48" text-anchor="middle">saturation</text>
            <rect class="dg-band g" x="16" y="84" width="688" height="48" rx="8" />
            <text class="dg-s" x="32" y="112">Deploy annotations on the same time axis — otherwise you debug ghosts.</text>
          </svg>
          <figcaption>Figure 6 — Dashboards exist to shorten time-to-hypothesis, not to impress a quarterly review.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ss-eval">Where this design falls short</h3>
        <p>Cardinality explosions still happen (a new label "request_id"). Multi-tenant noisy neighbours share ingest. The monitor can be up while the product's DNS is down — you need <a href="/learn/modern-system-design/monitor-client-side">Chapter 15</a>. Alerting on raw CPU creates pages that teach people to ignore pages. Downsampled data will not reconstruct a 2-second blip a year later. Tracing at 1% will miss the one poisoned tenant. This pipeline is necessary and not sufficient. Long-term storage in object stores is cheap until query from S3 is the incident. Keep paging data hot.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 120" role="img" aria-label="Monitoring holes including cardinality and client-side blind spot">
            <rect class="dg-band r" x="12" y="16" width="696" height="88" rx="10" />
            <text class="dg-h" x="26" y="36">HOLES</text>
            <text class="dg-s" x="26" y="58">unbounded labels, DNS-only outages, mean-only graphs</text>
            <text class="dg-s" x="26" y="76">sampled traces miss rares; monitor ≠ user eyeballs</text>
          </svg>
          <figcaption>Figure 7 — The evaluation slide: monitoring that only watches servers will green-bar a DNS outage.</figcaption>
        </figure>

        <p>On-call hygiene is part of the design. A unit that pages on a missing scrape for one pod will never be trusted. Group by job, not by instance, unless the instance is a singleton. Silence windows during known deploys, but never a global mute that hides a real error-budget burn.</p>
        <p>Capacity for the monitor: if ingest is 50k samples/s and a block is two hours, plan disk for the hot window plus compaction overhead of ~2× until the extra copies drop. Object storage of cold blocks needs a catalogue; losing the catalogue is losing history even if the bytes remain.</p>
        <p>Remote-write fan-out to a second region is how you survive an AZ fire in the monitor itself. That replica is for paging, not for a perfect copy of every debug metric. Prioritise golden signals on the wire when the queue is backing up — drop high-cardinality custom metrics first.</p>
        <p>PromQL-style queries that do <code>group by</code> on an unbounded label will OOMs the querier. Protect query with timeouts and max samples, the same way ingest has a series cap. A dashboard should never be allowed to take down alerting.</p>
        <p>Blackbox probes (HTTP GET the public URL from extra networks) belong next to this pipeline even though they are not server-side samples. Chapter 15 owns the client story; a single extra probe is the cheap overlap you should still mention.</p>
        <p>Log/metric correlation: a trace id in a structured log is not a substitute for a TSDB. During an incident you want both, and you want the clocks close. That is operational, not a box, and it still belongs in the design notes.</p>
        <p>Finally, the monitor must not use the product's load balancer in a way that a product outage hides the monitor. Separate DNS name, separate cert, preferably a separate account. Eating your own dog food is good until the dog food is on fire.</p>
        <p>Histograms need explicit buckets. Dynamic buckets explode series count. Pick latency buckets once, in milliseconds that match SLOs (50, 100, 200, 500, 1000, 2500, 5000), and live with them.</p>
        <p>Counters must be monotonic in-process and reset on restart. Rate() over a reset is a negative spike that pages fools. The TSDB and the query language should treat resets as defined, not as errors.</p>
        <p>Gauges (heap, queue depth) are point-in-time. Alerting on a gauge with for-duration still needs the scrape to keep seeing the bad value. A 15 s scrape and a 5 m for-duration is about twenty samples. Say that number.</p>
        <p>Push versus pull: pull (scrape) gives you a discovery story and natural liveness; push (agents) survives short-lived jobs. Most shops are hybrid. Batch jobs must push or you never see them.</p>
        <p>Service discovery (Kubernetes endpoints, Consul) is how scrape targets appear. Stale targets after a scale-in create scrape errors that look like instance death. Tombstone them quickly.</p>
        <p>Recording rules should be versioned with the dashboards. A board that queries a rule you renamed last Tuesday is an incident inside the incident.</p>
        <p>Alert routing: pager for SLI burn, ticket for disk at 70%, nothing for disk at 40%. If everything pages, nothing pages. Match severity to human sleep.</p>
        <p>Silence and inhibition: inhibit "instance down" when "the whole job is down". Otherwise you get a page storm that hides the cluster-level fact.</p>
        <p>Runbooks linked from the alert are part of the system. An alert without a next step is a noise generator. The design of monitoring includes the document the human opens.</p>
        <p>Cost: high-cardinality metrics are a bill as well as an outage. Chargeback per tenant series is how you keep marketing's event names out of the hot TSDB.</p>
        <p>Test the pipeline by breaking it in staging: stop Kafka, fill the agent buffer, expire a cert on ingest. If you have never done that, the first test is production.</p>
        <p>Downsample jobs must be idempotent. Running twice should not double-count. Store the watermark of the last compacted block.</p>
        <p>Query caching of dashboard ranges is valid for 15–30 s. Longer caches make a deploy annotation appear late, which is how you mis-time a rollback.</p>
        <p>Keep a paper (or phone) list of "how to reach the TSDB when SSO is down". Chapter 44 will thank you.</p>
        <p>Exemplars should sample errors more heavily than successes. Otherwise the one trace you click is a 12 ms happy path.</p>
        <p>Cardinality guardrails belong in CI: a unit test that a new metric's label set is in an allow-list. Reviewers miss this in PRs.</p>
        <p>Keep raw samples for paging; keep only aggregates for exec dashboards. Mixing those audiences on one board creates both noise and missing spikes.</p>
        <p>Shard rebalancing of the TSDB should pause alerting evaluation or you will page on empty windows. Treat storage ops as prod events.</p>
        <p>WAL of the TSDB is the durability of "what just happened". Losing the last 30 s of samples during the outage is the classic irony; fsync the WAL.</p>
        <p>Multi-cluster query (Thanos/Mimir style) adds a gather hop. The same tail-latency story as search: the slowest store owns p99.</p>
        <p>Do not scrape the monitoring stack with the same scrape interval so tightly that the monitor DDoSes itself. Stagger.</p>
        <p>A weekly review of the noisiest alerts is a design activity. Retired alerts are how for-duration stays honest.</p>
        <p>Keep alert text short and include the burning SLI, the window, and a board URL. Novels are not read at 3am.</p>
        <p>Histogram quantiles from too few samples lie. Do not page on p99 of 20 requests. Require a minimum traffic gate.</p>
        <p>Name series so humans can grep. <code>http_server_requests</code> beats <code>s1</code>. This is a design choice with operational value.</p>
        <p>Offload long-range queries to a replica or object-store store so paging queries stay on hot SSD.</p>
        <p>If you outsource the TSDB, you still own cardinality, scrape config, and alert quality. The vendor does not know your SLO.</p>
        <p>Document the drop policy of every buffer in this pipeline. Undocumented drops are how you debug ghosts.</p>
        <p>The last requirement: the monitor's own SLOs, paged to a different team if needed. Recursive, and necessary.</p>
        <p>Label <code>le</code> on histograms is a bucket bound, not a latency. Misreading it in an interview is common; do not.</p>
        <p>Keep scrape timeouts shorter than scrape intervals or you pile overlapping scrapes and invent load.</p>
        <p>This pipeline is the answer. The store is the interview. For-duration is the pager. Say all three.</p>
        <p>Chapter 13 named the signals. This chapter ships them. Do not skip the queue.</p>
        <p>Synthetic SLIs (canary user) sitting next to real traffic SLIs catch the DNS class of failure Chapter 15 exists for. Budget one.</p>

        <h3 class="lesson-subhead" id="ss-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is there a queue between ingest and the TSDB? (2) What does Gorilla compress, and why do irregular events fare worse? (3) Why downsample with min/max, not only mean? (4) Why must an alert fire for a duration?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Time-series pipelines, Gorilla-style compression and for-duration alerting are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
