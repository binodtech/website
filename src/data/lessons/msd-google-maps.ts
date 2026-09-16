/** Modern System Design — Chapter 27: Design Google Maps.
 *  Geospatial tiles, indexes and routing as precomputation plus search.
 */

export const msdGoogleMaps = {
  slug: 'google-maps',
  title: 'Design Google Maps',
  subtitle:
    'A map looks like a picture. It is actually three systems sharing a coordinate: a tile CDN, a geospatial index for places, and a routing engine whose expensive work is done offline. Live traffic is a patch on that precomputed graph, not a shortest-path query from scratch.',
  byline: 'Modern System Design · Chapter 27 · ~2h read · Advanced',
  interviewTip:
    'Do not start with Dijkstra. Start with tiles and the observation that almost every pixel the user sees is a static image from a CDN. Then introduce geohash or a quadtree for "places near me", and only then talk about routing as contracted hierarchies plus A*. If you try to compute a cross-city route on the request path with a raw road graph, the interviewer already knows the rest of the answer will not fit in the remaining time.',
  sections: [
    {
      id: 'problem',
      title: 'System Design: Google Maps',
      children: [
        { id: 'gm-what', title: 'What we are actually building' },
        { id: 'gm-three', title: 'Three systems that share a coordinate' },
        { id: 'gm-blocks', title: 'Which building blocks this needs' },
      ],
      html: `
        <p>A maps product has to show the world, find things in it, and tell you how to move through it. Those are not one storage problem. They are a rendering problem, a spatial-index problem, and a graph problem, and mixing them on a whiteboard is how candidates run out of time.</p>

        <h3 class="lesson-subhead" id="gm-what">What we are actually building</h3>
        <p>Pan and zoom a map at any latitude. Search for a place or an address. Show nearby businesses. Route from A to B with live traffic, and keep a blue dot reasonably honest while the device moves. Satellite imagery and Street View are the same serving pattern as tiles with larger blobs; we treat them as a capacity footnote, not a different architecture.</p>

        <h3 class="lesson-subhead" id="gm-three">Three systems that share a coordinate</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Tiles, places index and routing as three systems">
            <defs>
              <marker id="ah-gm1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="16" width="224" height="168" rx="10" />
            <text class="dg-h" x="26" y="36">TILES</text>
            <text class="dg-s" x="26" y="58">static images per zoom</text>
            <text class="dg-s" x="26" y="76">CDN is the product</text>
            <text class="dg-s" x="26" y="94">immutable per version</text>
            <text class="dg-s" x="26" y="112">client stitches a grid</text>
            <text class="dg-s" x="26" y="148">Optimise: hit ratio,</text>
            <text class="dg-s" x="26" y="164">bandwidth, zoom ladder</text>
            <rect class="dg-band g" x="248" y="16" width="224" height="168" rx="10" />
            <text class="dg-h" x="262" y="36">PLACES</text>
            <text class="dg-s" x="262" y="58">points in a geo index</text>
            <text class="dg-s" x="262" y="76">geohash or quadtree</text>
            <text class="dg-s" x="262" y="94">search + nearby</text>
            <text class="dg-s" x="262" y="112">metadata is small</text>
            <text class="dg-s" x="262" y="148">Optimise: range query</text>
            <text class="dg-s" x="262" y="164">latency, freshness</text>
            <rect class="dg-band o" x="484" y="16" width="224" height="168" rx="10" />
            <text class="dg-h" x="498" y="36">ROUTING</text>
            <text class="dg-s" x="498" y="58">road graph + costs</text>
            <text class="dg-s" x="498" y="76">precompute + A*</text>
            <text class="dg-s" x="498" y="94">traffic as a patch</text>
            <text class="dg-s" x="498" y="112">not Dijkstra online</text>
            <text class="dg-s" x="498" y="148">Optimise: prep time,</text>
            <text class="dg-s" x="498" y="164">query p99, updates</text>
          </svg>
          <figcaption>Figure 1 — Three products, one lat/lng. Design them as three request paths.</figcaption>
        </figure>
        <p>Location updates from phones are a fourth stream: they feed traffic estimation and the blue dot, and they must never sit on the tile or routing request path.</p>

        <h3 class="lesson-subhead" id="gm-blocks">Which building blocks this needs</h3>
        <table>
          <thead><tr><th>Requirement</th><th>Building block</th><th>Chapter</th></tr></thead>
          <tbody>
            <tr><td>Serve map images worldwide</td><td>CDN + blob store</td><td><a href="/learn/modern-system-design/cdn">11</a></td></tr>
            <tr><td>Find places in a bounding box</td><td>Geospatial index</td><td>this chapter</td></tr>
            <tr><td>Text search for names</td><td>Distributed search</td><td><a href="/learn/modern-system-design/distributed-search">21</a></td></tr>
            <tr><td>Road graph and place metadata</td><td>Database / graph store</td><td><a href="/learn/modern-system-design/databases">9</a></td></tr>
            <tr><td>Traffic probes from devices</td><td>Stream + windowed aggregate</td><td><a href="/learn/modern-system-design/messaging-queue">17</a></td></tr>
            <tr><td>Hot place pages</td><td>Cache</td><td><a href="/learn/modern-system-design/distributed-cache">16</a></td></tr>
          </tbody>
        </table>
        <div class="lesson-callout"><strong>Tiles are YouTube's watch path with smaller files.</strong> Once you have said "the client requests a grid of immutable PNGs from a CDN", you have reused <a href="/learn/modern-system-design/youtube">Chapter 25</a> and can spend the rest of the interview on indexes and routing, which is where this problem is actually original.</div>
      `,
    },
    {
      id: 'requirements',
      title: 'Requirements of Google Maps Design',
      children: [
        { id: 'gm-func', title: 'Functional requirements' },
        { id: 'gm-nonfunc', title: 'Non-functional requirements, as numbers' },
        { id: 'gm-est', title: 'Estimation' },
        { id: 'gm-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gm-func">Functional requirements</h3>
        <ol class="lesson-layers">
          <li><strong>Render a map</strong> at zooms from street to continent, with panning that feels local.</li>
          <li><strong>Geocode and reverse-geocode</strong> addresses and taps.</li>
          <li><strong>Nearby and place search.</strong></li>
          <li><strong>Route</strong> driving (and walking as a cheaper graph).</li>
          <li><strong>Live traffic</strong> as a colour overlay and as a routing cost.</li>
          <li><strong>Device location</strong> with a blue dot; not a surveillance product in this design.</li>
        </ol>

        <h3 class="lesson-subhead" id="gm-nonfunc">Non-functional requirements, as numbers</h3>
        <table>
          <thead><tr><th>Characteristic</th><th>Target</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Tile p99</td><td>&lt; 100 ms from edge</td><td>Pan/zoom is a video game, not a document</td></tr>
            <tr><td>Nearby p99</td><td>&lt; 150 ms</td><td>Typed search can be slower; the map cannot</td></tr>
            <tr><td>Route p99</td><td>&lt; 400 ms city, &lt; 1 s long-haul</td><td>Users wait; they do not wait seconds</td></tr>
            <tr><td>Location ingest</td><td>loss-tolerant</td><td>A missed ping is fine; a stalled tile is not</td></tr>
            <tr><td>Tile freshness</td><td>days to weeks</td><td>Roads change slowly; version the atlas</td></tr>
            <tr><td>Traffic freshness</td><td>1–5 minutes</td><td>Older than that is a lie at rush hour</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="gm-est">Estimation</h3>
        <pre><code>ASSUMPTIONS
  200M DAU, peak 20M concurrent map sessions
  each session fetches ~40 new tiles (pan/zoom)
  tile is 20 KB compressed (vector tiles can be smaller)

TILE EGRESS
  20M x 40 x 20 KB / 300 s bursty open  -> treat as
  200M DAU x 200 tiles/day x 20 KB
    = 800 TB/day  -> ~74 Gbps average, ~200 Gbps peak
  CONCLUSION: CDN, same argument as Chapter 5 / 11 / 25

PLACES
  200M businesses + POIs worldwide, ~500 B each with geo
    = 100 GB  -> fits in a partitioned geo index, not a crisis

ROUTING GRAPH
  ~50M road segments in a large country, ~200 B
    = 10 GB  -> the live graph for one region fits in RAM
  the trick is query time, not storage

LOCATION PINGS
  10M navigators x 1 ping / 4 s = 2.5M/sec
  payload 100 B  -> 250 MB/sec
  must be aggregated, not written row-by-row to SQL</code></pre>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Maps estimates forcing CDN, geo index and stream aggregation">
            <defs>
              <marker id="ah-gm2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="24" width="200" height="44" rx="7" />
            <text class="dg-s" x="116" y="50" text-anchor="middle">200 Gbps tiles</text>
            <rect class="dg-box g" x="260" y="24" width="200" height="44" rx="7" />
            <text class="dg-s" x="360" y="50" text-anchor="middle">100 GB places</text>
            <rect class="dg-box o" x="504" y="24" width="200" height="44" rx="7" />
            <text class="dg-s" x="604" y="50" text-anchor="middle">2.5M pings/sec</text>
            <rect class="dg-box y" x="16" y="86" width="688" height="40" rx="7" />
            <text class="dg-s" x="360" y="110" text-anchor="middle">CDN · in-memory geo shards · stream aggregate, never a ping table</text>
            <path class="dg-line green" d="M116 68 V82" marker-end="url(#ah-gm2)" />
            <path class="dg-line green" d="M360 68 V82" marker-end="url(#ah-gm2)" />
            <path class="dg-line green" d="M604 68 V82" marker-end="url(#ah-gm2)" />
          </svg>
          <figcaption>Figure 2 — Storage of places is easy. Bandwidth of tiles and the ping firehose are not.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gm-api">API sketch</h3>
        <pre><code>GET /tiles/{v}/{z}/{x}/{y}.{ext}     # CDN, cache forever per version
GET /geocode?q=                      # text -> candidates with lat/lng
GET /reverse?lat=&amp;lng=
GET /nearby?lat=&amp;lng=&amp;r=&amp;type=
POST /route  { origin, dest, mode, departAt? }
  -> { polyline, duration, durationInTraffic, steps[] }

POST /probes  { lat, lng, speed, heading, ts }   # batched, sampled
# never on the tile hostname</code></pre>
      `,
    },
    {
      id: 'design',
      title: 'Design of Google Maps',
      children: [
        { id: 'gm-tiles', title: 'Tiles and the zoom pyramid' },
        { id: 'gm-geo', title: 'Geohash, quadtrees and nearby' },
        { id: 'gm-route', title: 'Routing as precompute plus A*' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gm-tiles">Tiles and the zoom pyramid</h3>
        <p>The world is a pyramid of squares. Zoom 0 is one tile. Each zoom level multiplies the grid by four. The client, given a viewport and a zoom, computes the integer (z, x, y) keys and fetches those objects from a CDN. Vector tiles (protobufs of geometry) beat rasters for labels and style, but the serving path is identical: immutable object, versioned URL, long cache TTL.</p>
        <p>Render new atlases offline. Publish as version <code>v</code>. Old versions remain until edges drain. You never mutate a tile in place; that would destroy CDN hit ratios.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Client fetching a grid of tiles from a CDN">
            <defs>
              <marker id="ah-gm3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="40" width="130" height="50" rx="7" />
            <text class="dg-s" x="81" y="70" text-anchor="middle">map client</text>
            <rect class="dg-box g" x="186" y="40" width="150" height="50" rx="7" />
            <text class="dg-s" x="261" y="70" text-anchor="middle">CDN edge</text>
            <rect class="dg-box y" x="376" y="40" width="150" height="50" rx="7" />
            <text class="dg-s" x="451" y="70" text-anchor="middle">tile origin</text>
            <rect class="dg-box o" x="566" y="40" width="138" height="50" rx="7" />
            <text class="dg-s" x="635" y="70" text-anchor="middle">render farm</text>
            <path class="dg-line violet" d="M146 65 H182" marker-end="url(#ah-gm3)" />
            <path class="dg-line violet dash" d="M336 65 H372" marker-end="url(#ah-gm3)" />
            <path class="dg-line violet dash" d="M526 65 H562" marker-end="url(#ah-gm3)" />
            <text class="dg-s" x="16" y="122">Solid line is the user path. Dashed is a miss, which should be rare for inhabited zooms.</text>
            <text class="dg-s" x="16" y="138">The render farm is batch, not request-driven, except for obscure zooms.</text>
          </svg>
          <figcaption>Figure 3 — Tiles are a CDN product. The render farm is a publishing pipeline.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gm-geo">Geohash, quadtrees and nearby</h3>
        <p>Nearby search needs "all points in this radius" without scanning the planet. A geohash encodes lat/lng into a string whose common prefix implies a cell. Nearby is: enumerate covering cells, fetch those keys, filter by true haversine. A quadtree (or Google's S2) does the same with hierarchical squares on a sphere. Pick one and be able to explain prefix scan versus tree walk.</p>
        <table>
          <thead><tr><th></th><th>Geohash</th><th>Quadtree / S2</th></tr></thead>
          <tbody>
            <tr><td>Key</td><td>string prefix, good in KV/SQL</td><td>cell ids, great for covering polygons</td></tr>
            <tr><td>Failure</td><td>points near a cell edge need neighbours</td><td>more code; better polar behaviour with S2</td></tr>
            <tr><td>Use</td><td>simple nearby, sharding by prefix</td><td>regions, tiling, covering a route corridor</td></tr>
          </tbody>
        </table>
        <p>Shard the place index by geohash prefix so each region lives on a small set of machines. A query for a city hits one or two shards, not the fleet.</p>

        <h3 class="lesson-subhead" id="gm-route">Routing as precompute plus A*</h3>
        <p>Dijkstra on the full road graph is the wrong online algorithm. Production engines precompute shortcuts (contraction hierarchies, hub labels, or custom contraction) so a query is a bidirectional search on a much smaller overlay, with A* using Euclidean (or landmark) heuristics. Traffic is not a full recompute: it is a cost delta on a subset of edges, applied to the overlay or to a second-level search in the affected region.</p>
        <p>Long routes are stitched: coarse overlay between regions, detailed search at the ends. That is why a 400 km route can return in hundreds of milliseconds on a single box holding the regional graph in RAM.</p>
      `,
    },
    {
      id: 'challenges',
      title: "Challenges of Google Maps' Design",
      children: [
        { id: 'gm-traffic', title: 'Traffic without drowning in pings' },
        { id: 'gm-loc', title: 'The blue dot and location updates' },
        { id: 'gm-wrong', title: 'When the map is wrong' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gm-traffic">Traffic without drowning in pings</h3>
        <p>2.5 million pings per second cannot become 2.5 million database writes. Sample on device, batch, and aggregate in a stream processor into edge-level speed histograms every minute. Only those histograms are published to routing and to the colour overlay. Privacy follows from aggregation: you store "this segment is slow", not "this person was here".</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 130" role="img" aria-label="Probe aggregation into traffic histograms">
            <defs>
              <marker id="ah-gm4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="36" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="62" text-anchor="middle">device probes</text>
            <rect class="dg-box y" x="192" y="36" width="140" height="44" rx="7" />
            <text class="dg-s" x="262" y="62" text-anchor="middle">ingest stream</text>
            <rect class="dg-box p" x="368" y="36" width="150" height="44" rx="7" />
            <text class="dg-s" x="443" y="62" text-anchor="middle">1-min aggregate</text>
            <rect class="dg-box g" x="554" y="36" width="150" height="44" rx="7" />
            <text class="dg-s" x="629" y="62" text-anchor="middle">edge speeds</text>
            <path class="dg-line hot" d="M156 58 H188" marker-end="url(#ah-gm4)" />
            <path class="dg-line hot" d="M332 58 H364" marker-end="url(#ah-gm4)" />
            <path class="dg-line hot" d="M518 58 H550" marker-end="url(#ah-gm4)" />
            <text class="dg-s" x="16" y="112">If a ping is lost, traffic is slightly noisier. If this pipeline writes SQL per ping, you have designed a billing system by accident.</text>
          </svg>
          <figcaption>Figure 4 — Traffic is a streaming reduction, not a location history table.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gm-loc">The blue dot and location updates</h3>
        <p>The blue dot is mostly client-side: GPS, Wi-Fi, snap-to-road using a small local graph. The server needs location for traffic and for "share my trip", not to render the user's own marker. Snap-to-road on the server is an HMM over nearby edges; do it for navigation sessions, not for every open map.</p>
        <p>The ping math is the same shape as driver pings in the Uber chapter and the estimation chapter: pick an interval that keeps the map honest without melting ingest. Four seconds while navigating, thirty seconds while the app is backgrounded, never when the app is closed unless the user opted into a trip share.</p>

        <h3 class="lesson-subhead" id="gm-wrong">When the map is wrong</h3>
        <p>New roads, closed bridges, drifted POIs. Tiles and the routing graph must version together or you route people through buildings the tiles no longer show. User reports are a queue into the offline pipeline, not an online mutation. That is unsatisfying for a closed road this afternoon — so closures are a real-time overlay on the graph, the same channel as traffic, with a TTL.</p>
        <div class="lesson-callout"><strong>A closed road is traffic with certainty 1.0.</strong> Put it on the same overlay bus as speed histograms so routing sees it in minutes. Do not wait for the next atlas publish, which might be weekly.</div>
      `,
    },
    {
      id: 'detailed',
      title: 'Detailed Design of Google Maps',
      children: [
        { id: 'gm-search', title: 'Place search and geocoding' },
        { id: 'gm-stack', title: 'Putting the paths together' },
        { id: 'gm-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="gm-search">Place search and geocoding</h3>
        <p>Typed search is a prefix index (see typeahead later in the course) biased by the viewport geohash and the user's country. Geocoding interpolates house numbers along a street segment; it is not a giant string equality. Reverse geocoding is a nearby query plus a ranking that prefers addresses over POIs when the tap is on a road.</p>
        <p>Cache (query, cell, language) aggressively. "Coffee" in the same cell is the same result for millions of people.</p>

        <h3 class="lesson-subhead" id="gm-stack">Putting the paths together</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 210" role="img" aria-label="High level Google Maps architecture">
            <defs>
              <marker id="ah-gm5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="20" width="100" height="36" rx="6" />
            <text class="dg-s" x="66" y="42" text-anchor="middle">client</text>
            <rect class="dg-box g" x="140" y="20" width="120" height="36" rx="6" />
            <text class="dg-s" x="200" y="42" text-anchor="middle">CDN tiles</text>
            <rect class="dg-box b" x="284" y="20" width="120" height="36" rx="6" />
            <text class="dg-s" x="344" y="42" text-anchor="middle">API</text>
            <rect class="dg-box c" x="428" y="20" width="120" height="36" rx="6" />
            <text class="dg-s" x="488" y="42" text-anchor="middle">geo index</text>
            <rect class="dg-box o" x="572" y="20" width="132" height="36" rx="6" />
            <text class="dg-s" x="638" y="42" text-anchor="middle">router</text>
            <path class="dg-line blue" d="M116 38 H136" marker-end="url(#ah-gm5)" />
            <path class="dg-line blue" d="M260 38 H280" marker-end="url(#ah-gm5)" />
            <path class="dg-line blue" d="M404 38 H424" marker-end="url(#ah-gm5)" />
            <path class="dg-line blue" d="M548 38 H568" marker-end="url(#ah-gm5)" />
            <rect class="dg-box y" x="16" y="84" width="160" height="36" rx="6" />
            <text class="dg-s" x="96" y="106" text-anchor="middle">probe ingest</text>
            <rect class="dg-box p" x="200" y="84" width="160" height="36" rx="6" />
            <text class="dg-s" x="280" y="106" text-anchor="middle">traffic store</text>
            <rect class="dg-box l" x="384" y="84" width="160" height="36" rx="6" />
            <text class="dg-s" x="464" y="106" text-anchor="middle">search index</text>
            <rect class="dg-box r" x="568" y="84" width="136" height="36" rx="6" />
            <text class="dg-s" x="636" y="106" text-anchor="middle">atlas pub</text>
            <path class="dg-line blue dash" d="M96 120 V150 H638 V120" />
            <text class="dg-s" x="16" y="168">Traffic store is an input to the router, not to the CDN. Mixing them is how tiles start missing cache.</text>
            <text class="dg-s" x="16" y="184">Atlas publish versions tiles and the base graph together.</text>
            <text class="dg-s" x="16" y="200">Search is a sibling of the geo index, biased by cell.</text>
          </svg>
          <figcaption>Figure 5 — Keep the tile hostname boring. All intelligence lives off that path.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="gm-eval">Evaluation</h3>
        <p>We have not designed offline rendering at planetary scale, nor the ML that extracts buildings from imagery. Contraction hierarchies hate highly dynamic graphs; a city mid-marathon is a harder problem than we admitted. Geohash edge cases near the poles and the antimeridian will bite a naive implementation. Probe sampling is biased toward phones that have our app, which is not the full traffic of a city.</p>
        <p>The blue dot will still jump. Snap-to-road hides GPS noise until the user is in a dense urban canyon, where it snaps to the wrong street. That is a client model problem, not a shard-count problem.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why version tiles instead of mutating them? (2) How does a radius query work with geohash? (3) Why is Dijkstra the wrong online router? (4) Where do pings go, and where must they never go?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Map tiles, geospatial indexes and routing graphs are standard industry ideas; the explanations, diagrams, tables and exercises are our own.',
};
