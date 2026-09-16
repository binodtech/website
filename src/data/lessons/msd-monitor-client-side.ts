/** Modern System Design — Chapter 15: Client-Side Monitoring.
 *  Origin-blind failures, RUM versus synthetic, a separate collector
 *  domain, privacy, ASN slicing, sampling and Web Vitals.
 */

export const msdMonitorClientSide = {
  slug: 'monitor-client-side',
  title: 'Client-Side Monitoring',
  subtitle:
    'A green server dashboard can still mean a broken product. DNS, ISP, CDN and client crashes live off the origin path. This chapter designs the reporting plane that watches the user, not the process.',
  byline: 'Modern System Design · Chapter 15 · ~1h 20m read · Intermediate',
  interviewTip:
    'If you only monitor the origin, you will miss every failure that happens before the request arrives. Say so out loud: "server error rate can be 0% while half of users fail DNS or hit a poisoned CDN POP." Then split RUM from synthetic, put the collector on a separate domain so a down origin still receives crash reports, and mention sampling, ASN aggregation, consent and Web Vitals. That is the chapter in five sentences.',
  sections: [
    {
      id: 'cs-focus',
      title: 'Focus on Client-Side Errors in a Monitoring System',
      children: [
        { id: 'cs-blind', title: 'What a server dashboard cannot see' },
        { id: 'cs-rum', title: 'Real user monitoring versus synthetic probes' },
        { id: 'cs-vitals', title: 'Web Vitals are not server duration' },
        { id: 'cs-privacy', title: 'Privacy, consent and what you must never collect' },
        { id: 'cs-sdk', title: 'The SDK must not become the outage' },
      ],
      html: `
        <p><a href="/learn/modern-system-design/monitor-server-side">Chapter 14</a> watches processes you own. Users do not live there. They live on flaky radios, captive portals, ad-blockers, yesterday's WebView, and a CDN POP that is serving a 500 from the wrong city. Origin 5xx = 0% is compatible with a total product outage.</p>
        <p>The design problem is: observe failures that never become origin requests, without turning the browser into a spyware agent, and without a beacon volume that rivals Chapter 22's log firehose.</p>

        <h3 class="lesson-subhead" id="cs-blind">What a server dashboard cannot see</h3>
        <ul class="lesson-layers">
          <li><strong>DNS and TLS</strong> failures before a packet hits your load balancer.</li>
          <li><strong>CDN / edge</strong> errors and stale cache serving the wrong app shell.</li>
          <li><strong>Client exceptions</strong> in JavaScript, after a 200 HTML.</li>
          <li><strong>Web Vitals</strong> (LCP, INP, CLS) — user-perceived, not server duration.</li>
          <li><strong>Crash loops</strong> on mobile that never retry the API.</li>
          <li><strong>Partial connectivity</strong> — the request that is sent and never acked from the user's point of view.</li>
        </ul>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Failures before origin that server metrics miss">
            <defs>
              <marker id="ah-cs1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="52" width="88" height="40" rx="7" />
            <text class="dg-s" x="60" y="76" text-anchor="middle">DNS</text>
            <rect class="dg-box r" x="128" y="52" width="88" height="40" rx="7" />
            <text class="dg-s" x="172" y="76" text-anchor="middle">TLS</text>
            <rect class="dg-box o" x="240" y="52" width="88" height="40" rx="7" />
            <text class="dg-s" x="284" y="76" text-anchor="middle">CDN</text>
            <rect class="dg-box y" x="352" y="52" width="100" height="40" rx="7" />
            <text class="dg-s" x="402" y="76" text-anchor="middle">JS crash</text>
            <rect class="dg-box g" x="480" y="52" width="220" height="40" rx="7" />
            <text class="dg-s" x="590" y="76" text-anchor="middle">origin: all green</text>
            <path class="dg-line rose" d="M104 72 H124" marker-end="url(#ah-cs1)" />
            <path class="dg-line rose" d="M216 72 H236" marker-end="url(#ah-cs1)" />
            <path class="dg-line rose" d="M328 72 H348" marker-end="url(#ah-cs1)" />
            <path class="dg-line rose dash" d="M452 72 H476" marker-end="url(#ah-cs1)" />
          </svg>
          <figcaption>Figure 1 — The origin SLO can be perfect to the left of a wall the user never climbed.</figcaption>
        </figure>
        <p>Interview phrasing: "origin-blind" failures. Name three. DNS NXDOMAIN at a bad resolver, TLS handshake timeout on an old Android, a JavaScript TypeError after a successful HTML 200. None of those increment a server 5xx counter.</p>

        <h3 class="lesson-subhead" id="cs-rum">Real user monitoring versus synthetic probes</h3>
        <p><strong>RUM</strong> is instrumentation in the real client: navigation timing, errors, vitals, sampled traces. It sees the actual mix of devices and ISPs. It is biased toward users who got far enough to run JS, and toward those you sampled. Ad-blockers and privacy browsers undercount a slice you might care about.</p>
        <p><strong>Synthetic</strong> is a probe you run on a schedule from known locations: GET the homepage, login, checkout. It sees outages when nobody is around (3am deploy) and when JS will not run (broken HTML). It does not see "Android 9 on a specific ISP." You want both: synthetics for availability SLOs with a clean denominator, RUM for experience SLOs and for slicing by geography and device.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="RUM sees real mix, synthetics see scripted paths from known sites">
            <defs>
              <marker id="ah-cs2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">RUM</text>
            <text class="dg-s" x="26" y="58">real devices and ISPs</text>
            <text class="dg-s" x="26" y="76">biased if JS never ran</text>
            <text class="dg-s" x="26" y="94">good for vitals and crashes</text>
            <text class="dg-s" x="26" y="112">noisy, needs sampling</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">SYNTHETIC</text>
            <text class="dg-s" x="382" y="58">known cities, on a clock</text>
            <text class="dg-s" x="382" y="76">sees broken HTML at 3am</text>
            <text class="dg-s" x="382" y="94">clean availability SLO</text>
            <text class="dg-s" x="382" y="112">misses last-mile ISPs</text>
          </svg>
          <figcaption>Figure 2 — Neither replaces the other. Availability wants synthetics; experience wants RUM.</figcaption>
        </figure>
        <table>
          <thead><tr><th></th><th>RUM</th><th>Synthetic</th></tr></thead>
          <tbody>
            <tr><td>Denominator</td><td>Sessions that ran the SDK</td><td>Probes you scheduled</td></tr>
            <tr><td>Sees last-mile</td><td>Yes, sampled</td><td>Only if you probe from that ISP</td></tr>
            <tr><td>Sees JS crash</td><td>Yes</td><td>Only if the scripted path hits it</td></tr>
            <tr><td>Cost</td><td>Per session, sample hard</td><td>Per probe, cheap until you over-probe</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="cs-vitals">Web Vitals are not server duration</h3>
        <p>LCP (largest contentful paint), INP (interaction to next paint) and CLS (layout shift) are what the user felt. Server TTFB can be 80 ms while LCP is 4 s because the hero image waited on a third-party font. Alerting only on origin duration will ship a slow product with a green graph.</p>
        <p>Slice vitals by route, release, country and device class. A p75 LCP that jumps after a deploy is a rollback candidate. A p75 that is fine globally but awful in one ASN is an ISP or CDN POP, not a bad commit — that distinction is why you store ASN.</p>
        <div class="lesson-callout"><strong>Probe the money path.</strong> A synthetic that only GETs the cached marketing shell will stay green while checkout is on fire. Script login and pay, not just <code>/</code>.</div>

        <h3 class="lesson-subhead" id="cs-privacy">Privacy, consent and what you must never collect</h3>
        <p>RUM is telemetry about people. Consent, a DPA, IP truncation, no keystrokes, no raw emails in error messages, no session replay of payment forms. Session replay is a product decision with legal weight, not a default. Sample, aggregate at the edge, drop PII fields in the collector. If you cannot explain a field to a regulator, do not ship it.</p>
        <p>Error messages often contain the user's email because a developer interpolated it. Strip known PII patterns in the collector even if the SDK "should not" send them. Treat the beacon payload as hostile.</p>
        <p>IP addresses are often treated as "just metadata." Truncate to /24 (IPv4) or /48 (IPv6) unless you have a documented reason and a retention shorter than the rest of RUM. Combine IP with timestamps and you have a tracking pixel with extra steps. ASN plus country is usually enough to find an ISP incident.</p>

        <h3 class="lesson-subhead" id="cs-sdk">The SDK must not become the outage</h3>
        <p>A monitoring snippet that throws on old browsers will take the product down in the name of observing it. Feature-detect. Fail closed inside a try/catch. Cap CPU: no layout-forcing reads on every frame to compute CLS yourself if the browser already exposes the vital. Load the SDK async after first paint unless you are measuring that paint — and even then, a 2 KB inline bootstrap beats a 200 KB tag manager chain.</p>
        <p>Version the beacon schema. Old apps in the wild will send last year's fields for months. The collector must accept v1 forever or you will drop the very crash reports from the un-upgraded WebView. That is the opposite of observability.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="SDK must fail closed and stay off the critical path">
            <defs>
              <marker id="ah-cs6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">first paint</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">product JS</text>
            <rect class="dg-box y" x="260" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="360" y="64" text-anchor="middle">RUM bootstrap</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">tiny, async</text>
            <rect class="dg-box r" x="484" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="594" y="64" text-anchor="middle">SDK throw</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">must not blank app</text>
            <path class="dg-line cyan" d="M236 68 H256" marker-end="url(#ah-cs6)" />
            <path class="dg-line cyan dash" d="M460 68 H480" marker-end="url(#ah-cs6)" />
          </svg>
          <figcaption>Figure 3 — Observability that can blank the page is a worse bug than a missing LCP point.</figcaption>
        </figure>
      `,
    },
    {
      id: 'cs-design',
      title: 'Design of a Client-Side Monitoring System',
      children: [
        { id: 'cs-arch', title: 'Collector domain, ingest and aggregation' },
        { id: 'cs-asn', title: 'ASN, geography and sampling' },
        { id: 'cs-vitals-pipe', title: 'Turning vitals into an SLO' },
        { id: 'cs-eval', title: 'Where client-side monitoring still lies' },
        { id: 'cs-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cs-arch">Collector domain, ingest and aggregation</h3>
        <p>Serve the SDK from a CDN. Send beacons to a <em>different</em> hostname than the origin so an origin outage still records "we cannot reach origin." <code>sendBeacon</code> / <code>fetch keepalive</code> so unloads deliver. Batch, compress, cap payload size. The collector is a highly available ingest (Chapter 14's pipeline) with looser schema: clients are hostile and old. Validate, drop garbage, never let a malformed beacon take the indexer down.</p>
        <p>The collector's availability SLO must be stricter than the origin's, or you will not see the origin die. Put it on a separate provider if you can afford the operational split; at minimum a separate DNS name, certificate and autoscaling group.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Client beacons to a separate collector domain, then the monitoring pipeline">
            <defs>
              <marker id="ah-cs3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="88" height="44" rx="7" />
            <text class="dg-s" x="60" y="78" text-anchor="middle">browser</text>
            <rect class="dg-box o" x="148" y="16" width="140" height="36" rx="6" />
            <text class="dg-s" x="218" y="38" text-anchor="middle">origin (maybe down)</text>
            <rect class="dg-box g" x="148" y="88" width="140" height="36" rx="6" />
            <text class="dg-s" x="218" y="110" text-anchor="middle">collector host</text>
            <rect class="dg-box p" x="348" y="88" width="140" height="36" rx="6" />
            <text class="dg-s" x="418" y="110" text-anchor="middle">ingest queue</text>
            <rect class="dg-box b" x="548" y="88" width="156" height="36" rx="6" />
            <text class="dg-s" x="626" y="110" text-anchor="middle">TSDB + errors</text>
            <path class="dg-line violet dash" d="M104 68 H148" marker-end="url(#ah-cs3)" />
            <path class="dg-line violet" d="M104 80 V106 H144" marker-end="url(#ah-cs3)" />
            <path class="dg-line violet" d="M288 106 H344" marker-end="url(#ah-cs3)" />
            <path class="dg-line violet" d="M488 106 H544" marker-end="url(#ah-cs3)" />
          </svg>
          <figcaption>Figure 4 — Separate hostname. A down origin must not take the crash mailbox with it.</figcaption>
        </figure>
        <pre><code>POST https://t.example/v1/beacon
  { t: LCP|INP|CLS|error|nav, v, route, asn?, country?,
    value, stack?, sampleRate, ts, release }

# synthetics
GET  https://origin/checkout  from N probes / minute
POST /internal/synthetic/result  { loc, step, ok, ms }</code></pre>
        <p>Requirements, stated: collect errors, vitals and synthetic results; join to a release id; slice by ASN and country; never store raw PII; survive origin failure. Non-functional: collector 99.99, ingest lag under a minute, p99 beacon under 50 KB, no user-visible jank from the SDK.</p>

        <h3 class="lesson-subhead" id="cs-asn">ASN, geography and sampling</h3>
        <p>User-visible outages are often one ISP, one country, one CDN POP. Store ASN and metro, not GPS. Sample: 100% of errors, 1–10% of vitals, adapt when error rate rises (keep more). Aggregation: p75 LCP by route × country × release. Alert on a step change after a deploy (release id on every beacon) and on synthetic checkout failure from two regions, not on a single noisy RUM spike from a conference Wi-Fi.</p>
        <pre><code>ESTIMATE
  10M DAU * 20 beacons * 200 B * 0.1 sample
    = 10e6 * 20 * 200 * 0.1 = 4e9 B/day  ~ 4 GB/day vitals
  plus 100% of errors: even 1% error sessions * 2 KB
    is small next to logs (Chapter 22)
  still not "record every mouse move"</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Keep all errors, sample vitals, slice by ASN not user id">
            <defs>
              <marker id="ah-cs4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="44" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="68" text-anchor="middle">errors 100%</text>
            <text class="dg-s" x="116" y="84" text-anchor="middle">always keep</text>
            <rect class="dg-box y" x="236" y="44" width="200" height="56" rx="7" />
            <text class="dg-s" x="336" y="68" text-anchor="middle">vitals 1-10%</text>
            <text class="dg-s" x="336" y="84" text-anchor="middle">adaptive</text>
            <rect class="dg-box b" x="456" y="44" width="248" height="56" rx="7" />
            <text class="dg-s" x="580" y="68" text-anchor="middle">group by ASN</text>
            <text class="dg-s" x="580" y="84" text-anchor="middle">not by user id</text>
            <path class="dg-line hot" d="M216 72 H232" marker-end="url(#ah-cs4)" />
            <path class="dg-line hot" d="M436 72 H452" marker-end="url(#ah-cs4)" />
          </svg>
          <figcaption>Figure 5 — ASN is the slice that finds an ISP outage. User id is a privacy hole and a cardinality bomb.</figcaption>
        </figure>
        <p>Why ASN beats user id: an ISP outage is thousands of users sharing a number. Grouping by user produces noise and PII. Grouping by ASN plus country produces a page an on-call can act on: "AS9829 in IN, LCP p75 6s after CDN deploy."</p>

        <h3 class="lesson-subhead" id="cs-vitals-pipe">Turning vitals into an SLO</h3>
        <p>Pick one vital per user-facing journey and a percentile that matches pain: p75 LCP on <code>/home</code>, p75 INP on <code>/search</code>. Alert on a deploy-correlated step change and on a synthetic fail from two regions. Do not alert on raw RUM p99 — one corporate proxy will own that number every afternoon.</p>
        <p>Release id on every beacon is how you blame a commit. Without it you will argue CDN versus code for an hour. Attach the same release to synthetics so the two planes can be joined. A green synthetic on the old shell and a red RUM on the new JS is a classic "we cached index.html too long" incident, which is also a <a href="/learn/modern-system-design/cdn">CDN</a> lesson.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Release id joins RUM vitals to a deploy">
            <defs>
              <marker id="ah-cs7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="64" text-anchor="middle">deploy release</text>
            <text class="dg-s" x="116" y="80" text-anchor="middle">abc123</text>
            <rect class="dg-box b" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">RUM beacons</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">same release id</text>
            <rect class="dg-box r" x="496" y="40" width="208" height="56" rx="7" />
            <text class="dg-s" x="600" y="64" text-anchor="middle">LCP step up</text>
            <text class="dg-s" x="600" y="80" text-anchor="middle">rollback candidate</text>
            <path class="dg-line violet" d="M216 68 H252" marker-end="url(#ah-cs7)" />
            <path class="dg-line violet" d="M456 68 H492" marker-end="url(#ah-cs7)" />
          </svg>
          <figcaption>Figure 6 — A vital without a release id is a weather report. With one, it is a verdict.</figcaption>
        </figure>
        <p>Budget: 10M DAU is not 10M full session recordings. Session replay belongs behind consent, a tight sample, and a PII scrubber that understands payment forms. If legal has not signed the replay product, you do not have a replay product. You have a future incident.</p>
        <p>Collector DDoS: browsers are unauthenticated. Cap bytes per IP, drop duplicate beacons, require a short-lived app token that is not a user credential. A public ingest with no quota becomes a log injection and a bill. That is Chapter 19 adjacent, and it belongs in this design because the client is hostile by default.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Synthetic checkout from two regions versus a single noisy RUM spike">
            <defs>
              <marker id="ah-cs5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="40" width="240" height="56" rx="7" />
            <text class="dg-s" x="136" y="64" text-anchor="middle">synthetic fail</text>
            <text class="dg-s" x="136" y="80" text-anchor="middle">two regions</text>
            <rect class="dg-box o" x="280" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="380" y="72" text-anchor="middle">page on-call</text>
            <rect class="dg-box r" x="504" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="604" y="64" text-anchor="middle">one Wi-Fi spike</text>
            <text class="dg-s" x="604" y="80" text-anchor="middle">do not page</text>
            <path class="dg-line green" d="M256 68 H276" marker-end="url(#ah-cs5)" />
          </svg>
          <figcaption>Figure 7 — Alert on corroborated failure. Conference Wi-Fi is not a region outage.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cs-eval">Where client-side monitoring still lies</h3>
        <p>Ad-blockers drop your SDK — you undercount privacy-conscious users, often desktop. Crashes before the SDK loads are invisible unless you have a native crash reporter. Synthetics from cloud regions miss last-mile. RUM averages hide that 5% of a country is on a broken POP. And a green synthetic can mean you tested the cached shell, not checkout.</p>
        <p>Consent banners that delay JS also delay RUM; your "slow LCP" after a cookie wall may be the wall. Attribution is messy. Be honest in the evaluation: this plane reduces origin-blindness; it does not give you a census of every human who typed the URL.</p>
        <p>Web Vitals themselves shift. INP replaced FID. Your stored field names and alert thresholds must version with the metric, or a year-old dashboard will lie with confidence. Keep the raw event; derive the SLO number in the query, not only in the SDK, so you can recompute when the definition moves.</p>
        <p>Sampling bias: if you sample 1% of sessions but 100% of errors, error <em>rate</em> is not errors divided by sampled sessions unless you weight by sampleRate on every beacon. Forget the weight and a quiet day looks like a crash storm because the denominator shrank. Put <code>sampleRate</code> on the payload and use it in the rollup. That is the arithmetic interviewers forget.</p>
        <p>Third-party scripts (tag managers, chat widgets, ads) dominate real LCP and INP. Your origin can be innocent. Slice vitals with and without third-party attribution when the browser exposes it. Otherwise you will roll back a perfectly good deploy because a partner's script stalled. Synthetics that block third parties will disagree with RUM; that disagreement is data, not a bug in the collector.</p>
        <p>Mobile: a native crash reporter (Breakpad, Sentry native, Apple's metrickit) covers deaths before JS existed. Pair it with the same collector hostname and the same release id. A web-only RUM design for a hybrid app is origin-blindness in a different costume.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Weight sampled vitals when computing error rate">
            <defs>
              <marker id="ah-cs8" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">errors 100%</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">raw count</text>
            <rect class="dg-box y" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">vitals 10%</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">weight 10x</text>
            <rect class="dg-box g" x="476" y="40" width="228" height="56" rx="7" />
            <text class="dg-s" x="590" y="64" text-anchor="middle">true rate</text>
            <text class="dg-s" x="590" y="80" text-anchor="middle">not raw ratio</text>
            <path class="dg-line hot" d="M236 68 H252" marker-end="url(#ah-cs8)" />
            <path class="dg-line hot" d="M456 68 H472" marker-end="url(#ah-cs8)" />
          </svg>
          <figcaption>Figure 8 — Mix 100% errors with 10% vitals only if every rollup carries sampleRate. Otherwise the graph is a lie.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cs-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Name three failures that leave origin error rate at zero. (2) Why must the collector hostname differ from the origin? (3) What do you sample at 100% versus 1%, and why? (4) Why is ASN a better slice than user id for detecting an ISP outage?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Client-side monitoring, RUM and synthetic checks are standard web-operations practice; all explanations, diagrams, tables and exercises are our own.',
};
