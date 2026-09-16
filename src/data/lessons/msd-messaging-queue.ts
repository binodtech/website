/** Modern System Design — Chapter 17: Distributed Messaging Queue.
 *  Decoupling producers from consumers, and the delivery guarantees that follow.
 */

export const msdMessagingQueue = {
  slug: 'messaging-queue',
  title: 'Distributed Messaging Queue',
  subtitle:
    'A queue absorbs spikes, retries work, and lets writers and readers scale independently. The hard part is not putting bytes on a log — it is stating a delivery guarantee, an ordering rule, and a plan for the consumer that never finishes.',
  byline: 'Modern System Design · Chapter 17 · ~2h 20m read · Intermediate',
  interviewTip:
    'Start with the delivery contract before drawing brokers. "At-least-once, so every handler is idempotent, per-user ordering via a partition key, competing consumers for the notification fan-out and a partitioned log for the audit stream" is an architecture. Mention the outbox so dual-write does not lose events, a DLQ so poison messages stop the partition, and consumer lag as the metric that actually matters. Interviewers punish "exactly-once" said casually; they reward "at-least-once plus idempotency, as in Chapter 3".',
  sections: [
    {
      id: 'mq-problem',
      title: 'System Design: The Distributed Messaging Queue',
      children: [
        { id: 'mq-why', title: 'The problem a queue actually solves' },
        { id: 'mq-sync', title: 'Why the synchronous call is the default disaster' },
        { id: 'mq-two', title: 'Work queue versus log: pick one shape first' },
      ],
      html: `
        <p>A queue is a buffer with a contract. Producers put messages in; consumers take them out later, possibly on a different machine, possibly after a retry, possibly more than once. That sentence is why this building block shows up in every serious design from here to the end of the course: upload transcoding, email, fraud checks, cache invalidation, webhook delivery, "fan this out to a million devices."</p>
        <p>It is also why "we will add Kafka" is not a design. Kafka, SQS, RabbitMQ, Pulsar and NATS are different answers to delivery, ordering and fan-out. This chapter designs the abstraction so you can pick one of them on purpose.</p>

        <h3 class="lesson-subhead" id="mq-why">The problem a queue actually solves</h3>
        <p>Three jobs, and they are not the same:</p>
        <ul class="lesson-layers">
          <li><strong>Absorb a spike.</strong> Writes arrive at 20× the consumer's steady rate for two minutes. The queue holds the water; the consumer drains at the rate the downstream can survive.</li>
          <li><strong>Retry work that can fail.</strong> The email API 500s. The message is not lost; it becomes visible again after a timeout. The handler must tolerate seeing it twice.</li>
          <li><strong>Decouple deploy and scale.</strong> The producer and the consumer ship on different cadences, run in different languages, and scale on different metrics. The queue is the API between them.</li>
        </ul>
        <p>A fourth job people sneak in: "make this happen exactly once, in order, everywhere." That is not a queue. That is a consensus log plus an idempotent consumer plus a story about what "everywhere" means. We will get as close as honest engineering allows, and then we will stop.</p>

        <h3 class="lesson-subhead" id="mq-sync">Why the synchronous call is the default disaster</h3>
        <p>The naive design is "the API writes the order row, then calls payments, then email, then analytics, then returns 200." Each hop is a timeout stacked on the user. Each hop is a failure that needs a compensating transaction you will not write correctly at 1am. Each hop couples four teams' SLOs into one p99.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Synchronous fan-out on the request path versus enqueue and return">
            <defs>
              <marker id="ah-mq1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-mq1b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">ON THE REQUEST</text>
            <rect class="dg-box y" x="26" y="52" width="70" height="28" rx="5" />
            <text class="dg-s" x="61" y="70" text-anchor="middle">API</text>
            <rect class="dg-box o" x="120" y="48" width="80" height="24" rx="5" />
            <text class="dg-s" x="160" y="64" text-anchor="middle">pay</text>
            <rect class="dg-box o" x="120" y="80" width="80" height="24" rx="5" />
            <text class="dg-s" x="160" y="96" text-anchor="middle">email</text>
            <rect class="dg-box o" x="120" y="112" width="80" height="24" rx="5" />
            <text class="dg-s" x="160" y="128" text-anchor="middle">analytics</text>
            <text class="dg-s" x="26" y="160">User waits for the slowest.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="168" rx="10" />
            <text class="dg-h" x="382" y="36">ENQUEUE AND RETURN</text>
            <rect class="dg-box y" x="382" y="52" width="70" height="28" rx="5" />
            <text class="dg-s" x="417" y="70" text-anchor="middle">API</text>
            <rect class="dg-box p" x="480" y="52" width="90" height="28" rx="5" />
            <text class="dg-s" x="525" y="70" text-anchor="middle">queue</text>
            <rect class="dg-box g" x="600" y="36" width="90" height="22" rx="5" />
            <text class="dg-s" x="645" y="51" text-anchor="middle">pay</text>
            <rect class="dg-box g" x="600" y="66" width="90" height="22" rx="5" />
            <text class="dg-s" x="645" y="81" text-anchor="middle">email</text>
            <rect class="dg-box g" x="600" y="96" width="90" height="22" rx="5" />
            <text class="dg-s" x="645" y="111" text-anchor="middle">analytics</text>
            <path class="dg-line green" d="M452 66 H476" marker-end="url(#ah-mq1b)" />
            <path class="dg-line green" d="M570 66 H596" marker-end="url(#ah-mq1b)" />
            <text class="dg-s" x="382" y="160">User waits for enqueue.</text>
          </svg>
          <figcaption>Figure 1 — The queue does not make work cheaper. It moves the wait off the user's clock and onto a consumer SLO you can scale.</figcaption>
        </figure>
        <p>The price of the right-hand picture is dual-write: the API must write the order row <em>and</em> the message. If you do those as two independent I/O calls, you will lose events. That is the outbox problem in Part 2. Do not skip it because the diagram looks clean.</p>

        <h3 class="lesson-subhead" id="mq-two">Work queue versus log: pick one shape first</h3>
        <p>Two shapes hide under the word "queue":</p>
        <table>
          <thead><tr><th></th><th>Work queue (SQS, competing consumers)</th><th>Partitioned log (Kafka)</th></tr></thead>
          <tbody>
            <tr><td>Who sees a message?</td><td>Exactly one consumer in the group (approximately)</td><td>Every consumer group, independently, by offset</td></tr>
            <tr><td>Retention</td><td>Until acked, then gone</td><td>Time or size; readers catch up from history</td></tr>
            <tr><td>Ordering</td><td>Per-queue, best-effort; FIFO queues exist and cost</td><td>Per partition, strict</td></tr>
            <tr><td>Replay</td><td>You cannot (unless a DLQ or a dump)</td><td>Reset the offset</td></tr>
            <tr><td>Fan-out</td><td>Awkward (SNS+SQS, or pub-sub next chapter)</td><td>Natural: more groups</td></tr>
          </tbody>
        </table>
        <p>Notifications to "one of N workers, then forget" are a work queue. An audit stream, a CDC feed, or anything several independent teams will read is a log. Drawing Kafka and then talking about "the consumer deletes the message" tells the interviewer you have mixed the two. <a href="/learn/modern-system-design/pub-sub">Chapter 18</a> is the third shape: one event, many subscribers, isolation between them.</p>
        <div class="lesson-callout"><strong>If you only remember one sentence:</strong> a queue is how you say "this work may happen later, may happen twice, and must not happen on the user's request thread." Everything else is a refinement of that sentence.</div>
      `,
    },
    {
      id: 'mq-req',
      title: "Requirements of a Distributed Messaging Queue's Design",
      children: [
        { id: 'mq-fn', title: 'Functional requirements' },
        { id: 'mq-nfn', title: 'Non-functional requirements' },
        { id: 'mq-est', title: 'Estimation' },
        { id: 'mq-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mq-fn">Functional requirements</h3>
        <ol class="lesson-layers">
          <li><strong>Produce</strong> a message to a named queue or topic, with an optional partition key.</li>
          <li><strong>Consume</strong> as a competing group (work) or as an independent group with an offset (log).</li>
          <li><strong>Ack / nack</strong> so a message is retired or retried. Visibility timeout if the consumer dies mid-handler.</li>
          <li><strong>Dead-letter</strong> a message after N failed deliveries, without stalling the partition.</li>
          <li><strong>Delay / schedule</strong> a message to become visible later (emails in an hour, retry with backoff).</li>
          <li><strong>Observe lag</strong> — how far consumers trail the tail — as a first-class metric, not a log grep.</li>
        </ol>
        <p>Out of scope: pub-sub fan-out to many independent products (next chapter), stream processing joins, and "the queue is the database of record for money." Ledgers live in <a href="/learn/modern-system-design/payment-system">the payment chapter</a>.</p>

        <h3 class="lesson-subhead" id="mq-nfn">Non-functional requirements</h3>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Produce p99</td><td>&lt; 20 ms in-region</td><td>The API is waiting on enqueue in the good design</td></tr>
            <tr><td>End-to-end for "interactive" work</td><td>&lt; 2 s p99</td><td>Email can be slower; "order confirmed" cannot</td></tr>
            <tr><td>Durability</td><td>ack'd produce survives a broker disk</td><td>acks=all / quorum writes, not a memory buffer</td></tr>
            <tr><td>Delivery</td><td>at-least-once</td><td>At-most-once loses money; exactly-once is a system, not a flag</td></tr>
            <tr><td>Ordering</td><td>per partition key, not global</td><td>Global order is one partition, which is one bottleneck</td></tr>
            <tr><td>Retention</td><td>1–7 days for logs; until-ack for work queues</td><td>Replay versus storage bill</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="mq-est">Estimation</h3>
        <pre><code>ASSUME a notifications + audit bus
  20,000 produces/s peak, average 1.5 KB payload
  3 independent consumer groups on the log
  retain 3 days

INGRESS
  20k * 1.5 KB ~= 30 MB/s  ~= 0.24 Gbps   — easy
  with 3 replicas on disk: 90 MB/s writes

STORAGE
  30 MB/s * 86400 * 3 days ~= 7.8 TB  per replica
  3 brokers x 3 replicas of each partition is not 9x if
  you place replicas on those 3 brokers: ~8 TB usable
  CONCLUSION: retention, not QPS, sets the disk

CONSUMER
  3 groups * 20k/s = 60k/s outbound
  lag SLO: interactive group &lt; 5,000 messages
          (~250 ms at 20k/s); analytics may be hours</code></pre>
        <p>The interesting number is lag, not throughput. A broker that is "fine" at 20k/s with a consumer that has been stuck for ten minutes is an incident with a healthy dashboard.</p>

        <h3 class="lesson-subhead" id="mq-api">API sketch</h3>
        <pre><code>POST /v1/topics/{topic}/records
  { key, value, headers }     -&gt; { partition, offset }

GET  /v1/groups/{group}/topics/{topic}
  ?max=100 &amp; commit=false     -&gt; { records[], cursor }

POST /v1/groups/{group}/ack     { topic, partition, offset }
POST /v1/groups/{group}/fail    { ... , retryAfterMs? }

# work-queue variant
POST /v1/queues/{q}/messages    { body, delayMs? }
POST /v1/queues/{q}/lease       { max: 10, visibilitySec: 30 }
POST /v1/queues/{q}/ack         { receipt }
POST /v1/queues/{q}/dlq         { receipt, reason }</code></pre>
      `,
    },
    {
      id: 'mq-consider',
      title: "Considerations of a Distributed Messaging Queue's Design",
      children: [
        { id: 'mq-deliv', title: 'At-most, at-least, and the exactly-once marketing' },
        { id: 'mq-order', title: 'Ordering is a partition, not a wish' },
        { id: 'mq-vis', title: 'Visibility timeouts and poison messages' },
        { id: 'mq-back', title: 'Back-pressure versus infinite buffers' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mq-deliv">At-most, at-least, and the exactly-once marketing</h3>
        <p><strong>At-most-once:</strong> send, forget, never retry. Fast. Loses messages on every crash and every timeout. Acceptable for metrics you already sample; unacceptable for charges.</p>
        <p><strong>At-least-once:</strong> retry until ack. The consumer will see duplicates. This is the only honest default. <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> already required idempotent handlers: a key on the message, a dedupe table, or a naturally idempotent write (SET, INSERT ON CONFLICT).</p>
        <p><strong>Exactly-once:</strong> in a distributed system with retries, you cannot promise the effect happens once unless the effect itself is idempotent and the producer and consumer share a transactional boundary. Kafka's "exactly-once" is <em>produce to a topic and consume-transform-produce in one consumer group</em> with idempotent producers and transactional writes. It is not "the email is sent once." The SMTP call is still at-least-once; you dedupe on a message-id. Say that, or the interviewer will.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Timeout after the side effect but before ack, causing a duplicate delivery">
            <defs>
              <marker id="ah-mq2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="64" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="88" text-anchor="middle">broker</text>
            <rect class="dg-box y" x="200" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="260" y="88" text-anchor="middle">consumer</text>
            <rect class="dg-box o" x="400" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="460" y="88" text-anchor="middle">email API</text>
            <rect class="dg-box r" x="560" y="64" width="144" height="40" rx="7" />
            <text class="dg-s" x="632" y="88" text-anchor="middle">timeout, redeliver</text>
            <path class="dg-line rose" d="M116 84 H196" marker-end="url(#ah-mq2)" />
            <path class="dg-line rose" d="M320 84 H396" marker-end="url(#ah-mq2)" />
            <path class="dg-line rose dash" d="M520 84 H556" marker-end="url(#ah-mq2)" />
            <text class="dg-s" x="16" y="140">Effect happened. Ack did not. Duplicate is not a bug in the broker.</text>
          </svg>
          <figcaption>Figure 2 — The classic crash window. Exactly-once of the <em>effect</em> lives in the handler, not in the broker flag.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="mq-order">Ordering is a partition, not a wish</h3>
        <p>Total order across all messages means one partition, one consumer, one bottleneck. Almost no product needs it. Per-entity order — all events for user 42 in the order they were produced — is obtained by hashing the user id onto a partition and consuming that partition with one worker at a time. Kafka gives you this. SQS standard does not; SQS FIFO does, at a throughput cap.</p>
        <p>Head-of-line blocking is the tax: a poison message at offset 100 stalls offsets 101+ for that partition. That is why DLQ exists, and why you should not put unrelated entities on a single key "for simplicity."</p>

        <h3 class="lesson-subhead" id="mq-vis">Visibility timeouts and poison messages</h3>
        <p>A work queue leases a message: it becomes invisible for T seconds. If the consumer acks, it is gone. If the consumer dies, it reappears. T must be longer than the handler's p99 and shorter than the user's patience for retry. A handler that occasionally takes 2 minutes with T=30s will duplicate on a healthy process.</p>
        <p>A message that crashes the handler every time is poison. After N deliveries (five is a common default), move it to a dead-letter queue and page a human. Leaving it in place is how one bad JSON object stops a partition, which stops a user, which looks like an outage of the whole topic.</p>

        <h3 class="lesson-subhead" id="mq-back">Back-pressure versus infinite buffers</h3>
        <p>An unbounded queue is a way to turn a two-minute downstream outage into an hour of catch-up that melts the downstream a second time. Bound the topic (size or time). When full, producers must block or fail — that is back-pressure — or you must shed (drop low-priority topics). "We will scale consumers" is the plan for a known diurnal peak, not for an infinite buffer.</p>
        <div class="lesson-callout"><strong>Lag is the SLO.</strong> Disk utilisation is a capacity metric. Broker CPU is a capacity metric. The user-visible number is "how far behind is the group that sends the confirmation email." Alert on that, with a burn rate, the way Chapter 4 taught you to alert on error budgets.</div>
      `,
    },
    {
      id: 'mq-p1',
      title: 'Design of a Distributed Messaging Queue: Part 1',
      children: [
        { id: 'mq-arch', title: 'Brokers, partitions and the replica leader' },
        { id: 'mq-prod', title: 'Producers, keys and acknowledgements' },
        { id: 'mq-cons', title: 'Consumer groups and rebalancing' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mq-arch">Brokers, partitions and the replica leader</h3>
        <p>A topic is split into partitions. Each partition is an ordered, append-only log replicated to N brokers (N=3 in-region is the default). One replica is leader; produces and fetches go to it. Followers tail the log. A produce with <code>acks=all</code> (or "quorum") waits until in-sync replicas have the record. <code>acks=1</code> waits for the leader's disk (or memory, if you like outages). <code>acks=0</code> is UDP with extra steps.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Topic split into partitions, each with a leader and two followers">
            <defs>
              <marker id="ah-mq3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="80" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="106" text-anchor="middle">producer</text>
            <rect class="dg-band p" x="160" y="16" width="544" height="178" rx="10" />
            <text class="dg-h" x="176" y="36">TOPIC  ·  3 PARTITIONS  ·  RF=3</text>
            <rect class="dg-box g" x="176" y="52" width="150" height="36" rx="6" />
            <text class="dg-s" x="251" y="74" text-anchor="middle">P0 leader</text>
            <rect class="dg-box c" x="340" y="52" width="150" height="36" rx="6" />
            <text class="dg-s" x="415" y="74" text-anchor="middle">P0 follower</text>
            <rect class="dg-box c" x="504" y="52" width="150" height="36" rx="6" />
            <text class="dg-s" x="579" y="74" text-anchor="middle">P0 follower</text>
            <rect class="dg-box g" x="176" y="104" width="150" height="36" rx="6" />
            <text class="dg-s" x="251" y="126" text-anchor="middle">P1 leader</text>
            <rect class="dg-box g" x="176" y="144" width="150" height="36" rx="6" />
            <text class="dg-s" x="251" y="166" text-anchor="middle">P2 leader</text>
            <path class="dg-line violet" d="M116 102 H156" marker-end="url(#ah-mq3)" />
          </svg>
          <figcaption>Figure 3 — Spread partition leaders across brokers so produce load is not one machine. Followers exist so a leader death is a failover, not a restore from backup.</figcaption>
        </figure>
        <p>Partition count is a scaling knob you should not turn weekly. Too few: you cannot add consumers. Too many: more open files, slower controller, tiny files. Start from expected peak consume rate / per-consumer rate, round up, and leave headroom. Re-partitioning a keyed topic is a different hash and therefore a different order — treat it as a migration, not a config tweak.</p>

        <h3 class="lesson-subhead" id="mq-prod">Producers, keys and acknowledgements</h3>
        <p>The producer hashes the key onto a partition, batches records (linger a few ms), and compresses the batch. Batching is why 20k tiny produces/s is cheap and 20k unbatched produces/s is a syscall storm. Idempotent producers attach a producer-id and sequence so a retried batch does not double-append on the leader — that is "exactly-once produce," still not exactly-once email.</p>
        <p>If you omit the key, records spread round-robin (or sticky) and you have no per-entity order. That is correct for independent jobs. It is a bug for "credit then debit."</p>

        <h3 class="lesson-subhead" id="mq-cons">Consumer groups and rebalancing</h3>
        <p>A group is a named set of processes sharing work. The group coordinator assigns partitions to members. One partition, at most one member in that group — that is how per-partition order survives. Add a member, lose a member, or change the topic: a rebalance stops consumption, shuffles assignments, resumes. Stop-the-world rebalances are a well-known foot-gun; cooperative rebalancing (incremental) is the modern default. Either way, a noisy deploy that flaps membership will stall lag.</p>
        <p>Commit the offset after the side effect succeeds, not before. Commit-before-process is at-most-once. Process-before-commit is at-least-once. There is no third place to put the commit that invents a new delivery semantic.</p>
      `,
    },
    {
      id: 'mq-p2',
      title: 'Design of a Distributed Messaging Queue: Part 2',
      children: [
        { id: 'mq-outbox', title: 'The dual-write problem and the outbox' },
        { id: 'mq-dlq', title: 'Retries, DLQ and delayed delivery' },
        { id: 'mq-multi', title: 'Multi-AZ, compaction and disk' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mq-outbox">The dual-write problem and the outbox</h3>
        <p>The API writes a row to the database, then produces a message. Either call can succeed without the other:</p>
        <ul class="lesson-layers">
          <li>DB commit, produce fails → the order exists, nobody fulfils it.</li>
          <li>Produce succeeds, DB rolls back → a phantom fulfilment.</li>
        </ul>
        <p>The transactional outbox: write the row and an <code>outbox</code> row in the <em>same</em> database transaction. A relay (Debezium/CDC, or a poller) publishes outbox rows to the broker and marks them sent. The broker is not in the SQL transaction; the invariant is "if the order committed, the outbox row committed, and the relay will keep trying." Duplicates are possible (relay retries); consumers stay idempotent. This is the pattern you want for money-adjacent events. "Just produce in a try/finally" is how events disappear.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Single database transaction writing order and outbox, then a relay to the broker">
            <defs>
              <marker id="ah-mq4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="88" height="40" rx="7" />
            <text class="dg-s" x="60" y="88" text-anchor="middle">API</text>
            <rect class="dg-band b" x="140" y="24" width="280" height="128" rx="10" />
            <text class="dg-h" x="156" y="44">ONE DB TX</text>
            <rect class="dg-box b" x="156" y="60" width="110" height="32" rx="6" />
            <text class="dg-s" x="211" y="80" text-anchor="middle">orders</text>
            <rect class="dg-box c" x="284" y="60" width="110" height="32" rx="6" />
            <text class="dg-s" x="339" y="80" text-anchor="middle">outbox</text>
            <rect class="dg-box g" x="456" y="64" width="88" height="40" rx="7" />
            <text class="dg-s" x="500" y="88" text-anchor="middle">relay</text>
            <rect class="dg-box p" x="580" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="640" y="88" text-anchor="middle">broker</text>
            <path class="dg-line green" d="M104 84 H136" marker-end="url(#ah-mq4)" />
            <path class="dg-line green" d="M420 84 H452" marker-end="url(#ah-mq4)" />
            <path class="dg-line green" d="M544 84 H576" marker-end="url(#ah-mq4)" />
            <text class="dg-s" x="156" y="132">CDC tails the outbox. Broker is outside the TX.</text>
          </svg>
          <figcaption>Figure 4 — The database is the source of truth for "did this happen." The queue is how everyone else finds out.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="mq-dlq">Retries, DLQ and delayed delivery</h3>
        <p>Retry with jittered exponential backoff, not an immediate tight loop. Immediate retry turns a 10-second downstream blip into a self-inflicted stampede — <a href="/learn/modern-system-design/system-failures">Chapter 44</a> will show this as an outage class. Cap attempts, then DLQ. A delayed queue (or a "retry topic" with a consumer that sleeps, or Kafka's retry topics, or SQS delay seconds) implements the backoff without blocking a partition.</p>
        <p>Poison-message isolation: if handlers are per-partition, a DLQ jump must not require manual offset surgery in the middle of a fire. Design the jump as a produce to <code>topic.dlq</code> plus a commit of the bad offset.</p>

        <h3 class="lesson-subhead" id="mq-multi">Multi-AZ, compaction and disk</h3>
        <p>Place replicas in different AZs. A produce with quorum then waits for a second AZ; that is the availability-versus-latency tax from Chapter 4, paid on every message. Cross-region is a mirror (MirrorMaker, Replicator), asynchronous, with its own lag SLO. Do not ack the user on the remote region's disk unless the product is a multi-region write.</p>
        <p>Log compaction keeps the last record per key so a changelog of "current state" can be rebuilt. It is not a database. Compaction is CPU and disk, and it fights retention: you cannot compact what you already deleted. Size disks from the estimate above, then double them because compaction needs headroom. Run out of disk on a broker and the cluster does not "slow down"; partitions go offline.</p>
      `,
    },
    {
      id: 'mq-eval',
      title: "Evaluation of a Distributed Messaging Queue's Design",
      children: [
        { id: 'mq-ok', title: 'What this design delivers' },
        { id: 'mq-short', title: 'Where it falls short' },
        { id: 'mq-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="mq-ok">What this design delivers</h3>
        <p>A partitioned, replicated log (or a leased work queue) lets you take work off the request path, retry it, and scale producers and consumers independently. Per-key ordering is available if you hash. At-least-once plus idempotent handlers is a contract you can operate. The outbox closes the dual-write hole for the producers you control. Lag is observable.</p>

        <h3 class="lesson-subhead" id="mq-short">Where it falls short</h3>
        <p>It does not give you a transaction across "database plus three downstreams." The outbox publishes <em>intent</em>; each consumer still has its own failure. It does not give you global order. It does not give you exactly-once side effects. Head-of-line blocking is structural. A hot partition key (one celebrity user) concentrates load the same way a hot cache key does — split the key or accept a single-partition ceiling.</p>
        <p>Operational failure modes worth naming: rebalance storms during deploys, disk filled by a retention misconfig, a consumer bug that commits offsets past work it skipped, a schema change that old consumers cannot parse (need a registry and a compatibility rule), and using the queue as a long-term store because "retention is 7 days" quietly became "this is our data lake."</p>
        <p>Work queues are worse at replay and fan-out; logs are worse at "delete this one message" and at competing-consumer simple jobs. If the interviewer asked for notifications to a million devices, you want <a href="/learn/modern-system-design/pub-sub">pub-sub</a> or a dedicated push pipeline, not a single SQS queue.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Lag as the user-visible metric sitting in front of healthy broker CPU">
            <defs>
              <marker id="ah-mq5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="40" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="60" text-anchor="middle">broker CPU 20%</text>
            <text class="dg-s" x="96" y="76" text-anchor="middle">disks fine</text>
            <rect class="dg-box r" x="260" y="40" width="200" height="48" rx="7" />
            <text class="dg-s" x="360" y="60" text-anchor="middle">group lag 40 min</text>
            <text class="dg-s" x="360" y="76" text-anchor="middle">handler wedged</text>
            <rect class="dg-box o" x="544" y="40" width="160" height="48" rx="7" />
            <text class="dg-s" x="624" y="60" text-anchor="middle">users wait</text>
            <text class="dg-s" x="624" y="76" text-anchor="middle">emails late</text>
            <path class="dg-line rose" d="M176 64 H256" marker-end="url(#ah-mq5)" />
            <path class="dg-line rose" d="M460 64 H540" marker-end="url(#ah-mq5)" />
            <text class="dg-s" x="16" y="124">Healthy brokers plus a stuck consumer is still an outage of the product that consumes.</text>
          </svg>
          <figcaption>Figure 5 — Evaluate a queue on consumer lag and duplicate rate, not on whether the broker process is up.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="mq-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Draw the crash window in which a side effect happens and the ack does not — what delivery semantic is that, and what must the handler do? (2) Why is global ordering a single partition, and when is per-key ordering enough? (3) Write the dual-write failure both ways, then place the outbox. (4) A partition's lag is growing while broker CPU is idle. Where do you look first, and why would a DLQ be the fix rather than "add consumers"?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Queues, logs, acknowledgements and consumer groups are standard industry ideas; every explanation, figure, table and exercise in this chapter is our own.',
};
