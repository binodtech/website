/** Modern System Design — Chapter 41: Data Infrastructure for AI/ML Systems.
 *  Lakes, features, pipelines, lineage, and training-serving skew.
 */

export const msdAiMlDataInfra = {
  slug: 'ai-ml-data-infra',
  title: 'Data Infrastructure for AI/ML Systems',
  subtitle:
    'Models fail from silent data bugs more often than from the wrong optimiser. This chapter is the path from events to features to training sets to online serving, with lineage so you can answer "what trained this."',
  byline: 'Modern System Design · Chapter 41 · ~1h 45m read · Advanced',
  interviewTip:
    'Draw one path: event log → lake (immutable files) → transforms → feature store (offline tables + online KV) → training job → registry → serving. Then say the hard sentence: the feature function in training and the feature function in serving must be the same code or you have skew. Lineage and a model registry are how you roll back. Do not start with Kubernetes YAML. Name a concrete skew example (timezone, null vs 0, PIT leak) and say how GPU jobs checkpoint into object storage.',
  sections: [
    {
      id: 'ml-problem',
      title: 'System Design: AI/ML Data Infrastructure',
      children: [
        { id: 'ml-why', title: 'Why this is a system design problem' },
        { id: 'ml-req', title: 'Functional and non-functional requirements' },
        { id: 'ml-path', title: 'The path from event to prediction' },
        { id: 'ml-est', title: 'Back-of-the-envelope numbers' },
      ],
      html: `
        <p>A recommendation model, a fraud scorer, a fine-tune of an LLM — all drink from data that arrives late, is corrected later, and is served in a different process than it was trained in. Infrastructure exists to make that path boring: replayable, versioned, and debuggable. If you cannot answer "which snapshot, which code, which random seed produced this artefact," you do not have a platform. You have a shared drive with better branding.</p>
        <p>This is not a modelling chapter. Gradient descent is assumed. The product is the contract between yesterday's events and today's prediction: same entity, same feature meaning, no future leaking into the past, and a rollback when the contract breaks.</p>

        <h3 class="lesson-subhead" id="ml-why">Why this is a system design problem</h3>
        <p>Training without a lake is a laptop. Serving without a feature store is <code>SELECT</code> on the request path. Without lineage, a bad model in production cannot be tied to the table that poisoned it. Without a registry, "the model" is a file on someone's disk. These are the same themes as deploy in <a href="/learn/modern-system-design/code-deployment">Chapter 37</a> applied to data and artefacts: immutability, digest, canary, rollback.</p>
        <p>The failure mode is quieter than a 500. Offline AUC looks excellent because a click-after-the-label leaked into a feature. Online conversion drops 4% and nobody can replay Tuesday. GPU hours were spent on a dataset that cannot be reconstructed. That is a systems incident, not a science incident.</p>
        <p>Notebooks will always exist. The platform's job is to make the blessed path cheaper than dumping a CSV to Slack. If the CSV is easier, the CSV wins, and lineage dies.</p>
        <div class="lesson-callout"><strong>The unit of work is a versioned snapshot, not a table name.</strong> Saying "train on clicks" is how two jobs disagree about yesterday. Saying "train on iceberg snapshot s-2026-09-15T00:00Z of db.clicks" is how you can re-run the world.</div>

        <h3 class="lesson-subhead" id="ml-req">Functional and non-functional requirements</h3>
        <p>Functional: ingest product events with at-least-once delivery; land them immutably; compute features offline for training and online for serving; join labels to features as of the decision time; train on a pinned snapshot; register artefacts; serve a digest; version RAG corpora the same way as tables. Non-functional: training jobs must be restartable; serving feature lookups p99 under a few milliseconds; lake writes cheap; PII gated; multi-tenant isolation if you sell the platform.</p>
        <table>
          <thead><tr><th>Need</th><th>Target</th><th>Why it bites</th></tr></thead>
          <tbody>
            <tr><td>Feature lookup</td><td>p99 &lt; 5 ms</td><td>Adds to every scored request</td></tr>
            <tr><td>Lake freshness</td><td>minutes, not hours</td><td>Ads and fraud rot fast</td></tr>
            <tr><td>Replay</td><td>bit-identical snapshot</td><td>Incident forensics</td></tr>
            <tr><td>Train restart</td><td>checkpoint every 10 min</td><td>Preemption on GPU queues</td></tr>
            <tr><td>Lineage query</td><td>&lt; 1 s for one model</td><td>On-call will not grep logs</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="ml-path">The path from event to prediction</h3>
        <p>Events hit an ingest API or a CDC log. They land as Parquet in object storage. Batch and stream jobs write feature tables. A materialiser copies hot keys into an online KV. A training job reads a point-in-time join, writes checkpoints, and publishes a digest to the registry. Serving loads that digest and calls the online store with the same feature names. Lineage arrows run backwards when someone asks why.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Events to lake to features to train to registry to serve">
            <defs>
              <marker id="ah-ml1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="12" y="48" width="88" height="44" rx="6" />
            <text class="dg-s" x="56" y="74" text-anchor="middle">events</text>
            <rect class="dg-box b" x="120" y="48" width="88" height="44" rx="6" />
            <text class="dg-s" x="164" y="74" text-anchor="middle">lake</text>
            <rect class="dg-box p" x="228" y="48" width="100" height="44" rx="6" />
            <text class="dg-s" x="278" y="74" text-anchor="middle">features</text>
            <rect class="dg-box o" x="348" y="48" width="88" height="44" rx="6" />
            <text class="dg-s" x="392" y="74" text-anchor="middle">train</text>
            <rect class="dg-box g" x="456" y="48" width="100" height="44" rx="6" />
            <text class="dg-s" x="506" y="74" text-anchor="middle">registry</text>
            <rect class="dg-box c" x="576" y="48" width="128" height="44" rx="6" />
            <text class="dg-s" x="640" y="74" text-anchor="middle">online serve</text>
            <path class="dg-line violet" d="M100 70 H116" marker-end="url(#ah-ml1)" />
            <path class="dg-line violet" d="M208 70 H224" marker-end="url(#ah-ml1)" />
            <path class="dg-line violet" d="M328 70 H344" marker-end="url(#ah-ml1)" />
            <path class="dg-line violet" d="M436 70 H452" marker-end="url(#ah-ml1)" />
            <path class="dg-line violet" d="M556 70 H572" marker-end="url(#ah-ml1)" />
            <text class="dg-s" x="12" y="128">Same feature code reads the lake offline and the online store at request time.</text>
            <text class="dg-s" x="12" y="146">Lineage is the reverse walk: serving digest to snapshot id to git sha.</text>
            <text class="dg-s" x="12" y="164">If serving computes a feature the training job never saw, the model guesses.</text>
          </svg>
          <figcaption>Figure 1 — One directed path forward, one query path backward. Interviews fail when candidates draw only the forward arrows.</figcaption>
        </figure>
        <p>The serving process must not invent features. If a new column exists in the lake but the model digest was trained without it, the online path either omits it or refuses to load. Silent defaulting is how skew hides.</p>

        <h3 class="lesson-subhead" id="ml-est">Back-of-the-envelope numbers</h3>
        <p>Use the same discipline as <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>. A mid-size consumer product is enough to size disks, Kafka, and the online KV before anyone mentions Spark executor memory.</p>
        <pre><code>Events:  20k/s avg, 60k/s peak
Payload: 800 B after JSON→row (ids, ts, enums)
Raw/day: 20e3 * 86400 * 800 ≈ 1.4 TB uncompressed
Parquet + zstd ~ 4× → ~350 GB/day landing
90-day hot lake ≈ 32 TB (plus snapshots overhead ~20%)

Entities: 50M users, 40 features online, 8 B value
Online KV: 50e6 * 40 * 8 ≈ 16 GB values + ~2× Redis → ~32 GB
Lookup: 8k score QPS * 40 keys → 320k GET/s (pipeline / MGET)

Train set: 30 days clicks, 2e9 rows * 200 B row ≈ 400 GB
GPU job: 8×A100, 6 h, checkpoint 2 GB / 10 min → object store</code></pre>
        <p>The online store is small. The lake is not. Most cost sits in object storage, scan jobs, and GPUs — not in Redis. Design the KV for latency; design the lake for time travel.</p>
      `,
    },
    {
      id: 'ml-pieces',
      title: 'Lake, features, orchestration, skew',
      children: [
        { id: 'ml-ingest', title: 'Event ingest and the landing zone' },
        { id: 'ml-lake', title: 'Immutable lake and table formats' },
        { id: 'ml-feat', title: 'Feature store offline and online' },
        { id: 'ml-pit', title: 'Point-in-time joins' },
        { id: 'ml-skew', title: 'Training-serving skew, a concrete example' },
        { id: 'ml-orch', title: 'Orchestration, lineage, registry, GPUs' },
        { id: 'ml-rag', title: 'RAG corpus versioning' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ml-ingest">Event ingest and the landing zone</h3>
        <p>Product services emit events to a log (Kafka, Kinesis, Pub/Sub). Schema lives in a registry (Avro/Protobuf). Ingest is at-least-once; the landing writer is idempotent on <code>(event_id)</code> or on a deterministic file key. Do not compute features in the producer. Producers know facts. Features are derived, versioned, and owned by the ML platform.</p>
        <p>Corrections are new events, never updates in place. A user changes country; you append <code>profile_updated</code>. Training will see the world as of a timestamp, not the latest row in an OLTP table. CDC from databases is the same idea: changelog, not nightly dump that clobbers history.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Producers to log to landing files to catalog">
            <defs>
              <marker id="ah-ml2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="36" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="64" text-anchor="middle">app / CDC</text>
            <rect class="dg-box b" x="196" y="36" width="140" height="48" rx="7" />
            <text class="dg-s" x="266" y="64" text-anchor="middle">event log</text>
            <rect class="dg-box g" x="376" y="36" width="140" height="48" rx="7" />
            <text class="dg-s" x="446" y="64" text-anchor="middle">landing</text>
            <rect class="dg-box p" x="556" y="36" width="148" height="48" rx="7" />
            <text class="dg-s" x="630" y="64" text-anchor="middle">catalog</text>
            <path class="dg-line blue" d="M156 60 H192" marker-end="url(#ah-ml2)" />
            <path class="dg-line blue" d="M336 60 H372" marker-end="url(#ah-ml2)" />
            <path class="dg-line blue" d="M516 60 H552" marker-end="url(#ah-ml2)" />
            <text class="dg-s" x="16" y="116">Landing files are append-only Parquet, partitioned by event day and hour.</text>
            <text class="dg-s" x="16" y="134">Schema registry rejects unknown fields until a compatible bump lands.</text>
            <text class="dg-s" x="16" y="152">Duplicates are cheap; lost events are a silent label leak.</text>
          </svg>
          <figcaption>Figure 2 — The log is the system of record for facts. The lake is the system of record for history.</figcaption>
        </figure>
        <p>Backpressure belongs on the log, not in the feature job. If Spark is slow, Kafka retains. If you drop events at the producer to "keep up," you have invented a biased sample and will not notice until a rare fraud class vanishes.</p>

        <h3 class="lesson-subhead" id="ml-lake">Immutable lake and table formats</h3>
        <p>Land events as append-only files in object storage, partitioned by time. Table formats — Apache Iceberg, Delta Lake, Apache Hudi — add a catalog of snapshots, schema evolution, and time travel. You train on "the world as of Tuesday 00:00 UTC," not on whatever compaction finished during the job. Do not mutate the landing zone. Corrections are new files. This is the blob store from earlier chapters plus a catalog, not a giant Postgres.</p>
        <p>Copy-on-write snapshots make reads of a pinned version cheap and writes a metadata commit. Compaction is a background job that must not change snapshot identity. Hidden partitioning by <code>event_date</code> keeps scans from reading 90 days when you asked for one.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Bronze silver gold lake layers with snapshot ids">
            <defs>
              <marker id="ah-ml3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band y" x="16" y="24" width="220" height="100" rx="8" />
            <text class="dg-h" x="126" y="46" text-anchor="middle">BRONZE</text>
            <text class="dg-s" x="126" y="70" text-anchor="middle">raw events</text>
            <text class="dg-s" x="126" y="88" text-anchor="middle">immutable</text>
            <text class="dg-s" x="126" y="106" text-anchor="middle">schema as landed</text>
            <rect class="dg-band b" x="250" y="24" width="220" height="100" rx="8" />
            <text class="dg-h" x="360" y="46" text-anchor="middle">SILVER</text>
            <text class="dg-s" x="360" y="70" text-anchor="middle">cleaned joins</text>
            <text class="dg-s" x="360" y="88" text-anchor="middle">deduped ids</text>
            <text class="dg-s" x="360" y="106" text-anchor="middle">typed columns</text>
            <rect class="dg-band g" x="484" y="24" width="220" height="100" rx="8" />
            <text class="dg-h" x="594" y="46" text-anchor="middle">GOLD</text>
            <text class="dg-s" x="594" y="70" text-anchor="middle">feature tables</text>
            <text class="dg-s" x="594" y="88" text-anchor="middle">train snapshots</text>
            <text class="dg-s" x="594" y="106" text-anchor="middle">PIT labels</text>
            <path class="dg-line green" d="M236 74 H246" marker-end="url(#ah-ml3)" />
            <path class="dg-line green" d="M470 74 H480" marker-end="url(#ah-ml3)" />
            <text class="dg-s" x="16" y="150">Each gold table commit is a snapshot id. Training pins that id in the registry.</text>
            <text class="dg-s" x="16" y="168">Bronze stays forever; silver may compact; gold is what models cite.</text>
          </svg>
          <figcaption>Figure 3 — Medallion naming is optional. Snapshot identity is not. Gold without a catalog is just another folder.</figcaption>
        </figure>
        <p>Schema evolution is additive by default. Renaming a column is a new column plus a deprecation window. Breaking types (string to int) fork a new table. Feature code versions pin the table they understand.</p>

        <h3 class="lesson-subhead" id="ml-feat">Feature store offline and online</h3>
        <p>Offline: batch jobs (Spark, Flink, DuckDB on smaller tables) compute features into lake tables for training. Online: the same logical features as a low-latency KV (Redis, DynamoDB, a Feast-style store) for the request path. The materialiser is the bridge: it reads a feature table partition or a stream changelog and UPSERTs keys. If the materialiser is a second implementation of the transform, you have already lost.</p>
        <p>Streaming features — last ten minutes of clicks, rolling spend — need a stream processor writing both to the lake (for later PIT joins) and to the online KV. If you only write online, training cannot reconstruct the value as of time t. If you only write the lake, serving is a scan.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Shared transform writing offline tables and online KV">
            <defs>
              <marker id="ah-ml4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="260" y="16" width="200" height="44" rx="7" />
            <text class="dg-s" x="360" y="42" text-anchor="middle">one transform spec</text>
            <rect class="dg-box b" x="40" y="100" width="240" height="52" rx="7" />
            <text class="dg-s" x="160" y="122" text-anchor="middle">offline table</text>
            <text class="dg-s" x="160" y="140" text-anchor="middle">Spark / PIT join</text>
            <rect class="dg-box g" x="440" y="100" width="240" height="52" rx="7" />
            <text class="dg-s" x="560" y="122" text-anchor="middle">online KV</text>
            <text class="dg-s" x="560" y="140" text-anchor="middle">MGET by entity</text>
            <path class="dg-line hot" d="M320 60 V96 H280" marker-end="url(#ah-ml4)" />
            <path class="dg-line hot" d="M400 60 V96 H440" marker-end="url(#ah-ml4)" />
            <text class="dg-s" x="40" y="178">Offline is correct history. Online is the latest published value for serving.</text>
            <text class="dg-s" x="40" y="196">A shadow job recomputes online keys from the lake and diffs daily.</text>
          </svg>
          <figcaption>Figure 4 — Two stores, one spec. Dual implementations are the most common source of skew in production.</figcaption>
        </figure>
        <pre><code>GET /features/{entity_id}?names=a,b,c
  Authorization: service identity
  -&gt; { a: 3.2, b: 0, c: null, as_of: "..." }

SQL  SELECT * FROM feat_user
     FOR VERSION AS OF 's-2026-09-15T00:00Z'</code></pre>
        <p>Cardinality will melt the online KV the same way high-cardinality labels melt metrics. Do not put unbounded strings (search queries, URLs) as keys. Hash, bucket, or keep them offline only.</p>

        <h3 class="lesson-subhead" id="ml-pit">Point-in-time joins</h3>
        <p>A label at time t must join features that were knowable at t. If the user clicked at 12:01 and you train a "will they click" model with a 12:05 rolling count that includes that click, you have taught the model the answer. Offline AUC becomes fiction. Point-in-time (PIT) joins are the integrity constraint of this system, not a Spark convenience function.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Timeline showing feature as of t minus versus leaked future click">
            <defs>
              <marker id="ah-ml5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band l" x="16" y="24" width="688" height="72" rx="8" />
            <text class="dg-h" x="360" y="46" text-anchor="middle">DECISION TIME t</text>
            <text class="dg-s" x="120" y="72" text-anchor="middle">features &lt; t</text>
            <text class="dg-s" x="360" y="72" text-anchor="middle">label at t</text>
            <text class="dg-s" x="580" y="72" text-anchor="middle">clicks after t</text>
            <rect class="dg-box g" x="40" y="116" width="280" height="40" rx="6" />
            <text class="dg-s" x="180" y="140" text-anchor="middle">legal PIT join</text>
            <rect class="dg-box r" x="400" y="116" width="280" height="40" rx="6" />
            <text class="dg-s" x="540" y="140" text-anchor="middle">future leak</text>
            <path class="dg-line rose" d="M320 136 H396" marker-end="url(#ah-ml5)" />
          </svg>
          <figcaption>Figure 5 — Anything to the right of t is a spoiler. Streaming counts must be stored with an event time, not processing time.</figcaption>
        </figure>
        <p>Implementation: as-of join on event time, with a watermark so late data either updates a new snapshot or is excluded from the pinned train set. Do not "just join on user_id" in a notebook. That join is a leak unless you also constrain time.</p>

        <h3 class="lesson-subhead" id="ml-skew">Training-serving skew, a concrete example</h3>
        <p>Skew is any difference between the feature vector the trainer saw and the vector the server builds. Classic sources: different defaults, timezones, one-hot encoding order, "null versus 0," a Java online path and a Python train path, UTC in the lake and local time in the app, clipping at train and not at serve.</p>
        <p>Concrete example. Fraud model feature <code>amount_gbp</code>. Training Spark job: <code>amount_minor / 100.0</code> using the payment currency table as of the charge time, missing FX treated as null, then median-imputed in a sklearn pipeline pickled with the model. Serving Java: divides by 100 always, uses live FX, treats missing as 0.0, and skips the imputer because "Java does not pickle." A £0-looking feature now means "FX missing" online and "true zero" offline. The model scores tourists as safe. Chargebacks rise. Offline metrics never moved.</p>
        <p>Mitigation: generate both paths from one spec (SQL, Feast, a shared WASM/Python sidecar). Shadow: log the online vector, join later to a recomputation from the lake, alert on distribution drift per feature. Version the transform with the model digest so rollback reverts code and weights together.</p>
        <pre><code>TRAIN  label at t, features as of t-  (PIT join)
SERVE  features as of now from online KV
RULE   same transform, versioned with the model digest
DIFF   daily: online log vs lake recompute, KS or PSI per col</code></pre>

        <h3 class="lesson-subhead" id="ml-orch">Orchestration, lineage, registry, GPUs</h3>
        <p>Airflow, Dagster, and Temporal all schedule DAGs. The important properties are idempotent writes to dated partitions, explicit asset lineage, and retries that do not double-count. Airflow is a battle-tested cron with sensors. Dagster makes assets (tables) first-class so you think in data products. Temporal is a workflow engine: use it for long-running training that must survive process death, not for "run this Spark every hour" unless you like extra moving parts.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="DAG from ingest to features to train to registry">
            <defs>
              <marker id="ah-ml6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="120" height="44" rx="7" />
            <text class="dg-s" x="76" y="66" text-anchor="middle">ingest</text>
            <rect class="dg-box b" x="168" y="40" width="120" height="44" rx="7" />
            <text class="dg-s" x="228" y="66" text-anchor="middle">silver</text>
            <rect class="dg-box p" x="320" y="40" width="120" height="44" rx="7" />
            <text class="dg-s" x="380" y="66" text-anchor="middle">features</text>
            <rect class="dg-box o" x="472" y="16" width="120" height="40" rx="7" />
            <text class="dg-s" x="532" y="40" text-anchor="middle">train GPU</text>
            <rect class="dg-box g" x="472" y="72" width="120" height="40" rx="7" />
            <text class="dg-s" x="532" y="96" text-anchor="middle">materialise</text>
            <rect class="dg-box c" x="624" y="40" width="80" height="44" rx="7" />
            <text class="dg-s" x="664" y="66" text-anchor="middle">reg</text>
            <path class="dg-line cyan" d="M136 62 H164" marker-end="url(#ah-ml6)" />
            <path class="dg-line cyan" d="M288 62 H316" marker-end="url(#ah-ml6)" />
            <path class="dg-line cyan" d="M440 54 H468 V36" marker-end="url(#ah-ml6)" />
            <path class="dg-line cyan" d="M440 70 H468 V92" marker-end="url(#ah-ml6)" />
            <path class="dg-line cyan" d="M592 36 H620 V62" marker-end="url(#ah-ml6)" />
            <text class="dg-s" x="16" y="140">Train waits on a snapshot id, not on "silver succeeded sometime."</text>
            <text class="dg-s" x="16" y="158">Materialise can run in parallel with train; serving waits on registry.</text>
          </svg>
          <figcaption>Figure 6 — Orchestration is an asset graph. Time-based cron without snapshot pins is how Monday trains on Sunday's half file.</figcaption>
        </figure>
        <p>Lineage record: dataset snapshot, transform git sha, config hash, random seed, metric JSON, model digest, GPU image digest. Store it in a registry (MLflow, W&amp;B, an internal table). Deploy pulls a digest the same way Chapter 37 pulls an image. Rollback is "point the serving slot at the previous digest," not "find the pickle on a laptop."</p>
        <p>GPU training is a queue with preemption. Jobs checkpoint to object storage every N minutes. A gang-scheduled 8-GPU job that cannot checkpoint wastes the queue when a higher-priority job arrives. Fair-share by team, with a max wall time. Do not put interactive notebooks on the same reservation as overnight trains unless you enjoy 3 a.m. preemptions of production retrains.</p>
        <pre><code>POST /registry/models
  { name, digest, snapshot_id, git_sha, metrics, image }

POST /train/jobs
  { spec, snapshot_id, gpus, checkpoint_uri }
  -&gt; { job_id, queue_position }

GET  /lineage/models/{digest}
  -&gt; { snapshot_id, parents[], git_sha, created_at }</code></pre>

        <h3 class="lesson-subhead" id="ml-rag">RAG corpus versioning</h3>
        <p>LLM fine-tunes are artefacts like any other model. RAG corpora are indexes, not "whatever is in the CMS now." A doc edit that silently changes production answers is an unreviewed deploy. Treat corpus version like a digest: chunk, embed, build index, alias-swap as in search chapters. Serving pins <code>index_id</code>. Evaluation sets pin the same id. Training data for fine-tunes gets a dataset card: licence, PII scan, date range.</p>
        <p>If retrieval and weights both move in one change, you cannot attribute a quality drop. Change one, measure, then the other.</p>
      `,
    },
    {
      id: 'ml-eval',
      title: 'Evaluation',
      children: [
        { id: 'ml-metrics', title: 'What to measure in production' },
        { id: 'ml-short', title: 'Where this design falls short' },
        { id: 'ml-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ml-metrics">What to measure in production</h3>
        <p>Offline AUC is a lab number. Production wants: feature freshness lag, PIT-join row counts versus expected, online/offline feature PSI, serving latency, GPU queue wait, snapshot age of the live model, and a business metric with a holdout or interleaved experiment. Data tests (null rates, range checks) run as DAG nodes that fail the train if they trip — the same idea as unit tests gating deploy.</p>
        <p>Shadow scoring: new digest scores a sample of live traffic without acting. Compare score distributions before a canary. Canary: 1% of decisions, kill switch on the registry pointer.</p>

        <h3 class="lesson-subhead" id="ml-short">Where this design falls short</h3>
        <p>Feature explosion (cardinality) will melt the online KV — same as monitoring labels. PII in lakes needs access control that data scientists will try to bypass with notebook exports; you need column-level grants and scanned egress. Multi-region feature stores lag; fraud features that are 2 s stale may be fine, ads may not. We sketched GPU queues, not cluster autoscaling across clouds or spot-instance interruption storms beyond checkpointing.</p>
        <p>Humans in notebooks will still dump CSV. Real-time learning (update weights on every click) is a different system: this chapter is batch/stream features plus periodic retrain. Streaming training without PIT discipline is an especially fast way to leak. Embedding drift in RAG indexes is only caught if you freeze an eval corpus. Cross-org lineage (vendor models, purchased data) will have holes no catalog fills.</p>
        <p>The design also assumes one feature spec language. In companies with Python training and Go serving, that spec is a political artefact. If you cannot staff it, run the Python transform as a sidecar on the serving path and pay the latency — honest skew beats a pretty Java port you do not test.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 170" role="img" aria-label="Four failure panels: cardinality, PII, lag, notebooks">
            <defs>
              <marker id="ah-ml7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="28" width="160" height="56" rx="7" />
            <text class="dg-s" x="96" y="50" text-anchor="middle">cardinality</text>
            <text class="dg-s" x="96" y="68" text-anchor="middle">KV melt</text>
            <rect class="dg-box o" x="192" y="28" width="160" height="56" rx="7" />
            <text class="dg-s" x="272" y="50" text-anchor="middle">PII egress</text>
            <text class="dg-s" x="272" y="68" text-anchor="middle">CSV bypass</text>
            <rect class="dg-box y" x="368" y="28" width="160" height="56" rx="7" />
            <text class="dg-s" x="448" y="50" text-anchor="middle">region lag</text>
            <text class="dg-s" x="448" y="68" text-anchor="middle">stale fraud</text>
            <rect class="dg-box k" x="544" y="28" width="160" height="56" rx="7" />
            <text class="dg-s" x="624" y="50" text-anchor="middle">notebooks</text>
            <text class="dg-s" x="624" y="68" text-anchor="middle">shadow path</text>
            <path class="dg-line rose" d="M176 56 H188" marker-end="url(#ah-ml7)" />
            <path class="dg-line rose" d="M352 56 H364" marker-end="url(#ah-ml7)" />
            <path class="dg-line rose" d="M528 56 H540" marker-end="url(#ah-ml7)" />
            <text class="dg-s" x="16" y="116">The blessed path must be easier than the CSV or the CSV becomes production.</text>
            <text class="dg-s" x="16" y="134">Lag is a product choice: advertise freshness SLOs per feature group.</text>
          </svg>
          <figcaption>Figure 7 — Four places this architecture still leaks. Naming them in an interview is stronger than claiming a complete platform.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ml-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) What lives in the lake versus the online feature KV, and who writes each? (2) Define training-serving skew with one concrete numeric example, not a slogan. (3) Why are point-in-time joins an integrity constraint rather than an optimisation? (4) What does the model registry store, and how does rollback differ from "retrain"? Bonus: how do you version a RAG index so a CMS edit is a reviewed deploy?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Feature stores, lakehouses and training-serving skew are standard ML-platform ideas; all explanations, figures and exercises are our own.',
};
