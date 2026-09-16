/** Modern System Design — Chapter 44: Lessons from System Failures.
 *  What real outages teach that diagrams do not: coupling, retries, DNS,
 *  config, and the gap between the architecture you drew and the one that ran.
 */

export const msdSystemFailures = {
  slug: 'system-failures',
  title: 'Lessons from System Failures',
  subtitle:
    'Every chapter in this course has been about how to put a system together. This one is about how they come apart — the recurring shapes of real outages, the architectural mistakes they share, and the questions to ask of your own design before production asks them for you.',
  byline: 'Modern System Design · Chapter 44 · ~1h 20m read · Advanced',
  interviewTip:
    'A candidate who can name how their design fails is more senior than a candidate who can name how it works. When you finish a design, spend the last five minutes attacking it: "if DNS for the region is wrong, this whole picture is unreachable; if the retry policy is unbounded, a 5-second blip becomes a self-inflicted DDoS; if the config push is not gated, one bad flag takes everywhere down together." Interviewers remember that more than they remember your box-and-arrow diagram.',
  sections: [
    {
      id: 'lessons',
      title: 'Lessons from System Failures',
      children: [
        { id: 'sf-why', title: 'Why this chapter exists' },
        { id: 'sf-retry', title: 'Retry amplification: the outage you cause yourself' },
        { id: 'sf-dns', title: 'DNS, certificates and the control plane' },
        { id: 'sf-config', title: 'Configuration as the most dangerous code' },
        { id: 'sf-coupling', title: 'Hidden coupling and the thundering herd' },
        { id: 'sf-partial', title: 'Partial failure that looks like success' },
        { id: 'sf-deps', title: 'Third-party and single-vendor concentration' },
        { id: 'sf-review', title: 'A failure review you can run on any design' },
      ],
      html: `
        <p>This course has 43 chapters of construction. Construction is the fun part. The systems that actually page you at 3am are not usually missing a box from the diagram — they are missing a sentence about what that box does when the sentence after it is false.</p>
        <p>The outages below are patterns, not a museum of incidents. Specific well-known public failures are named where they teach something that generalises; the point is the shape, which you will meet under a different logo.</p>

        <h3 class="lesson-subhead" id="sf-why">Why this chapter exists</h3>
        <p>Architectures fail in fewer ways than they succeed. After you have seen a dozen incidents, they start to rhyme: a retry loop, a DNS record, a config push, a cache stampede, a dependency that was supposed to be optional. The same five or six shapes account for a surprising fraction of large outages, which is both depressing and useful — it means a short checklist catches a lot.</p>
        <p>It also means the most valuable thing you can add to a design interview is not another component. It is a paragraph that starts "this falls over when…". <a href="/learn/modern-system-design/non-functional">Chapter 4</a> named availability; this chapter is the post-mortem library behind those sentences.</p>

        <h3 class="lesson-subhead" id="sf-retry">Retry amplification: the outage you cause yourself</h3>
        <p>Chapter 3 established that a timeout is ambiguous, so the instinct is to retry. Chapter 4 then said retries must be bounded, jittered, and budgeted. This is the chapter where that rule earns its keep.</p>
        <p>The shape: a dependency slows down. Callers hit their timeout and retry. The dependency, which was merely slow, now receives several times its normal load and slows down more. More callers time out. Within a minute the dependency is down, and the original trigger can be removed without the system recovering — the retries have become the load.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Retry amplification turning a small slowdown into a self-inflicted outage">
            <defs>
              <marker id="ah-sf1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="24">A 5-SECOND BLIP, THEN YOU DID THE REST</text>
            <rect class="dg-box y" x="16" y="36" width="150" height="48" rx="7" />
            <text class="dg-s" x="91" y="56" text-anchor="middle">dependency</text>
            <text class="dg-s" x="91" y="72" text-anchor="middle">p99 50ms to 600ms</text>
            <rect class="dg-box r" x="192" y="36" width="150" height="48" rx="7" />
            <text class="dg-s" x="267" y="56" text-anchor="middle">callers time out</text>
            <text class="dg-s" x="267" y="72" text-anchor="middle">at 200ms, retry x3</text>
            <rect class="dg-box r" x="368" y="36" width="150" height="48" rx="7" />
            <text class="dg-s" x="443" y="56" text-anchor="middle">4x the traffic</text>
            <text class="dg-s" x="443" y="72" text-anchor="middle">lands on the slow node</text>
            <rect class="dg-box r" x="544" y="36" width="160" height="48" rx="7" />
            <text class="dg-s" x="624" y="56" text-anchor="middle">collapse</text>
            <text class="dg-s" x="624" y="72" text-anchor="middle">trigger already gone</text>
            <path class="dg-line rose" d="M166 60 H188" marker-end="url(#ah-sf1)" />
            <path class="dg-line rose" d="M342 60 H364" marker-end="url(#ah-sf1)" />
            <path class="dg-line rose" d="M518 60 H540" marker-end="url(#ah-sf1)" />
            <rect class="dg-band g" x="12" y="104" width="696" height="100" rx="10" />
            <text class="dg-h" x="26" y="124">COUNTERMEASURES, BEFORE THE BLIP</text>
            <text class="dg-s" x="26" y="144">retry budget: fleet-wide extra traffic capped, e.g. 10%</text>
            <text class="dg-s" x="26" y="160">exponential backoff with jitter so retries do not sync</text>
            <text class="dg-s" x="26" y="176">circuit breakers: stop calling after N failures, fail fast</text>
            <text class="dg-s" x="26" y="192">hedge late; do not immediately fan out a second copy</text>
          </svg>
          <figcaption>Figure 1 — Retry amplification. The original slowdown can be gone and the outage continues, because the retries are now the load.</figcaption>
        </figure>
        <p>Public examples of this shape include cascading retail and cloud-API incidents where a small elevated error rate became a site-wide outage within minutes. The lesson is architectural: retries are a load-amplifying feedback loop unless they are explicitly budgeted, and a design that "just retries" has a latent DDoS built in. Layer this with the <a href="/learn/modern-system-design/rate-limiter">rate limiter</a>: a 429 with Retry-After is how you teach clients; unbounded client retries are how you teach the pager.</p>

        <h3 class="lesson-subhead" id="sf-dns">DNS, certificates and the control plane</h3>
        <p><a href="/learn/modern-system-design/dns">Chapter 7</a> warned that DNS is a slow failover mechanism and a complete outage domain. This is that warning with casualties attached.</p>
        <p>The shape: a DNS record, a TLS certificate, a load-balancer configuration, or a global routing policy is wrong. Every server in the diagram is healthy. Users cannot reach any of them. Your dashboards, if they watch the data plane, stay green — this is the client-side blind spot from <a href="/learn/modern-system-design/monitor-client-side">Chapter 15</a>.</p>
        <ul class="lesson-layers">
          <li><strong>Expired certificates.</strong> A calendar failure. Automate issuance and alerting on days-to-expiry, and do not let the person who "knows how to renew it" be a single point of failure.</li>
          <li><strong>DNS TTLs you cannot afford.</strong> A 3600-second TTL on a record you might need to fail away from means an hour of split brain between old and new answers, plus the resolvers that ignore TTLs. For anything you might fail over, keep TTLs short and have a non-DNS failover path (anycast, health-checked load balancing).</li>
          <li><strong>Control-plane blast radius.</strong> A global traffic-steering system that can send all users to the wrong region in one API call is an availability risk that dwarfs any single cluster. Stage control-plane changes, canary them, and make them reversible faster than the TTL.</li>
        </ul>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Healthy data plane unreachable because DNS or TLS is wrong">
            <rect class="dg-box r" x="16" y="28" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="50" text-anchor="middle">users</text>
            <text class="dg-s" x="116" y="66" text-anchor="middle">cannot resolve</text>
            <rect class="dg-box y" x="260" y="28" width="200" height="56" rx="7" />
            <text class="dg-s" x="360" y="50" text-anchor="middle">DNS / cert / LB</text>
            <text class="dg-s" x="360" y="66" text-anchor="middle">control plane miss</text>
            <rect class="dg-box g" x="504" y="28" width="196" height="56" rx="7" />
            <text class="dg-s" x="602" y="50" text-anchor="middle">fleet healthy</text>
            <text class="dg-s" x="602" y="66" text-anchor="middle">metrics still green</text>
            <rect class="dg-band r" x="16" y="104" width="688" height="48" rx="8" />
            <text class="dg-s" x="32" y="132">Put the name, the cert, and the global steer on the SPOF list, above most boxes.</text>
          </svg>
          <figcaption>Figure 2 — Data-plane dashboards do not see a DNS outage. Probe from the user's network path.</figcaption>
        </figure>
        <p>Several well-known, multi-hour global outages in the last decade were DNS or certificate events, not compute events. When you list single points of failure in a design, the DNS name and the certificate are on that list, above most of the boxes you drew.</p>

        <h3 class="lesson-subhead" id="sf-config">Configuration as the most dangerous code</h3>
        <p>Feature flags, ACL files, routing tables, autoscaler policies, "kill switches" that were never tested in the kill direction: configuration has the blast radius of a deploy and the review culture of a spreadsheet. A bad flag default, a regex that matches every tenant, a global "disable cache" that was meant for one pod — these skip canaries because they are not a binary.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Ungated config push versus staged canary flags">
            <rect class="dg-band r" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">UNGATED PUSH</text>
            <text class="dg-s" x="26" y="58">one JSON to every region</text>
            <text class="dg-s" x="26" y="76">no canary, no soak</text>
            <text class="dg-s" x="26" y="94">rollback is another push</text>
            <text class="dg-s" x="26" y="112">if the push path is sick,</text>
            <text class="dg-s" x="26" y="130">you cannot even revert</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">GATED CONFIG</text>
            <text class="dg-s" x="382" y="58">canary one cell first</text>
            <text class="dg-s" x="382" y="76">automatic rollback on SLI</text>
            <text class="dg-s" x="382" y="94">defaults fail safe</text>
            <text class="dg-s" x="382" y="112">last-known-good on disk</text>
            <text class="dg-s" x="382" y="130">treat flags as deploys</text>
          </svg>
          <figcaption>Figure 3 — Config is code with worse diffs. Stage it or it will stage an outage for you.</figcaption>
        </figure>
        <p>Keep a last-known-good copy on every host so a broken control plane cannot brick the data plane. That is the same independence rule as the blob store's metadata versus bytes: the thing that tells you what to do must not be the only copy of what you were doing. "Instant global flag" is a product manager's sentence and an SRE's incident title. Prefer cell-based rollout even when the flag UI offers a big red button.</p>

        <h3 class="lesson-subhead" id="sf-coupling">Hidden coupling and the thundering herd</h3>
        <p>Two services that share nothing in the diagram may share a DNS name, a thread pool, a connection limit, a feature-flag store, a cloud quota, or a cold cache. When the cache expires at a round TTL, every replica stampedes the origin together. When a dependency is "optional" but on the request path with a long timeout, it is not optional — it is a latency bomb.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Cache TTL expiry causing a thundering herd on origin">
            <defs>
              <marker id="ah-sf2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="64" text-anchor="middle">N replicas</text>
            <rect class="dg-box y" x="204" y="36" width="200" height="48" rx="7" />
            <text class="dg-s" x="304" y="64" text-anchor="middle">TTL ends together</text>
            <rect class="dg-box r" x="452" y="36" width="248" height="48" rx="7" />
            <text class="dg-s" x="576" y="64" text-anchor="middle">origin sees N x QPS</text>
            <path class="dg-line hot" d="M156 60 H200" marker-end="url(#ah-sf2)" />
            <path class="dg-line hot" d="M404 60 H448" marker-end="url(#ah-sf2)" />
            <text class="dg-s" x="16" y="112">Jitter TTLs. Singleflight / request coalescing. Soft TTL serve-stale.</text>
            <text class="dg-s" x="16" y="130">Shared thread pools couple "unrelated" RPCs into one stall.</text>
            <text class="dg-s" x="16" y="148">Optional deps need short timeouts and a degraded mode, not hope.</text>
          </svg>
          <figcaption>Figure 4 — Hidden coupling is a shared clock, pool, or quota that the diagram did not draw.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sf-partial">Partial failure that looks like success</h3>
        <p>The dangerous outage is not 100% 500s. It is 2% silently wrong: a replica serving stale ACL, a queue dropping the last 1% of writes, a checksum not checked, a multi-AZ deploy that only landed in two of three. SLOs on HTTP 200 hide poison. You need invariants (checksums, fencing tokens, "this replica is not a writer") and client-side probes, not only server success rates.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Most requests succeed while a slice is silently wrong">
            <rect class="dg-box g" x="16" y="36" width="400" height="56" rx="7" />
            <text class="dg-s" x="216" y="68" text-anchor="middle">98% 200, looks healthy</text>
            <rect class="dg-box r" x="432" y="36" width="268" height="56" rx="7" />
            <text class="dg-s" x="566" y="68" text-anchor="middle">2% wrong answers</text>
            <text class="dg-s" x="16" y="116">Poison is worse than downtime. Users trust the 200.</text>
            <text class="dg-s" x="16" y="134">Checksum, idempotency keys, and canaries on correctness, not only QPS.</text>
          </svg>
          <figcaption>Figure 5 — Partial failure is the default in distributed systems. Design for "some of the answers are lies".</figcaption>
        </figure>
        <p>Split brain after a network partition is this shape at its worst: two primaries both accepting writes. The review question is not "do we replicate?" It is "what happens when two of three AZs cannot talk and both think they are the majority?" Fencing tokens, epoch numbers, and "write requires a live lease" are how you make the answer boring. Boring is the goal.</p>

        <h3 class="lesson-subhead" id="sf-deps">Third-party and single-vendor concentration</h3>
        <p>Identity providers, payments, email, SMS, a single cloud region, a single CDN, a single certificate authority: each is a third-party SLO you inherited. Multi-cloud theatre that still shares one DNS host and one IdP has not reduced concentration. Name the vendors in the interview and say which are on the critical path versus cached/degraded. Status pages lie late; synthetic probes from extra networks lie less late. When the vendor is also your monitor, you need a second channel (SMS from another cloud, a phone tree). That sounds folk; it is how people still page during identity-provider outages.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Critical-path vendors versus degradable dependencies">
            <rect class="dg-box r" x="16" y="32" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="54" text-anchor="middle">IdP on login</text>
            <text class="dg-s" x="126" y="70" text-anchor="middle">critical path</text>
            <rect class="dg-box y" x="252" y="32" width="220" height="56" rx="7" />
            <text class="dg-s" x="362" y="54" text-anchor="middle">payments</text>
            <text class="dg-s" x="362" y="70" text-anchor="middle">isolate, timeout</text>
            <rect class="dg-box g" x="488" y="32" width="212" height="56" rx="7" />
            <text class="dg-s" x="594" y="54" text-anchor="middle">email / recs</text>
            <text class="dg-s" x="594" y="70" text-anchor="middle">degrade empty</text>
          </svg>
          <figcaption>Figure 6 — Optional must be optional at runtime: short timeout, cached fallback, or skip. Not a 30 s hang.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sf-review">A failure review you can run on any design</h3>
        <ol class="lesson-checklist">
          <li>Where do retries live, what is the budget, and who sheds first?</li>
          <li>What happens if DNS, TLS, or the global steer for this name is wrong?</li>
          <li>How does config roll out, and can we boot from last-known-good?</li>
          <li>Which caches share a TTL? What coalesces a miss?</li>
          <li>What does 2% silent corruption look like, and how would we notice?</li>
          <li>Which third parties are on the synchronous path?</li>
          <li>Can two partitions both accept writes?</li>
          <li>Does the monitor see the user path, or only our NICs?</li>
        </ol>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Failure review as eight questions around a design">
            <rect class="dg-box b" x="260" y="60" width="200" height="52" rx="7" />
            <text class="dg-s" x="360" y="90" text-anchor="middle">your diagram</text>
            <rect class="dg-box r" x="16" y="16" width="160" height="40" rx="6" />
            <text class="dg-s" x="96" y="40" text-anchor="middle">retries?</text>
            <rect class="dg-box y" x="16" y="116" width="160" height="40" rx="6" />
            <text class="dg-s" x="96" y="140" text-anchor="middle">DNS / TLS?</text>
            <rect class="dg-box o" x="544" y="16" width="160" height="40" rx="6" />
            <text class="dg-s" x="624" y="40" text-anchor="middle">config blast?</text>
            <rect class="dg-box p" x="544" y="116" width="160" height="40" rx="6" />
            <text class="dg-s" x="624" y="140" text-anchor="middle">partial lie?</text>
            <text class="dg-s" x="200" y="168">Spend the last five interview minutes here. It is the seniority signal.</text>
          </svg>
          <figcaption>Figure 7 — The checklist is the chapter. A design that cannot answer these is a happy-path sketch.</figcaption>
        </figure>
        <p>This chapter does not give you a new box to add. It gives you permission to subtract: fewer retries, smaller blast radius, dumber failovers, more probes from outside. The evaluation of every earlier chapter should end here.</p>
        <p>Worked example. You designed the blob store in Chapter 20. Retry every failed chunk three times immediately: a sick rack becomes a rebuild storm plus a client storm. Fail open the metadata plane: you serve 200s with empty manifests. A global lifecycle rule pushed ungated: you delete the hot class everywhere. The review questions would have caught all three before the whiteboard was photographed.</p>
        <p>Worked example. You designed search in Chapter 21. Hedged queries without a delay double load when p99 is already bad. Alias-swap without a query canary ships a mapping that drops a field. A retrying indexer and a retrying query path share the same JVM pool: that is hidden coupling. Partial failure: one shard returns empty top-k, the merge still 200s a truncated page, relevance looks "a bit off" for a week.</p>
        <p>The honest SLO for a large system is not "nothing fails". It is "failures are bounded, visible, and reversible faster than the customer writes a blog post". That sentence is the course.</p>
        <table>
          <thead><tr><th>Shape</th><th>Looks like</th><th>First brake</th></tr></thead>
          <tbody>
            <tr><td>Retry storm</td><td>dependency dies after a blip</td><td>budget, jitter, breaker</td></tr>
            <tr><td>DNS / cert</td><td>green servers, dead users</td><td>probes, short TTL, automate</td></tr>
            <tr><td>Config</td><td>everyone wrong at once</td><td>canary, last-known-good</td></tr>
            <tr><td>Coupling</td><td>unrelated RPCs stall together</td><td>pools, jittered TTL</td></tr>
            <tr><td>Partial lie</td><td>200 with wrong bytes</td><td>checksums, fencing</td></tr>
            <tr><td>Vendor</td><td>your IdP is the outage</td><td>degrade, second path</td></tr>
          </tbody>
        </table>
        <p>Rate limiters (Chapter 19) are one brake on retry storms, not the only one. A client that ignores 429 is still your problem if it is <em>your</em> mobile app; ship a sane SDK.</p>
        <p>Load balancers (Chapter 8) that drain connections slowly during a bad deploy are a coupling of release and traffic. Fast rollback beats clever draining if the artefact is poison.</p>
        <p>Queues (Chapter 16) that retry forever turn a poison message into a hot partition. Poison-pill handling is a failure-mode design, not an afterthought in the consumer.</p>
        <p>Caches (Chapter 17) that never expire hide bugs until a flush. A flush without coalescing is Figure 4. Serve-stale-on-error is how you survive origin death without a herd.</p>
        <p>Collaborative editors (Chapter 36) fail in public when the sequencer dual-writes. Users see duplicated letters. Fencing the old primary is more important than OT trivia in the first five minutes of the outage.</p>
        <p>Blob stores (Chapter 20) fail quietly when scrubbing is off to "save IO". Eleven nines was a model that assumed you look. Bit rot does not page.</p>
        <p>Crawlers (Chapter 33) fail as a social outage: you are banned. Politeness is an SLO with webmasters, not only with your indexer.</p>
        <p>Monitoring (Chapter 14) fails when it shares fate with the product. A second vantage point is not optional if you claim an extra nine.</p>
        <p>If you remember one list from this course, remember retries, DNS, config, coupling, partial correctness, and vendors. Draw them on the last board in every interview.</p>
        <p>Timeouts that are longer than the caller's timeout create retries that the callee never sees complete. Align budgets down the stack, as Chapter 3 said, or you invent ghost load.</p>
        <p>Health checks that hit a cheap /health while /checkout is dead will keep a bad node in rotation. Probe the paying path, or accept the lie.</p>
        <p>Autoscaling on CPU during a retry storm scales the storm. Scale on useful work (committed ops), not on thread time spent failing.</p>
        <p>Deploying all cells at once is a config-shaped failure even when the artefact is a binary. One cell, then a wave. The same as flags.</p>
        <p>Sticky sessions that never expire pin users to a dying node. Drain with a deadline, then reset.</p>
        <p>Clock jumps (leap smear gone wrong, VM pause) break token buckets, TLS, and "for 5m" alerts together. Watch offset, not only NTP process up.</p>
        <p>Disk full is a partial failure: writes 500, reads 200 stale. Alerts on filesystem 90% are unfashionable and still correct.</p>
        <p>File descriptor exhaustion looks like random connect failures. It is coupling of "too many downstreams" with "too many retries".</p>
        <p>Thundering herd on process restart: every replica connecting to Kafka or the DB at once. Stagger boot, jitter connection, cache credentials locally.</p>
        <p>A "temporary" debug flag left on in production is config as destiny. Expiry dates on flags, or they become the architecture.</p>
        <p>Runbooks that say "restart it" without a fencing check will split-brain you during the partition that caused the page.</p>
        <p>Incident comms that wait for a perfect RCA waste the only hour customers will give you. Say what is true, what is unknown, and the next time you will speak.</p>
        <p>Blameless post-mortems that never change a default retry count are theatre. The output is a diff, not a doc.</p>
        <p>Game days: pull DNS, expire a cert in staging, disable Redis for the limiter, partition a ZK/etcd cell. Untested failure modes are fictional SLOs.</p>
        <p>The review checklist at the top of this section is meant to be copied onto the last slide of your design. Use it. That is the whole chapter.</p>
        <p>Bulkheads: separate thread pools for optional and required deps. One slow recommendation RPC must not eat checkout threads.</p>
        <p>Backpressure beats buffering when the consumer is dead. Infinite queues are outage batteries.</p>
        <p>Idempotency keys turn retry storms into no-ops on the write path. Use them for payments and for "create doc".</p>
        <p>Grey failures (slow, not down) are worse than hard down because load balancers still send traffic. Eject on latency, not only on 500s.</p>
        <p>Regional evacuations that update DNS but not the data plane's advertised names leave half the clients in the burning region.</p>
        <p>A status page hosted on the same CDN as the product cannot tell users you are down. Host it elsewhere.</p>
        <p>On-call rotation without a shadow is how tribal knowledge dies at 2am. That is a people-shaped SPOF.</p>
        <p>Change-freezes after a bad week are a control-plane of last resort. They work. Use them while you fix the default retry.</p>
        <p>Correlation ids that stop at the first queue hop make partial failure undebuggable. Propagate them, including through retries.</p>
        <p>Saturation: if you only alert on errors, you miss the queue that is 90% full and about to be 100%. Chapter 13's four golden signals exist for this.</p>
        <p>Security incidents are availability incidents (revoke, rotate, restart). Include key rotation in the failure review.</p>
        <p>The "happy path diagram" is not wrong. It is incomplete. Completeness is the eight questions, answered in writing.</p>
        <p>When two of these shapes combine — bad config plus retries plus DNS — you get the outage that takes a day. Assume combination.</p>
        <p>Stop adding boxes. Start adding sentences about falsehoods. That is the senior move this chapter is for.</p>
        <p>A/B tests that send 50% of traffic to a broken variant are config failures with a science costume. Cap blast radius there too.</p>
        <p>Schema migrations that lock a primary are availability events. Treat them as deploys with a rollback story, not as DBA chores.</p>
        <p>Connection pools that wait forever turn a slow DB into a dead app. Fail the request; keep the process.</p>
        <p>Multicast "notify all pods" of a cache invalidation is a thundering herd with extra steps. Fan out in a tree, or version the key.</p>
        <p>Read-your-writes across regions without a session pin is partial correctness customers will screenshot.</p>
        <p>The checklist is complete when someone who did not draw the diagram can still answer it. Write the answers down in the design doc.</p>
        <p>You will still be surprised. The goal is fewer surprises that take the whole site, and faster reversal when they do.</p>
        <p>Rehearse the rollback of DNS, flags, and binaries on a weekday. Night-one of an outage is a bad first rehearsal.</p>
        <p>If only one person can revoke a bad flag, that person is an availability component. Train a second.</p>
        <p>Write the failure story before the launch review, not after the first SEV. The whiteboard still has space.</p>
        <p>Defaults should survive a missing config file. Missing must not mean "unlimited retries" or "fail open on login".</p>
        <p>That is enough patterns. Use them on the next chapter you design, including this site's own stack.</p>
        <p>Cross-link: Chapters 3, 4, 7, 14, 15, 19, 20, 21, 33, 36 are the usual crime scenes. Re-read those evaluations with this checklist in hand.</p>
        <p>Retries, DNS, config, coupling, partial lies, vendors. Six shapes. Eight questions. Use them.</p>
        <p>The next outage will rhyme with one of these. Design like you have already met it.</p>
        <p>That is the end of the construction course. Operate what you drew.</p>
        <p>A design interview that never mentions failure is a product pitch. Finish with this chapter's list.</p>
        <p>Green boxes are not safety. Safety is a named falsehood and a brake.</p>
        <p>Now go back and add those sentences to every design you already drew.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why can an outage continue after the trigger is gone? (2) Why are green server metrics compatible with a total user outage? (3) What makes config more dangerous than a binary deploy? (4) Pick any earlier chapter's design and answer the eight review questions out loud.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Outage patterns, retry amplification and control-plane failure are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
