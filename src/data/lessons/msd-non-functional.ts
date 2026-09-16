/** Modern System Design — Chapter 4: Non-Functional System Characteristics.
 *  Availability, reliability, scalability, maintainability, fault tolerance,
 *  and how to state them as requirements in an interview.
 */

export const msdNonFunctional = {
  slug: 'non-functional-characteristics',
  title: 'Non-Functional System Characteristics',
  subtitle:
    'Functional requirements say what a system does; non-functional ones say how well it must do it — and they are what actually decide the architecture. Availability, reliability, scalability, maintainability and fault tolerance, each defined precisely enough to measure.',
  byline: 'Modern System Design · Chapter 4 · ~2h read · Beginner',
  interviewTip:
    'Candidates lose points by treating these words as compliments rather than numbers. "It should be highly available" says nothing. "99.95% availability, which is about 22 minutes of downtime a month, and we accept that reads may be up to 5 seconds stale to get it" is a requirement you can design against and be judged on. Always convert an adjective into a number and a trade-off.',
  sections: [
    {
      id: 'availability',
      title: 'Availability',
      children: [
        { id: 'av-define', title: 'What availability actually measures' },
        { id: 'av-nines', title: 'The nines, in minutes you can feel' },
        { id: 'av-series', title: 'Why availability drops as you add components' },
        { id: 'av-improve', title: 'The four ways to raise it' },
      ],
      html: `
        <p>Before the individual characteristics, one framing that makes the whole chapter cohere. Functional requirements describe behaviour a user can name — "a user can upload a video". Non-functional requirements describe qualities of that behaviour — how fast, how reliably, for how many users, and how the system copes when parts of it break.</p>
        <p>Functional requirements decide what you build. Non-functional requirements decide <em>how</em> you build it. "Users can post messages" tells you almost nothing about architecture; "ten million users can post messages with 99.99% availability and sub-200ms latency worldwide" determines nearly every component you will need.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 208" role="img" aria-label="Functional requirements produce a feature list while non-functional requirements determine the architecture">
            <defs>
              <marker id="ah-nf" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="178" rx="11" />
            <text class="dg-h" x="26" y="36">FUNCTIONAL · WHAT IT DOES</text>
            <rect class="dg-box b" x="26" y="46" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="63" text-anchor="middle">“a user can upload a video”</text>
            <text class="dg-s" x="26" y="92">Gives you: endpoints, screens, data model,</text>
            <text class="dg-s" x="26" y="108">the feature list.</text>
            <text class="dg-s" x="26" y="132">Easy to agree on. Easy to test.</text>
            <text class="dg-s" x="26" y="156">Almost never the hard part, and almost</text>
            <text class="dg-s" x="26" y="170">never what an interview is really about.</text>

            <rect class="dg-band o" x="368" y="16" width="340" height="178" rx="11" />
            <text class="dg-h" x="382" y="36">NON-FUNCTIONAL · HOW WELL</text>
            <rect class="dg-box o" x="382" y="46" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="63" text-anchor="middle">“…for 10M users, 99.99% up, &lt;200ms”</text>
            <text class="dg-s" x="382" y="92">Gives you: replication, sharding, caching,</text>
            <text class="dg-s" x="382" y="108">CDN, queues, load balancers, monitoring.</text>
            <text class="dg-s" x="382" y="132">Hard to agree on. Harder to test.</text>
            <text class="dg-s" x="382" y="156">This is where the architecture comes from,</text>
            <text class="dg-s" x="382" y="170">and where interviews are won and lost.</text>
            <path class="dg-line violet" d="M356 105 H364" marker-end="url(#ah-nf)" />
          </svg>
          <figcaption>Figure 1 — The two kinds of requirement. The same feature list, given different non-functional targets, produces completely different systems.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="av-define">What availability actually measures</h3>
        <p><strong>Availability</strong> is the fraction of time a system is in a state where it can do its job. Expressed as a formula it is uptime divided by total time, but the interesting part is what you count as "up".</p>
        <pre><code>availability = uptime / (uptime + downtime)

              = MTBF / (MTBF + MTTR)

  MTBF = mean time between failures  (how often it breaks)
  MTTR = mean time to recovery       (how long to fix it)</code></pre>
        <p>That second form is the operationally useful one, because it shows there are two independent levers. You can raise availability by breaking less often, or by recovering faster. In practice <strong>MTTR is usually the cheaper lever</strong> — cutting recovery from 30 minutes to 3 through automated failover typically beats heroic efforts to prevent failure entirely.</p>
        <div class="lesson-callout"><strong>Define "up" before you measure it.</strong> A system returning HTTP 200 with an empty feed is technically responding and practically broken. Availability should be measured on successful, correct, timely responses to real user requests — which is why the monitoring chapters measure error rate and latency percentiles rather than process liveness.</div>

        <h3 class="lesson-subhead" id="av-nines">The nines, in minutes you can feel</h3>
        <p>Availability is quoted in "nines", and the jump between adjacent rows is a factor of ten in permitted downtime — and considerably more than a factor of ten in cost.</p>
        <table>
          <thead><tr><th>Availability</th><th>Downtime per year</th><th>Per month</th><th>Per week</th><th>What it takes</th></tr></thead>
          <tbody>
            <tr><td>99% ("two nines")</td><td>3.65 days</td><td>7.2 hours</td><td>1.7 hours</td><td>One server and some luck</td></tr>
            <tr><td>99.9% ("three nines")</td><td>8.76 hours</td><td>43 minutes</td><td>10 minutes</td><td>Redundancy, monitoring, on-call</td></tr>
            <tr><td>99.99% ("four nines")</td><td>52.6 minutes</td><td>4.3 minutes</td><td>1 minute</td><td>Automated failover, multi-AZ, no manual steps in recovery</td></tr>
            <tr><td>99.999% ("five nines")</td><td>5.26 minutes</td><td>26 seconds</td><td>6 seconds</td><td>Multi-region, no single points, extremely disciplined change management</td></tr>
          </tbody>
        </table>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Cost and complexity rising steeply with each additional nine of availability">
            <defs>
              <marker id="ah-9s" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">EACH NINE COSTS ROUGHLY AN ORDER OF MAGNITUDE MORE THAN THE LAST</text>
            <rect class="dg-box g" x="16" y="34" width="150" height="58" rx="7" />
            <text class="dg-t" x="91" y="54" text-anchor="middle">99%</text>
            <text class="dg-s" x="91" y="71" text-anchor="middle">3.65 days/year down</text>
            <text class="dg-s" x="91" y="85" text-anchor="middle">one box, restart it</text>
            <rect class="dg-box b" x="182" y="34" width="150" height="58" rx="7" />
            <text class="dg-t" x="257" y="54" text-anchor="middle">99.9%</text>
            <text class="dg-s" x="257" y="71" text-anchor="middle">43 min/month down</text>
            <text class="dg-s" x="257" y="85" text-anchor="middle">redundancy + on-call</text>
            <rect class="dg-box y" x="348" y="34" width="150" height="58" rx="7" />
            <text class="dg-t" x="423" y="54" text-anchor="middle">99.99%</text>
            <text class="dg-s" x="423" y="71" text-anchor="middle">4.3 min/month down</text>
            <text class="dg-s" x="423" y="85" text-anchor="middle">automated failover</text>
            <rect class="dg-box r" x="514" y="34" width="190" height="58" rx="7" />
            <text class="dg-t" x="609" y="54" text-anchor="middle">99.999%</text>
            <text class="dg-s" x="609" y="71" text-anchor="middle">26 sec/month down</text>
            <text class="dg-s" x="609" y="85" text-anchor="middle">multi-region, no manual steps</text>
            <path class="dg-line rose thick" d="M16 106 H700" marker-end="url(#ah-9s)" />
            <rect class="dg-band y" x="12" y="124" width="696" height="84" rx="10" />
            <text class="dg-h" x="26" y="144">THE QUESTION NOBODY ASKS AND EVERYONE SHOULD</text>
            <text class="dg-s" x="26" y="164">At four nines you get 4.3 minutes a month. A human being cannot reliably be paged, wake up, diagnose and fix anything</text>
            <text class="dg-s" x="26" y="180">in 4.3 minutes. So four nines is not a monitoring target — it is a statement that recovery must be automatic.</text>
            <text class="dg-s" x="26" y="200">That single realisation is what turns an availability number into an architecture, and it is what interviewers listen for.</text>
          </svg>
          <figcaption>Figure 2 — The nines and what they demand. Above three nines, humans leave the recovery path entirely.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="av-series">Why availability drops as you add components</h3>
        <p>This is the most under-appreciated arithmetic in system design. When a request must pass through several components in sequence, and any one of them failing fails the request, their availabilities <em>multiply</em>.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 262" role="img" aria-label="Availability multiplying in series and improving in parallel with redundancy">
            <defs>
              <marker id="ah-sp" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-sp2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">IN SERIES · AVAILABILITY MULTIPLIES (GETS WORSE)</text>
            <rect class="dg-box b" x="16" y="32" width="112" height="34" rx="6" />
            <text class="dg-s" x="72" y="53" text-anchor="middle">gateway 99.9%</text>
            <rect class="dg-box b" x="150" y="32" width="112" height="34" rx="6" />
            <text class="dg-s" x="206" y="53" text-anchor="middle">service 99.9%</text>
            <rect class="dg-box b" x="284" y="32" width="112" height="34" rx="6" />
            <text class="dg-s" x="340" y="53" text-anchor="middle">cache 99.9%</text>
            <rect class="dg-box b" x="418" y="32" width="112" height="34" rx="6" />
            <text class="dg-s" x="474" y="53" text-anchor="middle">database 99.9%</text>
            <rect class="dg-box r" x="560" y="32" width="144" height="34" rx="6" />
            <text class="dg-t" x="632" y="53" text-anchor="middle">total 99.6%</text>
            <path class="dg-line rose" d="M128 49 H146" marker-end="url(#ah-sp)" />
            <path class="dg-line rose" d="M262 49 H280" marker-end="url(#ah-sp)" />
            <path class="dg-line rose" d="M396 49 H414" marker-end="url(#ah-sp)" />
            <path class="dg-line rose" d="M530 49 H556" marker-end="url(#ah-sp)" />
            <text class="dg-s" x="16" y="86">0.999 × 0.999 × 0.999 × 0.999 = 0.996 → downtime went from 43 min/month to about 2.9 hours/month.</text>
            <text class="dg-s" x="16" y="102">Four “three nines” components in a chain produce a system that is worse than any of its parts.</text>

            <text class="dg-h" x="16" y="132">IN PARALLEL · REDUNDANCY COMPOUNDS THE OTHER WAY (GETS BETTER)</text>
            <rect class="dg-box g" x="16" y="142" width="150" height="30" rx="6" />
            <text class="dg-s" x="91" y="162" text-anchor="middle">replica 1 · 99%</text>
            <rect class="dg-box g" x="16" y="178" width="150" height="30" rx="6" />
            <text class="dg-s" x="91" y="198" text-anchor="middle">replica 2 · 99%</text>
            <rect class="dg-box g" x="16" y="214" width="150" height="30" rx="6" />
            <text class="dg-s" x="91" y="234" text-anchor="middle">replica 3 · 99%</text>
            <rect class="dg-box p" x="252" y="172" width="188" height="50" rx="8" />
            <text class="dg-t" x="346" y="192" text-anchor="middle">total 99.9999%</text>
            <text class="dg-s" x="346" y="210" text-anchor="middle">all three must fail at once</text>
            <path class="dg-line green" d="M166 157 H212 V190 H248" marker-end="url(#ah-sp2)" />
            <path class="dg-line green" d="M166 193 H212 V196 H248" marker-end="url(#ah-sp2)" />
            <path class="dg-line green" d="M166 229 H212 V202 H248" marker-end="url(#ah-sp2)" />
            <text class="dg-s" x="470" y="182">1 − (0.01)³ = 0.999999</text>
            <text class="dg-s" x="470" y="200">…but only if the failures are</text>
            <text class="dg-s" x="470" y="216">genuinely independent, which</text>
            <text class="dg-s" x="470" y="232">is the assumption that usually lies.</text>
          </svg>
          <figcaption>Figure 3 — Series versus parallel. Two consequences: shortening the critical path raises availability for free, and redundancy only helps to the extent failures are independent.</figcaption>
        </figure>
        <p>That last caveat deserves emphasis, because it is where real outages come from. Three replicas in the same rack share a power supply and a switch. Three replicas running the same buggy release share the bug. Three replicas in one availability zone share the zone. Independence is an assumption you must actively engineer, not a property you get by counting boxes.</p>

        <h3 class="lesson-subhead" id="av-improve">The four ways to raise it</h3>
        <ul class="lesson-layers">
          <li><strong>Eliminate single points of failure.</strong> Any component with exactly one instance sets a ceiling on the whole system. Find them by asking, for each box in your diagram, "what happens if this one dies?"</li>
          <li><strong>Shorten the critical path.</strong> Every component a request must traverse multiplies in. Making a dependency optional — degrade gracefully instead of failing — removes it from the multiplication entirely.</li>
          <li><strong>Recover automatically.</strong> Health checks, automatic failover, restarts, circuit breakers. This attacks MTTR, which is usually the cheaper lever.</li>
          <li><strong>Contain the damage.</strong> Bulkheads, cells, rate limits and load shedding keep one failure from consuming the capacity that everything else needs. A system that degrades to 90% of features for 5% of users is far more available than one that fails completely.</li>
        </ul>
      `,
    },
    {
      id: 'reliability',
      title: 'Reliability',
      children: [
        { id: 'rel-vs-av', title: 'Reliability is not availability' },
        { id: 'rel-measure', title: 'Measuring it: MTBF and failure rate' },
        { id: 'rel-slo', title: 'SLI, SLO, SLA and error budgets' },
      ],
      html: `
        <p><strong>Reliability</strong> is the probability that a system performs correctly for a given period. The key word is <em>correctly</em> — availability asks whether you got an answer, reliability asks whether the answer was right.</p>

        <h3 class="lesson-subhead" id="rel-vs-av">Reliability is not availability</h3>
        <p>These are routinely conflated, and the distinction matters because a system can be excellent at one and terrible at the other.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 218" role="img" aria-label="Four quadrants of availability versus reliability with an example system in each">
            <defs>
              <marker id="ah-ra" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">AVAILABLE = YOU GOT A RESPONSE · RELIABLE = IT WAS THE RIGHT ONE</text>
            <rect class="dg-box g" x="180" y="34" width="248" height="66" rx="8" />
            <text class="dg-t" x="304" y="54" text-anchor="middle">available + reliable</text>
            <text class="dg-s" x="304" y="72" text-anchor="middle">responds, and correctly</text>
            <text class="dg-s" x="304" y="88" text-anchor="middle">the goal</text>
            <rect class="dg-box r" x="444" y="34" width="260" height="66" rx="8" />
            <text class="dg-t" x="574" y="54" text-anchor="middle">available + unreliable</text>
            <text class="dg-s" x="574" y="72" text-anchor="middle">always answers, sometimes wrong</text>
            <text class="dg-s" x="574" y="88" text-anchor="middle">the dangerous quadrant</text>
            <rect class="dg-box y" x="180" y="110" width="248" height="66" rx="8" />
            <text class="dg-t" x="304" y="130" text-anchor="middle">unavailable + reliable</text>
            <text class="dg-s" x="304" y="148" text-anchor="middle">refuses rather than guess</text>
            <text class="dg-s" x="304" y="164" text-anchor="middle">correct choice for payments</text>
            <rect class="dg-box r" x="444" y="110" width="260" height="66" rx="8" />
            <text class="dg-t" x="574" y="130" text-anchor="middle">neither</text>
            <text class="dg-s" x="574" y="148" text-anchor="middle">down, and corrupts when up</text>
            <text class="dg-s" x="574" y="164" text-anchor="middle">an incident, not a design</text>
            <text class="dg-s" x="20" y="72">RELIABLE ↑</text>
            <text class="dg-s" x="20" y="148">UNRELIABLE ↓</text>
            <rect class="dg-band y" x="12" y="186" width="696" height="26" rx="8" />
            <text class="dg-s" x="26" y="203">The top-right quadrant is worse than being down: silent wrong answers propagate into other systems and get stored.</text>
          </svg>
          <figcaption>Figure 4 — The four quadrants. A payment system that declines when uncertain is behaving correctly; one that approves optimistically to stay "available" is not.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="rel-measure">Measuring it: MTBF and failure rate</h3>
        <p>Reliability is usually expressed as MTBF, or as a failure rate over a window. What matters more than the formula is choosing the unit that reflects user pain: for a request-serving system, the honest measure is the fraction of requests that succeeded, not the fraction of clock time the process was running.</p>
        <p>This distinction has teeth. A service that is completely down for 30 seconds during its peak hour may drop more requests than one down for two hours overnight, yet time-based availability rates the overnight outage as 240× worse. Request-based measurement matches what users experienced.</p>

        <h3 class="lesson-subhead" id="rel-slo">SLI, SLO, SLA and error budgets</h3>
        <p>Three acronyms that make these characteristics operational. They form a chain from measurement to promise.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 248" role="img" aria-label="The chain from service level indicator to objective to agreement, and how the error budget is derived">
            <defs>
              <marker id="ah-slo" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box c" x="16" y="32" width="200" height="62" rx="8" />
            <text class="dg-t" x="116" y="52" text-anchor="middle">SLI · indicator</text>
            <text class="dg-s" x="116" y="70" text-anchor="middle">what you measure</text>
            <text class="dg-s" x="116" y="86" text-anchor="middle">“% of requests &lt;300ms”</text>
            <rect class="dg-box b" x="256" y="32" width="200" height="62" rx="8" />
            <text class="dg-t" x="356" y="52" text-anchor="middle">SLO · objective</text>
            <text class="dg-s" x="356" y="70" text-anchor="middle">your internal target</text>
            <text class="dg-s" x="356" y="86" text-anchor="middle">“99.9% of them, monthly”</text>
            <rect class="dg-box p" x="496" y="32" width="208" height="62" rx="8" />
            <text class="dg-t" x="600" y="52" text-anchor="middle">SLA · agreement</text>
            <text class="dg-s" x="600" y="70" text-anchor="middle">the contractual promise</text>
            <text class="dg-s" x="600" y="86" text-anchor="middle">“99.5%, or we refund you”</text>
            <path class="dg-line cyan" d="M216 63 H252" marker-end="url(#ah-slo)" />
            <path class="dg-line cyan" d="M456 63 H492" marker-end="url(#ah-slo)" />
            <text class="dg-s" x="16" y="116">Always set the SLA looser than the SLO — you want to be paging yourselves before you are breaching a contract.</text>
            <rect class="dg-band g" x="12" y="132" width="696" height="108" rx="10" />
            <text class="dg-h" x="26" y="152">THE ERROR BUDGET · THE MOST USEFUL IDEA IN THIS SECTION</text>
            <text class="dg-s" x="26" y="174">A 99.9% monthly SLO permits 0.1% failure — about 43 minutes. That 43 minutes is a budget you are entitled to spend.</text>
            <text class="dg-s" x="26" y="194">Budget remaining → ship faster, take risks, run experiments. Budget exhausted → freeze features, spend on stability.</text>
            <text class="dg-s" x="26" y="216">This converts an endless argument between product and infrastructure into a number both sides can read off a dashboard,</text>
            <text class="dg-s" x="26" y="232">and it is why 100% is never the target: a system with no error budget can never safely ship a change.</text>
          </svg>
          <figcaption>Figure 5 — SLI to SLO to SLA, and the error budget that falls out. Mentioning error budgets in an interview signals operational maturity more than almost anything else.</figcaption>
        </figure>
      `,
    },
    {
      id: 'scalability',
      title: 'Scalability',
      children: [
        { id: 'sc-define', title: 'What scalability means precisely' },
        { id: 'sc-vertical', title: 'Vertical versus horizontal' },
        { id: 'sc-dimensions', title: 'The dimensions that grow independently' },
        { id: 'sc-limits', title: 'Why adding machines stops helping' },
      ],
      html: `
        <p><strong>Scalability</strong> is the ability to handle growing load by adding resources proportionally. The word "proportionally" is doing the work: a system where doubling traffic requires quadrupling servers is technically able to grow and is not scalable in any useful sense.</p>

        <h3 class="lesson-subhead" id="sc-define">What scalability means precisely</h3>
        <p>A useful test: plot cost against load. Linear is good, sub-linear is excellent, super-linear means you have a scalability problem regardless of how much hardware you can buy.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 226" role="img" aria-label="Three cost-versus-load curves showing sub-linear, linear and super-linear scaling">
            <defs>
              <marker id="ah-scl" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">COST PER UNIT OF LOAD, AS LOAD GROWS</text>
            <path class="dg-line violet" d="M60 180 H400" marker-end="url(#ah-scl)" />
            <path class="dg-line violet" d="M60 180 V40" marker-end="url(#ah-scl)" />
            <text class="dg-s" x="180" y="198">load →</text>
            <text class="dg-s" x="10" y="110">cost</text>
            <path class="dg-line green thick" d="M64 176 C140 150, 240 130, 380 120" />
            <text class="dg-s" x="250" y="112">sub-linear · caching, CDN, batching</text>
            <path class="dg-line blue thick" d="M64 176 L380 70" />
            <text class="dg-s" x="290" y="64">linear · the realistic target</text>
            <path class="dg-line rose thick" d="M64 176 C200 170, 300 120, 340 46" />
            <text class="dg-s" x="130" y="52">super-linear · coordination overhead,</text>
            <text class="dg-s" x="130" y="66">chatty services, contention</text>
            <rect class="dg-band g" x="440" y="34" width="268" height="80" rx="10" />
            <text class="dg-h" x="454" y="54">GOOD SIGNS</text>
            <text class="dg-s" x="454" y="74">· stateless services you can clone</text>
            <text class="dg-s" x="454" y="90">· work partitioned by key with no cross-talk</text>
            <text class="dg-s" x="454" y="106">· read load absorbed by caches and replicas</text>
            <rect class="dg-band r" x="440" y="126" width="268" height="88" rx="10" />
            <text class="dg-h" x="454" y="146">WARNING SIGNS</text>
            <text class="dg-s" x="454" y="166">· every node must talk to every other node</text>
            <text class="dg-s" x="454" y="182">· a shared lock, counter or hot row</text>
            <text class="dg-s" x="454" y="198">· one database that all writes funnel through</text>
            <text class="dg-s" x="454" y="212">· work that cannot be split by any key</text>
          </svg>
          <figcaption>Figure 6 — The three curves. Super-linear cost almost always traces back to coordination: something in the system requires all participants to agree.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-vertical">Vertical versus horizontal</h3>
        <table>
          <thead><tr><th></th><th>Vertical (scale up)</th><th>Horizontal (scale out)</th></tr></thead>
          <tbody>
            <tr><td><strong>Method</strong></td><td>Bigger machine — more CPU, RAM, faster disk</td><td>More machines working together</td></tr>
            <tr><td><strong>Complexity</strong></td><td>Low — often no code changes at all</td><td>High — distribution, coordination, partial failure</td></tr>
            <tr><td><strong>Ceiling</strong></td><td>Hard: the largest machine that exists</td><td>Practically none</td></tr>
            <tr><td><strong>Availability</strong></td><td>Still one machine — one failure domain</td><td>Redundancy comes free with the design</td></tr>
            <tr><td><strong>Cost curve</strong></td><td>Super-linear at the top end</td><td>Roughly linear with commodity hardware</td></tr>
            <tr><td><strong>Downtime to scale</strong></td><td>Usually a restart</td><td>None if the service is stateless</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Do not sneer at vertical scaling.</strong> The correct interview answer is usually "vertical first, horizontal when forced". A single large modern machine handles a genuinely enormous amount of traffic, and it does so without the distributed-systems complexity that every later chapter of this course exists to manage. Reach for horizontal scaling when you hit a real ceiling, need redundancy, or must place data near users — not by default.</div>

        <h3 class="lesson-subhead" id="sc-dimensions">The dimensions that grow independently</h3>
        <p>"Scale" is not one number. These grow at different rates and stress different components, and separating them is how you find the real bottleneck.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 214" role="img" aria-label="Six independent dimensions of scale and the component each one stresses first">
            <defs>
              <marker id="ah-dim" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">DIMENSION → WHAT IT BREAKS FIRST</text>
            <rect class="dg-box b" x="16" y="32" width="190" height="30" rx="6" />
            <text class="dg-s" x="111" y="52" text-anchor="middle">requests per second</text>
            <rect class="dg-box o" x="250" y="32" width="454" height="30" rx="6" />
            <text class="dg-s" x="264" y="52">app servers and connection pools · fix with more stateless replicas</text>
            <rect class="dg-box b" x="16" y="68" width="190" height="30" rx="6" />
            <text class="dg-s" x="111" y="88" text-anchor="middle">data volume</text>
            <rect class="dg-box o" x="250" y="68" width="454" height="30" rx="6" />
            <text class="dg-s" x="264" y="88">storage and index size · fix with partitioning, tiering, archival</text>
            <rect class="dg-box b" x="16" y="104" width="190" height="30" rx="6" />
            <text class="dg-s" x="111" y="124" text-anchor="middle">write throughput</text>
            <rect class="dg-box o" x="250" y="104" width="454" height="30" rx="6" />
            <text class="dg-s" x="264" y="124">the primary database · the hardest one · fix with sharding, queues, LSM stores</text>
            <rect class="dg-box b" x="16" y="140" width="190" height="30" rx="6" />
            <text class="dg-s" x="111" y="160" text-anchor="middle">concurrent connections</text>
            <rect class="dg-box o" x="250" y="140" width="454" height="30" rx="6" />
            <text class="dg-s" x="264" y="160">file descriptors and memory · fix with async I/O, gateways, sticky routing</text>
            <rect class="dg-box b" x="16" y="176" width="190" height="30" rx="6" />
            <text class="dg-s" x="111" y="196" text-anchor="middle">geographic spread</text>
            <rect class="dg-box o" x="250" y="176" width="454" height="30" rx="6" />
            <text class="dg-s" x="264" y="196">latency, unfixable by hardware · fix with CDN, regional replicas, edge</text>
            <path class="dg-line hot" d="M206 47 H246" marker-end="url(#ah-dim)" />
            <path class="dg-line hot" d="M206 83 H246" marker-end="url(#ah-dim)" />
            <path class="dg-line hot" d="M206 119 H246" marker-end="url(#ah-dim)" />
            <path class="dg-line hot" d="M206 155 H246" marker-end="url(#ah-dim)" />
            <path class="dg-line hot" d="M206 191 H246" marker-end="url(#ah-dim)" />
          </svg>
          <figcaption>Figure 7 — Five dimensions and their first casualties. Write throughput is the one with no easy answer, which is why so much of this course is about partitioning writes.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="sc-limits">Why adding machines stops helping</h3>
        <p>There is a ceiling on parallel speedup, and it is set by the fraction of work that cannot be parallelised. If 5% of a workload is inherently serial, then even with infinite machines you cannot go more than 20× faster — the serial 5% remains.</p>
        <pre><code>speedup ≤ 1 / serial_fraction

  1% serial  →  at most  100× faster, no matter the machine count
  5% serial  →  at most   20× faster
 10% serial  →  at most   10× faster</code></pre>
        <p>Worse, real distributed systems have a second effect: coordination cost <em>grows</em> with node count. Past a certain size, adding machines makes the system slower, because every new node adds communication, consensus and contention. The practical lesson is that scalability work is mostly about <strong>removing coordination</strong> — finding the shared lock, the hot key, the global counter, the single write path — rather than adding capacity.</p>
      `,
    },
    {
      id: 'maintainability',
      title: 'Maintainability',
      children: [
        { id: 'mn-three', title: 'Operability, simplicity, evolvability' },
        { id: 'mn-practice', title: 'What it looks like in practice' },
      ],
      html: `
        <p><strong>Maintainability</strong> is the characteristic engineers most often omit from an interview and most often regret in a job. A system spends a few weeks being built and years being operated, changed and debugged, which is where its real cost lives.</p>

        <h3 class="lesson-subhead" id="mn-three">Operability, simplicity, evolvability</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Three facets of maintainability: operability, simplicity and evolvability, with what each requires">
            <defs>
              <marker id="ah-mt" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="228" height="192" rx="11" />
            <text class="dg-h" x="26" y="36">OPERABILITY</text>
            <text class="dg-s" x="26" y="54">can we run it comfortably?</text>
            <text class="dg-s" x="26" y="80">· metrics, logs, traces</text>
            <text class="dg-s" x="26" y="98">· alerts on symptoms, not causes</text>
            <text class="dg-s" x="26" y="116">· runbooks for known failures</text>
            <text class="dg-s" x="26" y="134">· one-command deploy and rollback</text>
            <text class="dg-s" x="26" y="152">· no step that requires the one</text>
            <text class="dg-s" x="26" y="166">  engineer who knows the trick</text>
            <text class="dg-s" x="26" y="192">Test: can a new hire be on-call?</text>

            <rect class="dg-band g" x="252" y="16" width="228" height="192" rx="11" />
            <text class="dg-h" x="266" y="36">SIMPLICITY</text>
            <text class="dg-s" x="266" y="54">can it be understood?</text>
            <text class="dg-s" x="266" y="80">· few moving parts</text>
            <text class="dg-s" x="266" y="98">· boring, predictable choices</text>
            <text class="dg-s" x="266" y="116">· clear ownership per component</text>
            <text class="dg-s" x="266" y="134">· abstractions that hide the right</text>
            <text class="dg-s" x="266" y="148">  things and leak the rest honestly</text>
            <text class="dg-s" x="266" y="172">Test: can someone explain the</text>
            <text class="dg-s" x="266" y="186">whole system on a whiteboard</text>
            <text class="dg-s" x="266" y="200">in ten minutes?</text>

            <rect class="dg-band p" x="492" y="16" width="216" height="192" rx="11" />
            <text class="dg-h" x="506" y="36">EVOLVABILITY</text>
            <text class="dg-s" x="506" y="54">can it be changed safely?</text>
            <text class="dg-s" x="506" y="80">· loose coupling between services</text>
            <text class="dg-s" x="506" y="98">· versioned, backward-compatible</text>
            <text class="dg-s" x="506" y="112">  interfaces and schemas</text>
            <text class="dg-s" x="506" y="130">· tests that catch regressions</text>
            <text class="dg-s" x="506" y="148">· migrations that run online</text>
            <text class="dg-s" x="506" y="166">· feature flags to decouple</text>
            <text class="dg-s" x="506" y="180">  deploy from release</text>
            <text class="dg-s" x="506" y="202">Test: how long to ship one change?</text>
          </svg>
          <figcaption>Figure 8 — Three facets of maintainability, each with a concrete test. The tests matter more than the definitions.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="mn-practice">What it looks like in practice</h3>
        <p>Two habits pay for themselves repeatedly. First, prefer boring technology: a well-understood database you can debug at 3am beats an exciting one nobody on the team has operated. Second, make deploys and rollbacks routine and fast — a system you can roll back in 60 seconds lets you take risks that a system requiring a two-hour rollback never can, which means maintainability and delivery speed are the same property viewed from different angles.</p>
      `,
    },
    {
      id: 'fault-tolerance',
      title: 'Fault Tolerance',
      children: [
        { id: 'ft-define', title: 'Tolerance versus prevention' },
        { id: 'ft-techniques', title: 'The techniques, and when each applies' },
        { id: 'ft-degrade', title: 'Graceful degradation' },
      ],
      html: `
        <p><strong>Fault tolerance</strong> is the ability to keep operating correctly when components fail. Chapter 3 established that faults are inevitable at scale; fault tolerance is the discipline of preventing them from becoming user-visible failures.</p>

        <h3 class="lesson-subhead" id="ft-define">Tolerance versus prevention</h3>
        <p>Prevention tries to stop faults occurring — better hardware, more testing, stricter review. It is worth doing and it has a hard ceiling, because you cannot prevent a datacentre losing power or a disk failing on its ten-thousandth day. Tolerance assumes the fault will happen and asks what the system does next. Mature designs invest in both and weight tolerance more heavily.</p>

        <h3 class="lesson-subhead" id="ft-techniques">The techniques, and when each applies</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Seven fault tolerance techniques with what each protects against and its cost">
            <defs>
              <marker id="ah-ft" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">TECHNIQUE · PROTECTS AGAINST · WHAT IT COSTS</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="52">replication · a node or disk dying · storage cost, plus the consistency questions from Chapter 3</text>
            <rect class="dg-box b" x="16" y="68" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="88">retries with backoff · transient errors and blips · risk of amplifying an overload; must be capped and jittered</text>
            <rect class="dg-box c" x="16" y="104" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="124">circuit breakers · a sick dependency dragging you down · you fail fast, so callers must handle rejection</text>
            <rect class="dg-box y" x="16" y="140" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="160">timeouts and deadlines · unbounded waiting and thread exhaustion · picking the value, per Chapter 3's dilemma</text>
            <rect class="dg-box p" x="16" y="176" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="196">bulkheads and cells · one tenant or feature consuming everything · lower utilisation, more moving parts</text>
            <rect class="dg-box o" x="16" y="212" width="688" height="30" rx="6" />
            <text class="dg-s" x="30" y="232">load shedding · collapse under overload · some users are rejected deliberately, which needs care and priority rules</text>
            <text class="dg-s" x="16" y="258">Note how many of these deliberately make things worse in the small to avoid catastrophe in the large — that is the trade.</text>
          </svg>
          <figcaption>Figure 9 — The toolkit. Retries are the one most often applied carelessly: naive retries turn a small overload into an outage by multiplying the load exactly when the system is weakest.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>The retry rule.</strong> Retries need exponential backoff, jitter, a hard attempt cap, and ideally a token-bucket budget so the total retry traffic can never exceed a small fraction of normal load. And they must only be applied to idempotent operations, for the reason Chapter 3 established: you cannot tell whether the first attempt already succeeded.</div>

        <h3 class="lesson-subhead" id="ft-degrade">Graceful degradation</h3>
        <p>The most valuable fault tolerance pattern is also the cheapest: decide in advance what to drop. A system with a ranked list of what matters can shed the bottom of that list and keep serving the top.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Degradation ladder showing which features are dropped as failure severity increases">
            <defs>
              <marker id="ah-dg" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">AS PRESSURE RISES, SHED FROM THE BOTTOM — NEVER COLLAPSE ALL AT ONCE</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="28" rx="6" />
            <text class="dg-s" x="30" y="51">healthy · personalised ranking, recommendations, live counts, rich media, analytics</text>
            <rect class="dg-box b" x="16" y="66" width="688" height="28" rx="6" />
            <text class="dg-s" x="30" y="85">mild · drop personalisation, serve a generic ranked feed · drop live counters, show cached approximations</text>
            <rect class="dg-box y" x="16" y="100" width="688" height="28" rx="6" />
            <text class="dg-s" x="30" y="119">moderate · serve entirely from cache, accept staleness · disable non-essential writes and background jobs</text>
            <rect class="dg-box o" x="16" y="134" width="688" height="28" rx="6" />
            <text class="dg-s" x="30" y="153">severe · read-only mode · queue writes for later · static fallback content</text>
            <rect class="dg-box r" x="16" y="168" width="688" height="28" rx="6" />
            <text class="dg-s" x="30" y="187">critical · protect the core transaction path only, reject everything else with a clear message</text>
            <path class="dg-line rose" d="M8 32 V196" marker-end="url(#ah-dg)" />
          </svg>
          <figcaption>Figure 10 — A degradation ladder. Writing this ladder for your own system before an incident is one of the highest-leverage design exercises there is, and stating it in an interview is unusual enough to be memorable.</figcaption>
        </figure>
      `,
    },
    {
      id: 'nfr-interview',
      title: 'Non-Functional Requirements for System Design Interviews',
      children: [
        { id: 'ni-state', title: 'How to state them in the first five minutes' },
        { id: 'ni-drive', title: 'How each requirement drives a component' },
        { id: 'ni-checklist', title: 'The checklist and self-check' },
      ],
      html: `
        <h3 class="lesson-subhead" id="ni-state">How to state them in the first five minutes</h3>
        <p>Every characteristic in this chapter is only useful if you can state it as a number and a trade-off. Vague adjectives are the single most common weakness in system design interviews.</p>
        <table>
          <thead><tr><th>Weak (what most candidates say)</th><th>Strong (what to say instead)</th></tr></thead>
          <tbody>
            <tr><td>"It should be highly available"</td><td>"99.95% for reads, 99.9% for writes — reads matter more here, and I'll accept stale reads to get it"</td></tr>
            <tr><td>"It should be fast"</td><td>"p99 under 300ms for the feed; p50 is not the number users complain about"</td></tr>
            <tr><td>"It should scale"</td><td>"10M daily actives, ~5k writes/sec peak, 50:1 read:write — so reads get caches and replicas, writes get sharded"</td></tr>
            <tr><td>"We need consistency"</td><td>"Linearizable for balances; eventual with read-your-writes for the feed"</td></tr>
            <tr><td>"It should be reliable"</td><td>"Zero tolerance for lost writes, so writes are durably queued before we acknowledge"</td></tr>
            <tr><td>"It should be secure"</td><td>"TLS in transit, encryption at rest, per-user rate limits, and no PII in logs"</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="ni-drive">How each requirement drives a component</h3>
        <p>This is the connective tissue of the whole course. Each non-functional requirement points at specific building blocks, which is why the chapters ahead are ordered the way they are.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 248" role="img" aria-label="Mapping from each non-functional requirement to the building blocks it forces into the design">
            <defs>
              <marker id="ah-map" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">REQUIREMENT → THE BLOCKS IT FORCES INTO YOUR DIAGRAM</text>
            <rect class="dg-box b" x="16" y="32" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="52" text-anchor="middle">high availability</text>
            <rect class="dg-box p" x="236" y="32" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="52">replication · load balancers · multi-AZ · health checks · automated failover</text>
            <rect class="dg-box b" x="16" y="68" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="88" text-anchor="middle">low latency</text>
            <rect class="dg-box p" x="236" y="68" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="88">caching · CDN · regional replicas · precomputation · fewer sequential hops</text>
            <rect class="dg-box b" x="16" y="104" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="124" text-anchor="middle">high write throughput</text>
            <rect class="dg-box p" x="236" y="104" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="124">partitioning/sharding · message queues · LSM-tree stores · batching</text>
            <rect class="dg-box b" x="16" y="140" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="160" text-anchor="middle">huge data volume</text>
            <rect class="dg-box p" x="236" y="140" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="160">blob store · partitioning · tiered storage · retention and archival policy</text>
            <rect class="dg-box b" x="16" y="176" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="196" text-anchor="middle">abuse resistance</text>
            <rect class="dg-box p" x="236" y="176" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="196">rate limiter · authentication · quotas · anomaly detection</text>
            <rect class="dg-box b" x="16" y="212" width="176" height="30" rx="6" />
            <text class="dg-s" x="104" y="232" text-anchor="middle">operability</text>
            <rect class="dg-box p" x="236" y="212" width="468" height="30" rx="6" />
            <text class="dg-s" x="250" y="232">distributed monitoring · logging · tracing · alerting on symptoms</text>
            <path class="dg-line violet" d="M192 47 H232" marker-end="url(#ah-map)" />
            <path class="dg-line violet" d="M192 83 H232" marker-end="url(#ah-map)" />
            <path class="dg-line violet" d="M192 119 H232" marker-end="url(#ah-map)" />
            <path class="dg-line violet" d="M192 155 H232" marker-end="url(#ah-map)" />
            <path class="dg-line violet" d="M192 191 H232" marker-end="url(#ah-map)" />
            <path class="dg-line violet" d="M192 227 H232" marker-end="url(#ah-map)" />
          </svg>
          <figcaption>Figure 11 — The mapping that turns requirements into architecture. Every row on the right is a chapter in the building blocks section that follows.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="ni-checklist">The checklist and self-check</h3>
        <p>Run through this in the requirements phase of any design interview. Six lines, thirty seconds, and it prevents the most common omissions.</p>
        <ol class="lesson-checklist">
          <li><strong>Availability target</strong> — a number of nines, stated separately for reads and writes if they differ.</li>
          <li><strong>Latency target</strong> — a percentile, not an average. p95 or p99.</li>
          <li><strong>Scale</strong> — users, requests per second at peak, read:write ratio, data volume and growth.</li>
          <li><strong>Consistency</strong> — per data type, not for the whole system.</li>
          <li><strong>Durability</strong> — is losing a write acceptable, and for which data?</li>
          <li><strong>Security and privacy</strong> — authentication, encryption, rate limits, what must never appear in logs.</li>
        </ol>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Test yourself on four things. Why does a chain of four "three nines" services deliver worse than three nines? Why is 100% availability the wrong target, and what does an error budget buy you? What is the difference between availability and reliability, and which quadrant is most dangerous? Why is removing coordination more effective than adding machines? If those land, Chapter 5 will teach you to put numbers on all of it.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. This chapter covers the standard non-functional system characteristics — availability, reliability, scalability, maintainability and fault tolerance — as documented across the site reliability and distributed systems literature. All definitions in our own words, with original diagrams, tables, worked numbers and exercises.',
};
