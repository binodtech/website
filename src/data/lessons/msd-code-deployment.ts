/** Modern System Design — Chapter 37: Design a Code Deployment System.
 *  Artefacts, progressive delivery, health gating and rollback as a first-class path.
 */

export const msdCodeDeployment = {
  slug: 'code-deployment',
  title: 'Design a Code Deployment System',
  subtitle:
    'A deploy system ships an immutable artefact through environments with a gate at each step, a canary that can fail, and a rollback that is a second deploy of a known-good version — not an SSH script someone remembers in a fire.',
  byline: 'Modern System Design · Chapter 37 · ~1h read · Advanced',
  interviewTip:
    'Immutable artefacts, never "git pull on prod". Build once, promote the same bytes. Canary a percentage, watch SLOs from Chapter 4, halt on burn, rollback by re-pointing the fleet to the previous artefact id. Blue-green and canary are strategies; the platform is artefact storage, an orchestrator, a health signal, and an audit log. Configuration is versioned with the artefact or you will roll back code onto new config and call it cursed.',
  sections: [
    {
      id: 'cd-problem',
      title: 'System Design: A Code Deployment System',
      children: [
        { id: 'cd-what', title: 'What we are actually building' },
        { id: 'cd-immut', title: 'Build once, promote the artefact' },
        { id: 'cd-cfg', title: 'Config is a second artefact' },
        { id: 'cd-blocks', title: 'Building blocks' },
      ],
      html: `
        <p>Developers merge. A pipeline produces a container image or a binary, runs tests, and the same artefact moves through staging to production without being rebuilt. Production takes it in slices. If the error budget burns, the system stops and goes back. Humans can still press a button; they cannot be the only rollback plan.</p>
        <p>This is not CI. Tests and compilers belong in the pipeline that <em>creates</em> the digest. This chapter is CD: registry, promotion, rollout strategy, health gate, rollback, audit. If your answer is "Jenkins SSH's to prod and pulls main", you have described a hobby, not a system that survives Friday afternoon.</p>

        <h3 class="lesson-subhead" id="cd-what">What we are actually building</h3>
        <p>A control plane that stores desired version per service per environment, talks to the cluster (Kubernetes, ECS, a VM agent), reads SLIs, and either continues the rollout or reverts. An artefact store (registry) that is as durable as the blob store in <a href="/learn/modern-system-design/blob-store">Chapter 20</a>. An audit log that answers "who shipped digest X at 16:02, and what was previous." Multi-service dependency graphs are acknowledged, not solved: expand/contract for APIs still applies.</p>

        <h3 class="lesson-subhead" id="cd-immut">Build once, promote the artefact</h3>
        <p>Rebuilding "the same commit" in prod is how you ship a different compiler, a different base image, a different day of the week. The unit of promotion is a content digest (<code>sha256:...</code>). Staging and production run those bytes. Promotion is a pointer swing plus a rollout, not a second compile.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Commit to artefact to staging to canary to prod with rollback to previous digest">
            <defs>
              <marker id="ah-cd1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cd1b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="90" height="40" rx="7" />
            <text class="dg-s" x="61" y="76" text-anchor="middle">commit</text>
            <rect class="dg-box b" x="128" y="52" width="90" height="40" rx="7" />
            <text class="dg-s" x="173" y="76" text-anchor="middle">artefact</text>
            <rect class="dg-box c" x="240" y="52" width="90" height="40" rx="7" />
            <text class="dg-s" x="285" y="76" text-anchor="middle">staging</text>
            <rect class="dg-box o" x="352" y="52" width="90" height="40" rx="7" />
            <text class="dg-s" x="397" y="76" text-anchor="middle">canary</text>
            <rect class="dg-box g" x="464" y="52" width="90" height="40" rx="7" />
            <text class="dg-s" x="509" y="76" text-anchor="middle">prod</text>
            <rect class="dg-box r" x="580" y="52" width="124" height="40" rx="7" />
            <text class="dg-s" x="642" y="76" text-anchor="middle">prev digest</text>
            <path class="dg-line violet" d="M106 72 H124" marker-end="url(#ah-cd1)" />
            <path class="dg-line violet" d="M218 72 H236" marker-end="url(#ah-cd1)" />
            <path class="dg-line violet" d="M330 72 H348" marker-end="url(#ah-cd1)" />
            <path class="dg-line violet" d="M442 72 H460" marker-end="url(#ah-cd1)" />
            <path class="dg-line rose dash" d="M554 72 H576" marker-end="url(#ah-cd1b)" />
            <text class="dg-s" x="16" y="124">Same digest in every environment. Rollback is deploy(previous), not a new compile.</text>
          </svg>
          <figcaption>Figure 1 — If prod is a different binary than staging, your tests did not test production.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cd-cfg">Config is a second artefact</h3>
        <p>Baking secrets into the image is a breach waiting on a registry copy. Runtime config (feature flags, endpoint lists, resource limits) must be versioned and bound at deploy time: <code>app@sha256:abc</code> plus <code>config/prod@v33</code>. Rollback of code onto a newer config, or config onto older code, is a third failure mode. Record the pair. Feature flags decouple "bytes on the box" from "path is live" and are the fastest rollback when the binary boots; they do not help a panic on startup.</p>

        <h3 class="lesson-subhead" id="cd-blocks">Building blocks</h3>
        <table>
          <thead><tr><th>Need</th><th>Block</th></tr></thead>
          <tbody>
            <tr><td>Image / binary bytes</td><td><a href="/learn/modern-system-design/blob-store">Blob / registry</a></td></tr>
            <tr><td>Edge static assets</td><td><a href="/learn/modern-system-design/cdn">CDN</a> with versioned URLs</td></tr>
            <tr><td>Health signals</td><td><a href="/learn/modern-system-design/distributed-monitoring">Monitoring</a> SLIs</td></tr>
            <tr><td>Canary traffic split</td><td><a href="/learn/modern-system-design/load-balancers">Load balancer</a></td></tr>
            <tr><td>Worker rollouts</td><td><a href="/learn/modern-system-design/messaging-queue">One partition first</a></td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Health is an SLO, not a process uptime probe.</strong> A new version that is up and returning 200s of empty bodies will pass liveness. Gate on error rate, latency, and a business probe (checkout still works) — the same SLIs <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a> defined.</div>
      `,
    },
    {
      id: 'cd-req',
      title: 'Requirements and estimation',
      children: [
        { id: 'cd-nfr', title: 'Functional and non-functional' },
        { id: 'cd-est', title: 'How often and how wide' },
        { id: 'cd-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cd-nfr">Functional and non-functional</h3>
        <ol class="lesson-layers">
          <li><strong>Publish</strong> an artefact from CI (digest, metadata, SBOM optional).</li>
          <li><strong>Promote</strong> through environments with required gates.</li>
          <li><strong>Roll out</strong> with a named strategy and automatic halt.</li>
          <li><strong>Roll back</strong> to the previous known-good pair (code+config) in one action.</li>
          <li><strong>Audit</strong> who, what digest, when, and the metric snapshot at halt.</li>
        </ol>
        <table>
          <thead><tr><th>NFR</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Rollback start</td><td>&lt; 1 minute to re-point the fleet</td></tr>
            <tr><td>Canary decision</td><td>after N requests or W minutes, whichever is honest</td></tr>
            <tr><td>Registry availability</td><td>higher than prod; a down registry blocks rollback</td></tr>
            <tr><td>Blast radius</td><td>one region first, then the rest</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="cd-est">How often and how wide</h3>
        <pre><code>200 services, 8 deploys/service/day  -&gt; 1600 deploys/day
  peak 4/minute  — control plane is not the bottleneck
  artefact 400 MB * 1600  -&gt; 640 GB/day into the registry
    lifecycle: keep last 20 prod digests hot; rest to cold

CANARY
  1% of 50k QPS = 500 QPS  — enough to see a 2x error rate
    in ~1 minute (30k samples) if you are not unlucky
  1% of 10 QPS = noise; wait on time, not on count

ROLLBACK
  500 pods * 2s pull (layer cache hit)  -&gt; rolling 1-2 min
  cold registry miss  -&gt; 400 MB * 500  is a network event
  CONCLUSION: pin previous layers on nodes; registry HA</code></pre>

        <h3 class="lesson-subhead" id="cd-api">API sketch</h3>
        <pre><code>POST /deploys  { service, digest, configRef, strategy, steps: [1,10,50,100] }
GET  /deploys/{id}            { state, step, slis, prevDigest }
POST /deploys/{id}/halt
POST /deploys/{id}/rollback   -&gt; desired = previous pair

# artefact
POST /registry  (CI)          -&gt; digest
GET  /registry/{digest}       nodes pull by digest, never :latest</code></pre>
      `,
    },
    {
      id: 'cd-design',
      title: 'Rollout, gates and rollback',
      children: [
        { id: 'cd-strat', title: 'Blue-green, canary, rolling' },
        { id: 'cd-gate', title: 'The orchestrator and the gate' },
        { id: 'cd-front', title: 'Frontends, schemas and regions' },
        { id: 'cd-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="cd-strat">Blue-green, canary, rolling</h3>
        <table>
          <thead><tr><th>Strategy</th><th>How</th><th>Cost / risk</th></tr></thead>
          <tbody>
            <tr><td>Rolling</td><td>Replace N pods at a time</td><td>Cheap; mixed versions; slow rollback</td></tr>
            <tr><td>Blue-green</td><td>Two full fleets, flip LB</td><td>2× compute; fast flip; still drain in-flight</td></tr>
            <tr><td>Canary</td><td>1% → 10% → 100% of traffic</td><td>Needs a real split and comparable SLIs</td></tr>
          </tbody>
        </table>
        <p>Canary is the default for user-facing APIs. Sticky canaries (same users) reduce noise; random 1% is simpler. Batch consumers: run the new binary on one partition first so a poison parser does not stall the topic (<a href="/learn/modern-system-design/messaging-queue">Chapter 17</a>). Stateful stores: you are not canarying Cassandra with a percentage of queries unless you have thought about mixed-version protocols.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Canary percentage split versus blue-green flip of a load balancer">
            <defs>
              <marker id="ah-cd2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band o" x="12" y="16" width="344" height="136" rx="10" />
            <text class="dg-h" x="26" y="36">CANARY</text>
            <rect class="dg-box g" x="40" y="56" width="120" height="36" rx="6" />
            <text class="dg-s" x="100" y="78" text-anchor="middle">1% new</text>
            <rect class="dg-box b" x="184" y="56" width="140" height="36" rx="6" />
            <text class="dg-s" x="254" y="78" text-anchor="middle">99% old</text>
            <text class="dg-s" x="26" y="128">Compare SLIs, then widen.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="136" rx="10" />
            <text class="dg-h" x="382" y="36">BLUE-GREEN</text>
            <rect class="dg-box c" x="400" y="56" width="120" height="36" rx="6" />
            <text class="dg-s" x="460" y="78" text-anchor="middle">green idle</text>
            <rect class="dg-box g" x="544" y="56" width="140" height="36" rx="6" />
            <text class="dg-s" x="614" y="78" text-anchor="middle">flip LB</text>
            <text class="dg-s" x="382" y="128">Fast, twice the machines.</text>
          </svg>
          <figcaption>Figure 2 — Canary buys information. Blue-green buys speed. Rolling buys cheap and mixed versions.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cd-gate">The orchestrator and the gate</h3>
        <p>After each step, wait until you have enough samples or a minimum wall clock. Evaluate: error-budget burn versus baseline, p99 latency delta, synthetic checkout from <a href="/learn/modern-system-design/monitor-client-side">Chapter 15</a>. Fail: halt, roll back automatically, page. Pass: next slice. Flaky gates train people to skip them — make the probe as stable as the SLO, or you will ship blind.</p>
        <p>The previous digest must remain pullable. Garbage-collecting the last-good image during a rollout is how rollback 404s. Pin N previous prod digests in the registry with a lifecycle that cannot race the deploy.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Gate reading SLIs then either widening the canary or rolling back">
            <defs>
              <marker id="ah-cd3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cd3b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="44" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="72" text-anchor="middle">step 10%</text>
            <rect class="dg-box p" x="200" y="44" width="160" height="48" rx="7" />
            <text class="dg-s" x="280" y="72" text-anchor="middle">SLI vs baseline</text>
            <rect class="dg-box g" x="404" y="16" width="140" height="40" rx="7" />
            <text class="dg-s" x="474" y="40" text-anchor="middle">widen 50%</text>
            <rect class="dg-box r" x="404" y="80" width="140" height="40" rx="7" />
            <text class="dg-s" x="474" y="104" text-anchor="middle">rollback</text>
            <rect class="dg-box b" x="580" y="44" width="124" height="48" rx="7" />
            <text class="dg-s" x="642" y="72" text-anchor="middle">audit log</text>
            <path class="dg-line violet" d="M156 68 H196" marker-end="url(#ah-cd3)" />
            <path class="dg-line violet" d="M360 56 H400" marker-end="url(#ah-cd3)" />
            <path class="dg-line rose" d="M360 80 H400" marker-end="url(#ah-cd3b)" />
          </svg>
          <figcaption>Figure 3 — The gate is a decision with a recorded snapshot, not a vibes-based "looks fine."</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cd-front">Frontends, schemas and regions</h3>
        <p>Frontend JS on a CDN will pin old clients to new APIs. Version the asset URL (Chapter 11) and keep the old API until the cache dies. Schema migrations are expand/contract: deploy code that reads both, migrate, then remove. Ship region 0, then 1, then 2 so a bad digest is a regional incident. A deploy system that cannot deploy itself needs a manual break-glass that you rehearse, or the next outage is the platform.</p>

        <h3 class="lesson-subhead" id="cd-eval">Evaluation</h3>
        <p>We did not design multi-cloud, mobile app-store review, or database engine upgrades. Secrets in the image still happen. Canaries lie if the 1% is bots. Mixed-version rolling deploys will hit one-in-a-thousand protocol bugs. Feature flags accumulate into a combinatorial test matrix nobody runs. The honest limit: this platform makes reversible, observable promotions cheap. It does not make a bad migration safe.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why promote a digest instead of rebuilding on prod? (2) What SLI fails a canary that a liveness probe will not? (3) Contrast rolling, blue-green and canary, including rollback cost. (4) Why must the previous digest stay in the registry, and when is a feature flag faster than artefact rollback?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Progressive delivery, artefact promotion and rollback are standard industry practice; all explanations, figures and exercises are our own.',
};
