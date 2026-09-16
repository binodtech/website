/** Modern System Design — Chapter 7: Domain Name System (DNS).
 *  The internet's naming layer: the hierarchy, the four server roles, resolution,
 *  caching and TTL, DNS as a traffic-steering tool, and its failure modes.
 */

export const msdDns = {
  slug: 'dns',
  title: 'Domain Name System (DNS)',
  subtitle:
    'DNS is the indirection layer that lets a stable human-readable name point at a changing set of machines. It is also the first building block on every request path, a surprisingly capable traffic-steering tool, and the single most common way an otherwise healthy company takes itself completely offline.',
  byline: 'Modern System Design · Chapter 7 · ~55 min read · Beginner',
  interviewTip:
    'Two things separate a strong DNS answer from a weak one. First, treat DNS as a design tool rather than plumbing: say out loud that you will use weighted records for a canary, or geo-routing to pick a region, and name the TTL you would set. Second, be honest that DNS is a slow failover mechanism — caching means a record change takes a TTL to be universal and some resolvers ignore TTLs entirely, so anything needing sub-second failover must be handled by a load balancer or anycast instead. Candidates who claim they will "just update DNS" when a region dies get pushed on it every time.',
  sections: [
    {
      id: 'dns-intro',
      title: 'Introduction to Domain Name System (DNS)',
      children: [
        { id: 'dns-problem', title: 'The problem: names versus addresses' },
        { id: 'dns-namespace', title: 'The namespace is a tree' },
        { id: 'dns-roles', title: 'The four server roles' },
        { id: 'dns-records', title: 'Records: what an answer can actually say' },
        { id: 'dns-requirements', title: 'Requirements for a naming system' },
        { id: 'dns-estimation', title: 'Estimating the load on DNS' },
      ],
      html: `
        <p>Every other building block in this course assumes you already know where to send the packet. DNS is the block that answers that question, and it is first on the request path for a reason: nothing else runs until it returns.</p>
        <p>It is easy to dismiss as a lookup table. It is not one. DNS is a globally distributed, hierarchically delegated, aggressively cached, eventually consistent database with no single owner, which has been continuously available for four decades. Understanding how it pulls that off teaches most of the lessons the rest of this course repeats.</p>

        <h3 class="lesson-subhead" id="dns-problem">The problem: names versus addresses</h3>
        <p>Machines route on addresses. A packet needs a 32-bit IPv4 or 128-bit IPv6 destination, and no amount of good intentions changes that. People, on the other hand, cannot hold addresses in their heads, cannot type them reliably, and cannot tell a typo from a valid one.</p>
        <p>You could stop there and say DNS exists for human convenience. That would miss the more important half. The real value is <strong>indirection</strong>: because clients hold a name and resolve it fresh, the set of addresses behind that name can change without anybody updating a client.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 236" role="img" aria-label="Comparison of hardcoded IP addresses against names resolved through a lookup layer">
            <defs>
              <marker id="ah-dns1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHY WE DO NOT JUST USE ADDRESSES</text>
            <rect class="dg-band r" x="12" y="32" width="344" height="186" rx="11" />
            <text class="dg-h" x="26" y="52">HARDCODED ADDRESSES</text>
            <rect class="dg-box r" x="26" y="62" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="79" text-anchor="middle">connect to 93.184.216.34</text>
            <text class="dg-s" x="26" y="108">· humans cannot remember or type them</text>
            <text class="dg-s" x="26" y="126">· change the server and every client breaks</text>
            <text class="dg-s" x="26" y="144">· you cannot move hosts without a release</text>
            <text class="dg-s" x="26" y="162">· no way to send users to a nearer region</text>
            <text class="dg-s" x="26" y="180">· one address means one machine, so no scale-out</text>
            <text class="dg-s" x="26" y="198">· a dead host stays dead until clients update</text>

            <rect class="dg-band g" x="368" y="32" width="340" height="186" rx="11" />
            <text class="dg-h" x="382" y="52">NAMES WITH A LOOKUP LAYER</text>
            <rect class="dg-box g" x="382" y="62" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="79" text-anchor="middle">connect to example.com</text>
            <text class="dg-s" x="382" y="108">· humans type and remember a name</text>
            <text class="dg-s" x="382" y="126">· the name is stable while addresses change</text>
            <text class="dg-s" x="382" y="144">· one name can map to many addresses</text>
            <text class="dg-s" x="382" y="162">· the answer can differ per user location</text>
            <text class="dg-s" x="382" y="180">· removing a sick host is a record edit</text>
            <text class="dg-s" x="382" y="198">· cost: one extra lookup before the first byte</text>
            <path class="dg-line green" d="M356 122 H364" marker-end="url(#ah-dns1)" />
          </svg>
          <figcaption>Figure 1 — The value of indirection. Only the first bullet on each side is about humans; the rest are about the freedom to change your infrastructure without touching your clients.</figcaption>
        </figure>
        <p>That last line on the right is the honest cost. A name costs you a round trip — sometimes several — before the connection even opens. On a cold cache an intercontinental resolution can add 100 ms to a page load, which is why so much of this chapter is about caching.</p>
        <p>The same indirection appears again and again in this course under different names. Service discovery is indirection for internal services. A load balancer's virtual IP is indirection for a pool of servers. A CDN hostname is indirection for a set of edge locations. DNS is simply the oldest and most widely deployed example.</p>

        <h3 class="lesson-subhead" id="dns-namespace">The namespace is a tree</h3>
        <p>A naive design would put every name in one enormous table. At roughly 350 million registered domains, each with an unknown number of subdomains, that table would have a single owner, a single point of failure and a hopeless update problem.</p>
        <p>DNS instead organises names as a tree and hands each node authority over only its own children. A fully qualified name is read <em>right to left</em>, most general part first, and each dot is a delegation boundary.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 254" role="img" aria-label="The name api.shop.example.com broken into four labels, each owned by a different level of the DNS hierarchy">
            <defs>
              <marker id="ah-dns2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">ONE NAME, FOUR LEVELS OF DELEGATION</text>
            <rect class="dg-box c" x="16" y="34" width="120" height="52" rx="7" />
            <text class="dg-t" x="76" y="54" text-anchor="middle">api</text>
            <text class="dg-s" x="76" y="74" text-anchor="middle">host record</text>
            <rect class="dg-box b" x="152" y="34" width="120" height="52" rx="7" />
            <text class="dg-t" x="212" y="54" text-anchor="middle">shop</text>
            <text class="dg-s" x="212" y="74" text-anchor="middle">sub-zone</text>
            <rect class="dg-box g" x="288" y="34" width="136" height="52" rx="7" />
            <text class="dg-t" x="356" y="54" text-anchor="middle">example</text>
            <text class="dg-s" x="356" y="74" text-anchor="middle">your zone</text>
            <rect class="dg-box i" x="440" y="34" width="112" height="52" rx="7" />
            <text class="dg-t" x="496" y="54" text-anchor="middle">com</text>
            <text class="dg-s" x="496" y="74" text-anchor="middle">TLD registry</text>
            <rect class="dg-box p" x="568" y="34" width="136" height="52" rx="7" />
            <text class="dg-t" x="636" y="54" text-anchor="middle">. (root)</text>
            <text class="dg-s" x="636" y="74" text-anchor="middle">13 root servers</text>
            <path class="dg-line violet thick" d="M700 102 H24" marker-end="url(#ah-dns2)" />
            <text class="dg-s" x="16" y="122">a resolver starts at the root and walks left, one delegation at a time</text>
            <rect class="dg-band b" x="12" y="134" width="696" height="108" rx="10" />
            <text class="dg-h" x="26" y="154">DELEGATION IS THE WHOLE TRICK</text>
            <text class="dg-s" x="26" y="176">The root has never heard of api.shop.example.com. It knows which servers are authoritative for com, and nothing else.</text>
            <text class="dg-s" x="26" y="194">The com registry knows which servers are authoritative for example.com. Those servers know about shop, and so on down.</text>
            <text class="dg-s" x="26" y="212">Each level stores only its children's name servers, so the tree grows to hundreds of millions of names without any</text>
            <text class="dg-s" x="26" y="230">single node needing to know more than its own zone. That is why it scales, and why no one organisation runs all of it.</text>
          </svg>
          <figcaption>Figure 2 — Names read right to left. The trailing dot for the root is usually invisible in a browser but is written explicitly in zone files, which is why records there end in a dot.</figcaption>
        </figure>
        <p>Three terms from that picture are worth being precise about, because interviews use them loosely and then ask you to be exact.</p>
        <ul class="lesson-layers">
          <li><strong>Zone.</strong> A contiguous chunk of the tree administered as one unit. <code>example.com</code> is a zone; if you delegate <code>shop.example.com</code> to a different team with different name servers, that becomes a separate zone with its own boundary.</li>
          <li><strong>Domain.</strong> A node in the tree and everything underneath it. A domain may be one zone or many; the distinction is administrative, not structural.</li>
          <li><strong>Authoritative.</strong> A server is authoritative for a zone if it serves that zone's real data rather than a cached copy. Only authoritative servers can create truth; everything else is repeating what it was told.</li>
        </ul>
        <p>The top-level domains split into generic ones (<code>com</code>, <code>net</code>, <code>org</code>, and the newer <code>dev</code>, <code>app</code>, <code>io</code>) and country-code ones (<code>uk</code>, <code>in</code>, <code>de</code>, <code>jp</code>). There is also <code>arpa</code>, which exists mainly to hold reverse lookups — the mapping from an address back to a name, which we come to with PTR records below.</p>

        <h3 class="lesson-subhead" id="dns-roles">The four server roles</h3>
        <p>Four different kinds of participant answer DNS questions, and confusing them is the most common source of muddled answers. The crucial distinction: only one of them does any work on your behalf, and only one of them knows any answers.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 280" role="img" aria-label="The four DNS server roles and the order in which a recursive resolver queries root, TLD and authoritative servers">
            <defs>
              <marker id="ah-dns3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="696" height="110" rx="11" />
            <text class="dg-h" x="26" y="36">FOUR ROLES</text>
            <rect class="dg-box" x="26" y="46" width="160" height="68" rx="7" />
            <text class="dg-t" x="106" y="66" text-anchor="middle">STUB RESOLVER</text>
            <text class="dg-s" x="106" y="84" text-anchor="middle">in the OS or app</text>
            <text class="dg-s" x="106" y="100" text-anchor="middle">asks once, caches</text>
            <rect class="dg-box b" x="196" y="46" width="160" height="68" rx="7" />
            <text class="dg-t" x="276" y="66" text-anchor="middle">RECURSIVE RESOLVER</text>
            <text class="dg-s" x="276" y="84" text-anchor="middle">does the whole walk</text>
            <text class="dg-s" x="276" y="100" text-anchor="middle">and all the caching</text>
            <rect class="dg-box p" x="366" y="46" width="160" height="68" rx="7" />
            <text class="dg-t" x="446" y="66" text-anchor="middle">ROOT AND TLD</text>
            <text class="dg-s" x="446" y="84" text-anchor="middle">point downward only</text>
            <text class="dg-s" x="446" y="100" text-anchor="middle">hold no real answers</text>
            <rect class="dg-box g" x="536" y="46" width="160" height="68" rx="7" />
            <text class="dg-t" x="616" y="66" text-anchor="middle">AUTHORITATIVE</text>
            <text class="dg-s" x="616" y="84" text-anchor="middle">holds the real zone</text>
            <text class="dg-s" x="616" y="100" text-anchor="middle">the source of truth</text>

            <rect class="dg-band y" x="12" y="138" width="696" height="130" rx="11" />
            <text class="dg-h" x="26" y="158">THE ORDER FOR api.shop.example.com</text>
            <rect class="dg-box b" x="26" y="170" width="150" height="44" rx="7" />
            <text class="dg-s" x="101" y="190" text-anchor="middle">resolver: cache?</text>
            <text class="dg-s" x="101" y="205" text-anchor="middle">miss</text>
            <rect class="dg-box p" x="194" y="170" width="150" height="44" rx="7" />
            <text class="dg-s" x="269" y="190" text-anchor="middle">root: ask com</text>
            <text class="dg-s" x="269" y="205" text-anchor="middle">NS + glue</text>
            <rect class="dg-box i" x="362" y="170" width="150" height="44" rx="7" />
            <text class="dg-s" x="437" y="190" text-anchor="middle">com: ask example</text>
            <text class="dg-s" x="437" y="205" text-anchor="middle">NS + glue</text>
            <rect class="dg-box g" x="530" y="170" width="166" height="44" rx="7" />
            <text class="dg-s" x="613" y="190" text-anchor="middle">example.com: here</text>
            <text class="dg-s" x="613" y="205" text-anchor="middle">A 203.0.113.9</text>
            <path class="dg-line blue" d="M176 192 H190" marker-end="url(#ah-dns3)" />
            <path class="dg-line blue" d="M344 192 H358" marker-end="url(#ah-dns3)" />
            <path class="dg-line blue" d="M512 192 H526" marker-end="url(#ah-dns3)" />
            <text class="dg-s" x="26" y="236">Only the last server actually knows the answer. The first two exist to narrow the search, and their replies are cached for</text>
            <text class="dg-s" x="26" y="254">days — so in practice a resolver usually skips straight to the authoritative server, or skips even that on a cache hit.</text>
          </svg>
          <figcaption>Figure 3 — Roles and order. &ldquo;Glue&rdquo; is the A record for a name server returned alongside the NS record, so the resolver does not have to resolve the name server's own name first and loop forever.</figcaption>
        </figure>
        <p>Some detail on each role, because each has a different scaling story.</p>
        <p>The <strong>stub resolver</strong> is library code — <code>getaddrinfo</code> on Linux, the equivalent in your runtime. It is deliberately dumb: it knows the address of one or two recursive resolvers, sends one question, and takes the answer. It caches a little and it does not follow referrals.</p>
        <p>The <strong>recursive resolver</strong> is where all the intelligence and all the caching lives. It is run by your ISP, your corporate network, or a public service such as <code>8.8.8.8</code>, <code>1.1.1.1</code> or <code>9.9.9.9</code>. Because one resolver serves thousands or millions of users, its cache has an extremely high hit rate, and that single fact is what makes global DNS affordable.</p>
        <p>The <strong>root servers</strong> are 13 names (<code>a.root-servers.net</code> through <code>m.root-servers.net</code>), not 13 machines. Each name is an anycast address announced from hundreds of physical sites by twelve independent operators, giving well over a thousand instances worldwide. They answer one kind of question: which servers are authoritative for a given top-level domain.</p>
        <p>The <strong>TLD servers</strong> do the same job one level down, and the <strong>authoritative servers</strong> for a zone are the only place real records exist. If you buy a domain and point it at a managed DNS provider, that provider runs the authoritative tier for you.</p>
        <div class="lesson-callout"><strong>The non-obvious bit.</strong> Load on your authoritative servers is not proportional to your user traffic. It is proportional to the number of distinct recursive resolvers that see your traffic, divided by your TTL. A site with 10,000 page-views per second and a 300-second TTL might see only a couple of hundred authoritative queries per second — and doubling your users barely moves that number, because they arrive behind resolvers you are already serving.</div>

        <h3 class="lesson-subhead" id="dns-records">Records: what an answer can actually say</h3>
        <p>DNS answers are typed. A query names a record type, and the answer contains records of that type. Grouping them by purpose makes the list much easier to hold.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 264" role="img" aria-label="DNS record types grouped by purpose: address, alias, delegation, service and metadata">
            <defs>
              <marker id="ah-dns4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">RECORDS GROUPED BY WHAT THEY ARE FOR</text>
            <rect class="dg-box b" x="16" y="30" width="170" height="40" rx="6" />
            <text class="dg-t" x="101" y="47" text-anchor="middle">ADDRESS</text>
            <text class="dg-s" x="101" y="63" text-anchor="middle">A · AAAA</text>
            <rect class="dg-box b" x="202" y="30" width="502" height="40" rx="6" />
            <text class="dg-s" x="216" y="47">Maps a name straight to an IPv4 or IPv6 address. This is the terminal answer</text>
            <text class="dg-s" x="216" y="63">that every other record type eventually leads to.</text>

            <rect class="dg-box c" x="16" y="76" width="170" height="40" rx="6" />
            <text class="dg-t" x="101" y="93" text-anchor="middle">ALIAS</text>
            <text class="dg-s" x="101" y="109" text-anchor="middle">CNAME · ALIAS/ANAME</text>
            <rect class="dg-box c" x="202" y="76" width="502" height="40" rx="6" />
            <text class="dg-s" x="216" y="93">CNAME says this name is really that name, forcing a second lookup. It is</text>
            <text class="dg-s" x="216" y="109">illegal at a zone apex, which is what ALIAS and ANAME exist to work around.</text>

            <rect class="dg-box g" x="16" y="122" width="170" height="40" rx="6" />
            <text class="dg-t" x="101" y="139" text-anchor="middle">DELEGATION</text>
            <text class="dg-s" x="101" y="155" text-anchor="middle">NS · SOA</text>
            <rect class="dg-box g" x="202" y="122" width="502" height="40" rx="6" />
            <text class="dg-s" x="216" y="139">NS lists the name servers for a child zone and is how the tree is stitched</text>
            <text class="dg-s" x="216" y="155">together. SOA holds the serial number, refresh timers and negative-cache TTL.</text>

            <rect class="dg-box y" x="16" y="168" width="170" height="40" rx="6" />
            <text class="dg-t" x="101" y="185" text-anchor="middle">SERVICE</text>
            <text class="dg-s" x="101" y="201" text-anchor="middle">MX · SRV</text>
            <rect class="dg-box y" x="202" y="168" width="502" height="40" rx="6" />
            <text class="dg-s" x="216" y="185">MX names the mail exchangers with a priority value. SRV generalises that to</text>
            <text class="dg-s" x="216" y="201">any service, protocol and port, which is why SIP and XMPP clients need it.</text>

            <rect class="dg-box p" x="16" y="214" width="170" height="40" rx="6" />
            <text class="dg-t" x="101" y="231" text-anchor="middle">METADATA</text>
            <text class="dg-s" x="101" y="247" text-anchor="middle">TXT · PTR</text>
            <rect class="dg-box p" x="202" y="214" width="502" height="40" rx="6" />
            <text class="dg-s" x="216" y="231">TXT carries arbitrary strings, in practice SPF, DKIM and ownership proofs.</text>
            <text class="dg-s" x="216" y="247">PTR maps an address back to a name, and mail servers check it.</text>
            <path class="dg-line cyan" d="M186 50 H198" marker-end="url(#ah-dns4)" />
            <path class="dg-line cyan" d="M186 96 H198" marker-end="url(#ah-dns4)" />
            <path class="dg-line cyan" d="M186 142 H198" marker-end="url(#ah-dns4)" />
            <path class="dg-line cyan" d="M186 188 H198" marker-end="url(#ah-dns4)" />
            <path class="dg-line cyan" d="M186 234 H198" marker-end="url(#ah-dns4)" />
          </svg>
          <figcaption>Figure 4 — Five families of record. If you remember only the grouping and not the letters, you can still reason correctly about what DNS is capable of returning.</figcaption>
        </figure>
        <p>The full list with the design consequence of each, because that is what actually matters in an interview:</p>
        <table>
          <thead><tr><th>Type</th><th>Returns</th><th>Why it matters to a designer</th></tr></thead>
          <tbody>
            <tr><td><strong>A</strong></td><td>An IPv4 address</td><td>The workhorse. Multiple A records for one name is the basis of round-robin DNS.</td></tr>
            <tr><td><strong>AAAA</strong></td><td>An IPv6 address</td><td>Clients try both and race them (Happy Eyeballs), so a broken AAAA can add seconds of latency.</td></tr>
            <tr><td><strong>CNAME</strong></td><td>Another name</td><td>Lets you point at a provider's hostname and let them change addresses. Costs an extra lookup, and cannot exist at the apex or alongside other records.</td></tr>
            <tr><td><strong>ALIAS / ANAME</strong></td><td>Another name, flattened to A/AAAA at query time</td><td>A provider-specific fix for the apex problem: <code>example.com</code> can behave like a CNAME to a CDN hostname.</td></tr>
            <tr><td><strong>NS</strong></td><td>Name servers for a zone</td><td>The delegation mechanism. Changing these is how you migrate DNS providers — slowly, because registries cache them for days.</td></tr>
            <tr><td><strong>SOA</strong></td><td>Zone metadata and timers</td><td>Its serial drives zone transfers to secondaries; its minimum field sets how long NXDOMAIN is cached.</td></tr>
            <tr><td><strong>MX</strong></td><td>Mail exchangers with priorities</td><td>Priority gives you mail failover for free, which is the one place DNS-level failover genuinely works well.</td></tr>
            <tr><td><strong>TXT</strong></td><td>Free-form strings</td><td>Carries SPF, DKIM and DMARC policy, plus domain-ownership challenges. Large TXT sets are a common cause of oversized responses.</td></tr>
            <tr><td><strong>PTR</strong></td><td>A name, for an address</td><td>Reverse DNS under <code>in-addr.arpa</code>. Mail acceptance and log readability depend on it; nothing else does.</td></tr>
            <tr><td><strong>SRV</strong></td><td>Host, port, priority, weight</td><td>The only standard record that carries a port, which makes it a primitive service-discovery mechanism.</td></tr>
            <tr><td><strong>CAA</strong></td><td>Which CAs may issue certificates</td><td>A guard rail against mis-issuance; cheap to set and easy to forget when changing certificate providers.</td></tr>
          </tbody>
        </table>
        <p>A zone is just a file of these records. Here is a realistic one, with the choices annotated:</p>
        <pre><code>; zone: example.com
$TTL 3600                          ; default TTL for records below

@   IN SOA ns1.example.com. hostmaster.example.com. (
              2026091601           ; serial — bump on every edit
              7200                 ; refresh: secondary re-checks
              900                  ; retry after a failed check
              1209600              ; expire: stop serving if isolated
              3600 )               ; negative cache TTL for NXDOMAIN

@        IN NS    ns1.example.com.
@        IN NS    ns2.example.net.  ; second provider, different network

@        IN A     203.0.113.10      ; apex, long TTL: rarely moves
@        IN AAAA  2001:db8::10
www      IN CNAME example.com.

api   60 IN A     203.0.113.21      ; short TTL: we move this often
api   60 IN A     203.0.113.22      ; two records = round robin

@        IN MX    10 mx1.example.com.
@        IN MX    20 mx2.example.com.
@        IN TXT   "v=spf1 include:_spf.example.net -all"
@        IN CAA   0 issue "letsencrypt.org"
_sip._tcp IN SRV  10 60 5060 sip1.example.com.</code></pre>
        <p>Note the two deliberate decisions in there. The apex keeps the one-hour default TTL because it points at a stable address. The <code>api</code> records drop to 60 seconds because that is the name we expect to re-point during an incident, and we are willing to pay 60× more authoritative queries for that name in exchange for being able to move it quickly. Setting TTL per record, not per zone, is the single most useful DNS habit.</p>

        <h3 class="lesson-subhead" id="dns-requirements">Requirements for a naming system</h3>
        <p>Following the convention from <a href="/learn/modern-system-design/building-blocks">Chapter 6</a>, state the requirements before the design. DNS predates most of this vocabulary but fits it exactly.</p>
        <p><strong>Functional requirements.</strong></p>
        <ol class="lesson-checklist">
          <li>Given a name and a record type, return the current records for it, or a definitive &ldquo;this name does not exist&rdquo;.</li>
          <li>Let the owner of a name change its records without coordinating with anybody else.</li>
          <li>Let authority be delegated downward so no central party must approve every name.</li>
          <li>Support more than address lookup: mail routing, service location, policy and ownership assertions.</li>
        </ol>
        <p><strong>Non-functional requirements</strong>, using the characteristics from <a href="/learn/modern-system-design/non-functional-characteristics">Chapter 4</a>. These are where the interesting design pressure lives.</p>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>How DNS achieves it</th><th>What it gives up</th></tr></thead>
          <tbody>
            <tr><td><strong>Availability</strong></td><td>Effectively 100% — this is the hardest requirement in the system, because every other service depends on it</td><td>Hierarchy with no single owner; multiple NS records per zone; anycast for root and TLD; heavy client-side caching that keeps working during an outage</td><td>Nothing structural, but the availability is of the <em>system</em>, not of your zone — your own two name servers are still a weak link</td></tr>
            <tr><td><strong>Latency</strong></td><td>Single-digit milliseconds at the p50, under 100 ms cold</td><td>Caching at four layers; anycast puts a resolver and a root instance physically near everyone; UDP with no handshake</td><td>Cached answers are stale by up to one TTL</td></tr>
            <tr><td><strong>Scalability</strong></td><td>Trillions of queries per day, hundreds of millions of zones</td><td>Delegation means each server holds a tiny dataset; caching absorbs 95%+ of reads; the read path needs no coordination at all</td><td>Writes are slow to take effect everywhere</td></tr>
            <tr><td><strong>Consistency</strong></td><td>Eventual, deliberately</td><td>TTL-bounded staleness rather than invalidation; no attempt to push updates to caches</td><td>No read-your-writes: you can edit a record and still be served the old one by your own resolver</td></tr>
            <tr><td><strong>Integrity</strong></td><td>Answers should be provably authentic</td><td>DNSSEC signature chains from the root down</td><td>Optional, complex, under-deployed, and enlarges responses</td></tr>
          </tbody>
        </table>
        <p>Read that consistency row carefully, because it is the design decision that defines DNS. A system that wanted strongly consistent name lookups would have to invalidate caches on every change, which means tracking who holds a copy — impossible at internet scale with untrusted participants. DNS instead chose <strong>bounded staleness announced in advance</strong>: the record's owner declares how wrong a cached copy may be, and everyone respects that number. This is exactly the trade from <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a>, resolved at the extreme end in favour of availability and latency.</p>

        <h3 class="lesson-subhead" id="dns-estimation">Estimating the load on DNS</h3>
        <p>Following <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a>, one significant figure is plenty. The point of this arithmetic is not the totals; it is the ratios, which explain the whole architecture.</p>
        <pre><code>GLOBAL VOLUME — order of magnitude

internet users                        ~5 x 10^9
name lookups per user per day         ~1,000      (pages, apps, ads, telemetry)
raw lookups per day                   ~5 x 10^12

browser + OS cache hit rate           ~70%
  -> reaches a recursive resolver      ~1.5 x 10^12 / day
recursive resolver hit rate           ~90%
  -> reaches authoritative servers     ~1.5 x 10^11 / day
                                       ~2 x 10^6 queries/sec worldwide

So 97% of all DNS questions are answered by a cache.
The authoritative tier only ever sees the other 3%.


WHAT REACHES THE ROOT

a cold resolution needs one root query, but the root's
answer ("ask com") is cached by that resolver for 48 h.
resolvers worldwide                   ~10^7
root queries needed per resolver/day  ~ a few dozen TLDs
  -> real root load                    ~10^4 queries/sec

measured aggregate root load is ~10^5 queries/sec, i.e. an
order of magnitude more than legitimate demand — most root
traffic is misconfiguration, junk TLDs and leaked queries.


ONE BUSY SITE'S AUTHORITATIVE LOAD

page views                            10,000 /sec
distinct recursive resolvers seeing   ~50,000
  those users
TTL on the A record                   300 s

authoritative QPS = 50,000 / 300      ~170 /sec

Notice what is NOT in that formula: the 10,000 page views.
Double your users behind the same resolvers and authoritative
load does not move. Cut the TTL to 60 s and it goes to 830/sec.
TTL, not traffic, is the dial.


ZONE SIZE — WHY THIS IS AN EASY DATASET

records in a large SaaS zone          ~20,000
bytes per record on the wire          ~100 B
  -> zone data                         ~2 MB

Two megabytes, read two million times a second globally.
DNS is the most extreme read-heavy, tiny-dataset workload
in common use — which is precisely why it can be served from
memory by small machines at the edge of every network.</code></pre>
        <p>Those last two blocks together give you the two sentences worth remembering. Authoritative load scales with <em>resolvers ÷ TTL</em>, not with users. And the dataset is so small that the entire engineering problem is availability and geographic reach, not storage or compute.</p>
        <div class="lesson-callout"><strong>Where the estimate misleads.</strong> The 90% resolver hit rate is an average over all names. For a name with a 60-second TTL served to a global audience through tens of thousands of resolvers, the hit rate can fall below 50% and your authoritative tier suddenly matters a great deal. Any time you shorten a TTL for operational agility, redo this arithmetic — the load increase is linear in 1/TTL and people are routinely surprised by it.</div>
      `,
    },
    {
      id: 'dns-how',
      title: 'How the Domain Name System Works',
      children: [
        { id: 'dns-resolution', title: 'A cold resolution, step by step' },
        { id: 'dns-iterative', title: 'Iterative versus recursive queries' },
        { id: 'dns-caching', title: 'Caching, TTL and the propagation myth' },
        { id: 'dns-transport', title: 'On the wire: UDP, TCP and EDNS0' },
        { id: 'dns-steering', title: 'DNS as traffic-steering infrastructure' },
        { id: 'dns-security', title: 'Availability and security' },
        { id: 'dns-eval', title: 'Evaluation: where DNS falls short' },
      ],
      html: `
        <p>Section one established what DNS is for and what shape it has. This section is about mechanism: the exact sequence of messages, where the answers get cached, what the protocol looks like on the wire, and how all of that gets used — and abused — as an infrastructure control plane.</p>

        <h3 class="lesson-subhead" id="dns-resolution">A cold resolution, step by step</h3>
        <p>Assume nothing is cached anywhere, which in reality almost never happens. Follow a request for <code>api.shop.example.com</code> from a browser in Bengaluru.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 310" role="img" aria-label="Eight steps of a cold DNS resolution from browser cache through root, TLD and two authoritative servers back to the browser">
            <defs>
              <marker id="ah-dns5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">A COLD RESOLUTION OF api.shop.example.com</text>
            <rect class="dg-box c" x="16" y="32" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="52" text-anchor="middle">1 · browser cache</text>
            <rect class="dg-box c" x="224" y="32" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="52">Chrome and Firefox keep a small private cache. A hit costs 0 ms. We miss.</text>

            <rect class="dg-box c" x="16" y="66" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="86" text-anchor="middle">2 · OS stub resolver</text>
            <rect class="dg-box c" x="224" y="66" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="86">Checks the OS cache and the hosts file, then forwards one recursive query.</text>

            <rect class="dg-box b" x="16" y="100" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="120" text-anchor="middle">3 · recursive resolver</text>
            <rect class="dg-box b" x="224" y="100" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="120">Shared by thousands of users, so normally it hits. Today its cache is empty.</text>

            <rect class="dg-box p" x="16" y="134" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="154" text-anchor="middle">4 · root server</text>
            <rect class="dg-box p" x="224" y="134" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="154">Nearest anycast instance, ~5 ms away. Replies: I do not know, ask com.</text>

            <rect class="dg-box i" x="16" y="168" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="188" text-anchor="middle">5 · com TLD server</text>
            <rect class="dg-box i" x="224" y="168" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="188">Returns the NS records for example.com plus their glue addresses. ~20 ms.</text>

            <rect class="dg-box g" x="16" y="202" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="222" text-anchor="middle">6 · example.com server</text>
            <rect class="dg-box g" x="224" y="202" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="222">shop is a delegated sub-zone, so this returns another referral, not an answer.</text>

            <rect class="dg-box g" x="16" y="236" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="256" text-anchor="middle">7 · shop.example.com</text>
            <rect class="dg-box g" x="224" y="236" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="256">Authoritative at last: A 203.0.113.9, TTL 300. The resolver caches it.</text>

            <rect class="dg-box y" x="16" y="270" width="200" height="30" rx="6" />
            <text class="dg-s" x="116" y="290" text-anchor="middle">8 · answer returns</text>
            <rect class="dg-box y" x="224" y="270" width="480" height="30" rx="6" />
            <text class="dg-s" x="238" y="290">Resolver to stub to browser, each caching on the way. Total roughly 60 ms.</text>
            <path class="dg-line hot" d="M216 47 H220" marker-end="url(#ah-dns5)" />
            <path class="dg-line hot" d="M216 285 H220" marker-end="url(#ah-dns5)" />
          </svg>
          <figcaption>Figure 5 — Eight steps, four of them network round trips. The second request for anything under <code>shop.example.com</code> from the same resolver skips steps 4 through 6 entirely, and for the next 300 seconds skips step 7 too.</figcaption>
        </figure>
        <p>Three details in that walkthrough are worth pulling out.</p>
        <p>First, <strong>the resolver, not the client, does the walking</strong>. The browser asked one question and got one answer. Everything between steps 4 and 7 was invisible to it. This is why a laptop needs essentially no DNS logic.</p>
        <p>Second, <strong>every intermediate answer is cached independently</strong>, with its own TTL. The root's &ldquo;ask com&rdquo; referral has a TTL measured in days. The <code>example.com</code> NS records typically have a TTL of a day or two. Only the final A record has the short TTL you chose. So the expensive part of that walk amortises across every name in <code>com</code> that the resolver ever looks up.</p>
        <p>Third, <strong>a warm resolution is a completely different animal</strong>. Steps 1 to 3 with a hit costs well under a millisecond. Mature resolvers serve the overwhelming majority of queries this way, which is why the median DNS lookup in the wild is a few milliseconds while the cold path is closer to 60.</p>
        <p>One more case deserves mention: the negative answer. If the name does not exist, the authoritative server returns NXDOMAIN, and that <em>absence</em> is cached too, for the duration in the SOA record's minimum field. This is a real design detail with real consequences — create a new subdomain after something has already queried it and you may wait out the negative cache before it resolves, which is a frequent and baffling deployment surprise.</p>

        <h3 class="lesson-subhead" id="dns-iterative">Iterative versus recursive queries</h3>
        <p>The same walk contains two different query styles, and the distinction is a classic interview question because it exposes whether you understand who is doing the work.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 246" role="img" aria-label="Recursive queries compared with iterative queries, showing who does the work in each case">
            <defs>
              <marker id="ah-dns6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="344" height="220" rx="11" />
            <text class="dg-h" x="26" y="36">RECURSIVE QUERY</text>
            <text class="dg-s" x="26" y="56">&ldquo;Get me the answer. I will wait.&rdquo;</text>
            <rect class="dg-box b" x="26" y="66" width="316" height="26" rx="6" />
            <text class="dg-s" x="184" y="83" text-anchor="middle">stub → resolver</text>
            <text class="dg-s" x="26" y="110">· the receiver takes on the whole job</text>
            <text class="dg-s" x="26" y="128">· the asker gets one answer or one error</text>
            <text class="dg-s" x="26" y="146">· used between stub and recursive resolver</text>
            <text class="dg-s" x="26" y="164">· the resolver must keep state and a cache</text>
            <text class="dg-s" x="26" y="182">· one round trip from the client's point of view</text>
            <text class="dg-s" x="26" y="206">This is why your laptop needs almost no DNS</text>
            <text class="dg-s" x="26" y="222">logic at all — it delegates the hard part.</text>

            <rect class="dg-band y" x="368" y="16" width="340" height="220" rx="11" />
            <text class="dg-h" x="382" y="36">ITERATIVE QUERY</text>
            <text class="dg-s" x="382" y="56">&ldquo;Tell me what you know. I will keep going.&rdquo;</text>
            <rect class="dg-box y" x="382" y="66" width="312" height="26" rx="6" />
            <text class="dg-s" x="538" y="83" text-anchor="middle">resolver → root → TLD → auth</text>
            <text class="dg-s" x="382" y="110">· each server answers only from its own zone</text>
            <text class="dg-s" x="382" y="128">· a referral, not an answer: ask these servers</text>
            <text class="dg-s" x="382" y="146">· used between resolver and the name servers</text>
            <text class="dg-s" x="382" y="164">· root and TLD servers never recurse for you</text>
            <text class="dg-s" x="382" y="182">· several round trips, but each one is cheap</text>
            <text class="dg-s" x="382" y="206">Refusing to recurse is what keeps the root</text>
            <text class="dg-s" x="382" y="222">tier small enough to actually be operable.</text>
            <path class="dg-line violet" d="M356 122 H364" marker-end="url(#ah-dns6)" />
          </svg>
          <figcaption>Figure 6 — Two query styles in one resolution. The first hop is recursive, every hop after it is iterative; a server that recursed on behalf of strangers would be doing unbounded work for anyone who asked.</figcaption>
        </figure>
        <p>That last point is not merely architectural tidiness. A server that performs recursion for arbitrary clients is an <strong>open resolver</strong>, and open resolvers are the fuel for DNS amplification attacks: a small spoofed query produces a large response aimed at a victim. Root and TLD servers refuse recursion; well-run recursive resolvers restrict it to their own network or, like the public resolvers, invest heavily in rate limiting and anycast capacity to absorb abuse.</p>
        <table>
          <thead><tr><th></th><th>Recursive</th><th>Iterative</th></tr></thead>
          <tbody>
            <tr><td>Who does the work</td><td>The server being asked</td><td>The client doing the asking</td></tr>
            <tr><td>What comes back</td><td>The final answer, or an error</td><td>A referral to servers one level closer</td></tr>
            <tr><td>Round trips for the asker</td><td>One</td><td>One per level of the tree</td></tr>
            <tr><td>State and cache required</td><td>On the server</td><td>On the client</td></tr>
            <tr><td>Typical participants</td><td>Stub → recursive resolver</td><td>Recursive resolver → root, TLD, authoritative</td></tr>
            <tr><td>Risk if offered to strangers</td><td>Amplification abuse, unbounded work</td><td>Essentially none</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="dns-caching">Caching, TTL and the propagation myth</h3>
        <p>Caching is not an optimisation bolted onto DNS. It is the mechanism that makes the design viable, and it exists at four layers, each with its own rules.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 244" role="img" aria-label="Four layers of DNS caching from the browser through the OS stub and recursive resolver to the authoritative server">
            <defs>
              <marker id="ah-dns7" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">FOUR CACHES BEFORE THE AUTHORITATIVE SERVER</text>
            <rect class="dg-box c" x="16" y="32" width="688" height="44" rx="7" />
            <text class="dg-t" x="30" y="52">BROWSER CACHE</text>
            <text class="dg-s" x="210" y="52">60 s to a few minutes</text>
            <text class="dg-s" x="410" y="52">per process, invisible to the OS</text>
            <text class="dg-s" x="30" y="69">in Chrome, Firefox</text>
            <text class="dg-s" x="210" y="69">hit cost: ~0 ms</text>
            <text class="dg-s" x="410" y="69">clearing it needs a restart or a flush</text>

            <rect class="dg-box b" x="16" y="84" width="688" height="44" rx="7" />
            <text class="dg-t" x="30" y="104">OS STUB CACHE</text>
            <text class="dg-s" x="210" y="104">honours the record TTL</text>
            <text class="dg-s" x="410" y="104">shared by every app on the machine</text>
            <text class="dg-s" x="30" y="121">systemd-resolved</text>
            <text class="dg-s" x="210" y="121">hit cost: ~0.1 ms</text>
            <text class="dg-s" x="410" y="121">often flushed on a network change</text>

            <rect class="dg-box g" x="16" y="136" width="688" height="44" rx="7" />
            <text class="dg-t" x="30" y="156">RECURSIVE CACHE</text>
            <text class="dg-s" x="210" y="156">honours the record TTL</text>
            <text class="dg-s" x="410" y="156">shared by thousands, so hit rate is high</text>
            <text class="dg-s" x="30" y="173">ISP or 1.1.1.1</text>
            <text class="dg-s" x="210" y="173">hit cost: 1 to 30 ms</text>
            <text class="dg-s" x="410" y="173">this layer absorbs most of the world load</text>

            <rect class="dg-box y" x="16" y="188" width="688" height="44" rx="7" />
            <text class="dg-t" x="30" y="208">AUTHORITATIVE</text>
            <text class="dg-s" x="210" y="208">the source of truth</text>
            <text class="dg-s" x="410" y="208">reached only on a miss at every layer</text>
            <text class="dg-s" x="30" y="225">your DNS provider</text>
            <text class="dg-s" x="210" y="225">cost: 20 to 150 ms</text>
            <text class="dg-s" x="410" y="225">typically under 3% of all queries</text>
            <path class="dg-line green dash" d="M360 76 V82" marker-end="url(#ah-dns7)" />
            <path class="dg-line green dash" d="M360 128 V134" marker-end="url(#ah-dns7)" />
            <path class="dg-line green dash" d="M360 180 V186" marker-end="url(#ah-dns7)" />
          </svg>
          <figcaption>Figure 7 — The cache stack. Only the bottom row is under your control, which is the uncomfortable fact behind every &ldquo;why has my DNS change not taken effect&rdquo; conversation.</figcaption>
        </figure>
        <p><strong>TTL semantics</strong> are simple to state and easy to get wrong. The TTL you publish is not a refresh schedule; it is a permission slip. It says: any cache may serve this answer without re-asking for up to this many seconds. A cache that received the record 299 seconds into a 300-second TTL will serve it for one more second; a cache that received it a moment ago will serve it for 300. So after you change a record, the worst-case window during which someone is still being served the old value is one full TTL — and the average is half of that.</p>
        <p>Worse, the guarantee is one-directional. You can ask caches to hold an answer for a long time, but you cannot force them to hold it for a short time. Some resolvers clamp very low TTLs upward to protect themselves; some middleboxes and cheap CPE routers ignore TTLs entirely and cache until reboot; some applications resolve a hostname once at startup and hold the address for the life of the process. That last one is the most common and most damaging: a JVM with the wrong security setting will cache a DNS answer forever, which is why plenty of production systems keep talking to a decommissioned address for days.</p>
        <p>This leads directly to the myth. There is no such thing as <strong>DNS propagation</strong>. Nothing is pushed anywhere. Your authoritative record changes instantly, and the old value simply persists in caches until each one's independent timer expires. &ldquo;Propagation takes 48 hours&rdquo; is really &ldquo;somebody set a 48-hour TTL&rdquo;, and the remedy is to lower the TTL <em>before</em> the change, wait one old-TTL period for the low value to spread, then make the change.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 258" role="img" aria-label="Short TTL and long TTL compared, and the consequence for using DNS as a failover mechanism">
            <defs>
              <marker id="ah-dns8" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">TTL IS A BET ON HOW SOON YOU WILL CHANGE YOUR MIND</text>
            <rect class="dg-band g" x="12" y="32" width="344" height="110" rx="11" />
            <text class="dg-h" x="26" y="52">SHORT TTL · 60 s</text>
            <text class="dg-s" x="26" y="72">✓ a record change takes effect in about a minute</text>
            <text class="dg-s" x="26" y="90">✗ far more queries reach your authoritative tier</text>
            <text class="dg-s" x="26" y="108">✗ every miss adds latency before the first byte</text>
            <text class="dg-s" x="26" y="126">✗ a provider outage hurts you almost at once</text>

            <rect class="dg-band y" x="368" y="32" width="340" height="110" rx="11" />
            <text class="dg-h" x="382" y="52">LONG TTL · 24 h</text>
            <text class="dg-s" x="382" y="72">✓ almost every query is served from a cache</text>
            <text class="dg-s" x="382" y="90">✓ your name servers can be down for hours</text>
            <text class="dg-s" x="382" y="108">✗ a planned change takes a day to be universal</text>
            <text class="dg-s" x="382" y="126">✗ useless as an incident-response tool</text>

            <rect class="dg-band r" x="12" y="154" width="696" height="96" rx="11" />
            <text class="dg-h" x="26" y="174">THE CONSEQUENCE PEOPLE GET WRONG</text>
            <text class="dg-s" x="26" y="196">DNS is not a fast failover mechanism. Publish a TTL of 3600, change the record, and some resolvers keep sending users</text>
            <text class="dg-s" x="26" y="214">to the dead address for the next hour — while a few ignore the TTL and do it for much longer. Reach for a load balancer</text>
            <text class="dg-s" x="26" y="232">or anycast when you need sub-second failover, and use DNS for the changes you can afford to schedule.</text>
          </svg>
          <figcaption>Figure 8 — The TTL trade-off. The second tick on the right is genuinely useful during an incident: with a long TTL, an authoritative outage is invisible until caches start expiring.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>The pattern that actually works.</strong> Keep a moderate TTL (300 to 3600 s) in steady state, and treat lowering it as a deliberate pre-migration step: drop to 60 s, wait out the old TTL, do the migration, then raise it again a day later. If you need failover faster than that, the answer is never a smaller TTL — it is to point DNS at a stable anycast or virtual IP and let the layer behind it move the traffic. DNS should name a <em>stable entry point</em>, not a specific server.</div>

        <h3 class="lesson-subhead" id="dns-transport">On the wire: UDP, TCP and EDNS0</h3>
        <p>DNS runs on port 53, and classically over UDP. That choice is deliberate and still mostly right: a query and its answer each fit in one packet, so a connection handshake would double or triple the latency of the most latency-sensitive lookup on the internet. UDP gives you a one-packet-out, one-packet-back exchange with no setup cost, and the application layer handles retries by simply asking again, possibly of a different server.</p>
        <p>The cost of that choice is a size ceiling and no connection state to authenticate against. Original DNS capped UDP messages at 512 bytes. If a response did not fit, the server set the <em>truncated</em> (TC) bit and the resolver retried the whole query over TCP on the same port — a second, much more expensive round trip.</p>
        <p>512 bytes stopped being enough once zones started carrying IPv6 addresses, long TXT records and DNSSEC signatures. <strong>EDNS0</strong> is the extension mechanism that fixed it: the client advertises a larger UDP buffer it is willing to receive, commonly 4096 bytes historically and 1232 bytes under current guidance, and the server may fill it. EDNS0 also carries option codes, which is how features like client-subnet hints get added without a new protocol.</p>
        <table>
          <thead><tr><th>Transport</th><th>When used</th><th>Cost</th><th>Gotcha</th></tr></thead>
          <tbody>
            <tr><td><strong>UDP 53</strong></td><td>The default for essentially every query</td><td>One round trip, no handshake</td><td>Spoofable; size limited; a lost packet costs a full timeout</td></tr>
            <tr><td><strong>TCP 53</strong></td><td>Truncated responses, zone transfers (AXFR/IXFR)</td><td>Handshake plus the query: 2 to 3× the latency</td><td>Firewalls that only allow UDP 53 break large responses in ways that look like random failures</td></tr>
            <tr><td><strong>EDNS0</strong></td><td>Negotiating larger UDP payloads and options</td><td>A few extra bytes per query</td><td>Broken middleboxes drop EDNS0 packets, forcing slow fallback</td></tr>
            <tr><td><strong>DoT — TLS on 853</strong></td><td>Stub to resolver, privacy</td><td>TLS handshake, amortised over a kept-alive connection</td><td>A distinct port is easy for a network to block</td></tr>
            <tr><td><strong>DoH — HTTPS on 443</strong></td><td>Stub or browser to resolver, privacy</td><td>HTTP framing overhead</td><td>Indistinguishable from web traffic, which is the point and also the objection</td></tr>
          </tbody>
        </table>
        <p>Why 1232 bytes is the modern recommendation is a nice piece of practical engineering. Large UDP responses get fragmented at the IP layer, and fragmented UDP is unreliable across the real internet — firewalls drop non-initial fragments, and fragment reassembly is itself a spoofing vector. Keeping DNS responses under the smallest plausible path MTU avoids the whole class of problem, and anything genuinely larger falls back to TCP where a stream can be reassembled safely.</p>

        <h3 class="lesson-subhead" id="dns-steering">DNS as traffic-steering infrastructure</h3>
        <p>So far DNS has been a lookup. The more interesting use is as a control plane: because the resolver asks <em>you</em> for the answer, and because you can vary that answer per asker, DNS becomes the first and coarsest layer of load distribution in a global system.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 246" role="img" aria-label="Three DNS traffic steering strategies: round robin, geographic or latency based, and weighted records">
            <defs>
              <marker id="ah-dns9" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">THE SAME NAME CAN ANSWER DIFFERENTLY PER ASKER</text>
            <rect class="dg-band b" x="12" y="32" width="228" height="206" rx="11" />
            <text class="dg-h" x="26" y="52">ROUND ROBIN</text>
            <rect class="dg-box b" x="26" y="62" width="200" height="24" rx="5" />
            <text class="dg-s" x="126" y="79" text-anchor="middle">3 A records, rotated</text>
            <text class="dg-s" x="26" y="106">· crude, free, universal</text>
            <text class="dg-s" x="26" y="124">· ignores server load</text>
            <text class="dg-s" x="26" y="142">· clients may reorder</text>
            <text class="dg-s" x="26" y="160">· caching skews the split</text>
            <text class="dg-s" x="26" y="184">Fine for coarse spreading,</text>
            <text class="dg-s" x="26" y="200">never for real balancing.</text>
            <text class="dg-s" x="26" y="224">Use only with equal hosts.</text>

            <rect class="dg-band g" x="248" y="32" width="228" height="206" rx="11" />
            <text class="dg-h" x="262" y="52">GEO / LATENCY</text>
            <rect class="dg-box g" x="262" y="62" width="200" height="24" rx="5" />
            <text class="dg-s" x="362" y="79" text-anchor="middle">answer by client region</text>
            <text class="dg-s" x="262" y="106">· EU users to Frankfurt</text>
            <text class="dg-s" x="262" y="124">· US users to Virginia</text>
            <text class="dg-s" x="262" y="142">· latency beats geography</text>
            <text class="dg-s" x="262" y="160">· resolver IP is a proxy</text>
            <text class="dg-s" x="262" y="184">ECS passes the client</text>
            <text class="dg-s" x="262" y="200">subnet, so the guess is</text>
            <text class="dg-s" x="262" y="224">less wrong. Still a guess.</text>

            <rect class="dg-band y" x="484" y="32" width="224" height="206" rx="11" />
            <text class="dg-h" x="498" y="52">WEIGHTED</text>
            <rect class="dg-box y" x="498" y="62" width="196" height="24" rx="5" />
            <text class="dg-s" x="596" y="79" text-anchor="middle">90% old, 10% new</text>
            <text class="dg-s" x="498" y="106">· canary releases</text>
            <text class="dg-s" x="498" y="124">· migrating regions</text>
            <text class="dg-s" x="498" y="142">· draining a datacentre</text>
            <text class="dg-s" x="498" y="160">· cost-based steering</text>
            <text class="dg-s" x="498" y="184">Granularity is limited</text>
            <text class="dg-s" x="498" y="200">by how many resolvers</text>
            <text class="dg-s" x="498" y="224">cache you, not by weight.</text>
            <path class="dg-line cyan" d="M240 122 H244" marker-end="url(#ah-dns9)" />
            <path class="dg-line cyan" d="M476 122 H480" marker-end="url(#ah-dns9)" />
          </svg>
          <figcaption>Figure 9 — Three steering strategies. All three share one limitation: the unit of decision is a resolver's cached answer, not a request, so none of them can react to per-request conditions.</figcaption>
        </figure>
        <p><strong>Round-robin DNS</strong> is the oldest trick: publish several A records and return them in rotating order. It costs nothing and works everywhere, and it is a genuinely bad load balancer. It has no idea which servers are healthy or busy, clients and resolvers reorder the list as they please, and one popular resolver caching one ordering can send a disproportionate share of traffic to a single host. Use it to spread traffic across identical front doors, not to balance load.</p>
        <p><strong>Weighted records</strong> let a managed DNS provider return answers in a chosen ratio. This is how a cross-region migration or a canary gets driven at the DNS layer: shift 1%, watch, shift 10%, watch, shift the rest. The weights are approximate because caching quantises them, so treat them as a coarse dial and not a precise one.</p>
        <p><strong>GeoDNS</strong> answers based on where the asker appears to be, and <strong>latency-based routing</strong> answers based on measured round-trip times from that network to each of your regions rather than on geography. Latency routing is almost always the better of the two, because network distance and physical distance diverge constantly — a user in a city can be three network hops from a different continent's edge.</p>
        <p>Both suffer the same structural flaw: the authoritative server sees the <em>resolver's</em> address, not the user's. A user in Mumbai using a resolver anchored in Virginia will look American. <strong>EDNS Client Subnet (ECS)</strong> patches this by having the resolver forward a truncated prefix of the client's address, which restores accuracy at the cost of leaking a little location data and multiplying the resolver's cache keys.</p>
        <p><strong>Anycast</strong> is the other half of the picture, and it works at the routing layer rather than the DNS layer. The same IP address is announced via BGP from many locations, and the network delivers each packet to whichever announcement is closest by routing metric. Root and TLD servers use it to be both fast and enormously DDoS-resistant: attack traffic is absorbed by whichever instance is nearest the attacker instead of converging on one site. Anycast also gives you the fast failover that DNS cannot — withdraw a BGP announcement and traffic reroutes in seconds, with no cache to wait for.</p>
        <p>Managed DNS providers expose all of this as configuration. A representative control-plane API, in the style of the interface sketches this course uses:</p>
        <pre><code>PUT /v1/zones/example.com/records/api
{
  "name": "api.example.com",
  "type": "A",
  "ttl": 60,
  "policy": "latency",              // simple | weighted | geo | latency | failover
  "health_check": {
    "path": "/healthz",             // deep check, not a static 200
    "interval_s": 10,
    "unhealthy_after": 3,           // ~30 s to detect
    "protocol": "https"
  },
  "targets": [
    { "region": "ap-south-1",    "value": "203.0.113.21",  "weight": 100 },
    { "region": "eu-central-1",  "value": "198.51.100.21", "weight": 100 },
    { "region": "us-east-1",     "value": "192.0.2.21",    "weight": 0 }
  ]
}

200 OK
{ "serial": 2026091604, "propagated_to_edge_s": 5, "worst_case_client_s": 60 }

# worst_case_client_s = ttl. The edge updates in seconds;
# clients keep the old answer for up to a full TTL.</code></pre>
        <p>Two things to notice in that response body. The provider can tell you when <em>its</em> servers have the new answer, and that number is small. It cannot tell you when clients will have it, so it can only report the TTL as a bound. And the <code>weight: 0</code> target is a drained region: still configured, deliberately receiving nothing, ready to take traffic by a one-line change.</p>
        <p>The health check block is where DNS-level failover lives, and it is worth being clear about what it buys. The provider probes your endpoints and stops returning unhealthy ones. Detection takes tens of seconds, the answer change takes effect over a TTL, and stubborn clients take longer. Best case, DNS failover is a minute; realistically several. That is fine for &ldquo;region us-east-1 is gone&rdquo; and useless for &ldquo;one server crashed&rdquo;, which is exactly the division of labour between DNS and the load balancers of <a href="/learn/modern-system-design/load-balancers">Chapter 8</a>.</p>

        <h3 class="lesson-subhead" id="dns-security">Availability and security</h3>
        <p>DNS has to be more available than anything that depends on it, which is everything. The mechanisms are unglamorous and layered.</p>
        <p><strong>Redundancy by design.</strong> A zone must list at least two NS records, and good practice is to put them on different networks, ideally with two independent providers. Secondary servers pull the zone from a primary via AXFR (full) or IXFR (incremental) transfers, triggered by the SOA serial changing or by a NOTIFY message. If the primary is unreachable, secondaries keep serving until the SOA expire timer runs out — which is typically two weeks, a deliberately generous window.</p>
        <p><strong>Anycast plus multiple operators.</strong> The root has 13 server names run by 12 independent organisations, with well over 1,500 anycast instances. No single operator, network, country or software bug can take the root down, and any resolver that can reach one instance of one name can make progress.</p>
        <p><strong>Cache as a shock absorber.</strong> The most underrated availability property: during an authoritative outage, every cached answer keeps working. A zone with hour-long TTLs can survive a total name-server outage for the better part of an hour with most users unaffected. This is the one situation where a long TTL is an operational gift.</p>
        <p>Security is the weaker story, because DNS was designed in an era of mutual trust. Three problems and their answers:</p>
        <p><strong>Spoofing and cache poisoning.</strong> A UDP response is accepted if it matches the query's 16-bit transaction ID, source port and question. An attacker who can guess those, or who simply floods guesses faster than the real answer arrives, can inject a forged record into a resolver's cache — and then every user of that resolver goes to the attacker's address. The 2008 Kaminsky work showed this was far more practical than assumed, and the mitigations deployed since are all about raising the guessing cost: randomising source ports, randomising the case of the query name so the response must echo it (0x20 encoding), and rate-limiting oddities. These make attacks harder, not impossible.</p>
        <p><strong>DNSSEC</strong> is the real fix: authoritative servers sign their records, and a resolver validates a signature chain that runs from the root's key down through each delegation. A forged record fails validation and is discarded. It provides authenticity and integrity — but not confidentiality; signed answers are still sent in the clear. Adoption remains low because the operational burden is real: key generation and rollover, keeping signatures fresh, DS records correct at the parent, and every one of those a way to take your zone completely offline through a mistake rather than an attack. Signed responses are also much larger, which worsens both fragmentation and amplification-attack leverage.</p>
        <p><strong>DoH and DoT</strong> address a different problem: privacy. Classic DNS is plaintext, so anyone on the path — your ISP, a café network, a national filter — can see and modify every name you look up. DNS over TLS (port 853) and DNS over HTTPS (port 443) encrypt the stub-to-resolver hop.</p>
        <table>
          <thead><tr><th></th><th>What it protects</th><th>What it does not</th><th>The objection</th></tr></thead>
          <tbody>
            <tr><td><strong>DNSSEC</strong></td><td>Authenticity of the answer, end to end</td><td>Confidentiality — queries and answers stay readable</td><td>Operationally fragile; large responses; low deployment</td></tr>
            <tr><td><strong>DoT</strong></td><td>Confidentiality of the stub-to-resolver hop</td><td>The resolver-to-authoritative hops; the resolver itself sees everything</td><td>A dedicated port is trivially blocked or forced open</td></tr>
            <tr><td><strong>DoH</strong></td><td>The same hop, hidden inside ordinary HTTPS</td><td>The same gaps as DoT</td><td>Bypasses network policy, breaks split-horizon DNS, and centralises visibility in a handful of providers</td></tr>
          </tbody>
        </table>
        <p>The privacy trade-off deserves stating plainly, because it is a genuine design tension rather than a settled question. Encrypting to a large public resolver takes your query history away from your network operator and hands it to that resolver's operator. It also breaks things that legitimately depend on seeing DNS: corporate split-horizon zones that resolve internal names differently, malware blocking at the network layer, and parental filtering. A design that enables DoH by default has made a policy decision, not just a security improvement.</p>

        <h3 class="lesson-subhead" id="dns-eval">Evaluation: where DNS falls short</h3>
        <p>Per the convention from <a href="/learn/modern-system-design/building-blocks">Chapter 6</a>, criticise the design. DNS meets its requirements remarkably well, and it has five real weaknesses.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 264" role="img" aria-label="Five ways DNS failure takes down otherwise healthy systems, with the consequence of each">
            <defs>
              <marker id="ah-dns10" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <text class="dg-h" x="16" y="22">WHEN DNS FAILS, EVERYTHING LOOKS BROKEN AT ONCE</text>
            <rect class="dg-box r" x="16" y="32" width="248" height="40" rx="6" />
            <text class="dg-s" x="140" y="49" text-anchor="middle">registrar or registry problem</text>
            <text class="dg-s" x="140" y="65" text-anchor="middle">expired domain, locked account</text>
            <rect class="dg-box y" x="272" y="32" width="432" height="40" rx="6" />
            <text class="dg-s" x="286" y="49">The delegation itself vanishes. Nothing you control fixes it, and</text>
            <text class="dg-s" x="286" y="65">caches drain within hours. Whole companies have gone dark this way.</text>

            <rect class="dg-box r" x="16" y="78" width="248" height="40" rx="6" />
            <text class="dg-s" x="140" y="95" text-anchor="middle">authoritative provider outage</text>
            <text class="dg-s" x="140" y="111" text-anchor="middle">DDoS, bad config push, BGP slip</text>
            <rect class="dg-box y" x="272" y="78" width="432" height="40" rx="6" />
            <text class="dg-s" x="286" y="95">Cached answers keep working until their TTL expires, then traffic</text>
            <text class="dg-s" x="286" y="111">falls off a cliff. Here a long TTL is briefly your best friend.</text>

            <rect class="dg-box r" x="16" y="124" width="248" height="40" rx="6" />
            <text class="dg-s" x="140" y="141" text-anchor="middle">public resolver outage</text>
            <text class="dg-s" x="140" y="157" text-anchor="middle">8.8.8.8 or 1.1.1.1 unreachable</text>
            <rect class="dg-box y" x="272" y="124" width="432" height="40" rx="6" />
            <text class="dg-s" x="286" y="141">Users who configured one resolver see total failure while their</text>
            <text class="dg-s" x="286" y="157">neighbours are fine. Tickets look random and defy reproduction.</text>

            <rect class="dg-box r" x="16" y="170" width="248" height="40" rx="6" />
            <text class="dg-s" x="140" y="187" text-anchor="middle">a dependency cannot be resolved</text>
            <text class="dg-s" x="140" y="203" text-anchor="middle">your own service is perfectly fine</text>
            <rect class="dg-box y" x="272" y="170" width="432" height="40" rx="6" />
            <text class="dg-s" x="286" y="187">Your app is up but cannot find its database, queue or payment</text>
            <text class="dg-s" x="286" y="203">provider. Cache in-process and fail open where correctness allows.</text>

            <rect class="dg-box r" x="16" y="216" width="248" height="40" rx="6" />
            <text class="dg-s" x="140" y="233" text-anchor="middle">TTL too long during an incident</text>
            <text class="dg-s" x="140" y="249" text-anchor="middle">the record is right, the users are not</text>
            <rect class="dg-box y" x="272" y="216" width="432" height="40" rx="6" />
            <text class="dg-s" x="286" y="233">You corrected the record ten minutes ago and half your traffic</text>
            <text class="dg-s" x="286" y="249">still goes to the dead host. That fix is architectural, not manual.</text>
            <path class="dg-line rose" d="M264 52 H268" marker-end="url(#ah-dns10)" />
            <path class="dg-line rose" d="M264 236 H268" marker-end="url(#ah-dns10)" />
          </svg>
          <figcaption>Figure 10 — Five DNS failure patterns. The fourth row is the one teams forget: your service being healthy is irrelevant if it cannot resolve the names of the things it depends on.</figcaption>
        </figure>
        <p><strong>1. It is a single point of failure for everything above it.</strong> Every dependency in your system is reached by name, so a DNS failure is indistinguishable from a total outage while being invisible to your own health checks. The 2016 attack on the Dyn DNS service is the canonical public example: the affected sites were up the whole time and nobody could reach them. Mitigations are all about removing the single point — two providers with independent networks, a registrar lock and long-dated renewal on the domain itself, in-process caching with stale-if-error behaviour for internal dependencies, and monitoring that resolves your own names from outside your network.</p>
        <p><strong>2. Failover is slow and not fully under your control.</strong> Detection plus TTL plus misbehaving clients puts realistic DNS failover in the minutes, with a long tail of clients that never move. Anything needing faster must be handled below DNS by anycast withdrawal or a load balancer.</p>
        <p><strong>3. Load balancing at the DNS layer is blind.</strong> The authoritative server decides once per cached answer, for a resolver rather than a user, with no knowledge of request cost, server load or connection count. It cannot do least-connections, cannot do session affinity and cannot shed load. Use it to pick a region; use a real balancer to pick a server.</p>
        <p><strong>4. Client behaviour is unverifiable.</strong> You cannot enumerate your caches, cannot invalidate them, and cannot force a TTL to be honoured. Every other cache in this course gives you at least some invalidation lever; DNS gives you none. Design as if some fraction of clients will hold any answer you ever published, indefinitely.</p>
        <p><strong>5. Security is opt-in and awkward.</strong> Plain DNS is unauthenticated and unencrypted. DNSSEC fixes authenticity at real operational cost and is still a minority deployment; DoH and DoT fix one hop of confidentiality while relocating trust to a large provider. There is no configuration that gives you authenticity, confidentiality and simplicity at once.</p>
        <p>None of this makes DNS a bad design — it is arguably the most successful distributed system ever built, and all five weaknesses are direct consequences of the choices that made it succeed. Hierarchical delegation bought scale and cost you central control. Aggressive caching bought availability and latency and cost you the ability to change your mind quickly. Trust-by-default bought simplicity and cost you security. That pattern — every strength paid for with a matching weakness — is the thing to carry into the next chapter.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> Four questions to answer without looking back. Why does authoritative query load depend on your TTL and the number of resolvers rather than on your number of users? What exactly happens between changing a record and the last user seeing the change, and why can you not shorten it after the fact? Where in a resolution is the query recursive and where is it iterative, and what would go wrong if a root server recursed for you? And if you must survive a whole region failing in under a second, why is DNS the wrong tool, and what replaces it? If the last one is fuzzy, Chapter 8 on load balancers answers it directly.</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. DNS hierarchy, resolution, record types, caching, anycast, DNSSEC and encrypted transports are standard, widely documented internet infrastructure; all framing, explanations, diagrams, tables, estimates and exercises here are our own.',
};
