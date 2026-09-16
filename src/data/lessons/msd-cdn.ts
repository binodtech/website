/** Modern System Design — Chapter 11: Content Delivery Network (CDN).
 *  Why distance is the constraint, how a distributed cache tier in front of an
 *  origin fixes it, and everything that tier gets wrong.
 */

export const msdCdn = {
  slug: 'cdn',
  title: 'Content Delivery Network (CDN)',
  subtitle:
    'A CDN is a geographically distributed reverse-proxy cache tier that sits between users and your origin. It exists because the speed of light is finite and origin bandwidth is expensive, and it is the one building block that buys latency, capacity, cost and security at the same time.',
  byline: 'Modern System Design · Chapter 11 · ~2h 20m read · Intermediate',
  interviewTip:
    'Most candidates say "and we will put a CDN in front of it" and stop. That sentence earns nothing. Earn marks instead by naming the cache key, the TTL and the invalidation strategy: "immutable versioned URLs with a one-year max-age for assets, s-maxage of 10 seconds plus stale-while-revalidate for the trending feed, and the edge never caches anything keyed by user." Then quantify the offload — "a 96% hit ratio turns 5 Tbps of egress into 200 Gbps at the origin" — and finish by admitting what the CDN did not fix, which is every write path in the system.',
  sections: [
    {
      id: 'cdn-problem',
      title: 'System Design: The Content Delivery Network (CDN)',
      children: [
        { id: 'p-physics', title: 'Why distance is the constraint' },
        { id: 'p-handshakes', title: 'Why one request is really four round trips' },
        { id: 'p-bandwidth', title: 'The bandwidth arithmetic that forces the issue' },
        { id: 'p-origin', title: 'What a single origin cannot do' },
        { id: 'p-definition', title: 'What a CDN actually is' },
        { id: 'p-map', title: 'How this chapter proceeds' },
      ],
      html: `
        <p><a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> left two numbers on the table that should have bothered you. The first is that a round trip across continents costs roughly 150 ms. The second is that a video platform at moderate scale needs about 5 Tbps of outbound bandwidth at peak. Neither number is an engineering defect you can tune away, and together they make this chapter mandatory rather than optional.</p>
        <p>Everything else in this course so far has been about making a server do more work per second. This chapter is about the opposite realisation: for a large class of systems, the server is not the problem. The distance between the server and the user is the problem, and no amount of profiling fixes distance.</p>

        <h3 class="lesson-subhead" id="p-physics">Why distance is the constraint</h3>
        <p>Light in a vacuum travels 300,000 km/s. In optical fibre it travels at roughly two-thirds of that, about 200,000 km/s. That is not a vendor limitation; it is the refractive index of glass. Every network latency figure you will ever see is built on top of that number.</p>
        <p>London to Sydney is about 17,000 km in a straight line. At 200,000 km/s a one-way trip is 85 ms and a round trip is 170 ms. Then reality adds to it: fibre does not follow great circles, it follows cable routes and landing stations, and it passes through router queues at every hop. Measured intercontinental round trips land in the 200–250 ms range, which is where <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>'s ~150 ms figure comes from once you average over shorter links.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 220" role="img" aria-label="Four stacked facts showing that fibre latency is fixed by physics, that handshakes multiply it, and that serving from a nearby edge removes it">
            <defs>
              <marker id="ah-c1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">LIGHT IN FIBRE MOVES AT 200,000 KM/S. THAT IS THE WHOLE PROBLEM.</text>
            <rect class="dg-box b" x="16" y="32" width="688" height="40" rx="7" />
            <text class="dg-s" x="30" y="49">Distance is fixed: London to Sydney is about 17,000 km. At 200,000 km/s that is 85 ms one way, 170 ms round trip.</text>
            <text class="dg-s" x="30" y="64">Real routes are not great circles. Add 30-50% of path inflation and you measure 200-250 ms in production.</text>
            <rect class="dg-box c" x="16" y="78" width="688" height="40" rx="7" />
            <text class="dg-s" x="30" y="95">One cold HTTPS request is several round trips: DNS lookup, TCP handshake, TLS handshake, then the request itself.</text>
            <text class="dg-s" x="30" y="110">Four round trips at 200 ms each is 800 ms of waiting before the origin has begun to think about a response.</text>
            <rect class="dg-box y" x="16" y="124" width="688" height="40" rx="7" />
            <text class="dg-s" x="30" y="141">Servers get faster every year; the speed of light does not. No amount of origin tuning moves a 170 ms floor.</text>
            <text class="dg-s" x="30" y="156">Distance is the only variable left, so the fix is not a faster server - it is a nearer one.</text>
            <rect class="dg-box g" x="16" y="170" width="688" height="40" rx="7" />
            <text class="dg-s" x="30" y="187">The same user served from a Sydney edge: 10 ms round trip, one handshake, first byte at about 15 ms.</text>
            <text class="dg-s" x="30" y="202">Identical bytes, identical code, roughly 15x faster. That is the entire value proposition of a CDN.</text>
          </svg>
          <figcaption>Figure 1 — The argument in four lines. Note that the last row involves no new code and no faster hardware; it is the same response served from a different place.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p-handshakes">Why one request is really four round trips</h3>
        <p>The 170 ms figure is the optimistic one, because it assumes a single round trip. A cold HTTPS request is not a single round trip. A browser with nothing warmed up must resolve the name, establish a TCP connection, negotiate TLS, and only then send the request.</p>
        <p>The arithmetic is brutal. DNS resolution is at least one round trip if nothing is cached anywhere on the path. The TCP handshake is one more. TLS 1.3 adds one (TLS 1.2 added two). The request itself is one. That is four round trips before the origin has begun to do work, and if each round trip costs 200 ms the user has waited 800 ms for a page that the server generated in 30 ms.</p>
        <p>This is why "move the bytes closer" is worth more than it first appears. Putting a server 10 ms away does not reduce the number of round trips — it reduces the cost of each one. Four round trips at 10 ms is 40 ms. The same four-step protocol dance that cost 800 ms now costs 40 ms, and the connection is often already warm because the edge is serving thousands of other users in the same city.</p>
        <p>There is a second-order effect worth naming, because interviewers like it. TCP throughput is governed by the congestion window, and the window grows per round trip. A connection with a 200 ms round trip takes seconds to reach full speed; a connection with a 10 ms round trip reaches it almost immediately. Short paths are not just lower latency — they are higher throughput for the same link capacity.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 246" role="img" aria-label="Side by side comparison of three users hitting one distant origin versus the same users hitting nearby edge servers that shield the origin">
            <defs>
              <marker id="ah-c2a" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-c2b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-c2c" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="28" width="340" height="206" rx="11" />
            <text class="dg-h" x="26" y="48">ONE ORIGIN, GLOBAL AUDIENCE</text>
            <rect class="dg-box r" x="26" y="58" width="100" height="24" rx="5" />
            <text class="dg-s" x="76" y="75" text-anchor="middle">Sydney user</text>
            <rect class="dg-box r" x="26" y="90" width="100" height="24" rx="5" />
            <text class="dg-s" x="76" y="107" text-anchor="middle">Tokyo user</text>
            <rect class="dg-box r" x="26" y="122" width="100" height="24" rx="5" />
            <text class="dg-s" x="76" y="139" text-anchor="middle">Berlin user</text>
            <rect class="dg-box p" x="214" y="86" width="124" height="48" rx="7" />
            <text class="dg-t" x="276" y="106" text-anchor="middle">ORIGIN</text>
            <text class="dg-s" x="276" y="124" text-anchor="middle">Virginia, USA</text>
            <path class="dg-line rose" d="M126 70 H168 V100 H210" marker-end="url(#ah-c2a)" />
            <path class="dg-line rose" d="M126 102 H210" marker-end="url(#ah-c2a)" />
            <path class="dg-line rose" d="M126 134 H168 V118 H210" marker-end="url(#ah-c2a)" />
            <text class="dg-s" x="26" y="172">every request crosses an ocean: 170-250 ms, every time</text>
            <text class="dg-s" x="26" y="190">origin bandwidth must equal total user bandwidth</text>
            <text class="dg-s" x="26" y="208">one region down means everyone is down</text>
            <text class="dg-s" x="26" y="226">and you pay origin egress on 100% of bytes</text>

            <rect class="dg-band g" x="368" y="28" width="340" height="206" rx="11" />
            <text class="dg-h" x="382" y="48">EDGES IN FRONT OF THAT ORIGIN</text>
            <rect class="dg-box g" x="382" y="58" width="86" height="24" rx="5" />
            <text class="dg-s" x="425" y="75" text-anchor="middle">Sydney</text>
            <rect class="dg-box g" x="382" y="90" width="86" height="24" rx="5" />
            <text class="dg-s" x="425" y="107" text-anchor="middle">Tokyo</text>
            <rect class="dg-box g" x="382" y="122" width="86" height="24" rx="5" />
            <text class="dg-s" x="425" y="139" text-anchor="middle">Berlin</text>
            <rect class="dg-box c" x="486" y="58" width="76" height="24" rx="5" />
            <text class="dg-s" x="524" y="75" text-anchor="middle">edge SYD</text>
            <rect class="dg-box c" x="486" y="90" width="76" height="24" rx="5" />
            <text class="dg-s" x="524" y="107" text-anchor="middle">edge NRT</text>
            <rect class="dg-box c" x="486" y="122" width="76" height="24" rx="5" />
            <text class="dg-s" x="524" y="139" text-anchor="middle">edge FRA</text>
            <rect class="dg-box frozen" x="592" y="86" width="104" height="48" rx="7" />
            <text class="dg-s" x="644" y="106" text-anchor="middle">origin</text>
            <text class="dg-s" x="644" y="124" text-anchor="middle">misses only</text>
            <path class="dg-line green" d="M468 70 H482" marker-end="url(#ah-c2b)" />
            <path class="dg-line green" d="M468 102 H482" marker-end="url(#ah-c2b)" />
            <path class="dg-line green" d="M468 134 H482" marker-end="url(#ah-c2b)" />
            <path class="dg-line violet dash" d="M562 70 H576 V100 H588" marker-end="url(#ah-c2c)" />
            <path class="dg-line violet dash" d="M562 102 H588" marker-end="url(#ah-c2c)" />
            <path class="dg-line violet dash" d="M562 134 H576 V118 H588" marker-end="url(#ah-c2c)" />
            <text class="dg-s" x="382" y="172">a same-city round trip is 5-15 ms</text>
            <text class="dg-s" x="382" y="190">origin bandwidth equals only the 3-5% that misses</text>
            <text class="dg-s" x="382" y="208">one edge down means traffic shifts, users unaware</text>
            <text class="dg-s" x="382" y="226">and CDN egress is 5-8x cheaper per GB</text>
          </svg>
          <figcaption>Figure 2 — The same system, twice. The dashed arrows on the right are the interesting part: they carry only the small fraction of traffic the edges could not answer themselves.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="p-bandwidth">The bandwidth arithmetic that forces the issue</h3>
        <p>Latency is the argument people quote. Bandwidth is the argument that actually makes a CDN non-negotiable, and <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> already did the sums. A million concurrent 1080p viewers at 5 Mbps each need 5,000 Gbps — 5 Tbps — of outbound capacity. The photo-sharing estimate in that chapter came out bandwidth-bound too, and so did the feed.</p>
        <p>Now put that number next to what a datacentre can actually push. A well-provisioned server has a 25–100 Gbps network interface, of which you can realistically use perhaps half for sustained delivery. To serve 5 Tbps from one site you would need something like a hundred saturated 50 Gbps servers <em>and</em> five terabits of transit and peering capacity into a single facility. The servers are the easy half of that sentence. Buying 5 Tbps of egress into one building, from providers whose links to the rest of the internet are themselves finite, is not a purchase you can simply make.</p>
        <p>The physical insight is that internet capacity is not a pool you draw from; it is a graph of links. Serving 5 Tbps from one place means 5 Tbps must traverse the same few paths. Serving it from a hundred places means each path carries 50 Gbps, which is ordinary. Distribution converts an impossible bandwidth problem into a hundred easy ones.</p>
        <p>This is also why the offload ratio is a capacity argument and not only a cost argument. If the edges answer 96% of bytes, the origin's egress requirement drops from 5.4 Tbps to about 200 Gbps, which one normal region can serve. The CDN did not make the bytes smaller; it moved the point at which they are duplicated.</p>

        <h3 class="lesson-subhead" id="p-origin">What a single origin cannot do</h3>
        <p>It is worth being explicit about the four separate ceilings a single origin runs into, because a good answer in an interview names all four rather than only the first.</p>
        <table>
          <thead><tr><th>Dimension</th><th>Single origin</th><th>With a CDN in front</th><th>Why it changes</th></tr></thead>
          <tbody>
            <tr><td>Latency to a distant user</td><td>170–250 ms per round trip, 4 round trips cold</td><td>5–15 ms per round trip, often 1 warm</td><td>Distance shrinks; handshakes terminate locally</td></tr>
            <tr><td>Peak egress</td><td>Must equal total user demand, 5.4 Tbps in our example</td><td>Only the miss fraction, ~170–200 Gbps</td><td>Bytes are duplicated at 100 sites instead of 1</td></tr>
            <tr><td>Flash crowds</td><td>One viral link is one hot datacentre</td><td>Spread over every PoP the users are near</td><td>Load arrives where the users are, not where the data is</td></tr>
            <tr><td>Availability</td><td>Region down is total outage</td><td>PoP down shifts traffic in seconds</td><td>100 independent failure domains, none critical</td></tr>
            <tr><td>Attack surface</td><td>Your IPs are the target</td><td>Edge absorbs L3/L4 and L7; origin can be private</td><td>Anycast capacity is measured in terabits</td></tr>
            <tr><td>Cost per GB</td><td>Cloud egress ~$0.05–0.09/GB</td><td>Committed CDN egress ~$0.005–0.02/GB</td><td>Peering and volume economics, not magic</td></tr>
          </tbody>
        </table>
        <p>Read that table as a list of separate wins rather than one win. Teams adopt a CDN for latency, discover that the cost saving is larger than the latency saving, and then find out during their first attack that the security property was the most valuable of the three.</p>

        <h3 class="lesson-subhead" id="p-definition">What a CDN actually is</h3>
        <p>Strip away the marketing and a CDN is one sentence: <strong>a geographically distributed tier of reverse-proxy caches, plus a routing system that sends each user to a nearby one, plus a control plane that configures and invalidates them.</strong> Every part of that sentence does work, so it is worth unpacking each.</p>
        <p><em>Reverse proxy</em> means it terminates the user's connection and speaks to your origin on the user's behalf — so it can terminate TLS, rewrite headers, enforce rules and reuse connections even for content it cannot cache. <em>Cache</em> means it stores responses keyed by request, so the second user costs almost nothing. <em>Geographically distributed</em> means there are dozens to hundreds of sites, called points of presence. <em>Routing system</em> is the part nobody thinks about and the part that decides whether "nearby" means anything. <em>Control plane</em> is how you change TTLs, push certificates and purge content without redeploying a hundred sites by hand.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 216" role="img" aria-label="Three jobs a CDN performs: proximity for latency, offload for capacity and cost, and shielding for security">
            <defs>
              <marker id="ah-c3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="28" width="228" height="180" rx="11" />
            <text class="dg-h" x="26" y="48">1 · PROXIMITY</text>
            <text class="dg-s" x="26" y="68">Serve bytes from a site</text>
            <text class="dg-s" x="26" y="84">near the user instead of</text>
            <text class="dg-s" x="26" y="100">from a distant origin.</text>
            <text class="dg-s" x="26" y="124">Cuts a round trip from</text>
            <text class="dg-s" x="26" y="140">200 ms to 10 ms, and</text>
            <text class="dg-s" x="26" y="156">terminates 3 of the 4</text>
            <text class="dg-s" x="26" y="172">cold handshakes locally.</text>
            <text class="dg-s" x="26" y="196">Wins: TTFB, video start.</text>

            <rect class="dg-band g" x="252" y="28" width="228" height="180" rx="11" />
            <text class="dg-h" x="266" y="48">2 · OFFLOAD</text>
            <text class="dg-s" x="266" y="68">A 96% hit ratio means the</text>
            <text class="dg-s" x="266" y="84">origin serves 1 byte in 25,</text>
            <text class="dg-s" x="266" y="100">so it can be 25x smaller.</text>
            <text class="dg-s" x="266" y="124">It also absorbs flash</text>
            <text class="dg-s" x="266" y="140">crowds: a viral link lands</text>
            <text class="dg-s" x="266" y="156">on 100 PoPs, not on one</text>
            <text class="dg-s" x="266" y="172">datacentre.</text>
            <text class="dg-s" x="266" y="196">Wins: cost and capacity.</text>

            <rect class="dg-band y" x="492" y="28" width="216" height="180" rx="11" />
            <text class="dg-h" x="506" y="48">3 · SHIELD</text>
            <text class="dg-s" x="506" y="68">The edge is the only part</text>
            <text class="dg-s" x="506" y="84">exposed to the internet.</text>
            <text class="dg-s" x="506" y="100">TLS, WAF rules, rate</text>
            <text class="dg-s" x="506" y="124">limits, bot rules and DDoS</text>
            <text class="dg-s" x="506" y="140">absorption all live there,</text>
            <text class="dg-s" x="506" y="156">on terabits of anycast</text>
            <text class="dg-s" x="506" y="172">capacity.</text>
            <text class="dg-s" x="506" y="196">Wins: availability.</text>
          </svg>
          <figcaption>Figure 3 — Three jobs, one component. Panel 2 is the one that pays for the service; panel 3 is the one teams appreciate only after their first incident.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>The non-obvious framing.</strong> A CDN is not "a cache we bolt on at the end". It is a decision about <em>where in the world your system's read path terminates</em>, and that decision changes what your origin is for. Once 96% of reads never reach the origin, the origin stops being a serving system and becomes a system of record — which means you can size it, deploy it and reason about it completely differently. Teams that treat the CDN as an afterthought keep paying for an origin built to serve traffic it no longer sees.</div>

        <h3 class="lesson-subhead" id="p-map">How this chapter proceeds</h3>
        <p>The remaining five sections build the block properly. Section 2 defines the vocabulary and the taxonomy of what can and cannot be cached. Section 3 states requirements, does the estimation, names the components and settles the two hardest design questions: how a user finds an edge, and why a middle tier exists. Sections 4 and 5 go deep — first into the cache itself (keys, freshness, eviction, invalidation), then into everything that is not a plain cache hit (dynamic acceleration, edge compute, streaming, security, multi-CDN, cost). Section 6 criticises the result.</p>
        <p>As with every building block in <a href="/learn/modern-system-design/building-blocks">Chapter 6</a>, the aim is not to be able to say the word. It is to be able to say what you configured, what number it moved, and what it broke.</p>
      `,
    },
    {
      id: 'cdn-intro',
      title: 'Introduction to a CDN',
      children: [
        { id: 'i-anatomy', title: 'Anatomy: PoPs, edges, shields and origin' },
        { id: 'i-locality', title: 'Why edge caching works at all' },
        { id: 'i-content', title: 'What is cacheable, and what is not' },
        { id: 'i-pushpull', title: 'Push CDNs and pull CDNs' },
        { id: 'i-metrics', title: 'The four metrics that matter' },
        { id: 'i-who', title: 'Who runs a CDN, and the build-or-buy question' },
      ],
      html: `
        <p>Before designing one it helps to fix the vocabulary, because CDN terminology is unusually sloppy in the industry and interviews reward precision. Four terms carry most of the weight: point of presence, edge server, shield, and origin.</p>

        <h3 class="lesson-subhead" id="i-anatomy">Anatomy: PoPs, edges, shields and origin</h3>
        <p>A <strong>point of presence (PoP)</strong> is a physical site — a rack or a cage in a carrier-neutral facility or inside an ISP's network — where the CDN has servers and network capacity. A large CDN has anywhere from 50 to several hundred PoPs. A PoP is a place, not a machine.</p>
        <p>An <strong>edge server</strong> (also called a cache node or, confusingly, just "the edge") is one machine inside a PoP. It terminates TLS, looks up the cache, applies rules and serves bytes. A PoP holds anywhere from a handful to hundreds of them behind a local load balancer, which is the same building block from Chapter 8 applied inside the PoP.</p>
        <p>A <strong>shield</strong> or <strong>mid-tier cache</strong> is a larger cache serving a region, which edge servers consult on a miss before they go to the origin. It is sometimes called an origin shield precisely because its purpose is to protect the origin from being asked the same question a hundred times.</p>
        <p>The <strong>origin</strong> is your system: an application tier, an object store like S3, or both. It is the only authoritative copy. Everything else in this chapter is a replica with a time limit.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 258" role="img" aria-label="The four tiers a response can come from, with per-hop latency and the vocabulary for each tier">
            <defs>
              <marker id="ah-c4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE FOUR TIERS A BYTE CAN COME FROM</text>
            <rect class="dg-box b" x="16" y="40" width="104" height="60" rx="7" />
            <text class="dg-t" x="68" y="58" text-anchor="middle">USER</text>
            <text class="dg-s" x="68" y="76" text-anchor="middle">browser or</text>
            <text class="dg-s" x="68" y="92" text-anchor="middle">mobile app</text>
            <rect class="dg-box c" x="152" y="40" width="160" height="60" rx="7" />
            <text class="dg-t" x="232" y="58" text-anchor="middle">EDGE / POP</text>
            <text class="dg-s" x="232" y="76" text-anchor="middle">hot slice on SSD + RAM</text>
            <text class="dg-s" x="232" y="92" text-anchor="middle">hit ratio 90-95%</text>
            <rect class="dg-box g" x="344" y="40" width="160" height="60" rx="7" />
            <text class="dg-t" x="424" y="58" text-anchor="middle">MID-TIER SHIELD</text>
            <text class="dg-s" x="424" y="76" text-anchor="middle">wider slice, per region</text>
            <text class="dg-s" x="424" y="92" text-anchor="middle">catches 50-70% of rest</text>
            <rect class="dg-box p" x="536" y="40" width="168" height="60" rx="7" />
            <text class="dg-t" x="620" y="58" text-anchor="middle">ORIGIN</text>
            <text class="dg-s" x="620" y="76" text-anchor="middle">your servers or blobs</text>
            <text class="dg-s" x="620" y="92" text-anchor="middle">sees 3-5% of requests</text>
            <path class="dg-line blue" d="M120 70 H148" marker-end="url(#ah-c4)" />
            <path class="dg-line blue" d="M312 70 H340" marker-end="url(#ah-c4)" />
            <path class="dg-line blue" d="M504 70 H532" marker-end="url(#ah-c4)" />
            <rect class="dg-band b" x="12" y="116" width="696" height="68" rx="10" />
            <text class="dg-h" x="26" y="136">WHAT EACH HOP COSTS</text>
            <text class="dg-s" x="26" y="156">user to edge 5-15 ms · edge to shield 10-40 ms · shield to origin 20-150 ms. A miss that walks the whole chain</text>
            <text class="dg-s" x="26" y="172">can cost 200 ms more than a hit, which is why hit ratio is a latency metric and not only a cost metric.</text>
            <rect class="dg-band y" x="12" y="196" width="696" height="54" rx="10" />
            <text class="dg-h" x="26" y="216">VOCABULARY, PRECISELY</text>
            <text class="dg-s" x="26" y="236">A PoP is a site and holds many edge servers. Edge server, cache node and CDN server all mean the same thing.</text>
          </svg>
          <figcaption>Figure 4 — The tiers. Read the percentages downward: they are the reason the origin box can be far smaller than the user demand implies.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="i-locality">Why edge caching works at all</h3>
        <p>A cache is only useful if requests repeat, and the reason CDNs work is that internet traffic is extraordinarily skewed. The front page, the current viral video, today's product images and this week's JavaScript bundle account for an enormous share of requests, while the long tail of old content accounts for most of the <em>catalogue</em> and very little of the <em>traffic</em>.</p>
        <p><a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> used an 80/20 assumption for cache sizing. At the edge the skew is usually sharper — something closer to a Zipf distribution, where the <em>n</em>th most popular object gets roughly 1/<em>n</em> of the top object's traffic. The practical consequence: a cache holding a few per cent of the catalogue can serve 90% or more of the requests, which is exactly why an edge server with 30 TB of SSD can front a 180 PB library.</p>
        <p>There is a second kind of locality that matters just as much and gets less attention: <strong>geographic</strong> locality. Users in Tokyo do not request the same objects as users in Berlin. Local news, local language variants, local catalogue and local time-of-day all mean each PoP's hot set is smaller and more predictable than the global hot set. Caching per PoP therefore works better than the global numbers suggest — and it is also why a PoP that suddenly takes over another PoP's traffic performs badly for a while.</p>

        <h3 class="lesson-subhead" id="i-content">What is cacheable, and what is not</h3>
        <p>The single most useful skill in this topic is looking at a response and saying immediately how cacheable it is. There are really four classes, and they want completely different treatment.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 230" role="img" aria-label="A five-row ladder of content classes from immutable versioned assets to uncacheable writes, with the cache directives each one wants">
            <defs>
              <marker id="ah-c5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">FROM CACHE-FOREVER TO NEVER-CACHE. THE MIDDLE ROW IS WHERE THE WINS ARE.</text>
            <rect class="dg-box g" x="16" y="32" width="688" height="34" rx="6" />
            <text class="dg-s" x="30" y="53">IMMUTABLE · /app.7f3a91.js · max-age=31536000, immutable · cache for a year, and no purge is ever needed</text>
            <rect class="dg-box c" x="16" y="70" width="688" height="34" rx="6" />
            <text class="dg-s" x="30" y="91">SHARED STATIC · /hero.jpg · max-age=3600, s-maxage=86400 · one object for everyone, safe to hold a long time</text>
            <rect class="dg-box y" x="16" y="108" width="688" height="34" rx="6" />
            <text class="dg-s" x="30" y="129">SHARED DYNAMIC · /trending · s-maxage=10, stale-while-revalidate=60 · 10 s of staleness removes 99% of load</text>
            <rect class="dg-box o" x="16" y="146" width="688" height="34" rx="6" />
            <text class="dg-s" x="30" y="167">PERSONALISED · /account · private, no-store at the edge · cacheable only per user, and rarely worth it</text>
            <rect class="dg-box r" x="16" y="184" width="688" height="34" rx="6" />
            <text class="dg-s" x="30" y="205">UNCACHEABLE · POST /checkout · never cached, yet the edge still helps by terminating TLS and pooling sockets</text>
          </svg>
          <figcaption>Figure 5 — The cacheability ladder. Most teams get rows 1 and 5 right by accident and leave row 3 on the table, which is where the largest untapped offload usually hides.</figcaption>
        </figure>
        <p>Row 3 deserves emphasis because it is counter-intuitive. A trending list, a product page, a comment count or a leaderboard feels dynamic and therefore uncacheable. But if you can tolerate ten seconds of staleness, a ten-second TTL on an endpoint receiving 10,000 requests per second means the origin serves that endpoint <em>once every ten seconds</em> — a reduction of five orders of magnitude for a staleness nobody perceives. Micro-caching is the highest-leverage CDN configuration change most systems never make.</p>
        <p>Row 4 is where teams hurt themselves. Adding the user's identity to the cache key is technically possible and almost always pointless: a key that is unique per user has a hit ratio bounded by how often one user reloads the same page. The right move is usually to split the page — cache the shared shell aggressively and fetch the personalised fragment separately — which is exactly what edge composition in Section 5 is for.</p>

        <h3 class="lesson-subhead" id="i-pushpull">Push CDNs and pull CDNs</h3>
        <p>There are two ways content gets into the edge caches, and the choice is driven by object size and by how predictable demand is.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Pull CDNs cache lazily on the first miss while push CDNs distribute content ahead of demand, with the trade-offs of each">
            <defs>
              <marker id="ah-c6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="28" width="340" height="196" rx="11" />
            <text class="dg-h" x="26" y="48">PULL · CACHE ON FIRST MISS</text>
            <text class="dg-s" x="26" y="68">1 · the first user requests /logo.png</text>
            <text class="dg-s" x="26" y="84">2 · the edge has nothing, fetches from origin</text>
            <text class="dg-s" x="26" y="100">3 · the edge stores it, then serves it</text>
            <text class="dg-s" x="26" y="116">4 · the next 100,000 users get a hit</text>
            <text class="dg-s" x="26" y="140">+ nothing to publish, no inventory to manage</text>
            <text class="dg-s" x="26" y="156">+ only content someone wanted is ever stored</text>
            <text class="dg-s" x="26" y="172">- the first user in each PoP pays full latency</text>
            <text class="dg-s" x="26" y="188">- 100 PoPs means up to 100 origin fetches</text>
            <text class="dg-s" x="26" y="210">Default for sites, images, scripts and APIs.</text>

            <rect class="dg-band g" x="368" y="28" width="340" height="196" rx="11" />
            <text class="dg-h" x="382" y="48">PUSH · UPLOAD AHEAD OF DEMAND</text>
            <text class="dg-s" x="382" y="68">1 · you publish the object to the CDN</text>
            <text class="dg-s" x="382" y="84">2 · the CDN distributes it to chosen PoPs</text>
            <text class="dg-s" x="382" y="100">3 · every user gets a hit, including the first</text>
            <text class="dg-s" x="382" y="116">4 · you decide when it leaves the cache</text>
            <text class="dg-s" x="382" y="140">+ no first-request penalty, no origin fan-in</text>
            <text class="dg-s" x="382" y="156">+ predictable: you know what is where</text>
            <text class="dg-s" x="382" y="172">- you store cold objects nobody asked for</text>
            <text class="dg-s" x="382" y="188">- publishing is a pipeline you now operate</text>
            <text class="dg-s" x="382" y="210">Default for video libraries and game patches.</text>
          </svg>
          <figcaption>Figure 6 — Pull versus push. The deciding question is whether you can predict demand: a 40 GB game patch released at a known hour is worth pushing, and a long tail of user photos is not.</figcaption>
        </figure>
        <table>
          <thead><tr><th></th><th>Pull</th><th>Push</th></tr></thead>
          <tbody>
            <tr><td>Who initiates</td><td>The first user request</td><td>Your publishing pipeline</td></tr>
            <tr><td>Best for</td><td>Large catalogues, unpredictable demand, small objects</td><td>Few large objects with predictable demand</td></tr>
            <tr><td>Storage cost</td><td>Only what was requested</td><td>Everything you published, everywhere you pushed it</td></tr>
            <tr><td>First-request latency</td><td>Full origin round trip, once per PoP</td><td>None — it is already there</td></tr>
            <tr><td>Origin fan-in</td><td>Up to one fetch per PoP per object</td><td>Zero at serve time</td></tr>
            <tr><td>Operational burden</td><td>Set headers and forget</td><td>Publish, track, expire, reconcile</td></tr>
            <tr><td>Typical use</td><td>Websites, APIs, images, on-demand video segments</td><td>Game patches, OS updates, launch-day media, live pre-positioning</td></tr>
          </tbody>
        </table>
        <p>In practice most production setups are pull with targeted pre-warming: you run pull semantics everywhere, and for the handful of objects whose launch you can predict you call a prefetch API a few hours ahead. That gets push's first-request behaviour without push's inventory problem.</p>

        <h3 class="lesson-subhead" id="i-metrics">The four metrics that matter</h3>
        <p>If you can only put four graphs on a CDN dashboard, these are the four. Everything else is diagnosis.</p>
        <ul class="lesson-layers">
          <li><strong>Cache hit ratio</strong>, measured both by request count and by bytes. They differ a lot: a 95% request hit ratio can be an 80% byte hit ratio if the misses are the large objects, and it is bytes that determine your origin bandwidth bill.</li>
          <li><strong>Origin offload</strong>, the percentage of bytes the origin never had to serve. This is the number your finance and capacity planning depend on, and it is not the same as hit ratio once a shield tier exists.</li>
          <li><strong>Edge latency percentiles</strong>, p50 and p99 separately for hits and misses. Mixing them hides everything: the p99 of a hit tells you about your edges, and the p99 of a miss tells you about your origin and your inter-PoP paths.</li>
          <li><strong>Error rate by class</strong> — 4xx from the edge, 5xx from the edge, and 5xx passed through from the origin. Confusing the last two costs hours during an incident.</li>
        </ul>
        <p>One measurement subtlety worth knowing: hit ratio is meaningless without a denominator you control. If a client library adds a random cache-busting query parameter, your hit ratio collapses and no infrastructure change will fix it. Always check the key before blaming the cache.</p>

        <h3 class="lesson-subhead" id="i-who">Who runs a CDN, and the build-or-buy question</h3>
        <p>Almost nobody builds a general-purpose CDN. The reason is not software — a caching reverse proxy is a solved problem and you can stand one up in an afternoon — it is that a CDN is fundamentally a <em>real-estate and peering</em> business. Value comes from having racks in 200 cities and settlement-free peering with the ISPs your users buy service from, and neither is something you can write.</p>
        <p>The interesting exception is the very largest media providers, who deploy their own caching appliances <em>inside</em> ISP networks. When one company's video is a double-digit percentage of an ISP's evening traffic, both sides benefit: the ISP saves transit and the provider gets a cache one hop from the subscriber. That is worth building at that scale and nowhere below it.</p>
        <p>The middle path, which most large sites actually take, is to buy CDN capacity from two or three vendors and keep the steering logic in-house. Section 5 covers why.</p>
        <div class="lesson-callout"><strong>Cacheability is a product decision, not an infrastructure one.</strong> Whether the trending list can be ten seconds stale, whether the page can be split into a shared shell plus a personalised fragment, whether asset URLs can carry a content hash — none of those are decisions an infrastructure team can make alone, and all of them matter more than which vendor you choose. The highest-leverage CDN work is usually a conversation with the people who own the page, not a change in a dashboard.</div>
      `,
    },
    {
      id: 'cdn-design',
      title: 'Design of a CDN',
      children: [
        { id: 'd-requirements', title: 'Functional and non-functional requirements' },
        { id: 'd-estimation', title: 'Estimating capacity, egress, cache size and offload' },
        { id: 'd-components', title: 'The components, and why each exists' },
        { id: 'd-api', title: 'Control-plane API sketch' },
        { id: 'd-routing', title: 'Routing a user to an edge: DNS versus anycast' },
        { id: 'd-hierarchy', title: 'Cache hierarchy and the origin shield' },
        { id: 'd-logging', title: 'The logging and analytics pipeline' },
      ],
      html: `
        <p>Now we design it. The discipline from <a href="/learn/modern-system-design/building-blocks">Chapter 6</a> applies: state the requirements, estimate before drawing, then name the trade-off every time a box appears.</p>

        <h3 class="lesson-subhead" id="d-requirements">Functional and non-functional requirements</h3>
        <p>Functional requirements — what the block must do:</p>
        <ul class="lesson-layers">
          <li><strong>Serve cached content.</strong> Answer a user request from a nearby edge without contacting the origin, for content marked cacheable.</li>
          <li><strong>Fetch and store on a miss.</strong> Retrieve from the shield or origin, store according to the response's freshness directives, and serve.</li>
          <li><strong>Route users to a good edge.</strong> Continuously map each user to a PoP that is near, healthy and not overloaded.</li>
          <li><strong>Invalidate.</strong> Remove or refresh content on demand — by exact URL, by tag, or wholesale — within a bounded time.</li>
          <li><strong>Terminate TLS</strong> for customer domains, including certificate issuance and rotation.</li>
          <li><strong>Enforce access rules.</strong> Signed URLs, geo restrictions, rate limits, WAF rules, bot policy.</li>
          <li><strong>Report.</strong> Deliver logs and aggregated metrics — hit ratio, egress, status codes, latency — per customer and per PoP.</li>
        </ul>
        <p>Non-functional requirements, with numbers, because a requirement without a number is a wish:</p>
        <ul class="lesson-layers">
          <li><strong>Latency:</strong> p50 of a cache hit under 20 ms, p99 under 60 ms, measured from the user. A miss adds one origin round trip and should be reported separately.</li>
          <li><strong>Availability:</strong> 99.99% for the serving path. That is 52 minutes of error budget per year, so no single PoP or config push may be able to spend it.</li>
          <li><strong>Scalability:</strong> handle 5+ Tbps of peak egress and hundreds of thousands of requests per second, growing by adding PoPs rather than by growing one.</li>
          <li><strong>Offload:</strong> at least 95% of bytes served without touching the origin, for a workload of ordinary web and media content.</li>
          <li><strong>Invalidation bound:</strong> a purge is reflected at 99% of PoPs within 30 seconds, and everywhere within 5 minutes.</li>
          <li><strong>Consistency:</strong> explicitly weak. A response may be stale by up to its TTL, and this is a stated contract rather than an accident — see <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a> for why naming the model matters.</li>
          <li><strong>Fail static:</strong> if the control plane is unreachable, edges continue serving with their last known configuration.</li>
        </ul>

        <h3 class="lesson-subhead" id="d-estimation">Estimating capacity, egress, cache size and offload</h3>
        <p>Using the five-step framework from <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>, with the video platform from that chapter as the workload so the numbers connect.</p>
        <pre><code>STEP 1 · REQUEST VOLUME
  Assume 400M DAU fetching 30 cacheable objects each per day
  = 12 x 10^9 requests/day
  12 x 10^9 / 10^5 s   = 120,000 req/s average
  peak multiplier x3   = 360,000 req/s peak

STEP 2 · EGRESS BANDWIDTH
  average web object 150 KB
  360,000 req/s x 150 KB = 54 GB/s = 432 Gbps of web assets
  plus video: 1M concurrent streams x 5 Mbps = 5,000 Gbps
  total peak egress      ~ 5.4 Tbps     ← video dominates by 12x

STEP 3 · PER-POP AND PER-SERVER CAPACITY
  100 PoPs, and traffic is not uniform: the top 20 carry ~70%
  hot PoP = 5.4 Tbps x 0.70 / 20   = 190 Gbps
  one edge server sustains ~40 Gbps of cached bytes (NIC-bound)
  190 / 40 = 5 servers, x2 for N+1 and maintenance
  -> 10-12 edge servers in a hot PoP, 2-4 in a small one

STEP 4 · CACHE FOOTPRINT
  catalogue ~180 PB of video + ~50 TB of web assets
  assume 5% of the catalogue serves ~80% of requests -> ~9 PB hot
  9 PB spread over 100 PoPs is still 90 TB per PoP
  so an edge holds only its LOCAL hot slice: 20-40 TB of SSD each
  -> 200-400 TB of cache per hot PoP, and a wider slice at the shield

STEP 5 · ORIGIN OFFLOAD  ← the number that sizes your origin
  edge hit ratio 92%            -> 8% goes to the shield
  shield catches 60% of those   -> 3.2% reaches the origin
  effective offload = 96.8%
  origin egress = 5.4 Tbps x 0.032 ~ 173 Gbps   ← one normal region

  Without the shield tier:
  origin egress = 5.4 Tbps x 0.08  ~ 432 Gbps   ← 2.5x more origin
  and origin fan-in goes from 8 sources to 100</code></pre>
        <p>Read step 5 twice, because it is the justification for a component many designs omit. The shield does not improve the user-visible hit ratio at all — a miss is still a miss from the user's point of view, just a slightly faster one. What it does is cut origin traffic by 2.5× and reduce the number of distinct machines asking the origin for the same object from 100 to 8. Fan-in, not volume, is what kills origins.</p>
        <p>One more calculation that changes the design, on cost:</p>
        <pre><code>COST · why CDN egress beats origin egress
  Sustained average egress ~2 Tbps = 250 GB/s
  250 GB/s x 2.6 x 10^6 s/month = 650 PB/month = 6.5 x 10^8 GB

  at cloud origin egress ~$0.085/GB  -> ~$55M/month
  at committed CDN egress ~$0.010/GB -> ~$6.5M/month

  Saving is ~8x, and that is before the 96.8% offload is applied
  to whatever still leaves the origin. The reason is not magic:
  CDNs peer directly with consumer ISPs, so most of these bytes
  never traverse paid transit at all.</code></pre>

        <h3 class="lesson-subhead" id="d-components">The components, and why each exists</h3>
        <p>Seven components, split into a data plane that sits in the request path and a control plane that does not. The split is the single most important architectural decision in the whole design.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 304" role="img" aria-label="CDN components divided into a data plane in the request path and a control plane outside it, with the fail-static design rule">
            <defs>
              <marker id="ah-c7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="696" height="110" rx="11" />
            <text class="dg-h" x="26" y="36">DATA PLANE · IN THE REQUEST PATH</text>
            <rect class="dg-box b" x="26" y="48" width="156" height="40" rx="6" />
            <text class="dg-s" x="104" y="66" text-anchor="middle">request router</text>
            <text class="dg-s" x="104" y="81" text-anchor="middle">DNS or anycast</text>
            <rect class="dg-box c" x="196" y="48" width="156" height="40" rx="6" />
            <text class="dg-s" x="274" y="66" text-anchor="middle">edge servers</text>
            <text class="dg-s" x="274" y="81" text-anchor="middle">TLS, cache, rules</text>
            <rect class="dg-box g" x="366" y="48" width="156" height="40" rx="6" />
            <text class="dg-s" x="444" y="66" text-anchor="middle">mid-tier shield</text>
            <text class="dg-s" x="444" y="81" text-anchor="middle">regional cache</text>
            <rect class="dg-box p" x="536" y="48" width="158" height="40" rx="6" />
            <text class="dg-s" x="615" y="66" text-anchor="middle">origin</text>
            <text class="dg-s" x="615" y="81" text-anchor="middle">yours, not the CDN's</text>
            <path class="dg-line blue" d="M182 68 H192" marker-end="url(#ah-c7)" />
            <path class="dg-line blue" d="M352 68 H362" marker-end="url(#ah-c7)" />
            <path class="dg-line blue" d="M522 68 H532" marker-end="url(#ah-c7)" />
            <text class="dg-s" x="26" y="110">every one of these must keep working while a PoP is switched off mid-request</text>
            <rect class="dg-band p" x="12" y="140" width="696" height="96" rx="11" />
            <text class="dg-h" x="26" y="160">CONTROL PLANE · OUT OF THE REQUEST PATH</text>
            <rect class="dg-box p" x="26" y="170" width="156" height="40" rx="6" />
            <text class="dg-s" x="104" y="188" text-anchor="middle">config distribution</text>
            <text class="dg-s" x="104" y="203" text-anchor="middle">rules, TTLs, certs</text>
            <rect class="dg-box p" x="196" y="170" width="156" height="40" rx="6" />
            <text class="dg-s" x="274" y="188" text-anchor="middle">purge fan-out</text>
            <text class="dg-s" x="274" y="203" text-anchor="middle">by URL and by tag</text>
            <rect class="dg-box p" x="366" y="170" width="156" height="40" rx="6" />
            <text class="dg-s" x="444" y="188" text-anchor="middle">health and telemetry</text>
            <text class="dg-s" x="444" y="203" text-anchor="middle">which PoPs are up</text>
            <rect class="dg-box p" x="536" y="170" width="158" height="40" rx="6" />
            <text class="dg-s" x="615" y="188" text-anchor="middle">log pipeline</text>
            <text class="dg-s" x="615" y="203" text-anchor="middle">aggregate, bill, alert</text>
            <text class="dg-s" x="26" y="228">a control-plane outage must never stop cache hits from being served</text>
            <rect class="dg-band g" x="12" y="250" width="696" height="46" rx="10" />
            <text class="dg-h" x="26" y="270">THE DESIGN RULE · FAIL STATIC</text>
            <text class="dg-s" x="26" y="286">If the control plane is unreachable, each edge keeps its last known config and keeps serving. Stale config beats no service.</text>
          </svg>
          <figcaption>Figure 7 — Data plane and control plane. The rule at the bottom is what separates a CDN that degrades from one that goes dark: config is an input to serving, never a dependency of it.</figcaption>
        </figure>
        <p>Why each component has to be there, in one line apiece. The <strong>request router</strong> exists because "nearby" is not something the user knows. The <strong>edge servers</strong> exist because that is where the cache and the TLS termination physically are. The <strong>shield</strong> exists to collapse 100-way origin fan-in into 8-way. The <strong>origin</strong> exists because something must be authoritative. <strong>Config distribution</strong> exists because you cannot hand-edit a hundred sites. <strong>Purge fan-out</strong> exists because TTLs alone cannot express "this specific thing is wrong now". <strong>Health and telemetry</strong> exist because the router needs to know which PoPs to stop sending traffic to. The <strong>log pipeline</strong> exists because hit ratio, billing and abuse detection are all derived from request logs.</p>
        <p>Each of those also comes with a cost. The router adds a lookup and a failure mode. The shield adds a hop on every miss — 10 to 40 ms — and another thing that can be down. The control plane adds the most dangerous property in the system: a single change that reaches every PoP in the world in under a minute. Section 6 returns to that one.</p>

        <h3 class="lesson-subhead" id="d-api">Control-plane API sketch</h3>
        <p>The data plane speaks HTTP and needs no API of its own. The control plane is where the customer-facing interface lives, and what it exposes tells you a lot about how the CDN is meant to be used.</p>
        <pre><code>PUT    /v1/distributions/{id}
       { "origin": "origin.example.com",
         "default_ttl": 3600,
         "cache_key": { "query_allow": ["w","h","v"],
                        "vary": ["Accept-Encoding"] },
         "shield": "eu-central",
         "waf_ruleset": "managed-core" }

GET    /v1/distributions/{id}/config     -> active version + rollout state

POST   /v1/distributions/{id}/purge
       { "urls": ["https://cdn.example.com/p/42/hero.jpg"] }
       { "tags": ["product-42", "category-shoes"] }
       { "everything": true }            -> use with extreme care
       -> 202 Accepted, { "purge_id": "...", "eta_seconds": 30 }

GET    /v1/purges/{purge_id}             -> per-region completion state

POST   /v1/distributions/{id}/prefetch
       { "urls": [...], "pops": ["nrt","syd"], "not_before": "..." }

POST   /v1/signed-urls
       { "path": "/private/film.m3u8", "expires": 1735689600,
         "ip_binding": false }
       -> { "url": "https://cdn.example.com/private/film.m3u8?e=...&amp;s=..." }

GET    /v1/distributions/{id}/stats?metric=hit_ratio&by=pop&from=&to=</code></pre>
        <p>Two details in that sketch are the interesting ones. <code>purge</code> returns <code>202 Accepted</code> with an ETA rather than <code>200 OK</code>, because invalidation across a hundred sites is asynchronous by nature and pretending otherwise would be a lie. And <code>cache_key</code> is a first-class configuration object, because as Section 4 shows, the key is where hit ratios are won and lost.</p>

        <h3 class="lesson-subhead" id="d-routing">Routing a user to an edge: DNS versus anycast</h3>
        <p>This is the hardest question in the design and the one most candidates skip. The edges exist; how does a browser in Osaka end up talking to the Tokyo PoP rather than the one in Virginia? There are two real answers and they have genuinely different failure behaviour.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 252" role="img" aria-label="DNS-based request routing compared with anycast plus BGP routing, listing the advantages and drawbacks of each">
            <defs>
              <marker id="ah-c8" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band c" x="12" y="28" width="340" height="212" rx="11" />
            <text class="dg-h" x="26" y="48">DNS-BASED ROUTING</text>
            <text class="dg-s" x="26" y="68">the client asks its resolver for cdn.example.com</text>
            <text class="dg-s" x="26" y="84">the CDN's authoritative DNS sees the resolver IP</text>
            <text class="dg-s" x="26" y="100">(or an ECS subnet) and answers with a PoP IP</text>
            <text class="dg-s" x="26" y="116">the client then connects to that specific IP</text>
            <text class="dg-s" x="26" y="140">+ steer per client, per PoP load, per cost</text>
            <text class="dg-s" x="26" y="156">+ drain a PoP by changing one DNS answer</text>
            <text class="dg-s" x="26" y="172">- TTLs mean failover takes 30-300 seconds</text>
            <text class="dg-s" x="26" y="188">- resolver location only approximates the user</text>
            <text class="dg-s" x="26" y="204">- public resolvers mislead you without ECS</text>
            <text class="dg-s" x="26" y="228">Used by most commercial CDNs.</text>

            <rect class="dg-band i" x="368" y="28" width="340" height="212" rx="11" />
            <text class="dg-h" x="382" y="48">ANYCAST WITH BGP</text>
            <text class="dg-s" x="382" y="68">one IP prefix is announced from every PoP</text>
            <text class="dg-s" x="382" y="84">the internet itself routes the packet to the PoP</text>
            <text class="dg-s" x="382" y="100">that is nearest in BGP terms</text>
            <text class="dg-s" x="382" y="116">no per-client decision is ever made</text>
            <text class="dg-s" x="382" y="140">+ failover is immediate: withdraw the route</text>
            <text class="dg-s" x="382" y="156">+ an enormous surface for absorbing DDoS</text>
            <text class="dg-s" x="382" y="172">- BGP-nearest is not the same as fastest</text>
            <text class="dg-s" x="382" y="188">- no load steering, so a hot PoP stays hot</text>
            <text class="dg-s" x="382" y="204">- a route change can reset long TCP flows</text>
            <text class="dg-s" x="382" y="228">Used by anycast-first networks and DNS roots.</text>
          </svg>
          <figcaption>Figure 8 — The two routing models. Notice that their weaknesses are mirror images: DNS knows the load but not the path, and anycast knows the path but not the load.</figcaption>
        </figure>
        <table>
          <thead><tr><th></th><th>DNS-based routing</th><th>Anycast + BGP</th></tr></thead>
          <tbody>
            <tr><td>Decision maker</td><td>The CDN's authoritative DNS server</td><td>The internet's routing tables</td></tr>
            <tr><td>Signal used</td><td>Resolver IP, ECS subnet, RUM latency maps, PoP load, cost</td><td>AS path length and local peering policy</td></tr>
            <tr><td>Granularity</td><td>Per resolver, potentially per query</td><td>Per network path; no per-user control</td></tr>
            <tr><td>Failover speed</td><td>Bounded by DNS TTL and resolvers that ignore it</td><td>Seconds — withdraw the BGP announcement</td></tr>
            <tr><td>Load balancing</td><td>Yes: weight answers, drain PoPs, shed to a neighbour</td><td>No: traffic goes where routing says, full or not</td></tr>
            <tr><td>Accuracy of "nearby"</td><td>Good with ECS, poor without it</td><td>Usually good, occasionally absurd (transatlantic detours)</td></tr>
            <tr><td>DDoS posture</td><td>Attack concentrates on the returned IPs</td><td>Attack is split across all PoPs automatically</td></tr>
            <tr><td>Long-lived connections</td><td>Stable for the life of the connection</td><td>Can break if the path changes mid-flow</td></tr>
          </tbody>
        </table>
        <p>The honest comparison is that both are in production at enormous scale and neither is strictly better. DNS routing gives you a control knob — you can move 5% of Frankfurt's traffic to Amsterdam because Frankfurt is at 85% utilisation — at the cost of failover that is only as fast as the least obedient resolver on the internet. Anycast gives you instant failover and free attack dispersion at the cost of having no knob at all: if BGP decides a network in Lagos is closer to São Paulo than to London, you get to file a ticket with someone else's network team.</p>
        <p>Most large networks now run a hybrid. Anycast handles the coarse mapping and absorbs attacks; DNS steering, applied to a set of anycast prefixes, provides the load and cost knob on top. A third layer — real-user measurement collected from actual clients — feeds latency maps back into the DNS decision, so "nearby" is defined by measured round-trip time rather than by geography. Distance is a proxy for latency, and a bad one when a cable is down.</p>
        <p>Two implementation details worth having ready. DNS routing depends on <strong>EDNS Client Subnet</strong>, an extension that lets a resolver pass a truncated client subnet to the authoritative server; without it, a user on a public resolver may be mapped to the resolver's location instead of their own — which is how a user in Nairobi ends up served from Europe. And DNS TTLs for CDN records are deliberately short, 20 to 60 seconds, which pushes query volume up and makes the CDN's own DNS infrastructure a high-QPS system in its own right, tying straight back to the DNS chapter.</p>

        <h3 class="lesson-subhead" id="d-hierarchy">Cache hierarchy and the origin shield</h3>
        <p>The estimation already showed the shield's value numerically. Here is the intuition. Every PoP is an independent cache, so the first request for an object at each PoP is a miss. With 100 PoPs, a single newly published object can be fetched from the origin 100 times, and with a purge of a million keys that becomes 100 million origin requests arriving in a burst.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 250" role="img" aria-label="Origin fan-in with no mid-tier compared with eight regional shields, showing request rates and egress in both cases">
            <defs>
              <marker id="ah-c9" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="28" width="340" height="210" rx="11" />
            <text class="dg-h" x="26" y="48">NO MID-TIER</text>
            <text class="dg-s" x="26" y="68">100 PoPs, each missing 8% of 3,600 req/s</text>
            <text class="dg-s" x="26" y="84">= 288 req/s of misses per PoP</text>
            <text class="dg-s" x="26" y="100">origin sees 100 x 288 = 28,800 req/s</text>
            <text class="dg-s" x="26" y="124">a cold object can be fetched 100 times</text>
            <text class="dg-s" x="26" y="140">origin egress = 8% of 5.4 Tbps = 432 Gbps</text>
            <text class="dg-s" x="26" y="164">the origin must be sized for the worst PoP</text>
            <text class="dg-s" x="26" y="180">and a mass expiry hits it from 100 sides</text>
            <text class="dg-s" x="26" y="204">Fan-in is the problem, not total volume.</text>

            <rect class="dg-band g" x="368" y="28" width="340" height="210" rx="11" />
            <text class="dg-h" x="382" y="48">WITH 8 REGIONAL SHIELDS</text>
            <text class="dg-s" x="382" y="68">each shield absorbs about 12 PoPs of misses</text>
            <text class="dg-s" x="382" y="84">shield hit ratio on those misses: 60%</text>
            <text class="dg-s" x="382" y="100">origin sees 28,800 x 0.40 = 11,520 req/s</text>
            <text class="dg-s" x="382" y="124">a cold object is fetched 8 times, not 100</text>
            <text class="dg-s" x="382" y="140">origin egress = 3.2% of 5.4 Tbps = 173 Gbps</text>
            <text class="dg-s" x="382" y="164">origin fan-in drops from 100 sources to 8</text>
            <text class="dg-s" x="382" y="180">and one shield coalesces duplicate fetches</text>
            <text class="dg-s" x="382" y="204">Cost: one extra hop per miss, 10-40 ms.</text>
          </svg>
          <figcaption>Figure 9 — Why a middle tier earns its hop. The shield is not there to make hits faster; it is there so the origin faces eight callers instead of a hundred.</figcaption>
        </figure>
        <p>A shield tier brings three benefits beyond the raw offload. It <strong>coalesces</strong>: many PoPs asking for the same object at the same moment can be collapsed into one origin fetch. It <strong>holds a wider slice</strong>: because it serves a whole region, its hot set is larger and it can afford more storage per unit of traffic, so it catches long-tail objects no single PoP would retain. And it <strong>concentrates the origin relationship</strong>: authentication, connection pooling and protocol negotiation with the origin happen in eight places rather than a hundred, which makes the origin's connection table and TLS session cache behave sanely.</p>
        <p>The costs are real and you should name them. Every miss now pays an extra hop, so the p99 of a miss gets worse even as the origin gets healthier. The shield is a new failure domain — if a regional shield dies, its dozen PoPs must fall back to the origin directly, which is exactly the load spike the shield existed to prevent, so shields need their own redundancy. And a shield adds a second place where stale content can hide, which makes purge verification harder.</p>

        <h3 class="lesson-subhead" id="d-logging">The logging and analytics pipeline</h3>
        <p>An easily overlooked component with a surprising amount of design in it. Every request at every edge produces a log line — at 360,000 requests per second and roughly 300 bytes per line, that is about 108 MB/s, close to 9 TB per day, generated at a hundred sites that each have limited uplink capacity that you would rather spend on serving users.</p>
        <p>So logging is designed as a tiered, lossy-at-the-edges pipeline. Edges aggregate counters locally — requests, bytes, statuses, hit and miss, per customer, per minute — and ship small summaries continuously for dashboards and alerting. Raw log lines are batched, compressed and shipped at lower priority, often with a delay of minutes and occasionally with sampling for the highest-volume customers. Billing is computed from the aggregates, not from the raw lines, because billing must be available even when raw log shipping is backed up.</p>
        <p>The trade-off to state out loud: the metrics you alert on are near-real-time and approximate, while the logs you debug with are complete and delayed. Confusing the two is a classic incident mistake — "the dashboard says 2% errors but the logs show 6%" usually means you are comparing a sampled aggregate to a complete one.</p>
        <div class="lesson-callout"><strong>Where interview candidates lose marks in this section.</strong> Not on the cache — almost everyone can explain a cache. They lose marks on the two questions this section spends the most time on: how a user is routed to an edge, and why there is a tier between edge and origin. If you can say "anycast for the coarse map and DDoS dispersion, DNS steering with ECS and RUM maps for load control on top" and "a shield, because 100-way origin fan-in is what breaks origins, not total bytes", you are in a different band of answer than someone who says "the CDN caches static assets".</div>
      `,
    },
    {
      id: 'depth-1',
      title: 'In-Depth Investigation of CDN: Part 1',
      children: [
        { id: 'c-key', title: 'Cache keys, Vary and why they are the whole product' },
        { id: 'c-ttl', title: 'TTL, stale-while-revalidate and stale-if-error' },
        { id: 'c-inval', title: 'Invalidation: purge, tags, or versioned URLs' },
        { id: 'c-hit', title: 'Hit ratio arithmetic' },
      ],
      html: `
        <h3 class="lesson-subhead" id="c-key">Cache keys, Vary and why they are the whole product</h3>
        <p>A CDN is a map from a cache key to a byte range. Get the key wrong and you either serve the wrong user the wrong content (a privacy incident) or you fragment the cache so badly that the hit ratio collapses. The default key is the full URL including the query string. That is already too much if <code>?utm_source=</code> is in the URL, and not enough if the response depends on a cookie or an <code>Accept-Language</code> header.</p>
        <p><code>Vary</code> tells the cache that two requests with the same URL are not the same object. <code>Vary: Accept-Encoding</code> is mandatory (gzip vs brotli vs identity). <code>Vary: Cookie</code> is a foot-gun that makes every user a unique cache entry. The interview-grade sentence: "static assets are keyed on the path only, HTML is keyed on path plus a small allow-list of query params, and nothing personalised is cached at the shared edge at all."</p>

        <h3 class="lesson-subhead" id="c-ttl">TTL, stale-while-revalidate and stale-if-error</h3>
        <p><code>Cache-Control: public, max-age=31536000, immutable</code> is what versioned assets get — a year, and the cache must not revalidate. HTML and APIs get short <code>s-maxage</code> (the shared-cache TTL) plus <code>stale-while-revalidate</code> so a slightly old page is served instantly while the edge refreshes, and <code>stale-if-error</code> so an origin outage serves yesterday's content rather than an error. Those two directives convert a cache from a performance optimisation into a reliability component.</p>

        <h3 class="lesson-subhead" id="c-inval">Invalidation: purge, tags, or versioned URLs</h3>
        <p>Purging by URL does not scale (you will forget a variant). Surrogate keys / cache tags let you purge "all objects tagged <code>article:42</code>". The robust answer is still versioned URLs: <code>app.9f3c2.js</code> never needs to be purged because it never changes. HTML points at the new name when you deploy. Purge remains for the HTML itself and for emergencies.</p>

        <h3 class="lesson-subhead" id="c-hit">Hit ratio arithmetic</h3>
        <p>Origin load is <code>(1 − hit_ratio) × edge_qps</code>. Moving from 95% to 99% is not a 4-point improvement — it is a 5× reduction in origin traffic. That is why hit ratio is the CDN's SLO, and why a 1% drop in hit ratio is an origin incident, not a cache curiosity.</p>
      `,
    },
    {
      id: 'depth-2',
      title: 'In-Depth Investigation of CDN: Part 2',
      children: [
        { id: 'c-dynamic', title: 'Dynamic content and edge compute' },
        { id: 'c-stream', title: 'Streaming media' },
        { id: 'c-sec', title: 'Security at the edge' },
        { id: 'c-stampede', title: 'Thundering herds and request coalescing' },
      ],
      html: `
        <h3 class="lesson-subhead" id="c-dynamic">Dynamic content and edge compute</h3>
        <p>A CDN still helps uncacheable responses: TLS is terminated nearby, the edge holds a warm connection pool to the origin, and TCP/TLS slow-start happens on a short RTT. Edge functions (workers) can assemble a page from cached fragments plus a small personalised call — ESI's grandchild. Use them for A/B flags and auth-gate checks; do not rewrite your application as a thousand edge scripts.</p>

        <h3 class="lesson-subhead" id="c-stream">Streaming media</h3>
        <p>Segmented HLS/DASH is CDN-native: each segment is an immutable file with a long TTL, just like the YouTube chapter. The player picks a rendition per segment. Prefetch of the next segment at the edge hides origin latency. This is why video platforms are CDN companies with a transcoding pipeline attached, not the other way around.</p>

        <h3 class="lesson-subhead" id="c-sec">Security at the edge</h3>
        <p>The edge is where DDoS is absorbed (anycast spreads it), where a WAF can drop obvious abuse before origin CPU is spent, and where signed/tokenised URLs protect private content. Certificates live here. Bot management lives here. The edge is also a new attacker: a poisoned cache entry is served to everyone, so cache keys that include untrusted headers are a class of incident of their own.</p>

        <h3 class="lesson-subhead" id="c-stampede">Thundering herds and request coalescing</h3>
        <p>When a hot object expires, every edge may miss at once and stampede the origin — Chapter 16's cache stampede at global scale. Request coalescing (collapse concurrent misses for the same key into one origin fetch) is the fix. Origin shields (Figure 9) are coalescing plus a larger cache. Stale-while-revalidate avoids the miss entirely for the common case.</p>
      `,
    },
    {
      id: 'cdn-eval',
      title: "Evaluation of CDN's Design",
      children: [
        { id: 'c-eval', title: 'What this design does not solve' },
        { id: 'c-cost', title: 'The cost model' },
        { id: 'c-check', title: 'Chapter checkpoint' },
      ],
      html: `
        <h3 class="lesson-subhead" id="c-eval">What this design does not solve</h3>
        <p>A CDN does not make writes fast, does not make personalised content cacheable without extra work, does not give you consistency stronger than the TTL you chose, and does not make origin bugs disappear — it hides them until they expire. Debugging gets harder: a user's "I see the old page" now has a geography. Vendor lock-in is real (purge APIs, workers, custom headers). Multi-CDN exists because large sites refuse to share fate with one provider; it costs a traffic-steering layer and doubled operational knowledge.</p>

        <h3 class="lesson-subhead" id="c-cost">The cost model</h3>
        <p>You pay for egress, requests, and (sometimes) cache fill. CDN egress is cheaper than origin egress, which is why offload is a cost win as well as a latency win. The trap is a low hit ratio: you then pay for the fill <em>and</em> the origin. Measure origin bytes, not just edge bytes, or you will celebrate a CDN that is actually a very expensive reverse proxy.</p>

        <h3 class="lesson-subhead" id="c-check">Chapter checkpoint</h3>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Why does a 95% → 99% hit-ratio change cut origin load by 5× rather than 4%? When are versioned URLs a better invalidation strategy than purge? And why is a mid-tier / origin shield about fan-in, not about making hits faster?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Content delivery networks, HTTP caching semantics, anycast and DNS request routing, cache hierarchies and adaptive streaming are standard, widely-documented industry topics; the RFC-defined header semantics referenced here are public specifications. All explanations, worked estimations, diagrams, tables, API sketches and exercises are our own.',
};
