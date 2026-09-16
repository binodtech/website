/** Modern System Design — Chapter 8: Load Balancers.
 *  L4 versus L7, algorithms, health checks, connection draining, VIP and
 *  anycast, the balancer as SPOF, consistent hashing for stickiness.
 */

export const msdLoadBalancers = {
  slug: 'load-balancers',
  title: 'Load Balancers',
  subtitle:
    'A load balancer is how many servers look like one. It spreads work, hides dead instances, terminates TLS, and is the component that, if you get it wrong, becomes a more dangerous single point of failure than the server it replaced.',
  byline: 'Modern System Design · Chapter 8 · ~1h 30m read · Beginner',
  interviewTip:
    'Two marks that land. First, say whether you need layer 4 or layer 7 and why — "L4 is enough if every instance can handle every request; L7 if I need to route /video to one fleet and /api to another, or to terminate TLS and inspect cookies." Second, answer "what happens when the load balancer dies" before you are asked: a pair with a floating VIP, or anycast, or DNS to several balancers. Name consistent hashing if you need stickiness without pinning a NAT of a thousand users onto one box.',
  sections: [
    {
      id: 'intro',
      title: 'Introduction to Load Balancers',
      children: [
        { id: 'lb-problem', title: 'The problem a balancer exists to solve' },
        { id: 'lb-does', title: 'What it actually does' },
        { id: 'lb-l4l7', title: 'Layer 4 versus layer 7' },
        { id: 'lb-algo', title: 'Algorithms, and when each one lies' },
        { id: 'lb-req', title: 'Requirements and a rough sizing' },
      ],
      html: `
        <p>One server has a ceiling. <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a> also said that one server is a single point of failure, so even if it were fast enough you would still want two. The moment you have two, something has to decide which one gets the next request. That something is a load balancer.</p>

        <h3 class="lesson-subhead" id="lb-problem">The problem a balancer exists to solve</h3>
        <p>Without one, clients must know the addresses of every instance, implement their own retry and failover, and be updated whenever the fleet changes. That is client-side load balancing, which is a real technique — but it pushes fleet membership into every caller. A balancer inverts this: callers know one name, and the fleet can grow, shrink and die behind it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Clients talking to many servers directly versus through a load balancer">
            <defs>
              <marker id="ah-lb1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="172" rx="11" />
            <text class="dg-h" x="26" y="36">WITHOUT A BALANCER</text>
            <rect class="dg-box r" x="26" y="48" width="70" height="28" rx="6" />
            <text class="dg-s" x="61" y="66" text-anchor="middle">client</text>
            <rect class="dg-box" x="130" y="44" width="70" height="22" rx="5" />
            <text class="dg-s" x="165" y="59" text-anchor="middle">server A</text>
            <rect class="dg-box" x="130" y="72" width="70" height="22" rx="5" />
            <text class="dg-s" x="165" y="87" text-anchor="middle">server B</text>
            <rect class="dg-box r" x="130" y="100" width="70" height="22" rx="5" />
            <text class="dg-s" x="165" y="115" text-anchor="middle">C dead</text>
            <text class="dg-s" x="26" y="148">Every client knows every address.</text>
            <text class="dg-s" x="26" y="164">A dead server is every client's problem.</text>
            <text class="dg-s" x="26" y="180">Adding a server means updating clients.</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="172" rx="11" />
            <text class="dg-h" x="382" y="36">WITH A BALANCER</text>
            <rect class="dg-box g" x="382" y="48" width="70" height="28" rx="6" />
            <text class="dg-s" x="417" y="66" text-anchor="middle">client</text>
            <rect class="dg-box b" x="470" y="48" width="90" height="28" rx="6" />
            <text class="dg-s" x="515" y="66" text-anchor="middle">load balancer</text>
            <rect class="dg-box" x="580" y="36" width="70" height="22" rx="5" />
            <text class="dg-s" x="615" y="51" text-anchor="middle">server A</text>
            <rect class="dg-box" x="580" y="62" width="70" height="22" rx="5" />
            <text class="dg-s" x="615" y="77" text-anchor="middle">server B</text>
            <rect class="dg-box r" x="580" y="88" width="70" height="22" rx="5" />
            <text class="dg-s" x="615" y="103" text-anchor="middle">C removed</text>
            <text class="dg-s" x="382" y="148">Clients know one name.</text>
            <text class="dg-s" x="382" y="164">Dead servers are the balancer's problem.</text>
            <text class="dg-s" x="382" y="180">The fleet can change invisibly.</text>
            <path class="dg-line green" d="M452 62 H466" marker-end="url(#ah-lb1)" />
          </svg>
          <figcaption>Figure 1 — Indirection. Callers hold a stable name; the set behind it moves.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-does">What it actually does</h3>
        <ul class="lesson-layers">
          <li><strong>Health checking.</strong> Remove instances that fail a probe, put them back when they recover.</li>
          <li><strong>TLS termination.</strong> Decrypt at the edge so origin servers see plain HTTP (or re-encrypt).</li>
          <li><strong>Connection multiplexing.</strong> Many client connections collapsed onto fewer origin connections.</li>
          <li><strong>Request routing.</strong> At layer 7: by path, host, header, cookie.</li>
          <li><strong>Sticky sessions.</strong> Pin a client to one instance when the instance still holds state.</li>
          <li><strong>Protection.</strong> Rate limits, max connections, load shedding — the first place you can say no.</li>
        </ul>

        <h3 class="lesson-subhead" id="lb-l4l7">Layer 4 versus layer 7</h3>
        <table>
          <thead><tr><th></th><th>Layer 4 (transport)</th><th>Layer 7 (application)</th></tr></thead>
          <tbody>
            <tr><td><strong>Sees</strong></td><td>IP + port, TCP/UDP 5-tuple</td><td>HTTP method, path, headers, cookies</td></tr>
            <tr><td><strong>Routing</strong></td><td>Per connection; all bytes to one backend</td><td>Per request; two requests can split</td></tr>
            <tr><td><strong>TLS</strong></td><td>Usually passthrough</td><td>Usually terminates so it can inspect</td></tr>
            <tr><td><strong>Cost</strong></td><td>Cheap, enormous throughput</td><td>More CPU (crypto + parsing)</td></tr>
            <tr><td><strong>Use when</strong></td><td>Homogeneous fleet, raw TCP, many DBs</td><td>Path routing, cookies, WAF, HTTP retries</td></tr>
          </tbody>
        </table>
        <p>A common production shape is both: an L4 balancer (or anycast) in front of a fleet of L7 proxies. The L4 layer is dumb and fast and highly available; the L7 layer is where the policy lives. Cloud analogues: NLB in front of ALB, or anycast in front of Envoy.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="L4 then L7 then backends">
            <defs>
              <marker id="ah-lb2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="78" text-anchor="middle">client</text>
            <rect class="dg-box o" x="156" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="226" y="70" text-anchor="middle">L4 / anycast</text>
            <text class="dg-s" x="226" y="86" text-anchor="middle">5-tuple</text>
            <rect class="dg-box b" x="336" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="406" y="70" text-anchor="middle">L7 proxy</text>
            <text class="dg-s" x="406" y="86" text-anchor="middle">path, TLS</text>
            <rect class="dg-box g" x="516" y="52" width="188" height="44" rx="7" />
            <text class="dg-s" x="610" y="78" text-anchor="middle">app fleet</text>
            <path class="dg-line violet" d="M116 74 H152" marker-end="url(#ah-lb2)" />
            <path class="dg-line violet" d="M296 74 H332" marker-end="url(#ah-lb2)" />
            <path class="dg-line violet" d="M476 74 H512" marker-end="url(#ah-lb2)" />
          </svg>
          <figcaption>Figure 2 — Dumb, fast L4 in front of policy-heavy L7. One box trying to be both is how you get neither.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-algo">Algorithms, and when each one lies</h3>
        <table>
          <thead><tr><th>Algorithm</th><th>Rule</th><th>Lies when</th></tr></thead>
          <tbody>
            <tr><td>Round robin</td><td>Next instance in the list</td><td>Unequal cost; one box eats three slow queries</td></tr>
            <tr><td>Weighted RR</td><td>Bigger instances get more</td><td>Weights go stale when a box degrades</td></tr>
            <tr><td>Least connections</td><td>Fewest in-flight</td><td>Idle keep-alives and websockets look "busy"</td></tr>
            <tr><td>Least response time</td><td>Currently fastest</td><td>Stampede onto whoever just got fast</td></tr>
            <tr><td>IP / cookie hash</td><td>Same client → same instance</td><td>One NAT IP is many users; sticky hot spots</td></tr>
            <tr><td>Consistent hashing</td><td>Key onto a ring</td><td>Right for caches; needs virtual nodes</td></tr>
            <tr><td>Power of two choices</td><td>Pick two, take the less loaded</td><td>Quietly excellent default; cheap</td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Power of two choices is the algorithm to name in an interview.</strong> Randomly picking two instances and sending the request to the less loaded of those two gets you close to globally-least-loaded with no central coordination and no thundering herd onto whichever instance currently looks best.</div>

        <h3 class="lesson-subhead" id="lb-req">Requirements and a rough sizing</h3>
        <p>A balancer tier should be more available than what it fronts, cheap in added latency (a few milliseconds), and able to fail open or closed on purpose. Sizing: a software L7 proxy on a modern machine handles tens to hundreds of thousands of HTTP requests per second, often limited by TLS and by backend latency rather than by the proxy. Three instances, each able to take the full peak, is a reasonable starting HA shape — N+2 so you can lose one and still take a rolling deploy.</p>
        <pre><code>ESTIMATE
  50k HTTP req/s peak, TLS at the L7 fleet
  one Envoy ~ 20-80k req/s depending on filters
  start with 4 L7 + 2 L4 (VIP/anycast)
  health check: 1/s * 200 backends * 4 L7 = 800 probes/s — cheap
  drain: 30 s * in-flight ~ few thousand conns per box</code></pre>
      `,
    },
    {
      id: 'global-local',
      title: 'Global and Local Load Balancing',
      children: [
        { id: 'lb-layers', title: 'Two layers, two jobs' },
        { id: 'lb-gslb', title: 'VIP, anycast and DNS' },
        { id: 'lb-local', title: 'Local: health checks and connection draining' },
        { id: 'lb-failover', title: 'Failover between regions is not DNS' },
      ],
      html: `
        <h3 class="lesson-subhead" id="lb-layers">Two layers, two jobs</h3>
        <p>Mixing these up is a common interview muddle. Global load balancing decides <em>which datacentre or region</em> a user should hit. Local load balancing decides <em>which instance inside that region</em>. They use different mechanisms and have different failover times.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="Global load balancing selecting a region then local load balancing selecting an instance">
            <defs>
              <marker id="ah-lb3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="36" width="90" height="40" rx="7" />
            <text class="dg-s" x="61" y="54" text-anchor="middle">user in</text>
            <text class="dg-s" x="61" y="68" text-anchor="middle">Mumbai</text>
            <rect class="dg-box y" x="130" y="36" width="130" height="40" rx="7" />
            <text class="dg-t" x="195" y="54" text-anchor="middle">GLOBAL LB</text>
            <text class="dg-s" x="195" y="68" text-anchor="middle">which region?</text>
            <rect class="dg-box b" x="290" y="20" width="120" height="32" rx="6" />
            <text class="dg-s" x="350" y="40" text-anchor="middle">region: Mumbai</text>
            <rect class="dg-box" x="290" y="60" width="120" height="32" rx="6" />
            <text class="dg-s" x="350" y="80" text-anchor="middle">region: Frankfurt</text>
            <rect class="dg-box c" x="440" y="20" width="120" height="32" rx="6" />
            <text class="dg-t" x="500" y="40" text-anchor="middle">LOCAL LB</text>
            <rect class="dg-box" x="590" y="8" width="110" height="24" rx="5" />
            <text class="dg-s" x="645" y="24" text-anchor="middle">instance 1</text>
            <rect class="dg-box" x="590" y="36" width="110" height="24" rx="5" />
            <text class="dg-s" x="645" y="52" text-anchor="middle">instance 2</text>
            <rect class="dg-box r" x="590" y="64" width="110" height="24" rx="5" />
            <text class="dg-s" x="645" y="80" text-anchor="middle">instance 3 down</text>
            <path class="dg-line violet" d="M106 56 H126" marker-end="url(#ah-lb3)" />
            <path class="dg-line violet" d="M260 50 H286" marker-end="url(#ah-lb3)" />
            <path class="dg-line violet" d="M410 36 H436" marker-end="url(#ah-lb3)" />
            <path class="dg-line violet" d="M560 36 H586" marker-end="url(#ah-lb3)" />
            <rect class="dg-band b" x="12" y="112" width="696" height="82" rx="10" />
            <text class="dg-s" x="26" y="132">Global: GeoDNS, latency DNS, anycast BGP. Failover: seconds to minutes (DNS) or seconds (anycast).</text>
            <text class="dg-s" x="26" y="148">Local: L4/L7, health checks, draining. Failover: seconds, sometimes sub-second.</text>
            <text class="dg-s" x="26" y="164">A regional outage needs global. A dead instance needs local. DNS to yank one box is the wrong layer.</text>
            <text class="dg-s" x="26" y="180">Chapter 7 already told you DNS failover is slow.</text>
          </svg>
          <figcaption>Figure 3 — Global then local. Each layer has a job the other cannot do well.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-gslb">VIP, anycast and DNS</h3>
        <p><strong>Floating VIP</strong> (VRRP/keepalived): two balancers, one owns the virtual IP, the other takes it on failure. Failover in a second or two; connections to the old box blip. This is how you stop the balancer being a single box in a rack.</p>
        <p><strong>Anycast:</strong> the same IP is advertised from many locations via BGP. The internet's routing sends the user to a nearby advertisement. Failover is "withdraw the route", faster than DNS, one IP for certificates. You get what BGP gives you, and debugging is harder.</p>
        <p><strong>GeoDNS:</strong> the nameserver returns a nearby region's IP. Simple, widely used, slow to fail over because of TTLs — everything <a href="/learn/modern-system-design/dns">Chapter 7</a> said. Fine as a third layer, not as the only HA story for the balancer itself.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Active-passive VIP pair versus anycast advertisements">
            <defs>
              <marker id="ah-lb4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="64" text-anchor="middle">VIP pair</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">one owner, one standby</text>
            <rect class="dg-box g" x="256" y="40" width="220" height="56" rx="7" />
            <text class="dg-s" x="366" y="64" text-anchor="middle">anycast</text>
            <text class="dg-s" x="366" y="80" text-anchor="middle">same IP, many POPs</text>
            <rect class="dg-box y" x="496" y="40" width="208" height="56" rx="7" />
            <text class="dg-s" x="600" y="64" text-anchor="middle">DNS A records</text>
            <text class="dg-s" x="600" y="80" text-anchor="middle">slow failover</text>
            <path class="dg-line hot" d="M236 68 H252" marker-end="url(#ah-lb4)" />
            <path class="dg-line hot" d="M476 68 H492" marker-end="url(#ah-lb4)" />
          </svg>
          <figcaption>Figure 4 — VIP for a pair in a region. Anycast for many edges. DNS as a slow extra, not the fence.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-local">Local: health checks and connection draining</h3>
        <p>A health check that hits <code>/health</code> and gets a hardcoded 200 is a liveness probe, not a readiness probe. It will keep a box in rotation that cannot reach its database. Deep checks exercise the real dependency path; they are slower and can themselves become a load problem, so run them less often and cache the result briefly. Combine with passive health: if a backend produces a burst of 5xx or timeouts, take it out immediately without waiting for the next active probe.</p>
        <p>Connection draining: stop sending <em>new</em> requests, wait for in-flight to finish (or hit a deadline), then kill the process. Deploys without drain drop checkouts. The balancer must honour a "going away" signal from the instance (or from the orchestrator) — that is local failover done politely, not DNS theatre.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="New requests stop, in-flight drain, then instance exits">
            <defs>
              <marker id="ah-lb5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="44" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="72" text-anchor="middle">in rotation</text>
            <rect class="dg-box o" x="216" y="44" width="200" height="48" rx="7" />
            <text class="dg-s" x="316" y="64" text-anchor="middle">drain</text>
            <text class="dg-s" x="316" y="80" text-anchor="middle">no new, wait old</text>
            <rect class="dg-box r" x="456" y="44" width="248" height="48" rx="7" />
            <text class="dg-s" x="580" y="72" text-anchor="middle">deregister and exit</text>
            <path class="dg-line green" d="M176 68 H212" marker-end="url(#ah-lb5)" />
            <path class="dg-line green" d="M416 68 H452" marker-end="url(#ah-lb5)" />
          </svg>
          <figcaption>Figure 5 — Drain is how deploys stop being user-visible outages. Health checks decide who enters; drain decides who leaves.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-failover">Failover between regions is not DNS</h3>
        <p>If your RTO is "users should fail over in five seconds", DNS is not the mechanism (TTLs, stubborn resolvers). Options that actually meet that number: health-checked anycast, an active-active data plane where both regions are already receiving traffic, or a client that retries a second endpoint. DNS remains a perfectly good mechanism for "fail over in five minutes" and for shifting traffic during a planned drain.</p>
      `,
    },
    {
      id: 'advanced',
      title: 'Advanced Details of Load Balancers',
      children: [
        { id: 'lb-spof', title: 'The balancer as a single point of failure' },
        { id: 'lb-sticky', title: 'Consistent hashing for stickiness' },
        { id: 'lb-tls', title: 'TLS: terminate, pass through, or re-encrypt' },
        { id: 'lb-client', title: 'Client-side balancing and the service mesh' },
        { id: 'lb-shed', title: 'Load shedding: the balancer must be able to say no' },
        { id: 'lb-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="lb-spof">The balancer as a single point of failure</h3>
        <p>A single balancer in front of a 50-instance fleet has made availability worse, not better. The fleet's five nines sit behind a box with a power supply. Standard patterns: active-passive VIP pair; active-active with ECMP (a lost balancer still drops the connections it held); DNS to several balancer IPs as a third layer. Count the balancer in the availability budget the way Chapter 4 taught you — serial components multiply downtime.</p>
        <p>Capacity-wise the balancer is also a choke: TLS CPU, connection tables, bandwidth. Size it to take a peer failure plus a deploy, not "just enough for yesterday's peak."</p>

        <h3 class="lesson-subhead" id="lb-sticky">Consistent hashing for stickiness</h3>
        <p>Sticky sessions pin a user to one instance because that instance holds their session in memory. Cookie affinity works until that instance dies, until you want to deploy it, and until one NAT IP is so heavy it pins a hot instance. IP hash has the same NAT problem.</p>
        <p>Consistent hashing (<a href="/learn/modern-system-design/key-value-store">Chapter 10</a>) maps a session key onto a ring of instances with virtual nodes. When a node leaves, only its slice moves — not the whole mapping, as modulo-N would. That is the right stickiness for caches and for "same user, same socket server" when you have not yet externalised state. It is still a crutch: the right fix is a shared session store or a signed cookie, then a stateless balancer with power-of-two-choices.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Modulo mapping reshuffles all keys versus consistent hash moving a slice">
            <defs>
              <marker id="ah-lb6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="118" rx="10" />
            <text class="dg-h" x="26" y="36">MODULO N</text>
            <text class="dg-s" x="26" y="58">add a backend, N becomes N+1</text>
            <text class="dg-s" x="26" y="76">almost every session remaps</text>
            <text class="dg-s" x="26" y="94">cache and sticky both break</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="118" rx="10" />
            <text class="dg-h" x="382" y="36">CONSISTENT HASH</text>
            <text class="dg-s" x="382" y="58">ring plus virtual nodes</text>
            <text class="dg-s" x="382" y="76">only a slice remaps</text>
            <text class="dg-s" x="382" y="94">the rest keep their instance</text>
          </svg>
          <figcaption>Figure 6 — Stickiness that survives a deploy uses a ring, not <code>hash % n</code>. Better still: no stickiness.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-tls">TLS: terminate, pass through, or re-encrypt</h3>
        <table>
          <thead><tr><th>Mode</th><th>Who decrypts</th><th>Trade-off</th></tr></thead>
          <tbody>
            <tr><td>Terminate at balancer</td><td>Balancer; backend sees HTTP</td><td>L7 routing works; interior plaintext unless segmented</td></tr>
            <tr><td>Passthrough</td><td>Backend</td><td>End-to-end crypto, no L7 routing, balancer is L4</td></tr>
            <tr><td>Re-encrypt</td><td>Both hops</td><td>L7 plus encryption twice; usual compliance default</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="lb-client">Client-side balancing and the service mesh</h3>
        <p>Once every service is a client of every other service, a central balancer pair becomes a hop and a scaling limit. Client-side balancing — each caller has the member list and picks (often with power-of-two-choices, retries and hedged requests) — removes the hop. A service mesh (Envoy sidecar, or a library like gRPC's resolver) is this idea standardised. The cost is operational complexity. Use it when you have many services; do not use it to front a three-instance website.</p>

        <h3 class="lesson-subhead" id="lb-shed">Load shedding: the balancer must be able to say no</h3>
        <p>A balancer that queues unbounded work when backends are saturated becomes a latency amplifier. The correct behaviour under overload is to refuse — 503 with Retry-After — and to refuse the cheap, sheddable traffic first (Chapter 4's degradation ladder). Queueing is a tool with a very short useful length.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Unbounded queue versus shedding with 503">
            <defs>
              <marker id="ah-lb7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="40" width="320" height="56" rx="7" />
            <text class="dg-s" x="176" y="64" text-anchor="middle">unbounded queue</text>
            <text class="dg-s" x="176" y="80" text-anchor="middle">everyone waits, nobody wins</text>
            <rect class="dg-box g" x="368" y="40" width="336" height="56" rx="7" />
            <text class="dg-s" x="536" y="64" text-anchor="middle">shed 503 Retry-After</text>
            <text class="dg-s" x="536" y="80" text-anchor="middle">keep checkout, drop browse</text>
            <path class="dg-line rose dash" d="M336 68 H364" marker-end="url(#ah-lb7)" />
          </svg>
          <figcaption>Figure 7 — Saying no is a feature. An endless queue is a slower outage.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="lb-eval">Evaluation</h3>
        <p>A balancer does not make a slow service fast, does not fix a hot shard, and does not replace backpressure. It also adds a hop, a certificate, a health-check configuration, and a failover story of its own. The failure modes to name: the balancer as SPOF (VIP/anycast), health checks that lie, sticky sessions that pin load, modulo hashing that reshuffles on every scale event, and retry-amplification when the balancer retries a failing backend on behalf of every client at once.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) When is layer 7 worth the CPU and when is layer 4 enough? (2) Why is power-of-two-choices often a better default than least-connections? (3) How do VIP and anycast stop the balancer being a SPOF? (4) Why is consistent hashing the right stickiness primitive, and why should you still plan to delete stickiness?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Load balancing is a standard industry building block; all explanations, algorithm comparisons, diagrams and exercises are our own.',
};
