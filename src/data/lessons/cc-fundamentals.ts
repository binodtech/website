/** Claude Code — Class 1: Fundamentals & Agentic Coding.
 *  What Claude Code is, the gather → act → verify loop, why agentic coding
 *  differs from autocomplete and chat, and the full capability surface.
 */

export const ccFundamentals = {
  slug: 'fundamentals',
  title: 'Class 1 — Claude Code Fundamentals & Agentic Coding',
  subtitle:
    'What Claude Code actually is, how its gather → act → verify loop works, why an agent is a different kind of tool from autocomplete or chat, and exactly what it can and cannot do inside your repository.',
  byline: 'Claude Code Masterclass · Class 1 of 10 · ~1h 15m read · Beginner',
  interviewTip:
    'The single most useful sentence in this whole course: Claude Code is not primarily a code generator, it is an agent that investigates, plans, executes and verifies software-engineering tasks. Everything that frustrates new users — vague results, wrong files, confident nonsense — traces back to treating it as a generator and skipping the investigate and verify halves of that loop.',
  sections: [
    {
      id: 'what',
      title: 'What is Claude Code?',
      children: [
        { id: 'what-is', title: 'The one-paragraph definition' },
        { id: 'what-vs-claude', title: 'Claude vs Claude Code' },
        { id: 'what-vs-tools', title: 'Where it sits next to Copilot, ChatGPT and Cursor' },
        { id: 'what-cli', title: 'Why a terminal tool, of all things' },
        { id: 'what-assistant-vs-agent', title: 'Assistant vs agent — the distinction that matters' },
      ],
      html: `
        <p>You have almost certainly used an AI coding tool by now. You typed a comment and watched a function appear, or pasted a stack trace into a chat window and got a plausible explanation back. Both are useful. Neither is what this course is about.</p>
        <p>Claude Code is a different category of tool, and the difference is not "a better model". It is that Claude Code can <em>act</em> in your environment: read your files, search your repository, edit code, run your test suite, read the failure output, and try again. That single capability — a feedback loop with your actual project rather than with your chat window — changes what you should ask it to do and how you should judge the result.</p>

        <h3 class="lesson-subhead" id="what-is">The one-paragraph definition</h3>
        <p>Claude Code is an agentic coding tool that runs in your terminal, inside a project directory. You give it an engineering objective in plain language. It gathers context by reading and searching the codebase, decides on a course of action, uses tools to carry it out — editing files, running shell commands, running tests, using git — and then verifies the outcome against evidence it collected itself, correcting course when the evidence disagrees with its plan.</p>
        <div class="lesson-callout"><strong>Read that definition again, slowly.</strong> Four verbs are doing all the work: <strong>gather</strong>, <strong>decide</strong>, <strong>act</strong>, <strong>verify</strong>. A code-completion tool only does the third. A chat assistant does the second and third but in a room with no windows — it cannot see your repository or run anything, so it cannot do the first or the fourth. Claude Code closes the loop, and a closed loop is the entire reason it can finish tasks that take more than one step.</p></div>

        <h3 class="lesson-subhead" id="what-vs-claude">Claude vs Claude Code</h3>
        <p>These get confused constantly, so let us be precise. <strong>Claude</strong> is the model — a large language model you talk to through a web app, a mobile app or an API. <strong>Claude Code</strong> is a program that wraps that model in a loop and gives it tools that touch your machine. The intelligence comes from the model; the usefulness comes from the harness around it.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 258" role="img" aria-label="Claude is the model, Claude Code is a harness that adds a loop, tools and your repository around the model">
            <defs>
              <marker id="ah-cc1" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah blue" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cc1g" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="14" width="336" height="150" rx="11" />
            <text class="dg-h" x="26" y="34">CLAUDE — THE MODEL</text>
            <rect class="dg-box b" x="60" y="48" width="106" height="36" rx="7" />
            <text class="dg-s" x="113" y="70" text-anchor="middle">you type</text>
            <rect class="dg-box p" x="196" y="48" width="106" height="36" rx="7" />
            <text class="dg-s" x="249" y="70" text-anchor="middle">model answers</text>
            <path class="dg-line blue" d="M166 66 H192" marker-end="url(#ah-cc1)" />
            <text class="dg-s" x="26" y="106">· sees only what you paste into the window</text>
            <text class="dg-s" x="26" y="124">· cannot open a file, run a test, or check itself</text>
            <text class="dg-s" x="26" y="142">· every step needs you to carry the result back</text>
            <text class="dg-s" x="26" y="158">Great for explaining, drafting, reasoning about design.</text>
            <rect class="dg-band g" x="372" y="14" width="336" height="150" rx="11" />
            <text class="dg-h" x="386" y="34">CLAUDE CODE — MODEL + HARNESS</text>
            <rect class="dg-box p" x="392" y="46" width="88" height="34" rx="7" />
            <text class="dg-s" x="436" y="67" text-anchor="middle">model</text>
            <rect class="dg-box g" x="500" y="46" width="88" height="34" rx="7" />
            <text class="dg-s" x="544" y="67" text-anchor="middle">tools</text>
            <rect class="dg-box o" x="608" y="46" width="88" height="34" rx="7" />
            <text class="dg-s" x="652" y="67" text-anchor="middle">your repo</text>
            <path class="dg-line green" d="M480 63 H496" marker-end="url(#ah-cc1g)" />
            <path class="dg-line green" d="M588 63 H604" marker-end="url(#ah-cc1g)" />
            <path class="dg-line green dash" d="M652 80 V92 H436 V84" marker-end="url(#ah-cc1g)" />
            <text class="dg-s" x="386" y="112">· reads, searches and edits files itself</text>
            <text class="dg-s" x="386" y="130">· runs commands and reads the output as evidence</text>
            <text class="dg-s" x="386" y="148">· loops until the objective is actually met</text>
            <text class="dg-s" x="386" y="158"> </text>
            <rect class="dg-box y" x="90" y="186" width="540" height="56" rx="9" />
            <text class="dg-t" x="360" y="208" text-anchor="middle">Same model. The dashed arrow on the right is the whole difference.</text>
            <text class="dg-s" x="360" y="228" text-anchor="middle">Evidence from your project flows back into the next decision, without you relaying it.</text>
          </svg>
          <figcaption>Figure 1 — Claude answers; Claude Code answers, acts, checks the result and answers again. The feedback arrow is what lets it finish multi-step work.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="what-vs-tools">Where it sits next to Copilot, ChatGPT and Cursor</h3>
        <p>None of these tools is strictly better than the others; they operate at different scopes. Knowing the scope tells you which one to reach for.</p>
        <table>
          <thead>
            <tr><th>Tool</th><th>Scope of one interaction</th><th>Sees your repo?</th><th>Can run things?</th><th>Best at</th></tr>
          </thead>
          <tbody>
            <tr><td>Copilot-style autocomplete</td><td>The next few lines</td><td>Nearby files</td><td>No</td><td>Typing faster in code you already understand</td></tr>
            <tr><td>ChatGPT / Claude web chat</td><td>One question</td><td>Only what you paste</td><td>No</td><td>Explaining concepts, drafting isolated code, design discussion</td></tr>
            <tr><td>Cursor and AI-native IDEs</td><td>A file or a change</td><td>Indexed project</td><td>Partly, with approval</td><td>Editing with your eyes on the diff, tight human-in-the-loop work</td></tr>
            <tr><td><strong>Claude Code</strong></td><td>A whole task</td><td>Yes, by reading and searching it</td><td>Yes — shell, tests, git</td><td>Multi-step tasks: investigate, change several files, run tests, iterate</td></tr>
          </tbody>
        </table>
        <p>In practice most engineers end up using two or three of these in a day, and the boundary is about task shape rather than loyalty. "Finish this line" is autocomplete. "Explain CRDTs to me" is chat. "Find why expired tokens are accepted, fix it, add a regression test and show me the diff" is Claude Code — because that sentence contains four steps and needs evidence from your test suite to be answerable at all.</p>

        <h3 class="lesson-subhead" id="what-cli">Why a terminal tool, of all things</h3>
        <p>A CLI feels like a step backwards until you notice what it buys. The terminal is already where your build, tests, linters, migrations, container tooling and git live. An agent that lives there inherits all of it without an integration for each one.</p>
        <ul class="lesson-layers">
          <li><strong>It composes.</strong> Anything you can run, the agent can run. No plugin needed for your bespoke <code>make verify</code> target.</li>
          <li><strong>It is the same everywhere.</strong> Your laptop, a remote dev box, a container, a CI runner. One tool, one mental model.</li>
          <li><strong>It is scriptable.</strong> Because it is a program with input and output, it can be driven non-interactively — which is what makes the CI workflows in Class 10 possible.</li>
          <li><strong>It is editor-agnostic.</strong> Keep IntelliJ, Vim, VS Code or Cursor. The agent works on the files; you review them wherever you like.</li>
        </ul>

        <h3 class="lesson-subhead" id="what-assistant-vs-agent">Assistant vs agent — the distinction that matters</h3>
        <p>An <strong>assistant</strong> responds. You hold the plan in your head, break the work into pieces, and ask for one piece at a time. You are the loop. An <strong>agent</strong> holds the objective, decides the next step itself, takes it, observes what happened, and continues until the objective is met or it gets stuck.</p>
        <div class="lesson-callout lesson-warn"><strong>Why this matters on day one.</strong> People who keep treating Claude Code as an assistant ask for one micro-step at a time and conclude it is "just Copilot in a terminal". People who treat it as an agent but skip verification let it run unchecked and get burned. The productive stance is in between: hand it a real objective with acceptance criteria, then insist on evidence. That stance is what Classes 3 through 5 turn into a concrete method.</p></div>
      `,
    },
    {
      id: 'loop',
      title: 'How Claude Code Works: Gather → Act → Verify',
      children: [
        { id: 'loop-shape', title: 'The loop, in one picture' },
        { id: 'loop-gather', title: 'Gather: context is earned, not assumed' },
        { id: 'loop-act', title: 'Act: tools, not text' },
        { id: 'loop-verify', title: 'Verify: the step everyone skips' },
        { id: 'loop-trace', title: 'A real trace, step by step' },
      ],
      html: `
        <p>Everything Claude Code does is one loop, repeated. If you internalise the loop you can predict its behaviour, diagnose its failures, and write prompts that steer it — which is far more durable knowledge than memorising commands.</p>

        <h3 class="lesson-subhead" id="loop-shape">The loop, in one picture</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 300" role="img" aria-label="The Claude Code agent loop: understand the task, gather context, plan, act with tools, observe results, verify, and either correct or report done">
            <defs>
              <marker id="ah-cc2" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah violet" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cc2r" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah rose" d="M0 0 L9 3.5 L0 7 z" /></marker>
              <marker id="ah-cc2g" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path class="dg-ah green" d="M0 0 L9 3.5 L0 7 z" /></marker>
            </defs>
            <rect class="dg-box b" x="20" y="26" width="128" height="40" rx="8" />
            <text class="dg-t" x="84" y="44" text-anchor="middle">1 · objective</text>
            <text class="dg-s" x="84" y="59" text-anchor="middle">what you asked for</text>
            <rect class="dg-box c" x="20" y="96" width="128" height="52" rx="8" />
            <text class="dg-t" x="84" y="116" text-anchor="middle">2 · GATHER</text>
            <text class="dg-s" x="84" y="131" text-anchor="middle">read · search · list</text>
            <text class="dg-s" x="84" y="144" text-anchor="middle">git log · docs</text>
            <rect class="dg-box p" x="20" y="178" width="128" height="52" rx="8" />
            <text class="dg-t" x="84" y="198" text-anchor="middle">3 · plan</text>
            <text class="dg-s" x="84" y="213" text-anchor="middle">steps, files to touch,</text>
            <text class="dg-s" x="84" y="226" text-anchor="middle">risks</text>
            <rect class="dg-box o" x="252" y="178" width="140" height="52" rx="8" />
            <text class="dg-t" x="322" y="198" text-anchor="middle">4 · ACT</text>
            <text class="dg-s" x="322" y="213" text-anchor="middle">edit files · run shell</text>
            <text class="dg-s" x="322" y="226" text-anchor="middle">tests · git</text>
            <rect class="dg-box y" x="252" y="96" width="140" height="52" rx="8" />
            <text class="dg-t" x="322" y="116" text-anchor="middle">5 · observe</text>
            <text class="dg-s" x="322" y="131" text-anchor="middle">exit codes, diffs,</text>
            <text class="dg-s" x="322" y="144" text-anchor="middle">failures, logs</text>
            <rect class="dg-box g" x="252" y="26" width="140" height="40" rx="8" />
            <text class="dg-t" x="322" y="44" text-anchor="middle">6 · VERIFY</text>
            <text class="dg-s" x="322" y="59" text-anchor="middle">did it actually work?</text>
            <rect class="dg-box r" x="470" y="96" width="132" height="52" rx="8" />
            <text class="dg-t" x="536" y="116" text-anchor="middle">correct</text>
            <text class="dg-s" x="536" y="131" text-anchor="middle">new evidence →</text>
            <text class="dg-s" x="536" y="144" text-anchor="middle">revise the plan</text>
            <rect class="dg-box g" x="470" y="26" width="132" height="40" rx="8" />
            <text class="dg-t" x="536" y="44" text-anchor="middle">report + hand back</text>
            <text class="dg-s" x="536" y="59" text-anchor="middle">with evidence</text>
            <path class="dg-line violet" d="M84 66 V92" marker-end="url(#ah-cc2)" />
            <path class="dg-line violet" d="M84 148 V174" marker-end="url(#ah-cc2)" />
            <path class="dg-line violet" d="M148 204 H248" marker-end="url(#ah-cc2)" />
            <path class="dg-line violet" d="M322 178 V152" marker-end="url(#ah-cc2)" />
            <path class="dg-line violet" d="M322 96 V70" marker-end="url(#ah-cc2)" />
            <path class="dg-line rose thick" d="M392 46 H436 V122 H466" marker-end="url(#ah-cc2r)" />
            <text class="dg-s" x="428" y="88">fails</text>
            <path class="dg-line green thick" d="M392 40 H466" marker-end="url(#ah-cc2g)" />
            <text class="dg-s" x="410" y="22">passes</text>
            <path class="dg-line rose dash" d="M536 148 V160 H84 V234" marker-end="url(#ah-cc2r)" />
            <text class="dg-s" x="300" y="174">correction re-enters at the plan, carrying what was learned</text>
            <text class="dg-s" x="470" y="200">The loop can run many times for one</text>
            <text class="dg-s" x="470" y="216">objective. Each pass is cheap; a wrong</text>
            <text class="dg-s" x="470" y="232">answer you never checked is not.</text>
            <text class="dg-s" x="20" y="256">Where things go wrong: a thin step 2 produces a confident plan about the wrong code, and a missing step 6 means nobody finds out.</text>
            <text class="dg-s" x="20" y="274">Your job as the human is mostly to enrich step 2 and to be uncompromising about step 6. The middle takes care of itself.</text>
          </svg>
          <figcaption>Figure 2 — The agent loop. Classes 3 to 5 are essentially a deep dive into steps 2, 3 and 6.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="loop-gather">Gather: context is earned, not assumed</h3>
        <p>Claude Code starts a session knowing nothing about your project. It does not have a magical index of your company's code. It finds things the way a new engineer would on their first day: by listing directories, grepping for names, opening the files that look relevant, reading the README and the tests, and sometimes reading git history to see how something came to be.</p>
        <div class="lesson-flow">objective → list files → grep for the symbol → open 3 candidates → read the test that covers it → read config → now the plan is grounded</div>
        <p>This is why <strong>grounded investigation</strong> is the phrase to remember. A claim the agent makes after reading your <code>AuthFilter.java</code> is worth something. The same claim produced from general knowledge of how JWT libraries usually work is worth very little — it may be about a library you are not even using. When you read the session output, notice which kind of claim you are being given.</p>
        <div class="lesson-callout"><strong>The practical consequence.</strong> Anything you can do to shorten the search — naming the module, pasting the failing test name, pointing at the file — makes the rest of the loop better, not just faster. Class 3 formalises this. Cheap habit to start now: instead of "fix the login bug", write "the failing test is <code>AuthFilterTest#rejectsExpiredToken</code> in the auth module".</p></div>

        <h3 class="lesson-subhead" id="loop-act">Act: tools, not text</h3>
        <p>When Claude Code changes something, it does not print a suggestion for you to copy. It calls a tool. Tools are the concrete verbs available to it — read a file, write a file, search, run a shell command, and so on. The model chooses which tool to call and with what arguments; the harness executes the call and feeds the real result back.</p>
        <p>Two consequences follow, and both matter more than they sound.</p>
        <ul class="lesson-layers">
          <li><strong>Its actions are inspectable.</strong> Every edit is a diff in your working tree, and every command is one you could have typed. There is no hidden state — <code>git diff</code> is the source of truth about what happened.</li>
          <li><strong>Its actions are governable.</strong> Because actions funnel through tools, the harness can ask for your approval, or refuse outright. That is the permission system, and it is the reason you can let an agent near a real repository at all.</li>
        </ul>

        <h3 class="lesson-subhead" id="loop-verify">Verify: the step everyone skips</h3>
        <p>Verification is the difference between an agent that helps and an agent that generates work for you. It means checking the objective against evidence produced by the system rather than by the model: the test suite passes, the build succeeds, the endpoint returns 200, the screenshot shows the button in the right place, the linter is clean.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 190" role="img" aria-label="Weak verification relies on the model asserting success, strong verification relies on evidence from the system such as tests, builds and screenshots">
            <rect class="dg-band r" x="12" y="14" width="336" height="112" rx="11" />
            <text class="dg-h" x="26" y="34">WEAK — MODEL ASSERTS SUCCESS</text>
            <text class="dg-s" x="26" y="56">“I have fixed the issue.”</text>
            <text class="dg-s" x="26" y="74">“This should now work correctly.”</text>
            <text class="dg-s" x="26" y="92">“The implementation is complete.”</text>
            <text class="dg-s" x="26" y="116">Zero information content. Ask what it ran.</text>
            <rect class="dg-band g" x="372" y="14" width="336" height="112" rx="11" />
            <text class="dg-h" x="386" y="34">STRONG — SYSTEM PRODUCES EVIDENCE</text>
            <text class="dg-s" x="386" y="56">“24 tests pass, including the new one; 0 failures.”</text>
            <text class="dg-s" x="386" y="74">“curl returns 401 for the expired token (was 200).”</text>
            <text class="dg-s" x="386" y="92">“Build clean, lint clean, diff touches 3 files.”</text>
            <text class="dg-s" x="386" y="116">Checkable by you in seconds.</text>
            <rect class="dg-box p" x="130" y="142" width="460" height="38" rx="9" />
            <text class="dg-t" x="360" y="166" text-anchor="middle">Make the objective end in a command whose output settles the question.</text>
          </svg>
          <figcaption>Figure 3 — Design your requests so that success is observable. "Add a DELETE endpoint" invites an assertion; "add a DELETE endpoint and show me the test run" invites evidence.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="loop-trace">A real trace, step by step</h3>
        <p>Here is the loop on an ordinary task, with the tool calls made visible. This is roughly what a session transcript looks like once you learn to read it.</p>
        <pre><code>you   → "GET /todos ignores the ?done= filter. Find out why, fix it,
         add a test, and run the suite."

gather  list src/                          → routes/, services/, repo/
        grep -rn "done"  src/              → 7 hits, 2 look relevant
        read src/routes/todos.js           → query parsed into req.query
        read src/services/todoService.js   → listTodos(filter) signature
        read src/repo/todoRepo.js          → SQL has no WHERE on done
        read tests/todos.test.js           → no test covers the filter

plan    the route reads ?done= but drops it before the service call;
        repo SQL never filters. Fix: thread the flag route → service →
        repo, add WHERE clause, add a test for done=true and done=false.

act     edit  src/routes/todos.js          (pass filter through)
        edit  src/services/todoService.js  (accept + forward filter)
        edit  src/repo/todoRepo.js         (conditional WHERE done = ?)
        edit  tests/todos.test.js          (two new cases)
        run   npm test

observe 1 failing: expected 2 todos, got 3 — SQLite stores done as 0/1,
        the test seeded booleans

correct edit  tests/todos.test.js          (seed 0/1)
        run   npm test                     → 26 passing, 0 failing

verify  run   git diff --stat              → 4 files changed
report  "Root cause: the filter was parsed but never forwarded past the
         route. Threaded it through service and repo, added a WHERE
         clause and two tests. 26 tests pass. Diff touches 4 files."</code></pre>
        <p>Notice three things. The plan arrived <em>after</em> reading five files, not before. The first test run failed and that failure was useful — it revealed a real detail about the storage layer. And the report ends in numbers you can check rather than a reassurance.</p>
      `,
    },
    {
      id: 'why',
      title: 'Why Agentic Coding Is Different',
      children: [
        { id: 'why-ladder', title: 'Four rungs of AI assistance' },
        { id: 'why-unit', title: 'The unit of work changes' },
        { id: 'why-cost', title: 'What it costs you in exchange' },
        { id: 'why-habits', title: 'The three habits that separate outcomes' },
      ],
      html: `
        <p>It is tempting to think of agentic coding as "autocomplete, but more". It is not a quantitative difference. The unit of work changes, the failure modes change, and your job changes. Getting clear on that now saves you a month of misuse.</p>

        <h3 class="lesson-subhead" id="why-ladder">Four rungs of AI assistance</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 268" role="img" aria-label="Four rungs of AI coding assistance from manual coding through autocomplete and chat to agentic coding, with what each one automates and what stays with the human">
            <text class="dg-h" x="16" y="20">RUNG · WHAT THE AI DOES · WHAT STAYS WITH YOU</text>
            <rect class="dg-box" x="16" y="30" width="688" height="46" rx="7" />
            <text class="dg-t" x="30" y="49">0 · Manual coding</text>
            <text class="dg-s" x="30" y="66">AI does nothing. You hold the objective, the plan, every keystroke and the verification. Total control, total effort.</text>
            <rect class="dg-box b" x="16" y="84" width="688" height="46" rx="7" />
            <text class="dg-t" x="30" y="103">1 · Autocomplete — “finish this line”</text>
            <text class="dg-s" x="30" y="120">AI predicts the next tokens in a file you are already in. You still hold the objective, the plan and all verification. Latency: milliseconds.</text>
            <rect class="dg-box c" x="16" y="138" width="688" height="46" rx="7" />
            <text class="dg-t" x="30" y="157">2 · Chat — “how do I do X?”</text>
            <text class="dg-s" x="30" y="174">AI reasons about a question you framed and pasted. You hold the objective, do the decomposition, apply the answer, and check it. Latency: seconds.</text>
            <rect class="dg-box o" x="16" y="192" width="688" height="46" rx="7" />
            <text class="dg-t" x="30" y="211">3 · Agentic — “achieve this outcome, here is how I will know it worked”</text>
            <text class="dg-s" x="30" y="228">AI gathers context, plans, edits many files, runs commands, reads failures and iterates. You hold the objective, the constraints and the final judgement. Latency: minutes.</text>
            <text class="dg-s" x="16" y="258">The ladder is about delegation, not intelligence. Each rung hands over one more part of the work — and one more part you now have to supervise rather than perform.</text>
          </svg>
          <figcaption>Figure 4 — Each rung moves more of the loop to the machine. Rung 3 is the first one where the machine can be wrong for several minutes without telling you.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="why-unit">The unit of work changes</h3>
        <p>On rungs 1 and 2, the unit is a line or a snippet, and you evaluate it as you type. On rung 3, the unit is a <strong>task</strong> — something with a beginning, several file changes, a test run and an end. This has a knock-on effect people underestimate: you now review <em>diffs and evidence</em> rather than watching code appear. Your skill shifts from writing to specifying and reviewing.</p>
        <table>
          <thead><tr><th></th><th>Autocomplete / chat</th><th>Agentic coding</th></tr></thead>
          <tbody>
            <tr><td>Unit of work</td><td>Line, snippet, answer</td><td>Task with acceptance criteria</td></tr>
            <tr><td>You provide</td><td>The exact next step</td><td>Objective, constraints, how success is measured</td></tr>
            <tr><td>You receive</td><td>Text to place yourself</td><td>Applied changes plus evidence</td></tr>
            <tr><td>You review</td><td>Each suggestion, instantly</td><td>A diff and a command output, afterwards</td></tr>
            <tr><td>Main failure mode</td><td>Slightly wrong code you notice at once</td><td>Confidently wrong work in the wrong place, unnoticed for a while</td></tr>
            <tr><td>Best lever</td><td>Typing faster</td><td>Better context and stricter verification</td></tr>
          </tbody>
        </table>

        <h3 class="lesson-subhead" id="why-cost">What it costs you in exchange</h3>
        <p>Honest accounting, because this course is not a sales pitch. Agentic coding buys you leverage on multi-step work and charges you in four currencies.</p>
        <ul class="lesson-layers">
          <li><strong>Review load.</strong> A twenty-file diff you did not write takes real attention to review. Ask for changes small enough that you will actually read them.</li>
          <li><strong>Blast radius.</strong> A tool that can run commands can run destructive commands. Permissions and sandboxing (Class 10) exist for exactly this.</li>
          <li><strong>Plausible wrongness.</strong> Fluent, confident output is harder to doubt than obviously broken output. Evidence is the antidote, and it is the only one.</li>
          <li><strong>Context discipline.</strong> The agent is only as good as what it knows about your project, and keeping that current is ongoing work — which is why CLAUDE.md gets an entire class.</li>
        </ul>

        <h3 class="lesson-subhead" id="why-habits">The three habits that separate outcomes</h3>
        <p>Across every team that adopts this well, the same three habits show up. None is technical.</p>
        <ol class="lesson-steps">
          <li><strong>Explore before you build.</strong> Spend the first prompts on understanding, not producing. "Explain how requests flow from the route to the database in this repo" before "add an endpoint". The plan gets dramatically better and it costs you two minutes.</li>
          <li><strong>State how you will know it worked.</strong> Put the acceptance criterion in the request: which test, which command, which output. This converts a vague task into a verifiable one and gives the agent a target to iterate against.</li>
          <li><strong>Keep the loop short at first.</strong> Prefer several small verified tasks over one heroic prompt. You can always widen the scope once you trust the pattern; recovering from a large unverified change is much more expensive.</li>
        </ol>
        <div class="lesson-callout"><strong>Main zest of this class.</strong> Claude Code is not primarily a code generator. It is an agent that can investigate, plan, execute and verify software-engineering tasks. Every later class is a way of getting more out of one of those four verbs.</p></div>
      `,
    },
    {
      id: 'caps',
      title: 'What Claude Code Can Actually Do',
      children: [
        { id: 'caps-tools', title: 'The capability surface' },
        { id: 'caps-permissions', title: 'Permissions: the dial between speed and safety' },
        { id: 'caps-limits', title: 'Honest limitations' },
        { id: 'caps-fit', title: 'Tasks it is great at, and tasks to keep' },
      ],
      html: `
        <p>Before the first install it is worth knowing the actual shape of the tool, because "AI that codes" is too vague to plan around. Here is the concrete surface.</p>

        <h3 class="lesson-subhead" id="caps-tools">The capability surface</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 240" role="img" aria-label="Claude Code capability groups: reading and searching code, editing files, running commands and tests, git operations, and extensions through skills, hooks, MCP and subagents">
            <rect class="dg-band c" x="12" y="14" width="224" height="104" rx="11" />
            <text class="dg-h" x="26" y="34">UNDERSTAND</text>
            <text class="dg-s" x="26" y="54">· read any file in the project</text>
            <text class="dg-s" x="26" y="71">· search by name, text, pattern</text>
            <text class="dg-s" x="26" y="88">· walk the directory tree</text>
            <text class="dg-s" x="26" y="105">· read git history and diffs</text>
            <rect class="dg-band o" x="248" y="14" width="224" height="104" rx="11" />
            <text class="dg-h" x="262" y="34">CHANGE</text>
            <text class="dg-s" x="262" y="54">· create and edit files</text>
            <text class="dg-s" x="262" y="71">· multi-file, coordinated edits</text>
            <text class="dg-s" x="262" y="88">· rename and move things</text>
            <text class="dg-s" x="262" y="105">· delete, with permission</text>
            <rect class="dg-band g" x="484" y="14" width="224" height="104" rx="11" />
            <text class="dg-h" x="498" y="34">EXECUTE + CHECK</text>
            <text class="dg-s" x="498" y="54">· run any shell command</text>
            <text class="dg-s" x="498" y="71">· run builds, tests, linters</text>
            <text class="dg-s" x="498" y="88">· read exit codes and output</text>
            <text class="dg-s" x="498" y="105">· git add, commit, branch, PR</text>
            <rect class="dg-band p" x="12" y="132" width="696" height="94" rx="11" />
            <text class="dg-h" x="26" y="152">EXTEND — THE SECOND HALF OF THIS COURSE</text>
            <rect class="dg-box p" x="26" y="162" width="152" height="34" rx="7" />
            <text class="dg-s" x="102" y="183" text-anchor="middle">commands + skills</text>
            <rect class="dg-box p" x="192" y="162" width="152" height="34" rx="7" />
            <text class="dg-s" x="268" y="183" text-anchor="middle">hooks</text>
            <rect class="dg-box p" x="358" y="162" width="152" height="34" rx="7" />
            <text class="dg-s" x="434" y="183" text-anchor="middle">MCP servers</text>
            <rect class="dg-box p" x="524" y="162" width="160" height="34" rx="7" />
            <text class="dg-s" x="604" y="183" text-anchor="middle">subagents</text>
            <text class="dg-s" x="26" y="216">Reusable workflows · enforceable rules · access to Figma, Slack, databases, browsers · parallel specialised work</text>
          </svg>
          <figcaption>Figure 5 — The top row is available the moment you install. The bottom row is what turns the tool into your team's engineering workflow, and it is where Classes 6 to 8 live.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="caps-permissions">Permissions: the dial between speed and safety</h3>
        <p>Every action that touches your machine passes through a permission check. The details belong to Class 2, but the mental model belongs here: you are choosing, per action type, between "ask me every time", "allow this kind of thing in this project", and "never".</p>
        <div class="lesson-flow">model wants to run a command → harness checks the rules → allowed? run it · needs approval? ask you · denied? tell the model no</div>
        <p>The dial is genuinely a trade-off. Approving every read of every file is exhausting and teaches you to click yes without reading, which is worse than automating it. Approving arbitrary commands unprompted in a repository with production credentials is reckless. The healthy configuration is usually: reads and searches flow freely, formatters and test runs flow freely, anything that writes outside the project or touches the network or git history asks first.</p>
        <div class="lesson-callout lesson-warn"><strong>One rule to carry into Class 2.</strong> Never grant blanket command approval in a directory you would be upset to lose. Start strict, loosen deliberately as you learn which commands recur, and keep the loosening scoped to the project rather than global.</p></div>

        <h3 class="lesson-subhead" id="caps-limits">Honest limitations</h3>
        <p>An agent is not magic, and knowing the edges makes you much faster at spotting a bad result.</p>
        <ul class="lesson-layers">
          <li><strong>Context is finite.</strong> It cannot hold your whole monorepo in mind at once. It works by selectively reading, which means it can miss the one file nobody mentioned. This constraint is so central that Class 3 is built around it.</li>
          <li><strong>It cannot read your intent.</strong> Unstated requirements — the convention everyone on the team knows, the module that must not change — will be violated unless they are written down. That is what CLAUDE.md is for.</li>
          <li><strong>It cannot verify what it cannot run.</strong> No test suite means no real verification; the agent will fall back on asserting success. If your project has no way to check itself, that is now a tooling gap worth fixing.</li>
          <li><strong>Confidence is not calibrated.</strong> A wrong root-cause analysis reads exactly like a right one. Only evidence distinguishes them.</li>
          <li><strong>It is version-sensitive.</strong> Features, flags and model names change fast. Treat concepts as durable and specific commands as perishable — check the official docs when a detail matters.</li>
        </ul>

        <h3 class="lesson-subhead" id="caps-fit">Tasks it is great at, and tasks to keep</h3>
        <table>
          <thead><tr><th>Hand to the agent</th><th>Why it fits</th></tr></thead>
          <tbody>
            <tr><td>"Explain how this unfamiliar repo is structured"</td><td>Pure gathering — many files, a summary at the end, cheap to check by spot-reading</td></tr>
            <tr><td>"Find every caller of this method and update them for the new signature"</td><td>Mechanical, wide, verifiable by compile and tests</td></tr>
            <tr><td>"This test is flaky — reproduce it and find the race"</td><td>Needs repeated runs and log reading, which is exactly the loop</td></tr>
            <tr><td>"Add a DELETE endpoint following the pattern of the existing ones"</td><td>Pattern in the repo to copy, tests to prove it</td></tr>
            <tr><td>"Write the missing tests for this module and report coverage"</td><td>Clear target, evidence built in</td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>Keep for yourself (for now)</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Deciding product requirements</td><td>There is no evidence in the repo that settles it; it needs judgement and stakeholders</td></tr>
            <tr><td>Irreversible operations on real data</td><td>Migrations and deletions deserve a human hand on the switch, always</td></tr>
            <tr><td>Novel architecture with no precedent in the codebase</td><td>Nothing to ground the plan in; use chat to think it through with the model, then hand over the implementation</td></tr>
            <tr><td>Security-critical cryptographic design</td><td>Plausible and correct look identical here, and the cost of wrong is unbounded</td></tr>
          </tbody>
        </table>
      `,
    },
    {
      id: 'journey',
      title: 'The Journey Ahead, and Your Homework',
      children: [
        { id: 'journey-map', title: 'Ten classes, one arc' },
        { id: 'journey-spine', title: 'The five ideas that recur in every class' },
        { id: 'journey-exercises', title: 'Exercises for Class 1' },
      ],
      html: `
        <p>This course is built as a progression rather than a feature tour. Each class hands the next one something it needs, so reading in order genuinely matters.</p>

        <h3 class="lesson-subhead" id="journey-map">Ten classes, one arc</h3>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 330" role="img" aria-label="The ten-class learning journey from Claude Code fundamentals through installation, context engineering, agentic coding, workflow, skills, MCP, subagents, a real project and production engineering">
            <defs>
              <marker id="ah-cc5" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path class="dg-ah violet" d="M0 0 L8 3 L0 6 z" /></marker>
            </defs>
            <rect class="dg-band b" x="12" y="12" width="696" height="76" rx="11" />
            <text class="dg-h" x="26" y="30">FOUNDATIONS — KNOW THE TOOL</text>
            <rect class="dg-box b" x="26" y="40" width="210" height="38" rx="7" />
            <text class="dg-s" x="131" y="57" text-anchor="middle">1 · Fundamentals</text>
            <text class="dg-s" x="131" y="71" text-anchor="middle">agent loop, capabilities</text>
            <rect class="dg-box b" x="250" y="40" width="210" height="38" rx="7" />
            <text class="dg-s" x="355" y="57" text-anchor="middle">2 · Install + CLI</text>
            <text class="dg-s" x="355" y="71" text-anchor="middle">first real project</text>
            <rect class="dg-box b" x="474" y="40" width="210" height="38" rx="7" />
            <text class="dg-s" x="579" y="57" text-anchor="middle">3 · Context + CLAUDE.md</text>
            <text class="dg-s" x="579" y="71" text-anchor="middle">the highest-leverage class</text>
            <rect class="dg-band o" x="12" y="98" width="696" height="76" rx="11" />
            <text class="dg-h" x="26" y="116">PRACTICE — WORK LIKE AN ENGINEER</text>
            <rect class="dg-box o" x="26" y="126" width="324" height="38" rx="7" />
            <text class="dg-s" x="188" y="143" text-anchor="middle">4 · Claude Code as a coding agent</text>
            <text class="dg-s" x="188" y="157" text-anchor="middle">explore · plan · debug · refactor</text>
            <rect class="dg-box o" x="364" y="126" width="320" height="38" rx="7" />
            <text class="dg-s" x="524" y="143" text-anchor="middle">5 · Advanced workflow</text>
            <text class="dg-s" x="524" y="157" text-anchor="middle">TDD · git · review · large changes</text>
            <rect class="dg-band p" x="12" y="184" width="696" height="76" rx="11" />
            <text class="dg-h" x="26" y="202">SCALE — EXTEND THE AGENT</text>
            <rect class="dg-box p" x="26" y="212" width="210" height="38" rx="7" />
            <text class="dg-s" x="131" y="229" text-anchor="middle">6 · Skills · commands · hooks</text>
            <text class="dg-s" x="131" y="243" text-anchor="middle">reuse and guardrails</text>
            <rect class="dg-box p" x="250" y="212" width="210" height="38" rx="7" />
            <text class="dg-s" x="355" y="229" text-anchor="middle">7 · MCP + external tools</text>
            <text class="dg-s" x="355" y="243" text-anchor="middle">your whole ecosystem</text>
            <rect class="dg-box p" x="474" y="212" width="210" height="38" rx="7" />
            <text class="dg-s" x="579" y="229" text-anchor="middle">8 · Subagents</text>
            <text class="dg-s" x="579" y="243" text-anchor="middle">parallel, specialised work</text>
            <rect class="dg-band g" x="12" y="270" width="696" height="52" rx="11" />
            <text class="dg-h" x="26" y="288">SHIP — PUT IT ALL TOGETHER</text>
            <rect class="dg-box g" x="26" y="296" width="324" height="20" rx="6" />
            <text class="dg-s" x="188" y="310" text-anchor="middle">9 · Real project, end to end, with automation</text>
            <rect class="dg-box g" x="364" y="296" width="320" height="20" rx="6" />
            <text class="dg-s" x="524" y="310" text-anchor="middle">10 · Production: guardrails, CI/CD, AI-native SDLC</text>
            <path class="dg-line violet" d="M360 88 V94" marker-end="url(#ah-cc5)" />
            <path class="dg-line violet" d="M360 174 V180" marker-end="url(#ah-cc5)" />
            <path class="dg-line violet" d="M360 260 V266" marker-end="url(#ah-cc5)" />
          </svg>
          <figcaption>Figure 6 — The arc: know the tool, work like an engineer, extend the agent, then ship. Class 3 is the one people skip and the one that pays the most.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="journey-spine">The five ideas that recur in every class</h3>
        <p>This is deliberately not a course of a hundred commands. Five ideas form the spine, and each class is an application of them.</p>
        <ul class="rm-grid">
          <li style="--rm:#0ea5e9"><span class="rm-k">Idea 1</span><span class="rm-n">Context engineering</span><span class="rm-d">Context beats cleverness. Give the agent the right information — architecture, conventions, the failing test, the constraint — and mediocre prompts produce good work. Withhold it and no prompt saves you.</span></li>
          <li style="--rm:#f97316"><span class="rm-k">Idea 2</span><span class="rm-n">The agentic workflow</span><span class="rm-d">Understand → plan → act → test → verify. The same five steps whether the task is a one-line fix or a new service. Skipping a step is the root cause of most bad sessions.</span></li>
          <li style="--rm:#8b5cf6"><span class="rm-k">Idea 3</span><span class="rm-n">Tool use</span><span class="rm-d">The agent is only as capable as the verbs available to it: your shell, your tests, git, a browser, MCP servers. Improving the tools improves every future session.</span></li>
          <li style="--rm:#22c55e"><span class="rm-k">Idea 4</span><span class="rm-n">Delegation</span><span class="rm-d">Subagents and parallel work help when work benefits from isolated context or genuine parallelism — and hurt otherwise. The skill is knowing which is which, not spawning agents.</span></li>
          <li style="--rm:#f43f5e"><span class="rm-k">Idea 5</span><span class="rm-n">Guardrails</span><span class="rm-d">Autonomy is only safe with permissions, tests, hooks, human approval and auditability around it. Guardrails are what make speed sustainable rather than a one-off stunt.</span></li>
        </ul>
        <div class="rm-goal">By the end of Class 10 you should be able to take an unfamiliar repository, onboard an agent to it with a CLAUDE.md, build a feature with tests through a verified loop, wrap your recurring workflows in skills and hooks, connect the systems you actually use through MCP, parallelise the parts worth parallelising, and run the whole thing with guardrails you would be comfortable defending in a code review.</div>

        <h3 class="lesson-subhead" id="journey-exercises">Exercises for Class 1</h3>
        <p>No installation yet — these are thinking exercises, and they make Class 2 land much harder. Write the answers down; the writing is the point.</p>
        <ol class="lesson-steps">
          <li><strong>Classify your last week.</strong> List ten things you did at work. Mark each as rung 0, 1, 2 or 3 from Figure 4. Which rung-3 tasks were you doing by hand because no agent was available?</li>
          <li><strong>Find your verification gap.</strong> For your main project, write down the exact command that proves it still works. If there is no such command, you have just found the highest-value thing to fix before Class 4 — an agent cannot verify what your project cannot check.</li>
          <li><strong>Write one real objective.</strong> Take a task you are actually avoiding and write it in the rung-3 style: the outcome, the constraints, the files or modules involved, and the command whose output will settle whether it worked. Keep it; you will run it in Class 2.</li>
          <li><strong>List your unwritten rules.</strong> Spend five minutes listing the conventions a new hire would get wrong on your codebase — naming, error handling, which module is off limits, how tests are structured. This list becomes your first CLAUDE.md in Class 3.</li>
          <li><strong>Predict the failure.</strong> Before you ever run it, write down what you expect the agent to get wrong on your repo and why. Compare after Class 4. Being right teaches you your project's shape; being wrong teaches you the tool's.</li>
        </ol>
        <div class="lesson-callout"><strong>Next up — Class 2.</strong> Installation, authentication, the interactive session, slash commands and shortcuts, model selection and the permission system, and then a first real task on a small Todo API using the explore → understand → plan → implement → test → verify workflow rather than "build me an app".</p></div>
      `,
    },
  ],
  sourceNote:
    'Concepts follow Anthropic\u2019s current guidance on agentic coding, context management and tool use in the <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">official Claude Code documentation</a>. Claude Code ships changes quickly \u2014 treat the ideas here as durable and any specific flag, command or model name as worth re-checking against the docs.',
};
