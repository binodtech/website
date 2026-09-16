/** Modern System Design — Chapter 33: Design a Web Crawler.
 *  Politeness, the URL frontier, freshness, and why crawling is a distributed
 *  scheduling problem rather than a fetching problem.
 */

export const msdWebCrawler = {
  slug: 'web-crawler',
  title: 'Design a Web Crawler',
  subtitle:
    'A crawler looks like a loop that fetches pages and follows links. At the scale of the public web it is a distributed scheduler whose real constraints are politeness, freshness, the size of the URL frontier, and not getting yourself banned — fetching is the easy part.',
  byline: 'Modern System Design · Chapter 33 · ~1h 40m read · Advanced',
  interviewTip:
    'The question that catches people is "how do you not take a site down". A crawler that is polite per host — one in-flight request, a crawl-delay honoured, robots.txt respected — and impolite in aggregate (thousands of hosts in parallel) is the right shape. Candidates who parallelise across URLs without a per-host cap have designed a distributed denial of service, not a crawler. The second tell is having a story for the frontier: at hundreds of billions of URLs it cannot be "a queue in Redis".',
  sections: [
    {
      id: 'design',
      title: 'System Design: Web Crawler',
      children: [
        { id: 'wc-problem', title: 'What a crawler is for' },
        { id: 'wc-req', title: 'Requirements' },
        { id: 'wc-est', title: 'Estimation' },
        { id: 'wc-loop', title: 'The crawl loop' },
        { id: 'wc-frontier', title: 'The URL frontier' },
        { id: 'wc-polite', title: 'Politeness, robots.txt and per-host caps' },
        { id: 'wc-dedup', title: 'Seen URLs and content fingerprinting' },
        { id: 'wc-fresh', title: 'Freshness and recrawl scheduling' },
        { id: 'wc-eval', title: 'Evaluation' },
      ],
      html: `
        <p>A web crawler discovers and fetches pages so something else can use them — a search index, an archive, a training corpus, a price tracker. The public description is a loop: take a URL, fetch it, extract links, enqueue the new ones, repeat. That description is accurate and almost completely unhelpful at scale, because none of the hard problems are in the fetching.</p>

        <h3 class="lesson-subhead" id="wc-problem">What a crawler is for</h3>
        <p>The web is not a dataset you are given. It is a graph you have to walk, with no complete map, adversarial hosts, vanishing pages, and an implicit social contract that you will not be a nuisance. A crawler is the system that walks that graph continuously and produces a reasonably fresh snapshot for downstream consumers — most famously a search engine, which is why this chapter sits next to <a href="/learn/modern-system-design/distributed-search">Chapter 21</a>.</p>
        <p>Two properties make it unlike the other design problems. First, you do not control the servers you talk to, so failure, slowness and hostility are the common case. Second, "done" is not a state: the web changes continuously, so a crawler is a never-terminating scheduler, not a batch job.</p>

        <h3 class="lesson-subhead" id="wc-req">Requirements</h3>
        <table>
          <thead><tr><th></th><th>Target</th></tr></thead>
          <tbody>
            <tr><td><strong>Coverage</strong></td><td>Discover and fetch the useful public web — tens of billions of pages, not the infinite URL space</td></tr>
            <tr><td><strong>Freshness</strong></td><td>Hot pages (news, wikis) recrawled in minutes to hours; long-tail pages in weeks to months</td></tr>
            <tr><td><strong>Politeness</strong></td><td>Honour robots.txt and Crawl-delay; cap concurrent requests per host (typically 1); back off on errors</td></tr>
            <tr><td><strong>Throughput</strong></td><td>Say 10,000 pages/sec sustained, burst higher on new sites</td></tr>
            <tr><td><strong>Correctness</strong></td><td>Canonicalise URLs; detect traps (calendars, faceted nav)</td></tr>
            <tr><td><strong>Robustness</strong></td><td>Survive hostile hosts, infinite spaces, malformed HTML, dying workers</td></tr>
            <tr><td><strong>Out of scope</strong></td><td>A full headless-browser farm unless asked</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="wc-est">Estimation</h3>
        <pre><code>CORPUS
  useful public web ~ 50 billion pages (order-of-magnitude)
  average HTML page ~ 100 KB fetched, ~10 KB stored after extract
  50B x 10 KB = 500 TB of extracted content
  50B URLs x ~100 B per frontier record = 5 TB for the URL set

THROUGHPUT
  10,000 pages/sec x 86,400 ≈ 860 million pages/day
  50B / 860M ≈ 58 days for a full pass
  -> recrawl of the whole web is monthly; hot pages must be a
     priority queue on top of that, not the same loop

FETCH BANDWIDTH
  10,000 pages/sec x 100 KB = 1 GB/sec = 8 Gbps inbound
  comfortably a small cluster; the limit is politeness, not NICs

DNS
  every new host needs a lookup; cache aggressively
  (a real bottleneck in naive crawlers — see Chapter 7)</code></pre>
        <p>The estimate tells you the crawler is not bandwidth-bound and not CPU-bound. It is <strong>scheduling-bound</strong>: the problem is choosing which URL to fetch next, under per-host caps, from a set measured in tens of billions. <a href="/learn/modern-system-design/back-of-envelope">Chapter 5</a> is how you notice that before drawing twenty fetchers.</p>

        <h3 class="lesson-subhead" id="wc-loop">The crawl loop</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Crawl loop from frontier through fetch, extract and enqueue">
            <defs>
              <marker id="ah-wc1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="36" width="120" height="48" rx="7" />
            <text class="dg-t" x="76" y="56" text-anchor="middle">frontier</text>
            <text class="dg-s" x="76" y="72" text-anchor="middle">next URL</text>
            <rect class="dg-box b" x="176" y="36" width="120" height="48" rx="7" />
            <text class="dg-t" x="236" y="56" text-anchor="middle">DNS</text>
            <text class="dg-s" x="236" y="72" text-anchor="middle">cached</text>
            <rect class="dg-box g" x="336" y="36" width="120" height="48" rx="7" />
            <text class="dg-t" x="396" y="56" text-anchor="middle">fetch</text>
            <text class="dg-s" x="396" y="72" text-anchor="middle">HTTP GET</text>
            <rect class="dg-box o" x="496" y="36" width="200" height="48" rx="7" />
            <text class="dg-t" x="596" y="56" text-anchor="middle">extract</text>
            <text class="dg-s" x="596" y="72" text-anchor="middle">links + text</text>
            <path class="dg-line violet" d="M136 60 H172" marker-end="url(#ah-wc1)" />
            <path class="dg-line violet" d="M296 60 H332" marker-end="url(#ah-wc1)" />
            <path class="dg-line violet" d="M456 60 H492" marker-end="url(#ah-wc1)" />
            <rect class="dg-band c" x="16" y="112" width="688" height="72" rx="10" />
            <text class="dg-s" x="32" y="136">Persist extracted content for the indexer. Enqueue new URLs after filters.</text>
            <text class="dg-s" x="32" y="154">Robots and seen-URL checks sit on the enqueue path, not after fetch waste.</text>
            <text class="dg-s" x="32" y="172">Failed fetch: backoff that host, do not spin the same URL.</text>
          </svg>
          <figcaption>Figure 1 — Fetch is one box. Scheduling, DNS, robots and enqueue policy are the rest of the system.</figcaption>
        </figure>
        <p>Workers are many; hosts are the unit of politeness. A worker that simply pops a global FIFO will stampede a popular domain. The loop is therefore: pick a host that is due, pick one URL from that host's queue, fetch, write, discover. Identity of the crawler matters: a shared NAT of a thousand workers looks like a botnet. Use a pool of well-known IP ranges and publish them. Rate-limit by IP and by host when CDNs front many sites on one VIP.</p>

        <h3 class="lesson-subhead" id="wc-frontier">The URL frontier</h3>
        <p>The frontier is the set of URLs you intend to fetch, with priority and next-eligible time. At 50 billion URLs it is not Redis. It is a sharded on-disk priority structure: typically one queue per host (or per IP), a heap of hosts ordered by "next fetch allowed", and a separate high-priority lane for news and sitemaps. Seeds (home pages, sitemaps, the open directory leftovers) start the graph; discovery keeps it alive.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Per-host queues selected by a heap of next-eligible hosts">
            <defs>
              <marker id="ah-wc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="28" width="200" height="52" rx="7" />
            <text class="dg-s" x="116" y="48" text-anchor="middle">host heap</text>
            <text class="dg-s" x="116" y="64" text-anchor="middle">next eligible time</text>
            <rect class="dg-box b" x="256" y="16" width="180" height="36" rx="6" />
            <text class="dg-s" x="346" y="38" text-anchor="middle">news.com Q</text>
            <rect class="dg-box b" x="256" y="60" width="180" height="36" rx="6" />
            <text class="dg-s" x="346" y="82" text-anchor="middle">wiki.org Q</text>
            <rect class="dg-box b" x="256" y="104" width="180" height="36" rx="6" />
            <text class="dg-s" x="346" y="126" text-anchor="middle">shop.example Q</text>
            <rect class="dg-box g" x="480" y="52" width="220" height="52" rx="7" />
            <text class="dg-s" x="590" y="82" text-anchor="middle">one URL to worker</text>
            <path class="dg-line blue" d="M216 54 H252" marker-end="url(#ah-wc2)" />
            <path class="dg-line blue" d="M436 78 H476" marker-end="url(#ah-wc2)" />
          </svg>
          <figcaption>Figure 2 — The frontier is a scheduler of hosts, each with its own URL queue. That is politeness made data.</figcaption>
        </figure>
        <p>Priorities: sitemap and high PageRank-ish scores first; random long-tail later. Without priority, a calendar trap starves the BBC. Persist the frontier; a restart must not forget 40 billion URLs or recrawl from seeds only. Shard the frontier by host hash so each crawler cell owns a slice of the web and does not need a global lock. Rebalancing hosts is the same consistent-hash problem as Chapter 10, with the extra constraint that you must not suddenly double the fetch rate on a host during a move.</p>

        <h3 class="lesson-subhead" id="wc-polite">Politeness, robots.txt and per-host caps</h3>
        <p>Politeness is the social and legal contract. Fetch robots.txt (and cache it for hours, refresh on 24 h or so), honour Disallow and Crawl-delay, identify yourself with a truthful User-Agent and a webmaster contact. Cap in-flight requests per host to one unless the site publishes a higher budget. Back off exponentially on 5xx and timeouts; treat 429 as a hard signal. Parallelism lives across hosts, not inside one. If Crawl-delay is 10 seconds, your 10,000 pages/s come from at least 100,000 concurrently eligible hosts, not from hammering the delay.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Many hosts in parallel, one request per host">
            <rect class="dg-box g" x="16" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="96" y="52" text-anchor="middle">host A: 1 GET</text>
            <rect class="dg-box g" x="192" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="272" y="52" text-anchor="middle">host B: 1 GET</text>
            <rect class="dg-box g" x="368" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="448" y="52" text-anchor="middle">host C: 1 GET</text>
            <rect class="dg-box g" x="544" y="24" width="160" height="48" rx="7" />
            <text class="dg-s" x="624" y="52" text-anchor="middle">host N: 1 GET</text>
            <rect class="dg-band r" x="16" y="92" width="688" height="48" rx="8" />
            <text class="dg-s" x="32" y="120">Wrong: 10,000 GETs to one shop. Right: 10,000 hosts, one GET each.</text>
          </svg>
          <figcaption>Figure 3 — Aggregate throughput with per-host serialisation. That sentence is the interview.</figcaption>
        </figure>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="robots.txt cached then applied before fetch">
            <defs>
              <marker id="ah-wc3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="160" height="52" rx="7" />
            <text class="dg-s" x="96" y="70" text-anchor="middle">URL candidate</text>
            <rect class="dg-box b" x="220" y="40" width="200" height="52" rx="7" />
            <text class="dg-s" x="320" y="70" text-anchor="middle">robots cache</text>
            <rect class="dg-box r" x="464" y="16" width="236" height="44" rx="7" />
            <text class="dg-s" x="582" y="42" text-anchor="middle">disallow: drop</text>
            <rect class="dg-box g" x="464" y="72" width="236" height="44" rx="7" />
            <text class="dg-s" x="582" y="98" text-anchor="middle">allow: host queue</text>
            <path class="dg-line rose" d="M176 66 H216" marker-end="url(#ah-wc3)" />
            <path class="dg-line rose" d="M420 56 H460" marker-end="url(#ah-wc3)" />
            <path class="dg-line rose" d="M420 76 H460" marker-end="url(#ah-wc3)" />
          </svg>
          <figcaption>Figure 4 — Robots is a filter on enqueue. Fetching first and asking later is how you get banned.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>DNS is a crawl bottleneck.</strong> Every new host is a lookup. Cache in the crawler with a long TTL, still honour reasonably short TTLs for CDN hosts, and do not block the fetch pool on a recursive resolver. See <a href="/learn/modern-system-design/dns">Chapter 7</a>. A naive crawler will look CPU-idle and DNS-saturated.</div>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 132" role="img" aria-label="DNS cache in front of fetchers">
            <defs>
              <marker id="ah-wc4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="40" width="140" height="48" rx="7" />
            <text class="dg-s" x="86" y="68" text-anchor="middle">new host</text>
            <rect class="dg-box b" x="204" y="40" width="220" height="48" rx="7" />
            <text class="dg-s" x="314" y="68" text-anchor="middle">crawler DNS cache</text>
            <rect class="dg-box g" x="472" y="40" width="228" height="48" rx="7" />
            <text class="dg-s" x="586" y="68" text-anchor="middle">fetcher uses IP</text>
            <path class="dg-line cyan" d="M156 64 H200" marker-end="url(#ah-wc4)" />
            <path class="dg-line cyan" d="M424 64 H468" marker-end="url(#ah-wc4)" />
          </svg>
          <figcaption>Figure 5 — Without a DNS cache the resolver is the crawler's real frontend.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wc-dedup">Seen URLs and content fingerprinting</h3>
        <p>Canonicalise: lowercase host, strip default ports, sort query params you care about, drop tracking params, pick a trailing-slash policy, follow a bounded redirect chain. Store seen URLs in a bloom filter plus a key-value of fingerprints if you need deletes. Content hash (simhash / shingle) catches duplicate bodies under different URLs — mirror sites, print views, session ids in the path.</p>
        <p>Traps: calendars that generate infinite dates, faceted navigation that permutes filters, crawler traps that link deeper forever. Defences: max path depth, max URLs per host per day, detect exploding URL patterns, budget per site. If you do not name traps, you will spend the crawl on one wiki's revision URLs.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="URL traps exploding versus per-host budgets">
            <rect class="dg-band r" x="12" y="16" width="344" height="116" rx="10" />
            <text class="dg-h" x="26" y="36">TRAPS</text>
            <text class="dg-s" x="26" y="58">calendar next-day links</text>
            <text class="dg-s" x="26" y="76">facet permutation URLs</text>
            <text class="dg-s" x="26" y="94">session ids in the path</text>
            <text class="dg-s" x="26" y="112">infinite crawl spaces</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="116" rx="10" />
            <text class="dg-h" x="382" y="36">BRAKES</text>
            <text class="dg-s" x="382" y="58">depth cap, host daily budget</text>
            <text class="dg-s" x="382" y="76">drop tracking query keys</text>
            <text class="dg-s" x="382" y="94">simhash near-duplicates</text>
            <text class="dg-s" x="382" y="112">pattern explosion alarms</text>
          </svg>
          <figcaption>Figure 6 — Coverage is not "follow every href". It is a budgeted walk of a hostile graph.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wc-fresh">Freshness and recrawl scheduling</h3>
        <p>A full pass every 58 days is too slow for news and too fast for a brochure that last changed in 2019. Recrawl as a function of observed change rate: if the last three fetches were identical, back off (days → weeks). If etag/last-modified or content hash changed, pull in. Sitemaps and pubsubhubbub-like pings (or site-provided feeds) jump the queue. This is a control loop, not a FIFO. Conditional GET (If-None-Match) saves bandwidth; a 304 still counts against politeness, so it is not free, but it is cheaper than 200 + parse.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 148" role="img" aria-label="Hot pages recrawled often, cold pages rarely">
            <rect class="dg-box r" x="16" y="36" width="220" height="56" rx="7" />
            <text class="dg-s" x="126" y="58" text-anchor="middle">news: minutes</text>
            <text class="dg-s" x="126" y="74" text-anchor="middle">sitemap ping</text>
            <rect class="dg-box y" x="252" y="36" width="220" height="56" rx="7" />
            <text class="dg-s" x="362" y="58" text-anchor="middle">wiki: hours</text>
            <text class="dg-s" x="362" y="74" text-anchor="middle">change-rate</text>
            <rect class="dg-box g" x="488" y="36" width="212" height="56" rx="7" />
            <text class="dg-s" x="594" y="58" text-anchor="middle">tail: weeks</text>
            <text class="dg-s" x="594" y="74" text-anchor="middle">identical bodies</text>
            <text class="dg-s" x="16" y="120">Freshness SLO is per class, not one number for the web.</text>
          </svg>
          <figcaption>Figure 7 — Recrawl is a scheduler with a change model. Uniform polling wastes politeness budget.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wc-eval">Evaluation</h3>
        <p>This design crawls politely at tens of thousands of pages per second and feeds an indexer. It fails at JavaScript-rendered apps unless you add a costly render farm. It can still be trapped. It will be geographically biased if all fetchers sit in one region (sites geo-block). robots.txt is not a security boundary; it is a convention — you still need legal and allow-list policy for what you store. Duplicate detection is approximate. The frontier will be wrong after a bad deploy; you need snapshots of it. HTTP/2 multiplexing to one host can accidentally become many streams; politeness is about origin load, not TCP connections.</p>
        <p>We also did not design politeness across IP ranges that share a tiny origin, or crawler cloaking (sites that serve different HTML to bots). Mention both if the interviewer is from search.</p>
        <p>URL canonicalisation is a product of policy, not a library call. Should <code>http</code> and <code>https</code> collapse? Should <code>www</code> strip? Should a trailing slash match? Get this wrong and you double the frontier or miss the canonical page the indexer wanted. Write the rules down; test them on a million URLs from a crawl sample.</p>
        <p>Language and encoding: the web is not UTF-8. Detect charset, transcode, and do not let a Latin-1 page poison the parser into dropping links. Binary files (PDF, images) are a different fetch class: you may want them for a search corpus and not for HTML link discovery.</p>
        <p>Sitemaps are a gift. Parse XML sitemaps and sitemap indexes as first-class seeds, honour <code>lastmod</code> as a freshness hint (sites lie, but it is still a prior). Robots <code>Sitemap:</code> lines are how you find them without guessing <code>/sitemap.xml</code>.</p>
        <p>Per-host state you must store: robots body plus fetch time, crawl-delay, last fetch, consecutive errors, daily budget remaining, next eligible timestamp. That is a small KV beside the huge URL set. Losing it makes you impolite on restart as every host looks fresh.</p>
        <p>Security of the crawler itself: SSRF if you fetch user-submitted URLs in a different product; here the frontier is yours, but redirect chains can still land on link-local addresses. Block private ranges. Cap response size. Cap HTML parse time. Hostile pages are the common case.</p>
        <p>Downstream: extracted text and links go to the indexer via a queue, not a synchronous RPC into Elasticsearch. A slow index must not stall the polite scheduler; you would then under-crawl the web because your search cluster was compacting.</p>
        <p>Politics and robots: some sites allow Googlebot and deny others. A general crawler must not pretend to be Googlebot. That is both unethical and a fast way to be sued. Identify yourself and accept lower coverage.</p>
        <p>Crawl budget is a product decision: news versus archives versus academic PDF. Write it as a weighted lottery over host classes, not as "whatever the FIFO emits".</p>
        <p>Soft 404s (200 with "not found" body) poison the index. Fingerprint typical error templates per host after a few samples and drop them.</p>
        <p>Redirect loops and hop caps (e.g. 5) belong in the fetcher. Log the chain; it is how you debug canonical mistakes.</p>
        <p>Compression: send Accept-Encoding gzip. Bandwidth is not the bottleneck, but 3× HTML savings still pays for NICs and parse time.</p>
        <p>HTTP/1.1 keep-alive per host is polite and efficient. Opening a new TCP+TLS handshake for every URL on a site is how you look like an attack and burn CPU.</p>
        <p>IPv6 and IPv4 dual-stack hosts: prefer one family per host for the day so you do not double politeness windows.</p>
        <p>Robots.txt syntax is messy in the wild. Fail closed on unparsable robots for that host until you refresh, or you will crawl Disallow by accident.</p>
        <p>Host vs domain: subdomains are often separate politeness domains (cdn. vs www.) and sometimes the same origin. When in doubt, be more polite.</p>
        <p>Pay for a seed quality team or a ranking prior. Random walk from a bad seed spends months in spam farms.</p>
        <p>Spam farms and link exchanges exist to trap crawlers. Domain-level reputation, not only URL bloom filters, is how you leave.</p>
        <p>Revisit sitemaps more often than body pages. They are cheap and they are how freshness is advertised.</p>
        <p>Store the HTTP status, headers, and fetch duration with the URL. Freshness models need that, not only the body hash.</p>
        <p>Exactly-once enqueue is impossible; exactly-once fetch is impossible. Dedup on the seen set so at-least-once does not become a hammer.</p>
        <p>Worker crashes mid-fetch: the host lease must expire so another worker can continue. Stuck leases are silent under-crawl.</p>
        <p>Metrics: pages/s, robots denies, per-host error rate, frontier size, DNS latency, parse failures. If you only chart pages/s you will not see that you are banned.</p>
        <p>Legal takedowns and robots changes must flow into the frontier as deletes, not wait for natural recrawl. A queue of "stop fetching this host" is a product requirement.</p>
        <p>Crawl-time rendering of JS is 10–100× cost. Put it on a small elite queue (high-value domains), not on the default worker.</p>
        <p>Paywalled and login walls: detect and skip rather than filling the index with sign-in HTML. Content fingerprints help.</p>
        <p>Internationalised domain names need punycode in the frontier key or you will double-fetch.</p>
        <p>Fragment identifiers (#) are not server resources; drop them. Query-string policy is the opposite: sometimes they are the page.</p>
        <p>Per-IP politeness when many hosts share a /32 via virtual hosting: one queue key for the IP with a slightly higher cap, still not 10k.</p>
        <p>Frontier snapshots to object storage every hour let you rebuild after a bad sharding bug. Treat the frontier like a database, because it is one.</p>
        <p>Worker autoscaling on queue depth must not violate per-host caps. Scale hosts in play, not threads per host.</p>
        <p>Checksum the stored body. Bit rot in the crawl store is a silent relevance bug months later.</p>
        <p>When a host returns 451 or 403 for your UA, blacklist with a review date. Infinite retry is how you stay banned.</p>
        <p>The indexer is downstream: missing freshness there is not always a crawler bug. Measure time-to-index separately from time-to-fetch.</p>
        <p>IPv4 exhaust and shared hosting mean PTR and WHOIS are weak identity. Honour robots for the hostname the user sees.</p>
        <p>Keep humans in the loop for giant unknown domains that suddenly explode in URL count. That alarm is a trap detector.</p>
        <p>Respect <code>noindex</code> / <code>nofollow</code> as indexer policy even if the crawler fetched the page. Fetching and indexing are different contracts.</p>
        <p>Rate-limit your own DNS cache refreshes so a burst of new hosts cannot become a resolver incident (Chapter 7, again).</p>
        <p>Store robots.txt itself; disputes months later need evidence of what you obeyed.</p>
        <p>Prefer HEAD or conditional GET on recrawl of large binaries. HTML still needs GET for links.</p>
        <p>Shingle-simhash thresholds are a recall/precision knob. Too tight and mirrors survive; too loose and you drop distinct pages.</p>
        <p>The crawl is never finished. Operate it like a stateful service with a pager, not a cron that "runs the web".</p>
        <p>If asked to crawl only one site, the architecture shrinks (one host queue) but politeness does not. Say that; it shows you understood the hard part.</p>
        <p>A/B URL parameters that identify experiments should be stripped or you will crawl every variant as unique content.</p>
        <p>Honeypot links in HTML (hidden, nofollow) are there to catch you. Honour nofollow; it is also politeness.</p>
        <p>The evaluation of this design is simple: would a webmaster still allow you next month? If not, you did not design a crawler.</p>
        <p>Name frontier, politeness, robots, DNS cache, traps, and freshness in that order. Fetch last. That is the pass.</p>
        <p>A crawler that cannot recrawl is a one-shot wget. The web moved on during your full pass.</p>
        <p>Do not fetch what you will not store. Disk is cheaper than being banned, but not free.</p>
        <p>Politeness is the architecture. Everything else is a worker.</p>
        <p>Then go build the indexer. Chapter 21 is waiting for this crawl.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is a global FIFO of URLs a DDoS? (2) Where does robots.txt sit in the loop? (3) How big is the frontier and why is it not Redis? (4) How do you recrawl news without recrawling the brochure web at the same rate?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Web crawling, politeness, frontiers and recrawl scheduling are standard industry concepts; all explanations, diagrams, tables and exercises are our own.',
};
