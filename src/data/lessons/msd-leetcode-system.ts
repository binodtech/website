/** Modern System Design — Chapter 39: Design the LeetCode System.
 *  Hostile sandboxes, async judging, contest spikes, leaderboards and anti-cheat.
 */

export const msdLeetcodeSystem = {
  slug: 'leetcode-system',
  title: 'Design the LeetCode System',
  subtitle:
    'A coding platform is a content CMS plus a hostile compute cluster. Users submit untrusted code; you run it in a Firecracker-class sandbox against hidden tests, then store a verdict. Contests are a traffic spike with a fairness constraint. Error messages must not leak the hidden tests.',
  byline: 'Modern System Design · Chapter 39 · ~2h read · Advanced',
  interviewTip:
    'Untrusted code is the design. Isolate (Firecracker or gVisor, no network), cap resources, never exec on the API box. Queue submissions; the HTTP call is “accepted for judge.” Hidden tests live off the public problem blob. Contests: pre-warm workers, rate-limit submits, sorted-set leaderboards with a freeze. Anti-cheat is similarity plus process, not a magic model. Never echo hidden inputs in compiler or runtime errors.',
  sections: [
    {
      id: 'lc-problem',
      title: 'System Design: The LeetCode System',
      children: [
        { id: 'lc-what', title: 'Problems, submits, contests' },
        { id: 'lc-trust', title: 'The submitter is hostile' },
        { id: 'lc-iso', title: 'Why Firecracker-class isolation' },
      ],
      html: `
        <p>Users read a problem, write code in a browser, run it against sample tests, then submit to hidden tests. During a contest, hundreds of thousands do this in the same minute. Rankings update. The code may try to read a flag, fork-bomb, or phone home. The interesting system is not the CMS for problem statements. It is a queue of hostile jobs and a fairness story at spike time.</p>

        <h3 class="lesson-subhead" id="lc-what">Problems, submits, contests</h3>
        <p>Problem bank: statement, samples, hidden tests, time and memory limits, optional special judge. User source and verdict history. The editor session is a nice extra (collaboration is Google Docs; skip). Contests: timed window, scoreboard freeze, penalty scoring (ICPC-style or LeetCode-style — name one). Discussions and premium are a CMS; do not let them steal the interview.</p>
        <p>Two run modes: “run” against public samples (fast feedback, still sandboxed) and “submit” against hidden tests (the contest-legal verdict). Both are untrusted. Samples may be cached more aggressively; hidden tests must not appear in the client, the public API, or logs.</p>

        <h3 class="lesson-subhead" id="lc-trust">The submitter is hostile</h3>
        <p>Assume the code will try to escape. Sandbox: no network, read-only filesystem except a tmpdir, ulimit on CPU, memory, and PIDs, seccomp, short wall clock. Hidden tests are mounted into the jail, not fetched over HTTP from a bucket the guest can reach. The worker’s cloud credentials must not exist in the guest.</p>
        <p>A breakout should not reach the test-case store. Treat the worker as cattle: recycle microVMs per job or per small batch. Do not reuse a VM that ran untrusted code without a reboot if you cannot prove the rootfs is clean.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="API enqueues code, sandbox workers return a verdict">
            <defs>
              <marker id="ah-lc1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="88" height="40" rx="7" />
            <text class="dg-s" x="60" y="76" text-anchor="middle">API</text>
            <rect class="dg-box p" x="140" y="52" width="100" height="40" rx="7" />
            <text class="dg-s" x="190" y="76" text-anchor="middle">queue</text>
            <rect class="dg-box r" x="276" y="36" width="200" height="72" rx="8" />
            <text class="dg-s" x="376" y="60" text-anchor="middle">sandbox worker</text>
            <text class="dg-s" x="376" y="76" text-anchor="middle">no net · ulimit</text>
            <text class="dg-s" x="376" y="92" text-anchor="middle">hidden tests</text>
            <rect class="dg-box g" x="516" y="52" width="188" height="40" rx="7" />
            <text class="dg-s" x="610" y="76" text-anchor="middle">verdict store</text>
            <path class="dg-line violet" d="M104 72 H136" marker-end="url(#ah-lc1)" />
            <path class="dg-line violet" d="M240 72 H272" marker-end="url(#ah-lc1)" />
            <path class="dg-line violet" d="M476 72 H512" marker-end="url(#ah-lc1)" />
          </svg>
          <figcaption>Figure 1 — The API never execs user code. The worker never has network. The tests never go to the browser.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lc-iso">Why Firecracker-class isolation</h3>
        <p>Containers share a kernel. A kernel exploit is a cluster exploit. gVisor intercepts syscalls; Firecracker gives each job a microVM with a tiny device model and a jailer. Interview language: “I want a hardware-virtualised boundary, no guest network, and a hard wall-clock kill.” Docker-on-the-API-box is the wrong picture.</p>
        <p>Cold start of a microVM is tens to a few hundred milliseconds if you pre-boot a pool. Pulling a JDK image during a contest is an outage. Pin language images on the workers. The pool size is a capacity plan, not an autoscale after the first TLE spike.</p>
        <div class="lesson-callout"><strong>Isolation is defence in depth, not a single flag.</strong> MicroVM plus seccomp plus no credentials plus recycled overlay plus network off. Any one layer will fail eventually.</div>
      `,
    },
    {
      id: 'lc-req',
      title: 'Requirements, APIs and estimation',
      children: [
        { id: 'lc-fn', title: 'Functional and non-functional' },
        { id: 'lc-api', title: 'API sketch' },
        { id: 'lc-est', title: 'Estimation and pooling' },
      ],
      html: `
        <h3 class="lesson-subhead" id="lc-fn">Functional and non-functional</h3>
        <table>
          <thead><tr><th></th><th>Requirement</th></tr></thead>
          <tbody>
            <tr><td><strong>Functional</strong></td><td>List problems, run samples, submit, verdict history, contests, leaderboard, freeze</td></tr>
            <tr><td><strong>Isolation</strong></td><td>Untrusted code cannot reach network, host, or other jobs</td></tr>
            <tr><td><strong>Fairness</strong></td><td>Same tests, same limits, queue delay visible; no silent drop</td></tr>
            <tr><td><strong>Latency</strong></td><td>Queue ack &lt; 100 ms; verdict in seconds, not minutes, except backlog</td></tr>
            <tr><td><strong>Integrity</strong></td><td>Hidden tests and expected outputs never in client or error strings</td></tr>
          </tbody>
        </table>
        <p>Languages: a finite matrix (C++, Java, Python, …) with pinned compiler versions. A special judge is a trusted binary you wrote, still running inside the jail, comparing outputs when many answers are valid (floating point, any permutation).</p>
        <p>Wall-clock versus CPU-time is a fairness issue. A noisy neighbour on a shared host stretches wall time and WA/TLEs people who would pass on a quiet box. Pin one job per core in contest mode even if you oversubscribe off-peak. That is a utilisation tax you should name.</p>

        <h3 class="lesson-subhead" id="lc-api">API sketch</h3>
        <pre><code>POST /problems/{id}/runs       { lang, source }   # samples only
POST /problems/{id}/submissions { lang, source }
  -&gt; { submissionId, status: queued }

GET  /submissions/{id}
  -&gt; { status, verdict, runtimeMs?, memoryKb?, failedCaseId? }
  # failedCaseId only for public samples, or an opaque index — never the input

GET  /contests/{id}/leaderboard?cursor=

# internal
queue: judge.jobs  { submissionId, problemId, lang, sourceRef, hidden: bool }
worker: pull, exec, write verdict, publish to UI channel
tests: encrypted blob fetched by the host, not the guest network</code></pre>
        <p>Source lives in object storage by hash; the queue carries a pointer. The UI subscribes to a verdict event (SSE/WebSocket) rather than hammering GET. Polling is the fallback.</p>
        <p>Idempotency: the same (user, problem, source hash) in a short window should collapse to one job during a contest mash of the submit button. Distinct source hashes are distinct attempts and must all count toward penalty rules.</p>

        <h3 class="lesson-subhead" id="lc-est">Estimation and pooling</h3>
        <pre><code>EVERYDAY
  100k DAU, 10 submits/user/day = 1M/day ≈ 12/s average
  each job 1-3 s CPU  -&gt; a few dozen busy sandboxes off-peak

CONTEST SPIKE
  50k contestants
  0.5 submit/min at the open and near the close
  50k x 0.5 / 60 ≈ 400 submits/s
  400/s x 2 s avg CPU ≈ 800 concurrent sandboxes
  plus compile time: budget 1200-2000 microVMs warm

THUNDERING HERD AT T=0
  50k "run sample" in 10 s = 5k/s  — worse than submit
  rate-limit per user (e.g. 1 in-flight, 10/min)
  pre-warm pool for 30 min before start

STORAGE
  source is small; keep for plagiarism and appeals
  1M x 5 KB = 5 GB/day  — not the problem
  hidden tests: small, highly sensitive, versioned</code></pre>
        <p>The spike is the design. Autoscaling from zero at contest start is how you fail the first ten minutes, which is when fairness complaints are loudest. Warm pool, pinned images, per-user in-flight caps, and a queue that reports position.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Contest open spike versus a pre-warmed sandbox pool">
            <defs>
              <marker id="ah-lc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">SCALE FROM ZERO</text>
            <text class="dg-s" x="26" y="58">image pull during contest</text>
            <text class="dg-s" x="26" y="76">queue delay unbounded</text>
            <text class="dg-s" x="26" y="94">fairness complaints</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">PRE-WARM</text>
            <text class="dg-s" x="382" y="58">pool of microVMs ready</text>
            <text class="dg-s" x="382" y="76">per-user in-flight cap</text>
            <text class="dg-s" x="382" y="94">queue position visible</text>
          </svg>
          <figcaption>Figure 2 — Contest capacity is a reservation. Cold start is the outage mode.</figcaption>
        </figure>
      `,
    },
    {
      id: 'lc-design',
      title: 'Judging, contests, cheat and leaks',
      children: [
        { id: 'lc-judge', title: 'The judge pipeline' },
        { id: 'lc-board', title: 'Leaderboard as a sorted set' },
        { id: 'lc-cheat', title: 'Anti-cheat' },
        { id: 'lc-leak', title: 'Hidden tests leaking via errors' },
        { id: 'lc-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="lc-judge">The judge pipeline</h3>
        <p>Host fetches source and tests. Start or check out a microVM from the pool. Copy source into the guest. Compile if needed (still in the jail). For each test: run with CPU/memory/wall limits, capture stdout, compare or invoke the special judge, stop on first failure or run all for a partial score. Tear down the VM. Write verdict. Publish.</p>
        <p>Cache compiled artefacts by (source hash, compiler version) only if the cache is outside the guest and you trust the compiler bit-for-bit — a nicety, not v1. Never cache across users in a writable guest disk.</p>
        <p>Timeouts: wall clock must exceed CPU quota enough to allow paging, but not enough to sleep-bomb the pool. Kill -9 from the host. A job that hangs in D-state is a worker bug; recycle the host if needed.</p>
        <p>Output compare: exact bytes, or tokenised ignore-whitespace, or a judge. Do not run a full-file diff on a 50 MB stdout; cap output size in the jail so a printf bomb cannot fill the host disk. The cap is part of the limit table next to CPU and RSS.</p>
        <p>Failed sample runs may echo a trimmed stdout. Failed hidden runs must not. Implement that as a flag on the job, not as two code paths that drift.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Queue to pooled microVM to verdict">
            <defs>
              <marker id="ah-lc3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="64" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="88" text-anchor="middle">queue</text>
            <rect class="dg-box o" x="156" y="64" width="140" height="40" rx="7" />
            <text class="dg-s" x="226" y="88" text-anchor="middle">warm pool</text>
            <rect class="dg-box r" x="336" y="52" width="180" height="64" rx="8" />
            <text class="dg-s" x="426" y="76" text-anchor="middle">Firecracker</text>
            <text class="dg-s" x="426" y="94" text-anchor="middle">compile · tests</text>
            <rect class="dg-box g" x="556" y="64" width="148" height="40" rx="7" />
            <text class="dg-s" x="630" y="88" text-anchor="middle">verdict</text>
            <path class="dg-line blue" d="M116 84 H152" marker-end="url(#ah-lc3)" />
            <path class="dg-line blue" d="M296 84 H332" marker-end="url(#ah-lc3)" />
            <path class="dg-line blue" d="M516 84 H552" marker-end="url(#ah-lc3)" />
          </svg>
          <figcaption>Figure 3 — Pull from a warm pool, run, recycle. The verdict store is the only durable output of the guest.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lc-board">Leaderboard as a sorted set</h3>
        <p>Score and penalty (time of last accept, wrong-attempt penalties) update from a stream of accepted verdicts. Redis sorted sets (score as a composite, member = user id) make range queries cheap. Do not <code>ORDER BY</code> SQL on every GET during a contest.</p>
        <p>Freeze: at T-minus-one-hour (or whatever the rules say), public reads hit a snapshot. Official scoring continues privately. After freeze lift, swap the snapshot. Ties need a documented tie-break in the score encoding so ZSET order matches the rules.</p>
        <p>Idempotent apply: the same submission id must not increment the board twice. Dedupe on submission id in the consumer.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Verdicts flow into a sorted set and a freeze snapshot">
            <defs>
              <marker id="ah-lc4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="48" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="74" text-anchor="middle">verdicts</text>
            <rect class="dg-box b" x="196" y="48" width="180" height="44" rx="7" />
            <text class="dg-s" x="286" y="74" text-anchor="middle">sorted set</text>
            <rect class="dg-box p" x="416" y="48" width="140" height="44" rx="7" />
            <text class="dg-s" x="486" y="74" text-anchor="middle">snapshot</text>
            <rect class="dg-box g" x="596" y="48" width="108" height="44" rx="7" />
            <text class="dg-s" x="650" y="74" text-anchor="middle">GET</text>
            <path class="dg-line green" d="M156 70 H192" marker-end="url(#ah-lc4)" />
            <path class="dg-line green" d="M376 70 H412" marker-end="url(#ah-lc4)" />
            <path class="dg-line green" d="M556 70 H592" marker-end="url(#ah-lc4)" />
          </svg>
          <figcaption>Figure 4 — Live ZSET for official state; frozen snapshot for public GET. Same submission never applied twice.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lc-cheat">Anti-cheat</h3>
        <p>You will not make cheating impossible. You will make it auditable. Moss-style or token-embedding similarity on the corpus of submits for a problem; timing clusters (identical accept seconds from many accounts); shared device fingerprints as a weak signal; honour code plus a disqualification process with humans.</p>
        <p>Operational controls: one in-flight submit, IP rate limits that do not punish a NAT of a university, delayed plagiarism reports after the contest so you do not leak who you are investigating mid-event. Publishing full hidden tests after a contest is a product choice; during the contest it is a leak.</p>
        <p>Shared template code from a course will look similar. Thresholds need a human review queue, not auto-ban at 0.8 cosine. Store the AST or token stream, not only the raw source, so whitespace-only cheats still match.</p>
        <p>Clock: contest start and freeze are absolute instants. Clients in far timezones still submit to the server clock. Showing a countdown from NTP-synced server time avoids “my laptop was slow.”</p>

        <h3 class="lesson-subhead" id="lc-leak">Hidden tests leaking via errors</h3>
        <p>A classic hole: the runtime prints the input on assertion, or your harness includes the failed line of stdin in the message, or Python’s exception shows a value from the hidden file, or a stack trace includes a path like <code>/hidden/case_47.in</code>. Competitors reconstruct tests from a few WA messages.</p>
        <p>Policy: map guest stdout/stderr through a filter. On hidden submits, return verdict, time, memory, and maybe a failing test index with no payload. Custom checkers must not fprintf the expected answer. Compiler errors are source-only. Log the raw guest output in an access-controlled store for authors, never in the public API.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Guest output filtered before the public verdict">
            <defs>
              <marker id="ah-lc5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="48" width="180" height="52" rx="7" />
            <text class="dg-s" x="106" y="78" text-anchor="middle">guest stderr</text>
            <rect class="dg-box o" x="236" y="48" width="200" height="52" rx="7" />
            <text class="dg-s" x="336" y="78" text-anchor="middle">host filter</text>
            <rect class="dg-box g" x="476" y="48" width="228" height="52" rx="7" />
            <text class="dg-s" x="590" y="78" text-anchor="middle">public verdict</text>
            <path class="dg-line rose" d="M196 74 H232" marker-end="url(#ah-lc5)" />
            <path class="dg-line rose" d="M436 74 H472" marker-end="url(#ah-lc5)" />
          </svg>
          <figcaption>Figure 5 — Hidden inputs die at the host filter. Public messages are verdict and resource use, not stdin.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lc-eval">Evaluation</h3>
        <p>MicroVMs are not free; a mis-sized pool either wastes money or queues. Special judges are trusted code with bugs that can false-WA a contest. Sorted sets need a disaster-recovery story (rebuild from verdict log). Similarity anti-cheat false-positives on boilerplate includes. Rate limits punish shared campuses.</p>
        <p>This design does not cover collaborative editing, AI-assistant policy, or running GPU jobs. It also under-specifies multi-region contests (clock skew on start time is a fairness bug — NTP and a single contest clock).</p>
        <table>
          <thead><tr><th>Risk</th><th>What it looks like</th><th>Mitigation</th></tr></thead>
          <tbody>
            <tr><td>Escape</td><td>guest reaches metadata service</td><td>no net, microVM, no creds in guest</td></tr>
            <tr><td>Fork bomb</td><td>worker unresponsive</td><td>PID and memory ulimit, recycle VM</td></tr>
            <tr><td>Contest herd</td><td>queue age minutes</td><td>pre-warm, in-flight cap, fair pools</td></tr>
            <tr><td>Test leak</td><td>WA message contains stdin</td><td>host filter, opaque case index</td></tr>
            <tr><td>Board drift</td><td>GET disagrees with freeze</td><td>snapshot + idempotent apply</td></tr>
            <tr><td>False plagiarise</td><td>course template match</td><td>human queue, AST not whitespace</td></tr>
          </tbody>
        </table>
        <p>Special-judge bugs are contest-ending. Keep a golden corpus of submissions with known verdicts and run it on every harness deploy, not only on problem publish.</p>
        <p>Appeals need the raw guest log in a locked bucket. Authors see it; contestants on hidden submits do not. That split is the same as the public filter, with a longer retention for disputes.</p>
        <p>Pre-warm math is a reservation, not autoscale: 2000 microVMs idle for thirty minutes is cheaper than a viral tweet that the contest was unfair. Budget it as contest COGS.</p>
        <p>Language version pins belong in the problem header. A silent compiler upgrade that changes UB in C++ will scramble a leaderboard. Treat toolchain digest as part of the contest config hash.</p>
        <p>Sample-run cache by source hash helps the editor loop without starving submit workers, but only if sample jobs have a separate pool. Mixing them is how “Run Code” before the contest start steals capacity from the opening minute.</p>
        <p>Interactive problems (two-process protocols) need a different harness than batch stdin/stdout. If you only designed batch, say so.</p>
        <p>Queue fairness: FIFO globally lets one language’s slow compiler stall Python. Prefer per-language worker pools, or a weighted fair queue, so a C++ compile storm does not TLE the rest of the contest by delay rather than by algorithm.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Per-language worker pools pulling from a fair queue">
            <defs>
              <marker id="ah-lc6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box p" x="16" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="78" text-anchor="middle">submits</text>
            <rect class="dg-box b" x="196" y="52" width="160" height="44" rx="7" />
            <text class="dg-s" x="276" y="78" text-anchor="middle">fair queue</text>
            <rect class="dg-box r" x="396" y="24" width="140" height="40" rx="7" />
            <text class="dg-s" x="466" y="48" text-anchor="middle">pool C++</text>
            <rect class="dg-box o" x="396" y="84" width="140" height="40" rx="7" />
            <text class="dg-s" x="466" y="108" text-anchor="middle">pool Py</text>
            <rect class="dg-box g" x="576" y="52" width="128" height="44" rx="7" />
            <text class="dg-s" x="640" y="78" text-anchor="middle">verdicts</text>
            <path class="dg-line blue" d="M156 74 H192" marker-end="url(#ah-lc6)" />
            <path class="dg-line blue" d="M356 44 H392" marker-end="url(#ah-lc6)" />
            <path class="dg-line blue" d="M356 104 H392" marker-end="url(#ah-lc6)" />
            <path class="dg-line blue" d="M536 74 H572" marker-end="url(#ah-lc6)" />
          </svg>
          <figcaption>Figure 6 — Language-isolated pools keep a compile storm from delaying every other verdict in the contest.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why does the API only enqueue, never exec? (2) Work the contest sandbox arithmetic for 50k users at 0.5 submits/min. (3) How does a freeze interact with a Redis sorted set? (4) Give two ways hidden tests leak through “helpful” errors, and the filter rule that stops them.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Sandboxed judging, contest scaling and leaderboard mechanics are standard industry ideas; the explanations, diagrams, tables and exercises are our own.',
};
