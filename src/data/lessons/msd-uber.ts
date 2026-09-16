/** Modern System Design — Chapter 29: Design Uber.
 *  Matching supply and demand with a location stream and a trip state machine.
 */

export const msdUber = {
  slug: 'uber',
  title: 'Design Uber',
  subtitle:
    'Ride-hailing is a matching problem under a latency SLA, fed by a location stream you cannot afford to store as rows, on top of a trip state machine that has to be right because it moves money. Surge, dispatch and fraud are policy on that machine, not extra databases.',
  byline: 'Modern System Design · Chapter 29 · ~2h 10m read · Advanced',
  interviewTip:
    'Draw the trip state machine early and keep location off the critical path except as an index of nearby supply. Quote the ping math (Chapter 5 style): millions of drivers times a few-second interval is a stream, not a table. Matching is "query the geo index for k drivers, rank, offer, timeout, retry", not a global optimisation. Point payments and fraud at the payment chapter instead of inventing a ledger on the whiteboard.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Uber',
      children: [
        { id: 'ub-what', title: 'What we are actually building' },
        { id: 'ub-match', title: 'Matching is the product' },
        { id: 'ub-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>A rider wants a car in a few minutes. A driver wants a paid trip without staring at a map of noise. The company wants a marketplace that clears, with prices that rise when cars vanish. Everything else — chat, receipts, maps — is supporting cast.</p>

        <h3 class="lesson-subhead" id="ub-what">What we are actually building</h3>
        <p>Track driver locations, match a ride request to a driver, run a trip through a state machine (requested, matched, en route, onboard, completed, cancelled, paid), show ETAs, apply surge, and settle money. The maps chapter supplies tiles and routing; we will call those services, not rebuild them.</p>

        <h3 class="lesson-subhead" id="ub-match">Matching is the product</h3>
        <p>This is not "find nearest point" as a one-shot. Drivers decline, move, go offline. The match loop is: retrieve candidates from a geo index of idle drivers, rank (ETA, rating, fairness), offer, wait a few seconds, retry. Optimising a global assignment of all riders to all drivers is a research paper; production is greedy with constraints, plus surge to move supply.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Dispatch loop for a ride request">
            <defs>
              <marker id="ah-ub1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="12" y="40" width="110" height="44" rx="7" />
            <text class="dg-s" x="67" y="66" text-anchor="middle">request</text>
            <rect class="dg-box c" x="146" y="40" width="120" height="44" rx="7" />
            <text class="dg-s" x="206" y="66" text-anchor="middle">nearby idx</text>
            <rect class="dg-box p" x="290" y="40" width="110" height="44" rx="7" />
            <text class="dg-s" x="345" y="66" text-anchor="middle">rank k</text>
            <rect class="dg-box y" x="424" y="40" width="110" height="44" rx="7" />
            <text class="dg-s" x="479" y="66" text-anchor="middle">offer</text>
            <rect class="dg-box g" x="558" y="40" width="146" height="44" rx="7" />
            <text class="dg-s" x="631" y="66" text-anchor="middle">accept / retry</text>
            <path class="dg-line blue" d="M122 62 H142" marker-end="url(#ah-ub1)" />
            <path class="dg-line blue" d="M266 62 H286" marker-end="url(#ah-ub1)" />
            <path class="dg-line blue" d="M400 62 H420" marker-end="url(#ah-ub1)" />
            <path class="dg-line blue" d="M534 62 H554" marker-end="url(#ah-ub1)" />
            <text class="dg-s" x="12" y="118">A timeout is not a failure of the database. It is a normal edge on the state machine.</text>
            <text class="dg-s" x="12" y="134">Hold the trip in requested until a driver accepts or the rider cancels.</text>
          </svg>
          <figcaption>Figure 1 — Dispatch is a loop with a clock, not a single SELECT.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ub-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Driver pings</td><td>Stream ingest + in-memory geo index</td></tr>
            <tr><td>ETA / path</td><td>Routing service (Ch 27)</td></tr>
            <tr><td>Trip durability</td><td>DB with conditional writes</td></tr>
            <tr><td>Offers, webhooks</td><td>Queue + push to device</td></tr>
            <tr><td>Money</td><td>Payment system (Ch 38)</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Do not store ping history as the source of truth for matching.</strong> The matching index is the latest point (or a short trail) per driver. History, if you keep it, is an analytics stream with a retention policy, the same reduction idea as map probes.</div>
      `,
    },
    {
      id: 'requirements',
      title: "Requirements of Uber’s Design",
      children: [
        { id: 'ub-func', title: 'Functional requirements' },
        { id: 'ub-nonfunc', title: 'Non-functional requirements' },
        { id: 'ub-est', title: 'Ping math and traffic' },
        { id: 'ub-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ub-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li>Request a ride, cancel, see ETA and driver location during the trip.</li>
          <li>Drivers go online/offline, receive offers, start/end trips.</li>
          <li>Fare quote up front, surge when demand exceeds supply.</li>
          <li>Settle payment after completion; handle failed charges.</li>
        </ol>
        <h3 class="lesson-subhead" id="ub-nonfunc">Non-functional requirements</h3>
        <table>
          <thead><tr><th>Metric</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Match p95</td><td>first offer in a few seconds in dense cities</td></tr>
            <tr><td>Ping ingest</td><td>lossy OK; index lag &lt; 2–4 s</td></tr>
            <tr><td>Trip state</td><td>strongly consistent per trip id</td></tr>
            <tr><td>Quote vs fare</td><td>bounded surprise; explain extras</td></tr>
            <tr><td>Availability</td><td>matching 99.99% in a city; one city may fail independently</td></tr>
          </tbody>
        </table>
        <h3 class="lesson-subhead" id="ub-est">Ping math and traffic</h3>
        <pre><code>Use the Chapter 5 style openly.

DRIVERS
  1M drivers worldwide, 100k online at peak in one large region
  ping every 4 s while online (maps: same order as navigators)
  100k / 4 = 25,000 pings/sec in that region
  200 B payload -> 5 MB/sec  (easy for a stream)
  NOT easy if each ping is an UPDATE on a row that is also locked by matching

RIDES
  10M trips/day globally -> ~100/sec avg, ~500/sec peak
  matching QPS is trip-start QPS, not ping QPS

INDEX
  100k points in a quadtree / geohash grid in RAM
  nearby query is microseconds to milliseconds
  shard the index by city, not by driver id hash
    (a hash shard would scatter a city query across the fleet)</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 120" role="img" aria-label="Pings versus trip writes">
            <defs>
              <marker id="ah-ub2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="24" width="330" height="50" rx="7" />
            <text class="dg-s" x="181" y="54" text-anchor="middle">25k pings/sec -> memory index</text>
            <rect class="dg-box g" x="374" y="24" width="330" height="50" rx="7" />
            <text class="dg-s" x="539" y="54" text-anchor="middle">500 trip writes/sec -> DB</text>
            <path class="dg-line green" d="M346 49 H370" marker-end="url(#ah-ub2)" />
            <text class="dg-s" x="16" y="100">If those numbers share one Postgres table, the pings will win and matching will lose.</text>
          </svg>
          <figcaption>Figure 2 — Two timescales, two stores. Mixing them is the classic Uber whiteboard failure.</figcaption>
        </figure>
        <h3 class="lesson-subhead" id="ub-api">API sketch</h3>
        <pre><code>POST /trips                 { pickup, dropoff, product }
  -> { tripId, quote, state: requested }
POST /trips/{id}/cancel
POST /driver/ping           { lat, lng, heading, ts }  # batched
POST /driver/offers/{id}    { accept: bool }
GET  /trips/{id}            # rider poll / WS
# payments are not these endpoints — see Ch 38</code></pre>
      `,
    },
    {
      id: 'high',
      title: 'High-level Design of Uber',
      children: [
        { id: 'ub-city', title: 'Shard by city' },
        { id: 'ub-idx', title: 'Geospatial index of nearby drivers' },
        { id: 'ub-sm', title: 'Trip state machine' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ub-city">Shard by city</h3>
        <p>Matching is local. Put ingest, the in-memory index, dispatch workers and the trip partition for a city together. A rider in Lisbon must not query a global ring. Failover is city-sized: lose Lisbon's dispatch cluster and Lisbon stops; London continues. That is an acceptable blast radius for this product.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="City-sharded Uber control plane">
            <defs>
              <marker id="ah-ub3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="120" height="48" rx="7" />
            <text class="dg-s" x="76" y="64" text-anchor="middle">edge API</text>
            <rect class="dg-box y" x="168" y="16" width="160" height="88" rx="8" />
            <text class="dg-s" x="248" y="44" text-anchor="middle">city: LIS</text>
            <text class="dg-s" x="248" y="62" text-anchor="middle">index + dispatch</text>
            <text class="dg-s" x="248" y="80" text-anchor="middle">trip DB shard</text>
            <rect class="dg-box g" x="360" y="16" width="160" height="88" rx="8" />
            <text class="dg-s" x="440" y="44" text-anchor="middle">city: LON</text>
            <text class="dg-s" x="440" y="62" text-anchor="middle">index + dispatch</text>
            <text class="dg-s" x="440" y="80" text-anchor="middle">trip DB shard</text>
            <rect class="dg-box l" x="552" y="36" width="152" height="48" rx="7" />
            <text class="dg-s" x="628" y="64" text-anchor="middle">global users</text>
            <path class="dg-line violet" d="M136 60 H164" marker-end="url(#ah-ub3)" />
            <text class="dg-s" x="16" y="128">Route by pickup geohash to a city. Global user profiles can live elsewhere.</text>
          </svg>
          <figcaption>Figure 3 — Locality is the scalability trick. Hashing drivers globally would be a self-own.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ub-idx">Geospatial index of nearby drivers</h3>
        <p>Each online driver is a point in an in-memory grid (geohash cells with skip lists, or a quadtree). Pings upsert the point and a timestamp. A sweeper drops drivers whose ping is older than ~15 s. Nearby is "cells covering radius r, filter by haversine and product type (bike vs car)". Idle-only: matched drivers leave the idle index and enter a trip index if the rider needs to see them.</p>

        <h3 class="lesson-subhead" id="ub-sm">Trip state machine</h3>
        <p>Persist trips with optimistic versioning. Legal transitions: requested → matched → enroute → onboard → completed; any pre-onboard state → cancelled; completed → paying → paid (or pay_failed). Dispatch offers are not trip state until accept; they are ephemeral leases on a driver ("this driver is reserved for 12 s").</p>
        <p>If two trips offer the same driver, the index must show reserved. Compare-and-set on driver occupancy is the concurrency primitive. Without it you double-book, which is a support incident and sometimes a safety one.</p>
      `,
    },
    {
      id: 'detailed',
      title: 'Detailed Design of Uber',
      children: [
        { id: 'ub-surge', title: 'Surge as a feedback loop' },
        { id: 'ub-dispatch', title: 'Dispatch details' },
        { id: 'ub-eval-d', title: 'What still breaks' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ub-surge">Surge as a feedback loop</h3>
        <p>Measure requested-but-unmatched and idle-driver density per cell every minute. When demand/supply exceeds a threshold, publish a multiplier for that cell. Quotes read the multiplier; drivers see a heatmap (a product decision). Surge is not a moral lecture on the whiteboard — it is load shedding with a price, cheaper than dropping requests.</p>
        <p>Cap the multiplier and decay it, or you strand riders and invite regulatory pain. Store surge as a small cell map in memory, the same grid as the index.</p>

        <h3 class="lesson-subhead" id="ub-dispatch">Dispatch details</h3>
        <p>Rank candidates by ETA from the routing service, with a batch of k (say 5–20). Sequential offer (less collision) versus broadcast (faster match, more declines) is a product trade-off; say both. Push via persistent connection to the driver app (the WhatsApp chapter's last-mile idea). If the phone is asleep, the offer TTL expires and you try the next.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 130" role="img" aria-label="Driver occupancy CAS during offer">
            <defs>
              <marker id="ah-ub4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="32" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="60" text-anchor="middle">idle in index</text>
            <rect class="dg-box o" x="208" y="32" width="160" height="48" rx="7" />
            <text class="dg-s" x="288" y="60" text-anchor="middle">reserved 12s</text>
            <rect class="dg-box g" x="400" y="32" width="140" height="48" rx="7" />
            <text class="dg-s" x="470" y="60" text-anchor="middle">on trip</text>
            <rect class="dg-box b" x="572" y="32" width="132" height="48" rx="7" />
            <text class="dg-s" x="638" y="60" text-anchor="middle">idle again</text>
            <path class="dg-line hot" d="M176 56 H204" marker-end="url(#ah-ub4)" />
            <path class="dg-line hot" d="M368 56 H396" marker-end="url(#ah-ub4)" />
            <path class="dg-line hot" d="M540 56 H568" marker-end="url(#ah-ub4)" />
            <text class="dg-s" x="16" y="108">Timeout from reserved returns to idle without a human. That path must be lossless.</text>
          </svg>
          <figcaption>Figure 4 — Occupancy is a lease. Leases that cannot expire will strand supply.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ub-eval-d">What still breaks</h3>
        <p>Airports and stadiums are adversarial geometry: everyone is in one cell. You need venue-specific matching, not a bigger radius. Rural areas have empty indexes; matching SLA cannot be the city number. Clock skew on pings mis-orders "latest" points; use server receive time for eviction, client time only for analytics.</p>
      `,
    },
    {
      id: 'pay',
      title: 'Payment Service and Fraud Detection in Uber Design',
      children: [
        { id: 'ub-pay', title: 'Do not design the ledger here' },
        { id: 'ub-fraud', title: 'Fraud as signals on the trip' },
        { id: 'ub-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ub-pay">Do not design the ledger here</h3>
        <p>When the trip hits <code>completed</code>, emit a payment intent: amount, rider, driver, trip id as idempotency key. The <a href="/learn/modern-system-design/payment-system">payment system chapter</a> owns captures, refunds, splits, retries and reconciliation. Ride-hailing's only extra is splitting a fare between platform and driver and handling payment-method failure before the trip (auth hold) versus after.</p>
        <p>If you sketch Stripe calls inside the dispatch service, you have coupled a 4-second matching loop to a 2-second HTTP call that can deadlock on a PSP outage. Queue the intent.</p>

        <h3 class="lesson-subhead" id="ub-fraud">Fraud as signals on the trip</h3>
        <p>Stolen cards, fake GPS, collusion (rider+driver looping). Feed device, payment, GPS-vs-route, and graph features into a scorer that can block a request or hold a payout. False positives strand real riders, so the first version is "review queue for payouts", not "ban on sight". GPS spoofing is an arms race; say so and do not pretend a checksum on lat/lng saves you.</p>

        <h3 class="lesson-subhead" id="ub-eval">Evaluation</h3>
        <p>We used greedy matching; marketplace efficiency suffers at the busy airport. We pointed at Chapter 38 rather than specifying holds versus captures. We did not design driver incentives except surge. Multi-city trips (pickup in A, dropoff in B) break a naive city shard — route by pickup, then hand the trip to a global record once matched.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why shard matching by city? (2) Compute pings/sec for 80k online drivers at 4 s. (3) What is a reservation lease for? (4) Why is payment a different system from dispatch?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Dispatch, geospatial supply indexes and trip state machines are standard industry ideas; the explanations, diagrams, tables and exercises are our own.',
};
