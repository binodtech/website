/** Modern System Design — Chapter 23: Distributed Task Scheduler.
 *  Not cron. A due-index, fencing so only one dispatcher fires, idempotent
 *  run_id, DST, midnight jitter, Temporal versus Airflow versus Celery.
 */

export const msdTaskScheduler = {
  slug: 'task-scheduler',
  title: 'The Distributed Task Scheduler',
  subtitle:
    'A scheduler is a system that must fire each job once, at the right time, even when the machine that was supposed to fire it is dead. Cron on one box is not that system. This chapter is.',
  byline: 'Modern System Design · Chapter 23 · ~1h 40m read · Advanced',
  interviewTip:
    'The moment you say cron you have lost the room. Say instead: a due-index or timer wheel, a leased dispatcher with a fencing token so two leaders cannot both fire, workers that are idempotent because at-least-once is all you can promise, jitter so midnight does not become a thundering herd, and DAG edges if jobs depend on each other. Name Temporal, Airflow or Celery and say which property each actually gives you.',
  sections: [
    {
      id: 'ts-sys',
      title: 'System Design: The Distributed Task Scheduler',
      children: [
        { id: 'ts-notcron', title: 'Why this is not cron' },
        { id: 'ts-once', title: 'Once, on time, despite failure' },
        { id: 'ts-shape', title: 'One-shot, delay, recurring' },
      ],
      html: `
        <p>Cron on one box fires <code>0 0 * * *</code> until that box dies, DST shifts the hour, or a job overruns and the next invocation piles on. A distributed scheduler is the building block underneath "send this email in 45 minutes," "settle this payment at 17:00 UTC," "rebuild this index every night," and "retry this webhook with backoff."</p>
        <p>The state of "what is due" must live off the box that currently wakes it. That sentence is the whole architecture: a due-index, a replaceable dispatcher, a worker fleet, and a fence so a zombie leader cannot fire after a new one has.</p>

        <h3 class="lesson-subhead" id="ts-notcron">Why this is not cron</h3>
        <p>Cron assumes a single clock, a single machine, and a human who will notice it stopped. None of those survive a fleet. Kubernetes CronJobs are cron with extra YAML: they still misfire on skipped intervals, still need idempotent jobs, and still stampede if every tenant's job is <code>0 * * * *</code>. The scheduler we design here is a service: APIs to create/cancel jobs, a due-index, workers, and an operational story for "the dispatcher died at 23:59:59."</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Single cron host versus dispatcher lease plus worker pool">
            <defs>
              <marker id="ah-ts1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">CRON ON ONE BOX</text>
            <rect class="dg-box r" x="100" y="60" width="160" height="40" rx="7" />
            <text class="dg-s" x="180" y="84" text-anchor="middle">crontab + sleep</text>
            <text class="dg-s" x="26" y="128">Host dies, jobs die with it.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">LEASED DISPATCHER</text>
            <rect class="dg-box g" x="392" y="52" width="120" height="32" rx="6" />
            <text class="dg-s" x="452" y="72" text-anchor="middle">due-index</text>
            <rect class="dg-box b" x="532" y="52" width="150" height="32" rx="6" />
            <text class="dg-s" x="607" y="72" text-anchor="middle">workers</text>
            <path class="dg-line green" d="M512 68 H528" marker-end="url(#ah-ts1)" />
            <text class="dg-s" x="382" y="128">Leader dies, fence, next fires.</text>
          </svg>
          <figcaption>Figure 1 — The due-index is the source of truth. The box that polls it is livestock.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ts-once">Once, on time, despite failure</h3>
        <p>Three requirements that fight: <em>on time</em> (a due job is visible within a stated slack, say 1 s p99 for interactive, 1 min for batch), <em>at least once</em> (we will not skip because a dispatcher crashed), <em>at most once effect</em> (the handler is idempotent, or we have a fencing token so a zombie dispatcher cannot fire after a new leader has). You cannot have "exactly once wall-clock fire" in a distributed system. You can have "exactly once effect" if the job is a compare-and-swap against a <code>run_id</code>. That is the same lesson as the <a href="/learn/modern-system-design/messaging-queue">queue chapter</a>, with a clock attached.</p>
        <div class="lesson-callout"><strong>A missed midnight job is worse than a double fire of an idempotent job.</strong> Design for at-least-once delivery to workers, and spend your cleverness on idempotency and fencing, not on pretending the clock is a mutex.</div>

        <h3 class="lesson-subhead" id="ts-shape">One-shot, delay, recurring</h3>
        <p>Three APIs, one due-index. One-shot: fire at <code>due_at</code>. Delay: fire at now+T (OTP, "remind me in 30 minutes"). Recurring: cron expression or interval, each fire producing a new <code>run_id</code>. Cancel must win a race with a dispatcher that already leased the row — cancelled-after-lease is a worker no-op via a generation number.</p>
        <p>Overrun is the quiet sibling of double-fire. A job scheduled every minute that takes ninety seconds will pile up unless you have a policy: skip if previous still running, or allow overlap with a concurrency cap, or delay the next planned_at. Cron on one box silently overlaps. A distributed scheduler that does the same will DDoS its own workers with a backlog that looks like "the cluster is slow" rather than "the job is too fat."</p>
      `,
    },
    {
      id: 'ts-req',
      title: "Requirements of a Distributed Task Scheduler's Design",
      children: [
        { id: 'ts-fn', title: 'Functional requirements' },
        { id: 'ts-nfn', title: 'Non-functional requirements' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ts-fn">Functional requirements</h3>
        <ol class="lesson-layers">
          <li><strong>One-shot</strong> jobs at a timestamp, <strong>recurring</strong> (cron expression or interval), <strong>delayed</strong> (in T seconds).</li>
          <li><strong>Cancel</strong> before fire; <strong>pause</strong> a schedule.</li>
          <li><strong>Payload</strong> small (ids, not blobs — blobs live in the blob store).</li>
          <li><strong>Retries</strong> with backoff, then fail a run and keep the schedule or not (policy).</li>
          <li><strong>Optional DAG:</strong> job B after A succeeds. This is a workflow; admit when you have left "scheduler" and entered Temporal/Airflow.</li>
        </ol>
        <pre><code>POST /jobs            { type, due_at | delay_s | cron, payload, tz? }
DELETE /jobs/{id}     cancel if not yet fired
POST /jobs/{id}/pause
GET  /jobs/{id}/runs  { run_id, planned_at, status }

# worker
POST /runs/{run_id}/ack | fail { err }</code></pre>

        <h3 class="lesson-subhead" id="ts-nfn">Non-functional requirements</h3>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Slack</td><td>p99 fire &lt; 1 s after due (interactive)</td><td>OTP expiry and "in 30s" emails</td></tr>
            <tr><td>Throughput</td><td>10k fires/s peak</td><td>Midnight UTC is a herd unless jittered</td></tr>
            <tr><td>Durability</td><td>ack'd create survives dispatcher death</td><td>Due-index on replicated store</td></tr>
            <tr><td>Safety</td><td>zombie leader cannot fire</td><td>Fencing token on the lease</td></tr>
            <tr><td>Calendar</td><td>UTC internally; display tz at the edge</td><td>DST is a bug factory</td></tr>
          </tbody>
        </table>
        <pre><code>ESTIMATE
  50M scheduled jobs, 5% due in any 1-minute window at peak
    = 2.5M due/min ~= 42k/s  — too high; real due times spread
  with jitter ±5 min on nightly jobs, peak maybe 10k/s
  due-index: each job ~200 B  -&gt; 10 GB  fits in a sharded KV / SQL
  workers: 10k/s * 50 ms handler  -&gt; 500 concurrent  — a fleet, not a box</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Midnight spike without jitter versus spread with hash jitter">
            <defs>
              <marker id="ah-ts2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="108" rx="10" />
            <text class="dg-h" x="26" y="36">NO JITTER</text>
            <text class="dg-s" x="26" y="58">all nightly jobs at 00:00:00</text>
            <text class="dg-s" x="26" y="76">self DDoS of workers</text>
            <text class="dg-s" x="26" y="94">and of every downstream API</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="108" rx="10" />
            <text class="dg-h" x="382" y="36">HASH JITTER</text>
            <text class="dg-s" x="382" y="58">hash(id) mod 300 seconds</text>
            <text class="dg-s" x="382" y="76">peak flattened</text>
            <text class="dg-s" x="382" y="94">still "during the night"</text>
          </svg>
          <figcaption>Figure 2 — Jitter is capacity planning, not aesthetics. Midnight without it is a load test you did not schedule.</figcaption>
        </figure>
      `,
    },
    {
      id: 'ts-des',
      title: 'Design of a Distributed Task Scheduler',
      children: [
        { id: 'ts-due', title: 'Due-index, timer wheel and the dispatcher' },
        { id: 'ts-fence', title: 'Fencing so only one dispatcher fires' },
        { id: 'ts-idemp', title: 'Idempotent execution and run_id' },
        { id: 'ts-shard', title: 'Sharding the due-index' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ts-due">Due-index, timer wheel and the dispatcher</h3>
        <p>Store jobs as <code>(due_at, job_id)</code> in an ordered index: SQL <code>WHERE due_at &lt;= now() LIMIT n FOR UPDATE SKIP LOCKED</code>, or a KV/Redis sorted set scored by due time, or a timer wheel in memory backed by a WAL. The dispatcher polls the next due slice, leases those rows, and sends them to a queue of workers. Polling every 100 ms with SKIP LOCKED is enough for 1 s slack; a wake channel (LISTEN/NOTIFY, or the sorted-set's next score) beats a tight loop.</p>
        <p>Shard the due-index by job_id so dispatchers can partition work: dispatcher D owns shard <code>job_id % D</code>, or a range. Without sharding, one poller is a single leader for all jobs — fine at 1k/s, not at 10k/s. Use the store's clock, not <code>Date.now()</code> on the leader, or clock skew becomes double-fire and skip.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Due-index polled by a fenced dispatcher feeding a worker queue">
            <defs>
              <marker id="ah-ts3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="60" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="80" text-anchor="middle">due-index</text>
            <text class="dg-s" x="86" y="96" text-anchor="middle">sorted by time</text>
            <rect class="dg-box p" x="200" y="60" width="160" height="48" rx="7" />
            <text class="dg-s" x="280" y="80" text-anchor="middle">dispatcher</text>
            <text class="dg-s" x="280" y="96" text-anchor="middle">lease + fence</text>
            <rect class="dg-box o" x="404" y="60" width="120" height="48" rx="7" />
            <text class="dg-s" x="464" y="88" text-anchor="middle">queue</text>
            <rect class="dg-box g" x="568" y="60" width="136" height="48" rx="7" />
            <text class="dg-s" x="636" y="88" text-anchor="middle">workers</text>
            <path class="dg-line violet" d="M156 84 H196" marker-end="url(#ah-ts3)" />
            <path class="dg-line violet" d="M360 84 H400" marker-end="url(#ah-ts3)" />
            <path class="dg-line violet" d="M524 84 H564" marker-end="url(#ah-ts3)" />
          </svg>
          <figcaption>Figure 3 — The dispatcher is replaceable. The due-index and the idempotent worker are not.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ts-fence">Fencing so only one dispatcher fires</h3>
        <p>A leader lock (ZooKeeper, etcd, SQL lease row) expires. The old leader is paused in GC, lock expires, new leader starts firing, old leader wakes and fires again. <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> fencing: every fire carries a monotonic epoch. Workers (or the due-index CAS) reject epochs below current. SKIP LOCKED on the job row is a poor man's fence if the row update to <code>fired_epoch</code> is the linearise point. Without a fence, double-fire is guaranteed, not hypothetical.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Zombie dispatcher rejected by fencing epoch">
            <defs>
              <marker id="ah-ts4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="44" width="180" height="56" rx="7" />
            <text class="dg-s" x="106" y="68" text-anchor="middle">zombie epoch 7</text>
            <text class="dg-s" x="106" y="84" text-anchor="middle">wakes from GC</text>
            <rect class="dg-box g" x="236" y="44" width="200" height="56" rx="7" />
            <text class="dg-s" x="336" y="68" text-anchor="middle">store epoch 8</text>
            <text class="dg-s" x="336" y="84" text-anchor="middle">CAS rejects 7</text>
            <rect class="dg-box b" x="476" y="44" width="228" height="56" rx="7" />
            <text class="dg-s" x="590" y="68" text-anchor="middle">worker</text>
            <text class="dg-s" x="590" y="84" text-anchor="middle">never sees dup fire</text>
            <path class="dg-line rose dash" d="M196 72 H232" marker-end="url(#ah-ts4)" />
            <path class="dg-line rose" d="M436 72 H472" marker-end="url(#ah-ts4)" />
          </svg>
          <figcaption>Figure 4 — A lock expiry is not a brain expiry. The epoch is what stops the corpse.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ts-idemp">Idempotent execution and run_id</h3>
        <p>Job payload includes <code>run_id</code>. The handler writes <code>run_id</code> to a done-table with a unique constraint before the side effect, or the side effect itself is idempotent (store a blob at a known key, send email with an idempotency key). Recurring jobs generate a new <code>run_id</code> per fire: <code>schedule_id + planned_at</code>. If you key only on <code>schedule_id</code>, the second night will no-op forever. Retries of the same night reuse the same <code>run_id</code> so a timeout plus success does not double-send.</p>
        <p>Put <code>run_id</code> in the queue message, in the worker log, and in the downstream idempotency key. Debugging "did midnight fire twice" without that string is archaeology. The due-index row should store last_run_id and last_status so an operator can answer without grepping Kafka.</p>

        <h3 class="lesson-subhead" id="ts-shard">Sharding the due-index</h3>
        <p>A single Postgres table with SKIP LOCKED will take you surprisingly far — tens of thousands of leases per second on decent hardware — and then vacuum and index bloat will humble you. Shard by hash of job_id into N tables or N key ranges, each with its own dispatcher. Sticky dispatchers reduce lock chatter. If a dispatcher dies, its shard is what you reassign, not "all jobs."</p>
        <p>Redis ZSET scored by due_at is a popular v1 and a painful v2: persistence, hot key, and blocking ZRANGEBYSCORE under load. Fine for tens of thousands of pending jobs in one process. Not fine as the due-index for 50 million rows. Treat Redis as a hot window (jobs due in the next minute, loaded from SQL) rather than as the system of record.</p>
        <p>The hot window pattern: SQL holds everything; a loader copies the next 60 seconds into a timer wheel; the dispatcher fires from the wheel; a crash rebuilds 60 seconds from SQL. You trade a bounded rebuild for in-memory slack. That is the honest timer-wheel design, not "we keep all schedules in RAM."</p>
        <p>Per-tenant fire rate limits belong next to the fence. One customer creating a million one-shot jobs due in the same second is a self-DDoS you invited with an unbounded API. Reject or jitter at create time. The due-index should never be an unauthenticated dump of "run this now" from the internet.</p>
        <p>Observability: lag histogram of (fired_at − due_at), steal count from fences, duplicate run_id rejects, catch-up backlog. If you only monitor worker CPU you will miss a dispatcher that stopped polling. The scheduler's SLO is slack, not HTTP 200 on the create API.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="SQL as system of record with a hot one-minute wheel">
            <defs>
              <marker id="ah-ts7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="116" y="64" text-anchor="middle">SQL due-index</text>
            <text class="dg-s" x="116" y="80" text-anchor="middle">all schedules</text>
            <rect class="dg-box p" x="256" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="356" y="64" text-anchor="middle">hot window</text>
            <text class="dg-s" x="356" y="80" text-anchor="middle">next 60 seconds</text>
            <rect class="dg-box g" x="496" y="40" width="208" height="56" rx="7" />
            <text class="dg-s" x="600" y="64" text-anchor="middle">timer wheel</text>
            <text class="dg-s" x="600" y="80" text-anchor="middle">rebuild on crash</text>
            <path class="dg-line violet" d="M216 68 H252" marker-end="url(#ah-ts7)" />
            <path class="dg-line violet" d="M456 68 H492" marker-end="url(#ah-ts7)" />
          </svg>
          <figcaption>Figure 5 — RAM holds a minute. SQL holds the truth. That is a timer wheel you can restart.</figcaption>
        </figure>
      `,
    },
    {
      id: 'ts-con',
      title: 'Design Considerations of a Distributed Task Scheduler',
      children: [
        { id: 'ts-dst', title: 'Cron, DST and the top of the hour' },
        { id: 'ts-dag', title: 'DAGs: Temporal, Airflow and Celery' },
        { id: 'ts-eval', title: 'Where this design falls short' },
        { id: 'ts-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ts-dst">Cron, DST and the top of the hour</h3>
        <p>Store UTC. Cron in local time skips or double-fires on DST. "Every hour" during a 23-hour spring-forward day: define whether you skip. Jitter nightly jobs by <code>hash(schedule_id) % 300</code> seconds or you DDoS yourself at 00:00:00. Missed fires while the cluster was down: catch-up policy — run once (catch up), run all missed (dangerous), or skip. Catch-up-once is the sane default for reports; skip is sane for "snapshot the market at 16:00" if 16:07 is a lie.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="DST skip versus double fire when cron is stored in local time">
            <defs>
              <marker id="ah-ts5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">local cron</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">DST skip or twice</text>
            <rect class="dg-box b" x="260" y="40" width="200" height="56" rx="7" />
            <text class="dg-s" x="360" y="72" text-anchor="middle">store UTC</text>
            <rect class="dg-box g" x="484" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="594" y="64" text-anchor="middle">display tz</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">at the API edge</text>
            <path class="dg-line hot" d="M236 68 H256" marker-end="url(#ah-ts5)" />
            <path class="dg-line hot" d="M460 68 H480" marker-end="url(#ah-ts5)" />
          </svg>
          <figcaption>Figure 6 — UTC in the index, timezone at the edge. Mixing them is how 2am happens twice.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ts-dag">DAGs: Temporal, Airflow and Celery</h3>
        <table>
          <thead><tr><th>System</th><th>What it is</th><th>Use when</th></tr></thead>
          <tbody>
            <tr><td>Celery Beat / RQ</td><td>Queue + crontab</td><td>Simple delayed work, one cluster</td></tr>
            <tr><td>Airflow</td><td>Batch DAGs, clocks, UI</td><td>Data pipelines, not user-request delays</td></tr>
            <tr><td>Temporal / Cadence</td><td>Durable workflows, timers as first class</td><td>Sagas, human-in-the-loop, long waits</td></tr>
            <tr><td>This design</td><td>Due-index + queue</td><td>You are building the primitive, or a subset</td></tr>
          </tbody>
        </table>
        <p>If the interviewer wants "wait 7 days, then charge, unless cancelled, with retries and a human approval," Temporal is the answer and this chapter is the interior of its timer. Do not reimplement workflow history on the whiteboard unless asked. Airflow is the wrong product for "email this user in 45 minutes"; Celery Beat is the wrong product for a 50-million-row due-index.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="When to pick Celery Airflow or Temporal">
            <defs>
              <marker id="ah-ts6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="126" y="60" text-anchor="middle">Celery</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">simple delay + queue</text>
            <rect class="dg-box o" x="250" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="360" y="60" text-anchor="middle">Airflow</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">batch data DAGs</text>
            <rect class="dg-box g" x="484" y="36" width="220" height="64" rx="7" />
            <text class="dg-t" x="594" y="60" text-anchor="middle">Temporal</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">long sagas + timers</text>
            <path class="dg-line blue" d="M236 68 H246" marker-end="url(#ah-ts6)" />
            <path class="dg-line blue" d="M470 68 H480" marker-end="url(#ah-ts6)" />
          </svg>
          <figcaption>Figure 7 — Pick the product that already is your missing requirement. Rebuilding Temporal on SQL is a career, not a whiteboard.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ts-eval">Where this design falls short</h3>
        <p>Polling a SQL due-index at 10k/s needs sharding and still fights vacuum. A pure in-memory timer wheel loses jobs on crash unless every schedule is WAL'd — at which point you have rebuilt a log. Multi-region active-active schedulers will double-fire without a sticky region or a globally fenced job row. A scheduler is a wonderful way to DDoS your own workers; rate-limit fires per tenant.</p>
        <p>Catch-up-all after a four-hour outage can melt the fleet. Skip can silently drop a legal filing. Write the policy per job type, not as a global boolean. And DST still bites display: a user in London who asked for "09:00 local every day" must be converted at create time into UTC instants that already account for the next transition, or you re-derive them — never store a naive local time in the due-index.</p>

        <h3 class="lesson-subhead" id="ts-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is cron-on-one-box not a scheduler? (2) Describe a zombie dispatcher and the fence that stops it. (3) How do you generate <code>run_id</code> for a recurring job so retries work but tomorrow still runs? (4) Why jitter midnight, and why store UTC?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Distributed schedulers, fencing tokens and workflow engines are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
