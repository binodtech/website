/** Modern System Design — Chapter 13: Distributed Monitoring.
 *  Why you cannot operate a system you cannot observe, and what a monitoring
 *  system actually has to collect before you draw any architecture.
 */

export const msdDistributedMonitoring = {
  slug: 'distributed-monitoring',
  title: 'Distributed Monitoring',
  subtitle:
    'A distributed system fails in grey, partial ways that a process heartbeat cannot see. This chapter is the vocabulary and the constraints: telemetry types, metric shapes, cardinality, push versus pull, golden signals, and why the monitoring plane must outlive the system it watches.',
  byline: 'Modern System Design · Chapter 13 · ~1h 15m read · Intermediate',
  interviewTip:
    'When an interviewer asks "how do you know it is working?", do not say "we will add monitoring". Name the SLI, the SLO, and the telemetry type. "p99 checkout latency under 300 ms is the SLO; we scrape a histogram from each replica, alert on the 5-minute burn of the error budget, and we never average percentiles across hosts." That sentence shows you have operated something. Then add the trap: grey failures from Chapter 3 look healthy on liveness probes and still miss the SLO.',
  sections: [
    {
      id: 'dm-design',
      title: 'System Design: Distributed Monitoring',
      children: [
        { id: 'dm-why', title: 'The problem monitoring actually solves' },
        { id: 'dm-grey', title: 'Grey failure is the reason this is hard' },
        { id: 'dm-sli', title: 'SLIs and SLOs are the contract, not dashboards' },
        { id: 'dm-pillars', title: 'Metrics, logs and traces are not interchangeable' },
        { id: 'dm-map', title: 'What this chapter will not yet design' },
      ],
      html: `
        <p>You can design a beautiful service and still be unable to run it. The moment the system spans more than one machine, "is it up?" stops being a yes-or-no question. A replica can be alive, answering, and wrong. Another can be dead in a way that health checks never notice. Distributed monitoring exists to turn that fog into numbers you can act on.</p>
        <p>This chapter does not yet draw the full pipeline — that is <a href="/learn/modern-system-design/monitor-server-side">Chapter 14</a>. It establishes the problem, the contract (SLIs and SLOs from <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a>), and the vocabulary. Skip this and every dashboard you build later will measure the wrong thing.</p>

        <h3 class="lesson-subhead" id="dm-why">The problem monitoring actually solves</h3>
        <p>A single process can be watched with a heartbeat. A distributed system cannot. Requests fan out across gateways, caches, queues and stores. Any one of those can fail independently, and the user-visible symptom often appears far from the component that caused it.</p>
        <p>Monitoring is the subsystem whose job is to answer three operational questions in time to matter: is the user still succeeding, how close are we to the SLO, and where should a human look first? Metrics answer the first two cheaply. Logs and traces answer the third, at much higher cost.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Three questions monitoring must answer: user success, SLO burn, and where to look">
            <defs>
              <marker id="ah-dm1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">MONITORING ANSWERS THREE QUESTIONS, NOT "IS THE BOX PINGABLE"</text>
            <rect class="dg-box b" x="16" y="36" width="220" height="70" rx="8" />
            <text class="dg-t" x="126" y="60" text-anchor="middle">1 · user success?</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">error rate, latency</text>
            <rect class="dg-box o" x="250" y="36" width="220" height="70" rx="8" />
            <text class="dg-t" x="360" y="60" text-anchor="middle">2 · SLO burn?</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">error budget left</text>
            <rect class="dg-box g" x="484" y="36" width="220" height="70" rx="8" />
            <text class="dg-t" x="594" y="60" text-anchor="middle">3 · where to look?</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">logs and traces</text>
            <rect class="dg-band y" x="16" y="124" width="688" height="72" rx="10" />
            <text class="dg-s" x="30" y="148">A liveness probe answers none of these. It tells you a process accepted a TCP connection.</text>
            <text class="dg-s" x="30" y="166">Grey failure from Chapter 3 is exactly the state where probes are green and users are not.</text>
            <text class="dg-s" x="30" y="184">That is why this chapter starts with failure models, not with Grafana.</text>
            <path class="dg-line blue" d="M236 71 H246" marker-end="url(#ah-dm1)" />
            <path class="dg-line blue" d="M470 71 H480" marker-end="url(#ah-dm1)" />
          </svg>
          <figcaption>Figure 1 — Monitoring is a product for operators. Ping is not that product.</figcaption>
        </figure>
        <p>Treat monitoring as a product with users (on-call engineers) and an SLO of its own. If the product is "pretty graphs", you will ship dashboards nobody opens during an incident. If the product is "page me when the user is failing, with a trace ID", the architecture follows.</p>

        <h3 class="lesson-subhead" id="dm-grey">Grey failure is the reason this is hard</h3>
        <p><a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> drew four indistinguishable causes of a timeout. Monitoring inherits that cruelty. A replica can shed 5% of requests, return 200 with empty bodies, or stall just inside the client timeout. From the load balancer it still looks "healthy" because the health check is a cheap path that never exercises the slow code.</p>
        <p>Partial failure is worse than a crash. A crash is obvious: traffic moves, alerts fire, the replica disappears from the pool. Partial failure keeps the replica in the pool, poisoning a fraction of users, and every aggregate that averages across hosts hides it. That last sentence is why this chapter will refuse to let you average percentiles.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Healthy probe path versus the real request path that is failing">
            <defs>
              <marker id="ah-dm2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-dm2b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band g" x="12" y="16" width="340" height="168" rx="11" />
            <text class="dg-h" x="26" y="36">HEALTH CHECK PATH</text>
            <rect class="dg-box g" x="26" y="48" width="312" height="28" rx="6" />
            <text class="dg-s" x="182" y="66" text-anchor="middle">GET /healthz → 200 in 2 ms</text>
            <text class="dg-s" x="26" y="98">Does not touch the database, the cache,</text>
            <text class="dg-s" x="26" y="114">or the slow dependency. Always green</text>
            <text class="dg-s" x="26" y="130">while those are on fire.</text>
            <text class="dg-s" x="26" y="154">Useful for "is the process up".</text>
            <text class="dg-s" x="26" y="170">Useless as an SLI.</text>
            <rect class="dg-band r" x="368" y="16" width="340" height="168" rx="11" />
            <text class="dg-h" x="382" y="36">REAL USER PATH</text>
            <rect class="dg-box r" x="382" y="48" width="312" height="28" rx="6" />
            <text class="dg-s" x="538" y="66" text-anchor="middle">POST /checkout → p99 = 4.2 s</text>
            <text class="dg-s" x="382" y="98">Touches auth, inventory, payments,</text>
            <text class="dg-s" x="382" y="114">and a queue. This is the SLI.</text>
            <text class="dg-s" x="382" y="130">When this is red, users are failing</text>
            <text class="dg-s" x="382" y="154">even if every /healthz is green.</text>
            <text class="dg-s" x="382" y="170">Alert here, not on the left.</text>
          </svg>
          <figcaption>Figure 2 — Grey failure is the gap between these two paths. Monitor the right-hand one.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Health checks are not SLIs.</strong> Use them to take a dead process out of rotation. Never page a human because a health check failed unless the user-facing SLI failed too — otherwise you train the on-call to ignore pages.</div>

        <h3 class="lesson-subhead" id="dm-sli">SLIs and SLOs are the contract, not dashboards</h3>
        <p><a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a> defined availability as a number. An <strong>SLI</strong> (service level indicator) is the measurement; an <strong>SLO</strong> (service level objective) is the target on that measurement. "Latency is good" is neither. "The fraction of checkout requests faster than 300 ms, measured at the gateway, over 30 days, is at least 99.9%" is both.</p>
        <p>The SLO creates an <strong>error budget</strong>: the 0.1% of checkouts that may be slow or wrong. Spend it on shipping. Exhaust it and you freeze changes. Monitoring's job is to compute that budget in near real time so the freeze happens before users do it for you on social media.</p>
        <table>
          <thead><tr><th>Term</th><th>What it is</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>SLI</td><td>A carefully defined ratio or distribution</td><td>successes / total at the edge</td></tr>
            <tr><td>SLO</td><td>A target on that SLI, with a window</td><td>99.9% over 30 days</td></tr>
            <tr><td>SLA</td><td>A contract with money attached</td><td>credits if we miss 99.5%</td></tr>
            <tr><td>Error budget</td><td>1 − SLO, spent on change risk</td><td>43 minutes/month at 99.9%</td></tr>
          </tbody>
        </table>
        <p>Pick SLIs from user journeys, not from internal components. CPU is a cause; checkout success is a symptom. You will need both, but you page on the symptom.</p>

        <h3 class="lesson-subhead" id="dm-pillars">Metrics, logs and traces are not interchangeable</h3>
        <p>Three telemetry types survive in production because each answers a different question at a different price.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Metrics logs and traces compared by cost and question answered">
            <defs>
              <marker id="ah-dm3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="16" width="224" height="100" rx="8" />
            <text class="dg-t" x="128" y="40" text-anchor="middle">METRICS</text>
            <text class="dg-s" x="128" y="60" text-anchor="middle">cheap, numeric, aggregable</text>
            <text class="dg-s" x="128" y="76" text-anchor="middle">"is it happening"</text>
            <text class="dg-s" x="128" y="96" text-anchor="middle">always-on</text>
            <rect class="dg-box o" x="248" y="16" width="224" height="100" rx="8" />
            <text class="dg-t" x="360" y="40" text-anchor="middle">LOGS</text>
            <text class="dg-s" x="360" y="60" text-anchor="middle">expensive, high volume</text>
            <text class="dg-s" x="360" y="76" text-anchor="middle">"what did this request say"</text>
            <text class="dg-s" x="360" y="96" text-anchor="middle">sample or index labels</text>
            <rect class="dg-box g" x="480" y="16" width="224" height="100" rx="8" />
            <text class="dg-t" x="592" y="40" text-anchor="middle">TRACES</text>
            <text class="dg-s" x="592" y="60" text-anchor="middle">a sampled call tree</text>
            <text class="dg-s" x="592" y="76" text-anchor="middle">"where did the 4s go"</text>
            <text class="dg-s" x="592" y="96" text-anchor="middle">1% or head-based</text>
            <text class="dg-s" x="16" y="140">You cannot reconstruct a trace from metrics. You cannot alert on a million log lines per second cheaply.</text>
            <text class="dg-s" x="16" y="158">Use metrics to page, traces to find the hop, logs to confirm the payload. That order is the cost order.</text>
            <text class="dg-s" x="16" y="176">Chapter 22 designs the log pipeline; this chapter only places it in the set.</text>
          </svg>
          <figcaption>Figure 3 — Three pillars with three prices. Mixing them up is how teams bankrupt their observability bill.</figcaption>
        </figure>
        <p>A metric is a named number with labels (service, route, status). A log is a structured event. A trace is a tree of spans sharing a trace ID. Correlation is the design: the same <code>trace_id</code> on the metric exemplar, the log line, and the span so an alert can open a trace in one click.</p>

        <h3 class="lesson-subhead" id="dm-map">What this chapter will not yet design</h3>
        <p>We still need: how bytes get from a process to a store, how the store compresses them, how alerts evaluate, how dashboards should look. That is Chapters 14 and 15. We also need the prerequisites that any of those designs will fail without — availability of the monitoring plane itself, alerting philosophy, and a volume estimate. Those come next, after the metric-shape details.</p>
      `,
    },
    {
      id: 'dm-intro',
      title: 'Introduction to Distributed Monitoring',
      children: [
        { id: 'dm-types', title: 'Counters, gauges and histograms' },
        { id: 'dm-pct', title: 'Why you cannot average a percentile' },
        { id: 'dm-card', title: 'Cardinality is the silent cost' },
        { id: 'dm-push', title: 'Push versus pull collection' },
        { id: 'dm-golden', title: 'The four golden signals' },
      ],
      html: `
        <p>Once you know you need metrics, the next mistakes are all about shape. The wrong type, the wrong aggregation, or an extra label can make the signal unusable or the bill unbounded. This section is the type system of telemetry.</p>

        <h3 class="lesson-subhead" id="dm-types">Counters, gauges and histograms</h3>
        <p>A <strong>counter</strong> only goes up (except on process restart). Request count, bytes sent, errors. You query a counter as a rate: <code>rate(http_requests_total[5m])</code>. A <strong>gauge</strong> is a point-in-time value: heap bytes, replica count, queue depth. A <strong>histogram</strong> (or a sketch) captures a distribution: request latency bucketed so you can estimate percentiles.</p>
        <p>Summaries that compute a percentile inside the process look convenient and are a trap: you cannot merge them correctly across replicas. Histograms with shared buckets can be summed, then a percentile can be estimated from the combined buckets. That is why Prometheus and most TSDBs want histograms for latency, not "pre-baked p99" gauges.</p>
        <table>
          <thead><tr><th>Type</th><th>Goes</th><th>Use for</th><th>Do not use for</th></tr></thead>
          <tbody>
            <tr><td>Counter</td><td>up</td><td>events, bytes, errors</td><td>current queue depth</td></tr>
            <tr><td>Gauge</td><td>anywhere</td><td>levels, temperatures, in-flight</td><td>request counts (you lose restarts)</td></tr>
            <tr><td>Histogram</td><td>observations</td><td>latency, payload size</td><td>unique users (use a sketch)</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 170" role="img" aria-label="Counter gauge and histogram as three metric shapes">
            <defs>
              <marker id="ah-dm4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="16" width="224" height="88" rx="8" />
            <text class="dg-t" x="128" y="40" text-anchor="middle">COUNTER</text>
            <text class="dg-s" x="128" y="60" text-anchor="middle">1, 2, 3, 4 … (restart → 0)</text>
            <text class="dg-s" x="128" y="78" text-anchor="middle">query as a rate</text>
            <rect class="dg-box o" x="248" y="16" width="224" height="88" rx="8" />
            <text class="dg-t" x="360" y="40" text-anchor="middle">GAUGE</text>
            <text class="dg-s" x="360" y="60" text-anchor="middle">72, 80, 61, 90 …</text>
            <text class="dg-s" x="360" y="78" text-anchor="middle">query as a value</text>
            <rect class="dg-box g" x="480" y="16" width="224" height="88" rx="8" />
            <text class="dg-t" x="592" y="40" text-anchor="middle">HISTOGRAM</text>
            <text class="dg-s" x="592" y="60" text-anchor="middle">buckets: 50,100,200ms</text>
            <text class="dg-s" x="592" y="78" text-anchor="middle">merge, then percentile</text>
            <text class="dg-s" x="16" y="128">If you expose p99 as a gauge per host, you will average those gauges later and lie.</text>
            <text class="dg-s" x="16" y="146">Export buckets. Compute p99 at query time over the merged histogram.</text>
          </svg>
          <figcaption>Figure 4 — Metric types. The histogram is the only honest way to talk about tails.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dm-pct">Why you cannot average a percentile</h3>
        <p>Suppose three replicas report p99 latencies of 80 ms, 90 ms and 900 ms. The average of those three numbers is 357 ms. The true p99 of the combined traffic is almost certainly near 900 ms if that replica handled a third of requests, or much lower if it handled almost none. You cannot know without the underlying histogram (or the raw samples).</p>
        <p>This is not a curiosity. It is the default mistake in every home-grown dashboard that does <code>avg(p99)</code> across a Kubernetes deployment. The replica that is garbage-collecting for 2 seconds disappears into the average. Users on that replica do not average. They wait.</p>
        <pre><code>wrong:  avg(p99_latency)          #  (80 + 90 + 900) / 3 = 357 ms  ← fiction
right:  histogram_quantile(0.99, sum by (le) (rate(http_ms_bucket[5m])))
        # uses bucket counts, weighted by actual request volume</code></pre>
        <div class="lesson-callout"><strong>Percentiles are not linear.</strong> You may sum counters. You may sum histogram buckets. You may not sum or average percentiles. If an interviewer draws three hosts, this is the sentence that scores.</div>

        <h3 class="lesson-subhead" id="dm-card">Cardinality is the silent cost</h3>
        <p>A time series is uniquely identified by metric name plus the full set of label values. <code>http_requests_total{route="/a",code="200"}</code> is one series. Add <code>user_id</code> as a label and you have a series per user. Ten million users × a few routes × a few status codes is tens of millions of series. Each series costs index memory in the TSDB — typically a few kilobytes of index plus samples. This is how monitoring clusters die.</p>
        <p>Safe labels: service, route template, status class, region, version. Unsafe labels: user ID, email, raw URL with query string, request ID, unbounded instance IDs that churn every deploy. High-cardinality fields belong on traces and sampled logs, not on always-on metrics.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Cardinality explosion from adding a user_id label">
            <defs>
              <marker id="ah-dm5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="16" width="280" height="72" rx="8" />
            <text class="dg-s" x="156" y="40" text-anchor="middle">route × status × region</text>
            <text class="dg-t" x="156" y="64" text-anchor="middle">~2,000 series</text>
            <rect class="dg-box r" x="424" y="16" width="280" height="72" rx="8" />
            <text class="dg-s" x="564" y="40" text-anchor="middle">… plus user_id</text>
            <text class="dg-t" x="564" y="64" text-anchor="middle">~20 million series</text>
            <path class="dg-line rose thick" d="M296 52 H420" marker-end="url(#ah-dm5)" />
            <text class="dg-s" x="16" y="112">At 1 sample / 15 s, 20 million series is ~1.3 million samples/s into the TSDB.</text>
            <text class="dg-s" x="16" y="130">One extra label turned a laptop-sized problem into a dedicated cluster.</text>
            <text class="dg-s" x="16" y="148">Put user_id on a sampled trace attribute, never on a metric.</text>
          </svg>
          <figcaption>Figure 5 — Cardinality is a multiplicative cost. Treat every new label as a capacity decision.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dm-push">Push versus pull collection</h3>
        <p><strong>Pull</strong> (Prometheus-style scrape): the collector asks each target for its current samples. Service discovery tells it what to ask. Failed scrapes are themselves a signal. <strong>Push</strong> (StatsD, OpenTelemetry collector with exporters): the process emits to an agent or gateway. Short-lived jobs that die before a scrape interval almost require push (or a push gateway).</p>
        <p>Pull keeps a dumb client and a smart collector; you cannot DDoS the TSDB by accidentally emitting too often from one buggy loop as easily. Push handles lambdas, batch jobs, and network partitions where the collector cannot reach the target. Many production setups pull in-cluster and push from the edge and from functions. The trade-off is control of load versus coverage of ephemeral work.</p>
        <table>
          <thead><tr><th></th><th>Pull</th><th>Push</th></tr></thead>
          <tbody>
            <tr><td>Who initiates</td><td>collector</td><td>process or agent</td></tr>
            <tr><td>Ephemeral jobs</td><td>awkward</td><td>natural</td></tr>
            <tr><td>Discoverability</td><td>must list targets</td><td>must authenticate senders</td></tr>
            <tr><td>Load control</td><td>scrape interval is central</td><td>senders can stampede</td></tr>
            <tr><td>Failure signal</td><td>missed scrape</td><td>silence is ambiguous</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="dm-golden">The four golden signals</h3>
        <p>Google SRE popularised four user-facing signals that beat a wall of internal gauges: <strong>latency</strong> (as a distribution), <strong>traffic</strong> (requests per second), <strong>errors</strong> (failed / total), and <strong>saturation</strong> (how full a constrained resource is — thread pool, IO, queue). If you can only keep four graphs on a phone at 3 a.m., keep these.</p>
        <p>Saturation is the one teams skip. Error rate can still be zero while the queue is 90% full and p99 is about to explode. Queue depth, heap near the limit, and disk util are leading indicators; error rate is a lagging one. Alert on both, with different urgency.</p>
        <p>USE (utilisation, saturation, errors) per resource and RED (rate, errors, duration) per service are the same idea with different nouns. Pick one vocabulary and apply it to every service identically so on-call muscle memory transfers.</p>
      `,
    },
    {
      id: 'dm-prereq',
      title: 'Prerequisites of a Monitoring System',
      children: [
        { id: 'dm-avail', title: 'Monitoring must be more available than what it watches' },
        { id: 'dm-alert', title: 'Alert on symptoms, not causes' },
        { id: 'dm-est', title: 'A back-of-the-envelope for telemetry volume' },
        { id: 'dm-eval', title: 'Where a naïve monitoring design fails' },
        { id: 'dm-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <p>Before Chapter 14 draws boxes, four constraints have to be true or the boxes are theatre. The monitoring plane has to survive the outage it is describing. Alerts have to be worth waking someone. The volume has to fit in a budget. And you have to know what a naïve design will get wrong.</p>

        <h3 class="lesson-subhead" id="dm-avail">Monitoring must be more available than what it watches</h3>
        <p>If the product is down and Grafana is down for the same reason — same region, same Kubernetes cluster, same identity provider — you have built a mirror, not a flashlight. The monitoring stack needs independent failure domains: a second region or a hosted SaaS, a separate TSDB cluster, authentication that still works when your IdP is the incident.</p>
        <p>Quantify it. If the product SLO is 99.9%, the monitoring SLO should be at least 99.99% for "can I see the last 15 minutes of the golden signals". That extra nine is why many teams pay a vendor for the pager path even when they self-host the rest.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Monitoring plane in a separate failure domain from the product">
            <defs>
              <marker id="ah-dm6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="340" height="140" rx="11" />
            <text class="dg-h" x="26" y="36">PRODUCT REGION A</text>
            <rect class="dg-box r" x="26" y="48" width="140" height="32" rx="6" />
            <text class="dg-s" x="96" y="68" text-anchor="middle">checkout svc</text>
            <rect class="dg-box r" x="184" y="48" width="140" height="32" rx="6" />
            <text class="dg-s" x="254" y="68" text-anchor="middle">payments svc</text>
            <text class="dg-s" x="26" y="104">When this region dies you still</text>
            <text class="dg-s" x="26" y="120">need to know that it died.</text>
            <text class="dg-s" x="26" y="136">Do not host the only Grafana here.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="140" rx="11" />
            <text class="dg-h" x="382" y="36">MONITORING PLANE</text>
            <rect class="dg-box g" x="382" y="48" width="140" height="32" rx="6" />
            <text class="dg-s" x="452" y="68" text-anchor="middle">TSDB replica</text>
            <rect class="dg-box g" x="540" y="48" width="140" height="32" rx="6" />
            <text class="dg-s" x="610" y="68" text-anchor="middle">alertmanager</text>
            <text class="dg-s" x="382" y="104">Different account, region, or vendor.</text>
            <text class="dg-s" x="382" y="120">Pager path does not use product IdP.</text>
            <text class="dg-s" x="382" y="136">Agents buffer when this is slow.</text>
            <path class="dg-line violet dash" d="M352 64 H364" marker-end="url(#ah-dm6)" />
          </svg>
          <figcaption>Figure 6 — Independence is a requirement, not a nice-to-have. The dashed arrow is telemetry leaving the burning building.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="dm-alert">Alert on symptoms, not causes</h3>
        <p>Cause-based alerts ("CPU &gt; 90%", "restart count increased") train people to ignore pagers. Symptom-based alerts ("error ratio &gt; 2% for 5 minutes on the checkout SLO", "p99 &gt; 500 ms") fire when a user would complain. Causes still belong on dashboards for diagnosis. They do not belong on the phone unless they are a leading indicator with a proven mapping to user harm (disk will be full in 20 minutes is a fair page).</p>
        <p>Every alert needs: the SLI, a duration (to survive blips), a link to a runbook, and an owner. If you cannot write the runbook, you cannot justify the page. Multi-window multi-burn-rate alerts on error budgets — fast burn pages now, slow burn tickets a ticket — are the current standard because they respect the SLO rather than a magic threshold.</p>
        <ol class="lesson-checklist">
          <li>Page on user-facing SLI burn, with a for-duration of minutes not seconds.</li>
          <li>Ticket on slow budget burn and on saturation leading indicators.</li>
          <li>Never page on a cause unless the mapping to user harm is documented.</li>
          <li>If nobody will act at 3 a.m., it is not a page — it is a dashboard panel.</li>
        </ol>

        <h3 class="lesson-subhead" id="dm-est">A back-of-the-envelope for telemetry volume</h3>
        <p>Use the same discipline as <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>. Numbers first, architecture second.</p>
        <pre><code>Assumptions
  500 services × 20 time series each (golden + a few extras) = 10,000 series
  40 hosts × 200 node series                               = 8,000 series
  histograms: 10 buckets × 50 latency metrics              = 500 series
  total ~ 20,000 series (careful labels!)

  scrape every 15 s → 20,000 / 15 ≈ 1,333 samples/s
  2 bytes compressed (Gorilla, Chapter 14) → ~2.6 KB/s  (tiny)

  Now add a bad label:
  20,000 × 10,000 users = 200 million series
  200e6 / 15 ≈ 13 million samples/s → a real cluster, or a melted one

Logs (preview of Chapter 22)
  500 hosts × 1,000 lines/s × 300 bytes = 150 MB/s ingest
  that is the number that dominates cost, not the metrics</code></pre>
        <p>The lesson is lopsided: metrics are cheap if cardinality is disciplined; logs are the bill; traces sit in the middle and are only affordable because they are sampled. Design the three budgets separately.</p>

        <h3 class="lesson-subhead" id="dm-eval">Where a naïve monitoring design fails</h3>
        <p>A design that scrapes <code>/metrics</code>, averages p99, labels by user, pages on CPU, and runs Grafana in the same cluster as the app will fail in four independent ways: it lies about tails, it dies on cardinality, it pages on irrelevance, and it goes dark during the outage. Chapter 14 exists to fix the pipeline. Chapter 15 exists because even a perfect server pipeline is blind to DNS, ISPs and crashed phones.</p>
        <p>Another failure: treating monitoring as an afterthought bolted on after launch. Instrumentation is part of the request path's contract — a histogram increment is a few nanoseconds if you do it in-process; retrofitting it later means you fly blind through the first real incident.</p>

        <h3 class="lesson-subhead" id="dm-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Why can a green health check coexist with a missed SLO? Why must percentiles be computed from merged histograms rather than averaged? What happens to a TSDB if you put <code>user_id</code> on a counter? Why must the monitoring plane live in a different failure domain, and why do you page on symptoms rather than CPU? If those are sharp, Chapter 14 will put them through a pipeline.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Distributed monitoring ideas here are the standard industry concepts of telemetry, SLIs/SLOs and golden signals; all explanations, diagrams, tables and exercises are our own.',
};
