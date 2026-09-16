/** Modern System Design — Chapter 18: The Pub-Sub Abstraction.
 *  Cardinality versus queues, durable versus ephemeral, isolation of slow
 *  subscribers, schema registry, device fan-out, Kafka / SNS / Redis.
 */

export const msdPubSub = {
  slug: 'pub-sub',
  title: 'The Pub-Sub Abstraction',
  subtitle:
    'A queue delivers each message to one consumer. Pub-sub delivers the same event to every subscriber that asked. That single change of cardinality is why fan-out, filtering, durability and slow-subscriber isolation become the design, not a footnote.',
  byline: 'Modern System Design · Chapter 18 · ~1h 25m read · Intermediate',
  interviewTip:
    'Draw the cardinality first. "The payment-succeeded event is published once; billing, email, analytics and fraud each subscribe independently" tells the interviewer you know this is not a work queue. Then name durability and isolation: durable topics with retention, pull consumers so a slow analytics pipeline cannot stall billing, and a schema registry so a new field does not break old subscribers. Finish by admitting that pub-sub is harder to debug than a queue because there is no single owner of a message.',
  sections: [
    {
      id: 'ps-problem',
      title: 'System Design: The Pub-Sub Abstraction',
      children: [
        { id: 'ps-card', title: 'Cardinality is the whole difference' },
        { id: 'ps-when', title: 'When pub-sub is the right block' },
        { id: 'ps-not', title: 'When it is a fashionable queue' },
      ],
      html: `
        <p><a href="/learn/modern-system-design/messaging-queue">Chapter 17</a> delivered a message to one worker (or to one member of a consumer group). Pub-sub delivers the same event to <em>every</em> subscriber that declared an interest. Billing does not have to know that email exists. Email does not have to know that fraud exists. The publisher should not be edited when a fifth subscriber appears on Friday.</p>
        <p>That decoupling is the product. The cost is that "who consumed this?" no longer has a single answer, a slow subscriber can drown a naive broker, and a schema change is a distributed breaking change.</p>
        <p>Interviews go wrong when the candidate draws a queue and writes "fan-out" on the arrow. Fan-out is a copy. A competing-consumer queue is a steal. If fraud and email must both see <code>OrderPaid</code>, a single SQS queue with two workers will give the event to one of them and you will debug missing emails for a week. Cardinality first. Always.</p>

        <h3 class="lesson-subhead" id="ps-card">Cardinality is the whole difference</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Queue competing consumers versus pub-sub fan-out to independent subscribers">
            <defs>
              <marker id="ah-ps1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-ps1b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">QUEUE  ·  ONE WINNER</text>
            <rect class="dg-box o" x="26" y="56" width="90" height="28" rx="5" />
            <text class="dg-s" x="71" y="74" text-anchor="middle">msg</text>
            <rect class="dg-box y" x="160" y="44" width="80" height="24" rx="5" />
            <text class="dg-s" x="200" y="60" text-anchor="middle">w1</text>
            <rect class="dg-box c" x="160" y="76" width="80" height="24" rx="5" />
            <text class="dg-s" x="200" y="92" text-anchor="middle">w2 idle</text>
            <rect class="dg-box c" x="160" y="108" width="80" height="24" rx="5" />
            <text class="dg-s" x="200" y="124" text-anchor="middle">w3 idle</text>
            <path class="dg-line violet" d="M116 70 H156" marker-end="url(#ah-ps1)" />
            <text class="dg-s" x="26" y="160">Work is stolen, not copied.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="168" rx="10" />
            <text class="dg-h" x="382" y="36">PUB-SUB  ·  ALL GET IT</text>
            <rect class="dg-box g" x="382" y="56" width="90" height="28" rx="5" />
            <text class="dg-s" x="427" y="74" text-anchor="middle">event</text>
            <rect class="dg-box b" x="516" y="40" width="90" height="22" rx="5" />
            <text class="dg-s" x="561" y="55" text-anchor="middle">billing</text>
            <rect class="dg-box b" x="516" y="70" width="90" height="22" rx="5" />
            <text class="dg-s" x="561" y="85" text-anchor="middle">email</text>
            <rect class="dg-box b" x="516" y="100" width="90" height="22" rx="5" />
            <text class="dg-s" x="561" y="115" text-anchor="middle">fraud</text>
            <rect class="dg-box b" x="516" y="130" width="90" height="22" rx="5" />
            <text class="dg-s" x="561" y="145" text-anchor="middle">analytics</text>
            <path class="dg-line green" d="M472 66 H512 V51" marker-end="url(#ah-ps1b)" />
            <path class="dg-line green" d="M472 70 H512" marker-end="url(#ah-ps1b)" />
            <path class="dg-line green" d="M472 74 H512 V111" marker-end="url(#ah-ps1b)" />
            <path class="dg-line green" d="M472 78 H500 V141 H512" marker-end="url(#ah-ps1b)" />
          </svg>
          <figcaption>Figure 1 — If only one subscriber should act, you wanted a queue. If four teams independently care, you wanted pub-sub.</figcaption>
        </figure>
        <p>Kafka consumer groups sit in the middle: the log is pub-sub (each group sees every record); inside a group it is a queue (each partition goes to one member). That is why so many designs "just use Kafka" — they need both shapes. Name which shape each subscriber is using.</p>

        <h3 class="lesson-subhead" id="ps-when">When pub-sub is the right block</h3>
        <p>Domain events with multiple owners: <code>OrderPaid</code>, <code>UserSignup</code>, <code>InventoryChanged</code>. Real-time fan-out: live comments, presence, sports scores, cache invalidation to many app servers. Operational signals: config changes, feature flags, "this shard is draining." The publisher's success must not depend on subscriber success. That last sentence is the isolation rule this whole chapter enforces.</p>
        <p>Requirements: publish once; N independent subscriptions; optional filters; durable or ephemeral per subscription; observe lag per subscriber; replay within retention. Non-functional: publisher p99 unchanged when analytics is a day behind; schema evolution without coordinated deploys; fan-out to devices is a separate tier.</p>

        <h3 class="lesson-subhead" id="ps-not">When it is a fashionable queue</h3>
        <p>One subscriber, one job, delete on ack: that is Chapter 17. Using topics "because microservices" and then coupling them with shared databases and synchronous calls is fashion. Using pub-sub for a two-phase commit ("wait until all subscribers ack, then commit the order") puts the slowest and flakiest subscriber on the write path. If you need a join of effects, you need a workflow engine (<a href="/learn/modern-system-design/task-scheduler">Chapter 23</a>), not a topic.</p>
        <div class="lesson-callout"><strong>Publishers must not care who is listening.</strong> The moment the publisher's code names the email service, you do not have pub-sub. You have a disguised function call with extra failure modes.</div>
      `,
    },
    {
      id: 'ps-intro',
      title: 'Introduction to Pub-Sub',
      children: [
        { id: 'ps-vocab', title: 'Topics, subscriptions, push and pull' },
        { id: 'ps-dur', title: 'Ephemeral versus durable' },
        { id: 'ps-filter', title: 'Filtering, fan-out cost and schema' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ps-vocab">Topics, subscriptions, push and pull</h3>
        <p>A <strong>topic</strong> is a named stream of events. A <strong>subscription</strong> is a durable (or not) cursor over that stream, owned by one logical consumer. <strong>Push</strong> means the broker HTTP-calls you; <strong>pull</strong> means you fetch. Push is easier to demo and harder to operate: your endpoint is now a public-ish ingest, retries are the broker's problem, and a slow endpoint backs up the broker's push workers. Pull puts back-pressure where it belongs — the consumer stops fetching. SNS+SQS is push-to-queue then pull; Kafka is pull; Redis Pub/Sub is push and ephemeral.</p>
        <table>
          <thead><tr><th>System</th><th>Durability</th><th>Fan-out</th><th>Isolation of slow readers</th></tr></thead>
          <tbody>
            <tr><td>Redis Pub/Sub</td><td>None (offline means missed)</td><td>Cheap, in-memory</td><td>Bad: slow client fills buffers</td></tr>
            <tr><td>Kafka / Pulsar</td><td>Log retention</td><td>Consumer groups</td><td>Good: independent offsets</td></tr>
            <tr><td>SNS + SQS</td><td>Per-queue</td><td>SNS fan-out</td><td>Good: each SQS is isolated</td></tr>
            <tr><td>NATS JetStream</td><td>Optional</td><td>Subjects + wildcards</td><td>Good with consumers, not raw pub/sub</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Push into a per-subscriber queue versus pull from a shared log">
            <defs>
              <marker id="ah-ps2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="44" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="64" text-anchor="middle">SNS push</text>
            <text class="dg-s" x="86" y="80" text-anchor="middle">into SQS</text>
            <rect class="dg-box g" x="200" y="44" width="220" height="48" rx="7" />
            <text class="dg-s" x="310" y="64" text-anchor="middle">per-sub queue</text>
            <text class="dg-s" x="310" y="80" text-anchor="middle">isolated lag</text>
            <rect class="dg-box b" x="464" y="44" width="240" height="48" rx="7" />
            <text class="dg-s" x="584" y="64" text-anchor="middle">Kafka pull</text>
            <text class="dg-s" x="584" y="80" text-anchor="middle">own offset</text>
            <path class="dg-line cyan" d="M156 68 H196" marker-end="url(#ah-ps2)" />
          </svg>
          <figcaption>Figure 2 — Isolation is either a private queue or a private cursor. A shared in-memory bus has neither.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ps-dur">Ephemeral versus durable</h3>
        <p>Ephemeral pub-sub (Redis, raw NATS, websocket fan-out) is a live wire. Fine for "who is typing" and stock ticks that expire in a second. A billing subscriber that restarts must not miss <code>OrderPaid</code>. Durable subscriptions keep unacked (or un-offset) events until the subscriber catches up, bounded by retention. The bound matters: a subscriber down for longer than retention has a gap. That is a restore problem, not a "replay the topic" hope. Publish a snapshot plus a stream if gaps are unforgivable.</p>
        <p>Retention is a product SLO in disguise. Seven days means a team on holiday can still catch up. Two hours means a weekend deploy that pages nobody leaves a hole. The data-lake copy is how you keep years without forcing the production log to be an archive. Mixing those jobs is how Kafka disks fill on a Friday.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Publisher, topic, and three subscriptions with independent lag">
            <defs>
              <marker id="ah-ps3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="76" text-anchor="middle">publisher</text>
            <rect class="dg-box p" x="180" y="52" width="120" height="40" rx="7" />
            <text class="dg-s" x="240" y="76" text-anchor="middle">topic log</text>
            <rect class="dg-box g" x="380" y="16" width="140" height="32" rx="6" />
            <text class="dg-s" x="450" y="36" text-anchor="middle">sub billing 0 lag</text>
            <rect class="dg-box o" x="380" y="56" width="140" height="32" rx="6" />
            <text class="dg-s" x="450" y="76" text-anchor="middle">sub email 2s</text>
            <rect class="dg-box r" x="380" y="96" width="200" height="32" rx="6" />
            <text class="dg-s" x="480" y="116" text-anchor="middle">sub analytics 4 hours</text>
            <path class="dg-line violet" d="M116 72 H176" marker-end="url(#ah-ps3)" />
            <path class="dg-line violet" d="M300 64 H348 V32 H376" marker-end="url(#ah-ps3)" />
            <path class="dg-line violet" d="M300 72 H376" marker-end="url(#ah-ps3)" />
            <path class="dg-line violet" d="M300 80 H348 V112 H376" marker-end="url(#ah-ps3)" />
          </svg>
          <figcaption>Figure 3 — Isolation means billing's SLO is not analytics' lag. Redis PUBLISH does not give you this picture.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ps-filter">Filtering, fan-out cost and schema</h3>
        <p>Server-side filters ("only <code>region=eu</code>") save subscribers from seeing the firehose. They cost broker CPU and they hide traffic: a bad filter looks like "the topic is silent." Client-side filters are honest and wasteful. SNS filter policies and Kafka consumer logic are the two common answers; pick one and load-test the match rate.</p>
        <p>Fan-out cost is physical. One 1 KB event to 10,000 websocket subscribers is 10 MB, plus per-connection overhead, at whatever rate the topic ticks. That is a dedicated fan-out tier (or a CDN of events, or partition subscribers by geography), not a single broker thread. Interviews that say "notify all followers" are Instagram, not Redis PUBLISH.</p>
        <p>Schema: add a field, old subscribers ignore it (forward compatible). Rename or change type, old subscribers crash (a poison event for them, a fine event for others). A registry with a compatibility rule (Avro/Protobuf BACKWARD) is the adult supervision. Without it, pub-sub is a way to crash many services with one deploy.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Schema registry between publisher and many subscriber versions">
            <defs>
              <marker id="ah-ps4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah pink" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="44" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="72" text-anchor="middle">publisher</text>
            <rect class="dg-box p" x="196" y="44" width="200" height="48" rx="7" />
            <text class="dg-s" x="296" y="64" text-anchor="middle">schema registry</text>
            <text class="dg-s" x="296" y="80" text-anchor="middle">BACKWARD rule</text>
            <rect class="dg-box g" x="436" y="24" width="120" height="36" rx="6" />
            <text class="dg-s" x="496" y="46" text-anchor="middle">sub v1</text>
            <rect class="dg-box b" x="436" y="76" width="120" height="36" rx="6" />
            <text class="dg-s" x="496" y="98" text-anchor="middle">sub v2</text>
            <rect class="dg-box o" x="580" y="48" width="124" height="40" rx="6" />
            <text class="dg-s" x="642" y="72" text-anchor="middle">reject break</text>
            <path class="dg-line pink" d="M156 68 H192" marker-end="url(#ah-ps4)" />
            <path class="dg-line pink" d="M396 60 H432 V42" marker-end="url(#ah-ps4)" />
            <path class="dg-line pink" d="M396 76 H432 V94" marker-end="url(#ah-ps4)" />
          </svg>
          <figcaption>Figure 4 — Compatibility is a broker-adjacent service, not a wiki page. A breaking field is an outage multiplier.</figcaption>
        </figure>
      `,
    },
    {
      id: 'ps-design',
      title: 'Design of a Pub-Sub System',
      children: [
        { id: 'ps-arch', title: 'The architecture we would ship' },
        { id: 'ps-iso', title: 'Isolating slow subscribers' },
        { id: 'ps-fan', title: 'Fan-out to devices' },
        { id: 'ps-order', title: 'Ordering, keys and replay' },
        { id: 'ps-eval', title: 'Where this design falls short' },
        { id: 'ps-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ps-arch">The architecture we would ship</h3>
        <p>For domain events inside a company: a replicated log (Kafka/Pulsar) with one topic per aggregate or bounded context, not one topic for the company. Producers use the outbox from Chapter 17. Each subscribing team gets its own consumer group, its own lag alert, its own DLQ. Schema registry required. Retention 3–7 days plus a snapshot store for rebuilds.</p>
        <p>For live client fan-out: a separate path. The log is the source; a fan-out tier (MQTT, a websocket mesh, or SNS to mobile push) owns the million connections. Do not attach browsers to Kafka. For ephemeral presence, Redis is allowed if missing a second of "typing…" is harmless.</p>
        <pre><code>POST /topics/{topic}/events     { id, type, key, payload, ts }
GET  /subscriptions/{id}/pull   -&gt; { events[], cursor }
POST /subscriptions/{id}/ack    { cursor }

# ops
GET  /topics/{topic}/lag        per subscription
POST /subscriptions/{id}/replay { fromTs | fromOffset }</code></pre>
        <p>Estimation: 20,000 events/s, 2 KB, 8 subscriber groups → 20k * 2 KB * 8 = 320 MB/s egress from the log. That is the number that makes you stop putting this on one Redis. Storage is Chapter 17's retention math.</p>

        <h3 class="lesson-subhead" id="ps-iso">Isolating slow subscribers</h3>
        <p>Pull + independent offsets is the primary isolation. Quota the analytics group so it cannot saturate disk reads. Copy a topic into a cheaper, longer-retention cluster for the data lake rather than forcing the production cluster to keep 90 days for one scientist. If you must push, push into a per-subscriber queue (SNS→SQS), never into a shared thread pool that also serves billing.</p>
        <p>Back-pressure on the publisher is almost always wrong here: the publisher's job was to record that the order paid. Slow analytics must not 503 checkout. Bound analytics' lag and page <em>them</em>.</p>
        <p>Poison events are per subscriber. A JSON field billing cannot parse must land in billing's DLQ without stalling email. That is another reason independent offsets beat a shared in-memory bus: one bad consumer cannot pin the head of a global queue that everyone else reads. Alert on DLQ depth per team, not on a single "the topic is unhealthy" light.</p>

        <h3 class="lesson-subhead" id="ps-fan">Fan-out to devices</h3>
        <p>Ten million mobile devices are not ten million Kafka consumers. Pattern: the event lands once in the log; a fan-out service maps user id → device tokens (or websocket connections), shards by user, and talks APNs/FCM or a connection mesh. Cap payload. Collapse duplicates. A slow device store must not stall the domain topic — another subscription, another SLO.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Log to fan-out tier to devices, not browsers on Kafka">
            <defs>
              <marker id="ah-ps5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="78" text-anchor="middle">topic log</text>
            <rect class="dg-box b" x="176" y="52" width="160" height="44" rx="7" />
            <text class="dg-s" x="256" y="78" text-anchor="middle">fan-out workers</text>
            <rect class="dg-box y" x="376" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="446" y="78" text-anchor="middle">APNs / FCM</text>
            <rect class="dg-box g" x="556" y="52" width="148" height="44" rx="7" />
            <text class="dg-s" x="630" y="78" text-anchor="middle">devices</text>
            <path class="dg-line green" d="M136 74 H172" marker-end="url(#ah-ps5)" />
            <path class="dg-line green" d="M336 74 H372" marker-end="url(#ah-ps5)" />
            <path class="dg-line green" d="M516 74 H552" marker-end="url(#ah-ps5)" />
          </svg>
          <figcaption>Figure 5 — Device fan-out is its own building block. The log stays small and mean.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ps-order">Ordering, keys and replay</h3>
        <p>Kafka gives you order per partition key, not a global timeline. Publish <code>OrderPaid</code> with key = order_id so billing never sees paid-before-created for that order. Different orders may interleave; that is correct. A global ordered topic is a single-partition bottleneck wearing a tuxedo.</p>
        <p>Replay is a cursor move, not a time machine for side effects. Replaying <code>OrderPaid</code> into billing without idempotency double-charges. The event id (or order_id plus event type) must be the worker's idempotency key. Schema evolution makes old payloads replayable only if you kept forward compatibility — another reason the registry exists.</p>
        <p>Dead-letter plus replay is the operator loop: inspect, fix the consumer, replay from the DLQ, not from the dawn of the topic. Dawn-of-topic replay is how you DDoS a downstream that was not sized for 7 days of catch-up in an hour. Rate-limit catch-up per subscription.</p>

        <h3 class="lesson-subhead" id="ps-eval">Where this design falls short</h3>
        <p>No global "all subscribers done" without building a workflow on top. Debugging is worse: one event, eight codebases, eight failure modes. Ordering is still per key, and different subscribers may observe the stream at different times — billing can charge before email has seen the event; that is normal, not a bug, unless a product person wrote "atomically." Multi-region pub-sub is a replicated log plus conflict rules; last-write-wins on events is how you lose a payment.</p>
        <p>Redis Pub/Sub remains the wrong default for anything you would be sad to lose. It is in this chapter so you can reject it with a reason, not a brand preference. Schema registries fail closed (good) until someone sets FULL compatibility and then nobody can ship.</p>
        <p>Exactly-once across subscribers is a category error. Each subscriber is at-least-once with its own cursor. "All of billing, email and fraud have processed this" is a workflow join, which is Chapter 23, not a topic ack. If product requires that join, you are no longer in this building block.</p>
        <p>Multi-region active-active logs duplicate or conflict. Mirror asynchronously and accept lag, or publish into one region and read replicas. Last-write-wins on the same event id is how a payment event disappears. Prefer append-only logs with idempotent consumers over merging events.</p>
        <p>Cost: 320 MB/s egress at eight groups is a networking bill before it is a Kafka bill. Compact payloads. Do not attach PDFs. Put blobs in the blob store and publish a pointer. That single habit is the difference between a topic you can retain for seven days and a topic you cannot retain for seven hours.</p>
        <p>Consumer groups that share a group id by copy-paste will partition-steal from each other and look like "lost messages." Group id is a lock. Treat it like a production name, not a default string in a tutorial.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Kafka SNS Redis as three default picks">
            <defs>
              <marker id="ah-ps6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="126" y="60" text-anchor="middle">Kafka</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">durable domain events</text>
            <rect class="dg-box g" x="250" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="360" y="60" text-anchor="middle">SNS + SQS</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">isolated AWS teams</text>
            <rect class="dg-box o" x="484" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="594" y="60" text-anchor="middle">Redis</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">ephemeral presence</text>
            <path class="dg-line blue" d="M236 68 H246" marker-end="url(#ah-ps6)" />
            <path class="dg-line blue" d="M470 68 H480" marker-end="url(#ah-ps6)" />
          </svg>
          <figcaption>Figure 6 — Name the property, then the product. Redis is not a billing bus.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Event id as idempotency key on replay">
            <defs>
              <marker id="ah-ps7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">replay cursor</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">same event ids</text>
            <rect class="dg-box b" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">idempotent key</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">event id</text>
            <rect class="dg-box g" x="476" y="40" width="228" height="56" rx="7" />
            <text class="dg-s" x="590" y="64" text-anchor="middle">no double charge</text>
            <text class="dg-s" x="590" y="80" text-anchor="middle">billing survives</text>
            <path class="dg-line green" d="M236 68 H252" marker-end="url(#ah-ps7)" />
            <path class="dg-line green" d="M456 68 H472" marker-end="url(#ah-ps7)" />
          </svg>
          <figcaption>Figure 7 — Replay without an event-id key is a second payment. Isolation does not imply idempotency.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ps-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) A new team wants <code>OrderPaid</code>. What changes in the publisher, and what does that tell you about whether you have pub-sub? (2) Why can a slow subscriber take down an in-memory bus but not a log with independent offsets? (3) How do you fan out one event to ten million devices without putting ten million connections on the broker? (4) What happens if a subscriber is down longer than retention, and what extra building block closes that gap?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Topics, fan-out and subscriber isolation are standard industry ideas; every explanation, figure, table and exercise in this chapter is our own.',
};
