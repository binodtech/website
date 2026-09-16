/** Modern System Design — Chapter 38: Design a Payment System.
 *  Timeouts as unknown, idempotency, double-entry ledger, outbox, webhooks and reconciliation.
 */

export const msdPaymentSystem = {
  slug: 'payment-system',
  title: 'Design a Payment System',
  subtitle:
    'Payments are a ledger with a hostile network around it. Timeouts are unknown, not success or failure. Idempotency keys, a double-entry ledger as source of truth, an outbox to processors, webhooks, reconciliation, and chargebacks. Never approximate money.',
  byline: 'Modern System Design · Chapter 38 · ~2h read · Advanced',
  interviewTip:
    'If you say exactly-once without an idempotency key and a ledger, you have failed. Walk: client sends Idempotency-Key, you create a PaymentIntent, you insert ledger entries in one transaction, you talk to the processor with that key, you reconcile later. Money never lives only in a processor dashboard. Refunds are new entries, not deletes. A timeout after Stripe charged is unknown until you query. Chargebacks reverse through the ledger. Never use floats.',
  sections: [
    {
      id: 'pay-problem',
      title: 'System Design: A Payment System',
      children: [
        { id: 'pay-what', title: 'Actors and the state machine' },
        { id: 'pay-once', title: 'The timeout is unknown' },
        { id: 'pay-money', title: 'Never approximate money' },
      ],
      html: `
        <p>A customer pays, a merchant gets settled, a processor (Stripe, Adyen, a bank) sits in the middle, and your job is not to lose, double-charge, or “lose track” of money when any hop times out. This is <a href="/learn/modern-system-design/preliminary-concepts">Chapter 3</a>’s retry window with a regulator attached. The product is a ledger, not a wrapper around a SDK.</p>

        <h3 class="lesson-subhead" id="pay-what">Actors and the state machine</h3>
        <p>Payer, merchant, your service, processor, card networks. A PaymentIntent: created → authorized → captured (or voided) → settled, plus refunded as a sibling lifecycle. Never overwrite a row to undo. Append. The user-facing charge id is not the ledger; the ledger is not the processor’s id; you store both and map them.</p>
        <p>Authorization holds funds; capture takes them; void releases the hold. Some flows are one-shot capture. Settlement is when money actually moves on a later batch. Your UI “paid” is usually authorized or captured, not settled. Say which.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Client intent to ledger to processor with unknown timeout">
            <defs>
              <marker id="ah-pay1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-pay1b" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="52" width="100" height="40" rx="7" />
            <text class="dg-s" x="66" y="76" text-anchor="middle">client</text>
            <rect class="dg-box b" x="156" y="52" width="140" height="40" rx="7" />
            <text class="dg-s" x="226" y="76" text-anchor="middle">intent + ledger</text>
            <rect class="dg-box o" x="340" y="52" width="140" height="40" rx="7" />
            <text class="dg-s" x="410" y="76" text-anchor="middle">processor</text>
            <rect class="dg-box r" x="524" y="52" width="180" height="40" rx="7" />
            <text class="dg-s" x="614" y="76" text-anchor="middle">timeout=unknown</text>
            <path class="dg-line violet" d="M116 72 H152" marker-end="url(#ah-pay1)" />
            <path class="dg-line violet" d="M296 72 H336" marker-end="url(#ah-pay1)" />
            <path class="dg-line rose dash" d="M480 72 H520" marker-end="url(#ah-pay1b)" />
          </svg>
          <figcaption>Figure 1 — A timeout after the processor charged and before you saw 200 is the whole game. Query, do not retry blindly.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pay-once">The timeout is unknown</h3>
        <p>At-least-once retries without an idempotency key double-charge. At-most-once without a follow-up drops charges. The processor’s idempotency key (and yours, stored uniquely) makes a retry the same intent. If the client retries with a new key, that is a new payment — the UI must reuse the key for a given checkout attempt. Teach that as a contract.</p>
        <p>HTTP 200 is success. HTTP 4xx (except 429) is often a definite failure. Timeout, 502, 503, connection reset: unknown. The next step is retrieve-by-intent at the processor, not a second charge. A state of <code>unknown</code> on the intent is a first-class row, not a comment in Slack.</p>
        <p>Webhooks can arrive before your HTTP response returns. The state machine must ignore duplicates and illegal jumps (captured cannot go back to created). Last-write-wins on a status column will lie; use explicit transitions.</p>

        <h3 class="lesson-subhead" id="pay-money">Never approximate money</h3>
        <p>Integers in minor units (pence, cents) or a decimal type with a fixed scale. Never IEEE floats. Never sharded counters as the balance. Never “eventually consistent likes-style” increment for a wallet. <a href="/learn/modern-system-design/sharded-counters">Chapter 16</a> is for likes, not for GBP.</p>
        <p>FX: store the original amount and currency, the booked amount, the rate source, and the time. Rounding rules are part of the product. Do not convert on every read with a live rate unless you are quoting, not booking.</p>
        <div class="lesson-callout"><strong>Unknown is a state, not a retry policy.</strong> Retry only with the same idempotency key, or retrieve. A new key is a new charge, even if the user “only clicked twice.”</div>
      `,
    },
    {
      id: 'pay-req',
      title: 'Requirements, estimation and APIs',
      children: [
        { id: 'pay-fn', title: 'Functional and non-functional' },
        { id: 'pay-est', title: 'Estimation' },
        { id: 'pay-api', title: 'API sketch' },
      ],
      html: `
        <h3 class="lesson-subhead" id="pay-fn">Functional and non-functional</h3>
        <table>
          <thead><tr><th></th><th>Requirement</th></tr></thead>
          <tbody>
            <tr><td><strong>Functional</strong></td><td>Create intent, capture/void, refund, webhook ingest, payout view, chargeback case</td></tr>
            <tr><td><strong>Idempotency</strong></td><td>Client key unique per attempt; processor key on outbound calls</td></tr>
            <tr><td><strong>Durability</strong></td><td>Ledger lines fsynced in the same commit as the intent transition</td></tr>
            <tr><td><strong>Audit</strong></td><td>Append-only lines; no delete of money movement</td></tr>
            <tr><td><strong>Correctness</strong></td><td>Double-entry sums to zero; reconcilers catch processor drift</td></tr>
            <tr><td><strong>Latency</strong></td><td>Checkout ack after durable intent; processor call may be seconds</td></tr>
          </tbody>
        </table>
        <p>PCI: you do not want card PAN on your machines. Tokenisation via the processor’s client SDK is the default whiteboard answer. Your ledger holds tokens and amounts, not raw cards.</p>
        <p>Partial captures and incremental authorizations exist in the card networks. If you only model one capture equal to auth, say so. Marketplaces add a second hop (you owe the seller) which is still double-entry, now with a platform fee line.</p>

        <h3 class="lesson-subhead" id="pay-est">Estimation</h3>
        <pre><code>10M checkout attempts/day
  30% succeed  -&gt; 3M captures/day ≈ 35/s average, a few hundred/s peak
  each capture: a handful of ledger lines (customer, clearing, fees)

STORAGE
  3M x 5 lines x 200 B ≈ 3 GB/day of ledger
  5 years ≈ 5 TB  — a boring relational volume if you partition by time
  hot is recent unsettled intents, not history

WEBHOOKS
  several events per payment (auth, capture, settlement, dispute)
  same order of QPS as captures, bursty, at-least-once from the processor

RECONCILE
  nightly settlement file: millions of rows, batch job
  plus continuous retrieve of intents stuck in unknown &gt; T (minutes)

CHARGEBACKS
  low QPS, high operational cost
  each is a case with deadlines, not a counter</code></pre>
        <p>QPS is not the hard part. Duplicate charges and silent drift are the hard part. Capacity planning is for webhook bursts and reconcile windows, not for a Kafka-shaped ego.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Low QPS but high cost of being wrong">
            <defs>
              <marker id="ah-pay2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box g" x="16" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="126" y="58" text-anchor="middle">QPS</text>
            <text class="dg-s" x="126" y="80" text-anchor="middle">hundreds at peak</text>
            <text class="dg-s" x="126" y="98" text-anchor="middle">easy numerically</text>
            <rect class="dg-box y" x="250" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="360" y="58" text-anchor="middle">UNKNOWN</text>
            <text class="dg-s" x="360" y="80" text-anchor="middle">timeouts, 502s</text>
            <text class="dg-s" x="360" y="98" text-anchor="middle">must retrieve</text>
            <rect class="dg-box r" x="484" y="36" width="220" height="88" rx="8" />
            <text class="dg-t" x="594" y="58" text-anchor="middle">DRIFT</text>
            <text class="dg-s" x="594" y="80" text-anchor="middle">files vs ledger</text>
            <text class="dg-s" x="594" y="98" text-anchor="middle">tickets, not silence</text>
          </svg>
          <figcaption>Figure 2 — Throughput is modest. Wrongness is expensive. Design for unknown and for drift.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pay-api">API sketch</h3>
        <pre><code>POST /payments
  Idempotency-Key: {uuid}
  body: { amount, currency, methodToken, merchantId }
  -&gt; 201 { paymentId, state }

GET  /payments/{id}

POST /payments/{id}/capture   Idempotency-Key: ...
POST /payments/{id}/void      Idempotency-Key: ...
POST /payments/{id}/refund    Idempotency-Key: ...  { amount? }

POST /webhooks/processor
  verify signature, persist event_id uniquely, enqueue handler

# internal retrieve
GET processor /payment_intents/{processorId}   # when state=unknown</code></pre>
        <p>Clock: store event_time from the processor and received_at of your own. Reconcile on processor time for settlement files, on received_at for your SLO on unknown age. Mixing them produces phantom late webhooks.</p>
        <p>Idempotency keys need a retention window (Stripe-like 24 hours is a reasonable whiteboard default) and a payload hash: the same key with a different amount is a client bug and must 409, not silently return the first charge.</p>
      `,
    },
    {
      id: 'pay-ledger',
      title: 'Ledger, outbox, webhooks and chargebacks',
      children: [
        { id: 'pay-de', title: 'Double-entry and idempotent intents' },
        { id: 'pay-out', title: 'Outbox to the processor' },
        { id: 'pay-hook', title: 'Webhooks' },
        { id: 'pay-rec', title: 'Reconciliation' },
        { id: 'pay-cb', title: 'Chargebacks' },
        { id: 'pay-eval', title: 'Evaluation' },
      ],
      html: `
        <h3 class="lesson-subhead" id="pay-de">Double-entry and idempotent intents</h3>
        <p>Accounts: customer_payable, merchant_receivable, processor_clearing, fees, refunds, chargeback_reserve. Every mutation inserts two or more lines whose amounts sum to zero, in one database transaction, keyed by intent_id. Unique constraint on idempotency_key for the intent row. You cannot INCR a balance cell as source of truth.</p>
        <p>Balances are projections: SUM of lines for an account, maintained as a cached total only if you can rebuild from lines. The lines are the truth. Refunds insert reversing lines; they do not delete the capture.</p>
        <pre><code>BEGIN
  INSERT intent (id, idem_key, amount, currency, state=created)
    ON CONFLICT (idem_key) DO NOTHING / return existing
  INSERT ledger (account=processor_clearing, +amount, intent_id)
  INSERT ledger (account=customer,           -amount, intent_id)
  INSERT outbox (topic=processor_charge, payload, intent_id)
COMMIT</code></pre>
        <p>The ON CONFLICT path must return the original intent, not create a second movement. That is the entire client-retry story on your side.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 168" role="img" aria-label="Idempotent insert of intent, ledger lines and outbox in one commit">
            <defs>
              <marker id="ah-pay3" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box y" x="16" y="64" width="120" height="40" rx="7" />
            <text class="dg-s" x="76" y="88" text-anchor="middle">idem key</text>
            <rect class="dg-box b" x="176" y="36" width="200" height="96" rx="8" />
            <text class="dg-s" x="276" y="60" text-anchor="middle">one DB commit</text>
            <text class="dg-s" x="276" y="80" text-anchor="middle">intent + lines</text>
            <text class="dg-s" x="276" y="100" text-anchor="middle">outbox row</text>
            <rect class="dg-box o" x="416" y="64" width="140" height="40" rx="7" />
            <text class="dg-s" x="486" y="88" text-anchor="middle">relay</text>
            <rect class="dg-box p" x="596" y="64" width="108" height="40" rx="7" />
            <text class="dg-s" x="650" y="88" text-anchor="middle">PSP</text>
            <path class="dg-line blue" d="M136 84 H172" marker-end="url(#ah-pay3)" />
            <path class="dg-line blue" d="M376 84 H412" marker-end="url(#ah-pay3)" />
            <path class="dg-line blue" d="M556 84 H592" marker-end="url(#ah-pay3)" />
          </svg>
          <figcaption>Figure 3 — Ledger and outbox in the same commit as the intent. The processor call happens after commit, via relay.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pay-out">Outbox to the processor</h3>
        <p>The relay reads outbox rows and calls the processor with the same idempotency key. Responses update intent state with a legal transition. If the call times out, leave state unknown, keep the outbox row (or a retrieve row), and schedule retrieve. Do not emit a second outbox line with a new key.</p>
        <p>This is the pattern from <a href="/learn/modern-system-design/messaging-queue">queues</a> plus a transactional outbox: you do not charge inside the SQL transaction (two-phase commit with Stripe does not exist). You charge after, exactly once logically, via idempotency.</p>
        <p>Relay backoff: exponential with a cap, still the same key. Poison messages (4xx that will never succeed) move to a parked state with an alarm, not an infinite retry that looks like a card hammer.</p>

        <h3 class="lesson-subhead" id="pay-hook">Webhooks</h3>
        <p>The processor will POST events. Verify signatures. Insert event_id with a unique constraint; duplicates return 200 without re-applying. Handler transitions the intent and may insert more ledger lines (fees, settlement). Webhooks can be delayed or reordered; the machine must tolerate auth after you already retrieved capture, or capture without seeing auth.</p>
        <p>Returning 500 makes them retry — good if your handler crashed before persist, bad if you persist then crash before 200 and they retry (hence unique event_id). Never process the webhook by calling a non-idempotent processor API.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="HTTP response path and webhook path both updating the intent">
            <defs>
              <marker id="ah-pay4" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box o" x="16" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="86" y="78" text-anchor="middle">processor</text>
            <rect class="dg-box b" x="196" y="24" width="200" height="40" rx="7" />
            <text class="dg-s" x="296" y="48" text-anchor="middle">HTTP response</text>
            <rect class="dg-box p" x="196" y="84" width="200" height="40" rx="7" />
            <text class="dg-s" x="296" y="108" text-anchor="middle">webhook event</text>
            <rect class="dg-box g" x="436" y="52" width="268" height="44" rx="7" />
            <text class="dg-s" x="570" y="78" text-anchor="middle">same state machine</text>
            <path class="dg-line green" d="M156 44 H192" marker-end="url(#ah-pay4)" />
            <path class="dg-line green" d="M156 104 H192" marker-end="url(#ah-pay4)" />
            <path class="dg-line green" d="M396 74 H432" marker-end="url(#ah-pay4)" />
          </svg>
          <figcaption>Figure 4 — Two inbound paths, one state machine, unique event ids. Either path may win the race.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pay-rec">Reconciliation</h3>
        <p>Nightly (and continuously) pull processor settlement files, join to ledger by processor_id. Mismatches are tickets, not silent fixes. Unknown intents older than T get retrieved by API; if the processor has no record, you can fail them; if it has a charge, you capture state and the ledger. This job is the adult in the room. Without it you are guessing.</p>
        <p>Reconciliation is not a checksum theatre. Amount, currency, fees, and timestamps all drift. An exception queue with owners beats an automatic “force the ledger to match” script that hides theft or bugs.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 140" role="img" aria-label="Ledger compared to processor file producing an exception queue">
            <defs>
              <marker id="ah-pay5" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="16" y="48" width="180" height="44" rx="7" />
            <text class="dg-s" x="106" y="74" text-anchor="middle">our ledger</text>
            <rect class="dg-box o" x="236" y="48" width="180" height="44" rx="7" />
            <text class="dg-s" x="326" y="74" text-anchor="middle">PSP file</text>
            <rect class="dg-box y" x="456" y="48" width="100" height="44" rx="7" />
            <text class="dg-s" x="506" y="74" text-anchor="middle">join</text>
            <rect class="dg-box r" x="596" y="48" width="108" height="44" rx="7" />
            <text class="dg-s" x="650" y="74" text-anchor="middle">tickets</text>
            <path class="dg-line rose" d="M196 70 H232" marker-end="url(#ah-pay5)" />
            <path class="dg-line rose" d="M416 70 H452" marker-end="url(#ah-pay5)" />
            <path class="dg-line rose" d="M556 70 H592" marker-end="url(#ah-pay5)" />
          </svg>
          <figcaption>Figure 5 — Reconcile produces work items. Automatic silent repair is how you lose the audit trail.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="pay-cb">Chargebacks</h3>
        <p>A dispute is a new lifecycle: evidence due dates, provisional debit, win or lose. Ledger: move funds to a reserve or reverse the merchant receivable when the network takes the money. Do not pretend a chargeback is a refund the user initiated. It has different accounts and different notifications to the merchant.</p>
        <p>Idempotency still applies: the same dispute id from a webhook must not double-debit. Representment is another transition, not an edit of history.</p>
        <p>Deadlines are operational SLAs: evidence packs, merchant notification, and a calendar. The system should page a case owner, not only increment a metric. Losing a dispute because a webhook sat in a DLQ is a process failure you can design for (visibility + replay with the same event id).</p>
        <p>Partial refunds plus a later chargeback on the remainder are two stories on the same capture. The ledger must remain explainable line by line to a human in finance, which is why we forbade deleting history.</p>

        <h3 class="lesson-subhead" id="pay-eval">Evaluation</h3>
        <p>A single-region relational ledger is a bottleneck and a disaster-recovery story you must name (sync replica, PITR, not multi-master). Multi-currency and marketplace split-tender explode the account chart. Processors differ; abstracting them behind one state machine leaks at the edges (3DS, delayed captures, local payment methods).</p>
        <p>Outbox relays can stall and leave users staring at “processing.” You need SLOs on unknown age. Webhooks from a compromised endpoint are an attack; signature verify is not optional. This design does not replace a finance team’s sub-ledger for tax and payouts, and it is not a bank core.</p>
        <p>We also skipped SCA/3DS flows, stored credentials (merchant-initiated), and payout rails to merchant bank accounts — each is another state machine with the same timeout-is-unknown rule.</p>
        <p>Currency rounding in fees (2.9% + 20p) must be specified to the penny in the ledger, not computed in the UI with a different library. Golden tests on fee lines catch more money bugs than load tests ever will.</p>
        <table>
          <thead><tr><th>Failure</th><th>Wrong instinct</th><th>Correct move</th></tr></thead>
          <tbody>
            <tr><td>Timeout after charge</td><td>retry with new key</td><td>retrieve; same idempotency key</td></tr>
            <tr><td>Webhook before HTTP</td><td>overwrite status blindly</td><td>legal transitions + event_id unique</td></tr>
            <tr><td>Settlement mismatch</td><td>auto-fix the ledger</td><td>exception ticket, human + replay</td></tr>
            <tr><td>Double click pay</td><td>two intents</td><td>UI reuses Idempotency-Key</td></tr>
            <tr><td>Chargeback</td><td>delete the capture row</td><td>new lines, dispute lifecycle</td></tr>
            <tr><td>Floats in JS</td><td>0.1 + 0.2 money</td><td>integer minor units</td></tr>
          </tbody>
        </table>
        <p>Payout to merchants is often a second processor (bank file). The same unknown-timeout rule applies: you submitted a payout file, you do not know until the bank ack or the reconcile. Do not mark “paid out” on SMTP success of a file drop.</p>
        <p>Multi-tenant marketplaces need a platform account in the chart so you can prove you did not borrow seller funds. That is a legal design as much as a schema.</p>
        <p>Idempotency-Key collision across users must be impossible: scope the unique index by merchant_id or user_id, not globally, or two checkouts share a UUID and one of them steals the other’s intent.</p>
        <p>Replay of outbox after a dual-write bug is how you discover the processor key saved you. Practise that restore in staging with a real sandbox processor, not a mocked 200.</p>
        <p>Reporting to finance should export ledger lines, not UI totals. If the dashboard SUM disagrees with the lines, the dashboard is wrong. That sentence is the culture this chapter is trying to install.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 150" role="img" aria-label="Unknown intents retrieved on a timer into the same state machine">
            <defs>
              <marker id="ah-pay6" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah hot" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box r" x="16" y="52" width="160" height="44" rx="7" />
            <text class="dg-s" x="96" y="78" text-anchor="middle">state unknown</text>
            <rect class="dg-box y" x="216" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="286" y="78" text-anchor="middle">timer</text>
            <rect class="dg-box o" x="396" y="52" width="140" height="44" rx="7" />
            <text class="dg-s" x="466" y="78" text-anchor="middle">PSP GET</text>
            <rect class="dg-box g" x="576" y="52" width="128" height="44" rx="7" />
            <text class="dg-s" x="640" y="78" text-anchor="middle">ledger</text>
            <path class="dg-line hot" d="M176 74 H212" marker-end="url(#ah-pay6)" />
            <path class="dg-line hot" d="M356 74 H392" marker-end="url(#ah-pay6)" />
            <path class="dg-line hot" d="M536 74 H572" marker-end="url(#ah-pay6)" />
          </svg>
          <figcaption>Figure 6 — Unknown is not a waiting room without a clock. Retrieve until you can post a legal transition.</figcaption>
        </figure>
        <div class="lesson-callout"><strong>Chapter checkpoint.</strong> (1) Why is a processor timeout neither success nor failure? (2) What belongs in the same database transaction as the first ledger lines? (3) How do webhooks and HTTP responses race, and what uniqueness constraint saves you? (4) Why must chargebacks and refunds be new ledger lines rather than updates in place?</div>
      `,
    },
  ],
  sourceNote:
    'Original course written for BinodTech by Binod Suman. Idempotent payments, double-entry bookkeeping and reconciliation are standard industry practices; the explanations, diagrams, tables and exercises are our own.',
};
