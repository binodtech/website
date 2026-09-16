/** Modern System Design — Chapter 34: Design WhatsApp.
 *  Persistent connections, per-device mailboxes, e2e as a routing constraint, groups and receipts.
 */

export const msdWhatsapp = {
  slug: 'whatsapp',
  title: 'Design WhatsApp',
  subtitle:
    'Chat is a long-lived connection per device, a durable mailbox per recipient, at-least-once delivery with client-side dedupe, group fan-out that must not write N times on the request path, and encryption that turns the server into a router of ciphertext it cannot read.',
  byline: 'Modern System Design · Chapter 34 · ~2h 15m read · Advanced',
  interviewTip:
    'Open with the connection, not the message table. WebSocket or a custom persistent TCP, sticky to a connection server, heartbeat, reconnect with last-received id. Then store-and-forward per device mailbox. Receipts are extra messages. Groups fan out to per-user queues. End-to-end encryption forbids search, ML on bodies, and server-side link unfurling of secrets — say that before anyone draws Elasticsearch. Multi-device means one mailbox per device, not one per user. Reconnect storms need jitter; media is an encrypted blob with a caption, never bytes on the chat path.',
  sections: [
    {
      id: 'wa-problem',
      title: 'System Design: WhatsApp',
      children: [
        { id: 'wa-what', title: 'What we are actually building' },
        { id: 'wa-not', title: 'Not HTTP polling, not email' },
        { id: 'wa-blocks', title: 'Building blocks' },
        { id: 'wa-e2e', title: 'Encryption as a design constraint' },
      ],
      html: `
        <p>Two people, or a group, exchange small messages in seconds, including when the other side is offline, on another device, or on a radio that drops every tunnel. Media is a blob with a caption. The product promise is: if the sender saw a first tick, the ciphertext is durable until every intended device acks it. That promise is a storage and connection problem, not a CRUD table with a polling loop.</p>

        <h3 class="lesson-subhead" id="wa-what">What we are actually building</h3>
        <p>1:1 chat, groups of hundreds (not millions — that is a broadcast channel and a different fan-out), delivery and read receipts, last-seen if the user allows it, multi-device sessions, voice notes and images. Voice and video calls sit on a separate media plane (an SFU); name it and leave it. Status updates are Instagram stories at smaller scale and a 24-hour TTL; they are not the interview.</p>
        <p>The unit of delivery is a device, not a user. A phone, a laptop, and a tablet each keep a session, each need a copy of ciphertext, each ack independently. Designing “one inbox per phone number” was true for early WhatsApp and is wrong the moment you ship linked devices.</p>
        <p>Messages are small: a few hundred bytes of ciphertext plus metadata (sender, chat id, timestamp, type, media pointer). Throughput is dominated by connections and receipts, not by payload size. Presence is a TTL key, not a query of last_seen in a relational table on every keystroke.</p>

        <h3 class="lesson-subhead" id="wa-not">Not HTTP polling, not email</h3>
        <p>Polling every two seconds from a billion devices is a DDoS of empty 304s. Email is store-and-forward with minutes of delay and no live receipts. Chat needs a persistent session: the connection server knows this device is online and can push. When the device is offline, messages land in a per-device mailbox on disk until the next connect.</p>
        <p>The connection is an optimisation for latency. The mailbox is the source of truth for undelivered ciphertext. If you invert that — treating RAM sessions as durable — a connection-server restart loses messages that the sender already ticked.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 176" role="img" aria-label="Sender through connection servers to an offline mailbox then the recipient">
            <defs>
              <marker id="ah-wa1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="88" height="44" rx="7" />
            <text class="dg-s" x="60" y="78" text-anchor="middle">sender</text>
            <rect class="dg-box b" x="140" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="200" y="78" text-anchor="middle">conn server</text>
            <rect class="dg-box p" x="300" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="370" y="78" text-anchor="middle">mailbox store</text>
            <rect class="dg-box b" x="480" y="52" width="120" height="44" rx="7" />
            <text class="dg-s" x="540" y="78" text-anchor="middle">conn server</text>
            <rect class="dg-box g" x="636" y="52" width="68" height="44" rx="7" />
            <text class="dg-s" x="670" y="78" text-anchor="middle">recv</text>
            <path class="dg-line violet" d="M104 74 H136" marker-end="url(#ah-wa1)" />
            <path class="dg-line violet" d="M260 74 H296" marker-end="url(#ah-wa1)" />
            <path class="dg-line violet" d="M440 74 H476" marker-end="url(#ah-wa1)" />
            <path class="dg-line violet" d="M600 74 H632" marker-end="url(#ah-wa1)" />
            <text class="dg-s" x="16" y="128">If recv is online, push immediately. The mailbox is still written for multi-device copies</text>
            <text class="dg-s" x="16" y="146">and for a crash of the connection tier. Ack from the device deletes or advances the cursor.</text>
          </svg>
          <figcaption>Figure 1 — The mailbox is durable undelivered ciphertext. The connection only shortens the path when a device is live.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-blocks">Building blocks</h3>
        <p>Connection tier with a sticky load balancer and long TCP. Mailbox as a <a href="/learn/modern-system-design/key-value-store">KV or queue per device</a>. <a href="/learn/modern-system-design/sequencer">Ids</a> for messages so reconnect can resume. Blob plus <a href="/learn/modern-system-design/cdn">CDN</a> for media as ciphertext objects. Presence as a TTL KV. <a href="/learn/modern-system-design/pub-sub">Pub-sub</a> only inside the datacentre to find which connection server owns a user — not Redis Pub/Sub to the phone.</p>
        <table>
          <thead><tr><th>Need</th><th>Block</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Online push</td><td>Sticky connection servers</td><td>A billion idle TCP sessions cannot live on the API fleet</td></tr>
            <tr><td>Offline durability</td><td>Mailbox, RF=3</td><td>Sender tick means “on disk”, not “in a socket buffer”</td></tr>
            <tr><td>Locate a session</td><td>In-DC pub-sub or session map</td><td>Which box holds this device’s socket</td></tr>
            <tr><td>Media</td><td>Blob + CDN</td><td>Ciphertext blobs; chat path carries a pointer</td></tr>
            <tr><td>Presence</td><td>TTL KV</td><td>Last-seen is a lease, not a join</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="wa-e2e">Encryption as a design constraint</h3>
        <p>The Signal protocol (or an equivalent) means the server sees destination, size, timestamp, and message type — not the body. That forbids server-side full-text search, server-side secret unfurling, and “we will train a model on messages.” On the whiteboard, say the server fans out ciphertext it cannot read. Group e2e is sender-keys or pairwise; either way the server still does not decrypt.</p>
        <p>Metadata remains. Graph of who talks to whom, group membership, and timing are still on your machines. E2e is not anonymity. Do not claim otherwise. Spam and abuse therefore run on metadata, reports, and client-side signals, not on body classifiers in the datacentre.</p>
        <div class="lesson-callout"><strong>Do not put Elasticsearch on message bodies.</strong> The moment you need search-in-chat, it is a client index or a user-held key that unwraps a copy. Server-side plaintext search is a different product with a different threat model.</div>
      `,
    },
    {
      id: 'wa-req',
      title: 'Requirements',
      children: [
        { id: 'wa-fn', title: 'Functional and non-functional' },
        { id: 'wa-est', title: 'Estimation' },
        { id: 'wa-api', title: 'Wire sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="wa-fn">Functional and non-functional</h3>
        <p>Send, receive, ack, delivery and read receipts, group send, media upload, multi-device sync, optional last-seen. Out of scope: the SFU for calls, payments, channels with millions of subscribers (broadcast), and business APIs beyond a mention.</p>
        <table>
          <thead><tr><th>NFR</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Online 1:1 latency</td><td>p99 &lt; 200 ms in-region once both sockets are warm</td></tr>
            <tr><td>Offline durability</td><td>Mailbox survives broker and disk loss (RF=3, fsync policy you can name)</td></tr>
            <tr><td>Connect QPS</td><td>Flaps; design reconnect storms with jitter</td></tr>
            <tr><td>Ordering</td><td>Per chat, per sender device; wall clocks lie</td></tr>
            <tr><td>Availability of send</td><td>Accept and persist even if the peer is gone</td></tr>
          </tbody>
        </table>
        <p>Ordering is not a global total order. Two devices in a group can send concurrently. The client sorts by (server timestamp, id) for display and still must tolerate a message that arrives after one that was sent later on another phone. Do not invent a single sequencer for all chats; sequence per chat or per sender.</p>

        <h3 class="lesson-subhead" id="wa-est">Estimation</h3>
        <pre><code>USERS AND CONNECTIONS
  1B registered, 300M concurrent devices online
  each TCP+TLS session ~10-50 KB of server RAM (buffers, TLS)
  300M x 20 KB ≈ 6 TB of connection state
  -&gt; thousands of connection servers, not a handful

MESSAGES
  50 messages/user/day including receipts (receipts dominate)
  1B x 50 = 50B/day ≈ 580k/s average, ~3M/s peak globally
  payload ~200 B ciphertext + metadata
  50B x 200 B = 10 TB/day of new ciphertext (before media)

MAILBOX
  assume 20% of messages wait offline for minutes
  working set of undelivered: hours of peak, not years
  long-term history is a different store (client-held, or optional cloud backup)

MEDIA
  0.2 media items/user/day, 200 KB average ciphertext blob
  1B x 0.2 x 200 KB = 40 TB/day into blob — not the chat path

RECONNECT STORM
  region outage of 10 minutes, 50M devices retry
  without jitter: 50M/s SYN — you fall over again
  with 0-30s jitter: ~1.7M/s — still ugly, but a capacity plan</code></pre>
        <p>The estimate should change the drawing. Chat servers are a connection-state problem measured in terabytes of RAM and file descriptors. Message bytes are modest next to media. Receipts may outnumber chat bodies. Design for reconnect, not only for the happy path of two online phones.</p>
        <p>File descriptors: 300M connections imply the fleet count is max-open-files and NIC interrupts, not just RAM. One box at 1M connections is a research number; tens or hundreds of thousands per box is the planning number once TLS, heartbeats, and mailbox pushes share the cores.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Where cost lives: connections, receipts, media blobs">
            <defs>
              <marker id="ah-wa2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="126" y="58" text-anchor="middle">CONNECTIONS</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">RAM, fds, TLS</text>
            <text class="dg-s" x="126" y="98" text-anchor="middle">the expensive part</text>
            <rect class="dg-box y" x="250" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="360" y="58" text-anchor="middle">RECEIPTS</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">more QPS than chat</text>
            <text class="dg-s" x="360" y="98" text-anchor="middle">still mailbox writes</text>
            <rect class="dg-box o" x="484" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="594" y="58" text-anchor="middle">MEDIA</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">blob + CDN</text>
            <text class="dg-s" x="594" y="98" text-anchor="middle">not the socket path</text>
          </svg>
          <figcaption>Figure 2 — Cost centres. If your boxes are all “message DB”, you missed connections, receipts, and blobs.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-api">Wire sketch</h3>
        <pre><code>CONNECT  wss://chat.example / custom TCP
  auth: token bound to device_id
  hello: { deviceId, lastAckedMsgId }

SEND
  { chatId, msgId, type, ciphertext, mediaRef? }
  -&gt; ack { msgId, serverTs }     # first tick: durable in mailbox(es)

PUSH (server -&gt; device)
  { msgId, chatId, from, ciphertext, serverTs }

ACK (device -&gt; server)
  { msgId }                      # advances mailbox cursor; may emit delivery receipt

RECEIPT
  { chatId, msgId, kind: delivered|read, fromDevice }

PRESENCE (optional, privacy-gated)
  heartbeat every 15-30s; last-seen = expiry of TTL key</code></pre>
        <p>HTTP REST for chat send is a fallback for hostile networks, not the primary path. The interesting contract is lastAckedMsgId on hello: the server replays mailbox from that cursor. Ids must be unique per sender device so retries do not duplicate after a timeout.</p>
      `,
    },
    {
      id: 'wa-path',
      title: 'Connections, mailboxes, groups and receipts',
      children: [
        { id: 'wa-conn', title: 'The connection tier' },
        { id: 'wa-mail', title: 'Store-and-forward mailboxes' },
        { id: 'wa-grp', title: 'Group fan-out' },
        { id: 'wa-rcpt', title: 'Receipts and multi-device' },
        { id: 'wa-storm', title: 'Reconnect storms' },
        { id: 'wa-media', title: 'Media as encrypted blobs' },
        { id: 'wa-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="wa-conn">The connection tier</h3>
        <p>Terminate TLS on a fleet whose only job is sockets: accept, heartbeat, route envelopes to the chat service, push envelopes back. Sticky by device_id at the load balancer (consistent hash or a session cookie) so reconnects land on a warm process when possible. Heartbeats every 15–30 seconds keep NAT mappings alive on mobile carriers.</p>
        <p>A session map (device_id → connection_server) lives in a fast KV. On send, if the recipient is mapped and the socket is live, enqueue a push. Always write the mailbox first or in the same pipeline you can defend: a push that races ahead of durability is how ticks lie.</p>
        <p>Do not run business logic in the connection process beyond routing. A memory leak or a slow JSON parse on that box stalls hundreds of thousands of idle chats. Keep the hot path: decrypt TLS, frame, authenticate, enqueue.</p>
        <p>Mobile radios idle NAT mappings in 30–60 seconds on some carriers. Heartbeats are not vanity metrics; they are how the socket stays a socket. Too frequent and you pay radio energy and QPS; too rare and “online” is a lie. 15–30 seconds is the usual compromise, with a longer presence TTL than the heartbeat so a single missed ping does not flip last-seen.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 170" role="img" aria-label="Sticky load balancer to connection servers and a session map">
            <defs>
              <marker id="ah-wa3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="60" width="100" height="44" rx="7" />
            <text class="dg-s" x="66" y="86" text-anchor="middle">devices</text>
            <rect class="dg-box c" x="156" y="60" width="120" height="44" rx="7" />
            <text class="dg-s" x="216" y="86" text-anchor="middle">sticky LB</text>
            <rect class="dg-box b" x="316" y="28" width="160" height="108" rx="8" />
            <text class="dg-s" x="396" y="56" text-anchor="middle">conn fleet</text>
            <text class="dg-s" x="396" y="76" text-anchor="middle">long TCP</text>
            <text class="dg-s" x="396" y="96" text-anchor="middle">heartbeat</text>
            <text class="dg-s" x="396" y="116" text-anchor="middle">no chat SQL</text>
            <rect class="dg-box p" x="516" y="60" width="188" height="44" rx="7" />
            <text class="dg-s" x="610" y="86" text-anchor="middle">session map KV</text>
            <path class="dg-line blue" d="M116 82 H152" marker-end="url(#ah-wa3)" />
            <path class="dg-line blue" d="M276 82 H312" marker-end="url(#ah-wa3)" />
            <path class="dg-line blue" d="M476 82 H512" marker-end="url(#ah-wa3)" />
          </svg>
          <figcaption>Figure 3 — Connection servers are cattle with sticky routing. The session map answers “which box holds this socket?”</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-mail">Store-and-forward mailboxes</h3>
        <p>Each device has a mailbox: an ordered log of envelopes not yet acked. Kafka-shaped partitions, Cassandra wide rows, or a purpose-built queue all work if you can append, read from a cursor, and delete or compact after ack. Key by device_id. Replication factor 3. The sender’s first tick is “majority durable,” not “peer read it.”</p>
        <p>Delivery is at-least-once. The client dedupes on msgId. Exactly-once across mobile networks is a fantasy; you will retransmit after timeout. Tombstones or cursor advance on ack keep the mailbox bounded. A device that never reconnects needs a retention policy (days to weeks) and a product decision about “message expired.”</p>
        <p>History for the user interface is not the mailbox. The mailbox is undelivered. Conversation history lives on the device, optionally in an encrypted backup blob. Mixing “all messages ever” into the live queue is how you build an unbounded partition and a slow reconnect replay.</p>
        <p>Partition the mailbox store by device_id. Hot partitions are users who were offline during a group storm, not celebrities in the Twitter sense — a quiet phone in a 256-person group is 256 unread envelopes. Bound that with per-mailbox size and a “too many unread, open the app” product rule if you must.</p>

        <h3 class="lesson-subhead" id="wa-grp">Group fan-out</h3>
        <p>A group of 256 members is 256 mailboxes, not one chat row that every client polls. The sender writes once to a group service; fan-out is asynchronous: expand membership, encrypt per sender-keys already done on the client, write ciphertext copies (or a shared sender-key envelope plus per-member headers) into each mailbox. Do not do N durable writes on the HTTP/WebSocket request thread.</p>
        <p>Membership changes (add/remove) are their own messages. A new member does not receive history from the server if e2e forbids it — history is forwarded by devices or not at all. That is a product constraint you should state, not a bug in fan-out.</p>
        <p>Large groups (thousands) start to look like channels: fan-out-on-read, or a shared log consumers tail. WhatsApp-style groups stay in the hundreds so write-fan-out remains acceptable if it is async. Name the threshold the same way Twitter names celebrities.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 188" role="img" aria-label="Group send fans out asynchronously into per-device mailboxes">
            <defs>
              <marker id="ah-wa4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="72" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="96" text-anchor="middle">sender</text>
            <rect class="dg-box b" x="156" y="72" width="140" height="40" rx="7" />
            <text class="dg-s" x="226" y="96" text-anchor="middle">group service</text>
            <rect class="dg-box g" x="340" y="24" width="160" height="40" rx="7" />
            <text class="dg-s" x="420" y="48" text-anchor="middle">mailbox A</text>
            <rect class="dg-box g" x="340" y="72" width="160" height="40" rx="7" />
            <text class="dg-s" x="420" y="96" text-anchor="middle">mailbox B</text>
            <rect class="dg-box g" x="340" y="120" width="160" height="40" rx="7" />
            <text class="dg-s" x="420" y="144" text-anchor="middle">mailbox C</text>
            <rect class="dg-box frozen" x="540" y="72" width="164" height="40" rx="7" />
            <text class="dg-s" x="622" y="96" text-anchor="middle">async workers</text>
            <path class="dg-line green" d="M116 92 H152" marker-end="url(#ah-wa4)" />
            <path class="dg-line green" d="M296 92 H336" marker-end="url(#ah-wa4)" />
            <path class="dg-line green dash" d="M500 44 H536" marker-end="url(#ah-wa4)" />
            <path class="dg-line green dash" d="M500 92 H536" marker-end="url(#ah-wa4)" />
            <path class="dg-line green dash" d="M500 140 H536" marker-end="url(#ah-wa4)" />
          </svg>
          <figcaption>Figure 4 — Ack the sender after the group job is durable, not after N mailboxes. Workers expand membership.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-rcpt">Receipts and multi-device</h3>
        <p>Sent (server durable), delivered (recipient device acked the envelope), read (user opened the chat). Each is a message into other mailboxes. In a group, read receipts can explode: 256 members × 256 reads. Product usually aggregates or limits who sees who-read. Still model them as first-class envelopes so you do not special-case a second pipeline that loses durability.</p>
        <p>Multi-device: sending from a laptop must appear on the phone. Fan-out includes the sender’s other devices (a “copy to self” mailbox). Session setup (pairing) exchanges keys on the devices; the server still only sees ciphertext. If a device is revoked, stop writing its mailbox and invalidate its connection token.</p>
        <p>Presence and typing indicators are ephemeral. They should not hit the durable mailbox. A short-TTL pub-sub to the connection servers of participants is enough, and they should degrade silently when the cluster is hot — unlike chat bodies.</p>

        <h3 class="lesson-subhead" id="wa-storm">Reconnect storms</h3>
        <p>A load balancer restart, a bad TLS cert deploy, or a regional blip drops tens of millions of sockets at once. Clients retry immediately by default. That is a thundering herd of TCP and TLS handshakes, plus mailbox replay. The design is client jitter (random delay with a cap), exponential backoff, and server-side admission control that sheds hello if CPU or accept queues are saturated — returning a retry-after.</p>
        <p>Mailbox replay after a long outage is sequential per device. Bound the catch-up window and page envelopes so one reconnect does not read a week of backlog in one frame. Prefer lastAckedMsgId over “give me everything.”</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 156" role="img" aria-label="Reconnect without jitter versus with jitter over time">
            <defs>
              <marker id="ah-wa5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band r" x="12" y="16" width="344" height="124" rx="10" />
            <text class="dg-h" x="26" y="36">NO JITTER</text>
            <text class="dg-s" x="26" y="58">all devices retry at t=0</text>
            <text class="dg-s" x="26" y="76">TLS handshake spike</text>
            <text class="dg-s" x="26" y="94">second outage from load</text>
            <text class="dg-s" x="26" y="112">mailbox replay pile-up</text>
            <rect class="dg-band g" x="368" y="16" width="340" height="124" rx="10" />
            <text class="dg-h" x="382" y="36">JITTER + SHED</text>
            <text class="dg-s" x="382" y="58">uniform delay 0-30s</text>
            <text class="dg-s" x="382" y="76">retry-after on 503</text>
            <text class="dg-s" x="382" y="94">paged mailbox catch-up</text>
            <text class="dg-s" x="382" y="112">capacity plan holds</text>
          </svg>
          <figcaption>Figure 5 — The outage is not the only failure. The synchronized reconnect is the second failure if you skip jitter.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-media">Media as encrypted blobs</h3>
        <p>The client encrypts the image or voice note, uploads to a blob via a short-lived pre-signed URL, then sends a chat envelope that contains the blob id, size, thumbnail ciphertext, and keys wrapped for recipients (per Signal’s attachment pattern). The chat path never carries megabytes. CDN edges cache ciphertext; they cannot transcode what they cannot read. Transcode, if any, happens on the client before encrypt, or not at all.</p>
        <p>Expiry of media blobs is a lifecycle rule on the object store, coordinated with mailbox retention. A caption without a blob is a broken tick; a blob without an envelope is orphaned bytes and a bill. The upload must be resumable on flaky radios; the envelope is sent only after the blob is durable.</p>
        <p>Thumbnails are still ciphertext. The feed-style CDN cannot transcode WhatsApp attachments server-side without keys. If product wants a smaller preview, the client produces it before encrypting. That is the tax of e2e, and it is the correct tax.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Client encrypts media, uploads blob, then sends a pointer in chat">
            <defs>
              <marker id="ah-wa6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah cyan" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="78" text-anchor="middle">encrypt local</text>
            <rect class="dg-box o" x="196" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="266" y="78" text-anchor="middle">blob PUT</text>
            <rect class="dg-box b" x="376" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="446" y="78" text-anchor="middle">chat envelope</text>
            <rect class="dg-box g" x="556" y="52" width="148" height="44" rx="7" />
            <text class="dg-s" x="630" y="78" text-anchor="middle">mailboxes</text>
            <path class="dg-line cyan" d="M156 74 H192" marker-end="url(#ah-wa6)" />
            <path class="dg-line cyan" d="M336 74 H372" marker-end="url(#ah-wa6)" />
            <path class="dg-line cyan" d="M516 74 H552" marker-end="url(#ah-wa6)" />
          </svg>
          <figcaption>Figure 6 — Bytes never ride the chat socket. The envelope is a pointer plus wrapped keys; the blob is ciphertext.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="wa-eval">Evaluation</h3>
        <p>This design under-serves search, multi-device history without a backup, and very large groups. E2e makes server-side moderation weaker than metadata-only. Sticky connection servers complicate datacentre evacuations: you drain sockets, you do not instantly move them. Cross-region users still wait on the mailbox’s home region unless you replicate mailboxes, which is a consistency tax.</p>
        <p>Receipts at group scale will dominate QPS if you are naive. Typing indicators will drown the cluster if you persist them. A custom TCP protocol is operationally heavier than WebSockets; WebSockets on HTTP/2 intermediaries can be worse. Pick one and name the NAT timeout you designed heartbeats for.</p>
        <p>We also did not design the call plane, spam graphs, or business APIs. Those are real products sitting next to chat; stuffing them into the mailbox is how the interview goes off the rails.</p>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is the mailbox the source of truth rather than the live socket? (2) How does e2e change search and group history? (3) Why must group fan-out be asynchronous? (4) What happens, numerically, if 50 million devices reconnect with no jitter?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Persistent messaging, store-and-forward, and e2e routing constraints are standard industry ideas; the explanations, diagrams, estimates and exercises here are our own.',
};
