/** Claude Code — Class 2: Installation, CLI & First Project. */

export const ccCliFirstProject = {
  slug: 'cli-first-project',
  title: 'Class 2 — Installation, CLI & Your First Project',
  subtitle:
    'Install and authenticate, learn the interactive session, slash commands, shortcuts, models and permissions, then run a first real task on a Todo API using explore → understand → plan → implement → test → verify — not “build me an app”.',
  byline: 'Claude Code Masterclass · Class 2 of 10 · ~1h 25m read · Beginner',
  interviewTip:
    'The most important habit in this class is not a flag. It is refusing the prompt “build this application” on an unfamiliar repo. Explore, understand, plan, then implement. That sequence is what makes Classes 4–10 work.',
  sections: [
    {
      id: 'start',
      title: 'Getting Started',
      children: [
        { id: 'start-req', title: 'Requirements' },
        { id: 'start-install', title: 'Installation' },
        { id: 'start-auth', title: 'Authentication' },
        { id: 'start-term', title: 'Terminal setup' },
        { id: 'start-dir', title: 'Project directory' },
        { id: 'start-run', title: 'Starting Claude Code' },
      ],
      html: `
        <p>Class 1 was about what Claude Code <em>is</em>. This class is about putting it in a real directory and using it without skipping the loop. Installation is short. The first project is where the course actually starts.</p>
        <p>Treat every command name and installer flag as version-aware. Claude Code ships quickly. Re-check the <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">official docs</a> if a flag does not match what you see. The workflow below is the durable part.</p>

        <h3 class="lesson-subhead" id="start-req">Requirements</h3>
        <ul class="lesson-layers">
          <li><strong>A terminal</strong> you already use for git and your language toolchain (zsh, bash, PowerShell, Windows Terminal).</li>
          <li><strong>Git</strong> installed. The agent will inspect history and you will review diffs with it.</li>
          <li><strong>A Claude account</strong> with access to Claude Code (subscription or API, depending on how Anthropic currently ships access).</li>
          <li><strong>A language toolchain</strong> for the project you will open — Node, Java, Python, whatever the repo actually builds with. The agent runs <em>your</em> tests, not a fake sandbox language.</li>
          <li><strong>A project you can break.</strong> A throwaway clone, not production on Friday afternoon.</li>
        </ul>

        <h3 class="lesson-subhead" id="start-install">Installation</h3>
        <p>Install from the current official installer for your OS. Typical shapes:</p>
        <pre><code># macOS / Linux — follow the current docs for the exact installer
# Windows — WSL is the usual path; native Windows support should be
# checked against the docs for your version.

claude --version</code></pre>
        <p>If <code>claude</code> is not on your PATH after install, the installer usually tells you which directory to add. Fix PATH before you debug anything else.</p>

        <h3 class="lesson-subhead" id="start-auth">Authentication</h3>
        <p>First launch walks you through login. Complete it in the browser, then return to the terminal. You should see a confirmation that you are authenticated, not a prompt loop.</p>
        <div class="lesson-callout lesson-warn"><strong>Do not paste API keys into chat logs, screenshots, or CLAUDE.md.</strong> Auth tokens live in the tool’s credential store. Class 10 covers secrets as a production rule; start the habit now.</p></div>

        <h3 class="lesson-subhead" id="start-term">Terminal setup</h3>
        <ul class="lesson-layers">
          <li>Use a terminal wide enough to read diffs. 120+ columns helps.</li>
          <li>Disable anything that intercepts <code>Ctrl+C</code> oddly; you will want a clean cancel.</li>
          <li>If you live in an IDE, keep a dedicated terminal pane for Claude Code so you can see tool calls without mixing them with your own shell history.</li>
        </ul>

        <h3 class="lesson-subhead" id="start-dir">Project directory</h3>
        <p>Claude Code’s working directory is the project. Always <code>cd</code> into the repo root before you start — the place that has <code>.git</code>, the lockfile, and the README. Starting from your home folder makes the agent wander.</p>
        <pre><code>cd ~/src/todo-app
git status          # clean working tree before an agent session is a gift
claude</code></pre>

        <h3 class="lesson-subhead" id="start-run">Starting Claude Code</h3>
        <p>That last command opens an <strong>interactive session</strong> in the current directory. You type an objective. The model gathers, plans, uses tools (with permission), and reports. Slash commands (next chapter) sit on top of that loop.</p>
        <div class="lesson-callout"><strong>Session 1 live demo shape.</strong> Installation → first interactive session → one small, verifiable task. Do not start with “build a SaaS”. Start with “what does this repository do?”</p></div>
      `,
    },
    {
      id: 'cli',
      title: 'Understanding the CLI',
      children: [
        { id: 'cli-session', title: 'Interactive session' },
        { id: 'cli-commands', title: 'Commands, help, exit' },
        { id: 'cli-slash', title: 'Slash commands and shortcuts' },
        { id: 'cli-model', title: 'Model selection (version-aware)' },
        { id: 'cli-perm', title: 'Permissions' },
        { id: 'cli-cwd', title: 'Working directory' },
      ],
      html: `
        <p>The CLI is a thin harness around the agent loop. Learn six things well: start, talk, slash, permissions, model, exit. Everything else is a variant.</p>

        <h3 class="lesson-subhead" id="cli-session">Interactive session</h3>
        <p>You type natural language. The agent replies with text <em>and</em> tool calls. You see it list files, grep, open files, propose edits, run commands. You approve or deny tool use depending on your permission mode.</p>
        <p>This is the Session 1 “first interactive session”. Watch the gather step. If it starts editing before reading, interrupt and tell it to explore first.</p>

        <h3 class="lesson-subhead" id="cli-commands">Commands, help, exit</h3>
        <pre><code>claude              # start in this directory
/help               # in-session help (names change; the idea does not)
/clear              # start a fresh context when the thread is polluted
exit                # leave the session (or the documented quit command)</code></pre>
        <p>Use help in the product, not a memorised cheat sheet from a blog post dated last quarter.</p>

        <h3 class="lesson-subhead" id="cli-slash">Slash commands and shortcuts</h3>
        <p>Slash commands are reusable prompts the session already understands, plus ones you will write in Class 6. Session 1 emphasises: slash commands, keyboard shortcuts, and permissions as the three controls you touch constantly.</p>
        <table>
          <thead><tr><th>Kind</th><th>What it is for</th><th>Examples you will meet</th></tr></thead>
          <tbody>
            <tr><td>Built-in slash</td><td>Session control</td><td><code>/help</code>, compact/clear, plan-related commands as documented</td></tr>
            <tr><td>Custom slash</td><td>Your team’s repeatable work</td><td><code>/review</code>, <code>/test</code>, <code>/debug</code>, <code>/triage-logs</code></td></tr>
            <tr><td>Shortcuts</td><td>Speed without leaving the keyboard</td><td>Accept, reject, interrupt — check current keybindings</td></tr>
          </tbody>
        </table>
        <p>Do not invent a library of custom commands yet. Use the built-ins until Class 6, when you will write <code>/review</code> and a real skill properly.</p>

        <h3 class="lesson-subhead" id="cli-model">Model selection (version-aware)</h3>
        <p>You can usually pick a model for the session. <strong>Do not hard-code model names into your memory as the course.</strong> Lineups change and deprecations happen. Pick: a strong default for implementation, a cheaper/faster one for mechanical refactors if offered, and re-read the docs when a name disappears.</p>
        <p>Conceptual rule that does not age: use enough model for planning and debugging; do not spend a frontier model on “rename this symbol in 40 files” if a smaller one plus tests will do.</p>

        <h3 class="lesson-subhead" id="cli-perm">Permissions</h3>
        <p>Permissions are the difference between a useful agent and a dangerous one. Typical modes (names vary): ask before each tool, allow a class of tools (read vs write vs shell), or a more permissive “you are in a sandbox I already trust”.</p>
        <figure class="lesson-figure">
          <svg viewBox="0 0 720 200" role="img" aria-label="Permission ladder from read-only exploration through edits to shell and network">
            <rect class="dg-band g" x="12" y="16" width="168" height="120" rx="10" />
            <text class="dg-h" x="26" y="38">READ</text>
            <text class="dg-s" x="26" y="60">list, search,</text>
            <text class="dg-s" x="26" y="76">open files</text>
            <text class="dg-s" x="26" y="100">Safe default</text>
            <text class="dg-s" x="26" y="116">for explore</text>
            <rect class="dg-band o" x="192" y="16" width="168" height="120" rx="10" />
            <text class="dg-h" x="206" y="38">WRITE</text>
            <text class="dg-s" x="206" y="60">edit / create</text>
            <text class="dg-s" x="206" y="76">project files</text>
            <text class="dg-s" x="206" y="100">Review the diff</text>
            <text class="dg-s" x="206" y="116">every time</text>
            <rect class="dg-band p" x="372" y="16" width="168" height="120" rx="10" />
            <text class="dg-h" x="386" y="38">SHELL</text>
            <text class="dg-s" x="386" y="60">tests, builds,</text>
            <text class="dg-s" x="386" y="76">git, scripts</text>
            <text class="dg-s" x="386" y="100">Allow the command</text>
            <text class="dg-s" x="386" y="116">you recognise</text>
            <rect class="dg-band r" x="552" y="16" width="156" height="120" rx="10" />
            <text class="dg-h" x="566" y="38">NETWORK</text>
            <text class="dg-s" x="566" y="60">MCP, browsers,</text>
            <text class="dg-s" x="566" y="76">package installs</text>
            <text class="dg-s" x="566" y="100">Least privilege</text>
            <text class="dg-s" x="566" y="116">Class 7 + 10</text>
            <text class="dg-s" x="16" y="164">Start a new repo on read + ask-to-write. Widen only when you trust the objective and have tests.</text>
            <text class="dg-s" x="16" y="182">Never auto-approve rm -rf, force-push, production deploys, or credential files.</text>
          </svg>
          <figcaption>Figure 1 — Permission is a ladder. Session 1 teaches this on day one for a reason.</figcaption>
        </figure>

        <h3 class="lesson-subhead" id="cli-cwd">Working directory</h3>
        <p>The agent sees the tree from the directory you launched in. Monorepos: start at the package you intend to change, or say so in the prompt. If you launched from the wrong folder, exit and restart — do not spend twenty minutes watching it search <code>node_modules</code> of a sibling app.</p>
      `,
    },
    {
      id: 'first',
      title: 'First Project: Todo REST API',
      children: [
        { id: 'first-shape', title: 'The repo you start with' },
        { id: 'first-understand', title: 'Ask it to understand, not build' },
        { id: 'first-delete', title: 'Add a DELETE Todo API' },
        { id: 'first-tests', title: 'Write tests, run them, fix failures' },
      ],
      html: `
        <p>Build something simple enough that you can see every file the agent touches, and real enough that tests exist. A Todo REST API is the right size.</p>

        <h3 class="lesson-subhead" id="first-shape">The repo you start with</h3>
        <pre><code>todo-app/
 ├── src/
 │    ├── routes/
 │    ├── services/
 │    └── repo/
 ├── tests/
 ├── README.md
 ├── package.json
 └── ...</code></pre>
        <p>If you do not have this repo, scaffold a tiny one yourself <em>without</em> the agent (GET/POST todos, in-memory or SQLite), or clone a teaching sample. The point of Class 2 is the loop on existing code, not generating a framework from a blank folder.</p>

        <h3 class="lesson-subhead" id="first-understand">Ask it to understand, not build</h3>
        <blockquote><p>Understand this project and explain its architecture. Do not change any files. Name the request flow for creating a todo, where persistence lives, and how tests are run.</p></blockquote>
        <p>You should get a grounded map: routes → services → repo, how to start the server, the test command. If the answer is generic (“a typical Express app”), it did not gather. Tell it to read the README and <code>package.json</code> scripts.</p>

        <h3 class="lesson-subhead" id="first-delete">Add a DELETE Todo API</h3>
        <blockquote><p>Add a DELETE /todos/:id endpoint that matches existing patterns. Update routing, service and persistence. Do not invent a new style. Then stop and show the plan before editing if you are in plan mode.</p></blockquote>
        <p>Watch which files it opens. A good session mirrors the GET/POST layers. A bad session dumps a new framework into <code>src/deleteTodo.ts</code> that nothing else uses.</p>

        <h3 class="lesson-subhead" id="first-tests">Write tests, run them, fix failures</h3>
        <blockquote><p>Write tests for the new DELETE API covering: missing id, unknown id, successful delete, and that a subsequent GET does not return the item. Run the test suite. Fix any failures. Report the command output, not a claim.</p></blockquote>
        <p class="lesson-flow">Explore → Understand → Plan → Implement → Test → Verify</p>
        <div class="lesson-callout"><strong>Main zest of Class 2.</strong> Do not teach yourself to immediately say “build this application.” Teach: <strong>Explore → Understand → Plan → Implement → Test → Verify</strong>. That workflow is more important than individual commands.</p></div>
      `,
    },
    {
      id: 'explore',
      title: 'Let Claude Explore',
      children: [
        { id: 'explore-prompts', title: 'Prompts that force gathering' },
        { id: 'explore-plan', title: 'Plan mode on an unfamiliar repo' },
        { id: 'explore-anti', title: 'What not to do yet' },
      ],
      html: `
        <p>Exploration is a skill you practise on purpose. These prompts (use them on the Todo app, then on any real repo):</p>

        <h3 class="lesson-subhead" id="explore-prompts">Prompts that force gathering</h3>
        <pre><code>"What does this repository do?"

"Where is authentication implemented?"

"Find all usages of UserService."

"Explain the request flow."

"Find potential bugs."</code></pre>
        <p>On the Todo app, “authentication” may correctly come back as “there isn’t any.” That is a successful investigation, not a failed one. Reward grounded negatives.</p>

        <h3 class="lesson-subhead" id="explore-plan">Plan mode on an unfamiliar repo</h3>
        <p>Session 1 homework starts here even if you finish implementation later: <strong>onboard to a new codebase in plan mode</strong>. Ask for one of:</p>
        <ul class="lesson-layers">
          <li>A roast of the architecture (honest, specific, file-backed).</li>
          <li>An architecture doc a new hire could use.</li>
          <li>An onboarding guide (how to run, test, where to change APIs).</li>
          <li>A test-gap analysis (what is covered vs what can silently break).</li>
        </ul>
        <p>Plan mode (or “do not edit, only investigate”) keeps the agent from “helping” by rewriting the repo while it is still lost.</p>

        <h3 class="lesson-subhead" id="explore-anti">What not to do yet</h3>
        <ul class="lesson-layers">
          <li>Do not install MCP servers. Class 7.</li>
          <li>Do not spawn subagents. Class 8.</li>
          <li>Do not write SKILL.md yet. You may <em>use</em> slash help; you author skills in Class 6 after you know the workflows worth encoding.</li>
          <li>Do not skip tests because “it’s a toy.” Toys are where you build the verification reflex.</li>
        </ul>
      `,
    },
    {
      id: 'homework',
      title: 'Exercises for Class 2',
      children: [
        { id: 'hw-todo', title: 'Required: the DELETE loop' },
        { id: 'hw-onboard', title: 'Session 1 assignment: onboard' },
      ],
      html: `
        <h3 class="lesson-subhead" id="hw-todo">Required: the DELETE loop</h3>
        <ol class="lesson-steps">
          <li>Start Claude Code in the Todo repo with a clean git tree.</li>
          <li>Ask it to explain architecture with no file changes.</li>
          <li>Add DELETE with tests; insist on a passing suite.</li>
          <li>Read the full diff yourself. Revert anything that does not match project style.</li>
        </ol>

        <h3 class="lesson-subhead" id="hw-onboard">Session 1 assignment: onboard</h3>
        <p>Clone a small open-source repo you have never seen. In plan/explore mode only, produce one artefact: roast, architecture doc, onboarding guide, or test-gap analysis. Save it. Class 3 will turn the same repo into a CLAUDE.md.</p>
        <div class="lesson-callout"><strong>Next up — Class 3.</strong> Prompting, context as finite working memory, CLAUDE.md, hierarchical instructions, auto memory / second brain, and the seven-part agent prompt. This is the highest-leverage class in the series.</p></div>
      `,
    },
  ],
  sourceNote:
    'CLI flags and installers change. Follow the <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener noreferrer">official Claude Code documentation</a>. The explore → understand → plan → implement → test → verify loop does not.',
};
