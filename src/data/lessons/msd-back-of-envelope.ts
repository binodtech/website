/** Modern System Design — Chapter 5: Back-of-the-Envelope Calculations.
 *  The numbers worth memorising, how to put them in perspective,
 *  and worked resource estimations.
 */

export const msdBackOfEnvelope = {
  slug: 'back-of-envelope',
  title: 'Back-of-the-Envelope Calculations',
  subtitle:
    'How to turn "millions of users" into a number of servers, terabytes and gigabits per second in about three minutes — and why the point of the exercise is finding the bottleneck, not being right to two decimal places.',
  byline: 'Modern System Design · Chapter 5 · ~1h 20m read · Beginner',
  interviewTip:
    'Nobody checks your arithmetic. What interviewers watch for is whether your numbers change your design. An estimate that ends "…so that is 40 TB a year, which is too much for one machine, so we shard by user ID" is doing its job. An estimate that ends "…anyway, moving on" was theatre. Always finish a calculation by naming the constraint it just revealed.',
  sections: [
    {
      id: 'perspective',
      title: 'Put Back-of-the-Envelope Numbers in Perspective',
      children: [
        { id: 'bo-why', title: 'Why estimate at all' },
        { id: 'bo-powers', title: 'Powers of two and ten' },
        { id: 'bo-latency', title: 'Latency numbers worth memorising' },
        { id: 'bo-capacity', title: 'What one machine can do' },
        { id: 'bo-time', title: 'Useful time conversions' },
        { id: 'bo-rules', title: 'Rules for estimating fast' },
      ],
      html: `
        <p>A back-of-the-envelope calculation is a deliberately rough estimate, done in your head or on a whiteboard, whose purpose is to answer one question: <strong>which resource runs out first?</strong></p>
        <p>You are not trying to size a purchase order. You are trying to discover, before you draw a single box, whether this system is bounded by storage, by bandwidth, by CPU, by memory or by latency — because the answer decides the architecture.</p>

        <h3 class="lesson-subhead" id="bo-why">Why estimate at all</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Four questions that estimation answers, each leading to a design consequence">
            <defs>
              <marker id="ah-bw" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHAT AN ESTIMATE IS FOR</text>
            <rect class="dg-box b" x="16" y="32" width="252" height="38" rx="7" />
            <text class="dg-s" x="30" y="49">“Does this fit on one machine?”</text>
            <text class="dg-s" x="30" y="64">the single most valuable question</text>
            <rect class="dg-box g" x="312" y="32" width="392" height="38" rx="7" />
            <text class="dg-s" x="326" y="49">If yes → do not distribute. You just saved yourself every problem</text>
            <text class="dg-s" x="326" y="64">in Chapter 3. If no → you now know which dimension forced it.</text>
            <path class="dg-line green" d="M268 51 H308" marker-end="url(#ah-bw)" />
            <rect class="dg-box b" x="16" y="78" width="252" height="38" rx="7" />
            <text class="dg-s" x="30" y="95">“Can memory hold the hot set?”</text>
            <text class="dg-s" x="30" y="110">RAM is ~100,000× faster than disk</text>
            <rect class="dg-box g" x="312" y="78" width="392" height="38" rx="7" />
            <text class="dg-s" x="326" y="95">If yes → a cache solves your latency problem outright.</text>
            <text class="dg-s" x="326" y="110">If no → you need tiering, or to shrink what counts as hot.</text>
            <path class="dg-line green" d="M268 97 H308" marker-end="url(#ah-bw)" />
            <rect class="dg-box b" x="16" y="124" width="252" height="38" rx="7" />
            <text class="dg-s" x="30" y="141">“Is the network the ceiling?”</text>
            <text class="dg-s" x="30" y="156">bandwidth is finite and billed</text>
            <rect class="dg-box g" x="312" y="124" width="392" height="38" rx="7" />
            <text class="dg-s" x="326" y="141">Video and image systems are almost always bandwidth-bound,</text>
            <text class="dg-s" x="326" y="156">which is what makes a CDN mandatory rather than optional.</text>
            <path class="dg-line green" d="M268 143 H308" marker-end="url(#ah-bw)" />
            <rect class="dg-box b" x="16" y="170" width="252" height="38" rx="7" />
            <text class="dg-s" x="30" y="187">“How many machines, roughly?”</text>
            <text class="dg-s" x="30" y="202">order of magnitude only</text>
            <rect class="dg-box g" x="312" y="170" width="392" height="38" rx="7" />
            <text class="dg-s" x="326" y="187">Three servers and three hundred are different architectures.</text>
            <text class="dg-s" x="326" y="202">Knowing which you are in prevents both over- and under-design.</text>
            <path class="dg-line green" d="M268 189 H308" marker-end="url(#ah-bw)" />
          </svg>
          <figcaption>Figure 1 — The four questions. Notice the first one can end the exercise entirely: much of the complexity in this course is unnecessary if the answer is "it fits".</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bo-powers">Powers of two and ten</h3>
        <p>All estimation rests on being fluent with orders of magnitude. Memorise the left column and the rest follows.</p>
        <table>
          <thead><tr><th>Power of 2</th><th>Approx. value</th><th>Bytes name</th><th>Rule of thumb</th></tr></thead>
          <tbody>
            <tr><td>2¹⁰</td><td>1 thousand</td><td>1 KB</td><td>a short paragraph of text</td></tr>
            <tr><td>2²⁰</td><td>1 million</td><td>1 MB</td><td>a small photo, a minute of MP3</td></tr>
            <tr><td>2³⁰</td><td>1 billion</td><td>1 GB</td><td>a few minutes of HD video</td></tr>
            <tr><td>2⁴⁰</td><td>1 trillion</td><td>1 TB</td><td>a large single disk</td></tr>
            <tr><td>2⁵⁰</td><td>1 quadrillion</td><td>1 PB</td><td>a serious storage cluster</td></tr>
          </tbody>
        </table>
        <p>Also worth having automatic: <strong>1 byte = 8 bits</strong> (bandwidth is quoted in bits, storage in bytes — a factor-of-8 error is the most common mistake in these exercises), and typical object sizes: a text message ~100 bytes, a tweet-sized post ~300 bytes, a thumbnail ~10 KB, a web page ~1–2 MB, a photo ~2 MB, a minute of 1080p video ~50 MB.</p>

        <h3 class="lesson-subhead" id="bo-latency">Latency numbers worth memorising</h3>
        <p>These are the numbers that decide whether a design can meet a latency budget. Exact values vary by hardware; the <em>ratios</em> are what matter and they are stable.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 272" role="img" aria-label="Latency ladder from CPU cache reference through memory, SSD, disk and network round trips">
            <defs>
              <marker id="ah-lt" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE LATENCY LADDER · EACH STEP IS ROUGHLY 10–100× THE LAST</text>
            <rect class="dg-box g" x="16" y="32" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="49">L1 cache reference · ~1 ns</text>
            <rect class="dg-box g" x="16" y="62" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="79">main memory (RAM) reference · ~100 ns</text>
            <rect class="dg-box b" x="16" y="92" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="109">compress 1 KB · ~3,000 ns (3 µs)</text>
            <rect class="dg-box b" x="16" y="122" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="139">SSD random read · ~100,000 ns (100 µs) — about 1,000× slower than RAM</text>
            <rect class="dg-box y" x="16" y="152" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="169">read 1 MB sequentially from memory · ~50 µs</text>
            <rect class="dg-box y" x="16" y="182" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="199">round trip within a datacentre · ~500,000 ns (0.5 ms)</text>
            <rect class="dg-box o" x="16" y="212" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="229">disk seek (spinning) · ~10,000,000 ns (10 ms)</text>
            <rect class="dg-box r" x="16" y="242" width="500" height="26" rx="5" />
            <text class="dg-s" x="30" y="259">round trip across continents · ~150,000,000 ns (150 ms) — physics, not engineering</text>
            <path class="dg-line rose thick" d="M528 40 V260" marker-end="url(#ah-lt)" />
            <text class="dg-s" x="548" y="60">The two that matter</text>
            <text class="dg-s" x="548" y="76">most in design:</text>
            <text class="dg-s" x="548" y="102">RAM vs SSD ≈ 1,000×</text>
            <text class="dg-s" x="548" y="118">→ why caches work</text>
            <text class="dg-s" x="548" y="144">local vs global ≈ 300×</text>
            <text class="dg-s" x="548" y="160">→ why CDNs and</text>
            <text class="dg-s" x="548" y="176">regional replicas exist</text>
            <text class="dg-s" x="548" y="206">You cannot beat 150 ms</text>
            <text class="dg-s" x="548" y="222">across an ocean, so the</text>
            <text class="dg-s" x="548" y="238">only fix is to not go</text>
            <text class="dg-s" x="548" y="254">across the ocean.</text>
          </svg>
          <figcaption>Figure 2 — The latency ladder. Two ratios carry most of the design weight: memory beats disk by ~1000×, and staying local beats going global by ~300×.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="bo-capacity">What one machine can do</h3>
        <p>To answer "does this fit on one machine", you need rough per-machine capacities. These are deliberately conservative round numbers for a commodity server.</p>
        <table>
          <thead><tr><th>Resource</th><th>Rough capacity per machine</th><th>What usually limits it first</th></tr></thead>
          <tbody>
            <tr><td>Simple HTTP requests</td><td>10,000–50,000 QPS</td><td>CPU, or connection handling</td></tr>
            <tr><td>Requests doing real work</td><td>1,000–5,000 QPS</td><td>CPU and downstream calls</td></tr>
            <tr><td>Cache reads (in-memory)</td><td>100,000+ QPS</td><td>network interface, not the cache</td></tr>
            <tr><td>Relational DB writes</td><td>1,000–10,000 QPS</td><td>disk flush and lock contention</td></tr>
            <tr><td>RAM</td><td>64–512 GB</td><td>cost</td></tr>
            <tr><td>Disk</td><td>1–20 TB</td><td>cost, and rebuild time on failure</td></tr>
            <tr><td>Network interface</td><td>10–100 Gbps</td><td>what you provisioned</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Round aggressively and say so.</strong> Use 100,000 seconds for a day (the real figure is 86,400), 30 days for a month, and 3 × 10⁷ seconds for a year. Treat a million as 10⁶ and forget 2²⁰. Nobody will object — rounding to the nearest power of ten is the standard convention, and it keeps the arithmetic doable out loud.</div>

        <h3 class="lesson-subhead" id="bo-time">Useful time conversions</h3>
        <pre><code>1 day    ≈ 86,400 s   → round to 100,000 s  (10⁵)
1 month  ≈ 2.6 × 10⁶ s
1 year   ≈ 3.15 × 10⁷ s → round to 3 × 10⁷ s

Handy inversion:
  1 QPS sustained    ≈ 2.6 million requests/month
  1 million/day      ≈ 12 QPS average
  100 million/day    ≈ 1,200 QPS average

Peak is not average: multiply average by 2–5× for daily peak,
and more if the product has a spike (sports, sales, breaking news).</code></pre>

        <h3 class="lesson-subhead" id="bo-rules">Rules for estimating fast</h3>
        <ul class="lesson-layers">
          <li><strong>State assumptions out loud, then move.</strong> "Let's say 100 million daily actives, each posting twice" — the interviewer will correct you if it matters, and now you have permission to proceed.</li>
          <li><strong>Round to one significant figure.</strong> Precision is fake here and slows you down.</li>
          <li><strong>Compute average first, then apply a peak multiplier.</strong> Designing for average load guarantees you fall over daily.</li>
          <li><strong>Always find the read:write ratio.</strong> It is the single most architecturally decisive number, because a 100:1 read-heavy system is solved with caches and replicas while a write-heavy one needs partitioning.</li>
          <li><strong>Finish by naming the bottleneck.</strong> The calculation is only useful if it changes something.</li>
        </ul>
      `,
    },
    {
      id: 'examples',
      title: 'Examples of Resource Estimation',
      children: [
        { id: 'ex-framework', title: 'A repeatable five-step framework' },
        { id: 'ex-twitter', title: 'Worked example: a Twitter-like feed' },
        { id: 'ex-video', title: 'Worked example: a video platform' },
        { id: 'ex-practice', title: 'Practice problems' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ex-framework">A repeatable five-step framework</h3>
        <p>Do these in order every time. The order matters because each step feeds the next.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Five step estimation framework from traffic through storage bandwidth memory to server count">
            <defs>
              <marker id="ah-fw" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="34" width="126" height="56" rx="8" />
            <text class="dg-t" x="79" y="54" text-anchor="middle">1 · TRAFFIC</text>
            <text class="dg-s" x="79" y="71" text-anchor="middle">DAU × actions</text>
            <text class="dg-s" x="79" y="84" text-anchor="middle">→ QPS, read:write</text>
            <rect class="dg-box c" x="158" y="34" width="126" height="56" rx="8" />
            <text class="dg-t" x="221" y="54" text-anchor="middle">2 · STORAGE</text>
            <text class="dg-s" x="221" y="71" text-anchor="middle">writes/day × size</text>
            <text class="dg-s" x="221" y="84" text-anchor="middle">→ per day and year</text>
            <rect class="dg-box g" x="300" y="34" width="126" height="56" rx="8" />
            <text class="dg-t" x="363" y="54" text-anchor="middle">3 · BANDWIDTH</text>
            <text class="dg-s" x="363" y="71" text-anchor="middle">QPS × payload</text>
            <text class="dg-s" x="363" y="84" text-anchor="middle">→ in and out, in bits</text>
            <rect class="dg-box y" x="442" y="34" width="126" height="56" rx="8" />
            <text class="dg-t" x="505" y="54" text-anchor="middle">4 · MEMORY</text>
            <text class="dg-s" x="505" y="71" text-anchor="middle">hot set × size</text>
            <text class="dg-s" x="505" y="84" text-anchor="middle">→ cache sizing</text>
            <rect class="dg-box p" x="584" y="34" width="120" height="56" rx="8" />
            <text class="dg-t" x="644" y="54" text-anchor="middle">5 · SERVERS</text>
            <text class="dg-s" x="644" y="71" text-anchor="middle">QPS ÷ per-box</text>
            <text class="dg-s" x="644" y="84" text-anchor="middle">→ machine count</text>
            <path class="dg-line violet" d="M142 62 H154" marker-end="url(#ah-fw)" />
            <path class="dg-line violet" d="M284 62 H296" marker-end="url(#ah-fw)" />
            <path class="dg-line violet" d="M426 62 H438" marker-end="url(#ah-fw)" />
            <path class="dg-line violet" d="M568 62 H580" marker-end="url(#ah-fw)" />
            <rect class="dg-band y" x="12" y="106" width="696" height="96" rx="10" />
            <text class="dg-h" x="26" y="126">THE 80/20 RULE FOR STEP 4</text>
            <text class="dg-s" x="26" y="146">Assume roughly 20% of your data serves 80% of requests — often far more skewed in practice. So the cache does not need</text>
            <text class="dg-s" x="26" y="162">to hold everything, only the hot fraction. This is what makes caching affordable: holding 20% of a 50 TB dataset in RAM is</text>
            <text class="dg-s" x="26" y="178">impossible, but holding the top 20% of one day's data usually is not.</text>
            <text class="dg-s" x="26" y="196">State the assumption explicitly — “assuming an 80/20 access pattern” — and the interviewer knows you know it is an assumption.</text>
          </svg>
          <figcaption>Figure 3 — The five-step framework. Step 1 produces the read:write ratio, which quietly determines everything downstream.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ex-twitter">Worked example: a Twitter-like feed</h3>
        <p>Follow the arithmetic; every step is one significant figure and doable in your head.</p>
        <pre><code>STEP 1 · TRAFFIC
  Assume 200M daily active users
  Each posts 0.1 times/day        → 20M posts/day
  Each reads their feed 10×/day   → 2B feed reads/day

  writes: 20M / 10⁵ s  = 200 writes/sec  (average)
  reads:  2B  / 10⁵ s  = 20,000 reads/sec (average)
  peak (×3):             600 writes/sec, 60,000 reads/sec

  read:write ratio = 100:1   ← THE decisive number

STEP 2 · STORAGE
  post = 300 bytes text + 100 bytes metadata ≈ 400 bytes
  20M × 400 B      = 8 GB/day of text
  × 365            ≈ 3 TB/year of text        ← small!

  But 10% of posts carry an image at 2 MB:
  2M images × 2 MB = 4 TB/day
  × 365            ≈ 1.5 PB/year              ← the real story

STEP 3 · BANDWIDTH
  outbound: 60,000 reads/sec × 20 posts × 400 B
          = 480 MB/sec ≈ 4 Gbps of text
  images dominate again → CDN, not origin servers

STEP 4 · MEMORY
  Cache the last 2 days of text: 16 GB
  Plus feeds for the 20% most active users
  → comfortably fits in a small cache cluster

STEP 5 · SERVERS
  60,000 reads/sec ÷ 5,000 per box ≈ 12 boxes
  → round to ~20 for headroom and failure tolerance</code></pre>
        <p><strong>What this calculation just told us,</strong> which is the entire point:</p>
        <ul>
          <li>The system is <strong>overwhelmingly read-heavy (100:1)</strong> → precompute feeds and cache aggressively rather than querying on read.</li>
          <li><strong>Text is tiny; media is enormous.</strong> 3 TB/year of text fits almost anywhere. 1.5 PB/year of images does not → blob store plus CDN, and they are separate systems from the post store.</li>
          <li><strong>Bandwidth, not CPU, is the ceiling</strong> → the CDN is mandatory, not an optimisation.</li>
          <li>Server count is small (~20) → the hard problems here are storage and distribution, not compute.</li>
        </ul>

        <h3 class="lesson-subhead" id="ex-video">Worked example: a video platform</h3>
        <p>The same framework on a workload with completely different physics.</p>
        <pre><code>STEP 1 · TRAFFIC
  Assume 100M DAU, each watching 5 videos/day → 500M views/day
  Uploads: 500,000 videos/day (a ~1,000:1 view:upload ratio)
  views:   500M / 10⁵ = 5,000 views/sec average, ~15,000 peak

STEP 2 · STORAGE
  Average upload: 10 min at ~50 MB/min = 500 MB
  Transcode to 5 resolutions ≈ 2× the original → ~1 GB stored
  500,000 × 1 GB   = 500 TB/day
  × 365            ≈ 180 PB/year               ← storage-dominated

STEP 3 · BANDWIDTH  ← the one that decides everything
  Streaming at ~5 Mbps per 1080p viewer
  Assume 1M concurrent viewers at peak
  1M × 5 Mbps      = 5,000 Gbps = 5 Tbps

  No single datacentre serves 5 Tbps to the public internet.
  → this system IS a CDN problem, with a video pipeline attached

STEP 4 · COMPUTE (the extra step video adds)
  Transcoding is CPU-heavy: roughly 2× real time per resolution
  500,000 videos × 10 min × 5 renditions = 25M minutes/day
  ÷ 1,440 min/day ≈ 17,000 machine-minutes per minute
  → a large asynchronous transcoding fleet, necessarily queued</code></pre>
        <p>Two designs, same framework, opposite conclusions: the feed system is a caching and fan-out problem, while the video system is a bandwidth and batch-compute problem. That divergence came out of five minutes of arithmetic, before either architecture was drawn — which is exactly why this chapter comes before the building blocks.</p>

        <h3 class="lesson-subhead" id="ex-practice">Practice problems</h3>
        <p>Work these on paper, out loud, in under five minutes each. Then check whether your answer names a bottleneck.</p>
        <ol class="lesson-layers">
          <li><strong>A URL shortener.</strong> 100M new links/month, each read 100 times. How much storage after five years? What QPS? Does the whole mapping fit in memory? (Hint: it very nearly does, and that changes the design completely.)</li>
          <li><strong>A chat application.</strong> 50M DAU, 40 messages each per day, average 100 bytes. Storage per year? Peak QPS? Now add read receipts and typing indicators — which one dominates traffic, and why is that surprising?</li>
          <li><strong>A ride-hailing service.</strong> 1M active drivers sending a location every 4 seconds. What is the write QPS? Can one database absorb it? What if you only persist every fifth update and keep the rest in memory?</li>
          <li><strong>A photo-sharing service.</strong> 500M users, 2 photos/day at 3 MB, each viewed 50 times. Compare storage growth against outbound bandwidth and say which forces your hand first.</li>
          <li><strong>A metrics system.</strong> 10,000 servers each emitting 500 metrics every 10 seconds. Data points per second? Per year at 16 bytes each? What does that tell you about retention policy and downsampling?</li>
        </ol>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> You should be able to state, from memory: the ratio between a memory read and an SSD read, the round-trip latency within a datacentre versus across the world, roughly how many requests per second one ordinary server handles, and how many seconds are in a day to one significant figure. Those four numbers plus the five-step framework will carry you through every estimation in the rest of this course.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Capacity-planning technique and the widely-circulated latency figures are standard industry knowledge; the ratios are stable while absolute values vary by hardware generation. All framework structure, worked examples, diagrams, tables and practice problems are our own.',
};
